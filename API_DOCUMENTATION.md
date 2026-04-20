# CodeLearn AI - Complete API Documentation

## Base URL
```
https://{projectId}.supabase.co/functions/v1/make-server-aaa3a86f
```

## Authentication
Most endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer {access_token}
```

---

## 📋 Table of Contents
1. [Health Check](#health-check)
2. [Authentication](#authentication-endpoints)
3. [User Progress](#user-progress-endpoints)
4. [Quiz System](#quiz-score-endpoints)
5. [AI Feedback](#ai-feedback-endpoints)
6. [User Profile](#user-profile-endpoints)
7. [Lesson Completion](#lesson-completion-endpoints)
8. [Analytics](#analytics-endpoints)
9. [Code Execution](#code-execution-endpoints)
10. [Machine Problems](#machine-problem-endpoints)
11. [Assignments](#assignment-management-endpoints)
12. [Plagiarism Detection](#plagiarism-detection-endpoints)
13. [Neural Network Analysis](#neural-network-analysis-endpoints)
14. [Leaderboard](#leaderboard-endpoints)
15. [Notifications](#notification-endpoints)

---

## Health Check

### GET /health
Check server status

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-16T10:30:00.000Z"
}
```

---

## Authentication Endpoints

### POST /auth/signup
Create a new user account

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "role": "student",
  "studentId": "2021-00001",
  "section": "BSCS 3A",
  "yearLevel": "3rd Year"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid-here",
    "email": "student@example.com",
    "name": "John Doe",
    "role": "student"
  }
}
```

### POST /auth/signin
Login to the system

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid-here",
    "email": "student@example.com",
    "accessToken": "jwt-token-here",
    "refreshToken": "refresh-token-here",
    "profile": { /* user profile object */ }
  }
}
```

### POST /auth/signout
Logout from the system

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "message": "Signed out successfully"
}
```

### GET /auth/session
Get current user session

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid-here",
    "email": "student@example.com",
    "profile": { /* user profile object */ }
  }
}
```

---

## User Progress Endpoints

### GET /progress/:userId/:moduleId/:lessonId
Get user progress for a specific module/lesson

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "moduleId": "mod1",
    "lessonId": "lesson1",
    "completed": true,
    "timeSpent": 1200,
    "score": 85,
    "timestamp": "2026-03-16T10:30:00.000Z"
  }
}
```

### POST /progress
Save user progress

**Request Body:**
```json
{
  "userId": "uuid",
  "moduleId": "mod1",
  "lessonId": "lesson1",
  "completed": true,
  "timeSpent": 1200,
  "score": 85
}
```

### GET /progress/:userId
Get all progress for a user

**Response:**
```json
{
  "success": true,
  "data": [ /* array of progress objects */ ]
}
```

---

## Quiz Score Endpoints

### POST /quiz/submit
Submit a quiz

**Request Body:**
```json
{
  "userId": "uuid",
  "moduleId": "mod1",
  "lessonId": "lesson1",
  "score": 85,
  "answers": [
    { "questionId": "q1", "answer": "A", "correct": true },
    { "questionId": "q2", "answer": "B", "correct": false }
  ],
  "totalQuestions": 10
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "quiz_timestamp_userid",
    "userId": "uuid",
    "moduleId": "mod1",
    "lessonId": "lesson1",
    "score": 85,
    "passed": true,
    "timestamp": "2026-03-16T10:30:00.000Z"
  }
}
```

### GET /quiz/:userId/:moduleId/:lessonId
Get quiz history for a specific lesson

### GET /quiz/:userId
Get all quiz scores for a user

---

## AI Feedback Endpoints

### POST /feedback/save
Save AI feedback for code

**Request Body:**
```json
{
  "userId": "uuid",
  "moduleId": "mod1",
  "lessonId": "lesson1",
  "code": "public class HelloWorld { ... }",
  "feedback": "Great job! Your code follows OOP principles...",
  "analysisResults": {
    "oopScores": {
      "encapsulation": 80,
      "inheritance": 0,
      "polymorphism": 0,
      "abstraction": 0
    },
    "patterns": ["Singleton"],
    "errors": []
  },
  "score": 85
}
```

### GET /feedback/:userId
Get all AI feedback for a user

### GET /feedback/:userId/:moduleId/:lessonId
Get AI feedback for a specific lesson

---

## User Profile Endpoints

### POST /profile
Create or update user profile

**Request Body:**
```json
{
  "userId": "uuid",
  "name": "John Doe",
  "email": "student@example.com",
  "studentId": "2021-00001",
  "section": "BSCS 3A",
  "yearLevel": "3rd Year",
  "avatar": "https://example.com/avatar.jpg",
  "bio": "Passionate about programming"
}
```

### GET /profile/:userId
Get user profile

---

## Lesson Completion Endpoints

### POST /lesson/complete
Mark a lesson as complete

**Request Body:**
```json
{
  "userId": "uuid",
  "moduleId": "mod1",
  "lessonId": "lesson1",
  "timeSpent": 1200
}
```

### GET /lesson/completions/:userId
Get all lesson completions for a user

---

## Analytics Endpoints

### GET /analytics/students
Get all students' progress (for instructors)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "userId": "uuid",
      "name": "John Doe",
      "email": "student@example.com",
      "progressCount": 15,
      "quizzesTaken": 10,
      "lessonsCompleted": 12,
      "averageQuizScore": 85
    }
  ]
}
```

