import type { Metadata } from 'next';
import Link from 'next/link';
import { dealGroups } from '@/lib/deals';
import { DealPrice } from '@/components/DealPrice';

export const metadata: Metadata = {
  title: 'Special Offers | Adequate Safaris',
  description:
    'Residents’ deals, non-resident specials, themed getaways, corporate rates and international packages — current safari offers across East Africa.',
};

export default function OffersPage() {
  return (
    <>
      <section className="pb-12 pt-28 sm:pt-32">
        <div className="container-custom">
          <h1 className="font-heading text-3xl font-bold text-safari-dusk sm:text-4xl">
            Current offers
          </h1>
          <p className="mt-3 max-w-2xl text-gray-500">
            Our live offer collections — residents’ deals, non-resident specials, themed getaways,
            corporate rates and international packages. Prices are shown in both KSH and USD.
          </p>

          <div className="mt-10 space-y-12">
            {dealGroups.map((group) => (
              <div key={group.slug}>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-safari-dusk sm:text-2xl">
                      {group.title}
                    </h2>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">{group.description}</p>
                  </div>
                  <Link
                    href={`/deals/${group.slug}`}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    View all →
                  </Link>
                </div>

                <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {group.categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/deals/${group.slug}/${category.slug}`}
                      className="card group flex flex-col overflow-hidden"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-safari-sand">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={category.image}
                          alt={category.title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="font-heading text-lg font-bold text-safari-dusk group-hover:text-primary-600">
                          {category.title}
                        </h3>
                        <p className="mt-1 text-xs font-medium text-gray-400">
                          <DealPrice
                            tourLabel={category.tourLabel}
                            priceKsh={category.priceKsh}
                            priceUsd={category.priceUsd}
                          />
                        </p>
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">
                          {category.blurb}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-safari-dusk">How offers work</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6 text-sm text-gray-600">
              <li>Offers apply to selected departure dates and are subject to availability.</li>
              <li>
                A 50% deposit reserves your place — pay it now or settle the balance during your
                visit.
              </li>
              <li>Offers cannot be combined with other promotions unless stated.</li>
              <li>
                Group, low-season and honeymoon rates are on request —{' '}
                <Link href="/contact" className="text-primary-600 hover:text-primary-700">
                  contact us
                </Link>
                .
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
