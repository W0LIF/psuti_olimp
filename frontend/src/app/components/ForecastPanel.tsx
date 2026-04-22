import { TrendingDown, Calendar, AlertTriangle } from 'lucide-react';
import type { Transaction } from './Dashboard';
import { useCurrency } from './CurrencyContext';

interface ForecastPanelProps {
  transactions: Transaction[];
  balance: number;
}

export function ForecastPanel({ transactions, balance }: ForecastPanelProps) {
  const { format } = useCurrency();

  const calculateDailyAverage = () => {
    const expenses = transactions.filter(t => t.type === 'expense');
    if (expenses.length === 0) return 0;

    const dates = expenses.map(t => new Date(t.date).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    const days = Math.max(1, Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)));

    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    return totalExpenses / days;
  };

  const dailyAverage = calculateDailyAverage();
  const daysRemaining = dailyAverage > 0 ? Math.floor(balance / dailyAverage) : 0;
  const runOutDate = new Date();
  runOutDate.setDate(runOutDate.getDate() + daysRemaining);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/40 dark:to-blue-950/40 rounded-2xl border border-purple-200 dark:border-purple-800 p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingDown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <h3 className="text-purple-900 dark:text-purple-200">Прогноз расходов</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4">
          <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">Средний расход в день</p>
          <p className="text-2xl text-purple-900 dark:text-purple-300 font-semibold">
            {format(dailyAverage)}
          </p>
        </div>

        {balance > 0 && daysRemaining > 0 ? (
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-purple-900 dark:text-purple-300 mb-1 font-semibold">
                  При текущем темпе расходов
                </p>
                <p className="text-sm text-purple-700 dark:text-purple-400">
                  Денег хватит до <span className="font-semibold">{formatDate(runOutDate)}</span>
                  {' '}(~{daysRemaining} {daysRemaining === 1 ? 'день' : daysRemaining < 5 ? 'дня' : 'дней'})
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 dark:bg-red-950/40 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-red-900 dark:text-red-200 font-semibold">
                Внимание!
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                Баланс отрицательный или недостаточен для прогноза
              </p>
            </div>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-950/40 rounded-xl p-4">
          <p className="text-xs text-blue-800 dark:text-blue-300 mb-2">💡 Совет</p>
          <p className="text-sm text-blue-900 dark:text-blue-300">
            Чтобы увеличить срок, попробуй сократить ежедневные траты на{' '}
            <span className="font-semibold">
              {format(dailyAverage * 0.2)}
            </span>
            {' '}(20%)
          </p>
        </div>
      </div>
    </div>
  );
}