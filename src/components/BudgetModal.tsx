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
        className="fixed inset-0 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl flex flex-col"
          style={{
            background: '#0D1526',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
            maxHeight: '90dvh',
          }}
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
            className="flex items-center justify-between px-6 pt-6 pb-5 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(39,116,174,0.15)',
                  border: '1px solid rgba(39,116,174,0.25)',
                }}
              >
                <Target size={17} style={{ color: '#2774AE' }} />
              </div>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: '#F1F5F9' }}>
                  Monthly Budgets
                </h2>
                <p className="text-xs" style={{ color: '#475569' }}>
                  Set spending limits per category
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#64748B',
              }}
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
                  className="flex items-center gap-4 p-3 rounded-xl transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {/* Color dot */}
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: catColor }}
                  />

                  {/* Label */}
                  <label
                    htmlFor={`budget-${cat}`}
                    className="flex-1 text-sm font-medium cursor-pointer"
                    style={{ color: '#CBD5E1' }}
                  >
                    {cat}
                  </label>

                  {/* Input */}
                  <div className="relative w-36">
                    <span
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
                      style={{ color: hasValue ? catColor : '#334155' }}
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
                        paddingLeft: '1.75rem',
                        paddingRight: '0.75rem',
                        paddingTop: '0.5rem',
                        paddingBottom: '0.5rem',
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

            <p className="text-xs pt-1" style={{ color: '#334155' }}>
              Leave blank or set to 0 for no spending limit.
            </p>
          </div>

          {/* ── Footer ─────────────────────────────── */}
          <div
            className="flex gap-3 px-6 py-4 flex-shrink-0"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#64748B',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #2774AE, #1A4D74)',
                color: '#fff',
                boxShadow: '0 4px 16px rgba(39,116,174,0.3)',
              }}
            >
              Save Budgets
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
