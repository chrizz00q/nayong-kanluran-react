import { api, toFormData } from './client';
import type { Certificate, CertificateStats, PaginatedResult, ResidentOption } from './types';

export interface CertificateListParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  dir?: 'ASC' | 'DESC';
  certificate_type?: string;
  status?: string;
}

export async function fetchCertificates(params: CertificateListParams) {
  const res = await api.get<PaginatedResult<Certificate>>('/certificates_list.php', { params });
  return res.data;
}

export async function fetchCertificate(id: number) {
  const res = await api.get<Certificate & { resident_name?: string }>('/certificate_details.php', {
    params: { id },
  });
  return res.data;
}

export async function fetchCertificateStats() {
  const res = await api.get<CertificateStats>('/certificate_stats.php');
  return res.data;
}

export async function searchResidents(search: string) {
  const res = await api.get<{ data: ResidentOption[] }>('/citizens_search.php', {
    params: { search },
  });
  return res.data.data;
}

export async function createCertificate(payload: Record<string, unknown>) {
  const res = await api.post<{ success: boolean; id?: number; message?: string }>(
    '/certificate_create.php',
    toFormData(payload)
  );
  return res.data;
}

export async function updateCertificate(id: number, payload: Record<string, unknown>) {
  const res = await api.post<{ success: boolean; message?: string }>(
    '/certificate_update.php',
    toFormData({ ...payload, id })
  );
  return res.data;
}

export async function deleteCertificate(id: number) {
  const res = await api.post<{ success: boolean; message?: string }>(
    '/certificate_delete.php',
    toFormData({ id })
  );
  return res.data;
}

export function certificatePrintUrl(id: number) {
  return `/api/certificate_print.php?id=${id}`;
}

export function residentFullName(r: { last_name?: string; first_name?: string; middle_name?: string | null; ext_name?: string | null }) {
  let name = `${r.last_name ?? ''}, ${r.first_name ?? ''}`;
  if (r.middle_name) name += ` ${r.middle_name[0]}.`;
  if (r.ext_name) name += ` ${r.ext_name}`;
  return name;
}
