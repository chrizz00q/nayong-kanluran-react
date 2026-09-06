import { useEffect, useState, type FormEvent } from 'react';
import type { Citizen } from '../../api/types';

export interface CitizenFormValues {
  last_name: string;
  first_name: string;
  middle_name: string;
  ext_name: string;
  date_of_birth: string;
  place_of_birth: string;
  sex: string;
  civil_status: string;
  highest_education: string;
  educational_status: string;
  profession: string;
  philsys_number: string;
  email: string;
  mobile_number: string;
  telephone_number: string;
  region: string;
  province: string;
  city_municipality: string;
  barangay_address: string;
  house_address: string;
  street: string;
  subdivision: string;
  zip_code: string;
  blood_type: string;
  weight: string;
  height: string;
  citizenship: string;
  registered_voter: boolean;
  voter_not_resident: boolean;
  ethnicity: string;
  position_in_household: string;
  mother_maiden_name: string;
}

const EMPTY: CitizenFormValues = {
  last_name: '',
  first_name: '',
  middle_name: '',
  ext_name: '',
  date_of_birth: '',
  place_of_birth: '',
  sex: 'Male',
  civil_status: 'Single',
  highest_education: '',
  educational_status: '',
  profession: '',
  philsys_number: '',
  email: '',
  mobile_number: '',
  telephone_number: '',
  region: '',
  province: '',
  city_municipality: '',
  barangay_address: '',
  house_address: '',
  street: '',
  subdivision: '',
  zip_code: '',
  blood_type: '',
  weight: '',
  height: '',
  citizenship: 'Filipino',
  registered_voter: false,
  voter_not_resident: false,
  ethnicity: '',
  position_in_household: '',
  mother_maiden_name: '',
};

export function citizenToFormValues(c?: Citizen | null): CitizenFormValues {
  if (!c) return EMPTY;
  return {
    last_name: c.last_name ?? '',
    first_name: c.first_name ?? '',
    middle_name: c.middle_name ?? '',
    ext_name: c.ext_name ?? '',
    date_of_birth: c.date_of_birth ?? '',
    place_of_birth: c.place_of_birth ?? '',
    sex: c.sex ?? 'Male',
    civil_status: c.civil_status ?? 'Single',
    highest_education: c.highest_education ?? '',
    educational_status: c.educational_status ?? '',
    profession: c.profession ?? '',
    philsys_number: c.philsys_number ?? '',
    email: c.email ?? '',
    mobile_number: c.mobile_number ?? '',
    telephone_number: c.telephone_number ?? '',
    region: c.region ?? '',
    province: c.province ?? '',
    city_municipality: c.city_municipality ?? '',
    barangay_address: c.barangay_address ?? '',
    house_address: c.house_address ?? '',
    street: c.street ?? '',
    subdivision: c.subdivision ?? '',
    zip_code: c.zip_code ?? '',
    blood_type: c.blood_type ?? '',
    weight: c.weight != null ? String(c.weight) : '',
    height: c.height ?? '',
    citizenship: c.citizenship ?? 'Filipino',
    registered_voter: !!c.registered_voter,
    voter_not_resident: !!c.voter_not_resident,
    ethnicity: c.ethnicity ?? '',
    position_in_household: c.position_in_household ?? '',
    mother_maiden_name: c.mother_maiden_name ?? '',
  };
}

