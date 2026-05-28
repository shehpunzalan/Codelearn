import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  ArrowLeft, Trophy, Target, Zap, Star, Award, 
  CheckCircle, XCircle, Clock, TrendingUp, Gamepad2,
  Sparkles, Flame, Gift
} from 'lucide-react';
import { toast } from 'sonner';
import { getQuizForLessonWithAutoGen } from '../data/quizQuestions';

interface InteractiveGamePageProps {
  moduleId: string;
  lessonId: string;
  lessonTitle: string;
  lessonContent: any;
  onBack: () => void;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export function InteractiveGamePage({ 
  moduleId, 
  lessonId, 
  lessonTitle,
  lessonContent,
  onBack 
}: InteractiveGamePageProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [streak, setStreak] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [currentShuffledQuestion, setCurrentShuffledQuestion] = useState<QuizQuestion | null>(null);

  // Get quiz questions from quiz database or lesson content
  const getQuestions = (): QuizQuestion[] => {
    // Try to get from quiz database with auto-generation
    const quiz = getQuizForLessonWithAutoGen(moduleId, lessonId);
    if (quiz && quiz.questions) {
      console.log(`✅ Loaded ${quiz.questions.length} questions from quiz database for lesson ${moduleId}-${lessonId}`);
      // UPDATED: Use ALL 10 questions for the interactive game
      const allQuestions = quiz.questions.slice(0, 10);
      console.log(`🎮 Using ${allQuestions.length} questions for the game`);
      return allQuestions.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      }));
    }

    // Fallback to lesson content or default 10 questions
    console.log(`⚠️ Using fallback questions for lesson ${moduleId}-${lessonId}`);
    return lessonContent?.quiz || [
      {
        question: "What is the main principle of Object-Oriented Programming?",
        options: ["Encapsulation", "Compilation", "Execution", "Declaration"],
        correctAnswer: 0,
        explanation: "Encapsulation is one of the four main principles of OOP, along with inheritance, polymorphism, and abstraction."
      },
      {
        question: "Which keyword is used to create a class in Java?",
        options: ["function", "class", "object", "interface"],
        correctAnswer: 1,
        explanation: "The 'class' keyword is used to define a class in Java."
      },
      {
        question: "What does the 'public' access modifier mean?",
        options: ["Only within the class", "Accessible everywhere", "Only within the package", "Only by subclasses"],
        correctAnswer: 1,
        explanation: "The 'public' access modifier makes the member accessible from any other class."
      },
      {
        question: "Which method is called when an object is created?",
        options: ["main()", "constructor()", "create()", "init()"],
        correctAnswer: 1,
        explanation: "A constructor is a special method that is automatically called when an object is instantiated."
      },
      {
        question: "What is inheritance in OOP?",
        options: ["Hiding data", "Reusing code from parent class", "Creating objects", "Deleting objects"],
        correctAnswer: 1,
        explanation: "Inheritance allows a class to inherit properties and methods from another class."
      },
      {
        question: "What is polymorphism?",
        options: ["Many forms", "Single form", "No form", "Static form"],
        correctAnswer: 0,
        explanation: "Polymorphism means 'many forms' and allows objects to be treated as instances of their parent class."
      },
      {
        question: "Which of these is NOT an OOP principle?",
        options: ["Encapsulation", "Inheritance", "Compilation", "Abstraction"],
        correctAnswer: 2,
        explanation: "Compilation is a process, not an OOP principle. The four main OOP principles are Encapsulation, Inheritance, Polymorphism, and Abstraction."
      },
      {
        question: "What is a method in Java?",
        options: ["A variable", "A function inside a class", "A class", "A package"],
        correctAnswer: 1,
        explanation: "A method is a function that is defined inside a class and describes the behavior of objects."
      },
      {
        question: "What is the purpose of 'this' keyword?",
        options: ["Create new object", "Reference current object", "Delete object", "Copy object"],
        correctAnswer: 1,
        explanation: "The 'this' keyword refers to the current instance of the class."
      },
      {
        question: "What is abstraction in OOP?",
        options: ["Showing all details", "Hiding implementation details", "Creating objects", "Deleting objects"],
        correctAnswer: 1,
        explanation: "Abstraction is the concept of hiding implementation details and showing only essential features."
      },
      {
        question: "What does JVM stand for?",
        options: ["Java Virtual Machine", "Java Variable Method", "Java Verified Module", "Java Visual Manager"],
        correctAnswer: 0,
        explanation: "JVM stands for Java Virtual Machine, which executes Java bytecode."
      },
      {
        question: "What is the extension of Java source files?",
        options: [".class", ".java", ".jar", ".exe"],
        correctAnswer: 1,
        explanation: "Java source files use the .java extension."
      },
      {
        question: "Which of these is a valid Java data type?",
        options: ["int", "integer", "number", "decimal"],
        correctAnswer: 0,
        explanation: "In Java, 'int' is the primitive data type for integers."
      },
      {
        question: "What is the default value of a boolean variable?",
        options: ["true", "false", "null", "0"],
        correctAnswer: 1,
        explanation: "The default value of a boolean variable in Java is false."
      },
      {
        question: "Which operator is used for string concatenation?",
        options: ["&", "+", "*", "||"],
        correctAnswer: 1,
        explanation: "The + operator is used to concatenate strings in Java."
      },
      {
        question: "What is an interface in Java?",
        options: ["A class", "A blueprint for classes", "A method", "A variable"],
        correctAnswer: 1,
        explanation: "An interface is a reference type in Java that can contain only constants, method signatures, default methods, static methods, and nested types."
      },
      {
        question: "What is method overloading?",
        options: ["Same method name, different parameters", "Same method name, same parameters", "Different method names", "No methods"],
        correctAnswer: 0,
        explanation: "Method overloading allows multiple methods with the same name but different parameters."
      },
      {
        question: "What is the purpose of the 'static' keyword?",
        options: ["Make variable unchangeable", "Belong to class rather than instance", "Make method private", "Create object"],
        correctAnswer: 1,
        explanation: "The static keyword makes members belong to the class itself rather than instances of the class."
      },
      {
        question: "What is an array in Java?",
        options: ["A single variable", "A collection of similar data types", "A method", "A class"],
        correctAnswer: 1,
        explanation: "An array is a container object that holds a fixed number of values of a single type."
      },
      {
        question: "What is the 'super' keyword used for?",
        options: ["Create object", "Access parent class members", "Delete object", "Define class"],
        correctAnswer: 1,
        explanation: "The 'super' keyword is used to access members of the parent class."
      },
      {
        question: "What is a constructor in Java?",
        options: ["A method that destroys objects", "A special method to initialize objects", "A variable", "A loop"],
        correctAnswer: 1,
        explanation: "A constructor is a special method that is called when an object is instantiated. It initializes the object's state."
      },
      {
        question: "Which access modifier provides the most restricted access?",
        options: ["public", "protected", "default", "private"],
        correctAnswer: 3,
        explanation: "The 'private' access modifier provides the most restricted access - members are accessible only within the same class."
      },
      {
        question: "What is the purpose of the 'final' keyword?",
        options: ["To make a variable changeable", "To prevent inheritance or modification", "To create objects", "To delete methods"],
        correctAnswer: 1,
        explanation: "The 'final' keyword is used to declare constants, prevent method overriding, and prevent inheritance of classes."
      }
    ];
  };

  const questions = getQuestions();
  const totalQuestions = questions.length;
  const passPercentage = 70;

  // Log quiz info on mount for debugging
  useEffect(() => {
    console.log(`📊 Quiz Game Loaded: ${totalQuestions} questions for Module ${moduleId}, Lesson ${lessonId}`);
    console.log(`🎯 Passing Score: ${passPercentage}%`);
    console.log(`📝 All questions loaded:`, questions.map((q, i) => `Q${i+1}: ${q.question.substring(0, 30)}...`));
    console.log(`✅ TOTAL QUESTIONS IN GAME: ${totalQuestions}`);
  }, []);

  // Shuffle options for current question whenever question index changes
  useEffect(() => {
    if (questions && questions[currentQuestion]) {
      const question = questions[currentQuestion];
      const options = [...question.options];
      const correctOptionText = options[question.correctAnswer];

      // Fisher-Yates shuffle
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }

      // Find new index of correct answer
      const newCorrectAnswer = options.indexOf(correctOptionText);

      const shuffled: QuizQuestion = {
        ...question,
        options,
        correctAnswer: newCorrectAnswer
      };

      console.log('🎮 Interactive Game - Question', currentQuestion + 1, '- Correct answer at position:', newCorrectAnswer + 1);

      setCurrentShuffledQuestion(shuffled);
    }
  }, [currentQuestion]);

  // Timer effect
  useEffect(() => {
    if (isTimerActive && timeRemaining > 0 && !showResult) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !showResult) {
      handleTimeUp();
    }
  }, [isTimerActive, timeRemaining, showResult]);

  const handleStartGame = () => {
    setGameStarted(true);
    setIsTimerActive(true);
    setAnsweredQuestions(new Array(totalQuestions).fill(false));
    toast.success('🎮 Game Started! Good luck!');
  };

  const handleTimeUp = () => {
    toast.error('⏰ Time\'s up!');
    handleAnswerSelect(null);
  };

  const handleAnswerSelect = (answerIndex: number | null) => {
    if (selectedAnswer !== null || showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    setIsTimerActive(false);

    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      const earnedXP = 10 + (streak * 5) + Math.floor(timeRemaining / 3);
      setScore(score + 1);
      setXpEarned(xpEarned + earnedXP);
      setStreak(streak + 1);
      
      // Level up every 50 XP
      const newLevel = Math.floor((xpEarned + earnedXP) / 50) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
        toast.success(`🎉 Level Up! You're now Level ${newLevel}!`);
      }
      
      toast.success(`✅ Correct! +${earnedXP} XP`);
    } else {
      setStreak(0);
      toast.error('❌ Incorrect! Keep trying!');
    }

    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestion] = true;
    setAnsweredQuestions(newAnswered);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeRemaining(30);
      setIsTimerActive(true);
    } else {
      setGameCompleted(true);
      setIsTimerActive(false);
      
      // Save game results
      const finalScore = (score / totalQuestions) * 100;
      const gameData = {
        lessonId,
        moduleId,
        score: finalScore,
        xpEarned,
        level,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`game_${moduleId}_${lessonId}`, JSON.stringify(gameData));
      
      if (finalScore >= passPercentage) {
        toast.success('🎉 Congratulations! You passed the game!');
      }
    }
  };

  const handleRetry = () => {
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setStreak(0);
    setTimeRemaining(30);
    setIsTimerActive(true);
    setGameCompleted(false);
    setAnsweredQuestions(new Array(totalQuestions).fill(false));
  };

  // Game start screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Lesson
            </Button>
            <Badge className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
              <Gamepad2 className="w-3 h-3 mr-1" />
              Interactive Learning
            </Badge>
          </div>

          {/* Game Info Card */}
          <Card className="border-0 shadow-xl overflow-hidden" style={{ backgroundColor: '#FFF8E1', borderRadius: '16px', border: '3px solid #FFB74D' }}>
            <CardContent className="p-8">
              {/* Game Icon & Title */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz in Game Form</h1>
                  <p className="text-gray-700 text-base">
                    Test your knowledge with {totalQuestions} interactive questions! Earn XP, build streaks, and master {lessonTitle}.
                  </p>
                </div>
              </div>

              {/* Game Stats Badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge className="bg-white border-2 border-orange-300 text-orange-700 px-4 py-2 text-sm font-semibold">
                  {totalQuestions} Questions
                </Badge>
                <Badge className="bg-white border-2 border-green-300 text-green-700 px-4 py-2 text-sm font-semibold">
                  {passPercentage}% to Pass
                </Badge>
                <Badge className="bg-white border-2 border-blue-300 text-blue-700 px-4 py-2 text-sm font-semibold">
                  Earn XP & Streaks
                </Badge>
              </div>

              {/* Emphasis Banner - ALL 20 QUESTIONS */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-4 mb-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-6 h-6" />
                  <h3 className="text-xl font-bold">Complete All {totalQuestions} Questions!</h3>
                  <Star className="w-6 h-6" />
                </div>
                <p className="text-sm opacity-90">
                  Answer every question from 1 to {totalQuestions} to finish the game and earn your score!
                </p>
              </div>

              {/* Start Button */}
              <Button
                onClick={handleStartGame}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg font-bold rounded-xl shadow-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Quiz Game
              </Button>

              {/* Progress Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white border-2 border-yellow-200 rounded-xl p-4 text-center">
                  <Award className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{xpEarned}</p>
                  <p className="text-xs text-gray-600">XP Earned</p>
                </div>
                <div className="bg-white border-2 border-blue-200 rounded-xl p-4 text-center">
                  <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">0/{totalQuestions}</p>
                  <p className="text-xs text-gray-600">Completed</p>
                </div>
                <div className="bg-white border-2 border-purple-200 rounded-xl p-4 text-center">
                  <Trophy className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">Level {level}</p>
                  <p className="text-xs text-gray-600">Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-600" />
                Game Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                  1
                </div>
                <p className="text-sm text-gray-700">Answer quickly to earn bonus XP from time remaining</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                  2
                </div>
                <p className="text-sm text-gray-700">Build streaks by answering correctly to multiply your XP</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                  3
                </div>
                <p className="text-sm text-gray-700">Reach {passPercentage}% to pass and unlock achievements</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                  4
                </div>
                <p className="text-sm text-gray-700">Level up every 50 XP to show your mastery</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Game completed screen
  if (gameCompleted) {
    const finalScore = (score / totalQuestions) * 100;
    const passed = finalScore >= passPercentage;

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lesson
          </Button>

          <Card className="border-0 shadow-xl overflow-hidden">
            <CardContent className="p-12 text-center">
              <div className={`w-24 h-24 ${passed ? 'bg-green-100' : 'bg-orange-100'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                {passed ? (
                  <Trophy className="w-12 h-12 text-green-600" />
                ) : (
                  <Target className="w-12 h-12 text-orange-600" />
                )}
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {passed ? '🎉 Congratulations!' : '💪 Keep Practicing!'}
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                {passed 
                  ? 'You\'ve mastered this lesson! Great job!'
                  : 'You\'re making progress! Try again to improve your score.'}
              </p>

              {/* Results Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-3xl font-bold text-blue-600">{score}/{totalQuestions}</p>
                  <p className="text-sm text-gray-600">Correct</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-3xl font-bold text-purple-600">{Math.round(finalScore)}%</p>
                  <p className="text-sm text-gray-600">Score</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4">
                  <p className="text-3xl font-bold text-yellow-600">{xpEarned}</p>
                  <p className="text-sm text-gray-600">XP Earned</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4">
                  <p className="text-3xl font-bold text-orange-600">Level {level}</p>
                  <p className="text-sm text-gray-600">Achieved</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleRetry}
                  className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  onClick={onBack}
                  variant="outline"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Lesson
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Use shuffled question or fallback to original
  if (!currentShuffledQuestion) {
    return null;
  }

  const currentQ = currentShuffledQuestion;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lesson
          </Button>
          <div className="flex items-center gap-4">
            <Badge className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-2">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Interactive Game
            </Badge>
            <Badge className="bg-white border-2 border-orange-400 text-orange-700 px-4 py-2 font-bold">
              Question {currentQuestion + 1} of {totalQuestions}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Question Card */}
          <div className="lg:col-span-2">
            {/* Progress Bar */}
            <Card className="border-2 border-orange-200 mb-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Question {currentQuestion + 1} of {totalQuestions}
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                <Progress value={progress} className="h-3" />
              </CardContent>
            </Card>

            {/* Question Grid Tracker - Shows all questions */}
            <Card className="border-2 border-blue-200 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-900">Question Progress Tracker</h3>
                  <Badge className="bg-blue-600 text-white">
                    {answeredQuestions.filter(Boolean).length}/{totalQuestions}
                  </Badge>
                </div>
                <div className="grid grid-cols-10 gap-2">
                  {Array.from({ length: totalQuestions }).map((_, idx) => {
                    const isAnswered = answeredQuestions[idx];
                    const isCurrent = idx === currentQuestion;
                    const isPast = idx < currentQuestion;
                    
                    return (
                      <div
                        key={idx}
                        className={`
                          aspect-square rounded-lg flex items-center justify-center text-xs font-bold
                          transition-all duration-300
                          ${isCurrent ? 'bg-orange-500 text-white ring-4 ring-orange-300 scale-110' : ''}
                          ${isPast && isAnswered ? 'bg-green-500 text-white' : ''}
                          ${!isPast && !isCurrent ? 'bg-gray-200 text-gray-500' : ''}
                        `}
                        title={`Question ${idx + 1}`}
                      >
                        {idx + 1}
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-600 mt-2 text-center">
                  🟠 Current • 🟢 Completed • ⚪ Upcoming
                </p>
              </CardContent>
            </Card>

            {/* Timer */}
            <div className="flex items-center justify-between mb-6">
              <Badge variant="outline" className="text-lg px-4 py-2">
                <Clock className="w-5 h-5 mr-2" />
                {timeRemaining}s
              </Badge>
              {showResult && (
                <Badge className={selectedAnswer === currentQ.correctAnswer ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                  {selectedAnswer === currentQ.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}
                </Badge>
              )}
            </div>

            {/* Question */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {currentQ.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === currentQ.correctAnswer;
                const showCorrect = showResult && isCorrect;
                const showIncorrect = showResult && isSelected && !isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      showCorrect
                        ? 'border-green-500 bg-green-50'
                        : showIncorrect
                        ? 'border-red-500 bg-red-50'
                        : isSelected
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                    } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {showCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {showIncorrect && <XCircle className="w-5 h-5 text-red-600" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showResult && currentQ.explanation && (
              <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                <p className="text-sm text-gray-700">
                  <strong className="text-blue-700">Explanation: </strong>
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Next button */}
            {showResult && (
              <Button
                onClick={handleNextQuestion}
                className="w-full mt-6 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white py-6 text-lg"
              >
                {currentQuestion < totalQuestions - 1 ? 'Next Question' : 'Complete Game'}
                <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
              </Button>
            )}
          </div>

          {/* Sidebar with progress */}
          <div className="space-y-6">
            {/* Score Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">Correct</span>
                  <span className="text-lg font-bold text-green-600">{score}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium">Incorrect</span>
                  <span className="text-lg font-bold text-red-600">{currentQuestion + 1 - score - (showResult ? 0 : 1)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Remaining</span>
                  <span className="text-lg font-bold text-gray-600">{totalQuestions - currentQuestion - 1}</span>
                </div>
              </CardContent>
            </Card>

            {/* Question Progress */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm font-bold ${
                        index < currentQuestion
                          ? 'bg-green-500 text-white'
                          : index === currentQuestion
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gift className="w-5 h-5 text-orange-600" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className={`p-3 rounded-lg ${streak >= 3 ? 'bg-orange-100 border border-orange-300' : 'bg-gray-100 opacity-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">🔥 Hot Streak</span>
                    {streak >= 3 && <CheckCircle className="w-4 h-4 text-orange-600" />}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Get 3 in a row</p>
                </div>
                <div className={`p-3 rounded-lg ${xpEarned >= 50 ? 'bg-yellow-100 border border-yellow-300' : 'bg-gray-100 opacity-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">⭐ XP Master</span>
                    {xpEarned >= 50 && <CheckCircle className="w-4 h-4 text-yellow-600" />}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Earn 50+ XP</p>
                </div>
                <div className={`p-3 rounded-lg ${score >= totalQuestions ? 'bg-green-100 border border-green-300' : 'bg-gray-100 opacity-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">🏆 Perfect Score</span>
                    {score >= totalQuestions && <CheckCircle className="w-4 h-4 text-green-600" />}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">100% correct</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}