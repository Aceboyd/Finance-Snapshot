import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  type PieLabelRenderProps,
} from 'recharts';

const CHART_COLORS = [
  '#2774AE', // cerulean
  '#10B981', // emerald
  '#F43F5E', // rose
  '#F59E0B', // amber
  '#7C3AED', // violet
  '#06B6D4', // cyan
  '#F97316', // orange
  '#84CC16', // lime
];

interface Props {
  expenseByCategory: { name: string; value: number }[];
  totalIncome: number;
  totalExpenses: number;
}

interface TooltipEntry {
  name?: string;
  value?: number;
  color?: string;
  fill?: string;
}
interface DarkTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
}

// Custom dark-theme tooltip
const DarkTooltip = ({ active, payload, label }: DarkTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: '#0D1526',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '10px 14px',
        fontSize: '13px',
        color: '#F1F5F9',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {label && (
        <p style={{ color: '#94A3B8', marginBottom: 6, fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {String(label)}
        </p>
      )}
      {payload.map((entry, i) => (
        <p key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: entry.color ?? entry.fill,
              flexShrink: 0,
            }}
          />
          <span style={{ color: '#94A3B8' }}>{entry.name}:</span>
          <span style={{ fontWeight: 600 }}>
            ₦{Number(entry.value ?? 0).toLocaleString()}
          </span>
        </p>
      ))}
    </div>
  );
};

// Custom pie label
const renderPieLabel = (props: PieLabelRenderProps) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, name, percent } = props;
  if ((percent ?? 0) < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const ir = Number(innerRadius ?? 0);
  const or = Number(outerRadius ?? 0);
  const ma = Number(midAngle ?? 0);
  const radius = ir + (or - ir) * 1.45;
  const x = Number(cx ?? 0) + radius * Math.cos(-ma * RADIAN);
  const y = Number(cy ?? 0) + radius * Math.sin(-ma * RADIAN);
  return (
    <text
      x={x} y={y}
      fill="#94A3B8"
      textAnchor={x > Number(cx ?? 0) ? 'start' : 'end'}
      dominantBaseline="central"
      style={{ fontSize: '11px', fontWeight: 500 }}
    >
      {String(name ?? '')} {Math.round((percent ?? 0) * 100)}%
    </text>
  );
};

export default function Visualizations({ expenseByCategory, totalIncome, totalExpenses }: Props) {
  const positiveExpenses = expenseByCategory.filter((e) => e.value > 0);
  const hasExpenses = positiveExpenses.length > 0;

  const barData = [{ name: 'This Month', Income: totalIncome, Expenses: totalExpenses }];

  const cardStyle = {
    background: 'rgba(255,255,255,0.025)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px',
    padding: '20px 24px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
  };

  const AXIS_TICK_STYLE = { fill: '#475569', fontSize: 12, fontFamily: 'Inter, system-ui' };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* ── Pie Chart ───────────────────────── */}
      <motion.div
        style={cardStyle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="mb-4">
          <h3 className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>
            Expenses by Category
          </h3>
          <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>
            {hasExpenses ? `${positiveExpenses.length} active categories` : 'No data yet'}
          </p>
        </div>

        {!hasExpenses ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.5">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" />
              </svg>
            </div>
            <p className="text-sm" style={{ color: '#475569' }}>No expenses this month</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={positiveExpenses}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={88}
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
                label={renderPieLabel}
              >
                {positiveExpenses.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                    stroke="rgba(0,0,0,0.3)"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip content={<DarkTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* ── Bar Chart ───────────────────────── */}
      <motion.div
        style={cardStyle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.18 }}
      >
        <div className="mb-4">
          <h3 className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>
            Income vs Spending
          </h3>
          <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>
            Monthly overview
          </p>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData} barCategoryGap="40%" barGap={6}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={AXIS_TICK_STYLE}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={AXIS_TICK_STYLE}
              tickFormatter={(v) =>
                v === 0 ? '₦0' : `₦${v >= 1000 ? `${Math.round(v / 1000)}k` : v}`
              }
              width={55}
            />
            <Tooltip
              content={<DarkTooltip />}
              cursor={{ fill: 'rgba(255,255,255,0.02)', radius: 8 }}
            />
            <Bar
              dataKey="Income"
              fill="#10B981"
              radius={[6, 6, 0, 0]}
              maxBarSize={80}
            />
            <Bar
              dataKey="Expenses"
              fill="#F43F5E"
              radius={[6, 6, 0, 0]}
              maxBarSize={80}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-1">
          {[
            { label: 'Income', color: '#10B981' },
            { label: 'Expenses', color: '#F43F5E' },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: color }}
              />
              <span className="text-xs font-medium" style={{ color: '#64748B' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
