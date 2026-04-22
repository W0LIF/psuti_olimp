import { useState, useMemo } from 'react';
import { X, Plus } from 'lucide-react';
import { BalanceCard } from './BalanceCard';
import { BudgetProgress } from './BudgetProgress';
import { SmartTip } from './SmartTip';
import { ExpenseChart } from './ExpenseChart';
import { TransactionForm, Category } from './TransactionForm';
import { TransactionList } from './TransactionList';
import { ForecastPanel } from './ForecastPanel';
import { TransactionFilters, Filters } from './TransactionFilters';

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
  currentMonth: string;
}

// Вспомогательная функция для преобразования названия месяца в индекс
const getMonthIndex = (monthName: string): number => {
  const months: { [key: string]: number } = {
    'Январь': 0, 'Февраль': 1, 'Март': 2, 'Апрель': 3,
    'Май': 4, 'Июнь': 5, 'Июль': 6, 'Август': 7,
    'Сентябрь': 8, 'Октябрь': 9, 'Ноябрь': 10, 'Декабрь': 11
  };
  return months[monthName] || new Date().getMonth();
};

// Функция для фильтрации транзакций по месяцу
const filterTransactionsByMonth = (transactions: Transaction[], currentMonth: string): Transaction[] => {
  if (!currentMonth) return transactions;
  
  const [monthName, yearStr] = currentMonth.split(' ');
  const year = parseInt(yearStr);
  const monthIndex = getMonthIndex(monthName);
  
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getMonth() === monthIndex && 
           transactionDate.getFullYear() === year;
  });
};

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', amount: 35000, category: 'Стипендия', date: '2026-04-01', type: 'income' },
  { id: '2', amount: 500, category: 'Еда', date: '2026-04-05', type: 'expense' },
  { id: '3', amount: 200, category: 'Транспорт', date: '2026-04-06', type: 'expense' },
  { id: '4', amount: 3000, category: 'Кофе', date: '2026-04-10', type: 'expense' },
  { id: '5', amount: 1500, category: 'Развлечения', date: '2026-04-12', type: 'expense' },
  { id: '6', amount: 800, category: 'Учёба', date: '2026-04-15', type: 'expense' },
  { id: '7', amount: 35000, category: 'Стипендия', date: '2026-05-01', type: 'income' },
  { id: '8', amount: 600, category: 'Еда', date: '2026-05-05', type: 'expense' },
  { id: '9', amount: 2500, category: 'Развлечения', date: '2026-05-10', type: 'expense' },
  { id: '10', amount: 30000, category: 'Стипендия', date: '2025-04-01', type: 'income' },
  { id: '11', amount: 1000, category: 'Еда', date: '2025-04-03', type: 'expense' },
];

// Начальные категории
const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Кофе', icon: 'Coffee', color: '#f59e0b', isCustom: false },
  { id: '2', name: 'Еда', icon: 'Coffee', color: '#f97316', isCustom: false },
  { id: '3', name: 'Транспорт', icon: 'Bus', color: '#3b82f6', isCustom: false },
  { id: '4', name: 'Развлечения', icon: 'Film', color: '#ec4899', isCustom: false },
  { id: '5', name: 'Покупки', icon: 'ShoppingBag', color: '#10b981', isCustom: false },
  { id: '6', name: 'Дом', icon: 'Home', color: '#06b6d4', isCustom: false },
  { id: '7', name: 'Учёба', icon: 'BookOpen', color: '#a855f7', isCustom: false },
  { id: '8', name: 'Стипендия', icon: 'Wallet', color: '#22c55e', isCustom: false },
];

