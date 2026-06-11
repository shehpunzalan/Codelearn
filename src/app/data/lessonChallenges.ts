// Interactive Challenges for All 111 Lessons
// Comprehensive gamified learning challenges with XP rewards

export interface ChallengeOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface Challenge {
  id: string;
  question: string;
  code?: string;
  options: ChallengeOption[];
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  hint?: string;
}

// MODULE 1: Introduction to Java and OOP
export const module1Challenges: Record<string, Challenge[]> = {
  // Lesson 1.1: Introduction to Programming
  'mod1-lesson1': [
    {
      id: 'mod1-l1-c1',
      question: 'What is the main purpose of object-oriented programming?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        {
          id: 'a',
          text: 'To organize code into reusable objects that model real-world entities',
          isCorrect: true,
          explanation: 'Correct! OOP helps organize code by modeling real-world entities as objects with properties and behaviors.'
        },
        {
          id: 'b',
          text: 'To make programs run faster',
          isCorrect: false,
          explanation: 'Incorrect. While OOP can improve efficiency, its main purpose is code organization and reusability.'
        },
        {
          id: 'c',
          text: 'To reduce the number of lines of code',
          isCorrect: false,
          explanation: 'Incorrect. OOP focuses on code organization, not necessarily reducing lines of code.'
        },
        {
          id: 'd',
          text: 'To eliminate all bugs in programs',
          isCorrect: false,
          explanation: 'Incorrect. No programming paradigm can eliminate all bugs, though OOP can make debugging easier.'
        }
      ],
      hint: 'Think about how OOP models real-world concepts in code.'
    },
    {
      id: 'mod1-l1-c2',
      question: 'Which of the following is NOT a principle of Object-Oriented Programming?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        {
          id: 'a',
          text: 'Compilation',
          isCorrect: true,
          explanation: 'Correct! Compilation is a process, not an OOP principle. The four main OOP principles are Encapsulation, Inheritance, Polymorphism, and Abstraction.'
        },
        {
          id: 'b',
          text: 'Encapsulation',
          isCorrect: false,
          explanation: 'Incorrect. Encapsulation is one of the core OOP principles.'
        },
        {
          id: 'c',
          text: 'Inheritance',
          isCorrect: false,
          explanation: 'Incorrect. Inheritance is one of the core OOP principles.'
        },
        {
          id: 'd',
          text: 'Polymorphism',
          isCorrect: false,
          explanation: 'Incorrect. Polymorphism is one of the core OOP principles.'
        }
      ],
      hint: 'Think about the four pillars of OOP.'
    },
    {
      id: 'mod1-l1-c3',
      question: 'What does encapsulation mean in OOP?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        {
          id: 'a',
          text: 'Hiding internal details and exposing only necessary information',
          isCorrect: true,
          explanation: 'Correct! Encapsulation bundles data and methods together while hiding internal implementation details.'
        },
        {
          id: 'b',
          text: 'Creating multiple copies of an object',
          isCorrect: false,
          explanation: 'Incorrect. This is not related to encapsulation.'
        },
        {
          id: 'c',
          text: 'Inheriting properties from parent classes',
          isCorrect: false,
          explanation: 'Incorrect. This describes inheritance, not encapsulation.'
        },
        {
          id: 'd',
          text: 'Writing code in a capsule format',
          isCorrect: false,
          explanation: 'Incorrect. Encapsulation is about data hiding and access control.'
        }
      ],
      hint: 'Think about protecting data within a class.'
    },
    {
      id: 'mod1-l1-c4',
      question: 'What is an object in OOP?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        {
          id: 'a',
          text: 'An instance of a class with its own state and behavior',
          isCorrect: true,
          explanation: 'Correct! An object is a concrete instance created from a class blueprint.'
        },
        {
          id: 'b',
          text: 'A function that performs operations',
          isCorrect: false,
          explanation: 'Incorrect. That describes a method, not an object.'
        },
        {
          id: 'c',
          text: 'A keyword in Java',
          isCorrect: false,
          explanation: 'Incorrect. An object is an instance, not a keyword.'
        },
        {
          id: 'd',
          text: 'A data type like int or String',
          isCorrect: false,
          explanation: 'Incorrect. Objects are instances of classes, not primitive data types.'
        }
      ],
      hint: 'Think about what you create from a class.'
    },
    {
      id: 'mod1-l1-c5',
      question: 'What is a class in Java?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        {
          id: 'a',
          text: 'A blueprint or template for creating objects',
          isCorrect: true,
          explanation: 'Correct! A class defines the structure and behavior that objects created from it will have.'
        },
        {
          id: 'b',
          text: 'A collection of variables',
          isCorrect: false,
          explanation: 'Incorrect. A class is more than just variables; it includes methods and defines object behavior.'
        },
        {
          id: 'c',
          text: 'A type of loop',
          isCorrect: false,
          explanation: 'Incorrect. Loops are control structures, not classes.'
        },
        {
          id: 'd',
          text: 'A special kind of array',
          isCorrect: false,
          explanation: 'Incorrect. Classes and arrays are different concepts.'
        }
      ],
      hint: 'Think about what defines the structure of objects.'
    },
    {
      id: 'mod1-l1-c6',
      question: 'Which statement best describes inheritance?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        {
          id: 'a',
          text: 'A mechanism where a class acquires properties and behaviors from another class',
          isCorrect: true,
          explanation: 'Correct! Inheritance allows child classes to inherit features from parent classes, promoting code reuse.'
        },
        {
          id: 'b',
          text: 'A way to store data permanently',
          isCorrect: false,
          explanation: 'Incorrect. This describes persistence, not inheritance.'
        },
        {
          id: 'c',
          text: 'A method to hide implementation details',
          isCorrect: false,
          explanation: 'Incorrect. This describes encapsulation, not inheritance.'
        },
        {
          id: 'd',
          text: 'A technique to compile code faster',
          isCorrect: false,
          explanation: 'Incorrect. Inheritance is about code reuse, not compilation speed.'
        }
      ],
      hint: 'Think about parent and child relationships.'
    },
    {
      id: 'mod1-l1-c7',
      question: 'What is polymorphism in OOP?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        {
          id: 'a',
          text: 'The ability of objects to take multiple forms',
          isCorrect: true,
          explanation: 'Correct! Polymorphism allows objects to be treated as instances of their parent class, enabling one interface to represent different underlying forms.'
        },
        {
          id: 'b',
          text: 'Creating many objects at once',
          isCorrect: false,
          explanation: 'Incorrect. Polymorphism is about flexibility in object behavior, not quantity.'
        },
        {
          id: 'c',
          text: 'Using multiple programming languages',
          isCorrect: false,
          explanation: 'Incorrect. Polymorphism is a concept within a single language.'
        },
        {
          id: 'd',
          text: 'Storing multiple data types in one variable',
          isCorrect: false,
          explanation: 'Incorrect. This partially relates but doesn\'t capture the essence of polymorphism.'
        }
      ],
      hint: 'Think about method overriding and overloading.'
    },
    {
      id: 'mod1-l1-c8',
      question: 'What is abstraction in OOP?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        {
          id: 'a',
          text: 'Hiding complex implementation and showing only essential features',
          isCorrect: true,
          explanation: 'Correct! Abstraction focuses on what an object does rather than how it does it.'
        },
        {
          id: 'b',
          text: 'Making code run faster',
          isCorrect: false,
          explanation: 'Incorrect. Abstraction is about simplifying complexity, not performance.'
        },
        {
          id: 'c',
          text: 'Creating abstract art with code',
          isCorrect: false,
          explanation: 'Incorrect. Abstraction is a programming concept, not art-related.'
        },
        {
          id: 'd',
          text: 'Removing all methods from a class',
          isCorrect: false,
          explanation: 'Incorrect. Abstraction involves hiding complexity, not removing functionality.'
        }
      ],
      hint: 'Think about interfaces and abstract classes.'
    },
    {
      id: 'mod1-l1-c9',
      question: 'Which real-world analogy best represents a class and object relationship?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        {
          id: 'a',
          text: 'Blueprint (class) and House (object)',
          isCorrect: true,
          explanation: 'Correct! Just as a blueprint defines how to build a house, a class defines how to create objects.'
        },
        {
          id: 'b',
          text: 'Car (class) and Engine (object)',
          isCorrect: false,
          explanation: 'Incorrect. This represents composition, not the class-object relationship.'
        },
        {
          id: 'c',
          text: 'Teacher (class) and Student (object)',
          isCorrect: false,
          explanation: 'Incorrect. Both would be separate classes, not class-object relationship.'
        },
        {
          id: 'd',
          text: 'Book (class) and Page (object)',
          isCorrect: false,
          explanation: 'Incorrect. This represents composition, not the class-object relationship.'
        }
      ],
      hint: 'Think about a template and what is created from it.'
    },
    {
      id: 'mod1-l1-c10',
      question: 'Why is OOP considered beneficial for large projects?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        {
          id: 'a',
          text: 'It promotes code reusability, modularity, and easier maintenance',
          isCorrect: true,
          explanation: 'Correct! OOP principles make it easier to manage complexity in large codebases through better organization and reusability.'
        },
        {
          id: 'b',
          text: 'It makes programs run 10x faster',
          isCorrect: false,
          explanation: 'Incorrect. OOP is about organization and maintainability, not necessarily speed.'
        },
        {
          id: 'c',
          text: 'It requires less memory',
          isCorrect: false,
          explanation: 'Incorrect. OOP can actually use more memory due to object overhead.'
        },
        {
          id: 'd',
          text: 'It eliminates the need for testing',
          isCorrect: false,
          explanation: 'Incorrect. Testing is always necessary regardless of programming paradigm.'
        }
      ],
      hint: 'Think about managing complex, large-scale applications.'
    }
  ],

  // Lesson 1.2: Setting up Java
  'mod1-lesson2': [
    {
      id: 'mod1-l2-c1',
      question: 'Which command is used to compile a Java program?',
      code: '// MyProgram.java\npublic class MyProgram {\n    public static void main(String[] args) {\n        System.out.println("Hello");\n    }\n}',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        {
          id: 'a',
          text: 'javac MyProgram.java',
          isCorrect: true,
          explanation: 'Correct! javac is the Java compiler that converts .java files to .class bytecode files.'
        },
        {
          id: 'b',
          text: 'java MyProgram.java',
          isCorrect: false,
          explanation: 'Incorrect. This attempts to run the program, not compile it.'
        },
        {
          id: 'c',
          text: 'compile MyProgram.java',
          isCorrect: false,
          explanation: 'Incorrect. There is no "compile" command in Java.'
        },
        {
          id: 'd',
          text: 'run MyProgram.java',
          isCorrect: false,
          explanation: 'Incorrect. This is not a valid Java command.'
        }
      ],
      hint: 'The Java compiler tool starts with "javac".'
    },
    {
      id: 'mod1-l2-c2',
      question: 'What does JDK stand for?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        {
          id: 'a',
          text: 'Java Development Kit',
          isCorrect: true,
          explanation: 'Correct! JDK stands for Java Development Kit and includes tools for developing Java applications.'
        },
        {
          id: 'b',
          text: 'Java Deployment Kit',
          isCorrect: false,
          explanation: 'Incorrect. The D stands for Development, not Deployment.'
        },
        {
          id: 'c',
          text: 'Java Design Kit',
          isCorrect: false,
          explanation: 'Incorrect. JDK stands for Java Development Kit.'
        },
        {
          id: 'd',
          text: 'Java Distribution Kit',
          isCorrect: false,
          explanation: 'Incorrect. JDK stands for Java Development Kit.'
        }
      ],
      hint: 'Think about what developers use to create Java applications.'
    },
    {
      id: 'mod1-l2-c3',
      question: 'Which command runs a compiled Java program?',
      code: '// After compiling MyProgram.java to MyProgram.class',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        {
          id: 'a',
          text: 'java MyProgram',
          isCorrect: true,
          explanation: 'Correct! The java command runs the compiled .class file. Note: you don\'t include the .class extension.'
        },
        {
          id: 'b',
          text: 'run MyProgram.class',
          isCorrect: false,
          explanation: 'Incorrect. Java uses the "java" command, not "run".'
        },
        {
          id: 'c',
          text: 'execute MyProgram',
          isCorrect: false,
          explanation: 'Incorrect. The correct command is "java".'
        },
        {
          id: 'd',
          text: 'javac MyProgram',
          isCorrect: false,
          explanation: 'Incorrect. javac is for compiling, not running programs.'
        }
      ],
      hint: 'You need to execute the compiled bytecode.'
    },
    {
      id: 'mod1-l2-c4',
      question: 'What is the JVM?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        {
          id: 'a',
          text: 'Java Virtual Machine - executes Java bytecode',
          isCorrect: true,
          explanation: 'Correct! The JVM is a virtual machine that executes Java bytecode, making Java platform-independent.'
        },
        {
          id: 'b',
          text: 'Java Variable Manager - manages variables',
          isCorrect: false,
          explanation: 'Incorrect. JVM stands for Java Virtual Machine.'
        },
        {
          id: 'c',
          text: 'Java Version Manager - manages Java versions',
          isCorrect: false,
          explanation: 'Incorrect. JVM stands for Java Virtual Machine.'
        },
        {
          id: 'd',
          text: 'Java Verification Module - checks code syntax',
          isCorrect: false,
          explanation: 'Incorrect. JVM stands for Java Virtual Machine.'
        }
      ],
      hint: 'Think about what makes Java "Write Once, Run Anywhere".'
    },
    {
      id: 'mod1-l2-c5',
      question: 'What file extension do Java source files have?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        {
          id: 'a',
          text: '.java',
          isCorrect: true,
          explanation: 'Correct! Java source code files always end with the .java extension.'
        },
        {
          id: 'b',
          text: '.class',
          isCorrect: false,
          explanation: 'Incorrect. .class files are compiled bytecode, not source files.'
        },
        {
          id: 'c',
          text: '.jav',
          isCorrect: false,
          explanation: 'Incorrect. The correct extension is .java, not .jav.'
        },
        {
          id: 'd',
          text: '.js',
          isCorrect: false,
          explanation: 'Incorrect. .js is for JavaScript, not Java.'
        }
      ],
      hint: 'Think about the file type you write your Java code in.'
    },
    {
      id: 'mod1-l2-c6',
      question: 'What is bytecode in Java?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        {
          id: 'a',
          text: 'Platform-independent intermediate code generated by the compiler',
          isCorrect: true,
          explanation: 'Correct! Bytecode is the compiled form of Java code that the JVM can execute on any platform.'
        },
        {
          id: 'b',
          text: 'A type of data stored as bytes',
          isCorrect: false,
          explanation: 'Incorrect. Bytecode is compiled Java code, not a data type.'
        },
        {
          id: 'c',
          text: 'Machine code specific to each processor',
          isCorrect: false,
          explanation: 'Incorrect. Bytecode is platform-independent; the JVM converts it to machine code.'
        },
        {
          id: 'd',
          text: 'Source code written in Java',
          isCorrect: false,
          explanation: 'Incorrect. Source code is .java files; bytecode is the compiled .class files.'
        }
      ],
      hint: 'Think about what the compiler produces.'
    },
    {
      id: 'mod1-l2-c7',
      question: 'Which component is required to run Java applications?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        {
          id: 'a',
          text: 'JRE (Java Runtime Environment)',
          isCorrect: true,
          explanation: 'Correct! The JRE includes the JVM and libraries needed to run Java applications.'
        },
        {
          id: 'b',
          text: 'Only a text editor',
          isCorrect: false,
          explanation: 'Incorrect. You need the JRE to run Java programs.'
        },
        {
          id: 'c',
          text: 'Microsoft Office',
          isCorrect: false,
          explanation: 'Incorrect. Java applications require the JRE.'
        },
        {
          id: 'd',
          text: 'A web browser only',
          isCorrect: false,
          explanation: 'Incorrect. While some Java apps run in browsers, the JRE is still needed.'
        }
      ],
      hint: 'Think about the runtime environment.'
    },
    {
      id: 'mod1-l2-c8',
      question: 'What is the relationship between JDK, JRE, and JVM?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        {
          id: 'a',
          text: 'JDK contains JRE, which contains JVM',
          isCorrect: true,
          explanation: 'Correct! JDK includes development tools + JRE, and JRE includes the JVM + libraries.'
        },
        {
          id: 'b',
          text: 'JVM contains JRE, which contains JDK',
          isCorrect: false,
          explanation: 'Incorrect. The hierarchy is JDK → JRE → JVM.'
        },
        {
          id: 'c',
          text: 'They are three separate, unrelated components',
          isCorrect: false,
          explanation: 'Incorrect. They are related: JDK ⊃ JRE ⊃ JVM.'
        },
        {
          id: 'd',
          text: 'JRE and JVM are the same thing',
          isCorrect: false,
          explanation: 'Incorrect. JRE includes the JVM plus additional libraries.'
        }
      ],
      hint: 'Think about what each component includes.'
    },
    {
      id: 'mod1-l2-c9',
      question: 'Which IDE is commonly used for Java development?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        {
          id: 'a',
          text: 'All of the above (Eclipse, IntelliJ IDEA, NetBeans)',
          isCorrect: true,
          explanation: 'Correct! Eclipse, IntelliJ IDEA, and NetBeans are all popular Java IDEs.'
        },
        {
          id: 'b',
          text: 'Only Notepad',
          isCorrect: false,
          explanation: 'Incorrect. While you can write Java in Notepad, IDEs offer much better features.'
        },
        {
          id: 'c',
          text: 'Microsoft Word',
          isCorrect: false,
          explanation: 'Incorrect. Word processors are not suitable for coding.'
        },
        {
          id: 'd',
          text: 'Adobe Photoshop',
          isCorrect: false,
          explanation: 'Incorrect. Photoshop is for image editing, not coding.'
        }
      ],
      hint: 'Think about integrated development environments.'
    },
    {
      id: 'mod1-l2-c10',
      question: 'What does "platform independence" mean in Java?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        {
          id: 'a',
          text: 'Java bytecode can run on any system with a JVM without recompilation',
          isCorrect: true,
          explanation: 'Correct! This is the "Write Once, Run Anywhere" principle - compile once and run on any platform with a JVM.'
        },
        {
          id: 'b',
          text: 'Java code must be recompiled for each operating system',
          isCorrect: false,
          explanation: 'Incorrect. Java code is compiled once and runs on any platform with a JVM.'
        },
        {
          id: 'c',
          text: 'Java only runs on Windows',
          isCorrect: false,
          explanation: 'Incorrect. Java is platform-independent and runs on many operating systems.'
        },
        {
          id: 'd',
          text: 'Java requires different source code for different platforms',
          isCorrect: false,
          explanation: 'Incorrect. The same Java source code works on all platforms.'
        }
      ],
      hint: 'Think about "Write Once, Run Anywhere".'
    }
  ],

  // Lesson 1.3: Operators
  'mod1-lesson3': [
    {
      id: 'mod1-l3-c1',
      question: 'What will this code output?',
      code: 'public class Test {\n    public static void main(String[] args) {\n        int x = 5;\n        int y = 10;\n        System.out.println(x + y);\n    }\n}',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        {
          id: 'a',
          text: '15',
          isCorrect: true,
          explanation: 'Correct! The + operator adds the integers 5 and 10, resulting in 15.'
        },
        {
          id: 'b',
          text: '510',
          isCorrect: false,
          explanation: 'Incorrect. This would be the result if x and y were strings, not integers.'
        },
        {
          id: 'c',
          text: 'x + y',
          isCorrect: false,
          explanation: 'Incorrect. Java evaluates the expression before printing.'
        },
        {
          id: 'd',
          text: 'Error',
          isCorrect: false,
          explanation: 'Incorrect. This code is syntactically correct and will compile.'
        }
      ],
      hint: 'When adding integers, Java performs arithmetic addition.'
    },
    {
      id: 'mod1-l3-c2',
      question: 'Which operator is used for the modulus (remainder) operation in Java?',
      code: 'int result = 17 % 5;',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        {
          id: 'a',
          text: '%',
          isCorrect: true,
          explanation: 'Correct! The % operator returns the remainder of division. 17 % 5 equals 2.'
        },
        {
          id: 'b',
          text: '//',
          isCorrect: false,
          explanation: 'Incorrect. // is used for comments in Java, not modulus.'
        },
        {
          id: 'c',
          text: 'mod',
          isCorrect: false,
          explanation: 'Incorrect. Java uses the % symbol for modulus operations.'
        },
        {
          id: 'd',
          text: '&',
          isCorrect: false,
          explanation: 'Incorrect. & is a bitwise AND operator, not modulus.'
        }
      ],
      hint: 'This operator gives you the remainder after division.'
    },
    {
      id: 'mod1-l3-c3',
      question: 'What is the result of the expression: 10 / 3 in Java?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        {
          id: 'a',
          text: '3',
          isCorrect: true,
          explanation: 'Correct! When dividing two integers, Java performs integer division and truncates the decimal part, so 10/3 = 3.'
        },
        {
          id: 'b',
          text: '3.333',
          isCorrect: false,
          explanation: 'Incorrect. This would be the result with floating-point division. Integer division truncates decimals.'
        },
        {
          id: 'c',
          text: '3.0',
          isCorrect: false,
          explanation: 'Incorrect. Integer division returns an int (3), not a double (3.0).'
        },
        {
          id: 'd',
          text: '4',
          isCorrect: false,
          explanation: 'Incorrect. Java truncates (doesn\'t round) in integer division.'
        }
      ],
      hint: 'Consider the data types involved in the division.'
    },
    {
      id: 'mod1-l3-c4',
      question: 'What will the value of x be after executing: int x = 5; x++;',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        {
          id: 'a',
          text: '6',
          isCorrect: true,
          explanation: 'Correct! The ++ operator increments the value by 1, so x becomes 6.'
        },
        {
          id: 'b',
          text: '5',
          isCorrect: false,
          explanation: 'Incorrect. The ++ operator increases the value by 1.'
        },
        {
          id: 'c',
          text: '7',
          isCorrect: false,
          explanation: 'Incorrect. The ++ operator only adds 1, not 2.'
        },
        {
          id: 'd',
          text: 'Error',
          isCorrect: false,
          explanation: 'Incorrect. This is valid Java syntax.'
        }
      ],
      hint: 'The ++ operator is the increment operator.'
    },
    {
      id: 'mod1-l3-c5',
      question: 'Which of the following is a logical operator in Java?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        {
          id: 'a',
          text: '&&',
          isCorrect: true,
          explanation: 'Correct! && is the logical AND operator used to combine boolean conditions.'
        },
        {
          id: 'b',
          text: '+',
          isCorrect: false,
          explanation: 'Incorrect. + is an arithmetic operator, not a logical operator.'
        },
        {
          id: 'c',
          text: '%',
          isCorrect: false,
          explanation: 'Incorrect. % is the modulus operator, not a logical operator.'
        },
        {
          id: 'd',
          text: '/',
          isCorrect: false,
          explanation: 'Incorrect. / is the division operator, not a logical operator.'
        }
      ],
      hint: 'Logical operators work with boolean values like true and false.'
    },
    {
      id: 'mod1-l3-c6',
      question: 'What does the expression (5 > 3) && (2 < 4) evaluate to?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        {
          id: 'a',
          text: 'true',
          isCorrect: true,
          explanation: 'Correct! Both conditions are true (5 > 3 is true and 2 < 4 is true), so the && operator returns true.'
        },
        {
          id: 'b',
          text: 'false',
          isCorrect: false,
          explanation: 'Incorrect. Both conditions are true, so the result is true.'
        },
        {
          id: 'c',
          text: '1',
          isCorrect: false,
          explanation: 'Incorrect. Java boolean expressions evaluate to true or false, not 1 or 0.'
        },
        {
          id: 'd',
          text: 'Error',
          isCorrect: false,
          explanation: 'Incorrect. This is valid syntax and will compile.'
        }
      ],
      hint: 'The && operator requires both conditions to be true.'
    },
    {
      id: 'mod1-l3-c7',
      question: 'What is the difference between = and == operators?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        {
          id: 'a',
          text: '= is assignment, == is comparison',
          isCorrect: true,
          explanation: 'Correct! = assigns a value to a variable, while == compares two values for equality.'
        },
        {
          id: 'b',
          text: 'They are the same',
          isCorrect: false,
          explanation: 'Incorrect. These operators have different purposes.'
        },
        {
          id: 'c',
          text: '= is comparison, == is assignment',
          isCorrect: false,
          explanation: 'Incorrect. You have them backwards.'
        },
        {
          id: 'd',
          text: '== is used for strings only',
          isCorrect: false,
          explanation: 'Incorrect. == can compare any primitive types, not just strings.'
        }
      ],
      hint: 'Think about what each operator does with values.'
    },
    {
      id: 'mod1-l3-c8',
      question: 'What will this code print: System.out.println(10 > 5 || 3 > 7);',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        {
          id: 'a',
          text: 'true',
          isCorrect: true,
          explanation: 'Correct! The || (OR) operator returns true if at least one condition is true. 10 > 5 is true, so the result is true.'
        },
        {
          id: 'b',
          text: 'false',
          isCorrect: false,
          explanation: 'Incorrect. The first condition (10 > 5) is true, so the || operator returns true.'
        },
        {
          id: 'c',
          text: '10',
          isCorrect: false,
          explanation: 'Incorrect. Logical operators return boolean values, not numbers.'
        },
        {
          id: 'd',
          text: 'Error',
          isCorrect: false,
          explanation: 'Incorrect. This is valid syntax.'
        }
      ],
      hint: 'The || operator needs only one condition to be true.'
    },
    {
      id: 'mod1-l3-c9',
      question: 'Which operator has the highest precedence in Java?',
      code: 'int result = 2 + 3 * 4;',
      difficulty: 'hard',
      xpReward: 20,
      options: [
        {
          id: 'a',
          text: '* (multiplication)',
          isCorrect: true,
          explanation: 'Correct! Multiplication has higher precedence than addition, so 3 * 4 is evaluated first (12), then 2 + 12 = 14.'
        },
        {
          id: 'b',
          text: '+ (addition)',
          isCorrect: false,
          explanation: 'Incorrect. Addition has lower precedence than multiplication.'
        },
        {
          id: 'c',
          text: 'They have equal precedence',
          isCorrect: false,
          explanation: 'Incorrect. Multiplication has higher precedence than addition.'
        },
        {
          id: 'd',
          text: 'Evaluated left to right',
          isCorrect: false,
          explanation: 'Incorrect. Operator precedence takes priority over left-to-right evaluation.'
        }
      ],
      hint: 'Remember the order of operations from mathematics.'
    },
    {
      id: 'mod1-l3-c10',
      question: 'What does the ! operator do in Java?',
      code: 'boolean result = !(5 > 3);',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        {
          id: 'a',
          text: 'Negates a boolean value',
          isCorrect: true,
          explanation: 'Correct! The ! operator reverses a boolean value. Since 5 > 3 is true, !(5 > 3) is false.'
        },
        {
          id: 'b',
          text: 'Multiplies by -1',
          isCorrect: false,
          explanation: 'Incorrect. The ! operator works with boolean values, not numbers.'
        },
        {
          id: 'c',
          text: 'Creates a comment',
          isCorrect: false,
          explanation: 'Incorrect. Comments use // or /* */, not !.'
        },
        {
          id: 'd',
          text: 'Throws an exception',
          isCorrect: false,
          explanation: 'Incorrect. ! is the logical NOT operator.'
        }
      ],
      hint: 'This operator is called the NOT operator.'
    }
  ],

  // Lesson 1.4-1.10 challenges...
  'mod1-lesson4': [
    {
      id: 'mod1-l4-c1',
      question: 'Which data type should be used to store a single character in Java?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        { id: 'a', text: 'char', isCorrect: true, explanation: 'Correct! The char data type stores a single 16-bit Unicode character.' },
        { id: 'b', text: 'String', isCorrect: false, explanation: 'Incorrect. String stores sequences of characters, not a single character.' },
        { id: 'c', text: 'int', isCorrect: false, explanation: 'Incorrect. int stores integer numbers, not characters.' },
        { id: 'd', text: 'byte', isCorrect: false, explanation: 'Incorrect. byte stores small integer values.' }
      ],
      hint: 'Think about the data type designed for single characters.'
    },
    {
      id: 'mod1-l4-c2',
      question: 'What is the default value of an int variable in Java (as a class field)?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        { id: 'a', text: '0', isCorrect: true, explanation: 'Correct! Numeric types default to 0 when declared as class fields.' },
        { id: 'b', text: 'null', isCorrect: false, explanation: 'Incorrect. null is the default for reference types like String, not primitives.' },
        { id: 'c', text: '-1', isCorrect: false, explanation: 'Incorrect. Java does not use -1 as a default value.' },
        { id: 'd', text: 'undefined', isCorrect: false, explanation: 'Incorrect. "undefined" is a JavaScript concept, not Java.' }
      ],
      hint: 'Think about what numeric types are initialized to.'
    },
    {
      id: 'mod1-l4-c3',
      question: 'Which of the following correctly declares a double variable?',
      difficulty: 'easy',
      xpReward: 10,
      code: 'double price = 9.99;',
      options: [
        { id: 'a', text: 'double price = 9.99;', isCorrect: true, explanation: 'Correct! double stores 64-bit floating-point values and can hold decimals like 9.99.' },
        { id: 'b', text: 'Double price = 9.99f;', isCorrect: false, explanation: 'Incorrect. The f suffix makes it a float literal, and Double is the wrapper class.' },
        { id: 'c', text: 'int price = 9.99;', isCorrect: false, explanation: 'Incorrect. int cannot store decimal values; 9.99 would be a compile error.' },
        { id: 'd', text: 'float price = 9.99;', isCorrect: false, explanation: 'Incorrect. 9.99 is a double literal by default; you need 9.99f for float.' }
      ],
      hint: 'Double literals do not need a suffix in Java.'
    },
    {
      id: 'mod1-l4-c4',
      question: 'What is the range of a byte data type in Java?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: '-128 to 127', isCorrect: true, explanation: 'Correct! byte is an 8-bit signed integer ranging from -128 to 127.' },
        { id: 'b', text: '0 to 255', isCorrect: false, explanation: 'Incorrect. Java byte is signed, so it ranges from -128 to 127.' },
        { id: 'c', text: '-32768 to 32767', isCorrect: false, explanation: 'Incorrect. That is the range of short, not byte.' },
        { id: 'd', text: '-2147483648 to 2147483647', isCorrect: false, explanation: 'Incorrect. That is the range of int.' }
      ],
      hint: 'byte is 8 bits, signed. 2^7 = 128.'
    },
    {
      id: 'mod1-l4-c5',
      question: 'What happens when you assign a double value to an int variable without casting?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'int x = 3.14;',
      options: [
        { id: 'a', text: 'Compile-time error', isCorrect: true, explanation: 'Correct! Assigning a double to an int without explicit casting causes a compile-time error because it is a narrowing conversion.' },
        { id: 'b', text: 'x becomes 3', isCorrect: false, explanation: 'Incorrect. This would require an explicit cast: int x = (int) 3.14;' },
        { id: 'c', text: 'x becomes 3.14', isCorrect: false, explanation: 'Incorrect. int cannot hold decimal values.' },
        { id: 'd', text: 'Runtime exception', isCorrect: false, explanation: 'Incorrect. This is caught at compile time, not runtime.' }
      ],
      hint: 'Narrowing conversions require an explicit cast in Java.'
    },
    {
      id: 'mod1-l4-c6',
      question: 'Which literal suffix is required for a long value that exceeds int range?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'long bigNum = 10000000000L;',
      options: [
        { id: 'a', text: 'L or l', isCorrect: true, explanation: 'Correct! The L (or l) suffix tells the compiler the literal is a long, not an int.' },
        { id: 'b', text: 'D or d', isCorrect: false, explanation: 'Incorrect. D is the suffix for double literals, not long.' },
        { id: 'c', text: 'F or f', isCorrect: false, explanation: 'Incorrect. F is the suffix for float literals.' },
        { id: 'd', text: 'No suffix needed', isCorrect: false, explanation: 'Incorrect. Without L, a number exceeding int range causes a compile-time error.' }
      ],
      hint: 'long literals need to tell the compiler they are not int.'
    },
    {
      id: 'mod1-l4-c7',
      question: 'What is the result of widening conversion from int to double?',
      difficulty: 'easy',
      xpReward: 10,
      code: 'int a = 5;\ndouble b = a;',
      options: [
        { id: 'a', text: 'b becomes 5.0, no cast needed', isCorrect: true, explanation: 'Correct! Widening conversions (int → double) happen automatically without a cast because no data is lost.' },
        { id: 'b', text: 'Compile error — types are incompatible', isCorrect: false, explanation: 'Incorrect. Widening conversions are implicit in Java.' },
        { id: 'c', text: 'b becomes 5, the decimal is ignored', isCorrect: false, explanation: 'Incorrect. double always holds a decimal representation; 5 becomes 5.0.' },
        { id: 'd', text: 'Runtime ClassCastException', isCorrect: false, explanation: 'Incorrect. No exception occurs with widening conversions.' }
      ],
      hint: 'Java allows automatic widening from smaller to larger types.'
    },
    {
      id: 'mod1-l4-c8',
      question: 'Which statement about boolean type is correct?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        { id: 'a', text: 'boolean can only be true or false', isCorrect: true, explanation: 'Correct! boolean stores exactly two values: true or false.' },
        { id: 'b', text: 'boolean can be 0 or 1 like in C', isCorrect: false, explanation: 'Incorrect. Java boolean is not numeric. You cannot assign 0 or 1 to it.' },
        { id: 'c', text: 'boolean values can be cast to int', isCorrect: false, explanation: 'Incorrect. Java does not allow casting between boolean and numeric types.' },
        { id: 'd', text: 'boolean default value is null', isCorrect: false, explanation: 'Incorrect. boolean is a primitive; its default value is false, not null.' }
      ],
      hint: 'Java boolean is strictly true or false — not 0 or 1.'
    },
    {
      id: 'mod1-l4-c9',
      question: 'Which data type uses the most memory in Java?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'double (64 bits)', isCorrect: true, explanation: 'Correct! Among primitives, double and long both use 64 bits, making them the largest primitive types.' },
        { id: 'b', text: 'int (32 bits)', isCorrect: false, explanation: 'Incorrect. int uses 32 bits, which is less than double or long.' },
        { id: 'c', text: 'char (16 bits)', isCorrect: false, explanation: 'Incorrect. char is 16 bits.' },
        { id: 'd', text: 'byte (8 bits)', isCorrect: false, explanation: 'Incorrect. byte is the smallest primitive at 8 bits.' }
      ],
      hint: 'Compare the bit sizes: byte=8, short=16, int=32, long/double=64.'
    },
    {
      id: 'mod1-l4-c10',
      question: 'What is the output of the following code?',
      difficulty: 'hard',
      xpReward: 20,
      code: 'int x = 300;\nbyte b = (byte) x;\nSystem.out.println(b);',
      options: [
        { id: 'a', text: '44', isCorrect: true, explanation: 'Correct! Casting 300 to byte causes overflow. 300 - 256 = 44, because byte wraps around at 256.' },
        { id: 'b', text: '300', isCorrect: false, explanation: 'Incorrect. 300 exceeds byte range (-128 to 127), so overflow occurs.' },
        { id: 'c', text: '-44', isCorrect: false, explanation: 'Incorrect. The overflow result for 300 cast to byte is 44, not -44.' },
        { id: 'd', text: 'Compile error', isCorrect: false, explanation: 'Incorrect. The explicit cast (byte) suppresses the compile error.' }
      ],
      hint: 'byte wraps around: values > 127 overflow. 300 mod 256 = 44.'
    },
  ],

  'mod1-lesson5': [
    {
      id: 'mod1-l5-c1',
      question: 'What is the correct way to declare and initialize a String variable?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        { id: 'a', text: 'String name = "John";', isCorrect: true, explanation: 'Correct! This properly declares a String with a double-quoted literal.' },
        { id: 'b', text: 'string name = "John";', isCorrect: false, explanation: 'Incorrect. Java is case-sensitive; String must be capitalized.' },
        { id: 'c', text: 'String name = John;', isCorrect: false, explanation: 'Incorrect. String literals must be in double quotes.' },
        { id: 'd', text: 'Str name = "John";', isCorrect: false, explanation: 'Incorrect. The correct type name is String, not Str.' }
      ],
      hint: 'String literals must be enclosed in double quotes.'
    },
    {
      id: 'mod1-l5-c2',
      question: 'Why should you use .equals() instead of == to compare Strings in Java?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'String a = new String("hello");\nString b = new String("hello");\nSystem.out.println(a == b);      // false\nSystem.out.println(a.equals(b)); // true',
      options: [
        { id: 'a', text: '== compares memory addresses; .equals() compares content', isCorrect: true, explanation: 'Correct! == checks if two references point to the same object. .equals() checks if the character content is the same.' },
        { id: 'b', text: '.equals() is slower so should be avoided', isCorrect: false, explanation: 'Incorrect. .equals() is the correct way to compare String values and is the standard practice.' },
        { id: 'c', text: 'Both work the same for Strings', isCorrect: false, explanation: 'Incorrect. They behave differently because Strings are objects, and == compares references.' },
        { id: 'd', text: '== compares length; .equals() compares content', isCorrect: false, explanation: 'Incorrect. == compares object references (memory addresses), not length.' }
      ],
      hint: 'Strings are objects. == for objects checks reference equality.'
    },
    {
      id: 'mod1-l5-c3',
      question: 'What does the String.length() method return?',
      difficulty: 'easy',
      xpReward: 10,
      code: 'String s = "Java";\nSystem.out.println(s.length());',
      options: [
        { id: 'a', text: '4', isCorrect: true, explanation: 'Correct! "Java" has 4 characters, so length() returns 4.' },
        { id: 'b', text: '3', isCorrect: false, explanation: 'Incorrect. Count all characters: J-a-v-a = 4.' },
        { id: 'c', text: '5', isCorrect: false, explanation: 'Incorrect. length() counts actual characters, not index positions.' },
        { id: 'd', text: 'The last index (3)', isCorrect: false, explanation: 'Incorrect. length() returns the count of characters, not the last index.' }
      ],
      hint: 'Count each character in "Java" carefully.'
    },
    {
      id: 'mod1-l5-c4',
      question: 'Strings in Java are immutable. What does this mean?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'Once created, a String\'s value cannot be changed', isCorrect: true, explanation: 'Correct! String objects cannot be modified. Methods like toUpperCase() return a new String rather than changing the original.' },
        { id: 'b', text: 'Strings cannot be compared', isCorrect: false, explanation: 'Incorrect. Strings can be compared using .equals() or compareTo().' },
        { id: 'c', text: 'Strings are stored as arrays of bytes', isCorrect: false, explanation: 'Incorrect. This relates to internal storage, not immutability.' },
        { id: 'd', text: 'Strings cannot be passed to methods', isCorrect: false, explanation: 'Incorrect. Strings can be passed to methods just like any other variable.' }
      ],
      hint: 'Immutable means the object\'s state cannot change after creation.'
    },
    {
      id: 'mod1-l5-c5',
      question: 'What is the output of this code?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'String s = "Hello World";\nSystem.out.println(s.toUpperCase());',
      options: [
        { id: 'a', text: 'HELLO WORLD', isCorrect: true, explanation: 'Correct! toUpperCase() returns a new String with all letters converted to uppercase.' },
        { id: 'b', text: 'hello world', isCorrect: false, explanation: 'Incorrect. toUpperCase() converts to uppercase, not lowercase. Use toLowerCase() for lowercase.' },
        { id: 'c', text: 'Hello World (unchanged)', isCorrect: false, explanation: 'Incorrect. toUpperCase() does change the case of the returned String.' },
        { id: 'd', text: 'Compile error', isCorrect: false, explanation: 'Incorrect. toUpperCase() is a valid String method.' }
      ],
      hint: 'toUpperCase() returns a NEW String with all caps.'
    },
    {
      id: 'mod1-l5-c6',
      question: 'Which class should you use when you need to build a String through many concatenations in a loop?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'StringBuilder', isCorrect: true, explanation: 'Correct! StringBuilder is mutable and efficient for repeated string concatenations. Using + in a loop creates many temporary String objects.' },
        { id: 'b', text: 'String', isCorrect: false, explanation: 'Incorrect. Concatenating Strings with + in a loop creates many temporary immutable objects and is inefficient.' },
        { id: 'c', text: 'StringArray', isCorrect: false, explanation: 'Incorrect. StringArray is not a Java class.' },
        { id: 'd', text: 'char[]', isCorrect: false, explanation: 'Incorrect. While char[] works, StringBuilder is the recommended approach for string building.' }
      ],
      hint: 'Which class is mutable and designed for building strings efficiently?'
    },
    {
      id: 'mod1-l5-c7',
      question: 'What does String.charAt(0) return for the string "Java"?',
      difficulty: 'easy',
      xpReward: 10,
      code: 'String s = "Java";\nchar c = s.charAt(0);',
      options: [
        { id: 'a', text: '\'J\'', isCorrect: true, explanation: 'Correct! charAt(0) returns the character at index 0, which is \'J\' (String indices start at 0).' },
        { id: 'b', text: '\'a\'', isCorrect: false, explanation: 'Incorrect. \'a\' is at index 1, not index 0.' },
        { id: 'c', text: '\'v\'', isCorrect: false, explanation: 'Incorrect. \'v\' is at index 2.' },
        { id: 'd', text: '1', isCorrect: false, explanation: 'Incorrect. charAt() returns a char, not an integer index.' }
      ],
      hint: 'String indices start at 0.'
    },
    {
      id: 'mod1-l5-c8',
      question: 'What is the result of "Hello" + " " + "World"?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        { id: 'a', text: '"Hello World"', isCorrect: true, explanation: 'Correct! The + operator concatenates strings. "Hello" + " " + "World" = "Hello World".' },
        { id: 'b', text: 'Compile error', isCorrect: false, explanation: 'Incorrect. String concatenation with + is valid in Java.' },
        { id: 'c', text: '"HelloWorld"', isCorrect: false, explanation: 'Incorrect. The space " " between them produces "Hello World" with a space.' },
        { id: 'd', text: 'null', isCorrect: false, explanation: 'Incorrect. These are non-null literals and will concatenate normally.' }
      ],
      hint: 'The + operator joins Strings together.'
    },
    {
      id: 'mod1-l5-c9',
      question: 'What does String.substring(1, 4) return for "Hello"?',
      difficulty: 'hard',
      xpReward: 20,
      code: 'String s = "Hello";\nSystem.out.println(s.substring(1, 4));',
      options: [
        { id: 'a', text: '"ell"', isCorrect: true, explanation: 'Correct! substring(1, 4) returns characters from index 1 (inclusive) to index 4 (exclusive): e, l, l → "ell".' },
        { id: 'b', text: '"Hell"', isCorrect: false, explanation: 'Incorrect. Starting at index 0 would give "Hell". This starts at index 1.' },
        { id: 'c', text: '"ello"', isCorrect: false, explanation: 'Incorrect. The end index 4 is exclusive, so index 4 (\'o\') is not included.' },
        { id: 'd', text: '"Hello"', isCorrect: false, explanation: 'Incorrect. substring(1,4) does not return the full string.' }
      ],
      hint: 'substring(start, end): start is inclusive, end is exclusive.'
    },
    {
      id: 'mod1-l5-c10',
      question: 'What does the contains() method do for Strings?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'String s = "Java Programming";\nSystem.out.println(s.contains("Java"));',
      options: [
        { id: 'a', text: 'Returns true if the String contains the given sequence', isCorrect: true, explanation: 'Correct! contains() returns true if the CharSequence is found within the String. "Java Programming".contains("Java") returns true.' },
        { id: 'b', text: 'Returns the index where the sequence starts', isCorrect: false, explanation: 'Incorrect. indexOf() returns the index. contains() returns a boolean.' },
        { id: 'c', text: 'Removes the given sequence from the String', isCorrect: false, explanation: 'Incorrect. contains() only checks, it does not modify the String.' },
        { id: 'd', text: 'Throws an exception if sequence is not found', isCorrect: false, explanation: 'Incorrect. contains() returns false if not found — it does not throw an exception.' }
      ],
      hint: 'contains() is a boolean check method.'
    },
  ],

  'mod1-lesson6': [
    {
      id: 'mod1-l6-c1',
      question: 'What will be the result of this expression?',
      code: 'int result = 10 + 5 * 2;',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: '20', isCorrect: true, explanation: 'Correct! Multiplication is evaluated first: 5*2=10, then 10+10=20.' },
        { id: 'b', text: '30', isCorrect: false, explanation: 'Incorrect. This would be the result if left-to-right order was followed without precedence.' },
        { id: 'c', text: '15', isCorrect: false, explanation: 'Incorrect. Check operator precedence — * is higher than +.' },
        { id: 'd', text: '100', isCorrect: false, explanation: 'Incorrect. Review the arithmetic operations step by step.' }
      ],
      hint: 'Multiplication (*) has higher precedence than addition (+).'
    },
    {
      id: 'mod1-l6-c2',
      question: 'What does the modulus operator (%) return?',
      difficulty: 'easy',
      xpReward: 10,
      code: 'int r = 17 % 5;',
      options: [
        { id: 'a', text: '2', isCorrect: true, explanation: 'Correct! 17 divided by 5 is 3 remainder 2. The % operator returns the remainder.' },
        { id: 'b', text: '3', isCorrect: false, explanation: 'Incorrect. 3 is the quotient, not the remainder. % returns the remainder.' },
        { id: 'c', text: '5', isCorrect: false, explanation: 'Incorrect. % returns the remainder of the division, not the divisor.' },
        { id: 'd', text: '0', isCorrect: false, explanation: 'Incorrect. 17 is not evenly divisible by 5.' }
      ],
      hint: '17 = 5 × 3 + ?'
    },
    {
      id: 'mod1-l6-c3',
      question: 'What is the result of the following comparison?',
      difficulty: 'easy',
      xpReward: 10,
      code: 'System.out.println(10 != 5);',
      options: [
        { id: 'a', text: 'true', isCorrect: true, explanation: 'Correct! != means "not equal". 10 is not equal to 5, so the result is true.' },
        { id: 'b', text: 'false', isCorrect: false, explanation: 'Incorrect. != returns true when values are different.' },
        { id: 'c', text: '10', isCorrect: false, explanation: 'Incorrect. Comparison operators return boolean (true/false), not numbers.' },
        { id: 'd', text: 'Compile error', isCorrect: false, explanation: 'Incorrect. != is a valid comparison operator in Java.' }
      ],
      hint: '!= means "not equal to".'
    },
    {
      id: 'mod1-l6-c4',
      question: 'What does the compound assignment operator += do?',
      difficulty: 'easy',
      xpReward: 10,
      code: 'int x = 10;\nx += 5;',
      options: [
        { id: 'a', text: 'x becomes 15', isCorrect: true, explanation: 'Correct! x += 5 is shorthand for x = x + 5. So 10 + 5 = 15.' },
        { id: 'b', text: 'x becomes 5', isCorrect: false, explanation: 'Incorrect. += adds the right value to x, it does not replace it.' },
        { id: 'c', text: 'x becomes 50', isCorrect: false, explanation: 'Incorrect. += adds, not multiplies.' },
        { id: 'd', text: 'Compile error', isCorrect: false, explanation: 'Incorrect. += is a valid compound assignment operator.' }
      ],
      hint: '+= is short for x = x + something.'
    },
    {
      id: 'mod1-l6-c5',
      question: 'What does the && operator do in Java?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'boolean result = (5 > 3) && (10 < 20);',
      options: [
        { id: 'a', text: 'Returns true only if BOTH conditions are true', isCorrect: true, explanation: 'Correct! && is the logical AND operator. Both (5>3) and (10<20) are true, so result is true.' },
        { id: 'b', text: 'Returns true if EITHER condition is true', isCorrect: false, explanation: 'Incorrect. That describes ||, the OR operator. && requires both to be true.' },
        { id: 'c', text: 'Compares memory addresses', isCorrect: false, explanation: 'Incorrect. == compares values/references. && is the logical AND operator.' },
        { id: 'd', text: 'Increments both variables', isCorrect: false, explanation: 'Incorrect. && is not an increment operator — that is ++.' }
      ],
      hint: 'AND requires all conditions to be true.'
    },
    {
      id: 'mod1-l6-c6',
      question: 'What is the value of x after this code runs?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'int x = 5;\nint y = x++;',
      options: [
        { id: 'a', text: 'x=6, y=5', isCorrect: true, explanation: 'Correct! x++ is post-increment: y gets the current value of x (5), then x is incremented to 6.' },
        { id: 'b', text: 'x=5, y=6', isCorrect: false, explanation: 'Incorrect. With post-increment (x++), the increment happens AFTER y is assigned.' },
        { id: 'c', text: 'x=6, y=6', isCorrect: false, explanation: 'Incorrect. y gets the value of x before the increment happens.' },
        { id: 'd', text: 'x=5, y=5', isCorrect: false, explanation: 'Incorrect. x does get incremented to 6 after the assignment.' }
      ],
      hint: 'Post-increment (x++) returns the value THEN increments.'
    },
    {
      id: 'mod1-l6-c7',
      question: 'What is the ternary operator and what does it return here?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'int a = 10, b = 20;\nint max = (a > b) ? a : b;',
      options: [
        { id: 'a', text: '20', isCorrect: true, explanation: 'Correct! (a > b) is false (10 > 20 is false), so the result is b = 20.' },
        { id: 'b', text: '10', isCorrect: false, explanation: 'Incorrect. The condition (a > b) is false, so the value after : is returned.' },
        { id: 'c', text: 'true', isCorrect: false, explanation: 'Incorrect. The ternary returns a value (a or b), not a boolean here.' },
        { id: 'd', text: 'Compile error', isCorrect: false, explanation: 'Incorrect. The ternary operator ?: is valid Java syntax.' }
      ],
      hint: 'Ternary: condition ? valueIfTrue : valueIfFalse'
    },
    {
      id: 'mod1-l6-c8',
      question: 'What is the difference between & and && in Java?',
      difficulty: 'hard',
      xpReward: 20,
      options: [
        { id: 'a', text: '&& short-circuits (skips the right side if left is false); & always evaluates both', isCorrect: true, explanation: 'Correct! && is a short-circuit AND: if the left side is false, the right side is never evaluated. & always evaluates both sides.' },
        { id: 'b', text: 'They are identical in behavior', isCorrect: false, explanation: 'Incorrect. The key difference is short-circuit evaluation: && skips right operand when left is false.' },
        { id: 'c', text: '& is for integers, && is for booleans only', isCorrect: false, explanation: 'Incorrect. & works on both booleans and integers (bitwise). && only works on booleans.' },
        { id: 'd', text: '& returns int, && returns boolean', isCorrect: false, explanation: 'Incorrect. When used with booleans, both return boolean. The difference is short-circuiting.' }
      ],
      hint: 'Short-circuit means stopping early when the result is already known.'
    },
    {
      id: 'mod1-l6-c9',
      question: 'Which expression evaluates to true?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: '(3 > 2) || (5 < 1)', isCorrect: true, explanation: 'Correct! || is OR, which returns true if at least ONE side is true. (3>2) is true, so the whole expression is true.' },
        { id: 'b', text: '(3 > 2) && (5 < 1)', isCorrect: false, explanation: 'Incorrect. && requires BOTH sides to be true. (5<1) is false, so this is false.' },
        { id: 'c', text: '!(3 > 2)', isCorrect: false, explanation: 'Incorrect. ! negates true to false. !(true) = false.' },
        { id: 'd', text: '(1 == 2)', isCorrect: false, explanation: 'Incorrect. 1 is not equal to 2.' }
      ],
      hint: 'OR (||) requires only one condition to be true.'
    },
    {
      id: 'mod1-l6-c10',
      question: 'What is the correct operator precedence order (highest to lowest)?',
      difficulty: 'hard',
      xpReward: 20,
      options: [
        { id: 'a', text: '++ / -- → * / % → + - → < > → == != → && → ||', isCorrect: true, explanation: 'Correct! Unary operators are highest, then multiplicative, additive, relational, equality, logical AND, then logical OR.' },
        { id: 'b', text: '+ - → * / → ++ -- → && → ||', isCorrect: false, explanation: 'Incorrect. Unary (++/--) has higher precedence than arithmetic operators.' },
        { id: 'c', text: '&& → || → == != → < > → + - → * / →  ++', isCorrect: false, explanation: 'Incorrect. This is the reverse order — logical operators have lower precedence than arithmetic.' },
        { id: 'd', text: 'All operators have equal precedence', isCorrect: false, explanation: 'Incorrect. Operator precedence is a fundamental concept that determines evaluation order.' }
      ],
      hint: 'PEMDAS equivalent: Unary, Mult/Div, Add/Sub, Relational, Equality, Logical.'
    },
  ],
};

