import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Separator } from '../components/ui/separator';
import { Button } from '../components/ui/button';

export type DateRangeType = 'all' | 'today' | 'week' | 'month' | 'custom';
export interface Filters {
  dateRange: DateRangeType;
  startDate: string | null;
  endDate: string | null;
  category: string | null;
  type: 'all' | 'income' | 'expense';
}
interface TransactionFiltersProps {
  onFilterChange: (filters: Filters) => void;
  onClose?: () => void;
  isMobile?: boolean;
  categories?: string[];
  currentFilters?: Filters;
}

const DATE_RANGE_OPTIONS: { value: DateRangeType; label: string }[] = [
  { value: 'all', label: 'Все время' }, { value: 'today', label: 'Сегодня' },
  { value: 'week', label: 'Эта неделя' }, { value: 'month', label: 'Этот месяц' }, { value: 'custom', label: 'Свои даты' }
];

export function TransactionFilters({ onFilterChange, onClose, isMobile = false, categories = [], currentFilters }: TransactionFiltersProps) {
  const [localFilters, setLocalFilters] = useState<Filters>(currentFilters || { dateRange: 'all', startDate: null, endDate: null, category: null, type: 'all' });
  const [tempStartDate, setTempStartDate] = useState(localFilters.startDate || '');
  const [tempEndDate, setTempEndDate] = useState(localFilters.endDate || '');

  const updateLocalFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    const newFilters = { ...localFilters, [key]: value };
    if (key === 'dateRange' && value !== 'custom') { newFilters.startDate = null; newFilters.endDate = null; setTempStartDate(''); setTempEndDate(''); }
    setLocalFilters(newFilters);
  };
  const applyFilters = () => {
    const filtersToApply = { ...localFilters };
    if (localFilters.dateRange === 'custom') { filtersToApply.startDate = tempStartDate || null; filtersToApply.endDate = tempEndDate || null; }
    onFilterChange(filtersToApply);
    if (isMobile && onClose) onClose();
  };
  const clearFilters = () => {
    const resetFilters: Filters = { dateRange: 'all', startDate: null, endDate: null, category: null, type: 'all' };
    setLocalFilters(resetFilters); setTempStartDate(''); setTempEndDate(''); onFilterChange(resetFilters);
  };
  const hasActiveFilters = localFilters.dateRange !== 'all' || localFilters.category !== null || localFilters.type !== 'all';
  const activeFiltersCount = [localFilters.dateRange !== 'all' ? 1 : 0, localFilters.category ? 1 : 0, localFilters.type !== 'all' ? 1 : 0].reduce((a, b) => a + b, 0);

  const FilterContent = () => (
    <div className="space-y-5">
      <div><label className="block text-sm mb-2 text-foreground">Тип</label><div className="flex gap-2">
        <button onClick={() => updateLocalFilter('type', 'all')} className={`flex-1 py-2 rounded-lg transition-all ${localFilters.type === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>Все</button>
        <button onClick={() => updateLocalFilter('type', 'income')} className={`flex-1 py-2 rounded-lg transition-all ${localFilters.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-700' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>Доходы</button>
        <button onClick={() => updateLocalFilter('type', 'expense')} className={`flex-1 py-2 rounded-lg transition-all ${localFilters.type === 'expense' ? 'bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 border-2 border-orange-300 dark:border-orange-700' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>Расходы</button>
      </div></div>
      <div><label className="block text-sm mb-2 text-foreground">Период</label><div className="grid grid-cols-2 gap-2">
        {DATE_RANGE_OPTIONS.map(option => <button key={option.value} onClick={() => updateLocalFilter('dateRange', option.value)} className={`px-3 py-2 rounded-lg text-sm transition-all ${localFilters.dateRange === option.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>{option.label}</button>)}
      </div></div>
      {localFilters.dateRange === 'custom' && (<div className="space-y-3 animate-slide-down">
        <div><label className="block text-sm mb-1 text-foreground">С даты</label><input type="date" value={tempStartDate} onChange={(e) => setTempStartDate(e.target.value)} className="w-full px-3 py-2 bg-input-background rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors" /></div>
        <div><label className="block text-sm mb-1 text-foreground">По дату</label><input type="date" value={tempEndDate} onChange={(e) => setTempEndDate(e.target.value)} className="w-full px-3 py-2 bg-input-background rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors" /></div>
      </div>)}
      {categories.length > 0 && (<div><label className="block text-sm mb-2 text-foreground">Категория</label><div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pb-1">
        <button onClick={() => updateLocalFilter('category', null)} className={`px-3 py-1 rounded-full text-xs transition-all ${!localFilters.category ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>Все</button>
        {categories.map(cat => <button key={cat} onClick={() => updateLocalFilter('category', cat)} className={`px-3 py-1 rounded-full text-xs transition-all ${localFilters.category === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>{cat}</button>)}
      </div></div>)}
      <Separator />
      <div className="flex gap-3">
        {hasActiveFilters && <button onClick={clearFilters} className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm">Сбросить</button>}
        <button onClick={applyFilters} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity">Применить фильтры</button>
      </div>
    </div>
  );

  if (isMobile) {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <button onClick={() => setIsOpen(true)} className="relative flex items-center gap-2 px-3 py-2 bg-muted rounded-lg"><Filter className="w-4 h-4" /><span className="text-sm">Фильтры</span>{activeFiltersCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />}</button>
        {isOpen && <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setIsOpen(false)}><div className="bg-card rounded-t-3xl w-full max-h-[85vh] overflow-y-auto animate-slide-up" onClick={(e) => e.stopPropagation()}><div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between"><h3 className="text-lg font-medium text-foreground">Фильтры</h3><button onClick={() => setIsOpen(false)} className="p-2 hover:bg-muted rounded-lg transition-colors"><X className="w-5 h-5" /></button></div><div className="p-5"><FilterContent /></div></div></div>}
      </>
    );
  }
  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
      <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><Filter className="w-5 h-5 text-muted-foreground" /><h3 className="text-base font-medium text-foreground">Фильтрация</h3>{activeFiltersCount > 0 && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{activeFiltersCount}</span>}</div>{hasActiveFilters && <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Сбросить все</button>}</div>
      <FilterContent />
    </div>
  );
}