import { useAuth } from '../context/AuthContext';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const getCurrentMonthName = () => {
  const now = new Date();
  return `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;
};

export default function App() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full">
      {isAuthenticated && user ? (
        <Dashboard
          userName={user.full_name || user.email}
          currentMonth={getCurrentMonthName()}
          onLogout={logout}
        />
      ) : (
        <AuthPage />
      )}
    </div>
  );
}