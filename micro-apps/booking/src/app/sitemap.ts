import type { MetadataRoute } from 'next';
import { sampleSafaris } from '@/lib/sample-data';

const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.absoluteadventuresafaris.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ['', '/safaris', '/about', '/contact', '/offers', '/terms', '/privacy', '/faq', '/credits'];

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.7,
    })),
    ...sampleSafaris.map((s) => ({
      url: `${base}/safaris/${s.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
