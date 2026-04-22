import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export function AuthPage() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Успешно вошли в аккаунт');
      } else {
        if (password !== confirmPassword) {
          toast.error('Пароли не совпадают');
          setIsLoading(false);
          return;
        }
        await register(email, password, fullName);
        toast.success('Аккаунт создан! Добро пожаловать');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Ошибка при авторизации';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
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
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-input-background rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors"
                placeholder="Александр"
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
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? 'Загрузка...' : 'Продолжить'}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Данные сохраняются на сервере — доступ с любого устройства
        </p>
      </div>
    </div>
  );
}
