# CodeLearn AI - Backend Integration Guide

## Overview

CodeLearn AI is now fully integrated with Supabase backend, providing persistent data storage, real-time analytics, and secure authentication. This document outlines what's integrated and how to use the backend features.

## ✅ What's Already Integrated

### 1. **Authentication System**
- **Location**: `src/app/components/Login.tsx`, `src/app/components/Register.tsx`
- **API**: `src/app/services/backendApi.ts`
- **Features**:
  - User registration with role selection (Student/Instructor)
  - Secure login with JWT tokens
  - Session persistence and verification
  - Automatic session check on app load
  - Logout functionality

**How to use**:
```typescript
import * as backendApi from './services/backendApi';

// Sign up a new user
const result = await backendApi.signUp({
  email: 'student@example.com',
  password: 'SecurePass123',
  name: 'John Doe',
  role: 'student',
  studentId: '2021001',
  section: 'CS-3A',
  yearLevel: '3rd Year'
});

// Sign in
const loginResult = await backendApi.signIn('student@example.com', 'SecurePass123');

// Check current session
const session = await backendApi.getSession();

// Sign out
await backendApi.signOut();
```

### 2. **Code Submission & AI Feedback**
- **Location**: `src/app/components/CodeEditorPage.tsx`
- **API**: `src/app/services/codeSubmissionApi.ts`
- **Features**:
  - Submit code for AI analysis
  - Auto-save draft code
  - View submission history
  - Get detailed AI feedback on OOP principles

**How to use**:
```typescript
import { submitCode, autoSaveCode, getDraftCode } from './services/codeSubmissionApi';

// Submit code for analysis
const result = await submitCode({
  userId: user.id,
  moduleId: 'mod1',
  lessonId: 'lesson1',
  code: javaCode,
  language: 'java'
});

// Auto-save draft
await autoSaveCode({
  userId: user.id,
  moduleId: 'mod1',
  lessonId: 'lesson1',
  code: javaCode
});

// Get saved draft
const draft = await getDraftCode(user.id, 'mod1', 'lesson1');
```

### 3. **Progress Tracking**
- **API**: `src/app/services/backendApi.ts`
- **Features**:
  - Save lesson completion status
  - Track time spent on lessons
  - Store quiz scores
  - Monitor learning progress

**How to use**:
```typescript
// Save progress
await backendApi.saveProgress({
  userId: user.id,
  moduleId: 'mod1',
  lessonId: 'lesson1',
  completed: true,
  timeSpent: 1800, // seconds
  score: 85
});

// Get progress for specific lesson
const progress = await backendApi.getProgress(user.id, 'mod1', 'lesson1');

// Get all user progress
const allProgress = await backendApi.getAllProgress(user.id);

// Mark lesson as complete
await backendApi.markLessonComplete({
  userId: user.id,
  moduleId: 'mod1',
  lessonId: 'lesson1',
  timeSpent: 1800
});
```

### 4. **Quiz System**
- **API**: `src/app/services/backendApi.ts`
- **Features**:
  - Submit quiz answers
  - Calculate scores automatically
  - Store quiz results with pass/fail status
  - View quiz history

**How to use**:
```typescript
// Submit quiz
await backendApi.submitQuiz({
  userId: user.id,
  moduleId: 'mod1',
  lessonId: 'lesson1',
  score: 85,
  answers: [
    { questionId: 'q1', answer: 'A', correct: true },
    { questionId: 'q2', answer: 'C', correct: false }
  ],
  totalQuestions: 10
});

// Get quiz history for a lesson
const quizHistory = await backendApi.getQuizHistory(user.id, 'mod1', 'lesson1');

// Get all quizzes for a user
const allQuizzes = await backendApi.getAllQuizzes(user.id);
```

### 5. **AI Feedback Analysis**
- **API**: `src/app/services/backendApi.ts`
- **Backend**: `supabase/functions/server/aiFeedbackAnalysis.tsx`
- **Features**:
  - Analyze Java code for OOP principles
  - Detect design patterns
  - Identify code quality issues
  - Provide improvement suggestions

