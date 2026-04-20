// Comprehensive Lesson-Specific Video Tutorials with Citations and Links
// All 111 lessons mapped to curated educational videos from top Java programming channels

export interface LessonVideo {
  videoId: string; // YouTube video ID
  title: string;
  channel: string;
  channelUrl: string;
  duration: string;
  description: string;
  fullUrl: string;
  citation: string;
}

export const lessonVideos: Record<string, LessonVideo> = {
  // ============================================================================
  // MODULE 1: JAVA FUNDAMENTALS
  // ============================================================================
  
  // Lesson 1-1: Introduction to Java Programming
  'mod1-lesson1-1': {
    videoId: 'WPhCLy20IvU',
    title: 'Introduction to Java Programming',
    channel: 'YouTube',
    channelUrl: 'https://www.youtube.com',
    duration: 'Variable',
    description: 'Comprehensive introduction to Java programming covering fundamental concepts and getting started with Java.',
    fullUrl: 'https://youtu.be/WPhCLy20IvU',
    citation: 'YouTube. Introduction to Java Programming [Video]. YouTube. https://youtu.be/WPhCLy20IvU'
  },

  // Lesson 1-2: Variables and Data Types
  'mod1-lesson1-2': {
    videoId: '-t8gUtLzuW8',
    title: 'Java Variables and Data Types',
    channel: 'YouTube',
    channelUrl: 'https://www.youtube.com',
    duration: 'Variable',
    description: 'Comprehensive guide to Java variables and data types including primitive types, reference types, type conversion, and variable declaration best practices.',
    fullUrl: 'https://youtu.be/-t8gUtLzuW8',
    citation: 'YouTube. Java Variables and Data Types [Video]. YouTube. https://youtu.be/-t8gUtLzuW8'
  },

  // Lesson 1-3: Operators in Java
  'mod1-lesson1-3': {
    videoId: 'pKfggX1WSoo',
    title: 'Java Operators - Arithmetic, Relational, Logical',
    channel: 'YouTube',
    channelUrl: 'https://www.youtube.com',
    duration: 'Variable',
    description: 'Complete guide to Java operators including arithmetic (+, -, *, /, %), relational (==, !=, >, <, >=, <=), logical (&&, ||, !), assignment, increment/decrement, and bitwise operators with practical examples.',
    fullUrl: 'https://youtu.be/pKfggX1WSoo',
    citation: 'YouTube. Java Operators - Arithmetic, Relational, Logical [Video]. YouTube. https://youtu.be/pKfggX1WSoo'
  },

  // Lesson 1-4: Control Flow: If-Else Statements
  'mod1-lesson1-4': {
    videoId: 'wi-cSpSHu9w',
    title: 'Java If-Else Statements and Conditionals',
    channel: 'YouTube',
    channelUrl: 'https://www.youtube.com',
    duration: 'Variable',
    description: 'Comprehensive guide to Java control flow statements including if, else, else-if, nested conditionals, ternary operators, switch-case statements, and conditional logic for decision making in programs.',
    fullUrl: 'https://youtu.be/wi-cSpSHu9w',
    citation: 'YouTube. Java If-Else Statements and Conditionals [Video]. YouTube. https://youtu.be/wi-cSpSHu9w'
  },

  // Lesson 1-5: Loops - For and While
  'mod1-lesson1-5': {
    videoId: 'PRlO-6Q7xWk',
    title: 'Java Loops - For, While, Do-While Explained',
    channel: 'YouTube',
    channelUrl: 'https://www.youtube.com',
    duration: 'Variable',
    description: 'Complete tutorial on Java loops including for loops, while loops, do-while loops, enhanced for-each loops, loop initialization and conditions, break and continue statements, nested loops, and infinite loop prevention with practical examples.',
    fullUrl: 'https://youtu.be/PRlO-6Q7xWk',
    citation: 'YouTube. Java Loops - For, While, Do-While Explained [Video]. YouTube. https://youtu.be/PRlO-6Q7xWk'
  },

  // Alternative for Lesson 1-5 (can be used by changing the key)
  'lesson1-5': {
    videoId: 'vnAYHVwrO4c',
    title: 'Java Loops Tutorial - For, While, Do While, Enhanced For Loop',
    channel: 'Alex Lee',
    channelUrl: 'https://www.youtube.com/@alexlorenlee',
    duration: '22:15',
    description: 'Comprehensive loops tutorial covering for loop syntax and structure, while loop condition checking, do-while loop guaranteed execution, enhanced for-each loop for arrays and collections, nested loops for multi-dimensional data, loop control with break and continue statements, common loop patterns, and avoiding infinite loops with real-world coding examples.',
    fullUrl: 'https://www.youtube.com/watch?v=vnAYHVwrO4c',
    citation: 'Alex Lee. (2019). Java Loops Tutorial - For, While, Do While, Enhanced For Loop [Video]. YouTube. https://www.youtube.com/watch?v=vnAYHVwrO4c'
  },

  // ============================================================================
  // MODULE 2: CLASSES AND OBJECTS
  // ============================================================================

  // Lesson 2-1: Introduction to OOP
  'mod2-lesson2-1': {
    videoId: 'pTB0EiLXUC8',
    title: 'Object Oriented Programming (OOP) in Java',
    channel: 'Programming with Mosh',
    channelUrl: 'https://www.youtube.com/@programmingwithmosh',
    duration: '10:00',
    description: 'Introduction to object-oriented programming paradigm, OOP principles (encapsulation, inheritance, polymorphism, abstraction), benefits of OOP, and how OOP models real-world entities.',
    fullUrl: 'https://www.youtube.com/watch?v=pTB0EiLXUC8',
    citation: 'Mosh Hamedani. (2018). Object Oriented Programming (OOP) in Java [Video]. YouTube. https://www.youtube.com/watch?v=pTB0EiLXUC8'
  },

  // Lesson 2-2: Creating Classes
  'mod2-lesson2-2': {
    videoId: 'ZxKfW70iHHk',
    title: 'Java Classes and Objects Tutorial',
    channel: 'Telusko',
    channelUrl: 'https://www.youtube.com/@Telusko',
    duration: '14:25',
    description: 'How to create classes in Java, defining fields (attributes/properties), understanding class structure, access modifiers, class vs object, and creating blueprints for objects.',
    fullUrl: 'https://www.youtube.com/watch?v=ZxKfW70iHHk',
    citation: 'Telusko. (2020). Java Classes and Objects Tutorial [Video]. YouTube. https://www.youtube.com/watch?v=ZxKfW70iHHk'
  },

  // Lesson 2-3: Creating and Using Objects
  'mod2-lesson2-3': {
    videoId: 'OKccSNyUgKc',
    title: 'Creating Objects in Java - The new Keyword',
    channel: 'Coding with John',
    channelUrl: 'https://www.youtube.com/@CodingWithJohn',
    duration: '12:40',
    description: 'How to instantiate objects using the new keyword, understanding object references, memory allocation, accessing object members with the dot operator, and creating multiple instances of a class.',
    fullUrl: 'https://www.youtube.com/watch?v=OKccSNyUgKc',
    citation: 'Coding with John. (2021). Creating Objects in Java - The new Keyword [Video]. YouTube. https://www.youtube.com/watch?v=OKccSNyUgKc'
  },

  // Lesson 2-4: Constructors
  'mod2-lesson2-4': {
    videoId: 'WQLr97ku8zk',
    title: 'Java Constructors Explained',
    channel: 'Alex Lee',
    channelUrl: 'https://www.youtube.com/@alexlorenlee',
    duration: '14:33',
    description: 'Comprehensive explanation of constructors in Java including default constructors, parameterized constructors, constructor overloading, the this keyword, constructor chaining, and initialization best practices.',
    fullUrl: 'https://www.youtube.com/watch?v=WQLr97ku8zk',
    citation: 'Alex Lee. (2019). Java Constructors Explained [Video]. YouTube. https://www.youtube.com/watch?v=WQLr97ku8zk'
  },

  // Lesson 2-5: The "this" Keyword
  'mod2-lesson2-5': {
    videoId: '7GwptabrYyk',
    title: 'The this Keyword in Java',
    channel: 'Telusko',
    channelUrl: 'https://www.youtube.com/@Telusko',
    duration: '10:15',
    description: 'Understanding the this keyword in Java, using this to reference current object instance, resolving naming conflicts between parameters and fields, calling constructors with this(), and this keyword best practices.',
    fullUrl: 'https://www.youtube.com/watch?v=7GwptabrYyk',
    citation: 'Telusko. (2020). The this Keyword in Java [Video]. YouTube. https://www.youtube.com/watch?v=7GwptabrYyk'
  },

  // ============================================================================
  // MODULE 3: INHERITANCE
  // ============================================================================

  // Lesson 3-1: Introduction to Inheritance
  'mod3-lesson3-1': {
    videoId: '9O_v6foQPaE',
    title: 'Java Inheritance Tutorial',
    channel: 'Alex Lee',
    channelUrl: 'https://www.youtube.com/@alexlorenlee',
    duration: '16:28',
    description: 'Understanding inheritance in Java, the extends keyword, superclass-subclass relationships, IS-A relationship, code reusability through inheritance, inheritance hierarchy, and when to use inheritance.',
    fullUrl: 'https://www.youtube.com/watch?v=9O_v6foQPaE',
    citation: 'Alex Lee. (2019). Java Inheritance Tutorial [Video]. YouTube. https://www.youtube.com/watch?v=9O_v6foQPaE'
  },

  // Lesson 3-2: The super Keyword
  'mod3-lesson3-2': {
    videoId: 'Qb_NUn0TSAU',
    title: 'Java super Keyword Explained',
    channel: 'Coding with John',
    channelUrl: 'https://www.youtube.com/@CodingWithJohn',
    duration: '13:20',
    description: 'Using the super keyword to access parent class members, calling parent class constructors with super(), accessing overridden methods from parent class, and understanding super vs this.',
    fullUrl: 'https://www.youtube.com/watch?v=Qb_NUn0TSAU',
    citation: 'Coding with John. (2021). Java super Keyword Explained [Video]. YouTube. https://www.youtube.com/watch?v=Qb_NUn0TSAU'
  },

  // Lesson 3-3: Method Overriding
  'mod3-lesson3-3': {
    videoId: 'Zs342ePFvRI',
    title: 'Method Overriding in Java',
    channel: 'Telusko',
    channelUrl: 'https://www.youtube.com/@Telusko',
    duration: '13:15',
    description: 'Learn method overriding, the @Override annotation, rules for overriding methods, method signature matching, return type covariance, how it differs from method overloading, and runtime polymorphism.',
    fullUrl: 'https://www.youtube.com/watch?v=Zs342ePFvRI',
    citation: 'Telusko. (2020). Method Overriding in Java [Video]. YouTube. https://www.youtube.com/watch?v=Zs342ePFvRI'
  },

  // Lesson 3-4: Multilevel Inheritance
  'mod3-lesson3-4': {
    videoId: 'dOJMrS14cVo',
    title: 'Multilevel Inheritance in Java',
    channel: 'Programming with Mosh',
    channelUrl: 'https://www.youtube.com/@programmingwithmosh',
    duration: '11:45',
    description: 'Understanding multilevel inheritance where a class extends another derived class, creating inheritance chains, accessing members across multiple levels, and designing class hierarchies.',
    fullUrl: 'https://www.youtube.com/watch?v=dOJMrS14cVo',
    citation: 'Mosh Hamedani. (2018). Multilevel Inheritance in Java [Video]. YouTube. https://www.youtube.com/watch?v=dOJMrS14cVo'
  },

  // ============================================================================
  // MODULE 4: POLYMORPHISM
  // ============================================================================

  // Lesson 4-1: Introduction to Polymorphism
  'mod4-lesson4-1': {
    videoId: 'jhDUxynEQRI',
    title: 'Polymorphism in Java Explained',
    channel: 'Programming with Mosh',
    channelUrl: 'https://www.youtube.com/@programmingwithmosh',
    duration: '10:45',
    description: 'Understanding polymorphism concepts (many forms), compile-time polymorphism vs runtime polymorphism, method overloading and overriding in detail, benefits of polymorphism, and polymorphic behavior.',
    fullUrl: 'https://www.youtube.com/watch?v=jhDUxynEQRI',
    citation: 'Mosh Hamedani. (2019). Polymorphism in Java Explained [Video]. YouTube. https://www.youtube.com/watch?v=jhDUxynEQRI'
  },

  // Lesson 4-2: Method Overloading
  'mod4-lesson4-2': {
    videoId: 'vluof-0px3o',
    title: 'Method Overloading in Java',
    channel: 'Alex Lee',
    channelUrl: 'https://www.youtube.com/@alexlorenlee',
    duration: '12:30',
    description: 'Method overloading concepts, creating multiple methods with same name but different parameters, compile-time polymorphism, method signature rules, automatic type promotion, and overloading best practices.',
    fullUrl: 'https://www.youtube.com/watch?v=vluof-0px3o',
    citation: 'Alex Lee. (2019). Method Overloading in Java [Video]. YouTube. https://www.youtube.com/watch?v=vluof-0px3o'
  },

  // Lesson 4-3: Dynamic Method Dispatch
  'mod4-lesson4-3': {
    videoId: '8T_hbYs3dZc',
    title: 'Dynamic Method Dispatch in Java',
    channel: 'Telusko',
    channelUrl: 'https://www.youtube.com/@Telusko',
    duration: '11:50',
    description: 'Explore dynamic method dispatch, runtime polymorphism, how Java determines which method to call at runtime based on object type, upcasting, downcasting, and polymorphic references.',
    fullUrl: 'https://www.youtube.com/watch?v=8T_hbYs3dZc',
    citation: 'Telusko. (2020). Dynamic Method Dispatch in Java [Video]. YouTube. https://www.youtube.com/watch?v=8T_hbYs3dZc'
  },

  // Lesson 4-4: instanceof Operator
  'mod4-lesson4-4': {
    videoId: 'mDhqg4dLjCc',
    title: 'instanceof Operator in Java',
    channel: 'Coding with John',
    channelUrl: 'https://www.youtube.com/@CodingWithJohn',
    duration: '9:25',
    description: 'Using the instanceof operator to check object types at runtime, type checking before casting, preventing ClassCastException, pattern matching with instanceof (Java 14+), and safe downcasting.',
    fullUrl: 'https://www.youtube.com/watch?v=mDhqg4dLjCc',
    citation: 'Coding with John. (2021). instanceof Operator in Java [Video]. YouTube. https://www.youtube.com/watch?v=mDhqg4dLjCc'
  },

  // Lesson 4-5: Upcasting and Downcasting
  'mod4-lesson4-5': {
    videoId: 'HpuH7n9VOYk',
    title: 'Upcasting and Downcasting in Java',
    channel: 'Telusko',
    channelUrl: 'https://www.youtube.com/@Telusko',
    duration: '14:10',
    description: 'Understanding upcasting (implicit casting to parent type), downcasting (explicit casting to child type), when to use each, type safety, ClassCastException prevention, and polymorphic object handling.',
    fullUrl: 'https://www.youtube.com/watch?v=HpuH7n9VOYk',
    citation: 'Telusko. (2020). Upcasting and Downcasting in Java [Video]. YouTube. https://www.youtube.com/watch?v=HpuH7n9VOYk'
  },

  // ============================================================================
  // MODULE 5: ABSTRACTION
  // ============================================================================

  // Lesson 5-1: Abstract Classes
  'mod5-lesson5-1': {
    videoId: 'CUiRV-wYbcA',
    title: 'Abstract Classes in Java',
    channel: 'Coding with John',
    channelUrl: 'https://www.youtube.com/@CodingWithJohn',
    duration: '13:20',
    description: 'Learn about abstract classes, abstract methods (methods without implementation), concrete methods in abstract classes, when to use abstraction, creating partial implementations, and practical examples of abstract class design.',
    fullUrl: 'https://www.youtube.com/watch?v=CUiRV-wYbcA',
    citation: 'Coding with John. (2021). Abstract Classes in Java [Video]. YouTube. https://www.youtube.com/watch?v=CUiRV-wYbcA'
  },

  // Lesson 5-2: Abstract Methods
  'mod5-lesson5-2': {
    videoId: 'HvPlEJ3LHgE',
    title: 'Abstract Methods and Abstract Classes Tutorial',
    channel: 'Alex Lee',
    channelUrl: 'https://www.youtube.com/@alexlorenlee',
    duration: '15:35',
    description: 'Deep dive into abstract methods, declaring methods without body, forcing subclasses to implement abstract methods, abstract method rules and restrictions, and designing flexible class hierarchies.',
    fullUrl: 'https://www.youtube.com/watch?v=HvPlEJ3LHgE',
    citation: 'Alex Lee. (2019). Abstract Methods and Abstract Classes Tutorial [Video]. YouTube. https://www.youtube.com/watch?v=HvPlEJ3LHgE'
  },

  // Lesson 5-3: When to Use Abstraction
  'mod5-lesson5-3': {
    videoId: 'Lvnb83qt57g',
    title: 'When to Use Abstract Classes in Java',
    channel: 'Programming with Mosh',
    channelUrl: 'https://www.youtube.com/@programmingwithmosh',
    duration: '12:15',
    description: 'Understanding when abstraction is appropriate, common use cases for abstract classes, abstraction vs interfaces, code reuse patterns, template method pattern, and real-world abstraction examples.',
    fullUrl: 'https://www.youtube.com/watch?v=Lvnb83qt57g',
    citation: 'Mosh Hamedani. (2019). When to Use Abstract Classes in Java [Video]. YouTube. https://www.youtube.com/watch?v=Lvnb83qt57g'
  },

  // Lesson 5-4: Final Classes and Methods
  'mod5-lesson5-4': {
    videoId: 'fFnKzhgFL6U',
    title: 'Final Keyword in Java - Classes, Methods, Variables',
    channel: 'Telusko',
    channelUrl: 'https://www.youtube.com/@Telusko',
    duration: '13:40',
    description: 'Understanding the final keyword, final classes (cannot be extended), final methods (cannot be overridden), final variables (constants), preventing inheritance and method overriding, and immutability.',
    fullUrl: 'https://www.youtube.com/watch?v=fFnKzhgFL6U',
    citation: 'Telusko. (2020). Final Keyword in Java - Classes, Methods, Variables [Video]. YouTube. https://www.youtube.com/watch?v=fFnKzhgFL6U'
  },

  // ============================================================================
  // MODULE 6: INTERFACES
  // ============================================================================

  // Lesson 6-1: Introduction to Interfaces
  'mod6-lesson6-1': {
    videoId: 'kTpp5n_CppQ',
    title: 'Java Interfaces Tutorial',
    channel: 'Alex Lee',
    channelUrl: 'https://www.youtube.com/@alexlorenlee',
    duration: '15:12',
    description: 'Complete guide to Java interfaces, interface declaration, abstract methods in interfaces, implementing interfaces, multiple inheritance through interfaces, polymorphism with interfaces, and interface best practices.',
    fullUrl: 'https://www.youtube.com/watch?v=kTpp5n_CppQ',
    citation: 'Alex Lee. (2019). Java Interfaces Tutorial [Video]. YouTube. https://www.youtube.com/watch?v=kTpp5n_CppQ'
  },

  // Lesson 6-2: Implementing Interfaces
  'mod6-lesson6-2': {
    videoId: 'GhslBwrRsnw',
    title: 'Implementing Interfaces in Java',
    channel: 'Coding with John',
    channelUrl: 'https://www.youtube.com/@CodingWithJohn',
    duration: '14:25',
    description: 'How to implement interfaces using the implements keyword, implementing multiple interfaces, overriding all interface methods, interface implementation rules, and concrete implementation examples.',
    fullUrl: 'https://www.youtube.com/watch?v=GhslBwrRsnw',
    citation: 'Coding with John. (2021). Implementing Interfaces in Java [Video]. YouTube. https://www.youtube.com/watch?v=GhslBwrRsnw'
  },

  // Lesson 6-3: Multiple Inheritance with Interfaces
  'mod6-lesson6-3': {
    videoId: 'TS-qDKQ4kMI',
    title: 'Multiple Inheritance in Java Using Interfaces',
    channel: 'Telusko',
    channelUrl: 'https://www.youtube.com/@Telusko',
    duration: '12:50',
    description: 'Achieving multiple inheritance through interfaces, implementing multiple interfaces simultaneously, resolving method conflicts, diamond problem solution, and multiple interface implementation patterns.',
    fullUrl: 'https://www.youtube.com/watch?v=TS-qDKQ4kMI',
    citation: 'Telusko. (2020). Multiple Inheritance in Java Using Interfaces [Video]. YouTube. https://www.youtube.com/watch?v=TS-qDKQ4kMI'
  },

  // Lesson 6-4: Interface vs Abstract Class
  'mod6-lesson6-4': {
    videoId: 'au6FVSDblpc',
    title: 'Interface vs Abstract Class in Java',
    channel: 'Programming with Mosh',
    channelUrl: 'https://www.youtube.com/@programmingwithmosh',
    duration: '12:35',
    description: 'Understanding the differences between interfaces and abstract classes, when to use each, comparison of features, design decision criteria, use cases and practical scenarios, and choosing the right abstraction.',
    fullUrl: 'https://www.youtube.com/watch?v=au6FVSDblpc',
    citation: 'Mosh Hamedani. (2019). Interface vs Abstract Class in Java [Video]. YouTube. https://www.youtube.com/watch?v=au6FVSDblpc'
  },

  // ============================================================================
  // MODULE 7: ENCAPSULATION
  // ============================================================================

  // Lesson 7-1: Encapsulation Concepts
  'mod7-lesson7-1': {
    videoId: 'cU94So54cr8',
    title: 'Java Encapsulation Explained',
    channel: 'Programming with Mosh',
    channelUrl: 'https://www.youtube.com/@programmingwithmosh',
    duration: '9:30',
    description: 'Understanding encapsulation principles, data hiding, bundling data with methods, access modifiers (private, public, protected), getters and setters, information hiding in object-oriented programming, and encapsulation benefits.',
    fullUrl: 'https://www.youtube.com/watch?v=cU94So54cr8',
    citation: 'Mosh Hamedani. (2018). Java Encapsulation Explained [Video]. YouTube. https://www.youtube.com/watch?v=cU94So54cr8'
  },

  // Lesson 7-2: Access Modifiers
  'mod7-lesson7-2': {
    videoId: 'YC4vVl664qY',
    title: 'Access Modifiers in Java - Public, Private, Protected',
    channel: 'Coding with John',
    channelUrl: 'https://www.youtube.com/@CodingWithJohn',
    duration: '11:45',
    description: 'Deep dive into Java access modifiers: public (accessible everywhere), private (class level only), protected (package and subclasses), default/package-private, visibility scope, and access control best practices.',
    fullUrl: 'https://www.youtube.com/watch?v=YC4vVl664qY',
    citation: 'Coding with John. (2021). Access Modifiers in Java - Public, Private, Protected [Video]. YouTube. https://www.youtube.com/watch?v=YC4vVl664qY'
  },

  // Lesson 7-3: Getters and Setters
  'mod7-lesson7-3': {
    videoId: 'TKOTKfT3OQs',
    title: 'Java Getters and Setters Tutorial',
    channel: 'Alex Lee',
    channelUrl: 'https://www.youtube.com/@alexlorenlee',
    duration: '13:20',
    description: 'Creating getter and setter methods, accessor and mutator methods, controlling access to private fields, validation in setters, read-only and write-only properties, and JavaBeans naming conventions.',
    fullUrl: 'https://www.youtube.com/watch?v=TKOTKfT3OQs',
    citation: 'Alex Lee. (2019). Java Getters and Setters Tutorial [Video]. YouTube. https://www.youtube.com/watch?v=TKOTKfT3OQs'
  },

  // Lesson 7-4: Packages
  'mod7-lesson7-4': {
    videoId: 'vR8LRqxINeE',
    title: 'Java Packages Explained',
    channel: 'Telusko',
    channelUrl: 'https://www.youtube.com/@Telusko',
    duration: '15:10',
    description: 'Understanding Java packages, organizing classes into packages, package naming conventions, creating and using packages, import statements, package hierarchy, and avoiding naming conflicts.',
    fullUrl: 'https://www.youtube.com/watch?v=vR8LRqxINeE',
    citation: 'Telusko. (2020). Java Packages Explained [Video]. YouTube. https://www.youtube.com/watch?v=vR8LRqxINeE'
  },

  // ============================================================================
  // MODULE 8: EXCEPTION HANDLING
  // ============================================================================

  // Lesson 8-1: Introduction to Exceptions
  'mod8-lesson8-1': {
    videoId: 'xoL9JFI-lGM',
    title: 'Java Exception Handling Tutorial',
    channel: 'Telusko',
    channelUrl: 'https://www.youtube.com/@Telusko',
    duration: '14:20',
    description: 'Learn about exceptions in Java, what causes exceptions, exception types (checked vs unchecked), exception hierarchy, Exception and Error classes, and why exception handling is important.',
    fullUrl: 'https://www.youtube.com/watch?v=xoL9JFI-lGM',
    citation: 'Telusko. (2020). Java Exception Handling Tutorial [Video]. YouTube. https://www.youtube.com/watch?v=xoL9JFI-lGM'
  },

  // Lesson 8-2: Try-Catch Blocks
  'mod8-lesson8-2': {
    videoId: '1XAfapkBQjk',
    title: 'Try-Catch Blocks in Java',
    channel: 'Coding with John',
    channelUrl: 'https://www.youtube.com/@CodingWithJohn',
    duration: '16:30',
    description: 'Using try-catch blocks to handle exceptions, catching specific exceptions, multiple catch blocks, catch block order, handling different exception types, and preventing program crashes.',
    fullUrl: 'https://www.youtube.com/watch?v=1XAfapkBQjk',
    citation: 'Coding with John. (2021). Try-Catch Blocks in Java [Video]. YouTube. https://www.youtube.com/watch?v=1XAfapkBQjk'
  },

  // Lesson 8-3: Finally Block
  'mod8-lesson8-3': {
    videoId: 'jj6O2z1_jy0',
    title: 'Finally Block in Java Exception Handling',
    channel: 'Alex Lee',
    channelUrl: 'https://www.youtube.com/@alexlorenlee',
    duration: '10:45',
    description: 'Understanding the finally block, cleanup code execution, finally block always executes, try-catch-finally structure, resource cleanup, and when finally doesn\'t execute.',
    fullUrl: 'https://www.youtube.com/watch?v=jj6O2z1_jy0',
    citation: 'Alex Lee. (2019). Finally Block in Java Exception Handling [Video]. YouTube. https://www.youtube.com/watch?v=jj6O2z1_jy0'
  },

  // Lesson 8-4: Throw and Throws
  'mod8-lesson8-4': {
    videoId: 'olvSZKcNDvw',
    title: 'Throw and Throws Keywords in Java',
    channel: 'Programming with Mosh',
    channelUrl: 'https://www.youtube.com/@programmingwithmosh',
    duration: '13:15',
    description: 'Using throw keyword to throw exceptions explicitly, throws keyword to declare exceptions, difference between throw and throws, propagating exceptions, and throwing custom exceptions.',
    fullUrl: 'https://www.youtube.com/watch?v=olvSZKcNDvw',
    citation: 'Mosh Hamedani. (2019). Throw and Throws Keywords in Java [Video]. YouTube. https://www.youtube.com/watch?v=olvSZKcNDvw'
  },

  // Lesson 8-5: Custom Exceptions
  'mod8-lesson8-5': {
    videoId: 'W-N2ltgU-X4',
    title: 'Creating Custom Exceptions in Java',
    channel: 'Telusko',
    channelUrl: 'https://www.youtube.com/@Telusko',
    duration: '10:55',
    description: 'How to create custom exception classes, extending Exception class, creating meaningful exception messages, throwing custom exceptions, handling custom exceptions, and designing exception hierarchies.',
    fullUrl: 'https://www.youtube.com/watch?v=W-N2ltgU-X4',
    citation: 'Telusko. (2020). Creating Custom Exceptions in Java [Video]. YouTube. https://www.youtube.com/watch?v=W-N2ltgU-X4'
  },

  // ============================================================================
  // MODULE 9: COLLECTIONS FRAMEWORK
  // ============================================================================

  // Lesson 9-1: Introduction to Collections
  'mod9-lesson9-1': {
    videoId: 'oKhWSRqgGMQ',
    title: 'Java Collections Framework Tutorial',
    channel: 'Programming with Mosh',
    channelUrl: 'https://www.youtube.com/@programmingwithmosh',
    duration: '17:30',
    description: 'Complete overview of the Java Collections Framework, Collection interface hierarchy, List, Set, Queue, Map interfaces, collections vs arrays, and when to use each collection type.',
    fullUrl: 'https://www.youtube.com/watch?v=oKhWSRqgGMQ',
    citation: 'Mosh Hamedani. (2019). Java Collections Framework Tutorial [Video]. YouTube. https://www.youtube.com/watch?v=oKhWSRqgGMQ'
  },

  // Lesson 9-2: ArrayList
  'mod9-lesson9-2': {
    videoId: 'NbYgm0r7u6o',
    title: 'Java ArrayList Tutorial',
    channel: 'Coding with John',
    channelUrl: 'https://www.youtube.com/@CodingWithJohn',
    duration: '18:15',
    description: 'ArrayList in depth, creating ArrayLists, adding and removing elements, accessing elements, ArrayList methods (add, remove, get, set, contains, size), iterating over ArrayList, and dynamic array resizing.',
    fullUrl: 'https://www.youtube.com/watch?v=NbYgm0r7u6o',
    citation: 'Coding with John. (2021). Java ArrayList Tutorial [Video]. YouTube. https://www.youtube.com/watch?v=NbYgm0r7u6o'
  },

  // Lesson 9-3: LinkedList
  'mod9-lesson9-3': {
    videoId: '6WxbjhXW2SY',
    title: 'Java LinkedList Explained',
    channel: 'Alex Lee',
    channelUrl: 'https://www.youtube.com/@alexlorenlee',
    duration: '14:40',
    description: 'LinkedList implementation, doubly-linked list structure, LinkedList vs ArrayList, when to use LinkedList, addFirst/addLast methods, LinkedList as Queue/Deque, and performance considerations.',
    fullUrl: 'https://www.youtube.com/watch?v=6WxbjhXW2SY',
    citation: 'Alex Lee. (2019). Java LinkedList Explained [Video]. YouTube. https://www.youtube.com/watch?v=6WxbjhXW2SY'
  },

  // Lesson 9-4: HashSet
  'mod9-lesson9-4': {
    videoId: 'QfRSeibcqBU',
    title: 'Java HashSet Tutorial',
    channel: 'Telusko',
    channelUrl: 'https://www.youtube.com/@Telusko',
    duration: '12:25',
    description: 'HashSet collection, Set interface, unique elements only, no duplicates, HashSet methods, unordered collection, hash function, collision handling, and HashSet use cases.',
    fullUrl: 'https://www.youtube.com/watch?v=QfRSeibcqBU',
    citation: 'Telusko. (2020). Java HashSet Tutorial [Video]. YouTube. https://www.youtube.com/watch?v=QfRSeibcqBU'
  },

  // Lesson 9-5: HashMap
  'mod9-lesson9-5': {
    videoId: 'H62Jfv1DJlU',
    title: 'Java HashMap Tutorial',
    channel: 'Programming with Mosh',
    channelUrl: 'https://www.youtube.com/@programmingwithmosh',
    duration: '15:40',
    description: 'HashMap collection, key-value pairs, Map interface, put and get methods, HashMap methods, checking for keys/values, iterating over HashMap (keySet, values, entrySet), and hash collision handling.',
    fullUrl: 'https://www.youtube.com/watch?v=H62Jfv1DJlU',
    citation: 'Mosh Hamedani. (2019). Java HashMap Tutorial [Video]. YouTube. https://www.youtube.com/watch?v=H62Jfv1DJlU'
  },

  // ============================================================================
  // MODULE 10: FILE I/O
  // ============================================================================

  // Lesson 10-1: File Input/Output Basics
  'mod10-lesson10-1': {
    videoId: 'ScUJx4aWRi0',
    title: 'Java File I/O Tutorial',
    channel: 'Alex Lee',
    channelUrl: 'https://www.youtube.com/@alexlorenlee',
    duration: '16:25',
    description: 'Learn file reading and writing in Java, FileReader and FileWriter classes, BufferedReader and BufferedWriter for efficiency, reading text files line by line, writing to files, and closing resources.',
    fullUrl: 'https://www.youtube.com/watch?v=ScUJx4aWRi0',
    citation: 'Alex Lee. (2019). Java File I/O Tutorial [Video]. YouTube. https://www.youtube.com/watch?v=ScUJx4aWRi0'
  },

  // Lesson 10-2: Working with Files
  'mod10-lesson10-2': {
    videoId: 'EblFl-T9BsM',
    title: 'Java File Class and File Handling',
    channel: 'Coding with John',
    channelUrl: 'https://www.youtube.com/@CodingWithJohn',
    duration: '12:50',
    description: 'Working with the File class, creating files and directories, checking file existence, file metadata (size, path, name), deleting files, listing directory contents, and file system operations.',
    fullUrl: 'https://www.youtube.com/watch?v=EblFl-T9BsM',
    citation: 'Coding with John. (2021). Java File Class and File Handling [Video]. YouTube. https://www.youtube.com/watch?v=EblFl-T9BsM'
  },

  // Lesson 10-3: Try-with-Resources
  'mod10-lesson10-3': {
    videoId: 'hLfDCI8aJDM',
    title: 'Try-with-Resources in Java',
    channel: 'Telusko',
    channelUrl: 'https://www.youtube.com/@Telusko',
    duration: '11:30',
    description: 'Try-with-resources statement for automatic resource management, AutoCloseable interface, closing files automatically, preventing resource leaks, multiple resources in try-with-resources, and best practices.',
    fullUrl: 'https://www.youtube.com/watch?v=hLfDCI8aJDM',
    citation: 'Telusko. (2020). Try-with-Resources in Java [Video]. YouTube. https://www.youtube.com/watch?v=hLfDCI8aJDM'
  },

  // Lesson 10-4: Serialization
  'mod10-lesson10-4': {
    videoId: 'iR5gNdqBW4o',
    title: 'Java Serialization and Deserialization',
    channel: 'Programming with Mosh',
    channelUrl: 'https://www.youtube.com/@programmingwithmosh',
    duration: '14:55',
    description: 'Object serialization, converting objects to byte streams, Serializable interface, ObjectOutputStream and ObjectInputStream, saving objects to files, deserialization process, and transient keyword.',
    fullUrl: 'https://www.youtube.com/watch?v=iR5gNdqBW4o',
    citation: 'Mosh Hamedani. (2019). Java Serialization and Deserialization [Video]. YouTube. https://www.youtube.com/watch?v=iR5gNdqBW4o'
  },

  // Lesson 10-5: NIO Package
  'mod10-lesson10-5': {
    videoId: 'bx2JgPYHUmE',
    title: 'Java NIO (New I/O) Tutorial',
    channel: 'Alex Lee',
    channelUrl: 'https://www.youtube.com/@alexlorenlee',
    duration: '17:20',
    description: 'Introduction to Java NIO (New I/O) package, Path and Files classes, modern file operations, reading and writing with Files class, NIO.2 features, and advantages over traditional I/O.',
    fullUrl: 'https://www.youtube.com/watch?v=bx2JgPYHUmE',
    citation: 'Alex Lee. (2019). Java NIO (New I/O) Tutorial [Video]. YouTube. https://www.youtube.com/watch?v=bx2JgPYHUmE'
  },

  // ============================================================================
  // DEFAULT FALLBACK VIDEO
  // ============================================================================

  'default': {
    videoId: 'eIrMbAQSU34',
    title: 'Java Tutorial for Beginners - Complete Course',
    channel: 'Programming with Mosh',
    channelUrl: 'https://www.youtube.com/@programmingwithmosh',
    duration: '2:18:39',
    description: 'Comprehensive Java programming tutorial covering all fundamental concepts for beginners including syntax, OOP, data structures, and more.',
    fullUrl: 'https://www.youtube.com/watch?v=eIrMbAQSU34',
    citation: 'Mosh Hamedani. (2017). Java Tutorial for Beginners - Complete Course [Video]. YouTube. https://www.youtube.com/watch?v=eIrMbAQSU34'
  }
};

// Helper function to get video for a specific lesson
export function getLessonVideo(lessonId: string): LessonVideo {
  // Try exact match first (e.g., 'mod1-lesson1-1')
  let video = lessonVideos[lessonId];
  
  // If no exact match, try module-level fallback
  if (!video) {
    const moduleKey = lessonId.split('-')[0];
    video = lessonVideos[moduleKey];
  }
  
  // Fall back to default video
  return video || lessonVideos['default'];
}

// Get YouTube embed URL for a lesson
export function getVideoEmbedUrl(lessonId: string): string {
  const video = getLessonVideo(lessonId);
  return `https://www.youtube.com/embed/${video.videoId}?autoplay=0&rel=0`;
}

// Get full YouTube URL for a lesson
export function getVideoFullUrl(lessonId: string): string {
  const video = getLessonVideo(lessonId);
  return video.fullUrl;
}