import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

// Helper for formatted date
const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const Timeline = ({ events, onEventClick }) => {
  const { theme } = useTheme();
  if (!events || events.length === 0) {
    return (
      <div className="py-20 text-center text-text-secondary font-mono tracking-wide">// no events yet</div>
    );
  }

  return (
    <div className="relative py-12">
      {/* Central line for desktop */}
  <div className={`hidden md:block absolute left-1/2 -translate-x-1/2 h-full w-px ${theme === 'hacker' ? 'bg-gradient-to-b from-transparent via-hacker-green/40 to-transparent' : 'bg-gradient-to-b from-transparent via-cyber-blue/30 to-transparent'}`} />
      {events.map((event, index) => {
        const even = index % 2 === 0;
        const isPast = event.status === 'past';
        const firstImage = event.images && event.images[0];
        return (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, y: 40, x: even ? -40 : 40 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: false, amount: 0.35 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.05 }}
            className={`md:flex items-stretch mb-14 md:mb-20 ${even ? 'md:flex-row' : 'md:flex-row-reverse'}`}
          >
            {/* Card column */}
            <div className={`md:w-5/12 ${even ? 'md:text-right md:pr-10' : 'md:text-left md:pl-10'} w-full`}> 
              <motion.div
                whileHover={{ scale: 1.025, y: -6 }}
                onClick={() => onEventClick(event)}
                className={`relative group cursor-pointer overflow-hidden rounded-xl backdrop-blur-sm p-0 transition-all duration-500 border ${theme === 'hacker' ? 'border-hacker-green/30 bg-[linear-gradient(145deg,rgba(13,21,19,0.92),rgba(5,11,10,0.88))] hover:shadow-glow-hacker-green' : 'border-cyber-blue/30 bg-gradient-to-br from-cyber-darker/80 to-cyber-dark/40 shadow-[0_0_0_0_rgba(0,217,255,0.0)] hover:shadow-[0_0_18px_0_rgba(0,217,255,0.25)]'}`}
              >
                {/* Image preview if exists */}
                {firstImage && (
                  <div className="relative w-full h-40 md:h-48 overflow-hidden">
                    <img
                      src={firstImage.url}
                      loading="lazy"
                      alt={firstImage.caption || event.title}
                      className="w-full h-full object-cover transition-transform duration-[4000ms] scale-105 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 opacity-80 group-hover:opacity-60 transition ${theme === 'hacker' ? 'bg-gradient-to-t from-[rgba(5,11,10,0.95)] via-[rgba(5,11,10,0.4)] to-transparent' : 'bg-gradient-to-t from-cyber-darker/90 via-cyber-darker/30 to-transparent'}`} />
                    {isPast && (
                      <span className={`absolute top-3 right-3 text-[10px] tracking-widest font-semibold px-2 py-1 rounded uppercase backdrop-blur-sm ${theme === 'hacker' ? 'bg-hacker-green/20 text-hacker-green border border-hacker-green/30' : 'bg-cyber-blue/20 text-cyber-blue'}`}>Past</span>
                    )}
                  </div>
                )}
                <div className="p-6 md:p-7">
                  <h3 className={`text-lg md:text-xl font-bold mb-2 group-hover:neon-text transition-colors ${theme === 'hacker' ? 'text-hacker-green hacker-glow-green' : 'text-cyber-blue'}`}
                  >
                    {event.title}
                  </h3>
                  <p className={`text-[11px] md:text-xs mb-2 font-mono tracking-wide ${theme === 'hacker' ? 'text-hacker-green/70' : 'text-cyber-green'}`}
                  >
                    {formatDate(event.date)}
                  </p>
                  <p className="text-text-secondary text-xs md:text-sm leading-relaxed line-clamp-3">
                    {event.summary}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4 justify-start md:justify-end">
                    <span className={`${theme === 'hacker' ? 'hacker-badge' : 'px-3 py-1 bg-cyber-blue/15 text-cyber-blue'} text-[10px] md:text-[11px] rounded uppercase tracking-wide`}>{event.category}</span>
                    {event.tags && event.tags.slice(0,2).map((t,i)=>(
                      <span key={i} className={`${theme === 'hacker' ? 'hacker-badge-soft' : 'px-2 py-1 bg-cyber-purple/10 text-cyber-purple'} text-[10px] md:text-[11px] rounded tracking-wide`}>#{t}</span>
                    ))}
                  </div>
                </div>
                {/* subtle sheen */}
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700">
                  <div className={`absolute -inset-[1px] animate-[sheen_3.5s_linear_infinite] ${theme === 'hacker' ? 'bg-gradient-to-r from-transparent via-hacker-green/10 to-transparent' : 'bg-gradient-to-r from-transparent via-cyber-blue/10 to-transparent'}`} />
                </div>
              </motion.div>
            </div>
            {/* Node + connector (desktop) */}
            <div className="hidden md:flex w-2/12 justify-center">
              <div className="relative flex items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border shadow-[0_0_10px_rgba(0,217,255,0.5),0_0_30px_rgba(0,217,255,0.15)_inset] ${theme === 'hacker' ? 'bg-[rgba(5,11,10,0.9)] border-hacker-green/40 hacker-outline' : 'bg-cyber-dark border-cyber-blue/50'}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${isPast ? (theme === 'hacker' ? 'bg-hacker-green/40 border border-hacker-green shadow-[0_0_8px_rgba(0,255,65,0.7)]' : 'bg-cyber-purple') : (theme === 'hacker' ? 'bg-hacker-green shadow-[0_0_8px_rgba(0,255,65,0.8)]' : 'bg-cyber-green')} `} />
                </div>
              </div>
            </div>
            {/* Spacer column */}
            <div className="hidden md:block md:w-5/12" />
          </motion.div>
        );
      })}
    </div>
  );
};

export default Timeline;