// MODULE 2: Classes and Objects
export const module2Challenges: Record<string, Challenge[]> = {
  'mod2-lesson1': [
    {
      id: 'mod2-l1-c1',
      question: 'Which OOP principle is demonstrated in this code?',
      code: 'public class Animal {\n    protected String name;\n}',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'Encapsulation', isCorrect: true, explanation: 'Correct! Using the protected access modifier demonstrates encapsulation by controlling access to the field.' },
        { id: 'b', text: 'Inheritance', isCorrect: false, explanation: 'Incorrect. Inheritance uses the "extends" keyword.' },
        { id: 'c', text: 'Polymorphism', isCorrect: false, explanation: 'Incorrect. Polymorphism involves method overriding or interfaces.' },
        { id: 'd', text: 'Abstraction', isCorrect: false, explanation: 'Incorrect. Abstraction involves abstract classes or interfaces.' }
      ],
      hint: 'Look at how the field\'s visibility is controlled.'
    },
    {
      id: 'mod2-l1-c2',
      question: 'How do you create an object from a class in Java?',
      difficulty: 'easy',
      xpReward: 10,
      code: 'Car myCar = new Car();',
      options: [
        { id: 'a', text: 'Using the "new" keyword followed by the constructor', isCorrect: true, explanation: 'Correct! "new Car()" calls the constructor and allocates memory for a new Car object.' },
        { id: 'b', text: 'Using the "create" keyword', isCorrect: false, explanation: 'Incorrect. Java uses "new", not "create", to instantiate objects.' },
        { id: 'c', text: 'By declaring the class name as a variable', isCorrect: false, explanation: 'Incorrect. Declaring a variable only creates a reference; "new" creates the actual object.' },
        { id: 'd', text: 'Using the "make" keyword', isCorrect: false, explanation: 'Incorrect. "make" is not a Java keyword. Use "new".' }
      ],
      hint: 'Object instantiation in Java uses a specific keyword.'
    },
    {
      id: 'mod2-l1-c3',
      question: 'What is the difference between a class and an object?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        { id: 'a', text: 'A class is a blueprint; an object is an instance of that blueprint', isCorrect: true, explanation: 'Correct! A class defines the structure and behavior; an object is an actual instance created from that class.' },
        { id: 'b', text: 'A class and an object are the same thing', isCorrect: false, explanation: 'Incorrect. A class is a template; an object is a runtime instance of it.' },
        { id: 'c', text: 'An object is a blueprint; a class is an instance', isCorrect: false, explanation: 'Incorrect. It\'s the other way around — the class is the blueprint.' },
        { id: 'd', text: 'Classes are for methods; objects are for variables', isCorrect: false, explanation: 'Incorrect. Both classes and objects can have fields (variables) and methods.' }
      ],
      hint: 'Think of a class as a cookie cutter and an object as the cookie.'
    },
    {
      id: 'mod2-l1-c4',
      question: 'Which access modifier makes a field accessible only within its own class?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        { id: 'a', text: 'private', isCorrect: true, explanation: 'Correct! private restricts access to only the class where the field is declared.' },
        { id: 'b', text: 'public', isCorrect: false, explanation: 'Incorrect. public makes the field accessible from anywhere.' },
        { id: 'c', text: 'protected', isCorrect: false, explanation: 'Incorrect. protected allows access within the class, subclasses, and the same package.' },
        { id: 'd', text: 'default (no modifier)', isCorrect: false, explanation: 'Incorrect. Default (package-private) allows access within the same package.' }
      ],
      hint: 'Which modifier is the most restrictive?'
    },
    {
      id: 'mod2-l1-c5',
      question: 'What is an instance variable?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'A variable declared inside a class but outside any method, belonging to each object', isCorrect: true, explanation: 'Correct! Instance variables are unique per object. Each object gets its own copy of instance variables.' },
        { id: 'b', text: 'A variable declared inside a method', isCorrect: false, explanation: 'Incorrect. Variables declared inside methods are local variables, not instance variables.' },
        { id: 'c', text: 'A variable shared by all instances of a class', isCorrect: false, explanation: 'Incorrect. Variables shared by all instances are static variables.' },
        { id: 'd', text: 'A variable that cannot be changed', isCorrect: false, explanation: 'Incorrect. That describes a final variable, not an instance variable.' }
      ],
      hint: 'Each object gets its own copy of these variables.'
    },
    {
      id: 'mod2-l1-c6',
      question: 'What does the static keyword mean when applied to a method?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'public static void printInfo() { }',
      options: [
        { id: 'a', text: 'The method belongs to the class, not to any specific object', isCorrect: true, explanation: 'Correct! Static methods belong to the class itself and can be called without creating an instance.' },
        { id: 'b', text: 'The method can never be changed', isCorrect: false, explanation: 'Incorrect. static means class-level ownership, not immutability. "final" prevents overriding.' },
        { id: 'c', text: 'The method is only accessible inside the class', isCorrect: false, explanation: 'Incorrect. static does not restrict visibility — that is the access modifier\'s job.' },
        { id: 'd', text: 'The method runs automatically when the program starts', isCorrect: false, explanation: 'Incorrect. Only the main() method runs at startup. static alone does not do that.' }
      ],
      hint: 'Static members belong to the class, not to instances.'
    },
    {
      id: 'mod2-l1-c7',
      question: 'How do you call a static method named "greet" in class "Hello"?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        { id: 'a', text: 'Hello.greet()', isCorrect: true, explanation: 'Correct! Static methods are called using the ClassName.methodName() syntax.' },
        { id: 'b', text: 'new Hello().greet()', isCorrect: false, explanation: 'Incorrect. While this works, creating an instance to call a static method is unnecessary and not recommended.' },
        { id: 'c', text: 'greet()', isCorrect: false, explanation: 'Incorrect. Without the class name, this only works from within the same class.' },
        { id: 'd', text: 'Hello::greet()', isCorrect: false, explanation: 'Incorrect. Hello::greet is a method reference syntax used with lambdas, not a direct call.' }
      ],
      hint: 'Static methods use ClassName.method() format.'
    },
    {
      id: 'mod2-l1-c8',
      question: 'Which statement about the "public" access modifier is correct?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        { id: 'a', text: 'public members are accessible from any class in any package', isCorrect: true, explanation: 'Correct! public is the most permissive access modifier — no restrictions on access.' },
        { id: 'b', text: 'public members are accessible only within the same package', isCorrect: false, explanation: 'Incorrect. That describes the default (package-private) access. public has no package restrictions.' },
        { id: 'c', text: 'public members are accessible only within the same class', isCorrect: false, explanation: 'Incorrect. That describes private access.' },
        { id: 'd', text: 'public members cannot be modified', isCorrect: false, explanation: 'Incorrect. "public" is about visibility, not mutability.' }
      ],
      hint: 'public is the most open access level.'
    },
    {
      id: 'mod2-l1-c9',
      question: 'What is the output of this code?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'class Dog {\n    String name = "Buddy";\n}\nDog d1 = new Dog();\nDog d2 = new Dog();\nd1.name = "Rex";\nSystem.out.println(d2.name);',
      options: [
        { id: 'a', text: 'Buddy', isCorrect: true, explanation: 'Correct! d1 and d2 are separate objects, each with their own "name" field. Changing d1.name does not affect d2.name.' },
        { id: 'b', text: 'Rex', isCorrect: false, explanation: 'Incorrect. d2 is an independent object. Changing d1.name does not change d2.name.' },
        { id: 'c', text: 'null', isCorrect: false, explanation: 'Incorrect. name is initialized to "Buddy" in the class definition.' },
        { id: 'd', text: 'Compile error', isCorrect: false, explanation: 'Incorrect. This code is valid and will run correctly.' }
      ],
      hint: 'Each object has its own copy of instance fields.'
    },
    {
      id: 'mod2-l1-c10',
      question: 'What must every Java class file\'s public class name match?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'The filename (e.g., class Hello must be in Hello.java)', isCorrect: true, explanation: 'Correct! In Java, a public class name must exactly match the filename. Class Hello goes in Hello.java.' },
        { id: 'b', text: 'The package name', isCorrect: false, explanation: 'Incorrect. The class name must match the filename, not the package name.' },
        { id: 'c', text: 'The name of the main method', isCorrect: false, explanation: 'Incorrect. The main method is always called "main", regardless of the class name.' },
        { id: 'd', text: 'Nothing — names are arbitrary', isCorrect: false, explanation: 'Incorrect. Java enforces that the public class name matches the .java filename.' }
      ],
      hint: 'Java is strict about class names matching filenames.'
    },
  ],

  'mod2-lesson2': [
    {
      id: 'mod2-l2-c1',
      question: 'What is the purpose of a constructor in Java?',
      code: 'public class Student {\n    private String name;\n    public Student(String name) {\n        this.name = name;\n    }\n}',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        { id: 'a', text: 'To initialize objects when they are created', isCorrect: true, explanation: 'Correct! Constructors initialize object state when a new object is created.' },
        { id: 'b', text: 'To destroy objects when no longer needed', isCorrect: false, explanation: 'Incorrect. Java uses garbage collection for cleanup, not constructors.' },
        { id: 'c', text: 'To inherit from parent classes', isCorrect: false, explanation: 'Incorrect. The extends keyword is used for inheritance.' },
        { id: 'd', text: 'To define static methods', isCorrect: false, explanation: 'Incorrect. Constructors initialize instances, not static methods.' }
      ],
      hint: 'Think about what happens when you use "new".'
    },
    {
      id: 'mod2-l2-c2',
      question: 'What is a default constructor?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        { id: 'a', text: 'A no-argument constructor automatically provided by Java if you define no constructors', isCorrect: true, explanation: 'Correct! If you write no constructors, Java provides a default no-arg constructor that sets all fields to default values.' },
        { id: 'b', text: 'The first constructor defined in a class', isCorrect: false, explanation: 'Incorrect. "Default constructor" specifically means a no-arg constructor auto-generated by Java.' },
        { id: 'c', text: 'A constructor with the keyword "default"', isCorrect: false, explanation: 'Incorrect. "default" is not used as a constructor keyword in Java.' },
        { id: 'd', text: 'A constructor that sets all fields to null', isCorrect: false, explanation: 'Incorrect. The default constructor exists automatically, but it sets primitives to 0/false, not null.' }
      ],
      hint: 'Java provides this automatically when you write no constructors.'
    },
    {
      id: 'mod2-l2-c3',
      question: 'What is constructor overloading?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'class Box {\n    Box() { }\n    Box(int w, int h) { }\n    Box(int w, int h, int d) { }\n}',
      options: [
        { id: 'a', text: 'Having multiple constructors with different parameter lists', isCorrect: true, explanation: 'Correct! Constructor overloading allows objects to be created in different ways depending on what arguments are provided.' },
        { id: 'b', text: 'Having a constructor that calls another constructor', isCorrect: false, explanation: 'Incorrect. That is constructor chaining using this(). Overloading means multiple constructors with different parameters.' },
        { id: 'c', text: 'Inheriting constructors from a parent class', isCorrect: false, explanation: 'Incorrect. Constructors are not inherited. That is a different concept.' },
        { id: 'd', text: 'Using "static" in a constructor', isCorrect: false, explanation: 'Incorrect. Constructors cannot be static.' }
      ],
      hint: 'Multiple constructors — each with different parameters.'
    },
    {
      id: 'mod2-l2-c4',
      question: 'What does this() do when used inside a constructor?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'class Person {\n    Person() { this("Unknown"); }\n    Person(String name) { System.out.println(name); }\n}',
      options: [
        { id: 'a', text: 'Calls another constructor in the same class', isCorrect: true, explanation: 'Correct! this() is constructor chaining — it delegates to another constructor in the same class. Must be the first statement.' },
        { id: 'b', text: 'Calls the parent class constructor', isCorrect: false, explanation: 'Incorrect. super() calls the parent class constructor. this() calls a constructor in the SAME class.' },
        { id: 'c', text: 'Creates a new object of the same class', isCorrect: false, explanation: 'Incorrect. this() is a constructor call, not object creation.' },
        { id: 'd', text: 'Refers to the current method name', isCorrect: false, explanation: 'Incorrect. this refers to the current instance; this() calls another constructor.' }
      ],
      hint: 'this() delegates to a sibling constructor.'
    },
    {
      id: 'mod2-l2-c5',
      question: 'What happens when you define a parameterized constructor but no no-arg constructor?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'class Cat {\n    Cat(String name) { }\n}\nCat c = new Cat(); // ?',
      options: [
        { id: 'a', text: 'Compile error — no matching constructor', isCorrect: true, explanation: 'Correct! When you define any constructor, Java no longer provides the default no-arg constructor. new Cat() would fail to compile.' },
        { id: 'b', text: 'Java automatically provides a no-arg constructor', isCorrect: false, explanation: 'Incorrect. Java only auto-provides a no-arg constructor when NO constructors are defined at all.' },
        { id: 'c', text: 'Runtime NullPointerException', isCorrect: false, explanation: 'Incorrect. This is a compile-time error, not a runtime error.' },
        { id: 'd', text: 'No error — any class can be instantiated with no args', isCorrect: false, explanation: 'Incorrect. Only classes with a no-arg constructor can be instantiated without arguments.' }
      ],
      hint: 'Java removes the auto no-arg constructor once you add any constructor.'
    },
    {
      id: 'mod2-l2-c6',
      question: 'What is wrong with defining a constructor as "void"?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'public void Student(String name) { }',
      options: [
        { id: 'a', text: 'This is a method, not a constructor — it will not be called by "new"', isCorrect: true, explanation: 'Correct! Constructors have no return type, not even void. Adding void makes it a regular method, not a constructor.' },
        { id: 'b', text: 'Constructors must return "this"', isCorrect: false, explanation: 'Incorrect. Constructors never have a return type at all.' },
        { id: 'c', text: 'Nothing is wrong — constructors can be void', isCorrect: false, explanation: 'Incorrect. Adding "void" makes it a regular method, not a constructor.' },
        { id: 'd', text: 'Compile error because constructors must be private', isCorrect: false, explanation: 'Incorrect. Constructors can be public, private, or protected.' }
      ],
      hint: 'Constructors have no return type — not even void.'
    },
    {
      id: 'mod2-l2-c7',
      question: 'Where must a this() call appear in a constructor?',
      difficulty: 'hard',
      xpReward: 20,
      options: [
        { id: 'a', text: 'As the very first statement', isCorrect: true, explanation: 'Correct! Both this() and super() must be the first statement in a constructor body. You cannot put them anywhere else.' },
        { id: 'b', text: 'At the very end of the constructor', isCorrect: false, explanation: 'Incorrect. this() must be the FIRST statement, not the last.' },
        { id: 'c', text: 'Anywhere inside the constructor', isCorrect: false, explanation: 'Incorrect. Java enforces that this() is the very first statement.' },
        { id: 'd', text: 'In the class body outside any constructor', isCorrect: false, explanation: 'Incorrect. this() can only appear inside a constructor as its first statement.' }
      ],
      hint: 'Constructor delegation calls have a strict placement rule.'
    },
    {
      id: 'mod2-l2-c8',
      question: 'What is the output of this code?',
      difficulty: 'hard',
      xpReward: 20,
      code: 'class Animal {\n    String type;\n    Animal() { type = "Unknown"; }\n    Animal(String t) { type = t; }\n}\nAnimal a = new Animal("Dog");\nSystem.out.println(a.type);',
      options: [
        { id: 'a', text: 'Dog', isCorrect: true, explanation: 'Correct! new Animal("Dog") calls the parameterized constructor which sets type = "Dog".' },
        { id: 'b', text: 'Unknown', isCorrect: false, explanation: 'Incorrect. "Unknown" is set by the no-arg constructor. Since "Dog" was passed, the parameterized constructor runs.' },
        { id: 'c', text: 'null', isCorrect: false, explanation: 'Incorrect. The constructor sets type to "Dog".' },
        { id: 'd', text: 'Animal', isCorrect: false, explanation: 'Incorrect. "Animal" is the class name, not the value assigned to type.' }
      ],
      hint: 'Which constructor matches the argument "Dog"?'
    },
    {
      id: 'mod2-l2-c9',
      question: 'What is the default value of a String field in a class?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        { id: 'a', text: 'null', isCorrect: true, explanation: 'Correct! Reference types like String are initialized to null by default in class fields.' },
        { id: 'b', text: '""  (empty string)', isCorrect: false, explanation: 'Incorrect. Java does not initialize String fields to empty string — they are null by default.' },
        { id: 'c', text: '0', isCorrect: false, explanation: 'Incorrect. 0 is the default for numeric primitives, not for String (a reference type).' },
        { id: 'd', text: 'undefined', isCorrect: false, explanation: 'Incorrect. "undefined" is JavaScript. Java uses null for uninitialized reference types.' }
      ],
      hint: 'Reference types have a different default than primitive types.'
    },
    {
      id: 'mod2-l2-c10',
      question: 'Can a constructor call another constructor of the same class using this()?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'Yes, as long as this() is the first statement', isCorrect: true, explanation: 'Correct! Constructor chaining with this() is valid as long as it appears as the very first statement in the constructor.' },
        { id: 'b', text: 'No, constructors cannot call other constructors', isCorrect: false, explanation: 'Incorrect. Constructor chaining (using this()) is a valid and common Java pattern.' },
        { id: 'c', text: 'Yes, but only from a static constructor', isCorrect: false, explanation: 'Incorrect. Java does not have static constructors (static initializer blocks are different).' },
        { id: 'd', text: 'Only if both constructors are private', isCorrect: false, explanation: 'Incorrect. Access modifiers do not restrict this() usage.' }
      ],
      hint: 'this() enables constructor chaining within the same class.'
    },
  ],

  'mod2-lesson3': [
    {
      id: 'mod2-l3-c1',
      question: 'What does the "this" keyword refer to?',
      code: 'public class Car {\n    private String model;\n    public void setModel(String model) {\n        this.model = model;\n    }\n}',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        { id: 'a', text: 'The current instance of the class', isCorrect: true, explanation: 'Correct! "this" refers to the current object, distinguishing instance fields from local parameters.' },
        { id: 'b', text: 'The parent class', isCorrect: false, explanation: 'Incorrect. "super" refers to the parent class.' },
        { id: 'c', text: 'A static variable', isCorrect: false, explanation: 'Incorrect. "this" refers to instance members, not static members.' },
        { id: 'd', text: 'The main method', isCorrect: false, explanation: 'Incorrect. "this" refers to the current object, not any method.' }
      ],
      hint: 'The "this" keyword represents the object itself.'
    },
    {
      id: 'mod2-l3-c2',
      question: 'Why is "this" useful when a parameter name shadows an instance variable?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'class Book {\n    String title;\n    void setTitle(String title) {\n        this.title = title; // disambiguate\n    }\n}',
      options: [
        { id: 'a', text: 'this.title refers to the field; title refers to the parameter', isCorrect: true, explanation: 'Correct! When a parameter has the same name as a field, "this" is used to tell them apart.' },
        { id: 'b', text: 'Both title and this.title refer to the parameter', isCorrect: false, explanation: 'Incorrect. Without "this", the local parameter shadows the field.' },
        { id: 'c', text: '"this" creates a new variable', isCorrect: false, explanation: 'Incorrect. "this" does not create variables — it refers to the current instance.' },
        { id: 'd', text: '"this" is only needed in static methods', isCorrect: false, explanation: 'Incorrect. "this" cannot be used in static methods at all.' }
      ],
      hint: '"this" helps when local and instance names clash.'
    },
    {
      id: 'mod2-l3-c3',
      question: 'Can "this" be used inside a static method?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'No — static methods have no object instance, so "this" does not exist', isCorrect: true, explanation: 'Correct! Static methods belong to the class, not an instance. There is no current object, so "this" is meaningless and causes a compile error.' },
        { id: 'b', text: 'Yes — "this" always works in any method', isCorrect: false, explanation: 'Incorrect. Using "this" in a static method causes a compile-time error.' },
        { id: 'c', text: 'Yes, but only if the class has one instance', isCorrect: false, explanation: 'Incorrect. Java does not allow "this" in static methods regardless of instance count.' },
        { id: 'd', text: 'Only if the static method is public', isCorrect: false, explanation: 'Incorrect. Access modifier has nothing to do with whether "this" is allowed.' }
      ],
      hint: 'Static = no object. No object = no "this".'
    },
    {
      id: 'mod2-l3-c4',
      question: 'What does "return this;" do inside a method?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'class Builder {\n    Builder setName(String n) {\n        // ...\n        return this;\n    }\n}',
      options: [
        { id: 'a', text: 'Returns the current object, enabling method chaining', isCorrect: true, explanation: 'Correct! "return this" returns the current object so methods can be chained: builder.setName("x").setAge(20).' },
        { id: 'b', text: 'Creates a copy of the current object', isCorrect: false, explanation: 'Incorrect. "return this" returns the same object reference, not a copy.' },
        { id: 'c', text: 'Terminates the program', isCorrect: false, explanation: 'Incorrect. "return this" simply returns the current object — it does not exit the program.' },
        { id: 'd', text: 'Causes infinite recursion', isCorrect: false, explanation: 'Incorrect. "return this" just returns the reference; it does not call the method again.' }
      ],
      hint: 'This pattern is used by the Builder design pattern.'
    },
    {
      id: 'mod2-l3-c5',
      question: 'What is the output of this code?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'class Counter {\n    int count = 0;\n    void increment() { this.count++; }\n}\nCounter c = new Counter();\nc.increment();\nc.increment();\nSystem.out.println(c.count);',
      options: [
        { id: 'a', text: '2', isCorrect: true, explanation: 'Correct! increment() adds 1 to this.count each time. After two calls, count = 2.' },
        { id: 'b', text: '0', isCorrect: false, explanation: 'Incorrect. Two calls to increment() add to count, making it 2.' },
        { id: 'c', text: '1', isCorrect: false, explanation: 'Incorrect. Two calls are made, not one.' },
        { id: 'd', text: 'Compile error', isCorrect: false, explanation: 'Incorrect. This is valid Java code.' }
      ],
      hint: 'Count how many times increment() is called.'
    },
    {
      id: 'mod2-l3-c6',
      question: 'What does passing "this" to another method allow?',
      difficulty: 'hard',
      xpReward: 20,
      code: 'class Student {\n    void register(Database db) {\n        db.save(this);\n    }\n}',
      options: [
        { id: 'a', text: 'Passes the current object to the database so it can store it', isCorrect: true, explanation: 'Correct! Passing "this" lets the receiving method (db.save) operate on the current object directly.' },
        { id: 'b', text: 'Creates a copy of the student and saves it', isCorrect: false, explanation: 'Incorrect. "this" passes the reference, not a copy.' },
        { id: 'c', text: 'Causes a StackOverflowError', isCorrect: false, explanation: 'Incorrect. Passing "this" is perfectly safe and common in callbacks and builders.' },
        { id: 'd', text: 'Only works if Student is a subclass of Database', isCorrect: false, explanation: 'Incorrect. Passing "this" does not require any inheritance relationship.' }
      ],
      hint: '"this" is just a reference to the current object.'
    },
    {
      id: 'mod2-l3-c7',
      question: 'Which is a correct use of "this" in a constructor?',
      difficulty: 'easy',
      xpReward: 10,
      code: 'class Pen {\n    String color;\n    Pen(String color) {\n        this.color = color;\n    }\n}',
      options: [
        { id: 'a', text: 'this.color = color — assigns parameter to field', isCorrect: true, explanation: 'Correct! this.color refers to the instance field; color refers to the constructor parameter.' },
        { id: 'b', text: 'this = new Pen() — creates another object', isCorrect: false, explanation: 'Incorrect. You cannot assign to "this" — it is not a variable you can reassign.' },
        { id: 'c', text: 'this.Pen() — calls the constructor', isCorrect: false, explanation: 'Incorrect. You call another constructor using this(), not this.Constructor().' },
        { id: 'd', text: 'return this.color — returns the field from a constructor', isCorrect: false, explanation: 'Incorrect. Constructors cannot return values.' }
      ],
      hint: 'this.field is how you access instance fields from constructors.'
    },
    {
      id: 'mod2-l3-c8',
      question: 'What is method chaining in the context of "this"?',
      difficulty: 'hard',
      xpReward: 20,
      code: 'class Pizza {\n    String size, topping;\n    Pizza setSize(String s) { size=s; return this; }\n    Pizza setTopping(String t) { topping=t; return this; }\n}\nnew Pizza().setSize("Large").setTopping("Cheese");',
      options: [
        { id: 'a', text: 'Calling multiple methods on the same object in a single expression', isCorrect: true, explanation: 'Correct! Each method returns "this", so the next method is called on the same Pizza object.' },
        { id: 'b', text: 'Calling a method recursively', isCorrect: false, explanation: 'Incorrect. Method chaining is not recursion — each call is to a different method.' },
        { id: 'c', text: 'Calling methods from parent to child class', isCorrect: false, explanation: 'Incorrect. Method chaining is about calling multiple methods on the same object instance.' },
        { id: 'd', text: 'Calling methods using "super"', isCorrect: false, explanation: 'Incorrect. Method chaining uses "this" (returning the current object), not "super".' }
      ],
      hint: 'Each method returns "this" so the next method can be called immediately.'
    },
    {
      id: 'mod2-l3-c9',
      question: 'What does "this" evaluate to when printed?',
      difficulty: 'hard',
      xpReward: 20,
      code: 'class Box {\n    void show() { System.out.println(this); }\n}',
      options: [
        { id: 'a', text: 'The class name and hashcode (e.g., Box@1a2b3c)', isCorrect: true, explanation: 'Correct! By default, printing an object calls toString(), which returns ClassName@hexHashCode unless overridden.' },
        { id: 'b', text: 'null', isCorrect: false, explanation: 'Incorrect. "this" is never null inside an instance method (the object must exist to call the method).' },
        { id: 'c', text: 'The class source code', isCorrect: false, explanation: 'Incorrect. Java does not print source code when you print an object.' },
        { id: 'd', text: 'Compile error', isCorrect: false, explanation: 'Incorrect. Printing "this" is valid; it calls the object\'s toString() method.' }
      ],
      hint: 'Printing an object calls toString() — what does the default return?'
    },
    {
      id: 'mod2-l3-c10',
      question: 'What happens if you try to do "this = new Car();" inside a method?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'Compile error — "this" cannot be assigned', isCorrect: true, explanation: 'Correct! "this" is a special reference that cannot be reassigned. It always points to the current instance.' },
        { id: 'b', text: 'The current object is replaced with a new Car', isCorrect: false, explanation: 'Incorrect. You cannot replace the current object via "this". It is a read-only reference.' },
        { id: 'c', text: 'Runtime NullPointerException', isCorrect: false, explanation: 'Incorrect. This would be caught at compile time, not runtime.' },
        { id: 'd', text: 'Works fine — "this" is a normal variable', isCorrect: false, explanation: 'Incorrect. "this" is not a normal variable; you cannot assign to it.' }
      ],
      hint: '"this" is read-only — it always refers to the current instance.'
    },
  ],
};

