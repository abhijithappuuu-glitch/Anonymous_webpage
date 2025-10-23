# NOBODY AI - Quick Start Guide

## 🎯 Current Status

✅ **Repository Sanitized** - No secrets in working tree  
⏳ **Awaiting API Key Rotation** - You need to complete these steps  
⏳ **Deployment Pending** - Vercel needs new key to activate AI

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Revoke Old Key ⏱️ 2 min
```
1. Go to: https://platform.openai.com/api-keys
2. Find key starting with "sk-proj-"
3. Click "Revoke" or trash icon
4. Confirm deletion
```

### Step 2: Generate New Key ⏱️ 1 min
```
1. Same page → Click "+ Create new secret key"
2. Name it: "NOBODY-AI-Production"
3. Click "Create"
4. COPY THE KEY (you won't see it again!)
5. Save in password manager
```

### Step 3: Add to Vercel ⏱️ 2 min
```
1. Go to: https://vercel.com/dashboard
2. Select: "Anonymous_webpage" project
3. Settings → Environment Variables → Add New
4. Key: VITE_OPENAI_API_KEY
5. Value: [paste your new key]
6. Environment: ✅ Production
7. Click "Save"
```

### Step 4: Redeploy ⏱️ 30 sec
```
1. Vercel → Deployments tab
2. Latest deployment → "⋮" menu → "Redeploy"
3. Confirm
```

### Step 5: Test 🧪 ⏱️ 3 min
```
1. Wait for deployment to complete (~2 min)
2. Visit your live site
3. Open NOBODY chat
4. Send: "Hello NOBODY"
5. Check browser console (F12) for:
   ✅ "🔑 Using OpenAI API key"
   ✅ "✅ OpenAI responded successfully!"
```

---

## 📚 Documentation Files Created

| File | Purpose |
|------|---------|
| `SECURITY_CHECKLIST.md` | Complete step-by-step security guide |
| `NOBODY_AI_TECHNICAL_DOCS.md` | Technical architecture & troubleshooting |
| `GIT_HISTORY_CLEANUP.md` | Optional: Remove secrets from Git history |
| `QUICK_START.md` | This file - fastest path to success |

---

## 🎓 For Local Development

After completing steps above, test locally:

```bash
cd "d:\anon web\frontend"

# Create .env file
echo VITE_OPENAI_API_KEY=sk-proj-YOUR_NEW_KEY_HERE > .env

# Start dev server
npm run dev

# Visit: http://localhost:5173
# Test NOBODY chat
```

---

## ✅ Success Indicators

### Browser Console (F12)
```
🎯 User message received: "Hello NOBODY"
🔑 Using OpenAI API key: sk-proj-abc...
📤 Sending request to OpenAI...
📥 Received response from OpenAI
✅ OpenAI responded successfully!
🤖 AI response: "Hello! I'm NOBODY..."
```

### NOBODY Behavior
- Responds within 2-5 seconds
- Conversational and intelligent answers
- Uses context from previous messages
- Professional and helpful tone

### Vercel Logs
- No errors in function logs
- Successful 200 responses
- Low latency (~1-3s)

---

## ❌ Troubleshooting

### Issue: Falls back to local responses
**Console shows**: `🔄 Falling back to local response`  
**Fix**: Check environment variable is set in Vercel and redeployed

### Issue: 401 Unauthorized
**Console shows**: `❌ AI request failed: 401`  
**Fix**: Verify API key is correct and active on OpenAI

### Issue: No response
**Console shows**: Network error or timeout  
**Fix**: Check OpenAI status page, verify internet connection

---

## 💰 Cost Monitoring

OpenAI gpt-3.5-turbo pricing:
- **Input**: $0.0005 per 1K tokens
- **Output**: $0.0015 per 1K tokens
- **Average chat**: ~$0.001-0.003 per interaction

**Recommended**:
- Set spending limit: $5-10/month (safe for moderate traffic)
- Enable usage alerts in OpenAI dashboard
- Monitor daily usage

---

## 🔒 Security Best Practices

✅ **DO**:
- Keep API keys in environment variables only
- Rotate keys every 3-6 months
- Set spending limits
- Monitor usage regularly
- Use `.gitignore` for `.env` files

❌ **DON'T**:
- Commit keys to Git
- Share keys publicly
- Hardcode in source files
- Reuse keys across projects
- Leave unused keys active

---

## 📞 Get Help

- **OpenAI Support**: https://help.openai.com
- **OpenAI Status**: https://status.openai.com
- **Vercel Support**: https://vercel.com/support
- **Documentation**: Read `NOBODY_AI_TECHNICAL_DOCS.md`

---

## 📊 Completion Checklist

Mark these as you complete them:

- [ ] ✅ Old API key revoked
- [ ] ✅ New API key generated and saved
- [ ] ✅ New key added to Vercel
- [ ] ✅ Site redeployed
- [ ] ✅ NOBODY tested on live site
- [ ] ✅ Browser console shows success logs
- [ ] ✅ Local `.env` created for development
- [ ] ✅ Usage limits set on OpenAI account

---

**Next Steps After Completion**:
1. Monitor NOBODY's performance for 24 hours
2. Check OpenAI usage dashboard
3. Gather user feedback
4. Consider enhancements (see technical docs)

---

**Created**: October 23, 2025  
**Status**: Ready for deployment  
**Estimated Setup Time**: 5 minutes  
**Priority**: 🚨 High - Complete ASAP
