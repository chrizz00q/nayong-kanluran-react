import { useEffect, useState, type FormEvent } from 'react';
import type { Certificate } from '../../api/types';
import { residentFullName } from '../../api/certificates';
import { ResidentPicker } from './ResidentPicker';

const CERT_TYPES = [
  'Barangay Clearance',
  'Certificate of Residency',
  'Certificate of Indigency',
  'Certificate of Good Moral Character',
  'Business Clearance',
  'Certificate of No Pending Case',
];

export interface CertificateFormValues {
  resident_id: number | null;
  certificate_type: string;
  certificate_number: string;
  purpose: string;
  status: string;
  issued_date: string;
  expiry_date: string;
}

function toFormValues(c?: Certificate | null): CertificateFormValues {
  if (!c) {
    return {
      resident_id: null,
      certificate_type: CERT_TYPES[0],
      certificate_number: '',
      purpose: '',
      status: 'Pending',
      issued_date: new Date().toISOString().slice(0, 10),
      expiry_date: '',
    };
  }
  return {
    resident_id: c.resident_id,
    certificate_type: c.certificate_type,
    certificate_number: c.certificate_number,
    purpose: c.purpose ?? '',
    status: c.status,
    issued_date: c.issued_date ?? '',
    expiry_date: c.expiry_date ?? '',
  };
}

export function CertificateForm({
  initial,
  onSubmit,
  submitting,
  formId,
}: {
  initial?: Certificate | null;
  onSubmit: (values: CertificateFormValues) => void;
  submitting: boolean;
  formId: string;
}) {
  const [values, setValues] = useState<CertificateFormValues>(toFormValues(initial));

  useEffect(() => {
    setValues(toFormValues(initial));
  }, [initial]);

  function set<K extends keyof CertificateFormValues>(key: K, value: CertificateFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!values.resident_id) return;
    onSubmit(values);
  }

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="span-2 form-group">
          <label>Resident *</label>
          <ResidentPicker
            value={values.resident_id}
            initialLabel={initial ? residentFullName(initial) : ''}
            onChange={(id) => set('resident_id', id)}
          />
        </div>

        <div className="form-group">
          <label>Certificate Type *</label>
          <select
            className="form-select"
            required
            value={values.certificate_type}
            onChange={(e) => set('certificate_type', e.target.value)}
          >
            {CERT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Certificate Number</label>
          <input
            className="form-control"
            placeholder="Auto-generated if left blank"
            value={values.certificate_number}
            onChange={(e) => set('certificate_number', e.target.value)}
          />
        </div>
        <div className="form-group span-2">
          <label>Purpose</label>
          <textarea
            className="form-control"
            rows={2}
            value={values.purpose}
            onChange={(e) => set('purpose', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select className="form-select" value={values.status} onChange={(e) => set('status', e.target.value)}>
            <option>Pending</option>
            <option>Issued</option>
            <option>Expired</option>
            <option>Cancelled</option>
          </select>
        </div>
        <div className="form-group">
          <label>Issued Date</label>
          <input
            type="date"
            className="form-control"
            value={values.issued_date}
            onChange={(e) => set('issued_date', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Expiry Date</label>
          <input
            type="date"
            className="form-control"
            value={values.expiry_date}
            onChange={(e) => set('expiry_date', e.target.value)}
          />
        </div>
      </div>
    </form>
  );
}
