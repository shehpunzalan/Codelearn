import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const SUPABASE_URL = `https://${projectId}.supabase.co`;

// Direct Supabase client — bypasses the Edge Function entirely.
// Used for cross-device user sync via the user_profiles table.
export const supabase = createClient(SUPABASE_URL, publicAnonKey as string);

// Save (upsert) a user profile so other devices can discover it.
export async function upsertUserProfile(user: {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor';
  studentId?: string;
  section?: string;
}): Promise<void> {
  try {
    const { error } = await supabase.from('user_profiles').upsert(
      {
        user_id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        student_id: user.studentId || null,
        section: user.section || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );
    if (error) console.debug('[supabase] upsertUserProfile error:', error.message);
  } catch (e) {
    console.debug('[supabase] upsertUserProfile failed:', e);
  }
}

// Fetch all user profiles from Supabase (for cross-device instructor sync).
export async function fetchAllUserProfiles(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('user_id, name, email, role, student_id, section, year_level, created_at');
    if (error) {
      console.debug('[supabase] fetchAllUserProfiles error:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.debug('[supabase] fetchAllUserProfiles failed:', e);
    return [];
  }
}

// Legacy stubs — kept so nothing breaks if still imported
export async function signInWithSupabase(email: string, password: string): Promise<any> {
  const backendApi = await import('../services/backendApi');
  const result = await backendApi.signIn(email, password);
  if (!result?.success) throw new Error(result?.error || 'Sign-in failed');
  const profile = result.data?.profile || {};
  return {
    access_token: result.data?.accessToken,
    user: {
      id: result.data?.userId,
      email: result.data?.email,
      user_metadata: {
        name: profile.name,
        role: profile.role,
        studentId: profile.studentId,
        section: profile.section,
        yearLevel: profile.yearLevel,
      },
    },
  };
}

export async function fetchStudentsFromSupabase(): Promise<any[]> { return []; }
export async function fetchInstructorsFromSupabase(): Promise<any[]> { return []; }
export async function registerStudentInSupabase(_d: any) { return { userId: null, error: 'Use backendApi.signUp' }; }
export async function registerInstructorInSupabase(_d: any) { return { userId: null, error: 'Use backendApi.signUp' }; }
export async function saveStudentToSupabase(_d: any) {}
export async function saveInstructorToSupabase(_d: any) {}
