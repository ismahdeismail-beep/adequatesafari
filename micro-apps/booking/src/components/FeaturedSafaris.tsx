'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, isApiConfigured } from '@/lib/api';
import { sampleSafaris } from '@/lib/sample-data';
import { extractList, safariToCard } from '@/lib/mappers';
import type { Safari, SafariCardData } from '@/types';
import { SafariCard } from './SafariCard';

export function FeaturedSafaris() {
  const [safaris, setSafaris] = useState<SafariCardData[]>(sampleSafaris.filter((s) => s.featured));

  useEffect(() => {
    if (!isApiConfigured) return;
    let cancelled = false;
    api
      .getFeaturedSafaris(6)
      .then((res) => {
        const list = extractList<Safari>(res);
        if (!cancelled && list.length > 0) setSafaris(list.map(safariToCard));
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
