'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState, useMemo, Suspense } from 'react';
import { runSearch } from '@/lib/search-index';

function SearchView() {
  const params = useSearchParams();
  const initial = params.get('q') ?? '';
  const [query, setQuery] = useState(initial);
  const results = useMemo(() => runSearch(query), [query]);

  return (
    <section className="pb-20 pt-28">
      <div className="container-custom">
        <h1 className="font-heading text-3xl font-bold text-safari-dusk sm:text-4xl">
          Search
        </h1>
        <p className="mt-2 text-gray-500">
          Safaris, holiday deals, destinations and the services we offer.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="mt-6 flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Masai Mara, fly-in, Dubai, gorilla, beach…"
              autoFocus
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-safari-dusk"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>

        <p className="mt-6 text-sm text-gray-500">
          {query.trim()
            ? `${results.length} result${results.length === 1 ? '' : 's'} for “${query}”`
            : 'Start typing to search the whole Adequate Safaris catalogue.'}
        </p>

        {results.length === 0 && query.trim() ? (
          <div className="mt-10 rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
            No matches. Try a broader term, or{' '}
            <Link href="/contact" className="text-primary-600 hover:text-primary-700">
              ask us directly
            </Link>
            .
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {results.map((r) => (
              <li
                key={r.id}
                className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <Link
                    href={r.href}
                    className="font-heading text-lg font-semibold text-safari-dusk hover:text-primary-600"
                  >
                    {r.title}
                  </Link>
                  <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                    {r.category}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-gray-600 line-clamp-2">
                  {r.blurb}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <SlidersHorizontal className="h-4 w-4" />
          Quick shortcuts:
          <Link href="/safaris" className="text-primary-600 hover:text-primary-700">
            All safaris
          </Link>
          <span>·</span>
          <Link href="/deals" className="text-primary-600 hover:text-primary-700">
            All holiday deals
          </Link>
          <span>·</span>
          <Link href="/services" className="text-primary-600 hover:text-primary-700">
            All services
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchView />
    </Suspense>
  );
}