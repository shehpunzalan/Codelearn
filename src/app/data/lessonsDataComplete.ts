import { Lesson } from '../types';

// This file contains lesson-specific Real-World Examples, Quiz Questions, and Summaries
// for all 111 lessons across all 10 modules

export const lessonEnhancements: Record<string, {
  realWorldExamples: Array<{title: string; description: string; category: string}>;
  quiz: Array<{id: string; question: string; options: string[]; correctAnswer: string}>;
  summary: {keyTakeaways: string[]; nextSteps: string[]};
}> = {
  // Module 1: Java Fundamentals
  'lesson1-2': {
    realWorldExamples: [
      {
        title: 'E-Commerce Product Catalog',
        description: 'Online stores use variables to store product information like price (double), quantity (int), product name (String), and availability (boolean). This data drives the entire shopping experience.',
        category: 'E-Commerce System'
      },
      {
        title: 'Banking Transaction System',
        description: 'Banks use variables to track account balances (double), account numbers (long), customer names (String), and account status (boolean) for millions of transactions daily.',
        category: 'Financial Application'
      },
      {
        title: 'Weather Monitoring App',
        description: 'Weather applications store temperature readings (float/double), humidity (int), weather conditions (String), and alert status (boolean) to provide real-time weather updates.',
        category: 'Data Monitoring'
      }
    ],
    quiz: [
      {
        id: 'q1-2-1',
        question: 'Which data type should be used to store a student\'s GPA?',
        options: ['double', 'int', 'boolean', 'char'],
        correctAnswer: 'double'
      },
      {
        id: 'q1-2-2',
        question: 'What is the default value of a boolean variable?',
        options: ['false', 'true', '0', 'null'],
        correctAnswer: 'false'
      },
      {
        id: 'q1-2-3',
        question: 'Which of these is a reference type in Java?',
        options: ['String', 'int', 'double', 'boolean'],
        correctAnswer: 'String'
      }
    ],
    summary: {
      keyTakeaways: [
        'Java has 8 primitive data types: byte, short, int, long, float, double, char, boolean',
        'Variables must be declared with a specific type before use',
        'String is a reference type, not a primitive type',
        'Use appropriate data types to optimize memory and performance'
      ],
      nextSteps: [
        'Practice declaring and initializing different types of variables',
        'Experiment with type conversion and casting',
        'Move on to operators to perform calculations with variables'
      ]
    }
  },
  'lesson1-3': {
    realWorldExamples: [
      {
        title: 'Calculator Applications',
        description: 'Calculator apps use arithmetic operators (+, -, *, /, %) to perform mathematical operations. Complex scientific calculators combine multiple operators for advanced computations.',
        category: 'Utility Software'
      },
      {
        title: 'Game Score Systems',
        description: 'Video games use relational and logical operators to determine win conditions, compare scores, check if players meet level requirements, and calculate achievements.',
        category: 'Gaming'
      },
      {
        title: 'Inventory Management',
        description: 'Warehouse systems use operators to calculate stock levels, compare quantities, determine reorder points, and validate inventory transactions.',
        category: 'Business Software'
      }
    ],
    quiz: [
      {
        id: 'q1-3-1',
        question: 'What is the result of 10 % 3 in Java?',
        options: ['1', '3', '0', '10'],
        correctAnswer: '1'
      },
      {
        id: 'q1-3-2',
        question: 'Which operator is used to compare two values for equality?',
        options: ['==', '=', '!=', '==='],
        correctAnswer: '=='
      },
      {
        id: 'q1-3-3',
        question: 'What does the && operator require?',
        options: ['Both conditions must be true', 'At least one condition must be true', 'No conditions need to be true', 'Only the first condition matters'],
        correctAnswer: 'Both conditions must be true'
      }
    ],
    summary: {
      keyTakeaways: [
        'Arithmetic operators perform mathematical calculations: +, -, *, /, %',
        'Relational operators compare values: ==, !=, >, <, >=, <=',
        'Logical operators combine boolean conditions: &&, ||, !',
        'Assignment operators modify and assign values: =, +=, -=, *=, /='
      ],
      nextSteps: [
        'Practice combining different operators in expressions',
        'Learn operator precedence and use parentheses for clarity',
        'Proceed to control flow statements to make decisions'
      ]
    }
  },
  'lesson1-4': {
    realWorldExamples: [
      {
        title: 'Student Grading System',
        description: 'Educational platforms use if-else statements to assign letter grades based on numerical scores, determine pass/fail status, and calculate honors eligibility.',
        category: 'Education Technology'
      },
      {
        title: 'Login Authentication',
        description: 'Security systems use conditional statements to verify username and password combinations, check account status, and grant or deny access to applications.',
        category: 'Security System'
      },
      {
        title: 'Shipping Cost Calculator',
        description: 'E-commerce platforms use if-else to calculate shipping costs based on weight ranges, destination zones, and delivery speed options.',
        category: 'E-Commerce'
      }
    ],
    quiz: [
      {
        id: 'q1-4-1',
        question: 'What happens if none of the if-else conditions are true?',
        options: ['The else block executes', 'The program crashes', 'Nothing happens', 'The first if block executes'],
        correctAnswer: 'The else block executes'
      },
      {
        id: 'q1-4-2',
        question: 'How many else if statements can you have in a single if-else structure?',
        options: ['Unlimited', 'Only one', 'Maximum three', 'None'],
        correctAnswer: 'Unlimited'
      },
      {
        id: 'q1-4-3',
        question: 'What is the purpose of nested if statements?',
        options: ['To test multiple related conditions', 'To make code run faster', 'To declare variables', 'To print output'],
        correctAnswer: 'To test multiple related conditions'
      }
    ],
    summary: {
      keyTakeaways: [
        'If-else statements allow conditional execution of code blocks',
        'Conditions are evaluated from top to bottom; first true condition executes',
        'else if enables testing multiple conditions sequentially',
        'Nested if-else structures handle complex decision logic'
      ],
      nextSteps: [
        'Practice writing multi-condition if-else chains',
        'Learn about switch statements as an alternative',
        'Explore loops for repetitive conditional execution'
      ]
    }
  },
  'lesson1-5': {
    realWorldExamples: [
      {
        title: 'Social Media Feed Loading',
        description: 'Social platforms use loops to load and display posts. A for loop iterates through posts array, while infinite scrolling uses while loops to fetch more content as users scroll.',
        category: 'Social Media'
      },
      {
        title: 'Payroll Processing',
        description: 'HR systems use loops to process employee salaries, calculate taxes, generate pay stubs for all employees in a database, and produce monthly reports.',
        category: 'HR Management'
      },
      {
        title: 'Data Validation',
        description: 'Form validation systems use do-while loops to repeatedly prompt users until valid input is received, ensuring data integrity in applications.',
        category: 'Data Processing'
      }
    ],
    quiz: [
      {
        id: 'q1-5-1',
        question: 'Which loop guarantees execution at least once?',
        options: ['do-while', 'while', 'for', 'None of the above'],
        correctAnswer: 'do-while'
      },
      {
        id: 'q1-5-2',
        question: 'What does the "break" statement do in a loop?',
        options: ['Exits the loop immediately', 'Skips to next iteration', 'Pauses the loop', 'Restarts the loop'],
        correctAnswer: 'Exits the loop immediately'
      },
      {
        id: 'q1-5-3',
        question: 'What does "continue" do in a loop?',
        options: ['Skips the rest of current iteration and goes to next', 'Exits the loop', 'Stops the program', 'Restarts from beginning'],
        correctAnswer: 'Skips the rest of current iteration and goes to next'
      }
    ],
    summary: {
      keyTakeaways: [
        'for loop is best when you know the number of iterations',
        'while loop is ideal for condition-based iteration',
        'do-while loop executes at least once before checking condition',
        'break exits the loop, continue skips to next iteration'
      ],
      nextSteps: [
        'Practice writing loops for different scenarios',
        'Learn about nested loops for multi-dimensional iteration',
        'Begin exploring object-oriented programming concepts'
      ]
    }
  },

  // Module 2: Object-Oriented Programming
  'lesson2-1': {
    realWorldExamples: [
      {
        title: 'Car Manufacturing System',
        description: 'Automotive companies model cars as objects with properties (brand, model, color, engine type) and methods (start, accelerate, brake). Each car instance represents a unique vehicle.',
        category: 'Manufacturing'
      },
      {
        title: 'Hospital Management',
        description: 'Healthcare systems model Patients, Doctors, and Appointments as objects. Each object has specific attributes and behaviors, making the complex system organized and maintainable.',
        category: 'Healthcare'
      },
      {
        title: 'Library System',
        description: 'Libraries use OOP to model Books, Members, and Loans. Objects encapsulate data and behavior, enabling easy tracking of book availability, member records, and borrowing history.',
        category: 'Education'
      }
    ],
    quiz: [
      {
        id: 'q2-1-1',
        question: 'What is a class in OOP?',
        options: ['A blueprint for creating objects', 'A variable type', 'A method', 'A loop structure'],
        correctAnswer: 'A blueprint for creating objects'
      },
      {
        id: 'q2-1-2',
        question: 'Which of these is NOT a pillar of OOP?',
        options: ['Compilation', 'Encapsulation', 'Inheritance', 'Polymorphism'],
        correctAnswer: 'Compilation'
      },
      {
        id: 'q2-1-3',
        question: 'What are objects in OOP?',
        options: ['Instances of classes', 'Data types', 'Variables', 'Methods'],
        correctAnswer: 'Instances of classes'
      }
    ],
    summary: {
      keyTakeaways: [
        'OOP organizes code around objects that contain data and behavior',
        'Classes are blueprints; objects are instances of classes',
        'Four pillars of OOP: Encapsulation, Inheritance, Polymorphism, Abstraction',
        'OOP promotes code reusability, modularity, and maintainability'
      ],
      nextSteps: [
        'Learn how to create your own classes',
        'Understand the relationship between classes and objects',
        'Practice modeling real-world entities as classes'
      ]
    }
  },
  'lesson2-2': {
    realWorldExamples: [
      {
        title: 'User Profile System',
        description: 'Social networks define User classes with fields (username, email, bio, profilePicture) and methods (postUpdate, sendMessage, addFriend) to manage user accounts.',
        category: 'Social Platform'
      },
      {
        title: 'Product Management',
        description: 'Retail systems create Product classes with attributes (SKU, name, price, stock) and methods (updatePrice, checkStock, applyDiscount) for inventory control.',
        category: 'Retail System'
      },
      {
        title: 'Course Enrollment',
        description: 'Learning platforms design Course classes with properties (courseCode, title, instructor, credits) and methods (enroll, drop, calculateGrade) for academic management.',
        category: 'Education Platform'
      }
    ],
    quiz: [
      {
        id: 'q2-2-1',
        question: 'What stores the state of an object?',
        options: ['Fields/Attributes', 'Methods', 'Constructors', 'Classes'],
        correctAnswer: 'Fields/Attributes'
      },
      {
        id: 'q2-2-2',
        question: 'What defines the behavior of an object?',
        options: ['Methods', 'Fields', 'Variables', 'Classes'],
        correctAnswer: 'Methods'
      },
      {
        id: 'q2-2-3',
        question: 'What is the naming convention for class names in Java?',
        options: ['PascalCase (first letter uppercase)', 'camelCase', 'snake_case', 'UPPERCASE'],
        correctAnswer: 'PascalCase (first letter uppercase)'
      }
    ],
    summary: {
      keyTakeaways: [
        'Classes define the structure (fields) and behavior (methods) of objects',
        'Fields store object state; methods define object actions',
        'Use meaningful names following Java naming conventions',
        'Access modifiers control field and method visibility'
      ],
      nextSteps: [
        'Practice creating classes for different real-world entities',
        'Learn how to create and use objects from classes',
        'Understand constructors for object initialization'
      ]
    }
  },
  'lesson2-3': {
    realWorldExamples: [
      {
        title: 'Shopping Cart System',
        description: 'E-commerce sites create multiple Cart objects for different users. Each cart object has its own items list, total price, and discount codes, operating independently.',
        category: 'E-Commerce'
      },
      {
        title: 'Email Client',
        description: 'Email applications create Message objects for each email. Every message has unique sender, recipient, subject, and body content stored in separate object instances.',
        category: 'Communication'
      },
      {
        title: 'Task Manager',
        description: 'Project management tools create Task objects with individual deadlines, assignees, status, and priority levels. Each task operates as an independent entity.',
        category: 'Productivity'
      }
    ],
    quiz: [
      {
        id: 'q2-3-1',
        question: 'What keyword is used to create objects in Java?',
        options: ['new', 'create', 'object', 'instance'],
        correctAnswer: 'new'
      },
      {
        id: 'q2-3-2',
        question: 'Can multiple objects be created from one class?',
        options: ['Yes, unlimited objects can be created', 'No, only one object per class', 'Maximum 10 objects', 'Only if the class is public'],
        correctAnswer: 'Yes, unlimited objects can be created'
      },
      {
        id: 'q2-3-3',
        question: 'How do you access object members?',
        options: ['Using the dot (.) operator', 'Using brackets []', 'Using parentheses ()', 'Using arrow ->'],
        correctAnswer: 'Using the dot (.) operator'
      }
    ],
    summary: {
      keyTakeaways: [
        'Objects are created using the "new" keyword',
        'Each object has its own independent copy of instance variables',
        'The dot operator (.) is used to access object fields and methods',
        'Objects are accessed through reference variables'
      ],
      nextSteps: [
        'Create multiple objects and observe their independence',
        'Learn about constructors for better object initialization',
        'Understand object references and memory management'
      ]
    }
  },
  'lesson2-4': {
    realWorldExamples: [
      {
        title: 'Database Connection Pool',
        description: 'Database systems use constructors to initialize connection objects with server address, port, username, password, and connection timeout settings when connections are established.',
        category: 'Database System'
      },
      {
        title: 'Game Character Creation',
        description: 'Video games use overloaded constructors to create characters with default stats, custom stats, or loaded from saved profiles, providing flexibility in character initialization.',
        category: 'Gaming'
      },
      {
        title: 'Payment Gateway',
        description: 'Payment systems use constructors to initialize transaction objects with amount, currency, merchant ID, and optional parameters like discount codes or customer notes.',
        category: 'FinTech'
      }
    ],
    quiz: [
      {
        id: 'q2-4-1',
        question: 'What is the purpose of a constructor?',
        options: ['To initialize objects', 'To delete objects', 'To compare objects', 'To copy objects'],
        correctAnswer: 'To initialize objects'
      },
      {
        id: 'q2-4-2',
        question: 'Do constructors have a return type?',
        options: ['No, constructors have no return type', 'Yes, they return void', 'Yes, they return the class type', 'Yes, they return int'],
        correctAnswer: 'No, constructors have no return type'
      },
      {
        id: 'q2-4-3',
        question: 'What is constructor overloading?',
        options: ['Having multiple constructors with different parameters', 'Having one constructor with many parameters', 'Calling constructors multiple times', 'Constructors that return multiple values'],
        correctAnswer: 'Having multiple constructors with different parameters'
      }
    ],
    summary: {
      keyTakeaways: [
        'Constructors initialize object state when objects are created',
        'Constructors have the same name as the class and no return type',
        'Constructor overloading provides multiple ways to initialize objects',
        'If no constructor is defined, Java provides a default constructor'
      ],
      nextSteps: [
        'Practice creating multiple constructors with different parameters',
        'Learn about constructor chaining using this()',
        'Understand the "this" keyword for better code clarity'
      ]
    }
  },
  'lesson2-5': {
    realWorldExamples: [
      {
        title: 'Form Validation Framework',
        description: 'Web frameworks use "this" to reference current form object when validating fields, enabling methods to access and validate the form\'s own data fields efficiently.',
        category: 'Web Development'
      },
      {
        title: 'Method Chaining (Fluent API)',
        description: 'Query builders use "this" to return the current object, enabling method chaining like query.select().where().orderBy().limit() for readable, fluent code.',
        category: 'Database API'
      },
      {
        title: 'Object Comparison',
        description: 'Sorting algorithms use "this" to compare the current object with other objects of the same type, determining ordering based on object properties.',
        category: 'Algorithm'
      }
    ],
    quiz: [
      {
        id: 'q2-5-1',
        question: 'What does the "this" keyword refer to?',
        options: ['The current object instance', 'The class itself', 'The parent class', 'All objects of the class'],
        correctAnswer: 'The current object instance'
      },
      {
        id: 'q2-5-2',
        question: 'When is "this" keyword commonly used?',
        options: ['To distinguish between instance variables and parameters', 'To create new objects', 'To delete objects', 'To define classes'],
        correctAnswer: 'To distinguish between instance variables and parameters'
      },
      {
        id: 'q2-5-3',
        question: 'Can "this()" be used to call another constructor?',
        options: ['Yes, it enables constructor chaining', 'No, it\'s not allowed', 'Only in abstract classes', 'Only with static methods'],
        correctAnswer: 'Yes, it enables constructor chaining'
      }
    ],
    summary: {
      keyTakeaways: [
        '"this" refers to the current object instance',
        'Used to resolve naming conflicts between fields and parameters',
        'this() calls another constructor in the same class (constructor chaining)',
        'Returning "this" enables method chaining design pattern'
      ],
      nextSteps: [
        'Practice using "this" in constructors and methods',
        'Explore encapsulation and access modifiers',
        'Learn about getter and setter methods'
      ]
    }
  }
};

