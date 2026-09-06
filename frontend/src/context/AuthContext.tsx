import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { fetchCurrentUser, login as apiLogin, logout as apiLogout } from '../api/auth';
import type { AuthUser } from '../api/types';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  hasPermission: (module: string, action?: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Mirrors config.php's hasPermissionStatic() fallback table, so the UI can
// hide/disable actions without a round trip. The backend still enforces
// permissions on every request via requirePermission().
const STATIC_PERMISSIONS: Record<string, Record<string, string[]>> = {
  superadmin: {
    dashboard: ['view'],
    inhabitants: ['view', 'add', 'edit', 'delete'],
    demographic: ['view'],
    certification: ['view', 'add', 'edit', 'delete'],
    extras: ['view', 'add', 'edit', 'delete'],
    reports: ['view', 'generate'],
    system: ['view', 'manage', 'sql_execute'],
  },
  admin: {
    dashboard: ['view'],
    inhabitants: ['view', 'add', 'edit', 'delete'],
    demographic: ['view'],
    certification: ['view', 'add', 'edit', 'delete'],
    extras: ['view', 'add', 'edit', 'delete'],
    reports: ['view', 'generate'],
    system: ['view_users'],
  },
  editor: {
    dashboard: ['view'],
    inhabitants: ['view', 'add', 'edit', 'delete'],
    demographic: ['view', 'add', 'edit', 'delete'],
    certification: ['view', 'add', 'edit', 'delete'],
    extras: ['view', 'add', 'edit', 'delete'],
    reports: ['view', 'generate'],
  },
  enumerator: {
    dashboard: ['view'],
    inhabitants: ['view', 'add', 'edit'],
    demographic: ['view'],
    certification: ['view', 'add'],
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser()
      .then((res) => {
        if (res.success && res.user) setUser(res.user);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(username: string, password: string) {
    const res = await apiLogin(username, password);
    if (res.success && res.user) setUser(res.user);
    return { success: res.success, message: res.message };
  }

  async function logout() {
    await apiLogout();
    setUser(null);
  }

  function hasPermission(module: string, action = 'view') {
    if (!user) return false;
    if (user.role === 'superadmin') return true;
    const perms = STATIC_PERMISSIONS[user.role];
    return !!perms?.[module]?.includes(action);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
