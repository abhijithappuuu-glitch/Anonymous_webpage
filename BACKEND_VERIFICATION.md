# Backend Verification Checklist

## 1. Environment Variables on Render

Login to Render and verify ALL these variables are set:

| Variable | Value | Status |
|----------|-------|--------|
| MONGODB_URI | mongodb+srv://anonymoussdmcet_db_user:0Bpf2PiwefdgHyV2@... | ⬜ |
| JWT_SECRET | your-super-secret-jwt-key-change-this-in-production-2024 | ⬜ |
| EMAIL_SERVICE | gmail | ⬜ |
| EMAIL_USER | anonymous.sdmcet@gmail.com | ⬜ |
| EMAIL_PASS | mgha cjmu jbpl ezrr | ⬜ |
| NODE_ENV | production | ⬜ |
| FRONTEND_URL | https://anonymoussdmcet.vercel.app | ⬜ |
| PORT | 10000 | ⬜ |

## 2. Backend Endpoints to Test

After setting environment variables, test these URLs:

### Health Check
```
GET https://anonymous-club-backend.onrender.com/api/health
```
Expected: `{"status":"ok","timestamp":"..."}`

### Test Registration (POST)
```bash
curl -X POST https://anonymous-club-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "usn": "4CB21CS999",
    "password": "Test@123"
  }'
```
Expected: `{"message":"OTP sent to email"}`

### Test Login (POST)
```bash
curl -X POST https://anonymous-club-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "anonymous.sdmcet@gmail.com",
    "password": "SecureAdmin2024!"
  }'
```
Expected: `{"token":"...","user":{...}}`

## 3. Check Render Logs

Look for these indicators in logs:

### ✅ Good Signs:
```
✓ MongoDB connected successfully
✓ Email service configured: gmail
✓ Server running on port 10000
✓ CORS enabled for: https://anonymoussdmcet.vercel.app
```

### ❌ Bad Signs:
```
✗ MongoDB connection error
✗ Email service not configured
✗ Missing environment variables
✗ CORS origin not allowed
```

## 4. Quick Render Configuration Guide

### Access Environment Variables:
1. Go to: https://dashboard.render.com/
2. Click on: **anonymous-club-backend**
3. Click: **Environment** (left sidebar)
4. Click: **Add Environment Variable** (for each variable above)
5. Click: **Save Changes** (bottom of page)

### Wait for Deployment:
- Render will show: "Deploying..."
- Usually takes: 2-3 minutes
- Status will change to: "Live" (green)

### View Logs:
1. Click: **Logs** (left sidebar)
2. Look for: "Server running on port 10000"
3. Check for: any error messages

## 5. Frontend Configuration

Verify Vercel environment variable:

| Variable | Value | Status |
|----------|-------|--------|
| VITE_API_URL | https://anonymous-club-backend.onrender.com | ⬜ |

## 6. Test Complete Flow

### Registration Flow:
1. ⬜ Open: https://anonymoussdmcet.vercel.app
2. ⬜ Click: "Sign Up"
3. ⬜ Fill form with real email
4. ⬜ Click: "Sign Up"
5. ⬜ Check email inbox for OTP (from anonymous.sdmcet@gmail.com)
6. ⬜ Enter OTP
7. ⬜ Verify: Successfully logged in

### Login Flow:
1. ⬜ Open: https://anonymoussdmcet.vercel.app
2. ⬜ Click: "Login"
3. ⬜ Enter: anonymous.sdmcet@gmail.com / SecureAdmin2024!
4. ⬜ Click: "Login"
5. ⬜ Verify: No OTP required, directly logged in

## 7. Common Issues and Fixes

### Issue: "Cannot connect to backend"
**Fix:** Check if Render service is "Live" (not sleeping/deploying)

### Issue: "OTP not received"
**Fix:** Verify EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS are set on Render

### Issue: "Invalid credentials"
**Fix:** Make sure admin user exists in database (run seed.js if needed)

### Issue: "CORS error"
**Fix:** Verify FRONTEND_URL matches exactly: https://anonymoussdmcet.vercel.app

## 8. Database Verification

Connect to MongoDB Atlas:
```
Connection String: mongodb+srv://anonymoussdmcet_db_user:0Bpf2PiwefdgHyV2@anonymouscluster.5kizb.mongodb.net/
Database: anonymoussdmcet_db
Collections: users, events
```

Check if admin user exists:
- Email: anonymous.sdmcet@gmail.com
- Role: admin
- IsVerified: true

## 9. Email Configuration Test

If OTPs still not arriving, verify Gmail app password:
- Email: anonymous.sdmcet@gmail.com
- App Password: mgha cjmu jbpl ezrr
- Service: Gmail SMTP
- Port: 587 (TLS)

## 10. Final Checklist

Before reporting issues, verify:
- ⬜ All 8 environment variables set on Render
- ⬜ Render service status: Live (green)
- ⬜ Backend health endpoint responds: OK
- ⬜ Frontend VITE_API_URL correct
- ⬜ Vercel deployment: Production (latest commit)
- ⬜ Browser console: No CORS errors
- ⬜ Network tab: API calls reaching correct URL
- ⬜ MongoDB Atlas: Database accessible

---

**Most Common Fix:** Just adding the environment variables on Render solves 90% of auth issues!
