import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { dealGroups, getDealGroup } from '@/lib/deals';

export function generateStaticParams() {
  return dealGroups.map((group) => ({ group: group.slug }));
}

export function generateMetadata({ params }: { params: { group: string } }): Metadata {
  const group = getDealGroup(params.group);
  return {
    title: group ? `${group.title} | Adequate Safaris` : 'Holiday Deals | Adequate Safaris',
    description: group?.description,
  };
}

export default function DealGroupPage({ params }: { params: { group: string } }) {
  const group = getDealGroup(params.group);
  if (!group) notFound();

  return (
    <section className="pb-20 pt-24 sm:pt-32">
      <div className="container-custom">
        <Breadcrumbs items={[{ label: 'Holiday Deals', href: '/deals' }, { label: group.title }]} />
        <h1 className="font-heading text-3xl font-bold text-safari-dusk sm:text-4xl">
          {group.title}
        </h1>
        <p className="mt-2 max-w-2xl text-gray-500">{group.description}</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {group.categories.map((category) => (
            <Link
              key={category.slug}
              href={`/deals/${group.slug}/${category.slug}`}
              className="card group flex flex-col overflow-hidden"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-safari-sand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={category.image}
                  alt={category.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="font-heading text-lg font-bold text-safari-dusk group-hover:text-primary-600">
                  {category.title}
                </h2>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                  {category.tourLabel}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{category.blurb}</p>
                <span className="mt-4 text-sm font-medium text-primary-600">View trips →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
