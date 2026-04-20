// Quiz Questions Database - 10 questions per lesson

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

export interface LessonQuiz {
  lessonKey: string;
  questions: QuizQuestion[];
  passingScore: number; // Percentage needed to pass
  xpReward: number;
}

export const quizDatabase: { [key: string]: LessonQuiz } = {
  // Module 1 - Lesson 1: Introduction to Java
  '1-1': {
    lessonKey: '1-1',
    passingScore: 70,
    xpReward: 100,
    questions: [
      {
        id: '1-1-q1',
        question: 'What does JVM stand for in Java?',
        options: [
          'Java Virtual Machine',
          'Java Variable Method',
          'Java Verified Module',
          'Java Visual Manager'
        ],
        correctAnswer: 0,
        explanation: 'JVM stands for Java Virtual Machine. It is the engine that runs Java applications by converting bytecode into machine-specific code.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-1-q2',
        question: 'Who is the creator of Java?',
        options: [
          'Bill Gates',
          'James Gosling',
          'Dennis Ritchie',
          'Bjarne Stroustrup'
        ],
        correctAnswer: 1,
        explanation: 'James Gosling created Java at Sun Microsystems in 1995. He is often referred to as the "Father of Java".',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-1-q3',
        question: 'What is the principle behind "Write Once, Run Anywhere" (WORA)?',
        options: [
          'Java code can be copied to any computer',
          'Java bytecode can run on any platform with JVM',
          'Java files are universal text files',
          'Java automatically adapts to any OS'
        ],
        correctAnswer: 1,
        explanation: 'WORA means Java bytecode compiled on one platform can run on any other platform that has a JVM, without recompilation.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-1-q4',
        question: 'Which of the following is NOT a feature of Java?',
        options: [
          'Object-Oriented',
          'Platform Independent',
          'Pointer Arithmetic',
          'Automatic Garbage Collection'
        ],
        correctAnswer: 2,
        explanation: 'Java does not support pointer arithmetic (direct memory manipulation) for security and simplicity. C/C++ supports pointers, but Java does not.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-1-q5',
        question: 'What file extension is used for compiled Java bytecode?',
        options: [
          '.java',
          '.class',
          '.jar',
          '.exe'
        ],
        correctAnswer: 1,
        explanation: 'Compiled Java bytecode is stored in .class files. The .java extension is for source code.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-1-q6',
        question: 'What is bytecode in Java?',
        options: [
          'Source code written by programmers',
          'Intermediate code executed by JVM',
          'Machine code for specific processors',
          'Encrypted Java code'
        ],
        correctAnswer: 1,
        explanation: 'Bytecode is an intermediate representation of Java code that the JVM can execute. It\'s platform-independent.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-1-q7',
        question: 'Which company originally developed Java?',
        options: [
          'Microsoft',
          'Oracle',
          'Sun Microsystems',
          'IBM'
        ],
        correctAnswer: 2,
        explanation: 'Java was originally developed by Sun Microsystems. Oracle acquired Sun Microsystems in 2010.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-1-q8',
        question: 'What is the main purpose of the Java compiler (javac)?',
        options: [
          'Execute Java programs',
          'Convert .java files to .class files',
          'Debug Java code',
          'Package Java applications'
        ],
        correctAnswer: 1,
        explanation: 'The javac compiler converts Java source code (.java) into bytecode (.class) that the JVM can execute.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-1-q9',
        question: 'Which of these is a characteristic of Object-Oriented Programming in Java?',
        options: [
          'Procedural execution only',
          'No code reusability',
          'Encapsulation and inheritance',
          'Manual memory management'
        ],
        correctAnswer: 2,
        explanation: 'Java is object-oriented and supports encapsulation, inheritance, polymorphism, and abstraction.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-1-q10',
        question: 'What is automatic garbage collection in Java?',
        options: [
          'Deleting unused code files',
          'Automatic memory management and cleanup',
          'Removing syntax errors',
          'Optimizing code performance'
        ],
        correctAnswer: 1,
        explanation: 'Garbage collection automatically reclaims memory occupied by objects that are no longer in use, preventing memory leaks.',
        difficulty: 'hard',
        points: 15
      }
    ]
  },

  // Module 1 - Lesson 2: Setting Up Java Environment
  '1-2': {
    lessonKey: '1-2',
    passingScore: 70,
    xpReward: 100,
    questions: [
      {
        id: '1-2-q1',
        question: 'What is the first step in setting up Java development environment?',
        options: [
          'Install an IDE',
          'Install JDK',
          'Write Java code',
          'Install a web browser'
        ],
        correctAnswer: 1,
        explanation: 'The first step is to install the JDK (Java Development Kit), which includes all necessary tools to develop and run Java applications.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-2-q2',
        question: 'Which environment variable must be set for Java to work properly?',
        options: ['JAVA_HOME', 'JAVA_PATH', 'JDK_HOME', 'JAVA_DIR'],
        correctAnswer: 0,
        explanation: 'JAVA_HOME environment variable should point to the JDK installation directory, allowing other programs to locate Java.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-2-q3',
        question: 'What command is used to check Java installation?',
        options: ['java -check', 'java --version', 'java -version', 'javac -check'],
        correctAnswer: 2,
        explanation: 'The command "java -version" displays the installed Java version and confirms the installation is working correctly.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-2-q4',
        question: 'Which of the following is a popular Java IDE?',
        options: ['Visual Studio', 'IntelliJ IDEA', 'Sublime Text', 'Notepad++'],
        correctAnswer: 1,
        explanation: 'IntelliJ IDEA is a popular and powerful IDE specifically designed for Java development, along with Eclipse and NetBeans.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-2-q5',
        question: 'What is the purpose of the PATH environment variable?',
        options: [
          'Store Java source files',
          'Allow Java commands to be run from any directory',
          'Set Java version',
          'Configure IDE settings'
        ],
        correctAnswer: 1,
        explanation: 'Adding Java bin directory to PATH allows you to run java and javac commands from any directory in the command line.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-2-q6',
        question: 'Which file extension is used for Java source code?',
        options: ['.class', '.jar', '.java', '.jdk'],
        correctAnswer: 2,
        explanation: 'Java source code files use the .java extension and contain human-readable Java code.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-2-q7',
        question: 'What does the javac command do?',
        options: [
          'Runs Java programs',
          'Compiles Java source code',
          'Debugs Java programs',
          'Packages Java applications'
        ],
        correctAnswer: 1,
        explanation: 'The javac command is the Java compiler that converts .java source files into .class bytecode files.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-2-q8',
        question: 'Which tool is used to create JAR files?',
        options: ['javac', 'java', 'jar', 'jdk'],
        correctAnswer: 2,
        explanation: 'The jar tool is used to create, extract, and manage JAR (Java Archive) files, which bundle multiple class files together.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-2-q9',
        question: 'What is the recommended minimum JDK version for modern Java development?',
        options: ['Java 6', 'Java 8', 'Java 11', 'Java 17'],
        correctAnswer: 3,
        explanation: 'Java 17 is the latest LTS (Long Term Support) version and is recommended for modern development, though Java 11 and 8 are still widely used.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-2-q10',
        question: 'Which command runs a compiled Java program?',
        options: [
          'java ClassName.class',
          'java ClassName',
          'javac ClassName',
          'run ClassName'
        ],
        correctAnswer: 1,
        explanation: 'To run a compiled Java program, use "java ClassName" without the .class extension.',
        difficulty: 'easy',
        points: 5
      }
    ]
  },

  // Module 1 - Lesson 3: First Java Program
  '1-3': {
    lessonKey: '1-3',
    passingScore: 70,
    xpReward: 100,
    questions: [
      {
        id: '1-3-q1',
        question: 'What is the entry point of a Java application?',
        options: [
          'start() method',
          'main() method',
          'run() method',
          'begin() method'
        ],
        correctAnswer: 1,
        explanation: 'The main() method is the entry point of any Java application. It must be public static void main(String[] args).',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-3-q2',
        question: 'What is the correct signature of the main method?',
        options: [
          'public void main(String[] args)',
          'public static void main(String[] args)',
          'static void main(String args)',
          'public main(String[] args)'
        ],
        correctAnswer: 1,
        explanation: 'The correct signature is "public static void main(String[] args)" - it must be public, static, void, and take a String array parameter.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-3-q3',
        question: 'Which statement is used to print output in Java?',
        options: [
          'System.out.print()',
          'console.log()',
          'print()',
          'printf()'
        ],
        correctAnswer: 0,
        explanation: 'System.out.println() or System.out.print() are used to print output to the console in Java.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-3-q4',
        question: 'What is the file name rule for a Java class?',
        options: [
          'Any name with .java extension',
          'Must match the public class name',
          'Must be lowercase',
          'Must start with a number'
        ],
        correctAnswer: 1,
        explanation: 'The file name must match the public class name exactly, including case sensitivity.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-3-q5',
        question: 'What does "public" mean in "public class MyClass"?',
        options: [
          'The class can be accessed from anywhere',
          'The class is free to use',
          'The class is published online',
          'The class is open source'
        ],
        correctAnswer: 0,
        explanation: 'The "public" access modifier means the class can be accessed from any other class in any package.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-3-q6',
        question: 'What is the purpose of "static" in the main method?',
        options: [
          'Makes the method unchangeable',
          'Allows the method to be called without creating an object',
          'Makes the method private',
          'Optimizes method performance'
        ],
        correctAnswer: 1,
        explanation: 'The "static" keyword allows the main method to be called by the JVM without creating an instance of the class.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-3-q7',
        question: 'What does "void" mean in the main method signature?',
        options: [
          'The method is empty',
          'The method returns nothing',
          'The method is optional',
          'The method is private'
        ],
        correctAnswer: 1,
        explanation: 'The "void" keyword indicates that the method does not return any value.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-3-q8',
        question: 'What are the command-line arguments in main(String[] args)?',
        options: [
          'Compilation options',
          'Parameters passed when running the program',
          'System properties',
          'Configuration settings'
        ],
        correctAnswer: 1,
        explanation: 'The args parameter holds command-line arguments passed to the program when it is executed.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-3-q9',
        question: 'Which of these is a valid Java identifier?',
        options: ['2variable', 'my-variable', '_myVariable', 'class'],
        correctAnswer: 2,
        explanation: '_myVariable is valid. Identifiers cannot start with digits, contain hyphens, or be Java keywords like "class".',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-3-q10',
        question: 'What is the purpose of semicolons in Java?',
        options: [
          'Separate methods',
          'End statements',
          'Start comments',
          'Define classes'
        ],
        correctAnswer: 1,
        explanation: 'Semicolons are used to terminate statements in Java. Every statement must end with a semicolon.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-3-q11',
        question: 'How do you create a single-line comment in Java?',
        options: ['/* comment */', '// comment', '# comment', '<!-- comment -->'],
        correctAnswer: 1,
        explanation: 'Single-line comments in Java start with //. Everything after // on that line is ignored by the compiler.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-3-q12',
        question: 'What is the correct way to declare a multi-line comment?',
        options: [
          '// comment //',
          '/* comment */',
          '# comment #',
          '<!-- comment -->'
        ],
        correctAnswer: 1,
        explanation: 'Multi-line comments start with /* and end with */. Everything between them is ignored by the compiler.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-3-q13',
        question: 'What happens if you have two public classes in one Java file?',
        options: [
          'Both classes compile successfully',
          'Compilation error',
          'Only the first class is compiled',
          'The file is automatically split'
        ],
        correctAnswer: 1,
        explanation: 'A Java file can have only one public class, and the file name must match that class name.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-3-q14',
        question: 'What is the purpose of the "class" keyword?',
        options: [
          'Define a method',
          'Define a variable',
          'Define a class',
          'Import a library'
        ],
        correctAnswer: 2,
        explanation: 'The "class" keyword is used to define a class, which is the basic building block of Java programs.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-3-q15',
        question: 'Which is the correct way to compile a Java file named Hello.java?',
        options: [
          'java Hello.java',
          'javac Hello.java',
          'compile Hello.java',
          'java -c Hello.java'
        ],
        correctAnswer: 1,
        explanation: 'Use "javac Hello.java" to compile the source file. This creates Hello.class containing bytecode.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-3-q16',
        question: 'After compiling Hello.java, how do you run it?',
        options: [
          'java Hello.class',
          'java Hello',
          'run Hello',
          'execute Hello'
        ],
        correctAnswer: 1,
        explanation: 'Use "java Hello" (without .class extension) to run the compiled program.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-3-q17',
        question: 'What is the purpose of curly braces {} in Java?',
        options: [
          'Create arrays',
          'Define code blocks',
          'Create comments',
          'Import packages'
        ],
        correctAnswer: 1,
        explanation: 'Curly braces {} define code blocks for classes, methods, loops, and conditional statements.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-3-q18',
        question: 'What is System.out in System.out.println()?',
        options: [
          'A method',
          'A variable',
          'An object',
          'A keyword'
        ],
        correctAnswer: 2,
        explanation: 'System.out is a static object of PrintStream class used for standard output.',
        difficulty: 'hard',
        points: 15
      },
      {
        id: '1-3-q19',
        question: 'Can you have a Java program without a main method?',
        options: [
          'No, main method is always required',
          'Yes, but it cannot be executed',
          'Yes, if using another entry point',
          'Only in web applications'
        ],
        correctAnswer: 1,
        explanation: 'You can write a class without main method, but it cannot be executed directly. It can be used by other classes.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-3-q20',
        question: 'What is the output of: System.out.println("Hello" + "World");',
        options: [
          'Hello World',
          'HelloWorld',
          'Hello+World',
          'Compilation error'
        ],
        correctAnswer: 1,
        explanation: 'The + operator concatenates strings without spaces. The output is "HelloWorld".',
        difficulty: 'medium',
        points: 10
      }
    ]
  },

  // Module 1 - Lesson 4: Control Flow - If-Else Statements
  '1-4': {
    lessonKey: '1-4',
    passingScore: 70,
    xpReward: 100,
    questions: [
      {
        id: '1-4-q1',
        question: 'What is the purpose of an if statement in Java?',
        options: ['To loop through code', 'To make decisions in code', 'To define a method', 'To create a class'],
        correctAnswer: 1,
        explanation: 'An if statement is used to execute code conditionally based on whether a condition is true or false.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-4-q2',
        question: 'Which keyword is used with if to provide an alternative execution path?',
        options: ['then', 'else', 'otherwise', 'except'],
        correctAnswer: 1,
        explanation: 'The else keyword provides an alternative code block when the if condition is false.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-4-q3',
        question: 'What is the correct syntax for an if statement?',
        options: ['if x > 5 then', 'if (x > 5)', 'if x > 5:', 'if [x > 5]'],
        correctAnswer: 1,
        explanation: 'In Java, if statements require parentheses around the condition: if (condition)',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-4-q4',
        question: 'What is an else if statement used for?',
        options: ['To end a program', 'To check multiple conditions', 'To declare variables', 'To create loops'],
        correctAnswer: 1,
        explanation: 'else if allows checking multiple conditions sequentially when the previous conditions are false.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-4-q5',
        question: 'Can you have an if statement without an else?',
        options: ['Yes', 'No', 'Only in loops', 'Only in methods'],
        correctAnswer: 0,
        explanation: 'An if statement can stand alone without an else block. The else is optional.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-4-q6',
        question: 'What will be printed? int x = 10; if (x > 5) System.out.println("High");',
        options: ['High', 'Low', 'Nothing', 'Error'],
        correctAnswer: 0,
        explanation: 'Since x is 10 and 10 > 5 is true, "High" will be printed.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-4-q7',
        question: 'What is a nested if statement?',
        options: ['Two if statements side by side', 'An if statement inside another if', 'An if with multiple else', 'A loop inside if'],
        correctAnswer: 1,
        explanation: 'A nested if is an if statement placed inside another if statement.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-4-q8',
        question: 'Which comparison operator checks for equality?',
        options: ['=', '==', '===', 'equals'],
        correctAnswer: 1,
        explanation: 'The == operator checks if two values are equal. = is for assignment.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-4-q9',
        question: 'What does the ! operator do in conditions?',
        options: ['Adds values', 'Negates a boolean', 'Multiplies', 'Divides'],
        correctAnswer: 1,
        explanation: 'The ! (NOT) operator inverts a boolean value: !true becomes false.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-4-q10',
        question: 'Can boolean expressions be combined with && and ||?',
        options: ['Yes', 'No', 'Only with &&', 'Only with ||'],
        correctAnswer: 0,
        explanation: '&& (AND) and || (OR) operators can combine multiple boolean expressions.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-4-q11',
        question: 'What is the ternary operator syntax?',
        options: ['condition ? true : false', 'if ? then : else', 'condition : true ? false', 'true ? condition : false'],
        correctAnswer: 0,
        explanation: 'The ternary operator uses syntax: condition ? valueIfTrue : valueIfFalse',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-4-q12',
        question: 'In if (x > 5 && y < 10), when does it execute?',
        options: ['When either is true', 'When both are true', 'When x > 5 only', 'When y < 10 only'],
        correctAnswer: 1,
        explanation: 'The && operator requires both conditions to be true.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-4-q13',
        question: 'What happens with if (true) System.out.println("A"); System.out.println("B");',
        options: ['Prints A only', 'Prints B only', 'Prints both A and B', 'Error'],
        correctAnswer: 2,
        explanation: 'Without braces, only the first statement is in the if. B always prints.',
        difficulty: 'hard',
        points: 15
      },
      {
        id: '1-4-q14',
        question: 'Which operator means "not equal to"?',
        options: ['<>', '!=', '/=', 'not'],
        correctAnswer: 1,
        explanation: 'The != operator checks if two values are not equal.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-4-q15',
        question: 'What is short-circuit evaluation with &&?',
        options: ['Evaluates all conditions', 'Stops at first false', 'Stops at first true', 'Never stops'],
        correctAnswer: 1,
        explanation: 'With &&, if the first condition is false, the second is not evaluated.',
        difficulty: 'hard',
        points: 15
      },
      {
        id: '1-4-q16',
        question: 'Can you compare strings with == in Java?',
        options: ['Yes, always recommended', 'No, use .equals()', 'Yes, but only for primitives', 'No, use compare()'],
        correctAnswer: 1,
        explanation: 'Use .equals() for string comparison. == compares references, not content.',
        difficulty: 'hard',
        points: 15
      },
      {
        id: '1-4-q17',
        question: 'What does else do in an if-else statement?',
        options: ['Ends the program', 'Executes when if is false', 'Executes always', 'Declares a variable'],
        correctAnswer: 1,
        explanation: 'The else block executes when the if condition evaluates to false.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-4-q18',
        question: 'How many else if clauses can you have?',
        options: ['Only 1', 'Only 2', 'As many as needed', 'None'],
        correctAnswer: 2,
        explanation: 'You can have as many else if clauses as needed to check multiple conditions.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-4-q19',
        question: 'What is the result of: int x = (5 > 3) ? 10 : 20;',
        options: ['x = 5', 'x = 10', 'x = 20', 'Error'],
        correctAnswer: 1,
        explanation: 'Since 5 > 3 is true, the ternary operator assigns 10 to x.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-4-q20',
        question: 'In if (x > 5 || y < 10), when does it execute?',
        options: ['When both are true', 'When either is true', 'Never', 'Always'],
        correctAnswer: 1,
        explanation: 'The || operator executes if at least one condition is true.',
        difficulty: 'medium',
        points: 10
      }
    ]
  },

  // Module 1 - Lesson 5: Loops - For and While
  '1-5': {
    lessonKey: '1-5',
    passingScore: 70,
    xpReward: 100,
    questions: [
      {
        id: '1-5-q1',
        question: 'What is the purpose of a loop in programming?',
        options: ['To make decisions', 'To repeat code multiple times', 'To define methods', 'To create classes'],
        correctAnswer: 1,
        explanation: 'Loops allow you to execute a block of code repeatedly until a condition is met.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-5-q2',
        question: 'Which loop checks the condition before executing?',
        options: ['do-while', 'while', 'for-each', 'Both while and for'],
        correctAnswer: 3,
        explanation: 'Both while and for loops check the condition before executing the loop body.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-5-q3',
        question: 'What is the syntax of a while loop?',
        options: ['while (condition) { }', 'loop (condition) { }', 'while condition { }', 'repeat (condition) { }'],
        correctAnswer: 0,
        explanation: 'A while loop uses the syntax: while (condition) { code block }',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-5-q4',
        question: 'How many times does this loop run? for (int i = 0; i < 5; i++)',
        options: ['4 times', '5 times', '6 times', 'Infinite'],
        correctAnswer: 1,
        explanation: 'The loop runs from i=0 to i=4 (5 iterations total).',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-5-q5',
        question: 'What does i++ mean in a for loop?',
        options: ['i = i - 1', 'i = i + 1', 'i = i * 2', 'i = 1'],
        correctAnswer: 1,
        explanation: 'i++ increments i by 1, equivalent to i = i + 1.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-5-q6',
        question: 'What is an infinite loop?',
        options: ['A loop that runs very fast', 'A loop that never terminates', 'A loop with no code', 'A loop that runs once'],
        correctAnswer: 1,
        explanation: 'An infinite loop has a condition that is always true, so it never stops.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-5-q7',
        question: 'Which keyword exits a loop immediately?',
        options: ['exit', 'break', 'stop', 'end'],
        correctAnswer: 1,
        explanation: 'The break keyword immediately terminates the loop.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-5-q8',
        question: 'Which keyword skips to the next iteration?',
        options: ['skip', 'next', 'continue', 'pass'],
        correctAnswer: 2,
        explanation: 'The continue keyword skips the rest of the current iteration and starts the next one.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-5-q9',
        question: 'What is the difference between while and do-while?',
        options: ['No difference', 'do-while executes at least once', 'while is faster', 'do-while is older'],
        correctAnswer: 1,
        explanation: 'do-while checks the condition after execution, so it always runs at least once.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-5-q10',
        question: 'What does for(;;) create?',
        options: ['Syntax error', 'Infinite loop', 'Loop that runs once', 'Empty loop'],
        correctAnswer: 1,
        explanation: 'for(;;) creates an infinite loop because there is no terminating condition.',
        difficulty: 'hard',
        points: 15
      },
      {
        id: '1-5-q11',
        question: 'In for (int i = 0; i < 10; i += 2), what are the values of i?',
        options: ['0,1,2...9', '0,2,4,6,8', '2,4,6,8,10', '0,2,4,6,8,10'],
        correctAnswer: 1,
        explanation: 'i starts at 0 and increases by 2 each time: 0,2,4,6,8.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-5-q12',
        question: 'What is a nested loop?',
        options: ['Two loops side by side', 'A loop inside another loop', 'A broken loop', 'A loop with no body'],
        correctAnswer: 1,
        explanation: 'A nested loop is a loop placed inside another loop.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-5-q13',
        question: 'How many times does the inner loop run in nested loops with outer 5 times and inner 3 times?',
        options: ['5 times', '3 times', '8 times', '15 times'],
        correctAnswer: 3,
        explanation: 'The inner loop runs 3 times for each of the 5 outer iterations: 5 × 3 = 15.',
        difficulty: 'hard',
        points: 15
      },
      {
        id: '1-5-q14',
        question: 'What happens with while(false)?',
        options: ['Runs once', 'Never runs', 'Infinite loop', 'Compilation error'],
        correctAnswer: 1,
        explanation: 'Since the condition is false from the start, the loop body never executes.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-5-q15',
        question: 'Which part of a for loop is optional?',
        options: ['Initialization', 'Condition', 'Update', 'All of them'],
        correctAnswer: 3,
        explanation: 'All three parts (initialization, condition, update) are optional in a for loop.',
        difficulty: 'hard',
        points: 15
      },
      {
        id: '1-5-q16',
        question: 'What does i-- do?',
        options: ['Increments i', 'Decrements i', 'Doubles i', 'Resets i'],
        correctAnswer: 1,
        explanation: 'i-- decrements i by 1, equivalent to i = i - 1.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-5-q17',
        question: 'Can you use break in a while loop?',
        options: ['Yes', 'No', 'Only in for loops', 'Only in do-while'],
        correctAnswer: 0,
        explanation: 'break can be used in any loop (while, do-while, for) to exit immediately.',
        difficulty: 'easy',
        points: 5
      },
      {
        id: '1-5-q18',
        question: 'What is an enhanced for loop (for-each) used for?',
        options: ['Faster execution', 'Iterating through arrays/collections', 'Creating variables', 'Mathematical calculations'],
        correctAnswer: 1,
        explanation: 'The enhanced for loop (for-each) simplifies iterating through arrays and collections.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-5-q19',
        question: 'What does this print? for(int i=5; i>0; i--) System.out.print(i);',
        options: ['12345', '54321', '5', 'Infinite loop'],
        correctAnswer: 1,
        explanation: 'The loop counts down from 5 to 1, printing: 54321.',
        difficulty: 'medium',
        points: 10
      },
      {
        id: '1-5-q20',
        question: 'Can a loop have an empty body?',
        options: ['No, syntax error', 'Yes, with a semicolon', 'Only while loops', 'Only for loops'],
        correctAnswer: 1,
        explanation: 'A loop can have an empty body using a semicolon: while(condition);',
        difficulty: 'hard',
        points: 15
      }
    ]
  }
};