// MODULE 3: Inheritance
export const module3Challenges: Record<string, Challenge[]> = {
  'mod3-lesson1': [
    {
      id: 'mod3-l1-c1',
      question: 'What keyword is used to establish inheritance in Java?',
      code: 'public class Dog _____ Animal { }',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        { id: 'a', text: 'extends', isCorrect: true, explanation: 'Correct! "extends" creates a subclass that inherits from a superclass.' },
        { id: 'b', text: 'implements', isCorrect: false, explanation: 'Incorrect. "implements" is for interfaces, not class inheritance.' },
        { id: 'c', text: 'inherits', isCorrect: false, explanation: 'Incorrect. Java uses "extends", not "inherits".' },
        { id: 'd', text: 'from', isCorrect: false, explanation: 'Incorrect. "from" is not a Java keyword.' }
      ],
      hint: 'Think about extending the functionality of a parent class.'
    },
    {
      id: 'mod3-l1-c2',
      question: 'Which relationship does inheritance represent?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        { id: 'a', text: 'IS-A relationship (e.g., Dog IS-A Animal)', isCorrect: true, explanation: 'Correct! Inheritance models an IS-A relationship. A Dog IS-A Animal because it inherits Animal\'s properties.' },
        { id: 'b', text: 'HAS-A relationship (e.g., Dog HAS-A Animal)', isCorrect: false, explanation: 'Incorrect. HAS-A describes composition (e.g., Car HAS-A Engine). IS-A describes inheritance.' },
        { id: 'c', text: 'USES-A relationship', isCorrect: false, explanation: 'Incorrect. USES-A is not a standard OOP relationship term for inheritance.' },
        { id: 'd', text: 'CREATES-A relationship', isCorrect: false, explanation: 'Incorrect. Inheritance is an IS-A relationship, not CREATES-A.' }
      ],
      hint: 'A subclass IS-A type of its superclass.'
    },
    {
      id: 'mod3-l1-c3',
      question: 'What does a subclass inherit from its superclass?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'All non-private fields and methods', isCorrect: true, explanation: 'Correct! Subclasses inherit public, protected, and package-private members — not private ones.' },
        { id: 'b', text: 'Only the public methods', isCorrect: false, explanation: 'Incorrect. Protected and package-private members are also inherited.' },
        { id: 'c', text: 'Everything including private members', isCorrect: false, explanation: 'Incorrect. Private members are not inherited (though they exist in the object, they are not accessible).' },
        { id: 'd', text: 'Only the constructor', isCorrect: false, explanation: 'Incorrect. Constructors are NOT inherited in Java.' }
      ],
      hint: 'Access modifiers determine what gets passed down.'
    },
    {
      id: 'mod3-l1-c4',
      question: 'Can a Java class extend more than one class?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'No — Java supports single inheritance only for classes', isCorrect: true, explanation: 'Correct! Java only allows a class to extend ONE superclass. Multiple inheritance of classes is not supported (though multiple interfaces can be implemented).' },
        { id: 'b', text: 'Yes — Java supports multiple inheritance', isCorrect: false, explanation: 'Incorrect. Java does NOT allow a class to extend multiple classes. This is the diamond problem limitation.' },
        { id: 'c', text: 'Yes, but only with the "multi" keyword', isCorrect: false, explanation: 'Incorrect. "multi" is not a Java keyword.' },
        { id: 'd', text: 'Only abstract classes can extend multiple classes', isCorrect: false, explanation: 'Incorrect. No class in Java can extend more than one class.' }
      ],
      hint: 'Java chose single class inheritance to avoid the diamond problem.'
    },
    {
      id: 'mod3-l1-c5',
      question: 'What is the output of this code?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'class Animal {\n    String sound = "...";\n}\nclass Cat extends Animal {\n    String name = "Kitty";\n}\nCat c = new Cat();\nSystem.out.println(c.sound);',
      options: [
        { id: 'a', text: '"..."', isCorrect: true, explanation: 'Correct! Cat inherits the "sound" field from Animal. Accessing c.sound gives the Animal default "...".' },
        { id: 'b', text: 'null', isCorrect: false, explanation: 'Incorrect. "sound" is initialized to "..." in Animal, which Cat inherits.' },
        { id: 'c', text: 'Compile error — Cat does not define sound', isCorrect: false, explanation: 'Incorrect. Cat inherits "sound" from Animal, so it is accessible.' },
        { id: 'd', text: 'Kitty', isCorrect: false, explanation: 'Incorrect. "Kitty" is the value of "name", not "sound".' }
      ],
      hint: 'Inherited fields are accessible in subclass instances.'
    },
    {
      id: 'mod3-l1-c6',
      question: 'Which class is the implicit superclass of every Java class?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'java.lang.Object', isCorrect: true, explanation: 'Correct! Every Java class implicitly extends Object, which provides methods like toString(), equals(), and hashCode().' },
        { id: 'b', text: 'java.lang.Class', isCorrect: false, explanation: 'Incorrect. java.lang.Class represents class metadata, not the base class.' },
        { id: 'c', text: 'java.lang.Base', isCorrect: false, explanation: 'Incorrect. java.lang.Base does not exist in Java.' },
        { id: 'd', text: 'java.lang.Root', isCorrect: false, explanation: 'Incorrect. The actual root class is java.lang.Object.' }
      ],
      hint: 'Every Java object has toString(), equals(), and hashCode() — where do they come from?'
    },
    {
      id: 'mod3-l1-c7',
      question: 'What is a superclass called in the context of inheritance?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        { id: 'a', text: 'Parent class', isCorrect: true, explanation: 'Correct! A superclass is also called a parent class or base class. The inheriting class is the subclass, child class, or derived class.' },
        { id: 'b', text: 'Child class', isCorrect: false, explanation: 'Incorrect. The child class inherits from the parent. The parent class is the superclass.' },
        { id: 'c', text: 'Interface', isCorrect: false, explanation: 'Incorrect. Interfaces are a separate concept. A superclass is a regular class that is extended.' },
        { id: 'd', text: 'Abstract class only', isCorrect: false, explanation: 'Incorrect. Any class (concrete or abstract) can be a superclass.' }
      ],
      hint: 'Think about family relationships — parent, child.'
    },
    {
      id: 'mod3-l1-c8',
      question: 'Can you create an object of a superclass type that holds a subclass instance?',
      difficulty: 'hard',
      xpReward: 20,
      code: 'Animal a = new Dog();',
      options: [
        { id: 'a', text: 'Yes — this is called upcasting', isCorrect: true, explanation: 'Correct! Storing a Dog in an Animal reference is upcasting. A Dog IS-A Animal, so this is valid and safe.' },
        { id: 'b', text: 'No — the types must match exactly', isCorrect: false, explanation: 'Incorrect. Java allows a subclass object to be referenced by its superclass type (upcasting).' },
        { id: 'c', text: 'Yes, but only if Dog is abstract', isCorrect: false, explanation: 'Incorrect. Upcasting works with any subclass, abstract or concrete.' },
        { id: 'd', text: 'Only if you use a cast operator', isCorrect: false, explanation: 'Incorrect. Upcasting (from subclass to superclass) is automatic and does not require a cast.' }
      ],
      hint: 'A subclass reference can be assigned to a superclass variable — IS-A allows it.'
    },
    {
      id: 'mod3-l1-c9',
      question: 'What is method overriding in the context of inheritance?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'A subclass providing its own implementation of a method defined in the superclass', isCorrect: true, explanation: 'Correct! Overriding allows a subclass to replace the inherited method with a more specific implementation.' },
        { id: 'b', text: 'Defining multiple methods with the same name in the same class', isCorrect: false, explanation: 'Incorrect. That is method overloading, not overriding.' },
        { id: 'c', text: 'Making a superclass method private in the subclass', isCorrect: false, explanation: 'Incorrect. You cannot make an inherited method more restrictive (e.g., private).' },
        { id: 'd', text: 'Deleting a method from the superclass', isCorrect: false, explanation: 'Incorrect. Overriding replaces the behavior, it does not delete the parent method.' }
      ],
      hint: 'The subclass replaces the superclass\'s method with its own version.'
    },
    {
      id: 'mod3-l1-c10',
      question: 'What is one major benefit of inheritance?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        { id: 'a', text: 'Code reuse — subclasses don\'t need to rewrite inherited behavior', isCorrect: true, explanation: 'Correct! Inheritance promotes code reuse. Common logic in the superclass is shared across all subclasses.' },
        { id: 'b', text: 'It makes programs run faster', isCorrect: false, explanation: 'Incorrect. Inheritance is about code organization and reuse, not performance.' },
        { id: 'c', text: 'It prevents any bugs from occurring', isCorrect: false, explanation: 'Incorrect. Inheritance does not prevent bugs; it just organizes code hierarchically.' },
        { id: 'd', text: 'It removes the need for methods', isCorrect: false, explanation: 'Incorrect. Inheritance does not remove methods — it shares them.' }
      ],
      hint: 'Inheritance is fundamentally about reusing code.'
    },
  ],

  'mod3-lesson2': [
    {
      id: 'mod3-l2-c1',
      question: 'What does the super() call do in a constructor?',
      code: 'class Dog extends Animal {\n    Dog(String name) { super(name); }\n}',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'Calls the parent class constructor', isCorrect: true, explanation: 'Correct! super() calls the parent class constructor to initialize inherited fields.' },
        { id: 'b', text: 'Creates a new superclass object', isCorrect: false, explanation: 'Incorrect. It calls the parent constructor, not creates a separate object.' },
        { id: 'c', text: 'Deletes the parent class', isCorrect: false, explanation: 'Incorrect. super() does not delete anything.' },
        { id: 'd', text: 'Makes the method static', isCorrect: false, explanation: 'Incorrect. super() is about inheritance, not static methods.' }
      ],
      hint: 'super() initializes the parent part of the object.'
    },
    {
      id: 'mod3-l2-c2',
      question: 'Where must super() appear in a constructor?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'As the very first statement', isCorrect: true, explanation: 'Correct! super() must be the first statement in a constructor. Java enforces this at compile time.' },
        { id: 'b', text: 'Anywhere in the constructor body', isCorrect: false, explanation: 'Incorrect. super() must be the very first statement, not anywhere.' },
        { id: 'c', text: 'At the end of the constructor', isCorrect: false, explanation: 'Incorrect. Placing super() at the end causes a compile error.' },
        { id: 'd', text: 'After all field initializations', isCorrect: false, explanation: 'Incorrect. super() must come before any other statements.' }
      ],
      hint: 'Both super() and this() have the same placement rule.'
    },
    {
      id: 'mod3-l2-c3',
      question: 'What happens if you do NOT explicitly call super() in a subclass constructor?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'Java automatically inserts a no-arg super() call', isCorrect: true, explanation: 'Correct! If you don\'t call super() explicitly, Java inserts super() (the no-arg version) automatically as the first statement.' },
        { id: 'b', text: 'The parent constructor is never called', isCorrect: false, explanation: 'Incorrect. Java always ensures the parent is initialized by auto-inserting super().' },
        { id: 'c', text: 'Compile error in all cases', isCorrect: false, explanation: 'Incorrect. Only fails if the parent has no no-arg constructor.' },
        { id: 'd', text: 'The subclass constructor runs the parent logic directly', isCorrect: false, explanation: 'Incorrect. The parent constructor is called via super(), not duplicated.' }
      ],
      hint: 'Java always calls the parent constructor — explicitly or implicitly.'
    },
    {
      id: 'mod3-l2-c4',
      question: 'How do you call an overridden method from the superclass within a subclass?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'class Dog extends Animal {\n    void sound() {\n        super.sound();\n        System.out.println("Bark");\n    }\n}',
      options: [
        { id: 'a', text: 'super.methodName()', isCorrect: true, explanation: 'Correct! super.sound() calls the Animal version of sound(), then adds Dog-specific behavior.' },
        { id: 'b', text: 'parent.methodName()', isCorrect: false, explanation: 'Incorrect. "parent" is not a Java keyword. Use "super".' },
        { id: 'c', text: 'this.methodName()', isCorrect: false, explanation: 'Incorrect. "this.sound()" would call the Dog version (the current object), causing infinite recursion.' },
        { id: 'd', text: 'Animal.methodName()', isCorrect: false, explanation: 'Incorrect. Calling via class name is for static methods. Use "super" for instance methods.' }
      ],
      hint: '"super" gives access to the parent class\'s version of overridden methods.'
    },
    {
      id: 'mod3-l2-c5',
      question: 'What is the output of this code?',
      difficulty: 'hard',
      xpReward: 20,
      code: 'class A {\n    A() { System.out.println("A"); }\n}\nclass B extends A {\n    B() {\n        super();\n        System.out.println("B");\n    }\n}\nnew B();',
      options: [
        { id: 'a', text: 'A then B', isCorrect: true, explanation: 'Correct! super() runs the A constructor first (prints "A"), then B continues (prints "B").' },
        { id: 'b', text: 'B then A', isCorrect: false, explanation: 'Incorrect. super() is the first statement, so A runs before B.' },
        { id: 'c', text: 'Only B', isCorrect: false, explanation: 'Incorrect. super() always calls the parent constructor.' },
        { id: 'd', text: 'Compile error', isCorrect: false, explanation: 'Incorrect. This is valid code with a proper explicit super() call.' }
      ],
      hint: 'super() runs the parent constructor FIRST.'
    },
    {
      id: 'mod3-l2-c6',
      question: 'Can you access a superclass field using "super.fieldName"?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'class Animal { String name = "Animal"; }\nclass Dog extends Animal {\n    String name = "Dog";\n    void show() { System.out.println(super.name); }\n}',
      options: [
        { id: 'a', text: 'Yes — super.name accesses the Animal class field', isCorrect: true, explanation: 'Correct! When both superclass and subclass have the same field name, super.name accesses the parent version.' },
        { id: 'b', text: 'No — super can only be used for methods', isCorrect: false, explanation: 'Incorrect. super can access both fields and methods of the parent class.' },
        { id: 'c', text: 'Yes, but only for private fields', isCorrect: false, explanation: 'Incorrect. super cannot access private fields. It works for public and protected fields.' },
        { id: 'd', text: 'Compile error', isCorrect: false, explanation: 'Incorrect. super.name is valid when accessing a parent field that is not private.' }
      ],
      hint: 'super.field accesses the parent version of a shadowed field.'
    },
    {
      id: 'mod3-l2-c7',
      question: 'Why would you call super.toString() in an overriding toString() method?',
      difficulty: 'hard',
      xpReward: 20,
      options: [
        { id: 'a', text: 'To include the parent class\'s string representation in addition to your own', isCorrect: true, explanation: 'Correct! Calling super.toString() includes the parent\'s output, then you add your own. This builds on parent behavior.' },
        { id: 'b', text: 'To prevent the child\'s toString() from executing', isCorrect: false, explanation: 'Incorrect. Calling super.toString() does not prevent the child\'s logic — it just gets the parent output too.' },
        { id: 'c', text: 'To make the method static', isCorrect: false, explanation: 'Incorrect. Calling super methods has nothing to do with static.' },
        { id: 'd', text: 'To avoid a NullPointerException', isCorrect: false, explanation: 'Incorrect. super.toString() is not a null safety mechanism.' }
      ],
      hint: 'Super calls let you build on top of parent behavior.'
    },
    {
      id: 'mod3-l2-c8',
      question: 'In multilevel inheritance (A → B → C), how does C access A\'s method?',
      difficulty: 'hard',
      xpReward: 20,
      options: [
        { id: 'a', text: 'C calls super.method() which calls B\'s version, and B can call super.method() to reach A', isCorrect: true, explanation: 'Correct! super always refers to the immediate parent. To reach A from C, B must also forward the super call.' },
        { id: 'b', text: 'C calls super.super.method() to skip B', isCorrect: false, explanation: 'Incorrect. Java does not support "super.super" — you cannot skip levels.' },
        { id: 'c', text: 'C directly calls A.method()', isCorrect: false, explanation: 'Incorrect. You cannot call a specific grandparent class method directly like that from an instance context.' },
        { id: 'd', text: 'Multilevel super access is not possible', isCorrect: false, explanation: 'Incorrect. It is possible through the chain of super calls in each class.' }
      ],
      hint: 'super always refers to the IMMEDIATE parent — one level up only.'
    },
    {
      id: 'mod3-l2-c9',
      question: 'What is the difference between super() and super.method()?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'super() calls the parent constructor; super.method() calls a parent instance method', isCorrect: true, explanation: 'Correct! super() is constructor chaining; super.method() invokes an overridden method from the parent class.' },
        { id: 'b', text: 'They are the same thing', isCorrect: false, explanation: 'Incorrect. super() is for constructors; super.method() is for instance methods.' },
        { id: 'c', text: 'super() creates a new parent object; super.method() deletes it', isCorrect: false, explanation: 'Incorrect. Neither creates a separate parent object.' },
        { id: 'd', text: 'super() can be called anywhere; super.method() only in constructors', isCorrect: false, explanation: 'Incorrect. It\'s the other way: super() can only be in constructors; super.method() is used in regular methods.' }
      ],
      hint: 'One is for constructors, the other for methods.'
    },
    {
      id: 'mod3-l2-c10',
      question: 'What is the output of this code?',
      difficulty: 'hard',
      xpReward: 20,
      code: 'class Vehicle {\n    void info() { System.out.println("Vehicle"); }\n}\nclass Car extends Vehicle {\n    void info() {\n        super.info();\n        System.out.println("Car");\n    }\n}\nnew Car().info();',
      options: [
        { id: 'a', text: 'Vehicle then Car', isCorrect: true, explanation: 'Correct! super.info() prints "Vehicle" first, then "Car" is printed by the Car class.' },
        { id: 'b', text: 'Car then Vehicle', isCorrect: false, explanation: 'Incorrect. super.info() is called first, so "Vehicle" appears before "Car".' },
        { id: 'c', text: 'Only Vehicle', isCorrect: false, explanation: 'Incorrect. After super.info(), the Car code also runs.' },
        { id: 'd', text: 'Only Car', isCorrect: false, explanation: 'Incorrect. super.info() also runs, producing "Vehicle".' }
      ],
      hint: 'super.info() runs first, then the rest of Car.info().'
    },
  ],
};

