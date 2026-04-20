# 🚀 CodeLearn AI - Quick Start Guide

## Welcome to CodeLearn AI!

This guide will help you get started with the cloud-based pattern recognition system for learning Java OOP.

---

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [For Students](#for-students)
3. [For Instructors](#for-instructors)
4. [Common Tasks](#common-tasks)
5. [Troubleshooting](#troubleshooting)

---

## 🎯 Getting Started

### First Time Setup

1. **Open the Application**
   - Navigate to the CodeLearn AI platform
   - You'll see the login screen

2. **Create an Account**
   - Click "Create Account" button
   - Choose your role:
     - **Student** - For learning Java OOP
     - **Instructor** - For teaching and monitoring
   
3. **Fill in Your Information**
   ```
   Full Name: Your Name
   Email: your.email@example.com
   Student ID/Instructor ID: Your ID number
   Password: Create a secure password
   ```

4. **Login**
   - Use your email and password to login
   - You'll be redirected to your dashboard

---

## 👨‍🎓 For Students

### Your Dashboard

When you first login as a student, you'll see:

- **📊 Performance Overview**: Your overall progress
- **📚 Module Progress**: Completion status of all 10 modules
- **🎯 Recent Submissions**: Your latest code submissions
- **💡 AI Insights**: Personalized recommendations

### Starting Your First Lesson

1. **Click "Access Modules"** from your dashboard
2. **Select Module 1**: "Java OOP Fundamentals"
3. **Choose Lesson 1**: "Introduction to OOP"
4. **Read the Content**: Theory, examples, and explanations
5. **Try the Exercise**: Practice what you learned

### Writing and Submitting Code

1. **Click "Practice Coding"** from any lesson
2. **Monaco Editor** will open with starter code
3. **Write Your Java Code**:
   ```java
   public class Student {
       private String name;
       private int id;
       
       public Student(String name, int id) {
           this.name = name;
           this.id = id;
       }
       
       // Add getters and setters
   }
   ```
4. **Save Your Work**: Click "Save" button frequently
5. **Submit for Analysis**: Click "Submit for AI Analysis"
6. **Wait 2-3 seconds**: AI is analyzing your code
7. **View Results**: See your score and feedback

### Understanding Your Feedback

Your submission will receive:

- **Code Quality Score** (0-100)
  - 90-100: Excellent ⭐⭐⭐
  - 80-89: Good ⭐⭐
  - 60-79: Satisfactory ⭐
  - 0-59: Needs Improvement 📝

- **OOP Analysis**
  - Which principles you used correctly
  - What's missing
  - Suggestions for improvement

- **Error Detection**
  - Compilation errors
  - Logic errors
  - Best practice violations

### Tracking Your Progress

1. **Click "Performance Monitoring"** from dashboard
2. **View Your Stats**:
   - Modules completed
   - Average score
   - Time spent learning
   - Submission history

3. **Module Breakdown**:
   - See progress for each module
   - Identify strengths and weaknesses
   - Review past submissions

---

## 👨‍🏫 For Instructors

### Your Dashboard

As an instructor, you have access to:

- **📈 Analytics**: Class performance overview
- **👥 Student Monitoring**: Individual student tracking
- **📚 Course Management**: Create/edit modules and assignments
- **🔍 Pattern Recognition**: AI-detected learning patterns

### Monitoring Students

1. **Click "Monitoring & Evaluation"**
2. **View Student Categories**:
   - 🟢 **HIGH** (≥80%): Excellent performance
   - 🟡 **MEDIUM** (60-79%): Progressing adequately
   - 🔴 **LOW** (<60%): Needs immediate intervention

3. **Send Interventions**:
   - Click "Send Intervention" for struggling students
   - Message appears in their notifications
   - Track intervention effectiveness

### Creating Assignments

1. **Go to "Course Management"**
2. **Click "Create Activity"**
3. **Fill in Details**:
   ```
   Title: Create a Student Class
   Module: Module 2 - Classes and Objects
   Description: Create a Student class with encapsulation
   Points: 100
   Due Date: [Select date]
   Starter Code: [Optional]
   ```
4. **Click "Create Activity"**
5. **Students can now see and submit**

### Viewing Analytics

1. **Click "Access Student Performance"**
2. **Review Charts**:
   - Weekly Performance Trend
   - OOP Principles Mastery
   - Module Completion Status
   - Score Distribution

3. **Individual Student Analysis**:
   - Click on any student name
   - View their submission history
   - See detailed performance metrics
   - Analyze code patterns

### Identifying Learning Patterns

The AI automatically detects:

- **🔴 Difficulties**: Topics students struggle with
  - Example: "43% struggling with Polymorphism"
  
- **🟢 Strengths**: Areas of excellence
  - Example: "76% excel at Encapsulation"
  
- **🟠 Issues**: Plagiarism or concerning patterns
  - Example: "Code similarity detected between 5 students"

---

## 📖 Common Tasks

### How to View Module References

1. **From Dashboard**: Click "View References (IEEE)"
2. **Browse All References**: 43 academic sources
3. **Search**: Type keywords to find specific references
4. **Filter**: By type (Books, Research, Documentation, etc.)
5. **View Source**: Click "View Source" to access original material

### How to Update Your Profile

1. **Click your name** in the header
2. **Select "Settings"**
3. **Update Information**:
   - Name
   - Email
   - Student/Instructor ID
4. **Click "Save Changes"**

### How to Check Notifications

1. **Look for the bell icon** 🔔 in header
2. **Badge shows unread count**
3. **Click to view all notifications**
4. **Click notification to mark as read**

### How to Export Your Progress (Students)

1. **Go to "Performance Monitoring"**
2. **Click "Export Report"** (if available)
3. **Select format**: PDF or CSV
4. **Download your performance data**

### How to Create Course Announcements (Instructors)

1. **Go to "Course Management"**
2. **Click "Create Announcement"**
3. **Fill in**:
   ```
   Title: Midterm Exam Schedule
   Message: The midterm exam will be held on...
   ```
4. **Click "Create Announcement"**
5. **All students receive notification**

---

## ❓ Troubleshooting

### Login Issues

**Problem**: "Invalid credentials"
- **Solution**: Double-check email and password
- **Solution**: Click "Forgot Password" if needed
- **Solution**: Ensure you're using the correct role (Student/Instructor)

**Problem**: "Account not found"
- **Solution**: Create a new account first
- **Solution**: Verify you're using the registered email

### Code Editor Issues

**Problem**: Code won't save
- **Solution**: Click "Save" button explicitly
- **Solution**: Check internet connection
- **Solution**: Try refreshing the page (code auto-saves to localStorage)

**Problem**: Submission fails
- **Solution**: Ensure code compiles (check for errors)
- **Solution**: Wait for backend to respond (may take 3-5 seconds)
- **Solution**: If error persists, code is saved locally - try again later

### Performance Issues

**Problem**: Page loads slowly
- **Solution**: Clear browser cache
- **Solution**: Check internet connection
- **Solution**: Try a different browser (Chrome/Firefox recommended)

**Problem**: Charts not displaying
- **Solution**: Refresh the page
- **Solution**: Ensure JavaScript is enabled
- **Solution**: Update your browser to latest version

### Backend Connection Issues

**Problem**: "Could not save to server"
- **Solution**: Your work is saved locally automatically
- **Solution**: Check internet connection
- **Solution**: Try submitting again when connection is restored
- **Note**: All data syncs when connection is restored

---

## 💡 Tips for Success

### For Students

1. **🎯 Complete modules in order** - Build foundation first
2. **💾 Save frequently** - Don't lose your work
3. **📝 Read AI feedback carefully** - Learn from mistakes
4. **🔄 Resubmit improved code** - Practice makes perfect
5. **⏰ Track your time** - Monitor learning efficiency
6. **📚 Review references** - Deepen understanding
7. **❓ Ask for help** - Use intervention system if stuck

### For Instructors

1. **📊 Check analytics weekly** - Stay informed
2. **🎯 Identify struggling students early** - Intervene quickly
3. **📢 Use announcements** - Keep students informed
4. **🔍 Review learning patterns** - Adjust teaching methods
5. **✅ Provide timely feedback** - Respond to interventions
6. **📈 Track class trends** - Monitor overall progress
7. **🎓 Share best practices** - Help successful students mentor others

---

## 🎓 Module Roadmap

### Recommended Learning Path

```
Week 1-2:   Module 1 - Java OOP Fundamentals
Week 3-4:   Module 2 - Classes and Objects
Week 5-6:   Module 3 - Encapsulation
Week 7-8:   Module 4 - Inheritance
Week 9-10:  Module 5 - Polymorphism
Week 11-12: Module 6 - Abstraction
Week 13:    Module 7 - Constructors and Destructors
Week 14:    Module 8 - Static Members
Week 15:    Module 9 - Exception Handling
Week 16:    Module 10 - Advanced OOP Concepts
```

---

## 📞 Getting Help

### Student Support

- **Technical Issues**: Use "Report Bug" in settings
- **Academic Questions**: Contact your instructor
- **Account Problems**: Email support team
- **Feature Requests**: Submit via feedback form

### Instructor Support

- **Course Management**: Check instructor guide
- **Analytics Questions**: Review analytics documentation
- **Technical Support**: Contact IT department
- **System Issues**: Submit support ticket

---

## ✅ Quick Reference

### Keyboard Shortcuts (Code Editor)

- `Ctrl + S` / `Cmd + S`: Save code
- `Ctrl + Z` / `Cmd + Z`: Undo
- `Ctrl + Shift + F`: Format code
- `Ctrl + /`: Toggle comment
- `Tab`: Indent
- `Shift + Tab`: Un-indent

### Common Java Patterns

**Basic Class**:
```java
public class ClassName {
    private String field;
    
    public ClassName(String field) {
        this.field = field;
    }
    
    public String getField() {
        return field;
    }
    
    public void setField(String field) {
        this.field = field;
    }
}
```

**Inheritance**:
```java
public class Student extends Person {
    private String studentId;
    
    public Student(String name, String studentId) {
        super(name);
        this.studentId = studentId;
    }
}
```

**Interface**:
```java
public interface Drawable {
    void draw();
}

public class Circle implements Drawable {
    public void draw() {
        // Implementation
    }
}
```

---

## 🎉 You're Ready!

Congratulations! You now know how to use CodeLearn AI effectively.

**Next Steps**:
- ✅ Complete your profile
- ✅ Start Module 1
- ✅ Submit your first code
- ✅ Track your progress
- ✅ Achieve excellence!

**Happy Learning! 🚀**

---

*CodeLearn AI - Empowering the next generation of Java developers*
*University of Cabuyao - CCS108 Object-Oriented Programming with Java*