// Helper function to get quiz for a lesson
export function getQuizForLesson(moduleId: string, lessonId: string): LessonQuiz | null {
  // Parse lessonId to extract the lesson number
  // Handles both formats: 'lesson1-1' -> '1' and '1-1' -> '1-1'
  let lessonNumber = lessonId;
  
  // If lessonId is in format 'lesson1-1', extract '1'
  if (lessonId.startsWith('lesson')) {
    const parts = lessonId.replace('lesson', '').split('-');
    if (parts.length >= 2) {
      lessonNumber = parts[1]; // Get the lesson number (e.g., '1' from 'lesson1-1')
    }
  }
  
  const key = `${moduleId}-${lessonNumber}`;
  console.log(`🔍 Quiz lookup: moduleId="${moduleId}", lessonId="${lessonId}", key="${key}"`);
  return quizDatabase[key] || null;
}

// Helper function to shuffle array (for randomizing questions/options)
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Helper function to get random subset of questions
export function getRandomQuestions(questions: QuizQuestion[], count: number): QuizQuestion[] {
  const shuffled = shuffleArray(questions);
  return shuffled.slice(0, Math.min(count, questions.length));
}

// ===== AUTO-GENERATION SYSTEM FOR 10 QUESTIONS PER LESSON =====
// This ensures ALL lessons have exactly 10 Interactive Game Quiz questions

