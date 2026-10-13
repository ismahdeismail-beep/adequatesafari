'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, Check, Clock, MapPin, Minus, Star, X } from 'lucide-react';
import { api } from '@/lib/api';
import { safariToDetail } from '@/lib/mappers';
import { getSampleSafari } from '@/lib/sample-data';
import { formatCurrency, formatDateShort } from '@/lib/utils';
import type { Safari, SafariDetailData } from '@/types';

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
        if (!cancelled) setSafari(item && item.slug ? safariToDetail(item) : getSampleSafari(slug) ?? null);
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
  const rangeLabel =
    typeof safari.maxPrice === 'number' && safari.maxPrice > (safari.price ?? 0)
      ? `${priceLabel} – ${formatCurrency(safari.maxPrice, safari.currency ?? 'USD')}`
      : priceLabel;

  const upcoming = (safari.dates ?? [])
    .filter((d) => d.status === 'OPEN' || d.status === 'GUARANTEED')
    .filter((d) => new Date(d.startDate).getTime() > Date.now() - 86400000)
    .sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate))
    .slice(0, 3);

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
            {rangeLabel && (
              <p className="text-gray-500">
                From <span className="font-heading text-3xl font-bold text-safari-dusk">{rangeLabel}</span>{' '}
                <span className="text-sm">per person</span>
              </p>
            )}
            {safari.groupSizeMin && safari.groupSizeMax && (
              <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <Minus className="h-4 w-4" /> {safari.groupSizeMin}–{safari.groupSizeMax} travellers
              </p>
            )}

            {upcoming.length > 0 && (
              <div className="mt-5 border-t border-gray-100 pt-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <CalendarDays className="h-3.5 w-3.5" /> Upcoming departures
                </p>
                <ul className="mt-2 space-y-1.5">
                  {upcoming.map((d) => (
                    <li key={d.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{formatDateShort(d.startDate)}</span>
                      <span className="font-semibold text-safari-dusk">
                        {formatCurrency(d.price, d.currency ?? safari.currency ?? 'USD')}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/booking/new?safari=${safari.slug}`}
                  className="mt-2 inline-block text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  See all dates &amp; prices →
                </Link>
              </div>
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
              Prices are per person. Your total is shown before you confirm — no payment now.
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}
