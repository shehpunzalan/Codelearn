import { createClient } from '@supabase/supabase-js';

// User's actual linked Supabase project (from /supabase/.temp/linked-project.json)
const LINKED_PROJECT_ID = 'hoofdryqutuucipuqxca';
const LINKED_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvdmVkcnlxdXR1dWNpcHVxeGNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NjI2MTIsImV4cCI6MjA5NTQzODYxMn0.KCiq9UdAV83MdMlWEiMWoP-JsxsRnJW4M2z_XJNJnW0';

export const supabase = createClient(
  `https://${LINKED_PROJECT_ID}.supabase.co`,
  LINKED_ANON_KEY
);

/**
 * Register a student in the user's Supabase Auth.
 * Appears under Authentication → Users in supabase.com/dashboard/project/hoofdryqutuucipuqxca
 */
export async function registerStudentInSupabase(data: {
  email: string;
  password: string;
  name: string;
  studentId?: string;
  section?: string;
  yearLevel?: string;
}): Promise<{ userId: string | null; error: string | null }> {
  try {
    console.log('🔄 Registering student in Supabase Auth...', data.email);
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          role: 'student',
          studentId: data.studentId || '',
          section: data.section || '',
          yearLevel: data.yearLevel || '1st Year',
          enrolledCourses: ['CCS108'],
          registeredAt: new Date().toISOString(),
        },
      },
    });

    if (error) {
      console.error('❌ Supabase student signup error:', error.message);
      return { userId: null, error: error.message };
    }

    console.log('✅ Student registered in Supabase Auth:', authData.user?.id);
    return { userId: authData.user?.id || null, error: null };
  } catch (err: unknown) {
    console.error('❌ Supabase student signup exception:', err);
    return { userId: null, error: String(err) };
  }
}

/**
 * Register an instructor in the user's Supabase Auth.
 */
export async function registerInstructorInSupabase(data: {
  email: string;
  password: string;
  name: string;
  department?: string;
}): Promise<{ userId: string | null; error: string | null }> {
  try {
    console.log('🔄 Registering instructor in Supabase Auth...', data.email);
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          role: 'instructor',
          department: data.department || '',
          registeredAt: new Date().toISOString(),
        },
      },
    });

    if (error) {
      console.error('❌ Supabase instructor signup error:', error.message);
      return { userId: null, error: error.message };
    }

    console.log('✅ Instructor registered in Supabase Auth:', authData.user?.id);
    return { userId: authData.user?.id || null, error: null };
  } catch (err: unknown) {
    console.error('❌ Supabase instructor signup exception:', err);
    return { userId: null, error: String(err) };
  }
}

/**
 * Sign in via Supabase Auth.
 */
export async function signInWithSupabase(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

export async function saveStudentToSupabase(_data: any) {}
export async function saveInstructorToSupabase(_data: any) {}
export async function fetchStudentsFromSupabase() { return []; }
export async function fetchInstructorsFromSupabase() { return []; }
