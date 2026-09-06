import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import '../../lib/chartSetup';
import { COLOR_PALETTE } from '../../lib/chartSetup';
import { fetchPopulationByStreetReport } from '../../api/reports';
import type { PopulationByStreetData } from '../../api/types';
import { ReportPrintHeader, ReportToolbar } from '../../components/common/ReportHeader';

export function PopulationByStreetReport() {
  const [data, setData] = useState<PopulationByStreetData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopulationByStreetReport()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="table-empty">Loading report…</div>;
  if (!data) return <div className="alert alert-danger">Failed to load report data.</div>;

  const named = data.street_data.filter((s) => s.street && s.street.trim() && s.street !== 'Unknown');
  const labels = named.map((d) => d.street);
  const values = named.map((d) => d.count);

  return (
    <div>
      <ReportToolbar icon="fa-road" title="Population By Street" />

      <ReportPrintHeader
        title="POPULATION BY STREET"
        subtitle={
          <>
            <p>Total Population: {data.total_individuals.toLocaleString()}</p>
            <p>With Address: {data.total_with_address.toLocaleString()}</p>
          </>
        }
      />

      <p className="report-summary-line no-print">
        Total Population: <strong>{data.total_individuals.toLocaleString()}</strong>
        {'  ·  '}
        With Address: <strong>{data.total_with_address.toLocaleString()}</strong>
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
                  backgroundColor: COLOR_PALETTE.slice(0, labels.length).map((_, i) => COLOR_PALETTE[i % COLOR_PALETTE.length]),
                  borderColor: '#e74a3b',
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
                      const pct = data.total_individuals > 0
                        ? ((ctx.parsed.y / data.total_individuals) * 100).toFixed(1)
                        : '0';
                      return `${ctx.parsed.y} residents (${pct}%)`;
                    },
                  },
                },
              },
              scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } },
                x: { ticks: { maxRotation: 45, minRotation: 30, font: { size: 10 } } },
              },
            }}
          />
        </div>
      </div>

      <div className="table-wrap" style={{ marginTop: 16 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Street / Area</th>
              <th>Population</th>
              <th>Percentage</th>
              <th>Residents</th>
            </tr>
          </thead>
          <tbody>
            {named.length === 0 ? (
              <tr>
                <td colSpan={5} className="table-empty">No street data available.</td>
              </tr>
            ) : (
              named.map((street, idx) => {
                const pct = data.total_individuals > 0 ? Math.round((street.count / data.total_individuals) * 1000) / 10 : 0;
                return (
                  <tr key={street.street}>
                    <td>{idx + 1}</td>
                    <td><div style={{ fontWeight: 600 }}>{street.street}</div></td>
                    <td>{street.count.toLocaleString()}</td>
                    <td>{pct}%</td>
                    <td><small>{(street.residents || '').slice(0, 80)}{street.residents && street.residents.length > 80 ? '…' : ''}</small></td>
                  </tr>
                );
              })
            )}
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
