# 🚀 Render Backend Environment Variables Setup

## Required Environment Variables for Production

Go to your Render dashboard → Select `anonymous-club-backend` service → Environment tab → Add these variables:

### Database Configuration
```
MONGODB_URI = mongodb+srv://anonymoussdmcet_db_user:0Bpf2PiwefdgHyV2@cluster0.mongodb.net/anonymous-club?retryWrites=true&w=majority
```

### JWT Configuration
```
JWT_SECRET = your-super-secret-jwt-key-2024-anonymous-club
JWT_EXPIRE = 7d
```

### Email Configuration (CRITICAL for OTP)
```
EMAIL_SERVICE = gmail
EMAIL_USER = anonymous.sdmcet@gmail.com
EMAIL_PASS = mgha cjmu jbpl ezrr
```

### Application Configuration
```
NODE_ENV = production
FRONTEND_URL = https://anonymoussdmcet.vercel.app
PORT = 5000
```

## After Adding Variables:
1. Click "Save Changes"
2. Render will automatically redeploy the backend
3. Wait 3-5 minutes for deployment to complete
4. Test the backend health: https://anonymous-club-backend.onrender.com/api/health

## Verify Email Service
Once deployed, registration should send real OTP emails to the user's inbox from `anonymous.sdmcet@gmail.com`

## Important Notes:
- EMAIL_PASS is the Gmail App Password, NOT the regular Gmail password
- Make sure the Gmail account has 2FA enabled and App Password generated
- All environment variables are case-sensitive
