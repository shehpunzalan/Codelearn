import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Play, CheckCircle, XCircle, AlertCircle, Code, 
  Trophy, RefreshCw, Eye, Clock, Award, Zap, TrendingUp,
  Lightbulb, Video
} from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from './ui/scroll-area';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface MachineProblemProps {
  moduleId: string;
  lessonId: string;
  userId: string;
}

interface MachineProblem {
  id: string;
  title: string;
  description: string;
  instructions: string;
  starterCode: string;
  expectedOutput: string;
  difficulty: string;
  points: number;
  videoUrl?: string;
}

interface VerificationResult {
  isCorrect: boolean;
  similarity: number;
  executionResult: {
    output: string;
    error: string | null;
    success: boolean;
    executionTime: number;
  };
  codeAnalysis: {
    score: number;
    oopScores: {
      encapsulation: number;
      inheritance: number;
      polymorphism: number;
      abstraction: number;
    };
    patterns: string[];
    errors: any[];
  };
  feedback: string;
}

export function MachineProblemSection({ moduleId, lessonId, userId }: MachineProblemProps) {
  const [problem, setProblem] = useState<MachineProblem | null>(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [showOutput, setShowOutput] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showVideoTutorial, setShowVideoTutorial] = useState(true);

  useEffect(() => {
    loadMachineProblem();
  }, [moduleId, lessonId]);

  const loadMachineProblem = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-aaa3a86f/machine-problem/${moduleId}/${lessonId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      if (data.success && data.data) {
        setProblem(data.data);
        setCode(data.data.starterCode);
      }
    } catch (error) {
      console.error('Error loading machine problem:', error);
      toast.error('Failed to load machine problem');
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setShowOutput(true);
    setVerificationResult(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-aaa3a86f/execute-code`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            code,
            userId,
            moduleId,
            lessonId
          })
        }
      );

      const data = await response.json();
      if (data.success && data.data) {
        setOutput(data.data.output || '');
        if (data.data.error) {
          toast.error(`Execution Error: ${data.data.error}`);
        } else {
          toast.success('Code executed successfully!');
        }
      }
    } catch (error) {
      console.error('Error executing code:', error);
      toast.error('Failed to execute code');
      setOutput('Error executing code. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem) return;

    setIsSubmitting(true);
    setAttempts(prev => prev + 1);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-aaa3a86f/verify-code`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            code,
            expectedOutput: problem.expectedOutput,
            userId,
            moduleId,
            lessonId,
            problemId: problem.id
          })
        }
      );

      const data = await response.json();
      if (data.success && data.data) {
        setVerificationResult(data.data);
        setOutput(data.data.executionResult.output);
        setShowOutput(true);

        if (data.data.isCorrect) {
          toast.success('🎉 Correct! Well done!');
        } else {
          toast.error('Not quite right. Review the feedback and try again.');
        }
      }
    } catch (error) {
      console.error('Error submitting code:', error);
      toast.error('Failed to submit code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}ms`;
  };

  if (!problem) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading machine problem...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tutorial Video Section */}
      {showVideoTutorial && problem.videoUrl && (
        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-purple-600" />
                <CardTitle className="text-lg">Tutorial Video</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVideoTutorial(false)}
              >
                Hide
              </Button>
            </div>
            <CardDescription>Watch this tutorial before attempting the problem</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={problem.videoUrl}
                title="Coding Tutorial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tutorial Video Button if Hidden */}
      {!showVideoTutorial && problem.videoUrl && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <Button
              onClick={() => setShowVideoTutorial(true)}
              variant="outline"
              className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              <Video className="w-4 h-4 mr-2" />
              Show Tutorial Video
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Problem Description */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-yellow-600" />
              <div>
                <CardTitle className="text-xl">{problem.title}</CardTitle>
                <CardDescription className="mt-1">{problem.description}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={
                problem.difficulty === 'Beginner' ? 'bg-green-500' :
                problem.difficulty === 'Intermediate' ? 'bg-yellow-500' :
                'bg-red-500'
              }>
                {problem.difficulty}
              </Badge>
              <Badge variant="outline" className="border-purple-300 text-purple-700">
                <Award className="w-3 h-3 mr-1" />
                {problem.points} Points
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              Instructions
            </h4>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {problem.instructions}
              </pre>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Code className="w-4 h-4" />
            <span>Attempts: {attempts}</span>
            {verificationResult && (
              <>
                <span className="mx-2">•</span>
                <TrendingUp className="w-4 h-4" />
                <span>Similarity: {verificationResult.similarity}%</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Code Editor */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-600" />
              Code Editor
            </CardTitle>
            <div className="flex items-center gap-2">
              {!showVideoTutorial && problem.videoUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVideoTutorial(true)}
                >
                  <Video className="w-4 h-4 mr-2" />
                  Show Tutorial
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCode(problem.starterCode)}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Code
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Editor
              height="400px"
              defaultLanguage="java"
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                wordWrap: 'on'
              }}
            />
          </div>

          <div className="flex items-center gap-3 mt-4">
            <Button
              onClick={handleRunCode}
              disabled={isRunning || !code.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Code
                </>
              )}
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !code.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit for Verification
                </>
              )}
            </Button>

            {showOutput && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOutput(!showOutput)}
              >
                {showOutput ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Output & Results */}
      {showOutput && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Output & Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Code Output */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                Your Output
                {verificationResult && (
                  verificationResult.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )
                )}
              </h4>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                <pre className="whitespace-pre-wrap">{output || '(No output)'}</pre>
              </div>
            </div>

            {/* Expected Output */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                Expected Output
              </h4>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                  {problem.expectedOutput}
                </pre>
              </div>
            </div>

            {/* Verification Result */}
            {verificationResult && (
              <div className={`border-l-4 p-4 rounded ${
                verificationResult.isCorrect 
                  ? 'bg-green-50 border-green-400' 
                  : 'bg-red-50 border-red-400'
              }`}>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  {verificationResult.isCorrect ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Success!
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      Needs Improvement
                    </>
                  )}
                </h4>

                <div className="space-y-3">
                  {/* Feedback */}
                  <div>
                    <h5 className="font-medium text-gray-800 mb-1">Feedback:</h5>
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                      {verificationResult.feedback}
                    </pre>
                  </div>

                  {/* OOP Scores */}
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">OOP Principles:</h5>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(verificationResult.codeAnalysis.oopScores).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between bg-white p-2 rounded">
                          <span className="text-sm capitalize">{key}:</span>
                          <Badge className={value >= 70 ? 'bg-green-500' : value >= 40 ? 'bg-yellow-500' : 'bg-red-500'}>
                            {value}/100
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Design Patterns */}
                  {verificationResult.codeAnalysis.patterns.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-800 mb-1">Design Patterns Detected:</h5>
                      <div className="flex flex-wrap gap-2">
                        {verificationResult.codeAnalysis.patterns.map((pattern, idx) => (
                          <Badge key={idx} variant="outline" className="bg-purple-100 text-purple-700">
                            {pattern}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}