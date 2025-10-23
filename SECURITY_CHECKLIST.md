# Security Checklist - API Key Rotation

**Status**: 🚨 **IMMEDIATE ACTION REQUIRED**

## ✅ Completed Steps

- [x] Removed exposed API key from `frontend/.env` (replaced with placeholder)
- [x] Deleted old build artifacts containing the secret
- [x] Rebuilt frontend cleanly (no secrets in new `dist/`)
- [x] Verified `.gitignore` excludes `.env` and `dist/`
- [x] Confirmed new builds don't contain the secret pattern

---

## 🚨 CRITICAL: Steps YOU Must Complete NOW

### 1. Revoke the Compromised API Key (⏱️ ~2 minutes)

**The exposed key**: `sk-proj-*****` (from your repository)

**Steps**:
1. Go to: https://platform.openai.com/api-keys
2. Log in to your OpenAI account
3. Find the key starting with `sk-proj-` (check the last 4 characters if shown)
4. Click **"Revoke"** or the trash icon to delete it
5. Confirm the deletion

> ⚠️ **Why this matters**: The key was publicly visible in your GitHub repository. Anyone who saw it could use it to make API calls on your account, potentially costing you money.

---

### 2. Generate a NEW API Key (⏱️ ~1 minute)

**Steps**:
1. While still on https://platform.openai.com/api-keys
2. Click **"+ Create new secret key"**
3. Give it a name: `NOBODY-AI-Production` (or similar)
4. Click **"Create secret key"**
5. **COPY THE KEY IMMEDIATELY** - you won't see it again!
6. Save it temporarily in a secure location (password manager or secure note)

**Format**: Should start with `sk-proj-...` (newer format) or `sk-...` (older format)

---

### 3. Add New Key to Vercel (⏱️ ~3 minutes)

**Steps**:
1. Go to: https://vercel.com/dashboard
2. Select your project: **Anonymous_webpage**
3. Click **Settings** (top navigation)
4. Click **Environment Variables** (left sidebar)
5. Click **"Add New"** or **"Add"**
6. Fill in:
   - **Key**: `VITE_OPENAI_API_KEY`
   - **Value**: Paste your NEW OpenAI key (e.g., `sk-proj-abcd1234...`)
   - **Environments**: ✅ Production (required), optionally Preview/Development
7. Click **"Save"**

---

### 4. Redeploy Your Site (⏱️ ~2 minutes)

**Option A - Automatic** (Recommended):
1. In Vercel dashboard → **Deployments** tab
2. Find the latest deployment
3. Click the **"⋮"** (three dots menu)
4. Click **"Redeploy"**
5. Confirm the redeployment

**Option B - Git Push**:
```bash
cd "d:\anon web"
git commit --allow-empty -m "Trigger redeploy with new API key"
git push origin main
```

> 📝 **Note**: Vercel will automatically use the new environment variable you just added.

---

### 5. Create Local Development .env (⏱️ ~1 minute)

For testing NOBODY on your local machine:

1. Create a new file: `frontend/.env`
2. Add this line (with your NEW key):
   ```
   VITE_OPENAI_API_KEY=sk-proj-YOUR_NEW_KEY_HERE
   ```
3. Save the file

> ✅ This file is gitignored and will NOT be committed to the repository.

---

## 🧪 Testing & Verification

### Test on Live Site (after Vercel redeploy completes)

1. Wait for Vercel deployment to complete (~2-3 minutes)
2. Visit your live site: https://your-site.vercel.app
3. Open the NOBODY AI chat interface
4. Send a test message: `"Hello NOBODY, can you help me?"`
5. **Watch browser console** (F12 → Console tab) for:
   - ✅ `🤖 Generating AI response for: "Hello NOBODY..."` (indicates API call started)
   - ✅ `✅ OpenAI responded successfully!` (indicates API success)
   - ❌ `❌ AI request failed:` (indicates error - check the error message)

**Expected behavior**: NOBODY should respond using ChatGPT within 2-5 seconds.

### Test Locally (optional)

```bash
cd "d:\anon web\frontend"
npm run dev
```

Then visit: http://localhost:5173 and test the same way.

---

## 🔒 Additional Security Best Practices

### Rate Limiting (Recommended)
Consider adding usage limits on your OpenAI API key:
1. OpenAI Dashboard → **Usage** → **Limits**
2. Set monthly spending limits to avoid unexpected charges
3. Set up usage alerts

### API Key Rotation Schedule
- Rotate production API keys every 3-6 months
- Revoke unused keys immediately
- Never commit keys to git (always use environment variables)

### Monitoring
- Check OpenAI usage regularly: https://platform.openai.com/usage
- Set up Vercel function logs to monitor API calls
- Watch for unusual spikes in usage

---

## 📊 Completion Checklist

Mark these off as you complete them:

- [ ] Old API key revoked on OpenAI platform
- [ ] New API key generated and securely saved
- [ ] New key added to Vercel environment variables
- [ ] Site redeployed successfully
- [ ] Local `.env` created with new key
- [ ] NOBODY AI tested on live site (responds correctly)
- [ ] Browser console shows successful API calls
- [ ] No errors in Vercel function logs

---

## ❓ Troubleshooting

### NOBODY responds with fallback instead of ChatGPT
**Symptoms**: Responses are generic navigation help, not conversational
**Causes**:
- Environment variable not set in Vercel
- Key is invalid or revoked
- Vercel hasn't redeployed yet

**Fix**:
1. Check Vercel → Settings → Environment Variables (confirm `VITE_OPENAI_API_KEY` exists)
2. Check browser console for error messages
3. Verify key is active on OpenAI platform
4. Trigger another redeploy

### Browser console shows "401 Unauthorized"
**Cause**: API key is invalid or revoked
**Fix**: Double-check the key in Vercel matches the active key on OpenAI

### No response at all / Loading forever
**Cause**: Network error or CORS issue
**Fix**: Check browser console for detailed error, verify OpenAI API is accessible

---

## 🆘 Need Help?

If you encounter issues:
1. Check browser console (F12) for error messages
2. Check Vercel function logs (Vercel Dashboard → Deployments → Select deployment → "Functions" tab)
3. Verify API key has sufficient credits: https://platform.openai.com/usage
4. Test the API key with a simple curl command:
   ```bash
   curl https://api.openai.com/v1/chat/completions \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -d '{
       "model": "gpt-3.5-turbo",
       "messages": [{"role": "user", "content": "Hello"}],
       "max_tokens": 50
     }'
   ```

---

**Last Updated**: October 23, 2025  
**Repository**: Anonymous_webpage  
**Status**: ⚠️ Awaiting key rotation and deployment
