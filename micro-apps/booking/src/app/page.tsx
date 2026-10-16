import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import { Hero } from '@/components/Hero';
import { SearchSection } from '@/components/SearchSection';
import { FeaturedSafaris } from '@/components/FeaturedSafaris';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { Testimonials } from '@/components/Testimonials';
import { Newsletter } from '@/components/Newsletter';
import { DealsMarquee, type MarqueeDeal } from '@/components/DealsMarquee';
import { FaqAccordion } from '@/components/FaqAccordion';
import { dealGroups, getDealGroup, type DealCategory } from '@/lib/deals';
import { services } from '@/lib/services';
import { articles } from '@/lib/blog';
import { faqs } from '@/lib/faqs';

function toMarqueeDeals(groupSlug: string): MarqueeDeal[] {
  const group = getDealGroup(groupSlug);
  if (!group) return [];
  return group.categories.map((category: DealCategory) => ({
    slug: category.slug,
    title: category.title,
    image: category.image,
    href: `/deals/${group.slug}/${category.slug}`,
    tourLabel: category.tourLabel,
    priceKsh: category.priceKsh,
    priceUsd: category.priceUsd,
  }));
}

export default function HomePage() {
  const residents = toMarqueeDeals('specials');
  const nonResidents = toMarqueeDeals('nonresidents');
  const international = getDealGroup('international');
  const featuredArticles = articles.slice(0, 3);

  return (
    <>
      <Hero />
      <SearchSection />

      {/* Where we go — the collections the live site leads with. */}
      <section className="py-12">
        <div className="container-custom">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-bold text-safari-dusk sm:text-3xl">
                Popular destinations
              </h2>
              <p className="mt-2 text-gray-500">Coast, bush and everything beyond Kenya</p>
            </div>
            <Link href="/deals" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              All holiday deals →
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dealGroups.map((group) => (
              <Link
                key={group.slug}
                href={`/deals/${group.slug}`}
                className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-safari-dusk"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={group.image}
                  alt={group.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-4">
                  <span className="block font-heading text-lg font-bold text-white">
                    {group.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-white/80">
                    {group.categories.length} collections
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <DealsMarquee
        title="Adequate Residents Deals"
        description="Short breaks priced in KSH for Kenyan residents — coast, Mara and Amboseli."
        href="/deals/specials"
        deals={residents}
      />

      <FeaturedSafaris />

      {/* What we do — the services the app surfaces beyond the safari itself. */}
      <section className="py-12">
        <div className="container-custom">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-bold text-safari-dusk sm:text-3xl">
                More than safari
              </h2>
              <p className="mt-2 text-gray-500">
                Beaches, mountains, celebrations and the practical bits — all arranged for you
              </p>
            </div>
            <Link
              href="/services"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              All our services →
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service) => (
              <Link
                key={service.slug}
                href={service.href ?? '/services'}
                className="card group flex flex-col p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <service.icon className="h-6 w-6 text-primary-700" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-safari-dusk group-hover:text-primary-600">
                  {service.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
                  {service.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <DealsMarquee
        title="Adequate Non-Residents Specials"
        description="Kenya, Tanzania and Uganda safaris for international visitors."
        href="/deals/nonresidents"
        deals={nonResidents}
        reverse
        speed="slow"
      />

      {/* International packages */}
      {international && (
        <section className="py-12">
          <div className="container-custom">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl font-bold text-safari-dusk sm:text-3xl">
                  {international.title} packages
                </h2>
                <p className="mt-2 max-w-2xl text-gray-500">{international.description}</p>
              </div>
              <Link
                href={`/deals/${international.slug}`}
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                See all destinations →
              </Link>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {international.categories.slice(0, 6).map((category) => (
                <Link
                  key={category.slug}
                  href={`/deals/${international.slug}/${category.slug}`}
                  className="card group flex flex-col overflow-hidden"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-safari-sand">
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
                    <h3 className="font-heading text-lg font-bold text-safari-dusk group-hover:text-primary-600">
                      {category.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-gray-400">{category.tourLabel}</p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">
                      {category.blurb}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <WhyChooseUs />

      {/* Journal */}
      {featuredArticles.length > 0 && (
        <section className="bg-safari-sand/40 py-16">
          <div className="container-custom">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl font-bold text-safari-dusk sm:text-3xl">
                  From the journal
                </h2>
                <p className="mt-2 text-gray-500">Camps, lodges and travel notes</p>
              </div>
              <Link href="/blog" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                Read the journal →
              </Link>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredArticles.map((article) => (
                <a
                  key={article.slug}
                  href={article.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card group flex flex-col overflow-hidden"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-safari-sand">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.image}
                      alt={article.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="flex items-center gap-1.5 text-xs text-gray-400">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {article.date} {article.year}
                    </p>
                    <h3 className="mt-2 font-heading text-lg font-bold text-safari-dusk group-hover:text-primary-600">
                      {article.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
                      {article.excerpt}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <Testimonials />

      <section className="py-16">
        <div className="container-custom">
          <h2 className="font-heading text-2xl font-bold text-safari-dusk sm:text-3xl">
            Frequently asked questions
          </h2>
          <p className="mt-2 text-gray-500">Everything guests ask us before they book</p>
          <div className="mt-8 max-w-3xl">
            <FaqAccordion items={faqs.slice(0, 8)} />
          </div>
          <Link
            href="/faq"
            className="mt-6 inline-block text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            See all questions →
          </Link>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
