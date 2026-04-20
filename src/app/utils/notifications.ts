// Notification Helper Functions

import { saveNotification, Notification, getAllNotifications } from './storage';

// Generate unique ID for notifications
const generateId = (): string => {
  return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Create notification for new module
export const createModuleNotification = (
  studentIds: string[],
  moduleTitle: string,
  moduleId: string,
  instructorName: string
): void => {
  studentIds.forEach(studentId => {
    const notification: Notification = {
      id: generateId(),
      userId: studentId,
      type: 'module',
      title: 'New Module Available',
      message: `${instructorName} has added a new module: "${moduleTitle}". Start learning now!`,
      timestamp: new Date().toISOString(),
      read: false,
      moduleId
    };
    saveNotification(notification);
  });
};

// Create notification for new activity/assignment
export const createActivityNotification = (
  studentIds: string[],
  activityTitle: string,
  moduleId: string,
  lessonId: string,
  instructorName: string,
  dueDate?: string
): void => {
  studentIds.forEach(studentId => {
    const dueDateText = dueDate ? ` Due: ${new Date(dueDate).toLocaleDateString()}` : '';
    const notification: Notification = {
      id: generateId(),
      userId: studentId,
      type: 'activity',
      title: 'New Activity Assigned',
      message: `${instructorName} has assigned: "${activityTitle}".${dueDateText}`,
      timestamp: new Date().toISOString(),
      read: false,
      moduleId,
      lessonId
    };
    saveNotification(notification);
  });
};

// Create announcement notification
export const createAnnouncementNotification = (
  studentIds: string[],
  title: string,
  message: string,
  instructorName: string
): void => {
  studentIds.forEach(studentId => {
    const notification: Notification = {
      id: generateId(),
      userId: studentId,
      type: 'announcement',
      title,
      message: `${instructorName}: ${message}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    saveNotification(notification);
  });
};

// Get all student IDs (helper function)
// In a real application, this would fetch from a database
export const getAllStudentIds = (): string[] => {
  // For demo purposes, return some mock student IDs
  // In production, this would query all enrolled students
  return ['student1', 'student2', 'student3'];
};

// Broadcast notification to all students in a course
export const broadcastToAllStudents = (
  title: string,
  message: string,
  type: 'module' | 'activity' | 'announcement',
  instructorName: string,
  moduleId?: string,
  lessonId?: string
): void => {
  const studentIds = getAllStudentIds();
  studentIds.forEach(studentId => {
    const notification: Notification = {
      id: generateId(),
      userId: studentId,
      type,
      title,
      message: `${instructorName}: ${message}`,
      timestamp: new Date().toISOString(),
      read: false,
      moduleId,
      lessonId
    };
    saveNotification(notification);
  });
};

// Create sample notifications for demo/initial setup
export const createSampleNotifications = (userId: string): void => {
  // Check if user already has notifications
  const existingNotifications = getAllNotifications(userId);
  if (existingNotifications.length > 0) {
    return; // Don't add sample notifications if user already has some
  }

  const instructorName = 'Dr. Sarah Martinez';
  const now = Date.now();

  // Sample notification 1: New Module - Inheritance
  const notif1: Notification = {
    id: generateId(),
    userId,
    type: 'module',
    title: 'New Module Available',
    message: `${instructorName} has added a new module: "Module 4: Inheritance". Start learning now!`,
    timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: false,
    moduleId: 'mod4',
    patternMetrics: {
      patternsDetected: 18,
      oopPrinciples: ['Inheritance', 'IS-A Relationship', 'Method Overriding', 'Super Keyword'],
      codeExamples: 25,
      difficulty: 'intermediate'
    },
    source: {
      type: 'instructor',
      instructor: 'Dr. Sarah Martinez',
      tags: ['OOP', 'Inheritance', 'Java', 'Extends', 'Polymorphism']
    }
  };

  // Sample notification 2: New Module - Polymorphism
  const notif2: Notification = {
    id: generateId(),
    userId,
    type: 'module',
    title: 'New Module Available',
    message: `${instructorName} has added a new module: "Module 5: Polymorphism". Start learning now!`,
    timestamp: new Date(now - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    read: false,
    moduleId: 'mod5',
    patternMetrics: {
      patternsDetected: 22,
      oopPrinciples: ['Method Overloading', 'Method Overriding', 'Runtime Polymorphism', 'Dynamic Binding'],
      codeExamples: 30,
      difficulty: 'intermediate'
    },
    source: {
      type: 'neural-network',
      instructor: 'Dr. Sarah Martinez',
      tags: ['OOP', 'Polymorphism', 'Dynamic Binding', 'Method Overloading']
    }
  };

  // Sample notification 3: New Activity Assignment
  const notif3: Notification = {
    id: generateId(),
    userId,
    type: 'activity',
    title: 'New Activity Assigned',
    message: `${instructorName} has assigned: "Implement Employee Management System". Due: ${new Date(now + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
    timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: false,
    moduleId: 'mod3',
    lessonId: 'lesson3',
    patternMetrics: {
      patternsDetected: 12,
      oopPrinciples: ['Encapsulation', 'Data Hiding', 'Getters/Setters', 'Access Modifiers'],
      codeExamples: 8,
      difficulty: 'intermediate'
    },
    source: {
      type: 'instructor',
      instructor: 'Dr. Sarah Martinez',
      tags: ['Encapsulation', 'Practice', 'Assignment', 'Real-World']
    }
  };

  // Sample notification 4: Coding Exercise
  const notif4: Notification = {
    id: generateId(),
    userId,
    type: 'activity',
    title: 'New Activity Assigned',
    message: `${instructorName} has assigned: "Inheritance Practice: Vehicle Hierarchy". Due: ${new Date(now + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
    timestamp: new Date(now - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    read: false,
    moduleId: 'mod4',
    lessonId: 'lesson1',
    patternMetrics: {
      patternsDetected: 15,
      oopPrinciples: ['Inheritance', 'Method Overriding', 'Super Constructor'],
      codeExamples: 10,
      difficulty: 'intermediate'
    },
    source: {
      type: 'ai-generated',
      instructor: 'Dr. Sarah Martinez',
      tags: ['Inheritance', 'Vehicle', 'Hierarchy', 'Practice']
    }
  };

  // Sample notification 5: New Module - Abstraction
  const notif5: Notification = {
    id: generateId(),
    userId,
    type: 'module',
    title: 'New Module Available',
    message: `${instructorName} has added a new module: "Module 6: Abstraction". Start learning now!`,
    timestamp: new Date(now - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    read: false,
    moduleId: 'mod6',
    patternMetrics: {
      patternsDetected: 16,
      oopPrinciples: ['Abstraction', 'Abstract Classes', 'Abstract Methods', 'Template Pattern'],
      codeExamples: 20,
      difficulty: 'intermediate'
    },
    source: {
      type: 'curriculum',
      instructor: 'Dr. Sarah Martinez',
      tags: ['OOP', 'Abstraction', 'Abstract Class', 'Design Patterns']
    }
  };

  // Sample notification 6: Course Announcement
  const notif6: Notification = {
    id: generateId(),
    userId,
    type: 'announcement',
    title: 'Important: Midterm Exam Schedule',
    message: `${instructorName}: The midterm exam will be held on March 15, 2026. Please review Modules 1-5 and complete all assigned activities.`,
    timestamp: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    read: false,
    source: {
      type: 'instructor',
      instructor: 'Dr. Sarah Martinez',
      tags: ['Exam', 'Midterm', 'Important']
    }
  };

  // Sample notification 7: New Activity - Interface Implementation
  const notif7: Notification = {
    id: generateId(),
    userId,
    type: 'activity',
    title: 'New Activity Assigned',
    message: `${instructorName} has assigned: "Design Pattern Exercise: Factory Pattern". Due: ${new Date(now + 10 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
    timestamp: new Date(now - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    read: false,
    moduleId: 'mod10',
    lessonId: 'lesson2',
    patternMetrics: {
      patternsDetected: 28,
      oopPrinciples: ['Factory Pattern', 'Abstraction', 'Polymorphism', 'Object Creation'],
      codeExamples: 15,
      difficulty: 'advanced'
    },
    source: {
      type: 'neural-network',
      instructor: 'Dr. Sarah Martinez',
      tags: ['Design Patterns', 'Factory', 'Advanced', 'Architecture']
    }
  };

  // Sample notification 8: Quiz Reminder
  const notif8: Notification = {
    id: generateId(),
    userId,
    type: 'announcement',
    title: 'Reminder: Weekly Quiz',
    message: `${instructorName}: Don't forget to complete this week's quiz on Encapsulation and Access Modifiers. Due tomorrow at 11:59 PM.`,
    timestamp: new Date(now - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    read: false,
    patternMetrics: {
      patternsDetected: 10,
      oopPrinciples: ['Encapsulation', 'Access Modifiers', 'Private', 'Public'],
      codeExamples: 12,
      difficulty: 'intermediate'
    },
    source: {
      type: 'instructor',
      instructor: 'Dr. Sarah Martinez',
      tags: ['Quiz', 'Assessment', 'Encapsulation']
    }
  };

  // Sample notification 9: New Module - Collections
  const notif9: Notification = {
    id: generateId(),
    userId,
    type: 'module',
    title: 'New Module Available',
    message: `${instructorName} has added a new module: "Module 9: Collections Framework". Start learning now!`,
    timestamp: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    read: true, // This one is read
    moduleId: 'mod9',
    patternMetrics: {
      patternsDetected: 35,
      oopPrinciples: ['Generics', 'Interfaces', 'Iterators', 'List', 'Set', 'Map'],
      codeExamples: 40,
      difficulty: 'advanced'
    },
    source: {
      type: 'curriculum',
      instructor: 'Dr. Sarah Martinez',
      tags: ['Collections', 'Data Structures', 'ArrayList', 'HashMap', 'Java']
    }
  };

  // Sample notification 10: Neural Network Analysis Complete
  const notif10: Notification = {
    id: generateId(),
    userId,
    type: 'announcement',
    title: 'AI Analysis: Code Pattern Recognition Complete',
    message: `${instructorName}: Neural network has analyzed your recent submissions. 23 patterns detected across Modules 1-3. View detailed feedback now!`,
    timestamp: new Date(now - 45 * 60 * 1000).toISOString(), // 45 minutes ago
    read: false,
    patternMetrics: {
      patternsDetected: 23,
      oopPrinciples: ['Classes', 'Objects', 'Methods', 'Encapsulation', 'Constructors'],
      codeExamples: 18,
      difficulty: 'beginner'
    },
    source: {
      type: 'neural-network',
      instructor: 'AI System',
      tags: ['AI Feedback', 'Pattern Recognition', 'Analysis']
    }
  };

  // Save all sample notifications
  [notif1, notif2, notif3, notif4, notif5, notif6, notif7, notif8, notif9, notif10].forEach(notif => {
    saveNotification(notif);
  });
};