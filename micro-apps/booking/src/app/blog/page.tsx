import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays } from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { articles } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Travel Journal | Adequate Safaris',
  description:
    'Camp and lodge write-ups from the Maasai Mara, Tsavo, Naivasha and Nanyuki — where we send our guests and why.',
};

export default function BlogPage() {
  return (
    <section className="pb-20 pt-24 sm:pt-32">
      <div className="container-custom">
        <Breadcrumbs />
        <h1 className="font-heading text-3xl font-bold text-safari-dusk sm:text-4xl">
          Travel Journal
        </h1>
        <p className="mt-2 max-w-2xl text-gray-500">
          Notes on the camps, lodges and cottages we use — where they are, how long the transfer
          takes, and who they suit.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article key={article.slug} className="card group flex flex-col overflow-hidden">
              <Link
                href={`/blog/${article.slug}`}
                className="relative block aspect-[4/3] overflow-hidden bg-safari-sand"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.image}
                  alt={article.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-400">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                  {article.date} {article.year}
                </p>
                <h2 className="mt-2 font-heading text-lg font-bold text-safari-dusk">
                  <Link
                    href={`/blog/${article.slug}`}
                    className="hover:text-primary-600"
                  >
                    {article.title}
                  </Link>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{article.excerpt}</p>
                <Link
                  href={`/blog/${article.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Read the full write-up
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 max-w-2xl text-sm text-gray-500">
          Planning a trip and want our honest take on a camp?{' '}
          <Link href="/contact" className="font-medium text-primary-600 hover:text-primary-700">
            Ask us
          </Link>{' '}
          — we only recommend places we have slept in ourselves.
        </p>
      </div>
    </section>
  );
}
