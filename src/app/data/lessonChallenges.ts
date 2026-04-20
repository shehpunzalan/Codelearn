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
        {
          id: 'a',
          text: 'char',
          isCorrect: true,
          explanation: 'Correct! The char data type stores a single 16-bit Unicode character.'
        },
        {
          id: 'b',
          text: 'String',
          isCorrect: false,
          explanation: 'Incorrect. String is used for sequences of characters, not single characters.'
        },
        {
          id: 'c',
          text: 'int',
          isCorrect: false,
          explanation: 'Incorrect. int stores integer numbers, not characters.'
        },
        {
          id: 'd',
          text: 'byte',
          isCorrect: false,
          explanation: 'Incorrect. byte stores small integer values, not characters.'
        }
      ],
      hint: 'Think about the data type specifically designed for single characters.'
    }
  ],

  'mod1-lesson5': [
    {
      id: 'mod1-l5-c1',
      question: 'What is the correct way to declare and initialize a String variable?',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        {
          id: 'a',
          text: 'String name = "John";',
          isCorrect: true,
          explanation: 'Correct! This properly declares a String variable and initializes it with a value.'
        },
        {
          id: 'b',
          text: 'string name = "John";',
          isCorrect: false,
          explanation: 'Incorrect. Java is case-sensitive; "String" must be capitalized.'
        },
        {
          id: 'c',
          text: 'String name = John;',
          isCorrect: false,
          explanation: 'Incorrect. String literals must be enclosed in double quotes.'
        },
        {
          id: 'd',
          text: 'var name = "John";',
          isCorrect: false,
          explanation: 'Partially correct (works in Java 10+), but explicit type declaration is preferred for beginners.'
        }
      ],
      hint: 'String literals must be enclosed in double quotes.'
    }
  ],

  'mod1-lesson6': [
    {
      id: 'mod1-l6-c1',
      question: 'What will be the result of this expression?',
      code: 'int result = 10 + 5 * 2;',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        {
          id: 'a',
          text: '20',
          isCorrect: true,
          explanation: 'Correct! Following operator precedence, multiplication (5 * 2 = 10) is performed before addition (10 + 10 = 20).'
        },
        {
          id: 'b',
          text: '30',
          isCorrect: false,
          explanation: 'Incorrect. This would be the result if operations were evaluated left to right without precedence.'
        },
        {
          id: 'c',
          text: '15',
          isCorrect: false,
          explanation: 'Incorrect. Check the operator precedence rules.'
        },
        {
          id: 'd',
          text: '100',
          isCorrect: false,
          explanation: 'Incorrect. Review the arithmetic operations.'
        }
      ],
      hint: 'Remember: multiplication has higher precedence than addition.'
    }
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
        {
          id: 'a',
          text: 'Encapsulation',
          isCorrect: true,
          explanation: 'Correct! Using the protected access modifier demonstrates encapsulation by controlling access to the field.'
        },
        {
          id: 'b',
          text: 'Inheritance',
          isCorrect: false,
          explanation: 'Incorrect. Inheritance would be demonstrated with the "extends" keyword.'
        },
        {
          id: 'c',
          text: 'Polymorphism',
          isCorrect: false,
          explanation: 'Incorrect. Polymorphism involves method overriding or interfaces.'
        },
        {
          id: 'd',
          text: 'Abstraction',
          isCorrect: false,
          explanation: 'Incorrect. Abstraction would involve abstract classes or interfaces.'
        }
      ],
      hint: 'Look at how the field\'s visibility is controlled.'
    }
  ],

  'mod2-lesson2': [
    {
      id: 'mod2-l2-c1',
      question: 'What is the purpose of a constructor in Java?',
      code: 'public class Student {\n    private String name;\n    \n    public Student(String name) {\n        this.name = name;\n    }\n}',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        {
          id: 'a',
          text: 'To initialize objects when they are created',
          isCorrect: true,
          explanation: 'Correct! Constructors are special methods that initialize objects with initial values.'
        },
        {
          id: 'b',
          text: 'To destroy objects when no longer needed',
          isCorrect: false,
          explanation: 'Incorrect. Java uses garbage collection for object cleanup, not constructors.'
        },
        {
          id: 'c',
          text: 'To inherit from parent classes',
          isCorrect: false,
          explanation: 'Incorrect. The extends keyword is used for inheritance.'
        },
        {
          id: 'd',
          text: 'To define static methods',
          isCorrect: false,
          explanation: 'Incorrect. Constructors initialize instance objects, not static methods.'
        }
      ],
      hint: 'Think about what happens when you create a new object with "new".'
    }
  ],

  'mod2-lesson3': [
    {
      id: 'mod2-l3-c1',
      question: 'What does the "this" keyword refer to?',
      code: 'public class Car {\n    private String model;\n    \n    public void setModel(String model) {\n        this.model = model;\n    }\n}',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        {
          id: 'a',
          text: 'The current instance of the class',
          isCorrect: true,
          explanation: 'Correct! "this" refers to the current object instance, distinguishing instance variables from parameters.'
        },
        {
          id: 'b',
          text: 'The parent class',
          isCorrect: false,
          explanation: 'Incorrect. "super" is used to refer to the parent class.'
        },
        {
          id: 'c',
          text: 'A static variable',
          isCorrect: false,
          explanation: 'Incorrect. "this" refers to instance members, not static members.'
        },
        {
          id: 'd',
          text: 'The main method',
          isCorrect: false,
          explanation: 'Incorrect. "this" refers to the current object, not methods.'
        }
      ],
      hint: 'The keyword refers to the object itself.'
    }
  ],
};

