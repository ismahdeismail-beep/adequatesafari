'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { heroSources } from '@/lib/images';

const slides = [
  {
    image: '/hero/slider1.jpg',
    eyebrow: 'Adequate Safaris',
    heading: 'Discover the wild heart of East Africa',
    subtext: 'Leading provider of quality leisure and vacation experiences and services.',
    cta: { label: 'Book a safari', href: '/safaris' },
  },
  {
    image: '/hero/slider5.jpg',
    eyebrow: 'Masai Mara',
    heading: 'Witness the Great Wildebeest Migration',
    subtext: 'Wildlife and bird-viewing in the Masai Mara — we will take you there.',
    cta: { label: 'See migration safaris', href: '/safaris?search=migration' },
  },
  {
    image: '/hero/slider2.jpg',
    eyebrow: 'Mount Kenya & Kilimanjaro',
    heading: 'Climb the roof of Africa',
    subtext: 'Guided treks on the Sirimon, Naromoru, Machame and Marangu routes.',
    cta: { label: 'Explore climbs', href: '/safaris?search=climb' },
  },
  {
    image: '/hero/slider4.jpg',
    eyebrow: 'Tailor-made itineraries',
    heading: 'Your safari, your way',
    subtext: 'Build a custom itinerary across Kenya, Tanzania and Uganda.',
    cta: { label: 'Plan your trip', href: '/contact' },
  },
  {
    image: '/hero/slider7.jpg',
    eyebrow: 'Beach & bush',
    heading: 'From the savannah to the Indian Ocean',
    subtext: 'Combine game drives with the beaches of Lamu and Zanzibar.',
    cta: { label: 'Beach escapes', href: '/safaris?search=beach' },
  },
];

const AUTOPLAY_MS = 6500;

const slideSources = slides.map((slide) => heroSources(slide.image));

export function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % slides.length), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, []);

  const go = (dir: number) => setActive((i) => (i + dir + slides.length) % slides.length);

  return (
    <section
      className="relative mt-16 h-[70vh] min-h-[480px] w-full overflow-hidden"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured safaris"
    >
      {slides.map((slide, index) => (
        <div
          key={slide.image}
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
            index === active ? 'opacity-100' : 'opacity-0'
          )}
          aria-hidden={index !== active}
        >
          {slideSources[index] ? (
            <picture className="block h-full w-full">
              <source
                type="image/webp"
                srcSet={slideSources[index]!.webpSrcSet}
                sizes={slideSources[index]!.sizes}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt={slide.heading}
                className={cn(
                  'h-full w-full object-cover',
                  index === active && 'animate-ken-burns'
                )}
                fetchPriority={index === 0 ? 'high' : 'auto'}
              />
            </picture>
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={slide.image}
              alt={slide.heading}
              className={cn(
                'h-full w-full object-cover',
                index === active && 'animate-ken-burns'
              )}
              fetchPriority={index === 0 ? 'high' : 'auto'}
            />
          )}          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="container-custom absolute inset-0 flex flex-col justify-center">
            <div className="max-w-2xl animate-slide-up text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-safari-gold">
                {slide.eyebrow}
              </p>
              <h1 className="mt-3 font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                {slide.heading}
              </h1>
              <p className="mt-4 max-w-xl text-lg text-white/90">{slide.subtext}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={slide.cta.href} className="btn-primary text-base">
                  {slide.cta.label}
                </Link>
                <Link
                  href="/safaris"
                  className="rounded-lg border border-white/40 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
                >
                  Explore all safaris
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur transition hover:bg-white/30 sm:block"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur transition hover:bg-white/30 sm:block"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.image}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === active}
            className={cn(
              'h-2.5 rounded-full transition-all',
              index === active ? 'w-8 bg-safari-gold' : 'w-2.5 bg-white/60 hover:bg-white'
            )}
          />
        ))}
      </div>
    </section>
  );
}
