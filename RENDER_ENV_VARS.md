# 🔧 Render Environment Variables Setup

You're at the Environment Variables section in Render. Here are ALL the environment variables you need to add:

## Required Environment Variables:

### 1. NODE_ENV
```
NAME_OF_VARIABLE: NODE_ENV
value: production
```

### 2. MONGODB_URI
```
NAME_OF_VARIABLE: MONGODB_URI
value: mongodb+srv://anonymoussdmcet_db_user:0Bpf2PiwefdgHyV2@cluster0.xxxxx.mongodb.net/anonymous-club?retryWrites=true&w=majority
```
**⚠️ IMPORTANT**: Replace `cluster0.xxxxx.mongodb.net` with your actual cluster URL from MongoDB Atlas dashboard.

### 3. JWT_SECRET
```
NAME_OF_VARIABLE: JWT_SECRET
value: anonymous_cyber_club_super_secret_key_2024_change_in_production
```

### 4. JWT_EXPIRE
```
NAME_OF_VARIABLE: JWT_EXPIRE
value: 7d
```

### 5. EMAIL_SERVICE
```
NAME_OF_VARIABLE: EMAIL_SERVICE
value: gmail
```

### 6. EMAIL_USER
```
NAME_OF_VARIABLE: EMAIL_USER
value: anonymous.sdmcet@gmail.com
```

### 7. EMAIL_PASS
```
NAME_OF_VARIABLE: EMAIL_PASS
value: mgha cjmu jbpl ezrr
```

### 8. FRONTEND_URL (Add this after Vercel deployment)
```
NAME_OF_VARIABLE: FRONTEND_URL
value: https://your-vercel-app.vercel.app
```
**Note**: You'll update this with your actual Vercel URL after frontend deployment.

## How to Add Each Variable:

1. Click "Add Environment Variable"
2. Enter the NAME_OF_VARIABLE exactly as shown above
3. Enter the value exactly as shown above
4. Click "Add" or "Save"
5. Repeat for all 8 variables

## ⚠️ Don't Forget:
- Get your actual MongoDB connection string from Atlas dashboard
- Replace the cluster URL in MONGODB_URI
- FRONTEND_URL will be updated after Vercel deployment

After adding all variables, click "Create Web Service" to deploy!