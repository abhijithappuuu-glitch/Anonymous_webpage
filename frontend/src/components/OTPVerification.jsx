import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { authAPI } from '../utils/api';
import { useTheme } from '../context/ThemeContext';

const OTPVerification = ({ email, onVerified, onBack, isRegistration = false }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await authAPI.verifyOtp({
        email,
        otp: otpString,
        isRegistration
      });
      
      onVerified(response.data);
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError('');

    try {
      await authAPI.resendOtp({ email, isRegistration });
      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`backdrop-blur-md p-10 rounded-lg w-full max-w-md transition-colors ${
        theme === 'hacker' 
          ? 'hacker-form-panel font-mono' 
          : 'bg-black/40 border border-cyber-blue/30 shadow-[0_0_50px_rgba(0,217,255,0.1)]'
      }`}
    >
      <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-2 ${
          theme === 'hacker' 
            ? 'text-hacker-green hacker-glow-green' 
            : 'text-cyber-blue'
        }`} style={theme === 'hacker' ? undefined : { textShadow: '0 0 20px rgba(0,217,255,0.6)' }}>
          {theme === 'hacker' ? '>> otp.verify()' : '> EMAIL_VERIFICATION'}
        </h2>
        <div className={`h-0.5 w-32 ${
          theme === 'hacker' 
            ? 'bg-gradient-to-r from-hacker-green/80 via-hacker-green/30 to-transparent' 
            : 'bg-gradient-to-r from-cyber-blue to-transparent'
        }`} />
      </div>

      <div className={`mb-6 p-4 rounded-lg border ${
        theme === 'hacker'
          ? 'bg-green-900/20 border-green-400/30 text-green-300'
          : 'bg-cyan-900/20 border-cyan-400/30 text-cyan-300'
      }`}>
        <p className="text-sm font-mono">
          {theme === 'hacker' 
            ? `// OTP sent to: ${email}\n// Check your inbox and spam folder`
            : `Verification code sent to:\n${email}\n\nCheck your inbox and spam folder.`
          }
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded mb-6 font-mono text-sm border-l-4 ${
            theme === 'hacker' 
              ? 'bg-[rgba(255,0,85,0.12)] border-[#ff0055] text-[#ff0055]' 
              : 'bg-cyber-red/10 border-cyber-red text-cyber-red'
          }`}
        >
          <span className="font-bold">ERROR:</span> {error}
        </motion.div>
      )}

      <form onSubmit={handleVerify} className="space-y-6">
        <div>
          <label className={`block text-xs font-mono mb-4 ${
            theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-green'
          }`}>
            ENTER 6-DIGIT VERIFICATION CODE
          </label>
          
          <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                name={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-12 h-12 text-center text-xl font-bold rounded border transition-all ${
                  theme === 'hacker'
                    ? 'bg-[rgba(5,11,10,0.7)] border-hacker-green/30 focus:border-hacker-green focus:shadow-[0_0_10px_rgba(0,255,65,0.4)] text-hacker-green'
                    : 'bg-black/50 border-cyber-blue/30 text-white focus:border-cyber-blue focus:shadow-[0_0_10px_rgba(0,217,255,0.3)]'
                }`}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || otp.join('').length !== 6}
          className={`w-full font-bold py-3 rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
            theme === 'hacker' 
              ? 'bg-hacker-green/15 text-hacker-green border border-hacker-green/40 hover:bg-hacker-green/25 shadow-glow-hacker-green' 
              : 'bg-gradient-to-r from-cyber-blue to-cyan-500 text-black hover:shadow-[0_0_20px_rgba(0,217,255,0.5)]'
          }`}
        >
          {loading 
            ? (theme === 'hacker' ? 'verifying...' : 'VERIFYING...') 
            : (theme === 'hacker' ? 'verify.otp()' : '[ VERIFY CODE ]')
          }
        </button>
      </form>

      <div className="mt-6 text-center space-y-4">
        <div className="h-px bg-gradient-to-r from-transparent via-cyber-blue/30 to-transparent"></div>
        
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className={`text-sm font-mono transition-colors ${
              theme === 'hacker' 
                ? 'text-green-500/60 hover:text-hacker-green' 
                : 'text-gray-400 hover:text-cyber-blue'
            }`}
          >
            {theme === 'hacker' ? '← back()' : '← BACK'}
          </button>

          <div className="text-center">
            {canResend ? (
              <button
                onClick={handleResendOtp}
                disabled={resendLoading}
                className={`text-sm font-mono font-bold transition-colors disabled:opacity-50 ${
                  theme === 'hacker' 
                    ? 'text-hacker-green hover:text-aqua-400' 
                    : 'text-cyber-blue hover:text-cyber-green'
                }`}
              >
                {resendLoading 
                  ? (theme === 'hacker' ? 'sending...' : 'SENDING...') 
                  : (theme === 'hacker' ? 'resend.otp()' : 'RESEND CODE')
                }
              </button>
            ) : (
              <p className={`text-xs font-mono ${
                theme === 'hacker' ? 'text-green-500/60' : 'text-gray-400'
              }`}>
                {theme === 'hacker' 
                  ? `// resend in ${countdown}s` 
                  : `Resend in ${countdown}s`
                }
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OTPVerification;