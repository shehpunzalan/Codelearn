import * as backendApi from '../services/backendApi';

/**
 * Fetches all registered user profiles from the backend KV store
 * and merges them into localStorage so the instructor dashboard
 * shows students/instructors registered on ANY device.
 */
export async function syncBackendStudentsToLocalStorage(): Promise<void> {
  try {
    // Backend stores all profiles with prefix "profile_<userId>"
    // The /analytics/students endpoint returns all of them
    const result = await backendApi.getAllStudentsAnalytics();
    const backendProfiles: any[] = result?.data || [];

    if (!Array.isArray(backendProfiles) || backendProfiles.length === 0) return;

    let local: any[] = [];
    try {
      local = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    } catch (_e: unknown) { local = []; }

    const localById = new Map(local.map((u: any) => [u.id, u]));
    let changed = false;

    for (const profile of backendProfiles) {
      const uid = profile.userId || profile.id;
      if (!uid) continue;

      if (!localById.has(uid)) {
        // New user from another device — add them
        localById.set(uid, {
          id: uid,
          name: profile.name || '',
          email: profile.email || '',
          role: profile.role || 'student',
          studentId: profile.studentId || '',
          department: profile.department || '',
          enrolledCourses: profile.role === 'student' ? ['CCS108'] : [],
          registeredAt: profile.createdAt || new Date().toISOString(),
          pendingSync: false,
        });
        changed = true;
      }
    }

    if (changed) {
      localStorage.setItem('registeredUsers', JSON.stringify(Array.from(localById.values())));
      // Notify instructor dashboards that new users arrived
      window.dispatchEvent(new CustomEvent('codelearn:userRegistered', { detail: null }));
    }
  } catch (_e: unknown) {
    // Backend unreachable — silently ignore
  }
}

/** Start polling the backend every 30 seconds for new registrations */
export function startRegistrationPolling(): () => void {
  // Run immediately on start
  syncBackendStudentsToLocalStorage().catch(() => {});

  const intervalId = setInterval(() => {
    syncBackendStudentsToLocalStorage().catch(() => {});
  }, 30_000);

  return () => clearInterval(intervalId);
}
