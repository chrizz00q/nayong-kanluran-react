import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  to: string;
  icon: string;
  label: string;
}

interface NavGroup {
  key: string;
  icon: string;
  label: string;
  items: NavItem[];
}

const GROUPS: NavGroup[] = [
  {
    key: 'inhabitants',
    icon: 'fa-users',
    label: 'Inhabitants',
    items: [
      { to: '/inhabitants/citizens', icon: 'fa-user', label: 'Barangay Citizens' },
      { to: '/inhabitants/households', icon: 'fa-home', label: 'Barangay Households' },
    ],
  },
  {
    key: 'demographic',
    icon: 'fa-chart-bar',
    label: 'Demographic',
    items: [
      { to: '/demographic/populations', icon: 'fa-users', label: 'Populations Demographic' },
      { to: '/demographic/households', icon: 'fa-home', label: 'Households Demographic' },
    ],
  },
  {
    key: 'reports',
    icon: 'fa-file-alt',
    label: 'Reports',
    items: [
      { to: '/reports/household', icon: 'fa-home', label: 'Household' },
      { to: '/reports/voters', icon: 'fa-clipboard-list', label: 'Voters List' },
      { to: '/reports/population-by-age', icon: 'fa-calendar-alt', label: 'Population By Age' },
      { to: '/reports/population-by-sector', icon: 'fa-building', label: 'Population By Sector' },
      { to: '/reports/population-by-street', icon: 'fa-map-marker-alt', label: 'Population By Street' },
    ],
  },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useLocation();
  const { hasPermission } = useAuth();
  const [openGroup, setOpenGroup] = useState<string | null>(
    GROUPS.find((g) => g.items.some((i) => location.pathname.startsWith(i.to)))?.key ?? null
  );

  return (
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="sidebar-brand">
        <button className="sidebar-close" onClick={onClose} aria-label="Close menu">
          <i className="fas fa-times"></i>
        </button>
        <div className="brand-icon">
          <i className="fas fa-landmark"></i>
        </div>
        <div className="brand-text">RBIS</div>
        <div className="brand-sub">Registry of Barangay Inhabitants</div>
      </div>

      <nav>
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <i className="fas fa-chart-pie"></i> Dashboard
        </NavLink>

        {GROUPS.map((group) => {
          if (!hasPermission(group.key, 'view')) return null;
          const isOpen = openGroup === group.key;
          return (
            <div key={group.key}>
              <div
                className="nav-link"
                onClick={() => setOpenGroup(isOpen ? null : group.key)}
              >
                <i className={`fas ${group.icon}`}></i>
                <span style={{ flex: 1 }}>{group.label}</span>
                <i className={`fas fa-chevron-down`} style={{ transform: isOpen ? 'none' : 'rotate(-90deg)', fontSize: 11 }}></i>
              </div>
              {isOpen && (
                <div className="nav-sub">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                      <i className={`fas ${item.icon}`}></i> {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {hasPermission('certification', 'view') && (
          <NavLink to="/certification" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="fas fa-certificate"></i> Certification
          </NavLink>
        )}

        {hasPermission('extras', 'view') && (
          <NavLink to="/extras/pets" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="fas fa-paw"></i> Pets
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <a href="#" onClick={(e) => e.preventDefault()}>
          RBIS v1.0.0 &copy; {new Date().getFullYear()}
        </a>
      </div>
    </aside>
  );
}
