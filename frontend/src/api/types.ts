export interface AuthUser {
  id: number;
  username: string;
  full_name: string;
  role: string;
  role_id: number | null;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Citizen {
  id: number;
  last_name: string;
  first_name: string;
  middle_name?: string | null;
  ext_name?: string | null;
  place_of_birth?: string | null;
  date_of_birth?: string | null;
  age?: number | null;
  sex: 'Male' | 'Female' | 'Other';
  civil_status: 'Single' | 'Married' | 'Widowed' | 'Divorced' | 'Separated';
  highest_education?: string | null;
  profile_picture?: string | null;
  created_at?: string;
  updated_at?: string;
  educational_status?: string | null;
  philsys_number?: string | null;
  email?: string | null;
  mobile_number?: string | null;
  telephone_number?: string | null;
  region?: string | null;
  province?: string | null;
  city_municipality?: string | null;
  barangay_address?: string | null;
  house_address?: string | null;
  street?: string | null;
  subdivision?: string | null;
  zip_code?: string | null;
  blood_type?: string | null;
  weight?: number | null;
  height?: string | null;
  citizenship?: string | null;
  registered_voter?: number;
  voter_not_resident?: number;
  ethnicity?: string | null;
  position_in_household?: string | null;
  mother_maiden_name?: string | null;
  has_pet?: number;
  sectors?: string | null;
  sector_other?: string | null;
  profession?: string | null;
}

export interface HouseholdRecord {
  id: number;
  last_name: string;
  first_name: string;
  middle_name?: string | null;
  ext_name?: string | null;
  place_of_birth?: string | null;
  date_of_birth?: string | null;
  age?: number | null;
  sex: 'Male' | 'Female' | 'Other';
  civil_status: 'Single' | 'Married' | 'Widowed' | 'Divorced' | 'Separated';
  citizenship?: string | null;
  occupation?: string | null;
  profession?: string | null;
  disability?: string | null;
  pets?: string | null;
  profile_picture?: string | null;
  created_at?: string;
  updated_at?: string;
  household_type?: string | null;
  dwelling_type?: string | null;
  household_name?: string | null;
  position_in_household?: string | null;
  tenure_status?: string | null;
  monthly_income?: number | null;
  head_of_family_id?: number | null;
}

export type CertificateStatus = 'Pending' | 'Issued' | 'Expired' | 'Cancelled';

export interface Certificate {
  id: number;
  resident_id: number;
  certificate_type: string;
  certificate_number: string;
  purpose?: string | null;
  issued_date?: string | null;
  expiry_date?: string | null;
  status: CertificateStatus;
  created_at?: string;
  last_name?: string;
  first_name?: string;
  middle_name?: string | null;
  ext_name?: string | null;
}

export interface CertificateStats {
  total: number;
  issued: number;
  pending: number;
  expired: number;
}

export interface ResidentOption {
  id: number;
  last_name: string;
  first_name: string;
  middle_name?: string | null;
  ext_name?: string | null;
}

export interface DashboardStats {
  total_households: number;
  total_population: number;
  total_individuals: number;
  total_male: number;
  total_female: number;
  birthday_today: number;
  birthday_celebrants: { full_name: string }[];
}

export interface AuditActivity {
  id: number;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | string;
  table_name: string;
  record_id: number | null;
  details: string | null;
  created_at: string;
  full_name: string | null;
}

export interface DemographicsData {
  gender_individual: { sex: string; count: number }[];
  gender_household: { sex: string; count: number }[];
  civil_status: { civil_status: string; count: number }[];
  education: { highest_education: string; count: number }[];
  age_distribution: { age_group: string; count: number }[];
  citizenship: { citizenship: string; count: number }[];
  occupation: { occupation: string; count: number }[];
  totals: {
    total_individuals: number;
    total_households: number;
    total_male: number;
    total_female: number;
    birthday_today: number;
  };
  monthly_trend: { month: string; total: number }[];
}

export interface Pet {
  id: number;
  owner_id: number | null;
  owner_name?: string | null;
  pet_name: string;
  pet_type: string;
  breed?: string | null;
  color?: string | null;
  gender?: 'Male' | 'Female' | null;
  weight?: number | null;
  microchip_number?: string | null;
  vaccination_status?: 'Up to Date' | 'Partial' | 'None' | null;
  registration_date?: string | null;
  status: 'Active' | 'Inactive' | 'Deceased';
  pet_photo?: string | null;
  created_by?: number | null;
  created_at?: string;
}

export interface PetStats {
  total: number;
  active: number;
  inactive: number;
  deceased: number;
}

export interface OwnerOption {
  id: number;
  last_name: string;
  first_name: string;
  middle_name?: string | null;
  ext_name?: string | null;
}

export interface HouseholdsDemographicsData {
  total_households: number;
  dwelling_stats: { dwelling_type: string; count: number }[];
  type_stats: { household_type: string; count: number }[];
  tenure_stats: { tenure_status: string; count: number }[];
}

export interface HouseholdReportRow extends HouseholdRecord {
  member_count?: number | null;
}

export interface HouseholdReportData {
  total_households: number;
  data: HouseholdReportRow[];
}

export interface VotersReportData {
  total_voters: number;
  data: Citizen[];
}

export interface AgeGroupStat {
  age_group: string;
  count: number;
  members: string | null;
}

export interface PopulationByAgeData {
  total_population: number;
  age_distribution: AgeGroupStat[];
}

export interface SectorStat {
  sector: string;
  count: number;
  members: string | null;
}

export interface PopulationBySectorData {
  total_households: number;
  sector_data: SectorStat[];
}

export interface StreetStat {
  street: string;
  count: number;
  residents: string | null;
}

export interface PopulationByStreetData {
  total_individuals: number;
  total_with_address: number;
  street_data: StreetStat[];
}
