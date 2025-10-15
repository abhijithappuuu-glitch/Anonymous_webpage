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
value: mongodb+srv://anonymoussdmcet_db_user:BVK292@appu@cluster0.89wxvqa.mongodb.net/anonymous-club?retryWrites=true&w=majority&appName=Cluster0
```
**✅ CORRECT**: This is your exact MongoDB Atlas connection string with username `anonymoussdmcet_db_user` and password `BVK292@appu`

### 3. JWT_SECRET
```
NAME_OF_VARIABLE: JWT_SECRET
value: anonymous_cyber_club_super_secret_key_2024_production_secure_token
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
value: arnz avmv arfm lrgi
```
**Note**: This is your Gmail App Password for sending OTP emails

### 8. FRONTEND_URL
```
NAME_OF_VARIABLE: FRONTEND_URL
value: https://anonymoussdmcet.vercel.app
```
**✅ CORRECT**: This is your deployed Vercel frontend URL

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