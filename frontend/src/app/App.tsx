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
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                userName={user.full_name || user.email}
                onLogout={logout}
              />
            }
          />
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