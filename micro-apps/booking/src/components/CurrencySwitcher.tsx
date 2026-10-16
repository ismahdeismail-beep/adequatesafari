'use client';

import { CURRENCIES } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { useCurrency } from './CurrencyContext';

interface CurrencySwitcherProps {
  /** `dark` for the header's contact strip, `light` for the nav bar. */
  tone?: 'light' | 'dark';
  className?: string;
}

/** KSH / USD toggle — keeps every quoted price consistent across both. */
export function CurrencySwitcher({ tone = 'light', className }: CurrencySwitcherProps) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div
      role="group"
      aria-label="Display currency"
      className={cn(
        'inline-flex items-center rounded-full border p-0.5 text-xs font-semibold',
        tone === 'dark' ? 'border-white/30' : 'border-gray-200',
        className
      )}
    >
      {CURRENCIES.map(({ code, label }) => {
        const active = currency === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setCurrency(code)}
            aria-pressed={active}
            className={cn(
              'rounded-full px-3 py-1 transition-colors',
              active
                ? tone === 'dark'
                  ? 'bg-white text-safari-dusk'
                  : 'bg-primary-600 text-white'
                : tone === 'dark'
                  ? 'text-white/80 hover:text-white'
                  : 'text-safari-dusk hover:bg-gray-100'
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
