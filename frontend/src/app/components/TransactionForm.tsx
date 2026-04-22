import { useState } from 'react';
import { Plus, Coffee, Bus, BookOpen, Film, Wallet, ShoppingBag, Home } from 'lucide-react';
import type { Transaction } from './Dashboard';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

const CATEGORIES = [
  { id: 'Еда', icon: Coffee, color: 'text-orange-500' },
  { id: 'Транспорт', icon: Bus, color: 'text-blue-500' },
  { id: 'Учёба', icon: BookOpen, color: 'text-purple-500' },
  { id: 'Развлечения', icon: Film, color: 'text-pink-500' },
  { id: 'Кофе', icon: Coffee, color: 'text-amber-500' },
  { id: 'Покупки', icon: ShoppingBag, color: 'text-green-500' },
  { id: 'Дом', icon: Home, color: 'text-cyan-500' },
  { id: 'Стипендия', icon: Wallet, color: 'text-emerald-500' },
];

export function TransactionForm({ onAdd }: TransactionFormProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Еда');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    onAdd({
      amount: parseFloat(amount),
      category,
      type,
      date,
      comment: comment || undefined,
    });

    setAmount('');
    setComment('');
    setType('expense');
    setCategory('Еда');
  };

  return (
    <div className="bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-border lg:p-6 lg:sticky lg:top-24">
      <h3 className="mb-4 hidden lg:block">Добавить транзакцию</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              type === 'expense'
                ? 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                : 'bg-muted text-muted-foreground border-2 border-transparent'
            }`}
          >
            Расход
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              type === 'income'
                ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                : 'bg-muted text-muted-foreground border-2 border-transparent'
            }`}
          >
            Доход
          </button>
        </div>

        <div>
          <label className="block mb-2 text-sm">Сумма</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-input-background rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors"
              placeholder="1000"
              required
              min="0"
              step="0.01"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              ₽
            </span>
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm">Категория</label>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-3 rounded-lg transition-all ${
                    category === cat.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                  title={cat.id}
                >
                  <Icon className={`w-5 h-5 mx-auto ${category === cat.id ? 'text-white' : cat.color}`} />
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">{category}</p>
        </div>

        <div>
          <label className="block mb-2 text-sm">Дата</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 bg-input-background rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm">Комментарий (необязательно)</label>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-3 bg-input-background rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors"
            placeholder="Например: Обед в столовой"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Добавить
        </button>
      </form>
    </div>
  );
}
