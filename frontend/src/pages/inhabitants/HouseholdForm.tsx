import { useEffect, useState, type FormEvent } from 'react';
import type { HouseholdRecord } from '../../api/types';

export interface HouseholdFormValues {
  last_name: string;
  first_name: string;
  middle_name: string;
  ext_name: string;
  place_of_birth: string;
  date_of_birth: string;
  sex: string;
  civil_status: string;
  citizenship: string;
  occupation: string;
  profession: string;
  disability: string;
  pets: string;
  household_type: string;
  dwelling_type: string;
  household_name: string;
  position_in_household: string;
  tenure_status: string;
  monthly_income: string;
}

const EMPTY: HouseholdFormValues = {
  last_name: '',
  first_name: '',
  middle_name: '',
  ext_name: '',
  place_of_birth: '',
  date_of_birth: '',
  sex: 'Male',
  civil_status: 'Single',
  citizenship: 'Filipino',
  occupation: '',
  profession: '',
  disability: '',
  pets: '',
  household_type: 'Nuclear',
  dwelling_type: '',
  household_name: '',
  position_in_household: '',
  tenure_status: 'Owner',
  monthly_income: '',
};

export function householdToFormValues(h?: HouseholdRecord | null): HouseholdFormValues {
  if (!h) return EMPTY;
  return {
    last_name: h.last_name ?? '',
    first_name: h.first_name ?? '',
    middle_name: h.middle_name ?? '',
    ext_name: h.ext_name ?? '',
    place_of_birth: h.place_of_birth ?? '',
    date_of_birth: h.date_of_birth ?? '',
    sex: h.sex ?? 'Male',
    civil_status: h.civil_status ?? 'Single',
    citizenship: h.citizenship ?? 'Filipino',
    occupation: h.occupation ?? '',
    profession: h.profession ?? '',
    disability: h.disability ?? '',
    pets: h.pets ?? '',
    household_type: h.household_type ?? 'Nuclear',
    dwelling_type: h.dwelling_type ?? '',
    household_name: h.household_name ?? '',
    position_in_household: h.position_in_household ?? '',
    tenure_status: h.tenure_status ?? 'Owner',
    monthly_income: h.monthly_income != null ? String(h.monthly_income) : '',
  };
}

export function HouseholdForm({
  initial,
  onSubmit,
  submitting,
  formId,
}: {
  initial?: HouseholdRecord | null;
  onSubmit: (values: HouseholdFormValues, photo: File | null) => void;
  onCancel: () => void;
  submitting: boolean;
  formId: string;
}) {
  const [values, setValues] = useState<HouseholdFormValues>(householdToFormValues(initial));
  const [photo, setPhoto] = useState<File | null>(null);

  useEffect(() => {
    setValues(householdToFormValues(initial));
  }, [initial]);

  function set<K extends keyof HouseholdFormValues>(key: K, value: HouseholdFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(values, photo);
  }

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-section-title">Head / Member Information</div>

        <div className="form-group">
          <label>Last Name *</label>
          <input className="form-control" required value={values.last_name} onChange={(e) => set('last_name', e.target.value)} />
        </div>
        <div className="form-group">
          <label>First Name *</label>
          <input className="form-control" required value={values.first_name} onChange={(e) => set('first_name', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Middle Name</label>
          <input className="form-control" value={values.middle_name} onChange={(e) => set('middle_name', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Suffix</label>
          <input className="form-control" value={values.ext_name} onChange={(e) => set('ext_name', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Date of Birth</label>
          <input type="date" className="form-control" value={values.date_of_birth} onChange={(e) => set('date_of_birth', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Place of Birth</label>
          <input className="form-control" value={values.place_of_birth} onChange={(e) => set('place_of_birth', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Sex *</label>
          <select className="form-select" required value={values.sex} onChange={(e) => set('sex', e.target.value)}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Civil Status *</label>
          <select className="form-select" required value={values.civil_status} onChange={(e) => set('civil_status', e.target.value)}>
            <option>Single</option>
            <option>Married</option>
            <option>Widowed</option>
            <option>Divorced</option>
            <option>Separated</option>
          </select>
        </div>
        <div className="form-group">
          <label>Citizenship</label>
          <input className="form-control" value={values.citizenship} onChange={(e) => set('citizenship', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Occupation</label>
          <input className="form-control" value={values.occupation} onChange={(e) => set('occupation', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Profession</label>
          <input className="form-control" value={values.profession} onChange={(e) => set('profession', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Disability (if any)</label>
          <input className="form-control" value={values.disability} onChange={(e) => set('disability', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Pets</label>
          <input className="form-control" value={values.pets} onChange={(e) => set('pets', e.target.value)} />
        </div>

        <div className="form-section-title">Household Details</div>

        <div className="form-group">
          <label>Household Name</label>
          <input className="form-control" value={values.household_name} onChange={(e) => set('household_name', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Household Type</label>
          <select className="form-select" value={values.household_type} onChange={(e) => set('household_type', e.target.value)}>
            <option>Nuclear</option>
            <option>Extended</option>
            <option>Single</option>
            <option>Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Dwelling Type</label>
          <input className="form-control" placeholder="Single Family House, Apartment..." value={values.dwelling_type} onChange={(e) => set('dwelling_type', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Position in Household</label>
          <input className="form-control" placeholder="Father, Mother, Son..." value={values.position_in_household} onChange={(e) => set('position_in_household', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Tenure Status</label>
          <select className="form-select" value={values.tenure_status} onChange={(e) => set('tenure_status', e.target.value)}>
            <option>Owner</option>
            <option>Renter</option>
            <option>Sharer</option>
            <option>Caretaker</option>
          </select>
        </div>
        <div className="form-group">
          <label>Monthly Income</label>
          <input type="number" step="0.01" className="form-control" value={values.monthly_income} onChange={(e) => set('monthly_income', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Profile Picture</label>
          <input type="file" accept="image/*" className="form-control" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
        </div>
      </div>
    </form>
  );
}
