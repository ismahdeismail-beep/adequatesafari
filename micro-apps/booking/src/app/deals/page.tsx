import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { dealGroups } from '@/lib/deals';

export const metadata: Metadata = {
  title: 'Holiday Deals | Adequate Safaris',
  description:
    'Beach deals in Diani, Mombasa and Watamu, daily Masai Mara departures, corporate travel and themed holidays.',
};

export default function DealsPage() {
  return (
    <section className="pb-20 pt-24 sm:pt-32">
      <div className="container-custom">
        <Breadcrumbs />
        <h1 className="font-heading text-3xl font-bold text-safari-dusk sm:text-4xl">
          Holiday Deals
        </h1>
        <p className="mt-2 max-w-2xl text-gray-500">
          Seasonal offers, guaranteed-departure groups and occasion trips — pick a collection to see
          what is running now.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dealGroups.map((group) => (
            <Link
              key={group.slug}
              href={`/deals/${group.slug}`}
              className="card group flex flex-col overflow-hidden"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-safari-sand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={group.image}
                  alt={group.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="font-heading text-lg font-bold text-safari-dusk group-hover:text-primary-600">
                  {group.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{group.description}</p>
                <span className="mt-4 text-sm font-medium text-primary-600">
                  {group.categories.length} collections →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
