import { useCallback, useEffect, useState } from 'react';
import {
  certificatePrintUrl,
  createCertificate,
  deleteCertificate,
  fetchCertificate,
  fetchCertificateStats,
  fetchCertificates,
  updateCertificate,
} from '../../api/certificates';
import type { Certificate, CertificateStats } from '../../api/types';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';
import { Pagination } from '../../components/common/Pagination';
import { StatusBadge, confirmDelete } from '../../components/common/Badges';
import { CertificateForm, type CertificateFormValues } from './CertificateForm';

export function CertificatesList() {
  const { hasPermission } = useAuth();
  const [rows, setRows] = useState<Certificate[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [stats, setStats] = useState<CertificateStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState<null | 'add' | 'edit'>(null);
  const [active, setActive] = useState<Certificate | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    fetchCertificates({ page, limit, search, status })
      .then((res) => {
        setRows(res.data);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page, limit, search, status]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    fetchCertificateStats().then(setStats).catch(() => setStats(null));
  }, [rows.length]);

  function openAdd() {
    setActive(null);
    setFormError('');
    setModal('add');
  }

  async function openEdit(row: Certificate) {
    setActive(await fetchCertificate(row.id));
    setFormError('');
    setModal('edit');
  }

  function closeModal() {
    setModal(null);
    setActive(null);
  }

  async function handleFormSubmit(values: CertificateFormValues) {
    setSubmitting(true);
    setFormError('');
    try {
      const res = active
        ? await updateCertificate(active.id, { ...values })
        : await createCertificate({ ...values });
      if (res.success) {
        closeModal();
        load();
      } else {
        setFormError(res.message || 'Something went wrong.');
      }
    } catch {
      setFormError('Could not save certificate. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(row: Certificate) {
    if (!confirmDelete(`${row.certificate_type} #${row.certificate_number}`)) return;
    const res = await deleteCertificate(row.id);
    if (res.success) load();
    else alert(res.message || 'Failed to delete certificate.');
  }

  return (
    <div>
      <div className="page-header">
        <h1>
          <i className="fas fa-certificate" style={{ color: 'var(--brand-green-2)' }}></i> Certification
        </h1>
        {hasPermission('certification', 'add') && (
          <button className="btn btn-primary" onClick={openAdd}>
            <i className="fas fa-plus"></i> Issue Certificate
          </button>
        )}
      </div>

      {stats && (
        <div className="stat-grid">
          <div className="stat-card bg-households">
            <div>
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Certificates</div>
            </div>
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="stat-card bg-population">
            <div>
              <div className="stat-number">{stats.issued}</div>
              <div className="stat-label">Issued</div>
            </div>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-card bg-female">
            <div>
              <div className="stat-number">{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #e74a3b, #c0392b)' }}>
            <div>
              <div className="stat-number">{stats.expired}</div>
              <div className="stat-label">Expired</div>
            </div>
            <i className="fas fa-times-circle"></i>
          </div>
        </div>
      )}

      <div className="table-toolbar">
        <div className="search-input">
          <i className="fas fa-search"></i>
          <input
            className="form-control"
            placeholder="Search by name, type, or number…"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>
        <div className="filters">
          <select className="form-select" value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
            <option value="">All Status</option>
            <option>Pending</option>
            <option>Issued</option>
            <option>Expired</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Certificate No.</th>
              <th>Resident</th>
              <th>Type</th>
              <th>Issued Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="table-empty">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} className="table-empty">No certificates found.</td></tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.certificate_number}</td>
                  <td>
                    {row.last_name}, {row.first_name}
                    {row.middle_name ? ` ${row.middle_name[0]}.` : ''}
                  </td>
                  <td>{row.certificate_type}</td>
                  <td>{row.issued_date ?? 'N/A'}</td>
                  <td><StatusBadge status={row.status} /></td>
                  <td>
                    <div className="action-icons">
                      <a
                        className="icon-btn print"
                        title="Print"
                        href={certificatePrintUrl(row.id)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="fas fa-print"></i>
                      </a>
                      {hasPermission('certification', 'edit') && (
                        <button className="icon-btn edit" title="Edit" onClick={() => openEdit(row)}>
                          <i className="fas fa-edit"></i>
                        </button>
                      )}
                      {hasPermission('certification', 'delete') && (
                        <button className="icon-btn delete" title="Delete" onClick={() => handleDelete(row)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} total={total} limit={limit} onPageChange={setPage} />

      {(modal === 'add' || modal === 'edit') && (
        <Modal
          title={modal === 'add' ? 'Issue Certificate' : 'Edit Certificate'}
          onClose={closeModal}
          footer={
            <>
              <button className="btn btn-secondary" onClick={closeModal} type="button">Cancel</button>
              <button className="btn btn-primary" form="certificate-form" type="submit" disabled={submitting}>
                {submitting ? 'Saving…' : 'Save Certificate'}
              </button>
            </>
          }
        >
          {formError && <div className="alert alert-danger">{formError}</div>}
          <CertificateForm
            formId="certificate-form"
            initial={active}
            onSubmit={handleFormSubmit}
            submitting={submitting}
          />
        </Modal>
      )}
    </div>
  );
}
