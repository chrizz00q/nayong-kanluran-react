import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { fetchDemographics } from '../../api/dashboard';
import type { DemographicsData } from '../../api/types';

const COLORS = ['#9ebd13', '#008552', '#f16d0f', '#c68331', '#4e73df', '#36b9cc', '#e74a3b', '#6c757d'];

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="chart-card" style={{ minWidth: 0 }}>
      <h3>{title}</h3>
      <div style={{ width: '100%', height: 280, minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
          {children as any}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function Demographics() {
  const location = useLocation();
  const isHouseholdView = location.pathname.includes('households');
  const [data, setData] = useState<DemographicsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDemographics()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="table-empty">Loading demographics…</div>;
  if (!data) return <div className="alert alert-danger">Failed to load demographic data.</div>;

  return (
    <div>
      <div className="page-header">
        <h1>
          <i className="fas fa-chart-bar" style={{ color: 'var(--brand-green-2)' }}></i>{' '}
          {isHouseholdView ? 'Households Demographic' : 'Populations Demographic'}
        </h1>
      </div>

      <div className="stat-grid">
        <div className="stat-card bg-population">
          <div>
            <div className="stat-number">{data.totals.total_individuals.toLocaleString()}</div>
            <div className="stat-label">Total Individuals</div>
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

      {!isHouseholdView ? (
        <div className="grid-2" style={{ marginBottom: 16 }}>
          <ChartCard title="Gender Distribution (Individuals)">
            <PieChart>
              <Pie
                data={data.gender_individual}
                dataKey="count"
                nameKey="sex"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {data.gender_individual.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartCard>

          <ChartCard title="Civil Status Distribution">
            <PieChart>
              <Pie
                data={data.civil_status}
                dataKey="count"
                nameKey="civil_status"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {data.civil_status.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartCard>

          <ChartCard title="Age Distribution">
            <BarChart data={data.age_distribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age_group" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#008552" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartCard>

          <ChartCard title="Highest Education Attained">
            <BarChart data={data.education} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="highest_education" width={110} />
              <Tooltip />
              <Bar dataKey="count" fill="#f16d0f" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ChartCard>

          <div className="chart-card" style={{ gridColumn: '1 / -1', minWidth: 0 }}>
            <h3>Monthly Registration Trend (Last 12 Months)</h3>
            <ResponsiveContainer width="100%" height={280} minWidth={0} debounce={50}>
              <LineChart data={data.monthly_trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#008552" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="grid-2">
          <ChartCard title="Gender Distribution (Household Members)">
            <PieChart>
              <Pie
                data={data.gender_household}
                dataKey="count"
                nameKey="sex"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {data.gender_household.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartCard>

          <ChartCard title="Top Citizenship">
            <BarChart data={data.citizenship} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="citizenship" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#4e73df" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ChartCard>

          <div className="chart-card" style={{ gridColumn: '1 / -1', minWidth: 0 }}>
            <h3>Top 10 Occupations</h3>
            <ResponsiveContainer width="100%" height={320} minWidth={0} debounce={50}>
              <BarChart data={data.occupation}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="occupation" angle={-20} textAnchor="end" height={70} interval={0} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#c68331" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
