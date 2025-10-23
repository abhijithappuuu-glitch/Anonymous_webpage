# 📰 Weekly Cybersecurity News Digest - Complete Setup Guide

## 🎯 Overview

This automated feature fetches the top 5 cybersecurity news articles from around the world and top 5 from India every week, then sends a beautiful HTML email digest to all registered club members.

---

## 🏗️ Architecture

### **Backend Components:**
1. **News Model** (`models/News.js`) - MongoDB schema for storing news
2. **News Aggregator** (`services/newsAggregator.js`) - Fetches news from APIs
3. **Email Service** (`services/emailService.js`) - Sends formatted digests
4. **News Routes** (`routes/news.js`) - API endpoints
5. **Scheduler** (`scheduler.js`) - Automates weekly tasks

### **Frontend Components:**
1. **News Page** (`pages/News.jsx`) - Beautiful card-based UI
2. **App Router** - News route integration
3. **Navbar** - News navigation link

---

## 📦 Step 1: Install Dependencies

### Backend:
```bash
cd backend
npm install axios node-cron
```

### What's Installed:
- **axios** - HTTP client for fetching news from APIs
- **node-cron** - Scheduler for automation (already have nodemailer)

---

## 🔑 Step 2: Get API Keys

### **Option 1: NewsAPI.org (Recommended for Global News)**

1. Visit: https://newsapi.org/
2. Click "Get API Key"
3. Sign up (FREE tier: 100 requests/day)
4. Copy your API key

**Pros:** 
- ✅ Great coverage worldwide
- ✅ 100 free requests/day
- ✅ Easy to use

**Cons:**
- ❌ Limited to 100 articles per request
- ❌ India-specific news needs filtering

### **Option 2: GNews.io (Recommended for Indian News)**

1. Visit: https://gnews.io/
2. Click "Get API Key"
3. Sign up (FREE tier: 100 requests/day)
4. Copy your API key

**Pros:**
- ✅ Better for regional news
- ✅ Country-specific filtering
- ✅ 100 free requests/day

**Cons:**
- ❌ Smaller database than NewsAPI

### **Option 3: NewsData.io (Alternative)**

1. Visit: https://newsdata.io/
2. Sign up (FREE tier: 200 requests/day)
3. Get API key

**Best Practice:** Use NewsAPI for global + GNews for Indian news for best results!

---

## ⚙️ Step 3: Configure Environment Variables

Add these to your `backend/.env` file:

```env
# ========================================
# NEWS DIGEST CONFIGURATION
# ========================================

# News API Keys (Get from newsapi.org and gnews.io)
NEWS_API_KEY=your_newsapi_key_here
GNEWS_API_KEY=your_gnews_key_here

# Email Configuration (Already have this, just verify)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend URL (for email links)
FRONTEND_URL=https://your-vercel-site.vercel.app

# Enable/Disable Scheduler (set to 'true' to enable automation)
ENABLE_NEWS_SCHEDULER=true
```

### 📧 Email Setup (If Not Already Done):

**For Gmail:**
1. Go to Google Account → Security
2. Enable 2-Factor Authentication
3. Go to "App Passwords"
4. Create password for "Mail"
5. Copy the 16-character password
6. Use it as `EMAIL_PASSWORD` in .env

**For SendGrid:**
```env
EMAIL_SERVICE=sendgrid
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

---

## 🚀 Step 4: Test the System

### 4.1 Test News Aggregation

Start your backend:
```bash
cd backend
npm run dev
```

Test in browser or Postman:
```
GET http://localhost:5000/api/news
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "global": [...5 articles],
    "indian": [...5 articles],
    "weekNumber": 43,
    "year": 2025
  }
}
```

### 4.2 Manual Aggregation (Admin Only)

```
POST http://localhost:5000/api/news/aggregate
Headers: Authorization: Bearer <admin_token>
```

This will fetch fresh news from APIs and save to database.

### 4.3 Test Email Sending (Admin Only)

```
POST http://localhost:5000/api/news/test-email
Headers: Authorization: Bearer <admin_token>
```

This sends a test digest to your email.

### 4.4 Send to All Users (Admin Only)

```
POST http://localhost:5000/api/news/send-digest
Headers: Authorization: Bearer <admin_token>
```

Sends digest to all verified users.

---

## ⏰ Step 5: Automation Schedule

The scheduler runs automatically if `ENABLE_NEWS_SCHEDULER=true`:

### **Default Schedule (IST Timezone):**

| Task | When | What It Does |
|------|------|--------------|
| **News Aggregation** | Every Monday 8:00 AM | Fetches latest news from APIs |
| **Send Digest** | Every Monday 10:00 AM | Emails digest to all users |
| **Health Check** | Every day 12:00 PM | Checks system status |

### **To Customize Schedule:**

Edit `backend/scheduler.js`:

```javascript
// Current: Every Monday at 8:00 AM
scheduleNewsAggregation() {
  const job = cron.schedule('0 8 * * 1', async () => { ... });
}

// Change to: Every Sunday at 6:00 PM
scheduleNewsAggregation() {
  const job = cron.schedule('0 18 * * 0', async () => { ... });
}
```

**Cron Pattern Guide:**
```
┌────────────── minute (0-59)
│ ┌──────────── hour (0-23)
│ │ ┌────────── day of month (1-31)
│ │ │ ┌──────── month (1-12)
│ │ │ │ ┌────── day of week (0-7, 0 and 7 = Sunday)
│ │ │ │ │
* * * * *

