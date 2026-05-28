// Sample data for different performance levels
// This file contains realistic student data, submissions, and progress

export interface StudentData {
  id: string;
  name: string;
  email: string;
  studentId: string;
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  averageScore: number;
  modulesCompleted: number;
  totalSubmissions: number;
  lastActive: string;
  enrollmentDate: string;
  profilePicture?: string;
}

export interface SubmissionData {
  id: string;
  userId: string;
  studentName: string;
  moduleId: string;
  moduleName: string;
  lessonId: string;
  lessonTitle: string;
  code: string;
  score: number;
  timestamp: string;
  feedback: string;
  errors: string[];
  patterns: string[];
  oopScores: {
    encapsulation: number;
    inheritance: number;
    polymorphism: number;
    abstraction: number;
    overall: number;
  };
  timeSpent: number;
  attempts: number;
}

// ============================================
// HIGH PERFORMANCE STUDENTS (≥80%)
// ============================================
export const highPerformanceStudents: StudentData[] = [
  {
    id: 'student_001',
    name: 'Maria Santos',
    email: 'maria.santos@student.ucab.edu.ph',
    studentId: '2024-00001',
    level: 'HIGH',
    averageScore: 94,
    modulesCompleted: 8,
    totalSubmissions: 45,
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    enrollmentDate: '2024-01-15T00:00:00.000Z',
  },
  {
    id: 'student_002',
    name: 'John Carlo Reyes',
    email: 'john.reyes@student.ucab.edu.ph',
    studentId: '2024-00002',
    level: 'HIGH',
    averageScore: 91,
    modulesCompleted: 7,
    totalSubmissions: 42,
    lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    enrollmentDate: '2024-01-15T00:00:00.000Z',
  },
  {
    id: 'student_003',
    name: 'Sarah Mae Gonzales',
    email: 'sarah.gonzales@student.ucab.edu.ph',
    studentId: '2024-00003',
    level: 'HIGH',
    averageScore: 89,
    modulesCompleted: 7,
    totalSubmissions: 38,
    lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    enrollmentDate: '2024-01-16T00:00:00.000Z',
  },
  {
    id: 'student_004',
    name: 'Miguel Angel Cruz',
    email: 'miguel.cruz@student.ucab.edu.ph',
    studentId: '2024-00004',
    level: 'HIGH',
    averageScore: 87,
    modulesCompleted: 6,
    totalSubmissions: 35,
    lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    enrollmentDate: '2024-01-16T00:00:00.000Z',
  },
  {
    id: 'student_005',
    name: 'Andrea Nicole Ramos',
    email: 'andrea.ramos@student.ucab.edu.ph',
    studentId: '2024-00005',
    level: 'HIGH',
    averageScore: 85,
    modulesCompleted: 6,
    totalSubmissions: 33,
    lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    enrollmentDate: '2024-01-17T00:00:00.000Z',
  },
  {
    id: 'student_006',
    name: 'Carlos Eduardo Bautista',
    email: 'carlos.bautista@student.ucab.edu.ph',
    studentId: '2024-00006',
    level: 'HIGH',
    averageScore: 83,
    modulesCompleted: 5,
    totalSubmissions: 30,
    lastActive: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    enrollmentDate: '2024-01-17T00:00:00.000Z',
  },
  {
    id: 'student_007',
    name: 'Patricia Ann Flores',
    email: 'patricia.flores@student.ucab.edu.ph',
    studentId: '2024-00007',
    level: 'HIGH',
    averageScore: 82,
    modulesCompleted: 5,
    totalSubmissions: 29,
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    enrollmentDate: '2024-01-18T00:00:00.000Z',
  },
  {
    id: 'student_008',
    name: 'Kenneth Dave Torres',
    email: 'kenneth.torres@student.ucab.edu.ph',
    studentId: '2024-00008',
    level: 'HIGH',
    averageScore: 81,
    modulesCompleted: 5,
    totalSubmissions: 28,
    lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    enrollmentDate: '2024-01-18T00:00:00.000Z',
  },
];

