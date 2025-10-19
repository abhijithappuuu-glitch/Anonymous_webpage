# Admin Dashboard Documentation

## 🎯 Overview

A comprehensive admin dashboard has been created where you can edit **EVERY SINGLE THING** on your website.

## 📍 Access

**URL**: `/dashboard` (or `/#/dashboard` with HashRouter)

**Route**: Only accessible to users with `role: 'admin'`

## 🎛️ Features

The dashboard has **7 TABS** to manage all website content:

### 1️⃣ **Events Manager** 📅
Edit all events (workshops, hackathons, webinars, conferences):
- Create new events
- Edit existing events  
- Delete events
- Manage:
  - Title
  - Date
  - Category (Workshop/Hackathon/Webinar/Conference/Other)
  - Summary
  - Description
  - Tags (comma-separated)
  - Status (upcoming/past)
  - Images (future feature)

### 2️⃣ **Club Info Editor** ℹ️
Edit ALL club information displayed on About page:
- **About Section**:
  - Mission statement
  - Vision statement
  - Founded year
  - Location
  
- **Statistics**:
  - Total members (e.g., "150+")
  - CTF challenges (e.g., "50+")
  - National ranking (e.g., "#3")
  - CVEs disclosed (e.g., "25+")
  - Workshops conducted (e.g., "40+")
  - Industry partners (e.g., "15+")
  
- **Contact Information**:
  - Email
  - Campus location
  - Discord link
  - GitHub link
  
- **Social Media**:
  - Twitter URL
  - LinkedIn URL
  - YouTube URL
  - Instagram URL
  
- **Footer**:
  - Footer description text

### 3️⃣ **Team Members Editor** 👥
Manage all team members displayed on About page:
- Add new members
- Edit existing members
- Delete members
- Manage:
  - Full name
  - Role (e.g., "Founder & Technical Lead")
  - Specialty (e.g., "Penetration Testing")
  - Bio (description)
  - Initials (auto-generated from name if empty)
  - Display order (number for sorting)
  - Active status (show/hide member)

### 4️⃣ **Timeline Editor** ⏱️
Manage timeline events shown on Home page:
- Add timeline events
- Edit events
- Delete events
- Manage:
  - Title
  - Date
  - Description

### 5️⃣ **Gallery Manager** 🖼️
Manage gallery images:
- Upload new images (with file picker)
- Edit image captions
- Delete images
- Images stored on backend server (`/uploads/` directory)

### 6️⃣ **Home Content Editor** 🏠
Edit custom home page content:
- Free-form HTML/Markdown editor
- Large textarea for flexible content
- Save and publish instantly

### 7️⃣ **Users Manager** 👤
User management (coming soon):
- Manage registered users
- Change permissions
- Assign roles

## 🔐 Security

- All admin routes protected with JWT authentication
- Backend validates `role: 'admin'` on every request
- Authorization header: `Bearer <token>`
- Unauthorized users redirected to home page

## 🎨 Theme Support

Dashboard fully supports both themes:
- **Hacker Mode** (green/terminal style)
- **Default Mode** (cyan/purple gradient)

## 📊 Dashboard Stats

Top of dashboard shows real-time statistics:
- Total Events
- Timeline Events  
- Gallery Images
- Team Members
- Users (coming soon)

## 🚀 Navigation

### For Admin Users:
1. Click menu button (3 dots) in navbar
2. You'll see two options:
   - ⚡ **ADMIN PANEL** → `/admin` (old admin page)
   - 🎛️ **DASHBOARD** → `/dashboard` (new comprehensive dashboard)

### For Regular Users:
- Dashboard links hidden (not visible)
- Direct URL access blocked (redirects to home)

## 🔧 Technical Details

### Frontend Files Created:
```
frontend/src/
├── pages/
│   └── AdminDashboard.jsx           # Main dashboard page
└── components/
    └── admin/
        ├── EventsManager.jsx         # Events CRUD
        ├── ClubInfoEditor.jsx        # Club info editor
        ├── TeamMembersEditor.jsx     # Team CRUD
        ├── TimelineEditor.jsx        # Timeline CRUD
        ├── GalleryManager.jsx        # Gallery CRUD with upload
        ├── HomeContentEditor.jsx     # Home content editor
        └── UsersManager.jsx          # Users (placeholder)
```

