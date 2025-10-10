import axios from 'axios';

// Prefer explicit backend URL via Vite env; fallback to relative /api
const baseURL = `${import.meta.env.VITE_API_URL || ''}/api`.replace(/\/$/, '');

// Export the API base URL for direct fetch calls
export const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const APIClient = axios.create({
  baseURL
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
      console.warn('[API ERROR]', {
        url: err.config?.url,
        method: err.config?.method,
        status: err.response?.status,
        data: err.response?.data
      });
      return Promise.reject(err);
    }
  );
}

export const authAPI = {
  register: (data) => APIClient.post('/auth/register', data),
  login: (data) => APIClient.post('/auth/login', data),
  
  // OTP-related endpoints
  sendLoginOtp: (data) => APIClient.post('/auth/send-login-otp', data),
  sendRegisterOtp: (data) => APIClient.post('/auth/send-register-otp', data),
  verifyOtp: (data) => APIClient.post('/auth/verify-otp', data),
  resendOtp: (data) => APIClient.post('/auth/resend-otp', data)
};

export const eventAPI = {
  getAll: (params) => APIClient.get('/events', { params }),
  getOne: (id) => APIClient.get(`/events/${id}`),
  create: (data) => APIClient.post('/events', data),
  update: (id, data) => APIClient.put(`/events/${id}`, data),
  delete: (id) => APIClient.delete(`/events/${id}`)
};

export default APIClient;
