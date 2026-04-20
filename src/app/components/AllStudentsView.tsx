import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, Search, User, Mail, Calendar, 
  Award, TrendingUp, AlertCircle, Eye, Filter,
  Users, CheckCircle, BookOpen, GraduationCap,
  TrendingDown, Minus, BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import { getUserStats, getAllProgress, getAllSubmissions } from '../utils/storage';

interface AllStudentsViewProps {
  onBack: () => void;
  onViewStudent?: (userId: string, userName: string) => void;
}

interface StudentData {
  id: string;
  name: string;
  email: string;
  studentId?: string;
  registeredAt: string;
  enrolledCourses: string[];
  // Calculated stats
  completionRate: number;
  averageScore: number;
  totalSubmissions: number;
  lastActive: string;
  status: 'excellent' | 'good' | 'needs-attention';
}

export function AllStudentsView({ onBack, onViewStudent }: AllStudentsViewProps) {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSection, setFilterSection] = useState<'all' | 'excellent' | 'good' | 'needs-attention'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'progress'>('name');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    try {
      setLoading(true);
      
      // Get all registered users from localStorage
      const usersData = localStorage.getItem('registeredUsers');
      const registeredUsers = usersData ? JSON.parse(usersData) : [];
      
      // Filter only students
      const studentUsers = registeredUsers.filter((user: any) => user.role === 'student');
      
      // Calculate stats for each student
      const studentsWithStats: StudentData[] = studentUsers.map((student: any) => {
        const userStats = getUserStats(student.id);
        const allProgress = getAllProgress(student.id);
        const allSubmissions = getAllSubmissions(student.id);
        
        // Calculate completion rate
        const totalLessons = 111; // Total lessons across all modules
        const completedLessons = allProgress.filter((p: any) => p.completed).length;
        const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        
        // Calculate average score
        const averageScore = allSubmissions.length > 0
          ? Math.round(allSubmissions.reduce((sum: number, s: any) => sum + s.score, 0) / allSubmissions.length)
          : 0;
        
        // Get last active time
        const lastActive = allProgress.length > 0
          ? allProgress.sort((a: any, b: any) => 
              new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime()
            )[0].lastAccessed
          : student.registeredAt;
        
        // Determine status
        let status: 'excellent' | 'good' | 'needs-attention' = 'good';
        // Aligned with image: HIGH (>70%), MEDIUM (40-70%), LOW (<40%)
        if (averageScore > 70) {
          status = 'excellent';
        } else if (averageScore < 40) {
          status = 'needs-attention';
        }
        
        return {
          id: student.id,
          name: student.name,
          email: student.email,
          studentId: student.studentId,
          registeredAt: student.registeredAt,
          enrolledCourses: student.enrolledCourses || ['CCS108'],
          completionRate,
          averageScore,
          totalSubmissions: allSubmissions.length,
          lastActive,
          status
        };
      });
      
      setStudents(studentsWithStats);
      setFilteredStudents(studentsWithStats);
      toast.success(`Loaded ${studentsWithStats.length} students`);
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Failed to load students');
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortStudents = () => {
    const filtered = students
      .filter(student => {
        const matchesSearch = 
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.studentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.email.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = filterSection === 'all' || student.status === filterSection;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'score':
            return b.averageScore - a.averageScore;
          case 'progress':
            return b.completionRate - a.completionRate;
          default:
            return 0;
        }
      });
    
    setFilteredStudents(filtered);
  };

  useEffect(() => {
    filterAndSortStudents();
  }, [students, searchQuery, filterSection, sortBy]);

  const getPerformanceBadge = (score: number) => {
    if (score >= 90) {
      return <Badge className="bg-green-100 text-green-800 border-0">Excellent</Badge>;
    } else if (score >= 80) {
      return <Badge className="bg-blue-100 text-blue-800 border-0">Very Good</Badge>;
    } else if (score >= 70) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-0">Good</Badge>;
    } else if (score >= 60) {
      return <Badge className="bg-orange-100 text-orange-800 border-0">Fair</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800 border-0">Needs Support</Badge>;
    }
  };

  const getTrendIcon = (score: number) => {
    if (score >= 85) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (score >= 70) {
      return <Minus className="w-4 h-4 text-yellow-600" />;
    } else {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
  };

  const calculateOverallStats = () => {
    const totalStudents = students.length;
    
    if (totalStudents === 0) {
      return {
        total: 0,
        avgScore: 0,
        avgCompletion: 0,
        struggling: 0
      };
    }
    
    const avgScore = students.reduce((sum, s) => sum + s.averageScore, 0) / totalStudents;
    const avgCompletion = students.reduce((sum, s) => sum + s.completionRate, 0) / totalStudents;
    const struggling = students.filter(s => s.averageScore < 70).length;
    
    return {
      total: totalStudents,
      avgScore: Math.round(avgScore),
      avgCompletion: Math.round(avgCompletion),
      struggling
    };
  };

  const stats = calculateOverallStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              All Students
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor and manage all enrolled students in CCS108
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadStudents}
          className="flex items-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
              </div>
              <Users className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Score</p>
                <p className="text-3xl font-bold text-green-700">{stats.avgScore}%</p>
              </div>
              <Award className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Completion</p>
                <p className="text-3xl font-bold text-purple-700">{stats.avgCompletion}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Need Support</p>
                <p className="text-3xl font-bold text-red-700">{stats.struggling}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, student ID, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Section Filter */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterSection === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterSection('all')}
              >
                All Sections
              </Button>
              <Button
                variant={filterSection === 'excellent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterSection('excellent')}
              >
                Excellent
              </Button>
              <Button
                variant={filterSection === 'good' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterSection('good')}
              >
                Good
              </Button>
              <Button
                variant={filterSection === 'needs-attention' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterSection('needs-attention')}
              >
                Needs Attention
              </Button>
            </div>

            {/* Sort By */}
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'score' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('score')}
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Score
              </Button>
              <Button
                variant={sortBy === 'progress' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('progress')}
              >
                <BookOpen className="w-4 h-4 mr-1" />
                Progress
              </Button>
              <Button
                variant={sortBy === 'name' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('name')}
              >
                Name
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      {loading ? (
        <Card className="border-0 shadow-md">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Loading students...</p>
          </CardContent>
        </Card>
      ) : filteredStudents.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No students found matching your criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredStudents.map((student, index) => (
            <Card 
              key={student.id} 
              className={`border-0 shadow-md transition-all duration-200 hover:shadow-lg ${
                student.averageScore < 70 ? 'border-l-4 border-l-red-500' : ''
              }`}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  {/* Student Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold text-lg">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900">{student.name}</h3>
                        {index < 3 && (
                          <Award className="w-5 h-5 text-yellow-500" />
                        )}
                        {getPerformanceBadge(student.averageScore)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <strong>ID:</strong> {student.studentId}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {student.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="flex items-center gap-2 justify-center mb-1">
                        <p className="text-2xl font-bold text-blue-600">{student.averageScore}%</p>
                        {getTrendIcon(student.averageScore)}
                      </div>
                      <p className="text-xs text-gray-600">Avg Score</p>
                    </div>

                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{student.completionRate}%</p>
                      <p className="text-xs text-gray-600">Completion</p>
                    </div>

                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{student.totalSubmissions}</p>
                      <p className="text-xs text-gray-600">Submissions</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (onViewStudent) {
                            onViewStudent(student.id, student.name);
                          } else {
                            toast.info(`Viewing detailed analytics for ${student.name}`);
                          }
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      {student.averageScore < 70 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-700 hover:bg-red-50"
                          onClick={() => toast.info(`Sending intervention to ${student.name}`)}
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Intervene
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Results Summary */}
      <div className="text-center text-sm text-gray-600">
        Showing {filteredStudents.length} of {students.length} students
      </div>
    </div>
  );
}