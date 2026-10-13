import type { Safari, SafariCardData, SafariDetailData } from '@/types';

export function safariToDetail(safari: Safari): SafariDetailData {
  return {
    id: safari.id,
    slug: safari.slug,
    title: safari.title,
    excerpt: safari.shortDescription || safari.description?.slice(0, 160) || '',
    image: safari.thumbnail || safari.images?.[0] || '/cards/maasai-mara-wildebeest-800.jpg',
    price: safari.minPrice,
    maxPrice: safari.maxPrice,
    currency: safari.currency,
    durationDays: safari.durationDays,
    country: safari.country
      ? safari.country.charAt(0) + safari.country.slice(1).toLowerCase()
      : undefined,
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
    dates: safari.safariDates ?? [],
  };
}

export function safariToCard(safari: Safari): SafariCardData {
  return {
    slug: safari.slug,
    title: safari.title,
    excerpt: safari.shortDescription || safari.description?.slice(0, 160) || '',
    image: safari.thumbnail || safari.images?.[0] || '/cards/maasai-mara-wildebeest-800.jpg',
    price: safari.minPrice,
    currency: safari.currency,
    durationDays: safari.durationDays,
    country: safari.country
      ? safari.country.charAt(0) + safari.country.slice(1).toLowerCase()
      : undefined,
    featured: safari.isFeatured,
  };
}

export function extractList<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[];
  const maybe = res as { data?: T[] } | undefined;
  if (maybe && Array.isArray(maybe.data)) return maybe.data;
  return [];
}
