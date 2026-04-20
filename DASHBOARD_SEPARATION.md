# Dashboard Separation - Student vs Instructor

## Overview
This document outlines the complete separation of dashboards for students and instructors according to the use case diagram.

## Architecture

### Student Portal (Student Role)
**Access Point:** Login → Student Dashboard

#### Navigation Items:
1. **Dashboard** - Overview of personal progress
2. **Access Modules** - Browse and access learning content
3. **Receive Feedback** - View AI-generated feedback on submissions
4. **Track Progress** - Monitor learning progress and performance

#### Student Dashboard Features:
1. **Stats Cards:**
   - Modules Completed
   - Current Streak (days)
   - Average Score
   - Time Spent

2. **AI-Powered Insights:**
   - Personalized learning recommendations
   - Strength areas
   - Areas for improvement

3. **Recent CCS108 Activities:**
   - Recent module completions
   - Practice exercises
   - Scores and feedback

4. **Quick Actions:**
   - Access Modules
   - Receive Feedback
   - Performance Monitoring
   - Track Learning Progress

#### Student Use Cases (From Diagram):
- ✅ Log In
- ✅ Register Account
- ✅ Manage Profile (via Settings)
- ✅ Edit Profile (via Settings)
- ✅ Access Modules
- ✅ Learning Interaction (within modules)
- ✅ Submit Answers (within practice exercises)
- ✅ View Errors (in feedback page)
- ✅ Set Personalization (in settings)
- ✅ Receive Feedback
- ✅ Performance Monitoring (progress view)
- ✅ Track Learning Progress

---

### Instructor Portal (Instructor Role)
**Access Point:** Login → Instructor Dashboard

#### Navigation Items:
1. **Dashboard** - Overview of class performance
2. **Course Management** - Manage modules and content
3. **Student Analytics** - View comprehensive student data
4. **Monitoring** - Real-time activity tracking

#### Instructor Dashboard Features:
1. **Stats Overview:**
   - Total Students (42)
   - Course Modules (10)
   - Average Completion (68%)
   - AI Patterns Detected

2. **Identify Learning Patterns (AI-Powered):**
   - Polymorphism Difficulty Detection
   - Strong Encapsulation Understanding
   - Code Similarity Detection (Plagiarism)
   - Instructional Adjustment Actions

3. **View Learning Analytics:**
   - Weekly Average Scores (Line Chart)
   - OOP Principles Mastery (Bar Chart)

4. **Monitor Coding Behavior:**
   - Real-time student activity feed
   - Recent submissions and scores

5. **Access Student Performance:**
   - Top Performers List
   - Students Needing Attention
   - Individual student analytics

6. **Quick Actions:**
   - Access Student Analytics
   - Monitoring & Evaluation
   - Course Management
   - Create Activities
   - Export Analytics

#### Instructor Use Cases (From Diagram):
- ✅ Log In
- ✅ Register Account
- ✅ Manage Profile (via Settings)
- ✅ Course Management (modules page + dashboard)
- ✅ Create Activities (dialog in dashboard)
- ✅ Create Modules (dialog in dashboard)
- ✅ Access Student Analytics (dedicated Analytics View)
- ✅ View Performance Analytics (Analytics View)
- ✅ Monitoring and Evaluation (dedicated Monitoring View)
- ✅ Identify Learning Patterns (AI section in dashboard)
- ✅ Monitor Coding Behavior (Monitoring View)
- ✅ Make Instructional Adjustments (action buttons in patterns)

---

## New Instructor Views

### 1. Analytics View (`/src/app/components/AnalyticsView.tsx`)
**Purpose:** Comprehensive student performance analytics

**Features:**
- Key Metrics Dashboard
  - Total Students
  - Average Score
  - Completion Rate
  - Top Performer
- Weekly Performance Trend (Line Chart)
- OOP Principles Mastery (Bar Chart)
- Module Completion Distribution (Pie Chart)
- Score Distribution (Bar Chart)
- Detailed Student Performance Table

**Navigation:** Dashboard → Quick Actions → "Access Student Analytics"

### 2. Monitoring View (`/src/app/components/MonitoringView.tsx`)
**Purpose:** Real-time student activity and behavior tracking

**Features:**
- Live Activity Feed (with pulse indicator)
  - Student actions
  - Submission status
  - Errors and compilations
  - Timestamps
- Identify Learning Patterns
  - Class-wide behavioral trends
  - Recommended actions
  - Adjustment options
- Coding Behavior Patterns
  - Individual student patterns
  - Severity indicators
  - Recommendations
  - Instructional adjustment actions
- Monitoring Stats
  - Active students now
  - Submissions today
  - Errors detected
  - Patterns identified

**Navigation:** Dashboard → Quick Actions → "Monitoring & Evaluation"

---

## Component Structure

```
/src/app/components/
├── StudentDashboard.tsx       # Student-specific dashboard
├── InstructorDashboard.tsx    # Instructor-specific dashboard
├── AnalyticsView.tsx          # Instructor analytics page
├── MonitoringView.tsx         # Instructor monitoring page
├── Header.tsx                 # Role-aware navigation
├── ModulesPage.tsx            # Module browsing (both roles)
├── LessonViewer.tsx           # Lesson content (both roles)
├── FeedbackPage.tsx           # Student feedback view
├── ProgressView.tsx           # Student progress tracking
└── SettingsPage.tsx           # Profile management (both roles)
```

