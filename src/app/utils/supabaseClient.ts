// All Supabase operations go through the backend API (server-side)
// to avoid CSP restrictions. Direct browser fetches to Supabase are blocked.
// signInWithSupabase delegates to backendApi.signIn so there is a single code path.

export async function signInWithSupabase(email: string, password: string): Promise<any> {
  // Dynamically import to avoid circular deps
  const backendApi = await import('../services/backendApi');
  const result = await backendApi.signIn(email, password);
  if (!result?.success) {
    throw new Error(result?.error || 'Sign-in failed');
  }
  // Reshape to match the shape Login.tsx expects from Supabase Auth
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
export const supabase = null;
