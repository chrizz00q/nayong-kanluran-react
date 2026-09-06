import { useEffect, useState } from 'react';
import { Doughnut, Line, Pie } from 'react-chartjs-2';
import '../../lib/chartSetup';
import { COLOR_PALETTE, percentTooltip } from '../../lib/chartSetup';
import { fetchDemographics } from '../../api/dashboard';
import type { DemographicsData } from '../../api/types';

const AGE_COLORS = ['#0dcaf0', '#4e73df', '#1cc88a', '#f6c23e', '#fd7e14', '#e74a3b', '#6c757d'];
const GENDER_COLORS = ['#4e73df', '#e74a3b', '#6c757d'];
const EDU_COLORS = ['#1cc88a', '#1cc88a', '#1cc88a', '#1cc88a', '#6f42c1', '#20c997'];
const CITIZENSHIP_COLORS = ['#4e73df', '#1cc88a', '#f6c23e', '#e74a3b', '#6c757d'];

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

function ProgressList({
  rows,
}: {
  rows: { label: string; count: number; total: number; color: string }[];
}) {
  return (
    <div>
      {rows.map((row) => {
        const pct = row.total > 0 ? Math.round((row.count / row.total) * 100) : 0;
        return (
          <div className="progress-list-row" key={row.label}>
            <div className="progress-list-label">{row.label}</div>
            <div className="progress-list-track">
              <div
                className="progress-list-fill"
                style={{ width: `${pct}%`, background: row.color }}
              >
                {pct}%
              </div>
            </div>
            <div className="count-badge">{row.count}</div>
          </div>
        );
      })}
    </div>
  );
}

