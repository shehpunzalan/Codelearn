import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey as string
);

/**
 * Register a student directly in Supabase Auth.
 * The user will appear in Authentication → Users in the Supabase dashboard.
 * Role and profile info are stored in user_metadata.
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

    if (error) return { userId: null, error: error.message };
    return { userId: authData.user?.id || null, error: null };
  } catch (err: unknown) {
    return { userId: null, error: String(err) };
  }
}

/**
 * Register an instructor directly in Supabase Auth.
 */
export async function registerInstructorInSupabase(data: {
  email: string;
  password: string;
  name: string;
  department?: string;
}): Promise<{ userId: string | null; error: string | null }> {
  try {
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

    if (error) return { userId: null, error: error.message };
    return { userId: authData.user?.id || null, error: null };
  } catch (err: unknown) {
    return { userId: null, error: String(err) };
  }
}

/**
 * Sign in via Supabase Auth (for accounts registered on other devices).
 */
export async function signInWithSupabase(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

// Legacy KV helpers — kept for backward compatibility but may not work without service key
export async function saveStudentToSupabase(_data: any) { /* noop — use registerStudentInSupabase */ }
export async function saveInstructorToSupabase(_data: any) { /* noop — use registerInstructorInSupabase */ }
export async function fetchStudentsFromSupabase() { return []; }
export async function fetchInstructorsFromSupabase() { return []; }
