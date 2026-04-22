import { useCurrency } from './CurrencyContext';

const currencies = [
  { code: 'RUB', label: '₽ RUB', flag: '🇷🇺' },
  { code: 'USD', label: '$ USD', flag: '🇺🇸' },
  { code: 'EUR', label: '€ EUR', flag: '🇪🇺' },
  { code: 'CNY', label: '¥ CNY', flag: '🇨🇳' },
] as const;

export function CurrencySelector() {
  const { currency, setCurrency, loading } = useCurrency();

  return (
    <div className="relative flex items-center gap-1">
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as any)}
        disabled={loading}
        className="bg-muted dark:bg-gray-700 rounded-lg px-3 py-1.5 text-sm font-medium text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
      >
        {currencies.map((c) => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.label}
          </option>
        ))}
      </select>
      {loading && <span className="text-xs text-muted-foreground animate-pulse">⟳</span>}
    </div>
  );
}