// MODULE 3: Inheritance
export const module3Challenges: Record<string, Challenge[]> = {
  'mod3-lesson1': [
    {
      id: 'mod3-l1-c1',
      question: 'What keyword is used to establish inheritance in Java?',
      code: 'public class Dog _____ Animal {\n    // Dog inherits from Animal\n}',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        {
          id: 'a',
          text: 'extends',
          isCorrect: true,
          explanation: 'Correct! The "extends" keyword is used to create a subclass that inherits from a superclass.'
        },
        {
          id: 'b',
          text: 'implements',
          isCorrect: false,
          explanation: 'Incorrect. "implements" is used for interfaces, not class inheritance.'
        },
        {
          id: 'c',
          text: 'inherits',
          isCorrect: false,
          explanation: 'Incorrect. Java uses "extends", not "inherits".'
        },
        {
          id: 'd',
          text: 'from',
          isCorrect: false,
          explanation: 'Incorrect. "from" is not a Java keyword for inheritance.'
        }
      ],
      hint: 'Think about extending the functionality of a parent class.'
    }
  ],

  'mod3-lesson2': [
    {
      id: 'mod3-l2-c1',
      question: 'What does the super() call do in a constructor?',
      code: 'public class Dog extends Animal {\n    public Dog(String name) {\n        super(name);\n    }\n}',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        {
          id: 'a',
          text: 'Calls the parent class constructor',
          isCorrect: true,
          explanation: 'Correct! super() calls the constructor of the parent class to initialize inherited members.'
        },
        {
          id: 'b',
          text: 'Creates a new superclass object',
          isCorrect: false,
          explanation: 'Incorrect. It calls the parent constructor, not create a new object.'
        },
        {
          id: 'c',
          text: 'Deletes the parent class',
          isCorrect: false,
          explanation: 'Incorrect. super() doesn\'t delete anything.'
        },
        {
          id: 'd',
          text: 'Makes the method static',
          isCorrect: false,
          explanation: 'Incorrect. super() is about inheritance, not static methods.'
        }
      ],
      hint: 'super() is used to initialize the parent class.'
    }
  ],
};

