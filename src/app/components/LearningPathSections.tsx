import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Lightbulb, Trophy, HelpCircle, CheckCircle, Sparkles, ChevronRight, RotateCcw,
  Code, CheckSquare, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { RealWorldExample, QuizQuestion, LessonSummary } from '../types';
import { saveQuizScore, getUserId } from '../services/database';

interface LearningPathSectionsProps {
  selectedLesson: any;
  sectionRefs: React.MutableRefObject<{ [key: number]: HTMLDivElement | null }>;
  quizSubmitted: boolean;
  quizScore: number;
  quizAnswers: { [key: string]: string };
  setQuizAnswers: (answers: { [key: string]: string }) => void;
  setQuizSubmitted: (submitted: boolean) => void;
  setQuizScore: (score: number) => void;
  scrollToSection: (sectionNumber: number) => void;
  onStartCoding: (moduleId: string, lessonId: string) => void;
  moduleId: string;
  selectedLessonId: string | null;
  setSelectedLessonId: (id: string) => void;
  moduleLessons: any[];
}

export function RealWorldExamplesSection({ 
  realWorldExamples 
}: { 
  realWorldExamples?: RealWorldExample[];
}) {
  // Default examples if none provided
  const defaultExamples: RealWorldExample[] = [
    {
      title: "E-Commerce System",
      description: "In an online shopping platform, classes like Product, ShoppingCart, and Customer demonstrate encapsulation by keeping price calculations and inventory management internal while exposing only necessary methods.",
      category: "Business Application"
    },
    {
      title: "Banking Application",
      description: "Bank account systems use classes like Account, Transaction, and Customer. Private fields protect sensitive data like account balance, while public methods handle deposits and withdrawals safely.",
      category: "Financial System"
    },
    {
      title: "Social Media Platform",
      description: "Social networks implement User, Post, and Comment classes. Inheritance creates specialized user types (RegularUser, PremiumUser) while polymorphism handles different post types (Text, Image, Video).",
      category: "Social Platform"
    }
  ];

  const examples = realWorldExamples && realWorldExamples.length > 0 ? realWorldExamples : defaultExamples;

  return (
    <Card className="border-2 border-teal-300 shadow-md bg-gradient-to-br from-teal-50 to-cyan-50">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Real-World Examples</h3>
            <p className="text-sm text-gray-600">See how this concept is applied in real software development</p>
          </div>
        </div>

        <div className="space-y-4">
          {examples.map((example, index) => (
            <div key={index} className="bg-white border-2 border-teal-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-7 h-7 bg-teal-500 rounded-md flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <h4 className="font-bold text-gray-900 text-lg">{example.title}</h4>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4 ml-10">
                {example.description}
              </p>
              <div className="ml-10">
                <Badge className="bg-teal-500 text-white border-0 hover:bg-teal-600">
                  {example.category}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function KnowledgeCheckSection({
  sectionRefs,
  quizSubmitted,
  quizScore,
  quizAnswers,
  setQuizAnswers,
  setQuizSubmitted,
  setQuizScore,
  scrollToSection,
  quizQuestions,
  moduleId,
  lessonId
}: {
  sectionRefs: React.MutableRefObject<{ [key: number]: HTMLDivElement | null }>;
  quizSubmitted: boolean;
  quizScore: number;
  quizAnswers: { [key: string]: string };
  setQuizAnswers: (answers: { [key: string]: string }) => void;
  setQuizSubmitted: (submitted: boolean) => void;
  setQuizScore: (score: number) => void;
  scrollToSection: (sectionNumber: number) => void;
  quizQuestions?: QuizQuestion[];
  moduleId?: string;
  lessonId?: string;
}) {
  // Default quiz questions if none provided
  const defaultQuestions: QuizQuestion[] = [
    {
      id: 'q1',
      question: 'What is the main purpose of encapsulation in OOP?',
      options: ['To hide implementation details and protect data', 'To make code run faster', 'To reduce file size', 'To make debugging easier'],
      correctAnswer: 'To hide implementation details and protect data'
    },
    {
      id: 'q2',
      question: 'Which access modifier makes a variable accessible only within its own class?',
      options: ['public', 'private', 'protected', 'default'],
      correctAnswer: 'private'
    },
    {
      id: 'q3',
      question: 'What is a constructor in Java?',
      options: ['A special method that initializes objects', 'A variable that stores data', 'A loop structure', 'A conditional statement'],
      correctAnswer: 'A special method that initializes objects'
    }
  ];

  const questions = quizQuestions && quizQuestions.length > 0 ? quizQuestions : defaultQuestions;

  const handleQuizSubmit = async () => {
    // Calculate score based on correct answers
    let score = 0;
    const scorePerQuestion = 100 / questions.length;
    
    questions.forEach(question => {
      if (quizAnswers[question.id] === question.correctAnswer) {
        score += scorePerQuestion;
      }
    });
    
    const finalScore = Math.round(score);
    setQuizScore(finalScore);
    setQuizSubmitted(true);
    
    // Save quiz score to database
    if (moduleId && lessonId) {
      try {
        const userId = getUserId();
        await saveQuizScore({
          userId,
          moduleId,
          lessonId,
          score: finalScore,
          answers: quizAnswers,
          totalQuestions: questions.length
        });
        toast.success(`Quiz submitted! Score: ${finalScore}% (Saved to database)`);
      } catch (error) {
        console.error('Error saving quiz score:', error);
        toast.success(`Quiz submitted! Score: ${finalScore}%`);
        toast.error('Failed to save to database, but your score is recorded locally');
      }
    } else {
      toast.success(`Quiz submitted! Score: ${finalScore}%`);
    }
  };

  return (
    <div ref={(el) => {sectionRefs.current[5] = el;}}>
      <Card className="border-2 border-yellow-200 shadow-md bg-gradient-to-r from-yellow-50 to-amber-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Knowledge Check</h3>
              <p className="text-sm text-gray-600">Test your understanding of the key concepts</p>
            </div>
          </div>

          {!quizSubmitted ? (
            <div className="space-y-6">
              {/* Dynamic Quiz Questions */}
              {questions.map((question, qIndex) => (
                <div key={question.id} className="bg-white border border-yellow-200 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-3">{qIndex + 1}. {question.question}</h4>
                  <div className="space-y-2">
                    {question.options.map((option, idx) => (
                      <label key={idx} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-yellow-400 cursor-pointer transition-all">
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          onChange={(e) => setQuizAnswers({ ...quizAnswers, [question.id]: e.target.value })}
                          className="w-4 h-4 text-yellow-600"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <Button
                onClick={handleQuizSubmit}
                disabled={Object.keys(quizAnswers).length < questions.length}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold h-12"
              >
                <CheckSquare className="w-5 h-5 mr-2" />
                Submit Quiz
              </Button>
            </div>
          ) : (
            <div className="bg-white border border-yellow-200 rounded-lg p-6">
              <div className="text-center mb-6">
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                  quizScore >= 70 ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  <span className={`text-3xl font-bold ${
                    quizScore >= 70 ? 'text-green-700' : 'text-orange-700'
                  }`}>{quizScore}%</span>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">
                  {quizScore >= 70 ? '🎉 Great Job!' : '📚 Keep Learning!'}
                </h4>
                <p className="text-gray-600">
                  {quizScore >= 70 
                    ? 'You have a solid understanding of the concepts!' 
                    : 'Review the lesson materials and try again to improve your score.'}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setQuizSubmitted(false);
                    setQuizAnswers({});
                    setQuizScore(0);
                  }}
                  variant="outline"
                  className="flex-1 border-yellow-400 text-yellow-700 hover:bg-yellow-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retake Quiz
                </Button>
                <Button
                  onClick={() => scrollToSection(6)}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  Continue to Summary
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function SummarySection({
  sectionRefs,
  scrollToSection,
  setSelectedLessonId,
  moduleLessons,
  selectedLessonId
}: {
  sectionRefs: React.MutableRefObject<{ [key: number]: HTMLDivElement | null }>;
  scrollToSection: (sectionNumber: number) => void;
  setSelectedLessonId: (id: string) => void;
  moduleLessons: any[];
  selectedLessonId: string | null;
}) {
  return (
    <div ref={(el) => {sectionRefs.current[6] = el;}}>
      <Card className="border-2 border-gray-300 shadow-md bg-gradient-to-r from-gray-50 to-slate-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lesson Summary & Next Steps</h3>
              <p className="text-sm text-gray-600">Review what you've learned and continue your journey</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Key Takeaways */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Key Takeaways
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Understanding the fundamental concepts and principles covered in this lesson</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Applying OOP concepts to solve real-world programming challenges</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Writing clean, maintainable Java code using best practices</span>
                </li>
              </ul>
            </div>

            {/* Next Steps */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-blue-600" />
                What's Next?
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-700 font-bold">1</div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900 mb-1">Complete the Practice Exercise</p>
                    <p className="text-xs text-gray-600">Apply what you've learned by coding the exercise above</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 text-purple-700 font-bold">2</div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900 mb-1">Move to the Next Lesson</p>
                    <p className="text-xs text-gray-600">Continue building on these foundational concepts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-green-700 font-bold">3</div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900 mb-1">Review AI Feedback</p>
                    <p className="text-xs text-gray-600">Check the "My Feedback" tab to track your progress</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => scrollToSection(1)}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Review Lesson
              </Button>
              <Button
                onClick={() => {
                  const currentIndex = moduleLessons.findIndex(l => l.id === selectedLessonId);
                  const nextLesson = moduleLessons[currentIndex + 1];
                  if (nextLesson && !nextLesson.locked) {
                    setSelectedLessonId(nextLesson.id);
                    toast.success(`Moving to: ${nextLesson.title}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    toast.info('You\'ve completed all available lessons!');
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next Lesson
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}