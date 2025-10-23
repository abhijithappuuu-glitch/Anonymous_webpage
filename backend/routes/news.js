import express from 'express';
import newsAggregator from '../services/newsAggregator.js';
import emailService from '../services/emailService.js';
import News from '../models/News.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/news
 * @desc    Get latest weekly news (public)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const news = await newsAggregator.getLatestNews();
    
    res.json({
      success: true,
      data: news,
      message: 'Latest news fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/news/history
 * @desc    Get news history with pagination
 * @access  Public
 */
router.get('/history', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category; // 'Global' or 'Indian'
    
    const query = category ? { category } : {};
    
    const news = await News.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
    
    const total = await News.countDocuments(query);
    
    res.json({
      success: true,
      data: news,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching news history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news history',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/news/aggregate
 * @desc    Manually trigger news aggregation (admin only)
 * @access  Private/Admin
 */
router.post('/aggregate', protect, admin, async (req, res) => {
  try {
    console.log('📰 Manual news aggregation triggered by admin');
    
    const result = await newsAggregator.aggregateWeeklyNews();
    
    res.json({
      success: true,
      data: result,
      message: 'News aggregation completed successfully'
    });
  } catch (error) {
    console.error('Error aggregating news:', error);
    res.status(500).json({
      success: false,
      message: 'News aggregation failed',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/news/send-digest
 * @desc    Manually send digest to all users (admin only)
 * @access  Private/Admin
 */
router.post('/send-digest', protect, admin, async (req, res) => {
  try {
    console.log('📧 Manual digest sending triggered by admin');
    
    // Get latest news
    const { global, indian, weekNumber, year } = await newsAggregator.getLatestNews();
    
    if (global.length === 0 && indian.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No news available to send. Run aggregation first.'
      });
    }
    
    // Send to all users
    const result = await emailService.sendDigestToAll(global, indian, weekNumber, year);
    
    res.json({
      success: true,
      data: result,
      message: 'Digest emails sent successfully'
    });
  } catch (error) {
    console.error('Error sending digest:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send digest emails',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/news/test-email
 * @desc    Send test digest to admin's email (admin only)
 * @access  Private/Admin
 */
router.post('/test-email', protect, admin, async (req, res) => {
  try {
    const { global, indian, weekNumber, year } = await newsAggregator.getLatestNews();
    
    const result = await emailService.sendWeeklyDigest(
      req.user.email,
      global,
      indian,
      weekNumber,
      year
    );
    
    res.json({
      success: true,
      data: result,
      message: `Test email sent to ${req.user.email}`
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/news/stats
 * @desc    Get news statistics (admin only)
 * @access  Private/Admin
 */
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const currentWeek = newsAggregator.getWeekNumber();
    const currentYear = new Date().getFullYear();
    
    const [totalNews, weeklyNews, globalCount, indianCount] = await Promise.all([
      News.countDocuments(),
      News.countDocuments({ weekNumber: currentWeek, year: currentYear }),
      News.countDocuments({ category: 'Global' }),
      News.countDocuments({ category: 'Indian' })
    ]);
    
    res.json({
      success: true,
      data: {
        total: totalNews,
        thisWeek: weeklyNews,
        global: globalCount,
        indian: indianCount,
        weekNumber: currentWeek,
        year: currentYear
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

export default router;
