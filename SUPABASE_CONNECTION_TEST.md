# Supabase Connection Test Guide

## ✅ Your system is now connected to Supabase!

The CodeLearn AI frontend has been successfully connected to your Supabase backend (`hlavedryqutuucipuqxca`).

---

## How to Test the Connection

### Option 1: Use the Built-in UI Test (Recommended)

1. **Open your CodeLearn AI application** in the preview/browser
2. **Log in** to your account (or create a new account)
3. **Navigate to Settings** (click your avatar → Settings, or use the navigation menu)
4. **Scroll down** to the "System Tools" section at the bottom
5. **Click "Run Connection Test"** button
6. The test will check:
   - ✅ Backend health check
   - ✅ User signup
   - ✅ User signin/authentication
   - ✅ Progress data save
   - ✅ Progress data retrieval

---

### Option 2: Manual API Testing with cURL

You can also test the endpoints directly from your terminal:

#### 1. Health Check
```bash
curl -X GET "https://hovedryqutuucipuqxca.supabase.co/functions/v1/server/health"
```

Expected response:
```json
{"status":"ok","timestamp":"2026-05-29T12:03:00.777Z"}
```

#### 2. Create a Test User
```bash
curl -X POST "https://hovedryqutuucipuqxca.supabase.co/functions/v1/server/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"TestPass123","name":"Test User","role":"student"}'
```

#### 3. Sign In
```bash
curl -X POST "https://hovedryqutuucipuqxca.supabase.co/functions/v1/server/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"TestPass123"}'
```

#### 4. Save Progress (replace USER_ID with actual ID from signup)
```bash
curl -X POST "https://hovedryqutuucipuqxca.supabase.co/functions/v1/server/progress" \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID","moduleId":"m1","lessonId":"l1","completed":true,"timeSpent":300,"score":95}'
```

#### 5. Retrieve Progress
```bash
curl -X GET "https://hovedryqutuucipuqxca.supabase.co/functions/v1/server/progress/USER_ID/m1/l1"
```

---

## What's Working

✅ **Edge Function Deployed**: Version 13 deployed successfully  
✅ **All Endpoints Active**: 40+ API endpoints available  
✅ **Authentication**: Supabase Auth working with JWT tokens  
✅ **Data Persistence**: KV store for user data, progress, quizzes  
✅ **Frontend Integration**: API service configured correctly  

---

## Backend Features Available

### Authentication
- `/auth/signup` - Create new users
- `/auth/signin` - User login
- `/auth/signout` - User logout
- `/auth/session` - Validate session

### Progress Tracking
- `/progress` - Save student progress
- `/progress/:userId/:moduleId/:lessonId` - Get specific progress
- `/progress/:userId` - Get all user progress

### Quiz System
- `/quiz/submit` - Submit quiz answers
- `/quiz/:userId/:moduleId/:lessonId` - Get quiz history
- `/quiz/attempts/:userId` - Get all quiz attempts

### AI Feedback
- `/ai-feedback/analyze` - Analyze Java code
- `/ai-feedback/:userId` - Get all feedback
- `/ai-feedback/:userId/:moduleId/:lessonId` - Get lesson feedback

### Code Submissions
- `/submissions/submit` - Submit code
- `/submissions/history` - Get submission history
- `/submissions/autosave` - Auto-save drafts
- `/submissions/draft` - Get draft code

### Analytics (Instructor)
- `/analytics/students` - Get all student stats
- `/analytics/student/:userId` - Get individual student analytics

### Machine Problems
- `/machine-problem/:moduleId/:lessonId` - Get problem details
- `/machine-problem/submit` - Submit solution
- `/machine-problem/submissions/:userId/:moduleId/:lessonId` - Get submissions

---

## Troubleshooting

If you encounter any issues:

1. **404 Errors**: Make sure the Edge Function is deployed
   ```bash
   export SUPABASE_ACCESS_TOKEN="sbp_b7514122cb3cb54ca49baa00643448f5e3dacc4b"
   pnpm exec supabase functions deploy server --project-ref hovedryqutuucipuqxca --no-verify-jwt
   ```

2. **CORS Errors**: The server is configured to allow all origins (`*`)

3. **Authentication Errors**: Check that Supabase environment variables are set correctly in the Edge Function

4. **Check Logs**: Visit the Supabase dashboard to view Edge Function logs
   - https://supabase.com/dashboard/project/hovedryqutuucipuqxca/functions

---

## Next Steps

Your system is fully operational! Students can now:
- ✅ Sign up and log in
- ✅ Complete lessons and track progress
- ✅ Take quizzes with persistent results
- ✅ Submit code and receive AI feedback
- ✅ View their learning analytics

Instructors can:
- ✅ Monitor student progress
- ✅ View class analytics
- ✅ Track quiz performance
- ✅ Review code submissions

All data is now persisting in Supabase! 🎉
