import nodemailer from 'nodemailer';

// Email service with real email sending capability
const emailService = {
  // Create transporter based on environment
  createTransporter: () => {
    // For Gmail (recommended for development/testing)
    if (process.env.EMAIL_SERVICE === 'gmail') {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, // Your Gmail address
          pass: process.env.EMAIL_PASS  // Your Gmail App Password (not regular password!)
        }
      });
    }
    
    // For other SMTP services (Outlook, Yahoo, etc.)
    if (process.env.SMTP_HOST) {
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }
    
    // Fallback to console logging if no email config
    return null;
  },

  sendOTP: async (email, otp, type) => {
    try {
      const transporter = emailService.createTransporter();
      
      // If no email configuration, fall back to console logging
      if (!transporter) {
        console.log('\n=== EMAIL SERVICE (CONSOLE MODE) ===');
        console.log('⚠️ No email configuration found. Add these to your .env file:');
        console.log('EMAIL_SERVICE=gmail');
        console.log('EMAIL_USER=your-email@gmail.com');
        console.log('EMAIL_PASS=your-app-password');
        console.log('\n--- OTP CODE ---');
        console.log(`To: ${email}`);
        console.log(`OTP: ${otp}`);
        console.log(`Type: ${type}`);
        console.log('--- COPY THIS OTP TO TEST ---\n');
        return { success: true, mode: 'console' };
      }

      const subject = type === 'register' 
        ? '🔐 Welcome to Anonymous Cybersecurity Club - Verify Email'
        : '🔐 Anonymous Cybersecurity Club - Login Verification';

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Courier New', monospace; margin: 0; padding: 0; background: #000; }
            .container { background: #000; color: #00ff41; padding: 20px; max-width: 600px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #00ff41; text-shadow: 0 0 10px #00ff41; }
            .otp-container { background: #001100; border: 2px solid #00ff41; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
            .otp-code { font-size: 36px; font-weight: bold; color: #00ff41; margin: 0; letter-spacing: 8px; text-shadow: 0 0 15px #00ff41; }
            .warning { color: #ff4444; font-weight: bold; margin: 20px 0; }
            .footer { font-size: 12px; color: #555; margin-top: 30px; text-align: center; }
            .expires { background: #330000; color: #ff6666; padding: 10px; border-radius: 4px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🔐 ANONYMOUS CYBERSECURITY CLUB</div>
              <div style="color: #666; font-size: 14px; margin-top: 5px;">SECURE AUTHENTICATION SYSTEM</div>
            </div>
            
            <p style="color: #00ff41;">Hello,</p>
            <p style="color: #ccc;">
              ${type === 'register' 
                ? 'Welcome to the Anonymous Cybersecurity Club! To complete your registration, please verify your email address.'
                : 'You are attempting to log in to your Anonymous Cybersecurity Club account.'
              }
            </p>
            
            <div class="otp-container">
              <p style="color: #00ff41; margin: 0 0 10px 0; font-size: 16px;">YOUR VERIFICATION CODE:</p>
              <div class="otp-code">${otp}</div>
            </div>
            
            <div class="expires">
              ⏰ This code will expire in 5 minutes
            </div>
            
            <div class="warning">
              ⚠️ SECURITY WARNING: Never share this code with anyone. Our team will never ask for your verification code.
            </div>
            
            <p style="color: #999; font-size: 14px;">
              If you didn't request this code, please ignore this email or contact our security team if you believe your account may be compromised.
            </p>
            
            <div class="footer">
              <p>Anonymous Cybersecurity Club - Secure Network Authentication</p>
              <p style="color: #444;">This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const textContent = `
ANONYMOUS CYBERSECURITY CLUB - Email Verification

Hello,

${type === 'register' 
  ? 'Welcome to the Anonymous Cybersecurity Club! To complete your registration, please verify your email address.'
  : 'You are attempting to log in to your Anonymous Cybersecurity Club account.'
}

Your verification code is: ${otp}

⏰ This code will expire in 5 minutes.

⚠️ SECURITY WARNING: Never share this code with anyone. Our team will never ask for your verification code.

If you didn't request this code, please ignore this email.

Best regards,
Anonymous Cybersecurity Club Security Team
      `;

      const mailOptions = {
        from: `"Anonymous Cybersecurity Club" <${process.env.EMAIL_USER || 'anonymous.sdmcet@gmail.com'}>`,
        to: email,
        subject: subject,
        text: textContent,
        html: htmlContent
      };

      const info = await transporter.sendMail(mailOptions);
      
      console.log('\n✅ Email sent successfully!');
      console.log(`To: ${email}`);
      console.log(`Message ID: ${info.messageId}`);
      console.log(`OTP: ${otp} (expires in 5 minutes)\n`);
      
      return { success: true, messageId: info.messageId, mode: 'email' };
      
    } catch (error) {
      console.error('\n❌ Email sending failed:', error.message);
      
      // Fallback to console logging if email fails
      console.log('\n=== FALLBACK: CONSOLE MODE ===');
      console.log(`To: ${email}`);
      console.log(`OTP: ${otp}`);
      console.log(`Type: ${type}`);
      console.log('--- COPY THIS OTP TO TEST ---\n');
      
      // Don't throw error, allow authentication to continue
      return { success: true, mode: 'console_fallback', error: error.message };
    }
  },

  /**
   * Send weekly cybersecurity news digest to user
   */
  sendWeeklyDigest: async (email, globalNews, indianNews, weekNumber, year) => {
    try {
      const transporter = emailService.createTransporter();
      
      if (!transporter) {
        console.log('\n=== NEWS DIGEST (CONSOLE MODE) ===');
        console.log(`To: ${email}`);
        console.log(`Week ${weekNumber}, ${year}`);
        console.log(`Global News: ${globalNews.length} articles`);
        console.log(`Indian News: ${indianNews.length} articles`);
        return { success: true, mode: 'console' };
      }

      const htmlContent = emailService.generateDigestTemplate(globalNews, indianNews, weekNumber, year);
      
      const mailOptions = {
        from: `"Anonymous Cybersecurity Club" <${process.env.EMAIL_USER || 'anonymous.sdmcet@gmail.com'}>`,
        to: email,
        subject: `🔒 Weekly Cybersecurity Digest - Week ${weekNumber}, ${year}`,
        html: htmlContent
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Digest sent to: ${email}`);
      
      return { success: true, messageId: info.messageId, email };
    } catch (error) {
      console.error(`❌ Failed to send digest to ${email}:`, error.message);
      return { success: false, email, error: error.message };
    }
  },

  /**
   * Generate HTML email template for news digest
   */
  generateDigestTemplate: (globalNews, indianNews, weekNumber, year) => {
    const clubName = 'Anonymous Cybersecurity Club';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Weekly Cybersecurity Digest</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a; padding: 20px; }
        .container { max-width: 650px; margin: 0 auto; background: #1a1a1a; border-radius: 10px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,255,65,0.1); border: 1px solid #00ff41; }
        .header { background: linear-gradient(135deg, #00ff41 0%, #00cc33 100%); color: #000; padding: 40px 30px; text-align: center; }
        .header h1 { font-size: 28px; margin-bottom: 10px; font-weight: bold; }
        .header p { font-size: 16px; opacity: 0.8; }
        .content { padding: 30px; }
        .section { margin-bottom: 40px; }
        .section-title { font-size: 22px; color: #00ff41; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 3px solid #00ff41; text-shadow: 0 0 10px rgba(0,255,65,0.5); }
        .news-card { background: #0a0a0a; border-left: 4px solid #00ff41; padding: 20px; margin-bottom: 20px; border-radius: 5px; transition: all 0.3s; border: 1px solid #1a1a1a; }
        .news-card:hover { transform: translateX(5px); border-color: #00ff41; box-shadow: 0 0 20px rgba(0,255,65,0.2); }
        .news-title { font-size: 18px; font-weight: bold; color: #00ff41; margin-bottom: 10px; }
        .news-summary { font-size: 14px; color: #ccc; line-height: 1.6; margin-bottom: 15px; }
        .news-meta { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
        .news-source { font-size: 13px; color: #888; font-style: italic; }
        .news-link { display: inline-block; background: #00ff41; color: #000; padding: 8px 20px; text-decoration: none; border-radius: 5px; font-size: 14px; font-weight: 600; }
        .news-link:hover { background: #00cc33; }
        .footer { background: #0a0a0a; padding: 20px 30px; text-align: center; font-size: 13px; color: #666; border-top: 1px solid #00ff41; }
        .footer a { color: #00ff41; text-decoration: none; }
        .footer a:hover { text-decoration: underline; }
        .emoji { font-size: 24px; margin-bottom: 10px; }
        .no-news { color: #888; font-style: italic; text-align: center; padding: 20px; }
        @media (max-width: 600px) {
          .header { padding: 30px 20px; }
          .content { padding: 20px; }
          .news-card { padding: 15px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="emoji">🔒</div>
          <h1>${clubName}</h1>
          <p>Weekly Cybersecurity News Digest - Week ${weekNumber}, ${year}</p>
        </div>

        <!-- Content -->
        <div class="content">
          <!-- Global News Section -->
          <div class="section">
            <h2 class="section-title">🌍 Global Cybersecurity News</h2>
            ${emailService.generateNewsCards(globalNews)}
          </div>

          <!-- Indian News Section -->
          <div class="section">
            <h2 class="section-title">🇮🇳 Indian Cybersecurity News</h2>
            ${emailService.generateNewsCards(indianNews)}
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p style="color: #00ff41; font-weight: bold;">You're receiving this because you're a member of ${clubName}</p>
          <p style="margin-top: 10px;">
            <a href="${frontendUrl}">Visit Our Website</a> • 
            <a href="${frontendUrl}/news">View All News</a>
          </p>
          <p style="margin-top: 15px; color: #555; font-size: 12px;">
            Stay vigilant, stay secure! 🛡️
          </p>
        </div>
      </div>
    </body>
    </html>
    `;
  },

  /**
   * Generate HTML for news cards
   */
  generateNewsCards: (newsArray) => {
    if (!newsArray || newsArray.length === 0) {
      return '<p class="no-news">No news available this week.</p>';
    }

    return newsArray.map(news => `
      <div class="news-card">
        <div class="news-title">${news.title}</div>
        <div class="news-summary">${news.summary}</div>
        <div class="news-meta">
          <span class="news-source">📰 ${news.source}</span>
          <a href="${news.url}" class="news-link" target="_blank">Read More →</a>
        </div>
      </div>
    `).join('');
  },

  /**
   * Send digest to all verified users
   */
  sendDigestToAll: async (globalNews, indianNews, weekNumber, year) => {
    try {
      console.log('📧 Starting weekly digest email campaign...');
      
      // Import User model dynamically to avoid circular dependency
      const User = (await import('../models/User.js')).default;
      
      // Get all verified users
      const users = await User.find({ 
        $or: [
          { isVerified: true },
          { emailVerified: true }
        ]
      }).select('email name').lean();
      
      if (users.length === 0) {
        console.log('⚠️ No verified users found');
        return { success: false, message: 'No users to send emails to' };
      }

      console.log(`📤 Sending digest to ${users.length} users...`);

      // Send emails in batches to avoid rate limits
      const batchSize = 10;
      const results = [];

      for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize);
        
        console.log(`📤 Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(users.length / batchSize)}`);
        
        const batchResults = await Promise.all(
          batch.map(user => 
            emailService.sendWeeklyDigest(user.email, globalNews, indianNews, weekNumber, year)
          )
        );

        results.push(...batchResults);

        // Wait 1 second between batches
        if (i + batchSize < users.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      const summary = {
        success: true,
        totalUsers: users.length,
        sent: successful,
        failed: failed,
        timestamp: new Date()
      };

      console.log('✅ Email campaign completed:', summary);
      return summary;

    } catch (error) {
      console.error('❌ Email campaign failed:', error.message);
      throw error;
    }
  }
};

export default emailService;