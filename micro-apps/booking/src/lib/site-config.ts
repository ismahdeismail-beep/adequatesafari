export interface SiteConfig {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  paybill: string;
  paybillAccount: string;
  /** Share of the total price required up-front to reserve a place (%). */
  depositPercent: number;
}

export function whatsappLink(value: string): string {
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : '';
}

export const siteConfig: SiteConfig = {
  name: 'Adequate Safaris',
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '',
  whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP ?? '',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '',
  address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS ?? '',
  paybill: process.env.NEXT_PUBLIC_PAYBILL ?? '',
  paybillAccount: process.env.NEXT_PUBLIC_PAYBILL_ACCOUNT ?? '',
  depositPercent: Math.min(100, Math.max(0, Number(process.env.NEXT_PUBLIC_DEPOSIT_PERCENT ?? 50) || 50)),
};
