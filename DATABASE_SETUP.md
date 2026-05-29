# Supabase Database Setup & Testing Guide

## 🎯 Overview

This guide will help you:
1. Create a real PostgreSQL table in Supabase
2. Deploy the updated Edge Function with database endpoints
3. Test CRUD operations through a visual UI

---

## 📋 Step 1: Run Database Migration

First, you need to create the `students` table in your Supabase database.

### Option A: Using Supabase CLI (Recommended)

```bash
# Set your access token
export SUPABASE_ACCESS_TOKEN="sbp_b7514122cb3cb54ca49baa00643448f5e3dacc4b"

# Link to your project (if not already linked)
pnpm exec supabase link --project-ref hovedryqutuucipuqxca

# Push the migration to Supabase
pnpm exec supabase db push
```

### Option B: Using Supabase Dashboard (Manual)

1. Go to https://supabase.com/dashboard/project/hovedryqutuucipuqxca/editor
2. Click on "SQL Editor" in the left sidebar
3. Click "New query"
4. Copy and paste the entire contents of `/supabase/migrations/20260529000001_create_students_table.sql`
5. Click "Run" or press `Ctrl+Enter`

You should see: `Success. No rows returned`

---

## 📋 Step 2: Deploy Updated Edge Function

The Edge Function has been updated with new database endpoints. Deploy it:

```bash
# Set your access token
export SUPABASE_ACCESS_TOKEN="sbp_b7514122cb3cb54ca49baa00643448f5e3dacc4b"

# Deploy the updated function
pnpm exec supabase functions deploy server --project-ref hovedryqutuucipuqxca --no-verify-jwt
```

You should see:
```
Uploading asset (server): supabase/functions/server/index.ts
Uploading asset (server): supabase/functions/server/databaseEndpoints.ts
...
Deployed Functions on project hovedryqutuucipuqxca: server
```

---

## 📋 Step 3: Test Database Connection

### Quick Command Line Test

Test that the database table exists and is accessible:

```bash
curl https://hovedryqutuucipuqxca.supabase.co/functions/v1/server/db/test
```

Expected response:
```json
{
  "success": true,
  "message": "Database connection successful",
  "data": {
    "table": "students",
    "record_count": 1,
    "timestamp": "2026-05-29T12:30:00.000Z"
  }
}
```

### Using the Visual UI (Recommended)

1. **Open your CodeLearn AI app** in the browser
2. **Log in** to your account
3. **Go to Settings** (click your avatar → Settings)
4. **Scroll down** to "System Tools" section
5. **Click "Test Database Connection"** (green button)

This will open a full database testing interface where you can:
- ✅ Test database connectivity
- ✅ View all students in the table
- ✅ Add new student records
- ✅ Delete student records

---

## 🗄️ Database Schema

The `students` table has been created with the following structure:

```sql
Column                     | Type                        | Description
---------------------------|-----------------------------|---------------------------------
id                         | UUID (Primary Key)          | Auto-generated unique ID
user_id                    | UUID (Foreign Key)          | References auth.users
student_id                 | TEXT (Unique)               | Student ID (e.g., ST-2026-001)
name                       | TEXT                        | Student name
email                      | TEXT (Unique)               | Student email
section                    | TEXT                        | Class section (e.g., CS-3A)
year_level                 | TEXT                        | Year level (e.g., Third Year)
enrolled_courses           | TEXT[]                      | Array of course codes
avatar_url                 | TEXT                        | Profile picture URL
bio                        | TEXT                        | Student bio
total_lessons_completed    | INTEGER                     | Progress counter
total_quizzes_taken        | INTEGER                     | Quiz counter
average_score              | NUMERIC(5,2)                | Average score percentage
total_time_spent           | INTEGER                     | Time in seconds
streak_days                | INTEGER                     | Learning streak
last_active_at             | TIMESTAMP WITH TIME ZONE    | Last activity time
created_at                 | TIMESTAMP WITH TIME ZONE    | Record creation time
updated_at                 | TIMESTAMP WITH TIME ZONE    | Last update time (auto)
```

---

## 🔌 API Endpoints Available

Once deployed, you can use these endpoints:

