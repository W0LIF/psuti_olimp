import { AlertCircle } from 'lucide-react';

interface BudgetProgressProps {
  spent: number;
  remaining: number;
  limit: number;
  percentage: number;
}

export function BudgetProgress({ spent, remaining, limit, percentage }: BudgetProgressProps) {
  const getProgressColor = () => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  const getBackgroundColor = () => {
    if (percentage >= 100) return 'bg-red-50';
    if (percentage >= 80) return 'bg-yellow-50';
    return 'bg-emerald-50';
  };

  return (
    <div className={`${getBackgroundColor()} rounded-2xl border ${percentage >= 80 ? 'border-yellow-200' : 'border-border'} p-6 transition-colors`}>
      <div className="flex items-center justify-between mb-4">
        <h3>Бюджет на месяц</h3>
        {percentage >= 80 && (
          <div className="flex items-center gap-1 text-yellow-700 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{percentage >= 100 ? 'Превышен!' : 'Внимание!'}</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="relative w-full h-3 bg-white/60 rounded-full overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full ${getProgressColor()} transition-all duration-500 rounded-full`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Потрачено</p>
            <p style={{ fontWeight: '600' }}>{spent.toLocaleString('ru-RU')} ₽</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Осталось</p>
            <p style={{ fontWeight: '600' }} className={remaining < 0 ? 'text-red-600' : ''}>
              {remaining.toLocaleString('ru-RU')} ₽
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Лимит</p>
            <p style={{ fontWeight: '600' }}>{limit.toLocaleString('ru-RU')} ₽</p>
          </div>
        </div>
      </div>
    </div>
  );
}
