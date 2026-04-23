import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { X, Settings, AlertCircle, PieChart } from 'lucide-react';
import { BalanceCard } from './BalanceCard';
import { ExpenseChart } from './ExpenseChart';
import { TransactionList } from './TransactionList';
import { TransactionFilters, Filters } from './TransactionFilters';
import { useAsync } from '../../hooks/useAsync';
import { transactionService } from '../../services/transactions';
import { categoryService } from '../../services/categories';
import { toast } from 'sonner';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  comment?: string;
  type: 'income' | 'expense';
}

const parseDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const filterTransactionsByMonth = (transactions: Transaction[], month: number, year: number): Transaction[] => {
  if (!transactions || !Array.isArray(transactions)) return [];
  return transactions.filter(transaction => {
    const date = parseDate(transaction.date);
    return date.getMonth() === month - 1 && date.getFullYear() === year;
  });
};

export function SharedDashboard() {
  const { id } = useParams<{ id: string }>();
  const userId = parseInt(id || '0');

  if (isNaN(userId) || userId <= 0) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Неверный ID пользователя</div>
        <p className="text-muted-foreground">Проверьте ссылку</p>
      </div>
    );
  }

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [filters, setFilters] = useState<Filters>({
    dateRange: 'all',
    startDate: null,
    endDate: null,
    category: null,
    type: 'all',
  });

  // Получаем публичные транзакции пользователя
  const { data: apiTransactions, isLoading: txLoading, error: txError } = useAsync(
    () => transactionService.getPublicTransactions(userId, selectedMonth, selectedYear),
    [userId, selectedMonth, selectedYear]
  );

  const transactions: Transaction[] = useMemo(() => {
    if (!apiTransactions) return [];
    return apiTransactions.map(tx => ({
      id: tx.id.toString(),
      amount: tx.amount,
      category: tx.category,
      date: tx.date,
      comment: tx.comment,
      type: tx.type,
    }));
  }, [apiTransactions]);

  const monthFilteredTransactions = useMemo(() => 
    filterTransactionsByMonth(transactions, selectedMonth, selectedYear),
    [transactions, selectedMonth, selectedYear]
  );

  const filteredTransactions = useMemo(() => {
    return monthFilteredTransactions.filter(transaction => {
      if (filters.type !== 'all' && transaction.type !== filters.type) return false;
      if (filters.category && transaction.category !== filters.category) return false;
      if (filters.dateRange !== 'all') {
        const today = new Date(); today.setHours(0,0,0,0);
        const txDate = parseDate(transaction.date);
        switch (filters.dateRange) {
          case 'today':
            if (txDate.toDateString() !== today.toDateString()) return false;
            break;
          case 'week': {
            const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7); weekAgo.setHours(0,0,0,0);
            if (txDate < weekAgo) return false;
            break;
          }
          case 'month': {
            const monthAgo = new Date(); monthAgo.setMonth(monthAgo.getMonth() - 1); monthAgo.setHours(0,0,0,0);
            if (txDate < monthAgo) return false;
            break;
          }
          case 'custom': {
            if (filters.startDate) {
              const start = parseDate(filters.startDate);
              if (txDate < start) return false;
            }
            if (filters.endDate) {
              const end = parseDate(filters.endDate);
              end.setHours(23,59,59,999);
              if (txDate > end) return false;
            }
            break;
          }
        }
      }
      return true;
    });
  }, [monthFilteredTransactions, filters]);

  const income = useMemo(() => 
    filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );
  const expenses = useMemo(() => 
    filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );
  const balance = income - expenses;

  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

  if (txLoading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (txError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Ошибка загрузки данных</div>
        <p className="text-muted-foreground">Возможно, пользователь не поделился своим дашбордом</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-foreground">Общий дашборд</h1>
        <p className="text-muted-foreground">Просмотр финансов другого пользователя</p>
      </div>

      {/* Панель выбора месяца */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">📊 Период:</span>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className="bg-white dark:bg-gray-800 border border-border rounded-lg px-3 py-1.5 text-sm">
            {monthNames.map((m, idx) => <option key={m} value={idx+1}>{m}</option>)}
          </select>
          <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="bg-white dark:bg-gray-800 border border-border rounded-lg px-3 py-1.5 text-sm">
            {[selectedYear-1, selectedYear, selectedYear+1].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="text-sm text-muted-foreground">
          Всего транзакций: {filteredTransactions.length}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BalanceCard balance={balance} income={income} expenses={expenses} />
          <ExpenseChart transactions={filteredTransactions.filter(t => t.type === 'expense')} />
        </div>

        <div className="space-y-6">
          <TransactionFilters onFilterChange={setFilters} categories={[...new Set(filteredTransactions.map(t => t.category))]} isMobile={false} currentFilters={filters} />
        </div>
      </div>

      <TransactionList transactions={filteredTransactions} onDelete={() => {}} readOnly={true} />
    </div>
  );
}