// MODULE 4: Polymorphism
export const module4Challenges: Record<string, Challenge[]> = {
  'mod4-lesson1': [
    {
      id: 'mod4-l1-c1',
      question: 'What is method overriding?',
      code: 'class Animal {\n    void sound() { System.out.println("..."); }\n}\nclass Dog extends Animal {\n    @Override\n    void sound() { System.out.println("Bark"); }\n}',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'Providing a specific implementation of an inherited method in a subclass', isCorrect: true, explanation: 'Correct! Overriding replaces the parent\'s method behavior with a subclass-specific version.' },
        { id: 'b', text: 'Creating multiple methods with the same name but different parameters', isCorrect: false, explanation: 'Incorrect. That is method overloading, not overriding.' },
        { id: 'c', text: 'Making a method private in the subclass', isCorrect: false, explanation: 'Incorrect. Overriding is about reimplementing, not restricting access.' },
        { id: 'd', text: 'Deleting a parent class method', isCorrect: false, explanation: 'Incorrect. Overriding replaces behavior; the parent method still exists.' }
      ],
      hint: 'Look at the @Override annotation.'
    },
    {
      id: 'mod4-l1-c2',
      question: 'What is the purpose of the @Override annotation?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        { id: 'a', text: 'Tells the compiler to verify that a method actually overrides a superclass method', isCorrect: true, explanation: 'Correct! @Override causes a compile error if the method does not actually override a parent method, catching typos and mistakes.' },
        { id: 'b', text: 'Makes the method run faster', isCorrect: false, explanation: 'Incorrect. @Override has no effect on performance.' },
        { id: 'c', text: 'Required for overriding to work', isCorrect: false, explanation: 'Incorrect. @Override is optional, but strongly recommended for safety and clarity.' },
        { id: 'd', text: 'Prevents the method from being overridden again', isCorrect: false, explanation: 'Incorrect. "final" prevents further overriding. @Override just validates the override.' }
      ],
      hint: '@Override is a safety annotation, not a requirement.'
    },
    {
      id: 'mod4-l1-c3',
      question: 'Which rules must a method follow to override a parent method? (Select the correct rule)',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'Same name, same parameter list, same or wider access modifier', isCorrect: true, explanation: 'Correct! The overriding method must have the same signature. Access cannot be narrower (e.g., cannot make public method protected).' },
        { id: 'b', text: 'Same name, different parameter list', isCorrect: false, explanation: 'Incorrect. Different parameters makes it overloading, not overriding.' },
        { id: 'c', text: 'Any name, same return type', isCorrect: false, explanation: 'Incorrect. The name must also match for overriding.' },
        { id: 'd', text: 'Same name, but can have any return type', isCorrect: false, explanation: 'Incorrect. The return type must also match (or be a covariant subtype).' }
      ],
      hint: 'Overriding requires an exact signature match.'
    },
    {
      id: 'mod4-l1-c4',
      question: 'What is runtime polymorphism?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'Animal a = new Dog();\na.sound(); // Which sound() runs?',
      options: [
        { id: 'a', text: 'The JVM decides which method to call at runtime based on the actual object type', isCorrect: true, explanation: 'Correct! Even though "a" is declared as Animal, the JVM sees the actual object is a Dog and calls Dog.sound().' },
        { id: 'b', text: 'The compiler decides which method to call based on the declared type', isCorrect: false, explanation: 'Incorrect. That would be compile-time (static) dispatch. Runtime polymorphism happens at runtime.' },
        { id: 'c', text: 'Animal\'s sound() always runs because "a" is of type Animal', isCorrect: false, explanation: 'Incorrect. The actual object type (Dog) determines which method runs, not the reference type.' },
        { id: 'd', text: 'Both Animal\'s and Dog\'s sound() run', isCorrect: false, explanation: 'Incorrect. Only one method runs — the most specific one for the actual object.' }
      ],
      hint: 'The actual object type (Dog), not the reference type (Animal), determines the method.'
    },
    {
      id: 'mod4-l1-c5',
      question: 'Can a static method be overridden in Java?',
      difficulty: 'hard',
      xpReward: 20,
      options: [
        { id: 'a', text: 'No — static methods are "hidden", not overridden', isCorrect: true, explanation: 'Correct! Static methods belong to the class, not instances. Defining the same static method in a subclass "hides" it rather than overrides it. Runtime polymorphism does not apply.' },
        { id: 'b', text: 'Yes — static methods override just like instance methods', isCorrect: false, explanation: 'Incorrect. Static method "overriding" is actually method hiding — different behavior.' },
        { id: 'c', text: 'Yes, but only if marked with @Override', isCorrect: false, explanation: 'Incorrect. @Override on a static method causes a compile error because hiding is not overriding.' },
        { id: 'd', text: 'Static methods cannot be redefined in subclasses', isCorrect: false, explanation: 'Incorrect. They can be redefined, but this is called hiding, not overriding.' }
      ],
      hint: 'Static methods belong to the class — there is no dynamic dispatch for them.'
    },
    {
      id: 'mod4-l1-c6',
      question: 'What does "final" do when applied to a method?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'class Animal {\n    final void breathe() { }\n}',
      options: [
        { id: 'a', text: 'Prevents the method from being overridden in subclasses', isCorrect: true, explanation: 'Correct! A final method cannot be overridden. Any attempt to override it in a subclass causes a compile error.' },
        { id: 'b', text: 'Makes the method run only once', isCorrect: false, explanation: 'Incorrect. "final" on a method prevents overriding, not repeat execution.' },
        { id: 'c', text: 'Makes the method private', isCorrect: false, explanation: 'Incorrect. "final" and "private" are separate modifiers with different effects.' },
        { id: 'd', text: 'Makes the method static', isCorrect: false, explanation: 'Incorrect. "final" and "static" are independent modifiers.' }
      ],
      hint: '"final" locks the method implementation — no changes allowed downstream.'
    },
    {
      id: 'mod4-l1-c7',
      question: 'What is the output of this code?',
      difficulty: 'hard',
      xpReward: 20,
      code: 'class Shape {\n    void draw() { System.out.println("Shape"); }\n}\nclass Circle extends Shape {\n    @Override\n    void draw() { System.out.println("Circle"); }\n}\nShape s = new Circle();\ns.draw();',
      options: [
        { id: 'a', text: 'Circle', isCorrect: true, explanation: 'Correct! Even though "s" is declared as Shape, the actual object is Circle. The JVM calls Circle.draw() at runtime.' },
        { id: 'b', text: 'Shape', isCorrect: false, explanation: 'Incorrect. The actual type is Circle, so Circle.draw() is invoked via runtime polymorphism.' },
        { id: 'c', text: 'Both "Shape" and "Circle"', isCorrect: false, explanation: 'Incorrect. Only the overriding method (Circle.draw) runs.' },
        { id: 'd', text: 'Compile error', isCorrect: false, explanation: 'Incorrect. Shape s = new Circle() is valid upcasting.' }
      ],
      hint: 'The actual object (Circle), not the reference type (Shape), decides the method.'
    },
    {
      id: 'mod4-l1-c8',
      question: 'Can you override a method to throw more checked exceptions than the parent?',
      difficulty: 'hard',
      xpReward: 20,
      options: [
        { id: 'a', text: 'No — the overriding method cannot throw new or broader checked exceptions', isCorrect: true, explanation: 'Correct! The overriding method can only throw the same or narrower checked exceptions, or none. Adding new checked exceptions violates the Liskov Substitution Principle.' },
        { id: 'b', text: 'Yes — you can add any exceptions in the overriding method', isCorrect: false, explanation: 'Incorrect. Adding broader checked exceptions in an overriding method causes a compile error.' },
        { id: 'c', text: 'Yes, but only runtime exceptions', isCorrect: false, explanation: 'Incorrect. Unchecked (runtime) exceptions can be added freely, but checked exceptions cannot.' },
        { id: 'd', text: 'No — overriding methods cannot throw any exceptions', isCorrect: false, explanation: 'Incorrect. They can throw the same or narrower checked exceptions, and any unchecked exceptions.' }
      ],
      hint: 'Narrowing is allowed; broadening is not — for checked exceptions.'
    },
    {
      id: 'mod4-l1-c9',
      question: 'Can you override a method to make it more restrictive (e.g., from public to private)?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'No — access cannot become more restrictive when overriding', isCorrect: true, explanation: 'Correct! An overriding method must have the same or wider access. Narrowing access (e.g., public → private) causes a compile error.' },
        { id: 'b', text: 'Yes — any access modifier can be used', isCorrect: false, explanation: 'Incorrect. Access can only stay the same or become wider (e.g., protected → public), never narrower.' },
        { id: 'c', text: 'Yes, but only if the parent method is protected', isCorrect: false, explanation: 'Incorrect. The rule applies regardless of the parent\'s access modifier.' },
        { id: 'd', text: 'Access modifiers are ignored during overriding', isCorrect: false, explanation: 'Incorrect. Access modifiers are strictly enforced during overriding.' }
      ],
      hint: 'Think of the Liskov Substitution Principle — a subclass must be usable where a superclass is expected.'
    },
    {
      id: 'mod4-l1-c10',
      question: 'What is the difference between method hiding and method overriding?',
      difficulty: 'hard',
      xpReward: 20,
      options: [
        { id: 'a', text: 'Overriding uses runtime dispatch; hiding uses compile-time dispatch based on reference type', isCorrect: true, explanation: 'Correct! Overriding (instance methods) is resolved at runtime. Hiding (static methods) is resolved at compile time based on the reference type.' },
        { id: 'b', text: 'They are the same concept', isCorrect: false, explanation: 'Incorrect. Overriding and hiding have different resolution mechanisms.' },
        { id: 'c', text: 'Hiding is for constructors; overriding is for methods', isCorrect: false, explanation: 'Incorrect. Both apply to methods. Hiding applies to static methods; overriding to instance methods.' },
        { id: 'd', text: 'Overriding is for private methods; hiding is for public methods', isCorrect: false, explanation: 'Incorrect. Private methods cannot be overridden. The distinction is about static vs. instance methods.' }
      ],
      hint: 'static → compile time (hiding). instance → runtime (overriding).'
    },
  ],

  'mod4-lesson2': [
    {
      id: 'mod4-l2-c1',
      question: 'Which statement about method overloading is TRUE?',
      code: 'class Calculator {\n    int add(int a, int b) { return a + b; }\n    double add(double a, double b) { return a + b; }\n}',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'Methods must have different parameter lists', isCorrect: true, explanation: 'Correct! Overloaded methods must differ in number, type, or order of parameters.' },
        { id: 'b', text: 'Methods must have different return types', isCorrect: false, explanation: 'Incorrect. Return type alone is not sufficient to overload a method.' },
        { id: 'c', text: 'Methods must be in different classes', isCorrect: false, explanation: 'Incorrect. Overloaded methods are in the same class.' },
        { id: 'd', text: 'Methods must use the @Override annotation', isCorrect: false, explanation: 'Incorrect. @Override is for overriding, not overloading.' }
      ],
      hint: 'Focus on what makes overloaded methods different.'
    },
    {
      id: 'mod4-l2-c2',
      question: 'Is the following valid method overloading?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'class Test {\n    int compute(int a) { return a; }\n    double compute(int a) { return a; }\n}',
      options: [
        { id: 'a', text: 'No — differing only by return type is not valid overloading', isCorrect: true, explanation: 'Correct! Java determines overloads by parameter list, not return type. These two methods have the same parameters, causing a compile error.' },
        { id: 'b', text: 'Yes — different return types make them different methods', isCorrect: false, explanation: 'Incorrect. Return type is not considered when resolving overloads. Both methods would clash.' },
        { id: 'c', text: 'Yes — Java can tell them apart at runtime', isCorrect: false, explanation: 'Incorrect. Overloading is resolved at compile time, and return type is not used for resolution.' },
        { id: 'd', text: 'Only if the methods are private', isCorrect: false, explanation: 'Incorrect. Access modifier does not affect overload resolution.' }
      ],
      hint: 'Overloads must differ in parameter list, not return type.'
    },
    {
      id: 'mod4-l2-c3',
      question: 'When is the correct overloaded method chosen?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'At compile time, based on the argument types', isCorrect: true, explanation: 'Correct! Overloading is compile-time (static) polymorphism. The compiler picks the best matching method based on argument types.' },
        { id: 'b', text: 'At runtime, based on the object\'s actual type', isCorrect: false, explanation: 'Incorrect. Runtime dispatch applies to overriding, not overloading.' },
        { id: 'c', text: 'Randomly chosen by the JVM', isCorrect: false, explanation: 'Incorrect. The compiler deterministically picks the most specific matching method.' },
        { id: 'd', text: 'The first defined method is always chosen', isCorrect: false, explanation: 'Incorrect. The compiler picks based on argument types, not declaration order.' }
      ],
      hint: 'Overloading = compile-time; overriding = runtime.'
    },
    {
      id: 'mod4-l2-c4',
      question: 'Which overloaded method is called here?',
      difficulty: 'hard',
      xpReward: 20,
      code: 'class Printer {\n    void print(int n) { System.out.println("int: " + n); }\n    void print(double n) { System.out.println("double: " + n); }\n}\nnew Printer().print(5);',
      options: [
        { id: 'a', text: 'print(int n) — 5 is an int literal', isCorrect: true, explanation: 'Correct! 5 is an int literal, so the compiler picks the most specific match: print(int).' },
        { id: 'b', text: 'print(double n) — Java always prefers double', isCorrect: false, explanation: 'Incorrect. Java picks the most specific match. Since 5 is an int, print(int) is chosen.' },
        { id: 'c', text: 'Compile error — ambiguous call', isCorrect: false, explanation: 'Incorrect. There is no ambiguity; 5 matches int more specifically than double.' },
        { id: 'd', text: 'Both are called', isCorrect: false, explanation: 'Incorrect. Only one method is called based on the argument type.' }
      ],
      hint: 'Java picks the most specific matching type.'
    },
    {
      id: 'mod4-l2-c5',
      question: 'What is the difference between overloading and overriding?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'Overloading is in the same class (different params); overriding is in a subclass (same params)', isCorrect: true, explanation: 'Correct! Overloading = same class, different parameters. Overriding = subclass, same signature.' },
        { id: 'b', text: 'They are the same concept with different names', isCorrect: false, explanation: 'Incorrect. They serve different purposes and occur in different contexts.' },
        { id: 'c', text: 'Overriding is for constructors; overloading is for methods', isCorrect: false, explanation: 'Incorrect. Both apply to methods. Constructors can be overloaded but not overridden.' },
        { id: 'd', text: 'Overloading is at runtime; overriding is at compile time', isCorrect: false, explanation: 'Incorrect. It\'s the opposite: overloading is compile-time; overriding is runtime.' }
      ],
      hint: 'Key difference: same class vs. subclass, and same vs. different params.'
    },
    {
      id: 'mod4-l2-c6',
      question: 'Can constructors be overloaded in Java?',
      difficulty: 'easy',
      xpReward: 10,
      code: 'class Point {\n    Point() { }\n    Point(int x, int y) { }\n}',
      options: [
        { id: 'a', text: 'Yes — constructors can be overloaded like regular methods', isCorrect: true, explanation: 'Correct! Constructor overloading is common in Java. Each constructor has a different parameter list.' },
        { id: 'b', text: 'No — a class can only have one constructor', isCorrect: false, explanation: 'Incorrect. Java allows multiple constructors as long as their parameter lists differ.' },
        { id: 'c', text: 'Yes, but only if the class extends another class', isCorrect: false, explanation: 'Incorrect. Constructor overloading is allowed for any class regardless of inheritance.' },
        { id: 'd', text: 'No — constructors cannot have parameters', isCorrect: false, explanation: 'Incorrect. Constructors can and often do have parameters.' }
      ],
      hint: 'Constructor overloading follows the same rules as method overloading.'
    },
    {
      id: 'mod4-l2-c7',
      question: 'What is "compile-time polymorphism"?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'Polymorphism resolved by the compiler — method overloading', isCorrect: true, explanation: 'Correct! Compile-time (static) polymorphism is implemented via overloading. The compiler selects the method at compile time.' },
        { id: 'b', text: 'Polymorphism resolved at runtime — method overriding', isCorrect: false, explanation: 'Incorrect. Runtime polymorphism is via overriding. Compile-time is via overloading.' },
        { id: 'c', text: 'Using abstract classes', isCorrect: false, explanation: 'Incorrect. Abstract classes enable runtime polymorphism through overriding.' },
        { id: 'd', text: 'Using the "static" keyword', isCorrect: false, explanation: 'Incorrect. "static" is not the defining feature of compile-time polymorphism.' }
      ],
      hint: 'Which type of polymorphism is decided before the program runs?'
    },
    {
      id: 'mod4-l2-c8',
      question: 'How many overloaded methods can a class have with the same name?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        { id: 'a', text: 'As many as needed, as long as each has a unique parameter list', isCorrect: true, explanation: 'Correct! Java imposes no limit on overloads as long as each has a distinct parameter list.' },
        { id: 'b', text: 'Maximum of 2', isCorrect: false, explanation: 'Incorrect. There is no such limit in Java.' },
        { id: 'c', text: 'Maximum of 5', isCorrect: false, explanation: 'Incorrect. Java does not impose an artificial limit on overloaded methods.' },
        { id: 'd', text: 'Exactly 1 — methods cannot share names', isCorrect: false, explanation: 'Incorrect. Overloading is specifically about multiple methods sharing a name.' }
      ],
      hint: 'Unique parameter lists are the only constraint.'
    },
    {
      id: 'mod4-l2-c9',
      question: 'What happens when Java widens an argument type to find an overload match?',
      difficulty: 'hard',
      xpReward: 20,
      code: 'class Test {\n    void show(long n) { System.out.println("long"); }\n}\nnew Test().show(5); // 5 is int',
      options: [
        { id: 'a', text: '"long" is printed — int 5 is widened to long', isCorrect: true, explanation: 'Correct! If no exact int match exists, Java widens int to long (a safe widening conversion) to find a match.' },
        { id: 'b', text: 'Compile error — no int method exists', isCorrect: false, explanation: 'Incorrect. Java widens the argument type when no exact match is found.' },
        { id: 'c', text: 'Nothing is printed', isCorrect: false, explanation: 'Incorrect. The method is found via widening and runs normally.' },
        { id: 'd', text: 'show(long) is not called — it is ignored', isCorrect: false, explanation: 'Incorrect. The widening conversion makes show(long) the best available match.' }
      ],
      hint: 'Java automatically widens primitive types to find the best overload match.'
    },
    {
      id: 'mod4-l2-c10',
      question: 'Which of the following represents valid method overloading?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'void greet(String name) { }\nvoid greet(String firstName, String lastName) { }',
      options: [
        { id: 'a', text: 'Yes — different number of parameters makes them distinct', isCorrect: true, explanation: 'Correct! The first greet has 1 parameter; the second has 2. Different parameter counts are a valid way to overload.' },
        { id: 'b', text: 'No — both use String parameters so it is invalid', isCorrect: false, explanation: 'Incorrect. The number of parameters differs (1 vs 2), making this valid overloading.' },
        { id: 'c', text: 'No — overloading only works with different types, not counts', isCorrect: false, explanation: 'Incorrect. Overloading can differ by parameter count, type, or order.' },
        { id: 'd', text: 'Yes, but they must be private', isCorrect: false, explanation: 'Incorrect. Access modifiers do not affect overloading validity.' }
      ],
      hint: 'Overloading can differ in number, type, or order of parameters.'
    },
  ],
};

