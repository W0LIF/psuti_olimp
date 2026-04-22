import { useState } from 'react';
import { User, Lock, Mail, Save, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export function SettingsPage() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }
    // TODO: Implement profile update API
    toast.success('Настройки сохранены');
    setSaved(true);
    setNewPassword('');
    setConfirmPassword('');
    setCurrentPassword('');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="mb-2 text-foreground">Настройки профиля</h2>
        <p className="text-muted-foreground">Управляйте своим профилем и безопасностью</p>
      </div>
      {saved && (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-start gap-3 animate-slide-down">
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-emerald-900 dark:text-emerald-300 font-semibold">Изменения сохранены!</p>
            <p className="text-sm text-emerald-700 dark:text-emerald-400">Ваш профиль успешно обновлён</p>
          </div>
        </div>
      )}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-foreground">Основная информация</h3>
              <p className="text-sm text-muted-foreground">Ваши личные данные</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-foreground">Имя</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-input-background rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors" required />
            </div>
            <div>
              <label className="flex items-center gap-2 mb-2 text-foreground"><Mail className="w-4 h-4" /> Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-input-background rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors" required />
            </div>
          </div>
        </div>
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-foreground">Безопасность</h3>
              <p className="text-sm text-muted-foreground">Смена пароля</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-foreground">Текущий пароль</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-4 py-3 bg-input-background rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors" placeholder="••••••••" />
            </div>
            <div>
              <label className="block mb-2 text-foreground">Новый пароль</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 bg-input-background rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors" placeholder="••••••••" />
            </div>
            <div>
              <label className="block mb-2 text-foreground">Подтвердите новый пароль</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 bg-input-background rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors" placeholder="••••••••" />
            </div>
            <p className="text-xs text-muted-foreground">Оставьте поля пустыми, если не хотите менять пароль</p>
          </div>
        </div>
        <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"><Save className="w-5 h-5" /> Сохранить изменения</button>
      </form>
    </div>
  );
}