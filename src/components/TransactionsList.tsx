import { AnimatePresence } from 'framer-motion';
import { ReceiptText } from 'lucide-react';
import type { Transaction } from '../types';
import TransactionItem from './TransactionItem';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export default function TransactionsList({ transactions, onDelete }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 gap-3">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center bg-surface-alt"
        >
          <ReceiptText size={24} className="text-text-secondary" />
        </div>
        <p className="text-sm font-medium text-text-secondary">
          No transactions this month
        </p>
        <p className="text-xs text-text-tertiary">
          Add your first transaction to get started
        </p>
      </div>
    );
  }

  // Sort newest first
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <ul className="flex flex-col">
      <AnimatePresence mode="popLayout">
        {sorted.map((tx, index) => (
          <TransactionItem
            key={tx.id}
            transaction={tx}
            onDelete={onDelete}
            index={index}
          />
        ))}
      </AnimatePresence>
    </ul>
  );
}
