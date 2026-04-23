// frontend/src/app/components/ReportsPage.tsx
import { useState, useMemo } from 'react';
import { Download, TrendingUp, TrendingDown, PieChart, Printer, FileText } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { ReportPDF } from './ReportPDF';
import { transactionService } from '../../services/transactions';
import { categoryService } from '../../services/categories';
import { useAsync } from '../../hooks/useAsync';
import { toast } from 'sonner';

// Интерфейс транзакции для отображения (как в Dashboard)
interface Transaction {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  comment?: string;
  category: string; // название категории, а не id
}

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const getCurrentYear = () => new Date().getFullYear();
const getCurrentMonth = () => new Date().getMonth();

export function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());

  // Загружаем все категории один раз
  const { data: categoriesData } = useAsync(categoryService.getCategories, []);
  const categories = categoriesData || [];

  // Загружаем транзакции за выбранный месяц
  const { data: apiTransactions, loading, error, execute } = useAsync(
    () => transactionService.getMonthlyTransactions(selectedMonth + 1, selectedYear),
    [selectedMonth, selectedYear]
  );

  // Маппим транзакции: добавляем название категории
  const transactions: Transaction[] = useMemo(() => {
    if (!apiTransactions || !categories.length) return [];
    return apiTransactions.map(tx => {
      const cat = categories.find(c => c.id === tx.category_id);
      return {
        id: tx.id,
        amount: tx.amount,
        type: tx.type,
        date: tx.date,
        comment: tx.comment,
        category: cat?.name || 'Без категории'
      };
    });
  }, [apiTransactions, categories]);

  // Подсчёты
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expenses;

  const expensesByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [transactions]);

  // Экспорт CSV
  const exportToCSV = () => {
    const headers = ['Дата', 'Категория', 'Сумма', 'Тип', 'Комментарий'];
    const rows = transactions.map(t => [
      t.date,
      t.category,
      t.amount,
      t.type === 'income' ? 'Доход' : 'Расход',
      t.comment || ''
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `report_${MONTHS[selectedMonth]}_${selectedYear}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Экспорт PDF
  const downloadPDF = async () => {
    const loadingToast = document.createElement('div');
    loadingToast.innerText = 'Генерация PDF...';
    loadingToast.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.8); color: white; padding: 12px 24px;
      border-radius: 8px; z-index: 9999;
    `;
    document.body.appendChild(loadingToast);
    try {
      const blob = await pdf(
        <ReportPDF
          transactions={transactions}
          monthName={MONTHS[selectedMonth]}
          year={selectedYear}
          totalIncome={income}
          totalExpenses={expenses}
          balance={balance}
          expensesByCategory={expensesByCategory}
        />
      ).toBlob();
      saveAs(blob, `financial_report_${MONTHS[selectedMonth]}_${selectedYear}.pdf`);
    } catch (err) {
      console.error(err);
      toast.error('Не удалось создать PDF');
    } finally {
      document.body.removeChild(loadingToast);
    }
  };

  const printReport = () => window.print();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4">Загрузка отчётов...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-600">
          <p>Ошибка загрузки: {error.message}</p>
          <button onClick={() => execute()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
            Повторить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="bg-white rounded-xl p-6 shadow-sm print:shadow-none">
        {/* Заголовок и выбор месяца */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg"><FileText className="w-6 h-6 text-blue-600" /></div>
            <h2 className="text-xl font-semibold">Отчёты за период</h2>
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-2 border rounded-lg"
            >
              {MONTHS.map((m, idx) => <option key={m} value={idx}>{m}</option>)}
            </select>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 border rounded-lg"
            >
              {[getCurrentYear() - 1, getCurrentYear(), getCurrentYear() + 1].map(y =>
                <option key={y} value={y}>{y}</option>
              )}
            </select>
            <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg">
              <Download className="w-4 h-4" /> CSV
            </button>
            <button onClick={downloadPDF} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg">
              <Download className="w-4 h-4" /> PDF
            </button>
            <button onClick={printReport} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg">
              <Printer className="w-4 h-4" /> Печать
            </button>
          </div>
        </div>

        {/* Сводка */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-5 h-5 text-green-600" /><p className="text-sm text-gray-600">Доходы</p></div>
            <p className="text-2xl font-bold text-green-600">+{income.toLocaleString()} ₽</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2"><TrendingDown className="w-5 h-5 text-red-600" /><p className="text-sm text-gray-600">Расходы</p></div>
            <p className="text-2xl font-bold text-red-600">-{expenses.toLocaleString()} ₽</p>
          </div>
          <div className={`bg-gradient-to-br p-4 rounded-xl ${balance >= 0 ? 'from-blue-50 to-blue-100' : 'from-orange-50 to-orange-100'}`}>
            <div className="flex items-center gap-2 mb-2"><PieChart className="w-5 h-5 text-blue-600" /><p className="text-sm text-gray-600">Баланс</p></div>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              {balance >= 0 ? '+' : ''}{balance.toLocaleString()} ₽
            </p>
          </div>
        </div>

        {/* Расходы по категориям */}
        {expensesByCategory.length > 0 && (
          <div className="mb-8">
            <h3 className="font-semibold mb-4">Расходы по категориям</h3>
            <div className="space-y-3">
              {expensesByCategory.map(([cat, amount]) => {
                const percent = expenses > 0 ? (amount / expenses) * 100 : 0;
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{cat}</span>
                      <span>{amount.toLocaleString()} ₽ ({Math.round(percent)}%)</span>
                    </div>
                    <div className="overflow-hidden h-2 rounded bg-gray-200">
                      <div style={{ width: `${percent}%` }} className="h-full bg-gradient-to-r from-blue-500 to-purple-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Таблица транзакций */}
        <div className="overflow-x-auto">
          <h3 className="font-semibold mb-4">Детали транзакций</h3>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Дата</th><th className="px-4 py-3 text-left">Категория</th>
                <th className="px-4 py-3 text-right">Сумма</th><th className="px-4 py-3 text-left">Тип</th>
                <th className="px-4 py-3 text-left">Комментарий</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id} className="border-t">
                  <td className="px-4 py-3">{t.date}</td>
                  <td className="px-4 py-3">{t.category}</td>
                  <td className={`px-4 py-3 text-right font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()} ₽
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {t.type === 'income' ? 'Доход' : 'Расход'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{t.comment || '—'}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">Нет транзакций за выбранный месяц</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}