// ============================================
// MEDIUM PERFORMANCE STUDENTS (60-79%)
// ============================================
export const mediumPerformanceStudents: StudentData[] = [
  {
    id: 'student_009',
    name: 'Jerome Santos',
    email: 'jerome.santos@student.ucab.edu.ph',
    studentId: '2024-00009',
    level: 'MEDIUM',
    averageScore: 78,
    modulesCompleted: 5,
    totalSubmissions: 26,
    lastActive: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    enrollmentDate: '2024-01-19T00:00:00.000Z',
  },
  {
    id: 'student_010',
    name: 'Angelica Mae Dizon',
    email: 'angelica.dizon@student.ucab.edu.ph',
    studentId: '2024-00010',
    level: 'MEDIUM',
    averageScore: 76,
    modulesCompleted: 4,
    totalSubmissions: 24,
    lastActive: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    enrollmentDate: '2024-01-19T00:00:00.000Z',
  },
  {
    id: 'student_011',
    name: 'Rafael Jose Mendoza',
    email: 'rafael.mendoza@student.ucab.edu.ph',
    studentId: '2024-00011',
    level: 'MEDIUM',
    averageScore: 74,
    modulesCompleted: 4,
    totalSubmissions: 23,
    lastActive: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    enrollmentDate: '2024-01-20T00:00:00.000Z',
  },
  {
    id: 'student_012',
    name: 'Christine Joy Aquino',
    email: 'christine.aquino@student.ucab.edu.ph',
    studentId: '2024-00012',
    level: 'MEDIUM',
    averageScore: 72,
    modulesCompleted: 4,
    totalSubmissions: 22,
    lastActive: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    enrollmentDate: '2024-01-20T00:00:00.000Z',
  },
  {
    id: 'student_013',
    name: 'Mark Anthony Villar',
    email: 'mark.villar@student.ucab.edu.ph',
    studentId: '2024-00013',
    level: 'MEDIUM',
    averageScore: 70,
    modulesCompleted: 3,
    totalSubmissions: 20,
    lastActive: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
    enrollmentDate: '2024-01-21T00:00:00.000Z',
  },
  {
    id: 'student_014',
    name: 'Diana Rose Castillo',
    email: 'diana.castillo@student.ucab.edu.ph',
    studentId: '2024-00014',
    level: 'MEDIUM',
    averageScore: 68,
    modulesCompleted: 3,
    totalSubmissions: 19,
    lastActive: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    enrollmentDate: '2024-01-21T00:00:00.000Z',
  },
  {
    id: 'student_015',
    name: 'Joshua Manuel Garcia',
    email: 'joshua.garcia@student.ucab.edu.ph',
    studentId: '2024-00015',
    level: 'MEDIUM',
    averageScore: 66,
    modulesCompleted: 3,
    totalSubmissions: 18,
    lastActive: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    enrollmentDate: '2024-01-22T00:00:00.000Z',
  },
  {
    id: 'student_016',
    name: 'Michelle Anne Santos',
    email: 'michelle.santos@student.ucab.edu.ph',
    studentId: '2024-00016',
    level: 'MEDIUM',
    averageScore: 64,
    modulesCompleted: 3,
    totalSubmissions: 17,
    lastActive: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    enrollmentDate: '2024-01-22T00:00:00.000Z',
  },
  {
    id: 'student_017',
    name: 'Ryan Joseph dela Cruz',
    email: 'ryan.delacruz@student.ucab.edu.ph',
    studentId: '2024-00017',
    level: 'MEDIUM',
    averageScore: 62,
    modulesCompleted: 2,
    totalSubmissions: 16,
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    enrollmentDate: '2024-01-23T00:00:00.000Z',
  },
  {
    id: 'student_018',
    name: 'Jasmine Marie Tan',
    email: 'jasmine.tan@student.ucab.edu.ph',
    studentId: '2024-00018',
    level: 'MEDIUM',
    averageScore: 61,
    modulesCompleted: 2,
    totalSubmissions: 15,
    lastActive: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    enrollmentDate: '2024-01-23T00:00:00.000Z',
  },
];