**How to use**:
```typescript
// Analyze code
const analysis = await backendApi.analyzeCode({
  userId: user.id,
  moduleId: 'mod1',
  lessonId: 'lesson1',
  code: javaCode
});

// Get feedback history
const feedback = await backendApi.getAIFeedback(user.id);

// Get feedback for specific lesson
const lessonFeedback = await backendApi.getLessonAIFeedback(user.id, 'mod1', 'lesson1');

// Save custom feedback
await backendApi.saveFeedback({
  userId: user.id,
  moduleId: 'mod1',
  lessonId: 'lesson1',
  code: javaCode,
  feedback: 'Great use of encapsulation!',
  analysisResults: { score: 95 },
  score: 95
});
```

### 6. **Profile Management**
- **API**: `src/app/services/backendApi.ts`
- **Features**:
  - Update user profile information
  - Store avatar and bio
  - Manage student/instructor details

**How to use**:
```typescript
// Get profile
const profile = await backendApi.getProfile(user.id);

// Update profile
await backendApi.updateProfile({
  userId: user.id,
  name: 'John Doe',
  email: 'john@example.com',
  studentId: '2021001',
  section: 'CS-3A',
  yearLevel: '3rd Year',
  avatar: 'https://...',
  bio: 'Computer Science student'
});
```

### 7. **Analytics (Instructor)**
- **API**: `src/app/services/backendApi.ts`
- **Features**:
  - View all students' analytics
  - Track individual student performance
  - Monitor module and lesson engagement
  - Generate performance reports

**How to use**:
```typescript
// Get all students analytics
const studentsData = await backendApi.getAllStudentsAnalytics();

// Get specific student analytics
const studentAnalytics = await backendApi.getStudentAnalytics(studentId);

// Sample response structure:
// {
//   profile: { name, email, studentId, ... },
//   stats: {
//     lessonsCompleted: 25,
//     quizzesTaken: 15,
//     averageQuizScore: 87,
//     feedbackReceived: 30,
//     submissionsCount: 40,
//     totalTimeSpent: 18000
//   },
//   recentActivity: {
//     quizzes: [...],
//     completions: [...],
//     feedback: [...],
//     submissions: [...]
//   }
// }
```

### 8. **Assignments (Instructor)**
- **API**: `src/app/services/backendApi.ts`
- **Features**:
  - Create assignments
  - Track submissions
  - Grade assignments
  - View assignment analytics

**How to use**:
```typescript
// Create assignment
await backendApi.createAssignment({
  instructorId: instructor.id,
  moduleId: 'mod1',
  title: 'Inheritance Practice',
  description: 'Create a class hierarchy...',
  dueDate: '2026-05-01',
  totalPoints: 100,
  starterCode: 'public class Animal { ... }',
  expectedOutput: 'Expected output...',
  testCases: [...]
});

// Get all assignments
const assignments = await backendApi.getAllAssignments();

// Get specific assignment
const assignment = await backendApi.getAssignment(assignmentId);

// Grade assignment
await backendApi.gradeAssignment(assignmentId, {
  grade: 95,
  feedback: 'Excellent work!'
});
```

### 9. **Notifications**
- **API**: `src/app/services/backendApi.ts`
- **Features**:
  - Create notifications for users
  - Get user notifications
  - Mark notifications as read

**How to use**:
```typescript
// Get notifications
const notifications = await backendApi.getNotifications(user.id);

// Create notification
await backendApi.createNotification({
  userId: student.id,
  type: 'grade',
  title: 'Assignment Graded',
  message: 'Your Module 3 assignment has been graded.',
  moduleId: 'mod3',
  lessonId: 'lesson1'
});

// Mark as read
await backendApi.markNotificationAsRead(user.id, notificationId);
```

### 10. **Leaderboard**
- **API**: `src/app/services/backendApi.ts`
- **Features**:
  - Global leaderboard
  - Module-specific leaderboard
  - User ranking

