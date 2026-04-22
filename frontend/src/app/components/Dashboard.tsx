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
import { ThemeToggle } from './ThemeToggle';
import { Navigation } from './Navigation';
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

interface DashboardProps {
  userName: string;
  onLogout: () => void;
}

const ALL_CATEGORIES = [
  'Еда', 'Транспорт', 'Кофе', 'Развлечения', 'Учёба',
  'Кафе и рестораны', 'Покупки', 'Здоровье', 'Дом',
  'Связь', 'Образование', 'Прочее'
];

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const parseDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

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

export function Dashboard({ userName, onLogout }: DashboardProps) {
  const [showTip, setShowTip] = useState(true);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showBudgetSettings, setShowBudgetSettings] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Локальное состояние для выбранного месяца и года
  const now = new Date();
  const [localMonth, setLocalMonth] = useState(now.getMonth() + 1);
  const [localYear, setLocalYear] = useState(now.getFullYear());

  const [filters, setFilters] = useState<Filters>({
    dateRange: 'all',
    startDate: null,
    endDate: null,
    category: null,
    type: 'all',
  });

  // Загрузка транзакций
  const { data: apiTransactions, isLoading: txLoading, error: txError, execute: refetchTransactions } = useAsync<ApiTransaction[]>(
    () => transactionService.getMonthlyTransactions(localMonth, localYear),
    [localMonth, localYear, refreshTrigger]
  );

  // Загрузка категорий
  const { data: apiCategories, isLoading: catLoading, error: catError, execute: refetchCategories } = useAsync<ApiCategory[]>(
    () => categoryService.getCategories(),
    [refreshTrigger]
  );

  const refreshAllData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Маппинг транзакций
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

  // Категории для формы
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

  // Локальные лимиты (для UI)
  const [overallLimit, setOverallLimit] = useState(50000);
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>(() => {
    return ALL_CATEGORIES.map(category => ({
      category,
      limit: 0,
      spent: 0
    }));
  });

  // Фильтрация транзакций по выбранному месяцу (уже загружены за нужный месяц)
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
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
  }, [transactions, filters]);

  // Обновление spent для категорий
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

  // CRUD операции
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const category = apiCategories?.find(cat => cat.name === transaction.category);
      if (!category) {
        toast.error('Категория не найдена');
        return;
      }
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
    } catch (error) {
      toast.error('Ошибка при добавлении транзакции');
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await transactionService.deleteTransaction(parseInt(id));
      toast.success('Транзакция удалена');
      refreshAllData();
    } catch (error) {
      toast.error('Ошибка при удалении транзакции');
    }
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
    } catch (error) {
      toast.error('Ошибка при добавлении категории');
    }
  };

  const handleEditCategory = async (id: string, name: string) => {
    try {
      await categoryService.updateCategory(parseInt(id), { name });
      toast.success('Категория обновлена');
      refreshAllData();
    } catch (error) {
      toast.error('Ошибка при обновлении категории');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await categoryService.deleteCategory(parseInt(id));
      toast.success('Категория удалена');
      refreshAllData();
    } catch (error) {
      toast.error('Ошибка при удалении категории');
    }
  };

  const updateOverallLimit = (newLimit: number) => setOverallLimit(newLimit);
  const updateCategoryBudget = (category: string, limit: number) => {
    setCategoryBudgets(prev =>
      prev.map(budget =>
        budget.category === category ? { ...budget, limit } : budget
      )
    );
  };
  const saveAllBudgetsToServer = async () => {
    toast.info('Сохранение лимитов на сервер не подключено');
  };

  // Обработчики смены месяца/года
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalMonth(parseInt(e.target.value));
  };
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalYear(parseInt(e.target.value));
  };

  const displayedMonth = `${MONTH_NAMES[localMonth - 1]} ${localYear}`;

  if (txLoading || catLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  if (txError || catError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 mb-4">Ошибка загрузки данных</div>
          <button
            onClick={refreshAllData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Верхняя строка: приветствие + кнопка выхода + тема + выбор месяца */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Привет, {userName}</h1>
          <p className="text-sm text-muted-foreground">Управление финансами</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <ThemeToggle />
          <select
            value={localMonth}
            onChange={handleMonthChange}
            className="bg-white dark:bg-gray-800 border border-border rounded-lg px-2 py-1 text-sm"
          >
            {MONTH_NAMES.map((m, idx) => (
              <option key={m} value={idx + 1}>{m}</option>
            ))}
          </select>
          <select
            value={localYear}
            onChange={handleYearChange}
            className="bg-white dark:bg-gray-800 border border-border rounded-lg px-2 py-1 text-sm"
          >
            {[localYear - 1, localYear, localYear + 1].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button onClick={onLogout} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90">
            Выйти
          </button>
        </div>
      </div>

      {/* Навигационное меню */}
      <Navigation />

      {/* Информационная строка (только количество транзакций и сброс фильтров) */}
      <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-200 flex items-center justify-between flex-wrap gap-2">
        <span>📊 Показаны транзакции за {displayedMonth} • Всего: {filteredTransactions.length} шт.</span>
        {hasActiveFilters && (
          <button onClick={() => setFilters({ dateRange: 'all', startDate: null, endDate: null, category: null, type: 'all' })} className="text-xs text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 underline">
            Сбросить фильтры
          </button>
        )}
      </div>

      {/* Предупреждения о превышении бюджета */}
      {overallLimit > 0 && isOverOverallLimit && (
        <div className="bg-red-50 dark:bg-red-950/40 border-l-4 border-red-500 p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="font-semibold text-red-800 dark:text-red-200">⚠️ Превышение общего бюджета!</p>
              <p className="text-sm text-red-700 dark:text-red-300">Вы превысили лимит на {Math.abs(overallLimit - expenses).toLocaleString()} ₽</p>
            </div>
          </div>
        </div>
      )}
      {overallLimit > 0 && isNearOverallLimit && !isOverOverallLimit && (
        <div className="bg-yellow-50 dark:bg-yellow-950/40 border-l-4 border-yellow-500 p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <div>
              <p className="font-semibold text-yellow-800 dark:text-yellow-200">⚠️ Внимание! Бюджет почти исчерпан</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Потрачено {Math.round(overallPercentage)}% от лимита. Осталось: {(overallLimit - expenses).toLocaleString()} ₽</p>
            </div>
          </div>
        </div>
      )}

      {filteredTransactions.length === 0 && hasActiveFilters && (
        <div className="bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-center">
          <p className="text-yellow-800 dark:text-yellow-200">По выбранным фильтрам транзакций не найдено</p>
          <button onClick={() => setFilters({ dateRange: 'all', startDate: null, endDate: null, category: null, type: 'all' })} className="mt-2 text-sm text-yellow-600 dark:text-yellow-300 underline">Сбросить фильтры</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BalanceCard balance={balance} income={income} expenses={expenses} />
          {overallLimit > 0 && (
            <BudgetProgress
              spent={expenses}
              remaining={Math.max(0, overallLimit - expenses)}
              limit={overallLimit}
              percentage={Math.min(100, overallPercentage)}
            />
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
            <TransactionForm 
              onAdd={addTransaction} 
              categories={allCategoriesForForm}
              onAddCategory={handleAddCategory} 
              onEditCategory={handleEditCategory} 
              onDeleteCategory={handleDeleteCategory} 
            />
          </div>
          <TransactionFilters 
            onFilterChange={setFilters} 
            categories={allCategoriesForForm.map(c => c.name)} 
            isMobile={false} 
            currentFilters={filters} 
          />
        </div>
      </div>

      <TransactionList transactions={filteredTransactions} onDelete={deleteTransaction} />

      <BudgetSettingsModal 
        isOpen={showBudgetSettings} 
        onClose={() => setShowBudgetSettings(false)} 
        overallLimit={overallLimit} 
        onUpdateOverallLimit={updateOverallLimit} 
        categoryBudgets={categoryBudgets} 
        onUpdateCategoryBudget={updateCategoryBudget} 
        onSaveAll={saveAllBudgetsToServer}
      />

      <button 
        onClick={() => setShowTransactionForm(true)} 
        className="lg:hidden fixed bottom-20 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center z-50"
      >
        <Plus className="w-6 h-6" />
      </button>

      {showTransactionForm && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowTransactionForm(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-border p-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-foreground">Добавить транзакцию</h3>
              <button onClick={() => setShowTransactionForm(false)} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4">
              <TransactionForm 
                onAdd={addTransaction} 
                categories={allCategoriesForForm}
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