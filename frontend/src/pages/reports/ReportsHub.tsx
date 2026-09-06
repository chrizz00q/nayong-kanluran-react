import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDashboardStats } from '../../api/dashboard';
import type { DashboardStats } from '../../api/types';

interface ReportCard {
  href: string;
  icon: string;
  color: string;
  title: string;
  description: string;
  badge: (stats: DashboardStats | null) => string;
  tags: { icon: string; label: string }[];
}

const REPORTS: ReportCard[] = [
  {
    href: '/reports/household',
    icon: 'fa-home',
    color: '#1cc88a',
    title: 'Household Report',
    description: 'Complete list of all registered households with member details',
    badge: (s) => (s ? s.total_households.toLocaleString() : '—'),
    tags: [
      { icon: 'fa-print', label: 'Printable' },
      { icon: 'fa-table', label: 'Table' },
    ],
  },
  {
    href: '/reports/voters',
    icon: 'fa-vote-yea',
    color: '#4e73df',
    title: 'Voters List',
    description: 'List of eligible voters (18+ years old) with their information',
    badge: (s) => (s ? s.total_individuals.toLocaleString() : '—'),
    tags: [
      { icon: 'fa-print', label: 'Printable' },
      { icon: 'fa-table', label: 'Table' },
    ],
  },
  {
    href: '/reports/population-by-age',
    icon: 'fa-calendar-alt',
    color: '#36b9cc',
    title: 'Population By Age',
    description: 'Age distribution analysis with charts and detailed breakdown',
    badge: () => 'Chart',
    tags: [
      { icon: 'fa-chart-bar', label: 'Chart' },
      { icon: 'fa-print', label: 'Printable' },
    ],
  },
  {
    href: '/reports/population-by-sector',
    icon: 'fa-building',
    color: '#f6c23e',
    title: 'Population By Sector',
    description: 'Population distribution by business/employment sectors',
    badge: () => 'Sectors',
    tags: [
      { icon: 'fa-chart-pie', label: 'Chart' },
      { icon: 'fa-print', label: 'Printable' },
    ],
  },
  {
    href: '/reports/population-by-street',
    icon: 'fa-road',
    color: '#e74a3b',
    title: 'Population By Street',
    description: 'Population distribution by street/address location',
    badge: () => 'Streets',
    tags: [
      { icon: 'fa-map-marker-alt', label: 'Map' },
      { icon: 'fa-print', label: 'Printable' },
    ],
  },
];

export function ReportsHub() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetchDashboardStats().then(setStats).catch(() => setStats(null));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>
          <i className="fas fa-chart-line" style={{ color: 'var(--brand-green-2)' }}></i> Reports
        </h1>
      </div>

      {stats && (
        <div className="stat-grid">
          <div className="stat-card bg-households">
            <div>
              <div className="stat-number">{stats.total_households}</div>
              <div className="stat-label">Households</div>
            </div>
            <i className="fas fa-home"></i>
          </div>
          <div className="stat-card bg-population">
            <div>
              <div className="stat-number">{stats.total_individuals}</div>
              <div className="stat-label">Individuals</div>
            </div>
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-card bg-male">
            <div>
              <div className="stat-number">{stats.total_male}</div>
              <div className="stat-label">Male</div>
            </div>
            <i className="fas fa-mars"></i>
          </div>
          <div className="stat-card bg-female">
            <div>
              <div className="stat-number">{stats.total_female}</div>
              <div className="stat-label">Female</div>
            </div>
            <i className="fas fa-venus"></i>
          </div>
        </div>
      )}

      <p style={{ color: '#888', marginBottom: 20 }}>
        Pick a report below, or use the Reports menu in the sidebar.
      </p>

      <div className="report-grid">
        {REPORTS.map((r) => (
          <Link key={r.href} to={r.href} className="report-card-link">
            <div className="report-card-icon" style={{ color: r.color, borderColor: r.color }}>
              <i className={`fas ${r.icon}`}></i>
            </div>
            <div style={{ flex: 1 }}>
              <div className="report-card-title">
                {r.title}
                <span className="badge badge-secondary" style={{ float: 'right' }}>
                  {r.badge(stats)}
                </span>
              </div>
              <div className="report-card-desc">{r.description}</div>
              <div className="report-card-tags">
                {r.tags.map((t) => (
                  <span key={t.label} className="badge badge-secondary">
                    <i className={`fas ${t.icon}`}></i> {t.label}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
