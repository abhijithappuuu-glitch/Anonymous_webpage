import { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { API } from '../utils/api';

const Jarvis = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hovering, setHovering] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const { theme } = useTheme();
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Website Knowledge Graph
  const websiteKnowledge = {
    pages: {
      '/': {
        name: 'Home',
        description: 'Landing page with 3D logo, club statistics, timeline, and featured events',
        features: ['3D Anonymous Logo', 'Club Statistics', 'Timeline History', 'Upcoming Events', 'Code Rain Effect'],
        keywords: ['home', 'main', 'landing', 'welcome', 'start']
      },
      '/about': {
        name: 'About',
        description: 'Information about the club mission, vision, team members, and achievements',
        features: ['Mission Statement', 'Vision', 'Team Members', 'Achievements', 'Club Statistics', 'Join CTA'],
        keywords: ['about', 'team', 'members', 'mission', 'vision', 'who we are', 'founders']
      },
      '/events': {
        name: 'Events',
        description: 'Browse all past and upcoming cybersecurity events, workshops, and hackathons',
        features: ['Event Listings', 'Filter by Category', 'Search Events', 'Event Details', 'Registration'],
        keywords: ['events', 'workshops', 'hackathons', 'ctf', 'competitions', 'calendar']
      },
      '/admin': {
        name: 'Admin Panel',
        description: 'Legacy admin panel (admin only)',
        restricted: true,
        keywords: ['admin', 'control']
      },
      '/dashboard': {
        name: 'Admin Dashboard',
        description: 'Comprehensive dashboard to manage all website content including events, team, gallery, and club info',
        restricted: true,
        features: ['Events Manager', 'Club Info Editor', 'Team Members', 'Timeline', 'Gallery', 'Home Content'],
        keywords: ['dashboard', 'admin', 'manage', 'edit', 'control panel']
      }
    },
    
    features: {
      'events': {
        description: 'Workshops, hackathons, webinars, and conferences organized by the club',
        location: '/events',
        categories: ['Workshop', 'Hackathon', 'Webinar', 'Conference', 'Other']
      },
      'team': {
        description: 'Core team members including founders, technical leads, and specialists',
        location: '/about',
        members: ['Abhijith', 'Bhuvanendra G Bhagwat', 'Satvik', 'Tejaswini']
      },
      'theme': {
        description: 'Toggle between Hacker Mode (green terminal) and Default Mode (cyber purple)',
        action: 'Click HCK/DEF button in navbar',
        keywords: ['theme', 'hacker mode', 'dark mode', 'colors', 'style']
      },
      'login': {
        description: 'User authentication system for members',
        action: 'Click LOGIN in menu',
        keywords: ['login', 'signin', 'authenticate', 'account']
      },
      'admin': {
        description: 'Admin dashboard for managing website content',
        location: '/dashboard',
        restricted: true,
        keywords: ['admin', 'dashboard', 'manage', 'edit']
      }
    },

    quickActions: [
      { label: 'View Events', action: '/events', icon: '📅' },
      { label: 'Meet the Team', action: '/about', icon: '👥' },
      { label: 'Go Home', action: '/', icon: '🏠' },
      { label: 'Toggle Theme', action: 'theme', icon: '🎨' }
    ],

    faq: [
      {
        q: ['join', 'how to join', 'become member', 'register'],
        a: 'You can join by clicking the LOGIN button in the menu and creating an account. For more information about membership, visit our About page where you\'ll find details about the club and a "Join Us" section.'
      },
      {
        q: ['events', 'upcoming events', 'workshops', 'when is', 'schedule'],
        a: 'Check out our Events page to see all upcoming workshops, hackathons, and competitions. You can filter by category and register for events directly.'
      },
      {
        q: ['contact', 'email', 'reach', 'get in touch'],
        a: 'You can reach us through the contact information on our About page, or connect with us through our social media links in the footer.'
      },
      {
        q: ['about', 'who are you', 'what is this', 'anonymous'],
        a: 'We are the Anonymous Cybersecurity Club - a community dedicated to advancing cybersecurity through ethical hacking, research, and education. Visit our About page to learn more about our mission, vision, and team.'
      },
      {
        q: ['ctf', 'capture the flag', 'competition', 'hackathon'],
        a: 'We regularly organize CTF competitions and hackathons! Check the Events page for upcoming competitions. We also participate in national-level CTF events and have achieved top rankings.'
      },
      {
        q: ['theme', 'hacker mode', 'colors', 'change appearance'],
        a: 'You can toggle between Hacker Mode (green terminal theme) and Default Mode (cyber theme) by clicking the HCK/DEF button in the navigation bar.'
      }
    ]
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial greeting based on current page
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const currentPage = websiteKnowledge.pages[location.pathname];
      const greeting = currentPage 
        ? `Hello! I'm Jarvis, your personal assistant. I see you're on the ${currentPage.name} page. How can I help you explore our cybersecurity club today?`
        : `Hello! I'm Jarvis, your personal assistant for the Anonymous Cybersecurity Club. How may I assist you today?`;
      
      setMessages([{
        type: 'bot',
        text: greeting,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, location.pathname]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Intelligent response system
  const generateResponse = (userMessage) => {
    const msg = userMessage.toLowerCase().trim();
    const currentPage = websiteKnowledge.pages[location.pathname];

    // Navigation requests
    if (msg.includes('take me') || msg.includes('go to') || msg.includes('navigate') || msg.includes('show me')) {
      for (const [path, page] of Object.entries(websiteKnowledge.pages)) {
        if (page.keywords.some(keyword => msg.includes(keyword))) {
          if (page.restricted && (!user || user.role !== 'admin')) {
            return `I'm sorry, but the ${page.name} is only accessible to administrators. ${user ? 'You need admin privileges to access this area.' : 'Please login with an admin account first.'}`;
          }
          return {
            text: `I can take you to the ${page.name} page. ${page.description}. Would you like me to navigate there now?`,
            action: { type: 'navigate', path, label: `Go to ${page.name}` }
          };
        }
      }
    }

    // Where is X?
    if (msg.includes('where') || msg.includes('find') || msg.includes('locate')) {
      for (const [path, page] of Object.entries(websiteKnowledge.pages)) {
        if (page.keywords.some(keyword => msg.includes(keyword))) {
          if (page.restricted && (!user || user.role !== 'admin')) {
            return `The ${page.name} is restricted to administrators only.`;
          }
          return {
            text: `You can find ${page.description.toLowerCase()} on the ${page.name} page.`,
            action: { type: 'navigate', path, label: `Visit ${page.name}` }
          };
        }
      }
    }

    // FAQ matching
    for (const faqItem of websiteKnowledge.faq) {
      if (faqItem.q.some(q => msg.includes(q))) {
        return faqItem.a;
      }
    }

    // Current page help
    if (msg.includes('help') || msg.includes('what can') || msg.includes('?')) {
      if (currentPage) {
        const features = currentPage.features ? `\n\nKey features on this page:\n${currentPage.features.map(f => `• ${f}`).join('\n')}` : '';
        return `You're currently on the ${currentPage.name} page. ${currentPage.description}.${features}\n\nI can help you navigate the website, find information, or answer questions about our club. What would you like to know?`;
      }
    }

    // Theme toggle
    if (msg.includes('theme') || msg.includes('hacker mode') || msg.includes('change color')) {
      return 'You can toggle between themes using the HCK/DEF button in the top navigation bar. Hacker Mode gives you a classic green terminal look, while Default Mode has a modern cyber aesthetic.';
    }

    // Login/Account
    if (msg.includes('login') || msg.includes('sign in') || msg.includes('account')) {
      if (user) {
        return `You're already logged in as ${user.username}. ${user.role === 'admin' ? 'As an admin, you have access to the Dashboard for managing content.' : 'Welcome back!'}`;
      }
      return 'To login, click the menu button (three dots) in the navigation bar and select LOGIN. You\'ll be able to create an account or sign in to access member features.';
    }

    // Admin/Dashboard
    if ((msg.includes('admin') || msg.includes('dashboard') || msg.includes('manage')) && user?.role === 'admin') {
      return {
        text: 'As an admin, you have access to the comprehensive Dashboard where you can manage all website content including events, team members, gallery, club information, and more.',
        action: { type: 'navigate', path: '/dashboard', label: 'Open Dashboard' }
      };
    }

    // Events
    if (msg.includes('event') || msg.includes('workshop') || msg.includes('hackathon') || msg.includes('ctf')) {
      return {
        text: 'We host various cybersecurity events including workshops, hackathons, webinars, and CTF competitions. You can browse all upcoming and past events on our Events page.',
        action: { type: 'navigate', path: '/events', label: 'View Events' }
      };
    }

    // Team
    if (msg.includes('team') || msg.includes('member') || msg.includes('founder') || msg.includes('who')) {
      return {
        text: 'Our club is led by talented founders and core team members specializing in various areas of cybersecurity. You can meet the team, read their bios, and learn about their expertise on our About page.',
        action: { type: 'navigate', path: '/about', label: 'Meet the Team' }
      };
    }

    // Default: didn't understand
    return `I'm here to help you navigate the Anonymous Cybersecurity Club website. I can:\n\n• Guide you to different pages\n• Answer questions about the club\n• Help you find events and team information\n• Assist with website features\n\nWhat would you like to know?`;
  };

  // Handle sending message
  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate thinking delay
    setTimeout(() => {
      const response = generateResponse(inputValue);
      const botMessage = {
        type: 'bot',
        text: typeof response === 'string' ? response : response.text,
        action: typeof response === 'object' ? response.action : null,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  // Handle action button click
  const handleAction = (action) => {
    if (action.type === 'navigate') {
      navigate(action.path);
      setIsOpen(false);
      setMessages([]);
    }
  };

  return (
    <>
      {/* Floating Icon */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            <motion.button
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`relative w-16 h-16 rounded-full shadow-2xl backdrop-blur-md border-2 flex items-center justify-center group ${
                theme === 'hacker'
                  ? 'bg-gradient-to-br from-hacker-green/20 to-hacker-aqua/20 border-hacker-green/40 hover:border-hacker-green shadow-[0_0_30px_rgba(0,255,65,0.3)]'
                  : 'bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 border-cyber-blue/40 hover:border-cyber-blue shadow-[0_0_30px_rgba(0,217,255,0.3)]'
              }`}
            >
              {/* Pulsing effect */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute inset-0 rounded-full ${
                  theme === 'hacker' ? 'bg-hacker-green/30' : 'bg-cyber-blue/30'
                }`}
              />
              
              {/* AI Icon */}
              <span className="text-2xl relative z-10">🤖</span>
            </motion.button>

            {/* Hover Label */}
            <AnimatePresence>
              {hovering && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className={`absolute right-20 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg backdrop-blur-md border whitespace-nowrap ${
                    theme === 'hacker'
                      ? 'bg-hacker-panel/90 border-hacker-green/40 text-hacker-green'
                      : 'bg-black/90 border-cyber-blue/40 text-cyber-blue'
                  }`}
                >
                  <span className="font-mono font-bold">Jarvis</span>
                  <span className="text-xs opacity-70 ml-2">Your AI Assistant</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] z-50 flex flex-col backdrop-blur-xl rounded-2xl shadow-2xl border overflow-hidden"
            style={{
              background: theme === 'hacker' 
                ? 'rgba(5, 11, 10, 0.95)' 
                : 'rgba(0, 0, 0, 0.95)'
            }}
          >
            {/* Header */}
            <div className={`px-6 py-4 border-b flex items-center justify-between ${
              theme === 'hacker'
                ? 'bg-hacker-panel/50 border-hacker-green/30'
                : 'bg-white/5 border-cyber-blue/30'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  theme === 'hacker'
                    ? 'bg-gradient-to-br from-hacker-green/20 to-hacker-aqua/20 border border-hacker-green/40'
                    : 'bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 border border-cyber-blue/40'
                }`}>
                  <span className="text-xl">🤖</span>
                </div>
                <div>
                  <h3 className={`font-bold ${theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-blue'}`}>
                    Jarvis
                  </h3>
                  <p className="text-xs text-text-secondary">AI Website Assistant</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setMessages([]);
                }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 ${
                  theme === 'hacker' ? 'text-hacker-green' : 'text-cyber-blue'
                }`}
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.type === 'user'
                      ? theme === 'hacker'
                        ? 'bg-hacker-green/20 text-hacker-green border border-hacker-green/30'
                        : 'bg-cyber-blue/20 text-white border border-cyber-blue/30'
                      : 'bg-white/5 text-white border border-white/10'
                  }`}>
                    <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
                    
                    {msg.action && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAction(msg.action)}
                        className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium border ${
                          theme === 'hacker'
                            ? 'bg-hacker-green/20 text-hacker-green border-hacker-green/40 hover:bg-hacker-green/30'
                            : 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue/40 hover:bg-cyber-blue/30'
                        }`}
                      >
                        {msg.action.label} →
                      </motion.button>
                    )}
                    
                    <p className="text-xs opacity-50 mt-2">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className={`w-2 h-2 rounded-full ${theme === 'hacker' ? 'bg-hacker-green' : 'bg-cyber-blue'}`}
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className={`w-2 h-2 rounded-full ${theme === 'hacker' ? 'bg-hacker-green' : 'bg-cyber-blue'}`}
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className={`w-2 h-2 rounded-full ${theme === 'hacker' ? 'bg-hacker-green' : 'bg-cyber-blue'}`}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className={`px-4 py-2 border-t ${
              theme === 'hacker' ? 'border-hacker-green/20' : 'border-cyber-blue/20'
            }`}>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {websiteKnowledge.quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (action.action === 'theme') {
                        setInputValue('change theme');
                      } else {
                        navigate(action.action);
                        setIsOpen(false);
                        setMessages([]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap border ${
                      theme === 'hacker'
                        ? 'bg-hacker-panel/50 text-hacker-green border-hacker-green/30 hover:bg-hacker-panel'
                        : 'bg-white/5 text-cyber-blue border-cyber-blue/30 hover:bg-white/10'
                    }`}
                  >
                    {action.icon} {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className={`px-4 py-4 border-t ${
              theme === 'hacker'
                ? 'bg-hacker-panel/30 border-hacker-green/30'
                : 'bg-white/5 border-cyber-blue/30'
            }`}>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className={`flex-1 px-4 py-2 rounded-lg text-sm focus:outline-none border ${
                    theme === 'hacker'
                      ? 'bg-hacker-panel/50 border-hacker-green/30 text-hacker-green placeholder-hacker-green/50 focus:border-hacker-green'
                      : 'bg-black/30 border-cyber-blue/30 text-white placeholder-gray-400 focus:border-cyber-blue'
                  }`}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${
                    theme === 'hacker'
                      ? 'bg-hacker-green/20 text-hacker-green border border-hacker-green/40 hover:bg-hacker-green/30 disabled:opacity-50'
                      : 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/40 hover:bg-cyber-blue/30 disabled:opacity-50'
                  }`}
                >
                  Send
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Jarvis;
