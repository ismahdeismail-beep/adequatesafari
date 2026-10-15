'use client';

import { useCallback, useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cardSources } from '@/lib/images';
import variantManifest from '@/lib/image-variants.json';

const cardWidths: Record<string, number[]> = variantManifest.cards;

/** Largest JPG width that actually ships for a stem (avoids 404s). */
function largestSrc(stem: string) {
  const widths = cardWidths[stem];
  if (!widths || widths.length === 0) return `/cards/${stem}-800.jpg`;
  return `/cards/${stem}-${Math.max(...widths)}.jpg`;
}

export interface GalleryItem {
  stem: string;
  label: string;
  src: string;
}

/**
 * Simple masonry-ish gallery with a keyboard-accessible lightbox.
 * Images come from the card image set, so every width advertised exists.
 */
export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length)),
    [items.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close, prev, next]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => {
          const sources = cardSources(item.src);
          return (
            <li key={item.stem}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group relative block w-full overflow-hidden rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label={`View ${item.label}`}
              >
                <picture>
                  {sources && (
                    <source type="image/webp" srcSet={sources.webpSrcSet} sizes={sources.sizes} />
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    srcSet={sources?.imgSrcSet}
                    sizes={sources?.sizes}
                    alt={item.label}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </picture>
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-left text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {open && index !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={items[index].label}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-2 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white sm:left-6"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={largestSrc(items[index].stem)}
            alt={items[index].label}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded-lg object-contain"
          />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-2 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white sm:right-6"
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1 text-sm text-white">
            {items[index].label}
          </p>
        </div>
      )}
    </>
  );
}
