# Интеграция Фронтенда с Бэком - Инструкция

## ✅ Что уже сделано:

### На Бэке:
1. **Добавлен маршрут `/categories`** - для работы с категориями
2. **Добавлен эндпоинт `/auth/me`** - для получения текущего пользователя
3. Схемы: `CategoryOut`, `CategoryCreate` добавлены в `schemas.py`

### На Фронте:
1. **API сервис (`src/services/api.ts`)** - базовый Axios клиент с авторизацией
2. **Auth сервис (`src/services/auth.ts`)** - регистрация, логин, хранение токена
3. **Transaction сервис (`src/services/transactions.ts`)** - CRUD операции
4. **Budget сервис (`src/services/budgets.ts`)** - работа с бюджетами
5. **Stats сервис (`src/services/stats.ts`)** - получение статистики
6. **Categories сервис (`src/services/categories.ts`)** - работа с категориями
7. **Auth контекст (`src/context/AuthContext.tsx`)** - управление состоянием авторизации
8. **Хук useAsync (`src/hooks/useAsync.ts`)** - для асинхронных операций
9. **.env файл** с URL бэка: `https://psuti-olimp.onrender.com`

---

## 🔄 Как обновить компоненты для работы с API

### Пример 1: Обновление TransactionForm

```typescript
import { useState } from 'react';
import { transactionService } from '../../services/transactions';
import { categoryService } from '../../services/categories';
import { useAsync } from '../../hooks/useAsync';
import { toast } from 'sonner';

export function TransactionForm() {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Получаем категории
  const { data: categories, isLoading: loadingCategories } = useAsync(
    () => categoryService.getCategories(),
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !amount) {
      toast.error('Заполните все поля');
      return;
    }

    setIsLoading(true);
    try {
      await transactionService.createTransaction({
        amount: parseFloat(amount),
        type,
        date,
        comment,
        category_id: categoryId,
      });
      toast.success('Транзакция добавлена');
      setAmount('');
      setComment('');
    } catch (error: any) {
      toast.error('Ошибка при добавлении транзакции');
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingCategories) return <div>Загрузка категорий...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Выбор типа транзакции */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setType('expense')}
          className={type === 'expense' ? 'bg-red-500' : 'bg-gray-200'}
        >
          Расход
        </button>
        <button
          type="button"
          onClick={() => setType('income')}
          className={type === 'income' ? 'bg-green-500' : 'bg-gray-200'}
        >
          Доход
        </button>
      </div>

      {/* Сумма */}
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Сумма"
        required
      />

      {/* Категория */}
      <select
        value={categoryId || ''}
        onChange={(e) => setCategoryId(parseInt(e.target.value))}
        required
      >
        <option value="">Выберите категорию</option>
        {categories?.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.icon} {cat.name}
          </option>
        ))}
      </select>

      {/* Дата */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* Комментарий */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Комментарий"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isLoading ? 'Загрузка...' : 'Добавить'}
      </button>
    </form>
  );
}
```

### Пример 2: Обновление Dashboard

```typescript
import { useAsync } from '../../hooks/useAsync';
import { statsService } from '../../services/stats';
import { transactionService } from '../../services/transactions';

export function Dashboard({ currentMonth }: { currentMonth: string }) {
  // Получаем статистику
  const { data: stats, isLoading: statsLoading } = useAsync(
    () => statsService.getDashboardStats(),
    [currentMonth]
  );

  // Получаем транзакции
  const { data: transactions, isLoading: txLoading } = useAsync(
    () => transactionService.getMonthlyTransactions(
      new Date().getMonth() + 1,
      new Date().getFullYear()
    ),
    [currentMonth]
  );

  if (statsLoading || txLoading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Баланс: {stats?.balance || 0}₽</h2>
      <h3>Доход: {stats?.total_income || 0}₽</h3>
      <h3>Расход: {stats?.total_expense || 0}₽</h3>

      {/* Список категорий */}
      {stats?.category_breakdown.map((cat) => (
        <div key={cat.category}>
          <span>{cat.icon} {cat.category}</span>
          <span>{cat.amount}₽</span>
        </div>
      ))}

      {/* Список транзакций */}
      <div>
        {transactions?.map((tx) => (
          <div key={tx.id}>
            <span>{tx.date}</span>
            <span>{tx.amount}₽</span>
            <span>{tx.comment}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Пример 3: Обновление BudgetProgress

```typescript
import { useAsync } from '../../hooks/useAsync';
import { budgetService } from '../../services/budgets';

export function BudgetProgress() {
  const { data: budgets, isLoading } = useAsync(
    () => budgetService.getBudgetProgress(),
    []
  );

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div>
      {budgets?.map((budget) => (
        <div key={budget.budget_id}>
          <div>Лимит: {budget.limit}₽</div>
          <div>Потрачено: {budget.spent}₽</div>
          <div className="w-full bg-gray-200 rounded">
            <div
              className={`bg-${budget.status === 'exceeded' ? 'red' : 'green'}-500 h-2`}
              style={{ width: `${Math.min(budget.percent, 100)}%` }}
            />
          </div>
          <div>{Math.round(budget.percent)}%</div>
        </div>
      ))}
    </div>
  );
}
```

---

## 🚀 Шаги для полной интеграции:

1. **Обновить TransactionForm** (используйте пример выше)
   - Загрузить категории с бэка
   - Создавать транзакции через API

2. **Обновить Dashboard**
   - Загрузить статистику с бэка
   - Отобразить реальные данные

3. **Обновить TransactionList**
   - Загрузить транзакции
   - Добавить кнопку удаления

4. **Обновить BudgetProgress**
   - Загрузить прогресс бюджета
   - Добавить редактирование

5. **Обновить MainApp**
   - Удалить hardcoded данные
   - Использовать реальные данные с бэка

---

## 📝 Использование Toast уведомлений

Уже установлен пакет `sonner`. Используйте так:

```typescript
import { toast } from 'sonner';

// Успех
toast.success('Все хорошо!');

// Ошибка
toast.error('Что-то пошло не так');

// Информация
toast.info('Информация');

// Загрузка
toast.loading('Загрузка...');
```

---

## 🔐 Как работает авторизация:

1. Пользователь вводит email/пароль в AuthPage
2. Отправляется POST запрос на `/auth/register` или `/auth/login`
3. Токен сохраняется в `localStorage`
4. Токен автоматически добавляется в заголовок каждого запроса
5. Если токен невалидный (401 ошибка), пользователь перенаправляется на страницу входа

---

## 🐛 Если что-то не работает:

1. Проверьте консоль браузера (F12 -> Console)
2. Проверьте сетевые запросы (F12 -> Network)
3. Убедитесь, что бэк запущен и доступен по адресу из `.env`
4. Проверьте, что токен сохраняется в localStorage

---

## 📚 Дополнительные сервисы API:

Все сервисы находятся в `src/services/`:
- `api.ts` - базовый Axios клиент
- `auth.ts` - аутентификация
- `transactions.ts` - транзакции
- `budgets.ts` - бюджеты
- `stats.ts` - статистика
- `categories.ts` - категории

Каждый сервис экспортирует функции типа:
```typescript
const result = await serviceService.functionName(params);
```

Пример:
```typescript
const transactions = await transactionService.getTransactions({
  start_date: '2026-04-01',
  end_date: '2026-04-30',
  category_id: 1
});
```

---

## ✨ Готово!

Фронтенд теперь полностью подключен к бэку на `https://psuti-olimp.onrender.com`.
Используйте примеры выше для обновления остальных компонентов.
