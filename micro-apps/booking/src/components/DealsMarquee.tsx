import Link from 'next/link';
import { Price } from './Price';

export interface MarqueeDeal {
  slug: string;
  title: string;
  image: string;
  href: string;
  tourLabel?: string;
  priceKsh?: number;
  priceUsd?: number;
}

/**
 * A deal strip that drifts steadily from one side to the other, like the
 * carousels on the live home page. Two identical rows are laid out side by side
 * and the track is translated by exactly 50%, so the loop is seamless. It
 * pauses on hover/focus and stops entirely for reduced-motion visitors.
 */
export function DealsMarquee({
  title,
  description,
  href,
  linkLabel = 'See all deals',
  deals,
  reverse = false,
  speed = 'normal',
}: {
  title: string;
  description?: string;
  href: string;
  linkLabel?: string;
  deals: MarqueeDeal[];
  reverse?: boolean;
  speed?: 'normal' | 'slow';
}) {
  if (deals.length === 0) return null;

  const row = (
    <ul className="flex shrink-0 items-stretch gap-6 pr-6" aria-hidden={false}>
      {deals.map((deal, index) => (
        <li key={`${deal.slug}-${index}`} className="w-[260px] shrink-0 sm:w-[300px]">
          <Link
            href={deal.href}
            className="card group flex h-full flex-col overflow-hidden"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-safari-sand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={deal.image}
                alt={deal.title}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-heading text-base font-bold text-safari-dusk group-hover:text-primary-600">
                {deal.title}
              </h3>
              <p className="mt-2 text-sm font-semibold text-primary-700">
                {deal.priceKsh != null || deal.priceUsd != null ? (
                  <Price
                    ksh={deal.priceKsh}
                    usd={deal.priceUsd}
                    prefix="From "
                    className="normal-case"
                  />
                ) : (
                  deal.tourLabel
                )}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <section className="py-12">
      <div className="container-custom">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-bold text-safari-dusk sm:text-3xl">{title}</h2>
            {description && <p className="mt-2 max-w-2xl text-gray-500">{description}</p>}
          </div>
          <Link
            href={href}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            {linkLabel} →
          </Link>
        </div>
      </div>

      <div className="marquee-mask mt-8 overflow-hidden">
        <div
          className={`flex w-max ${
            reverse
              ? speed === 'slow'
                ? 'animate-marquee-reverse'
                : 'animate-marquee-reverse'
              : speed === 'slow'
                ? 'animate-marquee-slow'
                : 'animate-marquee'
          } pause-on-hover`}
        >
          {row}
          {row}
        </div>
      </div>
    </section>
  );
}
