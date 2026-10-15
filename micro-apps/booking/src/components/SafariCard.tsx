import Link from 'next/link';
import { Clock, MapPin } from 'lucide-react';
import type { SafariCardData } from '@/types';
import { cn, formatCurrency } from '@/lib/utils';
import { cardSources } from '@/lib/images';

interface SafariCardProps {
  safari: SafariCardData;
  className?: string;
}

export function SafariCard({ safari, className }: SafariCardProps) {
  const priceLabel =
    typeof safari.price === 'number' ? formatCurrency(safari.price, safari.currency ?? 'USD') : null;
  const sources = cardSources(safari.image);

  return (
    <article className={cn('card group flex flex-col animate-slide-up', className)}>
      <Link
        href={`/safaris/${safari.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-safari-sand"
      >
        {sources ? (
          <picture className="block h-full w-full">
            <source type="image/webp" srcSet={sources.webpSrcSet} sizes={sources.sizes} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sources.fallback}
              srcSet={sources.imgSrcSet}
              sizes={sources.sizes}
              alt={safari.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </picture>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={safari.image}
            alt={safari.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {safari.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-safari-gold px-3 py-1 text-xs font-semibold text-safari-dusk">
            Featured
          </span>
        )}
        {priceLabel && (
          <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-primary-700 shadow-sm">
            From {priceLabel} / person
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg font-bold text-safari-dusk">
          <Link href={`/safaris/${safari.slug}`} className="hover:text-primary-600 transition-colors">
            {safari.title}
          </Link>
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
          {safari.country && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {safari.country}
            </span>
          )}
          {typeof safari.durationDays === 'number' && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {safari.durationDays} days
            </span>
          )}
        </div>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">{safari.excerpt}</p>

        <div className="mt-5 flex items-center gap-3">
          <Link href={`/booking/new?safari=${safari.slug}`} className="btn-primary text-sm">
            Book Now
          </Link>
          <Link
            href={`/safaris/${safari.slug}`}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
