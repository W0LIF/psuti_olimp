import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';
import type { Transaction } from './Dashboard';

interface ImportCSVProps {
  onImport: (transactions: Omit<Transaction, 'id'>[]) => void;
}

export function ImportCSV({ onImport }: ImportCSVProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importedCount, setImportedCount] = useState(0);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith('.csv')) { setImportStatus('error'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        const transactions: Omit<Transaction, 'id'>[] = [];
        for (let i = 1; i < lines.length; i++) {
          const [date, category, amount, type, comment] = lines[i].split(',').map(s => s.trim());
          if (date && amount && type) {
            transactions.push({ date, category: category || 'Прочее', amount: parseFloat(amount), type: type as 'income' | 'expense', comment: comment || undefined });
          }
        }
        if (transactions.length > 0) { onImport(transactions); setImportedCount(transactions.length); setImportStatus('success'); }
        else setImportStatus('error');
      } catch (error) { setImportStatus('error'); }
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const template = 'дата,категория,сумма,тип,комментарий\n2026-04-01,Еда,500,expense,Обед в столовой\n2026-04-02,Стипендия,35000,income,';
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template.csv';
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="mb-2 text-foreground">Импорт транзакций</h2>
        <p className="text-muted-foreground">Загрузите CSV файл с банковской выпиской или используйте наш шаблон</p>
      </div>
      <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${isDragging ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"><Upload className="w-8 h-8 text-primary" /></div>
          <div>
            <h3 className="mb-2 text-foreground">Перетащите файл сюда</h3>
            <p className="text-sm text-muted-foreground mb-4">или выберите файл на компьютере</p>
            <label className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
              <FileText className="w-5 h-5" /> Выбрать файл
              <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
            </label>
          </div>
        </div>
      </div>
      {importStatus === 'success' && (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div><p className="text-emerald-900 dark:text-emerald-300 font-semibold">Успешно импортировано!</p><p className="text-sm text-emerald-700 dark:text-emerald-400">Добавлено {importedCount} транзакций</p></div>
        </div>
      )}
      {importStatus === 'error' && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div><p className="text-red-900 dark:text-red-300 font-semibold">Ошибка импорта</p><p className="text-sm text-red-700 dark:text-red-400">Проверьте формат файла и попробуйте снова</p></div>
        </div>
      )}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h3 className="mb-3 text-blue-900 dark:text-blue-300">Формат CSV файла</h3>
        <p className="text-sm text-blue-800 dark:text-blue-400 mb-4">Файл должен содержать колонки: дата, категория, сумма, тип, комментарий</p>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 font-mono text-xs overflow-x-auto">
          <div className="text-muted-foreground mb-2">Пример:</div>
          <div>дата,категория,сумма,тип,комментарий</div>
          <div>2026-04-01,Еда,500,expense,Обед</div>
          <div>2026-04-02,Стипендия,35000,income,</div>
        </div>
        <button onClick={downloadTemplate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><Download className="w-4 h-4" /> Скачать шаблон</button>
      </div>
    </div>
  );
}