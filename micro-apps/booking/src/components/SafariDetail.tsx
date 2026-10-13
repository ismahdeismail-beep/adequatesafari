'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, Clock, MapPin, Minus, Star, X } from 'lucide-react';
import { api } from '@/lib/api';
import { getSampleSafari } from '@/lib/sample-data';
import { formatCurrency } from '@/lib/utils';
import type { Safari, SafariDetailData } from '@/types';

function mapDetail(safari: Safari): SafariDetailData {
  return {
    slug: safari.slug,
    title: safari.title,
    excerpt: safari.shortDescription || safari.description?.slice(0, 160) || '',
    image: safari.thumbnail || safari.images?.[0] || '/cards/maasai-mara-wildebeest-800.jpg',
    price: safari.minPrice,
    currency: safari.currency,
    durationDays: safari.durationDays,
    country: safari.country ? safari.country.charAt(0) + safari.country.slice(1).toLowerCase() : undefined,
    region: safari.region,
    accommodationType: safari.accommodationType,
    safariStyle: safari.safariStyle,
    groupSizeMin: safari.groupSizeMin,
    groupSizeMax: safari.groupSizeMax,
    highlights: safari.highlights ?? [],
    inclusions: safari.inclusions ?? [],
    exclusions: safari.exclusions ?? [],
    itinerary: safari.itinerary ?? [],
    gallery: safari.images ?? [],
    rating: safari.averageRating,
    reviewCount: safari.reviewCount,
  };
}

export function SafariDetail({ slug }: { slug: string }) {
  const [safari, setSafari] = useState<SafariDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getSafari(slug)
      .then((res) => {
        const item = (res?.data ?? res) as Safari | undefined;
        if (!cancelled) setSafari(item && item.slug ? mapDetail(item) : getSampleSafari(slug) ?? null);
      })
      .catch(() => {
        if (!cancelled) setSafari(getSampleSafari(slug) ?? null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="container-custom pb-16 pt-28">
        <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  }

  if (!safari) {
    return (
      <div className="container-custom pb-16 pt-28 text-center">
        <h1 className="font-heading text-3xl font-bold text-safari-dusk">Safari not found</h1>
        <p className="mt-3 text-gray-500">The safari you’re looking for isn’t available.</p>
        <Link href="/safaris" className="btn-primary mt-6 inline-block">
          Browse all safaris
        </Link>
      </div>
    );
  }

  const priceLabel =
    typeof safari.price === 'number' ? formatCurrency(safari.price, safari.currency ?? 'USD') : null;

  return (
    <article className="pb-20 pt-16">
      <div className="relative h-[45vh] min-h-[320px] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={safari.image} alt={safari.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="container-custom absolute bottom-6 left-0 right-0">
          <div className="text-white">
            <p className="text-sm font-semibold uppercase tracking-widest text-safari-gold">
              {safari.country}
            </p>
            <h1 className="mt-1 font-heading text-3xl font-bold sm:text-4xl">{safari.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-white/90">
              {typeof safari.durationDays === 'number' && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {safari.durationDays} days
                </span>
              )}
              {safari.region && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {safari.region}
                </span>
              )}
              {typeof safari.rating === 'number' && (
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current text-safari-gold" /> {safari.rating.toFixed(1)}
                  {safari.reviewCount ? ` (${safari.reviewCount})` : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom mt-10 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-heading text-2xl font-bold text-safari-dusk">Overview</h2>
          <p className="mt-3 leading-relaxed text-gray-600">{safari.excerpt}</p>

          {safari.highlights.length > 0 && (
            <>
              <h3 className="mt-8 font-heading text-xl font-semibold text-safari-dusk">Highlights</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {safari.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" /> {h}
                  </li>
                ))}
              </ul>
            </>
          )}

          {safari.itinerary.length > 0 && (
            <>
              <h3 className="mt-10 font-heading text-xl font-semibold text-safari-dusk">Itinerary</h3>
              <ol className="mt-4 space-y-4">
                {safari.itinerary.map((day) => (
                  <li key={day.day} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                        {day.day}
                      </span>
                      <h4 className="font-semibold text-safari-dusk">{day.title}</h4>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">{day.description}</p>
                    {(day.accommodation || day.meals) && (
                      <p className="mt-2 text-xs text-gray-400">
                        {day.accommodation && <>Stay: {day.accommodation}</>}
                        {day.accommodation && day.meals && ' · '}
                        {day.meals && <>Meals: {day.meals}</>}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </>
          )}

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-heading text-lg font-semibold text-safari-dusk">Included</h3>
              <ul className="mt-3 space-y-2">
                {safari.inclusions.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" /> {i}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-safari-dusk">Excluded</h3>
              <ul className="mt-3 space-y-2">
                {safari.exclusions.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" /> {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
            {priceLabel && (
              <p className="text-gray-500">
                From <span className="font-heading text-3xl font-bold text-safari-dusk">{priceLabel}</span>{' '}
                <span className="text-sm">per person</span>
              </p>
            )}
            {safari.groupSizeMin && safari.groupSizeMax && (
              <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <Minus className="h-4 w-4" /> {safari.groupSizeMin}–{safari.groupSizeMax} travellers
              </p>
            )}
            <Link
              href={`/booking/new?safari=${safari.slug}`}
              className="btn-primary mt-6 flex w-full items-center justify-center"
            >
              Book this safari
            </Link>
            <Link
              href="/contact"
              className="mt-3 flex w-full items-center justify-center rounded-lg border border-gray-200 px-6 py-3 font-medium text-safari-dusk transition-colors hover:bg-gray-50"
            >
              Ask a question
            </Link>
            <p className="mt-4 text-center text-xs text-gray-400">
              No payment now — we’ll confirm availability first.
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}
