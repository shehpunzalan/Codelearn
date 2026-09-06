import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, BookOpen, Target, Brain, Lightbulb, Code, 
  CheckCircle, Clock, Download, Eye, EyeOff, ChevronDown,
  ChevronUp, Trophy, Play, FileText, Circle, BookMarked,
  Video, Award, ExternalLink
} from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';
import { comprehensiveLessonsContent, getLessonSpecificKeywords } from '../data/comprehensiveLessonsContent';
import { getMinimumRealWorldExamples } from '../data/realWorldExamples';
import { getChallengesForLesson } from '../data/lessonChallenges';
import { getLessonVideo } from '../data/lessonVideos';

interface ReadingContentPageProps {
  moduleId: string;
  lessonId: string;
  lessonTitle: string;
  lessonContent: any;
  onBack: () => void;
}

export function ReadingContentPage({ 
  moduleId, 
  lessonId, 
  lessonTitle,
  lessonContent,
  onBack 
}: ReadingContentPageProps) {
  const [expandedSection, setExpandedSection] = useState<number>(1);
  const [highlightEnabled, setHighlightEnabled] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Construct the comprehensive lesson content key
  const comprehensiveLessonKey = `${moduleId}-${lessonId}`;
  
  // Get comprehensive content
  const comprehensiveContent = comprehensiveLessonsContent[comprehensiveLessonKey];
  const realWorldExamples = getMinimumRealWorldExamples(comprehensiveLessonKey);
  const challenges = getChallengesForLesson(comprehensiveLessonKey);
  const lessonVideo = getLessonVideo(comprehensiveLessonKey);

  // Learning path sections
  const learningSections = [
    { 
      id: 1, 
      title: 'Introduction & Objectives', 
      duration: '3 min', 
      type: 'video' as const,
      icon: Play,
      color: 'bg-purple-500'
    },
    { 
      id: 2, 
      title: 'Core Concepts Explained', 
      duration: '8 min', 
      type: 'content' as const,
      icon: FileText,
      color: 'bg-blue-500'
    },
    { 
      id: 3, 
      title: 'Real-World Examples', 
      duration: '5 min', 
      type: 'examples' as const,
      icon: Lightbulb,
      color: 'bg-yellow-500'
    },
    { 
      id: 4, 
      title: 'Hands-On Practice', 
      duration: '10 min', 
      type: 'practice' as const,
      icon: Code,
      color: 'bg-green-500'
    },
    {
      id: 5,
      title: 'Summary & Next Steps',
      duration: '2 min',
      type: 'summary' as const,
      icon: Trophy,
      color: 'bg-purple-500'
    }
  ];

  // Helper function to highlight text
  const HighlightedText = ({ text, enabled }: { text: string; enabled: boolean }) => {
    if (!enabled || !text) {
      return <>{text}</>;
    }

    const lessonKeywords = getLessonSpecificKeywords(comprehensiveLessonKey) || [];
    const generalKeywords = [
      'class', 'object', 'method', 'variable', 'OOP', 'Java', 'encapsulation',
      'inheritance', 'polymorphism', 'abstraction', 'interface', 'public',
      'private', 'protected', 'static', 'void', 'extends', 'implements',
      'constructor', 'package', 'import', 'new', 'this', 'super', 'final'
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
                className="bg-yellow-200 text-gray-900 px-1 rounded font-semibold transition-all duration-200"
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

  // Toggle highlight functionality
  const toggleHighlight = () => {
    setHighlightEnabled(!highlightEnabled);
    if (!highlightEnabled) {
      toast.success('Key Terms Highlighted', {
        description: 'Important programming terms are now highlighted',
        duration: 2000
      });
    } else {
      toast.info('Highlighting Disabled', {
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
        const introText = comprehensiveContent?.introduction || lessonContent.introduction || 'Learn the fundamentals of object-oriented programming in Java.';
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
        
        (comprehensiveContent?.keyConcepts || lessonContent.keyConcepts || []).forEach((concept: string, idx: number) => {
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

  const renderSectionContent = (sectionId: number) => {
    switch(sectionId) {
      case 1: // Introduction & Objectives
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
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
                  text={comprehensiveContent?.introduction || lessonContent.introduction || 'Welcome to this lesson on object-oriented programming in Java.'} 
                  enabled={highlightEnabled} 
                />
              </p>
            </div>
          </div>
        );

      case 2: // Core Concepts Explained
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-600" />
                Core Concepts Explained
              </h3>
              
              <div className="space-y-4">
                {(comprehensiveContent?.keyConcepts || lessonContent.keyConcepts || []).map((concept: string, idx: number) => (
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

              {comprehensiveContent?.detailedExplanation && (
                <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                    <Lightbulb className="w-6 h-6 text-yellow-600" />
                    In-Depth Explanation
                  </h4>
                  <div className="prose prose-sm max-w-none">
                    <div className="text-gray-800 leading-relaxed space-y-4">
                      {comprehensiveContent.detailedExplanation
                        .split('\n\n')
                        .map((paragraph, idx) => {
                          if (paragraph.trim().endsWith(':') && paragraph.trim().split('\n').length === 1) {
                            return (
                              <h5 key={idx} className="font-bold text-blue-900 text-base mt-6 mb-3 flex items-center gap-2">
                                <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                                {paragraph.trim()}
                              </h5>
                            );
                          }
                          
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

              {/* Code Examples */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-green-600" />
                  Code Examples
                </h4>
                
                <div className="space-y-4">
                  {(comprehensiveContent?.codeExamples || lessonContent.codeExamples || [
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
        );

      case 3: // Real-World Examples
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-600" />
                Real-World Examples
              </h3>
              
              <div className="space-y-6">
                {realWorldExamples.map((example, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-200">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">{example.title}</h4>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          <HighlightedText text={example.description} enabled={highlightEnabled} />
                        </p>
                        
                        {example.implementation && (
                          <div className="bg-white p-4 rounded-lg border border-yellow-300 mt-4">
                            <p className="text-sm font-semibold text-yellow-800 mb-2">💡 Implementation:</p>
                            <p className="text-sm text-gray-700">
                              <HighlightedText text={example.implementation} enabled={highlightEnabled} />
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4: // Hands-On Practice
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Code className="w-6 h-6 text-green-600" />
                Hands-On Practice
              </h3>
              
              <div className="space-y-6">
                {challenges.map((challenge, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {idx + 1}
                        </div>
                        <Badge className={`mt-2 ${
                          challenge.difficulty === 'Easy' ? 'bg-green-500' :
                          challenge.difficulty === 'Medium' ? 'bg-yellow-500' :
                          'bg-red-500'
                        } text-white`}>
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">{challenge.title}</h4>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          <HighlightedText text={challenge.description} enabled={highlightEnabled} />
                        </p>
                        
                        {challenge.hint && (
                          <div className="bg-white p-4 rounded-lg border border-green-300 mt-4">
                            <p className="text-sm font-semibold text-green-800 mb-2">💡 Hint:</p>
                            <p className="text-sm text-gray-700">{challenge.hint}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5: // Summary & Next Steps
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-purple-600" />
                Summary & Next Steps
              </h3>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border-2 border-purple-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    What You've Learned
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Core concepts and principles of {lessonTitle}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Practical applications and real-world examples</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Best practices and coding standards</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Problem-solving techniques and patterns</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Next Steps
                  </h4>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        1
                      </div>
                      <span>Practice the coding exercises to reinforce your learning</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        2
                      </div>
                      <span>Complete the interactive quiz to test your knowledge</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        3
                      </div>
                      <span>Move on to the next lesson to continue your learning journey</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Lesson
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Reading Content
              </h1>
              <p className="text-gray-600 mt-1">{lessonTitle}</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <BookOpen className="w-3 h-3 mr-1" />
            Interactive Reading
          </Badge>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Current Section Indicator */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="bg-white/20 text-white mb-2">
                    Section {expandedSection} of {learningSections.length}
                  </Badge>
                  <h2 className="text-2xl font-bold">
                    {learningSections[expandedSection - 1].title}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/80">Estimated Time</p>
                  <p className="text-xl font-bold flex items-center gap-2 justify-end">
                    <Clock className="w-5 h-5" />
                    {learningSections[expandedSection - 1].duration}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section Content */}
          <div ref={contentRef}>
            {renderSectionContent(expandedSection)}
          </div>

          {/* Navigation Buttons */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                <Button
                  onClick={() => setExpandedSection(Math.max(1, expandedSection - 1))}
                  disabled={expandedSection === 1}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ChevronDown className="w-4 h-4 rotate-90" />
                  Previous Section
                </Button>
                
                <div className="flex items-center gap-2">
                  {learningSections.map((_, idx) => (
                    <button
                      key={idx + 1}
                      onClick={() => setExpandedSection(idx + 1)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        expandedSection === idx + 1
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 w-8'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to section ${idx + 1}`}
                    />
                  ))}
                </div>

                <Button
                  onClick={() => setExpandedSection(Math.min(learningSections.length, expandedSection + 1))}
                  disabled={expandedSection === learningSections.length}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex items-center gap-2"
                >
                  Next Section
                  <ChevronDown className="w-4 h-4 -rotate-90" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={toggleHighlight}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {highlightEnabled ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Disable Highlight
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Highlight Key Terms
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleDownloadPDF}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
                <Button
                  onClick={onBack}
                  className="ml-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}