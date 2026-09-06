import * as backendApi from '../services/backendApi';
import { fetchAllUserProfiles } from './supabaseClient';

/**
 * Fetches all registered user profiles and merges them into localStorage
 * so the instructor dashboard shows students registered on ANY device.
 *
 * Strategy (in order):
 *  1. Direct Supabase query to user_profiles table (bypasses the Edge Function)
 *  2. Edge Function backend API (fallback for when DB row doesn't exist yet)
 */
export async function syncBackendStudentsToLocalStorage(): Promise<void> {
  try {
    // ── 1. Direct Supabase query ──────────────────────────────────────────
    const dbProfiles = await fetchAllUserProfiles();

    // ── 2. Edge-function fallback (may return [] if unreachable) ──────────
    let apiProfiles: any[] = [];
    try {
      const result = await backendApi.getAllStudentsAnalytics();
      apiProfiles = result?.data || [];
    } catch {
      // Edge function unreachable — that's fine, we have direct DB access
    }

    // Merge both sources (DB profiles take precedence)
    const merged = new Map<string, any>();
    for (const p of apiProfiles) {
      const uid = p.userId || p.id || p.user_id;
      if (uid) merged.set(uid, p);
    }
    for (const p of dbProfiles) {
      const uid = p.user_id || p.userId || p.id;
      if (uid) merged.set(uid, p); // DB row overwrites API data
    }

    if (merged.size === 0) return;

    // Load current localStorage users
    let local: any[] = [];
    try {
      local = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    } catch { local = []; }

    const localById = new Map(local.map((u: any) => [u.id, u]));
    let changed = false;

    for (const [uid, profile] of merged) {
      if (localById.has(uid)) continue; // already known locally

      // Normalize field names from both DB and API formats
      const name  = profile.name  || '';
      const email = profile.email || '';
      const role  = profile.role  || 'student';

      if (!name && !email) continue; // skip incomplete records

      localById.set(uid, {
        id: uid,
        name,
        email,
        role,
        studentId:  profile.student_id  || profile.studentId  || '',
        department: profile.section     || profile.department  || '',
        enrolledCourses: role === 'student' ? ['CCS108'] : [],
        registeredAt: profile.created_at || profile.createdAt || new Date().toISOString(),
        pendingSync: false,
      });
      changed = true;
    }

    if (changed) {
      localStorage.setItem('registeredUsers', JSON.stringify(Array.from(localById.values())));
      window.dispatchEvent(new CustomEvent('codelearn:userRegistered', { detail: null }));
    }
  } catch (_e: unknown) {
    // Completely unreachable — silently ignore so the app keeps working offline
  }
}

/** Start polling every 30 seconds for new registrations from other devices */
export function startRegistrationPolling(): () => void {
  syncBackendStudentsToLocalStorage().catch(() => {});

  const intervalId = setInterval(() => {
    syncBackendStudentsToLocalStorage().catch(() => {});
  }, 30_000);

  return () => clearInterval(intervalId);
}
