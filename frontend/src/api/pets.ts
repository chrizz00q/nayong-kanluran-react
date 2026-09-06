import { api, toFormData } from './client';
import type { OwnerOption, PaginatedResult, Pet, PetStats } from './types';

export interface PetListParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  dir?: 'ASC' | 'DESC';
  pet_type?: string;
  status?: string;
}

export async function fetchPets(params: PetListParams) {
  const res = await api.get<PaginatedResult<Pet>>('/pets_list.php', { params });
  return res.data;
}

export async function fetchPet(id: number) {
  const res = await api.get<Pet>('/pet_details.php', { params: { id } });
  return res.data;
}

export async function fetchPetStats() {
  const res = await api.get<PetStats>('/pet_stats.php');
  return res.data;
}

export async function createPet(payload: Record<string, unknown> & { pet_photo?: File }) {
  const res = await api.post<{ success: boolean; id?: number; message?: string }>(
    '/pet_create.php',
    toFormData(payload),
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return res.data;
}

export async function updatePet(id: number, payload: Record<string, unknown> & { pet_photo?: File }) {
  const res = await api.post<{ success: boolean; message?: string }>(
    '/pet_update.php',
    toFormData({ ...payload, id }),
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return res.data;
}

export async function deletePet(id: number) {
  const res = await api.post<{ success: boolean; message?: string }>(
    '/pet_delete_json.php',
    toFormData({ id })
  );
  return res.data;
}

export async function searchOwners(search: string) {
  const res = await api.get<{ data: OwnerOption[] }>('/owners.php', { params: { search } });
  return res.data.data;
}

export function ownerFullName(o: OwnerOption) {
  let name = `${o.last_name ?? ''}, ${o.first_name ?? ''}`;
  if (o.middle_name) name += ` ${o.middle_name[0]}.`;
  if (o.ext_name) name += ` ${o.ext_name}`;
  return name;
}
