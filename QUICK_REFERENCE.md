# ⚡ Quick Reference Card

## 🚀 Quick Start Commands

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Setup environment
cd backend && cp .env.example .env

# Seed database
cd backend && npm run seed

# Start development
cd backend && npm run dev      # Terminal 1
cd frontend && npm run dev     # Terminal 2
```

## 📝 Default Credentials (After Seeding)

```
Admin:
Email: admin@anonymous.club
Password: admin123

User:
Email: hacker@anonymous.club
Password: hacker123
```

## 🌐 Default URLs

```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
MongoDB:  mongodb://localhost:27017
```

## 📁 Key Files

```
Backend Config:     backend/.env
Frontend Config:    frontend/vite.config.js
Tailwind Config:    frontend/tailwind.config.js
Auth Context:       frontend/src/context/AuthContext.jsx
API Utils:          frontend/src/utils/api.js
```

## 🎨 Color Codes

```css
Cyber Blue:   #00d9ff
Cyber Green:  #00ff41
Cyber Red:    #ff0055
Cyber Purple: #bd00ff
Dark BG:      #0a0e27
Darker BG:    #050814
```

## 🔐 API Endpoints

### Authentication
```
POST /api/auth/register    - Register user
POST /api/auth/login       - Login user
```

### Events
```
GET    /api/events         - List all events
GET    /api/events/:id     - Get single event
POST   /api/events         - Create event (admin)
PUT    /api/events/:id     - Update event (admin)
DELETE /api/events/:id     - Delete event (admin)
```

## 🛠️ Common Commands

### Backend
```bash
npm run dev      # Start dev server with watch
npm start        # Start production server
npm run seed     # Seed database
```

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### MongoDB
```bash
mongod                    # Start MongoDB
mongo                     # Open MongoDB shell
use anonymous-club        # Switch to database
db.users.find()          # View users
db.events.find()         # View events
```

## 🔧 Quick Fixes

### Clear Everything
```bash
# Backend
cd backend
rmdir /s node_modules
del package-lock.json
npm install

# Frontend
cd frontend
rmdir /s node_modules
del package-lock.json
npm install
```

### Reset Database
```bash
cd backend
node seed.js
```

### Clear Browser Data
```js
// In browser console
localStorage.clear();
location.reload();
```

## 📦 Package Versions

### Backend
```json
"express": "^4.18.2"
"mongoose": "^8.0.3"
"jsonwebtoken": "^9.0.2"
"bcryptjs": "^2.4.3"
```

### Frontend
```json
"react": "^18.2.0"
"vite": "^5.0.8"
"tailwindcss": "^3.3.6"
"framer-motion": "^10.16.16"
```

## 🎯 Project Structure (Simplified)

```
backend/
  ├── models/        # Database schemas
  ├── routes/        # API endpoints
  ├── middleware/    # Auth & validation
  └── server.js      # Main server

frontend/
  ├── src/
  │   ├── components/  # Reusable UI
  │   ├── pages/       # Route pages
  │   ├── context/     # Global state
  │   └── utils/       # API calls
  └── index.html
```

## 🔍 Debugging

### Check Backend
```bash
cd backend
npm run dev
# Watch console for errors
```

### Check Frontend
```bash
cd frontend
npm run dev
# Open browser console (F12)
```

### Check MongoDB
```bash
# Verify connection
mongosh
show dbs
use anonymous-club
db.users.countDocuments()
```

## 🌐 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/anonymous-club
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-url.com
```

## 📱 Responsive Breakpoints

```css
Mobile:  < 768px
Tablet:  768px - 1024px
Desktop: > 1024px
```

## 🎨 Tailwind Classes (Common)

```css
bg-cyber-dark          # Dark background
text-cyber-blue        # Blue text
border-cyber-blue/30   # Blue border 30% opacity
text-glow              # Neon glow effect
hover:scale-105        # Scale on hover
```

## 🔐 Security Checklist

- [x] Password hashing (bcrypt)
- [x] JWT authentication
- [x] Rate limiting
- [x] CORS configuration
- [x] Helmet security headers
- [x] Input validation
- [x] Protected routes
- [x] Role-based access

## 📊 Database Schema

### User
```js
{
  username: String,
  email: String,
  password: String (hashed),
  role: 'user' | 'admin'
}
```

### Event
```js
{
  title: String,
  date: Date,
  category: 'Workshop' | 'Hackathon' | 'Webinar' | 'Conference',
  summary: String,
  description: String,
  images: [{ url, caption }],
  tags: [String],
  status: 'upcoming' | 'past'
}
```

## 🚀 Deployment Quick Steps

### Railway (Backend)
1. Push to GitHub
2. Connect repo to Railway
3. Add environment variables
4. Deploy

### Vercel (Frontend)
1. Push to GitHub
2. Connect repo to Vercel
3. Set root: `frontend`
4. Add `VITE_API_URL`
5. Deploy

## 📞 Support Resources

- **README.md** - Full documentation
- **SETUP.md** - Setup guide
- **TROUBLESHOOTING.md** - Common issues
- **DEPLOYMENT.md** - Production deployment
- **FEATURES.md** - Feature list

---

**Keep this card handy for quick reference!**
