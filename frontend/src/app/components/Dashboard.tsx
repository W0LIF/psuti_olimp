// frontend/src/app/components/Dashboard.tsx
import { useState, useMemo, useEffect } from 'react';
import { X, Plus, Settings, AlertCircle, PieChart } from 'lucide-react';
import { BalanceCard } from './BalanceCard';
import { BudgetProgress } from './BudgetProgress';
import { SmartTip } from './SmartTip';
import { ExpenseChart } from './ExpenseChart';
import { TransactionForm, Category } from './TransactionForm';
import { TransactionList } from './TransactionList';
import { ForecastPanel } from './ForecastPanel';
import { TransactionFilters, Filters } from './TransactionFilters';
import { useAsync } from '../../hooks/useAsync';
import { transactionService, Transaction as ApiTransaction } from '../../services/transactions';
import { categoryService, Category as ApiCategory } from '../../services/categories';
import { toast } from 'sonner';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  comment?: string;
  type: 'income' | 'expense';
}

export interface CategoryBudget {
  category: string;
  limit: number;
  spent: number;
}

const getMonthIndex = (monthName: string): number => {
  const months: { [key: string]: number } = {
    'Январь': 0, 'Февраль': 1, 'Март': 2, 'Апрель': 3,
    'Май': 4, 'Июнь': 5, 'Июль': 6, 'Август': 7,
    'Сентябрь': 8, 'Октябрь': 9, 'Ноябрь': 10, 'Декабрь': 11
  };
  return months[monthName] || new Date().getMonth();
};

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

const ALL_CATEGORIES = [
  'Еда', 'Транспорт', 'Кофе', 'Развлечения', 'Учёба',
  'Кафе и рестораны', 'Покупки', 'Здоровье', 'Дом',
  'Связь', 'Образование', 'Прочее'
];

