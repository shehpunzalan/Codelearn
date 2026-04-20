import React from 'react';
import { Module, Activity } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, Code, CheckCircle2, Circle, BookOpen } from 'lucide-react';

interface ModuleViewProps {
  module: Module;
  onBack: () => void;
  onSelectActivity: (activityId: string) => void;
}

export function ModuleView({ module, onBack, onSelectActivity }: ModuleViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl mb-2">{module.title}</h1>
            <p className="text-gray-600">{module.description}</p>
          </div>
          <Badge variant={
            module.difficulty === 'beginner' ? 'default' :
            module.difficulty === 'intermediate' ? 'secondary' : 'destructive'
          }>
            {module.difficulty}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Module Progress</CardTitle>
            <span className="text-lg">{module.progress}%</span>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={module.progress} className="h-2" />
          <p className="text-sm text-gray-600 mt-2">
            {module.activities.filter(a => a.completed).length} of {module.activities.length} activities completed
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl mb-4">Activities</h2>
        <div className="grid gap-4">
          {module.activities.map((activity, index) => (
            <Card key={activity.id} className={activity.completed ? 'border-green-200 bg-green-50/30' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {activity.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Activity {index + 1}: {activity.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {activity.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {activity.type === 'coding' && <Code className="w-3 h-3 mr-1" />}
                      {activity.type === 'reading' && <BookOpen className="w-3 h-3 mr-1" />}
                      {activity.type}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  {activity.completed ? (
                    <span className="text-sm text-green-600">✓ Completed</span>
                  ) : (
                    <span className="text-sm text-gray-500">Not started</span>
                  )}
                  <Button 
                    onClick={() => onSelectActivity(activity.id)}
                    variant={activity.completed ? "outline" : "default"}
                    size="sm"
                  >
                    {activity.completed ? 'Review' : 'Start'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
