# CodeLearn AI - Complete Data Specification

## 📊 Overview

This document details all actual data implemented across performance levels (LOW, MEDIUM, HIGH) for the CodeLearn AI platform.

---

## 👥 Student Data

### Total Students: **28**

#### Performance Distribution:
- **HIGH (≥80%)**: 8 students (29%)
- **MEDIUM (60-79%)**: 10 students (36%)
- **LOW (<60%)**: 10 students (36%)

---

## 🟢 HIGH PERFORMANCE STUDENTS (8 Students)

### Characteristics:
- **Average Score Range**: 81-94%
- **Modules Completed**: 5-8 out of 10
- **Total Submissions**: 28-45
- **Engagement**: Active within last 6 hours
- **Enrollment**: January 15-18, 2024

### Student List:

| # | Name | ID | Score | Modules | Submissions | Last Active |
|---|------|-----|-------|---------|-------------|-------------|
| 1 | Maria Santos | 2024-00001 | 94% | 8/10 | 45 | 2 hours ago |
| 2 | John Carlo Reyes | 2024-00002 | 91% | 7/10 | 42 | 5 hours ago |
| 3 | Sarah Mae Gonzales | 2024-00003 | 89% | 7/10 | 38 | 1 hour ago |
| 4 | Miguel Angel Cruz | 2024-00004 | 87% | 6/10 | 35 | 3 hours ago |
| 5 | Andrea Nicole Ramos | 2024-00005 | 85% | 6/10 | 33 | 4 hours ago |
| 6 | Carlos Eduardo Bautista | 2024-00006 | 83% | 5/10 | 30 | 6 hours ago |
| 7 | Patricia Ann Flores | 2024-00007 | 82% | 5/10 | 29 | 2 hours ago |
| 8 | Kenneth Dave Torres | 2024-00008 | 81% | 5/10 | 28 | 1 hour ago |

### Code Quality Example (Maria Santos - 95/100):
```java
/**
 * Student class demonstrating proper OOP principles
 * @author Maria Santos
 */
public class Student {
    // Private fields for encapsulation
    private String name;
    private int studentId;
    private double gpa;
    private String email;
    
    // Constructor with validation
    public Student(String name, int studentId, String email) {
        this.name = name;
        this.studentId = studentId;
        this.email = email;
        this.gpa = 0.0;
    }
    
    // Comprehensive getter/setter methods with validation
    public String getName() { return name; }
    public int getStudentId() { return studentId; }
    public double getGpa() { return gpa; }
    public String getEmail() { return email; }
    
    public void setName(String name) {
        if (name != null && !name.trim().isEmpty()) {
            this.name = name;
        }
    }
    
    public void setGpa(double gpa) {
        if (gpa >= 0.0 && gpa <= 4.0) {
            this.gpa = gpa;
        }
    }
    
    // Business logic
    public String getAcademicStanding() {
        if (gpa >= 3.5) return "Dean's List";
        if (gpa >= 3.0) return "Good Standing";
        if (gpa >= 2.0) return "Satisfactory";
        return "Probation";
    }
    
    @Override
    public String toString() {
        return "Student{name='" + name + "', studentId=" + studentId + 
               ", gpa=" + gpa + ", email='" + email + "'}";
    }
}
```

### Performance Metrics (HIGH):
- **OOP Scores**:
  - Encapsulation: 98/100
  - Inheritance: 75/100
  - Polymorphism: 85/100
  - Abstraction: 90/100
  - Overall: 87/100
- **Time Spent per Lesson**: ~30 minutes
- **Submit Attempts**: 2-3 per assignment
- **Code Patterns Detected**: 6+ (all OOP principles)

---

## 🟡 MEDIUM PERFORMANCE STUDENTS (10 Students)

### Characteristics:
- **Average Score Range**: 61-78%
- **Modules Completed**: 2-5 out of 10
- **Total Submissions**: 15-26
- **Engagement**: Active within last 26 hours
- **Enrollment**: January 19-23, 2024

### Student List:

| # | Name | ID | Score | Modules | Submissions | Last Active |
|---|------|-----|-------|---------|-------------|-------------|
| 9 | Jerome Santos | 2024-00009 | 78% | 5/10 | 26 | 8 hours ago |
| 10 | Angelica Mae Dizon | 2024-00010 | 76% | 4/10 | 24 | 10 hours ago |
| 11 | Rafael Jose Mendoza | 2024-00011 | 74% | 4/10 | 23 | 12 hours ago |
| 12 | Christine Joy Aquino | 2024-00012 | 72% | 4/10 | 22 | 14 hours ago |
| 13 | Mark Anthony Villar | 2024-00013 | 70% | 3/10 | 20 | 16 hours ago |
| 14 | Diana Rose Castillo | 2024-00014 | 68% | 3/10 | 19 | 18 hours ago |
| 15 | Joshua Manuel Garcia | 2024-00015 | 66% | 3/10 | 18 | 20 hours ago |
| 16 | Michelle Anne Santos | 2024-00016 | 64% | 3/10 | 17 | 22 hours ago |
| 17 | Ryan Joseph dela Cruz | 2024-00017 | 62% | 2/10 | 16 | 1 day ago |
| 18 | Jasmine Marie Tan | 2024-00018 | 61% | 2/10 | 15 | 1 day ago |

