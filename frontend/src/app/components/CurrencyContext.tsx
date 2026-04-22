import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Currency = 'RUB' | 'USD' | 'EUR' | 'CNY';

interface ExchangeRates {
  RUB: number;
  USD: number;
  EUR: number;
  CNY: number;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  rates: ExchangeRates | null;
  loading: boolean;
  convert: (amountRub: number) => number;
  format: (amountRub: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  RUB: '₽',
  USD: '$',
  EUR: '€',
  CNY: '¥',
};

const fetchRates = async (base: Currency = 'RUB'): Promise<ExchangeRates> => {
  const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
  const data = await response.json();
  return {
    RUB: data.rates.RUB,
    USD: data.rates.USD,
    EUR: data.rates.EUR,
    CNY: data.rates.CNY,
  };
};

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>(() => {
    return (localStorage.getItem('preferredCurrency') as Currency) || 'RUB';
  });
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('preferredCurrency', currency);
  }, [currency]);

  useEffect(() => {
    const loadRates = async () => {
      try {
        setLoading(true);
        const data = await fetchRates('RUB');
        setRates(data);
      } catch (error) {
        console.error('Failed to fetch exchange rates', error);
        setRates({
          RUB: 1,
          USD: 90,
          EUR: 100,
          CNY: 12,
        });
      } finally {
        setLoading(false);
      }
    };
    loadRates();
    const interval = setInterval(loadRates, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const convert = (amountRub: number): number => {
    if (!rates) return amountRub;
    const rate = rates[currency];
    return amountRub / rate;
  };

  const format = (amountRub: number): string => {
    const converted = convert(amountRub);
    return `${converted.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${CURRENCY_SYMBOLS[currency]}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, loading, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};