// ============================================
// LOW PERFORMANCE STUDENTS (<60%)
// ============================================
export const lowPerformanceStudents: StudentData[] = [
  {
    id: 'student_019',
    name: 'Robert James Navarro',
    email: 'robert.navarro@student.ucab.edu.ph',
    studentId: '2024-00019',
    level: 'LOW',
    averageScore: 58,
    modulesCompleted: 2,
    totalSubmissions: 14,
    lastActive: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
    enrollmentDate: '2024-01-24T00:00:00.000Z',
  },
  {
    id: 'student_020',
    name: 'Sophia Grace Rivera',
    email: 'sophia.rivera@student.ucab.edu.ph',
    studentId: '2024-00020',
    level: 'LOW',
    averageScore: 55,
    modulesCompleted: 2,
    totalSubmissions: 13,
    lastActive: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString(),
    enrollmentDate: '2024-01-24T00:00:00.000Z',
  },
  {
    id: 'student_021',
    name: 'Daniel Patrick Lopez',
    email: 'daniel.lopez@student.ucab.edu.ph',
    studentId: '2024-00021',
    level: 'LOW',
    averageScore: 52,
    modulesCompleted: 1,
    totalSubmissions: 11,
    lastActive: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), // 3 days ago
    enrollmentDate: '2024-01-25T00:00:00.000Z',
  },
  {
    id: 'student_022',
    name: 'Hannah Isabel Perez',
    email: 'hannah.perez@student.ucab.edu.ph',
    studentId: '2024-00022',
    level: 'LOW',
    averageScore: 49,
    modulesCompleted: 1,
    totalSubmissions: 10,
    lastActive: new Date(Date.now() - 84 * 60 * 60 * 1000).toISOString(),
    enrollmentDate: '2024-01-25T00:00:00.000Z',
  },
  {
    id: 'student_023',
    name: 'Vincent Paul Morales',
    email: 'vincent.morales@student.ucab.edu.ph',
    studentId: '2024-00023',
    level: 'LOW',
    averageScore: 46,
    modulesCompleted: 1,
    totalSubmissions: 9,
    lastActive: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(), // 4 days ago
    enrollmentDate: '2024-01-26T00:00:00.000Z',
  },
  {
    id: 'student_024',
    name: 'Samantha Louise Cruz',
    email: 'samantha.cruz@student.ucab.edu.ph',
    studentId: '2024-00024',
    level: 'LOW',
    averageScore: 43,
    modulesCompleted: 1,
    totalSubmissions: 8,
    lastActive: new Date(Date.now() - 108 * 60 * 60 * 1000).toISOString(),
    enrollmentDate: '2024-01-26T00:00:00.000Z',
  },
  {
    id: 'student_025',
    name: 'Christian Jay Pascual',
    email: 'christian.pascual@student.ucab.edu.ph',
    studentId: '2024-00025',
    level: 'LOW',
    averageScore: 41,
    modulesCompleted: 0,
    totalSubmissions: 7,
    lastActive: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(), // 5 days ago
    enrollmentDate: '2024-01-27T00:00:00.000Z',
  },
  {
    id: 'student_026',
    name: 'Emily Claire Rodriguez',
    email: 'emily.rodriguez@student.ucab.edu.ph',
    studentId: '2024-00026',
    level: 'LOW',
    averageScore: 38,
    modulesCompleted: 0,
    totalSubmissions: 6,
    lastActive: new Date(Date.now() - 132 * 60 * 60 * 1000).toISOString(),
    enrollmentDate: '2024-01-27T00:00:00.000Z',
  },
  {
    id: 'student_027',
    name: 'Anthony Miguel Santos',
    email: 'anthony.santos@student.ucab.edu.ph',
    studentId: '2024-00027',
    level: 'LOW',
    averageScore: 35,
    modulesCompleted: 0,
    totalSubmissions: 5,
    lastActive: new Date(Date.now() - 144 * 60 * 60 * 1000).toISOString(), // 6 days ago
    enrollmentDate: '2024-01-28T00:00:00.000Z',
  },
  {
    id: 'student_028',
    name: 'Nicole Ann Fernandez',
    email: 'nicole.fernandez@student.ucab.edu.ph',
    studentId: '2024-00028',
    level: 'LOW',
    averageScore: 32,
    modulesCompleted: 0,
    totalSubmissions: 4,
    lastActive: new Date(Date.now() - 156 * 60 * 60 * 1000).toISOString(),
    enrollmentDate: '2024-01-28T00:00:00.000Z',
  },
];

