import { useState } from 'react';
import { AuthPage } from './components/AuthPage';
import { MainApp } from './components/MainApp';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  const handleLogin = (name: string) => {
    setUserName(name);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName('');
  };

  return (
    <div className="size-full">
      {isAuthenticated ? (
        <MainApp userName={userName} onLogout={handleLogout} />
      ) : (
        <AuthPage onLogin={handleLogin} />
      )}
    </div>
  );
}