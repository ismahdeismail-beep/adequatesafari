import type { Metadata } from 'next';
import Link from 'next/link';
import { cardSources } from '@/lib/images';
import { sampleSafaris } from '@/lib/sample-data';

export const metadata: Metadata = {
  title: 'Destinations | Adequate Safaris',
  description:
    'Explore East Africa by destination — Kenya, Tanzania, Uganda, and the Indian Ocean islands.',
};

const destinations = [
  {
    name: 'Kenya',
    query: 'country=KENYA',
    match: 'Kenya',
    image: '/cards/maasai-mara-wildebeest-800.jpg',
    blurb: 'The Maasai Mara, Amboseli, Samburu, the Rift Valley lakes and Mount Kenya.',
  },
  {
    name: 'Tanzania',
    query: 'country=TANZANIA',
    match: 'Tanzania',
    image: '/cards/tanzania-ngorongoro-800.jpg',
    blurb: 'The Serengeti, Ngorongoro Crater, Kilimanjaro and the Zanzibar coast.',
  },
  {
    name: 'Uganda',
    query: 'country=UGANDA',
    match: 'Uganda',
    image: '/cards/bwindi-gorilla-800.jpg',
    blurb: 'Mountain gorillas in Bwindi and the forested national parks.',
  },
  {
    name: 'Beach & islands',
    query: 'search=beach',
    match: null,
    image: '/cards/zanzibar-beach-800.jpg',
    blurb: 'Zanzibar, Diani, Lamu and Indian Ocean island escapes.',
  },
];

function countFor(match: string | null) {
  if (!match) return null;
  return sampleSafaris.filter((s) => s.country === match).length;
}

export default function DestinationsPage() {
  return (
    <section className="pb-20 pt-32">
      <div className="container-custom">
        <h1 className="font-heading text-3xl font-bold text-safari-dusk sm:text-4xl">
          Destinations
        </h1>
        <p className="mt-2 max-w-2xl text-gray-500">
          From the Maasai Mara to the Indian Ocean — choose a region to see the safaris we run there.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((d) => {
            const sources = cardSources(d.image);
            const count = countFor(d.match);
            return (
              <Link
                key={d.name}
                href={`/safaris?${d.query}`}
                className="card group flex flex-col overflow-hidden"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-safari-sand">
                  {sources ? (
                    <picture className="block h-full w-full">
                      <source
                        type="image/webp"
                        srcSet={sources.webpSrcSet}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sources.fallback}
                        srcSet={sources.imgSrcSet}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        alt={d.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </picture>
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={d.image}
                      alt={d.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-heading text-lg font-bold text-safari-dusk group-hover:text-primary-600">
                    {d.name}
                  </h2>
                  {count !== null && (
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                      {count} {count === 1 ? 'safari' : 'safaris'}
                    </p>
                  )}
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{d.blurb}</p>
                  <span className="mt-4 text-sm font-medium text-primary-600">View safaris →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
