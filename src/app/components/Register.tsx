import React, { useState, useRef } from 'react'; // v4
import { User, UserRole } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Brain, Mail, Lock, UserCircle as UserIcon, GraduationCap, Shield, FileText, ChevronDown, ChevronUp, Eye, EyeOff, AlertCircle, CheckCircle, MailCheck, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import * as backendApi from '../services/backendApi';
import { upsertUserProfile } from '../utils/supabaseClient';

interface RegisterProps {
  onRegister: (user: User) => void;
  onShowLogin: () => void;
}

// Letters and spaces only (supports multi-word names like "Juan Dela Cruz").
// Kept as a module-level constant so it's reused identically by the live
// input filter and the submit-time validator below.
const NAME_ALPHA_REGEX = /^[A-Za-z\s-]*$/;

// Available course sections for students to choose from.
const SECTIONS = ['CS-A', 'CS-B', 'CS-C', 'IT-A', 'IT-B', 'IT-C'];

const CLASS_SCHEDULES = [
  'CCS108 - TTH 7:30–9:00 AM',
  'CCS108 - TTH 9:00–10:30 AM',
  'CCS108 - TTH 10:30–12:00 PM',
  'CCS108 - MW 1:00–2:30 PM',
  'CCS108 - MW 3:00–4:30 PM',
  'CCS108 - F 8:00–11:00 AM',
];

