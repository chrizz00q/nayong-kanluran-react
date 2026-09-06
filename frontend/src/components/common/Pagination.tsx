export function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 0) return null;

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pages: number[] = [];
  const windowSize = 2;
  for (let p = Math.max(1, page - windowSize); p <= Math.min(totalPages, page + windowSize); p++) {
    pages.push(p);
  }

  return (
    <div className="pagination-bar">
      <span>
        Showing {start}-{end} of {total} records
      </span>
      <div className="pagination-buttons">
        <button disabled={page <= 1} onClick={() => onPageChange(1)}>
          <i className="fas fa-angle-double-left"></i>
        </button>
        <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <i className="fas fa-angle-left"></i>
        </button>
        {pages[0] > 1 && <span>…</span>}
        {pages.map((p) => (
          <button key={p} className={p === page ? 'active' : ''} onClick={() => onPageChange(p)}>
            {p}
          </button>
        ))}
        {pages[pages.length - 1] < totalPages && <span>…</span>}
        <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          <i className="fas fa-angle-right"></i>
        </button>
        <button disabled={page >= totalPages} onClick={() => onPageChange(totalPages)}>
          <i className="fas fa-angle-double-right"></i>
        </button>
      </div>
    </div>
  );
}
