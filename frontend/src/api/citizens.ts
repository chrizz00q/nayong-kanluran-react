import { api, toFormData } from './client';
import type { Citizen, PaginatedResult } from './types';

export interface CitizenListParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  dir?: 'ASC' | 'DESC';
  sex?: string;
  civil_status?: string;
  education?: string;
}

export async function fetchCitizens(params: CitizenListParams) {
  const res = await api.get<PaginatedResult<Citizen>>('/citizens_list.php', { params });
  return res.data;
}

export async function fetchCitizen(id: number) {
  const res = await api.get<Citizen>('/citizen_details.php', { params: { id } });
  return res.data;
}

export async function createCitizen(payload: Record<string, unknown> & { profile_picture?: File }) {
  const res = await api.post<{ success: boolean; id?: number; message?: string }>(
    '/citizen_create.php',
    toFormData(payload),
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return res.data;
}

export async function updateCitizen(id: number, payload: Record<string, unknown> & { profile_picture?: File }) {
  const res = await api.post<{ success: boolean; message?: string }>(
    '/citizen_update.php',
    toFormData({ ...payload, id }),
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return res.data;
}

export async function deleteCitizen(id: number) {
  const res = await api.post<{ success: boolean; message?: string }>(
    '/citizen_delete.php',
    toFormData({ id })
  );
  return res.data;
}
