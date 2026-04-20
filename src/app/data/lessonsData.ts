import { Lesson } from '../types';

export const module1Lessons: Lesson[] = [
  {
    id: 'lesson1-1',
    title: 'Introduction to Java',
    duration: '15 min',
    completed: true,
    locked: false,
    content: {
      introduction: 'Java is a high-level, class-based, object-oriented programming language designed to have as few implementation dependencies as possible. It was developed by James Gosling at Sun Microsystems and released in 1995.',
      keyConcepts: [
        'Java is platform-independent (Write Once, Run Anywhere)',
        'Java uses a Virtual Machine (JVM) to execute programs',
        'Java is strongly typed and compiled',
        'Java programs are organized into classes and packages'
      ],
      codeExamples: [
        {
          title: 'Hello World Program',
          code: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
          explanation: 'This is the simplest Java program. It defines a class named HelloWorld with a main method that prints "Hello, World!" to the console.'
        }
      ],
      keyPoints: [
        'Every Java application starts with a class definition',
        'The main method is the entry point of the program',
        'System.out.println() is used to print output',
        'Java is case-sensitive'
      ],
      practiceExercise: 'Create a Java program that prints your name and favorite programming language.',
      realWorldExamples: [
        {
          title: 'Android Applications',
          description: 'Android apps are primarily written in Java. The platform-independent nature of Java makes it perfect for mobile development, allowing apps to run on various Android devices regardless of hardware.',
          category: 'Mobile Development'
        },
        {
          title: 'Enterprise Web Applications',
          description: 'Companies like Amazon, LinkedIn, and eBay use Java for their backend systems. Java\'s reliability and scalability make it ideal for handling millions of transactions daily.',
          category: 'Enterprise Software'
        },
        {
          title: 'Scientific Applications',
          description: 'NASA uses Java for various space exploration projects. The language\'s precision and stability are crucial for calculations in scientific computing and simulations.',
          category: 'Scientific Computing'
        }
      ],
      quiz: [
        {
          id: 'q1-1-1',
          question: 'What does "Write Once, Run Anywhere" mean in Java?',
          options: [
            'Java code can run on any platform with JVM',
            'Java code runs faster than other languages',
            'Java requires no compilation',
            'Java can only run on Windows'
          ],
          correctAnswer: 'Java code can run on any platform with JVM'
        },
        {
          id: 'q1-1-2',
          question: 'What is the entry point of a Java application?',
          options: [
            'The main method',
            'The first class',
            'The constructor',
            'The import statement'
          ],
          correctAnswer: 'The main method'
        },
        {
          id: 'q1-1-3',
          question: 'Which statement is used to print output in Java?',
          options: [
            'System.out.println()',
            'print()',
            'console.log()',
            'echo()'
          ],
          correctAnswer: 'System.out.println()'
        }
      ],
      summary: {
        keyTakeaways: [
          'Java is a platform-independent, object-oriented programming language',
          'JVM (Java Virtual Machine) allows Java programs to run on any system',
          'Every Java program starts with a class and a main method',
          'Java is widely used in enterprise, mobile, and scientific applications'
        ],
        nextSteps: [
          'Practice writing and running basic Java programs',
          'Explore Java development tools like Eclipse or IntelliJ IDEA',
          'Learn about variables and data types in the next lesson'
        ]
      }
    }
  },
  {
    id: 'lesson1-2',
    title: 'Variables and Data Types',
    duration: '20 min',
    completed: true,
    locked: false,
    content: {
      introduction: 'Variables are containers for storing data values. In Java, every variable must be declared with a data type. Java has two categories of data types: primitive types and reference types.',
      keyConcepts: [
        'Primitive types: byte, short, int, long, float, double, char, boolean',
        'Reference types: Classes, Interfaces, Arrays',
        'Variables must be declared before use',
        'Java uses camelCase naming convention for variables'
      ],
      codeExamples: [
        {
          title: 'Variable Declaration and Initialization',
          code: `public class Variables {
    public static void main(String[] args) {
        // Integer types
        int age = 25;
        long population = 7800000000L;
        
        // Floating-point types
        double price = 19.99;
        float temperature = 98.6f;
        
        // Character and Boolean
        char grade = 'A';
        boolean isStudent = true;
        
        // String (reference type)
        String name = "John Doe";
        
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Student: " + isStudent);
    }
}`,
          explanation: 'This example demonstrates the declaration and initialization of various primitive data types and String.'
        }
      ],
      keyPoints: [
        'int is used for whole numbers',
        'double is used for decimal numbers',
        'boolean can only be true or false',
        'String is a reference type, not a primitive'
      ],
      practiceExercise: 'Create a program that declares variables for a student\'s name, ID number, GPA, and enrollment status, then prints them.'
    }
  },
  {
    id: 'lesson1-3',
    title: 'Operators in Java',
    duration: '18 min',
    completed: false,
    locked: false,
    content: {
      introduction: 'Operators are special symbols that perform operations on variables and values. Java provides a rich set of operators including arithmetic, relational, logical, and assignment operators.',
      keyConcepts: [
        'Arithmetic operators: +, -, *, /, %',
        'Relational operators: ==, !=, >, <, >=, <=',
        'Logical operators: &&, ||, !',
        'Assignment operators: =, +=, -=, *=, /='
      ],
      codeExamples: [
        {
          title: 'Using Operators',
          code: `public class Operators {
    public static void main(String[] args) {
        // Arithmetic operators
        int a = 10, b = 3;
        System.out.println("Sum: " + (a + b));
        System.out.println("Difference: " + (a - b));
        System.out.println("Product: " + (a * b));
        System.out.println("Quotient: " + (a / b));
        System.out.println("Remainder: " + (a % b));
        
        // Relational operators
        System.out.println("a > b: " + (a > b));
        System.out.println("a == b: " + (a == b));
        
        // Logical operators
        boolean x = true, y = false;
        System.out.println("x && y: " + (x && y));
        System.out.println("x || y: " + (x || y));
        System.out.println("!x: " + (!x));
    }
}`,
          explanation: 'This program demonstrates various operators in Java including arithmetic, relational, and logical operators.'
        }
      ],
      keyPoints: [
        'Division of integers results in integer quotient',
        'Modulus (%) gives the remainder of division',
        'Use == for comparison, = for assignment',
        '&& requires both conditions to be true, || requires at least one'
      ],
      practiceExercise: 'Write a program to calculate the area and perimeter of a rectangle using variables and arithmetic operators.'
    }
  },
  {
    id: 'lesson1-4',
    title: 'Control Flow: If-Else Statements',
    duration: '22 min',
    completed: false,
    locked: false,
    content: {
      introduction: 'Control flow statements allow you to control the execution path of your program based on conditions. The if-else statement is used to execute code conditionally.',
      keyConcepts: [
        'if statement executes code when condition is true',
        'else provides alternative code when condition is false',
        'else if allows multiple conditions to be tested',
        'Nested if-else statements for complex logic'
      ],
      codeExamples: [
        {
          title: 'Grade Evaluation',
          code: `public class GradeEvaluator {
    public static void main(String[] args) {
        int score = 85;
        char grade;
        
        if (score >= 90) {
            grade = 'A';
        } else if (score >= 80) {
            grade = 'B';
        } else if (score >= 70) {
            grade = 'C';
        } else if (score >= 60) {
            grade = 'D';
        } else {
            grade = 'F';
        }
        
        System.out.println("Score: " + score);
        System.out.println("Grade: " + grade);
        
        // Nested if
        if (grade != 'F') {
            if (score >= 85) {
                System.out.println("Excellent work!");
            } else {
                System.out.println("Good job!");
            }
        } else {
            System.out.println("Need improvement");
        }
    }
}`,
          explanation: 'This program evaluates a student\'s grade based on their score using if-else statements and demonstrates nested conditions.'
        }
      ],
      keyPoints: [
        'Conditions are evaluated from top to bottom',
        'Only the first true condition executes',
        'Use curly braces {} for multiple statements',
        'Avoid deeply nested if-else; consider switch instead'
      ],
      practiceExercise: 'Create a program that determines if a number is positive, negative, or zero, and if it\'s even or odd.'
    }
  },
  {
    id: 'lesson1-5',
    title: 'Loops: For and While',
    duration: '25 min',
    completed: false,
    locked: false,
    content: {
      introduction: 'Loops allow you to execute a block of code repeatedly. Java provides three types of loops: for, while, and do-while. Loops are essential for iterating over data and performing repetitive tasks.',
      keyConcepts: [
        'for loop - when you know iteration count',
        'while loop - when condition-based iteration needed',
        'do-while loop - executes at least once',
        'break and continue statements for loop control'
      ],
      codeExamples: [
        {
          title: 'Different Loop Types',
          code: `public class Loops {
    public static void main(String[] args) {
        // For loop - print numbers 1 to 5
        System.out.println("For loop:");
        for (int i = 1; i <= 5; i++) {
            System.out.print(i + " ");
        }
        System.out.println();
        
        // While loop - countdown
        System.out.println("While loop:");
        int count = 5;
        while (count > 0) {
            System.out.print(count + " ");
            count--;
        }
        System.out.println();
        
        // Do-while loop
        System.out.println("Do-while loop:");
        int num = 1;
        do {
            System.out.print(num + " ");
            num++;
        } while (num <= 5);
        System.out.println();
        
        // Using break and continue
        System.out.println("Break example:");
        for (int i = 1; i <= 10; i++) {
            if (i == 6) break;
            System.out.print(i + " ");
        }
        System.out.println();
        
        System.out.println("Continue example:");
        for (int i = 1; i <= 5; i++) {
            if (i == 3) continue;
            System.out.print(i + " ");
        }
    }
}`,
          explanation: 'This program demonstrates for, while, and do-while loops, as well as break and continue statements for loop control.'
        }
      ],
      keyPoints: [
        'for loop has three parts: initialization, condition, update',
        'while checks condition before executing',
        'do-while checks condition after executing',
        'break exits the loop, continue skips to next iteration'
      ],
      practiceExercise: 'Write a program that calculates the sum of all numbers from 1 to 100 using a loop.'
    }
  }
];

