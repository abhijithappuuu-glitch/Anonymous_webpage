# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### 1. MongoDB Connection Failed

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions**:
- Ensure MongoDB is running: `mongod` or check MongoDB service
- Verify connection string in `backend/.env`
- Check if port 27017 is available
- For MongoDB Atlas: Whitelist your IP address

```bash
# Check if MongoDB is running (Windows)
tasklist | findstr mongod

# Start MongoDB service (Windows)
net start MongoDB
```

### 2. Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solutions**:
- Change port in `backend/.env`: `PORT=5001`
- Kill process using the port:

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Find and change port in .env
PORT=5001
```

### 3. CORS Error

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solutions**:
- Verify `FRONTEND_URL` in `backend/.env` matches your frontend URL
- Check CORS configuration in `backend/server.js`
- Ensure both servers are running

```js
// backend/server.js - Verify this matches your frontend
cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
})
```

### 4. JWT Token Invalid

**Error**: `Token invalid` or `Not authorized`

**Solutions**:
- Clear localStorage and login again
- Verify `JWT_SECRET` is set in `backend/.env`
- Check token expiration time
- Ensure Authorization header is being sent

```js
// Clear localStorage in browser console
localStorage.clear();
location.reload();
```

### 5. Module Not Found

**Error**: `Cannot find module 'express'`

**Solutions**:
- Install dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 6. Vite Build Errors

**Error**: `Failed to resolve import`

**Solutions**:
- Delete `node_modules` and reinstall:

```bash
cd frontend
rmdir /s node_modules
del package-lock.json
npm install
```

### 7. Tailwind Styles Not Working

**Error**: Styles not applying or missing

**Solutions**:
- Verify `tailwind.config.js` content paths
- Check `index.css` has Tailwind directives
- Restart dev server

```js
// tailwind.config.js - Verify content array
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
]
```

### 8. Images Not Loading

**Error**: Broken image icons

**Solutions**:
- Check image URLs in database
- Verify CORS for external images
- Use placeholder images for testing:

```js
// Use placeholder service
url: 'https://via.placeholder.com/800x600/0a0e27/00d9ff?text=Event'
```

### 9. Authentication Not Persisting

**Error**: Logged out after page refresh

**Solutions**:
- Check localStorage is enabled in browser
- Verify AuthContext is wrapping App
- Check token is being saved:

```js
// Browser console
localStorage.getItem('user')
```

### 10. Seed Script Fails

**Error**: `Seed error: ...`

**Solutions**:
- Ensure MongoDB is running
- Check connection string
- Verify models are correct
- Run with error details:

```bash
cd backend
node seed.js
```

## Development Issues

### Hot Reload Not Working

**Solutions**:
- Restart dev server
- Check file watcher limits (Linux):

```bash
# Increase file watchers
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Slow Build Times

**Solutions**:
- Clear Vite cache:

```bash
cd frontend
rmdir /s .vite
npm run dev
```

### Environment Variables Not Loading

**Solutions**:
- Restart server after changing `.env`
- Verify `.env` file location (backend root)
- Check variable names (no spaces)
- Use `VITE_` prefix for frontend env vars

## Production Issues

### 502 Bad Gateway

**Solutions**:
- Check backend server is running
- Verify environment variables are set
- Check server logs for errors
- Ensure MongoDB connection is working

### 404 on Refresh (Frontend)

**Solutions**:
- Configure redirects for SPA:

**Vercel** - Create `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Netlify** - Create `_redirects` in `public/`:
```
/*    /index.html   200
```

### API Calls Failing in Production

**Solutions**:
- Update API base URL for production
- Check CORS configuration
- Verify environment variables
- Check network tab for actual error

```js
// frontend/src/utils/api.js
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});
```

## Database Issues

### Duplicate Key Error

**Error**: `E11000 duplicate key error`

**Solutions**:
- User with email/username already exists
- Clear database and reseed:

```bash
# MongoDB shell
use anonymous-club
db.users.deleteMany({})
db.events.deleteMany({})

# Then run seed
npm run seed
```

### Connection Timeout

**Solutions**:
- Check MongoDB Atlas IP whitelist
- Verify network connectivity
- Increase timeout in connection string:

```
mongodb+srv://user:pass@cluster.mongodb.net/db?connectTimeoutMS=30000
```

## Security Issues

### Rate Limit Exceeded

**Error**: `Too many requests`

**Solutions**:
- Wait 15 minutes
- Adjust rate limit in `server.js`:

```js
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200  // Increase from 100
});
```

### CSRF Token Missing

**Solutions**:
- Ensure credentials are included in requests
- Check CORS credentials setting
- Verify cookie settings

## Browser Issues

### Styles Look Broken

**Solutions**:
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Clear browser cache
- Check browser console for errors
- Try incognito mode

### Console Errors

**Common Errors**:
- `Failed to fetch`: Backend not running
- `401 Unauthorized`: Login required
- `404 Not Found`: Wrong API endpoint
- `500 Internal Server Error`: Check backend logs

## Getting Help

### Check Logs

**Backend**:
```bash
cd backend
npm run dev
# Watch console output
```

**Frontend**:
```bash
cd frontend
npm run dev
# Watch console output
# Also check browser console (F12)
```

### Debug Mode

Add console logs:
```js
// Backend
console.log('Request body:', req.body);
console.log('User:', req.user);

// Frontend
console.log('API Response:', data);
console.log('User State:', user);
```

### Network Tab

1. Open browser DevTools (F12)
2. Go to Network tab
3. Reproduce issue
4. Check failed requests
5. Inspect request/response details

### MongoDB Compass

Use MongoDB Compass to:
- View database contents
- Check document structure
- Verify data integrity
- Run queries manually

## Still Having Issues?

1. **Check Documentation**: README.md, SETUP.md
2. **Search Error**: Google the exact error message
3. **Check Dependencies**: Ensure all packages are installed
4. **Restart Everything**: MongoDB, backend, frontend
5. **Fresh Install**: Delete node_modules, reinstall
6. **Check Versions**: Node.js v18+, npm v9+

---

**Most issues are resolved by restarting servers and checking environment variables!**
