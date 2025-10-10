# 🔐 Anonymous Cybersecurity Club - Login Credentials

## Admin Login
- **Email**: `admin@anonymous.club`
- **Password**: `admin123`
- **Role**: Administrator (Full access to admin panel)

## Test User Login
- **Email**: `hacker@anonymous.club`  
- **Password**: `hacker123`
- **Role**: Regular user

## Authentication Flow
- **Login**: Direct login with email/password (no OTP required)
- **Registration**: OTP verification required via email

## Email Setup for Real OTPs
To receive real OTP emails, configure these environment variables in Render dashboard:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=anonymous.sdmcet@gmail.com
EMAIL_PASS=your-gmail-app-password
```

### Gmail App Password Setup:
1. Enable 2-Factor Authentication on Gmail
2. Go to Google Account Settings > Security > App Passwords
3. Generate a new app password for "Mail"
4. Use this app password (not your regular Gmail password)

## Testing
- **Backend URL**: https://anonymous-club-backend.onrender.com
- **Frontend URL**: https://anonymoussdmcet.vercel.app
- **Health Check**: https://anonymous-club-backend.onrender.com/api/health