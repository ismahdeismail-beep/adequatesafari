import type { Metadata } from 'next';
import { ContentPage } from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'Tanzania Safaris | Adequate Safaris',
  description: 'Serengeti, Ngorongoro, Tarangire and Zanzibar — multi-day Tanzania safari packages.',
};

export default function TanzaniaSafarisPage() {
  return (
    <ContentPage title="Tanzania safaris" subtitle="Serengeti, Ngorongoro, Tarangire and Zanzibar.">
      <p>
        Tanzania is East Africa at its grandest. Seven to ten days folds the Serengeti, Ngorongoro
        Crater and Tarangire into one journey, with an optional Zanzibar beach extension to close.
      </p>
      <h2>Highlights</h2>
      <ul>
        <li>Great Migration calving (Jan–Mar) and river crossings (Jul–Oct)</li>
        <li>Ngorongoro Crater — the world's largest intact volcanic caldera</li>
        <li>Tarangire's elephant herds in the dry season</li>
        <li>Zanzibar Stone Town and the north-coast beaches</li>
      </ul>
      <p className="mt-4">
        <a href="/safaris?country=TANZANIA" className="text-primary-600 hover:text-primary-700">
          Browse Tanzania safaris
        </a>{' '}
        or contact us for a tailored itinerary.
      </p>
    </ContentPage>
  );
}