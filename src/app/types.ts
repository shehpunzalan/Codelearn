export type UserRole = 'student' | 'instructor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  enrolledCourses?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
  content: LessonContent;
  starterCode?: string;
}

export interface LessonContent {
  introduction: string;
  keyConcepts: string[];
  codeExamples: CodeExample[];
  keyPoints: string[];
  practiceExercise: string;
  realWorldExamples?: RealWorldExample[];
  quiz?: QuizQuestion[];
  summary?: LessonSummary;
}

export interface CodeExample {
  title: string;
  code: string;
  explanation: string;
}

export interface RealWorldExample {
  title: string;
  description: string;
  category: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface LessonSummary {
  keyTakeaways: string[];
  nextSteps: string[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lessons: Lesson[];
  estimatedTime: string;
  // Module source information
  source?: {
    type?: 'neural-network' | 'instructor' | 'ai-generated' | 'curriculum';
    instructor?: string;
    tags?: string[];
  };
  // Pattern recognition metadata
  patternMetrics?: {
    patternsDetected?: number;
    oopPrinciples?: string[];
    codeExamples?: number;
  };
  // References and sources
  references?: Reference[];
}

export interface Reference {
  title: string;
  author?: string;
  type: 'book' | 'website' | 'documentation' | 'research' | 'video' | 'article';
  url?: string;
  year?: number;
  description?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  totalPoints: number;
  testCases?: TestCase[];
  starterCode?: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  userId: string;
  code: string;
  timestamp: Date;
  status: 'pass' | 'fail' | 'error';
  score: number;
  errors?: CodeError[];
  feedback?: string;
  patterns?: string[];
  oopScores?: OOPScores;
}

export interface CodeError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  pattern?: string;
}

export interface OOPScores {
  encapsulation: number;
  inheritance: number;
  polymorphism: number;
  abstraction: number;
  overall: number;
}

export interface ProgressData {
  userId: string;
  modulesCompleted: number;
  lessonsCompleted: number;
  totalSubmissions: number;
  successRate: number;
  commonPatterns: string[];
  strengths: string[];
  areasForImprovement: string[];
  oopMastery: OOPScores;
}

export interface StudentPerformance {
  studentId: string;
  studentName: string;
  progress: number;
  averageScore: number;
  submissionsCount: number;
  lastActive: string;
  status: 'on-track' | 'needs-help' | 'at-risk';
}