import { Home, FileText, Users, Settings, Info } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: 'dashboard', label: 'Главная', icon: Home },
  { id: 'import', label: 'Импорт', icon: FileText },
  { id: 'shared', label: 'Совместный', icon: Users },
  { id: 'settings', label: 'Настройки', icon: Settings },
  { id: 'about', label: 'О приложении', icon: Info },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <>
      <nav className="hidden md:flex items-center gap-2 bg-muted rounded-lg p-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id ? 'bg-white dark:bg-gray-800 shadow-sm' : 'hover:bg-white/50 dark:hover:bg-gray-800/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
            </button>
          );
        })}
      </nav>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-border z-40">
        <div className="flex items-center justify-around">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center gap-1 py-3 px-2 flex-1 transition-colors ${
                  activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}