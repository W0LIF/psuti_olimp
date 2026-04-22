// frontend/src/app/components/Navigation.tsx
import { NavLink } from 'react-router-dom';
import { Home, FileText, Users, Settings, Info, BarChart } from 'lucide-react';

const TABS = [
  { id: 'dashboard', path: '/dashboard', label: 'Главная', icon: Home },
  { id: 'reports', path: '/reports', label: 'Отчеты', icon: BarChart },
  { id: 'import', path: '/import', label: 'Импорт', icon: FileText },
  { id: 'shared', path: '/shared', label: 'Совместный', icon: Users },
  { id: 'settings', path: '/settings', label: 'Настройки', icon: Settings },
  { id: 'about', path: '/about', label: 'О приложении', icon: Info },
];

export function Navigation() {
  return (
    <>
      <nav className="hidden md:flex items-center gap-2 bg-muted rounded-lg p-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  isActive ? 'bg-white dark:bg-gray-800 shadow-sm' : 'hover:bg-white/50 dark:hover:bg-gray-800/50'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-border z-40">
        <div className="flex items-center justify-around">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.id}
                to={tab.path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-3 px-2 flex-1 transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{tab.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
}