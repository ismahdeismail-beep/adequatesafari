import type { Metadata } from 'next';
import { ContentPage } from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'Uganda Safari Tours | Adequate Safaris',
  description: 'Gorilla trekking in Bwindi and wildlife in Queen Elizabeth National Park, Uganda.',
};

export default function UgandaSafariToursPage() {
  return (
    <ContentPage title="Uganda safari tours" subtitle="Gorilla trekking, chimpanzees and the Rift Valley.">
      <p>
        Uganda pairs mountain gorillas in Bwindi Impenetrable Forest with chimpanzee tracking in
        Kibale and the wildlife of Queen Elizabeth National Park. Five-day itineraries are the sweet
        spot.
      </p>
      <h2>Highlights</h2>
      <ul>
        <li>Mountain gorilla trekking with experienced trackers</li>
        <li>Chimpanzee tracking in Kibale Forest</li>
        <li>Boat cruises on the Kazinga Channel</li>
        <li>Optional extension to Lake Bunyonyi</li>
      </ul>
      <p className="mt-4">
        Gorilla permits are limited and must be secured in advance — we book them for you.{' '}
        <a href="/safaris?country=UGANDA" className="text-primary-600 hover:text-primary-700">
          Browse Uganda safaris
        </a>
        .
      </p>
    </ContentPage>
  );
}