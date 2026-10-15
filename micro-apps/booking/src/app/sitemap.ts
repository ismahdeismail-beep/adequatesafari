import type { MetadataRoute } from 'next';
import { sampleSafaris } from '@/lib/sample-data';
import { dealGroups } from '@/lib/deals';

const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.adequatesafaris.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: [string, number][] = [
    ['', 1],
    ['/safaris', 0.9],
    ['/destinations', 0.9],
    ['/deals', 0.9],
    ['/gallery', 0.8],
    ['/blog', 0.7],
    ['/about', 0.7],
    ['/contact', 0.7],
    ['/offers', 0.7],
    ['/terms', 0.4],
    ['/privacy', 0.4],
    ['/faq', 0.5],
    ['/credits', 0.3],
    ['/auth/login', 0.3],
  ];

  return [
    ...staticRoutes.map(([route, priority]) => ({
      url: `${base}${route}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority,
    })),
    ...dealGroups.flatMap((group) => [
      {
        url: `${base}/deals/${group.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      ...group.categories.map((category) => ({
        url: `${base}/deals/${group.slug}/${category.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
    ]),
    ...sampleSafaris.map((s) => ({
      url: `${base}/safaris/${s.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
