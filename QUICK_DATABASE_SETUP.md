# Quick Database Setup - Run These Commands

## ✅ Step 1: Deploy Edge Function (DONE)

The Edge Function is already deployed with database endpoints! ✅

---

## 📋 Step 2: Create the Students Table

You have **2 options** to create the table:

### Option A: Using Supabase Dashboard (Easiest - 2 minutes)

1. **Go to:** https://supabase.com/dashboard/project/hovedryqutuucipuqxca/sql
2. **Click:** "New query"
3. **Copy/Paste** the SQL from: `/supabase/migrations/20260529000001_create_students_table.sql`
4. **Click:** "Run" (or press Ctrl+Enter)
5. **Wait for:** "Success. No rows returned" message

### Option B: Using CLI (Advanced)

```bash
# Set access token
export SUPABASE_ACCESS_TOKEN="sbp_b7514122cb3cb54ca49baa00643448f5e3dacc4b"

# Link project
pnpm exec supabase link --project-ref hovedryqutuucipuqxca

# Push migration
pnpm exec supabase db push --linked
```

---

## 🧪 Step 3: Test It!

### Quick Test (Command Line)

```bash
# Test database connection
curl https://hovedryqutuucipuqxca.supabase.co/functions/v1/server/db/test

# Expected result: "success": true, "record_count": 1
```

### Full Test (Visual UI - Recommended)

1. **Open** your CodeLearn AI app
2. **Login** to your account  
3. **Go to Settings** (avatar → Settings)
4. **Scroll down** to "System Tools"
5. **Click** the green "Test Database Connection" button

You'll see a UI where you can:
- ✅ Test connectivity
- ✅ View all students
- ✅ Add new students
- ✅ Delete students

---

## 🎯 What You'll Get

Once the table is created, you can:

1. **Store real student data** in PostgreSQL (not localStorage)
2. **Test CRUD operations** (Create, Read, Update, Delete)
3. **View data** in Supabase dashboard
4. **Build features** that use real database tables

---

## 📊 Quick Verification

After creating the table, run this to verify:

```bash
curl https://hovedryqutuucipuqxca.supabase.co/functions/v1/server/db/students
```

You should see the test student record:
```json
{
  "success": true,
  "data": [
    {
      "student_id": "TEST-2026-001",
      "name": "Test Student",
      "email": "test.student@ccs108.edu",
      ...
    }
  ]
}
```

---

## 🎨 Design System

The Database Test UI uses your design system CSS variables:
- ✅ Colors: `var(--color-primary-600)`, `var(--color-success-500)`, etc.
- ✅ Spacing: `var(--spacing-4)`, `var(--spacing-6)`, etc.
- ✅ Radius: `var(--radius-md)`, `var(--radius-lg)`, etc.
- ✅ Fonts: `var(--font-sans)` from `/src/styles/globals.css`

All components follow your design system! You can update colors/spacing by editing the CSS files.

---

## 🚀 That's It!

You're now ready to test the full database connection with a real PostgreSQL table that reflects in Supabase!

**Need help?** See `DATABASE_SETUP.md` for detailed instructions and troubleshooting.
