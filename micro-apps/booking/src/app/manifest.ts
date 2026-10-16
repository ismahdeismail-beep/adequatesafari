import type { MetadataRoute } from 'next';

/**
 * Web app manifest — how the site is identified when installed to a phone's
 * home screen. The icons are the Adequate Safaris logo, taken from the
 * existing adequatesafaris.com site (see images/brand/ for provenance).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Adequate Safaris',
    short_name: 'Adequate Safaris',
    description:
      'Book safari adventures in Kenya, Tanzania and Uganda, plus coastal and international holiday packages.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#15803d',
    icons: [
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/brand/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
