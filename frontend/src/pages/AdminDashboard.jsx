import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { API } from '../utils/api';
import Navbar from '../components/Navbar';

// Import tab components
import EventsManager from '../components/admin/EventsManager';
import ClubInfoEditor from '../components/admin/ClubInfoEditor';
import TeamMembersEditor from '../components/admin/TeamMembersEditor';
import TimelineEditor from '../components/admin/TimelineEditor';
import GalleryManager from '../components/admin/GalleryManager';
import HomeContentEditor from '../components/admin/HomeContentEditor';
import UsersManager from '../components/admin/UsersManager';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const token = user?.token;
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events');
  const [stats, setStats] = useState({
    events: 0,
    users: 0,
    teamMembers: 0,
    galleryImages: 0,
    timelineEvents: 0
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch all data to get counts
      const [events, timeline, gallery] = await Promise.all([
        fetch(`${API}/events`, { headers }).then(r => r.json()),
        fetch(`${API}/admin/timeline`, { headers }).then(r => r.json()),
        fetch(`${API}/admin/gallery`, { headers }).then(r => r.json())
      ]);

      setStats({
        events: events.length || 0,
        users: 0, // Will be implemented
        teamMembers: 0,
        galleryImages: gallery.length || 0,
        timelineEvents: timeline.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const tabs = [
    { id: 'events', label: 'Events', icon: '📅', component: EventsManager },
    { id: 'club-info', label: 'Club Info', icon: 'ℹ️', component: ClubInfoEditor },
    { id: 'team', label: 'Team Members', icon: '👥', component: TeamMembersEditor },
    { id: 'timeline', label: 'Timeline', icon: '⏱️', component: TimelineEditor },
    { id: 'gallery', label: 'Gallery', icon: '🖼️', component: GalleryManager },
    { id: 'home', label: 'Home Content', icon: '🏠', component: HomeContentEditor },
    { id: 'users', label: 'Users', icon: '👤', component: UsersManager }
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component;

  return (
    <div className={`min-h-screen ${theme === 'hacker' ? 'bg-hacker-bg text-hacker-green' : 'bg-cyber-dark text-white'}`}>
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className={`text-4xl font-bold mb-2 ${theme === 'hacker' ? 'text-hacker-green hacker-glow-green' : 'text-cyber-blue'}`}>
            {theme === 'hacker' ? 'ADMIN // CONTROL_PANEL' : 'Admin Dashboard'}
          </h1>
          <p className="text-text-secondary">
            {theme === 'hacker' ? '> root@anonymous:~# system_management' : 'Manage all website content and settings'}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Events', value: stats.events, icon: '📅', color: 'blue' },
            { label: 'Timeline', value: stats.timelineEvents, icon: '⏱️', color: 'purple' },
            { label: 'Gallery', value: stats.galleryImages, icon: '🖼️', color: 'green' },
            { label: 'Team', value: stats.teamMembers, icon: '👥', color: 'yellow' },
            { label: 'Users', value: stats.users, icon: '👤', color: 'red' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`${theme === 'hacker' ? 'hacker-panel' : 'glass'} p-4 rounded-lg text-center`}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className={`text-2xl font-bold ${theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-blue'}`}>
                {stat.value}
              </div>
              <div className="text-xs text-text-secondary">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs Navigation */}
        <div className={`${theme === 'hacker' ? 'hacker-panel' : 'glass'} rounded-lg p-2 mb-6`}>
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? theme === 'hacker'
                      ? 'bg-hacker-green/20 text-hacker-green border border-hacker-green/40 shadow-glow-hacker-green'
                      : 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/40'
                    : 'text-text-secondary hover:bg-white/5'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {ActiveComponent && <ActiveComponent refreshStats={fetchStats} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
