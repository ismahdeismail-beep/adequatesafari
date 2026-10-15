import { Hero } from '@/components/Hero';
import { SearchSection } from '@/components/SearchSection';
import { FeaturedSafaris } from '@/components/FeaturedSafaris';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { Testimonials } from '@/components/Testimonials';
import { Newsletter } from '@/components/Newsletter';

export default function HomePage() {
  return (
    <>
      <Hero />
      <SearchSection />
      <FeaturedSafaris />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </>
  );
}
