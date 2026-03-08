import { useState, useEffect } from 'react';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Toaster, toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

import type { Transaction, Budgets } from './types';
import { EXPENSE_CATEGORIES } from './types';

import {
  loadTransactions,
  saveTransactions,
  loadBudgets,
  saveBudgets,
} from './utils/storage';

import './index.css';

import MonthNavigator from './components/MonthNavigator';
import SummaryCards from './components/SummaryCards';
import Visualizations from './components/Visualizations';
import BudgetsSection from './components/BudgetsSection';
import TransactionsList from './components/TransactionsList';
import AddTransactionModal from './components/AddTransactionModal';
import BudgetModal from './components/BudgetModal';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(loadTransactions());
  const [budgets, setBudgets] = useState<Budgets>(loadBudgets());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  useEffect(() => { saveTransactions(transactions); }, [transactions]);
  useEffect(() => { saveBudgets(budgets); }, [budgets]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const filtered = transactions.filter((t) =>
    isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd })
  );

  const income = filtered
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = filtered
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseByCat = EXPENSE_CATEGORIES.map((cat) => ({
    name: cat,
    value: filtered
      .filter((t) => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0),
  }));

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const tx: Transaction = { ...newTx, id: uuidv4() };
    setTransactions((prev) => [...prev, tx]);

    if (tx.type === 'income') {
      toast.success('Income added!');
    } else {
      const spentThisCat = filtered
        .filter((t) => t.type === 'expense' && t.category === tx.category)
        .reduce((s, t) => s + t.amount, 0);
      const newTotal = spentThisCat + tx.amount;
      const budget = budgets[tx.category] || 0;

      if (budget > 0 && newTotal > budget) {
        const overBy = newTotal - budget;
        toast.error(`Over budget in ${tx.category} by ₦${overBy.toLocaleString()}!`);
      } else {
        toast.success('Transaction added!');
      }
    }
  };

  const handleDelete = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast('Transaction removed', { icon: '🗑️' });
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(160deg, #080D1A 0%, #0A1020 40%, #070C18 100%)' }}
    >
      {/* Ambient background glows */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #2774AE, transparent 70%)' }}
        />
        <div
          className="absolute top-1/3 -right-32 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #4F46E5, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-96 h-64 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #10B981, transparent 70%)' }}
        />
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0D1526',
            color: '#F1F5F9',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '0.875rem',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ── Header ───────────────────────────────── */}
        <motion.header
          className="mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo pill */}
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: 'rgba(39,116,174,0.12)',
              border: '1px solid rgba(39,116,174,0.25)',
              color: '#5EA5DB',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 14.93V18h-2v-1.07A4.002 4.002 0 0 1 8 13h2a2 2 0 1 0 2-2 4 4 0 0 1-1-7.93V2h2v1.07A4.002 4.002 0 0 1 16 7h-2a2 2 0 1 0-2 2 4 4 0 0 1 1 7.93z" />
            </svg>
            Personal Finance
          </div>

          <h1
            className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-none"
            style={{
              background: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 50%, #5EA5DB 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Finance Snapshot
          </h1>
          <p className="mt-3 text-base" style={{ color: '#64748B' }}>
            Track smarter. Spend wiser. Live better.
          </p>
        </motion.header>

        {/* ── Month Navigator ───────────────────────── */}
        <MonthNavigator
          currentMonth={currentMonth}
          onChangeMonth={(delta) => {
            const next = new Date(currentMonth);
            next.setMonth(currentMonth.getMonth() + delta);
            setCurrentMonth(next);
          }}
        />

        {/* ── Main Content ─────────────────────────── */}
        <div className="mt-8 space-y-6">
          <SummaryCards totalIncome={income} totalExpenses={expenses} />

          <Visualizations
            expenseByCategory={expenseByCat}
            totalIncome={income}
            totalExpenses={expenses}
          />

          <BudgetsSection
            budgets={budgets}
            transactionsThisMonth={filtered.filter((t) => t.type === 'expense')}
            onOpenModal={() => setShowBudgetModal(true)}
          />

          {/* ── Recent Activity ─────────────────────── */}
          <motion.div
            className="glass-card rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div>
                <h3 className="text-lg font-semibold" style={{ color: '#F1F5F9' }}>
                  Recent Activity
                </h3>
                <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>
                  {filtered.length} transaction{filtered.length !== 1 ? 's' : ''} this month
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  color: '#fff',
                  boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add Transaction
              </button>
            </div>

            <div className="p-2">
              <TransactionsList transactions={filtered} onDelete={handleDelete} />
            </div>
          </motion.div>
        </div>

        {/* ── Footer ───────────────────────────────── */}
        <footer className="mt-12 text-center text-xs" style={{ color: '#334155' }}>
          Finance Snapshot · Data stored locally in your browser
        </footer>
      </div>

      {showAddModal && (
        <AddTransactionModal
          onAdd={handleAddTransaction}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showBudgetModal && (
        <BudgetModal
          budgets={budgets}
          onSave={(newBudgets) => {
            setBudgets(newBudgets);
            setShowBudgetModal(false);
            toast.success('Budgets saved!');
          }}
          onClose={() => setShowBudgetModal(false)}
        />
      )}
    </div>
  );
}
