import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedLogo from '../components/AnimatedLogo';
import AuthForm from '../components/AuthForm';

const Landing = () => {
  const [animationComplete, setAnimationComplete] = useState(false);
  const markComplete = useCallback(() => setAnimationComplete(true), []);

  // Absolute fallback in case child never calls onComplete (shouldn't happen now)
  useEffect(() => {
    const id = setTimeout(() => {
      setAnimationComplete(true);
    }, 4200);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary via-background to-primary animate-pulse-slow"></div>
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_1px,_transparent_1px)] [background-size:40px_40px]"></div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        <AnimatePresence>
          {!animationComplete && (
            <motion.div
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="relative"
            >
              <AnimatedLogo onComplete={markComplete} />
              <motion.button
                onClick={markComplete}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.6, y: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-xs font-mono tracking-wide text-text-secondary hover:text-text transition-colors"
              >SKIP INTRO ▸
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {animationComplete && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md mt-8"
            >
              <AuthForm />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
        <p className="text-text-secondary text-xs font-mono">
          © 2025 Anonymous Cybersecurity Club
        </p>
      </div>
    </div>
  );
};

export default Landing;
