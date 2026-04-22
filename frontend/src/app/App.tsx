import { useAuth } from '../context/AuthContext';
import { AuthPage } from './components/AuthPage';
import { MainApp } from './components/MainApp';

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
        <MainApp userName={user.full_name || user.email} onLogout={logout} />
      ) : (
        <AuthPage />
      )}
    </div>
  );
}