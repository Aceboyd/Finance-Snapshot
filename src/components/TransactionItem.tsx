import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import type { Transaction } from '../types';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
  index?: number;
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  Groceries:      { bg: 'var(--color-income-dim)', text: 'var(--color-income)', dot: 'var(--color-income)' },
  'Dining Out':   { bg: 'var(--color-warning-dim)', text: 'var(--color-warning)', dot: 'var(--color-warning)' },
  Transportation: { bg: 'var(--color-primary-dim)', text: 'var(--color-primary-light)', dot: 'var(--color-primary)' },
  Entertainment:  { bg: 'var(--violet-500-dim)', text: 'var(--violet-500)', dot: 'var(--violet-500)' }, // Assuming you'll add these
  Utilities:      { bg: 'var(--cyan-500-dim)',  text: 'var(--cyan-500)', dot: 'var(--cyan-500)' },
  Housing:        { bg: 'var(--color-expense-dim)',  text: 'var(--color-expense)', dot: 'var(--color-expense)' },
  Salary:         { bg: 'var(--color-income-dim)', text: 'var(--color-income)', dot: 'var(--color-income)' },
  Freelance:      { bg: 'var(--color-primary-dim)', text: 'var(--color-primary-light)', dot: 'var(--color-primary)' },
  Investments:    { bg: 'var(--violet-500-dim)', text: 'var(--violet-500)', dot: 'var(--violet-500)' },
  Gifts:          { bg: 'var(--color-warning-dim)', text: 'var(--color-warning)', dot: 'var(--color-warning)' },
  Other:          { bg: 'var(--color-text-tertiary-dim)', text: 'var(--color-text-tertiary)', dot: 'var(--color-text-tertiary)' },
};

const getCategoryStyle = (category: string) =>
  CATEGORY_STYLES[category] ?? CATEGORY_STYLES.Other;

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
      className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-150 hover:bg-surface-alt"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
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
        <p className="text-sm font-medium truncate text-text-primary">
          {description || category}
        </p>
        <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-1.5">
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
          className={`text-sm font-semibold px-2.5 py-1 rounded-lg ${isIncome ? 'bg-income-dim text-income' : 'bg-expense-dim text-expense'}`}
        >
          {isIncome ? '+' : '−'}₦{amountStr}
        </span>

        {/* Delete */}
        <button
          onClick={() => onDelete(id)}
          aria-label="Delete transaction"
          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95 bg-expense-dim text-expense border border-red-300/50"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </motion.li>
  );
}
