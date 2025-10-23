# NOBODY AI Integration - Technical Documentation

## Overview
NOBODY is an AI-powered chat assistant integrated into the Anonymous Cybersecurity Club website. It uses OpenAI's ChatGPT (gpt-3.5-turbo) to provide intelligent, conversational responses to user queries.

---

## Architecture

### Frontend Component
**File**: `frontend/src/components/Jarvis.jsx`

**Key Features**:
- React-based chat interface
- Framer Motion animations
- Graceful fallback to local intelligence
- Verbose logging for debugging

### AI Integration Flow
```
User Input
    ↓
handleSend() → adds user message to chat
    ↓
generateAIResponse() → calls OpenAI API
    ↓
    ├─ Success → adds AI response to chat
    └─ Error → falls back to generateResponse() (local)
```

---

## Environment Configuration

### Required Environment Variable
```bash
VITE_OPENAI_API_KEY=sk-proj-your-api-key-here
```

**Where to set**:
- **Vercel (Production)**: Settings → Environment Variables
- **Local Development**: `frontend/.env` file (gitignored)

### Vite Environment Variable Pattern
Vite requires the `VITE_` prefix for environment variables to be exposed to the client-side code:
```javascript
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
```

---

## API Integration Details

### OpenAI API Configuration
```javascript
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are NOBODY, the AI assistant for the Anonymous Cybersecurity Club...'
      },
      {
        role: 'user',
        content: userMessage
      }
    ],
    max_tokens: 500,
    temperature: 0.7
  })
});
```

### System Prompt
The AI is instructed to:
- Identify as "NOBODY" (not Jarvis)
- Assist with cybersecurity topics
- Provide navigation help
- Be concise and helpful
- Use a friendly, professional tone

---

## Logging & Debugging

### Console Logging Hierarchy
The integration includes verbose emoji-prefixed logs for debugging:

1. **🎯 User message received** - Initial input capture
2. **🔑 Using OpenAI API key** - Confirms key is present (shows first 10 chars)
3. **📤 Sending request to OpenAI** - API call initiated
4. **📥 Received response from OpenAI** - Raw API response received
5. **✅ OpenAI responded successfully!** - Success indicator
6. **🤖 AI response** - Final formatted response
7. **❌ AI request failed** - Error occurred (includes error details)
8. **🔄 Falling back to local response** - Using fallback logic

### Error Handling
```javascript
try {
  // OpenAI API call
  const aiResponse = await generateAIResponse(userMessage);
  // Add to chat
} catch (error) {
  console.error('❌ AI request failed:', error);
  // Fallback to local intelligence
  const fallbackResponse = generateResponse(userMessage);
  // Add fallback to chat
}
```

---

## Local Fallback Intelligence

### Pattern Matching System
When API calls fail, NOBODY falls back to pattern-based responses:

**Navigation patterns**:
```javascript
/home|main|start/i → "Head to the home page..."
/event|activities/i → "Check out our events..."
/gallery|photo/i → "Visit the gallery..."
/about|who|team/i → "Learn about us..."
```

**Query patterns**:
```javascript
/who (are|is)/i → "I'm NOBODY, your AI guide..."
/what.*do/i → "We're the Anonymous Cybersecurity Club..."
/help|assist/i → "I can help you navigate..."
```

**Default response**: Generic helpful message with navigation options

---

## Testing Guide

### Local Testing
1. **Setup**:
   ```bash
   cd frontend
   echo "VITE_OPENAI_API_KEY=sk-proj-your-key" > .env
   npm run dev
   ```

2. **Access**: http://localhost:5173

3. **Test cases**:
   - Simple greeting: "Hello"
   - Navigation: "Take me to events"
   - Question: "What is Anonymous Club?"
   - Technical: "How do I learn cybersecurity?"

4. **Check console logs** for full API flow

### Production Testing
1. **Deploy** with environment variable set in Vercel
2. **Visit** live site
3. **Open browser console** (F12)
4. **Test** same cases as local
5. **Verify** API calls succeed (look for ✅ emoji logs)

---

## API Key Security

### ✅ DO:
- Store keys in environment variables
- Use `.env` files (gitignored)
- Rotate keys regularly (3-6 months)
- Set spending limits on OpenAI account
- Monitor usage regularly

### ❌ DON'T:
- Commit keys to git
- Hardcode keys in source files
- Share keys in documentation
- Use same key for multiple projects
- Leave unused keys active

---

## Performance Considerations

### Response Times
- **OpenAI API**: 1-5 seconds (depends on length)
- **Fallback**: < 100ms (instant)

### Token Usage
- Average request: ~100-200 tokens
- Average response: ~150-300 tokens
- **Cost**: ~$0.001-0.003 per interaction (gpt-3.5-turbo)

### Rate Limiting
OpenAI free tier limits:
- 3 requests/minute
- 200 requests/day

Consider implementing:
- Client-side rate limiting
- Request queueing
- Caching for common queries

---

## Troubleshooting

### Issue: NOBODY uses fallback every time
**Symptoms**: All responses are navigation-focused, no conversational AI
**Diagnosis**: Check console for `❌ AI request failed` or no `🔑 Using OpenAI API key` log
**Solutions**:
1. Verify `VITE_OPENAI_API_KEY` is set in environment
2. Check API key is valid and active
3. Confirm Vercel redeployed after adding env var
4. Test with browser cache cleared

### Issue: 401 Unauthorized error
**Symptoms**: Console shows API error with 401 status
**Diagnosis**: Invalid or revoked API key
**Solutions**:
1. Generate new key on OpenAI platform
2. Update environment variable
3. Redeploy application

### Issue: 429 Too Many Requests
**Symptoms**: API calls rejected after several uses
**Diagnosis**: Rate limit exceeded
**Solutions**:
1. Upgrade OpenAI plan
2. Implement client-side rate limiting
3. Add user feedback for rate limits

### Issue: Slow responses
**Symptoms**: Takes 10+ seconds to respond
**Diagnosis**: Network latency or API congestion
**Solutions**:
1. Check OpenAI status page
2. Verify network connection
3. Consider caching common responses
4. Use streaming responses (future enhancement)

---

## Future Enhancements

### Planned Features
1. **Streaming responses** - Show text as it's generated
2. **Conversation memory** - Multi-turn context
3. **Command palette** - Quick actions
4. **Voice input/output** - Accessibility
5. **Custom knowledge base** - Club-specific training

### Code Improvements
1. **Request caching** - Store common Q&A
2. **Error retry logic** - Auto-retry failed requests
3. **Analytics** - Track usage patterns
4. **A/B testing** - Optimize prompts

---

## API Reference

### OpenAI Chat Completions Endpoint
```
POST https://api.openai.com/v1/chat/completions
```

**Headers**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_API_KEY"
}
```

**Request Body**:
```json
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {"role": "system", "content": "System prompt"},
    {"role": "user", "content": "User message"}
  ],
  "max_tokens": 500,
  "temperature": 0.7
}
```

**Response**:
```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "gpt-3.5-turbo-0613",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "AI response text"
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 50,
    "completion_tokens": 100,
    "total_tokens": 150
  }
}
```

---

## Contact & Support

**Documentation**: See `SECURITY_CHECKLIST.md` for setup instructions  
**OpenAI Docs**: https://platform.openai.com/docs  
**Status Page**: https://status.openai.com  

---

**Last Updated**: October 23, 2025  
**Version**: 1.0  
**Status**: ✅ Production Ready (pending API key rotation)
