import { useCallback, useEffect, useState } from 'react';
import {
  createPet,
  deletePet,
  fetchPet,
  fetchPetStats,
  fetchPets,
  updatePet,
} from '../../api/pets';
import type { Pet, PetStats } from '../../api/types';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';
import { Pagination } from '../../components/common/Pagination';
import { Badge, confirmDelete } from '../../components/common/Badges';
import { uploadUrl } from '../../api/client';
import { PetForm, type PetFormValues } from './PetForm';
import { PetView } from './PetView';

type SortDir = 'ASC' | 'DESC';

function statusColor(status: string): 'success' | 'warning' | 'danger' | 'secondary' {
  if (status === 'Active') return 'success';
  if (status === 'Deceased') return 'danger';
  if (status === 'Inactive') return 'warning';
  return 'secondary';
}

export function PetsList() {
  const { hasPermission } = useAuth();
  const [rows, setRows] = useState<Pet[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [petType, setPetType] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('created_at');
  const [dir, setDir] = useState<SortDir>('DESC');
  const [stats, setStats] = useState<PetStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState<null | 'add' | 'edit' | 'view'>(null);
  const [active, setActive] = useState<Pet | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    fetchPets({ page, limit, search, sort, dir, pet_type: petType, status })
      .then((res) => {
        setRows(res.data);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page, limit, search, sort, dir, petType, status]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    fetchPetStats().then(setStats).catch(() => setStats(null));
  }, [rows.length]);

  function toggleSort(col: string) {
    if (sort === col) {
      setDir(dir === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSort(col);
      setDir('ASC');
    }
  }

  function openAdd() {
    setActive(null);
    setFormError('');
    setModal('add');
  }

  async function openEdit(row: Pet) {
    setActive(await fetchPet(row.id));
    setFormError('');
    setModal('edit');
  }

  async function openView(row: Pet) {
    setActive(await fetchPet(row.id));
    setModal('view');
  }

  function closeModal() {
    setModal(null);
    setActive(null);
  }

  async function handleFormSubmit(values: PetFormValues, photo: File | null) {
    if (!values.owner_id) {
      setFormError('Please select an owner.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      const payload = { ...values, pet_photo: photo ?? undefined };
      const res = active ? await updatePet(active.id, payload) : await createPet(payload);
      if (res.success) {
        closeModal();
        load();
      } else {
        setFormError(res.message || 'Something went wrong.');
      }
    } catch {
      setFormError('Could not save pet. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(row: Pet) {
    if (!confirmDelete(row.pet_name)) return;
    const res = await deletePet(row.id);
    if (res.success) {
      load();
    } else {
      alert(res.message || 'Failed to delete pet.');
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>
          <i className="fas fa-paw" style={{ color: 'var(--brand-green-2)' }}></i> Pets
        </h1>
        {hasPermission('extras', 'add') && (
          <button className="btn btn-primary" onClick={openAdd}>
            <i className="fas fa-plus"></i> Add Pet
          </button>
        )}
      </div>

      {stats && (
        <div className="stat-grid">
          <div className="stat-card bg-households">
            <div>
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Pets</div>
            </div>
            <i className="fas fa-paw"></i>
          </div>
          <div className="stat-card bg-population">
            <div>
              <div className="stat-number">{stats.active}</div>
              <div className="stat-label">Active</div>
            </div>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-card bg-female">
            <div>
              <div className="stat-number">{stats.inactive}</div>
              <div className="stat-label">Inactive</div>
            </div>
            <i className="fas fa-pause-circle"></i>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #e74a3b, #c0392b)' }}>
            <div>
              <div className="stat-number">{stats.deceased}</div>
              <div className="stat-label">Deceased</div>
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
            placeholder="Search by pet name, type, breed, or owner…"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>
        <div className="filters">
          <select className="form-select" value={petType} onChange={(e) => { setPage(1); setPetType(e.target.value); }}>
            <option value="">All Types</option>
            <option>Dog</option>
            <option>Cat</option>
            <option>Bird</option>
            <option>Other</option>
          </select>
          <select className="form-select" value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
            <option value="">All Status</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Deceased</option>
          </select>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th></th>
              <th onClick={() => toggleSort('pet_name')}>Name {sort === 'pet_name' && (dir === 'ASC' ? '↑' : '↓')}</th>
              <th onClick={() => toggleSort('pet_type')}>Type {sort === 'pet_type' && (dir === 'ASC' ? '↑' : '↓')}</th>
              <th onClick={() => toggleSort('breed')}>Breed {sort === 'breed' && (dir === 'ASC' ? '↑' : '↓')}</th>
              <th>Color</th>
              <th onClick={() => toggleSort('status')}>Status {sort === 'status' && (dir === 'ASC' ? '↑' : '↓')}</th>
              <th>Owner</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="table-empty">Loading…</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="table-empty">No pets found.</td>
              </tr>
            ) : (
              rows.map((row) => {
                const photo = uploadUrl(row.pet_photo);
                return (
                  <tr key={row.id}>
                    <td>
                      {photo ? (
                        <img src={photo} className="profile-thumb" alt="" />
                      ) : (
                        <div className="profile-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="fas fa-paw" style={{ color: '#aaa', fontSize: 12 }}></i>
                        </div>
                      )}
                    </td>
                    <td><strong>{row.pet_name}</strong></td>
                    <td>{row.pet_type}</td>
                    <td>{row.breed || 'N/A'}</td>
                    <td>{row.color || 'N/A'}</td>
                    <td><Badge text={row.status} color={statusColor(row.status)} /></td>
                    <td>{row.owner_name || 'Unassigned'}</td>
                    <td>
                      <div className="action-icons">
                        <button className="icon-btn view" title="View" onClick={() => openView(row)}>
                          <i className="fas fa-eye"></i>
                        </button>
                        {hasPermission('extras', 'edit') && (
                          <button className="icon-btn edit" title="Edit" onClick={() => openEdit(row)}>
                            <i className="fas fa-edit"></i>
                          </button>
                        )}
                        {hasPermission('extras', 'delete') && (
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
          title={modal === 'add' ? 'Add Pet' : 'Edit Pet'}
          onClose={closeModal}
          size="lg"
          footer={
            <>
              <button className="btn btn-secondary" onClick={closeModal} type="button">
                Cancel
              </button>
              <button className="btn btn-primary" form="pet-form" type="submit" disabled={submitting}>
                {submitting ? 'Saving…' : 'Save Pet'}
              </button>
            </>
          }
        >
          {formError && <div className="alert alert-danger">{formError}</div>}
          <PetForm
            formId="pet-form"
            initial={active}
            onSubmit={handleFormSubmit}
            onCancel={closeModal}
            submitting={submitting}
          />
        </Modal>
      )}

      {modal === 'view' && active && (
        <Modal title="Pet Details" onClose={closeModal} size="lg">
          <PetView pet={active} />
        </Modal>
      )}
    </div>
  );
}
