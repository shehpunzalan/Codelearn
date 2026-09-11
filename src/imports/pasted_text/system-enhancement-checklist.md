# System Revision and Enhancement Checklist

## I. General System

### 1. Automatic Logout During Quiz

* The system should **automatically log out the student** if the student:

  * Opens another application/window while taking a quiz.
  * Uses **Alt + Tab** while the quiz is in progress.
* The logout behavior should apply specifically while the student is **taking a quiz and/or using the code editor**, depending on the activity configuration.
* The system should properly record the event for monitoring purposes.

### 2. Student Registration Synchronization

* A student registered on **PC1** must immediately be reflected on the **Instructor Dashboard on PC2**.
* Ensure that student registration data is synchronized across devices/sessions.
* The instructor dashboard should refresh or retrieve the latest student data without requiring manual re-registration.

---

# II. Student Dashboard

## 3. System Quizzes – Question Difficulty and Quality

**Priority: NEEDED FOR TOMORROW**

Review and improve the quiz questions according to the selected category/difficulty.

### Hard Category

* If the category is **Hard**, the questions should genuinely require higher-level thinking.
* Avoid questions that can be answered through simple recall.

### Code-Based Questions

Include more questions that require students to:

* **Create** a solution.
* **Analyze** a given code.
* Trace the execution/output of a program.
* Identify what a code snippet will produce.
* Determine the cause of an error.
* Select or construct the appropriate solution based on a programming scenario.

Examples of question formats:

* **Code snippet + output tracing**
* **Debugging**
* **Code analysis**
* **Predict the output**
* **Determine the best implementation**
* **Complete/modify a code segment**

### Avoid Obvious Correct Answers

* Review the choices of every multiple-choice question.
* Avoid making the correct answer obvious simply because it is:

  * The longest answer.
  * The most detailed answer.
  * The only grammatically complete answer.
* Make the choices approximately similar in length and structure whenever possible.
* All distractors should be plausible and relevant to the question.

**Goal:** Students should need to understand the concept to identify the correct answer rather than relying on test-taking patterns.

---

## 4. Code Editor – Error Detection and Classification

Improve the code editor's error detection engine.

The system should be able to:

* Detect errors in submitted code.
* Identify the **type/category of error**.
* Provide meaningful information about the detected error.

Possible classifications include:

* Syntax error
* Logic error
* Runtime error
* Compilation error
* Incorrect output
* Missing/incorrect implementation
* Other relevant programming-specific errors

The system should provide useful feedback instead of simply indicating that the code is incorrect.

---

## 5. Code Editor – Intelligent Hint System

Add a **Hint Box** to the code editor.

### Hint Behavior

* The hint box should initially be hidden/inactive.
* It should **light up or become available once the student meets a predefined condition**.
* The hint should be based on the **specific machine problem/coding exercise** assigned to the student.

### Hint and Grading Integration

The hint system should also contribute to evaluating the student's submitted output.

The system should consider:

1. Whether the student successfully completed the required task.
2. Whether the submitted code contains detected errors.
3. Whether the student required/triggered the available hint.
4. The quality/correctness of the final output.

The hint system should therefore be connected to the **grading/evaluation logic** of the coding exercise.

---

## 6. Notifications

Improve the notification system on the Student Dashboard.

### When a Notification Is Clicked

The student should be redirected directly to the corresponding activity.

Examples:

* Instructor-assigned activity → redirect to the assigned activity.
* Recommended lesson → redirect to the specific lesson that the student needs to review.
* Remedial activity → redirect directly to the remedial coding activity.

### Notification Bell

* Remove irrelevant/old notification items from the notification bell.
* Only display **active and relevant notifications** that require student action or provide useful information.

---

# III. Instructor Dashboard

## 7. Needs Attention → Send Intervention → Remedial Activity

Improve the intervention workflow.

### Instructor Intervention

When an instructor identifies a student who needs intervention:

**Needs Attention → Send Intervention → Remedial Activity**

The instructor should be able to assign a remedial activity to the selected student.

### Coding Exercise Instruction

* The instructor's assigned activity/instructions should appear directly inside the **Code Editor**.
* The coding exercise should clearly display the instructor-provided instructions/problem statement.

### Quiz Unlock Condition

The student's remedial activity should be connected to the locked quiz.

The workflow should be:

**Instructor sends intervention**
↓
**Student receives remedial coding activity**
↓
**Student completes and submits code**
↓
**System evaluates the submitted code**
↓
**Student must obtain a grade of 80 or higher**
↓
**Locked quiz becomes available/unlocked**

If the student receives **below 80**, the quiz should remain locked.

---

## 8. Courses → Access Modules

Change the existing **"Create Module"** function to **"View Module."**

### Instructor Access

Instructors should be able to:

* View all course modules.
* View the lessons/content inside each module.
* Navigate through the module contents.
* Review the instructional materials available in the course.

The purpose is to allow instructors to **view existing course content**, rather than presenting module creation as the primary function.

---

## 9. Courses → Manage Activities

Change **"Manage Activities"** to **"View Activity."**

The instructor should be able to view:

* Activities assigned to students.
* Remedial activities.
* Which student received the remedial activity.
* Which intervention the remedial activity came from.
* The student's submitted output/code.
* The student's grade after submitting the remedial activity.

### Required Information

The activity view should clearly show the relationship:

**Student → Intervention → Remedial Activity → Submitted Code → Grade**

This will allow instructors to monitor whether the intervention was completed successfully.

---

## 10. Monitoring

* **Remove the "Adjust" button** from the Monitoring section.
* Monitoring should focus on displaying the student's current status/performance without allowing instructors to adjust the monitored data through that button.

---

# Priority for Tomorrow

### 🔴 HIGH PRIORITY – Must be checked tomorrow

1. **System Quiz Questions**

   * Hard questions must actually be difficult.
   * Add creating/analyzing/code-tracing questions.
   * Improve code-based questions.
   * Make answer choices less predictable.
   * Avoid the longest-answer-is-correct pattern.

2. **Code Editor Error Detection**

   * Detect errors.
   * Classify errors.
   * Provide meaningful feedback.

3. **Code Editor Hint System**

   * Condition-based hint activation.
   * Machine-problem-specific hints.
   * Connect hints/error detection with grading.

4. **Remedial Activity → Quiz Unlock**

   * Instructor intervention.
   * Coding exercise in Code Editor.
   * Grade submission.
   * **80+ = unlock quiz.**

### 🟡 SECONDARY SYSTEM FIXES

5. Automatic logout on Alt + Tab/window switching.
6. PC1 student registration synchronization with PC2 Instructor Dashboard.
7. Notification redirection and cleanup.
8. Courses → View Module.
9. Courses → View Activity.
10. Monitoring → Remove Adjust button.
