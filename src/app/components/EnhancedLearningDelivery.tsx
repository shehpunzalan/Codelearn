import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  BookOpen, Video, Headphones, FileText, Code,
  CheckCircle, Play, Pause, Volume2, VolumeX,
  Maximize2, Download, MessageCircle,
  Lightbulb, Users, Brain, Target, Zap, Award,
  ChevronRight, ChevronLeft, Sparkles, Eye,
  Clock, BarChart3, TrendingUp, Gamepad2, Trophy,
  AlertCircle, XCircle, User, ExternalLink, ArrowLeft,
  BookMarked, Lock
} from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';
import { 
  synthesizeSpeech, 
  stopSpeech, 
  pauseSpeech, 
  resumeSpeech,
  generateAudioLectureText 
} from '../data/lessonAudioData';
import { comprehensiveLessonsContent, getLessonSpecificKeywords } from '../data/comprehensiveLessonsContent';
import { getChallengesForLesson } from '../data/lessonChallenges';
import { getMinimumRealWorldExamples } from '../data/realWorldExamples';
import { getLessonVideo, getVideoEmbedUrl, getVideoFullUrl } from '../data/lessonVideos';
import { GameFormQuiz } from './GameFormQuiz';
import { QuizResultsPage } from './QuizResultsPage';
import { VideoTutorialInline } from './VideoTutorialInline';
import type { Challenge } from '../data/lessonChallenges';

interface EnhancedLearningDeliveryProps {
  moduleId: string;
  lessonId: string;
  lessonTitle: string;
  lessonContent: any;
  onComplete?: () => void;
  onStartCoding?: (moduleId: string, lessonId: string) => void;
  onOpenVideoTutorial?: (moduleId: string, lessonId: string, lessonTitle: string) => void;
  onOpenReadingContent?: (moduleId: string, lessonId: string, lessonTitle: string, lessonContent: any) => void;
  onOpenAudioLecture?: (moduleId: string, lessonId: string, lessonTitle: string, lessonContent: any) => void;
  onOpenInteractiveGame?: (moduleId: string, lessonId: string, lessonTitle: string, lessonContent: any) => void;
  onQuizComplete?: (stats: { totalQuestions: number; correctAnswers: number; accuracy: number; passed: boolean }) => void;
}

type LearningMode = 'read' | 'video' | 'interactive';

