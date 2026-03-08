import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../types';
import type { Transaction, ExpenseCategory, IncomeCategory } from '../types';

interface Props {
  onAdd: (tx: Omit<Transaction, 'id'>) => void;
  onClose: () => void;
}

const MODAL_VARIANTS = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 380, damping: 30 },
  },
  exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.18 } },
};

export default function AddTransactionModal({ onAdd, onClose }: Props) {
  const [form, setForm] = useState({
    type: 'expense' as 'income' | 'expense',
    category: EXPENSE_CATEGORIES[0] as ExpenseCategory | IncomeCategory,
    amount: '',
    description: '',
    date: new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState('');

  const handleTypeChange = (newType: 'income' | 'expense') => {
    setForm({
      ...form,
      type: newType,
      category: newType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
    });
    setError('');
  };

  const currentCategories =
    form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = () => {
    const amountNum = Number(form.amount);
    if (!form.amount || isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }
    onAdd({
      type: form.type,
      category: form.category,
      amount: amountNum,
      description: form.description.trim(),
      date: form.date,
    });
    onClose();
  };

  const isIncome = form.type === 'income';

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
          className="glass-card w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-modal"
          variants={MODAL_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ─────────────────────────────── */}
          <div
            className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-border-strong"
          >
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                New Transaction
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Record an income or expense
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110 bg-surface-alt border border-border-strong text-text-secondary"
            >
              <X size={15} />
            </button>
          </div>

          {/* ── Body ───────────────────────────────── */}
          <div className="px-6 py-5 space-y-4">
            {/* Type toggle */}
            <div>
              <label className="label-text">Transaction Type</label>
              <div
                className="flex gap-2 p-1 rounded-xl bg-surface-alt border border-border-strong"
              >
                {(['expense', 'income'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTypeChange(t)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      form.type === t
                        ? t === 'income'
                          ? 'bg-income-dim text-income border border-green-300'
                          : 'bg-expense-dim text-expense border border-red-300'
                        : 'bg-transparent text-text-secondary border border-transparent'
                    }`}
                  >
                    {t === 'income' ? (
                      <TrendingUp size={14} />
                    ) : (
                      <TrendingDown size={14} />
                    )}
                    {t === 'income' ? 'Income' : 'Expense'}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="label-text">Category</label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as ExpenseCategory | IncomeCategory,
                  })
                }
                className="glass-input"
              >
                {currentCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="label-text">Amount (₦)</label>
              <div className="relative">
                <span
                  className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold pointer-events-none ${isIncome ? 'text-income' : 'text-expense'}`}
                >
                  ₦
                </span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => {
                    setForm({ ...form, amount: e.target.value });
                    setError('');
                  }}
                  className="glass-input pl-7"
                  min="0"
                  step="any"
                />
              </div>
              {error && (
                <p className="text-xs text-expense mt-1.5">
                  {error}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="label-text">
                Description{' '}
                <span
                  className="text-text-tertiary font-normal normal-case tracking-normal"
                >
                  (optional)
                </span>
              </label>
              <input
                type="text"
                placeholder="What was this for?"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="glass-input"
                maxLength={80}
              />
            </div>

            {/* Date */}
            <div>
              <label className="label-text">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="glass-input"
              />
            </div>
          </div>

          {/* ── Footer ─────────────────────────────── */}
          <div
            className="flex gap-3 px-6 py-4 border-t border-border-strong"
          >
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80 bg-surface-alt border border-border-strong text-text-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
                isIncome
                  ? 'bg-gradient-to-r from-income to-green-600 shadow-income/30'
                  : 'bg-gradient-to-r from-expense to-red-600 shadow-expense/30'
              }`}
            >
              Add {isIncome ? 'Income' : 'Expense'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
