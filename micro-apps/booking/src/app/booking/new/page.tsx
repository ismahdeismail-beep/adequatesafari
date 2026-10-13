import type { Metadata } from 'next';
import { BookingFlow } from '@/components/BookingFlow';

export const metadata: Metadata = {
  title: 'Book a safari | Adequate Safaris',
  description:
    'Pick a departure, see the per-person price, review your total, and confirm your booking. No payment is taken until we confirm availability.',
};

export default function BookingNewPage({
  searchParams,
}: {
  searchParams: { safari?: string };
}) {
  return <BookingFlow initialSlug={searchParams?.safari ?? ''} />;
}