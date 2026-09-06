import type { Pet } from '../../api/types';
import { uploadUrl } from '../../api/client';
import { Badge } from '../../components/common/Badges';

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="detail-field">
      <label>{label}</label>
      <div>{value || value === 0 ? value : <span style={{ color: '#bbb' }}>—</span>}</div>
    </div>
  );
}

export function PetView({ pet }: { pet: Pet }) {
  const photo = uploadUrl(pet.pet_photo);
  const statusColor = pet.status === 'Active' ? 'success' : pet.status === 'Deceased' ? 'danger' : 'warning';

  return (
    <div>
      <div style={{ display: 'flex', gap: 20, marginBottom: 20, alignItems: 'center' }}>
        {photo ? (
          <img src={photo} className="profile-large" alt="Pet" />
        ) : (
          <div className="profile-large" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-paw" style={{ fontSize: 32, color: '#aaa' }}></i>
          </div>
        )}
        <div>
          <h2 style={{ margin: '0 0 4px' }}>{pet.pet_name}</h2>
          <div style={{ color: '#888' }}>
            {pet.pet_type} {pet.breed ? `• ${pet.breed}` : ''} {pet.gender ? `• ${pet.gender}` : ''}
          </div>
          <div style={{ marginTop: 6 }}>
            <Badge text={pet.status} color={statusColor} />
          </div>
        </div>
      </div>

      <div className="detail-grid">
        <Field label="Color" value={pet.color} />
        <Field label="Weight (kg)" value={pet.weight} />
        <Field label="Microchip Number" value={pet.microchip_number} />
        <Field label="Vaccination Status" value={pet.vaccination_status} />
        <Field label="Registration Date" value={pet.registration_date} />
        <Field label="Owner" value={pet.owner_name} />
      </div>
    </div>
  );
}
