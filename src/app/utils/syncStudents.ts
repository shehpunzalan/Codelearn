import { fetchStudentsFromSupabase, fetchInstructorsFromSupabase } from './supabaseClient';

/**
 * Fetches all registered users directly from the Supabase KV store
 * (student_ and instructor_ prefixed records) and merges them into
 * localStorage 'registeredUsers' so all instructor views stay current.
 */
export async function syncBackendStudentsToLocalStorage(): Promise<void> {
  try {
    const [students, instructors] = await Promise.all([
      fetchStudentsFromSupabase(),
      fetchInstructorsFromSupabase(),
    ]);

    const backendUsers = [...students, ...instructors];
    if (backendUsers.length === 0) return;

    let local: any[] = [];
    try {
      local = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    } catch (_e: unknown) { local = []; }

    const localById = new Map(local.map((u: any) => [u.id, u]));

    for (const bu of backendUsers) {
      const uid = bu.userId || bu.id;
      if (!uid) continue;
      if (!localById.has(uid)) {
        localById.set(uid, {
          id: uid,
          name: bu.name || '',
          email: bu.email || '',
          role: bu.role || 'student',
          studentId: bu.studentId || '',
          department: bu.department || '',
          enrolledCourses: bu.enrolledCourses || (bu.role === 'student' ? ['CCS108'] : []),
          registeredAt: bu.registeredAt || new Date().toISOString(),
          pendingSync: false,
        });
      } else {
        const existing = localById.get(uid)!;
        localById.set(uid, {
          ...existing,
          name: bu.name || existing.name,
          email: bu.email || existing.email,
          role: bu.role || existing.role,
          pendingSync: false,
        });
      }
    }

    localStorage.setItem('registeredUsers', JSON.stringify(Array.from(localById.values())));
  } catch (_e: unknown) {
    // Silently ignore — Supabase may not be accessible
  }
}
