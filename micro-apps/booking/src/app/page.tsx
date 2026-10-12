import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SafariCard } from '@/components/SafariCard';
import { Hero } from '@/components/Hero';
import { SearchSection } from '@/components/SearchSection';
import { FeaturedSafaris } from '@/components/FeaturedSafaris';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { Testimonials } from '@/components/Testimonials';
import { Newsletter } from '@/components/Newsletter';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <SearchSection />
        <FeaturedSafaris />
        <WhyChooseUs />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}