### Code Quality Example (Jerome Santos - 72/100):
```java
public class Student {
    private String name;
    private int studentId;
    private double gpa;
    
    public Student(String name, int studentId) {
        this.name = name;
        this.studentId = studentId;
        this.gpa = 0.0;
    }
    
    public String getName() {
        return name;
    }
    
    public int getStudentId() {
        return studentId;
    }
    
    public double getGpa() {
        return gpa;
    }
    
    public void setGpa(double gpa) {
        this.gpa = gpa;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}
```

**Feedback**: "Good effort! Your code has proper encapsulation and basic getter/setter methods. Consider adding: input validation, comprehensive documentation, business logic methods, and toString() override."

### Performance Metrics (MEDIUM):
- **OOP Scores**:
  - Encapsulation: 85/100
  - Inheritance: 50/100
  - Polymorphism: 60/100
  - Abstraction: 65/100
  - Overall: 65/100
- **Time Spent per Lesson**: ~22 minutes
- **Submit Attempts**: 4-5 per assignment
- **Code Patterns Detected**: 4 (basic OOP principles)

---

## 🔴 LOW PERFORMANCE STUDENTS (10 Students)

### Characteristics:
- **Average Score Range**: 32-58%
- **Modules Completed**: 0-2 out of 10
- **Total Submissions**: 4-14
- **Engagement**: Inactive 2-6+ days
- **Enrollment**: January 24-28, 2024

### Student List:

| # | Name | ID | Score | Modules | Submissions | Last Active | Status |
|---|------|-----|-------|---------|-------------|-------------|--------|
| 19 | Robert James Navarro | 2024-00019 | 58% | 2/10 | 14 | 2 days ago | ⚠️ |
| 20 | Sophia Grace Rivera | 2024-00020 | 55% | 2/10 | 13 | 2.5 days ago | ⚠️ |
| 21 | Daniel Patrick Lopez | 2024-00021 | 52% | 1/10 | 11 | 3 days ago | ⚠️ |
| 22 | Hannah Isabel Perez | 2024-00022 | 49% | 1/10 | 10 | 3.5 days ago | ⚠️ |
| 23 | Vincent Paul Morales | 2024-00023 | 46% | 1/10 | 9 | 4 days ago | 🚨 |
| 24 | Samantha Louise Cruz | 2024-00024 | 43% | 1/10 | 8 | 4.5 days ago | 🚨 |
| 25 | Christian Jay Pascual | 2024-00025 | 41% | 0/10 | 7 | 5 days ago | 🚨 |
| 26 | Emily Claire Rodriguez | 2024-00026 | 38% | 0/10 | 6 | 5.5 days ago | 🚨 |
| 27 | Anthony Miguel Santos | 2024-00027 | 35% | 0/10 | 5 | 6 days ago | 🚨 |
| 28 | Nicole Ann Fernandez | 2024-00028 | 32% | 0/10 | 4 | 6.5 days ago | 🚨 |

**Legend**: ⚠️ = Needs Intervention | 🚨 = URGENT Intervention Required

### Code Quality Example (Robert James Navarro - 48/100):
```java
public class student {
    String name;
    int id;
    double gpa;
    
    public student() {
        name = "";
        id = 0;
    }
    
    public void setName(String n) {
        name = n;
    }
    
    public String getName() {
        return name;
    }
}
```

**Feedback**: "Your code needs improvement. Issues found:
- Class name should start with uppercase (Student, not student)
- Fields should be private for proper encapsulation
- Missing getter for studentId field
- Missing setter for gpa field
- No input validation in setter methods
- Incomplete constructor parameters"

### Performance Metrics (LOW):
- **OOP Scores**:
  - Encapsulation: 35/100
  - Inheritance: 40/100
  - Polymorphism: 45/100
  - Abstraction: 50/100
  - Overall: 42/100
- **Time Spent per Lesson**: ~35 minutes
- **Submit Attempts**: 7+ per assignment
- **Code Patterns Detected**: 2-3 (minimal OOP)

---

## 📈 Learning Patterns Detected

### Pattern 1: Polymorphism Difficulty (HIGH SEVERITY)
- **Affected Students**: 15 (54% of class)
- **Description**: Students struggling with method overriding and runtime polymorphism
- **Action Required**: Schedule additional workshop session

### Pattern 2: Strong Encapsulation Skills (POSITIVE)
- **Affected Students**: 13 (46% of class)
- **Description**: Consistently applying private fields with getters/setters
- **Action**: Continue current methodology

### Pattern 3: Plagiarism Alert (MEDIUM SEVERITY)
- **Affected Students**: 5 (18% of class)
- **Description**: Code similarity above 85% threshold in Module 3
- **Action Required**: Investigate and conduct individual meetings

### Pattern 4: Inactive Students (HIGH SEVERITY)
- **Affected Students**: 8 (29% of class - LOW performers)
- **Description**: No submissions in 3+ days, risking course failure
- **Action Required**: Send immediate email reminders, offer office hours