export const module2Lessons: Lesson[] = [
  {
    id: 'lesson2-1',
    title: 'Introduction to OOP',
    duration: '20 min',
    completed: false,
    locked: false,
    content: {
      introduction: 'Object-Oriented Programming (OOP) is a programming paradigm based on the concept of "objects" which contain data and code. Java is a fully object-oriented language built on four main principles: Encapsulation, Inheritance, Polymorphism, and Abstraction.',
      keyConcepts: [
        'Objects are instances of classes',
        'Classes are blueprints for objects',
        'OOP promotes code reusability and modularity',
        'Real-world entities can be modeled as objects'
      ],
      codeExamples: [
        {
          title: 'OOP Concept Overview',
          code: `// Class definition (blueprint)
public class Car {
    // Properties (data)
    String brand;
    String model;
    int year;
    
    // Behavior (methods)
    void start() {
        System.out.println("Car is starting...");
    }
    
    void drive() {
        System.out.println("Car is driving...");
    }
}`,
          explanation: 'This example shows how a real-world entity (Car) can be modeled as a class with properties and behaviors.'
        }
      ],
      keyPoints: [
        'Classes define the structure and behavior of objects',
        'Objects are created from classes',
        'Each object has its own state (data)',
        'OOP makes code more organized and maintainable'
      ],
      practiceExercise: 'Think of a real-world object and list its properties and behaviors. How would you model it in Java?'
    }
  },
  {
    id: 'lesson2-2',
    title: 'Creating Classes',
    duration: '25 min',
    completed: false,
    locked: false,
    content: {
      introduction: 'A class is a template or blueprint for creating objects. It defines the properties (fields/attributes) and behaviors (methods) that objects of the class will have.',
      keyConcepts: [
        'Class declaration uses the "class" keyword',
        'Fields store the state of an object',
        'Methods define the behavior of an object',
        'Access modifiers control visibility'
      ],
      codeExamples: [
        {
          title: 'Student Class',
          code: `public class Student {
    // Fields (attributes)
    String name;
    int studentId;
    double gpa;
    String major;
    
    // Methods (behaviors)
    void study() {
        System.out.println(name + " is studying " + major);
    }
    
    void displayInfo() {
        System.out.println("Student ID: " + studentId);
        System.out.println("Name: " + name);
        System.out.println("Major: " + major);
        System.out.println("GPA: " + gpa);
    }
    
    boolean isHonorStudent() {
        return gpa >= 3.5;
    }
}`,
          explanation: 'This Student class has four fields representing student data and three methods defining student behaviors.'
        }
      ],
      keyPoints: [
        'Fields are declared inside the class but outside methods',
        'Methods can access and modify fields',
        'Use meaningful names for classes, fields, and methods',
        'Class names should start with uppercase letter'
      ],
      practiceExercise: 'Create a "Book" class with fields for title, author, ISBN, and price, plus methods to display book info and apply a discount.'
    }
  },
  {
    id: 'lesson2-3',
    title: 'Creating and Using Objects',
    duration: '23 min',
    completed: false,
    locked: false,
    content: {
      introduction: 'Objects are instances of classes. Creating an object involves allocating memory for it and initializing its fields. The "new" keyword is used to create objects in Java.',
      keyConcepts: [
        'Objects are created using the "new" keyword',
        'Each object has its own copy of instance variables',
        'Dot operator (.) accesses object members',
        'Multiple objects can be created from one class'
      ],
      codeExamples: [
        {
          title: 'Creating and Using Student Objects',
          code: `public class StudentDemo {
    public static void main(String[] args) {
        // Creating objects
        Student student1 = new Student();
        Student student2 = new Student();
        
        // Setting field values for student1
        student1.name = "Alice Johnson";
        student1.studentId = 12345;
        student1.gpa = 3.8;
        student1.major = "Computer Science";
        
        // Setting field values for student2
        student2.name = "Bob Smith";
        student2.studentId = 12346;
        student2.gpa = 3.3;
        student2.major = "Information Technology";
        
        // Using methods
        student1.displayInfo();
        System.out.println("Honor Student: " + student1.isHonorStudent());
        System.out.println();
        
        student2.displayInfo();
        System.out.println("Honor Student: " + student2.isHonorStudent());
        
        student1.study();
        student2.study();
    }
}`,
          explanation: 'This program creates two Student objects, assigns different values to their fields, and calls their methods.'
        }
      ],
      keyPoints: [
        'new keyword allocates memory for the object',
        'Each object has independent field values',
        'Objects are accessed through reference variables',
        'null means the reference variable doesn\'t point to any object'
      ],
      practiceExercise: 'Create multiple Book objects from your Book class and demonstrate calling their methods.'
    }
  },
  {
    id: 'lesson2-4',
    title: 'Constructors',
    duration: '28 min',
    completed: false,
    locked: false,
    content: {
      introduction: 'A constructor is a special method used to initialize objects. It has the same name as the class and is called automatically when an object is created. Constructors can be overloaded to provide different ways of initializing objects.',
      keyConcepts: [
        'Constructors have the same name as the class',
        'Constructors have no return type',
        'Default constructor is provided if none defined',
        'Constructor overloading allows multiple initialization options'
      ],
      codeExamples: [
        {
          title: 'Student Class with Constructors',
          code: `public class Student {
    String name;
    int studentId;
    double gpa;
    String major;
    
    // Default constructor
    public Student() {
        name = "Unknown";
        studentId = 0;
        gpa = 0.0;
        major = "Undeclared";
    }
    
    // Parameterized constructor
    public Student(String name, int studentId, String major) {
        this.name = name;
        this.studentId = studentId;
        this.major = major;
        this.gpa = 0.0; // Default GPA
    }
    
    // Fully parameterized constructor
    public Student(String name, int studentId, double gpa, String major) {
        this.name = name;
        this.studentId = studentId;
        this.gpa = gpa;
        this.major = major;
    }
    
    void displayInfo() {
        System.out.println("Name: " + name + ", ID: " + studentId + 
                         ", GPA: " + gpa + ", Major: " + major);
    }
}

// Using constructors
public class ConstructorDemo {
    public static void main(String[] args) {
        Student s1 = new Student();
        Student s2 = new Student("Alice", 12345, "CS");
        Student s3 = new Student("Bob", 12346, 3.8, "IT");
        
        s1.displayInfo();
        s2.displayInfo();
        s3.displayInfo();
    }
}`,
          explanation: 'This example demonstrates constructor overloading - providing multiple ways to create Student objects with different initialization parameters.'
        }
      ],
      keyPoints: [
        'Constructors initialize object state when created',
        '"this" keyword refers to the current object',
        'Constructor overloading provides flexibility',
        'Always provide meaningful default values'
      ],
      practiceExercise: 'Add multiple constructors to your Book class - default, with title and author, and with all fields.'
    }
  },
  {
    id: 'lesson2-5',
    title: 'The "this" Keyword',
    duration: '20 min',
    completed: false,
    locked: false,
    content: {
      introduction: 'The "this" keyword is a reference to the current object. It is commonly used to distinguish between instance variables and parameters with the same name, and to call one constructor from another.',
      keyConcepts: [
        '"this" refers to the current object instance',
        'Used to resolve naming conflicts',
        'Can call other constructors using this()',
        'Improves code clarity and readability'
      ],
      codeExamples: [
        {
          title: 'Using "this" Keyword',
          code: `public class Employee {
    private String name;
    private int id;
    private double salary;
    
    // Constructor using "this" to avoid naming conflicts
    public Employee(String name, int id, double salary) {
        this.name = name;     // this.name is instance variable
        this.id = id;         // name, id, salary are parameters
        this.salary = salary;
    }
    
    // Constructor chaining using this()
    public Employee(String name, int id) {
        this(name, id, 0.0);  // Calls the main constructor
    }
    
    // Using "this" in methods
    public void displayInfo() {
        System.out.println("Name: " + this.name);
        System.out.println("ID: " + this.id);
        System.out.println("Salary: $" + this.salary);
    }
    
    public Employee getEmployee() {
        return this;  // Returns current object
    }
    
    public void compareSalary(Employee other) {
        if (this.salary > other.salary) {
            System.out.println(this.name + " earns more");
        } else {
            System.out.println(other.name + " earns more");
        }
    }
}`,
          explanation: 'This example shows various uses of "this": resolving naming conflicts, constructor chaining, returning current object, and comparing with other objects.'
        }
      ],
      keyPoints: [
        'this.fieldName accesses instance variable',
        'this() must be the first statement in constructor',
        'this is implicit in most cases but explicit is clearer',
        'this enables method chaining design pattern'
      ],
      practiceExercise: 'Modify your Book class to use "this" keyword in constructors and add a method that compares prices with another Book object.'
    }
  }
];

