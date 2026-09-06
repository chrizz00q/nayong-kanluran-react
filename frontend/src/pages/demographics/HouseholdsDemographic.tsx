import { useEffect, useState } from 'react';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import '../../lib/chartSetup';
import { COLOR_PALETTE, percentTooltip } from '../../lib/chartSetup';
import { fetchHouseholdsDemographics } from '../../api/dashboard';
import type { HouseholdsDemographicsData } from '../../api/types';
import { ProgressList } from '../../components/common/ProgressList';

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

export function HouseholdsDemographic() {
  const [data, setData] = useState<HouseholdsDemographicsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHouseholdsDemographics()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="table-empty">Loading demographics…</div>;
  if (!data) return <div className="alert alert-danger">Failed to load demographic data.</div>;

  const dwellingLabels = data.dwelling_stats.map((d) => d.dwelling_type);
  const dwellingValues = data.dwelling_stats.map((d) => d.count);

  const typeLabels = data.type_stats.map((d) => d.household_type);
  const typeValues = data.type_stats.map((d) => d.count);

  const tenureLabels = data.tenure_stats.map((d) => d.tenure_status);
  const tenureValues = data.tenure_stats.map((d) => d.count);

  return (
    <div>
      <div className="page-header">
        <h1>
          <i className="fas fa-home" style={{ color: 'var(--brand-green-2)' }}></i> Households Demographic
        </h1>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'minmax(220px, 1fr)' }}>
        <div className="stat-card bg-households">
          <div>
            <div className="stat-number">{data.total_households.toLocaleString()}</div>
            <div className="stat-label">Total Households</div>
          </div>
          <i className="fas fa-home"></i>
        </div>
      </div>

      <div className="grid-2">
        <div className="chart-card">
          <h3>
            <i className="fas fa-building" style={{ color: '#4e73df' }}></i> Household Units (Dwelling Types)
          </h3>
          <div className="chart-canvas-box">
            <Bar
              data={{
                labels: dwellingLabels,
                datasets: [
                  {
                    label: 'Households',
                    data: dwellingValues,
                    backgroundColor: COLOR_PALETTE.slice(0, dwellingLabels.length),
                    borderColor: '#fff',
                    borderWidth: 2,
                    borderRadius: 5,
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
          <ProgressList
            items={data.dwelling_stats.map((d) => ({ label: d.dwelling_type, count: d.count }))}
            color="#4e73df"
          />
        </div>

        <div className="chart-card">
          <h3>
            <i className="fas fa-users" style={{ color: '#36b9cc' }}></i> Household Types
          </h3>
          <div className="chart-canvas-box">
            <Pie
              data={{
                labels: typeLabels,
                datasets: [
                  {
                    data: typeValues,
                    backgroundColor: COLOR_PALETTE.slice(0, typeLabels.length),
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
          <ProgressList
            items={data.type_stats.map((d) => ({ label: d.household_type, count: d.count }))}
            color="#36b9cc"
          />
        </div>

        <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
          <h3>
            <i className="fas fa-handshake" style={{ color: '#f6c23e' }}></i> Tenure Status
          </h3>
          <div className="chart-canvas-box">
            <Doughnut
              data={{
                labels: tenureLabels,
                datasets: [
                  {
                    data: tenureValues,
                    backgroundColor: COLOR_PALETTE.slice(0, tenureLabels.length),
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
          <ProgressList
            items={data.tenure_stats.map((d) => ({ label: d.tenure_status, count: d.count }))}
            color="#f6c23e"
          />
        </div>
      </div>
    </div>
  );
}