### Backend Routes Used:
```
GET    /api/events                    # Fetch all events
POST   /api/events                    # Create event
PUT    /api/events/:id                # Update event
DELETE /api/events/:id                # Delete event

GET    /api/admin/club-info           # Fetch club info
POST   /api/admin/club-info           # Update club info

GET    /api/admin/team-members        # Fetch team members
POST   /api/admin/team-members        # Create member
PUT    /api/admin/team-members/:id    # Update member
DELETE /api/admin/team-members/:id    # Delete member

GET    /api/admin/timeline            # Fetch timeline events
POST   /api/admin/timeline            # Create timeline event
PUT    /api/admin/timeline/:id        # Update timeline event
DELETE /api/admin/timeline/:id        # Delete timeline event

GET    /api/admin/gallery             # Fetch gallery images
POST   /api/admin/gallery             # Upload image (multipart/form-data)
PUT    /api/admin/gallery/:id         # Update caption
DELETE /api/admin/gallery/:id         # Delete image

GET    /api/admin/home                # Fetch home content
POST   /api/admin/home                # Update home content
```

## ✅ Current Admin User

From your seed script:
- **Email**: anonymous.sdmcet@gmail.com
- **Password**: SecureAdmin2024!
- **Role**: admin

## 📝 Usage Instructions

### Step 1: Login as Admin
1. Go to your website
2. Click LOGIN
3. Enter admin credentials:
   - Email: anonymous.sdmcet@gmail.com
   - Password: SecureAdmin2024!

### Step 2: Access Dashboard
1. Click menu button (3 dots in navbar)
2. Click **🎛️ DASHBOARD**

### Step 3: Edit Content
1. Select tab for what you want to edit (Events, Club Info, Team, etc.)
2. Fill in the forms
3. Click Save/Update/Create buttons
4. Changes are immediate on the website!

## 🎉 What You Can Edit

**EVERYTHING on the website:**
- ✅ All Events (past and upcoming)
- ✅ All Club Information (mission, vision, stats)
- ✅ All Team Members (founders, core team)
- ✅ Timeline of Club History
- ✅ Gallery Images
- ✅ Home Page Custom Content
- ✅ Contact Information
- ✅ Social Media Links
- ✅ Footer Text
- ✅ Statistics (members, CTF wins, CVEs, etc.)

## 🔄 Real-time Updates

All changes save to MongoDB and appear immediately on:
- Home page (`/`)
- About page (`/about`)
- Events page (`/events`)
- Gallery (when implemented)

## 🛠️ Future Enhancements

Potential additions:
- [ ] Image uploads for team members (profile pictures)
- [ ] Event image uploads (multiple images per event)
- [ ] Rich text editor (WYSIWYG) for descriptions
- [ ] Bulk operations (delete multiple, export data)
- [ ] Analytics dashboard (page views, user registrations)
- [ ] User management (approve/reject registrations)
- [ ] Email notifications (event reminders)
- [ ] SEO settings editor

## 📱 Mobile Support

Dashboard is **fully responsive**:
- Tab navigation adapts to mobile
- Forms stack vertically on small screens
- Touch-friendly buttons
- Optimized for tablets and phones

## 🎨 Design Features

- **Modern UI**: Glassmorphism effects
- **Smooth Animations**: Framer Motion transitions
- **Theme Support**: Hacker & Default themes
- **Icons**: Emoji icons for visual clarity
- **Status Indicators**: Real-time stats at top
- **Tab Navigation**: Easy switching between sections
- **Confirmation Dialogs**: Prevent accidental deletions

## 💡 Pro Tips

1. **Order Team Members**: Use the "order" field (0, 1, 2, etc.) to control display order
2. **Tags for Events**: Use comma-separated tags for better filtering
3. **Image Captions**: Add descriptive captions for SEO
4. **Timeline Sorting**: Timeline events auto-sort by date
5. **Active Status**: Use "isActive" to hide team members without deleting

## 🚨 Important Notes

- **Backup Data**: Always backup before bulk operations
- **Test Changes**: Review changes on live site after saving
- **Admin Access**: Keep admin credentials secure
- **Image Uploads**: Backend stores in `/uploads/` directory
- **MongoDB**: All data persists in your MongoDB Atlas database

## 📞 Support

If you need any modifications or additions to the dashboard, just ask!

---

**Created**: October 19, 2025  
**Status**: ✅ Production Ready  
**Access**: Admin Only
