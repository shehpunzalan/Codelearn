import React, { useState } from 'react'; // v2
import { User, UserRole } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Brain, Mail, Lock, UserCircle as UserIcon, GraduationCap, Shield, FileText, ChevronDown, ChevronUp, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import * as backendApi from '../services/backendApi';

interface RegisterProps {
  onRegister: (user: User) => void;
  onShowLogin: () => void;
}

export function Register({ onRegister, onShowLogin }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    studentId?: string;
    department?: string;
    terms?: string;
  }>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): { valid: boolean; message?: string } => {
    if (password.length < 6) {
      return { valid: false, message: 'Password must be at least 6 characters' };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' };
    }
    return { valid: true };
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    } else {
      // Check if email already exists locally
      try {
        const usersData = localStorage.getItem('registeredUsers');
        const registeredUsers: any[] = usersData ? JSON.parse(usersData) : [];
        if (registeredUsers.some((u: any) => u.email === email)) {
          newErrors.email = 'This email is already registered';
        }
      } catch (_e: unknown) { /* ignore malformed localStorage */ }
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        newErrors.password = passwordValidation.message;
      }
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Student-specific validation
    if (role === 'student') {
      if (!studentId.trim()) {
        newErrors.studentId = 'Student ID is required';
      } else if (!/^[0-9]{4,10}$/.test(studentId)) {
        newErrors.studentId = 'Student ID must be 4-10 digits';
      }
    }

    // Instructor-specific validation
    if (role === 'instructor') {
      if (!department.trim()) {
        newErrors.department = 'Department is required';
      } else if (department.trim().length < 3) {
        newErrors.department = 'Department must be at least 3 characters';
      }
    }

    // Terms agreement validation
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the Terms and Conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    // Check local duplicate first
    let existingUsers: any[] = [];
    try {
      const raw = localStorage.getItem('registeredUsers');
      existingUsers = raw ? JSON.parse(raw) : [];
    } catch (_e: unknown) { existingUsers = []; }

    if (existingUsers.some((u: any) => u.email === trimmedEmail)) {
      setErrors({ email: 'This email is already registered.' });
      toast.error('Email already registered', { description: 'Please log in instead.' });
      setIsLoading(false);
      return;
    }

    // --- Save to Supabase via the backend API (server-side, not blocked by CSP) ---
    let supabaseUserId: string | null = null;
    try {
      const result = await backendApi.signUp({
        email: trimmedEmail,
        password,
        name: trimmedName,
        role,
        studentId: role === 'student' ? studentId : undefined,
        section: role === 'student' ? department : undefined,
        yearLevel: role === 'student' ? '1st Year' : undefined,
      });
      supabaseUserId = result?.data?.userId || null;
      console.log('✅ Saved to Supabase via backend, userId:', supabaseUserId);
    } catch (apiErr: unknown) {
      const msg = String(apiErr);
      console.warn('⚠️ Backend signup failed:', msg);
      if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('exists')) {
        setErrors({ email: 'This email is already registered.' });
        toast.error('Email already registered', { description: 'Please log in instead.' });
        setIsLoading(false);
        return;
      }
      // Backend unreachable — continue with local save
    }

    const userId = supabaseUserId || `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Save to localStorage
    const newUser = {
      id: userId,
      name: trimmedName,
      email: trimmedEmail,
      role,
      studentId: role === 'student' ? studentId : undefined,
      department: role === 'instructor' ? department : undefined,
      enrolledCourses: role === 'student' ? ['CCS108'] : [],
      registeredAt: new Date().toISOString(),
      pendingSync: !supabaseUserId,
    };
    existingUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
    localStorage.setItem(`userCreds_${trimmedEmail}`, JSON.stringify({ password, id: userId }));

    // Notify instructor dashboards on any open tabs to refresh student list
    window.dispatchEvent(new CustomEvent('codelearn:userRegistered', { detail: newUser }));

    const appUser: User = {
      id: userId,
      name: trimmedName,
      email: trimmedEmail,
      role,
      enrolledCourses: role === 'student' ? ['CCS108'] : [],
    };

    toast.success('Registration successful!', {
      description: supabaseUserId
        ? `Welcome to CodeLearn AI, ${trimmedName}! Account saved to database.`
        : `Welcome, ${trimmedName}! Account created locally.`,
    });
    setIsLoading(false);
    onRegister(appUser);
  };

  const getPasswordStrength = (password: string): { strength: string; color: string; width: string } => {
    if (password.length === 0) return { strength: '', color: '', width: '0%' };
    
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { strength: 'Weak', color: 'bg-red-500', width: '33%' };
    if (score <= 4) return { strength: 'Medium', color: 'bg-yellow-500', width: '66%' };
    return { strength: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-2xl">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-2xl shadow-lg" style={{ background: 'var(--primary)' }}>
              <Brain className="w-12 h-12" style={{ color: 'var(--primary-foreground)' }} />
            </div>
          </div>
          <h1 className="mb-2" style={{ color: 'var(--foreground)' }}>Join CodeLearn AI</h1>
          <p style={{ color: 'var(--muted-foreground)' }}>Create your account and start learning</p>
        </div>

        <Card className="shadow-xl" style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
          <CardHeader className="space-y-1 pb-4">
            <CardTitle style={{ color: 'var(--foreground)' }}>Register</CardTitle>
            <CardDescription style={{ color: 'var(--muted-foreground)' }}>
              Fill in your information to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">I am a</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => { setRole('student'); setDepartment(''); setErrors({ ...errors, department: undefined }); }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                      padding: '0.75rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 500,
                      border: `2px solid ${role === 'student' ? 'var(--primary)' : 'var(--border)'}`,
                      background: role === 'student' ? 'var(--accent)' : 'var(--card)',
                      color: role === 'student' ? 'var(--primary)' : 'var(--muted-foreground)',
                      transition: 'all 0.15s',
                    }}
                  >
                    <UserIcon className="w-5 h-5" />
                    <span>Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRole('instructor'); setStudentId(''); setErrors({ ...errors, studentId: undefined }); }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                      padding: '0.75rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 500,
                      border: `2px solid ${role === 'instructor' ? 'var(--primary)' : 'var(--border)'}`,
                      background: role === 'instructor' ? 'var(--accent)' : 'var(--card)',
                      color: role === 'instructor' ? 'var(--primary)' : 'var(--muted-foreground)',
                      transition: 'all 0.15s',
                    }}
                  >
                    <GraduationCap className="w-5 h-5" />
                    <span>Instructor</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: undefined });
                      }}
                      className={`pl-10 h-12 border-gray-200 ${errors.name ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Student ID or Department */}
                {role === 'student' ? (
                  <div className="space-y-2">
                    <Label htmlFor="studentId" className="text-sm font-medium">Student ID *</Label>
                    <Input
                      id="studentId"
                      type="text"
                      placeholder="e.g., 202112345"
                      value={studentId}
                      onChange={(e) => {
                        setStudentId(e.target.value);
                        if (errors.studentId) setErrors({ ...errors, studentId: undefined });
                      }}
                      className={`h-12 border-gray-200 ${errors.studentId ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                    {errors.studentId && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.studentId}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-sm font-medium">Department *</Label>
                    <Input
                      id="department"
                      type="text"
                      placeholder="e.g., Computer Science"
                      value={department}
                      onChange={(e) => {
                        setDepartment(e.target.value);
                        if (errors.department) setErrors({ ...errors, department: undefined });
                      }}
                      className={`h-12 border-gray-200 ${errors.department ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                    {errors.department && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.department}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    className={`pl-10 h-12 border-gray-200 ${errors.email ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    className={`pl-10 pr-10 h-12 border-gray-200 ${errors.password ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password}
                    </p>
                  )}
                </div>
                {password && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Password strength:</span>
                      <span className={`font-semibold ${
                        passwordStrength.strength === 'Strong' ? 'text-green-600' :
                        passwordStrength.strength === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {passwordStrength.strength}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all ${passwordStrength.color}`}
                        style={{ width: passwordStrength.width }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Use 6+ characters with uppercase, lowercase, and numbers
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                    }}
                    className={`pl-10 pr-10 h-12 border-gray-200 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.confirmPassword}
                    </p>
                  )}
                  {confirmPassword && confirmPassword === password && (
                    <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Passwords match
                    </p>
                  )}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowTerms(!showTerms)}
                  className="w-full flex items-center justify-between text-left mb-2"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">Terms and Conditions</span>
                  </div>
                  {showTerms ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
                </button>

                {showTerms && (
                  <div className="mt-3 space-y-3 text-sm text-gray-700 max-h-64 overflow-y-auto pr-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h4>
                      <p>By registering for CodeLearn AI, you agree to comply with these terms and conditions. This platform is designed for educational purposes in CCS108 - Object-Oriented Programming with Java.</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">2. User Responsibilities</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Submit only your original work</li>
                        <li>Do not share your account credentials</li>
                        <li>Use the platform ethically and responsibly</li>
                        <li>Respect intellectual property rights</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">3. Academic Integrity</h4>
                      <p>All submitted code will be analyzed for plagiarism. Any form of academic dishonesty will be reported to the appropriate authorities.</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">4. Data Collection and Privacy</h4>
                      <p>We collect code submissions, feedback data, and learning progress for educational purposes. Your data will not be shared with third parties without consent. This platform is not designed for collecting PII or securing highly sensitive data.</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">5. Neural Network Analysis</h4>
                      <p>The AI-powered system analyzes your code for OOP principles, patterns, and quality. Results are for educational feedback only and may not be 100% accurate.</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">6. Service Availability</h4>
                      <p>We strive for 99% uptime but cannot guarantee uninterrupted service. We are not liable for any loss of data or access issues.</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">7. Account Termination</h4>
                      <p>We reserve the right to terminate accounts that violate these terms or engage in malicious activities.</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">8. Changes to Terms</h4>
                      <p>These terms may be updated periodically. Continued use of the platform constitutes acceptance of updated terms.</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-2 mt-3">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => {
                      setAgreedToTerms(checked as boolean);
                      if (checked) setErrors({ ...errors, terms: undefined });
                    }}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-700 cursor-pointer leading-tight"
                  >
                    I have read and agree to the Terms and Conditions *
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.terms}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 font-medium text-base"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating your account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>

              {/* Login Link */}
              <div className="text-center text-sm">
                <span style={{ color: 'var(--muted-foreground)' }}>Already have an account? </span>
                <button
                  type="button"
                  onClick={onShowLogin}
                  style={{ color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Log In
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}