### GET /analytics/student/:userId
Get detailed analytics for a specific student

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": { /* user profile */ },
    "stats": {
      "lessonsCompleted": 12,
      "quizzesTaken": 10,
      "averageQuizScore": 85,
      "feedbackReceived": 20,
      "submissionsCount": 15,
      "totalTimeSpent": 14400
    },
    "recentActivity": { /* recent quizzes, completions, feedback */ },
    "moduleBreakdown": { /* per-module statistics */ }
  }
}
```

---

## Code Execution Endpoints

### POST /execute-code
Execute Java code

**Request Body:**
```json
{
  "code": "public class HelloWorld { ... }",
  "userId": "uuid",
  "moduleId": "mod1",
  "lessonId": "lesson1"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "output": "Hello, World!",
    "error": null,
    "success": true,
    "executionTime": 150
  }
}
```

### POST /verify-code
Verify code against expected output

**Request Body:**
```json
{
  "code": "public class HelloWorld { ... }",
  "expectedOutput": "Hello, World!",
  "userId": "uuid",
  "moduleId": "mod1",
  "lessonId": "lesson1",
  "problemId": "problem1"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isCorrect": true,
    "similarity": 100,
    "executionResult": { /* execution details */ },
    "codeAnalysis": {
      "score": 85,
      "oopScores": {
        "encapsulation": 80,
        "inheritance": 60,
        "polymorphism": 70,
        "abstraction": 50
      },
      "patterns": ["Singleton"],
      "errors": []
    },
    "feedback": "✅ Correct! Your code produces the expected output..."
  }
}
```

---

## Machine Problem Endpoints

### GET /machine-problem/:moduleId/:lessonId
Get machine problem for a lesson

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "mp_mod1_lesson1",
    "title": "Hello World Program",
    "description": "Create a simple Java program...",
    "instructions": "1. Create a class...\n2. Add a main method...",
    "starterCode": "public class HelloWorld { ... }",
    "expectedOutput": "Hello, World!",
    "difficulty": "Beginner",
    "points": 10,
    "videoUrl": "https://youtube.com/..."
  }
}
```

### POST /machine-problem/submit
Submit machine problem solution

