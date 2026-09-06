export function Badge({ text, color }: { text: string; color: 'primary' | 'danger' | 'secondary' | 'success' | 'warning' | 'info' }) {
  return <span className={`badge badge-${color}`}>{text}</span>;
}

export function SexBadge({ sex }: { sex?: string }) {
  const color = sex === 'Male' ? 'primary' : sex === 'Female' ? 'danger' : 'secondary';
  return <Badge text={sex || 'N/A'} color={color} />;
}

export function StatusBadge({ status }: { status?: string }) {
  const map: Record<string, 'warning' | 'success' | 'danger' | 'secondary'> = {
    Pending: 'warning',
    Issued: 'success',
    Expired: 'danger',
    Cancelled: 'secondary',
  };
  return <Badge text={status || 'N/A'} color={map[status || ''] || 'secondary'} />;
}

export function fullName(p: {
  last_name?: string;
  first_name?: string;
  middle_name?: string | null;
  ext_name?: string | null;
}) {
  let name = `${p.last_name ?? ''}, ${p.first_name ?? ''}`;
  if (p.middle_name) name += ` ${p.middle_name[0]}.`;
  if (p.ext_name) name += ` ${p.ext_name}`;
  return name;
}

export function confirmDelete(label: string) {
  return window.confirm(`Are you sure you want to delete "${label}"? This cannot be undone.`);
}
