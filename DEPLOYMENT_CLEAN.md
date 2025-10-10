# 🚀 CLEAN DEPLOYMENT GUIDE

## ✅ Repository Status: READY FOR DEPLOYMENT

**GitHub Repository**: https://github.com/abhijithappuuu-glitch/Anonymous_webpage
**Branch**: main (clean deployment branch)

## 📋 Step 1: Deploy Backend to Render

### Go to Render.com and Create New Web Service

1. **Visit**: https://render.com
2. **Sign in** with GitHub
3. **Click**: "New" → "Web Service"
4. **Connect** your GitHub repository: `abhijithappuuu-glitch/Anonymous_webpage`

### Configure the Service EXACTLY as follows:

**Basic Settings:**
- **Name**: `anonymous-club-backend`
- **Runtime**: `Node`
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Health Check Path**: `/api/health`
- **Instance Type**: `Free`

### Environment Variables (Add ALL 8):

1. **NODE_ENV** = `production`
2. **MONGODB_URI** = `mongodb+srv://anonymoussdmcet_db_user:0Bpf2PiwefdgHyV2@cluster0.89wxvqa.mongodb.net/anonymous-club?retryWrites=true&w=majority`
3. **JWT_SECRET** = `anonymous_cyber_club_super_secret_key_2024_change_in_production`
4. **JWT_EXPIRE** = `7d`
5. **EMAIL_SERVICE** = `gmail`
6. **EMAIL_USER** = `anonymous.sdmcet@gmail.com`
7. **EMAIL_PASS** = `mgha cjmu jbpl ezrr`
8. **FRONTEND_URL** = `https://localhost:5173` (will update after frontend deployment)

### Click "Create Web Service"

**Expected Result**: Backend will be live at `https://anonymous-club-backend.onrender.com`

## 📋 Step 2: Deploy Frontend to Vercel

1. **Visit**: https://vercel.com
2. **Sign in** with GitHub
3. **Click**: "New Project"
4. **Import**: `abhijithappuuu-glitch/Anonymous_webpage`

### Configure Project:
- **Framework Preset**: `Vite`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Environment Variable:
- **VITE_API_URL** = `https://anonymous-club-backend.onrender.com`

### Click "Deploy"

## 📋 Step 3: Update Backend CORS

After frontend is deployed:
1. Go back to Render dashboard
2. Update **FRONTEND_URL** environment variable with your Vercel URL
3. Save changes

## 🎉 Your Website Will Be Live!

**Backend**: https://anonymous-club-backend.onrender.com
**Frontend**: https://your-project.vercel.app

## 🧪 Test Checklist:
- [ ] Homepage loads with animations
- [ ] Theme switching works (HCK/DEF)
- [ ] Login/Registration with OTP emails
- [ ] Events and timeline display
- [ ] Continuous scroll animations

---

**Total deployment time: ~15 minutes**