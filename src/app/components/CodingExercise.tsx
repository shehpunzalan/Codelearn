import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Activity, Submission, CodeError } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Play, CheckCircle, XCircle, Brain, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { neuralNetwork } from '../utils/neuralNetwork';
import { ScrollArea } from './ui/scroll-area';

interface CodingExerciseProps {
  activity: Activity;
  onBack: () => void;
}

export function CodingExercise({ activity, onBack }: CodingExerciseProps) {
  const [code, setCode] = useState(activity.starterCode || '');
  const [isRunning, setIsRunning] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [successPrediction, setSuccessPrediction] = useState<number>(0);

  useEffect(() => {
    // Simulate success prediction
    const prediction = neuralNetwork.predictSuccess(code, 10);
    setSuccessPrediction(prediction);
  }, [code]);

  const handleRunCode = () => {
    setIsRunning(true);

    setTimeout(() => {
      const errors = neuralNetwork.analyzeCode(code);
      const hasErrors = errors.some(e => e.severity === 'error');
      
      const newSubmission: Submission = {
        id: Date.now().toString(),
        activityId: activity.id,
        userId: 'student1',
        code,
        timestamp: new Date(),
        status: hasErrors ? 'error' : 'pass',
        errors,
        patterns: errors.map(e => e.pattern).filter(Boolean) as string[]
      };

      newSubmission.feedback = neuralNetwork.generateFeedback(newSubmission);
      
      setSubmission(newSubmission);
      setIsRunning(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div>
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Module
        </Button>
        
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl mb-2">{activity.title}</h1>
            <p className="text-gray-600">{activity.description}</p>
          </div>
          <Badge variant="outline">
            <Brain className="w-3 h-3 mr-1" />
            AI Assisted
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Code Editor</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Success Prediction: 
                  <span className={`ml-2 ${successPrediction > 70 ? 'text-green-600' : successPrediction > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {successPrediction}%
                  </span>
                </span>
                <Button onClick={handleRunCode} disabled={isRunning}>
                  <Play className="w-4 h-4 mr-2" />
                  {isRunning ? 'Running...' : 'Run Code'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Editor
                height="400px"
                defaultLanguage="javascript"
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-light"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm mb-2">Expected Output:</h4>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                {activity.expectedOutput}
              </code>
            </div>
            
            {activity.testCases && activity.testCases.length > 0 && (
              <div>
                <h4 className="text-sm mb-2">Test Cases:</h4>
                <div className="space-y-2">
                  {activity.testCases.map((testCase, idx) => (
                    <div key={idx} className="bg-gray-50 p-2 rounded text-sm">
                      <div>Input: <code>{testCase.input}</code></div>
                      <div>Expected: <code>{testCase.expectedOutput}</code></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </CardContent>
        </Card>
      </div>

      {submission && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {submission.status === 'pass' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              Submission Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="feedback">
              <TabsList>
                <TabsTrigger value="feedback">AI Feedback</TabsTrigger>
                <TabsTrigger value="errors">
                  Error Analysis
                  {submission.errors && submission.errors.length > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {submission.errors.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="patterns">Patterns Detected</TabsTrigger>
              </TabsList>

              <TabsContent value="feedback" className="space-y-4">
                <Alert>
                  <Brain className="h-4 w-4" />
                  <AlertDescription className="whitespace-pre-line">
                    {submission.feedback}
                  </AlertDescription>
                </Alert>
                
                {submission.status === 'pass' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="text-sm mb-2">🎉 Great job!</h4>
                    <p className="text-sm text-gray-700">
                      Your code passed all test cases. The neural network has analyzed your coding patterns and will use this to provide personalized challenges.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="errors">
                {submission.errors && submission.errors.length > 0 ? (
                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {submission.errors.map((error, idx) => (
                        <Alert key={idx} variant={error.severity === 'error' ? 'destructive' : 'default'}>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            <div className="font-medium">Line {error.line}: {error.pattern}</div>
                            <div className="text-sm mt-1">{error.message}</div>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No errors detected! Your code looks good.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="patterns">
                {submission.patterns && submission.patterns.length > 0 ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm mb-2">Detected Patterns:</h4>
                      <div className="flex flex-wrap gap-2">
                        {submission.patterns.map((pattern, idx) => (
                          <Badge key={idx} variant="outline">
                            {pattern}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="text-sm mb-2">💡 Tailored Challenge:</h4>
                      <p className="text-sm text-gray-700">
                        {neuralNetwork.generateTailoredChallenge(submission.patterns)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No specific patterns detected in this submission.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
