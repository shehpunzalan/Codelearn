import { getAllRegisteredUsers } from '../services/backendApi';

/**
 * Fetches all registered users from the Supabase backend and merges them
 * into localStorage 'registeredUsers' so instructor views stay up-to-date
 * even when students registered on different devices.
 */
export async function syncBackendStudentsToLocalStorage(): Promise<void> {
  try {
    const result = await getAllRegisteredUsers();
    if (!result?.data || !Array.isArray(result.data)) return;

    const backendUsers: any[] = result.data;
    const local: any[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    const localById = new Map(local.map((u: any) => [u.id, u]));

    for (const backendUser of backendUsers) {
      const userId = backendUser.userId || backendUser.id;
      if (!userId) continue;
      if (!localById.has(userId)) {
        // Add missing user from backend
        localById.set(userId, {
          id: userId,
          name: backendUser.name || '',
          email: backendUser.email || '',
          role: backendUser.role || 'student',
          studentId: backendUser.studentId || '',
          department: backendUser.department || '',
          enrolledCourses: backendUser.role === 'student' ? ['CCS108'] : [],
          registeredAt: backendUser.createdAt || new Date().toISOString(),
          fromBackend: true,
        });
      } else {
        // Update existing local entry with backend data (non-destructively)
        const existing = localById.get(userId)!;
        localById.set(userId, {
          ...existing,
          name: backendUser.name || existing.name,
          email: backendUser.email || existing.email,
          role: backendUser.role || existing.role,
          fromBackend: true,
        });
      }
    }

    localStorage.setItem('registeredUsers', JSON.stringify(Array.from(localById.values())));
  } catch {
    // Silently ignore — backend may not be deployed yet
  }
}
