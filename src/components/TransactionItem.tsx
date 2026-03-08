import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import type { Transaction } from '../types';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
  index?: number;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Groceries:      { bg: 'rgba(16,185,129,0.12)', text: '#10B981', dot: '#10B981' },
  'Dining Out':   { bg: 'rgba(245,158,11,0.12)', text: '#F59E0B', dot: '#F59E0B' },
  Transportation: { bg: 'rgba(39,116,174,0.12)', text: '#5EA5DB', dot: '#2774AE' },
  Entertainment:  { bg: 'rgba(124,58,237,0.12)', text: '#A78BFA', dot: '#7C3AED' },
  Utilities:      { bg: 'rgba(6,182,212,0.12)',  text: '#06B6D4', dot: '#06B6D4' },
  Housing:        { bg: 'rgba(244,63,94,0.12)',  text: '#F87171', dot: '#F43F5E' },
  // Income categories
  Salary:         { bg: 'rgba(16,185,129,0.12)', text: '#10B981', dot: '#10B981' },
  Freelance:      { bg: 'rgba(39,116,174,0.12)', text: '#5EA5DB', dot: '#2774AE' },
  Investments:    { bg: 'rgba(124,58,237,0.12)', text: '#A78BFA', dot: '#7C3AED' },
  Gifts:          { bg: 'rgba(245,158,11,0.12)', text: '#F59E0B', dot: '#F59E0B' },
  Other:          { bg: 'rgba(100,116,139,0.12)', text: '#94A3B8', dot: '#64748B' },
};

const getCategoryStyle = (category: string) =>
  CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Other;

const getInitials = (category: string) =>
  category
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

export default function TransactionItem({ transaction, onDelete, index = 0 }: TransactionItemProps) {
  if (!transaction) return null;

  const { id, type, amount, description, date, category } = transaction;
  const isIncome = type === 'income';
  const catStyle = getCategoryStyle(category);

  const amountStr = amount.toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <motion.li
      className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-150"
      style={{ '--hover-bg': 'rgba(255,255,255,0.04)' } as React.CSSProperties}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
    >
      {/* Category badge */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
        style={{
          background: catStyle.bg,
          color: catStyle.text,
          border: `1px solid ${catStyle.dot}20`,
        }}
      >
        {getInitials(category)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: '#E2E8F0' }}>
          {description || category}
        </p>
        <p className="text-xs mt-0.5 flex items-center gap-1.5" style={{ color: '#475569' }}>
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: catStyle.dot }}
          />
          {category} · {format(new Date(date), 'd MMM yyyy')}
        </p>
      </div>

      {/* Amount */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <span
          className="text-sm font-semibold px-2.5 py-1 rounded-lg"
          style={
            isIncome
              ? { background: 'rgba(16,185,129,0.12)', color: '#10B981' }
              : { background: 'rgba(244,63,94,0.12)', color: '#F43F5E' }
          }
        >
          {isIncome ? '+' : '−'}₦{amountStr}
        </span>

        {/* Delete */}
        <button
          onClick={() => onDelete(id)}
          aria-label="Delete transaction"
          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
          style={{
            background: 'rgba(244,63,94,0.1)',
            color: '#F43F5E',
            border: '1px solid rgba(244,63,94,0.15)',
          }}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </motion.li>
  );
}
