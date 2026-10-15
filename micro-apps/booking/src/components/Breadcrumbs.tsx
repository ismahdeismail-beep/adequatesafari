'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export interface Crumb {
  label: string;
  href?: string;
}

const LABELS: Record<string, string> = {
  safaris: 'Safaris',
  destinations: 'Destinations',
  offers: 'Special Offers',
  about: 'About Us',
  contact: 'Contact',
  blog: 'Blog',
  faq: 'FAQ',
  gallery: 'Gallery',
  terms: 'Terms',
  privacy: 'Privacy Policy',
  credits: 'Photo credits',
  account: 'Account',
  profile: 'My profile',
  admin: 'Admin',
  booking: 'Booking',
  'my-bookings': 'My bookings',
  new: 'New booking',
  auth: 'Account',
  login: 'Sign in',
  register: 'Create account',
};

function prettify(segment: string) {
  if (LABELS[segment]) return LABELS[segment];
  return segment
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Breadcrumbs. Pass `items` to control labels (e.g. a safari title); otherwise
 * they are derived from the current path.
 */
export function Breadcrumbs({ items }: { items?: Crumb[] }) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const crumbs: Crumb[] =
    items ??
    segments.map((seg, i) => ({
      label: prettify(seg),
      href: i < segments.length - 1 ? '/' + segments.slice(0, i + 1).join('/') : undefined,
    }));

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        <li>
          <Link href="/" className="inline-flex items-center gap-1 hover:text-primary-600">
            <Home className="h-3.5 w-3.5" aria-hidden />
            <span className="sr-only sm:not-sr-only">Home</span>
          </Link>
        </li>
        {crumbs.map((crumb, i) => (
          <li key={`${crumb.label}-${i}`} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 text-gray-300" aria-hidden />
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-primary-600">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-safari-dusk">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