export function CitizenForm({
  initial,
  onSubmit,
  onCancel,
  submitting,
  formId,
}: {
  initial?: Citizen | null;
  onSubmit: (values: CitizenFormValues, photo: File | null) => void;
  onCancel: () => void;
  submitting: boolean;
  formId: string;
}) {
  const [values, setValues] = useState<CitizenFormValues>(citizenToFormValues(initial));
  const [photo, setPhoto] = useState<File | null>(null);

  useEffect(() => {
    setValues(citizenToFormValues(initial));
  }, [initial]);

  function set<K extends keyof CitizenFormValues>(key: K, value: CitizenFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(values, photo);
  }

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-section-title">Personal Information</div>

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
          <label>Suffix (Jr., Sr., III...)</label>
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
          <label>Highest Education</label>
          <select className="form-select" value={values.highest_education} onChange={(e) => set('highest_education', e.target.value)}>
            <option value="">-- Select --</option>
            <option>Elementary</option>
            <option>High School</option>
            <option>Vocational</option>
            <option>College</option>
            <option>Post Graduate</option>
            <option>Doctorate</option>
          </select>
        </div>
        <div className="form-group">
          <label>Educational Status</label>
          <input className="form-control" placeholder="Graduate / Undergraduate" value={values.educational_status} onChange={(e) => set('educational_status', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Profession / Occupation</label>
          <input className="form-control" value={values.profession} onChange={(e) => set('profession', e.target.value)} />
        </div>
        <div className="form-group">
          <label>PhilSys Number</label>
          <input className="form-control" value={values.philsys_number} onChange={(e) => set('philsys_number', e.target.value)} />
        </div>

        <div className="form-section-title">Contact & Address</div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" className="form-control" value={values.email} onChange={(e) => set('email', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Mobile Number</label>
          <input className="form-control" value={values.mobile_number} onChange={(e) => set('mobile_number', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Telephone Number</label>
          <input className="form-control" value={values.telephone_number} onChange={(e) => set('telephone_number', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Region</label>
          <input className="form-control" value={values.region} onChange={(e) => set('region', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Province</label>
          <input className="form-control" value={values.province} onChange={(e) => set('province', e.target.value)} />
        </div>
        <div className="form-group">
          <label>City / Municipality</label>
          <input className="form-control" value={values.city_municipality} onChange={(e) => set('city_municipality', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Barangay</label>
          <input className="form-control" value={values.barangay_address} onChange={(e) => set('barangay_address', e.target.value)} />
        </div>
        <div className="form-group">
          <label>House Address</label>
          <input className="form-control" value={values.house_address} onChange={(e) => set('house_address', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Street</label>
          <input className="form-control" value={values.street} onChange={(e) => set('street', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Subdivision</label>
          <input className="form-control" value={values.subdivision} onChange={(e) => set('subdivision', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Zip Code</label>
          <input className="form-control" value={values.zip_code} onChange={(e) => set('zip_code', e.target.value)} />
        </div>

        <div className="form-section-title">Other Details</div>

        <div className="form-group">
          <label>Blood Type</label>
          <select className="form-select" value={values.blood_type} onChange={(e) => set('blood_type', e.target.value)}>
            <option value="">-- Select --</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bt) => (
              <option key={bt}>{bt}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Weight (kg)</label>
          <input type="number" step="0.1" className="form-control" value={values.weight} onChange={(e) => set('weight', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Height</label>
          <input className="form-control" placeholder={`e.g. 5'7"`} value={values.height} onChange={(e) => set('height', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Citizenship</label>
          <input className="form-control" value={values.citizenship} onChange={(e) => set('citizenship', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Ethnicity</label>
          <input className="form-control" value={values.ethnicity} onChange={(e) => set('ethnicity', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Position in Household</label>
          <input className="form-control" value={values.position_in_household} onChange={(e) => set('position_in_household', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Mother's Maiden Name</label>
          <input className="form-control" value={values.mother_maiden_name} onChange={(e) => set('mother_maiden_name', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Profile Picture</label>
          <input type="file" accept="image/*" className="form-control" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
        </div>

        <div className="span-2" style={{ display: 'flex', gap: 20 }}>
          <div className="checkbox-row">
            <input type="checkbox" id="registered_voter" checked={values.registered_voter} onChange={(e) => set('registered_voter', e.target.checked)} />
            <label htmlFor="registered_voter">Registered Voter</label>
          </div>
          <div className="checkbox-row">
            <input type="checkbox" id="voter_not_resident" checked={values.voter_not_resident} onChange={(e) => set('voter_not_resident', e.target.checked)} />
            <label htmlFor="voter_not_resident">Voter but not a current resident</label>
          </div>
        </div>
      </div>
    </form>
  );
}
