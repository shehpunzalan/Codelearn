# 🚀 CodeLearn AI - Supabase Deployment Guide
**Your Project ID:** `hovedryqutuucipuqxca`

---

## ✅ Step 1: Create the Database Table (2 minutes)

1. **Go to:** https://supabase.com/dashboard/project/hovedryqutuucipuqxca
2. **Click "SQL Editor"** in the left sidebar
3. **Click "+ New query"**
4. **Paste this SQL code:**

```sql
-- Create the key-value storage table for CodeLearn AI
CREATE TABLE IF NOT EXISTS kv_store_aaa3a86f (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_kv_store_key ON kv_store_aaa3a86f(key);

-- Add helpful comment
COMMENT ON TABLE kv_store_aaa3a86f IS 'CodeLearn AI - Student progress, submissions, and analytics';
```

5. **Click "RUN"**
6. ✅ Expected result: **"Success. No rows returned"**

---

## 🔑 Step 2: Get Your API Keys (1 minute)

1. **Go to:** https://supabase.com/dashboard/project/hovedryqutuucipuqxca/settings/api
2. **Copy these 3 values:**

### Project URL
```
https://hovedryqutuucipuqxca.supabase.co
```
✅ Already have this!

### anon/public Key
- Look for: **"anon" "public"** section
- Copy the long text starting with `eyJ...`
- ⚠️ Safe to share publicly
- 📋 **Save this!**

### service_role Key
- Look for: **"service_role"** section  
- Copy the long text starting with `eyJ...`
- 🔒 **KEEP THIS SECRET!**
- 📋 **Save this!**

---

## 🚀 Step 3: Deploy the Edge Function (5 minutes)

### Install Supabase CLI

**For Mac/Linux:**
```bash
brew install supabase/tap/supabase
```

**For Windows (with Scoop):**
```bash
scoop install supabase
```

**For Windows (with Chocolatey):**
```bash
choco install supabase
```

### Deploy Commands

Run these commands **one by one** in your terminal:

```bash
# 1. Login to Supabase
supabase login

# 2. Navigate to your project directory
cd /workspaces/default/code

# 3. Link to your Supabase project
supabase link --project-ref hovedryqutuucipuqxca

# 4. Deploy the Edge Function
supabase functions deploy server --no-verify-jwt

# 5. Set environment secrets
supabase secrets set SUPABASE_URL=https://hovedryqutuucipuqxca.supabase.co

# 6. Set service role key (replace with your actual key)
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# 7. Set anon key (replace with your actual key)
supabase secrets set SUPABASE_ANON_KEY=your_anon_key_here
```

**IMPORTANT:** Replace `your_service_role_key_here` and `your_anon_key_here` with the actual keys you copied in Step 2!

---

## ✅ Step 4: Test the Deployment (1 minute)

### Test the Health Endpoint

**Open this URL in your browser:**
```
https://hovedryqutuucipuqxca.supabase.co/functions/v1/make-server-aaa3a86f/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-05-27T13:30:00.000Z"
}
```

✅ **If you see this = Backend is LIVE!**

❌ **If you see an error:**
- Check if the function deployed successfully
- Verify environment secrets are set
- Check Edge Function logs in Supabase dashboard

---

## 📊 Step 5: Verify Data Storage (2 minutes)

1. **Open your CodeLearn AI app**
2. **Log in or create an account**
3. **Go to any lesson and submit code**
4. **Check Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard/project/hovedryqutuucipuqxca/editor
   - Click **"Table Editor"**
   - Click **`kv_store_aaa3a86f`** table
   - You should see data appearing!

**Example data:**
- Key: `progress_user123_mod1_lesson1-1`
- Key: `submissions_user123`
- Key: `stats_user123`

---

## 🔧 Step 6: Update Frontend Configuration

After deployment, update the frontend to use your project:

The system will automatically use the project ID from `/utils/supabase/info.tsx`.

If you need to manually update it, ask Claude to update the configuration files.

---

## 🎯 Success Checklist

- [ ] ✅ Database table `kv_store_aaa3a86f` created
- [ ] ✅ API keys copied and saved securely
- [ ] ✅ Supabase CLI installed
- [ ] ✅ Linked to project `hovedryqutuucipuqxca`
- [ ] ✅ Edge Function deployed
- [ ] ✅ Environment secrets set (URL, service_role, anon)
- [ ] ✅ Health endpoint returns `200 OK`
- [ ] ✅ Test submission appears in database
- [ ] ✅ Console shows "Backend submission successful"

---

## 🆘 Troubleshooting

### Problem: "Function not found" error

**Solution:**
```bash
# Re-deploy the function
supabase functions deploy server --no-verify-jwt
```

### Problem: "Unauthorized" or 401 errors

**Solution:**
```bash
# Check if secrets are set
supabase secrets list

# Re-set secrets if needed
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_key
```

### Problem: Health endpoint returns 404

**Solution:**
- Verify function deployed: Dashboard → Edge Functions
- Check function name is "server"
- Verify URL format is correct

### Problem: Data not appearing in database

**Solution:**
1. Check browser console for errors
2. Verify Edge Function logs in Supabase Dashboard
3. Make sure you're logged in to the app
4. Check that secrets are set correctly

---

## 📚 Quick Commands Reference

```bash
# Check deployment status
supabase functions list

# View function logs
supabase functions logs server

# Check secrets
supabase secrets list

# Re-deploy function
supabase functions deploy server --no-verify-jwt

# Unlink project
supabase unlink
```

---

## 🎉 Next Steps

Once everything is working:

1. **Monitor Usage**
   - Dashboard → Database → Storage usage
   - Dashboard → Edge Functions → Invocations

2. **View Student Data**
   - Table Editor → See all submissions
   - Export data for grading

3. **Test Multi-Device**
   - Log in from different devices
   - Verify data syncs correctly

4. **Scale if Needed**
   - Free tier: 500MB database, 2GB bandwidth
   - Perfect for university projects!

---

## Need Help?

If you get stuck, just tell Claude:
- **"I finished Step X"** - Move to next step
- **"I'm stuck at Step X"** - Get specific help
- **"Show me the error logs"** - Debug issues
- **"It's not working"** - Full troubleshooting

**Good luck! 🚀**
