import type { MetadataRoute } from 'next';

const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.absoluteadventuresafaris.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/booking/', '/auth/'],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