export const module3Lessons: Lesson[] = [
  {
    id: 'lesson3-1',
    title: 'Understanding Encapsulation',
    duration: '25 min',
    completed: false,
    locked: false,
    content: {
      introduction: 'Encapsulation is one of the four fundamental OOP principles. It is the mechanism of wrapping data (variables) and code (methods) together as a single unit, and restricting direct access to some of an object\'s components. This is achieved using access modifiers.',
      keyConcepts: [
        'Encapsulation hides internal object details',
        'Data is protected from unauthorized access',
        'Access is controlled through public methods',
        'Promotes modularity and maintainability'
      ],
      codeExamples: [
        {
          title: 'Encapsulated BankAccount Class',
          code: `public class BankAccount {
    // Private fields - encapsulated data
    private String accountNumber;
    private String accountHolder;
    private double balance;
    
    public BankAccount(String accountNumber, String accountHolder) {
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this.balance = 0.0;
    }
    
    // Public methods to access private data
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.println("Deposited: $" + amount);
        }
    }
    
    public void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            System.out.println("Withdrawn: $" + amount);
        } else {
            System.out.println("Invalid withdrawal amount");
        }
    }
    
    public double getBalance() {
        return balance;
    }
    
    public String getAccountInfo() {
        return "Account: " + accountNumber + 
               ", Holder: " + accountHolder +
               ", Balance: $" + balance;
    }
}`,
          explanation: 'This BankAccount class encapsulates account data by making fields private and providing controlled access through public methods.'
        }
      ],
      keyPoints: [
        'Make fields private to hide implementation details',
        'Provide public methods for controlled access',
        'Validation logic can be added in methods',
        'Internal representation can change without affecting users'
      ],
      practiceExercise: 'Create an encapsulated Product class with private fields for name, price, and quantity, with methods to update and retrieve them.'
    }
  },
  {
    id: 'lesson3-2',
    title: 'Access Modifiers',
    duration: '22 min',
    completed: false,
    locked: false,
    content: {
      introduction: 'Access modifiers in Java control the visibility and accessibility of classes, methods, and fields. The four access modifiers are: private, default (no modifier), protected, and public.',
      keyConcepts: [
        'private: accessible only within the same class',
        'default: accessible within the same package',
        'protected: accessible within package and subclasses',
        'public: accessible from anywhere'
      ],
      codeExamples: [
        {
          title: 'Access Modifiers Demo',
          code: `public class AccessModifiersDemo {
    private int privateVar = 1;      // Only this class
    int defaultVar = 2;              // Same package
    protected int protectedVar = 3;  // Same package + subclasses
    public int publicVar = 4;        // Anywhere
    
    private void privateMethod() {
        System.out.println("Private method");
    }
    
    void defaultMethod() {
        System.out.println("Default method");
    }
    
    protected void protectedMethod() {
        System.out.println("Protected method");
    }
    
    public void publicMethod() {
        System.out.println("Public method");
        // This class can access all its own members
        privateMethod();
        System.out.println(privateVar);
    }
}

// In same package
class SamePackageClass {
    void test() {
        AccessModifiersDemo obj = new AccessModifiersDemo();
        // obj.privateVar = 10;    // ERROR: not accessible
        obj.defaultVar = 20;       // OK: same package
        obj.protectedVar = 30;     // OK: same package
        obj.publicVar = 40;        // OK: public
    }
}`,
          explanation: 'This example demonstrates the four access levels and which members are accessible from different locations.'
        }
      ],
      keyPoints: [
        'Use private for internal implementation details',
        'Use public for the class\'s interface',
        'Use protected for inheritance hierarchies',
        'Default access is package-private'
      ],
      practiceExercise: 'Create a class with fields using different access modifiers and test which ones can be accessed from another class.'
    }
  },
  {
    id: 'lesson3-3',
    title: 'Getters and Setters',
    duration: '20 min',
    completed: false,
    locked: false,
    content: {
      introduction: 'Getters and setters (also called accessor and mutator methods) are public methods used to access and modify private fields. They provide controlled access to encapsulated data and allow validation before setting values.',
      keyConcepts: [
        'Getters retrieve private field values',
        'Setters modify private field values with validation',
        'Follow naming convention: get/set + FieldName',
        'Enable read-only or write-only properties'
      ],
      codeExamples: [
        {
          title: 'Student Class with Getters and Setters',
          code: `public class Student {
    private String name;
    private int age;
    private double gpa;
    
    // Constructor
    public Student(String name, int age, double gpa) {
        this.name = name;
        setAge(age);    // Use setter for validation
        setGpa(gpa);    // Use setter for validation
    }
    
    // Getter methods
    public String getName() {
        return name;
    }
    
    public int getAge() {
        return age;
    }
    
    public double getGpa() {
        return gpa;
    }
    
    // Setter methods with validation
    public void setName(String name) {
        if (name != null && !name.trim().isEmpty()) {
            this.name = name;
        } else {
            System.out.println("Invalid name");
        }
    }
    
    public void setAge(int age) {
        if (age >= 16 && age <= 100) {
            this.age = age;
        } else {
            System.out.println("Invalid age");
        }
    }
    
    public void setGpa(double gpa) {
        if (gpa >= 0.0 && gpa <= 4.0) {
            this.gpa = gpa;
        } else {
            System.out.println("Invalid GPA");
        }
    }
}

// Usage
public class GetterSetterDemo {
    public static void main(String[] args) {
        Student student = new Student("Alice", 20, 3.8);
        
        // Using getters
        System.out.println("Name: " + student.getName());
        System.out.println("Age: " + student.getAge());
        System.out.println("GPA: " + student.getGpa());
        
        // Using setters
        student.setGpa(3.9);  // Valid
        student.setAge(150);  // Invalid - will show error
    }
}`,
          explanation: 'This example shows proper implementation of getters and setters with validation logic to ensure data integrity.'
        }
      ],
      keyPoints: [
        'Getters return field values, setters update them',
        'Add validation in setters to ensure valid data',
        'Can make fields read-only by omitting setter',
        'Can make fields write-only by omitting getter'
      ],
      practiceExercise: 'Add proper getters and setters to your Product class with validation (e.g., price must be positive, quantity cannot be negative).'
    }
  },
  {
    id: 'lesson3-4',
    title: 'Data Validation and Security',
    duration: '23 min',
    completed: false,
    locked: false,
    content: {
      introduction: 'Encapsulation enables data validation and security by controlling how data is accessed and modified. Through setters and private fields, we can ensure that objects maintain valid state and prevent unauthorized modifications.',
      keyConcepts: [
        'Validation prevents invalid object states',
        'Security through controlled access',
        'Immutable objects for thread safety',
        'Defensive copying for mutable references'
      ],
      codeExamples: [
        {
          title: 'Secure User Class',
          code: `import java.util.regex.Pattern;

public class User {
    private String username;
    private String email;
    private String password;
    private int loginAttempts;
    private boolean isLocked;
    
    private static final int MAX_LOGIN_ATTEMPTS = 3;
    private static final Pattern EMAIL_PATTERN = 
        Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    
    public User(String username, String email, String password) {
        setUsername(username);
        setEmail(email);
        setPassword(password);
        this.loginAttempts = 0;
        this.isLocked = false;
    }
    
    public void setUsername(String username) {
        if (username != null && username.length() >= 3) {
            this.username = username;
        } else {
            throw new IllegalArgumentException(
                "Username must be at least 3 characters");
        }
    }
    
    public void setEmail(String email) {
        if (email != null && EMAIL_PATTERN.matcher(email).matches()) {
            this.email = email;
        } else {
            throw new IllegalArgumentException("Invalid email format");
        }
    }
    
    public void setPassword(String password) {
        if (password != null && password.length() >= 8) {
            this.password = hashPassword(password);
        } else {
            throw new IllegalArgumentException(
                "Password must be at least 8 characters");
        }
    }
    
    private String hashPassword(String password) {
        // Simplified - in real app use bcrypt or similar
        return "hashed_" + password;
    }
    
    public boolean login(String enteredPassword) {
        if (isLocked) {
            System.out.println("Account is locked");
            return false;
        }
        
        if (hashPassword(enteredPassword).equals(password)) {
            loginAttempts = 0;
            return true;
        } else {
            loginAttempts++;
            if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
                isLocked = true;
                System.out.println("Account locked due to failed attempts");
            }
            return false;
        }
    }
    
    // Getters - no password getter for security!
    public String getUsername() {
        return username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public boolean isLocked() {
        return isLocked;
    }
}`,
          explanation: 'This User class demonstrates data validation, security through password hashing, login attempt tracking, and controlled access to sensitive data.'
        }
      ],
      keyPoints: [
        'Validate all input in setters',
        'Throw exceptions for invalid data',
        'Never expose sensitive data through getters',
        'Use validation patterns (regex) for complex data'
      ],
      practiceExercise: 'Create a CreditCard class with validation for card number (16 digits), CVV (3 digits), and expiry date, ensuring data security.'
    }
  }
];

