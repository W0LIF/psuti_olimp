import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useCurrency } from './CurrencyContext';

interface BalanceCardProps {
  balance: number;
  income: number;
  expenses: number;
}

export function BalanceCard({ balance, income, expenses }: BalanceCardProps) {
  const { format } = useCurrency();

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-5 h-5 text-primary" />
        <h3 className="text-foreground">Баланс</h3>
      </div>

      <div className="mb-6">
        <p className="text-3xl mb-1 font-semibold text-foreground">
          {format(balance)}
        </p>
        <p className="text-sm text-muted-foreground">Текущий баланс</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm text-emerald-700 dark:text-emerald-400">Доходы</p>
          </div>
          <p className="text-xl text-emerald-700 dark:text-emerald-400 font-semibold">
            +{format(income)}
          </p>
        </div>

        <div className="bg-orange-50 dark:bg-orange-950/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <p className="text-sm text-orange-700 dark:text-orange-400">Расходы</p>
          </div>
          <p className="text-xl text-orange-700 dark:text-orange-400 font-semibold">
            -{format(expenses)}
          </p>
        </div>
      </div>
    </div>
  );
}