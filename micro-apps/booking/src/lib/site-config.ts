export interface SiteConfig {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
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
};
