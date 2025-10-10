import { motion, AnimatePresence } from 'framer-motion';
import AuthForm from './AuthForm';


const LoginModal = ({ open, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="login-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 140, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md mx-4 bg-black/40 backdrop-blur-xl rounded-xl shadow-2xl border border-cyber-blue/30 p-8 relative overflow-hidden"
            style={{ boxShadow: '0 0 50px rgba(0,217,255,0.1)' }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-cyber-blue/70 hover:text-cyber-blue font-bold text-xl leading-none focus:outline-none"
              aria-label="Close login form"
            >
              ×
            </button>
            <AuthForm onSuccess={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
