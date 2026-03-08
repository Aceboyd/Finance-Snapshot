import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../types';

interface Props {
  budgets: Record<string, number>;
  onSave: (budgets: Record<string, number>) => void;
  onClose: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Groceries:      '#10B981',
  'Dining Out':   '#F59E0B',
  Transportation: '#2774AE',
  Entertainment:  '#7C3AED',
  Utilities:      '#06B6D4',
  Housing:        '#F43F5E',
  Other:          '#64748B',
};

export default function BudgetModal({ budgets, onSave, onClose }: Props) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(
      EXPENSE_CATEGORIES.map((c) => [c, budgets[c] ? String(budgets[c]) : ''])
    )
  );

  const handleChange = (category: string, value: string) => {
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setValues((prev) => ({ ...prev, [category]: value }));
    }
  };

  const handleSave = () => {
    const newBudgets: Record<string, number> = {};
    Object.entries(values).forEach(([cat, val]) => {
      newBudgets[cat] = val.trim() ? Number(val) : 0;
    });
    onSave(newBudgets);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="glass-card w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl flex flex-col shadow-modal"
          style={{ maxHeight: '90dvh' }}
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 380, damping: 30 },
          }}
          exit={{ opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.18 } }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ─────────────────────────────── */}
          <div
            className="flex items-center justify-between px-6 pt-6 pb-5 flex-shrink-0 border-b border-border-strong"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary-dim border border-primary/20"
              >
                <Target size={17} className="text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  Monthly Budgets
                </h2>
                <p className="text-xs text-text-secondary">
                  Set spending limits per category
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110 bg-surface-alt border border-border-strong text-text-secondary"
            >
              <X size={15} />
            </button>
          </div>

          {/* ── Scrollable body ────────────────────── */}
          <div className="overflow-y-auto scrollbar-hidden flex-1 px-6 py-5 space-y-3">
            {EXPENSE_CATEGORIES.map((cat) => {
              const catColor = CATEGORY_COLORS[cat] ?? '#64748B';
              const hasValue = values[cat] && Number(values[cat]) > 0;

              return (
                <div
                  key={cat}
                  className="flex items-center gap-4 p-3 rounded-xl transition-colors bg-surface-alt border border-border-strong"
                >
                  {/* Color dot */}
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: catColor }}
                  />

                  {/* Label */}
                  <label
                    htmlFor={`budget-${cat}`}
                    className="flex-1 text-sm font-medium cursor-pointer text-text-primary"
                  >
                    {cat}
                  </label>

                  {/* Input */}
                  <div className="relative w-36">
                    <span
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
                      style={{ color: hasValue ? catColor : 'var(--color-text-tertiary)' }}
                    >
                      ₦
                    </span>
                    <input
                      id={`budget-${cat}`}
                      type="text"
                      inputMode="decimal"
                      value={values[cat]}
                      onChange={(e) => handleChange(cat, e.target.value)}
                      placeholder="No limit"
                      className="glass-input text-right"
                      style={{
                        padding: '0.5rem 0.75rem 0.5rem 1.75rem',
                        fontSize: '0.875rem',
                        ...(hasValue
                          ? { borderColor: `${catColor}40`, color: catColor }
                          : {}),
                      }}
                    />
                  </div>
                </div>
              );
            })}

            <p className="text-xs text-text-tertiary pt-1">
              Leave blank or set to 0 for no spending limit.
            </p>
          </div>

          {/* ── Footer ─────────────────────────────── */}
          <div
            className="flex gap-3 px-6 py-4 flex-shrink-0 border-t border-border-strong"
          >
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80 bg-surface-alt border border-border-strong text-text-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-primary to-blue-700 shadow-lg shadow-primary/30"
            >
              Save Budgets
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
