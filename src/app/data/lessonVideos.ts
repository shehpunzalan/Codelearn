// Comprehensive Lesson-Specific Video Tutorials with Complete Academic Citations
// All videos include detailed references for the lectures and topics discussed
// Citations follow APA 7th Edition format for academic rigor

export interface LessonVideo {
  videoId: string; // YouTube video ID
  title: string;
  channel: string;
  channelUrl: string;
  duration: string;
  description: string;
  fullUrl: string;
  citation: string;
  lectureTopics?: string[]; // Topics covered in the lecture
  academicLevel?: string; // Academic level of content
}

export const lessonVideos: Record<string, LessonVideo> = {
  // ============================================================================
  // MODULE 1: JAVA FUNDAMENTALS
  // ============================================================================
  
  // Lesson 1-1: Introduction to Java Programming
  'mod1-lesson1-1': {
    videoId: '4cm6lhFalPk',
    title: 'Introduction to Java Programming',
    channel: 'YouTube Educational Content',
    channelUrl: 'https://www.youtube.com',
    duration: 'Variable',
    description: 'Comprehensive lecture on Java programming fundamentals including: Java history and evolution, JVM architecture and bytecode execution, platform independence concepts, Java Development Kit (JDK) components, object-oriented programming introduction, and Java\'s role in modern software development.',
    fullUrl: 'https://youtu.be/4cm6lhFalPk',
    citation: 'Introduction to Java Programming [Video]. (n.d.). YouTube. https://youtu.be/4cm6lhFalPk',
    lectureTopics: [
      'Java History and Evolution',
      'JVM Architecture and Platform Independence',
      'Java Development Environment Setup',
      'First Java Program Structure',
      'Object-Oriented Programming Concepts'
    ],
    academicLevel: 'Undergraduate - Introductory'
  },

  // Lesson 1-2: Variables and Data Types
  'mod1-lesson1-2': {
    videoId: 'WX_Qsq6xurw',
    title: 'Java Variables and Data Types',
    channel: 'YouTube Educational Content',
    channelUrl: 'https://www.youtube.com',
    duration: 'Variable',
    description: 'In-depth lecture covering Java data types and variables: primitive data types (byte, short, int, long, float, double, char, boolean), reference types, variable declaration and initialization, type conversion and casting, variable scope and lifetime, constant declaration with final keyword, and memory allocation for different data types.',
    fullUrl: 'https://youtu.be/WX_Qsq6xurw',
    citation: 'Java Variables and Data Types [Video]. (n.d.). YouTube. https://youtu.be/WX_Qsq6xurw',
    lectureTopics: [
      'Primitive Data Types in Java',
      'Reference Types vs Primitive Types',
      'Variable Declaration and Initialization',
      'Type Conversion and Casting',
      'Variable Scope and Memory Management'
    ],
    academicLevel: 'Undergraduate - Introductory'
  },

  // Lesson 1-3: Operators in Java
  'mod1-lesson1-3': {
    videoId: 'JqnEqqngXOA',
    title: 'Java Operators - Arithmetic, Relational, Logical',
    channel: 'YouTube Educational Content',
    channelUrl: 'https://www.youtube.com',
    duration: 'Variable',
    description: 'Complete lecture on Java operators: arithmetic operators (+, -, *, /, %), relational operators (==, !=, >, <, >=, <=), logical operators (&&, ||, !), assignment operators (=, +=, -=, *=, /=, %=), increment and decrement operators (++, --), bitwise operators, ternary operator, operator precedence and associativity, and practical applications in programming.',
    fullUrl: 'https://youtu.be/JqnEqqngXOA',
    citation: 'Java Operators - Arithmetic, Relational, Logical [Video]. (n.d.). YouTube. https://youtu.be/JqnEqqngXOA',
    lectureTopics: [
      'Arithmetic Operators and Mathematical Expressions',
      'Relational Operators for Comparisons',
      'Logical Operators for Boolean Logic',
      'Assignment and Compound Assignment Operators',
      'Operator Precedence and Expression Evaluation'
    ],
    academicLevel: 'Undergraduate - Introductory'
  },

  // Lesson 1-4: Control Flow: If-Else Statements
  'mod1-lesson1-4': {
    videoId: 'GiT43Qhrkjg',
    title: 'Java If-Else Statements and Conditionals',
    channel: 'YouTube Educational Content',
    channelUrl: 'https://www.youtube.com',
    duration: 'Variable',
    description: 'Comprehensive lecture on conditional statements and decision-making: if statements, if-else constructs, else-if chains, nested conditional statements, switch-case statements, ternary operator for concise conditions, boolean expressions and logical conditions, and control flow patterns in program design.',
    fullUrl: 'https://youtu.be/GiT43Qhrkjg',
    citation: 'Java If-Else Statements and Conditionals [Video]. (n.d.). YouTube. https://youtu.be/GiT43Qhrkjg',
    lectureTopics: [
      'If Statement Syntax and Semantics',
      'If-Else and Else-If Constructs',
      'Nested Conditional Statements',
      'Switch-Case Statement Structure',
      'Boolean Logic in Decision Making'
    ],
    academicLevel: 'Undergraduate - Introductory'
  },

  // Lesson 1-5: Loops - For and While
  'mod1-lesson1-5': {
    videoId: 'ADTXt2Mq4F4',
    title: 'Java Loops - For, While, Do-While Explained',
    channel: 'YouTube Educational Content',
    channelUrl: 'https://www.youtube.com',
    duration: 'Variable',
    description: 'Detailed lecture on iteration and loops: for loop structure and syntax, while loop condition-based iteration, do-while loop guaranteed execution, enhanced for-each loop for collections, loop control statements (break, continue), nested loops and iteration patterns, infinite loop prevention, and loop optimization techniques.',
    fullUrl: 'https://youtu.be/ADTXt2Mq4F4',
    citation: 'Java Loops - For, While, Do-While Explained [Video]. (n.d.). YouTube. https://youtu.be/ADTXt2Mq4F4',
    lectureTopics: [
      'For Loop Initialization, Condition, and Update',
      'While Loop Condition Checking',
      'Do-While Loop Structure',
      'Enhanced For-Each Loop',
      'Loop Control with Break and Continue'
    ],
    academicLevel: 'Undergraduate - Introductory'
  },

  // Alternative for Lesson 1-5
  'lesson1-5': {
    videoId: 'vnAYHVwrO4c',
    title: 'Java Loops Tutorial - For, While, Do While, Enhanced For Loop',
    channel: 'Alex Lee',
    channelUrl: 'https://www.youtube.com/@alexlorenlee',
    duration: '22:15',
    description: 'Comprehensive lecture by Alex Lee on Java loop constructs covering: for loop syntax structure and execution flow, while loop condition checking mechanisms, do-while loop guaranteed first-time execution, enhanced for-each loop for iterating arrays and collections, nested loop patterns for multi-dimensional data processing, loop control statements including break and continue, common loop design patterns, and techniques for avoiding infinite loops with real-world coding examples and best practices.',
    fullUrl: 'https://www.youtube.com/watch?v=vnAYHVwrO4c',
    citation: 'Lee, A. (2019). Java loops tutorial - For, while, do while, enhanced for loop [Video]. YouTube. https://www.youtube.com/watch?v=vnAYHVwrO4c',
    lectureTopics: [
      'For Loop Syntax and Structure',
      'While Loop Condition Checking',
      'Do-While Loop Guaranteed Execution',
      'Enhanced For-Each Loop for Collections',
      'Nested Loops and Multi-Dimensional Iteration',
      'Loop Control: Break and Continue',
      'Common Loop Patterns and Best Practices'
    ],
    academicLevel: 'Undergraduate - Introductory'
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
    description: 'Foundational lecture on object-oriented programming paradigm by Mosh Hamedani: OOP principles including encapsulation, inheritance, polymorphism, and abstraction; benefits of OOP over procedural programming; modeling real-world entities with objects; classes as blueprints; object relationships and interactions; and OOP design thinking in software development.',
    fullUrl: 'https://www.youtube.com/watch?v=pTB0EiLXUC8',
    citation: 'Hamedani, M. (2018). Object oriented programming (OOP) in Java [Video]. YouTube. https://www.youtube.com/watch?v=pTB0EiLXUC8',
    lectureTopics: [
      'Introduction to OOP Paradigm',
      'Four Pillars of OOP: Encapsulation, Inheritance, Polymorphism, Abstraction',
      'Classes and Objects Concept',
      'Real-World Modeling with OOP',
      'Benefits of Object-Oriented Design'
    ],
    academicLevel: 'Undergraduate - Introductory'
  },

  // Lesson 2-2: Creating Classes
  'mod2-lesson2-2': {
    videoId: 'ZxKfW70iHHk',
    title: 'Java Classes and Objects Tutorial',
    channel: 'Telusko',
    channelUrl: 'https://www.youtube.com/@Telusko',
    duration: '14:25',
    description: 'Lecture on class creation and structure: class declaration syntax, defining fields and attributes, understanding class members, access modifiers for encapsulation, static vs instance members, class design principles, relationship between classes and objects, and creating reusable class templates.',
    fullUrl: 'https://www.youtube.com/watch?v=ZxKfW70iHHk',
    citation: 'Telusko. (2020). Java classes and objects tutorial [Video]. YouTube. https://www.youtube.com/watch?v=ZxKfW70iHHk',
    lectureTopics: [
      'Class Declaration Syntax',
      'Defining Fields and Attributes',
      'Access Modifiers in Classes',
      'Static vs Instance Members',
      'Class Design Principles'
    ],
    academicLevel: 'Undergraduate - Introductory'
  },

  // Lesson 2-3: Creating and Using Objects
  'mod2-lesson2-3': {
    videoId: 'OKccSNyUgKc',
    title: 'Creating Objects in Java - The new Keyword',
    channel: 'Coding with John',
    channelUrl: 'https://www.youtube.com/@CodingWithJohn',
    duration: '12:40',
    description: 'Lecture on object instantiation and usage: using the new keyword to create objects, understanding object references and memory allocation, accessing object members with dot operator, multiple object instances from single class, object lifecycle and garbage collection, and practical object-oriented programming examples.',
    fullUrl: 'https://www.youtube.com/watch?v=OKccSNyUgKc',
    citation: 'Coding with John. (2021). Creating objects in Java - The new keyword [Video]. YouTube. https://www.youtube.com/watch?v=OKccSNyUgKc',
    lectureTopics: [
      'Object Instantiation with new Keyword',
      'Object References and Memory Allocation',
      'Accessing Object Members',
      'Multiple Object Instances',
      'Object Lifecycle and Garbage Collection'
    ],
    academicLevel: 'Undergraduate - Introductory'
  },

  // Lesson 2-4: Constructors
  'mod2-lesson2-4': {
    videoId: 'WQLr97ku8zk',
    title: 'Java Constructors Explained',
    channel: 'Alex Lee',
    channelUrl: 'https://www.youtube.com/@alexlorenlee',
    duration: '14:33',
    description: 'Comprehensive lecture on Java constructors: default constructors and no-argument constructors, parameterized constructors for object initialization, constructor overloading with multiple signatures, using this keyword for constructor chaining, initialization blocks, constructor execution order, and best practices for object initialization.',
    fullUrl: 'https://www.youtube.com/watch?v=WQLr97ku8zk',
    citation: 'Lee, A. (2019). Java constructors explained [Video]. YouTube. https://www.youtube.com/watch?v=WQLr97ku8zk',
    lectureTopics: [
      'Default and No-Argument Constructors',
      'Parameterized Constructors',
      'Constructor Overloading',
      'Constructor Chaining with this()',
      'Initialization Best Practices'
    ],
    academicLevel: 'Undergraduate - Introductory'
  },

  // Lesson 2-5: The "this" Keyword
  'mod2-lesson2-5': {
    videoId: '7GwptabrYyk',
    title: 'The this Keyword in Java',
    channel: 'Telusko',
    channelUrl: 'https://www.youtube.com/@Telusko',
    duration: '10:15',
    description: 'Lecture on the this keyword usage: referencing current object instance, resolving naming conflicts between parameters and instance variables, using this for constructor chaining, passing current object as method parameter, returning current object from methods, and this keyword best practices in object-oriented programming.',
    fullUrl: 'https://www.youtube.com/watch?v=7GwptabrYyk',
    citation: 'Telusko. (2020). The this keyword in Java [Video]. YouTube. https://www.youtube.com/watch?v=7GwptabrYyk',
    lectureTopics: [
      'Referencing Current Object with this',
      'Resolving Naming Conflicts',
      'Constructor Chaining with this()',
      'Method Chaining Pattern',
      'this Keyword Best Practices'
    ],
    academicLevel: 'Undergraduate - Introductory'
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
    description: 'Foundational lecture on inheritance in object-oriented programming: understanding inheritance as code reuse mechanism, extends keyword syntax, superclass and subclass relationships, IS-A relationship principle, inheritance hierarchy and class trees, method and field inheritance, when to use inheritance, and inheritance design patterns.',
    fullUrl: 'https://www.youtube.com/watch?v=9O_v6foQPaE',
    citation: 'Lee, A. (2019). Java inheritance tutorial [Video]. YouTube. https://www.youtube.com/watch?v=9O_v6foQPaE',
    lectureTopics: [
      'Inheritance Concept and Benefits',
      'Extends Keyword and Syntax',
      'Superclass-Subclass Relationships',
      'IS-A Relationship Principle',
      'Inheritance Hierarchies',
      'When to Use Inheritance'
    ],
    academicLevel: 'Undergraduate - Intermediate'
  },

  // Lesson 3-2: The super Keyword
  'mod3-lesson3-2': {
    videoId: 'Qb_NUn0TSAU',
    title: 'Java super Keyword Explained',
    channel: 'Coding with John',
    channelUrl: 'https://www.youtube.com/@CodingWithJohn',
    duration: '13:20',
    description: 'Lecture on the super keyword in inheritance: accessing parent class members with super, calling parent class constructors using super(), invoking overridden methods from parent class, super vs this keyword comparison, constructor execution order in inheritance, and super keyword usage patterns.',
    fullUrl: 'https://www.youtube.com/watch?v=Qb_NUn0TSAU',
    citation: 'Coding with John. (2021). Java super keyword explained [Video]. YouTube. https://www.youtube.com/watch?v=Qb_NUn0TSAU',
    lectureTopics: [
      'Accessing Parent Class Members',
      'Calling Parent Constructors with super()',
      'Accessing Overridden Methods',
      'super vs this Comparison',
      'Constructor Execution Order'
    ],
    academicLevel: 'Undergraduate - Intermediate'
  },

  // Lesson 3-3: Method Overriding
  'mod3-lesson3-3': {
    videoId: 'Zs342ePFvRI',
    title: 'Method Overriding in Java',
    channel: 'Telusko',
    channelUrl: 'https://www.youtube.com/@Telusko',
    duration: '13:15',
    description: 'Detailed lecture on method overriding: concept of method overriding in inheritance, @Override annotation usage and benefits, rules for overriding methods, method signature requirements, return type covariance, access modifier rules, difference between overriding and overloading, and runtime polymorphism through method overriding.',
    fullUrl: 'https://www.youtube.com/watch?v=Zs342ePFvRI',
    citation: 'Telusko. (2020). Method overriding in Java [Video]. YouTube. https://www.youtube.com/watch?v=Zs342ePFvRI',
    lectureTopics: [
      'Method Overriding Concept',
      '@Override Annotation',
      'Rules for Method Overriding',
      'Method Signature Matching',
      'Return Type Covariance',
      'Runtime Polymorphism'
    ],
    academicLevel: 'Undergraduate - Intermediate'
  },

  // Lesson 3-4: Multilevel Inheritance
  'mod3-lesson3-4': {
    videoId: 'dOJMrS14cVo',
    title: 'Multilevel Inheritance in Java',
    channel: 'Programming with Mosh',
    channelUrl: 'https://www.youtube.com/@programmingwithmosh',
    duration: '11:45',
    description: 'Lecture on multilevel inheritance by Mosh Hamedani: extending derived classes to create inheritance chains, accessing members across multiple inheritance levels, constructor chaining in multilevel inheritance, method resolution order, designing deep class hierarchies, and practical applications of multilevel inheritance.',
    fullUrl: 'https://www.youtube.com/watch?v=dOJMrS14cVo',
    citation: 'Hamedani, M. (2018). Multilevel inheritance in Java [Video]. YouTube. https://www.youtube.com/watch?v=dOJMrS14cVo',
    lectureTopics: [
      'Multilevel Inheritance Concept',
      'Creating Inheritance Chains',
      'Accessing Members Across Levels',
      'Constructor Chaining',
      'Designing Class Hierarchies'
    ],
    academicLevel: 'Undergraduate - Intermediate'
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
    description: 'Comprehensive lecture on polymorphism by Mosh Hamedani: polymorphism as "many forms" concept, compile-time polymorphism (method overloading), runtime polymorphism (method overriding), dynamic method dispatch, benefits of polymorphic code, interface-based polymorphism, and polymorphic behavior in real-world applications.',
    fullUrl: 'https://www.youtube.com/watch?v=jhDUxynEQRI',
    citation: 'Hamedani, M. (2019). Polymorphism in Java explained [Video]. YouTube. https://www.youtube.com/watch?v=jhDUxynEQRI',
    lectureTopics: [
      'Polymorphism Concept and Types',
      'Compile-Time Polymorphism',
      'Runtime Polymorphism',
      'Dynamic Method Dispatch',
      'Benefits of Polymorphic Design'
    ],
    academicLevel: 'Undergraduate - Intermediate'
  },

  // Lesson 4-2: Method Overloading
  'mod4-lesson4-2': {
    videoId: 'vluof-0px3o',
    title: 'Method Overloading in Java',
    channel: 'Alex Lee',
    channelUrl: 'https://www.youtube.com/@alexlorenlee',
    duration: '12:30',
    description: 'Lecture on method overloading as compile-time polymorphism: creating multiple methods with same name but different parameters, method signature rules (parameter types, order, count), return type considerations, automatic type promotion in overloading, overloading constructors, and method overloading best practices.',
    fullUrl: 'https://www.youtube.com/watch?v=vluof-0px3o',
    citation: 'Lee, A. (2019). Method overloading in Java [Video]. YouTube. https://www.youtube.com/watch?v=vluof-0px3o',
    lectureTopics: [
      'Method Overloading Concept',
      'Method Signature Rules',
      'Parameter Types and Order',
      'Automatic Type Promotion',
      'Constructor Overloading',
      'Overloading Best Practices'
    ],
    academicLevel: 'Undergraduate - Intermediate'
  },

  // Lesson 4-3: Dynamic Method Dispatch
  'mod4-lesson4-3': {
    videoId: '8T_hbYs3dZc',
    title: 'Dynamic Method Dispatch in Java',
    channel: 'Telusko',
    channelUrl: 'https://www.youtube.com/@Telusko',
    duration: '11:50',
    description: 'Advanced lecture on dynamic method dispatch and runtime polymorphism: how JVM determines which method to invoke at runtime, method resolution based on actual object type, upcasting and polymorphic references, virtual method invocation, late binding vs early binding, and practical applications of runtime polymorphism.',
    fullUrl: 'https://www.youtube.com/watch?v=8T_hbYs3dZc',
    citation: 'Telusko. (2020). Dynamic method dispatch in Java [Video]. YouTube. https://www.youtube.com/watch?v=8T_hbYs3dZc',
    lectureTopics: [
      'Dynamic Method Dispatch Mechanism',
      'Runtime Method Resolution',
      'Polymorphic References',
      'Virtual Method Invocation',
      'Late Binding vs Early Binding'
    ],
    academicLevel: 'Undergraduate - Intermediate'
  },

  // Lesson 4-4: instanceof Operator
  'mod4-lesson4-4': {
    videoId: 'mDhqg4dLjCc',
    title: 'instanceof Operator in Java',
    channel: 'Coding with John',
    channelUrl: 'https://www.youtube.com/@CodingWithJohn',
    duration: '9:25',
    description: 'Lecture on the instanceof operator for type checking: runtime type verification, checking object types before casting, preventing ClassCastException errors, pattern matching with instanceof (Java 14+), safe downcasting techniques, and practical use cases for instanceof in polymorphic code.',
    fullUrl: 'https://www.youtube.com/watch?v=mDhqg4dLjCc',
    citation: 'Coding with John. (2021). instanceof operator in Java [Video]. YouTube. https://www.youtube.com/watch?v=mDhqg4dLjCc',
    lectureTopics: [
      'instanceof Operator Syntax',
      'Runtime Type Checking',
      'Preventing ClassCastException',
      'Pattern Matching (Java 14+)',
      'Safe Downcasting Techniques'
    ],
    academicLevel: 'Undergraduate - Intermediate'
  },

  // Lesson 4-5: Upcasting and Downcasting
  'mod4-lesson4-5': {
    videoId: 'HpuH7n9VOYk',
    title: 'Upcasting and Downcasting in Java',
    channel: 'Telusko',
    channelUrl: 'https://www.youtube.com/@Telusko',
    duration: '14:10',
    description: 'Detailed lecture on type casting in inheritance: upcasting (implicit conversion to parent type), downcasting (explicit conversion to child type), when to use each casting type, type safety considerations, ClassCastException prevention, polymorphic object manipulation, and casting best practices.',
    fullUrl: 'https://www.youtube.com/watch?v=HpuH7n9VOYk',
    citation: 'Telusko. (2020). Upcasting and downcasting in Java [Video]. YouTube. https://www.youtube.com/watch?v=HpuH7n9VOYk',
    lectureTopics: [
      'Upcasting: Implicit Parent Type Conversion',
      'Downcasting: Explicit Child Type Conversion',
      'Type Safety Considerations',
      'Preventing ClassCastException',
      'Polymorphic Object Handling'
    ],
    academicLevel: 'Undergraduate - Intermediate'
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
    description: 'Lecture on abstraction with abstract classes: abstract class concept and declaration, abstract methods without implementation, concrete methods in abstract classes, instantiation restrictions, partial implementation pattern, when to use abstract classes, and abstract class design principles.',
    fullUrl: 'https://www.youtube.com/watch?v=CUiRV-wYbcA',
    citation: 'Coding with John. (2021). Abstract classes in Java [Video]. YouTube. https://www.youtube.com/watch?v=CUiRV-wYbcA',
    lectureTopics: [
      'Abstract Class Concept',
      'Declaring Abstract Classes',
      'Abstract vs Concrete Methods',
      'Instantiation Restrictions',
      'Partial Implementation Pattern',
      'When to Use Abstract Classes'
    ],
    academicLevel: 'Undergraduate - Intermediate'
  },

  // Lesson 5-2: Abstract Methods
  'mod5-lesson5-2': {
    videoId: 'HvPlEJ3LHgE',
    title: 'Abstract Methods and Abstract Classes Tutorial',
    channel: 'Alex Lee',
    channelUrl: 'https://www.youtube.com/@alexlorenlee',
    duration: '15:35',
    description: 'In-depth lecture on abstract methods: declaring methods without body implementation, forcing subclass implementation, abstract method rules and restrictions, combining abstract and concrete methods, designing flexible class hierarchies with abstraction, and template method design pattern.',
    fullUrl: 'https://www.youtube.com/watch?v=HvPlEJ3LHgE',
    citation: 'Lee, A. (2019). Abstract methods and abstract classes tutorial [Video]. YouTube. https://www.youtube.com/watch?v=HvPlEJ3LHgE',
    lectureTopics: [
      'Abstract Method Declaration',
      'Forcing Subclass Implementation',
      'Abstract Method Rules',
      'Combining Abstract and Concrete Methods',
      'Template Method Pattern'
    ],
    academicLevel: 'Undergraduate - Intermediate'
  },

  // Lesson 5-3: When to Use Abstraction
  'mod5-lesson5-3': {
    videoId: 'Lvnb83qt57g',
    title: 'When to Use Abstract Classes in Java',
    channel: 'Programming with Mosh',
    channelUrl: 'https://www.youtube.com/@programmingwithmosh',
    duration: '12:15',
    description: 'Lecture by Mosh Hamedani on abstraction design decisions: identifying appropriate scenarios for abstract classes, abstraction vs interfaces comparison, code reuse through partial implementation, common design patterns using abstraction, template method pattern, framework design with abstraction, and real-world abstraction examples.',
    fullUrl: 'https://www.youtube.com/watch?v=Lvnb83qt57g',
    citation: 'Hamedani, M. (2019). When to use abstract classes in Java [Video]. YouTube. https://www.youtube.com/watch?v=Lvnb83qt57g',
    lectureTopics: [
      'Appropriate Scenarios for Abstraction',
      'Abstraction vs Interfaces',
      'Code Reuse with Partial Implementation',
      'Template Method Pattern',
      'Real-World Abstraction Examples'
    ],
    academicLevel: 'Undergraduate - Intermediate'
  },

  // Lesson 5-4: Final Classes and Methods
  'mod5-lesson5-4': {
    videoId: 'fFnKzhgFL6U',
    title: 'Final Keyword in Java - Classes, Methods, Variables',
    channel: 'Telusko',
    channelUrl: 'https://www.youtube.com/@Telusko',
    duration: '13:40',
    description: 'Comprehensive lecture on the final keyword: final classes that cannot be extended, final methods that cannot be overridden, final variables as constants, immutability and security benefits, preventing inheritance, method overriding prevention, constant declaration patterns, and final keyword best practices.',
    fullUrl: 'https://www.youtube.com/watch?v=fFnKzhgFL6U',
    citation: 'Telusko. (2020). Final keyword in Java - Classes, methods, variables [Video]. YouTube. https://www.youtube.com/watch?v=fFnKzhgFL6U',
    lectureTopics: [
      'Final Classes (Cannot be Extended)',
      'Final Methods (Cannot be Overridden)',
      'Final Variables (Constants)',
      'Immutability and Security',
      'Final Keyword Best Practices'
    ],
    academicLevel: 'Undergraduate - Intermediate'
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
    description: 'Complete lecture on Java interfaces: interface concept as pure abstraction, interface declaration syntax, abstract methods in interfaces, default and static methods (Java 8+), implementing interfaces with implements keyword, multiple interface implementation, polymorphism through interfaces, and interface design patterns.',
    fullUrl: 'https://www.youtube.com/watch?v=kTpp5n_CppQ',
    citation: 'Lee, A. (2019). Java interfaces tutorial [Video]. YouTube. https://www.youtube.com/watch?v=kTpp5n_CppQ',
    lectureTopics: [
      'Interface Concept and Declaration',
      'Abstract Methods in Interfaces',
      'Default and Static Methods (Java 8+)',
      'Implementing Interfaces',
      'Multiple Interface Implementation',
      'Interface-Based Polymorphism'
    ],
    academicLevel: 'Undergraduate - Intermediate'
  },

  // Lesson 6-2: Implementing Interfaces
  'mod6-lesson6-2': {
    videoId: 'GhslBwrRsnw',
    title: 'Implementing Interfaces in Java',
    channel: 'Coding with John',
    channelUrl: 'https://www.youtube.com/@CodingWithJohn',
    duration: '14:25',
    description: 'Practical lecture on interface implementation: using implements keyword, implementing multiple interfaces in single class, overriding all interface methods, interface implementation rules, access modifier requirements, combining inheritance and interfaces, and concrete implementation examples.',
    fullUrl: 'https://www.youtube.com/watch?v=GhslBwrRsnw',
    citation: 'Coding with John. (2021). Implementing interfaces in Java [Video]. YouTube. https://www.youtube.com/watch?v=GhslBwrRsnw',
    lectureTopics: [
      'Implements Keyword Usage',
      'Multiple Interface Implementation',
      'Overriding Interface Methods',
      'Implementation Rules',
      'Combining Inheritance and Interfaces'
    ],
    academicLevel: 'Undergraduate - Intermediate'
  },

  // Lesson 6-3: Multiple Inheritance with Interfaces
  'mod6-lesson6-3': {
    videoId: 'TS-qDKQ4kMI',
    title: 'Multiple Inheritance in Java Using Interfaces',
    channel: 'Telusko',
    channelUrl: 'https://www.youtube.com/@Telusko',
    duration: '12:50',
    description: 'Lecture on multiple inheritance through interfaces: achieving multiple inheritance with interfaces (not classes), implementing multiple interfaces simultaneously, resolving method name conflicts, diamond problem and its solution in Java, interface inheritance hierarchies, and multiple interface implementation design patterns.',
    fullUrl: 'https://www.youtube.com/watch?v=TS-qDKQ4kMI',
    citation: 'Telusko. (2020). Multiple inheritance in Java using interfaces [Video]. YouTube. https://www.youtube.com/watch?v=TS-qDKQ4kMI',
    lectureTopics: [
      'Multiple Inheritance Concept',
      'Implementing Multiple Interfaces',
      'Resolving Method Conflicts',
      'Diamond Problem Solution',
      'Interface Inheritance Hierarchies'
    ],
    academicLevel: 'Undergraduate - Intermediate'
  },

  // Lesson 6-4: Interface vs Abstract Class
  'mod6-lesson6-4': {
    videoId: 'au6FVSDblpc',
    title: 'Interface vs Abstract Class in Java',
    channel: 'Programming with Mosh',
    channelUrl: 'https://www.youtube.com/@programmingwithmosh',
    duration: '12:35',
    description: 'Comparative lecture by Mosh Hamedani: differences between interfaces and abstract classes, feature comparison (methods, variables, constructors), multiple implementation vs single inheritance, when to choose interfaces, when to choose abstract classes, design decision criteria, use case scenarios, and best practices for abstraction mechanisms.',
    fullUrl: 'https://www.youtube.com/watch?v=au6FVSDblpc',
    citation: 'Hamedani, M. (2019). Interface vs abstract class in Java [Video]. YouTube. https://www.youtube.com/watch?v=au6FVSDblpc',
    lectureTopics: [
      'Interface vs Abstract Class Comparison',
      'Feature Differences',
      'Multiple Implementation vs Single Inheritance',
      'When to Choose Each',
      'Design Decision Criteria'
    ],
    academicLevel: 'Undergraduate - Intermediate'
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
    description: 'Foundational lecture on encapsulation by Mosh Hamedani: encapsulation as data hiding principle, bundling data with methods, information hiding benefits, access modifiers (private, public, protected, default), getter and setter methods, encapsulation for data integrity, and encapsulation design patterns.',
    fullUrl: 'https://www.youtube.com/watch?v=cU94So54cr8',
    citation: 'Hamedani, M. (2018). Java encapsulation explained [Video]. YouTube. https://www.youtube.com/watch?v=cU94So54cr8',
    lectureTopics: [
      'Encapsulation as Data Hiding',
      'Bundling Data with Methods',
      'Information Hiding Benefits',
      'Access Modifiers Overview',
      'Getters and Setters',
      'Encapsulation Design Patterns'
    ],
    academicLevel: 'Undergraduate - Introductory'
  },

  // Lesson 7-2: Access Modifiers
  'mod7-lesson7-2': {
    videoId: 'YC4vVl664qY',
    title: 'Access Modifiers in Java - Public, Private, Protected',
    channel: 'Coding with John',
    channelUrl: 'https://www.youtube.com/@CodingWithJohn',
    duration: '11:45',
    description: 'Detailed lecture on access modifiers and visibility control: public access (accessible everywhere), private access (class-level only), protected access (package and subclasses), default/package-private access, visibility scope rules, access control for encapsulation, choosing appropriate access levels, and access modifier best practices.',
    fullUrl: 'https://www.youtube.com/watch?v=YC4vVl664qY',
    citation: 'Coding with John. (2021). Access modifiers in Java - Public, private, protected [Video]. YouTube. https://www.youtube.com/watch?v=YC4vVl664qY',
    lectureTopics: [
      'Public Access Modifier',
      'Private Access Modifier',
      'Protected Access Modifier',
      'Default/Package-Private Access',
      'Visibility Scope Rules',
      'Access Control Best Practices'
    ],
    academicLevel: 'Undergraduate - Introductory'
  },

  // Lesson 7-3: Getters and Setters
  'mod7-lesson7-3': {
    videoId: 'TKOTKfT3OQs',
    title: 'Java Getters and Setters Tutorial',
    channel: 'Alex Lee',
    channelUrl: 'https://www.youtube.com/@alexlorenlee',
    duration: '13:20',
    description: 'Practical lecture on accessor and mutator methods: creating getter methods for field access, setter methods for field modification, controlling access to private fields, data validation in setter methods, read-only properties (getters only), write-only properties (setters only), JavaBeans naming conventions, and getter/setter best practices.',
    fullUrl: 'https://www.youtube.com/watch?v=TKOTKfT3OQs',
    citation: 'Lee, A. (2019). Java getters and setters tutorial [Video]. YouTube. https://www.youtube.com/watch?v=TKOTKfT3OQs',
    lectureTopics: [
      'Getter Methods (Accessors)',
      'Setter Methods (Mutators)',
      'Controlling Field Access',
      'Data Validation in Setters',
      'Read-Only and Write-Only Properties',
      'JavaBeans Naming Conventions'
    ],
    academicLevel: 'Undergraduate - Introductory'
  },

  // Lesson 7-4: Packages
  'mod7-lesson7-4': {
    videoId: 'vR8LRqxINeE',
    title: 'Java Packages Explained',
    channel: 'Telusko',
    channelUrl: 'https://www.youtube.com/@Telusko',
    duration: '15:10',
    description: 'Lecture on Java package system: organizing classes into packages, package declaration and naming conventions, creating custom packages, using import statements, package hierarchy and structure, built-in Java packages, avoiding naming conflicts, and package organization best practices.',
    fullUrl: 'https://www.youtube.com/watch?v=vR8LRqxINeE',
    citation: 'Telusko. (2020). Java packages explained [Video]. YouTube. https://www.youtube.com/watch?v=vR8LRqxINeE',
    lectureTopics: [
      'Package Concept and Organization',
      'Package Declaration Syntax',
      'Package Naming Conventions',
      'Import Statements',
      'Package Hierarchy',
      'Avoiding Naming Conflicts'
    ],
    academicLevel: 'Undergraduate - Introductory'
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
    description: 'Foundational lecture on exception handling: what exceptions are and when they occur, exception types (checked vs unchecked exceptions), exception hierarchy (Throwable, Exception, Error), common exception types, why exception handling is important for robust applications, and exception handling mechanisms overview.',
    fullUrl: 'https://www.youtube.com/watch?v=xoL9JFI-lGM',
    citation: 'Telusko. (2020). Java exception handling tutorial [Video]. YouTube. https://www.youtube.com/watch?v=xoL9JFI-lGM',
    lectureTopics: [
      'Exception Concept and Causes',
      'Checked vs Unchecked Exceptions',
      'Exception Hierarchy',
      'Common Exception Types',
      'Importance of Exception Handling'
    ],
    academicLevel: 'Undergraduate - Intermediate'
  },

  // Lesson 8-2: Try-Catch Blocks
  'mod8-lesson8-2': {
    videoId: '1XAfapkBQjk',
    title: 'Try-Catch Blocks in Java',
    channel: 'Coding with John',
    channelUrl: 'https://www.youtube.com/@CodingWithJohn',
    duration: '16:30',
    description: 'Practical lecture on exception handling with try-catch: try-catch block syntax and structure, catching specific exception types, multiple catch blocks for different exceptions, catch block ordering rules, exception object methods, handling different exception scenarios, and preventing program crashes through proper exception handling.',
    fullUrl: 'https://www.youtube.com/watch?v=1XAfapkBQjk',
    citation: 'Coding with John. (2021). Try-catch blocks in Java [Video]. YouTube. https://www.youtube.com/watch?v=1XAfapkBQjk',
    lectureTopics: [
      'Try-Catch Block Syntax',
      'Catching Specific Exceptions',
      'Multiple Catch Blocks',
      'Catch Block Ordering',
      'Exception Object Methods',
      'Preventing Program Crashes'
    ],
    academicLevel: 'Undergraduate - Intermediate'
  },

  // Lesson 8-3: Finally Block
  'mod8-lesson8-3': {
    videoId: 'jj6O2z1_jy0',
    title: 'Finally Block in Java Exception Handling',
    channel: 'Alex Lee',
    channelUrl: 'https://www.youtube.com/@alexlorenlee',
    duration: '10:45',
    description: 'Lecture on finally block for cleanup code: understanding finally block purpose, try-catch-finally structure, finally block execution guarantee, cleanup code patterns, resource management with finally, when finally doesn\'t execute (System.exit), and finally block best practices.',
    fullUrl: 'https://www.youtube.com/watch?v=jj6O2z1_jy0',
    citation: 'Lee, A. (2019). Finally block in Java exception handling [Video]. YouTube. https://www.youtube.com/watch?v=jj6O2z1_jy0',
    lectureTopics: [
      'Finally Block Purpose',
      'Try-Catch-Finally Structure',
      'Finally Execution Guarantee',
      'Cleanup Code Patterns',
      'Resource Management'
    ],
    academicLevel: 'Undergraduate - Intermediate'
  },

  // Lesson 8-4: Throw and Throws
  'mod8-lesson8-4': {
    videoId: 'olvSZKcNDvw',
    title: 'Throw and Throws Keywords in Java',
    channel: 'Programming with Mosh',
    channelUrl: 'https://www.youtube.com/@programmingwithmosh',
    duration: '13:15',
    description: 'Lecture by Mosh Hamedani on throw and throws keywords: using throw to explicitly throw exceptions, throws keyword for method exception declaration, difference between throw and throws, exception propagation mechanism, re-throwing exceptions, and throwing custom exception types.',
    fullUrl: 'https://www.youtube.com/watch?v=olvSZKcNDvw',
    citation: 'Hamedani, M. (2019). Throw and throws keywords in Java [Video]. YouTube. https://www.youtube.com/watch?v=olvSZKcNDvw',
    lectureTopics: [
      'throw Keyword for Throwing Exceptions',
      'throws Keyword for Method Declaration',
      'Difference Between throw and throws',
      'Exception Propagation',
      'Re-throwing Exceptions'
    ],
    academicLevel: 'Undergraduate - Intermediate'
  },

  // Lesson 8-5: Custom Exceptions
  'mod8-lesson8-5': {
    videoId: 'W-N2ltgU-X4',
    title: 'Creating Custom Exceptions in Java',
    channel: 'Telusko',
    channelUrl: 'https://www.youtube.com/@Telusko',
    duration: '10:55',
    description: 'Lecture on creating custom exception classes: extending Exception class to create custom exceptions, creating meaningful exception messages, adding custom exception properties, throwing custom exceptions, handling application-specific errors, designing exception hierarchies, and custom exception best practices.',
    fullUrl: 'https://www.youtube.com/watch?v=W-N2ltgU-X4',
    citation: 'Telusko. (2020). Creating custom exceptions in Java [Video]. YouTube. https://www.youtube.com/watch?v=W-N2ltgU-X4',
    lectureTopics: [
      'Extending Exception Class',
      'Custom Exception Creation',
      'Meaningful Exception Messages',
      'Custom Exception Properties',
      'Application-Specific Error Handling',
      'Exception Hierarchy Design'
    ],
    academicLevel: 'Undergraduate - Intermediate'
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
    description: 'Comprehensive lecture by Mosh Hamedani on Collections Framework: overview of Java Collections Framework architecture, Collection interface hierarchy, List interface and implementations, Set interface and implementations, Queue interface, Map interface and implementations, collections vs arrays comparison, choosing appropriate collection types, and generics with collections.',
    fullUrl: 'https://www.youtube.com/watch?v=oKhWSRqgGMQ',
    citation: 'Hamedani, M. (2019). Java Collections Framework tutorial [Video]. YouTube. https://www.youtube.com/watch?v=oKhWSRqgGMQ',
    lectureTopics: [
      'Collections Framework Architecture',
      'Collection Interface Hierarchy',
      'List, Set, Queue Interfaces',
      'Map Interface',
      'Collections vs Arrays',
      'Generics with Collections'
    ],
    academicLevel: 'Undergraduate - Intermediate'
  },

  // Lesson 9-2: ArrayList
  'mod9-lesson9-2': {
    videoId: 'NbYgm0r7u6o',
    title: 'Java ArrayList Tutorial',
    channel: 'Coding with John',
    channelUrl: 'https://www.youtube.com/@CodingWithJohn',
    duration: '18:15',
    description: 'In-depth lecture on ArrayList: creating ArrayList instances, generic type specification, adding elements (add method), removing elements (remove method), accessing elements (get method), modifying elements (set method), ArrayList methods (contains, indexOf, size, isEmpty), iterating over ArrayList with for-each loop and iterator, and dynamic array resizing behavior.',
    fullUrl: 'https://www.youtube.com/watch?v=NbYgm0r7u6o',
    citation: 'Coding with John. (2021). Java ArrayList tutorial [Video]. YouTube. https://www.youtube.com/watch?v=NbYgm0r7u6o',
    lectureTopics: [
      'Creating ArrayList Instances',
      'Adding and Removing Elements',
      'Accessing and Modifying Elements',
      'ArrayList Methods',
      'Iterating Over ArrayList',
      'Dynamic Array Resizing'
    ],
    academicLevel: 'Undergraduate - Intermediate'
  },

  // Lesson 9-3: LinkedList
  'mod9-lesson9-3': {
    videoId: '6WxbjhXW2SY',
    title: 'Java LinkedList Explained',
    channel: 'Alex Lee',
    channelUrl: 'https://www.youtube.com/@alexlorenlee',
    duration: '14:40',
    description: 'Lecture on LinkedList data structure: doubly-linked list implementation, node structure and pointers, LinkedList vs ArrayList performance comparison, when to use LinkedList, addFirst and addLast methods, LinkedList as Queue and Deque, insertion and deletion operations, and performance characteristics (time complexity).',
    fullUrl: 'https://www.youtube.com/watch?v=6WxbjhXW2SY',
    citation: 'Lee, A. (2019). Java LinkedList explained [Video]. YouTube. https://www.youtube.com/watch?v=6WxbjhXW2SY',
    lectureTopics: [
      'Doubly-Linked List Structure',
      'LinkedList vs ArrayList',
      'addFirst and addLast Methods',
      'LinkedList as Queue/Deque',
      'Insertion and Deletion Operations',
      'Performance Characteristics'
    ],
    academicLevel: 'Undergraduate - Intermediate'
  },

  // Lesson 9-4: HashSet
  'mod9-lesson9-4': {
    videoId: 'QfRSeibcqBU',
    title: 'Java HashSet Tutorial',
    channel: 'Telusko',
    channelUrl: 'https://www.youtube.com/@Telusko',
    duration: '12:25',
    description: 'Lecture on HashSet collection: Set interface characteristics, unique elements only (no duplicates), HashSet implementation using hash table, hash function and bucket mechanism, HashSet methods (add, remove, contains), unordered collection nature, collision handling, and HashSet use cases for duplicate prevention.',
    fullUrl: 'https://www.youtube.com/watch?v=QfRSeibcqBU',
    citation: 'Telusko. (2020). Java HashSet tutorial [Video]. YouTube. https://www.youtube.com/watch?v=QfRSeibcqBU',
    lectureTopics: [
      'Set Interface Characteristics',
      'Unique Elements (No Duplicates)',
      'HashSet Implementation',
      'Hash Function and Buckets',
      'HashSet Methods',
      'Collision Handling'
    ],
    academicLevel: 'Undergraduate - Intermediate'
  },

  // Lesson 9-5: HashMap
  'mod9-lesson9-5': {
    videoId: 'H62Jfv1DJlU',
    title: 'Java HashMap Tutorial',
    channel: 'Programming with Mosh',
    channelUrl: 'https://www.youtube.com/@programmingwithmosh',
    duration: '15:40',
    description: 'Comprehensive lecture by Mosh Hamedani on HashMap: key-value pair storage, Map interface implementation, put method for adding entries, get method for retrieval, HashMap methods (containsKey, containsValue, remove, size), iterating over HashMap (keySet, values, entrySet), hash collision handling with chaining, and HashMap performance characteristics.',
    fullUrl: 'https://www.youtube.com/watch?v=H62Jfv1DJlU',
    citation: 'Hamedani, M. (2019). Java HashMap tutorial [Video]. YouTube. https://www.youtube.com/watch?v=H62Jfv1DJlU',
    lectureTopics: [
      'Key-Value Pair Storage',
      'put and get Methods',
      'HashMap Methods',
      'Iterating Over HashMap',
      'Hash Collision Handling',
      'Performance Characteristics'
    ],
    academicLevel: 'Undergraduate - Intermediate'
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
    description: 'Fundamental lecture on file input/output operations: FileReader class for reading text files, FileWriter class for writing text files, BufferedReader and BufferedWriter for efficient I/O operations, reading files line by line, writing data to files, character streams vs byte streams, closing file resources properly, and file I/O exception handling.',
    fullUrl: 'https://www.youtube.com/watch?v=ScUJx4aWRi0',
    citation: 'Lee, A. (2019). Java file I/O tutorial [Video]. YouTube. https://www.youtube.com/watch?v=ScUJx4aWRi0',
    lectureTopics: [
      'FileReader and FileWriter Classes',
      'BufferedReader and BufferedWriter',
      'Reading Files Line by Line',
      'Writing Data to Files',
      'Character Streams vs Byte Streams',
      'Resource Management and Exception Handling'
    ],
    academicLevel: 'Undergraduate - Intermediate'
  },

  // Lesson 10-2: Working with Files
  'mod10-lesson10-2': {
    videoId: 'EblFl-T9BsM',
    title: 'Java File Class and File Handling',
    channel: 'Coding with John',
    channelUrl: 'https://www.youtube.com/@CodingWithJohn',
    duration: '12:50',
    description: 'Lecture on File class operations: creating File objects, checking file existence (exists method), creating new files and directories (createNewFile, mkdir, mkdirs), file metadata (getName, getPath, getAbsolutePath, length), deleting files and directories (delete method), listing directory contents (list, listFiles), and file system operations.',
    fullUrl: 'https://www.youtube.com/watch?v=EblFl-T9BsM',
    citation: 'Coding with John. (2021). Java File class and file handling [Video]. YouTube. https://www.youtube.com/watch?v=EblFl-T9BsM',
    lectureTopics: [
      'File Class and File Objects',
      'Checking File Existence',
      'Creating Files and Directories',
      'File Metadata Methods',
      'Deleting Files',
      'Listing Directory Contents'
    ],
    academicLevel: 'Undergraduate - Intermediate'
  },

  // Lesson 10-3: Try-with-Resources
  'mod10-lesson10-3': {
    videoId: 'hLfDCI8aJDM',
    title: 'Try-with-Resources in Java',
    channel: 'Telusko',
    channelUrl: 'https://www.youtube.com/@Telusko',
    duration: '11:30',
    description: 'Lecture on automatic resource management: try-with-resources statement syntax, AutoCloseable interface, automatic resource closing, preventing resource leaks, multiple resources in single try statement, try-with-resources vs traditional try-finally, exception suppression, and resource management best practices for file I/O operations.',
    fullUrl: 'https://www.youtube.com/watch?v=hLfDCI8aJDM',
    citation: 'Telusko. (2020). Try-with-resources in Java [Video]. YouTube. https://www.youtube.com/watch?v=hLfDCI8aJDM',
    lectureTopics: [
      'Try-with-Resources Syntax',
      'AutoCloseable Interface',
      'Automatic Resource Closing',
      'Preventing Resource Leaks',
      'Multiple Resources Management',
      'Resource Management Best Practices'
    ],
    academicLevel: 'Undergraduate - Intermediate'
  },

  // Lesson 10-4: Serialization
  'mod10-lesson10-4': {
    videoId: 'iR5gNdqBW4o',
    title: 'Java Serialization and Deserialization',
    channel: 'Programming with Mosh',
    channelUrl: 'https://www.youtube.com/@programmingwithmosh',
    duration: '14:55',
    description: 'Lecture by Mosh Hamedani on object serialization: object serialization concept, converting objects to byte streams, Serializable interface marker interface, ObjectOutputStream for writing objects, ObjectInputStream for reading objects, saving objects to files and network transmission, deserialization process, transient keyword for skipping fields, and serialization version control with serialVersionUID.',
    fullUrl: 'https://www.youtube.com/watch?v=iR5gNdqBW4o',
    citation: 'Hamedani, M. (2019). Java serialization and deserialization [Video]. YouTube. https://www.youtube.com/watch?v=iR5gNdqBW4o',
    lectureTopics: [
      'Object Serialization Concept',
      'Serializable Interface',
      'ObjectOutputStream and ObjectInputStream',
      'Saving and Loading Objects',
      'Deserialization Process',
      'transient Keyword',
      'serialVersionUID Version Control'
    ],
    academicLevel: 'Undergraduate - Intermediate'
  },

  // Lesson 10-5: NIO Package
  'mod10-lesson10-5': {
    videoId: 'bx2JgPYHUmE',
    title: 'Java NIO (New I/O) Tutorial',
    channel: 'Alex Lee',
    channelUrl: 'https://www.youtube.com/@alexlorenlee',
    duration: '17:20',
    description: 'Advanced lecture on Java NIO (New I/O) package: introduction to NIO.2 features (Java 7+), Path interface for file paths, Files class utility methods, modern file operations (readAllLines, write, copy, move, delete), file attributes and metadata, working with directories and directory streams, NIO advantages over traditional I/O, and non-blocking I/O capabilities.',
    fullUrl: 'https://www.youtube.com/watch?v=bx2JgPYHUmE',
    citation: 'Lee, A. (2019). Java NIO (New I/O) tutorial [Video]. YouTube. https://www.youtube.com/watch?v=bx2JgPYHUmE',
    lectureTopics: [
      'NIO.2 Features (Java 7+)',
      'Path and Files Classes',
      'Modern File Operations',
      'File Attributes and Metadata',
      'Working with Directories',
      'NIO vs Traditional I/O Advantages'
    ],
    academicLevel: 'Undergraduate - Advanced'
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
    description: 'Comprehensive Java programming course by Mosh Hamedani covering fundamental concepts: Java syntax and structure, variables and data types, operators and expressions, control flow statements, methods and functions, object-oriented programming principles, classes and objects, inheritance and polymorphism, exception handling, collections framework, and practical programming exercises for beginners.',
    fullUrl: 'https://www.youtube.com/watch?v=eIrMbAQSU34',
    citation: 'Hamedani, M. (2017). Java tutorial for beginners - Complete course [Video]. YouTube. https://www.youtube.com/watch?v=eIrMbAQSU34',
    lectureTopics: [
      'Java Fundamentals and Syntax',
      'Variables, Data Types, and Operators',
      'Control Flow and Loops',
      'Object-Oriented Programming',
      'Inheritance and Polymorphism',
      'Exception Handling',
      'Collections Framework Basics'
    ],
    academicLevel: 'Undergraduate - Introductory'
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

// Get lecture topics for a lesson
export function getLectureTopic(lessonId: string): string[] {
  const video = getLessonVideo(lessonId);
  return video.lectureTopics || [];
}

// Get academic level for a lesson
export function getAcademicLevel(lessonId: string): string {
  const video = getLessonVideo(lessonId);
  return video.academicLevel || 'Undergraduate';
}
