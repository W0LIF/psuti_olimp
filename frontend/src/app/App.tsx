// frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthPage } from '../app/components/AuthPage';
import { Dashboard } from '../app/components/Dashboard';
import { ReportsPage } from '../app/components/ReportsPage';
import { SettingsPage } from '../app/components/SettingsPage';
import { AboutPage } from '../app/components/AboutPage';
import { ImportCSV } from '../app/components/ImportCSV';
import { SharedBudget } from '../app/components/SharedBudget';
import { Navigation } from '../app/components/Navigation';
import { ThemeToggle } from '../app/components/ThemeToggle';

function AppContent() {
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

  if (!isAuthenticated || !user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Верхняя панель с именем пользователя, кнопкой выхода и переключателем темы */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Мои финансы</h1>
              <p className="text-sm text-muted-foreground">{user.full_name || user.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={logout}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Навигационное меню */}
      <div className="container mx-auto px-4 py-3">
        <Navigation />
      </div>

      {/* Основной контент */}
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/import" element={<ImportCSV />} />
          <Route path="/shared" element={<SharedBudget />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}