import { useCurrency } from './CurrencyContext';

export function BalanceCard({ balance, income, expenses }: BalanceCardProps) {
  const { format } = useCurrency();

  return (
    <div className="bg-card ...">
      <div className="mb-6">
        <p className="text-3xl mb-1 font-semibold text-foreground">
          {format(balance)}
        </p>
        <p className="text-sm text-muted-foreground">Текущий баланс</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-4">
          <p className="text-xl text-emerald-700 dark:text-emerald-400 font-semibold">
            +{format(income)}
          </p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-950/30 rounded-xl p-4">
          <p className="text-xl text-orange-700 dark:text-orange-400 font-semibold">
            -{format(expenses)}
          </p>
        </div>
      </div>
    </div>
  );
}