Examples:
'0 8 * * 1'     → Every Monday at 8:00 AM
'0 18 * * 0'    → Every Sunday at 6:00 PM
'0 9 * * 1-5'   → Every weekday at 9:00 AM
'0 10 1 * *'    → First day of month at 10:00 AM
'*/30 * * * *'  → Every 30 minutes
```

---

## 🎨 Step 6: Frontend Integration

The News page is already created! Just test it:

1. Start frontend: `cd frontend && npm run dev`
2. Visit: `http://localhost:5173/#/news`
3. Should see beautiful news cards with Global/Indian tabs

### **Features:**
- ✅ Card-based responsive layout
- ✅ Tab switcher (Global/Indian)
- ✅ Loading states
- ✅ Error handling
- ✅ "Join Club" CTA at bottom
- ✅ Green/black hacker theme

---

## 📊 Step 7: Admin Dashboard Features

Admins can manually trigger actions via API:

### **Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/news` | Get latest news (public) |
| `GET` | `/api/news/history` | Get news history with pagination |
| `GET` | `/api/news/stats` | Get statistics (admin) |
| `POST` | `/api/news/aggregate` | Manual news fetch (admin) |
| `POST` | `/api/news/send-digest` | Send to all users (admin) |
| `POST` | `/api/news/test-email` | Test email (admin) |

### **Example: Admin Dashboard Button**

Add to `AdminDashboard.jsx`:

```jsx
const aggregateNews = async () => {
  try {
    const response = await axios.post('/api/news/aggregate', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('News aggregated successfully!');
  } catch (error) {
    alert('Failed to aggregate news');
  }
};

return (
  <button onClick={aggregateNews}>
    📰 Fetch Latest News
  </button>
);
```

---

## 🔄 How It Works - Complete Flow

### **Weekly Automation:**

```
Monday 8:00 AM IST
    ↓
Scheduler triggers news aggregation
    ↓
Fetch from NewsAPI (Global)
    ↓
Fetch from GNews (Indian)
    ↓
Save to MongoDB
    ↓
[2 hours later]
    ↓
Monday 10:00 AM IST
    ↓
Scheduler triggers email campaign
    ↓
Get verified users from database
    ↓
Get latest news from database
    ↓
Generate HTML email template
    ↓
Send in batches of 10 (rate limiting)
    ↓
✅ All users receive digest!
```

---

## 📧 Email Template Preview

The email looks like this:

```
┌─────────────────────────────────────┐
│  🔒 ANONYMOUS CYBERSECURITY CLUB    │
│  Weekly Digest - Week 43, 2025     │
└─────────────────────────────────────┘

🌍 Global Cybersecurity News
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────┐
│ Major Data Breach at TechCorp     │
│ 📰 TechCrunch                     │
│ A major breach exposed...         │
│ [Read More →]                     │
└────────────────────────────────────┘

... 4 more cards ...

🇮🇳 Indian Cybersecurity News
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

... 5 Indian news cards ...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Visit Our Website | View All News
Stay vigilant, stay secure! 🛡️
```

---

## 🔧 Troubleshooting

### **Issue:** No news fetched

**Solutions:**
1. Check API keys are valid
2. Check API rate limits (100/day)
3. Look at server logs for errors
4. Try manual aggregation endpoint

### **Issue:** Emails not sending

**Solutions:**
1. Test email config: `POST /api/news/test-email`
2. Check Gmail App Password is correct
3. Look for nodemailer errors in logs
4. Try console mode first (no EMAIL_SERVICE set)

### **Issue:** Scheduler not running

**Solutions:**
1. Check `ENABLE_NEWS_SCHEDULER=true` in .env
2. Check server logs for "Scheduled:" messages
3. Wait for scheduled time or test manually

### **Issue:** Frontend shows no news

**Solutions:**
1. Check backend is running
2. Check CORS settings in backend
3. Check browser console for errors
4. Verify API_URL in frontend `.env`

---

## 🎯 Best Practices

### **1. Rate Limiting:**
- NewsAPI: 100 requests/day (plenty for once a week!)
- Batch emails in groups of 10
- 1 second delay between batches

### **2. Error Handling:**
- Fallback to console mode if email fails
- Duplicate detection prevents re-saving same news
- Graceful degradation if one API fails

### **3. Security:**
- Admin-only endpoints protected
- API keys in .env (never commit!)
- Email templates sanitized

### **4. Performance:**
- News cached in database (fast retrieval)
- Frontend lazy loads News page
- Images lazy load with error handling

---

## 📝 Summary Checklist

- [ ] Install dependencies (axios, node-cron)
- [ ] Get NewsAPI key
- [ ] Get GNews API key
- [ ] Configure .env file
- [ ] Test news aggregation
- [ ] Test email sending
- [ ] Verify scheduler logs
- [ ] Test frontend News page
- [ ] Add to Navbar (already done!)
- [ ] Deploy and test on Vercel

---

## 🚀 Deployment Notes

### **Vercel Environment Variables:**

Add these in Vercel Dashboard → Settings → Environment Variables:

```
NEWS_API_KEY=your_key
GNEWS_API_KEY=your_key
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=https://your-site.vercel.app
ENABLE_NEWS_SCHEDULER=true
```

### **Important:**
- Vercel serverless functions have timeout limits
- For production, consider:
  - Using Vercel Cron Jobs (coming soon)
  - Or external scheduler (GitHub Actions)
  - Or separate worker service

---

## 🎊 You're Done!

Your cybersecurity club now has a professional automated news digest system! 🎉

**Features:**
- ✅ Auto-fetches news weekly
- ✅ Beautiful HTML emails
- ✅ Responsive web interface
- ✅ Admin controls
- ✅ Error handling
- ✅ Scalable architecture

**Next Steps:**
1. Test everything locally
2. Deploy to Vercel
3. Let it run for a week
4. Check email on Monday!

---

**Questions?** Check the code comments or ask NOBODY AI! 🤖
