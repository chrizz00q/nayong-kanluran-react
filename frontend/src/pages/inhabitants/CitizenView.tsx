import type { Citizen } from '../../api/types';
import { uploadUrl } from '../../api/client';
import { fullName } from '../../components/common/Badges';

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="detail-field">
      <label>{label}</label>
      <div>{value || value === 0 ? value : <span style={{ color: '#bbb' }}>—</span>}</div>
    </div>
  );
}

export function CitizenView({ citizen }: { citizen: Citizen }) {
  const photo = uploadUrl(citizen.profile_picture);
  return (
    <div>
      <div style={{ display: 'flex', gap: 20, marginBottom: 20, alignItems: 'center' }}>
        {photo ? (
          <img src={photo} className="profile-large" alt="Profile" />
        ) : (
          <div className="profile-large" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-user" style={{ fontSize: 32, color: '#aaa' }}></i>
          </div>
        )}
        <div>
          <h2 style={{ margin: '0 0 4px' }}>{fullName(citizen)}</h2>
          <div style={{ color: '#888' }}>
            {citizen.age ? `${citizen.age} years old` : ''} {citizen.sex ? `• ${citizen.sex}` : ''}{' '}
            {citizen.civil_status ? `• ${citizen.civil_status}` : ''}
          </div>
        </div>
      </div>

      <div className="detail-grid">
        <Field label="Date of Birth" value={citizen.date_of_birth} />
        <Field label="Place of Birth" value={citizen.place_of_birth} />
        <Field label="Highest Education" value={citizen.highest_education} />
        <Field label="Educational Status" value={citizen.educational_status} />
        <Field label="Profession" value={citizen.profession} />
        <Field label="PhilSys Number" value={citizen.philsys_number} />
        <Field label="Email" value={citizen.email} />
        <Field label="Mobile Number" value={citizen.mobile_number} />
        <Field label="Telephone Number" value={citizen.telephone_number} />
        <Field label="Region" value={citizen.region} />
        <Field label="Province" value={citizen.province} />
        <Field label="City / Municipality" value={citizen.city_municipality} />
        <Field label="Barangay" value={citizen.barangay_address} />
        <Field label="House Address" value={citizen.house_address} />
        <Field label="Street" value={citizen.street} />
        <Field label="Subdivision" value={citizen.subdivision} />
        <Field label="Zip Code" value={citizen.zip_code} />
        <Field label="Blood Type" value={citizen.blood_type} />
        <Field label="Weight" value={citizen.weight ? `${citizen.weight} kg` : null} />
        <Field label="Height" value={citizen.height} />
        <Field label="Citizenship" value={citizen.citizenship} />
        <Field label="Ethnicity" value={citizen.ethnicity} />
        <Field label="Position in Household" value={citizen.position_in_household} />
        <Field label="Mother's Maiden Name" value={citizen.mother_maiden_name} />
        <Field label="Registered Voter" value={citizen.registered_voter ? 'Yes' : 'No'} />
        <Field label="Voter, Not a Resident" value={citizen.voter_not_resident ? 'Yes' : 'No'} />
      </div>
    </div>
  );
}
