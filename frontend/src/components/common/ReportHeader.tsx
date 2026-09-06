import type { ReactNode } from 'react';

const GENERATED_AT = new Date().toLocaleString('en-US', {
  month: 'long',
  day: '2-digit',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

export function ReportToolbar({ icon, title, children }: { icon: string; title: string; children?: ReactNode }) {
  return (
    <div className="page-header no-print">
      <h1>
        <i className={`fas ${icon}`} style={{ color: 'var(--brand-green-2)' }}></i> {title}
      </h1>
      <div style={{ display: 'flex', gap: 8 }}>
        {children}
        <button className="btn btn-secondary" onClick={() => window.print()}>
          <i className="fas fa-print"></i> Print
        </button>
      </div>
    </div>
  );
}

export function ReportPrintHeader({ title, subtitle }: { title: string; subtitle?: ReactNode }) {
  return (
    <div className="report-print-header">
      <h1>Republic of the Philippines</h1>
      <h3>Barangay Nayong Kanluran, Quezon City</h3>
      <h4>{title}</h4>
      <p>Generated on: {GENERATED_AT}</p>
      {subtitle}
    </div>
  );
}
