'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { sampleSafaris } from '@/lib/sample-data';
import type { Safari, SafariCardData } from '@/types';
import { SafariCard } from './SafariCard';

function toCard(safari: Safari): SafariCardData {
  return {
    slug: safari.slug,
    title: safari.title,
    excerpt: safari.shortDescription || safari.description.slice(0, 160),
    image: safari.thumbnail || safari.images?.[0] || '/cards/maasai-mara-wildebeest-800.jpg',
    price: safari.minPrice,
    currency: safari.currency,
    durationDays: safari.durationDays,
    country: safari.country.charAt(0) + safari.country.slice(1).toLowerCase(),
    featured: safari.isFeatured,
  };
}

export function FeaturedSafaris() {
  const [safaris, setSafaris] = useState<SafariCardData[]>(sampleSafaris);

  useEffect(() => {
    let cancelled = false;
    api
      .getFeaturedSafaris(6)
      .then((res) => {
        const list: Safari[] | undefined = res?.data ?? res;
        if (!cancelled && Array.isArray(list) && list.length > 0) {
          setSafaris(list.map(toCard));
        }
      })
      .catch(() => {
        /* keep sample data when the API is unreachable */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl font-bold text-safari-dusk">Featured safaris</h2>
            <p className="mt-2 text-gray-500">Hand-picked journeys across East Africa</p>
          </div>
          <Link href="/safaris" className="hidden text-sm font-medium text-primary-600 hover:text-primary-700 sm:block">
            View all safaris
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {safaris.map((safari) => (
            <SafariCard key={safari.slug} safari={safari} />
          ))}
        </div>
      </div>
    </section>
  );
}
