import { useEffect, useMemo, useState } from 'react';
import { fetchHouseholdReport } from '../../api/reports';
import type { HouseholdReportRow } from '../../api/types';
import { ReportPrintHeader, ReportToolbar } from '../../components/common/ReportHeader';
import { SexBadge, fullName } from '../../components/common/Badges';
import { Pagination } from '../../components/common/Pagination';

const LIMIT = 25;

export function HouseholdReport() {
  const [rows, setRows] = useState<HouseholdReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchHouseholdReport()
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
      <ReportToolbar icon="fa-home" title="Household Report" />

      <ReportPrintHeader
        title="HOUSEHOLD REPORT"
        subtitle={<p>Total Households: {rows.length.toLocaleString()}</p>}
      />

      <p className="report-summary-line no-print">
        Total Households: <strong>{rows.length.toLocaleString()}</strong>
      </p>

      <div className="table-toolbar no-print">
        <div className="search-input">
          <i className="fas fa-search"></i>
          <input
            className="form-control"
            placeholder="Search by household head…"
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
              <th>Head of Household</th>
              <th>Age</th>
              <th>Sex</th>
              <th>Civil Status</th>
              <th>Citizenship</th>
              <th>Occupation</th>
              <th>Members</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="table-empty">Loading…</td>
              </tr>
            ) : pageRows.length === 0 ? (
              <tr>
                <td colSpan={8} className="table-empty">No households found.</td>
              </tr>
            ) : (
              pageRows.map((h, idx) => (
                <tr key={h.id}>
                  <td>{(page - 1) * LIMIT + idx + 1}</td>
                  <td>
                    <strong>{h.last_name}</strong>, {h.first_name}
                    {h.middle_name ? ` ${h.middle_name[0]}.` : ''}
                    {h.ext_name ? <small style={{ color: '#999' }}> {h.ext_name}</small> : null}
                  </td>
                  <td>{h.age ?? 'N/A'}</td>
                  <td><SexBadge sex={h.sex} /></td>
                  <td>{h.civil_status}</td>
                  <td>{h.citizenship || 'N/A'}</td>
                  <td>{h.occupation || 'N/A'}</td>
                  <td><span className="badge badge-info">{h.member_count ?? 0}</span></td>
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
