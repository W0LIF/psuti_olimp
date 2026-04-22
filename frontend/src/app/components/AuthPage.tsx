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
    if (isLogin) {
      onLogin(name || 'Александр');
    } else {
      if (password === confirmPassword) {
        onLogin(name);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-center mb-2">Мои финансы</h1>
          <p className="text-center text-muted-foreground text-sm">
            Контролируй свой бюджет легко и просто
          </p>
        </div>

        <div className="flex gap-2 mb-6 bg-muted rounded-lg p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-md transition-all ${
              isLogin
                ? 'bg-white shadow-sm'
                : 'hover:bg-white/50'
            }`}
          >
            Вход
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-md transition-all ${
              !isLogin
                ? 'bg-white shadow-sm'
                : 'hover:bg-white/50'
            }`}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block mb-2">Имя</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-input-background rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors"
                placeholder="Александр"
                required
              />
            </div>
          )}

          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-input-background rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors"
              placeholder="student@mail.ru"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-input-background rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block mb-2">Повторите пароль</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-input-background rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Продолжить
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Данные сохраняются на сервере — доступ с любого устройства
        </p>
      </div>
    </div>
  );
}
