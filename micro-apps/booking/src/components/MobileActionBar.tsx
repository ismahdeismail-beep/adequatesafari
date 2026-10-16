'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarCheck, MessageCircle, Phone } from 'lucide-react';
import { siteConfig, whatsappLink } from '@/lib/site-config';

/**
 * Sticky call/WhatsApp/book bar shown only on phones. On a small screen the
 * contact details live in the (desktop-only) header strip, so this puts the
 * primary actions within thumb reach on every page.
 */
export function MobileActionBar() {
  const pathname = usePathname();

  // Don't compete with the booking funnel or the auth screens.
  if (
    /\/(booking|auth|admin)(\/|$)/.test(pathname) ||
    pathname === '/contact'
  ) {
    return null;
  }

  const tel = siteConfig.phone ? `tel:${siteConfig.phone.replace(/\s/g, '')}` : '';
  const wa = whatsappLink(siteConfig.whatsapp);

  const actions = [
    tel && {
      key: 'call',
      href: tel,
      label: 'Call',
      icon: Phone,
      className: 'text-safari-dusk',
      external: false,
    },
    wa && {
      key: 'whatsapp',
      href: wa,
      label: 'WhatsApp',
      icon: MessageCircle,
      className: 'text-primary-600',
      external: true,
    },
    {
      key: 'book',
      href: '/safaris',
      label: 'Book',
      icon: CalendarCheck,
      className: 'text-safari-gold-dark',
      external: false,
    },
  ].filter(Boolean) as Array<{
    key: string;
    href: string;
    label: string;
    icon: typeof Phone;
    className: string;
    external: boolean;
  }>;

  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 pt-1 backdrop-blur md:hidden"
      style={{ paddingBottom: 'max(0.25rem, env(safe-area-inset-bottom))' }}
    >
      <ul className="grid grid-cols-3">
        {actions.map(({ key, href, label, icon: Icon, className, external }) => (
          <li key={key}>
            <Link
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 px-2 text-xs font-medium ${className}`}
            >
              <Icon className="h-5 w-5" aria-hidden />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
