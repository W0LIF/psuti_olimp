import { useState, useEffect, useRef } from 'react';
import { Plus, Coffee, Bus, BookOpen, Film, Wallet, ShoppingBag, Home, X, Check, ChevronDown, Edit2, Trash2, Utensils, Car, Plane, Tv, Gamepad, Music, ShoppingCart, Wifi, Gift, Heart, Briefcase, Phone, Dumbbell, Shirt, Zap } from 'lucide-react';
import type { Transaction } from './Dashboard';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isCustom: boolean;
}

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
  categories?: Category[];
  onAddCategory?: (category: Omit<Category, 'id'>) => void;
  onEditCategory?: (id: string, name: string) => void;
  onDeleteCategory?: (id: string) => void;
}

interface DisplayCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  isCustom: boolean;
  originalId?: string;
}

const DEFAULT_CATEGORIES = [
  { id: 'Еда', name: 'Еда', icon: Coffee, color: '#f97316' },
  { id: 'Транспорт', name: 'Транспорт', icon: Bus, color: '#3b82f6' },
  { id: 'Учёба', name: 'Учёба', icon: BookOpen, color: '#a855f7' },
  { id: 'Развлечение', name: 'Развлечение', icon: Film, color: '#ec4899' },
  { id: 'Кофе', name: 'Кофе', icon: Coffee, color: '#f59e0b' },
  { id: 'Покупки', name: 'Покупки', icon: ShoppingBag, color: '#10b981' },
  { id: 'Дом', name: 'Дом', icon: Home, color: '#06b6d4' },
  { id: 'Стипендия', name: 'Стипендия', icon: Wallet, color: '#22c55e' },
  { id: 'Прочее', name: 'Прочее', icon: Wallet, color: '#6b7280' },
];

const ICONS_LIST = [
  { name: 'Coffee', icon: Coffee }, { name: 'Utensils', icon: Utensils },
  { name: 'Bus', icon: Bus }, { name: 'Car', icon: Car },
  { name: 'Plane', icon: Plane }, { name: 'BookOpen', icon: BookOpen },
  { name: 'Film', icon: Film }, { name: 'Tv', icon: Tv },
  { name: 'Gamepad', icon: Gamepad }, { name: 'Music', icon: Music },
  { name: 'ShoppingBag', icon: ShoppingBag }, { name: 'ShoppingCart', icon: ShoppingCart },
  { name: 'Home', icon: Home }, { name: 'Wifi', icon: Wifi },
  { name: 'Gift', icon: Gift }, { name: 'Heart', icon: Heart },
  { name: 'Briefcase', icon: Briefcase }, { name: 'Phone', icon: Phone },
  { name: 'Dumbbell', icon: Dumbbell }, { name: 'Shirt', icon: Shirt },
  { name: 'Zap', icon: Zap }, { name: 'Wallet', icon: Wallet },
];

const COLOR_PRESETS = [
  '#f97316', '#3b82f6', '#a855f7', '#ec4899', '#10b981',
  '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6',
  '#6366f1', '#d946ef', '#f43f5e', '#84cc16', '#0ea5e9',
];

const getIcon = (iconName: string) => {
  const found = ICONS_LIST.find(i => i.name === iconName);
  return found ? found.icon : Coffee;
};

