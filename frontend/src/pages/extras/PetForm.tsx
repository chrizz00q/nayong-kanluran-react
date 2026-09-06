import { useEffect, useState, type FormEvent } from 'react';
import type { Pet } from '../../api/types';
import { OwnerPicker } from './OwnerPicker';
import { ownerFullName } from '../../api/pets';

export interface PetFormValues {
  owner_id: number | null;
  pet_name: string;
  pet_type: string;
  breed: string;
  color: string;
  gender: string;
  weight: string;
  microchip_number: string;
  vaccination_status: string;
  registration_date: string;
  status: string;
}

const EMPTY: PetFormValues = {
  owner_id: null,
  pet_name: '',
  pet_type: 'Dog',
  breed: '',
  color: '',
  gender: 'Male',
  weight: '',
  microchip_number: '',
  vaccination_status: 'None',
  registration_date: '',
  status: 'Active',
};

function petToFormValues(p?: Pet | null): PetFormValues {
  if (!p) return EMPTY;
  return {
    owner_id: p.owner_id ?? null,
    pet_name: p.pet_name ?? '',
    pet_type: p.pet_type ?? 'Dog',
    breed: p.breed ?? '',
    color: p.color ?? '',
    gender: p.gender ?? 'Male',
    weight: p.weight != null ? String(p.weight) : '',
    microchip_number: p.microchip_number ?? '',
    vaccination_status: p.vaccination_status ?? 'None',
    registration_date: p.registration_date ?? '',
    status: p.status ?? 'Active',
  };
}

export function PetForm({
  initial,
  onSubmit,
  submitting,
  formId,
}: {
  initial?: Pet | null;
  onSubmit: (values: PetFormValues, photo: File | null) => void;
  onCancel: () => void;
  submitting: boolean;
  formId: string;
}) {
  const [values, setValues] = useState<PetFormValues>(petToFormValues(initial));
  const [ownerLabel, setOwnerLabel] = useState(initial?.owner_name ?? '');
  const [photo, setPhoto] = useState<File | null>(null);

  useEffect(() => {
    setValues(petToFormValues(initial));
    setOwnerLabel(initial?.owner_name ?? '');
    setPhoto(null);
  }, [initial]);

  function set<K extends keyof PetFormValues>(key: K, value: PetFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(values, photo);
  }

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-section-title">Pet Information</div>

        <div className="form-group">
          <label>Pet Name *</label>
          <input className="form-control" required value={values.pet_name} onChange={(e) => set('pet_name', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Pet Type *</label>
          <select className="form-select" required value={values.pet_type} onChange={(e) => set('pet_type', e.target.value)}>
            <option>Dog</option>
            <option>Cat</option>
            <option>Bird</option>
            <option>Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Breed</label>
          <input className="form-control" value={values.breed} onChange={(e) => set('breed', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Color</label>
          <input className="form-control" value={values.color} onChange={(e) => set('color', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select className="form-select" value={values.gender} onChange={(e) => set('gender', e.target.value)}>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
        <div className="form-group">
          <label>Weight (kg)</label>
          <input type="number" step="0.1" className="form-control" value={values.weight} onChange={(e) => set('weight', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Microchip Number</label>
          <input className="form-control" value={values.microchip_number} onChange={(e) => set('microchip_number', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Vaccination Status</label>
          <select className="form-select" value={values.vaccination_status} onChange={(e) => set('vaccination_status', e.target.value)}>
            <option>None</option>
            <option>Partial</option>
            <option>Complete</option>
          </select>
        </div>
        <div className="form-group">
          <label>Registration Date</label>
          <input type="date" className="form-control" value={values.registration_date ?? ''} onChange={(e) => set('registration_date', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select className="form-select" value={values.status} onChange={(e) => set('status', e.target.value)}>
            <option>Active</option>
            <option>Inactive</option>
            <option>Deceased</option>
          </select>
        </div>

        <div className="form-section-title">Owner</div>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Owner *</label>
          <OwnerPicker
            value={values.owner_id}
            initialLabel={ownerLabel}
            onChange={(id, label) => {
              set('owner_id', id);
              setOwnerLabel(label);
            }}
          />
        </div>

        <div className="form-section-title">Photo</div>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Pet Photo {initial ? '(leave blank to keep current)' : ''}</label>
          <input type="file" accept="image/*" className="form-control" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
        </div>
      </div>
    </form>
  );
}

// re-export for convenience where owner label formatting is needed elsewhere
export { ownerFullName };
