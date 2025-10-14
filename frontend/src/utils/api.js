import axios from 'axios';

// Cross-browser timeout helper (avoids AbortSignal.timeout which may be unsupported)
const timeoutSignal = (ms) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, cancel: () => clearTimeout(id) };
};

// Primary backend URL
const PRIMARY_BACKEND_URL = 'https://anonymous-club-backend-f2ai.onrender.com';

// Multiple possible backend URLs for production fallback
const POSSIBLE_BACKEND_URLS = [
  PRIMARY_BACKEND_URL,
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
      const t = timeoutSignal(5000);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/health`, { 
        method: 'GET',
        signal: t.signal
      });
      t.cancel();
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
      const t = timeoutSignal(3000);
      const response = await fetch(`${backendUrl}/api/health`, { 
        method: 'GET',
        signal: t.signal
      });
      t.cancel();
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

// Dynamic backend URL resolution - prioritize env var, then primary backend, then localhost
let BACKEND_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? PRIMARY_BACKEND_URL : 'http://localhost:5000');

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

// Note: demo mode will activate during API calls if backend is unreachable

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
    try {
      const response = await APIClient.post('/auth/login', data);
      return response;
    } catch (error) {
      console.error('Direct login failed:', error);
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED' || !error.response || error.message.includes('timeout')) {
        demoMode.activate();
        await demoMode.simulateDelay();
        return { data: demoMode.mockResponses.verifyOtp };
      }
      throw error;
    }
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
