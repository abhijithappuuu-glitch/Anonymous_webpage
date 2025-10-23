# Anonymous Cybersecurity Club Website

A modern, secure, and visually striking website for the Anonymous Cybersecurity Club with Kali Linux-inspired aesthetics.

## 🔥 Features

- **🤖 NOBODY AI Assistant**: AI-powered chat using OpenAI ChatGPT for intelligent, conversational support
- **Animated Landing Page**: Kali Linux boot screen-inspired logo animation
- **Secure Authentication**: JWT-based auth with bcrypt password hashing (optional login mode supported)
- **Event Timeline**: Interactive timeline showcasing club events (past events include inline image previews)
- **Integrated Event Media**: Click any timeline/event card to open a modal with carousel photos & full details
- **Event Management**: Full CRUD operations with admin access control
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Hacker Theme**: Cyberpunk aesthetics with neon accents
- **Security**: CSRF protection, rate limiting, HTTPS ready

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- Framer Motion (animations)
- React Router DOM
- Axios

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (password hashing)
- Helmet (security headers)
- Express Rate Limit

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 🔐 Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/anonymous-club
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Create `frontend/.env` (for local development):

```env
VITE_OPENAI_API_KEY=sk-proj-your-api-key-here
```

> 🔒 **Security**: Never commit `.env` files to Git. See `SECURITY_CHECKLIST.md` for production setup.

## 🚀 Usage

1. Start MongoDB
2. Run backend: `cd backend && npm run dev`
3. Run frontend: `cd frontend && npm run dev`
4. Visit `http://localhost:5173`

## 📱 Pages

- **/landing** (legacy / optional) - Animated intro (can be removed)
- **/** - Home hero + integrated timeline & media
- **/events** - Filterable events grid (modal shows photos)

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt (12 rounds)
- Rate limiting (100 requests per 15 minutes)
- Helmet security headers
- CORS configuration
- Protected API routes
- Role-based access control (RBAC)

## 🎨 Design

- Dark theme with cyber aesthetics
- Neon blue (#00d9ff) and green (#00ff41) accents
- Terminal-inspired fonts (Orbitron)
- Smooth animations with Framer Motion
- Glow effects on interactive elements

## 📝 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Events
- `GET /api/events` - Get all events (with filters)
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)

## 🤖 NOBODY AI Assistant

The site features an integrated AI chat assistant powered by OpenAI ChatGPT.

**Setup**:
1. See `QUICK_START.md` for 5-minute setup guide
2. See `SECURITY_CHECKLIST.md` for complete security instructions
3. See `NOBODY_AI_TECHNICAL_DOCS.md` for technical details

**Features**:
- Intelligent conversational responses
- Navigation assistance
- Cybersecurity topic support
- Graceful fallback to local intelligence

## 🎯 Future Enhancements

- [ ] NOBODY AI: Streaming responses
- [ ] NOBODY AI: Conversation memory
- [ ] Admin panel for content management
- [ ] Two-factor authentication (2FA)
- [ ] Dark/Light mode toggle
- [ ] Blog / writeups section
- [ ] Public API for events
- [ ] Direct image upload (Cloudinary/Firebase)
- [ ] Email notifications
- [ ] Social media integration

## 📄 License

MIT License - feel free to use for your cybersecurity club!

## 🤝 Contributing

Pull requests welcome! Please follow the existing code style.

---

**Built with ❤️ by the Anonymous Cybersecurity Club**
