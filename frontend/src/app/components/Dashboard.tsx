import { useState, useMemo, useEffect } from 'react';
import { X, Plus, Settings, AlertCircle, Target, PieChart } from 'lucide-react';
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

export interface CategoryBudget {
  category: string;
  limit: number;
  spent: number;
}

interface DashboardProps {
  userName: string;
  currentMonth: string;
}

// Список всех категорий
const ALL_CATEGORIES = [
  'Еда', 'Транспорт', 'Кофе', 'Развлечения', 'Учёба', 
  'Кафе и рестораны', 'Покупки', 'Здоровье', 'Дом', 
  'Связь', 'Образование', 'Прочее'
];

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

// Компонент для настройки лимитов
function BudgetSettingsModal({ 
  isOpen, 
  onClose, 
  overallLimit, 
  onUpdateOverallLimit,
  categoryBudgets,
  onUpdateCategoryBudget
}: { 
  isOpen: boolean; 
  onClose: () => void;
  overallLimit: number;
  onUpdateOverallLimit: (limit: number) => void;
  categoryBudgets: CategoryBudget[];
  onUpdateCategoryBudget: (category: string, limit: number) => void;
}) {
  const [tempOverallLimit, setTempOverallLimit] = useState(overallLimit.toString());
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [tempLimit, setTempLimit] = useState('');

  const handleSaveOverall = () => {
    const newLimit = parseFloat(tempOverallLimit);
    if (!isNaN(newLimit) && newLimit > 0) {
      onUpdateOverallLimit(newLimit);
    }
  };

  const handleEditCategory = (category: string, currentLimit: number) => {
    setEditingCategory(category);
    setTempLimit(currentLimit.toString());
  };

  const handleSaveCategory = (category: string) => {
    const newLimit = parseFloat(tempLimit);
    if (!isNaN(newLimit) && newLimit >= 0) {
      onUpdateCategoryBudget(category, newLimit);
    }
    setEditingCategory(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Target className="w-5 h-5" />
            Настройка лимитов
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Общий лимит */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Общий лимит на месяц</h3>
            <div className="flex gap-2">
              <input
                type="number"
                value={tempOverallLimit}
                onChange={(e) => setTempOverallLimit(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Сумма лимита"
              />
              <button
                onClick={handleSaveOverall}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Сохранить
              </button>
            </div>
          </div>

          {/* Лимиты по категориям */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Лимиты по категориям</h3>
            <div className="space-y-2">
              {categoryBudgets.map(({ category, limit, spent }) => (
                <div key={category} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-700">{category}</span>
                      <p className="text-xs text-gray-500">Потрачено: {spent.toLocaleString()} ₽</p>
                    </div>
                    {editingCategory === category ? (
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={tempLimit}
                          onChange={(e) => setTempLimit(e.target.value)}
                          className="w-32 px-2 py-1 text-sm border border-gray-300 rounded"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveCategory(category)}
                          className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          Сохранить
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                        >
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditCategory(category, limit)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {limit > 0 ? `${limit.toLocaleString()} ₽` : 'Не задан'} ✏️
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Компонент для отображения прогресса по категории
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
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium">{category}</span>
        <span className={isOverLimit ? 'text-red-600 font-semibold' : isNearLimit ? 'text-yellow-600' : 'text-gray-600'}>
          {spent.toLocaleString()} / {limit.toLocaleString()} ₽
        </span>
      </div>
      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
        <div
          style={{ width: `${Math.min(percentage, 100)}%` }}
          className={`transition-all duration-500 ${statusColor}`}
        />
      </div>
      {isOverLimit && (
        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Превышение на {Math.abs(remaining).toLocaleString()} ₽
        </p>
      )}
      {isNearLimit && (
        <p className="text-xs text-yellow-600 mt-1">
          Осталось: {remaining.toLocaleString()} ₽
        </p>
      )}
    </div>
  );
}

export function Dashboard({ userName, currentMonth }: DashboardProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [showTip, setShowTip] = useState(true);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showBudgetSettings, setShowBudgetSettings] = useState(false);
  
  // Общий лимит
  const [overallLimit, setOverallLimit] = useState(() => {
    const saved = localStorage.getItem(`overall_limit_${currentMonth}`);
    return saved ? JSON.parse(saved) : 50000;
  });
  
  // Лимиты по категориям
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>(() => {
    const saved = localStorage.getItem(`category_budgets_${currentMonth}`);
    if (saved) return JSON.parse(saved);
    
    // Инициализация лимитов для категорий, которые есть в транзакциях
    const initialBudgets: CategoryBudget[] = ALL_CATEGORIES.map(category => ({
      category,
      limit: 0,
      spent: 0
    }));
    return initialBudgets;
  });

  // Фильтруем транзакции по выбранному месяцу
  const filteredTransactions = useMemo(() => {
    return filterTransactionsByMonth(transactions, currentMonth);
  }, [transactions, currentMonth]);

  // Обновляем потраченные суммы по категориям
  useEffect(() => {
    const expensesByCategory = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
    
    setCategoryBudgets(prev => 
      prev.map(budget => ({
        ...budget,
        spent: expensesByCategory[budget.category] || 0
      }))
    );
  }, [filteredTransactions]);

  // Сохраняем лимиты в localStorage
  useEffect(() => {
    localStorage.setItem(`overall_limit_${currentMonth}`, JSON.stringify(overallLimit));
  }, [overallLimit, currentMonth]);

  useEffect(() => {
    localStorage.setItem(`category_budgets_${currentMonth}`, JSON.stringify(categoryBudgets));
  }, [categoryBudgets, currentMonth]);

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

  // Расчёты на основе отфильтрованных транзакций
  const income = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;
  const overallPercentage = overallLimit > 0 ? (expenses / overallLimit) * 100 : 0;
  const isOverOverallLimit = expenses >= overallLimit && overallLimit > 0;
  const isNearOverallLimit = overallPercentage >= 80 && overallPercentage < 100 && overallLimit > 0;

  // Активные лимиты по категориям (где limit > 0)
  const activeCategoryBudgets = categoryBudgets.filter(b => b.limit > 0);

  const updateOverallLimit = (newLimit: number) => {
    setOverallLimit(newLimit);
  };

  const updateCategoryBudget = (category: string, limit: number) => {
    setCategoryBudgets(prev =>
      prev.map(budget =>
        budget.category === category ? { ...budget, limit } : budget
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Предупреждения о лимитах */}
      {overallLimit > 0 && (
        <>
          {isOverOverallLimit && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-pulse">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-semibold text-red-800">⚠️ Превышение общего бюджета!</p>
                  <p className="text-sm text-red-700">
                    Вы превысили лимит на {Math.abs(overallLimit - expenses).toLocaleString()} ₽
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {isNearOverallLimit && !isOverOverallLimit && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-semibold text-yellow-800">⚠️ Внимание! Бюджет почти исчерпан</p>
                  <p className="text-sm text-yellow-700">
                    Потрачено {Math.round(overallPercentage)}% от лимита. Осталось: {(overallLimit - expenses).toLocaleString()} ₽
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BalanceCard balance={balance} income={income} expenses={expenses} />

          {/* Прогресс общего бюджета */}
          {overallLimit > 0 && (
            <BudgetProgress
              spent={expenses}
              remaining={Math.max(0, overallLimit - expenses)}
              limit={overallLimit}
              percentage={Math.min(100, overallPercentage)}
            />
          )}

          {/* Прогресс по категориям */}
          {activeCategoryBudgets.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-gray-800">Лимиты по категориям</h3>
              </div>
              <div className="space-y-3">
                {activeCategoryBudgets.map(budget => (
                  <CategoryBudgetProgress key={budget.category} {...budget} />
                ))}
              </div>
            </div>
          )}

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

        <div className="space-y-6">
          {/* Кнопка настройки лимитов */}
          <button
            onClick={() => setShowBudgetSettings(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            <Settings className="w-4 h-4" />
            Настроить лимиты
          </button>

          <div className="hidden lg:block">
            <TransactionForm onAdd={addTransaction} />
          </div>
          <TransactionList 
            transactions={filteredTransactions} 
            onDelete={deleteTransaction} 
          />
        </div>
      </div>

      {/* Модальное окно настроек лимитов */}
      <BudgetSettingsModal
        isOpen={showBudgetSettings}
        onClose={() => setShowBudgetSettings(false)}
        overallLimit={overallLimit}
        onUpdateOverallLimit={updateOverallLimit}
        categoryBudgets={categoryBudgets}
        onUpdateCategoryBudget={updateCategoryBudget}
      />

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