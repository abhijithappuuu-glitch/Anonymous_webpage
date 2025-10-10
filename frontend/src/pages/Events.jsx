import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import EventModal from '../components/EventModal';
import LoginModal from '../components/LoginModal';
import { eventAPI } from '../utils/api';
import { useTheme } from '../context/ThemeContext';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState({ category: '', status: '' });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await eventAPI.getAll(filter);
        
        // Use default events if database is empty
        const defaultEvents = [
          {
            _id: 'default-event-1',
            title: 'Web Security Workshop',
            summary: 'Learn about SQL injection, XSS, and CSRF attacks with hands-on lab exercises.',
            description: 'Comprehensive workshop covering OWASP Top 10 vulnerabilities with practical demonstrations and defensive techniques.',
            date: '2024-11-15',
            category: 'Workshop',
            status: 'upcoming',
            tags: ['web-security', 'owasp', 'hands-on']
          },
          {
            _id: 'default-event-2',
            title: 'National CTF Championship',
            summary: 'Annual cybersecurity competition with crypto, forensics, and reverse engineering challenges.',
            description: 'Multi-day capture the flag competition featuring advanced challenges in various cybersecurity domains.',
            date: '2024-12-20',
            category: 'Competition',
            status: 'upcoming',
            tags: ['ctf', 'competition', 'challenges']
          },
          {
            _id: 'default-event-3',
            title: 'Introduction to Ethical Hacking',
            summary: 'Beginner-friendly session covering ethical hacking principles and penetration testing basics.',
            description: 'Learn the fundamentals of ethical hacking, including reconnaissance, scanning, and vulnerability assessment.',
            date: '2024-10-28',
            category: 'Workshop',
            status: 'past',
            tags: ['ethical-hacking', 'pentest', 'beginner']
          },
          {
            _id: 'default-event-4',
            title: 'Digital Forensics Masterclass',
            summary: 'Advanced techniques for incident response and digital evidence analysis.',
            description: 'Comprehensive masterclass on digital forensics tools and methodologies for cybersecurity professionals.',
            date: '2024-09-12',
            category: 'Masterclass',
            status: 'past',
            tags: ['forensics', 'incident-response', 'advanced']
          },
          {
            _id: 'default-event-5',
            title: 'Cryptography Decoded',
            summary: 'Understanding modern cryptographic algorithms and their real-world applications.',
            description: 'Deep dive into symmetric and asymmetric encryption, hashing, and digital signatures.',
            date: '2024-08-05',
            category: 'Seminar',
            status: 'past',
            tags: ['cryptography', 'encryption', 'theory']
          },
          {
            _id: 'default-event-6',
            title: 'Red Team vs Blue Team Exercise',
            summary: 'Simulated cyber attack and defense scenario with live demonstration.',
            description: 'Interactive exercise where teams alternate between attacking and defending network infrastructure.',
            date: '2024-12-08',
            category: 'Exercise',
            status: 'upcoming',
            tags: ['red-team', 'blue-team', 'simulation']
          }
        ];
        
        setEvents(data.length > 0 ? data : defaultEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        // Fallback to default events on API error
        const defaultEvents = [
          {
            _id: 'default-event-1',
            title: 'Web Security Workshop',
            summary: 'Learn about SQL injection, XSS, and CSRF attacks with hands-on lab exercises.',
            description: 'Comprehensive workshop covering OWASP Top 10 vulnerabilities with practical demonstrations and defensive techniques.',
            date: '2024-11-15',
            category: 'Workshop',
            status: 'upcoming',
            tags: ['web-security', 'owasp', 'hands-on']
          },
          {
            _id: 'default-event-2',
            title: 'National CTF Championship',
            summary: 'Annual cybersecurity competition with crypto, forensics, and reverse engineering challenges.',
            description: 'Multi-day capture the flag competition featuring advanced challenges in various cybersecurity domains.',
            date: '2024-12-20',
            category: 'Competition',
            status: 'upcoming',
            tags: ['ctf', 'competition', 'challenges']
          },
          {
            _id: 'default-event-3',
            title: 'Introduction to Ethical Hacking',
            summary: 'Beginner-friendly session covering ethical hacking principles and penetration testing basics.',
            description: 'Learn the fundamentals of ethical hacking, including reconnaissance, scanning, and vulnerability assessment.',
            date: '2024-10-28',
            category: 'Workshop',
            status: 'past',
            tags: ['ethical-hacking', 'pentest', 'beginner']
          },
          {
            _id: 'default-event-4',
            title: 'Digital Forensics Masterclass',
            summary: 'Advanced techniques for incident response and digital evidence analysis.',
            description: 'Comprehensive masterclass on digital forensics tools and methodologies for cybersecurity professionals.',
            date: '2024-09-12',
            category: 'Masterclass',
            status: 'past',
            tags: ['forensics', 'incident-response', 'advanced']
          },
          {
            _id: 'default-event-5',
            title: 'Cryptography Decoded',
            summary: 'Understanding modern cryptographic algorithms and their real-world applications.',
            description: 'Deep dive into symmetric and asymmetric encryption, hashing, and digital signatures.',
            date: '2024-08-05',
            category: 'Seminar',
            status: 'past',
            tags: ['cryptography', 'encryption', 'theory']
          },
          {
            _id: 'default-event-6',
            title: 'Red Team vs Blue Team Exercise',
            summary: 'Simulated cyber attack and defense scenario with live demonstration.',
            description: 'Interactive exercise where teams alternate between attacking and defending network infrastructure.',
            date: '2024-12-08',
            category: 'Exercise',
            status: 'upcoming',
            tags: ['red-team', 'blue-team', 'simulation']
          }
        ];
        setEvents(defaultEvents);
      }
    };
    fetchEvents();
  }, [filter]);

  const { theme } = useTheme();
  const isHacker = theme === 'hacker';

  return (
  <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${isHacker ? 'bg-hacker-bg' : 'bg-cyber-dark'}`}>
      <Navbar onLoginClick={() => setShowLogin(true)} />

      <div className="container mx-auto px-6 py-12 relative z-10">
        <h1 className={`text-5xl font-bold text-center mb-12 tracking-tight transition
          ${isHacker ? 'text-hacker-green font-mono drop-shadow-[0_0_8px_rgba(0,255,65,0.5)]' : 'text-cyber-blue text-glow'}`}>ALL EVENTS</h1>

        <div className="flex gap-4 mb-8 justify-center flex-wrap">
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className={`px-4 py-2 rounded focus:outline-none transition tracking-wide text-sm
              ${isHacker
                ? 'bg-hacker-panel border border-hacker-green/30 text-hacker-green font-mono focus:border-hacker-green'
                : 'bg-cyber-darker border border-cyber-blue/50 text-cyber-blue focus:border-cyber-blue'}`}
          >
            <option value="">All Categories</option>
            <option value="Workshop">Workshop</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Webinar">Webinar</option>
            <option value="Conference">Conference</option>
          </select>

          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className={`px-4 py-2 rounded focus:outline-none transition tracking-wide text-sm
              ${isHacker
                ? 'bg-hacker-panel border border-hacker-green/30 text-hacker-green font-mono focus:border-hacker-green'
                : 'bg-cyber-darker border border-cyber-blue/50 text-cyber-blue focus:border-cyber-blue'}`}
          >
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
              onClick={() => setSelectedEvent(event)}
              whileHover={{ rotateX: 4, rotateY: -4, scale: 1.02 }}
              className={`overflow-hidden cursor-pointer relative group transition-all duration-500 rounded-xl
                ${isHacker
                  ? 'bg-hacker-panel/80 border border-hacker-green/25 hover:border-hacker-green/40 hover:shadow-glow-hacker-green'
                  : 'glass border-gradient'}
              `}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-15 transition
                ${isHacker
                  ? 'bg-gradient-to-br from-hacker-green/40 via-hacker-aqua/20 to-hacker-purple/40'
                  : 'bg-gradient-to-br from-cyber-blue/40 via-cyber-purple/20 to-cyber-green/40'}`} />
              {event.images?.[0] && (
                <div className="h-44 overflow-hidden">
                  <img
                    src={event.images[0].url}
                    alt={event.title}
                    className="w-full h-44 object-cover transition-transform duration-[4000ms] group-hover:scale-110"
                  />
                </div>
              )}
              <div className="p-6 space-y-3">
                <h3 className={`text-lg font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r
                  ${isHacker ? 'from-hacker-green via-hacker-aqua to-hacker-purple' : 'from-cyber-blue to-cyber-green'}`}>{event.title}</h3>
                <p className={`${isHacker ? 'text-hacker-aqua/90 font-mono' : 'text-cyber-green font-mono'} text-xs`}>
                  {new Date(event.date).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric'})}
                </p>
                <p className={`text-sm line-clamp-3 transition ${isHacker ? 'text-gray-300/80' : 'text-text-secondary'}`}>{event.summary}</p>
                <div className="flex gap-2 flex-wrap pt-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase transition
                    ${isHacker ? 'bg-hacker-aqua/15 text-hacker-aqua border border-hacker-aqua/25' : 'bg-cyber-blue/15 text-cyber-blue'}`}>{event.category}</span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase transition
                    ${event.status === 'upcoming'
                      ? (isHacker ? 'bg-hacker-green/20 text-hacker-green border border-hacker-green/25' : 'bg-cyber-green/20 text-cyber-green')
                      : (isHacker ? 'bg-hacker-purple/20 text-hacker-purple border border-hacker-purple/25' : 'bg-text-secondary/10 text-text-secondary')}`}>{event.status}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
};

export default Events;
