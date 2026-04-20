import React from 'react';
import { Module } from '../types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { BookOpen, Lock, CheckCircle, Coffee, Brain } from 'lucide-react';

interface ModulesPageProps {
  modules: Module[];
  onSelectModule: (moduleId: string) => void;
}

export function ModulesPage({ modules, onSelectModule }: ModulesPageProps) {
  const modulesStarted = modules.filter(m => m.progress > 0).length;
  const lessonsCompleted = modules.reduce((sum, m) => sum + m.completedLessons, 0);
  const totalLessons = modules.reduce((sum, m) => sum + m.totalLessons, 0);
  const overallProgress = Math.round((lessonsCompleted / totalLessons) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Badge className="bg-blue-600 text-white px-3 py-1">CCS108</Badge>
          <h1 className="text-3xl font-bold text-gray-900">Object-Oriented Programming</h1>
        </div>
        <p className="text-gray-600">Master Java OOP concepts with AI-powered learning modules</p>
      </div>

      {/* Progress Overview */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Your CCS108 Learning Journey</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-600 text-sm mb-1">Modules Started</p>
              <p className="text-3xl font-bold text-gray-900">{modulesStarted}/{modules.length}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Lessons Completed</p>
              <p className="text-3xl font-bold text-gray-900">{lessonsCompleted}/{totalLessons}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Overall Progress</p>
              <p className="text-3xl font-bold text-gray-900">{overallProgress}%</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Programming Language</p>
              <div className="flex items-center gap-2">
                <Coffee className="w-6 h-6 text-orange-600" />
                <p className="text-2xl font-bold text-gray-900">Java</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-900 text-sm mb-2">Keep going! You're making great progress 🚀</p>
            <Progress value={overallProgress} className="h-2 bg-gray-200" />
          </div>
        </CardContent>
      </Card>

      {/* About CCS108 */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">About CCS108</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            This course introduces the fundamental concepts of Object-Oriented Programming (OOP) using Java. Students will learn to design and implement programs using classes, objects, inheritance, polymorphism, encapsulation, and abstraction. The course emphasizes problem-solving skills and software design principles.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
            <div className="border-l-4 border-blue-500 pl-3">
              <p className="text-sm text-gray-600">Course Code</p>
              <p className="font-semibold text-gray-900">CCS108</p>
            </div>
            <div className="border-l-4 border-green-500 pl-3">
              <p className="text-sm text-gray-600">Language</p>
              <p className="font-semibold text-gray-900">Java</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-3">
              <p className="text-sm text-gray-600">Level</p>
              <p className="font-semibold text-gray-900">Intermediate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Modules */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Modules</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {modules.map((module, index) => {
            const isLocked = index > 0 && modules[index - 1].progress < 100;
            const hasStarted = module.progress > 0;
            const isCompleted = module.progress === 100;

            return (
              <Card 
                key={module.id} 
                className={`border-0 shadow-md transition-all hover:shadow-lg ${
                  isLocked ? 'opacity-60' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${
                        isLocked ? 'bg-gray-100' :
                        isCompleted ? 'bg-green-100' :
                        hasStarted ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        {isLocked ? (
                          <Lock className="w-6 h-6 text-gray-400" />
                        ) : isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <BookOpen className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <Badge variant="outline" className="text-xs mb-1">
                          Module {index + 1}
                        </Badge>
                        <h3 className="font-bold text-lg text-gray-900">{module.title}</h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{module.description}</p>

                  {/* Module Source Information */}
                  {module.source && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs px-2 py-0.5 border ${
                            module.source.type === 'neural-network' 
                              ? 'bg-purple-100 text-purple-700 border-purple-200'
                              : module.source.type === 'ai-generated'
                              ? 'bg-blue-100 text-blue-700 border-blue-200'
                              : module.source.type === 'instructor'
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : 'bg-orange-100 text-orange-700 border-orange-200'
                          }`}>
                            {module.source.type === 'neural-network' && '🧠 AI Neural Network'}
                            {module.source.type === 'ai-generated' && '🤖 AI Generated'}
                            {module.source.type === 'instructor' && '👨‍🏫 Instructor'}
                            {module.source.type === 'curriculum' && '📖 Curriculum'}
                          </Badge>
                          {module.source.instructor && (
                            <span className="text-xs text-gray-600">{module.source.instructor}</span>
                          )}
                        </div>
                      </div>
                      {module.source.tags && module.source.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {module.source.tags.map((tag, idx) => (
                            <span key={idx} className="text-xs px-2 py-0.5 bg-white text-gray-600 rounded border border-gray-200">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {module.totalLessons} lessons • {module.estimatedTime}
                      </span>
                      <span className="font-semibold text-blue-600">{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="h-2" />
                  </div>

                  {module.lessons.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-600 mb-2">Topics Covered</p>
                      <div className="flex flex-wrap gap-2">
                        {module.lessons.slice(0, 3).map((lesson, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {lesson.title}
                          </Badge>
                        ))}
                        {module.lessons.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{module.lessons.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-gray-600 mb-4">
                    <p className="font-medium mb-1">Programming Assignments:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Hands-on coding exercises</li>
                      <li>Real-world Java projects</li>
                      <li>AI-powered code analysis</li>
                    </ul>
                  </div>

                  {isLocked ? (
                    <Button disabled className="w-full" variant="outline">
                      <Lock className="w-4 h-4 mr-2" />
                      Complete Module {index} to unlock
                    </Button>
                  ) : isCompleted ? (
                    <Button 
                      onClick={() => onSelectModule(module.id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Review Module
                    </Button>
                  ) : hasStarted ? (
                    <Button 
                      onClick={() => onSelectModule(module.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Continue Learning
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => onSelectModule(module.id)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Start Module
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* AI Learning Tips */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-purple-100 to-blue-100">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">AI Learning Tips for Java OOP</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Practice Regularly</h3>
              <p className="text-sm text-gray-600">
                Write code daily to familiarize OOP concepts and improve problem-solving skills.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Think in Objects</h3>
              <p className="text-sm text-gray-600">
                Try to model real-world problems using classes and objects for reusable OOP thinking.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Debug & Experiment</h3>
              <p className="text-sm text-gray-600">
                Don't be afraid to make mistakes. Debugging helps you understand how Java works.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}