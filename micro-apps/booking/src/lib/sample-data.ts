import type { SafariCardData, SafariDetailData } from '@/types';

export const sampleSafaris: SafariCardData[] = [
  {
    slug: 'great-migration-special',
    title: 'Great Migration Special',
    excerpt:
      'Time your visit for the river crossings (July–October), when over a million wildebeest and zebra thunder across the Mara.',
    image: '/cards/maasai-mara-wildebeest-800.jpg',
    price: 1450,
    currency: 'USD',
    durationDays: 4,
    country: 'Kenya',
    featured: true,
  },
  {
    slug: 'mount-kenya-sirimon-route',
    title: 'Mount Kenya – Sirimon Route',
    excerpt:
      "A five-day trek to Point Lenana (4,985 m) on Africa's second-highest mountain, with acclimatisation days and mountain huts.",
    image: '/cards/mount-kenya-800.jpg',
    price: 980,
    currency: 'USD',
    durationDays: 5,
    country: 'Kenya',
    featured: true,
  },
  {
    slug: 'tented-camp-safari',
    title: 'Tented-Camp Safari',
    excerpt: 'Luxury tented camps under the stars with daily game drives in the heart of the Maasai Mara.',
    image: '/cards/tented-camp-800.jpg',
    price: 350,
    currency: 'USD',
    durationDays: 3,
    country: 'Kenya',
    featured: true,
  },
  {
    slug: 'lodge-tented-camp-collection',
    title: 'Lodge & Tented-Camp Collection',
    excerpt: 'Hand-picked lodges and camps across Kenya, from mid-range comfort to full luxury.',
    image: '/cards/lodge-pool-800.jpg',
    price: 780,
    currency: 'USD',
    durationDays: 3,
    country: 'Kenya',
    featured: true,
  },
  {
    slug: 'bwindi-gorilla-trekking',
    title: 'Bwindi Gorilla Trekking',
    excerpt:
      "Trek mountain gorillas in Uganda's Bwindi Impenetrable Forest — a once-in-a-lifetime hour with a habituated family.",
    image: '/cards/bwindi-gorilla-800.jpg',
    price: 1650,
    currency: 'USD',
    durationDays: 4,
    country: 'Uganda',
    featured: true,
  },
  {
    slug: 'leopard-photographic-safari',
    title: 'Leopard Photographic Safari',
    excerpt:
      'A small-group photographic safari timed for golden light, with dedicated vehicles and room for your kit in the Mara.',
    image: '/cards/leopard-sighting-800.jpg',
    price: 2100,
    currency: 'USD',
    durationDays: 5,
    country: 'Kenya',
    featured: true,
  },
  {
    slug: 'amboseli-kilimanjaro-views',
    title: 'Amboseli & Kilimanjaro Views',
    excerpt: 'Elephants against the backdrop of Africa’s highest peak, with sweeping views across Amboseli.',
    image: '/cards/amboseli-kilimanjaro-800.jpg',
    price: 890,
    currency: 'USD',
    durationDays: 4,
    country: 'Kenya',
  },
  {
    slug: 'lake-nakuru-flamingos',
    title: 'Lake Nakuru Flamingos',
    excerpt: 'A classic Rift Valley stop for flamingos, rhino and the resident Rothschild’s giraffe.',
    image: '/cards/lake-nakuru-flamingos-800.jpg',
    price: 420,
    currency: 'USD',
    durationDays: 3,
    country: 'Kenya',
  },
  {
    slug: 'samburu-gerenuk-special',
    title: 'Samburu Special',
    excerpt: 'Head north for the Samburu Five — gerenuk, Grevy’s zebra, reticulated giraffe, oryx and ostrich.',
    image: '/cards/samburu-gerenuk-800.jpg',
    price: 760,
    currency: 'USD',
    durationDays: 4,
    country: 'Kenya',
  },
  {
    slug: 'ngorongoro-crater-serengeti',
    title: 'Ngorongoro Crater & Serengeti',
    excerpt: 'Descend into the crater for dense wildlife, then cross the Serengeti plains on this classic Tanzania route.',
    image: '/cards/tanzania-ngorongoro-800.jpg',
    price: 1980,
    currency: 'USD',
    durationDays: 6,
    country: 'Tanzania',
  },
  {
    slug: 'zanzibar-beach-extension',
    title: 'Zanzibar Beach Extension',
    excerpt: 'A barefoot finish to your safari — white sands, warm Indian Ocean water and spice-island culture.',
    image: '/cards/zanzibar-beach-800.jpg',
    price: 540,
    currency: 'USD',
    durationDays: 4,
    country: 'Tanzania',
  },
];

const defaultItinerary = (days: number): SafariDetailData['itinerary'] =>
  Array.from({ length: days }).map((_, i) => ({
    day: i + 1,
    title: i === 0 ? 'Arrival & briefing' : i === days - 1 ? 'Departure' : `Day ${i + 1} — game viewing`,
    description:
      i === 0
        ? 'Met on arrival and transferred to your lodge or camp. Evening briefing with your guide.'
        : i === days - 1
          ? 'Final morning activity (time permitting), then transfer to the airport for your onward flight.'
          : 'Full days of game drives with your private guide, returning to camp for meals and rest.',
    accommodation: 'Lodge / tented camp',
    meals: i === 0 ? 'Dinner' : i === days - 1 ? 'Breakfast' : 'Breakfast, lunch, dinner',
  }));

export function getSampleSafari(slug: string): SafariDetailData | undefined {
  const card = sampleSafaris.find((s) => s.slug === slug);
  if (!card) return undefined;
  const days = card.durationDays ?? 4;
  return {
    ...card,
    accommodationType: 'Lodge / tented camp',
    safariStyle: 'Lodge safari',
    groupSizeMin: 2,
    groupSizeMax: 6,
    rating: 4.8,
    reviewCount: 42,
    highlights: [
      'Private game drives with an expert guide',
      'Comfortable lodge and tented-camp accommodation',
      'All park and conservancy fees included',
      'Unlimited bottled water in the vehicle',
    ],
    inclusions: [
      'Accommodation on the itinerary',
      'Meals as indicated',
      'All game drives in a 4×4 with a pop-up roof',
      'Professional driver-guide',
      'Park entrance fees',
    ],
    exclusions: [
      'International flights',
      'Travel and medical insurance',
      'Visas',
      'Drinks and personal items',
      'Tips and gratuities',
    ],
    itinerary: defaultItinerary(days),
    gallery: [card.image],
  };
}