export function Dashboard({ userName, currentMonth }: DashboardProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [showTip, setShowTip] = useState(true);
  const [budgetLimit] = useState(30000);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  
  // Состояние для фильтров
  const [filters, setFilters] = useState<Filters>({
    dateRange: 'all',
    startDate: null,
    endDate: null,
    category: null,
    type: 'all',
  });
  
  // Состояние для категорий
  const [customCategories, setCustomCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  // Фильтруем транзакции по выбранному месяцу
  const monthFilteredTransactions = useMemo(() => {
    return filterTransactionsByMonth(transactions, currentMonth);
  }, [transactions, currentMonth]);

  // Функция фильтрации транзакций по всем критериям
  const filteredTransactions = useMemo(() => {
    return monthFilteredTransactions.filter(transaction => {
      // Фильтр по типу (доход/расход/все)
      if (filters.type !== 'all' && transaction.type !== filters.type) {
        return false;
      }
      
      // Фильтр по категории
      if (filters.category && transaction.category !== filters.category) {
        return false;
      }
      
      // Фильтр по дате
      if (filters.dateRange !== 'all') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (filters.dateRange) {
          case 'today': {
            const transDate = new Date(transaction.date);
            transDate.setHours(0, 0, 0, 0);
            if (transDate.getTime() !== today.getTime()) return false;
            break;
          }
          
          case 'week': {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            weekAgo.setHours(0, 0, 0, 0);
            if (new Date(transaction.date) < weekAgo) return false;
            break;
          }
          
          case 'month': {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            monthAgo.setHours(0, 0, 0, 0);
            if (new Date(transaction.date) < monthAgo) return false;
            break;
          }
          
          case 'custom': {
            if (filters.startDate) {
              const start = new Date(filters.startDate);
              start.setHours(0, 0, 0, 0);
              if (new Date(transaction.date) < start) return false;
            }
            if (filters.endDate) {
              const end = new Date(filters.endDate);
              end.setHours(23, 59, 59, 999);
              if (new Date(transaction.date) > end) return false;
            }
            break;
          }
        }
      }
      
      return true;
    });
  }, [monthFilteredTransactions, filters]);

  // Функции для работы с транзакциями
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

  // Функции для работы с категориями
  const handleAddCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: Date.now().toString() };
    setCustomCategories([...customCategories, newCategory]);
  };

  const handleEditCategory = (id: string, name: string) => {
    setCustomCategories(customCategories.map(cat => 
      cat.id === id ? { ...cat, name } : cat
    ));
  };

  const handleDeleteCategory = (id: string) => {
    setCustomCategories(customCategories.filter(cat => cat.id !== id));
  };

  // Расчёты на основе отфильтрованных транзакций
  const income = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;
  const budgetUsed = budgetLimit > 0 ? (expenses / budgetLimit) * 100 : 0;

  // Информация о текущем фильтре
  const getFilterInfo = () => {
    if (!currentMonth) return 'Все транзакции';
    let info = `за ${currentMonth}`;
    if (filters.type !== 'all') {
      info += ` • ${filters.type === 'income' ? 'Доходы' : 'Расходы'}`;
    }
    if (filters.category) {
      info += ` • ${filters.category}`;
    }
    if (filters.dateRange !== 'all') {
      const rangeLabels: Record<string, string> = {
        today: 'Сегодня',
        week: 'За неделю',
        month: 'За месяц',
      };
      info += ` • ${rangeLabels[filters.dateRange] || 'Свои даты'}`;
    }
    return info;
  };

  const hasActiveFilters = filters.dateRange !== 'all' || filters.category !== null || filters.type !== 'all';

  return (
    <div className="space-y-6">
      {/* Индикатор текущих фильтров */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 flex items-center justify-between flex-wrap gap-2">
        <span>
          📊 Показаны транзакции {getFilterInfo()} • Всего: {filteredTransactions.length} шт.
        </span>
        {hasActiveFilters && (
          <button
            onClick={() => setFilters({ dateRange: 'all', startDate: null, endDate: null, category: null, type: 'all' })}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Сбросить фильтры
          </button>
        )}
      </div>

      {/* Сообщение если нет результатов */}
      {filteredTransactions.length === 0 && hasActiveFilters && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <p className="text-yellow-800">По выбранным фильтрам транзакций не найдено</p>
          <button
            onClick={() => setFilters({ dateRange: 'all', startDate: null, endDate: null, category: null, type: 'all' })}
            className="mt-2 text-sm text-yellow-600 underline"
          >
            Сбросить фильтры
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая колонка - основное содержимое */}
        <div className="lg:col-span-2 space-y-6">
          <BalanceCard balance={balance} income={income} expenses={expenses} />

          <BudgetProgress
            spent={expenses}
            remaining={Math.max(0, budgetLimit - expenses)}
            limit={budgetLimit}
            percentage={Math.min(100, budgetUsed)}
          />

          {showTip && (
            <SmartTip onClose={() => setShowTip(false)} />
          )}

          <ForecastPanel 
            transactions={filteredTransactions} 
            balance={balance} 
          />

          <ExpenseChart 
            transactions={filteredTransactions.filter(t => t.type === 'expense')} 
          />
        </div>

        {/* Правая колонка - фильтры и форма добавления */}
        <div className="space-y-6">
          {/* Десктопная форма добавления транзакции */}
          <div className="hidden lg:block">
            <TransactionForm 
              onAdd={addTransaction}
              categories={customCategories}
              onAddCategory={handleAddCategory}
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          </div>
          
          {/* Компонент фильтрации */}
          <TransactionFilters 
            onFilterChange={setFilters}
            categories={customCategories.map(c => c.name)}
            isMobile={false}
            currentFilters={filters}
          />
        </div>
      </div>

      {/* Список транзакций */}
      <TransactionList 
        transactions={filteredTransactions} 
        onDelete={deleteTransaction} 
      />

      {/* Floating button for mobile */}
      <button
        onClick={() => setShowTransactionForm(true)}
        className="lg:hidden fixed bottom-20 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center z-50"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Mobile modal для добавления транзакции */}
      {showTransactionForm && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowTransactionForm(false)}>
          <div
            className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Добавить транзакцию</h3>
              <button
                onClick={() => setShowTransactionForm(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <TransactionForm 
                onAdd={addTransaction}
                categories={customCategories}
                onAddCategory={handleAddCategory}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}