**How to use**:
```typescript
// Get global leaderboard
const leaderboard = await backendApi.getLeaderboard();

// Get module leaderboard
const moduleLeaderboard = await backendApi.getLeaderboard('mod1');

// Get user rank
const rank = await backendApi.getUserRank(user.id);
const moduleRank = await backendApi.getUserRank(user.id, 'mod1');
```

## 🔧 Backend Configuration

### Supabase Connection
The app is already connected to Supabase with the following configuration:

- **Project ID**: `hnlhcbzpeijdzueipejx`
- **API Base URL**: `https://hnlhcbzpeijdzueipejx.supabase.co/functions/v1/make-server-aaa3a86f`
- **Storage**: Key-value store in table `kv_store_aaa3a86f`

### Backend Files
- **Server Entry**: `supabase/functions/server/index.tsx`
- **KV Store**: `supabase/functions/server/kv_store.tsx`
- **AI Feedback**: `supabase/functions/server/aiFeedbackAnalysis.tsx`
- **Code Submission**: `supabase/functions/server/codeSubmissionEndpoints.tsx`
- **Additional Endpoints**: `supabase/functions/server/additionalEndpoints.tsx`

## 📊 Data Storage

All data is stored in Supabase using a key-value pattern:
- **Users**: `profile_{userId}`
- **Progress**: `progress_{userId}_{moduleId}_{lessonId}`
- **Quiz Results**: `quiz_{quizId}`
- **AI Feedback**: `aifeedback_{feedbackId}`
- **Submissions**: `submission_{submissionId}`
- **Completions**: `completion_{userId}_{moduleId}_{lessonId}`

## 🔐 Security

- **Authentication**: JWT tokens stored in localStorage as `accessToken`
- **API Authorization**: All requests include Bearer token in headers
- **Session Management**: Automatic session validation on app load
- **Demo Accounts**: Special handling for demo accounts (demo-token-student, demo-token-instructor)

## 🎯 Demo Accounts

The app supports demo accounts that work without backend calls:

**Student Demo**:
- Email: `student@demo.com`
- Password: `demo123`
- Role: Student

**Instructor Demo**:
- Email: `instructor@demo.com`
- Password: `demo123`
- Role: Instructor

## 📝 Next Steps for Full Integration

While the core backend is integrated, some components still use mock data for UI demonstration. To complete the integration:

1. **MonitoringView**: Update to fetch real-time student activities from backend
2. **ProgressView**: Replace mock progress data with backend queries
3. **AnalyticsView**: Use backend analytics endpoints instead of sample data
4. **StudentDashboard**: Fetch real student stats from backend
5. **InstructorDashboard**: Pull real class statistics from analytics API

## 🚀 Deployment Notes

- The Supabase Edge Functions are already deployed
- Any changes to `supabase/functions/server/*` files require redeployment from Make settings
- Frontend changes are automatically reflected (no redeployment needed)
- Make sure to handle errors gracefully for offline scenarios

## 🐛 Troubleshooting

### Authentication Issues
- Check that `accessToken` exists in localStorage
- Verify backend is reachable: `await backendApi.checkHealth()`
- Demo accounts bypass backend authentication

### API Errors
- Check browser console for detailed error messages
- Verify user is authenticated before API calls
- Ensure backend functions are deployed in Supabase

### Data Not Persisting
- Confirm `userId` is being passed correctly
- Check network tab for failed API requests
- Verify Supabase connection in Make settings

## 📚 Additional Resources

- **Supabase Dashboard**: https://supabase.com/dashboard/project/hnlhcbzpeijdzueipejx
- **Backend API Reference**: See `src/app/services/backendApi.ts` for all available endpoints
- **Edge Functions**: `supabase/functions/server/index.tsx` for backend logic

---

**Last Updated**: April 17, 2026
**Integration Status**: ✅ Core Features Integrated | 🚧 UI Components In Progress
