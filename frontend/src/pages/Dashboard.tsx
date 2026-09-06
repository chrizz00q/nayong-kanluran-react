import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import '../lib/chartSetup';
import { fetchDashboardStats, fetchDemographics, fetchRecentActivities } from '../api/dashboard';
import { fetchCitizens } from '../api/citizens';
import type { AuditActivity, Citizen, DashboardStats, DemographicsData } from '../api/types';
import { uploadUrl } from '../api/client';

const GENDER_COLORS = ['#4e73df', '#e74a3b', '#6c757d'];
const AGE_COLORS = ['#36b9cc', '#4e73df', '#1cc88a', '#f6c23e', '#e74a3b', '#6c757d', '#8892b0'];

const ACTION_COLORS: Record<string, string> = {
  CREATE: 'success',
  UPDATE: 'warning',
  DELETE: 'danger',
  LOGIN: 'info',
  LOGOUT: 'secondary',
};

function timeAgo(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric' });
}

function timeOfDay(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [demo, setDemo] = useState<DemographicsData | null>(null);
  const [recentCitizens, setRecentCitizens] = useState<Citizen[]>([]);
  const [activities, setActivities] = useState<AuditActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetchDashboardStats(),
      fetchDemographics().catch(() => null),
      fetchCitizens({ page: 1, limit: 5, sort: 'created_at', dir: 'DESC' }).catch(() => null),
      fetchRecentActivities(10).catch(() => []),
    ])
      .then(([statsRes, demoRes, citizensRes, activitiesRes]) => {
        setStats(statsRes);
        setDemo(demoRes);
        setRecentCitizens(citizensRes?.data ?? []);
        setActivities(activitiesRes ?? []);
      })
      .catch(() => setError('Failed to load dashboard statistics.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="table-empty">Loading dashboard…</div>;
  }

  if (error || !stats) {
    return <div className="alert alert-danger">{error || 'No data available.'}</div>;
  }

  const genderData = [
    { name: 'Male', value: stats.total_male },
    { name: 'Female', value: stats.total_female },
  ].filter((g) => g.value > 0);
  const genderTotal = genderData.reduce((sum, g) => sum + g.value, 0);
  // Defensive: some PHP/PDO setups return COUNT(*) as numeric strings, which
  // would otherwise turn this sum into string concatenation (e.g. "0"+"2"+"1")
  // instead of addition, silently breaking every percentage below.
  const ageTop5 = (demo?.age_distribution ?? [])
    .slice(0, 5)
    .map((a) => ({ ...a, count: Number(a.count) || 0 }));
  const ageTotal = ageTop5.reduce((sum, a) => sum + a.count, 0);

  const total = stats.total_individuals + stats.total_households;
  const indPct = total > 0 ? Math.round((stats.total_individuals / total) * 100) : 0;
  const hshPct = total > 0 ? Math.round((stats.total_households / total) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <h1>
          <i className="fas fa-chart-pie" style={{ color: 'var(--brand-green-2)' }}></i> Dashboard
        </h1>
      </div>

      <div className="stat-grid">
        <div className="stat-card bg-households">
          <div>
            <div className="stat-number">{stats.total_households.toLocaleString()}</div>
            <div className="stat-label">Total Households</div>
          </div>
          <i className="fas fa-home"></i>
        </div>
        <div className="stat-card bg-population">
          <div>
            <div className="stat-number">{stats.total_population.toLocaleString()}</div>
            <div className="stat-label">Total Population</div>
          </div>
          <i className="fas fa-users"></i>
        </div>
        <div className="stat-card bg-male">
          <div>
            <div className="stat-number">{stats.total_male.toLocaleString()}</div>
            <div className="stat-label">Male Residents</div>
          </div>
          <i className="fas fa-mars"></i>
        </div>
        <div className="stat-card bg-female">
          <div>
            <div className="stat-number">{stats.total_female.toLocaleString()}</div>
            <div className="stat-label">Female Residents</div>
          </div>
          <i className="fas fa-venus"></i>
        </div>
      </div>

      <div className="birthday-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="birthday-icon">
            <i className="fas fa-birthday-cake"></i>
          </div>
          <div>
            <span className="birthday-count">{stats.birthday_today}</span> citizen(s) celebrating a
            birthday today!
          </div>
        </div>
        {stats.birthday_today > 0 ? (
          <div className="chip-list">
            {stats.birthday_celebrants.map((c, i) => (
              <div className="chip" key={i}>
                <span className="birthday-avatar">{c.full_name.slice(0, 1)}</span>
                {c.full_name}
              </div>
            ))}
          </div>
        ) : (
          <span style={{ color: '#999' }}>
            <i className="fas fa-mug-hot"></i> No birthdays today. Check back tomorrow!
          </span>
        )}
      </div>

      <div className="quick-action-row">
        <Link className="quick-action-btn" to="/inhabitants/citizens">
          <i className="fas fa-user"></i> View Citizens
        </Link>
        <Link className="quick-action-btn" to="/inhabitants/households">
          <i className="fas fa-home"></i> View Households
        </Link>
        <Link className="quick-action-btn" to="/demographic/populations">
          <i className="fas fa-chart-bar"></i> Demographics
        </Link>
        <Link className="quick-action-btn" to="/certification">
          <i className="fas fa-certificate"></i> Certificates
        </Link>
        <Link className="quick-action-btn" to="/reports">
          <i className="fas fa-file-alt"></i> Reports
        </Link>
      </div>

      <div className="grid-dashboard">
        <div className="dashboard-col-left">
          <div className="card list-card">
            <div className="list-card-header">
              <h3>
                <i className="fas fa-user-plus" style={{ color: 'var(--info)' }}></i> Recent Citizens
              </h3>
              <Link to="/inhabitants/citizens">View All</Link>
            </div>
            {recentCitizens.length === 0 ? (
              <p className="table-empty" style={{ padding: '20px 0' }}>No citizens recorded yet.</p>
            ) : (
              <div className="mini-list">
                {recentCitizens.map((c) => {
                  const photo = uploadUrl(c.profile_picture);
                  return (
                    <div className="mini-list-item" key={c.id}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {photo ? (
                          <img src={photo} className="profile-thumb" alt="" />
                        ) : (
                          <div className="profile-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="fas fa-user" style={{ color: '#aaa', fontSize: 12 }}></i>
                          </div>
                        )}
                        <div>
                          <strong>{c.last_name}</strong>, {c.first_name}
                          <div style={{ fontSize: 12, color: '#999' }}>{c.age ?? 'N/A'} yrs</div>
                        </div>
                      </div>
                      <small style={{ color: '#999' }}>{c.created_at ? timeAgo(c.created_at) : ''}</small>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card list-card">
            <div className="list-card-header">
              <h3>
                <i className="fas fa-clock" style={{ color: 'var(--warning)' }}></i> Recent Activities
              </h3>
            </div>
            {activities.length === 0 ? (
              <p className="table-empty" style={{ padding: '20px 0' }}>No recent activities.</p>
            ) : (
              <div className="mini-list">
                {activities.map((a) => (
                  <div className="mini-list-item" key={a.id}>
                    <div>
                      <span className={`badge badge-${ACTION_COLORS[a.action] ?? 'secondary'}`}>{a.action}</span>{' '}
                      <span style={{ fontSize: 13 }}>{a.full_name ?? 'System'}</span>
                      <div style={{ fontSize: 12, color: '#999' }}>{a.details ?? ''}</div>
                    </div>
                    <small style={{ color: '#999', whiteSpace: 'nowrap' }}>{timeOfDay(a.created_at)}</small>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-col-right">
          <div className="chart-card">
            <div className="list-card-header">
              <h3 style={{ margin: 0 }}>
                <i className="fas fa-venus-mars" style={{ color: 'var(--info)' }}></i> Gender Distribution
              </h3>
              <Link to="/demographic/populations">View Full →</Link>
            </div>
            <div className="gender-donut-row">
              <div className="gender-donut-box">
                <Doughnut
                  data={{
                    labels: genderData.map((g) => g.name),
                    datasets: [
                      {
                        data: genderData.map((g) => g.value),
                        backgroundColor: GENDER_COLORS,
                        borderWidth: 2,
                        borderColor: '#fff',
                      },
                    ],
                  }}
                  options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {genderData.map((g, i) => (
                  <div key={g.name} className="stat-line">
                    <span className="color-dot" style={{ background: GENDER_COLORS[i % GENDER_COLORS.length] }}></span>
                    <span style={{ flex: 1 }}>{g.name}</span>
                    <strong>{genderTotal > 0 ? Math.round((g.value / genderTotal) * 100) : 0}%</strong>
                    <span style={{ color: '#999', fontSize: 12, marginLeft: 6 }}>{g.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="chart-card">
            <div className="list-card-header">
              <h3 style={{ margin: 0 }}>
                <i className="fas fa-calendar-alt" style={{ color: 'var(--warning)' }}></i> Age Distribution
              </h3>
              <Link to="/demographic/populations">View Full →</Link>
            </div>
            {ageTop5.length === 0 ? (
              <p className="table-empty" style={{ padding: '10px 0' }}>No age data yet.</p>
            ) : (
              <div>
                {ageTop5.map((a, i) => {
                  const pct = ageTotal > 0 ? Math.round((a.count / ageTotal) * 100) : 0;
                  return (
                    <div key={a.age_group} className="stat-line">
                      <span className="color-dot" style={{ background: AGE_COLORS[i % AGE_COLORS.length] }}></span>
                      <span style={{ flex: 1 }}>{a.age_group}</span>
                      <strong>{pct}%</strong>
                      <span style={{ color: '#999', fontSize: 12, marginLeft: 6 }}>{a.count}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="chart-card">
            <div className="list-card-header">
              <h3 style={{ margin: 0 }}>
                <i className="fas fa-users" style={{ color: 'var(--success)' }}></i> Population Breakdown
              </h3>
              <Link to="/demographic/households">View Full →</Link>
            </div>
            <div style={{ display: 'flex', textAlign: 'center', marginBottom: 14 }}>
              <div style={{ flex: 1, borderRight: '1px solid var(--border)' }}>
                <h3 style={{ margin: 0, color: '#4e73df' }}>{stats.total_individuals.toLocaleString()}</h3>
                <small style={{ color: '#999' }}>Individuals</small>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, color: '#1cc88a' }}>{stats.total_households.toLocaleString()}</h3>
                <small style={{ color: '#999' }}>Households</small>
              </div>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${indPct}%`, background: '#4e73df' }}>
                {indPct > 12 ? `${indPct}%` : ''}
              </div>
              <div className="progress-bar-fill" style={{ width: `${hshPct}%`, background: '#1cc88a' }}>
                {hshPct > 12 ? `${hshPct}%` : ''}
              </div>
            </div>
          </div>

          <div className="chart-card">
            <div className="list-card-header">
              <h3 style={{ margin: 0 }}>
                <i className="fas fa-chart-line" style={{ color: 'var(--info)' }}></i> Quick Stats
              </h3>
              <span className="badge badge-secondary">Updated Today</span>
            </div>
            <div style={{ display: 'flex', textAlign: 'center' }}>
              <div style={{ flex: 1, borderRight: '1px solid var(--border)' }}>
                <h4 style={{ margin: 0, color: '#4e73df' }}>{stats.total_male.toLocaleString()}</h4>
                <small style={{ color: '#999' }}>Male</small>
              </div>
              <div style={{ flex: 1, borderRight: '1px solid var(--border)' }}>
                <h4 style={{ margin: 0, color: '#e74a3b' }}>{stats.total_female.toLocaleString()}</h4>
                <small style={{ color: '#999' }}>Female</small>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, color: '#f6c23e' }}>{total.toLocaleString()}</h4>
                <small style={{ color: '#999' }}>Total</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}