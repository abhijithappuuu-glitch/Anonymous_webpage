# 🚀 Quick Start Guide

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and update:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secure random string

## Step 3: Start MongoDB

### Local MongoDB
```bash
mongod
```

### Or use MongoDB Atlas
Sign up at https://www.mongodb.com/cloud/atlas and get your connection string.

## Step 4: Seed Database (Optional)

```bash
cd backend
npm run seed
```

This creates:
- Admin user: `admin@anonymous.club` / `admin123`
- Regular user: `hacker@anonymous.club` / `hacker123`
- 3 sample events

## Step 5: Start Development Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Server runs on http://localhost:5000

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
App runs on http://localhost:5173

## Step 6: Access the Application

1. Open http://localhost:5173
2. Watch the animated logo
3. Register a new account or login with seeded credentials
4. Explore the dashboard, events, and gallery

## 🎨 Customization

### Change Colors
Edit `frontend/tailwind.config.js`:
```js
colors: {
  cyber: {
    blue: '#00d9ff',    // Change primary color
    green: '#00ff41',   // Change accent color
    red: '#ff0055'      // Change alert color
  }
}
```

### Add Your Logo
Replace the SVG in `frontend/src/components/AnimatedLogo.jsx`

### Modify Club Info
Edit `frontend/src/pages/Home.jsx` to update club description

## 🔒 Production Deployment

### Backend (Railway/Render)
1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable: `VITE_API_URL=your-backend-url`
6. Deploy

## 📝 Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Whitelist your IP in MongoDB Atlas

### CORS Error
- Update `FRONTEND_URL` in backend `.env`
- Check CORS configuration in `server.js`

### Port Already in Use
- Change `PORT` in backend `.env`
- Change port in `frontend/vite.config.js`

## 🆘 Need Help?

Check the main README.md for detailed documentation.
