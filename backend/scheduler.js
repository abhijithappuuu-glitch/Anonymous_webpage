import cron from 'node-cron';
import newsAggregator from './services/newsAggregator.js';
import emailService from './services/emailService.js';

/**
 * Automated Weekly News Scheduler
 * 
 * Schedule Pattern (node-cron syntax):
 * ┌────────────── second (optional)
 * │ ┌──────────── minute
 * │ │ ┌────────── hour
 * │ │ │ ┌──────── day of month
 * │ │ │ │ ┌────── month
 * │ │ │ │ │ ┌──── day of week
 * │ │ │ │ │ │
 * * * * * * *
 */

class NewsScheduler {
  constructor() {
    this.jobs = [];
  }

  /**
   * Task: Aggregate weekly news
   * Runs every Monday at 8:00 AM IST
   */
  scheduleNewsAggregation() {
    // Cron: Every Monday at 8:00 AM
    const job = cron.schedule('0 8 * * 1', async () => {
      try {
        console.log('\n⏰ [SCHEDULED] Starting weekly news aggregation...');
        console.log(`📅 Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
        
        const result = await newsAggregator.aggregateWeeklyNews();
        
        console.log('✅ [SCHEDULED] News aggregation completed:', result);
      } catch (error) {
        console.error('❌ [SCHEDULED] News aggregation failed:', error.message);
      }
    }, {
      scheduled: true,
      timezone: 'Asia/Kolkata' // IST timezone
    });

    this.jobs.push({ name: 'News Aggregation', job, schedule: 'Every Monday at 8:00 AM IST' });
    console.log('📅 Scheduled: News Aggregation - Every Monday at 8:00 AM IST');
    
    return job;
  }

  /**
   * Task: Send weekly digest emails
   * Runs every Monday at 10:00 AM IST (2 hours after aggregation)
   */
  scheduleDigestEmails() {
    // Cron: Every Monday at 10:00 AM
    const job = cron.schedule('0 10 * * 1', async () => {
      try {
        console.log('\n⏰ [SCHEDULED] Starting weekly digest email campaign...');
        console.log(`📅 Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
        
        // Get latest news
        const { global, indian, weekNumber, year } = await newsAggregator.getLatestNews();
        
        if (global.length === 0 && indian.length === 0) {
          console.log('⚠️ [SCHEDULED] No news available to send');
          return;
        }
        
        // Send to all users
        const result = await emailService.sendDigestToAll(global, indian, weekNumber, year);
        
        console.log('✅ [SCHEDULED] Digest emails sent:', result);
      } catch (error) {
        console.error('❌ [SCHEDULED] Digest sending failed:', error.message);
      }
    }, {
      scheduled: true,
      timezone: 'Asia/Kolkata' // IST timezone
    });

    this.jobs.push({ name: 'Digest Emails', job, schedule: 'Every Monday at 10:00 AM IST' });
    console.log('📅 Scheduled: Digest Emails - Every Monday at 10:00 AM IST');
    
    return job;
  }

  /**
   * Optional: Daily health check
   * Runs every day at 12:00 PM to check service status
   */
  scheduleDailyHealthCheck() {
    const job = cron.schedule('0 12 * * *', async () => {
      try {
        console.log('\n⏰ [HEALTH CHECK] Running daily system check...');
        
        // Check database connection
        const mongoose = (await import('mongoose')).default;
        const dbStatus = mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected';
        
        // Check email service
        const emailStatus = emailService.createTransporter() ? '✅ Ready' : '⚠️ Not configured';
        
        console.log(`📊 Database: ${dbStatus}`);
        console.log(`📧 Email Service: ${emailStatus}`);
        console.log(`🕐 Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
        
      } catch (error) {
        console.error('❌ [HEALTH CHECK] Failed:', error.message);
      }
    }, {
      scheduled: true,
      timezone: 'Asia/Kolkata'
    });

    this.jobs.push({ name: 'Health Check', job, schedule: 'Every day at 12:00 PM IST' });
    console.log('📅 Scheduled: Health Check - Every day at 12:00 PM IST');
    
    return job;
  }

  /**
   * Start all scheduled jobs
   */
  startAll() {
    console.log('\n🚀 Starting News Scheduler...\n');
    
    this.scheduleNewsAggregation();
    this.scheduleDigestEmails();
    this.scheduleDailyHealthCheck();
    
    console.log('\n✅ All scheduled jobs are active!\n');
    console.log('📋 Active Jobs:');
    this.jobs.forEach(({ name, schedule }) => {
      console.log(`   • ${name}: ${schedule}`);
    });
    console.log('\n');
  }

  /**
   * Stop all scheduled jobs
   */
  stopAll() {
    console.log('🛑 Stopping all scheduled jobs...');
    this.jobs.forEach(({ name, job }) => {
      job.stop();
      console.log(`   • Stopped: ${name}`);
    });
    this.jobs = [];
  }

  /**
   * Get status of all jobs
   */
  getStatus() {
    return this.jobs.map(({ name, schedule }) => ({
      name,
      schedule,
      active: true
    }));
  }
}

// Export singleton instance
const scheduler = new NewsScheduler();
export default scheduler;

/*
 * USAGE EXAMPLES - Cron Pattern Reference:
 * 
 * Different schedule patterns:
 * 
 * 1. Every Monday at 8:00 AM:
 *    0 8 * * 1
 * 
 * 2. Every day at 9:00 AM:
 *    0 9 * * *
 * 
 * 3. Every Sunday at 6:00 PM:
 *    0 18 * * 0
 * 
 * 4. First day of month at 10:00 AM:
 *    0 10 1 * *
 * 
 * 5. Every hour:
 *    0 * * * *
 * 
 * 6. Every 30 minutes (without slash):
 *    Pattern: Every 30 minutes
 * 
 * 7. Every weekday at 9:00 AM:
 *    0 9 * * 1-5
 */

