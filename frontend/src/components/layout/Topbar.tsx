import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/inhabitants/citizens': 'Barangay Citizens',
  '/inhabitants/households': 'Barangay Households',
  '/certification': 'Certification',
  '/demographic/populations': 'Populations Demographic',
  '/demographic/households': 'Households Demographic',
  '/reports': 'Reports',
  '/reports/household': 'Household Report',
  '/reports/voters': 'Voters List',
  '/reports/population-by-age': 'Population By Age',
  '/reports/population-by-sector': 'Population By Sector',
  '/reports/population-by-street': 'Population By Street',
};

export function Topbar({ title, onMenuClick }: { title?: string; onMenuClick?: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const initials = (user?.full_name || user?.username || '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="hamburger-btn" onClick={onMenuClick} aria-label="Toggle menu">
          <i className="fas fa-bars"></i>
        </button>
        <strong>{title}</strong>
      </div>
      <div className="user-chip">
        <span className="role-badge">{user?.role}</span>
        <div className="avatar-circle">{initials}</div>
        <div className="user-chip-text">
          <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.full_name}</div>
          <div style={{ fontSize: 11, color: '#999' }}>@{user?.username}</div>
        </div>
        <button className="btn btn-outline" onClick={handleLogout} title="Logout">
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </header>
  );
}

export function pageTitle(pathname: string) {
  return TITLES[pathname] ?? 'RBIS';
}