### Pattern 5: Rapid Progress (POSITIVE)
- **Affected Students**: 6 (21% of class - HIGH performers)
- **Description**: Completing modules ahead of schedule with scores >85%
- **Action**: Provide advanced challenges

---

## 📊 Weekly Performance Trends

### Week-by-Week Average Scores:

| Week | Average Score | Total Submissions |
|------|--------------|-------------------|
| Week 1 | 65% | 45 |
| Week 2 | 68% | 52 |
| Week 3 | 71% | 58 |
| Week 4 | 73% | 61 |
| Week 5 | 75% | 64 |
| Week 6 | 77% | 67 |
| Week 7 | 79% | 70 |
| Week 8 | 81% | 72 |

**Trend**: Steady improvement of +2% per week

---

## 🎯 OOP Mastery Breakdown

### Class Average by Concept:

| Concept | Percentage | Status |
|---------|-----------|--------|
| Classes & Objects | 85% | ✅ Strong |
| Encapsulation | 72% | ✅ Good |
| Inheritance | 68% | ⚠️ Needs Work |
| Polymorphism | 58% | 🚨 Critical |
| Abstraction | 62% | ⚠️ Needs Work |

---

## 🔍 Coding Behavior Patterns (7 Identified)

### HIGH Performance Patterns:
1. **Maria Santos** - Excellent Code Organization (45 occurrences)
2. **John Carlo Reyes** - Advanced OOP Principles (42 occurrences)

### MEDIUM Performance Patterns:
3. **Jerome Santos** - Inconsistent Encapsulation (12 occurrences)
4. **Rafael Jose Mendoza** - Overusing Inheritance (8 occurrences)

### LOW Performance Patterns:
5. **Robert James Navarro** - Frequent Syntax Errors (18 occurrences)
6. **Daniel Patrick Lopez** - Weak OOP Understanding (15 occurrences)
7. **Vincent Paul Morales** - Low Submission Frequency (9 submissions in 8 weeks)

---

## 📝 Sample Assignments (3 Active)

### Assignment 1: Library Management System
- **Module**: 2 (Classes and Objects)
- **Points**: 100
- **Due**: 7 days from now
- **Description**: Create Book class with encapsulation

### Assignment 2: Vehicle Inheritance
- **Module**: 4 (Inheritance)
- **Points**: 150
- **Due**: 14 days from now
- **Description**: Implement Vehicle, Car, Motorcycle hierarchy

### Assignment 3: Abstract Shapes
- **Module**: 6 (Abstraction)
- **Points**: 200
- **Due**: 21 days from now
- **Description**: Abstract Shape class with interfaces

---

## 💾 Data Storage Structure

### localStorage Keys:
- `all_students` - Array of 28 StudentData objects
- `sample_submissions` - Array of code submissions
- `assignments` - Array of 3 assignment objects
- `analytics_weekly` - Weekly performance data
- `analytics_oop` - OOP mastery breakdown
- `analytics_completion` - Completion distribution
- `analytics_scores` - Score distribution
- `progress_{studentId}` - Individual student progress
- `notifications_{studentId}` - Student notifications
- `sample_data_initialized` - Initialization flag

### Backend API Data:
All student data syncs to Supabase backend via 14 API endpoints for persistent storage and real-time analytics.

---

## 🎓 Academic Integrity Metrics

### Plagiarism Detection Results:
- **Total Submissions Analyzed**: 550+
- **Suspicious Patterns**: 5 students (18%)
- **Code Similarity Threshold**: 85%
- **False Positive Rate**: <5%
- **Detection Accuracy**: 95%

---

## 📧 Notification Distribution

### HIGH Students:
- Achievement notifications
- Encouragement messages
- Advanced challenge invitations

### MEDIUM Students:
- Progress reminders
- Assignment due dates
- Study resource recommendations

### LOW Students:
- Intervention alerts
- Performance warnings
- Urgent assistance offers
- Study resource requirements

---

## ✅ Data Completeness Checklist

- ✅ 28 Complete student profiles with realistic data
- ✅ 8 HIGH performance students (81-94%)
- ✅ 10 MEDIUM performance students (61-78%)
- ✅ 10 LOW performance students (32-58%)
- ✅ Sample code submissions for each level
- ✅ OOP scores for each submission
- ✅ 7 Behavioral patterns identified
- ✅ 5 Learning patterns with percentages
- ✅ 3 Active assignments
- ✅ 8 weeks of performance trends
- ✅ 5 OOP concept mastery scores
- ✅ Notification data per student
- ✅ Progress tracking per student
- ✅ Inactive student alerts (8 students)
- ✅ Plagiarism detection results

---

## 🚀 Initialization

Data is automatically initialized on app startup via:
```typescript
initializeSampleData()
```

Called in:
- `/src/app/App.tsx` (app startup)
- `/src/app/components/MonitoringView.tsx` (monitoring view)

All data persists in localStorage and syncs to Supabase backend.

---

**Last Updated**: March 13, 2026
**Total Data Points**: 1000+
**Status**: ✅ Complete and Production-Ready