**Request Body:**
```json
{
  "userId": "uuid",
  "moduleId": "mod1",
  "lessonId": "lesson1",
  "problemId": "problem1",
  "code": "public class HelloWorld { ... }",
  "output": "Hello, World!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "submissionId": "mp_submission_timestamp_userid",
    "isCorrect": true,
    "score": 95,
    "output": "Hello, World!",
    "expectedOutput": "Hello, World!",
    "feedback": "✅ Correct! ...",
    "codeAnalysis": { /* OOP analysis */ }
  }
}
```

### GET /machine-problem/submissions/:userId/:moduleId/:lessonId
Get student's submissions for a machine problem

---

## Assignment Management Endpoints

### POST /assignments/create
Create a new assignment (instructor only)

**Request Body:**
```json
{
  "title": "Create a Student Management System",
  "description": "Build a complete student management system...",
  "dueDate": "2026-03-25",
  "totalPoints": 100,
  "starterCode": "public class Student { ... }",
  "testCases": [
    { "input": "John Doe", "expectedOutput": "Student: John Doe" }
  ],
  "instructorId": "instructor-uuid",
  "moduleId": "mod2"
}
```

### GET /assignments
Get all assignments

### GET /assignments/:assignmentId
Get specific assignment

### PUT /assignments/:assignmentId
Update assignment

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "dueDate": "2026-03-30"
}
```

### DELETE /assignments/:assignmentId
Delete assignment

### POST /assignments/submit
Submit assignment (student)

**Request Body:**
```json
{
  "userId": "uuid",
  "assignmentId": "assign_timestamp",
  "code": "public class Student { ... }",
  "comments": "Implemented all required features"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "submission": { /* submission object */ },
    "plagiarismCheck": {
      "isPlagiarized": false,
      "isSuspicious": false,
      "maxSimilarity": 25,
      "suspiciousMatch": null
    }
  }
}
```

### POST /assignments/grade
Grade assignment submission (instructor)

**Request Body:**
```json
{
  "submissionId": "assign_submission_timestamp_userid",
  "score": 95,
  "feedback": "Excellent work! Your implementation is clean...",
  "instructorId": "instructor-uuid"
}
```

### GET /assignments/:assignmentId/submissions
Get all submissions for an assignment

---

## Plagiarism Detection Endpoints

### POST /plagiarism/check
Check code for plagiarism

**Request Body:**
```json
{
  "code": "public class Student { ... }",
  "userId": "uuid",
  "assignmentId": "assign_timestamp"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "assignmentId": "assign_timestamp",
    "isPlagiarized": false,
    "isSuspicious": false,
    "maxSimilarity": 25,
    "suspiciousMatch": null,
    "similarities": [
      {
        "userId": "other-uuid",
        "similarity": 25,
        "submittedAt": "2026-03-15T10:00:00.000Z"
      }
    ],
    "checkedAt": "2026-03-16T10:30:00.000Z"
  }
}
```

**Similarity Thresholds:**
- `< 70%`: Normal
- `70-85%`: Suspicious
- `> 85%`: Plagiarized

### GET /plagiarism/reports/:assignmentId
Get all plagiarism reports for an assignment

---

## Neural Network Analysis Endpoints

### POST /neural-network/analyze
Analyze code using AI neural network

**Request Body:**
```json
{
  "code": "public class Student { ... }",
  "userId": "uuid",
  "moduleId": "mod2",
  "lessonId": "lesson1"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "patterns": {
      "codeSmells": [
        "Long Method: Method exceeds 30 lines",
        "Magic Numbers: Use named constants"
      ],
      "complexity": 8,
      "maintainability": 75
    },
    "recommendations": [
      "Consider using private fields with getters and setters",
      "Break down complex methods into smaller functions"
    ],
    "potentialIssues": [
      "High complexity may lead to bugs"
    ],
    "confidence": 92
  }
}
```

**Analysis Metrics:**
- **Cyclomatic Complexity**: Measures code complexity (1-10: Good, 11-20: Moderate, >20: High)
- **Maintainability Index**: 0-100 scale (>70: Good, 50-70: Moderate, <50: Poor)
- **Code Smells**: Detected anti-patterns and bad practices
- **Confidence**: AI model confidence level (0-100%)

---

## Leaderboard Endpoints

### GET /leaderboard
Get global leaderboard

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "userId": "uuid",
      "name": "John Doe",
      "studentId": "2021-00001",
      "section": "BSCS 3A",
      "totalPoints": 850,
      "averageScore": 92,
      "lessonsCompleted": 45,
      "quizzesPassed": 38
    }
  ]
}
```

