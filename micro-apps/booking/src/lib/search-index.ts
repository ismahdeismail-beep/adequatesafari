import { sampleSafaris } from '@/lib/sample-data';
import { dealGroups } from '@/lib/deals';
import { services } from '@/lib/services';

export interface SearchItem {
  id: string;
  title: string;
  blurb: string;
  href: string;
  category: 'Safari' | 'Deal' | 'Service';
}

function lower(x: unknown): string {
  return String(x ?? '').toLowerCase();
}

export function getSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  for (const s of sampleSafaris) {
    items.push({
      id: `safari:${s.slug}`,
      title: s.title,
      blurb: s.excerpt,
      href: `/safaris/${s.slug}`,
      category: 'Safari',
    });
  }

  for (const group of dealGroups) {
    items.push({
      id: `deal:${group.slug}`,
      title: group.title,
      blurb: group.description,
      href: `/deals/${group.slug}`,
      category: 'Deal',
    });
    for (const cat of group.categories) {
      items.push({
        id: `deal:${group.slug}/${cat.slug}`,
        title: cat.title,
        blurb: cat.blurb,
        href: `/deals/${group.slug}/${cat.slug}`,
        category: 'Deal',
      });
    }
  }

  for (const s of services) {
    items.push({
      id: `service:${s.slug}`,
      title: s.title,
      blurb: s.description,
      href: s.href ?? '/services',
      category: 'Service',
    });
  }

  return items;
}

export function runSearch(query: string, limit = 30): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  return getSearchIndex()
    .map((item) => {
      const hay = lower(item.title) + ' ' + lower(item.blurb) + ' ' + lower(item.category);
      const score = terms.reduce((s, t) => (hay.includes(t) ? s + 1 : s), 0);
      return { item, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.item);
}