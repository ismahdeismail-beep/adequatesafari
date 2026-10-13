'use client';

import { useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { api } from '@/lib/api';
import { sampleSafaris } from '@/lib/sample-data';
import { extractList, safariToCard } from '@/lib/mappers';
import type { Safari, SafariCardData } from '@/types';
import { SafariCard } from './SafariCard';

interface SafariListingProps {
  initialSearch?: string;
  initialCountry?: string;
}

const countries = [
  { value: '', label: 'All countries' },
  { value: 'KENYA', label: 'Kenya' },
  { value: 'TANZANIA', label: 'Tanzania' },
  { value: 'UGANDA', label: 'Uganda' },
  { value: 'RWANDA', label: 'Rwanda' },
];

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'duration';

export function SafariListing({ initialSearch = '', initialCountry = '' }: SafariListingProps) {
  const [search, setSearch] = useState(initialSearch);
  const [country, setCountry] = useState(initialCountry.toUpperCase());
  const [sort, setSort] = useState<SortKey>('featured');
  const [remote, setRemote] = useState<SafariCardData[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getSafaris({ country: country || undefined, search: search || undefined, take: 60 })
      .then((res) => {
        const list = extractList<Safari>(res);
        if (!cancelled) setRemote(list.length > 0 ? list.map(safariToCard) : null);
      })
      .catch(() => {
        if (!cancelled) setRemote(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [country, search]);

  const results = useMemo(() => {
    const base = remote ?? sampleSafaris;
    const term = search.trim().toLowerCase();
    const filtered = base.filter((s) => {
      const matchesCountry = !country || (s.country ?? '').toUpperCase() === country;
      const matchesTerm =
        !term ||
        s.title.toLowerCase().includes(term) ||
        s.excerpt.toLowerCase().includes(term) ||
        (s.country ?? '').toLowerCase().includes(term);
      return matchesCountry && matchesTerm;
    });
    const sorted = [...filtered];
    if (sort === 'price-asc') sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sort === 'price-desc') sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    if (sort === 'duration') sorted.sort((a, b) => (a.durationDays ?? 0) - (b.durationDays ?? 0));
    return sorted;
  }, [remote, search, country, sort]);

  return (
    <section className="pb-16 pt-28">
      <div className="container-custom">
        <h1 className="font-heading text-3xl font-bold text-safari-dusk sm:text-4xl">Our safaris</h1>
        <p className="mt-2 max-w-2xl text-gray-500">
          Browse journeys across Kenya, Tanzania and Uganda. Filter by country or search by park, style
          or experience.
        </p>

        <div className="mt-8 flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="search" className="mb-1 block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. Maasai Mara, gorilla, migration"
              className="input-field"
            />
          </div>
          <div className="sm:w-48">
            <label htmlFor="country" className="mb-1 block text-sm font-medium text-gray-700">
              Country
            </label>
            <select id="country" value={country} onChange={(e) => setCountry(e.target.value)} className="input-field">
              {countries.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:w-48">
            <label htmlFor="sort" className="mb-1 flex items-center gap-1 text-sm font-medium text-gray-700">
              <SlidersHorizontal className="h-4 w-4" /> Sort by
            </label>
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="input-field">
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="duration">Duration</option>
            </select>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-500" aria-live="polite">
          {loading ? 'Loading safaris…' : `${results.length} safaris found`}
        </p>

        {results.length === 0 && !loading ? (
          <div className="mt-10 rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
            No safaris match your filters. Try clearing the search.
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((safari) => (
              <SafariCard key={safari.slug} safari={safari} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
