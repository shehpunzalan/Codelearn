import * as backendApi from '../services/backendApi';
import { fetchAllUserProfiles } from './supabaseClient';

/**
 * Fetches all student profiles from three sources and merges them into
 * localStorage so the instructor dashboard shows students from ANY device.
 *
 * Sources tried in order:
 *  1. Direct Supabase REST query (via supabaseClient — student-only filter)
 *  2. Edge Function /users/registered endpoint
 *  3. Edge Function /analytics/students endpoint (legacy fallback)
 *
 * Key invariants:
 *  - Only profiles with role === 'student' are written to localStorage.
 *    This prevents instructor accounts from ever appearing in the student roster.
 *  - Existing local records are updated (not skipped) so newly-synced fields
 *    (e.g. classSchedule) propagate to already-known users.
 */
export async function syncBackendStudentsToLocalStorage(): Promise<void> {
  try {
    // ── Source 1: Direct Supabase REST (all profiles, we filter below) ───
    const dbProfiles = await fetchAllUserProfiles();

    // ── Source 2: Edge Function /users/registered ─────────────────────────
    let registeredProfiles: any[] = [];
    try {
      const result = await backendApi.getAllRegisteredUsers();
      const raw = result?.data || result?.users || [];
      registeredProfiles = Array.isArray(raw) ? raw : [];
    } catch { /* edge function unreachable */ }

    // ── Source 3: Edge Function /analytics/students (legacy) ─────────────
    let analyticsProfiles: any[] = [];
    try {
      const result = await backendApi.getAllStudentsAnalytics();
      const raw = result?.data || result?.students || [];
      analyticsProfiles = Array.isArray(raw) ? raw : [];
    } catch { /* edge function unreachable */ }

    // Merge all three sources; source 1 (DB) has highest priority.
    const merged = new Map<string, any>();
    for (const p of [...analyticsProfiles, ...registeredProfiles]) {
      const uid = p.userId || p.id || p.user_id;
      if (uid) merged.set(uid, p);
    }
    for (const p of dbProfiles) {
      const uid = p.user_id || p.userId || p.id;
      if (uid) merged.set(uid, p);
    }

    if (merged.size === 0) return;

    // Load current localStorage list.
    let local: any[] = [];
    try { local = JSON.parse(localStorage.getItem('registeredUsers') || '[]'); } catch { local = []; }

    const localById = new Map(local.map((u: any) => [u.id, u]));
    let changed = false;

    for (const [uid, profile] of merged) {
      // CRITICAL: only sync students. Never default to 'student' — an unknown
      // role (null/undefined) could be an instructor and must be skipped.
      const role: string = profile.role || profile.userRole || '';
      if (role !== 'student') continue;

      const name  = profile.name  || profile.displayName || '';
      const email = profile.email || '';
      if (!name && !email) continue;

      const classSchedule = profile.class_schedule || profile.classSchedule || '';
      const section       = profile.section || profile.department || '';

      if (localById.has(uid)) {
        // Update existing entry with any richer remote data.
        const existing = localById.get(uid)!;
        localById.set(uid, {
          ...existing,
          name:          name  || existing.name,
          email:         email || existing.email,
          role:          'student',
          studentId:     profile.student_id || profile.studentId || existing.studentId || '',
          department:    section            || existing.department || '',
          classSchedule: classSchedule      || existing.classSchedule || '',
          enrolledCourses: ['CCS108'],
          pendingSync: false,
        });
      } else {
        // Brand-new student on this device.
        localById.set(uid, {
          id: uid,
          name,
          email,
          role: 'student',
          studentId:     profile.student_id || profile.studentId || '',
          department:    section,
          classSchedule,
          enrolledCourses: ['CCS108'],
          registeredAt:  profile.created_at || profile.createdAt || new Date().toISOString(),
          pendingSync: false,
        });
      }
      changed = true;
    }

    if (changed) {
      localStorage.setItem('registeredUsers', JSON.stringify(Array.from(localById.values())));
      window.dispatchEvent(new CustomEvent('codelearn:userRegistered', { detail: null }));
    }
  } catch (_e: unknown) {
    // Completely unreachable — silently ignore so the app works offline.
  }
}

/** Poll every 15 s (was 30 s) so new cross-device registrations appear faster. */
export function startRegistrationPolling(): () => void {
  syncBackendStudentsToLocalStorage().catch(() => {});

  const intervalId = setInterval(() => {
    syncBackendStudentsToLocalStorage().catch(() => {});
  }, 15_000);

  return () => clearInterval(intervalId);
}
