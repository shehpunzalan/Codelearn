import { Module } from '../types';
import { module1Lessons, module2Lessons, module3Lessons, module4Lessons, module5Lessons } from './lessonsData';
import { enhanceLesson } from './lessonsDataComplete';

export const mockModules: Module[] = [
  {
    id: 'mod1',
    title: 'Java Fundamentals',
    description: 'Master the basics of Java including syntax, variables, operators, control flow, and loops.',
    difficulty: 'beginner',
    progress: 0,
    totalLessons: 5,
    completedLessons: 0,
    lessons: module1Lessons.map(enhanceLesson),
    estimatedTime: '2 hours',
    source: {
      type: 'curriculum',
      instructor: 'Dr. Sarah Martinez',
      tags: ['Java', 'Fundamentals', 'Syntax', 'Variables', 'Control Flow']
    },
    patternMetrics: {
      patternsDetected: 8,
      oopPrinciples: ['Basic Syntax', 'Variables', 'Control Structures'],
      codeExamples: 15
    },
    references: [
      {
        title: 'Java: The Complete Reference',
        author: 'Herbert Schildt',
        type: 'book',
        year: 2021,
        description: 'Comprehensive guide to Java programming fundamentals and syntax',
        url: 'https://www.oreilly.com/library/view/java-the-complete/9781260463422/'
      },
      {
        title: 'Oracle Java Tutorials - Language Basics',
        author: 'Oracle Corporation',
        type: 'documentation',
        url: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/',
        description: 'Official Java documentation covering variables, operators, and control flow'
      },
      {
        title: 'University of Cabuyao CCS108 Course Syllabus',
        author: 'Department of Computer Science',
        type: 'article',
        year: 2026,
        description: 'Official curriculum for Object-Oriented Programming with Java',
        url: 'https://www.ucab.edu.ph/academics/programs/computer-science'
      },
      {
        title: 'Head First Java',
        author: 'Kathy Sierra & Bert Bates',
        type: 'book',
        year: 2022,
        description: 'Beginner-friendly introduction to Java fundamentals',
        url: 'https://www.oreilly.com/library/view/head-first-java/9781492091646/'
      }
    ]
  },
  {
    id: 'mod2',
    title: 'Classes and Objects',
    description: 'Learn object-oriented programming fundamentals including creating classes, objects, constructors, and using the "this" keyword.',
    difficulty: 'beginner',
    progress: 0,
    totalLessons: 5,
    completedLessons: 0,
    lessons: module2Lessons.map(enhanceLesson),
    estimatedTime: '2.5 hours',
    source: {
      type: 'instructor',
      instructor: 'Dr. Sarah Martinez',
      tags: ['OOP', 'Classes', 'Objects', 'Constructors', 'This Keyword']
    },
    patternMetrics: {
      patternsDetected: 12,
      oopPrinciples: ['Classes', 'Objects', 'Constructors', 'Instance Variables'],
      codeExamples: 20
    },
    references: [
      {
        title: 'Effective Java',
        author: 'Joshua Bloch',
        type: 'book',
        year: 2018,
        description: 'Best practices for creating and using classes in Java',
        url: 'https://www.oreilly.com/library/view/effective-java/9780134686097/'
      },
      {
        title: 'Oracle Java Tutorials - Classes and Objects',
        author: 'Oracle Corporation',
        type: 'documentation',
        url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/',
        description: 'Official guide to object-oriented programming in Java'
      },
      {
        title: 'Dr. Sarah Martinez Lecture Notes - OOP Fundamentals',
        author: 'Dr. Sarah Martinez',
        type: 'article',
        year: 2026,
        description: 'Instructor-developed materials for CCS108 classes and objects'
      },
      {
        title: 'Java OOP Concepts - W3Schools',
        author: 'W3Schools',
        type: 'website',
        url: 'https://www.w3schools.com/java/java_oop.asp',
        description: 'Interactive tutorials on Java classes and objects'
      }
    ]
  },
  {
    id: 'mod3',
    title: 'Encapsulation',
    description: 'Understand encapsulation, access modifiers, getters/setters, and data security in object-oriented design.',
    difficulty: 'intermediate',
    progress: 0,
    totalLessons: 4,
    completedLessons: 0,
    lessons: module3Lessons,
    estimatedTime: '1.5 hours',
    source: {
      type: 'instructor',
      instructor: 'Dr. Sarah Martinez',
      tags: ['Encapsulation', 'Access Modifiers', 'Getters', 'Setters', 'Data Hiding']
    },
    patternMetrics: {
      patternsDetected: 10,
      oopPrinciples: ['Encapsulation', 'Private', 'Public', 'Protected', 'Getters/Setters'],
      codeExamples: 18
    },
    references: [
      {
        title: 'Object-Oriented Analysis and Design',
        author: 'Grady Booch',
        type: 'book',
        year: 2007,
        description: 'Comprehensive coverage of encapsulation and information hiding'
      },
      {
        title: 'Java Encapsulation Best Practices',
        author: 'Dr. Sarah Martinez',
        type: 'article',
        year: 2026,
        description: 'Instructor guide on proper encapsulation techniques'
      },
      {
        title: 'JavaBeans Specification',
        author: 'Oracle Corporation',
        type: 'documentation',
        url: 'https://www.oracle.com/java/technologies/javase/javabeans-spec.html',
        description: 'Standard conventions for getters and setters'
      },
      {
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        type: 'book',
        year: 2008,
        description: 'Best practices for writing maintainable encapsulated code'
      }
    ]
  },
  {
    id: 'mod4',
    title: 'Inheritance',
    description: 'Explore inheritance, the "extends" keyword, method overriding, super keyword, and IS-A relationships.',
    difficulty: 'intermediate',
    progress: 0,
    totalLessons: 5,
    completedLessons: 0,
    lessons: module4Lessons,
    estimatedTime: '2 hours',
    source: {
      type: 'neural-network',
      instructor: 'Dr. Sarah Martinez',
      tags: ['Inheritance', 'Extends', 'Super', 'Method Overriding', 'IS-A']
    },
    patternMetrics: {
      patternsDetected: 18,
      oopPrinciples: ['Inheritance', 'Method Overriding', 'Super Keyword', 'IS-A Relationship'],
      codeExamples: 25
    },
    references: [
      {
        title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
        author: 'Gang of Four (Gamma, Helm, Johnson, Vlissides)',
        type: 'book',
        year: 1994,
        description: 'Classic book on inheritance hierarchies and design patterns'
      },
      {
        title: 'Java Inheritance Research: Pattern Recognition in Educational Code',
        author: 'AI Neural Network Team',
        type: 'research',
        year: 2026,
        description: 'AI-generated analysis of inheritance patterns in student code'
      },
      {
        title: 'Oracle Java Documentation - Inheritance',
        author: 'Oracle Corporation',
        type: 'documentation',
        url: 'https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html',
        description: 'Official guide to inheritance in Java'
      },
      {
        title: 'Thinking in Java',
        author: 'Bruce Eckel',
        type: 'book',
        year: 2006,
        description: 'Deep dive into inheritance and class hierarchies'
      }
    ]
  },
  {
    id: 'mod5',
    title: 'Polymorphism',
    description: 'Master polymorphism through method overloading, method overriding, runtime polymorphism, and dynamic binding.',
    difficulty: 'intermediate',
    progress: 0,
    totalLessons: 4,
    completedLessons: 0,
    lessons: module5Lessons,
    estimatedTime: '2 hours',
    source: {
      type: 'neural-network',
      instructor: 'Dr. Sarah Martinez',
      tags: ['Polymorphism', 'Method Overloading', 'Dynamic Binding', 'Runtime Polymorphism']
    },
    patternMetrics: {
      patternsDetected: 22,
      oopPrinciples: ['Method Overloading', 'Method Overriding', 'Runtime Polymorphism', 'Dynamic Binding'],
      codeExamples: 30
    },
    references: [
      {
        title: 'Object-Oriented Software Construction',
        author: 'Bertrand Meyer',
        type: 'book',
        year: 1997,
        description: 'Authoritative text on polymorphism and dynamic binding'
      },
      {
        title: 'Neural Network Analysis of Polymorphic Patterns',
        author: 'CodeLearn AI Research Team',
        type: 'research',
        year: 2026,
        description: 'AI-powered detection of polymorphism in Java code'
      },
      {
        title: 'Java Virtual Machine Specification - Dynamic Method Invocation',
        author: 'Oracle Corporation',
        type: 'documentation',
        url: 'https://docs.oracle.com/javase/specs/jvms/se17/html/',
        description: 'Technical specification for runtime polymorphism in JVM'
      },
      {
        title: 'Core Java Volume I - Fundamentals',
        author: 'Cay S. Horstmann',
        type: 'book',
        year: 2022,
        description: 'Comprehensive coverage of polymorphism in Java'
      }
    ]
  },
  {
    id: 'mod6',
    title: 'Abstraction',
    description: 'Learn abstraction using abstract classes, abstract methods, and understanding when to use abstraction.',
    difficulty: 'intermediate',
    progress: 0,
    totalLessons: 4,
    completedLessons: 0,
    lessons: [],
    estimatedTime: '1.5 hours',
    source: {
      type: 'curriculum',
      instructor: 'Dr. Sarah Martinez',
      tags: ['Abstraction', 'Abstract Classes', 'Abstract Methods', 'Design Patterns']
    },
    patternMetrics: {
      patternsDetected: 16,
      oopPrinciples: ['Abstraction', 'Abstract Classes', 'Abstract Methods', 'Template Pattern'],
      codeExamples: 20
    },
    references: [
      {
        title: 'Abstract Classes and Methods in Java',
        author: 'Oracle Corporation',
        type: 'documentation',
        url: 'https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html',
        description: 'Official Java documentation on abstraction'
      },
      {
        title: 'University of Cabuyao - Advanced OOP Concepts',
        author: 'Department of Computer Science',
        type: 'article',
        year: 2026,
        description: 'Curriculum-based abstraction materials'
      },
      {
        title: 'Head First Design Patterns',
        author: 'Eric Freeman & Elisabeth Robson',
        type: 'book',
        year: 2020,
        description: 'Practical guide to abstraction and design patterns'
      },
      {
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt & David Thomas',
        type: 'book',
        year: 2019,
        description: 'Best practices for abstraction in software development'
      }
    ]
  },
  {
    id: 'mod7',
    title: 'Interfaces',
    description: 'Understand interfaces, multiple inheritance, default methods, and interface-based design.',
    difficulty: 'intermediate',
    progress: 0,
    totalLessons: 4,
    completedLessons: 0,
    lessons: [],
    estimatedTime: '2 hours',
    source: {
      type: 'ai-generated',
      instructor: 'Dr. Sarah Martinez',
      tags: ['Interfaces', 'Multiple Inheritance', 'Default Methods', 'Contract']
    },
    patternMetrics: {
      patternsDetected: 14,
      oopPrinciples: ['Interfaces', 'Multiple Inheritance', 'Implementation', 'Contract'],
      codeExamples: 22
    },
    references: [
      {
        title: 'Java Interfaces and Abstract Classes',
        author: 'Oracle Corporation',
        type: 'documentation',
        url: 'https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html',
        description: 'Official guide to Java interfaces'
      },
      {
        title: 'GPT-4 Enhanced Java Interface Patterns',
        author: 'OpenAI & CodeLearn AI',
        type: 'research',
        year: 2026,
        description: 'AI-generated best practices for interface design'
      },
      {
        title: 'Java 8 in Action',
        author: 'Raoul-Gabriel Urma, Mario Fusco, Alan Mycroft',
        type: 'book',
        year: 2014,
        description: 'Modern interface features including default methods'
      },
      {
        title: 'Interface-Based Programming Principles',
        author: 'Martin Fowler',
        type: 'article',
        url: 'https://martinfowler.com/',
        description: 'Expert guidance on interface-driven design'
      }
    ]
  },
  {
    id: 'mod8',
    title: 'Exception Handling',
    description: 'Handle errors gracefully using try-catch blocks, throw/throws keywords, and custom exceptions.',
    difficulty: 'intermediate',
    progress: 0,
    totalLessons: 5,
    completedLessons: 0,
    lessons: [],
    estimatedTime: '2 hours',
    source: {
      type: 'instructor',
      instructor: 'Dr. Sarah Martinez',
      tags: ['Exceptions', 'Try-Catch', 'Error Handling', 'Custom Exceptions']
    },
    patternMetrics: {
      patternsDetected: 11,
      oopPrinciples: ['Exception Handling', 'Try-Catch', 'Finally', 'Custom Exceptions'],
      codeExamples: 17
    },
    references: [
      {
        title: 'Java Exception Handling Best Practices',
        author: 'Dr. Sarah Martinez',
        type: 'article',
        year: 2026,
        description: 'Instructor-developed exception handling guidelines'
      },
      {
        title: 'Effective Java - Exception Handling',
        author: 'Joshua Bloch',
        type: 'book',
        year: 2018,
        description: 'Chapter on proper exception handling techniques'
      },
      {
        title: 'Oracle Java Tutorials - Exceptions',
        author: 'Oracle Corporation',
        type: 'documentation',
        url: 'https://docs.oracle.com/javase/tutorial/essential/exceptions/',
        description: 'Comprehensive guide to Java exception handling'
      },
      {
        title: 'Java Concurrency in Practice',
        author: 'Brian Goetz',
        type: 'book',
        year: 2006,
        description: 'Advanced exception handling in concurrent programs'
      }
    ]
  },
  {
    id: 'mod9',
    title: 'Collections Framework',
    description: 'Work with Java collections including ArrayList, LinkedList, HashMap, HashSet, and iterators.',
    difficulty: 'advanced',
    progress: 0,
    totalLessons: 6,
    completedLessons: 0,
    lessons: [],
    estimatedTime: '3 hours',
    source: {
      type: 'curriculum',
      instructor: 'Dr. Sarah Martinez',
      tags: ['Collections', 'ArrayList', 'HashMap', 'Data Structures', 'Generics']
    },
    patternMetrics: {
      patternsDetected: 35,
      oopPrinciples: ['Generics', 'Interfaces', 'Iterators', 'List', 'Set', 'Map'],
      codeExamples: 40
    },
    references: [
      {
        title: 'Java Collections Framework Documentation',
        author: 'Oracle Corporation',
        type: 'documentation',
        url: 'https://docs.oracle.com/javase/8/docs/technotes/guides/collections/',
        description: 'Official collections framework architecture and API'
      },
      {
        title: 'Data Structures and Algorithms in Java',
        author: 'Robert Lafore',
        type: 'book',
        year: 2017,
        description: 'Comprehensive guide to collections and data structures'
      },
      {
        title: 'University of Cabuyao - Data Structures Course',
        author: 'Department of Computer Science',
        type: 'article',
        year: 2026,
        description: 'Official curriculum for collections framework'
      },
      {
        title: 'Java Generics and Collections',
        author: 'Maurice Naftalin & Philip Wadler',
        type: 'book',
        year: 2006,
        description: 'In-depth coverage of generics and collections'
      },
      {
        title: 'Baeldung - Java Collections Tutorial',
        author: 'Baeldung',
        type: 'website',
        url: 'https://www.baeldung.com/java-collections',
        description: 'Practical examples and best practices'
      }
    ]
  },
  {
    id: 'mod10',
    title: 'Advanced OOP Concepts',
    description: 'Explore advanced topics like inner classes, anonymous classes, lambda expressions, and design patterns.',
    difficulty: 'advanced',
    progress: 0,
    totalLessons: 7,
    completedLessons: 0,
    lessons: [],
    estimatedTime: '3.5 hours',
    source: {
      type: 'neural-network',
      instructor: 'Dr. Sarah Martinez',
      tags: ['Design Patterns', 'Lambda', 'Advanced OOP', 'Inner Classes', 'Architecture']
    },
    patternMetrics: {
      patternsDetected: 28,
      oopPrinciples: ['Factory Pattern', 'Singleton', 'Lambda Expressions', 'Inner Classes'],
      codeExamples: 35
    },
    references: [
      {
        title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
        author: 'Gang of Four',
        type: 'book',
        year: 1994,
        description: 'Definitive guide to software design patterns'
      },
      {
        title: 'Modern Java in Action',
        author: 'Raoul-Gabriel Urma, Mario Fusco, Alan Mycroft',
        type: 'book',
        year: 2018,
        description: 'Lambda expressions and functional programming in Java'
      },
      {
        title: 'Neural Network Pattern Recognition in Advanced Java',
        author: 'CodeLearn AI Research',
        type: 'research',
        year: 2026,
        description: 'AI analysis of design patterns and advanced OOP concepts'
      },
      {
        title: 'Refactoring: Improving the Design of Existing Code',
        author: 'Martin Fowler',
        type: 'book',
        year: 2018,
        description: 'Best practices for applying design patterns'
      },
      {
        title: 'Java Design Patterns - SourceMaking',
        author: 'SourceMaking',
        type: 'website',
        url: 'https://sourcemaking.com/design_patterns',
        description: 'Interactive guide to design patterns with examples'
      }
    ]
  }
];
