import { useCallback, useEffect, useState } from 'react';
import {
  createHousehold,
  deleteHousehold,
  fetchHousehold,
  fetchHouseholds,
  updateHousehold,
} from '../../api/households';
import type { HouseholdRecord } from '../../api/types';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';
import { Pagination } from '../../components/common/Pagination';
import { SexBadge, confirmDelete, fullName } from '../../components/common/Badges';
import { uploadUrl } from '../../api/client';
import { HouseholdForm, type HouseholdFormValues } from './HouseholdForm';
import { HouseholdView } from './HouseholdView';

export function HouseholdsList() {
  const { hasPermission } = useAuth();
  const [rows, setRows] = useState<HouseholdRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [sex, setSex] = useState('');
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState<null | 'add' | 'edit' | 'view'>(null);
  const [active, setActive] = useState<HouseholdRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    fetchHouseholds({ page, limit, search, sex })
      .then((res) => {
        setRows(res.data);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page, limit, search, sex]);

  useEffect(() => {
    load();
  }, [load]);

  function openAdd() {
    setActive(null);
    setFormError('');
    setModal('add');
  }

  async function openEdit(row: HouseholdRecord) {
    setActive(await fetchHousehold(row.id));
    setFormError('');
    setModal('edit');
  }

  async function openView(row: HouseholdRecord) {
    setActive(await fetchHousehold(row.id));
    setModal('view');
  }

  function closeModal() {
    setModal(null);
    setActive(null);
  }

  async function handleFormSubmit(values: HouseholdFormValues, photo: File | null) {
    setSubmitting(true);
    setFormError('');
    try {
      const payload = { ...values, profile_picture: photo ?? undefined };
      const res = active
        ? await updateHousehold(active.id, payload)
        : await createHousehold(payload);
      if (res.success) {
        closeModal();
        load();
      } else {
        setFormError(res.message || 'Something went wrong.');
      }
    } catch {
      setFormError('Could not save household record. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(row: HouseholdRecord) {
    if (!confirmDelete(fullName(row))) return;
    const res = await deleteHousehold(row.id);
    if (res.success) load();
    else alert(res.message || 'Failed to delete record.');
  }

  return (
    <div>
      <div className="page-header">
        <h1>
          <i className="fas fa-home" style={{ color: 'var(--brand-green-2)' }}></i> Barangay Households
        </h1>
        {hasPermission('inhabitants', 'add') && (
          <button className="btn btn-primary" onClick={openAdd}>
            <i className="fas fa-plus"></i> Add Household Record
          </button>
        )}
      </div>

      <div className="table-toolbar">
        <div className="search-input">
          <i className="fas fa-search"></i>
          <input
            className="form-control"
            placeholder="Search by name or household…"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>
        <div className="filters">
          <select className="form-select" value={sex} onChange={(e) => { setPage(1); setSex(e.target.value); }}>
            <option value="">All Sexes</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Age</th>
              <th>Sex</th>
              <th>Citizenship</th>
              <th>Occupation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="table-empty">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={7} className="table-empty">No household records found.</td></tr>
            ) : (
              rows.map((row) => {
                const photo = uploadUrl(row.profile_picture);
                return (
                  <tr key={row.id}>
                    <td>
                      {photo ? (
                        <img src={photo} className="profile-thumb" alt="" />
                      ) : (
                        <div className="profile-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="fas fa-home" style={{ color: '#aaa', fontSize: 12 }}></i>
                        </div>
                      )}
                    </td>
                    <td>
                      <strong>{row.last_name}</strong>, {row.first_name}
                      {row.middle_name ? ` ${row.middle_name[0]}.` : ''}
                    </td>
                    <td>{row.age ?? 'N/A'}</td>
                    <td><SexBadge sex={row.sex} /></td>
                    <td>{row.citizenship ?? 'N/A'}</td>
                    <td>{row.occupation ?? 'N/A'}</td>
                    <td>
                      <div className="action-icons">
                        <button className="icon-btn view" title="View" onClick={() => openView(row)}>
                          <i className="fas fa-eye"></i>
                        </button>
                        {hasPermission('inhabitants', 'edit') && (
                          <button className="icon-btn edit" title="Edit" onClick={() => openEdit(row)}>
                            <i className="fas fa-edit"></i>
                          </button>
                        )}
                        {hasPermission('inhabitants', 'delete') && (
                          <button className="icon-btn delete" title="Delete" onClick={() => handleDelete(row)}>
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} total={total} limit={limit} onPageChange={setPage} />

      {(modal === 'add' || modal === 'edit') && (
        <Modal
          title={modal === 'add' ? 'Add Household Record' : 'Edit Household Record'}
          onClose={closeModal}
          size="lg"
          footer={
            <>
              <button className="btn btn-secondary" onClick={closeModal} type="button">Cancel</button>
              <button className="btn btn-primary" form="household-form" type="submit" disabled={submitting}>
                {submitting ? 'Saving…' : 'Save Record'}
              </button>
            </>
          }
        >
          {formError && <div className="alert alert-danger">{formError}</div>}
          <HouseholdForm
            formId="household-form"
            initial={active}
            onSubmit={handleFormSubmit}
            onCancel={closeModal}
            submitting={submitting}
          />
        </Modal>
      )}

      {modal === 'view' && active && (
        <Modal title="Household Record Details" onClose={closeModal} size="lg">
          <HouseholdView household={active} />
        </Modal>
      )}
    </div>
  );
}
