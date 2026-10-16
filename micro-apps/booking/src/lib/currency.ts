/**
 * Currency handling.
 *
 * The live site quotes resident deals in KSH and international packages in USD.
 * Rather than let those two drift, every price in this app is held as a single
 * pair of figures — `{ usd, ksh }` — so the same amount always reads the same
 * way whichever currency the visitor picks.
 *
 * Where the live site published both figures we keep them verbatim; otherwise
 * KSH is derived from USD at the fixed rate below.
 */

/** Fixed conversion used when a price is only quoted in one currency. */
export const KSH_PER_USD = 130;

export type Currency = 'KES' | 'USD';

export const CURRENCIES: ReadonlyArray<{ code: Currency; label: string }> = [
  { code: 'KES', label: 'KSH' },
  { code: 'USD', label: 'USD' },
];

export interface PriceTag {
  usd: number;
  ksh: number;
}

export function usdToKsh(usd: number): number {
  return Math.round(usd * KSH_PER_USD);
}

export function kshToUsd(ksh: number): number {
  return Math.round(ksh / KSH_PER_USD);
}

/** Build a price pair, deriving whichever side is missing. */
export function priceTag(input: number | { usd?: number; ksh?: number }): PriceTag {
  if (typeof input === 'number') return { usd: input, ksh: usdToKsh(input) };
  const usd = input.usd ?? kshToUsd(input.ksh ?? 0);
  const ksh = input.ksh ?? usdToKsh(input.usd ?? 0);
  return { usd, ksh };
}

/** Live-site conventions: `$289` and `KSH.37,500`. */
export function formatAmount(amount: number, currency: Currency | string): string {
  const n = Math.round(amount).toLocaleString('en-US');
  const isKsh = currency === 'KES' || currency === 'KSH';
  return isKsh ? `KSH.${n}` : `$${n}`;
}

export function formatPrice(input: number | PriceTag, currency: Currency = 'USD'): string {
  const tag = typeof input === 'number' ? priceTag(input) : input;
  return formatAmount(currency === 'KES' ? tag.ksh : tag.usd, currency);
}

/** `From KSH.37,500` — the phrasing the live site uses on deal cards. */
export function formatFrom(input: number | PriceTag, currency: Currency = 'USD'): string {
  return `From ${formatPrice(input, currency)}`;
}

/** The other currency, for the muted secondary figure on cards. */
export function otherCurrency(currency: Currency): Currency {
  return currency === 'KES' ? 'USD' : 'KES';
}
