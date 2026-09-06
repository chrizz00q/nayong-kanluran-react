import { api } from './client';
import type {
  HouseholdReportData,
  PopulationByAgeData,
  PopulationBySectorData,
  PopulationByStreetData,
  VotersReportData,
} from './types';

export async function fetchHouseholdReport() {
  const res = await api.get<HouseholdReportData>('/reports_household.php');
  return res.data;
}

export async function fetchVotersReport() {
  const res = await api.get<VotersReportData>('/reports_voters.php');
  return res.data;
}

export async function fetchPopulationByAgeReport() {
  const res = await api.get<PopulationByAgeData>('/reports_population_by_age.php');
  return res.data;
}

export async function fetchPopulationBySectorReport() {
  const res = await api.get<PopulationBySectorData>('/reports_population_by_sector.php');
  return res.data;
}

export async function fetchPopulationByStreetReport() {
  const res = await api.get<PopulationByStreetData>('/reports_population_by_street.php');
  return res.data;
}
