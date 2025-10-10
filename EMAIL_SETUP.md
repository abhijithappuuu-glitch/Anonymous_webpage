# 📧 Email OTP Setup Guide

## Current Status
🔧 **OTP codes are currently displayed in the backend console for testing**. To receive OTP codes via real email, follow the setup below.

## Quick Setup (Gmail Recommended)

### Option 1: Gmail Setup (Easiest)

1. **Go to your Gmail account settings**
2. **Enable 2-Factor Authentication** (if not already enabled)
3. **Generate an App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Copy the 16-character password

4. **Update backend/.env file:**
   ```env
   # Uncomment and fill these:
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

5. **Restart the backend server**

### Option 2: Other Email Providers

For Outlook, Yahoo, or custom SMTP:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-password-or-app-password
```

## Testing Without Email Setup

**Current behavior:** If no email is configured, OTP codes will be displayed in the backend console.

1. Start the backend server
2. Try to register or login
3. Check the terminal/console where the backend is running
4. Look for output like:
   ```
   --- OTP CODE ---
   To: user@example.com
   OTP: 123456
   Type: register
   --- COPY THIS OTP TO TEST ---
   ```
5. Copy the 6-digit OTP and paste it in the verification form

## Email Templates

The system sends professional-looking emails with:
- 🔐 Cybersecurity-themed design
- Clear OTP codes with large, easy-to-read fonts
- Security warnings
- 5-minute expiration notices
- Mobile-friendly responsive design

## Troubleshooting

**No OTP in email?**
- Check spam/junk folder
- Verify email configuration in .env
- Check backend console for error messages

**Gmail not working?**
- Make sure you're using App Password, not regular password
- Enable 2-Factor Authentication first
- Check that "Less secure app access" is not blocking it

**OTP expired?**
- OTP codes expire after 5 minutes
- Click "Resend Code" to get a new one
- Each email can have max 5 failed attempts

## Security Features

- ✅ 6-digit random OTP generation
- ✅ 5-minute expiration time
- ✅ Maximum 5 attempts per OTP
- ✅ Automatic cleanup of expired codes
- ✅ Professional email templates
- ✅ Fallback to console logging for development