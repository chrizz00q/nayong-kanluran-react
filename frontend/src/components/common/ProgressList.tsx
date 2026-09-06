export function ProgressList({
  items,
  color = '#4e73df',
}: {
  items: { label: string; count: number }[];
  color?: string;
}) {
  const total = items.reduce((sum, i) => sum + i.count, 0);
  return (
    <div style={{ marginTop: 14 }}>
      {items.map((item) => {
        const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
        return (
          <div key={item.label} className="progress-list-row">
            <span className="progress-list-label">{item.label}</span>
            <div className="progress-list-track">
              <div className="progress-list-fill" style={{ width: `${pct}%`, background: color }}>
                {pct > 10 ? `${pct}%` : ''}
              </div>
            </div>
            <span className="badge badge-secondary">{item.count}</span>
          </div>
        );
      })}
    </div>
  );
}
