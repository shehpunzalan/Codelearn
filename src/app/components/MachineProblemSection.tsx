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

interface CodeRequirement {
  id: string;
  label: string;
  check: (code: string) => boolean;
}

// Build requirement checklist from problem instructions + general Java OOP expectations
function buildRequirements(instructions: string): CodeRequirement[] {
  const instr = instructions.toLowerCase();
  const reqs: CodeRequirement[] = [];

  reqs.push({ id: 'class', label: 'Define a class', check: c => /class\s+\w+/.test(c) });
  reqs.push({ id: 'main', label: 'Has a main() method', check: c => c.includes('public static void main') });

  if (instr.includes('constructor')) {
    reqs.push({ id: 'constructor', label: 'Has a constructor', check: c => /\w+\s*\([^)]*\)\s*\{/.test(c) && !/static\s+void\s+main/.test(c.split('(')[0]) });
  }
  if (instr.includes('private') || instr.includes('encapsulat')) {
    reqs.push({ id: 'private', label: 'Uses private fields (encapsulation)', check: c => /private\s+\w+/.test(c) });
  }
  if (instr.includes('getter') || instr.includes('get method') || instr.includes('getters')) {
    reqs.push({ id: 'getter', label: 'Has getter methods', check: c => /public\s+\w+\s+get[A-Z]/.test(c) });
  }
  if (instr.includes('setter') || instr.includes('set method') || instr.includes('setters')) {
    reqs.push({ id: 'setter', label: 'Has setter methods', check: c => /public\s+void\s+set[A-Z]/.test(c) });
  }
  if (instr.includes('extend') || instr.includes('inherit')) {
    reqs.push({ id: 'extends', label: 'Uses inheritance (extends)', check: c => /extends\s+\w+/.test(c) });
  }
  if (instr.includes('interface') || instr.includes('implement')) {
    reqs.push({ id: 'implements', label: 'Implements an interface', check: c => /implements\s+\w+/.test(c) });
  }
  if (instr.includes('override') || instr.includes('polymorphism')) {
    reqs.push({ id: 'override', label: 'Overrides a method (@Override)', check: c => c.includes('@Override') });
  }
  if (instr.includes('abstract')) {
    reqs.push({ id: 'abstract', label: 'Uses abstract class or method', check: c => /abstract\s+(class|\w+)/.test(c) });
  }
  if (instr.includes('print') || instr.includes('output') || instr.includes('display')) {
    reqs.push({ id: 'print', label: 'Prints output (System.out.print)', check: c => c.includes('System.out.print') });
  }
  if (instr.includes('array') || instr.includes('list') || instr.includes('collection')) {
    reqs.push({ id: 'array', label: 'Uses array or collection', check: c => /\[\]|ArrayList|List<|HashMap|Set</.test(c) });
  }
  if (instr.includes('loop') || instr.includes('for ') || instr.includes('while') || instr.includes('iterate')) {
    reqs.push({ id: 'loop', label: 'Has a loop (for / while)', check: c => /\bfor\s*\(|\bwhile\s*\(/.test(c) });
  }
  if (instr.includes('comment') || instr.includes('document')) {
    reqs.push({ id: 'comment', label: 'Has code comments', check: c => c.includes('//') || c.includes('/*') });
  }
  // Always require closing brace / valid structure
  reqs.push({ id: 'braces', label: 'Has balanced braces { }', check: c => {
    let depth = 0;
    for (const ch of c) { if (ch === '{') depth++; else if (ch === '}') depth--; }
    return depth === 0 && c.includes('{');
  }});

  return reqs;
}

/** Strip instructional comment lines (// TODO:, // Write, // Add, etc.) from starter code. */
function stripStarterComments(code: string): string {
  return code
    .split('\n')
    .filter(line => !/^\s*\/\/\s*(TODO|FIXME|Write|Add|Your|Enter|Replace|Start|Begin|Use|Create|Declare|Implement|Override|Note:|Hint|e\.g\.)/.test(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
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
  const [requirements, setRequirements] = useState<CodeRequirement[]>([]);
  const [showReward, setShowReward] = useState(false);
  const [rewardDismissed, setRewardDismissed] = useState(false);

  // Detect when all requirements become met and show reward
  const allMet = requirements.length > 0 && requirements.every(r => r.check(code));
  const prevAllMetRef = React.useRef(false);
  React.useEffect(() => {
    if (allMet && !prevAllMetRef.current && !rewardDismissed) {
      setShowReward(true);
      toast.success('🏆 All objectives completed!', { description: 'Great work — you met every requirement!', duration: 4000 });
    }
    prevAllMetRef.current = allMet;
  }, [allMet, rewardDismissed]);

  useEffect(() => {
    loadMachineProblem();
  }, [moduleId, lessonId]);

  const loadMachineProblem = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/machine-problem/${moduleId}/${lessonId}`,
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
        setCode(stripStarterComments(data.data.starterCode || ''));
        setRequirements(buildRequirements(data.data.instructions || ''));
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
        `https://${projectId}.supabase.co/functions/v1/server/execute-code`,
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
        `https://${projectId}.supabase.co/functions/v1/server/verify-code`,
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
      {/* Gamified Reward Overlay */}
      {showReward && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}>
          <div style={{ background: 'var(--card)', borderRadius: 'var(--radius-xl)', padding: '2.5rem 2rem', maxWidth: 400, width: '90%', textAlign: 'center', boxShadow: 'var(--shadow-xl)', border: '2px solid var(--border)', fontFamily: 'var(--font-sans)' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 8px 24px rgba(37,99,235,0.3)' }}>
              <span style={{ fontSize: '2rem', lineHeight: 1 }}>🏆</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', margin: '0 0 0.4rem' }}>All Objectives Met!</h2>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', margin: '0 0 1.5rem', lineHeight: 1.5 }}>
              Your code satisfies every required objective. Submit it to earn your points!
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', background: 'var(--accent)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '0.9rem 1rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{requirements.length}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', marginTop: 2 }}>Objectives</div>
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>100%</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', marginTop: 2 }}>Complete</div>
              </div>
              {problem && (
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary)' }}>{problem.points}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', marginTop: 2 }}>Points</div>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => { setShowReward(false); setRewardDismissed(true); handleSubmit(); }}
                style={{ flex: 1, padding: '0.75rem 1rem', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
              >
                Submit & Claim Points
              </button>
              <button
                onClick={() => { setShowReward(false); setRewardDismissed(true); }}
                style={{ padding: '0.75rem 1.1rem', background: 'transparent', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--muted-foreground)', fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
              >
                Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Real-time Requirements Checklist */}
      {requirements.length > 0 && (
        <Card className="border-0 shadow-md bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="w-5 h-5 text-indigo-600" />
              Code Requirements — checked in real time as you type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {requirements.map(req => {
                const met = req.check(code);
                return (
                  <div
                    key={req.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.6rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-md, 8px)',
                      background: met ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.07)',
                      border: `1.5px solid ${met ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.25)'}`,
                      transition: 'all 0.2s',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    {met
                      ? <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                    <span style={{ fontSize: '0.82rem', fontWeight: 500, color: met ? 'rgb(21,128,61)' : 'rgb(153,27,27)' }}>
                      {req.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-3 italic">
              ✅ = Your code meets this requirement &nbsp;|&nbsp; ❌ = Still missing — keep coding!
            </p>
          </CardContent>
        </Card>
      )}

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
                onClick={() => setCode(stripStarterComments(problem.starterCode || ''))}
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