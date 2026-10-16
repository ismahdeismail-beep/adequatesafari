import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentPage } from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'Kenya Short-Stay Safaris | Adequate Safaris',
  description: 'Short-stay safaris in Kenya — Mara, Amboseli, Nakuru, Naivasha and the coast.',
};

export default function KenyaShortStaySafariPage() {
  return (
    <ContentPage title="Kenya short-stay safaris" subtitle="Three to six days — perfect for limited leave.">
      <p>
        Short on time? Kenya offers the most rewarding short safaris in Africa. Five to six days
        folds a Masai Mara game experience with Amboseli or Nakuru into one itinerary, while long
        weekends cover Lake Naivasha, Hell's Gate and a taste of the coast.
      </p>
      <h2>What we include</h2>
      <ul>
        <li>Comfortable safari lodges and permanent tented camps</li>
        <li>Private professional driver-guides in pop-top 4x4 vehicles</li>
        <li>Park fees and game drives as per the itinerary</li>
        <li>Airport transfers and domestic flights where stated</li>
      </ul>
      <h2>Sample timing</h2>
      <p>Three days for Mara + Nakuru, five days for Mara + Amboseli, six days for Mara + Samburu.</p>
      <p>
        <Link href="/safaris?country=KENYA" className="text-primary-600 hover:text-primary-700">
          Browse Kenya safaris
        </Link>{' '}
        or{' '}
        <Link href="/contact" className="text-primary-600 hover:text-primary-700">
          ask us to design one
        </Link>
        .
      </p>
    </ContentPage>
  );
}