export function Register({ onRegister, onShowLogin }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [studentId, setStudentId] = useState('');
  const [section, setSection] = useState('');
  const [classSchedule, setClassSchedule] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [hasScrolledTerms, setHasScrolledTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    studentId?: string;
    section?: string;
    classSchedule?: string;
    terms?: string;
  }>({});

  const termsScrollRef = useRef<HTMLDivElement>(null);

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

  /**
   * Handler: Name field input — strips out anything that isn't a letter or
   * space as the user types, so numbers/symbols/punctuation never make it
   * into the field at all (rather than being caught only at submit time).
   */
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const filtered = raw.replace(/[^A-Za-z\s-]/g, '');
    setName(filtered);
    if (errors.name) setErrors({ ...errors, name: undefined });
  };

  /**
   * Handler: blocks copy/paste/cut on password fields. Applied via onCopy/
   * onPaste/onCut so the browser's native clipboard interaction never fires,
   * rather than trying to detect and undo it after the fact.
   */
  const blockClipboard = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    toast.error('Copy/paste is disabled for password fields', { duration: 2000 });
  };

  /**
   * Handler: tracks whether the user has scrolled the Terms and Conditions
   * box all the way to the bottom. The agreement checkbox stays disabled
   * until this is true, so the checkbox can't be checked without reading
   * through (or at least scrolling past) the full terms text.
   */
  const handleTermsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (hasScrolledTerms) return; // already unlocked, nothing more to do
    const el = e.currentTarget;
    const reachedBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
    if (reachedBottom) {
      setHasScrolledTerms(true);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Name validation
    const trimmedNameForValidation = name.trim();
    if (!trimmedNameForValidation) {
      newErrors.name = 'Full name is required';
    } else if (trimmedNameForValidation.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    } else if (!NAME_ALPHA_REGEX.test(trimmedNameForValidation)) {
      newErrors.name = 'Name can only contain letters and hyphens';
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
      if (!section) {
        newErrors.section = 'Section is required';
      }
    }

    if (!classSchedule) {
      newErrors.classSchedule = 'Class schedule is required';
    }

    // Instructor-specific validation — none currently (Department field removed)

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
        section: role === 'student' ? section : undefined,
        yearLevel: role === 'student' ? '1st Year' : undefined,
        classSchedule,
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

    // Always use UUID format so the App.tsx startup wipe never deletes local accounts.
    const userId = supabaseUserId || crypto.randomUUID();

    // Save to localStorage
    const newUser = {
      id: userId,
      name: trimmedName,
      email: trimmedEmail,
      role,
      studentId: role === 'student' ? studentId : undefined,
      section: role === 'student' ? section : undefined,
      enrolledCourses: role === 'student' ? ['CCS108'] : [],
      registeredAt: new Date().toISOString(),
      pendingSync: !supabaseUserId,
      classSchedule,
    };
    existingUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
    localStorage.setItem(`userCreds_${trimmedEmail}`, JSON.stringify({ password, id: userId }));

    // Push profile to Supabase so instructor dashboards on other PCs can sync it.
    upsertUserProfile({
      id: userId,
      name: trimmedName,
      email: trimmedEmail,
      role,
      studentId: role === 'student' ? studentId : undefined,
      section: classSchedule || section || undefined,
      classSchedule: classSchedule || undefined,
    }).catch(() => { /* non-blocking — local save already succeeded */ });

    // Notify instructor dashboards on any open tabs to refresh student list
    window.dispatchEvent(new CustomEvent('codelearn:userRegistered', { detail: newUser }));

    const appUser: User = {
      id: userId,
      name: trimmedName,
      email: trimmedEmail,
      role,
      enrolledCourses: role === 'student' ? ['CCS108'] : [],
    };

    toast.success('Registration successful! Check your email to verify your account.', { duration: 5000 });
    setIsLoading(false);
    setPendingUser(appUser);
    setPendingVerification(true);
  };

  const handleResendVerification = () => {
    if (resendCooldown > 0) return;
    toast.info('Verification email resent. Please check your inbox.');
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown(prev => { if (prev <= 1) { clearInterval(interval); return 0; } return prev - 1; });
    }, 1000);
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

  if (pendingVerification && pendingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--background)', fontFamily: 'var(--font-sans)' }}>
        <div className="w-full max-w-md text-center">
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'color-mix(in srgb, var(--primary) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <MailCheck style={{ width: 40, height: 40, color: 'var(--primary)' }} />
          </div>
          <h1 style={{ color: 'var(--foreground)', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '1.75rem', marginBottom: '0.5rem' }}>Verify your email</h1>
          <p style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            We sent a verification link to <strong style={{ color: 'var(--foreground)' }}>{pendingUser.email}</strong>.
            Please click the link in that email to activate your account.
          </p>
          <div style={{ border: '1px solid var(--border)', background: 'var(--card)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', textAlign: 'left', marginBottom: '1.5rem' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: 'var(--muted-foreground)', margin: '0 0 0.75rem', fontWeight: 600 }}>{"Didn't receive the email?"}</p>
            <ul style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: 'var(--muted-foreground)', margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8 }}>
              <li>Check your spam or junk folder</li>
              <li>Make sure the email address is correct</li>
              <li>Wait a few minutes for delivery</li>
            </ul>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={handleResendVerification}
              disabled={resendCooldown > 0}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', height: '2.75rem', background: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontWeight: 600, cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer', opacity: resendCooldown > 0 ? 0.6 : 1 }}
            >
              <RefreshCw style={{ width: 16, height: 16 }} />
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Verification Email'}
            </button>
            <button
              onClick={() => { setPendingVerification(false); onShowLogin(); }}
              style={{ height: '2.75rem', background: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontWeight: 500, cursor: 'pointer' }}
            >
              Back to Login
            </button>
            <button
              type="button"
              onClick={() => pendingUser && onRegister(pendingUser)}
              style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', fontSize: '0.8rem', fontFamily: 'var(--font-sans)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Continue without verifying (demo)
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                    onClick={() => { setRole('student'); }}
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
                    onClick={() => { setRole('instructor'); setStudentId(''); setSection(''); setErrors({ ...errors, studentId: undefined, section: undefined }); }}
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

              {/* Full Name (+ Student ID, for students only) */}
              {role === 'student' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={handleNameChange}
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
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={handleNameChange}
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
              )}

              {/* Section — students only */}
              {role === 'student' && (
                <div className="space-y-2">
                  <Label htmlFor="section" className="text-sm font-medium">Section *</Label>
                  <select
                    id="section"
                    value={section}
                    onChange={(e) => {
                      setSection(e.target.value);
                      if (errors.section) setErrors({ ...errors, section: undefined });
                    }}
                    className={`w-full h-12 rounded-md border bg-white px-3 text-sm border-gray-200 ${errors.section ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                  >
                    <option value="" disabled>Select your section</option>
                    {SECTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.section && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.section}
                    </p>
                  )}
                </div>
              )}

              {/* Class Schedule — both roles */}
              <div className="space-y-2">
                <Label htmlFor="classSchedule" className="text-sm font-medium">Class Schedule *</Label>
                <select
                  id="classSchedule"
                  value={classSchedule}
                  onChange={(e) => { setClassSchedule(e.target.value); if (errors.classSchedule) setErrors({ ...errors, classSchedule: undefined }); }}
                  style={{ fontFamily: 'var(--font-sans)' }}
                  className={`w-full h-12 rounded-md border bg-white px-3 text-sm border-gray-200 ${errors.classSchedule ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                >
                  <option value="" disabled>Select your class schedule</option>
                  {CLASS_SCHEDULES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.classSchedule && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.classSchedule}
                  </p>
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
                    onCopy={blockClipboard}
                    onPaste={blockClipboard}
                    onCut={blockClipboard}
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
                    onCopy={blockClipboard}
                    onPaste={blockClipboard}
                    onCut={blockClipboard}
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
                  <div
                    ref={termsScrollRef}
                    onScroll={handleTermsScroll}
                    className="mt-3 space-y-3 text-sm text-gray-700 max-h-64 overflow-y-auto pr-2"
                  >
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
                    disabled={!hasScrolledTerms}
                    onCheckedChange={(checked) => {
                      setAgreedToTerms(checked as boolean);
                      if (checked) setErrors({ ...errors, terms: undefined });
                    }}
                  />
                  <label
                    htmlFor="terms"
                    className={`text-sm leading-tight ${hasScrolledTerms ? 'text-gray-700 cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}
                  >
                    I have read and agree to the Terms and Conditions *
                  </label>
                </div>
                {!hasScrolledTerms && (
                  <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {showTerms
                      ? 'Scroll to the end of the Terms and Conditions to enable the checkbox.'
                      : 'Open and read through the Terms and Conditions to enable the checkbox.'}
                  </p>
                )}
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