// ============================================
// MODULE 4: INHERITANCE
// ============================================

export const module4Lessons: Lesson[] = [
  {
    id: 'lesson4-1',
    title: 'Introduction to Inheritance',
    duration: '25 min',
    completed: false,
    locked: false,
    content: {
      introduction: 'Inheritance is a mechanism where a new class inherits properties and behaviors from an existing class. The existing class is called the superclass (parent), and the new class is called the subclass (child). This promotes code reuse and establishes IS-A relationships.',
      keyConcepts: [
        'Inheritance enables code reuse and hierarchy',
        'Subclass inherits all non-private members from superclass',
        'Use "extends" keyword to inherit',
        'Java supports single inheritance (one parent class)'
      ],
      codeExamples: [
        {
          title: 'Person and Student Inheritance',
          code: `// Superclass
public class Person {
    protected String name;
    protected int age;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public void displayInfo() {
        System.out.println("Name: " + name + ", Age: " + age);
    }
}

// Subclass
public class Student extends Person {
    private String studentId;
    private double gpa;
    
    public Student(String name, int age, String studentId, double gpa) {
        super(name, age);  // Call superclass constructor
        this.studentId = studentId;
        this.gpa = gpa;
    }
    
    public void study() {
        System.out.println(name + " is studying...");
    }
}

// Usage
public class InheritanceDemo {
    public static void main(String[] args) {
        Student student = new Student("Alice", 20, "S12345", 3.8);
        student.displayInfo();  // Inherited from Person
        student.study();        // Student's own method
    }
}`,
          explanation: 'Student class inherits name, age, and displayInfo() from Person class, and adds its own fields and methods.'
        }
      ],
      keyPoints: [
        'Subclass inherits accessible fields and methods',
        'super() calls parent class constructor',
        'Promotes "Don\'t Repeat Yourself" (DRY) principle',
        'Establishes IS-A relationship (Student IS-A Person)'
      ],
      practiceExercise: 'Create a Vehicle superclass and a Car subclass. Vehicle should have brand and year, Car should add numberOfDoors.'
    }
  },
  {
    id: 'lesson4-2',
    title: 'Method Overriding',
    duration: '22 min',
    completed: false,
    locked: false,
    content: {
      introduction: 'Method overriding allows a subclass to provide a specific implementation of a method that is already defined in its superclass. The overridden method must have the same signature as the method in the parent class.',
      keyConcepts: [
        'Subclass can override superclass methods',
        'Method signature must match exactly',
        'Use @Override annotation for clarity',
        'Enables runtime polymorphism'
      ],
      codeExamples: [
        {
          title: 'Overriding displayInfo() Method',
          code: `public class Person {
    protected String name;
    protected int age;
    
    public void displayInfo() {
        System.out.println("Person: " + name + ", Age: " + age);
    }
}

public class Student extends Person {
    private String studentId;
    private double gpa;
    
    @Override
    public void displayInfo() {
        System.out.println("Student: " + name + 
                         ", Age: " + age +
                         ", ID: " + studentId +
                         ", GPA: " + gpa);
    }
}

public class Employee extends Person {
    private String employeeId;
    private double salary;
    
    @Override
    public void displayInfo() {
        System.out.println("Employee: " + name +
                         ", Age: " + age +
                         ", ID: " + employeeId +
                         ", Salary: $" + salary);
    }
}`,
          explanation: 'Both Student and Employee override displayInfo() to provide their own specific implementations.'
        }
      ],
      keyPoints: [
        '@Override annotation helps prevent errors',
        'Overridden method can call super.methodName()',
        'Access modifier must be same or more permissive',
        'Return type must be same or subtype (covariant)'
      ],
      practiceExercise: 'Override a makeSound() method in Dog and Cat classes that extend Animal class.'
    }
  },
  {
    id: 'lesson4-3',
    title: 'The super Keyword',
    duration: '20 min',
    completed: false,
    locked: false,
    content: {
      introduction: 'The super keyword is used to refer to the superclass. It can be used to call superclass constructors, access superclass fields, and invoke superclass methods.',
      keyConcepts: [
        'super() calls superclass constructor',
        'super.method() calls superclass method',
        'super.field accesses superclass field',
        'super() must be first statement in constructor'
      ],
      codeExamples: [
        {
          title: 'Using super Keyword',
          code: `public class Vehicle {
    protected String brand;
    protected int year;
    
    public Vehicle(String brand, int year) {
        this.brand = brand;
        this.year = year;
    }
    
    public void start() {
        System.out.println("Vehicle is starting...");
    }
}

public class Car extends Vehicle {
    private int numberOfDoors;
    
    public Car(String brand, int year, int numberOfDoors) {
        super(brand, year);  // Call parent constructor
        this.numberOfDoors = numberOfDoors;
    }
    
    @Override
    public void start() {
        super.start();  // Call parent method first
        System.out.println("Car engine started!");
    }
    
    public void displayInfo() {
        System.out.println("Brand: " + super.brand);  // Access parent field
        System.out.println("Year: " + super.year);
        System.out.println("Doors: " + numberOfDoors);
    }
}`,
          explanation: 'This example shows three uses of super: calling parent constructor, parent method, and accessing parent fields.'
        }
      ],
      keyPoints: [
        'super() initializes parent class state',
        'super allows extending parent behavior',
        'Cannot use super to access private members',
        'Helpful for constructor chaining'
      ],
      practiceExercise: 'Create a Shape class and Rectangle subclass that uses super to call parent constructor and methods.'
    }
  },
  {
    id: 'lesson4-4',
    title: 'Inheritance Hierarchies',
    duration: '25 min',
    completed: false,
    locked: false,
    content: {
      introduction: 'Inheritance can create multi-level hierarchies where classes extend other classes. This creates a tree-like structure of related classes that share common characteristics while adding specific behaviors.',
      keyConcepts: [
        'Classes can form inheritance hierarchies',
        'Child class inherits from all ancestors',
        'More specific classes at bottom of hierarchy',
        'Common features move up the hierarchy'
      ],
      codeExamples: [
        {
          title: 'Multi-Level Inheritance',
          code: `// Base class
public class Animal {
    protected String name;
    
    public void eat() {
        System.out.println(name + " is eating");
    }
}

// Intermediate class
public class Mammal extends Animal {
    protected String furColor;
    
    public void breathe() {
        System.out.println(name + " is breathing");
    }
}

// Leaf class
public class Dog extends Mammal {
    private String breed;
    
    public void bark() {
        System.out.println(name + " is barking: Woof!");
    }
}

// Dog inherits from both Mammal and Animal
public class HierarchyDemo {
    public static void main(String[] args) {
        Dog myDog = new Dog();
        myDog.name = "Max";
        myDog.furColor = "Brown";
        
        myDog.eat();     // From Animal
        myDog.breathe(); // From Mammal
        myDog.bark();    // From Dog
    }
}`,
          explanation: 'Dog class inherits members from both Mammal and Animal classes in a multi-level hierarchy.'
        }
      ],
      keyPoints: [
        'Keep hierarchies shallow for maintainability',
        'Move common features to higher classes',
        'Each level adds more specific behavior',
        'Favor composition over deep inheritance'
      ],
      practiceExercise: 'Create an inheritance hierarchy: Person -> Employee -> Manager, each adding specific fields and methods.'
    }
  },
  {
    id: 'lesson4-5',
    title: 'Types of Inheritance and Best Practices',
    duration: '23 min',
    completed: false,
    locked: false,
    content: {
      introduction: 'Understanding different types of inheritance and following best practices helps create maintainable object-oriented designs. Java supports single inheritance for classes but allows multiple inheritance through interfaces.',
      keyConcepts: [
        'Single Inheritance: one parent class',
        'Multilevel Inheritance: chain of classes',
        'Hierarchical Inheritance: multiple children',
        'Java does not support multiple class inheritance'
      ],
      codeExamples: [
        {
          title: 'Inheritance Best Practices',
          code: `// Good: IS-A relationship
public class Vehicle {
    // Common vehicle properties
}

public class Car extends Vehicle {
    // Car IS-A Vehicle - makes sense
}

// Bad: Misuse of inheritance
public class Stack extends ArrayList {
    // Stack is not really an ArrayList
    // Better to use composition
}

// Good: Use composition instead
public class Stack {
    private ArrayList<Object> elements = new ArrayList<>();
    
    public void push(Object item) {
        elements.add(item);
    }
    
    public Object pop() {
        if (!elements.isEmpty()) {
            return elements.remove(elements.size() - 1);
        }
        return null;
    }
}

// Protected vs Private
public class BankAccount {
    private double balance;      // Good: hide sensitive data
    protected String accountType; // OK: allow subclass access
    
    // Provide controlled access
    public double getBalance() {
        return balance;
    }
}`,
          explanation: 'This shows proper use of inheritance with IS-A relationship and when to prefer composition over inheritance.'
        }
      ],
      keyPoints: [
        'Use inheritance only for true IS-A relationships',
        'Prefer composition over inheritance when possible',
        'Make fields private unless subclasses need access',
        'Document inheritance contracts clearly'
      ],
      practiceExercise: 'Identify which relationships should use inheritance vs composition: House and Room, Car and Engine, Student and Person.'
    }
  }
];

