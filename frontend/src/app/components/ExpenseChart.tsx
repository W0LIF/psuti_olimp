import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Transaction } from './Dashboard';

interface ExpenseChartProps {
  transactions?: Transaction[];
  categoryData?: Array<{ category: string; icon: string; amount: number }>;
}

const COLORS: Record<string, string> = {
  'Еда': '#f97316',
  'Транспорт': '#3b82f6',
  'Учёба': '#a855f7',
  'Развлечения': '#ec4899',
  'Кофе': '#f59e0b',
  'Покупки': '#10b981',
  'Дом': '#06b6d4',
  'Стипендия': '#22c55e',
};

export function ExpenseChart({ transactions, categoryData }: ExpenseChartProps) {
  let data;

  if (categoryData) {
    // Используем готовые данные из API
    data = categoryData.map(item => ({
      name: item.category,
      value: item.amount,
      color: COLORS[item.category] || '#6b7280',
    }));
  } else if (transactions) {
    // Рассчитываем из транзакций (fallback)
    const categoryTotals = transactions.reduce((acc, transaction) => {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    data = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
      color: COLORS[name] || '#6b7280',
    }));
  } else {
    data = [];
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
        <h3 className="mb-4">Расходы по категориям</h3>
        <p className="text-center text-muted-foreground py-12">
          Нет данных для отображения
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
      <h3 className="mb-4">Расходы по категориям</h3>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="w-full lg:w-1/2">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `${value.toLocaleString('ru-RU')} ₽`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full lg:w-1/2 space-y-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.name}</span>
              </div>
              <div className="text-right">
                <p style={{ fontWeight: '600' }}>{item.value.toLocaleString('ru-RU')} ₽</p>
                <p className="text-xs text-muted-foreground">
                  {((item.value / total) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
