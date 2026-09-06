import { useCallback, useEffect, useState } from 'react';
import {
  createCitizen,
  deleteCitizen,
  fetchCitizen,
  fetchCitizens,
  updateCitizen,
} from '../../api/citizens';
import type { Citizen } from '../../api/types';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';
import { Pagination } from '../../components/common/Pagination';
import { SexBadge, confirmDelete, fullName } from '../../components/common/Badges';
import { uploadUrl } from '../../api/client';
import { CitizenForm, type CitizenFormValues } from './CitizenForm';
import { CitizenView } from './CitizenView';

type SortDir = 'ASC' | 'DESC';

export function CitizensList() {
  const { hasPermission } = useAuth();
  const [rows, setRows] = useState<Citizen[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [sex, setSex] = useState('');
  const [civilStatus, setCivilStatus] = useState('');
  const [sort, setSort] = useState('created_at');
  const [dir, setDir] = useState<SortDir>('DESC');
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState<null | 'add' | 'edit' | 'view'>(null);
  const [activeCitizen, setActiveCitizen] = useState<Citizen | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    fetchCitizens({ page, limit, search, sort, dir, sex, civil_status: civilStatus })
      .then((res) => {
        setRows(res.data);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page, limit, search, sort, dir, sex, civilStatus]);

  useEffect(() => {
    load();
  }, [load]);

  function toggleSort(col: string) {
    if (sort === col) {
      setDir(dir === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSort(col);
      setDir('ASC');
    }
  }

  function openAdd() {
    setActiveCitizen(null);
    setFormError('');
    setModal('add');
  }

  async function openEdit(row: Citizen) {
    const full = await fetchCitizen(row.id);
    setActiveCitizen(full);
    setFormError('');
    setModal('edit');
  }

  async function openView(row: Citizen) {
    const full = await fetchCitizen(row.id);
    setActiveCitizen(full);
    setModal('view');
  }

  function closeModal() {
    setModal(null);
    setActiveCitizen(null);
  }

  async function handleFormSubmit(values: CitizenFormValues, photo: File | null) {
    setSubmitting(true);
    setFormError('');
    try {
      const payload = { ...values, profile_picture: photo ?? undefined };
      const res = activeCitizen
        ? await updateCitizen(activeCitizen.id, payload)
        : await createCitizen(payload);
      if (res.success) {
        closeModal();
        load();
      } else {
        setFormError(res.message || 'Something went wrong.');
      }
    } catch {
      setFormError('Could not save citizen. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(row: Citizen) {
    if (!confirmDelete(fullName(row))) return;
    const res = await deleteCitizen(row.id);
    if (res.success) {
      load();
    } else {
      alert(res.message || 'Failed to delete citizen.');
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>
          <i className="fas fa-user" style={{ color: 'var(--brand-green-2)' }}></i> Barangay Citizens
        </h1>
        {hasPermission('inhabitants', 'add') && (
          <button className="btn btn-primary" onClick={openAdd}>
            <i className="fas fa-plus"></i> Add Citizen
          </button>
        )}
      </div>

      <div className="table-toolbar">
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
        <div className="filters">
          <select className="form-select" value={sex} onChange={(e) => { setPage(1); setSex(e.target.value); }}>
            <option value="">All Sexes</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <select
            className="form-select"
            value={civilStatus}
            onChange={(e) => { setPage(1); setCivilStatus(e.target.value); }}
          >
            <option value="">All Civil Status</option>
            <option>Single</option>
            <option>Married</option>
            <option>Widowed</option>
            <option>Divorced</option>
            <option>Separated</option>
          </select>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th></th>
              <th onClick={() => toggleSort('last_name')}>Name {sort === 'last_name' && (dir === 'ASC' ? '↑' : '↓')}</th>
              <th onClick={() => toggleSort('age')}>Age {sort === 'age' && (dir === 'ASC' ? '↑' : '↓')}</th>
              <th>Sex</th>
              <th onClick={() => toggleSort('civil_status')}>
                Civil Status {sort === 'civil_status' && (dir === 'ASC' ? '↑' : '↓')}
              </th>
              <th>Education</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="table-empty">Loading…</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="table-empty">No citizens found.</td>
              </tr>
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
                          <i className="fas fa-user" style={{ color: '#aaa', fontSize: 12 }}></i>
                        </div>
                      )}
                    </td>
                    <td>
                      <strong>{row.last_name}</strong>, {row.first_name}
                      {row.middle_name ? ` ${row.middle_name[0]}.` : ''}
                      {row.ext_name ? <small style={{ color: '#999' }}> {row.ext_name}</small> : null}
                    </td>
                    <td>{row.age ?? 'N/A'}</td>
                    <td><SexBadge sex={row.sex} /></td>
                    <td>{row.civil_status}</td>
                    <td>{row.highest_education ?? 'N/A'}</td>
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
          title={modal === 'add' ? 'Add Citizen' : 'Edit Citizen'}
          onClose={closeModal}
          size="lg"
          footer={
            <>
              <button className="btn btn-secondary" onClick={closeModal} type="button">
                Cancel
              </button>
              <button className="btn btn-primary" form="citizen-form" type="submit" disabled={submitting}>
                {submitting ? 'Saving…' : 'Save Citizen'}
              </button>
            </>
          }
        >
          {formError && <div className="alert alert-danger">{formError}</div>}
          <CitizenForm
            formId="citizen-form"
            initial={activeCitizen}
            onSubmit={handleFormSubmit}
            onCancel={closeModal}
            submitting={submitting}
          />
        </Modal>
      )}

      {modal === 'view' && activeCitizen && (
        <Modal title="Citizen Details" onClose={closeModal} size="lg">
          <CitizenView citizen={activeCitizen} />
        </Modal>
      )}
    </div>
  );
}
