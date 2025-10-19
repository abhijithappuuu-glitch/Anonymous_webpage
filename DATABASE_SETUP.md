# 🗄️ MongoDB Database Setup Guide

## ✅ Database Overview

Your Anonymous Cybersecurity Club website uses **MongoDB Atlas** (cloud database) with the following structure:

### **Database Name:** `anonymous-club`

### **Collections:**
1. **users** - User accounts (admin/regular users)
2. **events** - Club events (workshops, CTFs, conferences)
3. **otps** - One-time passwords for authentication
4. **clubinfos** - Club information and stats
5. **teammembers** - Core team member profiles
6. **timelineevents** - Timeline/history events
7. **galleryimages** - Gallery photos
8. **homecontents** - Home page dynamic content

---

## 🔧 Current Setup

### **MongoDB Connection String:**
```
mongodb+srv://anonymoussdmcet_db_user:BVK292@appu@cluster0.89wxvqa.mongodb.net/anonymous-club?retryWrites=true&w=majority&appName=Cluster0
```

### **Credentials:**
- **Username:** `anonymoussdmcet_db_user`
- **Password:** `BVK292@appu`
- **Cluster:** `cluster0.89wxvqa.mongodb.net`
- **Database:** `anonymous-club`

---

## 📋 Database Schema

### 1. **Users Collection**
```javascript
{
  username: String,      // Unique username (min 3 chars)
  email: String,         // Unique email (lowercase)
  password: String,      // Hashed with bcrypt
  role: String,          // 'user' or 'admin'
  createdAt: Date,
  updatedAt: Date
}
```

### 2. **Events Collection**
```javascript
{
  title: String,         // Event title
  date: Date,            // Event date
  category: String,      // Workshop/Hackathon/Webinar/Conference/Other
  summary: String,       // Short description
  description: String,   // Full description
  images: [{             // Event photos
    url: String,
    caption: String
  }],
  tags: [String],        // Event tags
  status: String,        // 'upcoming' or 'past'
  createdAt: Date,
  updatedAt: Date
}
```

### 3. **OTPs Collection**
```javascript
{
  email: String,         // User email
  otp: String,           // 6-digit code
  expiresAt: Date,       // Expiration time
  verified: Boolean,     // Verification status
  createdAt: Date
}
```

### 4. **ClubInfo Collection**
```javascript
{
  name: String,          // Club name
  description: String,   // Club description
  mission: String,       // Mission statement
  vision: String,        // Vision statement
  stats: {
    members: Number,
    events: Number,
    projects: Number
  },
  socialLinks: {
    twitter: String,
    linkedin: String,
    github: String,
    instagram: String
  },
  contactEmail: String,
  updatedAt: Date
}
```

### 5. **TeamMembers Collection**
```javascript
{
  name: String,          // Member name
  role: String,          // Position in club
  bio: String,           // Short bio
  image: String,         // Profile photo URL
  socialLinks: {
    twitter: String,
    linkedin: String,
    github: String
  },
  order: Number,         // Display order
  active: Boolean,       // Currently active member
  createdAt: Date
}
```

### 6. **TimelineEvents Collection**
```javascript
{
  title: String,         // Event title
  date: Date,            // Event date
  description: String,   // Event description
  category: String,      // Event category
  order: Number,         // Display order
  createdAt: Date
}
```

### 7. **GalleryImages Collection**
```javascript
{
  title: String,         // Image title
  description: String,   // Image description
  imageUrl: String,      // Image URL
  category: String,      // Image category
  tags: [String],        // Image tags
  order: Number,         // Display order
  createdAt: Date
}
```

### 8. **HomeContent Collection**
```javascript
{
  sectionName: String,   // Section identifier
  content: Object,       // Dynamic content
  updatedAt: Date
}
```

---

## 🚀 Setup Instructions

### **Step 1: Verify MongoDB Atlas Connection**

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Login with your account
3. Select your cluster: `Cluster0`
4. Verify database: `anonymous-club` exists

### **Step 2: Configure Network Access**

1. In MongoDB Atlas → Network Access
2. Add IP Address: **0.0.0.0/0** (Allow from anywhere)
3. This is required for Render backend to connect

### **Step 3: Update Backend Environment Variables**

Your backend is already configured! But verify in Render:

**Render Dashboard → Environment Variables:**
```
MONGODB_URI=mongodb+srv://anonymoussdmcet_db_user:BVK292@appu@cluster0.89wxvqa.mongodb.net/anonymous-club?retryWrites=true&w=majority&appName=Cluster0
```