export function TransactionForm({ 
  onAdd, 
  categories = [], 
  onAddCategory,
  onEditCategory,
  onDeleteCategory 
}: TransactionFormProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Еда');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [comment, setComment] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('Coffee');
  const [newCategoryColor, setNewCategoryColor] = useState('#10b981');
  
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allCategories: DisplayCategory[] = [
    ...DEFAULT_CATEGORIES.map(c => ({ 
      ...c, 
      isCustom: false, 
      id: c.id,
      name: c.name,
      bgColor: c.color 
    })),
    ...categories.filter(c => c.isCustom).map(c => ({
      id: c.name,
      name: c.name,
      icon: getIcon(c.icon),
      color: c.color,
      bgColor: c.color,
      isCustom: true,
      originalId: c.id
    }))
  ];

  const handleAddNewCategory = () => {
    if (newCategoryName.trim() && onAddCategory) {
      onAddCategory({
        name: newCategoryName.trim(),
        icon: newCategoryIcon,
        color: newCategoryColor,
        isCustom: true,
      });
      setCategory(newCategoryName.trim());
      setShowNewCategory(false);
      setNewCategoryName('');
      setShowCategoryDropdown(false);
    }
  };

  const handleEditCategorySubmit = () => {
    if (editingCategory && newCategoryName.trim() && onEditCategory) {
      onEditCategory(editingCategory.id, newCategoryName.trim());
      if (category === editingCategory.name) setCategory(newCategoryName.trim());
      setEditingCategory(null);
      setNewCategoryName('');
      setShowCategoryDropdown(false);
    }
  };

  const handleDeleteCategoryClick = (cat: DisplayCategory) => {
    if (onDeleteCategory && cat.originalId && confirm(`Удалить категорию "${cat.name}"?`)) {
      onDeleteCategory(cat.originalId);
      if (category === cat.name) setCategory('Еда');
      setShowCategoryDropdown(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    onAdd({ amount: parseFloat(amount), category, type, date, comment: comment || undefined });
    setAmount('');
    setComment('');
    setType('expense');
    setCategory('Еда');
  };

  const selectedCategoryData = allCategories.find(c => c.id === category);

  return (
    <div className="bg-white dark:bg-gray-800 lg:rounded-2xl lg:shadow-sm lg:border lg:border-border lg:p-6 lg:sticky lg:top-24">
      <h3 className="mb-4 hidden lg:block text-lg font-medium text-foreground">Добавить транзакцию</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <button type="button" onClick={() => setType('expense')} className={`flex-1 py-2 rounded-lg transition-all ${type === 'expense' ? 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-2 border-orange-300 dark:border-orange-700' : 'bg-muted dark:bg-gray-700 text-muted-foreground dark:text-gray-400 border-2 border-transparent'}`}>Расход</button>
          <button type="button" onClick={() => setType('income')} className={`flex-1 py-2 rounded-lg transition-all ${type === 'income' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-700' : 'bg-muted dark:bg-gray-700 text-muted-foreground dark:text-gray-400 border-2 border-transparent'}`}>Доход</button>
        </div>

        <div>
          <label className="block mb-2 text-sm text-foreground">Сумма</label>
          <div className="relative">
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-4 py-3 bg-input-background dark:bg-gray-700 rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground" placeholder="1000" required min="0" step="0.01" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">₽</span>
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm text-foreground">Категория</label>
          
          {!showNewCategory && !editingCategory ? (
            <div className="relative" ref={dropdownRef}>
              <button type="button" onClick={() => setShowCategoryDropdown(!showCategoryDropdown)} className="w-full flex items-center justify-between px-4 py-3 bg-input-background dark:bg-gray-700 rounded-lg border border-transparent focus:border-primary transition-colors">
                <div className="flex items-center gap-3">
                  {selectedCategoryData && (
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: selectedCategoryData.color + '20', color: selectedCategoryData.color }}>
                      {(() => { const Icon = selectedCategoryData.icon; return <Icon className="w-3.5 h-3.5" />; })()}
                    </div>
                  )}
                  <span className="text-sm text-foreground">{category}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showCategoryDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl border border-border shadow-lg max-h-80 overflow-y-auto animate-slide-down">
                  <div className="p-2 space-y-1">
                    {allCategories.map((cat) => (
                      <div key={cat.id} className="group flex items-center justify-between">
                        <button type="button" onClick={() => { setCategory(cat.id); setShowCategoryDropdown(false); }} className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${category === cat.id ? 'bg-primary/10 dark:bg-primary/20' : 'hover:bg-muted/50 dark:hover:bg-gray-700'}`}>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: cat.color + '20', color: cat.color }}>
                            {(() => { const Icon = cat.icon; return <Icon className="w-4 h-4" />; })()}
                          </div>
                          <span className="flex-1 text-left text-sm text-foreground">{cat.id}</span>
                          {cat.isCustom && <span className="text-xs text-muted-foreground">пользовательская</span>}
                        </button>
                        {cat.isCustom && cat.originalId && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mr-2">
                            <button type="button" onClick={() => { const originalCat = categories.find(c => c.id === cat.originalId); if (originalCat) { setEditingCategory(originalCat); setNewCategoryName(cat.name); setShowCategoryDropdown(false); } }} className="p-1.5 hover:bg-muted dark:hover:bg-gray-700 rounded-lg"><Edit2 className="w-3.5 h-3.5 text-muted-foreground" /></button>
                            <button type="button" onClick={() => handleDeleteCategoryClick(cat)} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-lg"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="border-t border-border my-2" />
                    <button type="button" onClick={() => { setShowCategoryDropdown(false); setShowNewCategory(true); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"><Plus className="w-4 h-4" /><span className="text-sm">Создать свою категорию</span></button>
                  </div>
                </div>
              )}
            </div>
          ) : showNewCategory ? (
            <div className="space-y-3 border border-primary/30 rounded-lg p-4 bg-primary/5 dark:bg-primary/10 animate-slide-down">
              <div className="flex items-center justify-between"><label className="text-sm font-medium text-foreground">Новая категория</label><button type="button" onClick={() => setShowNewCategory(false)} className="p-1 hover:bg-muted dark:hover:bg-gray-700 rounded-lg"><X className="w-4 h-4" /></button></div>
              <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Название" className="w-full px-4 py-3 bg-input-background dark:bg-gray-700 rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors text-sm text-foreground placeholder:text-muted-foreground" autoFocus />
              <div><label className="text-xs text-muted-foreground mb-2 block">Иконка</label><div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto p-1">{ICONS_LIST.map((ic) => { const Icon = ic.icon; return (<button key={ic.name} type="button" onClick={() => setNewCategoryIcon(ic.name)} className={`p-2 rounded-lg transition-all ${newCategoryIcon === ic.name ? 'bg-primary text-white' : 'bg-muted dark:bg-gray-700 text-muted-foreground hover:bg-muted/80'}`}><Icon className="w-5 h-5 mx-auto" /></button>); })}</div></div>
              <div><label className="text-xs text-muted-foreground mb-2 block">Цвет</label><div className="flex flex-wrap gap-2">{COLOR_PRESETS.map((color) => (<button key={color} type="button" onClick={() => setNewCategoryColor(color)} className={`w-7 h-7 rounded-full transition-all ${newCategoryColor === color ? 'ring-2 ring-offset-1 ring-primary scale-110' : 'hover:scale-105'}`} style={{ backgroundColor: color }} />))}</div></div>
              <button type="button" onClick={handleAddNewCategory} disabled={!newCategoryName.trim()} className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"><Check className="w-4 h-4" />Создать</button>
            </div>
          ) : (
            <div className="space-y-3 border border-primary/30 rounded-lg p-4 bg-primary/5 dark:bg-primary/10 animate-slide-down">
              <div className="flex items-center justify-between"><label className="text-sm font-medium text-foreground">Редактировать</label><button type="button" onClick={() => { setEditingCategory(null); setNewCategoryName(''); }} className="p-1 hover:bg-muted dark:hover:bg-gray-700 rounded-lg"><X className="w-4 h-4" /></button></div>
              <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Название" className="w-full px-4 py-3 bg-input-background dark:bg-gray-700 rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors text-sm text-foreground placeholder:text-muted-foreground" autoFocus />
              <button type="button" onClick={handleEditCategorySubmit} disabled={!newCategoryName.trim()} className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"><Check className="w-4 h-4" />Сохранить</button>
            </div>
          )}
        </div>

        <div><label className="block mb-2 text-sm text-foreground">Дата</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-3 bg-input-background dark:bg-gray-700 rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors text-foreground" required /></div>
        <div><label className="block mb-2 text-sm text-foreground">Комментарий</label><input type="text" value={comment} onChange={(e) => setComment(e.target.value)} className="w-full px-4 py-3 bg-input-background dark:bg-gray-700 rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground" placeholder="Например: Обед в столовой" /></div>
        <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"><Plus className="w-5 h-5" />Добавить</button>
      </form>
    </div>
  );
}