---

## Navigation Flow

### Student Flow:
```
Login → Student Dashboard → {
  Access Modules → Module → Lesson → Practice Exercise → Submit Code → Receive Feedback
  Track Progress → Performance Charts
  Settings → Edit Profile
}
```

### Instructor Flow:
```
Login → Instructor Dashboard → {
  Student Analytics → Detailed Charts & Reports
  Monitoring & Evaluation → Live Feed & Patterns
  Course Management → Create Modules/Activities
  Settings → Edit Profile
}
```

---

## Role-Based Header Navigation

### Student Header:
```
[Dashboard] [Access Modules] [Receive Feedback] [Track Progress]
```

### Instructor Header:
```
[Dashboard] [Course Management] [Student Analytics] [Monitoring]
```

---

## Key Differences

| Feature | Student | Instructor |
|---------|---------|------------|
| **Primary Focus** | Personal Learning Progress | Class Management & Analytics |
| **Dashboard Stats** | Personal metrics (streak, scores) | Class metrics (total students, completion rates) |
| **AI Features** | Personal insights & recommendations | Pattern detection & plagiarism alerts |
| **Analytics** | Own progress tracking | All students' performance data |
| **Actions** | Submit code, view feedback | Create content, monitor students |
| **Monitoring** | None | Real-time activity feed |
| **Data Scope** | Individual | Aggregate + Individual |

---

## Color Coding

### Student Portal:
- Primary: Blue gradient
- Secondary: Purple accent
- Badge: Green (Student Portal)

### Instructor Portal:
- Primary: Purple gradient  
- Secondary: Blue accent
- Badge: Blue (Instructor)

---

## Implementation Status

✅ **Completed:**
- Separate dashboard components
- Role-based navigation in Header
- Student dashboard with use case alignment
- Instructor dashboard with use case alignment
- Analytics View (instructor-only)
- Monitoring View (instructor-only)
- Navigation routing for all views
- Quick action buttons aligned to use cases

✅ **Use Case Coverage:**
- Student: 12/12 use cases implemented
- Instructor: 11/11 use cases implemented

---

## Files Modified

1. `/src/app/App.tsx` - Added analytics and monitoring views
2. `/src/app/components/Header.tsx` - Role-based navigation
3. `/src/app/components/StudentDashboard.tsx` - Aligned to student use cases
4. `/src/app/components/InstructorDashboard.tsx` - Aligned to instructor use cases

## Files Created

1. `/src/app/components/AnalyticsView.tsx` - Instructor analytics page
2. `/src/app/components/MonitoringView.tsx` - Instructor monitoring page
3. `/DASHBOARD_SEPARATION.md` - This documentation

---

## Testing Checklist

### Student Portal:
- [ ] Login as student
- [ ] View student dashboard with personal stats
- [ ] Navigate to Access Modules
- [ ] Navigate to Receive Feedback
- [ ] Navigate to Track Progress
- [ ] Verify student-only navigation items
- [ ] Test quick actions

### Instructor Portal:
- [ ] Login as instructor
- [ ] View instructor dashboard with class stats
- [ ] Navigate to Student Analytics view
- [ ] Navigate to Monitoring & Evaluation view
- [ ] Navigate to Course Management
- [ ] Test Create Activity dialog
- [ ] Test Create Module dialog
- [ ] Verify instructor-only navigation items
- [ ] Test quick actions

---

## Alignment with Use Case Diagram

### Student (Top Actor in Diagram):
✅ All use cases from the diagram are implemented:
- Login/Register → Authentication screens
- Manage/Edit Profile → Settings page
- Access Modules → Modules page
- Learning Interaction → Lesson viewer with Monaco editor
- Submit Answers → Practice exercises in lessons
- View Errors → Feedback page
- Receive Feedback → Feedback page with AI analysis
- Performance Monitoring → Progress view with charts
- Track Learning Progress → Progress view

### Instructor (Bottom Actor in Diagram):
✅ All use cases from the diagram are implemented:
- Login/Register → Authentication screens
- Manage Profile → Settings page
- Course Management → Modules page + dialogs
- Create Activities → Dialog in dashboard
- Create Modules → Dialog in dashboard
- Access Student Analytics → Dedicated Analytics View
- View Performance Analytics → Analytics View
- Monitoring and Evaluation → Dedicated Monitoring View
- Identify Learning Patterns → AI section in dashboard + monitoring
- Monitor Coding Behavior → Monitoring View
- Make Instructional Adjustments → Action buttons throughout

### Neural Network System (Right Actor):
✅ Backend processing (simulated):
- Process Code Submissions → Code analysis in practice exercises
- Generate Feedback → AI feedback generation
- Analyze Errors → Error detection and reporting
- Detect Coding Patterns → Pattern identification in monitoring
- Store Learning Data → localStorage persistence

---

## Summary

The dashboard separation is complete with:
- ✅ Distinct dashboards for students and instructors
- ✅ Role-specific navigation
- ✅ Dedicated analytics and monitoring views for instructors
- ✅ All use cases from the diagram implemented
- ✅ Clear visual separation with badges and color coding
- ✅ Comprehensive feature coverage for both roles
