import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { GalleryGrid, type GalleryItem } from '@/components/GalleryGrid';
import variantManifest from '@/lib/image-variants.json';

export const metadata: Metadata = {
  title: 'Gallery | Adequate Safaris',
  description: 'Wildlife, landscapes, camps and coastlines from our safaris across East Africa.',
};

// Stems that are scenery/travel, not UI placeholders.
const EXCLUDE = new Set(['accommodation-lodge', 'lodge-pool']);

function label(stem: string) {
  return stem
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function GalleryPage() {
  const cardWidths: Record<string, number[]> = variantManifest.cards;
  const items: GalleryItem[] = Object.keys(cardWidths)
    .filter((stem) => !EXCLUDE.has(stem) && cardWidths[stem]?.length)
    .sort()
    .map((stem) => ({
      stem,
      label: label(stem),
      // 800px is guaranteed for every shipped stem and keeps the grid light;
      // the lightbox picks the largest width that actually exists.
      src: cardWidths[stem].includes(800) ? `/cards/${stem}-800.jpg` : `/cards/${stem}-${cardWidths[stem][0]}.jpg`,
    }));

  return (
    <section className="pb-20 pt-24 sm:pt-32">
      <div className="container-custom">
        <Breadcrumbs />
        <h1 className="font-heading text-3xl font-bold text-safari-dusk sm:text-4xl">Gallery</h1>
        <p className="mt-2 max-w-2xl text-gray-500">
          A look at the wildlife, landscapes, camps and coastlines you can expect on an Adequate
          Safaris trip.
        </p>
        <div className="mt-8">
          <GalleryGrid items={items} />
        </div>
        <p className="mt-8 text-xs text-gray-400">
          Photographer credits are listed on the{' '}
          <a href="/credits" className="underline hover:text-gray-600">
            photo credits
          </a>{' '}
          page.
        </p>
      </div>
    </section>
  );
}
