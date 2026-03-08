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
      ? '#F43F5E'
      : isWarning
        ? '#F59E0B'
        : CATEGORY_COLORS[category] ?? '#2774AE';

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
          <h3 className="text-base font-semibold" style={{ color: '#F1F5F9' }}>
            Budget Tracker
          </h3>
          <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>
            {hasAny ? `${activeCategories.length} categories tracked` : 'Set limits per category'}
          </p>
        </div>
        <button
          onClick={onOpenModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#94A3B8',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(39,116,174,0.15)';
            (e.currentTarget as HTMLButtonElement).style.color = '#5EA5DB';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(39,116,174,0.3)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
            (e.currentTarget as HTMLButtonElement).style.color = '#94A3B8';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
          }}
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
            className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <Settings size={22} style={{ color: '#334155' }} />
          </div>
          <p className="text-sm font-medium" style={{ color: '#475569' }}>No budgets configured</p>
          <p className="text-xs mt-1" style={{ color: '#334155' }}>
            Click "Edit Budgets" to set monthly limits
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeCategories.map((cat, i) => {
            const { spent, limit, percent, isOver, isWarning, barColor } = getBudgetStatus(cat);
            const catColor = CATEGORY_COLORS[cat] ?? '#2774AE';

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
                      <p className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>
                        {cat}
                      </p>
                      {isOver && (
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                          style={{
                            background: 'rgba(244,63,94,0.12)',
                            color: '#F43F5E',
                            border: '1px solid rgba(244,63,94,0.2)',
                          }}
                        >
                          OVER BUDGET
                        </span>
                      )}
                      {isWarning && !isOver && (
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                          style={{
                            background: 'rgba(245,158,11,0.12)',
                            color: '#F59E0B',
                            border: '1px solid rgba(245,158,11,0.2)',
                          }}
                        >
                          NEAR LIMIT
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: isOver ? '#F43F5E' : '#F1F5F9' }}>
                        ₦{formatMoney(spent)}
                      </p>
                      {limit > 0 && (
                        <p className="text-xs" style={{ color: '#475569' }}>
                          of ₦{formatMoney(limit)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  {limit > 0 && (
                    <div className="relative">
                      <div
                        className="w-full h-1.5 rounded-full overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.06)' }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: barColor }}
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.6, delay: 0.1 + i * 0.04, ease: 'easeOut' }}
                        />
                      </div>
                      <p className="text-[10px] mt-1.5" style={{ color: '#475569' }}>
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
