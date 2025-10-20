import { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { API } from '../utils/api';
import axios from 'axios';

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
        ? `Hey there! 👋 I'm NOBODY, your friendly AI for the Anonymous Cybersecurity Club! I see you're checking out the ${currentPage.name} page. Want to know more about it, or got any questions about hacking, CTFs, or our club? Just ask!`
        : `Hey! 👋 I'm NOBODY, your AI buddy for the Anonymous Cybersecurity Club! Whether you're curious about ethical hacking, want to join a CTF, or just exploring - I'm here to help! What's on your mind?`;
      
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

  // AI-Powered Response with Google Gemini - REWRITTEN FOR RELIABILITY
  const generateAIResponse = async (userMessage) => {
    try {
      // Short, focused prompt for better AI responses
      const prompt = `You are NOBODY, the AI assistant for Anonymous Cybersecurity Club at SDMCET (founded 2024).

OUR CLUB:
- Founders: Abhijith (Penetration Testing) & Bhuvanendra (Dark Web Security)
- Team: Satvik, Tejaswini, Ramya, Chaithanaya, Deepak
- 50+ CTF wins, Top 10 nationally, 25+ CVE discoveries, 150+ members
- Email: anonymous.sdmcet@gmail.com
- Activities: Weekly workshops, monthly CTFs, hackathons, bug bounty sessions

YOUR EXPERTISE: Ethical hacking, web security, CTFs, network security, cryptography, malware analysis, social engineering, bug bounties, career guidance.

PERSONALITY: Friendly, enthusiastic, conversational. Use simple language and occasional emojis. Be encouraging and helpful!

INSTRUCTIONS:
- Chat naturally like a helpful friend
- Keep responses under 80 words
- If asked about non-cybersecurity topics, politely redirect to security/club topics
- Be passionate about teaching and encouraging

User: ${userMessage}

Your response (be conversational and friendly):`;

      // Make the API call with better error handling
      const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
      const apiKey = 'AIzaSyAJlpXG0gJEX2xXqfUny43wkcok-Iwsavs';
      
      console.log('🤖 NOBODY: Calling Gemini API...');
      
      const response = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 250,
            topP: 0.95,
            topK: 40
          },
          safetySettings: [
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
          ]
        })
      });

      console.log('� API Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('📦 API Response Data:', data);

      // Extract AI response
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const aiText = data.candidates[0].content.parts[0].text.trim();
        console.log('✅ AI Response Extracted:', aiText.substring(0, 100) + '...');
        return aiText;
      }

      console.warn('⚠️ Unexpected response structure:', data);
      throw new Error('Invalid response structure from API');
      
    } catch (error) {
      console.error('❌ AI Error:', error.message);
      console.log('🔄 Falling back to local responses');
      return generateResponse(userMessage);
    }
  };

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
        text: '🎯 We host various cybersecurity events:\n\n• Weekly security workshops\n• Monthly CTF competitions\n• Annual hackathons\n• Expert webinars\n• Bug bounty programs\n\nCheck the Events page to see what\'s coming up!',
        action: { type: 'navigate', path: '/events', label: 'View Events' }
      };
    }

    // Team
    if (msg.includes('team') || msg.includes('member') || msg.includes('founder') || msg.includes('who')) {
      return {
        text: '👥 Our talented team:\n\n• Abhijith - Technical Lead (Penetration Testing)\n• Bhuvanendra G Bhagwat - VP Operations (Dark Web Security)\n• Core Team: Satvik, Tejaswini, Ramya, Chaithanaya, Deepak\n\nMeet them and learn about their expertise!',
        action: { type: 'navigate', path: '/about', label: 'Meet the Team' }
      };
    }

    // Cybersecurity concepts
    if (msg.includes('what is') || msg.includes('explain') || msg.includes('tell me about')) {
      if (msg.includes('ctf') || msg.includes('capture the flag')) {
        return '🚩 CTF (Capture The Flag) is a cybersecurity competition where participants solve challenges to find hidden "flags".\n\n📚 Types:\n• Jeopardy-style (various categories)\n• Attack-Defense (real-time battles)\n• Mixed format\n\nWe host monthly CTF events - perfect for learning!';
      }
      if (msg.includes('penetration') || msg.includes('pentesting') || msg.includes('pen test')) {
        return '🔓 Penetration Testing is ethical hacking to find security vulnerabilities before malicious actors do.\n\n🎯 Phases:\n1. Reconnaissance\n2. Scanning\n3. Exploitation\n4. Post-exploitation\n5. Reporting\n\nJoin our workshops to learn hands-on!';
      }
      if (msg.includes('owasp')) {
        return '🛡️ OWASP Top 10 are the most critical web security risks:\n\n1. Broken Access Control\n2. Cryptographic Failures\n3. Injection\n4. Insecure Design\n5. Security Misconfiguration\n...and more!\n\nWe cover these in our web security workshops!';
      }
    }

    // How to join/start
    if (msg.includes('how to join') || msg.includes('get started') || msg.includes('beginner')) {
      return '🚀 Welcome! Here\'s how to get started:\n\n1. Click menu → LOGIN to create an account\n2. Join our Discord community\n3. Attend beginner workshops\n4. Practice on platforms like:\n   • TryHackMe\n   • HackTheBox\n   • PentesterLab\n5. Participate in our CTF events\n\nWe welcome all skill levels!';
    }

    // Contact/reach
    if (msg.includes('contact') || msg.includes('email') || msg.includes('reach') || msg.includes('discord')) {
      return '📧 Get in touch with us:\n\n• Email: anonymous.sdmcet@gmail.com\n• Discord: Join link on About page\n• Campus: SDMCET\n\nWe\'re always happy to help aspiring security professionals!';
    }

    // Casual greetings - respond naturally
    if (msg.match(/^(hi|hello|hey|yo|sup|greetings)$/i)) {
      const greetings = [
        "Hey there! 👋 I'm NOBODY, your cybersecurity buddy! What's on your mind today?",
        "Hello! 😊 Ready to dive into some hacking talk? Or just want to know about our club?",
        "Hey! 🎯 NOBODY here - let's chat about security, CTFs, or anything club-related!",
        "Hi! 👾 I'm your AI companion for all things cybersecurity! How can I help?"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // How are you
    if (msg.includes('how are you') || msg.includes('how r u') || msg.includes('how do you do')) {
      return "I'm doing great! 🚀 Always excited to talk about cybersecurity and help people learn. How about you? Interested in hacking, CTFs, or our club activities?";
    }

    // Who are you
    if (msg.match(/^(who are you|what are you|who r u|what r u)$/i)) {
      return "I'm NOBODY! 🎭 Your AI assistant for the Anonymous Cybersecurity Club. I'm here to chat about ethical hacking, answer questions about our club, and help you navigate the site. Think of me as your cyber-buddy! 😊";
    }

    // Thank you
    if (msg.includes('thank') || msg.includes('thanks')) {
      return "You're welcome! 😊 Happy to help! Got any more questions about cybersecurity or our club?";
    }

    // Bye
    if (msg.match(/^(bye|goodbye|see you|cya|later)$/i)) {
      return "See you later! 👋 Feel free to chat anytime you need help with security stuff or have questions about the club. Happy hacking! 🔐";
    }

    // Default: didn't understand but be friendly
    return `Hey! 😊 I'm NOBODY, and I love chatting about cybersecurity and our club!\n\nI can help you with:\n• Hacking & security concepts\n• Our awesome events & CTF competitions\n• Meeting the team\n• Getting started in cybersecurity\n• Finding your way around the site\n\nWhat would you like to talk about?`;
  };

  // Handle sending message
  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    // Try AI first
    console.log('🤖 NOBODY: Sending to AI:', userInput);
    
    try {
      const aiResponse = await generateAIResponse(userInput);
      console.log('✅ AI Response received:', aiResponse);
      
      // Check if we actually got an AI response or fallback
      if (!aiResponse || aiResponse.includes("I'm NOBODY, your cybersecurity assistant")) {
        console.warn('⚠️ Using fallback response');
      }
      
      // Add navigation if relevant
      let action = null;
      const msg = userInput.toLowerCase();
      if (msg.includes('event') && !msg.includes('what') && !msg.includes('tell')) {
        action = { type: 'navigate', path: '/events', label: 'View Events' };
      } else if ((msg.includes('team') || msg.includes('about')) && !msg.includes('what') && !msg.includes('tell')) {
        action = { type: 'navigate', path: '/about', label: 'Meet Team' };
      } else if (msg.includes('home') && (msg.includes('go') || msg.includes('take me'))) {
        action = { type: 'navigate', path: '/', label: 'Go Home' };
      } else if (msg.includes('dashboard') && user?.role === 'admin') {
        action = { type: 'navigate', path: '/dashboard', label: 'Open Dashboard' };
      }

      const botMessage = {
        type: 'bot',
        text: aiResponse,
        action,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('❌ AI Error in handleSend:', error);
      
      // Fallback
      const response = generateResponse(userInput);
      const botMessage = {
        type: 'bot',
        text: typeof response === 'string' ? response : response.text,
        action: typeof response === 'object' ? response.action : null,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
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
                  <span className="font-mono font-bold">NOBODY</span>
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
                    NOBODY AI
                  </h3>
                  <p className="text-xs text-text-secondary">Cybersecurity Expert</p>
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
