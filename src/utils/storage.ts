import type { Transaction, Budgets } from '../types';

const TRANSACTIONS_KEY = 'transactions';
const BUDGETS_KEY = 'budgets';

export const loadTransactions = (): Transaction[] => {
  try {
    const data = localStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to load transactions:', err);
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]) => {
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (err) {
    console.error('Failed to save transactions:', err);
  }
};

export const loadBudgets = (): Budgets => {
  try {
    const data = localStorage.getItem(BUDGETS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.error('Failed to load budgets:', err);
    return {};
  }
};

export const saveBudgets = (budgets: Budgets) => {
  try {
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
  } catch (err) {
    console.error('Failed to save budgets:', err);
  }
};