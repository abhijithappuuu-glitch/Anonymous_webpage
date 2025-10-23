import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const News = () => {
  const [newsData, setNewsData] = useState({ global: [], indian: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('global');
  const [weekInfo, setWeekInfo] = useState({ weekNumber: 0, year: 0 });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/news`);
      
      if (response.data.success) {
        setNewsData({
          global: response.data.data.global || [],
          indian: response.data.data.indian || []
        });
        setWeekInfo({
          weekNumber: response.data.data.weekNumber || 0,
          year: response.data.data.year || new Date().getFullYear()
        });
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const NewsCard = ({ article, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-black/60 backdrop-blur-lg border border-green-400/30 rounded-lg p-6 hover:border-green-400 transition-all duration-300 group hover:shadow-lg hover:shadow-green-400/20"
    >
      {article.imageUrl && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      )}
      
      <h3 className="text-xl font-bold text-green-400 mb-3 group-hover:text-green-300 transition-colors">
        {article.title}
      </h3>
      
      <p className="text-gray-300 text-sm leading-relaxed mb-4">
        {article.summary}
      </p>
      
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-green-400/20">
        <div className="flex items-center gap-2">
          <span className="text-green-400 text-sm">📰</span>
          <span className="text-gray-400 text-xs italic">{article.source}</span>
        </div>
        
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-green-400/10 hover:bg-green-400/20 text-green-400 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105"
        >
          Read More
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </a>
      </div>
    </motion.div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📰</div>
      <p className="text-gray-400 text-lg">No news available this week.</p>
      <p className="text-gray-500 text-sm mt-2">Check back soon for updates!</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Header Section */}
      <div className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-green-400/5 to-transparent"></div>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-7xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-green-400">🔒 Weekly</span>{' '}
            <span className="text-white">Cybersecurity Digest</span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl mb-2">
            Week {weekInfo.weekNumber}, {weekInfo.year}
          </p>
          
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
            Stay updated with the latest cybersecurity news from around the world and India
          </p>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Tab Switcher */}
        <div className="flex justify-center mb-8 gap-4">
          <button
            onClick={() => setActiveTab('global')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'global'
                ? 'bg-green-400 text-black shadow-lg shadow-green-400/50'
                : 'bg-black/40 text-gray-400 border border-green-400/30 hover:border-green-400'
            }`}
          >
            🌍 Global News ({newsData.global.length})
          </button>
          
          <button
            onClick={() => setActiveTab('indian')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'indian'
                ? 'bg-green-400 text-black shadow-lg shadow-green-400/50'
                : 'bg-black/40 text-gray-400 border border-green-400/30 hover:border-green-400'
            }`}
          >
            🇮🇳 Indian News ({newsData.indian.length})
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-green-400 font-mono text-lg animate-pulse">
              &gt; LOADING_NEWS...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-center"
          >
            <p className="text-red-400 text-lg mb-2">⚠️ {error}</p>
            <button
              onClick={fetchNews}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* News Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTab === 'global' && (
              newsData.global.length > 0 ? (
                newsData.global.map((article, index) => (
                  <NewsCard key={article._id} article={article} index={index} />
                ))
              ) : (
                <div className="col-span-2">
                  <EmptyState />
                </div>
              )
            )}
            
            {activeTab === 'indian' && (
              newsData.indian.length > 0 ? (
                newsData.indian.map((article, index) => (
                  <NewsCard key={article._id} article={article} index={index} />
                ))
              ) : (
                <div className="col-span-2">
                  <EmptyState />
                </div>
              )
            )}
          </div>
        )}

        {/* Subscription CTA */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 bg-gradient-to-r from-green-400/10 to-blue-400/10 border border-green-400/30 rounded-lg p-8 text-center"
          >
            <h2 className="text-2xl font-bold text-green-400 mb-3">
              📧 Get Weekly Digest in Your Inbox
            </h2>
            <p className="text-gray-300 mb-6">
              Join our club to receive curated cybersecurity news every week!
            </p>
            <a
              href="/#/about"
              className="inline-block bg-green-400 hover:bg-green-500 text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-green-400/50"
            >
              Join Anonymous Club →
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default News;
