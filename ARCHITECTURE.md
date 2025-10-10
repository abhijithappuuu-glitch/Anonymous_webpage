# 🏗️ System Architecture

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
│                     http://localhost:5173                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTP/HTTPS
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    REACT FRONTEND (Vite)                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Pages    │  │ Components │  │  Context   │            │
│  │            │  │            │  │            │            │
│  │ Landing    │  │ AnimatedLogo│ │ AuthContext│            │
│  │ Home       │  │ AuthForm   │  │            │            │
│  │ Events     │  │ Timeline   │  └────────────┘            │
│  │ Gallery    │  │ EventModal │                             │
│  └────────────┘  └────────────┘                             │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              React Router (Protected Routes)           │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ Axios API Calls
                           │ /api/auth, /api/events
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                  EXPRESS BACKEND (Node.js)                   │
│                     http://localhost:5000                    │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   Middleware Stack                     │ │
│  │  • Helmet (Security Headers)                           │ │
│  │  • CORS (Cross-Origin)                                 │ │
│  │  • Rate Limiter (100 req/15min)                        │ │
│  │  • Body Parser (JSON)                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────┐         ┌─────────────────┐            │
│  │  Auth Routes    │         │  Event Routes   │            │
│  │                 │         │                 │            │
│  │ POST /register  │         │ GET /events     │            │
│  │ POST /login     │         │ GET /events/:id │            │
│  │                 │         │ POST /events    │ (admin)    │
│  │                 │         │ PUT /events/:id │ (admin)    │
│  │                 │         │ DELETE /:id     │ (admin)    │
│  └─────────────────┘         └─────────────────┘            │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Auth Middleware (JWT Verify)              │ │
│  │              • protect (authentication)                │ │
│  │              • admin (authorization)                   │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ Mongoose ODM
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      MONGODB DATABASE                        │
│                 mongodb://localhost:27017                    │
│                                                               │
│  ┌─────────────────────┐      ┌─────────────────────┐       │
│  │   users collection  │      │  events collection  │       │
│  │                     │      │                     │       │
│  │  • _id              │      │  • _id              │       │
│  │  • username         │      │  • title            │       │
│  │  • email            │      │  • date             │       │
│  │  • password (hash)  │      │  • category         │       │
│  │  • role             │      │  • summary          │       │
│  │  • timestamps       │      │  • description      │       │
│  │                     │      │  • images[]         │       │
│  │                     │      │  • tags[]           │       │
│  │                     │      │  • status           │       │
│  │                     │      │  • timestamps       │       │
│  └─────────────────────┘      └─────────────────────┘       │
└───────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagrams

### 1. User Registration Flow

```
User Input (Form)
    │
    ▼
AuthForm Component
    │
    ▼
POST /api/auth/register
    │
    ▼
Express Validator (Input Validation)
    │
    ▼
Check User Exists (MongoDB Query)
    │
    ├─ Exists ──► Return 400 Error
    │
    └─ Not Exists
        │
        ▼
    bcrypt.hash(password, 12)
        │
        ▼
    Create User in MongoDB
        │
        ▼
    Generate JWT Token
        │
        ▼
    Return User + Token
        │
        ▼
    AuthContext.login()
        │
        ▼
    Save to localStorage
        │
        ▼
    Redirect to Dashboard
```

### 2. User Login Flow

```
User Input (Email + Password)
    │
    ▼
AuthForm Component
    │
    ▼
POST /api/auth/login
    │
    ▼
Find User by Email
    │
    ├─ Not Found ──► Return 401 Error
    │
    └─ Found
        │
        ▼
    bcrypt.compare(password, hash)
        │
        ├─ Invalid ──► Return 401 Error
        │
        └─ Valid
            │
            ▼
        Generate JWT Token
            │
            ▼
        Return User + Token
            │
            ▼
        AuthContext.login()
            │
            ▼
        Save to localStorage
            │
            ▼
        Redirect to Dashboard
```

