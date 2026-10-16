'use client';

import { Price } from './Price';

/**
 * A deal category's price line. The live site publishes these in both KSH and
 * USD; where it does we render that pair (so the same amount reads consistently
 * in either currency), otherwise we fall back to the tour-count label.
 */
export function DealPrice({
  tourLabel,
  priceKsh,
  priceUsd,
  className,
}: {
  tourLabel?: string;
  priceKsh?: number;
  priceUsd?: number;
  className?: string;
}) {
  if (priceKsh == null && priceUsd == null) {
    return <>{tourLabel}</>;
  }

  return (
    <Price
      ksh={priceKsh}
      usd={priceUsd}
      prefix="From "
      className={className}
      secondaryClassName="lowercase"
    />
  );
}
