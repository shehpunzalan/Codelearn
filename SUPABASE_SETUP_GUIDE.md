# Supabase Backend Setup Guide - Step by Step
**CodeLearn AI - Cloud Storage Configuration**

---

## 📚 Table of Contents
1. [What is Supabase?](#what-is-supabase)
2. [Prerequisites](#prerequisites)
3. [Step 1: Access Your Supabase Project](#step-1-access-your-supabase-project)
4. [Step 2: Set Up the Database Table](#step-2-set-up-the-database-table)
5. [Step 3: Get Your API Keys](#step-3-get-your-api-keys)
6. [Step 4: Deploy the Edge Function](#step-4-deploy-the-edge-function)
7. [Step 5: Test the Connection](#step-5-test-the-connection)
8. [Step 6: Verify Data Storage](#step-6-verify-data-storage)
9. [Troubleshooting](#troubleshooting)

---

## What is Supabase?

**Supabase** is an open-source alternative to Firebase that provides:
- 🗄️ **PostgreSQL Database** - A powerful SQL database for storing your data
- 🔐 **Authentication** - User login/signup management
- ⚡ **Edge Functions** - Serverless backend code that runs in the cloud
- 📊 **Real-time** - Live data updates across devices
- 🔒 **Security** - Row-level security and API authentication

**Why Use Supabase for CodeLearn AI?**
- ✅ Your student data persists even if they clear browser cache
- ✅ Students can access their progress from any device
- ✅ Instructors can view real-time analytics
- ✅ Secure authentication and data isolation
- ✅ FREE tier supports up to 500MB database and 2GB bandwidth/month

---

## Prerequisites

Before starting, make sure you have:
- ✅ A Supabase account (we'll create one if you don't have it)
- ✅ Your CodeLearn AI project files (you already have this!)
- ✅ Internet connection
- ✅ A web browser

**Current Project Details:**
- Project ID: `ebheipblvbpjvoqhshah`
- Region: Automatically selected based on your location
- Database: PostgreSQL (managed by Supabase)

---

## Step 1: Access Your Supabase Project

### Option A: If You Already Have a Supabase Account

1. **Go to Supabase Dashboard**
   - Open: https://supabase.com/dashboard
   - Log in with your credentials

2. **Find Your Project**
   - Look for project: `ebheipblvbpjvoqhshah`
   - OR create a new project if this one doesn't exist

3. **If Project Exists:**
   - Click on the project name
   - You'll see the project dashboard
   - ✅ Proceed to Step 2

### Option B: If You DON'T Have a Supabase Account

1. **Create a Supabase Account**
   - Go to: https://supabase.com
   - Click "Start your project" or "Sign Up"
   - Sign up with:
     - GitHub account (recommended)
     - OR Email + Password

2. **Create a New Project**
   - Click "New Project"
   - Fill in the details:
     - **Name:** `CodeLearn-AI` (or any name you prefer)
     - **Database Password:** Create a strong password (SAVE THIS!)
     - **Region:** Choose closest to your location
     - **Pricing Plan:** Free (perfect for university projects)
   - Click "Create new project"
   - ⏱️ Wait 2-3 minutes for setup to complete

3. **Copy Your Project Details**
   - Once created, go to Settings → API
   - Copy these values (we'll need them later):
     - ✅ **Project URL** (looks like: `https://xxx.supabase.co`)
     - ✅ **Project ID** (from the URL)
     - ✅ **anon/public key** (long text starting with `eyJ...`)
     - ✅ **service_role key** (keep this SECRET!)

---

## Step 2: Set Up the Database Table

Now we'll create the database table to store all your application data.

### 2.1 Open the SQL Editor

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"** button

### 2.2 Create the KV Store Table

Copy and paste this SQL code into the editor:

```sql
-- Create the key-value storage table for CodeLearn AI
CREATE TABLE IF NOT EXISTS kv_store_aaa3a86f (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add an index for faster queries
CREATE INDEX IF NOT EXISTS idx_kv_store_key ON kv_store_aaa3a86f(key);

-- Add a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_kv_store_updated_at 
BEFORE UPDATE ON kv_store_aaa3a86f
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Add a comment to the table
COMMENT ON TABLE kv_store_aaa3a86f IS 'Key-value store for CodeLearn AI system data including user progress, submissions, and analytics';
```

### 2.3 Run the SQL

1. Click the **"RUN"** button (or press Ctrl+Enter / Cmd+Enter)
2. You should see: ✅ **"Success. No rows returned"**
3. If you see an error, check:
   - Make sure you copied the entire SQL code
   - Check if the table already exists (that's okay!)

### 2.4 Verify the Table

1. Click **"Table Editor"** in the left sidebar
2. You should see `kv_store_aaa3a86f` in the tables list
3. Click on it to view the empty table (it will fill up when students use the app)

**Table Structure:**
- `key` - TEXT - The unique identifier (e.g., `progress_user123_mod1_lesson1`)
- `value` - JSONB - The actual data stored as JSON
- `created_at` - Timestamp - When the record was created
- `updated_at` - Timestamp - When the record was last modified

---

## Step 3: Get Your API Keys

### 3.1 Navigate to API Settings

1. In Supabase dashboard, click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** in the settings menu

### 3.2 Copy Your Keys

You'll see several keys. Here's what each one does:

**🔑 Project URL**
- Example: `https://ebheipblvbpjvoqhshah.supabase.co`
- Purpose: The base URL for all API requests
- ⚠️ Safe to share publicly

**🔑 anon/public Key**
- Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Purpose: Used for client-side requests (browser)
- ⚠️ Safe to share publicly (has limited permissions)

**🔑 service_role Key** ⚠️ KEEP SECRET!
- Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (different from anon)
- Purpose: Used for server-side operations (full database access)
- 🔒 **NEVER share this or commit it to GitHub!**

### 3.3 Save Your Keys Securely

**Option 1: Use a Password Manager**
- Save in 1Password, LastPass, Bitwarden, etc.

**Option 2: Create a Local File (NOT in Git)**
- Create a file named `.env.local` in your project
- Add these lines:
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJ... (your anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (your service role key)
```
- ⚠️ Make sure `.env.local` is in your `.gitignore` file!

---

## Step 4: Deploy the Edge Function

Now we'll deploy the backend server to Supabase so it can handle API requests.

### 4.1 Using Claude Code (Easiest Method)

Since you're already using Claude Code, I can help you deploy directly!

1. **Connect Supabase in Claude Code**
   - I already showed you the connection card
   - Click "Connect to Supabase"
   - Authorize Claude to access your Supabase project

2. **I'll deploy the function for you**
   - Once connected, I'll run the deployment commands
   - You'll see progress updates
   - ✅ Deployment complete!

### 4.2 Manual Deployment (Alternative Method)

If you prefer to deploy manually:

**Step 4.2.1: Install Supabase CLI**

**On Mac/Linux:**
```bash
brew install supabase/tap/supabase
```

**On Windows:**
```bash
scoop install supabase
```

**Step 4.2.2: Login to Supabase**
```bash
supabase login
```
- This opens your browser
- Authorize the CLI
- ✅ You'll see "Logged in successfully"

**Step 4.2.3: Link Your Project**
```bash
cd /workspaces/default/code
supabase link --project-ref ebheipblvbpjvoqhshah
```
- Enter your database password when prompted
- ✅ You'll see "Linked to project successfully"

**Step 4.2.4: Deploy the Edge Function**
```bash
supabase functions deploy server --no-verify-jwt
```
- This uploads your backend code to Supabase
- ⏱️ Takes about 30-60 seconds
- ✅ You'll see "Deployed function server successfully"

**Step 4.2.5: Set Environment Variables**
```bash
supabase secrets set SUPABASE_URL=https://ebheipblvbpjvoqhshah.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
supabase secrets set SUPABASE_ANON_KEY=your_anon_key_here
```
- Replace `your_service_role_key_here` with your actual key
- Replace `your_anon_key_here` with your actual key
- ✅ Each command should return "Secret set successfully"

---

## Step 5: Test the Connection

Let's verify everything is working!

### 5.1 Test the Health Endpoint

**Using Browser:**
1. Open this URL in your browser:
   ```
   https://ebheipblvbpjvoqhshah.supabase.co/functions/v1/make-server-aaa3a86f/health
   ```

2. You should see:
   ```json
   {
     "status": "ok",
     "timestamp": "2024-05-27T10:30:00.000Z"
   }
   ```

3. ✅ If you see this, your backend is LIVE!
4. ❌ If you see an error, check:
   - Is the function deployed? (Check Supabase dashboard → Edge Functions)
   - Are environment variables set? (Check Settings → Edge Functions → Secrets)

**Using Command Line:**
```bash
curl https://ebheipblvbpjvoqhshah.supabase.co/functions/v1/make-server-aaa3a86f/health
```

### 5.2 Test in Your Application

1. **Open your CodeLearn AI app**
2. **Create a test account** (if you don't have one)
3. **Submit some code** in any lesson
4. **Check the browser console** (Press F12 → Console tab)
5. Look for:
   - ✅ `✓ Backend submission successful` - Backend is working!
   - ❌ `Backend unavailable, using local storage` - Backend not connected

### 5.3 Verify Data in Supabase

1. Go to Supabase Dashboard → **Table Editor**
2. Click on `kv_store_aaa3a86f` table
3. You should see data appearing like:
   - `progress_user123_mod1_lesson1`
   - `submissions_user123`
   - `stats_user123`
4. Click on any row to see the JSON data stored

---

## Step 6: Verify Data Storage

### 6.1 Monitor Edge Function Logs

1. In Supabase Dashboard, go to **Edge Functions**
2. Click on **"server"** function
3. Click **"Logs"** tab
4. You'll see real-time logs of all API requests:
   ```
   POST /make-server-aaa3a86f/submissions/submit
   GET /make-server-aaa3a86f/progress/user123
   ```

### 6.2 Check Database Growth

1. Go to **Settings** → **Database**
2. You'll see database size (starts small, grows with usage)
3. Free tier includes 500MB - more than enough for a university project!

### 6.3 Test Multi-Device Access

**To verify cloud storage is working:**

1. **On Computer 1:**
   - Log in to your app
   - Complete a lesson
   - Submit code

2. **On Computer 2 (or different browser):**
   - Log in with the SAME account
   - ✅ You should see your progress!
   - ✅ This proves data is in the cloud, not just local storage!

---

## Troubleshooting

### Problem 1: "Failed to fetch" Error

**Symptoms:**
- Console shows: `TypeError: Failed to fetch`
- Backend requests fail

**Solutions:**
1. ✅ Check if Edge Function is deployed
   - Dashboard → Edge Functions → Should see "server" function
2. ✅ Verify environment variables are set
   - Settings → Edge Functions → Secrets
3. ✅ Check function URL is correct
   - Should be: `https://PROJECT-ID.supabase.co/functions/v1/make-server-aaa3a86f`

### Problem 2: "Unauthorized" or 401 Errors

**Symptoms:**
- API returns 401 status
- "Invalid session" errors

**Solutions:**
1. ✅ Check if `SUPABASE_SERVICE_ROLE_KEY` is set correctly
2. ✅ Make sure anon key is passed in Authorization header
3. ✅ Verify user is logged in (check `localStorage.currentUser`)

### Problem 3: Database Table Not Found

**Symptoms:**
- Error: `relation "kv_store_aaa3a86f" does not exist`

**Solutions:**
1. ✅ Run the SQL from Step 2 again
2. ✅ Check table exists in Table Editor
3. ✅ Make sure you're connected to the right project

### Problem 4: Data Not Appearing in Supabase

**Symptoms:**
- App works but no data in Supabase table
- Still using localStorage only

**Solutions:**
1. ✅ Check browser console for errors
2. ✅ Verify backend health endpoint works
3. ✅ Make sure you're logged in (backend requires authentication)
4. ✅ Check Edge Function logs for error messages

### Problem 5: Deployment Fails

**Symptoms:**
- `supabase functions deploy` command fails
- Permission errors

**Solutions:**
1. ✅ Make sure you're logged in: `supabase login`
2. ✅ Verify project is linked: `supabase link`
3. ✅ Check you have the correct permissions on the Supabase project
4. ✅ Try restarting the Supabase CLI

---

## 🎉 Success Checklist

Mark each item as you complete it:

- [ ] ✅ Supabase account created
- [ ] ✅ Project created/accessed
- [ ] ✅ Database table `kv_store_aaa3a86f` created
- [ ] ✅ API keys copied and saved securely
- [ ] ✅ Edge Function deployed
- [ ] ✅ Environment variables set
- [ ] ✅ Health endpoint returns 200 OK
- [ ] ✅ Test submission appears in database
- [ ] ✅ Data persists across browsers/devices
- [ ] ✅ Console shows "Backend submission successful"

---

## What's Next?

Now that your backend is set up, you can:

1. **Monitor Usage**
   - Dashboard → Database → See storage usage
   - Dashboard → Edge Functions → See function invocations

2. **View Student Data**
   - Table Editor → See all submissions and progress
   - Export data for grading/analytics

3. **Scale Up (if needed)**
   - Free tier: 500MB database, 2GB bandwidth
   - Pro tier ($25/month): 8GB database, 50GB bandwidth
   - For a university project, FREE tier is perfect!

4. **Add More Features**
   - Real-time leaderboards
   - Instructor dashboard
   - Assignment management
   - Plagiarism detection across all students

---

## Additional Resources

- 📖 [Supabase Documentation](https://supabase.com/docs)
- 📖 [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- 📖 [PostgreSQL Basics](https://www.postgresql.org/docs/current/tutorial.html)
- 🎥 [Supabase YouTube Channel](https://www.youtube.com/c/supabase)
- 💬 [Supabase Discord Community](https://discord.supabase.com)

---

## Need Help?

If you get stuck at any step, just ask me:
- "Claude, I'm stuck at Step 3" - I'll help you through it
- "Claude, my deployment failed" - Share the error and I'll fix it
- "Claude, can you deploy it for me?" - I can do it via the connection card!

**Ready to start? Let's begin with Step 1!** 🚀
