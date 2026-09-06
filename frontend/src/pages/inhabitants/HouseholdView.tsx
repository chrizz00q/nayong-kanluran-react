import type { HouseholdRecord } from '../../api/types';
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

export function HouseholdView({ household }: { household: HouseholdRecord }) {
  const photo = uploadUrl(household.profile_picture);
  return (
    <div>
      <div style={{ display: 'flex', gap: 20, marginBottom: 20, alignItems: 'center' }}>
        {photo ? (
          <img src={photo} className="profile-large" alt="Profile" />
        ) : (
          <div className="profile-large" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-home" style={{ fontSize: 32, color: '#aaa' }}></i>
          </div>
        )}
        <div>
          <h2 style={{ margin: '0 0 4px' }}>{fullName(household)}</h2>
          <div style={{ color: '#888' }}>
            {household.age ? `${household.age} years old` : ''} {household.sex ? `• ${household.sex}` : ''}{' '}
            {household.civil_status ? `• ${household.civil_status}` : ''}
          </div>
        </div>
      </div>

      <div className="detail-grid">
        <Field label="Household Name" value={household.household_name} />
        <Field label="Household Type" value={household.household_type} />
        <Field label="Dwelling Type" value={household.dwelling_type} />
        <Field label="Position in Household" value={household.position_in_household} />
        <Field label="Tenure Status" value={household.tenure_status} />
        <Field label="Monthly Income" value={household.monthly_income ? `₱${household.monthly_income}` : null} />
        <Field label="Date of Birth" value={household.date_of_birth} />
        <Field label="Place of Birth" value={household.place_of_birth} />
        <Field label="Citizenship" value={household.citizenship} />
        <Field label="Occupation" value={household.occupation} />
        <Field label="Profession" value={household.profession} />
        <Field label="Disability" value={household.disability} />
        <Field label="Pets" value={household.pets} />
      </div>
    </div>
  );
}
