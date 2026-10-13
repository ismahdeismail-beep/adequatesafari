import type { Metadata } from 'next';
import { ContentPage } from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'About Us | Absolute Adventure Safaris',
  description: 'Locally owned and operated, designing unforgettable safari journeys across East Africa.',
};

export default function AboutPage() {
  return (
    <ContentPage
      title="About Absolute Adventure Safaris"
      subtitle="Locally owned and operated in Nairobi, Kenya."
    >
      <p>
        We design and operate safari journeys across Kenya, Tanzania and Uganda. From the Great
        Migration in the Maasai Mara to gorilla trekking in Bwindi, our team handles every detail so
        you can simply enjoy the wild.
      </p>
      <h2>Why travellers choose us</h2>
      <ul>
        <li>Private departures and small groups — never crowded vehicles</li>
        <li>Expert driver-guides who know the parks intimately</li>
        <li>Transparent pricing with no hidden extras</li>
        <li>24/7 on-safari support from your dedicated consultant</li>
      </ul>
      <h2>Responsible travel</h2>
      <p>
        We work with camps and lodges that respect local communities and wildlife, and we support
        conservation projects across the region.
      </p>
    </ContentPage>
  );
}
