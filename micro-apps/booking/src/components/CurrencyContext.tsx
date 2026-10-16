'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { type Currency, formatAmount, formatPrice, otherCurrency, priceTag } from '@/lib/currency';

const STORAGE_KEY = 'adequate:currency';

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  /** Format a USD base amount (or a `{usd,ksh}` pair) in the active currency. */
  format: (input: number | { usd?: number; ksh?: number }) => string;
  /** Same amount in the other currency, for the secondary label. */
  formatOther: (input: number | { usd?: number; ksh?: number }) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // KSH first, matching the live site's default.
  const [currency, setCurrencyState] = useState<Currency>('KES');

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'KES' || stored === 'USD') setCurrencyState(stored);
    } catch {
      /* storage unavailable — keep the default */
    }
  }, []);

  const setCurrency = useCallback((next: Currency) => {
    setCurrencyState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<CurrencyContextValue>(() => {
    const resolve = (input: number | { usd?: number; ksh?: number }) => {
      const tag = typeof input === 'number' ? priceTag(input) : priceTag(input);
      return { tag, other: otherCurrency(currency) };
    };
    return {
      currency,
      setCurrency,
      format: (input) => {
        const { tag } = resolve(input);
        return formatAmount(currency === 'KES' ? tag.ksh : tag.usd, currency);
      },
      formatOther: (input) => {
        const { tag, other } = resolve(input);
        return formatAmount(other === 'KES' ? tag.ksh : tag.usd, other);
      },
    };
  }, [currency, setCurrency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within a CurrencyProvider');
  return ctx;
}

export { formatPrice };
