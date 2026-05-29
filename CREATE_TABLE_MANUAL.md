# Create Students Table - Manual Method (Easiest!)

## ⚠️ Migration Sync Issue

You're seeing this error:
```
Remote migration versions not found in local migrations directory.
```

This is normal! Your remote Supabase project has migrations that aren't in your local folder.

---

## ✅ **Solution: Create Table Manually (2 minutes)**

Skip the CLI migration and create the table directly in Supabase:

### Step 1: Open Supabase SQL Editor

Go to: **https://supabase.com/dashboard/project/hovedryqutuucipuqxca/sql/new**

### Step 2: Copy the SQL

Copy **ALL** of this SQL code:

```sql
-- Create students table to test Supabase database connection
-- This table will store student information for CodeLearn AI

CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  section TEXT,
  year_level TEXT,
  enrolled_courses TEXT[] DEFAULT ARRAY['CCS108'],
  avatar_url TEXT,
  bio TEXT,
  total_lessons_completed INTEGER DEFAULT 0,
  total_quizzes_taken INTEGER DEFAULT 0,
  average_score NUMERIC(5,2) DEFAULT 0,
  total_time_spent INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_students_user_id ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students(email);
CREATE INDEX IF NOT EXISTS idx_students_student_id ON public.students(student_id);

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to read their own data
CREATE POLICY "Users can view their own student data"
  ON public.students
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own data
CREATE POLICY "Users can insert their own student data"
  ON public.students
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own data
CREATE POLICY "Users can update their own student data"
  ON public.students
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow service role to do everything (for admin/instructor access)
CREATE POLICY "Service role can do everything"
  ON public.students
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert a test student record
INSERT INTO public.students (
  student_id,
  name,
  email,
  section,
  year_level,
  bio,
  total_lessons_completed,
  average_score
) VALUES (
  'TEST-2026-001',
  'Test Student',
  'test.student@ccs108.edu',
  'CS-3A',
  'Third Year',
  'Test student for Supabase connection verification',
  5,
  87.50
) ON CONFLICT (student_id) DO NOTHING;

COMMENT ON TABLE public.students IS 'Stores student profile and progress data for CodeLearn AI';
```

### Step 3: Paste and Run

1. **Paste** the SQL into the editor
2. **Click "Run"** (or press `Ctrl+Enter`)
3. **Wait** for success message

You should see:
```
Success. No rows returned
```

### Step 4: Verify Table Created

Click on **"Table Editor"** in the left sidebar → You should see `students` table with 1 test record!

---

## 🧪 **Test It Works!**

Run this command in your terminal:

```bash
curl https://hovedryqutuucipuqxca.supabase.co/functions/v1/server/db/test
```

**Expected response:**
```json
{
  "success": true,
  "message": "Database connection successful",
  "data": {
    "table": "students",
    "record_count": 1,
    "timestamp": "2026-05-29T..."
  }
}
```

---

## 🎨 **Test in the UI (Visual)**

1. **Open** your CodeLearn AI app
2. **Login** to your account
3. **Go to Settings** (click avatar → Settings)
4. **Scroll down** to "System Tools"
5. **Click** green "Test Database Connection" button

You'll see a UI where you can:
- ✅ Test database connectivity
- ✅ View all students
- ✅ Add new students
- ✅ Delete students

---

## 🔧 **What About the Migration Error?**

You can safely **ignore** the migration sync error. You're using the database directly, not through migrations.

If you want to sync migrations properly later (optional):

```bash
# Pull remote migrations to local
export SUPABASE_ACCESS_TOKEN="sbp_b7514122cb3cb54ca49baa00643448f5e3dacc4b"
pnpm exec supabase db remote commit

# Then you can push local migrations
pnpm exec supabase db push
```

But for now, the manual SQL method is faster and works perfectly!

---

## ✅ **That's It!**

Your database table is created and ready to use. The Edge Function is already deployed with the database endpoints.

**Next steps:**
1. Test the connection (see above)
2. Use the visual UI to add/view students
3. Build features that use real PostgreSQL data!

🎉 Your CodeLearn AI now has a real database!
