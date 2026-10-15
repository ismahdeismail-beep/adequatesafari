#!/usr/bin/env node
/**
 * Generates src/lib/image-variants.json from the static asset folders.
 *
 * The <picture>/<srcset> helpers in src/lib/images.ts only ever advertise
 * widths that actually exist on disk, so adding or removing an image can never
 * produce a 404 (or a browser console error) in a deployed build.
 *
 * Run automatically by `npm run dev` / `npm run build` (predev / prebuild).
 * Pure filesystem scan - no image tooling, fast enough to run every build.
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'src', 'lib', 'image-variants.json');
const WIDTH_RE = /^(.+)-(\d+)\.(jpg|webp)$/;

/** widths for `dir` where BOTH .jpg and .webp exist (cards use both) */
function scanPaired(dir) {
  const res = {};
  if (!fs.existsSync(dir)) return res;
  for (const fn of fs.readdirSync(dir)) {
    const m = WIDTH_RE.exec(fn);
    if (!m) continue;
    const [, stem, width, ext] = m;
    if (ext !== 'jpg') continue;
    const hasWebp = fs.existsSync(path.join(dir, `${stem}-${width}.webp`));
    if (hasWebp) (res[stem] ||= []).push(Number(width));
  }
  for (const k of Object.keys(res)) res[k].sort((a, b) => a - b);
  return res;
}

/** widths for `dir` where a <stem>.jpg fallback + <stem>-<w>.webp exist (hero) */
function scanHero(dir) {
  const res = {};
  if (!fs.existsSync(dir)) return res;
  const files = new Set(fs.readdirSync(dir));
  for (const fn of files) {
    if (!fn.endsWith('.jpg') || WIDTH_RE.test(fn)) continue; // skip -W.jpg
    const stem = fn.slice(0, -4);
    const widths = [];
    for (const other of files) {
      const m = /^(.+)-(\d+)\.webp$/.exec(other);
      if (m && m[1] === stem) widths.push(Number(m[2]));
    }
    widths.sort((a, b) => a - b);
    if (widths.length) res[stem] = widths;
  }
  return res;
}

const manifest = {
  cards: scanPaired(path.join(ROOT, 'public', 'cards')),
  hero: scanHero(path.join(ROOT, 'public', 'hero')),
};

const next = `${JSON.stringify(manifest, null, 2)}\n`;
const prev = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
if (prev !== next) fs.writeFileSync(OUT, next);

const cardWidths = new Set(Object.values(manifest.cards).flat());
const heroWidths = new Set(Object.values(manifest.hero).flat());
console.log(
  `image-variants: ${Object.keys(manifest.cards).length} cards ` +
    `(${[...cardWidths].sort((a, b) => a - b).join('/') || '-'}w), ` +
    `${Object.keys(manifest.hero).length} hero ` +
    `(${[...heroWidths].sort((a, b) => a - b).join('/') || '-'}w)`
);
