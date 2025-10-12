import { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import logo from '../assets/logo.png';
import Timeline from '../components/Timeline';
import EventModal from '../components/EventModal';
import { eventAPI, API } from '../utils/api';
import CodeRain from '../components/CodeRain';
import { useTheme } from '../context/ThemeContext';
import LoginModal from '../components/LoginModal';

// Lazy load 3D logo so three.js is loaded only when needed
const ThreeLogo = lazy(() => import('../components/ThreeLogo'));

const Home = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [clubInfo, setClubInfo] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch events
        const { data: eventsData } = await eventAPI.getAll();
        
        // Use default events if database is empty
        const defaultEvents = [
          {
            _id: 'default-event-1',
            title: 'Club Foundation',
            description: 'Anonymous Cybersecurity Club officially founded by Abhijith and Bhuvan',
            date: '2024-01-15',
            category: 'milestone'
          },
          {
            _id: 'default-event-2',
            title: 'First CTF Workshop',
            description: 'Conducted our first Capture The Flag workshop for beginners',
            date: '2024-02-20',
            category: 'workshop'
          },
          {
            _id: 'default-event-3',
            title: 'Core Team Formation',
            description: 'Satvik and Tejaswini joined as core members, expanding our expertise',
            date: '2024-03-10',
            category: 'team'
          },
          {
            _id: 'default-event-4',
            title: 'First Security Audit',
            description: 'Successfully completed our first professional security audit project',
            date: '2024-04-25',
            category: 'project'
          },
          {
            _id: 'default-event-5',
            title: 'National CTF Participation',
            description: 'Participated in National Cybersecurity Championship, secured top 10 position',
            date: '2024-06-15',
            category: 'competition'
          },
          {
            _id: 'default-event-6',
            title: 'Vulnerability Disclosure Program',
            description: 'Launched our responsible vulnerability disclosure program',
            date: '2024-08-30',
            category: 'program'
          },
          {
            _id: 'default-event-7',
            title: 'Website Launch',
            description: 'Official website and admin portal launched with comprehensive features',
            date: '2024-10-09',
            category: 'milestone'
          }
        ];
        
        setEvents(eventsData.length > 0 ? eventsData : defaultEvents);

        // Fetch club info
        const clubResponse = await fetch(`${API}/club-info`);
        if (clubResponse.ok) {
          const clubData = await clubResponse.json();
          setClubInfo(clubData);
        }

        // Fetch team members
        const teamResponse = await fetch(`${API}/team-members`);
        if (teamResponse.ok) {
          const teamData = await teamResponse.json();
          setTeamMembers(teamData);
        }

      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'hacker' ? 'bg-black text-green-400' : 'bg-cyber-dark'}`}>
        {theme === 'hacker' && <CodeRain active />}
        <div className="text-center">
          <div className={`animate-spin w-8 h-8 border-4 border-t-transparent rounded-full mx-auto mb-4 ${
            theme === 'hacker' ? 'border-green-400' : 'border-cyber-blue'
          }`}></div>
          <p className={theme === 'hacker' ? 'text-green-400 font-mono' : 'text-cyber-blue'}>
            {theme === 'hacker' ? '> LOADING.data()...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${theme === 'hacker' ? 'bg-black text-green-400' : 'bg-cyber-dark'}`}>
      {theme === 'hacker' && <CodeRain active />}
      
      {/* Parallax decorative layers - only show in normal theme */}
      {theme !== 'hacker' && (
        <div className="parallax-scene pointer-events-none absolute inset-0">
          <div className="parallax-layer" data-depth="0.2">
            <div className="w-full h-full opacity-[0.07]" style={{backgroundImage:'radial-gradient(circle at 30% 40%, #00d9ff 0, transparent 60%)'}}></div>
          </div>
          <div className="parallax-layer" data-depth="0.4">
            <div className="w-full h-full opacity-[0.05]" style={{backgroundImage:'radial-gradient(circle at 70% 70%, #bd00ff 0, transparent 65%)'}}></div>
          </div>
          <div className="parallax-layer" data-depth="0.6">
            <div className="w-full h-full opacity-[0.04]" style={{backgroundImage:'linear-gradient(135deg, rgba(0,217,255,0.15) 0%, transparent 60%)'}}></div>
          </div>
        </div>
      )}

      <Navbar onLoginClick={() => setShowLogin(true)} />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-28 px-6 md:px-10 overflow-hidden"
      >
        {/* Grid overlay - different for hacker theme */}
        {theme === 'hacker' ? (
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'linear-gradient(rgba(0,255,65,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.3) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}></div>
        ) : (
          <div className="absolute inset-0 opacity-10 mix-blend-screen" style={{
            backgroundImage:'linear-gradient(rgba(0,217,255,0.09) 1px, transparent 1px),linear-gradient(90deg, rgba(0,217,255,0.09) 1px, transparent 1px)',
            backgroundSize:'46px 46px'
          }}></div>
        )}
        
        <div className={`container mx-auto relative z-10 ${theme === 'hacker' ? 'font-mono' : ''}`}> 
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-24 max-w-5xl mx-auto"
          >
            <div className="relative text-center mb-6">
              {/* 3D Logo with pattern backdrop */}
              <div className="relative mx-auto mb-8" style={{ width: '16rem', height: '16rem' }}>
                {/* Pattern layer: subtle grid */}
                <div
                  className="absolute inset-0 rounded-full opacity-20"
                  style={{
                    backgroundImage: theme === 'hacker'
                      ? 'linear-gradient(rgba(0,255,65,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.25) 1px, transparent 1px)'
                      : 'linear-gradient(rgba(0,217,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(189,0,255,0.14) 1px, transparent 1px)',
                    backgroundSize: '18px 18px',
                    maskImage: 'radial-gradient(circle at center, black 60%, transparent 80%)'
                  }}
                />
                {/* Glow ring */}
                <div
                  className="absolute -inset-6 rounded-full blur-2xl opacity-50"
                  style={{
                    background: theme === 'hacker'
                      ? 'radial-gradient(circle at center, rgba(0,255,65,0.35), transparent 60%)'
                      : 'radial-gradient(circle at center, rgba(0,217,255,0.25), transparent 60%)'
                  }}
                />
                {/* 3D Canvas */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <Suspense
                    fallback={
                      <motion.img
                        src={logo}
                        alt="Club Logo"
                        className={`w-full h-full object-contain opacity-70 ${
                          theme === 'hacker'
                            ? 'drop-shadow-[0_0_70px_rgba(0,255,65,0.9)]'
                            : 'drop-shadow-[0_0_70px_rgba(48,129,247,0.9)]'
                        }`}
                        initial={{ opacity: 0.6, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                      />
                    }
                  >
                    <ThreeLogo height={256} orbit />
                  </Suspense>
                </div>
              </div>
              
              {/* Text below logo */}
              <h1 className={`text-5xl md:text-7xl font-extrabold tracking-tight mb-6 ${
                theme === 'hacker' 
                  ? 'text-green-400 font-mono drop-shadow-[0_0_20px_rgba(0,255,65,0.8)]' 
                  : 'bg-clip-text text-transparent bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-green drop-shadow-[0_0_15px_rgba(48,129,247,0.6)]'
              }`}>
                {theme === 'hacker' ? '> ANONYMOUS_COLLECTIVE.SYS' : 'Anonymous'}
              </h1>
            </div>
            
            <p className={`text-lg md:text-xl font-mono mb-10 ${theme === 'hacker' ? 'text-green-400' : 'text-text-secondary'}`}>
              <span className="terminal-caret">
                {theme === 'hacker' ? '$ ./initialize_secure_protocol.sh' : 'initiating secure knowledge exchange'}
              </span>
            </p>
            
            <div className={`max-w-3xl mx-auto leading-relaxed text-base md:text-lg mb-10 ${
              theme === 'hacker' ? 'text-green-300 font-mono bg-black/50 p-6 border border-green-400' : 'text-text'
            }`}>
              {theme === 'hacker' ? (
                <pre className="text-left">
{`// SYSTEM STATUS: ONLINE
// DISTRIBUTED COGNITION MESH: ACTIVE
// ETHICAL INTRUSION PROTOCOLS: LOADED
// DEFENSE MATRIX: OPERATIONAL
// COLLECTIVE KNOWLEDGE BASE: SYNCED`}
                </pre>
              ) : (
                'We are a collective of ethical hackers, defenders, and builders advancing security through open collaboration, hands‑on labs, CTF challenges, and responsible research.'
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a 
                href="#events" 
                className={`btn-cyber px-8 py-4 font-semibold tracking-wide relative overflow-hidden transition-all duration-500 ${
                  theme === 'hacker' 
                    ? 'bg-black border-2 border-green-400 text-green-400 font-mono hover:bg-green-400 hover:text-black hover:shadow-[0_0_30px_rgba(0,255,65,1)]' 
                    : 'bg-gradient-to-r from-cyber-blue to-cyber-purple text-white shadow-glow-accent hover:shadow-glow-accent-hover rounded-lg'
                }`}
                whileHover={{ 
                  scale: 1.05, 
                  y: -3,
                  transition: { type: "spring", stiffness: 400, damping: 17 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                {theme === 'hacker' ? '> ./scan_events.sh' : 'Explore Events'}
              </motion.a>
              <motion.button
                type="button"
                className={`btn-cyber px-8 py-4 font-semibold tracking-wide relative overflow-hidden transition-all duration-500 ${
                  theme === 'hacker' 
                    ? 'bg-black border-2 border-red-400 text-red-400 font-mono hover:bg-red-400 hover:text-black hover:shadow-[0_0_30px_rgba(255,0,64,1)]' 
                    : 'bg-gradient-to-r from-cyber-green to-cyber-blue text-black hover:shadow-[0_0_35px_rgba(0,255,65,0.7)] rounded-lg'
                }`}
                onClick={() => setShowLogin(true)}
                whileHover={{ 
                  scale: 1.05, 
                  y: -3,
                  transition: { type: "spring", stiffness: 400, damping: 17 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                {theme === 'hacker' ? '> ./join_network.sh' : 'Join The Network'}
              </motion.button>
            </div>
          </motion.div>

          {/* Floating Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-28 relative" id="capabilities">
            {[
              { 
                title: theme === 'hacker' ? '> OFFENSIVE_OPS.exe' : 'Offensive Research', 
                icon: theme === 'hacker' ? '[EXPLOIT]' : '⚔️', 
                desc: theme === 'hacker' ? '// EXPLOIT_DEV\n// VULN_TRIAGE\n// RED_TEAM_OPS\n// STATUS: ACTIVE' : 'Exploit development, vulnerability triage, red‑team simulations.' 
              },
              { 
                title: theme === 'hacker' ? '> DEFENSIVE_NET.exe' : 'Defensive Engineering', 
                icon: theme === 'hacker' ? '[SHIELD]' : '🛡️', 
                desc: theme === 'hacker' ? '// DETECTION_GRAPHS\n// THREAT_MODEL\n// SECURE_ARCH\n// STATUS: MONITORING' : 'Detection engineering, threat modeling, secure architecture.' 
              },
              { 
                title: theme === 'hacker' ? '> CTF_SWARM.exe' : 'CTF & Labs', 
                icon: theme === 'hacker' ? '[FLAG]' : '🚩', 
                desc: theme === 'hacker' ? '// CHALLENGE_SWARM\n// SKILL_ELEVATION\n// TEAM_SYNC\n// STATUS: TRAINING' : 'Hands‑on challenges fostering skill progression & teamwork.' 
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ 
                  y: -12, 
                  scale: 1.03,
                  rotateX: 5,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ 
                  duration: 0.7, 
                  delay: 0.15 * i, 
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                className={`p-8 relative overflow-hidden cursor-pointer ${i===1 ? 'float-layer-alt' : 'float-layer'} group transition-all duration-500 ${
                  theme === 'hacker' 
                    ? 'bg-black border-2 border-green-400 hover:border-green-300 hover:shadow-[0_0_35px_rgba(0,255,65,0.8)]' 
                    : 'glass-enhanced border-gradient hover:shadow-glow-accent/50'
                }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-30 transition-all duration-500 ${
                  theme === 'hacker' 
                    ? 'bg-gradient-to-br from-green-400/20 via-green-300/10 to-green-500/20' 
                    : 'bg-gradient-to-br from-cyber-blue/30 via-cyber-purple/20 to-cyber-green/30'
                }`} />
                
                <motion.div 
                  className={`mb-5 font-mono font-bold relative z-10 ${
                    theme === 'hacker' 
                      ? 'text-2xl text-green-400 drop-shadow-[0_0_10px_rgba(0,255,65,0.8)]' 
                      : 'text-4xl drop-shadow-[0_0_6px_rgba(0,217,255,0.5)]'
                  }`}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 10,
                    filter: theme === 'hacker' ? 'brightness(1.3) saturate(1.5)' : 'brightness(1.2)'
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {item.icon}
                </motion.div>
                
                <motion.h3 
                  className={`text-xl font-bold tracking-wide mb-3 relative z-10 ${
                    theme === 'hacker' 
                      ? 'text-green-400 font-mono group-hover:text-green-300' 
                      : 'bg-clip-text text-transparent bg-gradient-to-r from-cyber-blue to-cyber-green font-mono group-hover:from-cyan-400 group-hover:to-emerald-400'
                  } transition-colors duration-300`}
                  whileHover={{ scale: 1.02 }}
                >
                  {item.title}
                </motion.h3>
                
                <p className={`text-sm leading-relaxed relative z-10 transition-colors duration-300 ${
                  theme === 'hacker' 
                    ? 'text-green-300 font-mono whitespace-pre-line group-hover:text-green-200' 
                    : 'text-text-secondary group-hover:text-gray-300'
                }`}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Timeline Section */}
          <div id="events">
            <div className="text-center mb-12">
              <h2 className={`text-4xl font-bold mb-4 tracking-wide ${
                theme === 'hacker' 
                  ? 'text-green-400 font-mono drop-shadow-[0_0_10px_rgba(0,255,65,0.5)]' 
                  : 'bg-clip-text text-transparent bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-green'
              }`}>
                {theme === 'hacker' ? '> EVENT_LOG.display()' : 'Event Timeline'}
              </h2>
              <div className={`mx-auto w-40 h-px ${
                theme === 'hacker' 
                  ? 'bg-green-400 shadow-[0_0_10px_rgba(0,255,65,0.8)]' 
                  : 'bg-gradient-to-r from-transparent via-cyber-blue to-transparent'
              }`} />
            </div>
            <Timeline events={events} onEventClick={setSelectedEvent} />
          </div>

          {/* About Section */}
          <div id="about" className="mb-28">
            <div className="text-center mb-16">
              <h2 className={`text-4xl font-bold mb-4 tracking-wide ${
                theme === 'hacker' 
                  ? 'text-green-400 font-mono drop-shadow-[0_0_10px_rgba(0,255,65,0.5)]' 
                  : 'bg-clip-text text-transparent bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-green'
              }`}>
                {theme === 'hacker' ? '> ABOUT.collective()' : 'About Our Mission'}
              </h2>
              <div className={`mx-auto w-40 h-px ${
                theme === 'hacker' 
                  ? 'bg-green-400 shadow-[0_0_10px_rgba(0,255,65,0.8)]' 
                  : 'bg-gradient-to-r from-transparent via-cyber-blue to-transparent'
              } mb-8`} />
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8 }}
                className={`p-8 relative overflow-hidden ${
                  theme === 'hacker' 
                    ? 'bg-black border-2 border-green-400' 
                    : 'glass border-gradient'
                }`}
              >
                <h3 className={`text-2xl font-bold mb-6 ${
                  theme === 'hacker' 
                    ? 'text-green-400 font-mono' 
                    : 'text-cyber-blue'
                }`}>
                  {theme === 'hacker' ? '> MISSION.execute()' : 'Our Mission'}
                </h3>
                <p className={`leading-relaxed mb-6 ${
                  theme === 'hacker' 
                    ? 'text-green-300 font-mono' 
                    : 'text-text-secondary'
                }`}>
                  {theme === 'hacker' ? 
                    '// DEPLOYING ETHICAL INTRUSION METHODOLOGIES\n// FOSTERING DISTRIBUTED SECURITY COGNITION\n// EMPOWERING NEXT-GEN CYBER OPERATIVES\n// THROUGH COLLABORATIVE KNOWLEDGE SYNTHESIS' :
                    (clubInfo.mission || 'To advance cybersecurity through ethical hacking, defense research, and collaborative learning. We empower the next generation of security professionals through hands-on experience and community.')
                  }
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className={`border rounded p-3 text-center ${
                    theme === 'hacker' 
                      ? 'border-green-400 bg-black' 
                      : 'border-cyber-blue/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                      theme === 'hacker' 
                        ? 'text-green-400 font-mono' 
                        : 'text-cyber-blue'
                    }`}>{clubInfo.totalMembers || '150+'}</div>
                    <div className={`text-xs ${
                      theme === 'hacker' 
                        ? 'text-green-300 font-mono' 
                        : 'text-text-secondary'
                    }`}>
                      {theme === 'hacker' ? 'ACTIVE_NODES' : 'Active Members'}
                    </div>
                  </div>
                  <div className={`border rounded p-3 text-center ${
                    theme === 'hacker' 
                      ? 'border-green-400 bg-black' 
                      : 'border-cyber-blue/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                      theme === 'hacker' 
                        ? 'text-green-400 font-mono' 
                        : 'text-cyber-blue'
                    }`}>{clubInfo.ctfChallenges || '50+'}</div>
                    <div className={`text-xs ${
                      theme === 'hacker' 
                        ? 'text-green-300 font-mono' 
                        : 'text-text-secondary'
                    }`}>
                      {theme === 'hacker' ? 'CTF_CHALLENGES' : 'CTF Challenges'}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`p-8 ${
                  theme === 'hacker' 
                    ? 'bg-black border-2 border-green-400' 
                    : 'glass border-gradient'
                }`}
              >
                <h3 className={`text-2xl font-bold mb-6 ${
                  theme === 'hacker' 
                    ? 'text-green-400 font-mono' 
                    : 'text-cyber-blue'
                }`}>
                  {theme === 'hacker' ? '> ACHIEVEMENTS.log()' : 'Our Achievements'}
                </h3>
                <div className="space-y-4">
                  {[
                    { label: theme === 'hacker' ? 'NATIONAL_CTF.rank' : 'National CTF Ranking', value: clubInfo.nationalRanking || '#3' },
                    { label: theme === 'hacker' ? 'VULNS_DISCLOSED.count' : 'Vulnerabilities Disclosed', value: clubInfo.vulnerabilitiesDisclosed || '25+' },
                    { label: theme === 'hacker' ? 'WORKSHOPS.conducted' : 'Security Workshops', value: clubInfo.workshopsConducted || '40+' },
                    { label: theme === 'hacker' ? 'INDUSTRY.partners' : 'Industry Partners', value: clubInfo.industryPartners || '15+' }
                  ].map((item, i) => (
                    <div key={i} className={`flex justify-between items-center py-2 border-b ${
                      theme === 'hacker' 
                        ? 'border-green-400/20' 
                        : 'border-text-secondary/20'
                    }`}>
                      <span className={`text-sm ${
                        theme === 'hacker' 
                          ? 'text-green-300 font-mono' 
                          : 'text-text-secondary'
                      }`}>{item.label}</span>
                      <span className={`font-bold ${
                        theme === 'hacker' 
                          ? 'text-green-400 font-mono' 
                          : 'text-cyber-blue'
                      }`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Team Members Section */}
          <div id="team" className="mb-28">
            <div className="text-center mb-16">
              <h2 className={`text-4xl font-bold mb-4 tracking-wide ${
                theme === 'hacker' 
                  ? 'text-green-400 font-mono drop-shadow-[0_0_10px_rgba(0,255,65,0.5)]' 
                  : 'bg-clip-text text-transparent bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-green'
              }`}>
                {theme === 'hacker' ? '> CORE_TEAM.members()' : 'Core Team Members'}
              </h2>
              <div className={`mx-auto w-40 h-px ${
                theme === 'hacker' 
                  ? 'bg-green-400 shadow-[0_0_10px_rgba(0,255,65,0.8)]' 
                  : 'bg-gradient-to-r from-transparent via-cyber-blue to-transparent'
              } mb-8`} />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {(teamMembers.length > 0 ? teamMembers : [
                {
                  _id: 'default-1',
                  name: "Abhijith",
                  role: "Founder",
                  specialty: "Cybersecurity Leadership",
                  bio: "Visionary leader driving the future of ethical hacking and cybersecurity education.",
                  initials: "AB"
                },
                {
                  _id: 'default-2',
                  name: "Bhuvan",
                  role: "Co-Founder",
                  specialty: "Technical Operations",
                  bio: "Technical mastermind behind our cybersecurity infrastructure and operations.",
                  initials: "BH"
                },
                {
                  _id: 'default-3',
                  name: "Satvik",
                  role: "Core Member",
                  specialty: "Penetration Testing",
                  bio: "Expert in advanced penetration testing and vulnerability assessment techniques.",
                  initials: "SA"
                },
                {
                  _id: 'default-4',
                  name: "Tejaswini",
                  role: "Core Member",
                  specialty: "Digital Forensics",
                  bio: "Specialist in digital forensics and incident response methodologies.",
                  initials: "TE"
                }
              ]).map((member, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ 
                    y: -8, 
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  viewport={{ once: false }}
                  transition={{ 
                    duration: 0.6, 
                    delay: i * 0.1,
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                  className={`p-6 text-center group cursor-pointer relative overflow-hidden ${
                    theme === 'hacker' 
                      ? 'bg-black border-2 border-green-400 hover:border-green-300 hover:shadow-[0_0_35px_rgba(0,255,65,0.8)] transition-all duration-500' 
                      : 'glass-enhanced border-gradient hover:shadow-glow-accent/40 transition-all duration-500'
                  }`}
                >
                  {/* Animated background gradient */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${
                    theme === 'hacker' 
                      ? 'bg-gradient-to-br from-green-400/20 via-green-300/10 to-green-500/20' 
                      : 'bg-gradient-to-br from-cyber-blue/30 via-cyber-purple/20 to-cyber-green/30'
                  }`} />
                  
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl font-bold relative transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
                    theme === 'hacker' 
                      ? 'bg-black border-2 border-green-400 text-green-400 font-mono group-hover:border-green-300 group-hover:shadow-[0_0_20px_rgba(0,255,65,0.8)]' 
                      : 'bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 border-2 border-cyber-blue/50 text-cyber-blue group-hover:border-cyber-blue group-hover:shadow-[0_0_20px_rgba(48,129,247,0.6)]'
                  }`}>
                    <motion.span
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1, rotate: -6 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      {member.initials}
                    </motion.span>
                  </div>
                  
                  <motion.h3 
                    className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                      theme === 'hacker' 
                        ? 'text-green-400 font-mono group-hover:text-green-300' 
                        : 'text-cyber-blue group-hover:text-cyan-400'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {member.name}
                  </motion.h3>
                  
                  <p className={`text-sm font-semibold mb-2 transition-colors duration-300 ${
                    theme === 'hacker' 
                      ? 'text-green-300 font-mono group-hover:text-green-200' 
                      : 'text-cyber-purple group-hover:text-purple-400'
                  }`}>
                    {theme === 'hacker' ? member.role.replace(/\s+/g, '.').toLowerCase() : member.role}
                  </p>
                  
                  <p className={`text-xs mb-3 font-mono transition-colors duration-300 ${
                    theme === 'hacker' 
                      ? 'text-green-300 group-hover:text-green-200' 
                      : 'text-text-secondary group-hover:text-gray-300'
                  }`}>
                    {theme === 'hacker' ? member.specialty.replace(/\s+/g, '.').toLowerCase() : member.specialty}
                  </p>
                  
                  <p className={`text-xs leading-relaxed transition-colors duration-300 ${
                    theme === 'hacker' 
                      ? 'text-green-300 font-mono whitespace-pre-line group-hover:text-green-200' 
                      : 'text-text-secondary group-hover:text-gray-300'
                  }`}>
                    {theme === 'hacker' ? `// ${member.bio.replace(/\./g, '\n//')}` : member.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div id="contact" className="mb-20">
            <div className="text-center mb-16">
              <h2 className={`text-4xl font-bold mb-4 tracking-wide ${
                theme === 'hacker' 
                  ? 'text-green-400 font-mono drop-shadow-[0_0_10px_rgba(0,255,65,0.5)]' 
                  : 'bg-clip-text text-transparent bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-green'
              }`}>
                {theme === 'hacker' ? '> NETWORK.connect()' : 'Get In Touch'}
              </h2>
              <div className={`mx-auto w-40 h-px ${
                theme === 'hacker' 
                  ? 'bg-green-400 shadow-[0_0_10px_rgba(0,255,65,0.8)]' 
                  : 'bg-gradient-to-r from-transparent via-cyber-blue to-transparent'
              } mb-8`} />
              <p className={`max-w-2xl mx-auto ${
                theme === 'hacker' 
                  ? 'text-green-300 font-mono' 
                  : 'text-text-secondary'
              }`}>
                {theme === 'hacker' ? 
                  '// ESTABLISH SECURE COMMUNICATION CHANNEL\n// JOIN THE DISTRIBUTED KNOWLEDGE MESH\n// CONTRIBUTE TO COLLECTIVE DEFENSE PROTOCOLS' :
                  'Ready to join our community? Connect with us through multiple channels and become part of our cybersecurity network.'
                }
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: theme === 'hacker' ? "[EMAIL]" : "📧",
                  title: theme === 'hacker' ? 'EMAIL.secure' : 'Email',
                  value: clubInfo.email || "contact@anonclub.org",
                  link: `mailto:${clubInfo.email || "contact@anonclub.org"}`
                },
                {
                  icon: theme === 'hacker' ? "[DISCORD]" : "💬",
                  title: theme === 'hacker' ? 'DISCORD.mesh' : 'Discord',
                  value: theme === 'hacker' ? 'JOIN_SERVER' : 'Join Server',
                  link: clubInfo.discord || "#discord"
                },
                {
                  icon: theme === 'hacker' ? "[GITHUB]" : "🐙",
                  title: theme === 'hacker' ? 'GITHUB.repo' : 'GitHub',
                  value: theme === 'hacker' ? 'VIEW_PROJECTS' : 'View Projects',
                  link: clubInfo.github || "#github"
                },
                {
                  icon: theme === 'hacker' ? "[LOCATION]" : "🏫",
                  title: theme === 'hacker' ? 'LOCATION.node' : 'Location',
                  value: theme === 'hacker' ? 'CAMPUS.node' : (clubInfo.campusLocation || 'Tech University Campus'),
                  link: "#location"
                }
              ].map((contact, i) => (
                <motion.a
                  key={i}
                  href={contact.link}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`p-6 text-center group transition-all duration-300 block ${
                    theme === 'hacker' 
                      ? 'bg-black border-2 border-green-400 hover:border-green-300 hover:shadow-[0_0_25px_rgba(0,255,65,0.6)]' 
                      : 'glass border-gradient hover:shadow-glow-accent/30'
                  }`}
                >
                  <div className={`mb-3 group-hover:scale-110 transition-transform ${
                    theme === 'hacker' 
                      ? 'text-2xl text-green-400 font-mono font-bold' 
                      : 'text-3xl'
                  }`}>
                    {contact.icon}
                  </div>
                  <h3 className={`font-bold mb-2 ${
                    theme === 'hacker' 
                      ? 'text-green-400 font-mono' 
                      : 'text-cyber-blue'
                  }`}>
                    {contact.title}
                  </h3>
                  <p className={`text-sm ${
                    theme === 'hacker' 
                      ? 'text-green-300 font-mono' 
                      : 'text-text-secondary'
                  }`}>
                    {contact.value}
                  </p>
                </motion.a>
              ))}
            </div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6 }}
              className="text-center mt-16"
            >
              <div className={`p-8 max-w-2xl mx-auto ${
                theme === 'hacker' 
                  ? 'bg-black border-2 border-green-400' 
                  : 'glass border-gradient'
              }`}>
                <h3 className={`text-2xl font-bold mb-4 ${
                  theme === 'hacker' 
                    ? 'text-green-400 font-mono' 
                    : 'text-cyber-blue'
                }`}>
                  {theme === 'hacker' ? '> INIT.join_collective()' : 'Ready to Join?'}
                </h3>
                <p className={`mb-6 ${
                  theme === 'hacker' 
                    ? 'text-green-300 font-mono' 
                    : 'text-text-secondary'
                }`}>
                  {theme === 'hacker' ? 
                    '// EXECUTE REGISTRATION PROTOCOL\n// GAIN ACCESS TO RESTRICTED KNOWLEDGE BASE\n// CONTRIBUTE TO DISTRIBUTED DEFENSE NETWORK' :
                    'Become part of our cybersecurity community. Access exclusive resources, participate in CTF competitions, and collaborate with like-minded security enthusiasts.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    type="button"
                    className={`btn-cyber px-6 py-3 font-semibold tracking-wide relative overflow-hidden transition-all duration-300 ${
                      theme === 'hacker' 
                        ? 'bg-black border-2 border-green-400 text-green-400 font-mono hover:bg-green-400 hover:text-black hover:shadow-[0_0_20px_rgba(0,255,65,0.8)]' 
                        : 'bg-gradient-to-r from-cyber-blue to-cyber-purple text-white shadow-glow-accent hover:shadow-glow-accent-hover rounded-lg'
                    }`}
                    onClick={() => setShowLogin(true)}
                  >
                    {theme === 'hacker' ? '> ./authenticate.sh' : 'Join Now'}
                  </button>
                  <a
                    href="#events"
                    className={`btn-cyber px-6 py-3 font-semibold tracking-wide relative overflow-hidden transition-all duration-300 ${
                      theme === 'hacker' 
                        ? 'bg-black border-2 border-red-400 text-red-400 font-mono hover:bg-red-400 hover:text-black hover:shadow-[0_0_20px_rgba(255,0,64,0.8)]' 
                        : 'bg-gradient-to-r from-cyber-green to-cyber-blue text-black hover:shadow-[0_0_25px_rgba(0,255,65,0.5)] rounded-lg'
                    }`}
                  >
                    {theme === 'hacker' ? '> ./explore.sh' : 'Learn More'}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className={`py-12 ${
        theme === 'hacker' 
          ? 'bg-black border-t border-green-400' 
          : 'bg-cyber-darker border-t border-cyber-blue/20'
      }`}>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src={logo} alt="Club Logo" className="w-8 h-8 object-cover rounded mr-3" />
                <h3 className={`font-bold ${
                  theme === 'hacker' 
                    ? 'text-green-400 font-mono' 
                    : 'text-cyber-blue'
                }`}>
                  {theme === 'hacker' ? 'ANON.collective' : 'Anonymous Cybersecurity Club'}
                </h3>
              </div>
              <p className={`text-sm leading-relaxed ${
                theme === 'hacker' 
                  ? 'text-green-300 font-mono' 
                  : 'text-text-secondary'
              }`}>
                {theme === 'hacker' ? 
                  '// DISTRIBUTED SECURITY RESEARCH NETWORK\n// ETHICAL INTRUSION LABORATORY\n// KNOWLEDGE SYNTHESIS PROTOCOL' :
                  (clubInfo.footerDescription || 'Advancing cybersecurity through ethical hacking, collaborative research, and hands-on learning experiences.')
                }
              </p>
            </div>
            
            <div>
              <h4 className={`font-bold mb-4 ${
                theme === 'hacker' 
                  ? 'text-green-400 font-mono' 
                  : 'text-cyber-blue'
              }`}>
                {theme === 'hacker' ? 'QUICK.nav()' : 'Quick Links'}
              </h4>
              <ul className={`space-y-2 text-sm ${
                theme === 'hacker' 
                  ? 'text-green-300 font-mono' 
                  : 'text-text-secondary'
              }`}>
                <li><a href="#about" className="hover:text-green-400 transition">About</a></li>
                <li><a href="#events" className="hover:text-green-400 transition">Events</a></li>
                <li><a href="#team" className="hover:text-green-400 transition">Team</a></li>
                <li><a href="#contact" className="hover:text-green-400 transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className={`font-bold mb-4 ${
                theme === 'hacker' 
                  ? 'text-green-400 font-mono' 
                  : 'text-cyber-blue'
              }`}>
                {theme === 'hacker' ? 'SOCIAL.links()' : 'Connect'}
              </h4>
              <div className="flex space-x-4">
                {[
                  { icon: theme === 'hacker' ? "[DISCORD]" : "💬", label: "Discord" },
                  { icon: theme === 'hacker' ? "[GITHUB]" : "🐙", label: "GitHub" },
                  { icon: theme === 'hacker' ? "[TWITTER]" : "🐦", label: "Twitter" },
                  { icon: theme === 'hacker' ? "[EMAIL]" : "📧", label: "Email" }
                ].map((social, i) => (
                  <a
                    key={i}
                    href="#"
                    className={`hover:scale-110 transition-transform ${
                      theme === 'hacker' 
                        ? 'text-green-400 hover:text-green-300 font-mono' 
                        : 'text-2xl hover:text-cyber-blue'
                    }`}
                    title={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className={`border-t mt-8 pt-8 text-center ${
            theme === 'hacker' 
              ? 'border-green-400/20' 
              : 'border-cyber-blue/20'
          }`}>
            <p className={`text-xs ${
              theme === 'hacker' 
                ? 'text-green-300 font-mono' 
                : 'text-text-secondary'
            }`}>
              {theme === 'hacker' ? 
                '© 2025 ANON.collective :: distributed under ethical use license :: security.research.only' :
                `© 2025 Anonymous Cybersecurity Club. All rights reserved. Built with passion for security.`
              }
            </p>
          </div>
        </div>
      </footer>

      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
};

export default Home;