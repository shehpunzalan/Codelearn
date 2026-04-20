import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  BookOpen, Video, Headphones, FileText, Code, 
  CheckCircle, Play, Pause, Volume2, VolumeX, 
  Maximize2, Download, RefreshCw, MessageCircle,
  Lightbulb, Users, Brain, Target, Zap, Award,
  ChevronRight, ChevronDown, Sparkles, Eye,
  Clock, BarChart3, TrendingUp, Gamepad2, Trophy,
  AlertCircle
} from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { getChallengesForLesson } from '../data/lessonChallenges';
import { GameFormQuiz } from './GameFormQuiz';
import { QuizResultsPage } from './QuizResultsPage';

interface ModernLearningDeliveryProps {
  moduleId: string;
  lessonId: string;
  lessonTitle: string;
  lessonContent: any;
  onComplete?: () => void;
  onOpenVideoTutorial?: (moduleId: string, lessonId: string, lessonTitle: string) => void;
  onOpenReadingContent?: (moduleId: string, lessonId: string, lessonTitle: string, lessonContent: any) => void;
}

type LearningMode = 'read' | 'video' | 'interactive' | 'practice';
type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading';

export function ModernLearningDelivery({ 
  moduleId, 
  lessonId, 
  lessonTitle,
  lessonContent,
  onComplete,
  onOpenVideoTutorial,
  onOpenReadingContent
}: ModernLearningDeliveryProps) {
  const [selectedMode, setSelectedMode] = useState<LearningMode>('read');
  const [learningStyle, setLearningStyle] = useState<LearningStyle>('visual');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: string}>({});
  const [showTranscript, setShowTranscript] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [engagementScore, setEngagementScore] = useState(0);
  const [showGamification, setShowGamification] = useState(true);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [highlightEnabled, setHighlightEnabled] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [quizMode, setQuizMode] = useState<'quiz' | 'results' | null>(null);
  const [quizStats, setQuizStats] = useState<any>(null);
  const [showVideoTutorials, setShowVideoTutorials] = useState(true);
  
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLIFrameElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Educational video for Java OOP (using YouTube embedded videos)
  const getVideoUrl = () => {
    // Educational Java OOP videos mapped to lessons
    const videoMap: { [key: string]: string } = {
      'mod1': 'https://www.youtube.com/embed/xk4_1vDrzzo', // Introduction to Java
      'mod2': 'https://www.youtube.com/embed/BSVKUk58K6U', // Classes and Objects
      'mod3': 'https://www.youtube.com/embed/9O_v6foQPaE', // Encapsulation
      'mod4': 'https://www.youtube.com/embed/Zs342ePFvRI', // Inheritance
      'mod5': 'https://www.youtube.com/embed/jhDUxynEQRI', // Polymorphism
      'default': 'https://www.youtube.com/embed/xk4_1vDrzzo' // Default Java tutorial
    };
    return videoMap[moduleId] || videoMap['default'];
  };

  // Simulated learning path sections
  const learningSections = [
    { id: 1, title: 'Introduction & Objectives', duration: '3 min', type: 'intro' },
    { id: 2, title: 'Core Concepts Explained', duration: '8 min', type: 'content' },
    { id: 3, title: 'Real-World Examples', duration: '5 min', type: 'examples' },
    { id: 4, title: 'Hands-On Practice', duration: '10 min', type: 'practice' },
    { id: 5, title: 'Knowledge Check', duration: '4 min', type: 'quiz' },
    { id: 6, title: 'Summary & Next Steps', duration: '2 min', type: 'summary' }
  ];

  // Modern delivery methods
  const deliveryMethods = [
    {
      id: 'read' as LearningMode,
      icon: BookOpen,
      title: 'Reading',
      description: 'Interactive text with highlights',
      color: 'blue',
      style: 'visual'
    },
    {
      id: 'video' as LearningMode,
      icon: Video,
      title: 'Video Tutorial',
      description: 'Visual demonstration with captions',
      color: 'purple',
      style: 'visual'
    },
    {
      id: 'interactive' as LearningMode,
      icon: Gamepad2,
      title: 'Interactive',
      description: 'Gamified learning experience',
      color: 'orange',
      style: 'kinesthetic'
    },
    {
      id: 'practice' as LearningMode,
      icon: Code,
      title: 'Practice',
      description: 'Hands-on coding exercises',
      color: 'pink',
      style: 'kinesthetic'
    }
  ];

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
      // Increase engagement based on activity
      if (isPlaying || selectedMode === 'practice' || selectedMode === 'interactive') {
        setEngagementScore(prev => Math.min(100, prev + 0.5));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, selectedMode]);

  // Auto-calculate progress
  useEffect(() => {
    const totalSections = learningSections.length;
    const completed = completedSections.size;
    setProgress(Math.round((completed / totalSections) * 100));
  }, [completedSections]);

  const handleSectionComplete = (sectionId: number) => {
    const newCompleted = new Set(completedSections);
    newCompleted.add(sectionId);
    setCompletedSections(newCompleted);
    
    toast.success('Section Completed! 🎉', {
      description: `+${Math.round(100 / learningSections.length)} XP earned`
    });

    // Move to next section
    if (currentSection < learningSections.length - 1) {
      setCurrentSection(prev => prev + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getColorClass = (color: string) => {
    const colors: {[key: string]: string} = {
      blue: 'bg-blue-500 hover:bg-blue-600 border-blue-300',
      purple: 'bg-purple-500 hover:bg-purple-600 border-purple-300',
      green: 'bg-green-500 hover:bg-green-600 border-green-300',
      orange: 'bg-orange-500 hover:bg-orange-600 border-orange-300',
      pink: 'bg-pink-500 hover:bg-pink-600 border-pink-300'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Learning Style Selector & Progress Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">{lessonTitle}</h2>
              <p className="text-purple-100 text-sm">Choose your preferred learning method</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{progress}%</div>
              <p className="text-xs text-purple-100">Complete</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/20 rounded-full h-3 mb-4 overflow-hidden">
            <div 
              className="bg-white h-full rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <Clock className="w-4 h-4 mx-auto mb-1" />
              <p className="text-lg font-bold">{formatTime(timeSpent)}</p>
              <p className="text-xs text-purple-100">Time Spent</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <Target className="w-4 h-4 mx-auto mb-1" />
              <p className="text-lg font-bold">{completedSections.size}/{learningSections.length}</p>
              <p className="text-xs text-purple-100">Sections</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <Zap className="w-4 h-4 mx-auto mb-1" />
              <p className="text-lg font-bold">{Math.round(engagementScore)}</p>
              <p className="text-xs text-purple-100">Engagement</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Method Selection - Modern Approach */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-600" />
            Modern Learning Delivery Methods
          </CardTitle>
          <CardDescription>
            Select your preferred learning style - We support multiple intelligence types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {deliveryMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedMode === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedMode(method.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                    isSelected
                      ? `${getColorClass(method.color)} text-white shadow-lg`
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${
                    isSelected ? 'text-white' : `text-${method.color}-600`
                  }`} />
                  <h3 className={`font-semibold text-sm mb-1 ${
                    isSelected ? 'text-white' : 'text-gray-900'
                  }`}>
                    {method.title}
                  </h3>
                  <p className={`text-xs ${
                    isSelected ? 'text-white/90' : 'text-gray-600'
                  }`}>
                    {method.description}
                  </p>
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                      <CheckCircle className={`w-5 h-5 text-${method.color}-600`} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Learning Path Navigator */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Learning Path Navigator
          </CardTitle>
          <CardDescription>
            Follow the structured path or jump to any section
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {learningSections.map((section, index) => {
              const isCompleted = completedSections.has(section.id);
              const isCurrent = currentSection === index;
              return (
                <button
                  key={section.id}
                  onClick={() => setCurrentSection(index)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    isCurrent
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : isCompleted
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{section.title}</h4>
                      <p className="text-sm text-gray-600">{section.duration}</p>
                    </div>
                    <Badge className={
                      section.type === 'quiz' ? 'bg-yellow-500' :
                      section.type === 'practice' ? 'bg-blue-500' :
                      'bg-gray-500'
                    }>
                      {section.type}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Content Delivery Area - Adaptive Based on Selected Mode */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {selectedMode === 'video' && <Video className="w-5 h-5 text-purple-600" />}
              {selectedMode === 'audio' && <Headphones className="w-5 h-5 text-green-600" />}
              {selectedMode === 'read' && <BookOpen className="w-5 h-5 text-blue-600" />}
              {selectedMode === 'interactive' && <Gamepad2 className="w-5 h-5 text-orange-600" />}
              {selectedMode === 'practice' && <Code className="w-5 h-5 text-pink-600" />}
              {learningSections[currentSection].title}
            </CardTitle>
            <Badge variant="outline" className="text-sm">
              Section {currentSection + 1} of {learningSections.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Video Learning Mode */}
          {selectedMode === 'video' && (
            <div className="space-y-4">
              {/* Video Tutorial Button - Opens in New Page */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
                <CardContent className="p-6">
                  <Button
                    onClick={() => {
                      if (onOpenVideoTutorial) {
                        onOpenVideoTutorial(moduleId, lessonId, lessonTitle);
                        toast.success('Opening Video Tutorial Page', {
                          description: 'Loading comprehensive video content'
                        });
                      }
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md"
                    size="lg"
                  >
                    <Video className="w-5 h-5 mr-2" />
                    Open Video Tutorial Page
                  </Button>
                  <p className="text-sm text-gray-600 text-center mt-3">
                    View video tutorials in a dedicated full-screen page with additional resources
                  </p>
                </CardContent>
              </Card>

              {/* Video Preview/Info Card */}
              <Card className="border-0 shadow-lg">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Video className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Video Tutorial Available</h3>
                      <p className="text-white/80 text-sm">{lessonTitle}</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4 space-y-3">
                  <p className="text-gray-700">Watch comprehensive video tutorial for this lesson</p>
                  <Button
                    onClick={() => {
                      if (onOpenVideoTutorial) {
                        onOpenVideoTutorial(moduleId, lessonId, lessonTitle);
                      }
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Now
                  </Button>
                </CardContent>
              </Card>
              
              {/* Old video tutorial content removed - now on dedicated page */}
              {false && showVideoTutorials && (
                <>
                  {/* Video Tutorial Header with Hide Button */}
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <Video className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">Video Tutorial Section</h3>
                        <p className="text-white/80 text-sm">Watch and learn at your own pace</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowVideoTutorials(false);
                        toast.info('Video Tutorial Hidden', {
                          description: 'Click "Show Video Tutorial" to view again'
                        });
                      }}
                      className="text-white hover:bg-white/20"
                    >
                      Hide Tutorial
                    </Button>
                  </div>

                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                {/* Video Player Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-semibold mb-2">Video Tutorial: {lessonTitle}</p>
                    <p className="text-sm text-gray-300 mb-4">High-quality video instruction with examples</p>
                    <Button
                      onClick={() => {
                        setIsPlaying(!isPlaying);
                        toast.info(isPlaying ? 'Video Paused' : 'Playing Video Tutorial');
                      }}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-5 h-5 mr-2" />
                          Pause Video
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 mr-2" />
                          Play Video
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                {/* Video Controls Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-white hover:text-purple-400 transition"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    
                    {/* Progress Bar */}
                    <div className="flex-1 bg-gray-600 rounded-full h-1">
                      <div 
                        className="bg-purple-500 h-1 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    
                    <button 
                      onClick={() => {
                        setIsMuted(!isMuted);
                        toast.info(isMuted ? 'Sound On' : 'Sound Muted');
                      }}
                      className="text-white hover:text-purple-400 transition"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    
                    <button 
                      onClick={() => toast.info('Fullscreen mode activated')}
                      className="text-white hover:text-purple-400 transition"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Video Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setShowTranscript(!showTranscript);
                    toast.success(showTranscript ? 'Transcript Hidden' : 'Showing Transcript');
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    toast.success('Downloading lesson notes...', {
                      description: `${lessonTitle} - Module ${moduleId}`
                    });
                    setTimeout(() => {
                      toast.success('Notes downloaded successfully!');
                    }, 1500);
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Notes
                </Button>
              </div>
              
              {/* Transcript Panel */}
              {showTranscript && (
                <Card className="bg-gray-50 border-2 border-gray-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Video Transcript
                    </h4>
                    <ScrollArea className="h-64">
                      <div className="space-y-3 text-sm text-gray-700 pr-4">
                        <p className="leading-relaxed">
                          <strong className="text-purple-600">[00:00]</strong> Welcome to {lessonTitle}. 
                          In this lesson, we'll explore the fundamental concepts of {lessonTitle.toLowerCase()} 
                          and how they apply to object-oriented programming in Java.
                        </p>
                        <p className="leading-relaxed">
                          <strong className="text-purple-600">[00:15]</strong> Let's start by understanding 
                          what {lessonTitle.toLowerCase()} means and why it's important in modern software development. 
                          This concept is crucial for writing maintainable and scalable code.
                        </p>
                        <p className="leading-relaxed">
                          <strong className="text-purple-600">[00:45]</strong> We'll walk through several 
                          real-world examples to demonstrate how {lessonTitle.toLowerCase()} is used in 
                          production applications. Pay close attention to the code structure and design patterns.
                        </p>
                        <p className="leading-relaxed">
                          <strong className="text-purple-600">[01:20]</strong> Now let's see some practical 
                          implementations. Notice how we're applying the principles we discussed earlier to 
                          solve common programming challenges.
                        </p>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
                </>
              )}
            </div>
          )}

          {/* Audio Learning Mode */}
          {selectedMode === 'audio' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Headphones className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Audio Lecture</h3>
                  <p className="text-gray-700 mb-4">{lessonTitle}</p>
                  
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-5 h-5 mr-2" />
                        Pause Lecture
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Play Lecture
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-green-600" />
                  Audio Learning Benefits
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Perfect for auditory learners</li>
                  <li>• Learn while multitasking</li>
                  <li>• Professional narration with clear explanations</li>
                  <li>• Download for offline listening</li>
                </ul>
              </div>
            </div>
          )}

          {/* Reading Mode - Enhanced */}
          {selectedMode === 'read' && (
            <div className="space-y-4">
              <div className="prose max-w-none">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">📚 Learning Objectives</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Understand the core concepts of {lessonTitle}</li>
                    <li>• Apply OOP principles in real scenarios</li>
                    <li>• Practice with hands-on coding exercises</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    Introduction
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {lessonContent.introduction}
                  </p>

                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Brain className="w-6 h-6 text-purple-600" />
                    Key Concepts
                  </h3>
                  <div className="space-y-3">
                    {lessonContent.keyConcepts.map((concept: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 bg-purple-50 p-3 rounded-lg">
                        <ChevronRight className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700">{concept}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  Highlight Key Terms
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}

          {/* Interactive Gamified Mode - Quiz in Game Form */}
          {selectedMode === 'interactive' && (
            <div className="space-y-4">
              {(() => {
                const challenges = getChallengesForLesson(lessonId);
                if (!challenges || challenges.length === 0) {
                  return (
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 text-center">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No quiz available for this lesson yet.</p>
                    </div>
                  );
                }

                return (
                  <Card className="border-4 border-orange-200 shadow-lg bg-gradient-to-br from-[#FFF8E7] to-[#FFF4D6] overflow-hidden">
                    <CardContent className="p-8">
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl flex-shrink-0">
                          <Trophy className="w-11 h-11 text-white" />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz in Game Form</h2>
                          <p className="text-gray-700 text-base mb-3">
                            Test your knowledge with {challenges.length} interactive questions! Earn XP, build streaks, and master {lessonTitle}.
                          </p>
                        </div>
                      </div>

                      {/* Quiz Info Badges */}
                      <div className="flex flex-wrap gap-3 mb-6">
                        <Badge className="bg-orange-100 text-orange-700 border-2 border-orange-300 px-4 py-2 text-sm font-semibold">
                          {challenges.length} Questions
                        </Badge>
                        <Badge className="bg-yellow-100 text-yellow-700 border-2 border-yellow-300 px-4 py-2 text-sm font-semibold">
                          70% to Pass
                        </Badge>
                        <Badge className="bg-green-100 text-green-700 border-2 border-green-300 px-4 py-2 text-sm font-semibold">
                          Earn XP & Streaks
                        </Badge>
                      </div>

                      {/* Start Quiz Button */}
                      <Button
                        onClick={() => setQuizMode('quiz')}
                        size="lg"
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-lg font-bold py-6 rounded-xl shadow-xl transform hover:scale-[1.02] transition-all"
                      >
                        <Trophy className="w-6 h-6 mr-3" />
                        Start Quiz Game
                      </Button>

                      {/* Stats Preview */}
                      <div className="grid grid-cols-3 gap-3 mt-6">
                        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 text-center">
                          <Award className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
                          <p className="text-lg font-bold text-gray-900">{Math.round(engagementScore)}</p>
                          <p className="text-xs text-gray-600">XP Earned</p>
                        </div>
                        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3 text-center">
                          <Target className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                          <p className="text-lg font-bold text-gray-900">{completedSections.size}/10</p>
                          <p className="text-xs text-gray-600">Completed</p>
                        </div>
                        <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-3 text-center">
                          <Trophy className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                          <p className="text-lg font-bold text-gray-900">Level {Math.floor(engagementScore / 20) + 1}</p>
                          <p className="text-xs text-gray-600">Progress</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}
            </div>
          )}

          {/* Practice Mode */}
          {selectedMode === 'practice' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Code className="w-6 h-6 text-pink-600" />
                  Hands-On Coding Practice
                </h3>
                <p className="text-gray-700 mb-4">
                  Apply what you've learned by writing actual code
                </p>
                <Button className="bg-pink-600 hover:bg-pink-700">
                  <Play className="w-4 h-4 mr-2" />
                  Open Code Editor
                </Button>
              </div>
            </div>
          )}

          {/* Navigation Actions */}
          <div className="flex items-center justify-between pt-6 border-t-2 border-gray-200">
            <Button
              variant="outline"
              disabled={currentSection === 0}
              onClick={() => setCurrentSection(prev => prev - 1)}
            >
              Previous Section
            </Button>

            <Button
              onClick={() => handleSectionComplete(learningSections[currentSection].id)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {currentSection === learningSections.length - 1 ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Lesson
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Collaborative Learning Features */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-cyan-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-600" />
            Collaborative Learning
          </CardTitle>
          <CardDescription>
            Learn together with your classmates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start border-cyan-300 hover:bg-cyan-50">
            <MessageCircle className="w-4 h-4 mr-2" />
            Discussion Forum - Ask Questions
          </Button>
          <Button variant="outline" className="w-full justify-start border-blue-300 hover:bg-blue-50">
            <Users className="w-4 h-4 mr-2" />
            Study Group - Join Session
          </Button>
          <Button variant="outline" className="w-full justify-start border-purple-300 hover:bg-purple-50">
            <Brain className="w-4 h-4 mr-2" />
            Peer Review - Share Code
          </Button>
        </CardContent>
      </Card>

      {/* Personalized Feedback & Analytics */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            Your Learning Analytics
          </CardTitle>
          <CardDescription>
            Personalized insights on your progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
              <TrendingUp className="w-5 h-5 text-green-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{Math.round(engagementScore)}%</p>
              <p className="text-sm text-gray-600">Engagement Level</p>
            </div>
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
              <Target className="w-5 h-5 text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{completedSections.size}/6</p>
              <p className="text-sm text-gray-600">Sections Completed</p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              Personalized Recommendation
            </h4>
            <p className="text-sm text-gray-700">
              Based on your learning style ({learningStyle}), we recommend spending more time on 
              {selectedMode === 'video' ? ' video tutorials' : 
               selectedMode === 'audio' ? ' audio lectures' :
               selectedMode === 'interactive' ? ' interactive exercises' :
               ' hands-on practice'} for optimal retention.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}