import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Brain, CheckCircle, XCircle, AlertTriangle, TrendingUp,
  Code, FileText, Award, Target, Lightbulb, ArrowLeft,
  BarChart3, Zap, Shield, BookOpen
} from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface AIFeedbackPageProps {
  userId: string;
  onBack: () => void;
}

export function AIFeedbackPage({ userId, onBack }: AIFeedbackPageProps) {
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAIFeedback();
  }, [userId]);

  const fetchAIFeedback = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-aaa3a86f/ai-feedback/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setFeedbackList(data.data || []);
        if (data.data && data.data.length > 0) {
          setSelectedFeedback(data.data[0]);
        }
      } else {
        toast.error('Failed to load feedback');
      }
    } catch (error) {
      console.error('Error fetching AI feedback:', error);
      toast.error('Error loading feedback');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return '🌟 Excellent!';
    if (score >= 70) return '👍 Good Job!';
    if (score >= 50) return '📚 Keep Learning!';
    return '💪 Keep Trying!';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Brain className="w-16 h-16 text-purple-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading AI feedback...</p>
        </div>
      </div>
    );
  }

  if (feedbackList.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Button variant="outline" onClick={onBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-16 h-16 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">No Submissions Yet</h2>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                Complete a practice exercise in any learning module and submit your code to see AI-powered feedback here.
              </p>

              <Card className="bg-blue-50 border-2 border-blue-200 max-w-lg mx-auto">
                <CardHeader>
                  <CardTitle className="text-lg">What you'll get:</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">OOP Principles Analysis</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">Code Quality Scoring</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">Error Detection</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">Improvement Suggestions</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Brain className="w-8 h-8 text-purple-600" />
                AI-Generated Feedback
              </h1>
              <p className="text-gray-600 mt-1">
                Review neural network analysis of your Java OOP submissions
              </p>
            </div>
          </div>
          <Badge className="bg-purple-600 text-white px-4 py-2">
            CCS108
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feedback List Sidebar */}
          <Card className="border-0 shadow-lg lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Submission History</CardTitle>
              <CardDescription>{feedbackList.length} submissions analyzed</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-3">
                  {feedbackList.map((feedback, idx) => (
                    <button
                      key={feedback.id}
                      onClick={() => setSelectedFeedback(feedback)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedFeedback?.id === feedback.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">
                            Module {feedback.moduleId} - Lesson {feedback.lessonId}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(feedback.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getScoreColor(feedback.score || 0)}>
                          {feedback.score || 0}/100
                        </Badge>
                      </div>
                      {feedback.analysis?.oopPrinciples && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {feedback.analysis.oopPrinciples
                            .filter((p: any) => p.detected)
                            .slice(0, 2)
                            .map((principle: any, i: number) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-xs"
                              >
                                ✓ {principle.principle}
                              </Badge>
                            ))}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Detailed Feedback View */}
          {selectedFeedback && (
            <div className="lg:col-span-2 space-y-6">
              {/* Score Overview */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">
                        {getScoreMessage(selectedFeedback.score || 0)}
                      </h2>
                      <p className="text-purple-100">
                        Submitted on {new Date(selectedFeedback.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-5xl font-bold">{selectedFeedback.score || 0}</div>
                      <p className="text-sm text-purple-100">/ 100</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* OOP Principles Detection */}
              {selectedFeedback.analysis?.oopPrinciples && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      OOP Principles Detection
                    </CardTitle>
                    <CardDescription>
                      Neural network pattern recognition results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedFeedback.analysis.oopPrinciples.map((principle: any, idx: number) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-lg border-2 ${
                            principle.detected
                              ? 'border-green-300 bg-green-50'
                              : 'border-yellow-300 bg-yellow-50'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {principle.detected ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <XCircle className="w-5 h-5 text-yellow-600" />
                              )}
                              <h4 className="font-semibold text-gray-900">
                                {principle.principle}
                              </h4>
                            </div>
                            <Badge
                              className={
                                principle.detected
                                  ? 'bg-green-600 text-white'
                                  : 'bg-yellow-600 text-white'
                              }
                            >
                              {principle.confidence}% confidence
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            {principle.evidence}
                          </p>
                          {!principle.detected && principle.suggestion && (
                            <div className="bg-white rounded p-3 border-l-4 border-yellow-500">
                              <p className="text-sm text-gray-700">
                                <strong>💡 Suggestion:</strong> {principle.suggestion}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Code Quality Analysis */}
              {selectedFeedback.analysis?.codeQuality && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      Code Quality Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedFeedback.analysis.codeQuality.map((issue: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-3 bg-orange-50 border-l-4 border-orange-500 rounded"
                        >
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {issue.category}
                              </p>
                              <p className="text-sm text-gray-700">{issue.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Strengths */}
              {selectedFeedback.analysis?.strengths && selectedFeedback.analysis.strengths.length > 0 && (
                <Card className="border-0 shadow-lg bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-green-600" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedFeedback.analysis.strengths.map((strength: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                          <p className="text-sm text-gray-700">{strength.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Errors Detected */}
              {selectedFeedback.analysis?.errors && selectedFeedback.analysis.errors.length > 0 && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-red-600" />
                      Detected Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedFeedback.analysis.errors.map((error: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 bg-red-50 border-l-4 border-red-500 rounded"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-red-900">{error.type}</h4>
                            <Badge className="bg-red-600 text-white">
                              {error.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{error.message}</p>
                          {error.fix && (
                            <div className="bg-white rounded p-2 border border-red-200">
                              <p className="text-xs text-gray-600">
                                <strong>Fix:</strong> {error.fix}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Improvement Suggestions */}
              {selectedFeedback.analysis?.suggestions && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      Improvement Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedFeedback.analysis.suggestions.map((suggestion: any, idx: number) => (
                        <div key={idx} className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                          <div className="flex items-start gap-3 mb-3">
                            <Badge className={
                              suggestion.priority === 'high' ? 'bg-red-600' :
                              suggestion.priority === 'medium' ? 'bg-orange-600' :
                              'bg-blue-600'
                            }>
                              {suggestion.priority} priority
                            </Badge>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">
                                {suggestion.title}
                              </h4>
                              <p className="text-sm text-gray-700">{suggestion.description}</p>
                            </div>
                          </div>
                          {suggestion.actionItems && suggestion.actionItems.length > 0 && (
                            <div className="bg-white rounded p-3 border border-yellow-300">
                              <p className="text-sm font-medium text-gray-900 mb-2">Action Items:</p>
                              <ul className="space-y-1">
                                {suggestion.actionItems.map((item: string, i: number) => (
                                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                    <span className="text-yellow-600">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submitted Code */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-gray-600" />
                    Submitted Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <pre className="text-sm text-green-400 overflow-x-auto">
                      <code>{selectedFeedback.code}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {/* Full Feedback Message */}
              {selectedFeedback.feedbackMessage && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      Detailed Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm leading-relaxed">
                        {selectedFeedback.feedbackMessage}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
