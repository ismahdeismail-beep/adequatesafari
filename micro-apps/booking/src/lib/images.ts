/**
 * Responsive image helpers.
 *
 * The static image sets live in `public/cards` and `public/hero`, kept in sync
 * with the Joomla template's set
 * (`joomla-site/templates/adequate/images/{cards,hero}`):
 *
 *   cards/<stem>-{400,800,1280}.{jpg,webp}   (4:3 destination photography)
 *   hero/<name>-{640,960,1300}.webp + <name>.jpg
 *
 * Before every `dev`/`build`, `scripts/generate-image-variants.js` scans those
 * folders and writes `image-variants.json` — the widths that genuinely exist
 * per stem. Data files always reference the 800px JPG (e.g. `/cards/foo-800.jpg`)
 * and derive the rest, so a `<picture>` only ever advertises files that are
 * really shipped: adding a new image without every variant can never produce a
 * 404 (and therefore never a browser console error).
 *
 * Fallback behaviour: if a stem is unknown or has no variants we return `null`
 * and the caller renders a plain `<img src>` as before.
 */
import variants from './image-variants.json';

// JSON imports are inferred with literal keys; widen to index signatures so we
// can look stems up at runtime (strict mode / noImplicitAny safe).
const cardWidths: Record<string, number[]> = variants.cards;
const heroWidths: Record<string, number[]> = variants.hero;

const CARD_RE = /^\/cards\/(.+)-800\.jpg$/;
const HERO_RE = /^\/hero\/(.+)\.jpg$/;

const build = (dir: string, stem: string, ext: string, widths: number[]) =>
  widths.map((w) => `/${dir}/${stem}-${w}.${ext} ${w}w`).join(', ');

const CARD_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

export interface CardSources {
  fallback: string;
  imgSrcSet: string;
  webpSrcSet: string;
  sizes: string;
}

export function cardSources(image: string | undefined | null): CardSources | null {
  if (!image) return null;
  const m = CARD_RE.exec(image);
  if (!m) return null;
  const stem = m[1];
  const widths = cardWidths[stem];
  if (!widths || widths.length === 0) return null;
  return {
    fallback: image,
    imgSrcSet: build('cards', stem, 'jpg', widths),
    webpSrcSet: build('cards', stem, 'webp', widths),
    sizes: CARD_SIZES,
  };
}

export interface HeroSources {
  fallback: string;
  webpSrcSet: string;
  sizes: string;
}

export function heroSources(image: string): HeroSources | null {
  const m = HERO_RE.exec(image);
  if (!m) return null;
  const stem = m[1];
  const widths = heroWidths[stem];
  if (!widths || widths.length === 0) return null;
  return {
    fallback: image,
    webpSrcSet: build('hero', stem, 'webp', widths),
    sizes: '100vw',
  };
}
