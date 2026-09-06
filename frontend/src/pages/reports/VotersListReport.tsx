import { useEffect, useMemo, useState } from 'react';
import { fetchVotersReport } from '../../api/reports';
import type { Citizen } from '../../api/types';
import { ReportPrintHeader, ReportToolbar } from '../../components/common/ReportHeader';
import { SexBadge, fullName } from '../../components/common/Badges';
import { Pagination } from '../../components/common/Pagination';

const LIMIT = 25;

export function VotersListReport() {
  const [rows, setRows] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchVotersReport()
      .then((res) => setRows(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => fullName(r).toLowerCase().includes(q));
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / LIMIT));
  const pageRows = filtered.slice((page - 1) * LIMIT, page * LIMIT);

  return (
    <div>
      <ReportToolbar icon="fa-vote-yea" title="Voters List" />

      <ReportPrintHeader
        title="VOTERS LIST"
        subtitle={<p>Total Eligible Voters (18+): {rows.length.toLocaleString()}</p>}
      />

      <p className="report-summary-line no-print">
        Total Eligible Voters (18+): <strong>{rows.length.toLocaleString()}</strong>
      </p>

      <div className="table-toolbar no-print">
        <div className="search-input">
          <i className="fas fa-search"></i>
          <input
            className="form-control"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Age</th>
              <th>Sex</th>
              <th>Civil Status</th>
              <th>Education</th>
              <th>Place of Birth</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="table-empty">Loading…</td>
              </tr>
            ) : pageRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="table-empty">No eligible voters found.</td>
              </tr>
            ) : (
              pageRows.map((v, idx) => (
                <tr key={v.id}>
                  <td>{(page - 1) * LIMIT + idx + 1}</td>
                  <td>
                    <strong>{v.last_name}</strong>, {v.first_name}
                    {v.middle_name ? ` ${v.middle_name[0]}.` : ''}
                  </td>
                  <td>{v.age}</td>
                  <td><SexBadge sex={v.sex} /></td>
                  <td>{v.civil_status}</td>
                  <td>{v.highest_education || 'N/A'}</td>
                  <td>{v.place_of_birth || 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="no-print">
        <Pagination
          page={page}
          totalPages={totalPages}
          total={filtered.length}
          limit={LIMIT}
          onPageChange={setPage}
        />
      </div>

      <div className="report-print-header" style={{ borderBottom: 'none', borderTop: '1px solid #ccc', marginTop: 20 }}>
        <p style={{ textAlign: 'center' }}>
          <small>This is a computer-generated report. For official use only.</small>
        </p>
      </div>
    </div>
  );
}
