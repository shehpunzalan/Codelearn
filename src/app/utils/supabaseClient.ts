// All Supabase operations go through the backend API (server-side)
// to avoid CSP restrictions. Direct browser fetches to Supabase are blocked.

export async function signInWithSupabase(_email: string, _password: string): Promise<any> {
  throw new Error('Use backendApi.signIn instead');
}

export async function fetchStudentsFromSupabase(): Promise<any[]> { return []; }
export async function fetchInstructorsFromSupabase(): Promise<any[]> { return []; }
export async function registerStudentInSupabase(_d: any) { return { userId: null, error: 'Use backendApi.signUp' }; }
export async function registerInstructorInSupabase(_d: any) { return { userId: null, error: 'Use backendApi.signUp' }; }
export async function saveStudentToSupabase(_d: any) {}
export async function saveInstructorToSupabase(_d: any) {}
export const supabase = null;
