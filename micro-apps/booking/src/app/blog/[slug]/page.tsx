import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ContentPage } from '@/components/ContentPage';
import { articles } from '@/lib/blog';

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return {};
  return {
    title: `${article.title} | Adequate Safaris Journal`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.image, width: 1200, height: 800, alt: article.title }],
    },
  };
}

export default function JournalArticlePage({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) {
    return (
      <ContentPage title="Not found">
        <p>That article could not be found.</p>
        <p>
          <Link href="/blog" className="text-primary-600 hover:text-primary-700">
            Back to the journal
          </Link>
          .
        </p>
      </ContentPage>
    );
  }

  return (
    <ContentPage
      title={article.title}
      subtitle={`${article.date} ${article.year}`}
      breadcrumbs={[{ label: 'Journal', href: '/blog' }]}
    >
      <img
        src={article.image}
        alt={article.title}
        width={1200}
        height={800}
        loading="lazy"
        decoding="async"
        className="mb-6 w-full rounded-xl"
      />
      <p className="text-lg leading-relaxed">{article.excerpt}</p>
      <p className="mt-6">
        The full write-up — with photos, room details and transfer times — is published on our
        journal partner site. We do the research, you get the recommendation.
      </p>
      <p className="mt-4">
        <a
          href={article.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-primary-600 hover:text-primary-700"
        >
          Read the full write-up
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </a>
      </p>
      <p className="mt-8 flex flex-wrap gap-3 text-sm text-gray-500">
        Planning a stay at {article.title}?{' '}
        <Link href="/contact" className="font-medium text-primary-600 hover:text-primary-700">
          Ask us
        </Link>{' '}
        — we have preferred rates.
      </p>
    </ContentPage>
  );
}