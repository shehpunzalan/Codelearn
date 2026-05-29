-- Create students table to test Supabase database connection
-- This table will store student information for CodeLearn AI

CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  section TEXT,
  year_level TEXT,
  enrolled_courses TEXT[] DEFAULT ARRAY['CCS108'],
  avatar_url TEXT,
  bio TEXT,
  total_lessons_completed INTEGER DEFAULT 0,
  total_quizzes_taken INTEGER DEFAULT 0,
  average_score NUMERIC(5,2) DEFAULT 0,
  total_time_spent INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_students_user_id ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students(email);
CREATE INDEX IF NOT EXISTS idx_students_student_id ON public.students(student_id);

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to read their own data
CREATE POLICY "Users can view their own student data"
  ON public.students
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own data
CREATE POLICY "Users can insert their own student data"
  ON public.students
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own data
CREATE POLICY "Users can update their own student data"
  ON public.students
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow service role to do everything (for admin/instructor access)
CREATE POLICY "Service role can do everything"
  ON public.students
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert a test student record
INSERT INTO public.students (
  student_id,
  name,
  email,
  section,
  year_level,
  bio,
  total_lessons_completed,
  average_score
) VALUES (
  'TEST-2026-001',
  'Test Student',
  'test.student@ccs108.edu',
  'CS-3A',
  'Third Year',
  'Test student for Supabase connection verification',
  5,
  87.50
) ON CONFLICT (student_id) DO NOTHING;

COMMENT ON TABLE public.students IS 'Stores student profile and progress data for CodeLearn AI';