### 3. Protected Route Access Flow

```
User Navigates to Protected Page
    │
    ▼
ProtectedRoute Component
    │
    ▼
Check AuthContext.user
    │
    ├─ No User ──► Redirect to /landing
    │
    └─ User Exists
        │
        ▼
    Render Protected Page
        │
        ▼
    Page Makes API Call
        │
        ▼
    Axios Interceptor Adds Token
        │
        ▼
    Request to Backend
        │
        ▼
    Auth Middleware (protect)
        │
        ▼
    Verify JWT Token
        │
        ├─ Invalid ──► Return 401 Error
        │
        └─ Valid
            │
            ▼
        Attach User to req.user
            │
            ▼
        Continue to Route Handler
            │
            ▼
        Process Request
            │
            ▼
        Return Response
```

### 4. Event Creation Flow (Admin)

```
Admin Fills Event Form
    │
    ▼
POST /api/events
    │
    ▼
Auth Middleware (protect)
    │
    ├─ No Token ──► Return 401 Error
    │
    └─ Valid Token
        │
        ▼
    Admin Middleware (admin)
        │
        ├─ Not Admin ──► Return 403 Error
        │
        └─ Is Admin
            │
            ▼
        Validate Event Data
            │
            ▼
        Create Event in MongoDB
            │
            ▼
        Return Created Event
            │
            ▼
        Update UI State
            │
            ▼
        Show Success Message
```

### 5. Event Timeline Display Flow

```
User Visits Home Page
    │
    ▼
Home Component Mounts
    │
    ▼
useEffect Hook Triggers
    │
    ▼
GET /api/events
    │
    ▼
MongoDB Query (Find All Events)
    │
    ▼
Sort by Date (Descending)
    │
    ▼
Return Events Array
    │
    ▼
Update State (setEvents)
    │
    ▼
Timeline Component Renders
    │
    ▼
Map Over Events
    │
    ▼
Render Event Cards
    │
    ▼
User Clicks Event
    │
    ▼
setSelectedEvent(event)
    │
    ▼
EventModal Opens
    │
    ▼
Display Full Event Details
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                         │
└─────────────────────────────────────────────────────────────┘

Layer 1: Transport Security
    • HTTPS (Production)
    • Secure Headers (Helmet)
    • CORS Configuration

Layer 2: Authentication
    • JWT Tokens (7 day expiration)
    • bcrypt Password Hashing (12 rounds)
    • Token in Authorization Header

Layer 3: Authorization
    • Role-Based Access Control (RBAC)
    • Protected Routes (Frontend)
    • Protected Endpoints (Backend)
    • Admin-Only Operations

Layer 4: Input Validation
    • express-validator (Backend)
    • React Form Validation (Frontend)
    • MongoDB Schema Validation

Layer 5: Rate Limiting
    • 100 requests per 15 minutes
    • Per IP address
    • Prevents brute force attacks

Layer 6: Data Protection
    • Passwords never stored in plain text
    • Sensitive data in environment variables
    • No credentials in client code
```

---

## 📦 Component Architecture

### Frontend Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── BrowserRouter
│       └── Routes
│           ├── Landing (Public)
│           │   ├── AnimatedLogo
│           │   └── AuthForm
│           │
│           ├── Home (Protected)
│           │   ├── Navbar
│           │   ├── Timeline
│           │   └── EventModal
│           │
│           ├── Events (Protected)
│           │   ├── Navbar
│           │   └── EventModal
│           │
│           └── Gallery (Protected)
│               ├── Navbar
│               └── Image Lightbox
```

### Backend Module Structure

```
server.js (Entry Point)
├── Middleware
│   ├── helmet()
│   ├── cors()
│   ├── rateLimit()
│   └── express.json()
│
├── Routes
│   ├── /api/auth
│   │   ├── POST /register
│   │   └── POST /login
│   │
│   └── /api/events
│       ├── GET /
│       ├── GET /:id
│       ├── POST / (protected, admin)
│       ├── PUT /:id (protected, admin)
│       └── DELETE /:id (protected, admin)
│
└── MongoDB Connection
    ├── User Model
    └── Event Model
