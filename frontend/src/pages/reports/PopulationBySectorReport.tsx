import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import '../../lib/chartSetup';
import { COLOR_PALETTE, percentTooltip } from '../../lib/chartSetup';
import { fetchPopulationBySectorReport } from '../../api/reports';
import type { PopulationBySectorData } from '../../api/types';
import { ReportPrintHeader, ReportToolbar } from '../../components/common/ReportHeader';
import { ProgressList } from '../../components/common/ProgressList';

export function PopulationBySectorReport() {
  const [data, setData] = useState<PopulationBySectorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopulationBySectorReport()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="table-empty">Loading report…</div>;
  if (!data) return <div className="alert alert-danger">Failed to load report data.</div>;

  const labels = data.sector_data.map((d) => d.sector);
  const values = data.sector_data.map((d) => d.count);

  return (
    <div>
      <ReportToolbar icon="fa-building" title="Population By Sector" />

      <ReportPrintHeader
        title="POPULATION BY SECTOR"
        subtitle={<p>Total Households: {data.total_households.toLocaleString()}</p>}
      />

      <p className="report-summary-line no-print">
        Total Households: <strong>{data.total_households.toLocaleString()}</strong>
      </p>

      <div className="grid-2">
        <div className="chart-card">
          <h3>
            <i className="fas fa-chart-pie" style={{ color: '#4e73df' }}></i> Sector Share
          </h3>
          <div className="chart-canvas-box">
            <Pie
              data={{
                labels,
                datasets: [
                  {
                    data: values,
                    backgroundColor: COLOR_PALETTE.slice(0, labels.length),
                    borderWidth: 2,
                    borderColor: '#fff',
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } }, tooltip: percentTooltip() },
              }}
            />
          </div>
        </div>

        <div className="chart-card">
          <h3>
            <i className="fas fa-chart-bar" style={{ color: '#f6c23e' }}></i> Households By Sector
          </h3>
          <div className="chart-canvas-box">
            <Bar
              data={{
                labels,
                datasets: [
                  {
                    label: 'Households',
                    data: values,
                    backgroundColor: COLOR_PALETTE.slice(0, labels.length),
                    borderColor: '#fff',
                    borderWidth: 2,
                    borderRadius: 5,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y' as const,
                plugins: { legend: { display: false } },
                scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } },
              }}
            />
          </div>
        </div>
      </div>

      <ProgressList
        items={data.sector_data.map((d) => ({ label: d.sector, count: d.count }))}
        color="#4e73df"
      />

      <div className="table-wrap" style={{ marginTop: 16 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Sector</th>
              <th>Count</th>
              <th>Percentage</th>
              <th>Household Members</th>
            </tr>
          </thead>
          <tbody>
            {data.sector_data.map((sector, idx) => {
              const pct = data.total_households > 0 ? Math.round((sector.count / data.total_households) * 1000) / 10 : 0;
              return (
                <tr key={sector.sector}>
                  <td>{idx + 1}</td>
                  <td><strong>{sector.sector}</strong></td>
                  <td>{sector.count.toLocaleString()}</td>
                  <td>{pct}%</td>
                  <td><small>{(sector.members || '').slice(0, 80)}{sector.members && sector.members.length > 80 ? '…' : ''}</small></td>
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
