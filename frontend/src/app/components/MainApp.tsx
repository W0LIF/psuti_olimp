import { useState } from 'react';
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Navigation } from './Navigation';
import { Dashboard, Transaction } from './Dashboard';
import { ImportCSV } from './ImportCSV';
import { SharedBudget } from './SharedBudget';
import { SettingsPage } from './SettingsPage';
import { AboutPage } from './AboutPage';

interface MainAppProps {
  userName: string;
  onLogout: () => void;
}

export function MainApp({ userName: initialUserName, onLogout }: MainAppProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userName, setUserName] = useState(initialUserName);
  const [currentMonth] = useState('Апрель 2026');

  const handleUpdateProfile = (name: string, email: string, password: string) => {
    setUserName(name);
  };

  const handleImportTransactions = (transactions: Omit<Transaction, 'id'>[]) => {
    console.log('Imported transactions:', transactions);
  };

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
                <div className="hidden sm:flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                  <button className="p-1 hover:bg-white rounded transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm px-2">{currentMonth}</span>
                  <button className="p-1 hover:bg-white rounded transition-colors">
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
        {activeTab === 'dashboard' && <Dashboard userName={userName} />}
        {activeTab === 'import' && <ImportCSV onImport={handleImportTransactions} />}
        {activeTab === 'shared' && <SharedBudget />}
        {activeTab === 'settings' && (
          <SettingsPage userName={userName} onUpdateProfile={handleUpdateProfile} />
        )}
        {activeTab === 'about' && <AboutPage />}
      </main>
    </div>
  );
}
