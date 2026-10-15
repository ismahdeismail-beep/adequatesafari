import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentPage } from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'Travel Journal | Adequate Safaris',
  description: 'Guides, planning advice and stories from our safaris across East Africa.',
};

const topics = [
  {
    title: 'When to see the Great Migration',
    href: '/safaris?search=migration',
    blurb: 'Understanding the seasonal movement of wildebeest across the Mara and Serengeti.',
  },
  {
    title: 'Packing for a Kenyan safari',
    href: '/faq',
    blurb: 'What to bring for game drives, mountain treks and beach extensions.',
  },
  {
    title: 'Beach & bush combinations',
    href: '/safaris?search=beach',
    blurb: 'Pairing the savannah with a barefoot finish on the Indian Ocean.',
  },
  {
    title: 'Special offers & value departures',
    href: '/offers',
    blurb: 'Low-season discounts, group pricing and honeymoon upgrades.',
  },
];

export default function BlogPage() {
  return (
    <ContentPage
      title="Travel journal"
      subtitle="Planning guides and stories to help you get the most from your safari."
    >
      <p>
        Our journal is being written up — in the meantime, these are the guides our team is asked
        about most. For anything specific, please <Link href="/contact">get in touch</Link>.
      </p>
      <ul>
        {topics.map((t) => (
          <li key={t.href}>
            <Link href={t.href} className="font-medium text-primary-600 hover:text-primary-700">
              {t.title}
            </Link>{' '}
            — {t.blurb}
          </li>
        ))}
      </ul>
    </ContentPage>
  );
}
