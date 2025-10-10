import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { authAPI } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import OTPVerification from './OTPVerification';

const AuthForm = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [pendingUserData, setPendingUserData] = useState(null);
  const { login } = useContext(AuthContext);
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        // For login, directly authenticate without OTP
        const response = await authAPI.login({ 
          email: formData.email, 
          password: formData.password 
        });
        console.log('Login successful:', response.data);
        login(response.data);
        
        // Close modal on success
        if (onSuccess) onSuccess();
      } else {
        // For registration, send OTP first
        const response = await authAPI.sendRegisterOtp(formData);
        setPendingUserData(formData);
        setShowOtpVerification(true);
      }
    } catch (err) {
      console.error('Auth error:', err);
      let errorMessage = 'Authentication failed';
      
      // Check if demo mode is being used
      if (err.response?.data?.message?.includes('DEMO MODE')) {
        // Demo mode success - this shouldn't be an error
        setPendingUserData(isLogin ? { email: formData.email, password: formData.password } : formData);
        setShowOtpVerification(true);
        return;
      }
      
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        errorMessage = '🚀 Switching to DEMO MODE: Backend timeout. You can still test the authentication flow!';
      } else if (err.code === 'ERR_NETWORK' || err.message === 'Network Error' || !err.response) {
        errorMessage = '🚀 DEMO MODE: Backend unavailable. Use OTP code 123456 to test login!';
      } else if (err.response?.status === 404) {
        errorMessage = 'Service temporarily unavailable. Please try again later.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerified = async (response) => {
    try {
      console.log('OTP verified, user data:', response);
      login(response);
      
      // Close modal on success
      if (onSuccess) onSuccess();
      
    } catch (err) {
      console.error('Final auth error:', err);
      setError('Authentication completed but login failed');
    }
  };

  const handleBackFromOtp = () => {
    setShowOtpVerification(false);
    setPendingUserData(null);
    setError('');
  };

  // Show OTP verification if needed
  if (showOtpVerification && pendingUserData) {
    return (
      <OTPVerification 
        email={pendingUserData.email}
        onVerified={handleOtpVerified}
        onBack={handleBackFromOtp}
        isRegistration={!isLogin}
      />
    );
  }

  return (
    <div className={`w-full transition-colors ${theme === 'hacker' ? 'font-mono' : ''}`}>
      <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-2 ${theme === 'hacker' ? 'text-hacker-green hacker-glow-green' : 'text-cyber-blue'}`} style={theme === 'hacker' ? undefined : { textShadow: '0 0 20px rgba(0,217,255,0.6)' }}>
          {isLogin ? (theme === 'hacker' ? '>> auth.login()' : '> ACCESS_TERMINAL') : (theme === 'hacker' ? '>> auth.register()' : '> NEW_USER_REGISTRATION')}
        </h2>
        <div className={`h-0.5 w-32 ${theme === 'hacker' ? 'bg-gradient-to-r from-hacker-green/80 via-hacker-green/30 to-transparent' : 'bg-gradient-to-r from-cyber-blue to-transparent'}`}></div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded mb-6 font-mono text-sm border-l-4 ${theme === 'hacker' ? 'bg-[rgba(255,0,85,0.12)] border-[#ff0055] text-[#ff0055]' : 'bg-cyber-red/10 border-cyber-red text-cyber-red'}`}
        >
          <span className="font-bold">ERROR:</span> {error}
          {import.meta.env.DEV && (
            <div className="mt-2 text-xs opacity-70">Check backend console for detailed trace if persistent.</div>
          )}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {!isLogin && (
          <div>
            <label className={`block text-xs font-mono mb-2 ${theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-green'}`}>USERNAME</label>
            <input
              type="text"
              placeholder="Enter username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className={`w-full p-3 rounded focus:outline-none transition-all font-mono ${theme === 'hacker' ? 'bg-[rgba(5,11,10,0.7)] border border-hacker-green/30 focus:border-hacker-green focus:shadow-[0_0_10px_rgba(0,255,65,0.4)] text-hacker-green placeholder:text-green-500/30' : 'bg-black/50 border border-cyber-blue/30 text-white focus:border-cyber-blue focus:shadow-[0_0_10px_rgba(0,217,255,0.3)]'}`}
              required
            />
          </div>
        )}
        
        <div>
          <label className={`block text-xs font-mono mb-2 ${theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-green'}`}>EMAIL</label>
          <input
            type="email"
            placeholder="user@domain.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full p-3 rounded focus:outline-none transition-all font-mono ${theme === 'hacker' ? 'bg-[rgba(5,11,10,0.7)] border border-hacker-green/30 focus:border-hacker-green focus:shadow-[0_0_10px_rgba(0,255,65,0.4)] text-hacker-green placeholder:text-green-500/30' : 'bg-black/50 border border-cyber-blue/30 text-white focus:border-cyber-blue focus:shadow-[0_0_10px_rgba(0,217,255,0.3)]'}`}
            required
          />
        </div>
        
        <div>
          <label className={`block text-xs font-mono mb-2 ${theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-green'}`}>PASSWORD</label>
          <input
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className={`w-full p-3 rounded focus:outline-none transition-all font-mono ${theme === 'hacker' ? 'bg-[rgba(5,11,10,0.7)] border border-hacker-green/30 focus:border-hacker-green focus:shadow-[0_0_10px_rgba(0,255,65,0.4)] text-hacker-green placeholder:text-green-500/30' : 'bg-black/50 border border-cyber-blue/30 text-white focus:border-cyber-blue focus:shadow-[0_0_10px_rgba(0,217,255,0.3)]'}`}
            required
            minLength="6"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full font-bold py-3 rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${theme === 'hacker' ? 'bg-hacker-green/15 text-hacker-green border border-hacker-green/40 hover:bg-hacker-green/25 shadow-glow-hacker-green' : 'bg-gradient-to-r from-cyber-blue to-cyan-500 text-black hover:shadow-[0_0_20px_rgba(0,217,255,0.5)]'}`}
        >
          {loading ? (theme === 'hacker' ? 'processing()' : 'PROCESSING...') : (isLogin ? (theme === 'hacker' ? 'auth.login' : '[ LOGIN ]') : (theme === 'hacker' ? 'auth.register' : '[ REGISTER ]'))}
        </button>
      </form>

      <div className="mt-6 text-center">
        <div className="h-px bg-gradient-to-r from-transparent via-cyber-blue/30 to-transparent mb-4"></div>
        <p className={`text-sm font-mono ${theme === 'hacker' ? 'text-green-500/60' : 'text-gray-400'}`}>
          {isLogin ? (theme === 'hacker' ? 'no account?' : "Don't have access?") : (theme === 'hacker' ? 'have credentials?' : 'Already registered?')}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className={`ml-2 font-bold transition-colors ${theme === 'hacker' ? 'text-hacker-green hover:text-aqua-400' : 'text-cyber-blue hover:text-cyber-green'}`}
          >
            {isLogin ? (theme === 'hacker' ? 'register()' : '[ REGISTER ]') : (theme === 'hacker' ? 'login()' : '[ LOGIN ]')}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
