import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Navigation } from 'lucide-react';

interface LearningPathNavigatorProps {
  activeSection: number;
  scrollToSection: (sectionNumber: number) => void;
}

export function LearningPathNavigator({ activeSection, scrollToSection }: LearningPathNavigatorProps) {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <Navigation className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Learning Path Navigator</h2>
        </div>
        <p className="text-xs text-gray-600 mb-4">Follow the structured path or jump to any section</p>

        <div className="space-y-2">
          {/* 1. Introduction & Objectives */}
          <button
            onClick={() => scrollToSection(1)}
            className={`w-full bg-white rounded-lg p-3 border-2 hover:border-purple-400 transition-all group text-left ${
              activeSection === 1 ? 'border-purple-500 bg-purple-50' : 'border-purple-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                activeSection === 1 ? 'bg-purple-200 text-purple-700' : 'bg-purple-100 text-purple-700 group-hover:bg-purple-200'
              }`}>
                1
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm text-gray-900">Introduction & Objectives</h3>
                <p className="text-xs text-gray-600">3 min</p>
              </div>
              <Badge className="bg-gray-600 text-white border-0 text-xs">intro</Badge>
            </div>
          </button>

          {/* 2. Core Concepts Explained */}
          <button
            onClick={() => scrollToSection(2)}
            className={`w-full bg-white rounded-lg p-3 border-2 hover:border-blue-400 transition-all group text-left ${
              activeSection === 2 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                activeSection === 2 ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-700 group-hover:bg-gray-200'
              }`}>
                2
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm text-gray-900">Core Concepts Explained</h3>
                <p className="text-xs text-gray-600">8 min</p>
              </div>
              <Badge className="bg-gray-700 text-white border-0 text-xs">content</Badge>
            </div>
          </button>

          {/* 3. Real-World Examples */}
          <button
            onClick={() => scrollToSection(3)}
            className={`w-full bg-white rounded-lg p-3 border-2 hover:border-teal-400 transition-all group text-left ${
              activeSection === 3 ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                activeSection === 3 ? 'bg-teal-200 text-teal-700' : 'bg-gray-100 text-gray-700 group-hover:bg-gray-200'
              }`}>
                3
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm text-gray-900">Real-World Examples</h3>
                <p className="text-xs text-gray-600">5 min</p>
              </div>
              <Badge className="bg-gray-700 text-white border-0 text-xs">examples</Badge>
            </div>
          </button>

          {/* 4. Hands-On Practice */}
          <button
            onClick={() => scrollToSection(4)}
            className={`w-full bg-white rounded-lg p-3 border-2 hover:border-blue-500 transition-all group text-left ${
              activeSection === 4 ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                activeSection === 4 ? 'bg-blue-300 text-blue-700' : 'bg-gray-100 text-gray-700 group-hover:bg-gray-200'
              }`}>
                4
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm text-gray-900">Hands-On Practice</h3>
                <p className="text-xs text-gray-600">10 min</p>
              </div>
              <Badge className="bg-blue-600 text-white border-0 text-xs">practice</Badge>
            </div>
          </button>

          {/* 5. Knowledge Check */}
          <button
            onClick={() => scrollToSection(5)}
            className={`w-full bg-white rounded-lg p-3 border-2 hover:border-yellow-500 transition-all group text-left ${
              activeSection === 5 ? 'border-yellow-600 bg-yellow-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                activeSection === 5 ? 'bg-yellow-200 text-yellow-700' : 'bg-gray-100 text-gray-700 group-hover:bg-gray-200'
              }`}>
                5
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm text-gray-900">Knowledge Check</h3>
                <p className="text-xs text-gray-600">4 min</p>
              </div>
              <Badge className="bg-yellow-500 text-white border-0 text-xs">quiz</Badge>
            </div>
          </button>

          {/* 6. Summary & Next Steps */}
          <button
            onClick={() => scrollToSection(6)}
            className={`w-full bg-white rounded-lg p-3 border-2 hover:border-gray-500 transition-all group text-left ${
              activeSection === 6 ? 'border-gray-600 bg-gray-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                activeSection === 6 ? 'bg-gray-300 text-gray-700' : 'bg-gray-100 text-gray-700 group-hover:bg-gray-200'
              }`}>
                6
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm text-gray-900">Summary & Next Steps</h3>
                <p className="text-xs text-gray-600">2 min</p>
              </div>
              <Badge className="bg-gray-600 text-white border-0 text-xs">summary</Badge>
            </div>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}