# 🎯 START HERE - Anonymous Cybersecurity Club Website

Welcome! This is your complete guide to getting started with the Anonymous Cybersecurity Club website.

## 📚 Documentation Index

Choose the guide that fits your needs:

### 🚀 **Getting Started**
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick commands and reference card
- **[SETUP.md](SETUP.md)** - Step-by-step setup instructions
- **[README.md](README.md)** - Complete project documentation

### 🏗️ **Understanding the Project**
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - File structure and architecture
- **[FEATURES.md](FEATURES.md)** - Complete feature list and capabilities

### 🚀 **Deployment**
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide

### 🔧 **Troubleshooting**
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions

---

## ⚡ 5-Minute Quick Start

### 1️⃣ Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2️⃣ Setup Environment
```bash
cd backend
# .env file is already created with defaults
# Edit if you need custom MongoDB URI
```

### 3️⃣ Start MongoDB
```bash
# Make sure MongoDB is running
mongod
```

### 4️⃣ Seed Database (Optional)
```bash
cd backend
npm run seed
```

This creates:
- Admin: `admin@anonymous.club` / `admin123`
- User: `hacker@anonymous.club` / `hacker123`
- 3 sample events

### 5️⃣ Start Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 6️⃣ Open Browser
Visit: **http://localhost:5173**

---

## 🎬 What You'll See

### Landing Page
1. **Animated Logo** - Kali Linux-inspired boot animation
2. **Logo Slides Left** - After 1.5 seconds
3. **Auth Form Appears** - Login/Register form slides in
4. **Register or Login** - Create account or use seeded credentials

### Dashboard (After Login)
1. **Club Description** - Mission and values
2. **Feature Cards** - Ethical Hacking, Networking, CTF
3. **Event Timeline** - Vertical timeline with all events
4. **Click Events** - View full details in modal

### Navigation
- **Home** - Dashboard with timeline
- **Events** - Grid view with filters
- **Gallery** - Photos grouped by event

---

## 🎨 Visual Theme

The website features a **dark hacker aesthetic** inspired by Kali Linux:

- **Colors**: Neon blue, green, and purple on dark background
- **Fonts**: Orbitron (cyber-style) and Courier New (terminal)
- **Effects**: Glowing text, smooth animations, terminal cursor
- **Style**: Cyberpunk, futuristic, professional

---

## 🔐 Key Features

✅ **Secure Authentication** - JWT + bcrypt password hashing  
✅ **Animated Landing** - Kali Linux boot screen inspired  
✅ **Event Timeline** - Interactive vertical timeline  
✅ **Event Management** - Full CRUD with admin access  
✅ **Photo Gallery** - Organized by event with lightbox  
✅ **Responsive Design** - Mobile, tablet, desktop  
✅ **Security Hardened** - Rate limiting, CORS, Helmet  
✅ **Modern Stack** - React, Node.js, MongoDB, Tailwind  

---

## 📁 Project Structure

```
anon web/
├── backend/              # Node.js + Express API
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & validation
│   └── server.js        # Main server
│
├── frontend/            # React + Vite app
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Global state
│   │   └── utils/       # API utilities
│   └── index.html
│
└── Documentation files
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Security
- **Helmet** - Security headers
- **CORS** - Cross-origin config
- **Rate Limiting** - Brute force protection
- **Input Validation** - Data sanitization

---

## 🎯 Next Steps

### For Developers
1. ✅ Complete setup (see SETUP.md)
2. 📖 Read PROJECT_STRUCTURE.md
3. 🎨 Customize colors in tailwind.config.js
4. 📝 Add your club's content
5. 🖼️ Replace placeholder images
6. 🚀 Deploy (see DEPLOYMENT.md)

### For Admins
1. ✅ Login with admin credentials
2. 📅 Create events via API (admin panel coming soon)
3. 🖼️ Add event photos
4. 👥 Manage users
5. 📊 Monitor activity

### For Users
1. ✅ Register an account
2. 🔍 Browse events
3. 🖼️ View gallery
4. 📅 Check upcoming events

---

## 🎓 Learning Resources

### React
- [React Docs](https://react.dev)
- [React Router](https://reactrouter.com)

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com)
- [Tailwind UI](https://tailwindui.com)

### Framer Motion
- [Framer Motion Docs](https://www.framer.com/motion)

### Node.js & Express
- [Express Docs](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)

### Security
- [OWASP Top 10](https://owasp.org/www-project-top-ten)
- [JWT Best Practices](https://jwt.io)

---

## 🤝 Contributing

Want to improve the website?

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📞 Need Help?

### Quick Fixes
- **Server won't start?** → Check TROUBLESHOOTING.md
- **Styles broken?** → Hard refresh (Ctrl+Shift+R)
- **Can't login?** → Clear localStorage and try again
- **MongoDB error?** → Ensure MongoDB is running

### Documentation
- **Setup issues** → SETUP.md
- **Deployment** → DEPLOYMENT.md
- **Features** → FEATURES.md
- **Structure** → PROJECT_STRUCTURE.md

### Common Commands
```bash
# Reset everything
cd backend && npm run seed
localStorage.clear()  # In browser console

# Check logs
npm run dev  # Watch console output

# Fresh install
rm -rf node_modules package-lock.json
npm install
```

---

## 🎉 You're Ready!

You now have everything you need to:
- ✅ Run the website locally
- ✅ Understand the codebase
- ✅ Customize for your club
- ✅ Deploy to production
- ✅ Troubleshoot issues

**Start with SETUP.md and you'll be up and running in 5 minutes!**

---

## 📝 Quick Reference

**Default URLs:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

**Default Credentials (after seeding):**
- Admin: admin@anonymous.club / admin123
- User: hacker@anonymous.club / hacker123

**Key Commands:**
```bash
npm run dev    # Start development
npm run build  # Build for production
npm run seed   # Seed database
```

---

**Built with ❤️ for the Anonymous Cybersecurity Club**

*Hack the planet! 🌍🔐*