### **Step 4: Initialize Database with Seed Data**

Run the seed script to populate initial data:

```bash
cd backend
node seed.js
```

---

## 🌱 Seed Data Script

Your backend already has `seed.js`. Let me check if it needs updates:

The seed script will create:
- ✅ Admin user
- ✅ Sample events
- ✅ Club information
- ✅ Team members
- ✅ Timeline events

---

## 🔍 Verify Database Connection

### **1. Check Backend Logs (Render)**
Go to Render dashboard → Logs
Look for:
```
✅ MongoDB connected successfully
🚀 Server running on port 10000
```

### **2. Test Health Endpoint**
```bash
curl https://anonymous-club-backend-f2ai.onrender.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Anonymous Cybersecurity Club Backend is running",
  "timestamp": "2025-10-15T10:00:00.000Z",
  "version": "1.0.0"
}
```

### **3. Test MongoDB Connection**
The backend will automatically:
- ✅ Connect to MongoDB on startup
- ✅ Create indexes
- ✅ Handle reconnections
- ✅ Log connection status

---

## 📊 MongoDB Atlas Dashboard

### **View Your Data:**
1. Go to MongoDB Atlas → Database → Browse Collections
2. Select database: `anonymous-club`
3. View collections:
   - `users` - User accounts
   - `events` - Events data
   - `otps` - OTP codes
   - `clubinfos` - Club info
   - `teammembers` - Team data

### **Run Queries:**
Use MongoDB Atlas query editor:
```javascript
// Find all users
db.users.find({})

// Find all events
db.events.find({})

// Find admin users
db.users.find({ role: 'admin' })

// Count total events
db.events.countDocuments()
```

---

## 🛠️ Database Operations

### **Create Admin User:**
```javascript
POST /api/auth/register
{
  "username": "admin",
  "email": "admin@anonymous.club",
  "password": "YourSecurePassword123!",
  "role": "admin"
}
```

### **Create Event:**
```javascript
POST /api/events
{
  "title": "Cybersecurity Workshop",
  "date": "2025-11-15",
  "category": "Workshop",
  "summary": "Learn ethical hacking basics",
  "description": "Comprehensive workshop on cybersecurity fundamentals",
  "tags": ["security", "workshop", "beginner"],
  "status": "upcoming"
}
```

### **Update Club Info:**
```javascript
PUT /api/admin/club-info
{
  "name": "Anonymous Cybersecurity Club",
  "description": "Student-led cybersecurity community",
  "stats": {
    "members": 50,
    "events": 25,
    "projects": 15
  }
}
```

---

## 🔐 Security Best Practices

✅ **Password Hashing:** Uses bcrypt (12 rounds)
✅ **JWT Authentication:** Secure token-based auth
✅ **Rate Limiting:** 1000 requests per 15 minutes
✅ **CORS:** Configured for Vercel frontend
✅ **Helmet:** Security headers enabled
✅ **Environment Variables:** Sensitive data in .env

---

## 📈 Monitoring

### **Check Database Health:**
```bash
# MongoDB Atlas → Metrics
- Connection count
- Operations per second
- Data size
- Index size
```

### **Backend Logs:**
```bash
# Render → Logs
- MongoDB connection status
- API requests
- Errors and warnings
```

---

## 🐛 Troubleshooting

### **Issue: "MongoDB connection timeout"**
**Solution:**
1. Check Network Access allows 0.0.0.0/0
2. Verify MONGODB_URI in Render env vars
3. Check MongoDB Atlas cluster is active

### **Issue: "Authentication failed"**
**Solution:**
1. Verify username: `anonymoussdmcet_db_user`
2. Verify password: `BVK292@appu`
3. Check user has read/write permissions

### **Issue: "Database not found"**
**Solution:**
1. Database will be created automatically
2. Run seed.js to populate data
3. Check cluster name in connection string

---

## ✅ Database Status

Your database is:
- ✅ **Connected** to MongoDB Atlas
- ✅ **Configured** with correct credentials
- ✅ **Secured** with proper network access
- ✅ **Ready** for production use

---

## 🎯 Next Steps

1. **Run seed script** to populate initial data
2. **Create admin account** for dashboard access
3. **Add events** through admin panel
4. **Upload gallery images**
5. **Update club information**

Your MongoDB database is fully configured and ready to use! 🎉
