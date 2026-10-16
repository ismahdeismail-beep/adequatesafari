import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { services } from '@/lib/services';
import { dealGroups } from '@/lib/deals';

export const metadata: Metadata = {
  title: 'Our Services | Adequate Safaris',
  description:
    'Tailor-made safaris, beach and fly-in holidays, mountain trekking, themed and corporate travel, excursions, transfers, car hire and visa support across East Africa.',
};

export default function ServicesPage() {
  return (
    <>
      <section className="pb-12 pt-28 sm:pt-32">
        <div className="container-custom">
          <h1 className="font-heading text-3xl font-bold text-safari-dusk sm:text-4xl">Our services</h1>
          <p className="mt-3 max-w-2xl text-gray-500">
            Everything we do, beyond the safari itself. Adequate Safaris is a full-service travel
            company — we plan, book and look after every part of your trip, or just the piece you
            need.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div key={service.slug} className="card flex flex-col p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <service.icon className="h-6 w-6 text-primary-700" />
                </div>
                <h2 className="mt-4 font-heading text-lg font-semibold text-safari-dusk">
                  {service.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
                  {service.description}
                </p>
                {service.href && (
                  <Link
                    href={service.href}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    {service.cta ?? 'Learn more'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers — the live deal collections, surfaced in one place. */}
      <section className="bg-safari-sand/40 py-16">
        <div className="container-custom">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-bold text-safari-dusk sm:text-3xl">
                Current offers
              </h2>
              <p className="mt-2 max-w-2xl text-gray-500">
                Residents’ deals, non-resident specials, themed getaways, corporate rates and our
                international packages.
              </p>
            </div>
            <Link
              href="/deals"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              All holiday deals →
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dealGroups.map((group) => (
              <Link
                key={group.slug}
                href={`/deals/${group.slug}`}
                className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-safari-dusk"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={group.image}
                  alt={group.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-4">
                  <span className="block font-heading text-lg font-bold text-white">
                    {group.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-white/80">
                    {group.categories.length} collections
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container-custom">
          <div className="rounded-2xl bg-safari-dusk px-8 py-12 text-center text-white sm:px-12">
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">
              Need something we haven’t listed?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/80">
              Weddings, film crews, school trips or a custom itinerary — tell us what you have in
              mind and we’ll put a plan together.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn-primary">
                Talk to us
              </Link>
              <Link
                href="/safaris"
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-white/40 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Browse safaris
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
