# 📁 Project Structure

```
anon web/
│
├── backend/                      # Node.js + Express Backend
│   ├── models/                   # MongoDB Models
│   │   ├── User.js              # User schema with bcrypt
│   │   └── Event.js             # Event schema
│   │
│   ├── routes/                   # API Routes
│   │   ├── auth.js              # Authentication endpoints
│   │   └── events.js            # Event CRUD endpoints
│   │
│   ├── middleware/               # Custom Middleware
│   │   └── auth.js              # JWT verification & RBAC
│   │
│   ├── server.js                 # Express server setup
│   ├── seed.js                   # Database seeding script
│   ├── package.json              # Backend dependencies
│   ├── .env.example              # Environment template
│   └── .env                      # Environment variables (create this)
│
├── frontend/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/          # Reusable Components
│   │   │   ├── AnimatedLogo.jsx    # Kali-inspired boot animation
│   │   │   ├── AuthForm.jsx        # Login/Register form
│   │   │   ├── Timeline.jsx        # Event timeline component
│   │   │   ├── EventModal.jsx      # Event detail modal
│   │   │   └── Navbar.jsx          # Navigation bar
│   │   │
│   │   ├── pages/               # Page Components
│   │   │   ├── Landing.jsx         # Animated landing page
│   │   │   ├── Home.jsx            # Dashboard with timeline
│   │   │   ├── Events.jsx          # Events listing page
│   │   │   └── Gallery.jsx         # Photo gallery page
│   │   │
│   │   ├── context/             # React Context
│   │   │   └── AuthContext.jsx     # Global auth state
│   │   │
│   │   ├── utils/               # Utility Functions
│   │   │   └── api.js              # Axios API calls
│   │   │
│   │   ├── App.jsx              # Main app with routing
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Global styles + Tailwind
│   │
│   ├── index.html               # HTML template
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind theme config
│   └── postcss.config.js        # PostCSS config
│
├── README.md                    # Main documentation
├── SETUP.md                     # Quick start guide
├── DEPLOYMENT.md                # Production deployment guide
├── PROJECT_STRUCTURE.md         # This file
└── .gitignore                   # Git ignore rules
```

## 🔑 Key Files Explained

### Backend

**server.js**
- Express app initialization
- Middleware setup (CORS, Helmet, Rate Limiting)
- MongoDB connection
- Route mounting

**models/User.js**
- User schema with username, email, password
- Pre-save hook for password hashing
- Password comparison method

**models/Event.js**
- Event schema with title, date, category, images
- Status tracking (upcoming/past)
- Tags and filtering support

**routes/auth.js**
- POST /register - Create new user
- POST /login - Authenticate user
- JWT token generation
- Input validation

**routes/events.js**
- GET /events - List all events (with filters)
- GET /events/:id - Get single event
- POST /events - Create event (admin only)
- PUT /events/:id - Update event (admin only)
- DELETE /events/:id - Delete event (admin only)

**middleware/auth.js**
- JWT token verification
- User authentication
- Role-based access control (admin check)

### Frontend

**App.jsx**
- React Router setup
- Protected route wrapper
- Route definitions

**context/AuthContext.jsx**
- Global authentication state
- Login/logout functions
- Token management
- LocalStorage persistence

**components/AnimatedLogo.jsx**
- SVG logo with rotation animation
- Terminal-style loading text
- Framer Motion animations

**components/AuthForm.jsx**
- Login/Register toggle
- Form validation
- Error handling
- API integration

**components/Timeline.jsx**
- Vertical timeline layout
- Alternating left/right events
- Scroll animations
- Click to view details

**components/EventModal.jsx**
- Full event details
- Image gallery
- Tags display
- Close on backdrop click

**pages/Landing.jsx**
- Animated logo entrance
- Logo slides left
- Auth form slides in from right
- Smooth transitions

**pages/Home.jsx**
- Club description
- Feature cards
- Event timeline
- Modal integration

**pages/Events.jsx**
- Grid layout
- Category/status filters
- Event cards
- Click to view modal

**pages/Gallery.jsx**
- Images grouped by event
- Grid layout
- Lightbox viewer
- Hover effects

## 🎨 Styling Architecture

### Tailwind Configuration
- Custom cyber color palette
- Custom fonts (Orbitron)
- Extended theme utilities

### Global Styles (index.css)
- Tailwind directives
- Custom glow effects
- Terminal cursor animation
- Base resets

### Component Styles
- Utility-first approach
- Inline Tailwind classes
- Framer Motion for animations
- Responsive breakpoints

## 🔐 Security Layers

1. **Password Security**: bcrypt hashing (12 rounds)
2. **Token Security**: JWT with expiration
3. **Route Protection**: Middleware authentication
4. **Rate Limiting**: 100 requests per 15 minutes
5. **CORS**: Configured allowed origins
6. **Helmet**: Security headers
7. **Input Validation**: express-validator
8. **RBAC**: Role-based access control

## 🚀 Data Flow

### Authentication Flow
```
User Input → AuthForm → API Call → Backend Validation → 
JWT Generation → Response → AuthContext → LocalStorage → 
Protected Routes Access
```

### Event Display Flow
```
Page Load → API Call → Backend Query → MongoDB → 
Response → State Update → Component Render → 
User Interaction → Modal Display
```

## 📦 Dependencies Overview

### Backend Core
- express: Web framework
- mongoose: MongoDB ODM
- jsonwebtoken: JWT auth
- bcryptjs: Password hashing

### Backend Security
- helmet: Security headers
- cors: Cross-origin requests
- express-rate-limit: Rate limiting
- express-validator: Input validation

### Frontend Core
- react: UI library
- react-router-dom: Routing
- axios: HTTP client
- framer-motion: Animations

### Frontend Styling
- tailwindcss: Utility CSS
- postcss: CSS processing
- autoprefixer: CSS prefixing

## 🔄 Development Workflow

1. **Start MongoDB** (local or Atlas)
2. **Run Backend** (`npm run dev` in backend/)
3. **Run Frontend** (`npm run dev` in frontend/)
4. **Make Changes** (hot reload enabled)
5. **Test Features** (register, login, events)
6. **Commit Changes** (Git)
7. **Deploy** (Railway + Vercel)

## 📝 Adding New Features

### New Page
1. Create component in `frontend/src/pages/`
2. Add route in `App.jsx`
3. Add navigation link in `Navbar.jsx`

### New API Endpoint
1. Add route in `backend/routes/`
2. Create controller function
3. Add middleware if needed
4. Update API utility in `frontend/src/utils/api.js`

### New Model
1. Create schema in `backend/models/`
2. Add validation rules
3. Create routes for CRUD
4. Update seed script if needed

---

**This structure follows best practices for scalability and maintainability.**