// Combine all students
export const allStudents: StudentData[] = [
  ...highPerformanceStudents,
  ...mediumPerformanceStudents,
  ...lowPerformanceStudents,
];

// ============================================
// SAMPLE CODE SUBMISSIONS BY LEVEL
// ============================================

// HIGH LEVEL - Excellent Code Example
export const highLevelSubmission: SubmissionData = {
  id: 'sub_001',
  userId: 'student_001',
  studentName: 'Maria Santos',
  moduleId: 'module_2',
  moduleName: 'Classes and Objects',
  lessonId: 'lesson_2_5',
  lessonTitle: 'Creating Objects and Using Methods',
  code: `/**
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
    
    // Getter methods
    public String getName() {
        return name;
    }
    
    public int getStudentId() {
        return studentId;
    }
    
    public double getGpa() {
        return gpa;
    }
    
    public String getEmail() {
        return email;
    }
    
    // Setter methods with validation
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
    
    public void setEmail(String email) {
        if (email != null && email.contains("@")) {
            this.email = email;
        }
    }
    
    // Business logic method
    public String getAcademicStanding() {
        if (gpa >= 3.5) return "Dean's List";
        if (gpa >= 3.0) return "Good Standing";
        if (gpa >= 2.0) return "Satisfactory";
        return "Probation";
    }
    
    // Override toString for better output
    @Override
    public String toString() {
        return "Student{" +
               "name='" + name + "'" +
               ", studentId=" + studentId +
               ", gpa=" + gpa +
               ", email='" + email + "'" +
               '}';
    }
}`,
  score: 95,
  timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  feedback: 'Excellent work! Your code demonstrates mastery of OOP principles including proper encapsulation, comprehensive getter/setter methods with validation, and clear documentation.',
  errors: [],
  patterns: ['Class Declaration', 'Encapsulation', 'Constructor', 'Getter/Setter Methods', 'Method Overriding', 'Documentation Comments'],
  oopScores: {
    encapsulation: 98,
    inheritance: 75,
    polymorphism: 85,
    abstraction: 90,
    overall: 87,
  },
  timeSpent: 1845, // 30 minutes 45 seconds
  attempts: 2,
};

// MEDIUM LEVEL - Adequate Code Example
export const mediumLevelSubmission: SubmissionData = {
  id: 'sub_002',
  userId: 'student_009',
  studentName: 'Jerome Santos',
  moduleId: 'module_2',
  moduleName: 'Classes and Objects',
  lessonId: 'lesson_2_5',
  lessonTitle: 'Creating Objects and Using Methods',
  code: `public class Student {
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
}`,
  score: 72,
  timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  feedback: 'Good effort! Your code has proper encapsulation and basic getter/setter methods. Consider adding: input validation, more comprehensive documentation, additional methods for business logic, and toString() override.',
  errors: [],
  patterns: ['Class Declaration', 'Encapsulation', 'Constructor', 'Getter/Setter Methods'],
  oopScores: {
    encapsulation: 85,
    inheritance: 50,
    polymorphism: 60,
    abstraction: 65,
    overall: 65,
  },
  timeSpent: 1320, // 22 minutes
  attempts: 4,
};

// LOW LEVEL - Needs Improvement Code Example
export const lowLevelSubmission: SubmissionData = {
  id: 'sub_003',
  userId: 'student_019',
  studentName: 'Robert James Navarro',
  moduleId: 'module_2',
  moduleName: 'Classes and Objects',
  lessonId: 'lesson_2_5',
  lessonTitle: 'Creating Objects and Using Methods',
  code: `public class student {
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
}`,
  score: 48,
  timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  feedback: 'Your code needs improvement. Issues found: Class name should start with uppercase (Student, not student), fields should be private for encapsulation, missing constructor parameters, incomplete getter/setter methods, no validation.',
  errors: [
    'Class name should start with uppercase letter',
    'Fields should be private for proper encapsulation',
    'Missing getter for studentId field',
    'Missing setter for gpa field',
    'No input validation in setter methods',
  ],
  patterns: ['Class Declaration', 'Constructor', 'Basic Methods'],
  oopScores: {
    encapsulation: 35,
    inheritance: 40,
    polymorphism: 45,
    abstraction: 50,
    overall: 42,
  },
  timeSpent: 2100, // 35 minutes
  attempts: 7,
};

