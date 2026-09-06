import { api, toFormData } from './client';
import type { HouseholdRecord, PaginatedResult } from './types';

export interface HouseholdListParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  dir?: 'ASC' | 'DESC';
  sex?: string;
  civil_status?: string;
}

export async function fetchHouseholds(params: HouseholdListParams) {
  const res = await api.get<PaginatedResult<HouseholdRecord>>('/households_list.php', { params });
  return res.data;
}

export async function fetchHousehold(id: number) {
  const res = await api.get<HouseholdRecord>('/household_details.php', { params: { id } });
  return res.data;
}

export async function createHousehold(
  payload: Record<string, unknown> & { profile_picture?: File }
) {
  const res = await api.post<{ success: boolean; id?: number; message?: string }>(
    '/household_create.php',
    toFormData(payload),
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return res.data;
}

export async function updateHousehold(
  id: number,
  payload: Record<string, unknown> & { profile_picture?: File }
) {
  const res = await api.post<{ success: boolean; message?: string }>(
    '/household_update.php',
    toFormData({ ...payload, id }),
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return res.data;
}

export async function deleteHousehold(id: number) {
  const res = await api.post<{ success: boolean; message?: string }>(
    '/household_delete.php',
    toFormData({ id })
  );
  return res.data;
}
