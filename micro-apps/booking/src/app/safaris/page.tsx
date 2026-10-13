import type { Metadata } from 'next';
import { SafariListing } from '@/components/SafariListing';

export const metadata: Metadata = {
  title: 'Our Safaris | Adequate Safaris',
  description: 'Browse safari journeys across Kenya, Tanzania and Uganda — filter by country, price and duration.',
};

export default function SafarisPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';
  return <SafariListing initialSearch={first(searchParams.search)} initialCountry={first(searchParams.country)} />;
}
