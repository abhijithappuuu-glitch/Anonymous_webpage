# 🚀 Deployment Guide - Anonymous Cybersecurity Club Website

## Prerequisites
1. Push your code to GitHub repository
2. Create accounts on the platforms (all free):
   - MongoDB Atlas: https://www.mongodb.com/atlas
   - Render: https://render.com
   - Vercel: https://vercel.com

## Step 1: Set up MongoDB Atlas (Free Cloud Database)

1. Go to **https://www.mongodb.com/atlas**
2. Create free account and sign in
3. Create a new cluster:
   - Choose **FREE M0 Sandbox** tier
   - Select a region close to you
   - Create cluster (takes 3-5 minutes)
4. Create database user:
   - Go to Database Access → Add New Database User
   - Choose "Password" authentication
   - Username: `admin` (or any name)
   - Password: Generate secure password
   - Database User Privileges: "Atlas admin"
5. Configure network access:
   - Go to Network Access → Add IP Address
   - Add `0.0.0.0/0` (allow from anywhere) - for simplicity
6. Get connection string:
   - Go to Databases → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://admin:yourpassword@cluster0.abc123.mongodb.net/anonymous-club?retryWrites=true&w=majority`

## Step 2: Deploy Backend to Render

1. Go to **https://render.com** and create account
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `anonymous-club-backend`
   - **Runtime**: Node
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
5. Add Environment Variables (in Render dashboard):
   ```
   NODE_ENV=production
   MONGODB_URI=your-atlas-connection-string-here
   JWT_SECRET=anonymous_cyber_club_super_secret_key_2024_change_in_production
   JWT_EXPIRE=7d
   EMAIL_SERVICE=gmail
   EMAIL_USER=anonymous.sdmcet@gmail.com
   EMAIL_PASS=mgha cjmu jbpl ezrr
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL: `https://your-app-name.onrender.com`

## Step 3: Deploy Frontend to Vercel

1. Go to **https://vercel.com** and create account
2. Click "New Project" → Import from GitHub
3. Select your repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-app.onrender.com
   ```
6. Click "Deploy"
7. Wait for deployment (2-3 minutes)
8. Copy your frontend URL: `https://your-project.vercel.app`

## Step 4: Update Backend CORS

1. Go back to your Render backend service
2. Update the `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
3. Redeploy the backend service

## Step 5: Test Your Deployed Application

Visit your Vercel URL and test:
- ✅ Homepage loads with animations
- ✅ Theme switching (HCK/DEF) works
- ✅ Login/Registration with OTP email
- ✅ Events page and timeline
- ✅ All animations work on scroll

## 🎉 Your Website is Live!

**Frontend**: https://your-project.vercel.app
**Backend**: https://your-backend-app.onrender.com

## Troubleshooting

### Common Issues:
1. **CORS errors**: Make sure FRONTEND_URL in Render matches your Vercel URL
2. **Database connection**: Verify MongoDB Atlas connection string and network access
3. **Email not working**: Check Gmail App Password is correct
4. **404 errors**: Ensure API URLs are correctly configured

### Logs:
- **Backend logs**: Render dashboard → Your service → Logs
- **Frontend logs**: Vercel dashboard → Your project → Functions → View logs

## Free Tier Limitations:
- **Render**: Backend sleeps after 15 minutes of inactivity (first request may be slow)
- **MongoDB Atlas**: 512MB storage limit
- **Vercel**: 100GB bandwidth per month

## Next Steps:
1. Set up custom domain (optional)
2. Configure HTTPS redirects
3. Set up monitoring and alerts
4. Consider upgrading to paid tiers for better performance

Happy deploying! 🚀
