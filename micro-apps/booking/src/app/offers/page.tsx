import type { Metadata } from 'next';
import { ContentPage } from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'Special Offers | Absolute Adventure Safaris',
  description: 'Seasonal safari deals and value departures across East Africa.',
};

export default function OffersPage() {
  return (
    <ContentPage title="Special offers" subtitle="Seasonal value departures — updated regularly.">
      <p>
        Our current offers are shown on the safari cards marked <strong>Featured</strong>. Contact
        us for low-season discounts, group prices and honeymoon upgrades.
      </p>
      <h2>How it works</h2>
      <ul>
        <li>Offers apply to selected departure dates</li>
        <li>Subject to availability at the time of booking</li>
        <li>Cannot be combined with other promotions unless stated</li>
      </ul>
    </ContentPage>
  );
}