// ============================================
// MODULE 5: POLYMORPHISM
// ============================================

export const module5Lessons: Lesson[] = [
  {
    id: 'lesson5-1',
    title: 'Understanding Polymorphism',
    duration: '25 min',
    completed: false,
    locked: false,
    content: {
      introduction: 'Polymorphism means "many forms." In OOP, it allows objects of different classes to be treated as objects of a common superclass. It enables one interface to be used for different data types and behaviors.',
      keyConcepts: [
        'Polymorphism means one interface, many implementations',
        'Two types: compile-time and runtime polymorphism',
        'Enables flexibility and extensibility',
        'Key principle for writing flexible code'
      ],
      codeExamples: [
        {
          title: 'Polymorphism Example',
          code: `public class Animal {
    public void makeSound() {
        System.out.println("Animal makes a sound");
    }
}

public class Dog extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Dog barks: Woof!");
    }
}

public class Cat extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Cat meows: Meow!");
    }
}

public class PolymorphismDemo {
    public static void main(String[] args) {
        Animal myAnimal;  // Parent reference
        
        myAnimal = new Dog();
        myAnimal.makeSound();  // "Dog barks: Woof!"
        
        myAnimal = new Cat();
        myAnimal.makeSound();  // "Cat meows: Meow!"
        
        // Array of Animals showing polymorphism
        Animal[] animals = {new Dog(), new Cat(), new Animal()};
        for (Animal animal : animals) {
            animal.makeSound();  // Different behavior for each
        }
    }
}`,
          explanation: 'A single Animal reference can point to different subclass objects and invoke their specific implementations.'
        }
      ],
      keyPoints: [
        'Parent reference can hold child object',
        'Method called is determined at runtime',
        'Enables writing generic code',
        'Reduces code coupling and increases flexibility'
      ],
      practiceExercise: 'Create a Shape hierarchy with calculateArea() method and demonstrate polymorphism with Circle, Rectangle, and Triangle.'
    }
  },
  {
    id: 'lesson5-2',
    title: 'Method Overloading (Compile-time Polymorphism)',
    duration: '20 min',
    completed: false,
    locked: false,
    content: {
      introduction: 'Method overloading is compile-time polymorphism where multiple methods have the same name but different parameters. The compiler determines which method to call based on the arguments.',
      keyConcepts: [
        'Same method name, different parameters',
        'Parameters differ by number, type, or order',
        'Return type alone is not enough',
        'Resolved at compile time'
      ],
      codeExamples: [
        {
          title: 'Calculator with Overloaded Methods',
          code: `public class Calculator {
    // Overloaded add methods
    public int add(int a, int b) {
        return a + b;
    }
    
    public double add(double a, double b) {
        return a + b;
    }
    
    public int add(int a, int b, int c) {
        return a + b + c;
    }
    
    // Overloaded display methods
    public void display(int num) {
        System.out.println("Integer: " + num);
    }
    
    public void display(double num) {
        System.out.println("Double: " + num);
    }
    
    public void display(String text) {
        System.out.println("String: " + text);
    }
}

public class OverloadingDemo {
    public static void main(String[] args) {
        Calculator calc = new Calculator();
        
        System.out.println(calc.add(5, 10));          // Calls int version
        System.out.println(calc.add(5.5, 10.5));      // Calls double version
        System.out.println(calc.add(5, 10, 15));      // Calls three-parameter version
        
        calc.display(100);         // Calls int version
        calc.display(3.14);        // Calls double version
        calc.display("Hello");     // Calls String version
    }
}`,
          explanation: 'Calculator class has multiple add() and display() methods with different parameter lists.'
        }
      ],
      keyPoints: [
        'Improves code readability',
        'Methods must differ in parameter list',
        'Return type alone doesn\'t enable overloading',
        'Varargs can cause ambiguity'
      ],
      practiceExercise: 'Create a Print class with overloaded print methods for different data types and array sizes.'
    }
  },
  {
    id: 'lesson5-3',
    title: 'Method Overriding (Runtime Polymorphism)',
    duration: '22 min',
    completed: false,
    locked: false,
    content: {
      introduction: 'Method overriding is runtime polymorphism where a subclass provides a specific implementation of a method declared in its superclass. The actual method called is determined at runtime based on the object type.',
      keyConcepts: [
        'Subclass provides specific implementation',
        'Method signature must be identical',
        'Determined at runtime (dynamic binding)',
        'Enables polymorphic behavior'
      ],
      codeExamples: [
        {
          title: 'Employee Salary Calculation',
          code: `public class Employee {
    protected String name;
    protected double baseSalary;
    
    public Employee(String name, double baseSalary) {
        this.name = name;
        this.baseSalary = baseSalary;
    }
    
    public double calculateSalary() {
        return baseSalary;
    }
    
    public void displayInfo() {
        System.out.println(name + ": $" + calculateSalary());
    }
}

public class Manager extends Employee {
    private double bonus;
    
    public Manager(String name, double baseSalary, double bonus) {
        super(name, baseSalary);
        this.bonus = bonus;
    }
    
    @Override
    public double calculateSalary() {
        return baseSalary + bonus;
    }
}

public class Developer extends Employee {
    private int projectsCompleted;
    private double projectBonus = 500;
    
    public Developer(String name, double baseSalary, int projectsCompleted) {
        super(name, baseSalary);
        this.projectsCompleted = projectsCompleted;
    }
    
    @Override
    public double calculateSalary() {
        return baseSalary + (projectsCompleted * projectBonus);
    }
}

public class PayrollDemo {
    public static void main(String[] args) {
        Employee[] employees = {
            new Employee("John", 50000),
            new Manager("Sarah", 80000, 20000),
            new Developer("Mike", 70000, 5)
        };
        
        // Polymorphic behavior
        for (Employee emp : employees) {
            emp.displayInfo();  // Different salary calculation for each
        }
    }
}`,
          explanation: 'Each employee type calculates salary differently, but they can all be processed uniformly through the Employee reference.'
        }
      ],
      keyPoints: [
        'Enables treating different objects uniformly',
        'Method resolution happens at runtime',
        'JVM uses dynamic method dispatch',
        'Core of flexible OOP design'
      ],
      practiceExercise: 'Create a Payment hierarchy with CreditCard, DebitCard, and Cash classes, each implementing processPayment() differently.'
    }
  },
  {
    id: 'lesson5-4',
    title: 'Dynamic Binding and Virtual Methods',
    duration: '23 min',
    completed: false,
    locked: false,
    content: {
      introduction: 'Dynamic binding (late binding) is the mechanism where method calls are resolved at runtime based on the actual object type, not the reference type. All non-static, non-final, non-private methods in Java are virtual by default.',
      keyConcepts: [
        'Method binding happens at runtime',
        'Based on actual object, not reference type',
        'All instance methods are virtual in Java',
        'Enables polymorphic method calls'
      ],
      codeExamples: [
        {
          title: 'Dynamic Binding Example',
          code: `public class Shape {
    protected String color;
    
    public double getArea() {
        return 0.0;
    }
    
    public void draw() {
        System.out.println("Drawing shape");
    }
}

public class Circle extends Shape {
    private double radius;
    
    public Circle(double radius) {
        this.radius = radius;
    }
    
    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }
    
    @Override
    public void draw() {
        System.out.println("Drawing circle with area: " + getArea());
    }
}

public class Rectangle extends Shape {
    private double width;
    private double height;
    
    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }
    
    @Override
    public double getArea() {
        return width * height;
    }
    
    @Override
    public void draw() {
        System.out.println("Drawing rectangle with area: " + getArea());
    }
}

public class DynamicBindingDemo {
    // Method accepting Shape reference
    public static void printShapeInfo(Shape shape) {
        shape.draw();  // Calls appropriate version based on actual object
        System.out.println("Area: " + shape.getArea());
    }
    
    public static void main(String[] args) {
        Shape shape1 = new Circle(5.0);
        Shape shape2 = new Rectangle(4.0, 6.0);
        
        printShapeInfo(shape1);  // Circle's methods called
        printShapeInfo(shape2);  // Rectangle's methods called
    }
}`,
          explanation: 'The JVM determines which version of draw() and getArea() to call at runtime based on the actual object type.'
        }
      ],
      keyPoints: [
        'Static binding: compile-time (private, final, static)',
        'Dynamic binding: runtime (instance methods)',
        'Enables flexible, extensible designs',
        'Performance cost is minimal in modern JVMs'
      ],
      practiceExercise: 'Create a Document hierarchy where each type (PDF, Word, Text) has different save() and print() implementations.'
    }
  }
];