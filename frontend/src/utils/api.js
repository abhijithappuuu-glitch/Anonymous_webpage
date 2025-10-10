import axios from 'axios';

// Multiple possible backend URLs for production fallback
const POSSIBLE_BACKEND_URLS = [
  'https://anonymous-club-backend.onrender.com',
  'https://anonymous-webpage-api.onrender.com', 
  'https://anonymoussdmcet-backend.onrender.com',
  'https://anonymous-backend.onrender.com'
];

// Function to test backend connectivity
const findWorkingBackend = async () => {
  // First try environment variable
  if (import.meta.env.VITE_API_URL) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      if (response.ok) {
        return import.meta.env.VITE_API_URL;
      }
    } catch (error) {
      console.warn('Environment API URL failed:', import.meta.env.VITE_API_URL);
    }
  }

  // Try each possible backend URL
  for (const backendUrl of POSSIBLE_BACKEND_URLS) {
    try {
      const response = await fetch(`${backendUrl}/api/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(3000) // 3 second timeout per URL
      });
      if (response.ok) {
        console.log('✅ Found working backend:', backendUrl);
        return backendUrl;
      }
    } catch (error) {
      console.warn('Backend not available:', backendUrl);
    }
  }

  // Fallback to localhost for development
  return 'http://localhost:5000';
};

// Dynamic backend URL resolution
let BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Auto-detect working backend on first API call
let backendDetected = false;
const detectBackend = async () => {
  if (!backendDetected && import.meta.env.PROD) {
    backendDetected = true;
    try {
      BACKEND_URL = await findWorkingBackend();
    } catch (error) {
      console.error('Backend detection failed, enabling demo mode immediately');
      demoMode.activate();
    }
  }
};

const baseURL = `${BACKEND_URL}/api`.replace(/\/$/, '');

// Export the API base URL for direct fetch calls
export const API = `${BACKEND_URL}/api`;

const APIClient = axios.create({
  baseURL,
  timeout: 8000 // 8 second timeout - faster demo mode activation
});

// Intercept requests to detect backend
APIClient.interceptors.request.use(async (config) => {
  await detectBackend();
  // Update baseURL if backend was detected
  if (config.baseURL !== `${BACKEND_URL}/api`) {
    config.baseURL = `${BACKEND_URL}/api`;
  }
  return config;
});

// Response / error logging (dev only)
if (import.meta.env.DEV) {
  APIClient.interceptors.response.use(
    (res) => res,
    (err) => {
      // Standardize message so UI can display it
      const backendMessage = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg;
      if (backendMessage) {
        err.message = backendMessage;
      }
      
      // Special handling for network errors
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        err.message = 'Request timeout. Please check your connection and try again.';
      } else if (err.code === 'ERR_NETWORK' || !err.response) {
        err.message = 'Network connection failed. Please check your internet connection and try again.';
      }
      
      console.warn('[API ERROR]', {
        url: err.config?.url,
        method: err.config?.method,
        status: err.response?.status,
        data: err.response?.data,
        code: err.code,
        message: err.message
      });
      return Promise.reject(err);
    }
  );
}

// Demo mode simulation for when backend is unavailable
const demoMode = {
  enabled: false,
  
  simulateDelay: () => new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200)),
  
  mockResponses: {
    sendLoginOtp: { message: '🚀 DEMO MODE: OTP sent to your email. Use code: 123456' },
    sendRegisterOtp: { message: '🚀 DEMO MODE: Registration OTP sent. Use code: 123456' },
    verifyOtp: { 
      _id: 'demo-user-id',
      username: 'DemoUser',
      email: 'demo@anonymous.club',
      role: 'user',
      token: 'demo-jwt-token-' + Date.now()
    }
  },
  
  activate: () => {
    if (!demoMode.enabled) {
      console.log('🚀 DEMO MODE ACTIVATED: Backend unavailable, using demo authentication');
      console.log('📝 Use OTP code: 123456 for testing');
      demoMode.enabled = true;
    }
  }
};

// Quick backend health check for immediate demo mode activation
const quickHealthCheck = async () => {
  if (import.meta.env.DEV) return; // Skip in development
  
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 3000); // 3 second max wait
    
    const response = await fetch(`${BACKEND_URL}/api/health`, {
      method: 'GET',
      signal: controller.signal
    });
    
    if (!response.ok) {
      throw new Error('Backend unhealthy');
    }
  } catch (error) {
    console.log('🚀 Quick health check failed, activating demo mode');
    demoMode.activate();
  }
};

// Run quick health check immediately in production
if (import.meta.env.PROD) {
  quickHealthCheck();
}

export const authAPI = {
  register: async (data) => {
    if (demoMode.enabled) {
      await demoMode.simulateDelay();
      return { data: demoMode.mockResponses.verifyOtp };
    }
    return APIClient.post('/auth/register', data);
  },
  
  login: async (data) => {
    if (demoMode.enabled) {
      await demoMode.simulateDelay();
      return { data: demoMode.mockResponses.verifyOtp };
    }
    return APIClient.post('/auth/login', data);
  },
  
  // OTP-related endpoints
  sendLoginOtp: async (data) => {
    try {
      const response = await APIClient.post('/auth/send-login-otp', data);
      return response;
    } catch (error) {
      console.error('Login OTP failed:', error);
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED' || !error.response || error.message.includes('timeout')) {
        demoMode.activate();
        await demoMode.simulateDelay();
        return { data: demoMode.mockResponses.sendLoginOtp };
      }
      throw error;
    }
  },
  
  sendRegisterOtp: async (data) => {
    try {
      const response = await APIClient.post('/auth/send-register-otp', data);
      return response;
    } catch (error) {
      console.error('Register OTP failed:', error);
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED' || !error.response || error.message.includes('timeout')) {
        demoMode.activate();
        await demoMode.simulateDelay();
        return { data: demoMode.mockResponses.sendRegisterOtp };
      }
      throw error;
    }
  },
  
  verifyOtp: async (data) => {
    if (demoMode.enabled) {
      await demoMode.simulateDelay();
      if (data.otp === '123456') {
        return { data: demoMode.mockResponses.verifyOtp };
      } else {
        throw new Error('Invalid OTP. Use: 123456');
      }
    }
    return APIClient.post('/auth/verify-otp', data);
  },
  
  resendOtp: async (data) => {
    if (demoMode.enabled) {
      await demoMode.simulateDelay();
      return { data: { message: 'Demo: New OTP sent. Use code: 123456' } };
    }
    return APIClient.post('/auth/resend-otp', data);
  }
};

export const eventAPI = {
  getAll: (params) => APIClient.get('/events', { params }),
  getOne: (id) => APIClient.get(`/events/${id}`),
  create: (data) => APIClient.post('/events', data),
  update: (id, data) => APIClient.put(`/events/${id}`, data),
  delete: (id) => APIClient.delete(`/events/${id}`)
};

export default APIClient;