function generateGameQuizQuestion(
  lessonKey: string, 
  questionNumber: number, 
  difficulty: 'easy' | 'medium' | 'hard',
  topic: string
): QuizQuestion {
  const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
  
  const questionTemplates = [
    {
      question: `What is the primary concept of ${topic} in Java?`,
      options: [
        `${topic} helps organize and structure code effectively`,
        `${topic} makes programs run faster automatically`,
        `${topic} is only used for debugging purposes`,
        `${topic} is optional in Java programming`
      ],
      correctAnswer: 0,
      explanation: `${topic} is a fundamental concept in Java that helps organize and structure code for better maintainability and reusability.`
    },
    {
      question: `Which statement is TRUE about ${topic}?`,
      options: [
        `It is a core principle of object-oriented programming`,
        `It is only available in advanced Java versions`,
        `It cannot be used with other OOP concepts`,
        `It is deprecated in modern Java`
      ],
      correctAnswer: 0,
      explanation: `${topic} is a core principle of object-oriented programming and is fully supported in all Java versions.`
    },
    {
      question: `What is the best practice when working with ${topic}?`,
      options: [
        `Follow established design patterns and conventions`,
        `Avoid using it in production code`,
        `Only use it in small programs`,
        `Ignore compiler warnings about it`
      ],
      correctAnswer: 0,
      explanation: `Following established design patterns and conventions ensures proper implementation of ${topic} in your code.`
    },
    {
      question: `How does ${topic} improve code quality?`,
      options: [
        `By promoting code reusability and maintainability`,
        `By reducing file sizes automatically`,
        `By eliminating all runtime errors`,
        `By making code run on fewer devices`
      ],
      correctAnswer: 0,
      explanation: `${topic} improves code quality by promoting reusability, maintainability, and following object-oriented principles.`
    }
  ];
  
  const template = questionTemplates[questionNumber % questionTemplates.length];
  
  return {
    id: `${lessonKey}-q${questionNumber}`,
    question: template.question,
    options: template.options,
    correctAnswer: template.correctAnswer,
    explanation: template.explanation,
    difficulty,
    points
  };
}

