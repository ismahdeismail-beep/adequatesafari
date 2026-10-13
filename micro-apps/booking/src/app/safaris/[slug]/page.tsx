import type { Metadata } from 'next';
import { SafariDetail } from '@/components/SafariDetail';
import { sampleSafaris } from '@/lib/sample-data';

export function generateStaticParams() {
  return sampleSafaris.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const safari = sampleSafaris.find((s) => s.slug === params.slug);
  return {
    title: safari ? `${safari.title} | Absolute Adventure Safaris` : 'Safari | Absolute Adventure Safaris',
    description: safari?.excerpt,
  };
}

export default function SafariPage({ params }: { params: { slug: string } }) {
  return <SafariDetail slug={params.slug} />;
}
