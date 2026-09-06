import { api } from './client';
import type { AuthUser } from './types';

export async function login(username: string, password: string) {
  const res = await api.post<{ success: boolean; message?: string; user?: AuthUser }>(
    '/auth.php?action=login',
    { username, password }
  );
  return res.data;
}

export async function logout() {
  const res = await api.post<{ success: boolean }>('/auth.php?action=logout');
  return res.data;
}

export async function fetchCurrentUser() {
  const res = await api.get<{ success: boolean; user?: AuthUser }>('/auth.php?action=me');
  return res.data;
}
