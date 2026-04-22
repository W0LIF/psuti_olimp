import { Coffee, Bus, BookOpen, Film, Wallet, ShoppingBag, Home, X } from 'lucide-react';
import type { Transaction } from './Dashboard';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  'Еда': Coffee,
  'Транспорт': Bus,
  'Учёба': BookOpen,
  'Развлечения': Film,
  'Кофе': Coffee,
  'Покупки': ShoppingBag,
  'Дом': Home,
  'Стипендия': Wallet,
};

const CATEGORY_COLORS: Record<string, string> = {
  'Еда': 'bg-orange-100 text-orange-600',
  'Транспорт': 'bg-blue-100 text-blue-600',
  'Учёба': 'bg-purple-100 text-purple-600',
  'Развлечения': 'bg-pink-100 text-pink-600',
  'Кофе': 'bg-amber-100 text-amber-600',
  'Покупки': 'bg-green-100 text-green-600',
  'Дом': 'bg-cyan-100 text-cyan-600',
  'Стипендия': 'bg-emerald-100 text-emerald-600',
};

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
      <h3 className="mb-4">Последние транзакции</h3>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm">
            Нет транзакций
          </p>
        ) : (
          transactions.map((transaction) => {
            const Icon = CATEGORY_ICONS[transaction.category] || Wallet;
            const colorClass = CATEGORY_COLORS[transaction.category] || 'bg-gray-100 text-gray-600';

            return (
              <div
                key={transaction.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
              >
                <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="truncate" style={{ fontWeight: '500' }}>{transaction.category}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                  {transaction.comment && (
                    <p className="text-xs text-muted-foreground truncate">{transaction.comment}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <p
                    className={`${
                      transaction.type === 'income' ? 'text-emerald-600' : 'text-orange-600'
                    }`}
                    style={{ fontWeight: '600' }}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {transaction.amount.toLocaleString('ru-RU')} ₽
                  </p>

                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                    title="Удалить"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
