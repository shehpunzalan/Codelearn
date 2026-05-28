# 🚀 Supabase Quick Start - 5 Minutes

## The Absolute Fastest Way to Get Started

### Option 1: Let Claude Do It (EASIEST) ⭐

1. I already showed you a **"Connect to Supabase"** card above
2. Click it and authorize
3. I'll handle everything automatically!
4. ✅ Done in 2 minutes!

---

### Option 2: Do It Yourself (15 minutes)

**Step 1: Get Supabase Account** (3 min)
- Go to https://supabase.com
- Sign up with GitHub
- Create new project: "CodeLearn-AI"
- ✅ Save your database password!

**Step 2: Create Database Table** (2 min)
- Dashboard → SQL Editor → New Query
- Paste this:
```sql
CREATE TABLE kv_store_aaa3a86f (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);
```
- Click RUN
- ✅ Table created!

**Step 3: Get Your Keys** (1 min)
- Settings → API
- Copy:
  - Project URL: `https://xxx.supabase.co`
  - anon key: `eyJ...`
  - service_role key: `eyJ...` (keep secret!)

**Step 4: Deploy Backend** (5 min)
```bash
# Install CLI
brew install supabase/tap/supabase  # Mac
# OR
scoop install supabase              # Windows

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_ID

# Deploy
supabase functions deploy server

# Set secrets
supabase secrets set SUPABASE_URL=https://xxx.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_key_here
supabase secrets set SUPABASE_ANON_KEY=your_key_here
```

**Step 5: Test** (2 min)
- Open: `https://YOUR_PROJECT.supabase.co/functions/v1/make-server-aaa3a86f/health`
- Should see: `{"status":"ok"}`
- ✅ Backend is live!

**Step 6: Update Your App** (2 min)
- File already configured at `utils/supabase/info.tsx`
- Just verify the Project ID matches
- ✅ App will automatically use cloud storage!

---

## ✅ Success = You see this in browser console:
```
✓ Backend submission successful
```

## ❌ Problem = You see this:
```
Backend unavailable, using local storage
```
→ Check: Is Edge Function deployed?
→ Check: Are secrets set?
→ Ask Claude for help!

---

## 🆘 Get Help Fast

**In this chat, just say:**
- "Claude, deploy Supabase for me" ← I'll do it!
- "Claude, I'm stuck at Step X" ← I'll help!
- "Claude, show me my database" ← I'll check it!

---

## 📚 Full Guide
See `SUPABASE_SETUP_GUIDE.md` for detailed explanations!
