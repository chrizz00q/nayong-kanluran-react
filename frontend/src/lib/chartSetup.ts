import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
);

// Same palette used by the original Chart.js dashboards.
export const COLOR_PALETTE = [
  '#4e73df', // blue
  '#1cc88a', // green
  '#e74a3b', // red
  '#f6c23e', // yellow
  '#6f42c1', // purple
  '#fd7e14', // orange
  '#20c997', // teal
  '#e83e8c', // pink
  '#6610f2', // indigo
  '#0dcaf0', // cyan
];

export function percentTooltip() {
  return {
    callbacks: {
      label: (context: any) => {
        const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
        const pct = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : '0';
        return `${context.label}: ${context.parsed} (${pct}%)`;
      },
    },
  };
}
