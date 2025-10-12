import { motion } from 'framer-motion';
import { useEffect, Suspense, lazy } from 'react';
const ThreeLogo = lazy(() => import('./ThreeLogo'));

const Logo3D = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
    animate={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
    className="w-24 h-24"
  >
    <ThreeLogo height={96} orbit />
  </motion.div>
);

const title = "ANONYMOUS";
const subtitle = "CYBERSECURITY";

const AnimatedLogo = ({ onComplete, totalDurationMs = 3800 }) => {
  // Safety timer ensures completion even if Framer's lifecycle doesn't fire
  useEffect(() => {
    const id = setTimeout(() => {
      onComplete && onComplete();
    }, totalDurationMs);
    return () => clearTimeout(id);
  }, [onComplete, totalDurationMs]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center select-none"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
  <Suspense fallback={<div className="w-24 h-24 rounded-full bg-black/30 border border-gray-700" />}> 
    <Logo3D />
  </Suspense>
      <motion.h1
        className="font-cyber text-4xl text-text mt-4 tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        {title.split('').map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 + i * 0.1, duration: 0.5 }}
          >
            {char}
          </motion.span>
        ))}
      </motion.h1>
      <motion.p
        className="font-mono text-sm text-text-secondary mt-2 tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        {subtitle}
      </motion.p>
      <motion.div
        className="mt-6 h-1 w-56 bg-secondary overflow-hidden rounded"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-accent via-accent-hover to-accent shadow-glow-accent"
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          transition={{ duration: totalDurationMs / 1000, ease: 'linear' }}
        />
      </motion.div>
    </motion.div>
  );
};

export default AnimatedLogo;
