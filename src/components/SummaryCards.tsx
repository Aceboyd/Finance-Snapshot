import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface Props {
  totalIncome: number;
  totalExpenses: number;
}

const formatMoney = (amount: number) =>
  amount.toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

interface CardConfig {
  label: string;
  value: number;
  icon: React.ReactNode;
  accentColor: string;
  dimColor: string;
  textColor: string;
  prefix: string;
}

export default function SummaryCards({ totalIncome, totalExpenses }: Props) {
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0
    ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
    : 0;

  const cards: CardConfig[] = [
    {
      label: 'Total Income',
      value: totalIncome,
      icon: <TrendingUp size={20} />,
      accentColor: '#10B981',
      dimColor: 'rgba(16,185,129,0.12)',
      textColor: '#10B981',
      prefix: '+',
    },
    {
      label: 'Total Expenses',
      value: totalExpenses,
      icon: <TrendingDown size={20} />,
      accentColor: '#F43F5E',
      dimColor: 'rgba(244,63,94,0.12)',
      textColor: '#F43F5E',
      prefix: '−',
    },
    {
      label: 'Net Balance',
      value: balance,
      icon: <Wallet size={20} />,
      accentColor: balance >= 0 ? '#2774AE' : '#F43F5E',
      dimColor: balance >= 0 ? 'rgba(39,116,174,0.12)' : 'rgba(244,63,94,0.12)',
      textColor: balance >= 0 ? '#5EA5DB' : '#F43F5E',
      prefix: balance >= 0 ? '+' : '−',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          className="glass-card rounded-2xl p-5 relative overflow-hidden group"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
            style={{ background: card.accentColor }}
          />

          {/* Background glow */}
          <div
            className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-60 pointer-events-none"
            style={{ background: card.dimColor }}
          />

          {/* Icon */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
            style={{
              background: card.dimColor,
              color: card.accentColor,
              border: `1px solid ${card.accentColor}30`,
            }}
          >
            {card.icon}
          </div>

          {/* Label */}
          <p className="label-text">{card.label}</p>

          {/* Amount */}
          <p
            className="text-2xl sm:text-3xl font-bold mt-1 tracking-tight"
            style={{ color: card.textColor }}
          >
            {card.label === 'Net Balance' && card.value < 0 ? '−' : ''}
            ₦{formatMoney(Math.abs(card.value))}
          </p>

          {/* Sub info */}
          {card.label === 'Net Balance' && totalIncome > 0 && (
            <p className="text-xs mt-2" style={{ color: '#64748B' }}>
              {savingsRate >= 0 ? (
                <span style={{ color: '#10B981' }}>↑ {savingsRate}% savings rate</span>
              ) : (
                <span style={{ color: '#F43F5E' }}>↓ {Math.abs(savingsRate)}% over budget</span>
              )}
            </p>
          )}
          {card.label === 'Total Income' && totalIncome > 0 && (
            <p className="text-xs mt-2" style={{ color: '#64748B' }}>
              {totalExpenses > 0
                ? `${Math.round((totalExpenses / totalIncome) * 100)}% spent`
                : 'Nothing spent yet'}
            </p>
          )}
          {card.label === 'Total Expenses' && totalExpenses > 0 && (
            <p className="text-xs mt-2" style={{ color: '#64748B' }}>
              Across all categories
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
