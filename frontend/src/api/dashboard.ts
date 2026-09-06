import { api } from './client';
import type { AuditActivity, DashboardStats, DemographicsData, HouseholdsDemographicsData } from './types';

export async function fetchDashboardStats() {
  const res = await api.get<DashboardStats>('/dashboard_stats.php');
  return res.data;
}

export async function fetchDemographics() {
  const res = await api.get<DemographicsData>('/demographics.php');
  return res.data;
}

export async function fetchHouseholdsDemographics() {
  const res = await api.get<HouseholdsDemographicsData>('/households_demographics.php');
  return res.data;
}

export async function fetchRecentActivities(limit = 10) {
  const res = await api.get<{ data: AuditActivity[] }>('/recent_activities.php', { params: { limit } });
  return res.data.data;
}