### Test Connection
```bash
GET /db/test
```
Returns connection status and record count.

### Get All Students
```bash
GET /db/students
```
Returns all student records from the database.

### Get Single Student
```bash
GET /db/students/:id
```
Returns a specific student by UUID.

### Create Student
```bash
POST /db/students
Content-Type: application/json

{
  "student_id": "ST-2026-042",
  "name": "Jane Doe",
  "email": "jane.doe@ccs108.edu",
  "section": "CS-3B",
  "year_level": "Third Year"
}
```

### Update Student
```bash
PUT /db/students/:id
Content-Type: application/json

{
  "name": "Jane Doe Updated",
  "total_lessons_completed": 10,
  "average_score": 92.5
}
```

### Delete Student
```bash
DELETE /db/students/:id
```

---

## 🧪 Testing Examples

### Example 1: Create a Student via cURL

```bash
curl -X POST "https://hovedryqutuucipuqxca.supabase.co/functions/v1/server/db/students" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "ST-2026-042",
    "name": "Juan Dela Cruz",
    "email": "juan.delacruz@ccs108.edu",
    "section": "CS-3A",
    "year_level": "Third Year"
  }'
```

### Example 2: Get All Students

```bash
curl https://hovedryqutuucipuqxca.supabase.co/functions/v1/server/db/students
```

### Example 3: Update a Student

```bash
curl -X PUT "https://hovedryqutuucipuqxca.supabase.co/functions/v1/server/db/students/STUDENT_UUID_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "total_lessons_completed": 15,
    "average_score": 95.0
  }'
```

---

## ✅ Verification Checklist

After completing the setup, verify:

- [ ] Migration ran successfully (check Supabase Table Editor)
- [ ] `students` table exists with correct schema
- [ ] Test record exists (TEST-2026-001)
- [ ] Edge Function deployed (version number increased)
- [ ] `/db/test` endpoint returns success
- [ ] Can view students in the UI
- [ ] Can create new students in the UI
- [ ] Can delete students in the UI

---

## 🔍 View Data in Supabase Dashboard

To see the actual data in Supabase:

1. Go to https://supabase.com/dashboard/project/hovedryqutuucipuqxca/editor
2. Click on "Table Editor" in the left sidebar
3. Click on the `students` table
4. You'll see all records with their data

You can also:
- Edit records directly
- Add new records manually
- Export data as CSV
- Run SQL queries

---

## 🛡️ Security Features

The table includes Row Level Security (RLS):

- ✅ Users can only view/edit their own student data
- ✅ Service role (your Edge Function) can access all data
- ✅ Automatic `updated_at` timestamp on changes
- ✅ Foreign key to auth.users for data integrity

---

## 🎨 Design System Compliance

The Database Test UI component uses your design system:

- ✅ CSS variables from `/src/styles/globals.css`
- ✅ Color palette (primary, success, error, neutral)
- ✅ Spacing scale (var(--spacing-*))
- ✅ Border radius (var(--radius-*))
- ✅ Typography (var(--font-sans))

All buttons, inputs, and cards follow your design system!

---

## 🐛 Troubleshooting

### Migration Fails

**Error:** `relation "students" already exists`
- **Fix:** Table already created! Skip migration and go to Step 2.

**Error:** `permission denied`
- **Fix:** Make sure you're using the service role key, not anon key.

### Can't Connect to Database

**Error:** `Failed to connect to database`
- **Fix:** Check that the migration ran successfully in the Supabase dashboard.

**Error:** `Table does not exist`
- **Fix:** Re-run the migration or create table manually via SQL Editor.

### Edge Function Not Updating

**Error:** Old endpoints still running
- **Fix:** Force redeploy with `--debug` flag to see what's uploading.

---

## 🎉 Next Steps

Once everything is working:

1. **Migrate user data**: Move localStorage data to real database tables
2. **Add more tables**: Create tables for lessons, quizzes, progress, etc.
3. **Implement real-time**: Use Supabase Realtime for live updates
4. **Add analytics**: Track student performance with database queries
5. **Build dashboards**: Create instructor analytics views with real data

You now have a fully functional PostgreSQL database connected to your CodeLearn AI system! 🚀