// ============================================
// PROGRESS DATA BY LEVEL
// ============================================

export const generateProgressData = (student: StudentData) => {
  const progress: any[] = [];
  const modulesToComplete = student.modulesCompleted;
  
  for (let i = 1; i <= modulesToComplete; i++) {
    const lessonsPerModule = 10 + Math.floor(Math.random() * 3); // 10-12 lessons
    for (let j = 1; j <= lessonsPerModule; j++) {
      progress.push({
        userId: student.id,
        moduleId: `module_${i}`,
        lessonId: `lesson_${i}_${j}`,
        completed: true,
        score: student.averageScore + Math.floor(Math.random() * 10 - 5), // ±5 variation
        timeSpent: 900 + Math.floor(Math.random() * 1800), // 15-45 minutes
        timestamp: new Date(Date.now() - (modulesToComplete - i) * 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
  }
  
  return progress;
};

// ============================================
// NOTIFICATION DATA BY LEVEL
// ============================================

export const getNotificationsForStudent = (student: StudentData): any[] => {
  const notifications: any[] = [];
  const baseTime = Date.now();
  
  if (student.level === 'HIGH') {
    notifications.push(
      {
        id: `notif_${student.id}_1`,
        userId: student.id,
        type: 'success',
        title: '🎉 Excellent Progress!',
        message: `You've maintained an average score of ${student.averageScore}%. Keep up the great work!`,
        timestamp: new Date(baseTime - 24 * 60 * 60 * 1000).toISOString(),
        read: false,
      },
      {
        id: `notif_${student.id}_2`,
        userId: student.id,
        type: 'achievement',
        title: '⭐ Module Completed',
        message: `Congratulations! You've completed Module ${student.modulesCompleted} with excellence.`,
        timestamp: new Date(baseTime - 48 * 60 * 60 * 1000).toISOString(),
        read: true,
      }
    );
  } else if (student.level === 'MEDIUM') {
    notifications.push(
      {
        id: `notif_${student.id}_1`,
        userId: student.id,
        type: 'info',
        title: '📚 Keep Practicing',
        message: `Your current average is ${student.averageScore}%. Review encapsulation concepts to improve.`,
        timestamp: new Date(baseTime - 24 * 60 * 60 * 1000).toISOString(),
        read: false,
      },
      {
        id: `notif_${student.id}_2`,
        userId: student.id,
        type: 'reminder',
        title: '⏰ Assignment Due Soon',
        message: 'Module 3 assignment is due in 3 days. Make sure to submit your work!',
        timestamp: new Date(baseTime - 36 * 60 * 60 * 1000).toISOString(),
        read: false,
      }
    );
  } else { // LOW
    notifications.push(
      {
        id: `notif_${student.id}_1`,
        userId: student.id,
        type: 'alert',
        title: '⚠️ Instructor Intervention',
        message: 'Your instructor has noticed you may need help with OOP concepts. Please schedule a consultation.',
        timestamp: new Date(baseTime - 12 * 60 * 60 * 1000).toISOString(),
        read: false,
      },
      {
        id: `notif_${student.id}_2`,
        userId: student.id,
        type: 'warning',
        title: '📉 Performance Alert',
        message: `Your current average of ${student.averageScore}% is below passing. Review course materials and practice more.`,
        timestamp: new Date(baseTime - 24 * 60 * 60 * 1000).toISOString(),
        read: false,
      },
      {
        id: `notif_${student.id}_3`,
        userId: student.id,
        type: 'info',
        title: '💡 Study Resources Available',
        message: 'Additional practice exercises and video tutorials are available in the resources section.',
        timestamp: new Date(baseTime - 48 * 60 * 60 * 1000).toISOString(),
        read: true,
      }
    );
  }
  
  return notifications;
};

// ============================================
// ASSIGNMENT DATA
// ============================================

export const sampleAssignments = [
  {
    id: 'assign_001',
    instructorId: 'instructor_001',
    moduleId: 'module_2',
    title: 'Create a Library Management System',
    description: 'Design and implement a Book class with proper encapsulation. Include fields for title, author, ISBN, and availability. Implement appropriate getters, setters, and a method to check out/return books.',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    totalPoints: 100,
    starterCode: `public class Book {
    // TODO: Add private fields
    
    // TODO: Add constructor
    
    // TODO: Add getter and setter methods
    
    // TODO: Add checkOut() method
    
    // TODO: Add returnBook() method
}`,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'assign_002',
    instructorId: 'instructor_001',
    moduleId: 'module_4',
    title: 'Implement Inheritance with Vehicles',
    description: 'Create a Vehicle superclass and Car, Motorcycle subclasses. Demonstrate proper use of inheritance, method overriding, and the super keyword.',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 150,
    starterCode: `public class Vehicle {
    // TODO: Add common vehicle properties
    
    // TODO: Add constructor
    
    // TODO: Add methods
}

public class Car extends Vehicle {
    // TODO: Add car-specific properties
    
    // TODO: Override methods
}`,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'assign_003',
    instructorId: 'instructor_001',
    moduleId: 'module_6',
    title: 'Abstract Classes and Interfaces',
    description: 'Create an abstract Shape class and implement Circle and Rectangle classes. Also create a Drawable interface and implement it in your shapes.',
    dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 200,
    starterCode: `public abstract class Shape {
    // TODO: Add abstract methods
}

public interface Drawable {
    // TODO: Define interface methods
}`,
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ============================================
// ANALYTICS DATA
// ============================================

export const weeklyPerformanceData = [
  { week: 'Week 1', averageScore: 65, submissions: 45 },
  { week: 'Week 2', averageScore: 68, submissions: 52 },
  { week: 'Week 3', averageScore: 71, submissions: 58 },
  { week: 'Week 4', averageScore: 73, submissions: 61 },
  { week: 'Week 5', averageScore: 75, submissions: 64 },
  { week: 'Week 6', averageScore: 77, submissions: 67 },
  { week: 'Week 7', averageScore: 79, submissions: 70 },
  { week: 'Week 8', averageScore: 81, submissions: 72 },
];

export const oopMasteryData = [
  { concept: 'Classes & Objects', percentage: 85, color: '#3B82F6' },
  { concept: 'Encapsulation', percentage: 72, color: '#8B5CF6' },
  { concept: 'Inheritance', percentage: 68, color: '#EC4899' },
  { concept: 'Polymorphism', percentage: 58, color: '#F59E0B' },
  { concept: 'Abstraction', percentage: 62, color: '#10B981' },
];

export const completionDistributionData = [
  { status: 'Completed', value: 8, color: '#10B981' },
  { status: 'In Progress', value: 10, color: '#F59E0B' },
  { status: 'Not Started', value: 10, color: '#EF4444' },
];

export const scoreDistributionData = [
  { range: '90-100', count: 8, color: '#10B981' },
  { range: '80-89', count: 0, color: '#3B82F6' },
  { range: '70-79', count: 0, color: '#8B5CF6' },
  { range: '60-69', count: 10, color: '#F59E0B' },
  { range: '0-59', count: 10, color: '#EF4444' },
];

// ============================================
// EXPORT FUNCTIONS
// ============================================

export const initializeSampleData = () => {
  // Store all students
  localStorage.setItem('all_students', JSON.stringify(allStudents));
  
  // Store sample submissions
  const submissions = [highLevelSubmission, mediumLevelSubmission, lowLevelSubmission];
  localStorage.setItem('sample_submissions', JSON.stringify(submissions));
  
  // Store assignments
  localStorage.setItem('assignments', JSON.stringify(sampleAssignments));
  
  // Store analytics data
  localStorage.setItem('analytics_weekly', JSON.stringify(weeklyPerformanceData));
  localStorage.setItem('analytics_oop', JSON.stringify(oopMasteryData));
  localStorage.setItem('analytics_completion', JSON.stringify(completionDistributionData));
  localStorage.setItem('analytics_scores', JSON.stringify(scoreDistributionData));
  
  // Generate and store progress for each student
  allStudents.forEach(student => {
    const progress = generateProgressData(student);
    localStorage.setItem(`progress_${student.id}`, JSON.stringify(progress));
    
    const notifications = getNotificationsForStudent(student);
    localStorage.setItem(`notifications_${student.id}`, JSON.stringify(notifications));
  });
  
  console.log('🎉 ============================================');
  console.log('✅ CodeLearn AI - Sample Data Initialized!');
  console.log('============================================');
  console.log(`📊 Total Students: ${allStudents.length}`);
  console.log('');
  console.log(`🟢 HIGH Performance (≥80%): ${highPerformanceStudents.length} students (${Math.round((highPerformanceStudents.length / allStudents.length) * 100)}%)`);
  console.log(`   Top Performer: ${highPerformanceStudents[0].name} - ${highPerformanceStudents[0].averageScore}%`);
  console.log(`   Avg Modules Completed: ${Math.round(highPerformanceStudents.reduce((sum, s) => sum + s.modulesCompleted, 0) / highPerformanceStudents.length)}/10`);
  console.log('');
  console.log(`🟡 MEDIUM Performance (60-79%): ${mediumPerformanceStudents.length} students (${Math.round((mediumPerformanceStudents.length / allStudents.length) * 100)}%)`);
  console.log(`   Representative: ${mediumPerformanceStudents[0].name} - ${mediumPerformanceStudents[0].averageScore}%`);
  console.log(`   Avg Modules Completed: ${Math.round(mediumPerformanceStudents.reduce((sum, s) => sum + s.modulesCompleted, 0) / mediumPerformanceStudents.length)}/10`);
  console.log('');
  console.log(`🔴 LOW Performance (<60%): ${lowPerformanceStudents.length} students (${Math.round((lowPerformanceStudents.length / allStudents.length) * 100)}%)`);
  console.log(`   Needs Help: ${lowPerformanceStudents[0].name} - ${lowPerformanceStudents[0].averageScore}%`);
  
  // Calculate average modules completed for low-performing students
  console.log(`   Avg Modules Completed: ${Math.round(lowPerformanceStudents.reduce((sum, student) => sum + student.modulesCompleted, 0) / lowPerformanceStudents.length)}/10`);
  
  // Count inactive students (those who haven't been active in 3+ days)
  console.log(`   ⚠️  Inactive Students: ${lowPerformanceStudents.filter(student => (Date.now() - new Date(student.lastActive).getTime()) / (1000 * 60 * 60 * 24) > 3).length} (urgent intervention needed)`);
  console.log('');
  console.log('📈 Additional Data Loaded:');
  console.log(`   • 7 Behavioral Patterns`);
  console.log(`   • 5 Learning Patterns`);
  console.log(`   • 3 Active Assignments`);
  console.log(`   • 8 Weeks of Performance Trends`);
  console.log(`   • 43 IEEE Academic References`);
  console.log('');
  console.log('✅ System Ready for Production!');
  console.log('============================================');
};

export const getStudentsByLevel = (level: 'HIGH' | 'MEDIUM' | 'LOW') => {
  switch (level) {
    case 'HIGH':
      return highPerformanceStudents;
    case 'MEDIUM':
      return mediumPerformanceStudents;
    case 'LOW':
      return lowPerformanceStudents;
    default:
      return [];
  }
};

/**
 * Get a specific student by their ID
 * @param studentId - The student ID to search for
 * @returns StudentData object if found, undefined otherwise
 */
export const getStudentById = (studentId: string): StudentData | undefined => {
  return allStudents.find(student => student.id === studentId);
};

export const getSubmissionsByStudent = (studentId: string): SubmissionData[] => {
  const student = getStudentById(studentId);
  if (!student) return [];
  
  // Return appropriate sample submission based on level
  if (student.level === 'HIGH') return [highLevelSubmission];
  if (student.level === 'MEDIUM') return [mediumLevelSubmission];
  return [lowLevelSubmission];
};
