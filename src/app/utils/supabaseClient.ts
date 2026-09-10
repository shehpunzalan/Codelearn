import { publicAnonKey } from '/utils/supabase/info';

// Use plain fetch against the Supabase REST API — no createClient needed.
// This avoids creating a second GoTrueClient alongside the one the Make platform
// already instantiates internally for the linked project.
const SUPABASE_REST = `https://hovedryqutuucipuqxca.supabase.co/rest/v1`;
const ANON_KEY = publicAnonKey as string;

function restHeaders() {
  return {
    'Content-Type': 'application/json',
    'apikey': ANON_KEY,
    'Authorization': `Bearer ${ANON_KEY}`,
    'Prefer': 'return=minimal',
  };
}

// Save (upsert) a user profile so other devices can discover it.
export async function upsertUserProfile(user: {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor';
  studentId?: string;
  section?: string;
  classSchedule?: string;
}): Promise<void> {
  try {
    await fetch(`${SUPABASE_REST}/user_profiles`, {
      method: 'POST',
      headers: { ...restHeaders(), 'Prefer': 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({
        user_id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        student_id: user.studentId || null,
        section: user.section || null,
        class_schedule: user.classSchedule || user.section || null,
        updated_at: new Date().toISOString(),
      }),
    });
  } catch (e) {
    console.debug('[supabase] upsertUserProfile failed:', e);
  }
}

// Fetch all user profiles from Supabase (for cross-device instructor sync).
export async function fetchAllUserProfiles(): Promise<any[]> {
  try {
    // Filter to students only so instructors are never counted in student totals.
    const res = await fetch(
      `${SUPABASE_REST}/user_profiles?select=user_id,name,email,role,student_id,section,year_level,class_schedule,created_at&role=eq.student`,
      { headers: restHeaders() }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
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
