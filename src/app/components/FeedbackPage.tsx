import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Brain, ThumbsUp, AlertCircle, Code, Clock, CheckCircle, XCircle, Sparkles, TrendingUp, FileText, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface SubmissionData {
  code: string;
  timestamp: string;
  lessonId: string;
  moduleId: string;
  score: number;
  feedback: {
    oopPrinciples: string[];
    errors: string[];
    suggestions: string[];
    codeQuality: number;
  };
}

interface FeedbackPageProps {
  onBack?: () => void;
  onReturnToLesson?: () => void;
}

export function FeedbackPage({ onBack, onReturnToLesson }: FeedbackPageProps) {
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionData | null>(null);

  useEffect(() => {
    // Load all submissions from localStorage
    const allSubmissions = JSON.parse(localStorage.getItem('allSubmissions') || '[]');
    setSubmissions(allSubmissions);
    if (allSubmissions.length > 0) {
      setSelectedSubmission(allSubmissions[0]); // Select most recent
    }
  }, []);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getQualityLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  if (submissions.length === 0) {
    return (
      <div className="space-y-6" style={{ fontFamily: 'var(--font-sans)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain style={{ width: 22, height: 22, color: 'white' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', margin: 0, fontFamily: 'var(--font-sans)' }}>AI-Generated Feedback</h1>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem', margin: 0, fontFamily: 'var(--font-sans)' }}>Review neural network analysis of your Java OOP submissions</p>
            </div>
          </div>
          {onReturnToLesson && (
            <button
              onClick={onReturnToLesson}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', border: 'none', borderRadius: 'var(--radius-md)', color: 'white', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
            >
              <ArrowLeft style={{ width: 15, height: 15 }} />
              Return to Lesson
            </button>
          )}
        </div>

        <Card className="border-0 shadow-md">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <Brain className="w-24 h-24 text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Submissions Yet</h2>
            <p className="text-gray-600 mb-6 max-w-md">
              Complete a practice exercise in any learning module and submit your code to see AI-powered feedback here.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 max-w-md">
              <p className="text-sm font-semibold text-blue-900 mb-2">What you'll get:</p>
              <ul className="text-xs text-blue-700 space-y-1.5 text-left">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>OOP Principles Analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>Code Quality Scoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>Error Detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>Improvement Suggestions</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ fontFamily: 'var(--font-sans)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain style={{ width: 22, height: 22, color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', margin: 0, fontFamily: 'var(--font-sans)' }}>AI-Generated Feedback</h1>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem', margin: 0, fontFamily: 'var(--font-sans)' }}>Review neural network analysis of your Java OOP submissions</p>
          </div>
        </div>
        {onReturnToLesson && (
          <button
            onClick={onReturnToLesson}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', border: 'none', borderRadius: 'var(--radius-md)', color: 'white', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
          >
            <ArrowLeft style={{ width: 15, height: 15 }} />
            Return to Lesson
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Submissions History Sidebar */}
        <Card className="border-0 shadow-md lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-lg text-gray-900">Recent Submissions</h2>
            </div>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-2">
                {submissions.map((submission, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSubmission(submission)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedSubmission === submission
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        Module {submission.moduleId?.replace('mod', '') || 'N/A'}
                      </Badge>
                      <span className={`text-xs font-bold ${getQualityColor(submission.score)}`}>
                        {submission.score}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Lesson {submission.lessonId?.replace('lesson', '') || 'N/A'}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(submission.timestamp).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Detailed Feedback */}
        <div className="lg:col-span-3 space-y-6">
          {selectedSubmission && (
            <>
              {/* Score Card */}
              <Card className="border-0 shadow-md bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className="bg-blue-200 text-gray-900 mb-2">
                        Module {selectedSubmission.moduleId?.replace('mod', '') || 'N/A'} - Lesson {selectedSubmission.lessonId?.replace('lesson', '') || 'N/A'}
                      </Badge>
                      <h2 className="text-2xl font-bold mb-1 text-gray-900">AI Analysis Results</h2>
                      <p className="text-gray-900 text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        {formatDate(selectedSubmission.timestamp)}
                      </p>
                    </div>
                    <div className="bg-white border-2 border-blue-600 rounded-full px-6 py-3 text-center">
                      <p className="text-3xl font-bold text-gray-900">{selectedSubmission.score}%</p>
                      <p className="text-xs font-medium text-gray-900">{getQualityLabel(selectedSubmission.score)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quality Score Bar */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className={`w-5 h-5 ${getQualityColor(selectedSubmission.score)}`} />
                      <h3 className="text-lg font-bold text-gray-900">Code Quality Score</h3>
                    </div>
                    <span className={`font-bold text-xl ${getQualityColor(selectedSubmission.score)}`}>
                      {selectedSubmission.score}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all ${getQualityBgColor(selectedSubmission.score)}`}
                      style={{ width: `${selectedSubmission.score}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedSubmission.score >= 80 ? 'Excellent work! Your code demonstrates strong OOP principles.' :
                     selectedSubmission.score >= 60 ? 'Good effort! Review the suggestions below to improve your code.' :
                     'Keep practicing! Focus on the fundamental concepts and try again.'}
                  </p>
                </CardContent>
              </Card>

              {/* Neural Network Summary */}
              <Card className="border-0 shadow-md bg-purple-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-bold text-gray-900">Neural Network Analysis</h3>
                  </div>
                  <p className="text-gray-700">
                    Our AI-powered neural network has analyzed your Java code for OOP principles, design patterns, 
                    code quality, and best practices. The analysis includes encapsulation, inheritance, polymorphism, 
                    and abstraction detection.
                  </p>
                </CardContent>
              </Card>

              {/* Detailed Feedback Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* OOP Principles */}
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h3 className="text-lg font-bold text-gray-900">OOP Principles Detected</h3>
                    </div>
                    <ul className="space-y-2">
                      {(selectedSubmission.feedback.oopPrinciples || []).map((principle, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span className="text-gray-700 text-sm">{principle}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Suggestions */}
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-bold text-gray-900">Improvement Suggestions</h3>
                    </div>
                    <ul className="space-y-2">
                      {(selectedSubmission.feedback.suggestions || []).map((suggestion, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">→</span>
                          <span className="text-gray-700 text-sm">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Errors (if any) */}
                {selectedSubmission.feedback.errors && selectedSubmission.feedback.errors.length > 0 && (
                  <Card className="border-0 shadow-md md:col-span-2">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <h3 className="text-lg font-bold text-gray-900">Issues to Address</h3>
                      </div>
                      <ul className="space-y-2">
                        {(selectedSubmission.feedback.errors || []).map((error, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-red-600 mt-1">✗</span>
                            <span className="text-gray-700 text-sm">{error}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Submitted Code */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Code className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">Your Submitted Code</h3>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <pre className="bg-gray-900 text-gray-100 p-6 overflow-x-auto text-sm">
                      <code>{selectedSubmission.code}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {/* AI Features Info */}
              <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-purple-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-bold text-gray-900">Neural Network Capabilities</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">OOP Pattern Recognition</p>
                        <p className="text-xs text-gray-600">Detects encapsulation, inheritance, polymorphism, abstraction</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Code Quality Analysis</p>
                        <p className="text-xs text-gray-600">Evaluates structure, formatting, and best practices</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Error Detection</p>
                        <p className="text-xs text-gray-600">Identifies syntax issues and logic problems</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Plagiarism Prevention</p>
                        <p className="text-xs text-gray-600">Compares against known code patterns</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}