export function EnhancedLearningDelivery({
  moduleId,
  lessonId,
  lessonTitle,
  lessonContent,
  onComplete,
  onStartCoding,
  onOpenVideoTutorial,
  onOpenReadingContent,
  onOpenAudioLecture,
  onOpenInteractiveGame,
  onQuizComplete
}: EnhancedLearningDeliveryProps) {
  const [selectedMode, setSelectedMode] = useState<LearningMode>('read');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(() => {
    try {
      const saved = localStorage.getItem(`currentSection_${moduleId}_${lessonId}`);
      const parsed = saved ? parseInt(saved, 10) : 0;
      // Clamp to 0–4 (5 sections after Knowledge Check removal) to avoid undefined access
      return Math.min(Math.max(0, parsed), 4);
    } catch { return 0; }
  });
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: string}>({});
  const [showTranscript, setShowTranscript] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [engagementScore, setEngagementScore] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(() => {
    try {
      const key = `completedSections_${moduleId}_${lessonId}`;
      const saved = localStorage.getItem(key);
      return saved ? new Set<number>(JSON.parse(saved)) : new Set<number>();
    } catch { return new Set<number>(); }
  });
  const [highlightEnabled, setHighlightEnabled] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [quizMode, setQuizMode] = useState<'quiz' | 'results' | null>(null);
  const [quizStats, setQuizStats] = useState<any>(null);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [shuffledQuizQuestions, setShuffledQuizQuestions] = useState<Challenge[]>([]);
  const [showVideoTutorials, setShowVideoTutorials] = useState(true);

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Persist section progress so it survives page reloads / PC shutdown
  useEffect(() => {
    try {
      const key = `completedSections_${moduleId}_${lessonId}`;
      localStorage.setItem(key, JSON.stringify(Array.from(completedSections)));
    } catch { /* storage full or unavailable */ }
  }, [completedSections, moduleId, lessonId]);

  useEffect(() => {
    try {
      localStorage.setItem(`currentSection_${moduleId}_${lessonId}`, String(currentSection));
    } catch { /* ignore */ }
  }, [currentSection, moduleId, lessonId]);

  // Construct the comprehensive lesson content key (format: 'mod1-lesson1-1')
  const comprehensiveLessonKey = `${moduleId}-${lessonId}`;

  // Simulated learning path sections
  const learningSections = [
    { id: 1, title: 'Introduction & Objectives', duration: '3 min', type: 'intro' },
    { id: 2, title: 'Core Concepts Explained', duration: '8 min', type: 'content' },
    { id: 3, title: 'Real-World Examples', duration: '5 min', type: 'examples' },
    { id: 4, title: 'Hands-On Practice', duration: '10 min', type: 'practice' },
    { id: 6, title: 'Summary & Next Steps', duration: '2 min', type: 'summary' }
  ];

  // Shuffle quiz questions only when section changes to quiz
  useEffect(() => {
    if (learningSections[currentSection]?.type === 'quiz') {
      const challenges = getChallengesForLesson(comprehensiveLessonKey);
      const originalQuizQuestions = challenges ? challenges.slice(0, 10).filter((q: any) => q && q.question) : [];

      // Shuffle options for each question
      const shuffled = originalQuizQuestions.map(question => {
        const options = [...question.options];

        // Fisher-Yates shuffle
        for (let i = options.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [options[i], options[j]] = [options[j], options[i]];
        }

        return {
          ...question,
          options
        };
      });

      setShuffledQuizQuestions(shuffled);
      console.log('📝 Enhanced Quiz - Shuffled', shuffled.length, 'questions');
    }
  }, [currentSection, comprehensiveLessonKey]);

  // Get lesson-specific video data
  const lessonVideo = getLessonVideo(comprehensiveLessonKey);

  // Modern delivery methods
  const deliveryMethods = [
    {
      id: 'read' as LearningMode,
      icon: BookOpen,
      title: 'Reading',
      description: 'Interactive text with highlights',
      color: 'blue'
    },
    {
      id: 'video' as LearningMode,
      icon: Video,
      title: 'Video Tutorial',
      description: 'Visual demonstration',
      color: 'purple'
    },
    {
      id: 'interactive' as LearningMode,
      icon: Gamepad2,
      title: 'Interactive',
      description: 'Gamified experience',
      color: 'orange'
    }
  ];

  /**
   * Effect: Track time spent and engagement metrics
   * Updates every second to monitor student engagement
   * Increases engagement score during active learning
   */
  useEffect(() => {
    // Set up interval to update metrics every second
    const timeTrackingInterval = setInterval(() => {
      setTimeSpent(previousTimeSpent => previousTimeSpent + 1);
      
      // Increase engagement score when actively learning
      if (isPlaying || selectedMode === 'interactive') {
        setEngagementScore(previousEngagementScore => Math.min(100, previousEngagementScore + 0.5));
      }
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(timeTrackingInterval);
  }, [isPlaying, selectedMode]);

  // Audio playback tracking
  useEffect(() => {
    if (isPlaying && selectedMode === 'audio') {
      // Start text-to-speech audio
      const lectureText = generateAudioLectureText(lessonContent);
      synthesizeSpeech(lectureText, () => {
        setIsPlaying(false);
        toast.success('Audio lecture completed!');
      });
    } else if (!isPlaying && selectedMode === 'audio') {
      // Stop audio if paused
      stopSpeech();
    }
    
    // Cleanup function
    return () => {
      if (selectedMode !== 'audio') {
        stopSpeech();
      }
    };
  }, [isPlaying, selectedMode]);

  // Auto-calculate progress
  useEffect(() => {
    const totalSections = learningSections.length;
    const completed = completedSections.size;
    setProgress(Math.round((completed / totalSections) * 100));
  }, [completedSections]);

  /**
   * Handler: Mark a learning section as complete
   * Updates progress tracking and advances to next section
   * @param sectionId - The ID of the section being completed
   */
  const handleSectionComplete = (sectionId: number) => {
    // Add section to completed set
    const newCompletedSections = new Set(completedSections);
    newCompletedSections.add(sectionId);
    setCompletedSections(newCompletedSections);
    
    // Calculate and display experience points earned
    const experiencePoints = Math.round(100 / learningSections.length);
    toast.success('Section Completed! 🎉', {
      description: `+${experiencePoints} XP earned`
    });

    // Advance to next section or complete lesson
    if (currentSection < learningSections.length - 1) {
      setCurrentSection(previousSectionIndex => previousSectionIndex + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  /**
   * Handler: Toggle highlighting of key programming terms
   * Enables/disables visual highlighting of important concepts
   */
  const handleHighlightKeyTerms = () => {
    const newHighlightState = !highlightEnabled;
    setHighlightEnabled(newHighlightState);
    
    if (newHighlightState) {
      // Count keywords in current lesson for user feedback
      const lessonKeywords = getLessonSpecificKeywords(comprehensiveLessonKey) || [];
      const totalKeywords = lessonKeywords.length > 0 ? lessonKeywords.length : 50;
      
      toast.success('✨ Key Terms Highlighted!', {
        description: `${totalKeywords}+ important programming terms are now highlighted in yellow. Hover over them for definitions.`,
        duration: 4000
      });
      
      // Reward engagement with additional score
      setEngagementScore(previousEngagementScore => Math.min(100, previousEngagementScore + 2));
    } else {
      toast.info('Highlights Removed', {
        description: 'Key term highlighting has been turned off',
        duration: 2000
      });
    }
  };

  // Download PDF functionality
  const handleDownloadPDF = async () => {
    toast.success('Generating PDF...', {
      description: 'Creating your downloadable lesson notes'
    });

    try {
      // Dynamic import to avoid build issues
      const { default: jsPDF } = await import('jspdf');
      
      setTimeout(() => {
        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 20;
        const lineHeight = 7;
        let yPosition = 20;

        // Title
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text('CodeLearn AI - Lesson Notes', margin, yPosition);
        
        yPosition += 15;
        pdf.setFontSize(16);
        pdf.setTextColor(100, 50, 200);
        pdf.text(lessonTitle, margin, yPosition);
        
        yPosition += 10;
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Module ${moduleId} | ${new Date().toLocaleDateString()}`, margin, yPosition);
        
        // Line separator
        yPosition += 8;
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        
        yPosition += 12;
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Introduction', margin, yPosition);
        
        yPosition += 8;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        const introText = lessonContent.introduction || 'Learn the fundamentals of object-oriented programming in Java.';
        const introLines = pdf.splitTextToSize(introText, pageWidth - 2 * margin);
        pdf.text(introLines, margin, yPosition);
        
        yPosition += introLines.length * lineHeight + 10;

        // Key Concepts
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text('Key Concepts', margin, yPosition);
        
        yPosition += 8;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        
        (lessonContent.keyConcepts || []).forEach((concept: string, idx: number) => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }
          const conceptText = `• ${concept}`;
          const conceptLines = pdf.splitTextToSize(conceptText, pageWidth - 2 * margin - 5);
          pdf.text(conceptLines, margin + 5, yPosition);
          yPosition += conceptLines.length * lineHeight + 3;
        });

        // Footer
        const totalPages = pdf.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(8);
          pdf.setTextColor(150, 150, 150);
          pdf.text(
            `Page ${i} of ${totalPages} | CodeLearn AI © 2026`,
            pageWidth / 2,
            pdf.internal.pageSize.getHeight() - 10,
            { align: 'center' }
          );
        }

        pdf.save(`${lessonTitle.replace(/\s+/g, '_')}_Notes.pdf`);
        
        toast.success('PDF downloaded successfully!', {
          description: 'Your lesson notes are ready'
        });
      }, 1500);
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF', {
        description: 'Please try again later'
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getColorClass = (color: string) => {
    const colors: {[key: string]: string} = {
      blue: 'bg-blue-500 hover:bg-blue-600',
      purple: 'bg-purple-500 hover:bg-purple-600',
      green: 'bg-green-500 hover:bg-green-600',
      orange: 'bg-orange-500 hover:bg-orange-600',
      pink: 'bg-pink-500 hover:bg-pink-600'
    };
    return colors[color] || colors.blue;
  };

  // Helper function to highlight text with enhanced visual feedback
  const HighlightedText = ({ text, enabled }: { text: string; enabled: boolean }) => {
    if (!enabled || !text) {
      return <>{text}</>;
    }

    // Get comprehensive keywords list - combine lesson-specific and general keywords
    const lessonKeywords = getLessonSpecificKeywords(comprehensiveLessonKey) || [];
    const generalKeywords = [
      'class', 'object', 'method', 'variable', 'OOP', 'Java', 'encapsulation',
      'inheritance', 'polymorphism', 'abstraction', 'interface', 'public',
      'private', 'protected', 'static', 'void', 'extends', 'implements',
      'constructor', 'package', 'import', 'new', 'this', 'super', 'final',
      'abstract', 'overloading', 'overriding', 'Exception', 'throws', 'try',
      'catch', 'finally', 'Collection', 'List', 'Set', 'Map', 'ArrayList',
      'HashMap', 'String', 'int', 'double', 'boolean', 'char', 'byte',
      'float', 'long', 'short', 'return', 'if', 'else', 'for', 'while',
      'switch', 'case', 'break', 'continue', 'instanceof', 'synchronized',
      'volatile', 'transient', 'native', 'strictfp', 'enum', 'assert',
      'default', 'thread', 'Serializable', 'Cloneable', 'Comparable',
      'Override', 'Deprecated', 'SuppressWarnings', 'FunctionalInterface',
      'parameter', 'argument', 'attribute', 'field', 'instance', 'reference',
      'primitive', 'wrapper', 'autoboxing', 'unboxing', 'casting', 'compile',
      'runtime', 'bytecode', 'JVM', 'JDK', 'JRE', 'garbage collection',
      'memory', 'heap', 'stack', 'null', 'NullPointerException'
    ];
    
    // Combine and remove duplicates
    const allKeywords = [...new Set([...lessonKeywords, ...generalKeywords])];
    
    // Sort keywords by length (longest first) to avoid partial matches
    const sortedKeywords = allKeywords.sort((a, b) => b.length - a.length);

    // Escape special regex characters and create pattern
    const escapedKeywords = sortedKeywords.map(k => 
      k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );
    
    // Create regex pattern that matches whole words only
    const pattern = new RegExp(
      `\\b(${escapedKeywords.join('|')})\\b`,
      'gi'
    );

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Find all matches
    const matches = Array.from(text.matchAll(pattern));

    if (matches.length === 0) {
      return <>{text}</>;
    }

    matches.forEach((match, idx) => {
      const matchIndex = match.index!;
      const matchText = match[0];

      // Add text before match
      if (matchIndex > lastIndex) {
        parts.push(
          <span key={`text-${idx}`}>
            {text.substring(lastIndex, matchIndex)}
          </span>
        );
      }

      // Add highlighted match with enhanced styling
      parts.push(
        <mark 
          key={`highlight-${idx}`} 
          className="bg-yellow-300 text-gray-900 px-1.5 py-0.5 rounded font-semibold shadow-sm border-b-2 border-yellow-500 transition-all hover:bg-yellow-400 cursor-help"
          title={`Key programming term: ${matchText}`}
        >
          {matchText}
        </mark>
      );

      lastIndex = matchIndex + matchText.length;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key="text-end">{text.substring(lastIndex)}</span>
      );
    }

    return <>{parts}</>;
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

      {/* Delivery Method Selection */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-600" />
            Modern Learning Delivery Methods
          </CardTitle>
          <CardDescription>
            Select your preferred learning style
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {deliveryMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedMode === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => {
                    setSelectedMode(method.id);
                    if (method.id === 'video' && onOpenVideoTutorial) {
                      // Open video tutorial in full page when video mode is selected
                      onOpenVideoTutorial(moduleId, lessonId, lessonTitle);
                    }
                    if (method.id === 'audio' && onOpenAudioLecture) {
                      // Open audio lecture in full page when audio mode is selected
                      onOpenAudioLecture(moduleId, lessonId, lessonTitle, lessonContent);
                    }
                    if (method.id === 'interactive' && onOpenInteractiveGame) {
                      // Open interactive game in full page when interactive mode is selected
                      onOpenInteractiveGame(moduleId, lessonId, lessonTitle, lessonContent);
                    }
                  }}
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
                  {isSelected && method.id !== 'video' && method.id !== 'audio' && method.id !== 'interactive' && (
                    <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                      <CheckCircle className={`w-5 h-5 text-${method.color}-600`} />
                    </div>
                  )}
                  {method.id === 'video' && (
                    <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                      <ExternalLink className={`w-5 h-5 text-${method.color}-600`} />
                    </div>
                  )}
                  {method.id === 'audio' && (
                    <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                      <ExternalLink className={`w-5 h-5 text-${method.color}-600`} />
                    </div>
                  )}
                  {method.id === 'interactive' && (
                    <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                      <ExternalLink className={`w-5 h-5 text-${method.color}-600`} />
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
              const isLocked = index > 0 && !completedSections.has(learningSections[index - 1].id);
              return (
                <button
                  key={section.id}
                  onClick={() => !isLocked && setCurrentSection(index)}
                  disabled={isLocked}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    isLocked
                      ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                      : isCurrent
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : isCompleted
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isLocked
                        ? 'bg-gray-300 text-gray-500'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {isLocked ? (
                        <Lock className="w-4 h-4" />
                      ) : isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{section.title}</h4>
                      <p className="text-sm text-gray-600">{isLocked ? 'Complete previous section to unlock' : section.duration}</p>
                    </div>
                    {!isLocked && (
                      <Badge className={
                        section.type === 'quiz' ? 'bg-yellow-500' :
                        section.type === 'practice' ? 'bg-blue-500' :
                        'bg-gray-500'
                      }>
                        {section.type}
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Content Delivery Area */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {selectedMode === 'video' && <Video className="w-5 h-5 text-purple-600" />}
              {selectedMode === 'audio' && <Headphones className="w-5 h-5 text-green-600" />}
              {selectedMode === 'read' && <BookOpen className="w-5 h-5 text-blue-600" />}
              {selectedMode === 'interactive' && <Gamepad2 className="w-5 h-5 text-orange-600" />}
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
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Opening Video Tutorial...</h3>
              <p className="text-gray-600 mb-4">You will be redirected to the video tutorial page</p>
              <Button
                onClick={() => onOpenVideoTutorial && onOpenVideoTutorial(moduleId, lessonId, lessonTitle)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Video Tutorial
              </Button>
            </div>
          )}

          {/* Audio Learning Mode */}
          {selectedMode === 'audio' && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Opening Audio Lecture...</h3>
              <p className="text-gray-600 mb-4">You will be redirected to the audio lecture page</p>
              <Button
                onClick={() => onOpenAudioLecture && onOpenAudioLecture(moduleId, lessonId, lessonTitle, lessonContent)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Audio Lecture
              </Button>
            </div>
          )}

          {/* Reading Mode - Enhanced with Section-Based Content */}
          {selectedMode === 'read' && (
            <div className="space-y-4">
              {/* Section 1: Introduction & Objectives */}
              {learningSections[currentSection].type === 'intro' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      📚 Learning Objectives
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• Understand the core concepts of {lessonTitle}</li>
                      <li>• Apply OOP principles in real-world scenarios</li>
                      <li>• Write clean and maintainable Java code</li>
                      <li>• Practice with hands-on coding exercises</li>
                      <li>• Master best practices and design patterns</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                      Introduction
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      <HighlightedText 
                        text={comprehensiveLessonsContent[comprehensiveLessonKey]?.introduction || lessonContent.introduction || 'Welcome to this lesson on object-oriented programming in Java.'} 
                        enabled={highlightEnabled} 
                      />
                    </p>
                  </div>
                </div>
              )}

              {/* Section 2: Core Concepts Explained */}
              {learningSections[currentSection].type === 'content' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Brain className="w-6 h-6 text-purple-600" />
                      Core Concepts Explained
                    </h3>
                    
                    <div className="space-y-4">
                      {(comprehensiveLessonsContent[comprehensiveLessonKey]?.keyConcepts || lessonContent.keyConcepts || []).map((concept: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                          <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-700 leading-relaxed">
                              <HighlightedText text={concept} enabled={highlightEnabled} />
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {comprehensiveLessonsContent[comprehensiveLessonKey]?.detailedExplanation && (
                      <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                          <Lightbulb className="w-6 h-6 text-yellow-600" />
                          In-Depth Explanation
                        </h4>
                        <div className="prose prose-sm max-w-none">
                          <div className="text-gray-800 leading-relaxed space-y-4">
                            {comprehensiveLessonsContent[comprehensiveLessonKey].detailedExplanation
                              .split('\n\n')
                              .map((paragraph, idx) => {
                                // Check if it's a section header (ends with colon)
                                if (paragraph.trim().endsWith(':') && paragraph.trim().split('\n').length === 1) {
                                  return (
                                    <h5 key={idx} className="font-bold text-blue-900 text-base mt-6 mb-3 flex items-center gap-2">
                                      <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                                      {paragraph.trim()}
                                    </h5>
                                  );
                                }
                                
                                // Check if it's a numbered/bulleted list
                                const lines = paragraph.trim().split('\n');
                                const isListItem = lines.some(line => 
                                  /^[\d]+\./.test(line.trim()) || /^-/.test(line.trim())
                                );
                                
                                if (isListItem) {
                                  return (
                                    <ul key={idx} className="space-y-2 ml-4">
                                      {lines.map((line, lineIdx) => {
                                        const cleanLine = line.trim().replace(/^[\d]+\.\s*/, '').replace(/^-\s*/, '');
                                        if (!cleanLine) return null;
                                        
                                        return (
                                          <li key={lineIdx} className="flex items-start gap-3 text-gray-700">
                                            <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                                            <span className="flex-1">
                                              <HighlightedText text={cleanLine} enabled={highlightEnabled} />
                                            </span>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  );
                                }
                                
                                // Regular paragraph
                                return paragraph.trim() ? (
                                  <p key={idx} className="text-gray-700 leading-loose">
                                    <HighlightedText text={paragraph.trim()} enabled={highlightEnabled} />
                                  </p>
                                ) : null;
                              })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Code Examples within Core Concepts */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Code className="w-5 h-5 text-green-600" />
                        Code Examples
                      </h4>
                      
                      <div className="space-y-4">
                        {(comprehensiveLessonsContent[comprehensiveLessonKey]?.codeExamples || lessonContent.codeExamples || [
                          {
                            title: 'Basic Example',
                            code: '// Sample Java code\npublic class Example {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
                            explanation: 'This is a basic Java program that demonstrates fundamental syntax.'
                          }
                        ]).map((example: any, idx: number) => (
                          <div key={idx} className="border-2 border-green-200 rounded-lg overflow-hidden">
                            <div className="bg-green-100 px-4 py-2 border-b-2 border-green-200">
                              <h5 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                                <Code className="w-4 h-4 text-green-600" />
                                Example {idx + 1}: {example.title}
                              </h5>
                            </div>
                            
                            <div className="bg-gray-900 p-4">
                              <pre className="text-sm overflow-x-auto">
                                <code className="text-green-400 font-mono">{example.code}</code>
                              </pre>
                            </div>
                            
                            <div className="bg-gray-50 p-4 border-t-2 border-green-200">
                              <p className="text-sm text-gray-700 leading-relaxed">
                                <strong className="text-green-700">💡 Explanation:</strong> {example.explanation}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 3: Real-World Application Examples */}
              {learningSections[currentSection].type === 'examples' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                    {/* Header with Icon */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        Real-World Examples
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-1 ml-[52px]">
                      Section 3 of 6
                    </p>
                    
                    {/* Real-World Applications */}
                    <div className="mt-6 mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">
                          Real-World Applications
                        </h4>
                      </div>
                      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                        See how these concepts are used in actual software development and industry applications
                      </p>
                      
                      <div className="space-y-4">
                        {/* Display comprehensive real-world applications */}
                        {getMinimumRealWorldExamples(comprehensiveLessonKey).map((example, idx) => {
                          // Icon mapping for specific industries
                          const iconClass = idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-blue-500' : 'bg-orange-500';
                          const bgClass = idx === 0 ? 'bg-red-50 border-red-200' : idx === 1 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200';
                          
                          return (
                            <div key={idx} className={`${bgClass} border-l-4 border-l-blue-600 p-5 rounded-lg shadow-sm`}>
                              <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 ${iconClass} text-white rounded-lg flex items-center justify-center text-2xl flex-shrink-0 shadow-sm`}>
                                  {example.icon}
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                                    {example.icon} {example.industry}
                                  </h5>
                                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                                    <HighlightedText text={example.description} enabled={highlightEnabled} />
                                  </p>
                                  {example.companies && example.companies.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {example.companies.map((company, companyIdx) => (
                                        <Badge key={companyIdx} variant="secondary" className="text-xs bg-white text-blue-700 border border-blue-300 hover:bg-blue-50 font-medium px-3 py-1">
                                          {company}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Industry Insights */}
                    <div className="mt-6 bg-purple-50 p-6 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-900 text-lg">
                          Industry Insights
                        </h4>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed mb-4">
                        These concepts are fundamental to modern software development. Major companies like Google, 
                        Amazon, Microsoft, and Facebook use these principles daily in their production systems.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
                          <p className="text-xs text-gray-600 mb-1">Used by</p>
                          <p className="font-bold text-gray-900 text-base">Fortune 500 Companies</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
                          <p className="text-xs text-gray-600 mb-1">Job Market Demand</p>
                          <p className="font-bold text-gray-900 text-base">Very High</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 space-y-3">
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          className="flex-1 border-gray-300 hover:bg-gray-50"
                          onClick={() => {
                            setHighlightEnabled(!highlightEnabled);
                            toast.success(highlightEnabled ? 'Key term highlighting disabled' : 'Key term highlighting enabled');
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Highlight Key Terms
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 border-gray-300 hover:bg-gray-50"
                          onClick={handleDownloadPDF}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 4: Hands-On Practice */}
              {learningSections[currentSection].type === 'practice' && (
                <div className="space-y-4">
                  <div style={{ background: 'var(--card)', borderRadius: 'var(--radius-lg, 12px)', border: '2px solid var(--border)', padding: '2rem', fontFamily: 'var(--font-sans)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, var(--primary), var(--secondary, #8b5cf6))', borderRadius: 'var(--radius-md, 8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Code style={{ width: 22, height: 22, color: 'white' }} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--foreground)', margin: 0, fontFamily: 'var(--font-sans)' }}>Hands-On Practice</h3>
                        <p style={{ fontSize: '0.82rem', color: 'var(--muted-foreground)', margin: 0, fontFamily: 'var(--font-sans)' }}>Apply what you learned by writing real Java code</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onStartCoding && onStartCoding(moduleId, lessonId)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.75rem', background: 'linear-gradient(135deg, var(--primary), var(--secondary, #8b5cf6))', color: 'white', border: 'none', borderRadius: 'var(--radius-md, 8px)', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                    >
                      <Play style={{ width: 18, height: 18 }} />
                      Open Code Editor
                    </button>
                  </div>
                </div>
              )}

              {/* Section 6: Summary & Next Steps */}
              {learningSections[currentSection].type === 'summary' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      Summary & Next Steps
                    </h3>
                    
                    <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-500 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5 text-green-600" />
                        Key Takeaways
                      </h4>
                      <ul className="space-y-2">
                        {(comprehensiveLessonsContent[comprehensiveLessonKey]?.keyConcepts || lessonContent.keyConcepts || []).slice(0, 5).map((concept: string, idx: number) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{concept}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {comprehensiveLessonsContent[comprehensiveLessonKey]?.keyTerms && (
                      <div className="bg-purple-50 p-5 rounded-lg mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-purple-600" />
                          Important Terms to Remember
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {comprehensiveLessonsContent[comprehensiveLessonKey].keyTerms.map((term: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="bg-white border-purple-300 text-purple-700">
                              {term}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <ChevronRight className="w-5 h-5 text-blue-600" />
                        What's Next?
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>Practice the exercises in the code editor</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>Review the code examples and try modifying them</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>Complete the interactive challenges for XP</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>Move on to the next lesson when you're ready</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-6 text-center">
                      <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg">
                        <Trophy className="w-5 h-5 inline-block mr-2" />
                        <span className="font-bold">Lesson Complete! 🎉</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  variant={highlightEnabled ? "default" : "outline"}
                  className={`flex-1 ${highlightEnabled ? 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-600' : ''}`}
                  onClick={handleHighlightKeyTerms}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {highlightEnabled ? '✨ Highlights Active' : 'Highlight Key Terms'}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleDownloadPDF}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
              
              {/* Highlighting Info Banner */}
              {highlightEnabled && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg animate-in slide-in-from-top">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        Key Terms Highlighting Active
                      </h4>
                      <p className="text-xs text-gray-700">
                        Important programming terms are highlighted in <mark className="bg-yellow-300 px-1 py-0.5 rounded font-semibold">yellow</mark>. 
                        Hover over highlighted terms for more information.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Interactive Gamified Mode - Quiz in Game Form */}
          {selectedMode === 'interactive' && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gamepad2 className="w-12 h-12 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Opening Interactive Game...</h3>
              <p className="text-gray-600 mb-4">You will be redirected to the interactive quiz game page</p>
              <Button
                onClick={() => onOpenInteractiveGame && onOpenInteractiveGame(moduleId, lessonId, lessonTitle, lessonContent)}
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Interactive Game
              </Button>
            </div>
          )}

          {/* Practice Mode */}
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
              <p className="text-2xl font-bold text-gray-900">{completedSections.size}/{learningSections.length}</p>
              <p className="text-sm text-gray-600">Sections Completed</p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              Personalized Recommendation
            </h4>
            <p className="text-sm text-gray-700">
              Based on your learning style, we recommend spending more time on 
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