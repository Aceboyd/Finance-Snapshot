import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import type { Transaction } from '../types';
import { EXPENSE_CATEGORIES } from '../types';

interface Props {
  budgets: Record<string, number>;
  transactionsThisMonth: Transaction[];
  onOpenModal: () => void;
}

const formatMoney = (amount: number) =>
  amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const CATEGORY_COLORS: Record<string, string> = {
  Groceries:      '#10B981',
  'Dining Out':   '#F59E0B',
  Transportation: '#2774AE',
  Entertainment:  '#7C3AED',
  Utilities:      '#06B6D4',
  Housing:        '#F43F5E',
  Other:          '#64748B',
};

export default function BudgetsSection({ budgets, transactionsThisMonth, onOpenModal }: Props) {
  const getBudgetStatus = (category: string) => {
    const spent = transactionsThisMonth
      .filter((t) => t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
    const limit = budgets[category] || 0;
    const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
    const isOver = limit > 0 && spent > limit;
    const isWarning = !isOver && percent > 80;

    const barColor = isOver
      ? 'var(--color-expense)'
      : isWarning
        ? 'var(--color-warning)'
        : CATEGORY_COLORS[category] ?? 'var(--color-primary)';

    return { spent, limit, percent, isOver, isWarning, barColor };
  };

  const activeCategories = EXPENSE_CATEGORIES.filter((cat) => {
    const { spent, limit } = getBudgetStatus(cat);
    return limit > 0 || spent > 0;
  });

  const hasAny = activeCategories.length > 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-text-primary">
            Budget Tracker
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            {hasAny ? `${activeCategories.length} categories tracked` : 'Set limits per category'}
          </p>
        </div>
        <button
          onClick={onOpenModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] bg-surface-alt border border-border-strong text-text-secondary hover:bg-primary-dim hover:text-primary-light hover:border-primary"
        >
          <Settings size={13} />
          Edit Budgets
        </button>
      </div>

      {/* Cards grid */}
      {!hasAny ? (
        <div
          className="glass-card rounded-2xl py-10 text-center"
        >
          <div
            className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center bg-surface-alt"
          >
            <Settings size={22} className="text-text-secondary" />
          </div>
          <p className="text-sm font-medium text-text-secondary">No budgets configured</p>
          <p className="text-xs text-text-tertiary mt-1">
            Click "Edit Budgets" to set monthly limits
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeCategories.map((cat, i) => {
            const { spent, limit, percent, isOver, isWarning, barColor } = getBudgetStatus(cat);
            const catColor = CATEGORY_COLORS[cat] ?? 'var(--color-primary)';

            return (
              <motion.div
                key={cat}
                className="glass-card rounded-2xl p-4 relative overflow-hidden"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                {/* Left accent bar */}
                <div
                  className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
                  style={{ background: catColor }}
                />

                <div className="pl-3">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        {cat}
                      </p>
                      {isOver && (
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-expense-dim text-expense border border-red-300"
                        >
                          OVER BUDGET
                        </span>
                      )}
                      {isWarning && !isOver && (
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-warning-dim text-warning border border-amber-300"
                        >
                          NEAR LIMIT
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${isOver ? 'text-expense' : 'text-text-primary'}`}>
                        ₦{formatMoney(spent)}
                      </p>
                      {limit > 0 && (
                        <p className="text-xs text-text-secondary">
                          of ₦{formatMoney(limit)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  {limit > 0 && (
                    <div className="relative">
                      <div
                        className="w-full h-1.5 rounded-full overflow-hidden bg-surface-alt"
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: barColor }}
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.6, delay: 0.1 + i * 0.04, ease: 'easeOut' }}
                        />
                      </div>
                      <p className="text-[10px] text-text-secondary mt-1.5">
                        {isOver
                          ? `₦${formatMoney(spent - limit)} over`
                          : `${Math.round(percent)}% used · ₦${formatMoney(limit - spent)} left`}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.section>
  );
}
