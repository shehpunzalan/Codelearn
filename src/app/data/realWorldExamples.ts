// Real-World Application Examples for All Lessons
// These show how OOP concepts are used in actual industry applications

export interface RealWorldExample {
  industry: string;
  icon: string;
  description: string;
  companies?: string[];
}

export const realWorldExamplesByLesson: Record<string, RealWorldExample[]> = {
  // MODULE 1: Introduction to Java and OOP
  // Lesson 1-1: Introduction to Java Programming
  'mod1-lesson1-1': [
    {
      industry: 'Enterprise Applications',
      icon: '🏢',
      description: 'Large corporations use Java for mission-critical enterprise applications because of its platform independence (Write Once, Run Anywhere). Java\'s JVM allows the same code to run on Windows, Linux, and mainframes without modification, saving millions in development costs.',
      companies: ['Oracle', 'SAP', 'IBM']
    },
    {
      industry: 'Android Mobile Development',
      icon: '📱',
      description: 'Over 3 billion Android devices worldwide run applications written in Java. Java\'s object-oriented nature and platform independence make it perfect for mobile apps that need to run across thousands of different device models and manufacturers.',
      companies: ['Google', 'Samsung', 'Xiaomi']
    },
    {
      industry: 'Financial Trading Systems',
      icon: '💹',
      description: 'Wall Street trading platforms use Java for high-frequency trading and financial analysis. Java\'s reliability, security features, and automatic garbage collection ensure stable 24/7 operation handling billions of dollars in transactions.',
      companies: ['Goldman Sachs', 'Morgan Stanley', 'Bloomberg']
    },
    {
      industry: 'Big Data & Cloud Computing',
      icon: '☁️',
      description: 'Massive big data frameworks like Apache Hadoop and Spark are built with Java. The JVM\'s performance and Java\'s strong typing make it ideal for processing petabytes of data across distributed cloud infrastructure.',
      companies: ['Apache Foundation', 'Cloudera', 'AWS']
    },
    {
      industry: 'Scientific Computing',
      icon: '🔬',
      description: 'Research institutions and space agencies use Java for scientific simulations and data analysis. NASA leverages Java\'s precision and cross-platform capabilities for space mission software and astronomical computations.',
      companies: ['NASA', 'CERN', 'MIT Research Labs']
    }
  ],

  // Lesson 1-2: Setting Up Java Development Environment
  'mod1-lesson1-2': [
    {
      industry: 'Integrated Development Environments (IDEs)',
      icon: '💻',
      description: 'Professional IDEs like IntelliJ IDEA, Eclipse, and NetBeans are themselves built with Java and require the JDK to function. These tools provide code completion, debugging, refactoring, and version control integration for millions of developers worldwide.',
      companies: ['JetBrains', 'Eclipse Foundation', 'Apache NetBeans']
    },
    {
      industry: 'DevOps & Build Automation',
      icon: '⚙️',
      description: 'Modern software development relies on build tools like Maven and Gradle (both Java-based) to compile code, manage dependencies, run tests, and deploy applications. These tools require a properly configured JDK environment to automate the entire development lifecycle.',
      companies: ['Apache Maven', 'Gradle Inc', 'Jenkins']
    },
    {
      industry: 'Code Quality & Testing Tools',
      icon: '✅',
      description: 'Software quality assurance tools like JUnit (testing framework), SonarQube (code quality), and JaCoCo (code coverage) depend on JDK installation. These tools ensure code reliability before deployment to production environments.',
      companies: ['SonarSource', 'Atlassian', 'Checkmarx']
    },
    {
      industry: 'Continuous Integration/Deployment',
      icon: '🔄',
      description: 'CI/CD platforms like Jenkins, TeamCity, and Bamboo require Java runtime environments to execute automated build pipelines. These systems compile, test, and deploy code changes dozens of times per day in modern development teams.',
      companies: ['CloudBees', 'JetBrains', 'GitHub Actions']
    },
    {
      industry: 'Cross-Platform Desktop Applications',
      icon: '🖥️',
      description: 'Desktop applications built with JavaFX or Swing require users to have JRE installed. Popular tools like NetBeans, IntelliJ, and Android Studio distribute their own JRE to ensure consistent Java environments across Windows, Mac, and Linux.',
      companies: ['Oracle', 'JetBrains', 'Eclipse Foundation']
    }
  ],

  // Lesson 1-3: Java Syntax and Program Structure
  'mod1-lesson1-3': [
    {
      industry: 'Code Analysis & Static Analysis Tools',
      icon: '🔍',
      description: 'Static code analysis tools like Checkstyle, PMD, and SpotBugs parse Java syntax to enforce coding standards, detect bugs, and ensure consistent formatting. These tools analyze syntax structure including naming conventions, code blocks, comments, and statement structure.',
      companies: ['Checkmarx', 'Veracode', 'SonarSource']
    },
    {
      industry: 'Educational Coding Platforms',
      icon: '🎓',
      description: 'Online learning platforms like Codecademy, LeetCode, and HackerRank use Java syntax parsers to validate student code submissions. They check for proper semicolons, bracket matching, keyword usage, and identifier naming to provide instant feedback on syntax errors.',
      companies: ['LeetCode', 'HackerRank', 'Codecademy']
    },
    {
      industry: 'Compiler & Language Tools',
      icon: '🛠️',
      description: 'The Java compiler (javac) rigorously enforces syntax rules: checking semicolons, validating identifier names, ensuring keywords aren\'t misused, matching curly braces, and verifying statement structure. Syntax errors must be fixed before code can compile into bytecode.',
      companies: ['Oracle JDK', 'OpenJDK', 'GraalVM']
    },
    {
      industry: 'Code Formatting & Linters',
      icon: '📝',
      description: 'Automated code formatters like Google Java Format and Prettier enforce consistent syntax conventions: indentation depth, brace placement, spacing around operators, line length limits, and naming conventions ensuring readable, maintainable code across large development teams.',
      companies: ['Google', 'Palantir', 'Square']
    },
    {
      industry: 'Documentation Generation',
      icon: '📚',
      description: 'Javadoc tools parse special comment syntax (/** */) to automatically generate API documentation. Proper syntax for @param, @return, and @throws tags ensures comprehensive documentation for thousands of classes in enterprise applications.',
      companies: ['Oracle', 'Spring Framework', 'Apache Commons']
    }
  ],

  // Keep the old simplified keys for backward compatibility
  'mod1-lesson1': [
    {
      industry: 'E-Commerce & Retail',
      icon: '🛒',
      description: 'Online shopping platforms like Amazon use OOP to model products, shopping carts, customers, and orders as objects. Each product has properties (name, price, stock) and behaviors (addToCart, updatePrice).',
      companies: ['Amazon', 'eBay', 'Shopify']
    },
    {
      industry: 'Banking & Finance',
      icon: '🏦',
      description: 'Banking systems use OOP to represent accounts, transactions, and customers. Each bank account object has properties (balance, accountNumber) and methods (deposit, withdraw, transfer) ensuring secure financial operations.',
      companies: ['JPMorgan Chase', 'Bank of America', 'PayPal']
    },
    {
      industry: 'Social Media',
      icon: '📱',
      description: 'Social media platforms like Facebook use OOP to manage user profiles, posts, comments, and likes. Each user is an object with properties (name, profile picture) and methods (createPost, addFriend, likePost).',
      companies: ['Facebook', 'Instagram', 'Twitter']
    },
    {
      industry: 'Gaming & Entertainment',
      icon: '🎮',
      description: 'Video games use OOP extensively to create game characters, items, and environments. Each character object has attributes (health, position, inventory) and methods (move, attack, interact).',
      companies: ['Electronic Arts', 'Activision', 'Unity Technologies']
    },
    {
      industry: 'Healthcare Systems',
      icon: '🏥',
      description: 'Medical record systems use OOP to manage patient data, appointments, and prescriptions. Each patient object contains medical history, current medications, and appointment schedules with methods for updating records.',
      companies: ['Epic Systems', 'Cerner', 'Philips Healthcare']
    }
  ],

  'mod1-lesson2': [
    {
      industry: 'Software Development Tools',
      icon: '💻',
      description: 'Integrated Development Environments (IDEs) like IntelliJ IDEA and Eclipse are built using Java. They use OOP to manage code files, projects, debugging sessions, and version control integration.',
      companies: ['JetBrains', 'Eclipse Foundation', 'NetBeans']
    },
    {
      industry: 'Enterprise Applications',
      icon: '🏢',
      description: 'Large-scale business applications use Java for reliability and platform independence. Customer Relationship Management (CRM) systems handle millions of customer records using object-oriented design.',
      companies: ['Salesforce', 'Oracle', 'SAP']
    },
    {
      industry: 'Android Mobile Apps',
      icon: '📱',
      description: 'Android applications are primarily developed in Java. Every Android app component (Activity, Service, BroadcastReceiver) is built using OOP principles, managing UI elements and user interactions.',
      companies: ['Google', 'Samsung', 'Spotify']
    }
  ],

  'mod1-lesson3': [
    {
      industry: 'Data Processing',
      icon: '📊',
      description: 'Big data platforms use Java syntax for processing massive datasets. Apache Hadoop and Spark leverage Java\'s strong typing and syntax to ensure data integrity across distributed systems.',
      companies: ['Apache Foundation', 'Cloudera', 'Databricks']
    },
    {
      industry: 'Web Services',
      icon: '🌐',
      description: 'RESTful APIs and web services use Java to handle HTTP requests, process JSON/XML data, and manage server-side logic. Proper syntax ensures reliable communication between client and server.',
      companies: ['Netflix', 'LinkedIn', 'Uber']
    },
    {
      industry: 'IoT & Embedded Systems',
      icon: '🔌',
      description: 'Internet of Things devices use Java ME (Micro Edition) for programming sensors, smart home devices, and industrial equipment with reliable and secure code.',
      companies: ['Samsung IoT', 'Cisco', 'Bosch']
    }
  ],

  // MODULE 2: Classes and Objects
  'mod2-lesson1': [
    {
      industry: 'Automotive Software',
      icon: '🚗',
      description: 'Modern vehicles contain dozens of software systems using classes to model Car, Engine, Transmission, BrakingSystem objects. Each system encapsulates its data (speed, fuel level) and behaviors (accelerate, brake).',
      companies: ['Tesla', 'BMW', 'Toyota']
    },
    {
      industry: 'Airline Reservation Systems',
      icon: '✈️',
      description: 'Flight booking systems use classes for Flight, Passenger, Seat, Booking objects. Encapsulation protects sensitive data like passenger information while allowing controlled access through methods.',
      companies: ['American Airlines', 'Amadeus', 'Sabre']
    },
    {
      industry: 'Smart Home Automation',
      icon: '🏠',
      description: 'Home automation systems use classes for SmartLight, Thermostat, SecurityCamera, DoorLock objects. Each device class encapsulates hardware communication while exposing simple control methods.',
      companies: ['Google Nest', 'Amazon Alexa', 'Apple HomeKit']
    }
  ],

  'mod2-lesson2': [
    {
      industry: 'Game Development',
      icon: '🎯',
      description: 'Game engines use constructors to initialize game objects (Player, Enemy, Weapon) with starting values. When a new level loads, constructors create hundreds of objects with proper initial states.',
      companies: ['Unity', 'Unreal Engine', 'Roblox']
    },
    {
      industry: 'Document Management',
      icon: '📄',
      description: 'Document editing software uses constructors to create Document, Paragraph, Image objects. Each constructor ensures documents start with proper formatting, metadata, and default settings.',
      companies: ['Microsoft Office', 'Google Docs', 'Adobe Acrobat']
    },
    {
      industry: 'E-Learning Platforms',
      icon: '🎓',
      description: 'Online learning systems use constructors to initialize Course, Student, Assignment, Quiz objects with proper default values, ensuring consistent data across the platform.',
      companies: ['Coursera', 'Udemy', 'Khan Academy']
    }
  ],

  // MODULE 3: Inheritance
  'mod3-lesson1': [
    {
      industry: 'Content Management Systems',
      icon: '📝',
      description: 'CMS platforms use inheritance where BlogPost, NewsArticle, ProductPage all inherit from a base Content class. This allows shared functionality (publish, edit, delete) while enabling specialized features.',
      companies: ['WordPress', 'Drupal', 'Joomla']
    },
    {
      industry: 'Payment Processing',
      icon: '💳',
      description: 'Payment gateways use inheritance with a base Payment class extended by CreditCardPayment, PayPalPayment, CryptocurrencyPayment. Each inherits common processing logic while implementing specific validation.',
      companies: ['Stripe', 'Square', 'PayPal']
    },
    {
      industry: 'Graphics & Design Software',
      icon: '🎨',
      description: 'Design tools use inheritance where Rectangle, Circle, Triangle inherit from Shape. All shapes share common properties (color, position) but implement their own drawing methods.',
      companies: ['Adobe Creative Suite', 'Figma', 'Canva']
    }
  ],

  // MODULE 4: Polymorphism
  'mod4-lesson1': [
    {
      industry: 'Streaming Services',
      icon: '🎬',
      description: 'Media players use polymorphism where Movie, TVShow, Documentary all implement a play() method differently. The same playback interface works for different content types seamlessly.',
      companies: ['Netflix', 'Disney+', 'YouTube']
    },
    {
      industry: 'Logistics & Delivery',
      icon: '📦',
      description: 'Shipping systems use polymorphism with Vehicle classes (Truck, Drone, Ship) all implementing a deliver() method. The system can process any vehicle type through a common interface.',
      companies: ['FedEx', 'UPS', 'Amazon Logistics']
    },
    {
      industry: 'Database Systems',
      icon: '🗄️',
      description: 'Database drivers use polymorphism where MySQLConnection, PostgreSQLConnection, MongoDBConnection all implement connect(), query(), disconnect() methods, allowing applications to switch databases easily.',
      companies: ['Oracle', 'MongoDB', 'PostgreSQL']
    }
  ],

  'mod4': [
    {
      industry: 'Media Streaming',
      icon: '🎬',
      description: 'Streaming platforms use polymorphism to handle different media types uniformly. Whether it\'s a movie, TV show, or podcast, the same playback interface works seamlessly across all content.',
      companies: ['Netflix', 'Spotify', 'Disney+']
    },
    {
      industry: 'Payment Processing',
      icon: '💳',
      description: 'Payment gateways leverage polymorphism to process different payment methods through a unified interface. Credit cards, PayPal, crypto - all handled by the same process() method.',
      companies: ['Stripe', 'Square', 'PayPal']
    },
    {
      industry: 'Transportation',
      icon: '🚗',
      description: 'Ride-sharing apps use polymorphism for different vehicle types. Cars, bikes, scooters all implement the same transport interface but behave differently based on their specific characteristics.',
      companies: ['Uber', 'Lyft', 'Grab']
    }
  ],

  // MODULE 5: Abstraction
  'mod5-lesson1': [
    {
      industry: 'Cloud Computing',
      icon: '☁️',
      description: 'Cloud platforms use abstraction to hide infrastructure complexity. Users interact with simple interfaces (createServer, deployApp) while the platform handles complex resource allocation, networking, and scaling.',
      companies: ['AWS', 'Microsoft Azure', 'Google Cloud']
    },
    {
      industry: 'Email Services',
      icon: '📧',
      description: 'Email clients use abstraction where users call sendEmail() without knowing the underlying SMTP protocols, encryption algorithms, or server routing that actually deliver the message.',
      companies: ['Gmail', 'Outlook', 'ProtonMail']
    },
    {
      industry: 'Cryptocurrency',
      icon: '₿',
      description: 'Blockchain applications use abstraction to hide complex cryptographic operations behind simple interfaces like transfer(), getBalance(), verifyTransaction() for user-friendly crypto wallets.',
      companies: ['Coinbase', 'Binance', 'MetaMask']
    }
  ],

  // Module-level fallbacks
  'mod1': [
    {
      industry: 'Software as a Service (SaaS)',
      icon: '💼',
      description: 'Modern SaaS platforms use Java and OOP principles to build scalable, maintainable applications that serve millions of users. Object-oriented design allows teams to work on different features simultaneously.',
      companies: ['Salesforce', 'Slack', 'Zoom']
    },
    {
      industry: 'Artificial Intelligence',
      icon: '🤖',
      description: 'Machine learning frameworks use Java and OOP to model neural networks, training data, and prediction pipelines. Each component is an object with well-defined interfaces and responsibilities.',
      companies: ['TensorFlow', 'PyTorch', 'OpenAI']
    },
    {
      industry: 'Cybersecurity',
      icon: '🔒',
      description: 'Security software uses Java and OOP to model threats, vulnerabilities, and protection mechanisms. Encapsulation protects sensitive security logic while inheritance allows extending threat detection.',
      companies: ['Symantec', 'McAfee', 'CrowdStrike']
    }
  ],

  'mod2': [
    {
      industry: 'E-Commerce Platforms',
      icon: '🛍️',
      description: 'Online retail platforms use classes and objects to model products, shopping carts, orders, and customers. Each entity encapsulates its data and behaviors for scalable e-commerce solutions.',
      companies: ['Amazon', 'eBay', 'Shopify']
    },
    {
      industry: 'Healthcare Management',
      icon: '🏥',
      description: 'Hospital management systems use classes to represent patients, doctors, appointments, and medical records. Object-oriented design ensures secure and organized healthcare data management.',
      companies: ['Epic Systems', 'Cerner', 'Meditech']
    },
    {
      industry: 'Financial Services',
      icon: '💰',
      description: 'Banking applications use classes for accounts, transactions, customers, and loans. Each class encapsulates financial logic and ensures secure, reliable banking operations.',
      companies: ['JPMorgan Chase', 'Wells Fargo', 'Citibank']
    }
  ],

  'mod3': [
    {
      industry: 'Content Management',
      icon: '📄',
      description: 'CMS platforms leverage inheritance to create reusable content types. Base classes provide common functionality while derived classes add specialized features for blogs, news, products, etc.',
      companies: ['WordPress', 'Drupal', 'Contentful']
    },
    {
      industry: 'Gaming Industry',
      icon: '🎮',
      description: 'Game engines use inheritance extensively for character hierarchies. Base Character classes provide common attributes while specialized classes (Hero, Enemy, NPC) implement unique behaviors.',
      companies: ['Unity', 'Unreal Engine', 'Godot']
    },
    {
      industry: 'Mobile Applications',
      icon: '📱',
      description: 'Mobile app frameworks use inheritance for UI components. Base View classes provide common functionality while specialized views (Button, TextField, ImageView) inherit and extend capabilities.',
      companies: ['Google', 'Apple', 'Microsoft']
    }
  ],

  'mod5': [
    {
      industry: 'Cloud Infrastructure',
      icon: '☁️',
      description: 'Cloud platforms use abstraction to simplify complex infrastructure. Developers interact with high-level APIs while the platform manages servers, networking, storage, and security automatically.',
      companies: ['AWS', 'Google Cloud', 'Azure']
    },
    {
      industry: 'Database Systems',
      icon: '🗄️',
      description: 'Database frameworks use abstraction layers (ORM) to hide complex SQL queries. Developers work with simple object methods while the framework handles database-specific implementation details.',
      companies: ['Oracle', 'MongoDB', 'PostgreSQL']
    },
    {
      industry: 'API Development',
      icon: '🔌',
      description: 'REST APIs use abstraction to provide clean interfaces to complex backend systems. Clients make simple HTTP requests while servers handle authentication, business logic, and data processing.',
      companies: ['Twitter API', 'Google APIs', 'Stripe API']
    }
  ],

  'mod6': [
    {
      industry: 'Framework Development',
      icon: '🏗️',
      description: 'Software frameworks use interfaces and abstract classes to define contracts. Spring Framework, for example, uses interfaces extensively to allow developers to plug in custom implementations.',
      companies: ['Spring', 'Hibernate', 'Apache']
    },
    {
      industry: 'Plugin Systems',
      icon: '🔧',
      description: 'Applications with plugin architectures use interfaces to define extension points. Plugins implement interfaces to add functionality without modifying the core application code.',
      companies: ['Eclipse', 'IntelliJ IDEA', 'VS Code']
    },
    {
      industry: 'Microservices',
      icon: '🔗',
      description: 'Microservice architectures use interfaces to define service contracts. Services communicate through well-defined interfaces, allowing independent development and deployment.',
      companies: ['Netflix', 'Amazon', 'Uber']
    }
  ],

  'mod7': [
    {
      industry: 'Data Processing',
      icon: '📊',
      description: 'Big data frameworks use advanced OOP patterns for processing massive datasets. MapReduce implementations, stream processing, and data pipelines all leverage sophisticated object-oriented design.',
      companies: ['Apache Hadoop', 'Apache Spark', 'Kafka']
    },
    {
      industry: 'Enterprise Integration',
      icon: '🏢',
      description: 'Enterprise applications use design patterns like Factory, Singleton, and Observer to manage complex business logic. These patterns ensure scalable, maintainable enterprise solutions.',
      companies: ['SAP', 'Oracle', 'IBM']
    },
    {
      industry: 'Web Frameworks',
      icon: '🌐',
      description: 'Modern web frameworks implement MVC and other design patterns using advanced OOP. Controllers, models, and views work together through well-defined object-oriented patterns.',
      companies: ['Spring Boot', 'Jakarta EE', 'Play Framework']
    }
  ],

  'mod8': [
    {
      industry: 'Fault-Tolerant Systems',
      icon: '🛡️',
      description: 'Mission-critical applications use exception handling to ensure reliability. Banking systems, healthcare platforms, and aviation software implement robust error handling to prevent failures.',
      companies: ['NASA', 'Boeing', 'SpaceX']
    },
    {
      industry: 'API Error Management',
      icon: '⚠️',
      description: 'RESTful APIs use exception handling to return meaningful error responses. Proper error handling ensures clients can gracefully handle failures and provide user-friendly error messages.',
      companies: ['Google APIs', 'Stripe', 'Twilio']
    },
    {
      industry: 'Distributed Systems',
      icon: '🌍',
      description: 'Distributed applications handle network failures, timeouts, and data inconsistencies through comprehensive exception handling. Retry logic and circuit breakers prevent cascading failures.',
      companies: ['Amazon Web Services', 'Kubernetes', 'Docker']
    }
  ],

  'mod9': [
    {
      industry: 'Data Analytics',
      icon: '📈',
      description: 'Analytics platforms use Java collections to process and analyze large datasets efficiently. Lists, maps, and sets enable fast data manipulation and statistical computations.',
      companies: ['Tableau', 'Power BI', 'Looker']
    },
    {
      industry: 'Social Networks',
      icon: '👥',
      description: 'Social media platforms use collections to manage friends lists, news feeds, and notifications. Hash sets provide fast lookups while queues manage real-time event processing.',
      companies: ['Facebook', 'LinkedIn', 'Twitter']
    },
    {
      industry: 'Inventory Management',
      icon: '📦',
      description: 'Warehouse management systems use collections to track products, orders, and shipments. Priority queues optimize order fulfillment while hash maps enable instant product lookups.',
      companies: ['Walmart', 'Target', 'Shopify']
    }
  ],

  'mod10': [
    {
      industry: 'File Storage Services',
      icon: '💾',
      description: 'Cloud storage platforms use file I/O extensively to manage uploads, downloads, and synchronization. Efficient file handling ensures fast, reliable storage for millions of users.',
      companies: ['Dropbox', 'Google Drive', 'OneDrive']
    },
    {
      industry: 'Log Management',
      icon: '📝',
      description: 'Application logging systems use file I/O to write and manage log files. Proper file handling ensures logs are written efficiently without impacting application performance.',
      companies: ['Splunk', 'Datadog', 'New Relic']
    },
    {
      industry: 'Data Import/Export',
      icon: '⬆',
      description: 'Business applications use file I/O for importing and exporting data in various formats (CSV, XML, JSON). Robust file handling ensures data integrity during transfers.',
      companies: ['SAP', 'Oracle', 'Microsoft Dynamics']
    }
  ],

  // Default examples for lessons without specific mappings
  'default': [
    {
      industry: 'Software as a Service (SaaS)',
      icon: '💼',
      description: 'Modern SaaS platforms use OOP principles to build scalable, maintainable applications that serve millions of users. Object-oriented design allows teams to work on different features simultaneously.',
      companies: ['Salesforce', 'Slack', 'Zoom']
    },
    {
      industry: 'Artificial Intelligence',
      icon: '🤖',
      description: 'Machine learning frameworks use OOP to model neural networks, training data, and prediction pipelines. Each component is an object with well-defined interfaces and responsibilities.',
      companies: ['TensorFlow', 'PyTorch', 'OpenAI']
    },
    {
      industry: 'Cybersecurity',
      icon: '🔒',
      description: 'Security software uses OOP to model threats, vulnerabilities, and protection mechanisms. Encapsulation protects sensitive security logic while inheritance allows extending threat detection.',
      companies: ['Symantec', 'McAfee', 'CrowdStrike']
    }
  ]
};

