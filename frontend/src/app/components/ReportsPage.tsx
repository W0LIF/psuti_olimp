// frontend/src/app/components/ReportsPage.tsx
import { useState, useMemo, useRef } from 'react';
import { Download, TrendingUp, TrendingDown, PieChart, Printer, FileText } from 'lucide-react';
import { Transaction } from './Dashboard';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { ReportPDF } from './ReportPDF';

interface ReportsPageProps {
  transactions: Transaction[];
  currentMonth: string;
}

const getMonthName = (date: Date): string => {
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  return months[date.getMonth()];
};

const parseMonthYear = (monthYear: string = '') => {
  const normalized = monthYear?.trim();
  if (!normalized) {
    const now = new Date();
    return { month: getMonthName(now), year: now.getFullYear() };
  }

  const [month, yearStr] = normalized.split(' ');
  const year = parseInt(yearStr);
  if (!month || Number.isNaN(year)) {
    const now = new Date();
    return { month: getMonthName(now), year: now.getFullYear() };
  }

  return { month, year };
};

export function ReportsPage({ transactions, currentMonth }: ReportsPageProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [selectedMonth, setSelectedMonth] = useState(() => parseMonthYear(currentMonth));

  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    transactions.forEach(t => {
      const date = new Date(t.date);
      if (!isNaN(date.getTime())) {
        monthsSet.add(`${getMonthName(date)} ${date.getFullYear()}`);
      }
    });
    const months = Array.from(monthsSet).sort((a, b) => {
      const [monthA, yearA] = a.split(' ');
      const [monthB, yearB] = b.split(' ');
      if (yearA !== yearB) return parseInt(yearB) - parseInt(yearA);
      const monthOrder = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
      return monthOrder.indexOf(monthB) - monthOrder.indexOf(monthA);
    });
    return months.length > 0 ? months : [`${currentMonth}`];
  }, [transactions, currentMonth]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const date = new Date(t.date);
      if (isNaN(date.getTime())) return false;
      const transactionMonth = getMonthName(date);
      const transactionYear = date.getFullYear();
      return transactionMonth === selectedMonth.month && transactionYear === selectedMonth.year;
    });
  }, [transactions, selectedMonth]);

  const income = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expenses;

  const expensesByCategory = useMemo(() => {
    const categories: { [key: string]: number } = {};
    filteredTransactions.filter(t => t.type === 'expense').forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });
    return Object.entries(categories).sort((a, b) => b[1] - a[1]);
  }, [filteredTransactions]);

  const exportToCSV = () => {
    const headers = ['Дата', 'Категория', 'Сумма', 'Тип', 'Комментарий'];
    const rows = filteredTransactions.map(t => [
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
    link.download = `report_${selectedMonth.month}_${selectedMonth.year}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    const loadingToast = document.createElement('div');
    loadingToast.innerHTML = 'Генерация PDF...';
    loadingToast.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.8); color: white; padding: 12px 24px;
      border-radius: 8px; z-index: 9999; font-size: 14px;
    `;
    document.body.appendChild(loadingToast);

    try {
      const pdfBlob = await pdf(
        <ReportPDF
          transactions={filteredTransactions}
          monthName={selectedMonth.month}
          year={selectedMonth.year}
          totalIncome={income}
          totalExpenses={expenses}
          balance={balance}
          expensesByCategory={expensesByCategory}
        />
      ).toBlob();

      saveAs(pdfBlob, `financial_report_${selectedMonth.month}_${selectedMonth.year}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Не удалось создать PDF. Попробуйте позже.');
    } finally {
      document.body.removeChild(loadingToast);
    }
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="bg-white rounded-xl p-6 shadow-sm print:shadow-none print:p-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Отчеты за период</h2>
          </div>

          <div className="flex gap-2">
            <select
              value={`${selectedMonth.month} ${selectedMonth.year}`}
              onChange={(e) => setSelectedMonth(parseMonthYear(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {availableMonths.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>

            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">PDF</span>
            </button>

            <button
              onClick={printReport}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Печать</span>
            </button>
          </div>
        </div>

        <div ref={reportRef} className="report-content">
          {/* Сводка */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <p className="text-sm text-gray-600">Доходы</p>
              </div>
              <p className="text-2xl font-bold text-green-600">+{income.toLocaleString()} ₽</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <p className="text-sm text-gray-600">Расходы</p>
              </div>
              <p className="text-2xl font-bold text-red-600">-{expenses.toLocaleString()} ₽</p>
            </div>
            <div className={`bg-gradient-to-br p-4 rounded-xl ${balance >= 0 ? 'from-blue-50 to-blue-100' : 'from-orange-50 to-orange-100'}`}>
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-gray-600">Баланс</p>
              </div>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {balance >= 0 ? '+' : ''}{balance.toLocaleString()} ₽
              </p>
            </div>
          </div>

          {/* Расходы по категориям */}
          {expensesByCategory.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-4">Расходы по категориям</h3>
              <div className="space-y-3">
                {expensesByCategory.map(([category, amount]) => {
                  const percentage = expenses > 0 ? (amount / expenses) * 100 : 0;
                  return (
                    <div key={category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{category}</span>
                        <span>{amount.toLocaleString()} ₽ ({Math.round(percentage)}%)</span>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div
                          style={{ width: `${percentage}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-purple-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Таблица транзакций */}
          <div className="overflow-x-auto">
            <h3 className="font-semibold text-gray-800 mb-4">Детали транзакций</h3>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Дата</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Категория</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Сумма</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Тип</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Комментарий</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((t, index) => (
                  <tr key={t.id} className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-4 py-3 text-sm">{t.date}</td>
                    <td className="px-4 py-3 text-sm">{t.category}</td>
                    <td className={`px-4 py-3 text-sm text-right font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()} ₽
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {t.type === 'income' ? 'Доход' : 'Расход'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{t.comment || '—'}</td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      Нет транзакций за выбранный период
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}