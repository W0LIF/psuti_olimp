import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
  income: number;
  expenses: number;
}

export function BalanceCard({ balance, income, expenses }: BalanceCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-5 h-5 text-blue-500" />
        <h3>Баланс</h3>
      </div>

      <div className="mb-6">
        <p className="text-3xl mb-1" style={{ fontSize: '2rem', fontWeight: '600' }}>
          {balance.toLocaleString('ru-RU')} ₽
        </p>
        <p className="text-sm text-muted-foreground">Текущий баланс</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <p className="text-sm text-emerald-700">Доходы</p>
          </div>
          <p className="text-xl text-emerald-700" style={{ fontWeight: '600' }}>
            +{income.toLocaleString('ru-RU')} ₽
          </p>
        </div>

        <div className="bg-orange-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-orange-600" />
            <p className="text-sm text-orange-700">Расходы</p>
          </div>
          <p className="text-xl text-orange-700" style={{ fontWeight: '600' }}>
            -{expenses.toLocaleString('ru-RU')} ₽
          </p>
        </div>
      </div>
    </div>
  );
}