**Point System:**
- Quiz passed: 10 points
- Lesson completed: 5 points

### GET /leaderboard/module/:moduleId
Get leaderboard for a specific module

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "userId": "uuid",
      "name": "John Doe",
      "studentId": "2021-00001",
      "section": "BSCS 3A",
      "averageScore": 95,
      "lessonsCompleted": 5,
      "quizzesPassed": 5
    }
  ]
}
```

---

## Notification Endpoints

### POST /notifications/create
Create a notification

**Request Body:**
```json
{
  "userId": "uuid",
  "title": "New Assignment Posted",
  "message": "Dr. Martinez has posted a new assignment for Module 2",
  "type": "info",
  "link": "/assignments/assign_123"
}
```

**Notification Types:**
- `info`: General information
- `success`: Success messages
- `warning`: Warning messages
- `error`: Error notifications

### GET /notifications/:userId
Get all notifications for a user

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "notification_timestamp_userid",
      "userId": "uuid",
      "title": "New Assignment Posted",
      "message": "Dr. Martinez has posted...",
      "type": "info",
      "link": "/assignments/assign_123",
      "read": false,
      "createdAt": "2026-03-16T10:30:00.000Z"
    }
  ]
}
```

### PUT /notifications/:notificationId/read
Mark notification as read

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "notification_timestamp_userid",
    "read": true,
    "readAt": "2026-03-16T11:00:00.000Z"
  }
}
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

---

## Rate Limiting

No rate limiting is currently implemented, but it's recommended for production.

---

## Complete Endpoint List (40+ Endpoints)

**Authentication (4):**
- POST /auth/signup
- POST /auth/signin
- POST /auth/signout
- GET /auth/session

**Progress & Completion (5):**
- GET /progress/:userId/:moduleId/:lessonId
- POST /progress
- GET /progress/:userId
- POST /lesson/complete
- GET /lesson/completions/:userId

**Quizzes (3):**
- POST /quiz/submit
- GET /quiz/:userId/:moduleId/:lessonId
- GET /quiz/:userId

**AI Feedback (3):**
- POST /feedback/save
- GET /feedback/:userId
- GET /feedback/:userId/:moduleId/:lessonId

**Profile (2):**
- POST /profile
- GET /profile/:userId

**Analytics (2):**
- GET /analytics/students
- GET /analytics/student/:userId

**Code Execution (2):**
- POST /execute-code
- POST /verify-code

**Machine Problems (3):**
- GET /machine-problem/:moduleId/:lessonId
- POST /machine-problem/submit
- GET /machine-problem/submissions/:userId/:moduleId/:lessonId

**Assignments (8):**
- POST /assignments/create
- GET /assignments
- GET /assignments/:assignmentId
- PUT /assignments/:assignmentId
- DELETE /assignments/:assignmentId
- POST /assignments/submit
- POST /assignments/grade
- GET /assignments/:assignmentId/submissions

**Plagiarism (2):**
- POST /plagiarism/check
- GET /plagiarism/reports/:assignmentId

**Neural Network (1):**
- POST /neural-network/analyze

**Leaderboard (2):**
- GET /leaderboard
- GET /leaderboard/module/:moduleId

**Notifications (3):**
- POST /notifications/create
- GET /notifications/:userId
- PUT /notifications/:notificationId/read

**System (1):**
- GET /health

**Total: 41 Fully Functional API Endpoints** ✅
