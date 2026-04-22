import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { BalanceCard } from './BalanceCard';
import { BudgetProgress } from './BudgetProgress';
import { SmartTip } from './SmartTip';
import { ExpenseChart } from './ExpenseChart';
import { TransactionForm } from './TransactionForm';
import { TransactionList } from './TransactionList';
import { ForecastPanel } from './ForecastPanel';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  comment?: string;
  type: 'income' | 'expense';
}

interface DashboardProps {
  userName: string;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', amount: 35000, category: 'Стипендия', date: '2026-04-01', type: 'income' },
  { id: '2', amount: 500, category: 'Еда', date: '2026-04-05', type: 'expense' },
  { id: '3', amount: 200, category: 'Транспорт', date: '2026-04-06', type: 'expense' },
  { id: '4', amount: 3000, category: 'Кофе', date: '2026-04-10', type: 'expense' },
  { id: '5', amount: 1500, category: 'Развлечения', date: '2026-04-12', type: 'expense' },
  { id: '6', amount: 800, category: 'Учёба', date: '2026-04-15', type: 'expense' },
];

export function Dashboard({ userName }: DashboardProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [showTip, setShowTip] = useState(true);
  const [budgetLimit] = useState(30000);
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([newTransaction, ...transactions]);
    setShowTransactionForm(false);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;
  const budgetUsed = (expenses / budgetLimit) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <BalanceCard balance={balance} income={income} expenses={expenses} />

            <BudgetProgress
              spent={expenses}
              remaining={budgetLimit - expenses}
              limit={budgetLimit}
              percentage={budgetUsed}
            />

            {showTip && (
              <SmartTip onClose={() => setShowTip(false)} />
            )}

            <ForecastPanel transactions={transactions} balance={balance} />

            <ExpenseChart transactions={transactions.filter(t => t.type === 'expense')} />
          </div>

          <div className="space-y-6">
            <div className="hidden lg:block">
              <TransactionForm onAdd={addTransaction} />
            </div>
            <TransactionList transactions={transactions} onDelete={deleteTransaction} />
          </div>
        </div>

      {/* Floating button for mobile */}
      <button
        onClick={() => setShowTransactionForm(true)}
        className="lg:hidden fixed bottom-20 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center z-50"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Mobile modal */}
      {showTransactionForm && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowTransactionForm(false)}>
          <div
            className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between">
              <h3>Добавить транзакцию</h3>
              <button
                onClick={() => setShowTransactionForm(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <TransactionForm onAdd={addTransaction} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
