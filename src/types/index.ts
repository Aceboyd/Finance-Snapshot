export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string; // ISO string yyyy-MM-dd
}

export interface Budgets {
  [category: string]: number; // category → budget limit
}

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other'] as const;
export const EXPENSE_CATEGORIES = [
  'Groceries',
  'Dining Out',
  'Transportation',
  'Entertainment',
  'Utilities',
  'Housing',
  'Other',
] as const;

export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
