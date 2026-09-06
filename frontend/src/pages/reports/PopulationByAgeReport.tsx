import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import '../../lib/chartSetup';
import { fetchPopulationByAgeReport } from '../../api/reports';
import type { PopulationByAgeData } from '../../api/types';
import { ReportPrintHeader, ReportToolbar } from '../../components/common/ReportHeader';
import { ProgressList } from '../../components/common/ProgressList';

const AGE_COLORS = ['#0dcaf0', '#4e73df', '#1cc88a', '#f6c23e', '#fd7e14', '#e74a3b', '#6c757d'];

export function PopulationByAgeReport() {
  const [data, setData] = useState<PopulationByAgeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopulationByAgeReport()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="table-empty">Loading report…</div>;
  if (!data) return <div className="alert alert-danger">Failed to load report data.</div>;

  const labels = data.age_distribution.map((d) => d.age_group);
  const values = data.age_distribution.map((d) => d.count);

  return (
    <div>
      <ReportToolbar icon="fa-calendar-alt" title="Population By Age" />

      <ReportPrintHeader
        title="POPULATION BY AGE DISTRIBUTION"
        subtitle={<p>Total Population: {data.total_population.toLocaleString()}</p>}
      />

      <p className="report-summary-line no-print">
        Total Population: <strong>{data.total_population.toLocaleString()}</strong>
      </p>

      <div className="chart-card">
        <div className="chart-canvas-box">
          <Bar
            data={{
              labels,
              datasets: [
                {
                  label: 'Population',
                  data: values,
                  backgroundColor: AGE_COLORS.slice(0, labels.length),
                  borderColor: '#fff',
                  borderWidth: 2,
                  borderRadius: 5,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (ctx: any) => {
                      const pct = data.total_population > 0
                        ? ((ctx.parsed.y / data.total_population) * 100).toFixed(1)
                        : '0';
                      return `${ctx.parsed.y} people (${pct}%)`;
                    },
                  },
                },
              },
              scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
            }}
          />
        </div>

        <ProgressList
          items={data.age_distribution.map((d) => ({ label: d.age_group, count: d.count }))}
          color="#4e73df"
        />
      </div>

      <div className="table-wrap" style={{ marginTop: 16 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Age Group</th>
              <th>Count</th>
              <th>Percentage</th>
              <th>Members</th>
            </tr>
          </thead>
          <tbody>
            {data.age_distribution.map((group) => {
              const pct = data.total_population > 0 ? Math.round((group.count / data.total_population) * 1000) / 10 : 0;
              return (
                <tr key={group.age_group}>
                  <td><strong>{group.age_group}</strong></td>
                  <td>{group.count.toLocaleString()}</td>
                  <td>{pct}%</td>
                  <td><small>{(group.members || '').slice(0, 100)}{group.members && group.members.length > 100 ? '…' : ''}</small></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="report-print-header" style={{ borderBottom: 'none', borderTop: '1px solid #ccc', marginTop: 20 }}>
        <p style={{ textAlign: 'center' }}>
          <small>This is a computer-generated report. For official use only.</small>
        </p>
      </div>
    </div>
  );
}