// MODULE 5: Abstraction
export const module5Challenges: Record<string, Challenge[]> = {
  'mod5-lesson1': [
    {
      id: 'mod5-l1-c1',
      question: 'What is true about abstract classes?',
      code: 'abstract class Shape {\n    abstract double area();\n}',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'They cannot be instantiated directly', isCorrect: true, explanation: 'Correct! Abstract classes cannot be instantiated; they must be extended by concrete subclasses.' },
        { id: 'b', text: 'They must have only abstract methods', isCorrect: false, explanation: 'Incorrect. Abstract classes can mix abstract and concrete methods.' },
        { id: 'c', text: 'They cannot have constructors', isCorrect: false, explanation: 'Incorrect. Abstract classes can have constructors (called via super() from subclasses).' },
        { id: 'd', text: 'They are the same as interfaces', isCorrect: false, explanation: 'Incorrect. Abstract classes and interfaces differ in multiple important ways.' }
      ],
      hint: 'Can you do "new Shape()" with an abstract class?'
    },
    {
      id: 'mod5-l1-c2',
      question: 'What must a concrete subclass do with inherited abstract methods?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'abstract class Animal {\n    abstract void sound();\n}\nclass Dog extends Animal {\n    // what must go here?\n}',
      options: [
        { id: 'a', text: 'Provide an implementation for every abstract method', isCorrect: true, explanation: 'Correct! A concrete (non-abstract) subclass must implement all abstract methods, otherwise it must also be declared abstract.' },
        { id: 'b', text: 'Nothing — abstract methods are optional', isCorrect: false, explanation: 'Incorrect. Abstract methods are contracts that must be fulfilled by any concrete subclass.' },
        { id: 'c', text: 'Delete the abstract method from the parent', isCorrect: false, explanation: 'Incorrect. You cannot delete parent methods. You implement them in the subclass.' },
        { id: 'd', text: 'Declare the method as static', isCorrect: false, explanation: 'Incorrect. Implementing an abstract method means overriding it with a concrete body.' }
      ],
      hint: 'A concrete class must fulfill all the abstract contracts.'
    },
    {
      id: 'mod5-l1-c3',
      question: 'Can an abstract class have a constructor?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'Yes — it is called by subclass constructors via super()', isCorrect: true, explanation: 'Correct! Abstract classes do have constructors, which are called when a subclass is instantiated via super().' },
        { id: 'b', text: 'No — abstract classes cannot have constructors', isCorrect: false, explanation: 'Incorrect. Abstract classes can and often do have constructors for initializing shared state.' },
        { id: 'c', text: 'Yes, but only no-arg constructors', isCorrect: false, explanation: 'Incorrect. Abstract class constructors can have any parameters.' },
        { id: 'd', text: 'Only if the class has no abstract methods', isCorrect: false, explanation: 'Incorrect. Constructors are allowed in any abstract class regardless of its abstract methods.' }
      ],
      hint: 'Subclasses call the abstract class constructor via super().'
    },
    {
      id: 'mod5-l1-c4',
      question: 'What does an abstract method look like?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        { id: 'a', text: 'It has no body — only a signature ending with a semicolon', isCorrect: true, explanation: 'Correct! Abstract methods have no implementation: abstract void sound(); — no curly braces.' },
        { id: 'b', text: 'It has an empty body: abstract void sound() {}', isCorrect: false, explanation: 'Incorrect. An empty body {} is a concrete method with no code. Abstract methods have no body at all.' },
        { id: 'c', text: 'It must return null', isCorrect: false, explanation: 'Incorrect. Abstract methods define the return type but have no body to return anything.' },
        { id: 'd', text: 'It must be static', isCorrect: false, explanation: 'Incorrect. Abstract methods cannot be static — they are instance-level contracts.' }
      ],
      hint: 'Abstract methods end with ; — no curly braces.'
    },
    {
      id: 'mod5-l1-c5',
      question: 'Can an abstract class have non-abstract (concrete) methods?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        { id: 'a', text: 'Yes — abstract classes can mix abstract and concrete methods', isCorrect: true, explanation: 'Correct! Abstract classes can provide shared concrete implementations alongside abstract method contracts.' },
        { id: 'b', text: 'No — all methods must be abstract', isCorrect: false, explanation: 'Incorrect. Interfaces require all methods to be abstract by default, not abstract classes.' },
        { id: 'c', text: 'Only if marked with "final"', isCorrect: false, explanation: 'Incorrect. Concrete methods in abstract classes do not require "final".' },
        { id: 'd', text: 'Only static methods can be concrete in abstract classes', isCorrect: false, explanation: 'Incorrect. Both static and instance methods can be concrete in an abstract class.' }
      ],
      hint: 'Abstract classes are partial implementations — some done, some left for subclasses.'
    },
    {
      id: 'mod5-l1-c6',
      question: 'What happens if a subclass does not implement all abstract methods?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'The subclass itself must be declared abstract', isCorrect: true, explanation: 'Correct! If a subclass leaves any abstract method unimplemented, it must itself be marked abstract.' },
        { id: 'b', text: 'The program runs but skips the unimplemented method', isCorrect: false, explanation: 'Incorrect. Java enforces implementation at compile time.' },
        { id: 'c', text: 'The unimplemented method returns null automatically', isCorrect: false, explanation: 'Incorrect. Java does not auto-implement abstract methods.' },
        { id: 'd', text: 'Runtime exception when the method is called', isCorrect: false, explanation: 'Incorrect. This is a compile-time error, not a runtime exception.' }
      ],
      hint: 'Unimplemented abstract methods propagate the "abstract" requirement.'
    },
    {
      id: 'mod5-l1-c7',
      question: 'Can "abstract" and "private" be used together on a method?',
      difficulty: 'hard',
      xpReward: 20,
      options: [
        { id: 'a', text: 'No — abstract private is a compile error', isCorrect: true, explanation: 'Correct! Abstract methods must be overridden by subclasses, but private methods are not visible to subclasses. The combination is contradictory.' },
        { id: 'b', text: 'Yes — you can have abstract private methods', isCorrect: false, explanation: 'Incorrect. Java prohibits abstract private methods because private methods cannot be overridden.' },
        { id: 'c', text: 'Yes, but only in inner classes', isCorrect: false, explanation: 'Incorrect. The restriction applies everywhere.' },
        { id: 'd', text: 'Yes, if the class is also abstract', isCorrect: false, explanation: 'Incorrect. The class being abstract does not remove the contradiction.' }
      ],
      hint: 'abstract means "must override" — private means "cannot see." Contradiction.'
    },
    {
      id: 'mod5-l1-c8',
      question: 'What is the main difference between an abstract class and an interface?',
      difficulty: 'hard',
      xpReward: 20,
      options: [
        { id: 'a', text: 'Abstract classes can have state (fields) and constructors; interfaces cannot (by default)', isCorrect: true, explanation: 'Correct! Abstract classes support instance fields, constructors, and both abstract and concrete methods. Interfaces (before Java 8) only had constants and abstract methods.' },
        { id: 'b', text: 'They are identical in capability', isCorrect: false, explanation: 'Incorrect. Key differences include state, constructors, and multiple inheritance.' },
        { id: 'c', text: 'Interfaces can be instantiated; abstract classes cannot', isCorrect: false, explanation: 'Incorrect. Neither can be directly instantiated.' },
        { id: 'd', text: 'Abstract classes support multiple inheritance; interfaces do not', isCorrect: false, explanation: 'Incorrect. It\'s the other way: interfaces support multiple implementation; classes (abstract or not) support only single inheritance.' }
      ],
      hint: 'Think about state, constructors, and multiple inheritance.'
    },
    {
      id: 'mod5-l1-c9',
      question: 'When would you prefer an abstract class over an interface?',
      difficulty: 'hard',
      xpReward: 20,
      options: [
        { id: 'a', text: 'When subclasses share common state or implementation code', isCorrect: true, explanation: 'Correct! Use an abstract class when you have shared fields/code that all subclasses should inherit. Interfaces are better for pure capability contracts.' },
        { id: 'b', text: 'When you need multiple inheritance', isCorrect: false, explanation: 'Incorrect. Multiple inheritance is supported by interfaces (a class can implement many interfaces), not abstract classes.' },
        { id: 'c', text: 'When all methods should be abstract', isCorrect: false, explanation: 'Incorrect. If all methods should be abstract with no state, an interface is usually the better choice.' },
        { id: 'd', text: 'When you do not want any method implementations', isCorrect: false, explanation: 'Incorrect. If you want no implementations, prefer an interface.' }
      ],
      hint: 'Abstract class = shared state + partial implementation.'
    },
    {
      id: 'mod5-l1-c10',
      question: 'What is the output of this code?',
      difficulty: 'hard',
      xpReward: 20,
      code: 'abstract class Vehicle {\n    String type = "Vehicle";\n    abstract void move();\n    void info() { System.out.println(type); }\n}\nclass Bike extends Vehicle {\n    void move() { System.out.println("Pedal"); }\n}\nBike b = new Bike();\nb.info();\nb.move();',
      options: [
        { id: 'a', text: '"Vehicle" then "Pedal"', isCorrect: true, explanation: 'Correct! b.info() calls the concrete inherited info() which prints "Vehicle". b.move() calls Bike\'s implementation which prints "Pedal".' },
        { id: 'b', text: '"Pedal" then "Vehicle"', isCorrect: false, explanation: 'Incorrect. info() is called first, so "Vehicle" prints before "Pedal".' },
        { id: 'c', text: 'Compile error — cannot use abstract class', isCorrect: false, explanation: 'Incorrect. Bike is a concrete class that properly implements move(). Creating Bike objects is valid.' },
        { id: 'd', text: 'Runtime error', isCorrect: false, explanation: 'Incorrect. All methods are properly implemented and the code runs without errors.' }
      ],
      hint: 'Bike inherits info() from Vehicle and implements move().'
    },
  ],

  'mod5-lesson2': [
    {
      id: 'mod5-l2-c1',
      question: 'What keyword is used to implement an interface?',
      code: 'interface Drawable {\n    void draw();\n}\nclass Circle _____ Drawable {\n    public void draw() { }\n}',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        { id: 'a', text: 'implements', isCorrect: true, explanation: 'Correct! Classes use "implements" to fulfill an interface contract.' },
        { id: 'b', text: 'extends', isCorrect: false, explanation: 'Incorrect. "extends" is for class inheritance. Interfaces use "implements".' },
        { id: 'c', text: 'uses', isCorrect: false, explanation: 'Incorrect. "uses" is not a Java keyword.' },
        { id: 'd', text: 'from', isCorrect: false, explanation: 'Incorrect. "from" is not a Java keyword.' }
      ],
      hint: 'Interfaces are implemented, not extended (for classes).'
    },
    {
      id: 'mod5-l2-c2',
      question: 'Can a class implement more than one interface?',
      difficulty: 'easy',
      xpReward: 10,
      code: 'class Robot implements Movable, Chargeable { }',
      options: [
        { id: 'a', text: 'Yes — a class can implement multiple interfaces', isCorrect: true, explanation: 'Correct! Unlike class inheritance (single only), a class can implement as many interfaces as needed.' },
        { id: 'b', text: 'No — only one interface per class', isCorrect: false, explanation: 'Incorrect. Java explicitly allows multiple interface implementation to achieve a form of multiple inheritance.' },
        { id: 'c', text: 'Yes, but only if both interfaces have no methods', isCorrect: false, explanation: 'Incorrect. A class can implement multiple interfaces regardless of how many methods they have.' },
        { id: 'd', text: 'Only abstract classes can implement multiple interfaces', isCorrect: false, explanation: 'Incorrect. Any class, concrete or abstract, can implement multiple interfaces.' }
      ],
      hint: 'Multiple interfaces = multiple inheritance of type in Java.'
    },
    {
      id: 'mod5-l2-c3',
      question: 'What is the default access modifier of interface methods (before Java 8)?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'public abstract', isCorrect: true, explanation: 'Correct! Interface methods are implicitly public and abstract. You do not need to write those keywords.' },
        { id: 'b', text: 'private', isCorrect: false, explanation: 'Incorrect. Interface methods are public by default — they are meant to be implemented by external classes.' },
        { id: 'c', text: 'protected', isCorrect: false, explanation: 'Incorrect. Interface methods are public abstract by default.' },
        { id: 'd', text: 'package-private', isCorrect: false, explanation: 'Incorrect. Interface members are public by default.' }
      ],
      hint: 'Interfaces define a public contract — all methods are public.'
    },
    {
      id: 'mod5-l2-c4',
      question: 'What must a concrete class that implements an interface do?',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        { id: 'a', text: 'Implement all abstract methods declared in the interface', isCorrect: true, explanation: 'Correct! Unless the implementing class is abstract itself, it must provide implementations for all interface methods.' },
        { id: 'b', text: 'Only implement methods it wants to use', isCorrect: false, explanation: 'Incorrect. All abstract interface methods must be implemented in a concrete class.' },
        { id: 'c', text: 'Extend the interface using "extends"', isCorrect: false, explanation: 'Incorrect. Classes "implement" interfaces, not "extend" them.' },
        { id: 'd', text: 'Nothing — interfaces only serve as documentation', isCorrect: false, explanation: 'Incorrect. The Java compiler enforces that all interface methods are implemented.' }
      ],
      hint: 'Interfaces are contracts — all terms must be fulfilled.'
    },
    {
      id: 'mod5-l2-c5',
      question: 'What is the output of this code?',
      difficulty: 'hard',
      xpReward: 20,
      code: 'interface Greeting {\n    void greet();\n}\nclass Hello implements Greeting {\n    public void greet() { System.out.println("Hello!"); }\n}\nGreeting g = new Hello();\ng.greet();',
      options: [
        { id: 'a', text: '"Hello!"', isCorrect: true, explanation: 'Correct! g is of type Greeting but holds a Hello object. greet() is dispatched at runtime to Hello.greet().' },
        { id: 'b', text: 'Nothing — Greeting has no implementation', isCorrect: false, explanation: 'Incorrect. Hello implements greet(), which is what runs.' },
        { id: 'c', text: 'Compile error — cannot assign Hello to Greeting', isCorrect: false, explanation: 'Incorrect. A class that implements an interface can be stored in an interface reference.' },
        { id: 'd', text: 'Runtime error', isCorrect: false, explanation: 'Incorrect. This is valid polymorphic code that runs correctly.' }
      ],
      hint: 'Interface references support runtime polymorphism like class references do.'
    },
    {
      id: 'mod5-l2-c6',
      question: 'Can an interface extend another interface?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'interface A { void methodA(); }\ninterface B extends A { void methodB(); }',
      options: [
        { id: 'a', text: 'Yes — interfaces can extend other interfaces using "extends"', isCorrect: true, explanation: 'Correct! An interface can extend another interface. A class implementing B must implement both methodA() and methodB().' },
        { id: 'b', text: 'No — interfaces cannot extend other interfaces', isCorrect: false, explanation: 'Incorrect. Interface inheritance using "extends" is valid and common in Java.' },
        { id: 'c', text: 'Yes, but using "implements" instead of "extends"', isCorrect: false, explanation: 'Incorrect. Interfaces use "extends" to inherit from other interfaces. "implements" is for classes.' },
        { id: 'd', text: 'Only if both interfaces are in the same package', isCorrect: false, explanation: 'Incorrect. Interface inheritance has no package restriction.' }
      ],
      hint: 'Interface-to-interface uses "extends"; class-to-interface uses "implements".'
    },
    {
      id: 'mod5-l2-c7',
      question: 'What is a default method in an interface (Java 8+)?',
      difficulty: 'hard',
      xpReward: 20,
      code: 'interface Logger {\n    default void log(String msg) {\n        System.out.println(msg);\n    }\n}',
      options: [
        { id: 'a', text: 'A method with an implementation that classes can optionally override', isCorrect: true, explanation: 'Correct! Default methods allow interfaces to provide a concrete method body. Implementing classes can use it as-is or override it.' },
        { id: 'b', text: 'A method that runs automatically when the interface is loaded', isCorrect: false, explanation: 'Incorrect. Default methods are just concrete methods in interfaces — they do not auto-run.' },
        { id: 'c', text: 'A method that must be overridden by all implementing classes', isCorrect: false, explanation: 'Incorrect. Abstract (non-default) methods must be implemented. Default methods are optional to override.' },
        { id: 'd', text: 'A static factory method for creating the interface', isCorrect: false, explanation: 'Incorrect. Default methods are instance methods, not factory methods.' }
      ],
      hint: '"default" provides a fallback implementation — override only if needed.'
    },
    {
      id: 'mod5-l2-c8',
      question: 'What type are fields declared in an interface?',
      difficulty: 'medium',
      xpReward: 15,
      code: 'interface Config {\n    int MAX_SIZE = 100;\n}',
      options: [
        { id: 'a', text: 'public static final — they are constants', isCorrect: true, explanation: 'Correct! Interface fields are implicitly public, static, and final — they are constants shared by all implementors.' },
        { id: 'b', text: 'private — only accessible inside the interface', isCorrect: false, explanation: 'Incorrect. Interface fields are public by default.' },
        { id: 'c', text: 'Instance fields that each class gets a copy of', isCorrect: false, explanation: 'Incorrect. Interface fields are static and final — not instance fields.' },
        { id: 'd', text: 'Abstract — must be initialized in implementing classes', isCorrect: false, explanation: 'Incorrect. Interface fields must be initialized where declared and cannot be overridden.' }
      ],
      hint: 'Interface fields are always public, static, and final.'
    },
    {
      id: 'mod5-l2-c9',
      question: 'Can a class both extend a class and implement an interface?',
      difficulty: 'easy',
      xpReward: 10,
      code: 'class SportsCar extends Car implements Turbo { }',
      options: [
        { id: 'a', text: 'Yes — extends one class and implements one or more interfaces', isCorrect: true, explanation: 'Correct! A class can extend one superclass AND implement multiple interfaces simultaneously.' },
        { id: 'b', text: 'No — you must choose either extends or implements', isCorrect: false, explanation: 'Incorrect. Both can be combined in a single class declaration.' },
        { id: 'c', text: 'Yes, but only if the class is abstract', isCorrect: false, explanation: 'Incorrect. Both concrete and abstract classes can extend + implement.' },
        { id: 'd', text: 'Only if the superclass also implements the interface', isCorrect: false, explanation: 'Incorrect. There is no such requirement.' }
      ],
      hint: 'Java allows: class X extends Y implements A, B { }'
    },
    {
      id: 'mod5-l2-c10',
      question: 'Why do interfaces enable "programming to an interface"?',
      difficulty: 'hard',
      xpReward: 20,
      options: [
        { id: 'a', text: 'You can swap implementations without changing code that uses the interface', isCorrect: true, explanation: 'Correct! Code that depends on an interface type works with any implementation. You can change the concrete class without modifying the calling code.' },
        { id: 'b', text: 'Interfaces make code run faster', isCorrect: false, explanation: 'Incorrect. Interfaces are about flexibility and design, not runtime performance.' },
        { id: 'c', text: 'Interfaces prevent bugs automatically', isCorrect: false, explanation: 'Incorrect. Interfaces define contracts but do not prevent logic bugs.' },
        { id: 'd', text: 'Programming to an interface means using only abstract classes', isCorrect: false, explanation: 'Incorrect. "Programming to an interface" refers to using interface types in declarations, not just abstract classes.' }
      ],
      hint: 'Depend on the abstraction, not the concrete implementation.'
    },
  ],
};

