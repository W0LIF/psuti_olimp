import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import {
  Coffee, Bus, BookOpen, Film, ShoppingBag, Home,
  Gift, Heart, Music, Gamepad, Briefcase, Phone,
  Dumbbell, Plane, Car, Shirt, Zap, Utensils, 
  Tv, ShoppingCart, Wifi, Droplet
} from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isCustom: boolean;
}

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onEditCategory: (id: string, name: string) => void;
  onDeleteCategory: (id: string) => void;
  onSelectCategory?: (categoryName: string | null) => void;
  selectedCategory?: string | null;
}

const DEFAULT_ICONS = [
  { name: 'Coffee', component: Coffee },
  { name: 'Utensils', component: Utensils },
  { name: 'Bus', component: Bus },
  { name: 'Car', component: Car },
  { name: 'Plane', component: Plane },
  { name: 'BookOpen', component: BookOpen },
  { name: 'Film', component: Film },
  { name: 'Tv', component: Tv },
  { name: 'Gamepad', component: Gamepad },
  { name: 'Music', component: Music },
  { name: 'ShoppingBag', component: ShoppingBag },
  { name: 'ShoppingCart', component: ShoppingCart },
  { name: 'Home', component: Home },
  { name: 'Wifi', component: Wifi },
  { name: 'Droplet', component: Droplet },
  { name: 'Gift', component: Gift },
  { name: 'Heart', component: Heart },
  { name: 'Briefcase', component: Briefcase },
  { name: 'Phone', component: Phone },
  { name: 'Dumbbell', component: Dumbbell },
  { name: 'Shirt', component: Shirt },
  { name: 'Zap', component: Zap },
];

const COLOR_PRESETS = [
  '#f97316', '#3b82f6', '#a855f7', '#ec4899', '#10b981',
  '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6',
  '#6366f1', '#d946ef', '#f43f5e', '#84cc16', '#0ea5e9',
];

export function CategoryManager({ 
  categories, 
  onAddCategory, 
  onEditCategory, 
  onDeleteCategory,
  onSelectCategory,
  selectedCategory 
}: CategoryManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Coffee');
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0]);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory({
        name: newCategoryName.trim(),
        icon: selectedIcon,
        color: selectedColor,
        isCustom: true,
      });
      resetForm();
      setIsModalOpen(false);
    }
  };

  const handleEditCategory = () => {
    if (editingCategory && newCategoryName.trim()) {
      onEditCategory(editingCategory.id, newCategoryName.trim());
      resetForm();
      setIsModalOpen(false);
    }
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setSelectedIcon(category.icon);
    setSelectedColor(category.color);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingCategory(null);
    setNewCategoryName('');
    setSelectedIcon('Coffee');
    setSelectedColor(COLOR_PRESETS[0]);
  };

  const getIconComponent = (iconName: string) => {
    const icon = DEFAULT_ICONS.find(i => i.name === iconName);
    return icon ? icon.component : Coffee;
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-border">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium">Категории</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Управление категориями расходов
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Создать
          </button>
        </div>

        <div className="p-4 max-h-80 overflow-y-auto">
          <div className="space-y-2">
            {/* Опция "Все категории" */}
            {onSelectCategory && (
              <button
                onClick={() => onSelectCategory(null)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  selectedCategory === null
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'hover:bg-muted/50 border-2 border-transparent'
                }`}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">Все категории</p>
                  <p className="text-xs text-muted-foreground">Показать все транзакции</p>
                </div>
              </button>
            )}

            {categories.map((category) => {
              const IconComponent = getIconComponent(category.icon);
              const isSelected = onSelectCategory && selectedCategory === category.name;
              
              return (
                <div
                  key={category.id}
                  className={`group flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-primary/10 border-2 border-primary'
                      : 'hover:bg-muted/50 border-2 border-transparent'
                  }`}
                >
                  {onSelectCategory ? (
                    <button
                      onClick={() => onSelectCategory(category.name)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: category.color + '20', color: category.color }}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{category.name}</p>
                        {category.isCustom && (
                          <p className="text-xs text-muted-foreground">Пользовательская</p>
                        )}
                      </div>
                    </button>
                  ) : (
                    <>
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: category.color + '20', color: category.color }}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{category.name}</p>
                        {category.isCustom && (
                          <p className="text-xs text-muted-foreground">Пользовательская</p>
                        )}
                      </div>
                    </>
                  )}
                  
                  {category.isCustom && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(category)}
                        className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => onDeleteCategory(category.id)}
                        className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <div
            className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-down"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">
                {editingCategory ? 'Редактировать категорию' : 'Новая категория'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Название</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Например: Кафе, Такси, Подписки"
                  className="w-full px-4 py-3 bg-input-background rounded-lg border border-transparent focus:border-primary focus:outline-none transition-colors"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Иконка</label>
                <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1">
                  {DEFAULT_ICONS.map((icon) => {
                    const IconComponent = icon.component;
                    return (
                      <button
                        key={icon.name}
                        onClick={() => setSelectedIcon(icon.name)}
                        className={`p-2 rounded-lg transition-all ${
                          selectedIcon === icon.name
                            ? 'bg-primary text-white'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        <IconComponent className="w-5 h-5 mx-auto" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Цвет</label>
                <div className="grid grid-cols-7 gap-2">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full transition-all ${
                        selectedColor === color
                          ? 'ring-2 ring-offset-2 ring-primary scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={editingCategory ? handleEditCategory : handleAddCategory}
                disabled={!newCategoryName.trim()}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                {editingCategory ? 'Сохранить' : 'Создать категорию'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}