import { useState } from 'react';
import { Share2, Copy, Users, CheckCircle, Send, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function SharedBudget() {
  const { user } = useAuth();
  const [shareLink] = useState(`https://frontend-olimp.onrender.com/shared/${user?.id}`);
  const [copied, setCopied] = useState(false);
  const [telegramUsername, setTelegramUsername] = useState('');
  const [botConnected, setBotConnected] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTelegramConnect = () => {
    if (telegramUsername.trim()) setBotConnected(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="mb-2 text-foreground">Совместный бюджет</h2>
        <p className="text-muted-foreground">Управляйте финансами вместе с соседями или партнёром</p>
      </div>
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center"><Share2 className="w-6 h-6 text-white" /></div>
          <div><h3 className="text-foreground">Поделиться дашбордом</h3><p className="text-sm text-muted-foreground">Создайте ссылку для совместного доступа</p></div>
        </div>
        <div className="bg-muted rounded-xl p-4 flex items-center gap-3">
          <code className="flex-1 text-sm truncate text-foreground">{shareLink}</code>
          <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            {copied ? <><CheckCircle className="w-4 h-4" /> Скопировано</> : <><Copy className="w-4 h-4" /> Копировать</>}
          </button>
        </div>
        <div className="mt-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-900 dark:text-blue-300">💡 Люди с этой ссылкой смогут просматривать и добавлять транзакции в общий бюджет</p>
        </div>
      </div>
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center"><Users className="w-6 h-6 text-white" /></div>
          <div><h3 className="text-foreground">Участники</h3><p className="text-sm text-muted-foreground">Люди с доступом к бюджету</p></div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center"><span className="text-white">А</span></div>
            <div className="flex-1"><p className="font-semibold text-foreground">Александр (Вы)</p><p className="text-xs text-muted-foreground">Владелец</p></div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/30">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center"><Users className="w-5 h-5 text-muted-foreground" /></div>
            <div className="flex-1"><p className="text-muted-foreground text-sm">Пока никто не присоединился</p></div>
          </div>
        </div>
      </div>
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center"><MessageSquare className="w-6 h-6 text-white" /></div>
          <div><h3 className="text-foreground">Telegram-бот</h3><p className="text-sm text-muted-foreground">Быстро добавляйте расходы через Telegram</p></div>
        </div>
        {!botConnected ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-3">Отправьте боту @MyFinancesBot команду <code className="bg-muted px-2 py-1 rounded">/start</code>, затем введите ваш Telegram username</p>
              <div className="flex gap-2">
                <input type="text" value={telegramUsername} onChange={(e) => setTelegramUsername(e.target.value)} placeholder="@username" className="flex-1 px-4 py-3 bg-input-background rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors" />
                <button onClick={handleTelegramConnect} className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"><Send className="w-4 h-4" /> Подключить</button>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm mb-2 font-semibold text-foreground">Примеры команд:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li><code className="bg-white dark:bg-gray-800 px-2 py-0.5 rounded">кофе 200</code> — добавить расход</li>
                <li><code className="bg-white dark:bg-gray-800 px-2 py-0.5 rounded">еда 500 обед</code> — с комментарием</li>
                <li><code className="bg-white dark:bg-gray-800 px-2 py-0.5 rounded">доход 35000 стипендия</code> — доход</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div><p className="text-emerald-900 dark:text-emerald-300 font-semibold">Telegram-бот подключен!</p><p className="text-sm text-emerald-700 dark:text-emerald-400">Теперь можно добавлять транзакции через @MyFinancesBot</p></div>
          </div>
        )}
      </div>
    </div>
  );
}