// Helper function to merge enhancements with lesson data
export function enhanceLesson(lesson: Lesson): Lesson {
  const enhancement = lessonEnhancements[lesson.id];
  const starterCode = stripInstructionalComments(getStarterCodeForLesson(lesson.id, lesson.title));
  
  if (enhancement) {
    return {
      ...lesson,
      starterCode,
      content: {
        ...lesson.content,
        realWorldExamples: enhancement.realWorldExamples,
        quiz: enhancement.quiz,
        summary: enhancement.summary
      }
    };
  }
  return {
    ...lesson,
    starterCode
  };
}

// Remove instructional comment lines (// TODO:, // Write, // Add, // Your, // Enter, etc.)
// from Java starter code so students see a clean editor with no directive comments.
function stripInstructionalComments(code: string): string {
  return code
    .split('\n')
    .filter(line => !/^\s*\/\/\s*(TODO|FIXME|Write|Add|Your|Enter|Replace|Start|Begin|Use|Create|Declare|Implement|Override|Note:|Hint|e\.g\.)/.test(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Generate appropriate starter code based on lesson content
function getStarterCodeForLesson(lessonId: string, lessonTitle: string): string {
  // Module 1: Java Fundamentals
  if (lessonId === 'lesson1-1') { // Introduction to Java
    return `public class HelloWorld {
    public static void main(String[] args) {
        // TODO: Print "Hello, World!" to the console
        
    }
}`;
  }
  
  if (lessonId === 'lesson1-2') { // Variables and Data Types
    return `public class Variables {
    public static void main(String[] args) {
        // TODO: Declare variables of different types
        // int, double, boolean, char, String
        
        // TODO: Print the variables
        
    }
}`;
  }
  
  if (lessonId === 'lesson1-3') { // Operators
    return `public class Operators {
    public static void main(String[] args) {
        // TODO: Use arithmetic operators (+, -, *, /, %)
        int a = 10;
        int b = 3;
        
        // TODO: Use comparison operators (==, !=, <, >, <=, >=)
        
        // TODO: Use logical operators (&&, ||, !)
        
    }
}`;
  }
  
  if (lessonId === 'lesson1-4') { // Control Flow
    return `public class ControlFlow {
    public static void main(String[] args) {
        // TODO: Write an if-else statement
        int score = 85;
        
        // TODO: Write a switch statement
        int dayOfWeek = 3;
        
    }
}`;
  }
  
  if (lessonId === 'lesson1-5') { // Loops
    return `public class Loops {
    public static void main(String[] args) {
        // TODO: Write a for loop to print numbers 1-10
        
        // TODO: Write a while loop
        
        // TODO: Write a do-while loop
        
    }
}`;
  }
  
  // Module 2: Classes and Objects
  if (lessonId === 'lesson2-1') { // Defining Classes
    return `public class Student {
    // TODO: Add instance variables (fields)
    // Example: name, studentId, gpa
    
    // TODO: Add methods
    
    public static void main(String[] args) {
        // Test your class here
        
    }
}`;
  }
  
  if (lessonId === 'lesson2-2') { // Creating Objects
    return `public class Book {
    String title;
    String author;
    int pages;
    
    // TODO: Create objects of this class in main
    
    public static void main(String[] args) {
        // TODO: Create Book objects
        
        // TODO: Access and modify object properties
        
    }
}`;
  }
  
  if (lessonId === 'lesson2-3') { // Constructors
    return `public class Car {
    String brand;
    String model;
    int year;
    
    // TODO: Create a default constructor
    
    // TODO: Create a parameterized constructor
    
    public static void main(String[] args) {
        // TODO: Create Car objects using constructors
        
    }
}`;
  }
  
  if (lessonId === 'lesson2-4') { // This Keyword
    return `public class Person {
    String name;
    int age;
    
    // TODO: Use 'this' keyword in constructor
    public Person(String name, int age) {
        // Assign parameters to instance variables using 'this'
        
    }
    
    // TODO: Use 'this' to return current object
    
    public static void main(String[] args) {
        // Test your class
        
    }
}`;
  }
  
  if (lessonId === 'lesson2-5') { // Methods
    return `public class Calculator {
    // TODO: Create methods for basic operations
    
    // TODO: Method with parameters and return value
    public int add(int a, int b) {
        return 0; // Fix this
    }
    
    // TODO: Create more methods (subtract, multiply, divide)
    
    public static void main(String[] args) {
        Calculator calc = new Calculator();
        // Test your methods
        
    }
}`;
  }
  
  // Module 3: Encapsulation and Access Modifiers
  if (lessonId.startsWith('lesson3-')) {
    if (lessonTitle.toLowerCase().includes('encapsulation')) {
      return `public class BankAccount {
    // TODO: Declare private fields
    private double balance;
    
    // TODO: Create public getter methods
    
    // TODO: Create public setter methods with validation
    
    public static void main(String[] args) {
        BankAccount account = new BankAccount();
        // Test encapsulation
        
    }
}`;
    }
    if (lessonTitle.toLowerCase().includes('getter') || lessonTitle.toLowerCase().includes('setter')) {
      return `public class Employee {
    private String name;
    private double salary;
    
    // TODO: Create getter methods
    
    // TODO: Create setter methods with validation
    
    public static void main(String[] args) {
        Employee emp = new Employee();
        // Test getters and setters
        
    }
}`;
    }
  }
  
  // Module 4: Inheritance
  if (lessonId.startsWith('lesson4-')) {
    if (lessonTitle.toLowerCase().includes('inheritance')) {
      return `// Parent class
class Animal {
    String name;
    
    public void eat() {
        System.out.println("This animal eats food");
    }
}

// TODO: Create a child class that extends Animal
class Dog extends Animal {
    // TODO: Add specific properties and methods for Dog
    
}

public class InheritanceDemo {
    public static void main(String[] args) {
        // TODO: Create objects and test inheritance
        
    }
}`;
    }
    if (lessonTitle.toLowerCase().includes('super')) {
      return `class Vehicle {
    String brand;
    
    public Vehicle(String brand) {
        this.brand = brand;
    }
    
    public void display() {
        System.out.println("Brand: " + brand);
    }
}

class Car extends Vehicle {
    int year;
    
    // TODO: Use super() to call parent constructor
    public Car(String brand, int year) {
        // Call parent constructor
        
    }
    
    // TODO: Override display method and use super
    
}

public class SuperKeywordDemo {
    public static void main(String[] args) {
        // Test your code
        
    }
}`;
    }
  }
  
  // Module 5: Polymorphism
  if (lessonId.startsWith('lesson5-')) {
    if (lessonTitle.toLowerCase().includes('polymorphism') || lessonTitle.toLowerCase().includes('override')) {
      return `class Shape {
    public void draw() {
        System.out.println("Drawing a shape");
    }
    
    public double area() {
        return 0;
    }
}

// TODO: Create Circle class that overrides Shape methods
class Circle extends Shape {
    double radius;
    
    // TODO: Override draw() method
    
    // TODO: Override area() method
    
}

// TODO: Create Rectangle class
class Rectangle extends Shape {
    // TODO: Override methods
    
}

public class PolymorphismDemo {
    public static void main(String[] args) {
        // TODO: Demonstrate polymorphism
        
    }
}`;
    }
  }
  
  // Module 6: Abstraction
  if (lessonId.startsWith('lesson6-')) {
    if (lessonTitle.toLowerCase().includes('abstract')) {
      return `// TODO: Create an abstract class
abstract class Employee {
    String name;
    
    // TODO: Add abstract method
    public abstract double calculateSalary();
    
    // Concrete method
    public void display() {
        System.out.println("Employee: " + name);
    }
}

// TODO: Create concrete subclass
class FullTimeEmployee extends Employee {
    // TODO: Implement abstract method
    
}

public class AbstractionDemo {
    public static void main(String[] args) {
        // Test your code
        
    }
}`;
    }
    if (lessonTitle.toLowerCase().includes('interface')) {
      return `// TODO: Create an interface
interface Drawable {
    void draw();
    void resize();
}

// TODO: Implement the interface
class Circle implements Drawable {
    // TODO: Implement interface methods
    
}

public class InterfaceDemo {
    public static void main(String[] args) {
        // Test your code
        
    }
}`;
    }
  }
  
  // Module 7: Arrays and Collections
  if (lessonId.startsWith('lesson7-')) {
    if (lessonTitle.toLowerCase().includes('array')) {
      return `public class ArrayDemo {
    public static void main(String[] args) {
        // TODO: Declare and initialize an array
        
        // TODO: Access array elements
        
        // TODO: Loop through the array
        
        // TODO: Work with 2D arrays
        
    }
}`;
    }
    if (lessonTitle.toLowerCase().includes('arraylist')) {
      return `import java.util.ArrayList;

public class ArrayListDemo {
    public static void main(String[] args) {
        // TODO: Create an ArrayList
        ArrayList<String> list = new ArrayList<>();
        
        // TODO: Add elements
        
        // TODO: Remove elements
        
        // TODO: Iterate through the list
        
    }
}`;
    }
  }
  
  // Module 8: Exception Handling
  if (lessonId.startsWith('lesson8-')) {
    if (lessonTitle.toLowerCase().includes('exception')) {
      return `public class ExceptionDemo {
    public static void main(String[] args) {
        // TODO: Use try-catch block
        try {
            // Code that might throw an exception
            
        } catch (Exception e) {
            // Handle the exception
            
        } finally {
            // Cleanup code
            
        }
    }
}`;
    }
    if (lessonTitle.toLowerCase().includes('custom')) {
      return `// TODO: Create a custom exception class
class InvalidAgeException extends Exception {
    public InvalidAgeException(String message) {
        super(message);
    }
}

public class CustomExceptionDemo {
    // TODO: Create a method that throws custom exception
    public static void validateAge(int age) throws InvalidAgeException {
        
    }
    
    public static void main(String[] args) {
        // Test custom exception
        
    }
}`;
    }
  }
  
  // Module 9: File I/O
  if (lessonId.startsWith('lesson9-')) {
    return `import java.io.*;

public class FileIODemo {
    public static void main(String[] args) {
        // TODO: Write to a file
        
        // TODO: Read from a file
        
        // Remember to handle exceptions
        
    }
}`;
  }
  
  // Module 10: Advanced OOP
  if (lessonId.startsWith('lesson10-')) {
    if (lessonTitle.toLowerCase().includes('static')) {
      return `public class StaticDemo {
    // TODO: Create static variables
    static int count = 0;
    
    // TODO: Create static methods
    
    // Instance variables and methods
    
    public static void main(String[] args) {
        // Test static members
        
    }
}`;
    }
  }
  
  // Default starter code for any lesson
  return `public class Practice {
    public static void main(String[] args) {
        // TODO: Write your Java code here
        // Practice the concepts from: ${lessonTitle}
        
    }
}`;
}