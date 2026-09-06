import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, BookOpen, Target, Brain, Lightbulb, Code, 
  CheckCircle, Download, Trophy, Navigation, FileText, 
  AlertCircle, Info, Eye, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { comprehensiveLessonsContent, getLessonSpecificKeywords } from '../data/comprehensiveLessonsContent';
import { getMinimumRealWorldExamples } from '../data/realWorldExamples';
import { getChallengesForLesson } from '../data/lessonChallenges';
import { QuizGameModal } from './QuizGameModal';
import { getQuizForLesson } from '../data/quizQuestions';

interface LearningPathReadingPageProps {
  moduleId: string;
  lessonId: string;
  lessonTitle: string;
  lessonContent: any;
  onBack: () => void;
}

export function LearningPathReadingPage({ 
  moduleId, 
  lessonId, 
  lessonTitle,
  lessonContent,
  onBack 
}: LearningPathReadingPageProps) {
  const [activeSection, setActiveSection] = useState<number>(1);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set([1])); // First section completed by default
  const [highlightEnabled, setHighlightEnabled] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Construct the comprehensive lesson content key
  const comprehensiveLessonKey = `${moduleId}-${lessonId}`;
  
  // Get comprehensive content
  const comprehensiveContent = comprehensiveLessonsContent[comprehensiveLessonKey];
  const realWorldExamples = getMinimumRealWorldExamples(comprehensiveLessonKey);
  const challenges = getChallengesForLesson(comprehensiveLessonKey);
  const quiz = getQuizForLesson(comprehensiveLessonKey);

  // Learning path sections
  const learningSections = [
    { 
      id: 1, 
      title: 'Introduction & Objectives', 
      duration: '3 min', 
      badge: 'intro',
      badgeColor: 'bg-gray-600'
    },
    { 
      id: 2, 
      title: 'Core Concepts Explained', 
      duration: '8 min', 
      badge: 'content',
      badgeColor: 'bg-gray-700'
    },
    { 
      id: 3, 
      title: 'Real-World Examples', 
      duration: '5 min', 
      badge: 'examples',
      badgeColor: 'bg-gray-700'
    },
    { 
      id: 4, 
      title: 'Hands-On Practice', 
      duration: '10 min', 
      badge: 'practice',
      badgeColor: 'bg-blue-600'
    },
    {
      id: 5,
      title: 'Summary & Next Steps',
      duration: '2 min',
      badge: 'summary',
      badgeColor: 'bg-gray-600'
    }
  ];

  // Navigate to section
  const goToSection = (sectionId: number) => {
    setActiveSection(sectionId);
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Continue to next section
  const handleContinue = () => {
    if (activeSection < 5) {
      const newCompleted = new Set(completedSections);
      newCompleted.add(activeSection);
      setCompletedSections(newCompleted);
      goToSection(activeSection + 1);
      toast.success(`Section ${activeSection} completed!`);
    } else {
      const newCompleted = new Set(completedSections);
      newCompleted.add(6);
      setCompletedSections(newCompleted);
      toast.success('🎉 Lesson completed!', {
        description: 'Great job! You finished all sections.'
      });
    }
  };

  // Go to previous section
  const handlePrevious = () => {
    if (activeSection > 1) {
      goToSection(activeSection - 1);
    }
  };

  // Helper function to highlight text
  const HighlightedText = ({ text, enabled }: { text: string; enabled: boolean }) => {
    if (!enabled || !text) {
      return <>{text}</>;
    }

    const lessonKeywords = getLessonSpecificKeywords(comprehensiveLessonKey) || [];
    const generalKeywords = [
      'Java', 'class', 'object', 'method', 'variable', 'OOP', 'encapsulation',
      'inheritance', 'polymorphism', 'abstraction', 'interface', 'public',
      'private', 'protected', 'static', 'void'
    ];

    const allKeywords = [...new Set([...lessonKeywords, ...generalKeywords])];
    const pattern = new RegExp(`\\b(${allKeywords.join('|')})\\b`, 'gi');
    
    const parts = text.split(pattern);
    
    return (
      <>
        {parts.map((part, index) => {
          const isKeyword = allKeywords.some(
            keyword => keyword.toLowerCase() === part.toLowerCase()
          );
          
          if (isKeyword) {
            return (
              <span 
                key={index}
                className="bg-blue-200 text-blue-900 px-0.5 rounded"
              >
                {part}
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </>
    );
  };

  // Get introduction text
  const getIntroductionText = () => {
    return comprehensiveContent?.introduction || 
      lessonContent.introduction || 
      `Java is a class-based, object-oriented programming language designed to have as few implementation dependencies as possible. It is a general-purpose language intended to let programmers write once, run anywhere (WORA), meaning that compiled Java code can run on all platforms that support Java without the need for recompilation. Java was developed by James Gosling at Sun Microsystems and released in 1995. Today, Java powers billions of devices including mobile phones, enterprise servers, embedded systems, and Android applications. Its robust architecture, security features, and extensive ecosystem make it one of the most popular programming languages in the world.`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={onBack}
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{lessonTitle}</h1>
                <p className="text-xs text-gray-600">Module {moduleId} • Lesson {lessonId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-4">
          {/* Learning Path Navigator */}
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-gray-900">Learning Path Navigator</h2>
              </div>
              <p className="text-xs text-gray-600 mb-4">Follow the structured path or jump to any section</p>

              <div className="space-y-2">
                {learningSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => goToSection(section.id)}
                    className={`w-full rounded-lg p-3 border transition-all text-left ${
                      activeSection === section.id 
                        ? 'bg-blue-50 border-blue-300' 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        completedSections.has(section.id)
                          ? 'bg-green-500 text-white'
                          : activeSection === section.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {completedSections.has(section.id) ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          section.id
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-gray-900 truncate">{section.title}</h3>
                        <p className="text-xs text-gray-600">{section.duration}</p>
                      </div>
                      <Badge className={`${section.badgeColor} text-white border-0 text-xs`}>
                        {section.badge}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Section Content */}
          <div ref={sectionRef}>
            {/* Section 1: Introduction & Objectives */}
            {activeSection === 1 && (
              <Card className="border border-blue-200 shadow-sm bg-white">
                <CardHeader className="border-b border-gray-100 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base font-bold text-gray-900">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      Introduction & Objectives
                    </CardTitle>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      Section 1 of 5
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Learning Objectives */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-4 h-4 text-blue-600" />
                      <h3 className="text-sm font-bold text-gray-900">Learning Objectives</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {(comprehensiveContent?.objectives || [
                        'Understand the core concepts of Introduction to Java',
                        'Apply OOP principles in real-world scenarios',
                        'Write clean and maintainable Java code',
                        'Practice via hands-on coding exercises',
                        'Master best practices and design patterns'
                      ]).map((objective, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span><HighlightedText text={objective} enabled={highlightEnabled} /></span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Introduction */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <h3 className="text-sm font-bold text-gray-900">Introduction</h3>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <HighlightedText text={getIntroductionText()} enabled={highlightEnabled} />
                    </p>
                  </div>

                  {/* Bottom Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setHighlightEnabled(!highlightEnabled);
                        toast.success(highlightEnabled ? 'Highlighting disabled' : 'Key terms highlighted');
                      }}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <Eye className="w-4 h-4" />
                      Highlight Key Terms
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        toast.success('PDF download coming soon!');
                      }}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Section 2: Core Concepts Explained */}
            {activeSection === 2 && (
              <Card className="border border-blue-200 shadow-sm bg-white">
                <CardHeader className="border-b border-gray-100 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base font-bold text-gray-900">
                      <Brain className="w-5 h-5 text-blue-600" />
                      Core Concepts Explained
                    </CardTitle>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      Section 2 of 5
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {comprehensiveContent?.coreConcepts ? (
                    comprehensiveContent.coreConcepts.map((concept: any, idx: number) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-sm text-gray-900 mb-2">{concept.title}</h4>
                        <p className="text-sm text-gray-700 leading-relaxed mb-3">{concept.description}</p>
                        {concept.code && (
                          <div className="bg-gray-900 text-white p-3 rounded-md overflow-x-auto">
                            <pre className="text-xs">
                              <code>{concept.code}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {lessonContent.content || 
                          'This section covers the fundamental concepts and principles you need to understand. Each concept builds upon the previous one, creating a solid foundation for your learning journey.'
                        }
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setHighlightEnabled(!highlightEnabled);
                        toast.success(highlightEnabled ? 'Highlighting disabled' : 'Key terms highlighted');
                      }}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <Eye className="w-4 h-4" />
                      Highlight Key Terms
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        toast.success('PDF download coming soon!');
                      }}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Section 3: Real-World Examples */}
            {activeSection === 3 && (
              <Card className="border border-blue-200 shadow-sm bg-white">
                <CardHeader className="border-b border-gray-100 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base font-bold text-gray-900">
                      <Lightbulb className="w-5 h-5 text-teal-600" />
                      Real-World Examples
                    </CardTitle>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      Section 3 of 5
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {realWorldExamples && realWorldExamples.length > 0 ? (
                    realWorldExamples.map((example, idx) => (
                      <div key={idx} className="border-l-4 border-teal-500 bg-teal-50 p-4 rounded-r-lg">
                        <h4 className="font-bold text-sm text-gray-900 mb-2 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-teal-600" />
                          {example.title}
                        </h4>
                        <p className="text-sm text-gray-700 mb-3">{example.description}</p>
                        {example.code && (
                          <div className="bg-gray-900 text-white p-3 rounded-md overflow-x-auto">
                            <pre className="text-xs">
                              <code>{example.code}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="border-l-4 border-teal-500 bg-teal-50 p-4 rounded-r-lg">
                      <p className="text-sm text-gray-700">
                        Real-world examples demonstrate how these concepts are applied in actual software development scenarios.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setHighlightEnabled(!highlightEnabled);
                        toast.success(highlightEnabled ? 'Highlighting disabled' : 'Key terms highlighted');
                      }}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <Eye className="w-4 h-4" />
                      Highlight Key Terms
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        toast.success('PDF download coming soon!');
                      }}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Section 4: Hands-On Practice */}
            {activeSection === 4 && (
              <Card className="border border-blue-200 shadow-sm bg-white">
                <CardHeader className="border-b border-gray-100 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base font-bold text-gray-900">
                      <Code className="w-5 h-5 text-blue-600" />
                      Hands-On Practice
                    </CardTitle>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      Section 4 of 5
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 mb-4">
                      Now it's time to apply what you've learned! Complete the following challenges to reinforce your understanding.
                    </p>
                    
                    {challenges && challenges.length > 0 ? (
                      <div className="space-y-3">
                        {challenges.map((challenge, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-md border border-blue-300">
                            <div className="flex items-start gap-2">
                              <Badge className="bg-blue-600 text-white mt-0.5">Challenge {idx + 1}</Badge>
                              <div>
                                <h5 className="font-semibold text-sm text-gray-900">{challenge.title}</h5>
                                <p className="text-xs text-gray-600 mt-1">{challenge.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white p-3 rounded-md border border-blue-300">
                        <p className="text-sm text-gray-700">
                          Practice exercises help solidify your understanding of the concepts covered in this lesson.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setHighlightEnabled(!highlightEnabled);
                        toast.success(highlightEnabled ? 'Highlighting disabled' : 'Key terms highlighted');
                      }}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <Eye className="w-4 h-4" />
                      Highlight Key Terms
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        toast.success('PDF download coming soon!');
                      }}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Section 5: Summary & Next Steps */}
            {activeSection === 5 && (
              <Card className="border border-blue-200 shadow-sm bg-white">
                <CardHeader className="border-b border-gray-100 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base font-bold text-gray-900">
                      <Trophy className="w-5 h-5 text-purple-600" />
                      Summary & Next Steps
                    </CardTitle>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      Section 5 of 5
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-5 rounded-lg border border-purple-200">
                    <h4 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-purple-600" />
                      Congratulations!
                    </h4>
                    <p className="text-sm text-gray-700 mb-4">
                      You've completed {lessonTitle}. Here's a quick summary of what you've learned:
                    </p>
                    <ul className="space-y-2 mb-4">
                      {(comprehensiveContent?.objectives || [
                        'Core concepts and principles',
                        'Real-world application examples',
                        'Hands-on practice challenges'
                      ]).slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="bg-white p-4 rounded-md border border-blue-200">
                      <h5 className="font-semibold text-sm text-gray-900 mb-2">Next Steps:</h5>
                      <p className="text-xs text-gray-700">
                        Continue to the next lesson to build upon these concepts, or practice more by reviewing the code examples and challenges.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setHighlightEnabled(!highlightEnabled);
                        toast.success(highlightEnabled ? 'Highlighting disabled' : 'Key terms highlighted');
                      }}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <Eye className="w-4 h-4" />
                      Highlight Key Terms
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        toast.success('PDF download coming soon!');
                      }}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={activeSection === 1}
              className="flex items-center gap-2"
            >
              Previous Section
            </Button>
            <Button
              onClick={handleContinue}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {activeSection === 5 ? 'Complete Lesson' : 'Continue'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quiz Game Modal */}
      {showQuizModal && (
        <QuizGameModal
          moduleId={moduleId}
          lessonId={lessonId}
          lessonTitle={lessonTitle}
          onClose={() => setShowQuizModal(false)}
        />
      )}
    </div>
  );
}