# Vercel Deployment Guide

## Project Settings (Required)

Set these in your Vercel project dashboard under **Settings → General**:

- **Root Directory:** `frontend`
- **Framework Preset:** Vite (auto-detected)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## Environment Variables (Optional)

If your frontend needs to connect to a backend API:

- **Key:** `VITE_API_URL`
- **Value:** `https://your-backend.onrender.com` (or your backend URL)

## Router Configuration

This app uses **HashRouter** so no server-side rewrites are needed. URLs will include a hash:
- Home: `https://yourapp.vercel.app/#/`
- Events: `https://yourapp.vercel.app/#/events`
- About: `https://yourapp.vercel.app/#/about`

## Deployment

1. Connect your GitHub repository to Vercel
2. Set the Root Directory to `frontend`
3. Vercel will auto-detect Vite and use the correct build settings
4. Deploy!

## Troubleshooting

### Blank page after deploy
- Check browser DevTools → Console for errors
- Verify Root Directory is set to `frontend` in Vercel settings
- Ensure build completed successfully in Vercel deployment logs
- Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

### Assets not loading (404 errors)
- Verify Output Directory is `dist` in Vercel settings
- Check that `/assets/*.js` and `/assets/*.css` files are accessible
- Ensure Vite build completed successfully (check logs)
