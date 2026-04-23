import { Coffee, Bus, BookOpen, Film, Wallet, ShoppingBag, Home, X } from 'lucide-react';
import type { Transaction } from './Dashboard';
import { useCurrency } from './CurrencyContext';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  readOnly?: boolean;
}

const CATEGORY_ICONS: Record<string, any> = {
  'Еда': Coffee,
  'Транспорт': Bus,
  'Учёба': BookOpen,
  'Развлечение': Film,
  'Кофе': Coffee,
  'Покупки': ShoppingBag,
  'Дом': Home,
  'Стипендия': Wallet,
  'Прочее': Wallet,
};

const CATEGORY_COLORS: Record<string, string> = {
  'Еда': 'bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400',
  'Транспорт': 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
  'Учёба': 'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
  'Развлечение': 'bg-pink-100 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400',
  'Кофе': 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
  'Покупки': 'bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400',
  'Дом': 'bg-cyan-100 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400',
  'Стипендия': 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
  'Прочее': 'bg-gray-100 dark:bg-gray-950/50 text-gray-600 dark:text-gray-400',
};

export function TransactionList({ transactions, onDelete, readOnly = false }: TransactionListProps) {
  const { format } = useCurrency();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
      <h3 className="mb-4 text-foreground">Последние транзакции</h3>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm">
            Нет транзакций
          </p>
        ) : (
          transactions.map((transaction) => {
            const Icon = CATEGORY_ICONS[transaction.category] || Wallet;
            const colorClass = CATEGORY_COLORS[transaction.category] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';

            return (
              <div
                key={transaction.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
              >
                <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-foreground">{transaction.category}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                  {transaction.comment && (
                    <p className="text-xs text-muted-foreground truncate">{transaction.comment}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <p
                    className={`font-semibold ${
                      transaction.type === 'income' 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-orange-600 dark:text-orange-400'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {format(transaction.amount)}
                  </p>

                  {!readOnly && (
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-950/50 rounded transition-all"
                      title="Удалить"
                    >
                      <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}