# 🗄️ How to Create a Database for CodeLearn AI

---

## Option 1: Supabase (PostgreSQL) - Cloud Database ⭐ RECOMMENDED

### What You'll Get:
- ✅ PostgreSQL database (industry standard)
- ✅ 500MB free storage
- ✅ Built-in authentication
- ✅ Real-time updates
- ✅ REST API automatically generated
- ✅ Dashboard to view data

### Step-by-Step Setup:

#### 1. Create Supabase Account (2 minutes)

1. Go to: https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (easiest) or email
4. Verify your email

#### 2. Create a New Project (3 minutes)

1. Click "New Project"
2. Fill in details:
   - **Name:** `CodeLearn-AI`
   - **Database Password:** Create a strong password ⚠️ SAVE THIS!
   - **Region:** Choose closest to you (e.g., "Southeast Asia" for Philippines)
   - **Plan:** Free (perfect for university projects)
3. Click "Create new project"
4. ⏱️ Wait 2-3 minutes for setup

#### 3. Create Database Tables (5 minutes)

Once project is ready:

1. Click **"SQL Editor"** in left sidebar
2. Click **"+ New query"**
3. **Copy and paste this SQL:**

```sql
-- ============================================
-- CodeLearn AI Database Schema
-- ============================================

-- 1. User Profiles Table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'instructor')),
  student_id TEXT,
  section TEXT,
  year_level TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Student Progress Table
CREATE TABLE student_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  module_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  code TEXT,
  feedback TEXT,
  time_spent INTEGER DEFAULT 0,
  last_attempt TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id, lesson_id)
);

-- 3. Code Submissions Table
CREATE TABLE code_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  module_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  code TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  feedback JSONB,
  errors TEXT[],
  passed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Quiz Results Table
CREATE TABLE quiz_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  module_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  quiz_type TEXT NOT NULL CHECK (quiz_type IN ('knowledge_check', 'interactive_game')),
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers JSONB,
  passed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Notifications Table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  module_id TEXT,
  lesson_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Analytics Table (for instructors)
CREATE TABLE analytics_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Indexes for Better Performance
-- ============================================

CREATE INDEX idx_progress_user ON student_progress(user_id);
CREATE INDEX idx_progress_module ON student_progress(module_id, lesson_id);
CREATE INDEX idx_submissions_user ON code_submissions(user_id);
CREATE INDEX idx_submissions_lesson ON code_submissions(module_id, lesson_id);
CREATE INDEX idx_quiz_user ON quiz_results(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_analytics_user ON analytics_data(user_id);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_data ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only see their own data
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own progress" ON student_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own submissions" ON code_submissions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own quiz results" ON quiz_results
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notifications" ON notifications
  FOR ALL USING (auth.uid() = user_id);

-- Instructors can view all data
CREATE POLICY "Instructors can view all progress" ON student_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'instructor'
    )
  );

CREATE POLICY "Instructors can view all submissions" ON code_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'instructor'
    )
  );

-- ============================================
-- Functions
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update timestamps
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_progress_updated_at
  BEFORE UPDATE ON student_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

4. Click **"RUN"** (bottom right)
5. ✅ You should see: **"Success"**

#### 4. Get Your API Keys (1 minute)

1. Go to: **Settings → API**
2. Copy these 3 values:

**Project URL:**
```
https://YOUR_PROJECT_ID.supabase.co
```

**anon/public key:**
```
eyJhbGc... (long string)
```

**service_role key:** ⚠️ KEEP SECRET!
```
eyJhbGc... (different long string)
```

#### 5. Connect to Your App

Your app already has Supabase integration! Just need to update the keys.

---

## Option 2: Firebase (Google) - Alternative Cloud Database

### What You'll Get:
- ✅ NoSQL database (Firestore)
- ✅ 1GB free storage
- ✅ Real-time sync
- ✅ Google infrastructure

### Quick Setup:

1. Go to: https://firebase.google.com
2. Click "Get Started"
3. Create a new project: "CodeLearn-AI"
4. Enable Firestore Database
5. Choose "Start in test mode"
6. Get your config:
   - Project Settings → General
   - Scroll to "Your apps"
   - Click Web icon
   - Copy the config object

---

## Option 3: MySQL/MariaDB - Local or Hosted

### For Local Development:

**Install MySQL:**

```bash
# Mac
brew install mysql
brew services start mysql

# Windows
# Download from: https://dev.mysql.com/downloads/installer/

# Linux
sudo apt install mysql-server
sudo systemctl start mysql
```

**Create Database:**

```bash
mysql -u root -p

CREATE DATABASE codelearn_ai;
USE codelearn_ai;

-- Create tables (similar to Supabase schema above)
```

### For Hosted MySQL:

**Free Options:**
- **PlanetScale:** https://planetscale.com (Free tier)
- **Railway:** https://railway.app (Free $5/month credit)
- **Clever Cloud:** https://clever-cloud.com (Free tier)

---

## Option 4: MongoDB - NoSQL Database

### MongoDB Atlas (Cloud):

1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up free
3. Create cluster (M0 Free tier)
4. Create database: `codelearn_ai`
5. Create collections:
   - `users`
   - `progress`
   - `submissions`
   - `quizzes`
   - `notifications`

**Connection String:**
```
mongodb+srv://username:password@cluster.mongodb.net/codelearn_ai
```

---

## Option 5: SQLite - Simple Local Database

**Perfect for:** Development, testing, small deployments

**Create SQLite Database:**

```bash
# Install SQLite
npm install better-sqlite3

# Create database file
touch codelearn.db
```

**Schema (in code):**

```javascript
const Database = require('better-sqlite3');
const db = new Database('codelearn.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    role TEXT
  );

  CREATE TABLE IF NOT EXISTS progress (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    module_id TEXT,
    lesson_id TEXT,
    score INTEGER
  );
`);
```

---

## 🎯 Comparison Table

| Database | Type | Complexity | Cost | Best For |
|----------|------|------------|------|----------|
| **localStorage** | Browser | ⭐ Easy | Free | Single-user, demos |
| **Supabase** | PostgreSQL | ⭐⭐ Medium | Free tier | Full apps, production |
| **Firebase** | NoSQL | ⭐⭐ Medium | Free tier | Real-time apps |
| **MySQL** | SQL | ⭐⭐⭐ Hard | Varies | Traditional apps |
| **MongoDB** | NoSQL | ⭐⭐ Medium | Free tier | Flexible schemas |
| **SQLite** | SQL | ⭐ Easy | Free | Local/embedded apps |

---

## 📋 My Recommendations:

### For University Project (NOW):
✅ **Keep using localStorage**
- Already working
- No setup needed
- Perfect for grading/demo

### For Future/Production:
🌟 **Use Supabase**
- Free tier is generous
- PostgreSQL (industry standard)
- Auto-generated API
- Built-in auth
- Easy to scale

### For Learning:
📚 **Try SQLite first, then Supabase**
- SQLite: Learn SQL basics locally
- Supabase: Learn cloud deployment

---

## 🚀 Quick Start Guides

I can help you set up any of these! Just tell me:

- **"Set up Supabase"** - I'll walk you through it
- **"Set up Firebase"** - I'll guide you
- **"Create MySQL database"** - I'll help
- **"Keep localStorage"** - Smart choice for now!

What would you like to do?
