'use client';

import { cn } from '@/lib/utils';
import { useCurrency } from './CurrencyContext';

interface PriceProps {
  /**
   * `usd` base amount, and/or the `ksh` figure the live site published.
   * Whichever is given is converted to the other at the fixed rate, so the
   * price stays consistent in both currencies.
   */
  usd?: number;
  ksh?: number;
  /** Show the equivalent in the other currency inside parentheses (default: true). */
  withSecondary?: boolean;
  /** Render the *other* currency as the main figure — for stacked displays. */
  useOther?: boolean;
  /** e.g. "From " — the phrasing the live site uses on deal cards. */
  prefix?: string;
  className?: string;
  secondaryClassName?: string;
}

export function Price({
  usd,
  ksh,
  withSecondary = true,
  useOther = false,
  prefix,
  className,
  secondaryClassName,
}: PriceProps) {
  const { format, formatOther } = useCurrency();
  const input = { usd, ksh };
  const main = useOther ? formatOther(input) : format(input);

  return (
    <span className={cn('whitespace-nowrap', className)}>
      {prefix}
      {main}
      {withSecondary && (
        <span className={cn('ml-1.5 text-xs font-normal opacity-60', secondaryClassName)}>
          ({useOther ? format(input) : formatOther(input)})
        </span>
      )}
    </span>
  );
}