```

---

## 🔄 State Management

### Global State (Context API)

```
AuthContext
├── State
│   ├── user (object | null)
│   └── loading (boolean)
│
└── Methods
    ├── login(userData)
    └── logout()
```

### Local State (Component Level)

```
Landing Page
├── showAuth (boolean)

Home Page
├── events (array)
└── selectedEvent (object | null)

Events Page
├── events (array)
├── filter (object)
└── selectedEvent (object | null)

Gallery Page
├── events (array)
└── selectedImage (object | null)

AuthForm
├── isLogin (boolean)
├── formData (object)
└── error (string)
```

---

## 🎨 Styling Architecture

```
Tailwind CSS Configuration
├── Custom Theme
│   ├── Colors (cyber palette)
│   ├── Fonts (Orbitron)
│   └── Extensions
│
├── Global Styles (index.css)
│   ├── Tailwind Directives
│   ├── Custom Utilities
│   │   ├── text-glow
│   │   ├── border-glow
│   │   └── terminal-cursor
│   └── Base Resets
│
└── Component Styles
    ├── Utility Classes (Tailwind)
    └── Inline Styles (Framer Motion)
```

---

## 🚀 Deployment Architecture

### Development

```
Local Machine
├── MongoDB (localhost:27017)
├── Backend (localhost:5000)
└── Frontend (localhost:5173)
```

### Production

```
┌─────────────────────────────────────────┐
│         Vercel/Netlify (Frontend)       │
│         https://your-app.vercel.app     │
└────────────────┬────────────────────────┘
                 │
                 │ API Calls
                 │
┌────────────────▼────────────────────────┐
│       Railway/Render (Backend)          │
│       https://your-api.railway.app      │
└────────────────┬────────────────────────┘
                 │
                 │ MongoDB Connection
                 │
┌────────────────▼────────────────────────┐
│         MongoDB Atlas (Database)        │
│         mongodb+srv://...               │
└─────────────────────────────────────────┘
```

---

## 📊 Database Schema Relationships

```
┌─────────────────────┐
│       User          │
│                     │
│  _id: ObjectId      │
│  username: String   │
│  email: String      │
│  password: String   │
│  role: String       │
└─────────────────────┘
         │
         │ (No direct relationship,
         │  but admin users can
         │  create/edit events)
         │
┌────────▼────────────┐
│       Event         │
│                     │
│  _id: ObjectId      │
│  title: String      │
│  date: Date         │
│  category: String   │
│  summary: String    │
│  description: String│
│  images: Array      │
│  tags: Array        │
│  status: String     │
└─────────────────────┘
```

---

## 🔄 Request/Response Cycle

### Example: Fetching Events

```
1. User Action
   └─► User visits Home page

2. Component Mount
   └─► useEffect() triggers

3. API Call
   └─► eventAPI.getAll()
       └─► axios.get('/api/events')

4. Backend Receives Request
   └─► Express Router matches GET /api/events
       └─► Event.find() query

5. Database Query
   └─► MongoDB returns events array

6. Backend Response
   └─► res.json(events)

7. Frontend Receives Response
   └─► setEvents(data)

8. Component Re-renders
   └─► Timeline displays events

9. User Interaction
   └─► User clicks event
       └─► Modal opens with details
```

---

## 🎯 Performance Optimization Points

### Frontend
- Code splitting by route
- Lazy loading components
- Image optimization
- CSS purging (Tailwind)
- Vite build optimization

### Backend
- MongoDB indexing (future)
- Connection pooling
- Response compression
- Caching headers
- Query optimization

### Database
- Indexes on frequently queried fields
- Efficient query patterns
- Connection pooling
- Aggregation pipelines (future)

---

**This architecture is designed for scalability, security, and maintainability!**