// Enhanced function to get quiz with auto-generation ensuring 10 questions
export function getQuizForLessonWithAutoGen(moduleId: string, lessonId: string): LessonQuiz | null {
  let lessonNumber = lessonId;
  
  // If lessonId is in format 'lesson1-1', extract '1'
  if (lessonId.startsWith('lesson')) {
    const parts = lessonId.replace('lesson', '').split('-');
    if (parts.length >= 2) {
      lessonNumber = parts[1]; // Get the lesson number (e.g., '1' from 'lesson1-1')
    }
  }
  
  const key = `${moduleId}-${lessonNumber}`;
  const existingQuiz = quizDatabase[key];
  
  // If quiz exists and has 10 questions, return as is
  if (existingQuiz && existingQuiz.questions.length >= 10) {
    return {
      ...existingQuiz,
      questions: existingQuiz.questions.slice(0, 10) // Ensure exactly 10
    };
  }
  
  // If quiz exists but has fewer than 10 questions, fill the rest
  if (existingQuiz && existingQuiz.questions.length > 0 && existingQuiz.questions.length < 10) {
    const existingCount = existingQuiz.questions.length;
    const neededCount = 10 - existingCount;
    const generatedQuestions: QuizQuestion[] = [];
    
    // Get topic from lesson
    const topicMap: Record<string, string> = {
      '1-1': 'Java Fundamentals', '1-2': 'Variables and Data Types', '1-3': 'Operators',
      '1-4': 'Control Flow', '1-5': 'Loops',
      '2-1': 'Object-Oriented Programming', '2-2': 'Classes', '2-3': 'Objects',
      '2-4': 'Constructors', '2-5': 'this Keyword',
      '3-1': 'Inheritance', '3-2': 'super Keyword', '3-3': 'Method Overriding',
      '3-4': 'Multilevel Inheritance',
      '4-1': 'Polymorphism', '4-2': 'Method Overloading', '4-3': 'Dynamic Method Dispatch',
      '4-4': 'instanceof Operator', '4-5': 'Upcasting and Downcasting',
      '5-1': 'Abstract Classes', '5-2': 'Abstract Methods', '5-3': 'Abstraction',
      '5-4': 'Final Classes and Methods',
      '6-1': 'Interfaces', '6-2': 'Implementing Interfaces', '6-3': 'Multiple Inheritance',
      '6-4': 'Interface vs Abstract Class',
      '7-1': 'Encapsulation', '7-2': 'Access Modifiers', '7-3': 'Getters and Setters',
      '7-4': 'Packages',
      '8-1': 'Exceptions', '8-2': 'Try-Catch Blocks', '8-3': 'Finally Block',
      '8-4': 'Throw and Throws', '8-5': 'Custom Exceptions',
      '9-1': 'Collections Framework', '9-2': 'ArrayList', '9-3': 'LinkedList',
      '9-4': 'HashSet', '9-5': 'HashMap',
      '10-1': 'File I/O Basics', '10-2': 'Working with Files', '10-3': 'Try-with-Resources',
      '10-4': 'Serialization', '10-5': 'NIO Package'
    };
    
    const topic = topicMap[key] || 'Java Programming';
    
    for (let i = 0; i < neededCount; i++) {
      const questionNum = existingCount + i + 1;
      const difficulty: 'easy' | 'medium' | 'hard' = 
        i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'medium' : 'hard';
      
      generatedQuestions.push(generateGameQuizQuestion(key, questionNum, difficulty, topic));
    }
    
    return {
      ...existingQuiz,
      questions: [...existingQuiz.questions, ...generatedQuestions]
    };
  }
  
  // If no quiz exists, generate all 10 questions
  const topicMap: Record<string, string> = {
    '1-1': 'Java Fundamentals', '1-2': 'Variables and Data Types', '1-3': 'Operators',
    '1-4': 'Control Flow', '1-5': 'Loops',
    '2-1': 'Object-Oriented Programming', '2-2': 'Classes', '2-3': 'Objects',
    '2-4': 'Constructors', '2-5': 'this Keyword',
    '3-1': 'Inheritance', '3-2': 'super Keyword', '3-3': 'Method Overriding',
    '3-4': 'Multilevel Inheritance',
    '4-1': 'Polymorphism', '4-2': 'Method Overloading', '4-3': 'Dynamic Method Dispatch',
    '4-4': 'instanceof Operator', '4-5': 'Upcasting and Downcasting',
    '5-1': 'Abstract Classes', '5-2': 'Abstract Methods', '5-3': 'Abstraction',
    '5-4': 'Final Classes and Methods',
    '6-1': 'Interfaces', '6-2': 'Implementing Interfaces', '6-3': 'Multiple Inheritance',
    '6-4': 'Interface vs Abstract Class',
    '7-1': 'Encapsulation', '7-2': 'Access Modifiers', '7-3': 'Getters and Setters',
    '7-4': 'Packages',
    '8-1': 'Exceptions', '8-2': 'Try-Catch Blocks', '8-3': 'Finally Block',
    '8-4': 'Throw and Throws', '8-5': 'Custom Exceptions',
    '9-1': 'Collections Framework', '9-2': 'ArrayList', '9-3': 'LinkedList',
    '9-4': 'HashSet', '9-5': 'HashMap',
    '10-1': 'File I/O Basics', '10-2': 'Working with Files', '10-3': 'Try-with-Resources',
    '10-4': 'Serialization', '10-5': 'NIO Package'
  };
  
  const topic = topicMap[key] || 'Java Programming';
  const generatedQuestions: QuizQuestion[] = [];
  
  for (let i = 0; i < 10; i++) {
    const difficulty: 'easy' | 'medium' | 'hard' = 
      i < 4 ? 'easy' : i < 7 ? 'medium' : 'hard';
    
    generatedQuestions.push(generateGameQuizQuestion(key, i + 1, difficulty, topic));
  }
  
  return {
    lessonKey: key,
    passingScore: 70,
    xpReward: 100,
    questions: generatedQuestions
  };
}