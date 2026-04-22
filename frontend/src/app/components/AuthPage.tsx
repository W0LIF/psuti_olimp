import { useState } from 'react';

interface AuthPageProps {
  onLogin: (name: string) => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) onLogin(name || 'Александр');
    else if (password === confirmPassword) onLogin(name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-center mb-2 text-foreground">Мои финансы</h1>
          <p className="text-center text-muted-foreground text-sm">Контролируй свой бюджет легко и просто</p>
        </div>
        <div className="flex gap-2 mb-6 bg-muted dark:bg-gray-700 rounded-lg p-1">
          <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 rounded-md transition-all ${isLogin ? 'bg-white dark:bg-gray-700 shadow-sm text-foreground' : 'hover:bg-white/50 dark:hover:bg-gray-700/50 text-muted-foreground'}`}>Вход</button>
          <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 rounded-md transition-all ${!isLogin ? 'bg-white dark:bg-gray-700 shadow-sm text-foreground' : 'hover:bg-white/50 dark:hover:bg-gray-700/50 text-muted-foreground'}`}>Регистрация</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block mb-2 text-foreground">Имя</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-input-background dark:bg-gray-700 rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground" placeholder="Александр" required />
            </div>
          )}
          <div>
            <label className="block mb-2 text-foreground">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-input-background dark:bg-gray-700 rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground" placeholder="student@mail.ru" required />
          </div>
          <div>
            <label className="block mb-2 text-foreground">Пароль</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-input-background dark:bg-gray-700 rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground" placeholder="••••••••" required />
          </div>
          {!isLogin && (
            <div>
              <label className="block mb-2 text-foreground">Повторите пароль</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 bg-input-background dark:bg-gray-700 rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground" placeholder="••••••••" required />
            </div>
          )}
          <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity">Продолжить</button>
        </form>
        <p className="text-center text-xs text-muted-foreground mt-6">Данные сохраняются на сервере — доступ с любого устройства</p>
      </div>
    </div>
  );
}