export function PopulationsDemographic() {
  const [data, setData] = useState<DemographicsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDemographics()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="table-empty">Loading demographics…</div>;
  if (!data) return <div className="alert alert-danger">Failed to load demographic data.</div>;

  const genderLabels = data.gender_individual.map((d) => d.sex || 'Unknown');
  const genderValues = data.gender_individual.map((d) => d.count);

  const civilLabels = data.civil_status.map((d) => d.civil_status);
  const civilValues = data.civil_status.map((d) => d.count);

  const totalIndividuals = data.totals.total_individuals;

  const ageRows = data.age_distribution.map((d, i) => ({
    label: d.age_group,
    count: d.count,
    total: totalIndividuals,
    color: AGE_COLORS[i % AGE_COLORS.length],
  }));

  const totalEducation = data.education.reduce((sum, d) => sum + d.count, 0);
  const eduRows = data.education.map((d, i) => ({
    label: d.highest_education || 'Unknown',
    count: d.count,
    total: totalEducation,
    color: EDU_COLORS[i % EDU_COLORS.length],
  }));

  const citLabels = data.citizenship.map((d) => d.citizenship);
  const citValues = data.citizenship.map((d) => d.count);
  const totalCitizenship = citValues.reduce((sum, v) => sum + v, 0);
  const citRows = data.citizenship.map((d, i) => ({
    label: d.citizenship,
    count: d.count,
    total: totalCitizenship,
    color: CITIZENSHIP_COLORS[i % CITIZENSHIP_COLORS.length],
  }));

  const monthLabels = data.monthly_trend.map((d) => d.month);
  const monthValues = data.monthly_trend.map((d) => d.total);

  return (
    <div>
      <div className="page-header">
        <h1>
          <i className="fas fa-users" style={{ color: 'var(--brand-green-2)' }}></i> Population Demographic
        </h1>
      </div>

      <div className="stat-grid">
        <div className="stat-card bg-population">
          <div>
            <div className="stat-number">{data.totals.total_individuals.toLocaleString()}</div>
            <div className="stat-label">Total Population</div>
          </div>
          <i className="fas fa-users"></i>
        </div>
        <div className="stat-card bg-households">
          <div>
            <div className="stat-number">{data.totals.total_households.toLocaleString()}</div>
            <div className="stat-label">Total Households</div>
          </div>
          <i className="fas fa-home"></i>
        </div>
        <div className="stat-card bg-male">
          <div>
            <div className="stat-number">{data.totals.total_male.toLocaleString()}</div>
            <div className="stat-label">Male</div>
          </div>
          <i className="fas fa-mars"></i>
        </div>
        <div className="stat-card bg-female">
          <div>
            <div className="stat-number">{data.totals.total_female.toLocaleString()}</div>
            <div className="stat-label">Female</div>
          </div>
          <i className="fas fa-venus"></i>
        </div>
      </div>

      {/* Row 1: Gender + Civil Status */}
      <div className="grid-cols-2" style={{ marginBottom: 20 }}>
        <div className="chart-card">
          <div className="demo-card-header">
            <div className="demo-card-icon" style={{ background: '#4e73df' }}>
              <i className="fas fa-venus-mars"></i>
            </div>
            <h3>Gender Distribution</h3>
          </div>
          <div className="chart-canvas-box">
            <Doughnut
              data={{
                labels: genderLabels,
                datasets: [
                  {
                    data: genderValues,
                    backgroundColor: GENDER_COLORS,
                    borderWidth: 2,
                    borderColor: '#fff',
                  },
                ],
              }}
              options={{
                ...baseOptions,
                plugins: { legend: { position: 'bottom' }, tooltip: percentTooltip() },
              }}
            />
          </div>
        </div>

        <div className="chart-card">
          <div className="demo-card-header">
            <div className="demo-card-icon" style={{ background: '#f6c23e' }}>
              <i className="fas fa-ring"></i>
            </div>
            <h3>Civil Status Distribution</h3>
          </div>
          <div className="chart-canvas-box">
            <Pie
              data={{
                labels: civilLabels,
                datasets: [
                  {
                    data: civilValues,
                    backgroundColor: COLOR_PALETTE.slice(0, civilLabels.length),
                    borderWidth: 2,
                    borderColor: '#fff',
                  },
                ],
              }}
              options={{
                ...baseOptions,
                plugins: { legend: { position: 'bottom' }, tooltip: percentTooltip() },
              }}
            />
          </div>
        </div>
      </div>

      {/* Row 2: Age Distribution + Education (progress list style) */}
      <div className="grid-cols-2" style={{ marginBottom: 20 }}>
        <div className="chart-card">
          <div className="demo-card-header">
            <div className="demo-card-icon" style={{ background: '#0dcaf0' }}>
              <i className="fas fa-chart-bar"></i>
            </div>
            <h3>Age Group Distribution</h3>
          </div>
          <ProgressList rows={ageRows} />
        </div>

        <div className="chart-card">
          <div className="demo-card-header">
            <div className="demo-card-icon" style={{ background: '#1cc88a' }}>
              <i className="fas fa-graduation-cap"></i>
            </div>
            <h3>Highest Educational Attainment</h3>
          </div>
          <ProgressList rows={eduRows} />
        </div>
      </div>

      {/* Row 3: Citizenship (doughnut + legend + progress list) + Monthly Registrations */}
      <div className="grid-cols-2">
        <div className="chart-card">
          <div className="demo-card-header">
            <div className="demo-card-icon" style={{ background: '#4e73df' }}>
              <i className="fas fa-globe"></i>
            </div>
            <h3>Citizenship Distribution</h3>
          </div>

          <div className="doughnut-box-centered">
            <Doughnut
              data={{
                labels: citLabels,
                datasets: [
                  {
                    data: citValues,
                    backgroundColor: CITIZENSHIP_COLORS.slice(0, citLabels.length),
                    borderWidth: 2,
                    borderColor: '#fff',
                  },
                ],
              }}
              options={{
                ...baseOptions,
                plugins: { legend: { display: false }, tooltip: percentTooltip() },
              }}
            />
          </div>

          <div className="chart-legend">
            {citLabels.map((label, i) => (
              <div className="chart-legend-item" key={label}>
                <span
                  className="legend-swatch"
                  style={{ background: CITIZENSHIP_COLORS[i % CITIZENSHIP_COLORS.length] }}
                ></span>
                {label}
              </div>
            ))}
          </div>

          <ProgressList rows={citRows} />
        </div>

        <div className="chart-card">
          <div className="demo-card-header">
            <div className="demo-card-icon" style={{ background: '#e74a3b' }}>
              <i className="fas fa-chart-line"></i>
            </div>
            <h3>Monthly Registrations</h3>
          </div>
          <div className="chart-canvas-box" style={{ height: 320 }}>
            <Line
              data={{
                labels: monthLabels,
                datasets: [
                  {
                    label: 'New Registrations',
                    data: monthValues,
                    borderColor: '#4e73df',
                    backgroundColor: 'rgba(78, 115, 223, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4e73df',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                  },
                ],
              }}
              options={{
                ...baseOptions,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}