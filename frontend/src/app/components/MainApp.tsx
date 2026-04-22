// frontend/src/app/components/MainApp.tsx
import { useState } from 'react';
import { LogOut, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Navigation } from './Navigation';
import { Dashboard, Transaction } from './Dashboard';
import { ReportsPage } from './ReportsPage';
import { ImportCSV } from './ImportCSV';
import { SharedBudget } from './SharedBudget';
import { SettingsPage } from './SettingsPage';
import { AboutPage } from './AboutPage';

interface MainAppProps {
  userName: string;
  onLogout: () => void;
}

// Начальные транзакции
const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', amount: 35000, category: 'Стипендия', date: '2026-04-01', type: 'income', comment: 'Стипендия за апрель' },
  { id: '2', amount: 500, category: 'Еда', date: '2026-04-05', type: 'expense', comment: 'Продукты' },
  { id: '3', amount: 200, category: 'Транспорт', date: '2026-04-06', type: 'expense', comment: 'Маршрутка' },
  { id: '4', amount: 3000, category: 'Кофе', date: '2026-04-10', type: 'expense', comment: 'Кофе с друзьями' },
  { id: '5', amount: 1500, category: 'Развлечения', date: '2026-04-12', type: 'expense', comment: 'Кино' },
  { id: '6', amount: 800, category: 'Учёба', date: '2026-04-15', type: 'expense', comment: 'Книги' },
  { id: '7', amount: 35000, category: 'Стипендия', date: '2026-05-01', type: 'income', comment: 'Стипендия за май' },
  { id: '8', amount: 600, category: 'Еда', date: '2026-05-05', type: 'expense', comment: 'Продукты' },
  { id: '9', amount: 2500, category: 'Развлечения', date: '2026-05-10', type: 'expense', comment: 'Концерт' },
  { id: '10', amount: 30000, category: 'Стипендия', date: '2025-04-01', type: 'income', comment: 'Стипендия за апрель 2025' },
  { id: '11', amount: 1000, category: 'Еда', date: '2025-04-03', type: 'expense', comment: 'Продукты' },
];

// Функция для получения следующего месяца
const getNextMonth = (current: string): string => {
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  const currentIndex = months.indexOf(current.split(' ')[0]);
  const nextIndex = (currentIndex + 1) % 12;
  const year = current.includes('2026') ? 
    (nextIndex === 0 ? '2027' : '2026') : 
    (nextIndex === 0 ? '2026' : '2025');
  return `${months[nextIndex]} ${year}`;
};

// Функция для получения предыдущего месяца
const getPrevMonth = (current: string): string => {
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  const currentIndex = months.indexOf(current.split(' ')[0]);
  const prevIndex = (currentIndex - 1 + 12) % 12;
  const year = current.includes('2026') ? 
    (prevIndex === 11 ? '2025' : '2026') : 
    (prevIndex === 11 ? '2025' : '2026');
  return `${months[prevIndex]} ${year}`;
};

export function MainApp({ userName: initialUserName, onLogout }: MainAppProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userName, setUserName] = useState(initialUserName);
  const [currentMonth, setCurrentMonth] = useState('Апрель 2026');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  const handleUpdateProfile = (name: string, email: string, password: string) => {
    setUserName(name);
  };

  const handleImportTransactions = (newTransactions: Omit<Transaction, 'id'>[]) => {
    const transactionsWithIds = newTransactions.map(t => ({
      ...t,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }));
    setTransactions([...transactionsWithIds, ...transactions]);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(getPrevMonth(currentMonth));
  };

  const handleNextMonth = () => {
    setCurrentMonth(getNextMonth(currentMonth));
  };

  // Список всех месяцев для выпадающего списка
  const monthOptions = [
    'Январь 2025', 'Февраль 2025', 'Март 2025', 'Апрель 2025', 'Май 2025', 'Июнь 2025',
    'Июль 2025', 'Август 2025', 'Сентябрь 2025', 'Октябрь 2025', 'Ноябрь 2025', 'Декабрь 2025',
    'Январь 2026', 'Февраль 2026', 'Март 2026', 'Апрель 2026', 'Май 2026', 'Июнь 2026',
    'Июль 2026', 'Август 2026', 'Сентябрь 2026', 'Октябрь 2026', 'Ноябрь 2026', 'Декабрь 2026'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-blue-50/30 pb-20 md:pb-0">
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white">{userName[0]}</span>
              </div>
              <div>
                <h2 className="text-foreground">Привет, {userName} 👋</h2>
                <p className="text-xs text-muted-foreground">{currentMonth}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {activeTab === 'dashboard' && (
                <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                  <button 
                    onClick={handlePrevMonth}
                    className="p-1 hover:bg-white rounded transition-colors"
                    title="Предыдущий месяц"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="relative">
                    <select
                      value={currentMonth}
                      onChange={(e) => setCurrentMonth(e.target.value)}
                      className="appearance-none bg-transparent text-sm px-2 py-1 pr-6 cursor-pointer hover:bg-white rounded transition-colors focus:outline-none"
                    >
                      {monthOptions.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                    <Calendar className="absolute right-1 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                  
                  <button 
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-white rounded transition-colors"
                    title="Следующий месяц"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              <button
                onClick={onLogout}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Выйти"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard 
            userName={userName} 
            currentMonth={currentMonth}
            transactions={transactions}
            onAddTransaction={(transaction) => {
              const newTransaction = {
                ...transaction,
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
              };
              setTransactions([newTransaction, ...transactions]);
            }}
            onDeleteTransaction={(id) => {
              setTransactions(transactions.filter(t => t.id !== id));
            }}
          />
        )}
        {activeTab === 'reports' && (
          <ReportsPage 
            transactions={transactions} 
            currentMonth={currentMonth}
          />
        )}
        {activeTab === 'import' && (
          <ImportCSV onImport={handleImportTransactions} />
        )}
        {activeTab === 'shared' && <SharedBudget />}
        {activeTab === 'settings' && (
          <SettingsPage userName={userName} onUpdateProfile={handleUpdateProfile} />
        )}
        {activeTab === 'about' && <AboutPage />}
      </main>
    </div>
  );
}