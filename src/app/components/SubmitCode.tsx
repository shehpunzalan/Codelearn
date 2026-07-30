import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Send, Brain, Code as CodeIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface SubmitCodeProps {
  onSubmitComplete: () => void;
}

export function SubmitCode({ onSubmitComplete }: SubmitCodeProps) {
  const [selectedModule, setSelectedModule] = useState('Module 2: Student Class Implementation');
  const [code, setCode] = useState(`public class Student {\n\n    public static void main(String[] args) {\n        \n    }\n\n}`);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitComplete();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Badge className="bg-blue-600 text-white px-3 py-1">CCS108</Badge>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Submit Java Code</h1>
          <p className="text-gray-600">Write your solution and get AI-powered OOP analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Code Editor */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CodeIcon className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-900">Java Code Editor</h2>
                </div>
                <Select value={selectedModule} onValueChange={setSelectedModule}>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Module 2: Student Class Implementation">
                      Module 2: Student Class Implementation
                    </SelectItem>
                    <SelectItem value="Module 3: Employee Management">
                      Module 3: Employee Management
                    </SelectItem>
                    <SelectItem value="Module 4: Vehicle Hierarchy">
                      Module 4: Vehicle Hierarchy
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-3">
                <Badge variant="outline" className="text-xs">
                  Module: Classes and Objects
                </Badge>
              </div>

              <div className="border rounded-lg overflow-hidden bg-gray-900">
                <Editor
                  height="500px"
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
                    padding: { top: 16, bottom: 16 }
                  }}
                />
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full mt-4 h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {isSubmitting ? (
                  <>Analyzing...</>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit for AI Analysis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* AI Analysis Panel */}
        <div>
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-6 h-6 text-purple-600" />
                <h2 className="text-lg font-bold text-gray-900">AI Analysis</h2>
              </div>

              <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <CodeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-sm">
                    Submit your Java code to see AI analysis
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-blue-900 mb-1">Neural Network Features:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• OOP Principles Analysis</li>
                    <li>• Code Pattern Recognition</li>
                    <li>• Error Detection</li>
                    <li>• Best Practice Suggestions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
