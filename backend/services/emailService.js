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
        from: `"Anonymous Cybersecurity Club" <${process.env.EMAIL_USER}>`,
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
  }
};

export default emailService;