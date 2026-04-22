import { Lightbulb, X } from 'lucide-react';

interface SmartTipProps {
  onClose: () => void;
}

export function SmartTip({ onClose }: SmartTipProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/40 dark:to-purple-950/40 rounded-2xl border border-blue-200 dark:border-blue-800 p-6 relative">
      <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/60 dark:hover:bg-gray-800/60 rounded-lg transition-colors"><X className="w-4 h-4 text-muted-foreground" /></button>
      <div className="flex gap-4">
        <div className="flex-shrink-0"><div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center"><Lightbulb className="w-6 h-6 text-white" /></div></div>
        <div className="flex-1 pr-8">
          <h3 className="mb-2 text-blue-900 dark:text-blue-200">Умная подсказка</h3>
          <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">Ты тратишь на кофе <span className="font-semibold">3000₽/мес</span> — это <span className="font-semibold">36 000₽/год</span>. Если сократить на 30%, за год сэкономишь на новый телефон</p>
          <button onClick={onClose} className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium">Понятно →</button>
        </div>
      </div>
    </div>
  );
}