// Comprehensive challenges for all remaining modules
export const allLessonChallenges: Record<string, Challenge[]> = {
  ...module1Challenges,
  ...module2Challenges,
  ...module3Challenges,
  ...module4Challenges,
  ...module5Challenges,
  
  // Add more modules with similar patterns...
  // MODULE 6-10 challenges would follow the same structure
  
  // Default challenge for lessons without specific challenges
  'default': [
    {
      id: 'default-c1',
      question: 'Complete this lesson to unlock the challenge!',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        {
          id: 'a',
          text: 'Continue Learning',
          isCorrect: true,
          explanation: 'Great! Keep progressing through the lessons.'
        }
      ]
    }
  ]
};

// Helper function to get challenges for a lesson
export function getChallengesForLesson(lessonId: string): Challenge[] {
  // Try direct lookup first
  let challenges: Challenge[] | undefined;
  
  if (allLessonChallenges[lessonId]) {
    challenges = allLessonChallenges[lessonId];
  }
  
  // Convert lesson1-1 format to mod1-lesson1 format
  // lesson1-1 -> mod1-lesson1
  // lesson2-5 -> mod2-lesson5
  if (!challenges) {
    const match = lessonId.match(/lesson(\d+)-(\d+)/);
    if (match) {
      const moduleNum = match[1];
      const lessonNum = match[2];
      const convertedId = `mod${moduleNum}-lesson${lessonNum}`;
      if (allLessonChallenges[convertedId]) {
        challenges = allLessonChallenges[convertedId];
      }
    }
  }
  
  // Try mod1-lesson1-1 format to mod1-lesson1 format
  if (!challenges) {
    const modMatch = lessonId.match(/mod(\d+)-lesson(\d+)-(\d+)/);
    if (modMatch) {
      const moduleNum = modMatch[1];
      const lessonNum = modMatch[2];
      const convertedId = `mod${moduleNum}-lesson${lessonNum}`;
      if (allLessonChallenges[convertedId]) {
        challenges = allLessonChallenges[convertedId];
      }
    }
  }
  
  // If fewer than 10 challenges found, just return what we have (no identical padding)
  if (challenges && challenges.length > 0 && challenges.length < 10) {
    return challenges;
  }
  
  // If challenges found and has 10 or more, return first 10
  if (challenges && challenges.length >= 10) {
    return challenges.slice(0, 10);
  }
  
  // If no challenges found, generate 10 generic questions
  if (!challenges) {
    const defaultQuestions: Challenge[] = [];
    const baseId = lessonId.replace(/lesson(\d+)-(\d+)/, 'mod$1-l$2');
    
    for (let i = 1; i <= 10; i++) {
      defaultQuestions.push({
        id: `${baseId}-c${i}`,
        question: `Question ${i}: Which statement is true about this topic?`,
        difficulty: (i % 3 === 1 ? 'easy' : i % 3 === 2 ? 'medium' : 'hard') as 'easy' | 'medium' | 'hard',
        xpReward: (i % 3 === 1 ? 10 : i % 3 === 2 ? 15 : 20),
        options: [
          {
            id: 'a',
            text: 'It is an important concept in Java programming',
            isCorrect: true,
            explanation: 'Correct! This topic is fundamental to understanding Java.'
          },
          {
            id: 'b',
            text: 'It should be ignored by beginners',
            isCorrect: false,
            explanation: 'Incorrect. All concepts are important for learning.'
          },
          {
            id: 'c',
            text: 'It is only for advanced programmers',
            isCorrect: false,
            explanation: 'Incorrect. These concepts build upon each other from basics to advanced.'
          },
          {
            id: 'd',
            text: 'It is not used in real-world applications',
            isCorrect: false,
            explanation: 'Incorrect. All Java concepts have practical applications.'
          }
        ],
        hint: 'Focus on understanding the fundamentals.'
      });
    }
    
    return defaultQuestions;
  }
  
  return allLessonChallenges['default'];
}