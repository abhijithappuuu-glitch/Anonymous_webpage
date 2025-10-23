import axios from 'axios';
import News from '../models/News.js';

/**
 * News Aggregator Service
 * Fetches cybersecurity news from NewsAPI and stores in MongoDB
 * 
 * Recommended Free News APIs:
 * 1. NewsAPI.org - 100 requests/day on free tier
 * 2. GNews.io - 100 requests/day on free tier
 * 3. NewsData.io - 200 requests/day on free tier (Best for India)
 */

class NewsAggregator {
  constructor() {
    this.newsApiKey = process.env.NEWS_API_KEY;
    this.gnewsApiKey = process.env.GNEWS_API_KEY;
    
    // Cybersecurity keywords for better news filtering
    this.keywords = [
      'cybersecurity',
      'data breach',
      'infosec',
      'malware',
      'ransomware',
      'hacking',
      'zero-day',
      'vulnerability',
      'cyber attack',
      'phishing',
      'security patch',
      'cyber threat'
    ].join(' OR ');
  }

  /**
   * Get current week number
   */
  getWeekNumber(date = new Date()) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  /**
   * Fetch global cybersecurity news using NewsAPI
   */
  async fetchGlobalNews() {
    try {
      console.log('🌍 Fetching global cybersecurity news...');
      
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: this.keywords,
          language: 'en',
          sortBy: 'publishedAt',
          from: oneWeekAgo.toISOString(),
          pageSize: 10,
          apiKey: this.newsApiKey
        }
      });

      if (response.data.status === 'ok') {
        console.log(`✅ Found ${response.data.articles.length} global articles`);
        return response.data.articles.slice(0, 5);
      }

      return [];
    } catch (error) {
      console.error('❌ Error fetching global news:', error.message);
      return [];
    }
  }

  /**
   * Fetch Indian cybersecurity news using GNews (better for regional news)
   */
  async fetchIndianNews() {
    try {
      console.log('🇮🇳 Fetching Indian cybersecurity news...');
      
      const response = await axios.get('https://gnews.io/api/v4/search', {
        params: {
          q: 'cybersecurity OR data breach OR cyber attack',
          lang: 'en',
          country: 'in',
          max: 10,
          apikey: this.gnewsApiKey
        }
      });

      if (response.data.articles) {
        console.log(`✅ Found ${response.data.articles.length} Indian articles`);
        return response.data.articles.slice(0, 5);
      }

      return [];
    } catch (error) {
      console.error('❌ Error fetching Indian news:', error.message);
      
      // Fallback: Use NewsAPI with India filter
      return this.fetchIndianNewsFromNewsAPI();
    }
  }

  /**
   * Fallback: Fetch Indian news from NewsAPI
   */
  async fetchIndianNewsFromNewsAPI() {
    try {
      console.log('🔄 Trying NewsAPI for Indian news...');
      
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: `${this.keywords} AND India`,
          language: 'en',
          sortBy: 'publishedAt',
          from: oneWeekAgo.toISOString(),
          pageSize: 10,
          apiKey: this.newsApiKey
        }
      });

      if (response.data.status === 'ok') {
        return response.data.articles.slice(0, 5);
      }

      return [];
    } catch (error) {
      console.error('❌ Fallback also failed:', error.message);
      return [];
    }
  }

  /**
   * Save news articles to MongoDB
   */
  async saveNewsToDatabase(articles, category) {
    const weekNumber = this.getWeekNumber();
    const year = new Date().getFullYear();

    const savedArticles = [];

    for (const article of articles) {
      try {
        // Check if article already exists
        const existing = await News.findOne({
          url: article.url,
          weekNumber,
          year
        });

        if (existing) {
          console.log(`⏭️ Skipping duplicate: ${article.title}`);
          savedArticles.push(existing);
          continue;
        }

        // Create new news entry
        const news = new News({
          title: article.title,
          summary: article.description || article.content?.substring(0, 200) || 'No summary available',
          source: article.source?.name || article.source || 'Unknown',
          url: article.url,
          category,
          imageUrl: article.urlToImage || article.image || null,
          publishedAt: new Date(article.publishedAt),
          weekNumber,
          year
        });

        await news.save();
        savedArticles.push(news);
        console.log(`✅ Saved: ${article.title}`);
      } catch (error) {
        console.error(`❌ Error saving article "${article.title}":`, error.message);
      }
    }

    return savedArticles;
  }

  /**
   * Main aggregation function - fetch and store all news
   */
  async aggregateWeeklyNews() {
    try {
      console.log('📰 Starting weekly news aggregation...');
      
      if (!this.newsApiKey && !this.gnewsApiKey) {
        throw new Error('No news API keys configured. Add NEWS_API_KEY or GNEWS_API_KEY to .env');
      }

      // Fetch news from both sources
      const [globalArticles, indianArticles] = await Promise.all([
        this.fetchGlobalNews(),
        this.fetchIndianNews()
      ]);

      // Save to database
      const [savedGlobal, savedIndian] = await Promise.all([
        this.saveNewsToDatabase(globalArticles, 'Global'),
        this.saveNewsToDatabase(indianArticles, 'Indian')
      ]);

      const summary = {
        success: true,
        timestamp: new Date(),
        weekNumber: this.getWeekNumber(),
        year: new Date().getFullYear(),
        globalNews: savedGlobal.length,
        indianNews: savedIndian.length,
        total: savedGlobal.length + savedIndian.length
      };

      console.log('✅ News aggregation completed:', summary);
      return summary;

    } catch (error) {
      console.error('❌ News aggregation failed:', error.message);
      throw error;
    }
  }

  /**
   * Get latest news from database
   */
  async getLatestNews() {
    const weekNumber = this.getWeekNumber();
    const year = new Date().getFullYear();

    const globalNews = await News.find({
      category: 'Global',
      weekNumber,
      year
    })
      .sort({ publishedAt: -1 })
      .limit(5)
      .lean();

    const indianNews = await News.find({
      category: 'Indian',
      weekNumber,
      year
    })
      .sort({ publishedAt: -1 })
      .limit(5)
      .lean();

    return {
      global: globalNews,
      indian: indianNews,
      weekNumber,
      year
    };
  }
}

export default new NewsAggregator();