function BudgetSettingsModal({ isOpen, onClose, overallLimit, onUpdateOverallLimit, categoryBudgets, onUpdateCategoryBudget, onSaveAll }: any) {
  const [tempOverallLimit, setTempOverallLimit] = useState(overallLimit.toString());
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [tempLimit, setTempLimit] = useState('');

  if (!isOpen) return null;

  const handleSaveOverall = () => {
    const newLimit = parseFloat(tempOverallLimit);
    if (!isNaN(newLimit) && newLimit > 0) onUpdateOverallLimit(newLimit);
  };

  const handleSaveCategory = (category: string) => {
    const newLimit = parseFloat(tempLimit);
    if (!isNaN(newLimit) && newLimit >= 0) onUpdateCategoryBudget(category, newLimit);
    setEditingCategory(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-lg font-medium flex items-center gap-2 text-foreground">Настройка лимитов</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 rounded-xl p-4">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Общий лимит на месяц</h3>
            <div className="flex gap-2">
              <input type="number" value={tempOverallLimit} onChange={(e) => setTempOverallLimit(e.target.value)} className="flex-1 px-4 py-2 bg-input-background dark:bg-gray-700 rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors text-foreground" />
              <button onClick={handleSaveOverall} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">Сохранить</button>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Лимиты по категориям</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {categoryBudgets.map(({ category, limit, spent }: any) => (
                <div key={category} className="bg-muted dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-foreground">{category}</span>
                      <p className="text-xs text-muted-foreground">Потрачено: {spent.toLocaleString()} ₽</p>
                    </div>
                    {editingCategory === category ? (
                      <div className="flex gap-2">
                        <input type="number" value={tempLimit} onChange={(e) => setTempLimit(e.target.value)} className="w-32 px-2 py-1 text-sm bg-input-background dark:bg-gray-700 rounded border border-border focus:border-primary" autoFocus />
                        <button onClick={() => handleSaveCategory(category)} className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Сохранить</button>
                        <button onClick={() => setEditingCategory(null)} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">Отмена</button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditingCategory(category); setTempLimit(limit.toString()); }} className="text-sm text-primary hover:underline">{limit > 0 ? `${limit.toLocaleString()} ₽` : 'Не задан'} ✏️</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button onClick={onClose} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg">Закрыть</button>
            {onSaveAll && (
              <button onClick={onSaveAll} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Сохранить все</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryBudgetProgress({ category, limit, spent }: CategoryBudget) {
  const percentage = limit > 0 ? (spent / limit) * 100 : 0;
  const remaining = limit - spent;
  const isOverLimit = spent >= limit && limit > 0;
  const isNearLimit = percentage >= 80 && percentage < 100 && limit > 0;
  if (limit === 0) return null;
  let statusColor = 'bg-emerald-500';
  if (isOverLimit) statusColor = 'bg-red-500';
  else if (isNearLimit) statusColor = 'bg-yellow-500';
  else if (percentage >= 50) statusColor = 'bg-blue-500';
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-border">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-foreground">{category}</span>
        <span className={isOverLimit ? 'text-red-600 dark:text-red-400 font-semibold' : isNearLimit ? 'text-yellow-600 dark:text-yellow-400' : 'text-muted-foreground'}>
          {spent.toLocaleString()} / {limit.toLocaleString()} ₽
        </span>
      </div>
      <div className="overflow-hidden h-2 text-xs flex rounded-full bg-muted">
        <div style={{ width: `${Math.min(percentage, 100)}%` }} className={`transition-all duration-500 rounded-full ${statusColor}`} />
      </div>
      {isOverLimit && <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">Превышение на {Math.abs(remaining).toLocaleString()} ₽</p>}
      {isNearLimit && <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Осталось: {remaining.toLocaleString()} ₽</p>}
    </div>
  );
}

export function Dashboard() {
  const [showTip, setShowTip] = useState(true);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showBudgetSettings, setShowBudgetSettings] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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

  const { data: apiTransactions, isLoading: txLoading, error: txError } = useAsync<ApiTransaction[]>(
    () => transactionService.getMonthlyTransactions(selectedMonth, selectedYear),
    [selectedMonth, selectedYear, refreshTrigger]
  );

  const { data: apiCategories, isLoading: catLoading, error: catError } = useAsync<ApiCategory[]>(
    () => categoryService.getCategories(),
    [refreshTrigger]
  );

  const refreshAllData = () => setRefreshTrigger(prev => prev + 1);

  const transactions: Transaction[] = useMemo(() => {
    if (!apiTransactions || !apiCategories) return [];
    return apiTransactions.map(tx => {
      const category = apiCategories.find(cat => cat.id === tx.category_id);
      return {
        id: tx.id.toString(),
        amount: tx.amount,
        category: category?.name || 'Неизвестная категория',
        date: tx.date,
        comment: tx.comment,
        type: tx.type,
      };
    });
  }, [apiTransactions, apiCategories]);

  const allCategoriesForForm: Category[] = useMemo(() => {
    if (!apiCategories) return [];
    return apiCategories.map(cat => ({
      id: cat.id.toString(),
      name: cat.name,
      icon: cat.icon,
      color: '#10b981',
      isCustom: !cat.is_default,
    }));
  }, [apiCategories]);

  const [overallLimit, setOverallLimit] = useState(50000);
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>(() => 
    ALL_CATEGORIES.map(category => ({ category, limit: 0, spent: 0 }))
  );

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

  useEffect(() => {
    const expensesByCategory = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
    setCategoryBudgets(prev => prev.map(budget => ({
      ...budget,
      spent: expensesByCategory[budget.category] || 0
    })));
  }, [filteredTransactions]);

  const income = useMemo(() => 
    filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );
  const expenses = useMemo(() => 
    filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );
  const balance = income - expenses;
  const overallPercentage = overallLimit > 0 ? (expenses / overallLimit) * 100 : 0;
  const isOverOverallLimit = expenses >= overallLimit && overallLimit > 0;
  const isNearOverallLimit = overallPercentage >= 80 && overallPercentage < 100 && overallLimit > 0;
  const hasActiveFilters = filters.dateRange !== 'all' || filters.category !== null || filters.type !== 'all';

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const category = apiCategories?.find(cat => cat.name === transaction.category);
      if (!category) { toast.error('Категория не найдена'); return; }
      await transactionService.createTransaction({
        amount: transaction.amount,
        type: transaction.type,
        date: transaction.date,
        comment: transaction.comment,
        category_id: category.id,
      });
      toast.success('Транзакция добавлена');
      setShowTransactionForm(false);
      refreshAllData();
    } catch (error) { toast.error('Ошибка при добавлении транзакции'); }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await transactionService.deleteTransaction(parseInt(id));
      toast.success('Транзакция удалена');
      refreshAllData();
    } catch (error) { toast.error('Ошибка при удалении транзакции'); }
  };

  const handleAddCategory = async (category: Omit<Category, 'id'>) => {
    try {
      await categoryService.createCategory({
        name: category.name,
        icon: category.icon,
        is_default: false,
      });
      toast.success('Категория добавлена');
      refreshAllData();
    } catch (error) { toast.error('Ошибка при добавлении категории'); }
  };

  const handleEditCategory = async (id: string, name: string) => {
    try {
      await categoryService.updateCategory(parseInt(id), { name });
      toast.success('Категория обновлена');
      refreshAllData();
    } catch (error) { toast.error('Ошибка при обновлении категории'); }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await categoryService.deleteCategory(parseInt(id));
      toast.success('Категория удалена');
      refreshAllData();
    } catch (error) { toast.error('Ошибка при удалении категории'); }
  };

  const updateOverallLimit = (newLimit: number) => setOverallLimit(newLimit);
  const updateCategoryBudget = (category: string, limit: number) => {
    setCategoryBudgets(prev => prev.map(budget =>
      budget.category === category ? { ...budget, limit } : budget
    ));
  };
  const saveAllBudgetsToServer = () => toast.info('Сохранение лимитов на сервер не подключено');

  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

  if (txLoading || catLoading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (txError || catError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Ошибка загрузки данных</div>
        <button onClick={refreshAllData} className="px-4 py-2 bg-primary text-white rounded-lg">Повторить</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          {hasActiveFilters && (
            <button onClick={() => setFilters({ dateRange: 'all', startDate: null, endDate: null, category: null, type: 'all' })} className="ml-2 text-xs text-blue-600 underline">
              Сбросить фильтры
            </button>
          )}
        </div>
      </div>

      {/* Предупреждения о бюджете */}
      {overallLimit > 0 && isOverOverallLimit && (
        <div className="bg-red-50 dark:bg-red-950/40 border-l-4 border-red-500 p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-semibold text-red-800">⚠️ Превышение общего бюджета!</p>
              <p className="text-sm text-red-700">Превышение на {Math.abs(overallLimit - expenses).toLocaleString()} ₽</p>
            </div>
          </div>
        </div>
      )}
      {overallLimit > 0 && isNearOverallLimit && !isOverOverallLimit && (
        <div className="bg-yellow-50 dark:bg-yellow-950/40 border-l-4 border-yellow-500 p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-semibold text-yellow-800">⚠️ Бюджет почти исчерпан</p>
              <p className="text-sm text-yellow-700">Потрачено {Math.round(overallPercentage)}% от лимита</p>
            </div>
          </div>
        </div>
      )}

      {filteredTransactions.length === 0 && hasActiveFilters && (
        <div className="bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 rounded-xl p-4 text-center">
          <p className="text-yellow-800">По выбранным фильтрам транзакций не найдено</p>
          <button onClick={() => setFilters({ dateRange: 'all', startDate: null, endDate: null, category: null, type: 'all' })} className="mt-2 text-sm text-yellow-600 underline">
            Сбросить фильтры
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BalanceCard balance={balance} income={income} expenses={expenses} />
          {overallLimit > 0 && (
            <BudgetProgress spent={expenses} remaining={Math.max(0, overallLimit - expenses)} limit={overallLimit} percentage={Math.min(100, overallPercentage)} />
          )}
          {showTip && <SmartTip onClose={() => setShowTip(false)} />}
          <ForecastPanel transactions={filteredTransactions} balance={balance} />
          <ExpenseChart transactions={filteredTransactions.filter(t => t.type === 'expense')} />
        </div>

        <div className="space-y-6">
          <button onClick={() => setShowBudgetSettings(true)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90">
            <Settings className="w-4 h-4" /> Настроить лимиты
          </button>
          <div className="hidden lg:block">
            <TransactionForm onAdd={addTransaction} categories={allCategoriesForForm} onAddCategory={handleAddCategory} onEditCategory={handleEditCategory} onDeleteCategory={handleDeleteCategory} />
          </div>
          <TransactionFilters onFilterChange={setFilters} categories={allCategoriesForForm.map(c => c.name)} isMobile={false} currentFilters={filters} />
        </div>
      </div>

      <TransactionList transactions={filteredTransactions} onDelete={deleteTransaction} />

      <BudgetSettingsModal isOpen={showBudgetSettings} onClose={() => setShowBudgetSettings(false)} overallLimit={overallLimit} onUpdateOverallLimit={updateOverallLimit} categoryBudgets={categoryBudgets} onUpdateCategoryBudget={updateCategoryBudget} onSaveAll={saveAllBudgetsToServer} />

      <button onClick={() => setShowTransactionForm(true)} className="lg:hidden fixed bottom-20 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center z-50">
        <Plus className="w-6 h-6" />
      </button>

      {showTransactionForm && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowTransactionForm(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-border p-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Добавить транзакцию</h3>
              <button onClick={() => setShowTransactionForm(false)} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4">
              <TransactionForm onAdd={addTransaction} categories={allCategoriesForForm} onAddCategory={handleAddCategory} onEditCategory={handleEditCategory} onDeleteCategory={handleDeleteCategory} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}