// Helper function to get real-world examples for a lesson
export function getRealWorldExamples(lessonId: string): RealWorldExample[] {
  return realWorldExamplesByLesson[lessonId] || realWorldExamplesByLesson['default'];
}

// Get a minimum of 3 examples, filling with defaults if needed
export function getMinimumRealWorldExamples(lessonId: string): RealWorldExample[] {
  // Try exact match first (e.g., 'mod1-lesson1-1')
  let specific = realWorldExamplesByLesson[lessonId];
  
  // If no exact match, try simplified format (e.g., 'mod1-lesson1' from 'mod1-lesson1-1')
  if (!specific) {
    const simplifiedKey = lessonId.replace(/-(\d+)$/, '');
    specific = realWorldExamplesByLesson[simplifiedKey];
  }
  
  // If still no match, try module-level (e.g., 'mod1' from 'mod1-lesson1-1')
  if (!specific) {
    const moduleKey = lessonId.split('-')[0];
    specific = realWorldExamplesByLesson[moduleKey];
  }
  
  // Fall back to defaults
  const examples = specific || [];
  const defaults = realWorldExamplesByLesson['default'];
  
  if (examples.length >= 3) {
    return examples.slice(0, 3);
  }
  
  // Combine specific examples with defaults to reach exactly 3
  const combined = [...examples];
  let defaultIndex = 0;
  
  while (combined.length < 3 && defaultIndex < defaults.length) {
    combined.push(defaults[defaultIndex]);
    defaultIndex++;
  }
  
  return combined;
}