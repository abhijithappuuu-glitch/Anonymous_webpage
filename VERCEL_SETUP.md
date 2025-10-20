# 🔐 Vercel Environment Variable Setup

## IMPORTANT: Add OpenAI API Key to Vercel

Your ChatGPT integration is now secure, but you need to configure the API key in Vercel for it to work on the live site.

### Steps to Configure Vercel:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `Anonymous_webpage` (or whatever your project is named)

2. **Navigate to Settings**
   - Click on the "Settings" tab in the top navigation

3. **Go to Environment Variables**
   - In the left sidebar, click "Environment Variables"

4. **Add New Variable**
   - Click "Add New" button
   - Fill in the fields:
     - **Key**: `VITE_OPENAI_API_KEY`
     - **Value**: `[YOUR_OPENAI_API_KEY_HERE]`
     - **Environment**: Select all three (Production, Preview, Development)

   **📝 Note**: Use the OpenAI API key I provided earlier (starts with `sk-proj-...`)

5. **Save the Variable**
   - Click "Save"

6. **Redeploy**
   - Go to "Deployments" tab
   - Click the three dots (...) on the latest deployment
   - Select "Redeploy"
   - Click "Redeploy" again to confirm

### Verification:

After redeployment completes (2-3 minutes):
1. Visit your live site: https://anonymoussdmcet.vercel.app
2. Click the NOBODY AI icon (🧠)
3. Open browser console (F12)
4. Send a message
5. Check console logs for:
   - ✅ `🤖 NOBODY: Calling ChatGPT API...`
   - ✅ `📡 API Response Status: 200`
   - ✅ `✅ AI Response: [actual AI text]`

### Why This Is Better:

✅ **Secure**: API key is not in source code
✅ **GitHub Safe**: No more push protection blocks
✅ **Production Ready**: Industry standard practice
✅ **Easy to Update**: Change key in Vercel without code changes

### Local Development:

The `.env` file in `frontend/.env` has the API key for local development.
This file is in `.gitignore` so it won't be pushed to GitHub.

To run locally:
```bash
cd frontend
npm run dev
```

The API key will be loaded from `.env` automatically!

---

**⚠️ IMPORTANT**: After adding the environment variable in Vercel, you MUST redeploy for it to take effect!
