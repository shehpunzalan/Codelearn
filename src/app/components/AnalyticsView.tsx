import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, TrendingUp, Users, Target, Award, Download, Filter, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AnalyticsViewProps {
  onBack: () => void;
}

export function AnalyticsView({ onBack }: AnalyticsViewProps) {
  // Student Performance Data
  const studentPerformanceData = [
    { name: 'Week 1', avgScore: 65, submissions: 38 },
    { name: 'Week 2', avgScore: 68, submissions: 40 },
    { name: 'Week 3', avgScore: 72, submissions: 42 },
    { name: 'Week 4', avgScore: 75, submissions: 41 },
    { name: 'Week 5', avgScore: 78, submissions: 39 },
    { name: 'Week 6', avgScore: 80, submissions: 40 },
  ];

  // OOP Principles Mastery
  const oopMasteryData = [
    { principle: 'Classes & Objects', mastery: 85, students: 40 },
    { principle: 'Encapsulation', mastery: 72, students: 35 },
    { principle: 'Inheritance', mastery: 68, students: 32 },
    { principle: 'Polymorphism', mastery: 58, students: 28 },
    { principle: 'Abstraction', mastery: 62, students: 30 },
  ];

  // Module Completion Distribution
  const moduleCompletionData = [
    { name: 'Completed', value: 28, color: '#10B981' },
    { name: 'In Progress', value: 10, color: '#F59E0B' },
    { name: 'Not Started', value: 4, color: '#EF4444' },
  ];

  // Score Distribution
  const scoreDistributionData = [
    { range: '90-100', count: 8 },
    { range: '80-89', count: 15 },
    { range: '70-79', count: 12 },
    { range: '60-69', count: 5 },
    { range: '0-59', count: 2 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-2 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <Badge className="bg-purple-600 text-white px-3 py-1">CCS108</Badge>
            <Badge variant="outline" className="border-blue-300 text-blue-700">Analytics</Badge>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Access Student Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive performance tracking and data analysis</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-500 to-blue-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-black" />
            </div>
            <p className="text-sm font-medium mb-1 text-black">Total Students</p>
            <p className="text-4xl font-bold text-black">42</p>
            <p className="text-xs mt-2 text-black">38 active this week</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-500 to-green-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-black" />
            </div>
            <p className="text-sm font-medium mb-1 text-black">Average Score</p>
            <p className="text-4xl font-bold text-black">80%</p>
            <p className="text-xs mt-2 text-black">↑ 5% from last week</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-500 to-purple-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-black" />
            </div>
            <p className="text-sm font-medium mb-1 text-black">Completion Rate</p>
            <p className="text-4xl font-bold text-black">67%</p>
            <p className="text-xs mt-2 text-black">28 of 42 students</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-500 to-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-black" />
            </div>
            <p className="text-sm font-medium mb-1 text-black">Top Performer</p>
            <p className="text-2xl font-bold text-black">Maria Santos</p>
            <p className="text-xs mt-2 text-black">94% average score</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Performance Trend */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Weekly Performance Trend</CardTitle>
            <CardDescription>Average scores and submission rates over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={studentPerformanceData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }} id="analytics-performance-trend-chart">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#6B7280" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#6B7280" />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="avgScore" 
                  name="Avg Score (%)"
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="submissions" 
                  name="Submissions"
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* OOP Principles Mastery */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>OOP Principles Mastery</CardTitle>
            <CardDescription>Class performance by OOP concept</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={oopMasteryData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }} id="analytics-oop-mastery-chart">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="principle" tick={{ fontSize: 10 }} stroke="#6B7280" angle={-15} textAnchor="end" height={80} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#6B7280" />
                <Tooltip />
                <Bar key="bar-mastery" dataKey="mastery" name="Mastery %" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Module Completion Distribution */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Module Completion Status</CardTitle>
            <CardDescription>Distribution of student progress</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart id="analytics-completion-pie-chart">
                <Pie
                  data={moduleCompletionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {moduleCompletionData.map((entry, index) => (
                    <Cell key={`analytics-completion-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>Number of students per score range</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreDistributionData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }} id="analytics-score-distribution-chart">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} stroke="#6B7280" />
                <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
                <Tooltip />
                <Bar key="bar-count" dataKey="count" name="Students" fill="#F59E0B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Student List */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Student Performance Details</CardTitle>
          <CardDescription>Individual student analytics and progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">Student Name</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">Avg Score</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">Modules Completed</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">Submissions</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Maria Santos', score: 94, modules: '8/10', submissions: 45, status: 'excellent' },
                  { name: 'John Carlo Reyes', score: 91, modules: '7/10', submissions: 42, status: 'excellent' },
                  { name: 'Sarah Mae Gonzales', score: 89, modules: '7/10', submissions: 38, status: 'excellent' },
                  { name: 'Jerome Santos', score: 78, modules: '5/10', submissions: 26, status: 'good' },
                  { name: 'Daniel Patrick Lopez', score: 52, modules: '1/10', submissions: 11, status: 'needs-attention' },
                ].map((student, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-900 font-medium">{student.name}</td>
                    <td className="p-3 text-sm">
                      <Badge className={
                        student.score >= 90 ? 'bg-green-100 text-green-800 border-0' :
                        student.score >= 80 ? 'bg-blue-100 text-blue-800 border-0' :
                        student.score >= 70 ? 'bg-yellow-100 text-yellow-800 border-0' :
                        'bg-red-100 text-red-800 border-0'
                      }>
                        {student.score}%
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-gray-700">{student.modules}</td>
                    <td className="p-3 text-sm text-gray-700">{student.submissions}</td>
                    <td className="p-3 text-sm">
                      <Badge variant="outline" className={
                        student.status === 'excellent' ? 'border-green-300 text-green-700' :
                        student.status === 'good' ? 'border-blue-300 text-blue-700' :
                        'border-red-300 text-red-700'
                      }>
                        {student.status === 'excellent' ? 'Excellent' :
                         student.status === 'good' ? 'Good Progress' :
                         'Needs Attention'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}