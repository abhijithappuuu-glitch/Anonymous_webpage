import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';

const EventModal = ({ event, onClose }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (event) setIndex(0);
  }, [event]);

  const images = event?.images || [];
  const hasImages = images.length > 0;

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-advance only if more than 1 image
  useEffect(() => {
    if (!hasImages || images.length < 2) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [images, hasImages, next]);

  const { theme } = useTheme();
  const isHacker = theme === 'hacker';

  if (!event) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.88, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={`rounded-xl max-w-5xl w-full max-h-[92vh] overflow-y-auto backdrop-saturate-150 transition-colors duration-300
            ${isHacker
              ? 'bg-[rgba(5,11,10,0.94)] border border-hacker-green/30 shadow-[0_0_22px_-2px_rgba(0,255,65,0.25)]'
              : 'bg-cyber-darker/95 border border-cyber-blue/30 shadow-[0_0_25px_-2px_rgba(0,217,255,0.25)]'}
          `}
        >
          {/* Header */}
          <div className={`p-7 flex justify-between items-start gap-6 sticky top-0 backdrop-blur-sm z-10 border-b
            ${isHacker ? 'bg-[rgba(5,11,10,0.9)] border-hacker-green/20' : 'bg-cyber-darker/95 border-cyber-blue/20'}`}
          >
            <div>
              <h2 className={`text-3xl font-bold mb-2 leading-tight tracking-tight ${isHacker ? 'text-hacker-green font-mono drop-shadow-[0_0_6px_rgba(0,255,65,0.6)]' : 'text-cyber-blue text-glow'}`}>{event.title}</h2>
              <p className={`${isHacker ? 'text-hacker-aqua/90' : 'text-cyber-green'} text-sm font-mono`}>
                {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`focus:outline-none text-2xl font-bold px-2 transition
                ${isHacker ? 'text-hacker-green/60 hover:text-hacker-green' : 'text-cyber-blue/60 hover:text-cyber-blue'}`}
              aria-label="Close"
            >
              ×
            </button>
          </div>

            {/* Image Carousel */}
            {hasImages && (
              <div className="relative group select-none">
                <div className="overflow-hidden h-[340px] md:h-[420px] bg-black/30">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={index}
                      src={images[index].url}
                      alt={images[index].caption || event.title}
                      loading="lazy"
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  </AnimatePresence>
                  <div className={`absolute inset-0 bg-gradient-to-t ${isHacker ? 'from-[#050b0a]/90 via-[#050b0a]/10' : 'from-cyber-darker/90 via-cyber-darker/10'} to-transparent`} />
                </div>
                {images.length > 1 && (
                  <>
                    <button onClick={prev} className={`absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition
                      ${isHacker ? 'bg-[#0d1513]/70 border border-hacker-green/30 hover:border-hacker-green text-hacker-green' : 'bg-cyber-darker/70 border border-cyber-blue/40 hover:border-cyber-blue text-cyber-blue'}`}>‹</button>
                    <button onClick={next} className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition
                      ${isHacker ? 'bg-[#0d1513]/70 border border-hacker-green/30 hover:border-hacker-green text-hacker-green' : 'bg-cyber-darker/70 border border-cyber-blue/40 hover:border-cyber-blue text-cyber-blue'}`}>›</button>
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          aria-label={`Go to image ${i+1}`}
                          onClick={() => setIndex(i)}
                          className={`w-2.5 h-2.5 rounded-full transition
                            ${i === index
                              ? isHacker
                                ? 'bg-hacker-green shadow-[0_0_6px_rgba(0,255,65,0.65)]'
                                : 'bg-cyber-blue shadow-[0_0_6px_rgba(0,217,255,0.8)]'
                              : isHacker
                                ? 'bg-hacker-green/25 hover:bg-hacker-green/60'
                                : 'bg-cyber-blue/30 hover:bg-cyber-blue/60'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
                {images[index]?.caption && (
                  <p className="text-xs text-gray-400 px-5 pt-3 italic">{images[index].caption}</p>
                )}
              </div>
            )}

          {/* Body */}
          <div className="p-7 pt-8">
            <div className="mb-6 flex flex-wrap gap-3 items-center">
              <span className={`inline-block px-4 py-1.5 rounded text-xs tracking-wide uppercase transition
                ${isHacker ? 'bg-hacker-aqua/15 text-hacker-aqua border border-hacker-aqua/20' : 'bg-cyber-blue/15 text-cyber-blue'}`}
              >
                {event.category}
              </span>
              <span className={`inline-block px-4 py-1.5 rounded text-xs tracking-wide uppercase transition
                ${event.status === 'upcoming'
                  ? (isHacker ? 'bg-hacker-green/15 text-hacker-green border border-hacker-green/25' : 'bg-cyber-green/15 text-cyber-green')
                  : (isHacker ? 'bg-hacker-purple/15 text-hacker-purple border border-hacker-purple/25' : 'bg-cyber-purple/20 text-cyber-purple')}`}
              >
                {event.status}
              </span>
              {event.tags && event.tags.map((tag, index) => (
                <span key={index} className={`px-3 py-1 text-[11px] rounded font-mono transition
                  ${isHacker ? 'bg-hacker-purple/15 text-hacker-purple border border-hacker-purple/25' : 'bg-cyber-purple/15 text-cyber-purple'}`}>#{tag}</span>
              ))}
            </div>

            <div className="prose prose-invert max-w-none mb-8">
              <p className={`leading-relaxed text-sm md:text-base whitespace-pre-line transition-colors
                ${isHacker ? 'text-gray-300/90' : 'text-gray-300'}`}>{event.description}</p>
            </div>

            {/* Possibly future: resources / links section */}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventModal;
