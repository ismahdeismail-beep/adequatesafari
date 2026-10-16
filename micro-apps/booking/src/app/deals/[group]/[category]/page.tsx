import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SafariCard } from '@/components/SafariCard';
import { DealPrice } from '@/components/DealPrice';
import { dealGroups, getDealCategory, getDealGroup, safarisForCategory } from '@/lib/deals';
import { sampleSafaris } from '@/lib/sample-data';
import { siteConfig, whatsappLink } from '@/lib/site-config';

export function generateStaticParams() {
  return dealGroups.flatMap((group) =>
    group.categories.map((category) => ({ group: group.slug, category: category.slug }))
  );
}

export function generateMetadata({ params }: { params: { group: string; category: string } }): Metadata {
  const group = getDealGroup(params.group);
  const category = group ? getDealCategory(group, params.category) : undefined;
  return {
    title: category ? `${category.title} | Adequate Safaris` : 'Holiday Deals | Adequate Safaris',
    description: category?.blurb,
  };
}

export default function DealCategoryPage({
  params,
}: {
  params: { group: string; category: string };
}) {
  const group = getDealGroup(params.group);
  const category = group ? getDealCategory(group, params.category) : undefined;
  if (!group || !category) notFound();

  const safaris = safarisForCategory(category, sampleSafaris);
  const wa = whatsappLink(siteConfig.whatsapp);

  return (
    <section className="pb-20 pt-24 sm:pt-32">
      <div className="container-custom">
        <Breadcrumbs
          items={[
            { label: 'Holiday Deals', href: '/deals' },
            { label: group.title, href: `/deals/${group.slug}` },
            { label: category.title },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div className="overflow-hidden rounded-2xl bg-safari-sand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={category.image}
              alt={category.title}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          <div>
            <h1 className="font-heading text-3xl font-bold text-safari-dusk sm:text-4xl">
              {category.title}
            </h1>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">
              <DealPrice
                tourLabel={category.tourLabel}
                priceKsh={category.priceKsh}
                priceUsd={category.priceUsd}
                className="normal-case tracking-normal"
              />
            </p>
            <p className="mt-4 leading-relaxed text-gray-600">{category.blurb}</p>
            <p className="mt-2 leading-relaxed text-gray-600">{group.description}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary inline-flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  Enquire on WhatsApp
                </a>
              )}
              <Link href="/contact" className="btn btn-outline">
                Send an enquiry
              </Link>
              <Link href="/safaris" className="btn btn-ghost">
                Browse all safaris
              </Link>
            </div>
          </div>
        </div>

        {safaris.length > 0 && (
          <div className="mt-14">
            <h2 className="font-heading text-2xl font-bold text-safari-dusk">
              Trips in this collection
            </h2>
            <p className="mt-2 max-w-2xl text-gray-500">
              Bookable online today. Ask us if you need something tailored to these dates.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {safaris.map((safari) => (
                <SafariCard key={safari.slug} safari={safari} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