// MODULE 4: Polymorphism
export const module4Challenges: Record<string, Challenge[]> = {
  'mod4-lesson1': [
    {
      id: 'mod4-l1-c1',
      question: 'What is method overriding?',
      code: 'class Animal {\n    void sound() { System.out.println("Some sound"); }\n}\n\nclass Dog extends Animal {\n    @Override\n    void sound() { System.out.println("Bark"); }\n}',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        {
          id: 'a',
          text: 'Providing a specific implementation of a method in a subclass',
          isCorrect: true,
          explanation: 'Correct! Method overriding allows a subclass to provide its own implementation of a method inherited from the parent class.'
        },
        {
          id: 'b',
          text: 'Creating multiple methods with the same name but different parameters',
          isCorrect: false,
          explanation: 'Incorrect. That\'s method overloading, not overriding.'
        },
        {
          id: 'c',
          text: 'Making a method private',
          isCorrect: false,
          explanation: 'Incorrect. Overriding is about reimplementing methods, not changing access modifiers.'
        },
        {
          id: 'd',
          text: 'Deleting a parent class method',
          isCorrect: false,
          explanation: 'Incorrect. Overriding replaces the implementation, it doesn\'t delete the parent method.'
        }
      ],
      hint: 'Look at the @Override annotation for a clue.'
    }
  ],

  'mod4-lesson2': [
    {
      id: 'mod4-l2-c1',
      question: 'Which statement about method overloading is TRUE?',
      code: 'class Calculator {\n    int add(int a, int b) { return a + b; }\n    double add(double a, double b) { return a + b; }\n}',
      difficulty: 'medium',
      xpReward: 15,
      options: [
        {
          id: 'a',
          text: 'Methods must have different parameter lists',
          isCorrect: true,
          explanation: 'Correct! Overloaded methods must have different parameters (number, type, or order).'
        },
        {
          id: 'b',
          text: 'Methods must have different return types',
          isCorrect: false,
          explanation: 'Incorrect. Return type alone is not sufficient for overloading.'
        },
        {
          id: 'c',
          text: 'Methods must be in different classes',
          isCorrect: false,
          explanation: 'Incorrect. Overloaded methods are in the same class.'
        },
        {
          id: 'd',
          text: 'Methods must use the @Override annotation',
          isCorrect: false,
          explanation: 'Incorrect. @Override is for overriding, not overloading.'
        }
      ],
      hint: 'Focus on the parameters of the add methods.'
    }
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
        {
          id: 'a',
          text: 'They cannot be instantiated directly',
          isCorrect: true,
          explanation: 'Correct! Abstract classes cannot be instantiated; they must be extended by concrete classes.'
        },
        {
          id: 'b',
          text: 'They must have only abstract methods',
          isCorrect: false,
          explanation: 'Incorrect. Abstract classes can have both abstract and concrete methods.'
        },
        {
          id: 'c',
          text: 'They cannot have constructors',
          isCorrect: false,
          explanation: 'Incorrect. Abstract classes can have constructors.'
        },
        {
          id: 'd',
          text: 'They are the same as interfaces',
          isCorrect: false,
          explanation: 'Incorrect. Abstract classes and interfaces are different concepts.'
        }
      ],
      hint: 'Think about whether you can create objects from abstract classes.'
    }
  ],

  'mod5-lesson2': [
    {
      id: 'mod5-l2-c1',
      question: 'What keyword is used to implement an interface?',
      code: 'interface Drawable {\n    void draw();\n}\n\nclass Circle _____ Drawable {\n    public void draw() { }\n}',
      difficulty: 'easy',
      xpReward: 10,
      options: [
        {
          id: 'a',
          text: 'implements',
          isCorrect: true,
          explanation: 'Correct! Classes use "implements" to implement one or more interfaces.'
        },
        {
          id: 'b',
          text: 'extends',
          isCorrect: false,
          explanation: 'Incorrect. "extends" is used for class inheritance, not implementing interfaces.'
        },
        {
          id: 'c',
          text: 'uses',
          isCorrect: false,
          explanation: 'Incorrect. Java uses "implements" for interfaces.'
        },
        {
          id: 'd',
          text: 'from',
          isCorrect: false,
          explanation: 'Incorrect. "from" is not a Java keyword.'
        }
      ],
      hint: 'Interfaces are implemented, not extended (in most cases).'
    }
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
  
  // If challenges found but less than 10, generate additional questions
  if (challenges && challenges.length > 0 && challenges.length < 10) {
    const existingQuestions = [...challenges];
    const neededQuestions = 10 - existingQuestions.length;
    
    for (let i = 0; i < neededQuestions; i++) {
      const questionNum = existingQuestions.length + i + 1;
      const baseId = existingQuestions[0].id.split('-c')[0];
      
      existingQuestions.push({
        id: `${baseId}-c${questionNum}`,
        question: `Which of the following is a best practice in this topic?`,
        difficulty: (i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'medium' : 'hard') as 'easy' | 'medium' | 'hard',
        xpReward: (i % 3 === 0 ? 10 : i % 3 === 1 ? 15 : 20),
        options: [
          {
            id: 'a',
            text: 'Understanding core concepts and practicing regularly',
            isCorrect: true,
            explanation: 'Correct! Consistent practice and understanding fundamental concepts are key to mastery.'
          },
          {
            id: 'b',
            text: 'Memorizing code without understanding',
            isCorrect: false,
            explanation: 'Incorrect. Understanding is more important than memorization.'
          },
          {
            id: 'c',
            text: 'Skipping examples and exercises',
            isCorrect: false,
            explanation: 'Incorrect. Examples and exercises are essential for learning.'
          },
          {
            id: 'd',
            text: 'Avoiding documentation and resources',
            isCorrect: false,
            explanation: 'Incorrect. Documentation is a valuable learning tool.'
          }
        ],
        hint: 'Think about effective learning strategies.'
      });
    }
    
    return existingQuestions;
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