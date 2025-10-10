import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';
import { API } from '../utils/api';

const About = () => {
  const { theme } = useTheme();
  const [clubInfo, setClubInfo] = useState({
    mission: "To advance cybersecurity through ethical hacking, defense research, and collaborative learning.",
    vision: "Building the next generation of cybersecurity professionals through hands-on experience and community.",
    founded: "2023",
    location: "Global Network",
    members: "150+ Active Members"
  });

  useEffect(() => {
    // Fetch club info from backend
    fetch(API + '/club-info')
      .then(res => res.json())
      .then(data => setClubInfo(data))
      .catch(err => console.log('Using default club info'));
    
    // Fetch team members from backend
    fetch(API + '/team-members')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setTeamMembers(data);
        }
      })
      .catch(err => console.log('Using default team members'));
  }, []);

  const [teamMembers] = useState([
    {
      id: 1,
      name: "Alex Chen",
      role: "Founder & Lead Researcher",
      specialty: "Penetration Testing",
      image: "/api/placeholder/200/200",
      bio: "Expert in red team operations with 8+ years in cybersecurity research."
    },
    {
      id: 2,
      name: "Sarah Martinez",
      role: "VP of Operations",
      specialty: "Digital Forensics",
      image: "/api/placeholder/200/200",
      bio: "Digital forensics specialist focused on incident response and malware analysis."
    },
    {
      id: 3,
      name: "Marcus Johnson",
      role: "Education Director",
      specialty: "Network Security",
      image: "/api/placeholder/200/200",
      bio: "Network security architect with extensive experience in enterprise defense."
    },
    {
      id: 4,
      name: "Elena Petrov",
      role: "CTF Captain",
      specialty: "Cryptography",
      image: "/api/placeholder/200/200",
      bio: "Cryptography expert and competitive CTF player with multiple championship wins."
    },
    {
      id: 5,
      name: "David Kim",
      role: "Community Manager",
      specialty: "Social Engineering",
      image: "/api/placeholder/200/200",
      bio: "Social engineering specialist focusing on security awareness and training."
    },
    {
      id: 6,
      name: "Rachel Thompson",
      role: "Research Lead",
      specialty: "IoT Security",
      image: "/api/placeholder/200/200",
      bio: "IoT security researcher specializing in embedded systems and hardware hacking."
    }
  ]);

  const achievements = [
    { icon: "🏆", title: "50+ CTF Wins", desc: "Competitive success in major cybersecurity competitions" },
    { icon: "🎓", title: "500+ Trained", desc: "Security professionals trained through our programs" },
    { icon: "🔒", title: "25+ CVEs", desc: "Responsible vulnerability disclosures discovered by members" },
    { icon: "🌐", title: "Global Reach", desc: "Members across 30+ countries worldwide" }
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden ${theme === 'hacker' ? 'bg-hacker-bg text-hacker-green' : 'bg-cyber-dark'}`}>
      <Navbar />
      
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-20 px-6 md:px-10"
      >
        <div className="container mx-auto text-center">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`text-5xl md:text-6xl font-bold mb-6 ${theme === 'hacker' ? 'text-hacker-green hacker-glow-green' : 'bg-clip-text text-transparent bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-green'}`}
          >
            {theme === 'hacker' ? 'ABOUT // THE_COLLECTIVE' : 'About Our Mission'}
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-secondary max-w-3xl mx-auto"
          >
            {clubInfo.mission}
          </motion.p>
        </div>
      </motion.section>

      {/* Club Stats */}
      <section className="py-16 px-6 md:px-10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Founded", value: clubInfo.founded },
              { label: "Location", value: clubInfo.location },
              { label: "Members", value: clubInfo.members },
              { label: "Specialties", value: "15+" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`text-center p-6 rounded-lg ${theme === 'hacker' ? 'hacker-panel' : 'glass border-gradient'}`}
              >
                <div className={`text-3xl font-bold mb-2 ${theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-blue'}`}>
                  {stat.value}
                </div>
                <div className="text-text-secondary">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 px-6 md:px-10">
        <div className="container mx-auto">
          <h2 className={`text-3xl font-bold text-center mb-12 ${theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-blue'}`}>
            {theme === 'hacker' ? 'ACHIEVEMENTS // LOG' : 'Our Achievements'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`text-center p-6 rounded-lg ${theme === 'hacker' ? 'hacker-panel' : 'glass'} hover:scale-105 transition-transform`}
              >
                <div className="text-4xl mb-4">{achievement.icon}</div>
                <h3 className={`text-xl font-bold mb-2 ${theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-blue'}`}>
                  {achievement.title}
                </h3>
                <p className="text-text-secondary text-sm">{achievement.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-16 px-6 md:px-10">
        <div className="container mx-auto">
          <h2 className={`text-3xl font-bold text-center mb-12 ${theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-blue'}`}>
            {theme === 'hacker' ? 'CORE // TEAM_MEMBERS' : 'Meet Our Team'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`${theme === 'hacker' ? 'hacker-panel' : 'glass border-gradient'} p-6 rounded-lg text-center hover:scale-105 transition-transform group`}
              >
                <div className="relative mb-6">
                  <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${theme === 'hacker' ? 'from-hacker-green/20 to-hacker-aqua/20' : 'from-cyber-blue/20 to-cyber-purple/20'} flex items-center justify-center text-6xl font-mono ${theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-blue'} group-hover:scale-110 transition-transform`}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-mono ${theme === 'hacker' ? 'bg-hacker-green/20 text-hacker-green border border-hacker-green/40' : 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/40'}`}>
                    {member.specialty}
                  </div>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-blue'}`}>
                  {member.name}
                </h3>
                <p className={`text-sm font-mono mb-3 ${theme === 'hacker' ? 'text-hacker-aqua' : 'text-cyber-green'}`}>
                  {member.role}
                </p>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-16 px-6 md:px-10">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            className={`${theme === 'hacker' ? 'hacker-panel' : 'glass border-gradient'} p-12 rounded-lg max-w-3xl mx-auto`}
          >
            <h2 className={`text-3xl font-bold mb-6 ${theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-blue'}`}>
              {theme === 'hacker' ? 'JOIN // THE_NETWORK' : 'Ready to Join Us?'}
            </h2>
            <p className="text-text-secondary mb-8 text-lg">
              {theme === 'hacker' ? 'Initialize connection to our distributed learning mesh. Contribute to the collective knowledge base.' : 'Be part of a community dedicated to advancing cybersecurity through ethical research and collaborative learning.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className={`btn-cyber px-8 py-4 rounded-lg font-semibold ${theme === 'hacker' ? 'bg-hacker-panel/70 border border-hacker-green/40 text-hacker-green shadow-glow-hacker-green hover:bg-hacker-panel/90' : 'bg-gradient-to-r from-cyber-blue to-cyber-purple text-white hover:shadow-glow-accent'}`}>
                {theme === 'hacker' ? 'apply()' : 'Apply Now'}
              </button>
              <button className={`btn-cyber px-8 py-4 rounded-lg font-semibold ${theme === 'hacker' ? 'bg-hacker-panel/70 border border-hacker-aqua/40 text-hacker-aqua hover:bg-hacker-panel/90' : 'bg-gradient-to-r from-cyber-green to-cyber-blue text-black hover:shadow-[0_0_25px_rgba(0,255,65,0.5)]'}`}>
                {theme === 'hacker' ? 'learn_more()' : 'Learn More'}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;