import type { SafariCardData } from '@/types';

/**
 * Deal collections — the services the live adequatesafaris.com site runs that
 * the original booking app did not surface:
 *
 *   /diani-holiday-deals-2026/  /mombasa-holiday-deals-2026/
 *   /mara-daily-departures/     /corporate-deals/
 *   /themed-holidays/           /non-residents/
 *
 * Each group maps to the live site's `tour-destination` / `tour-category` taxonomies.
 * `tourCount` mirrors the live site's "N tours" label; `safariSlugs` links the
 * category to safaris we actually sell in this app (see `sample-data.ts`), so a
 * category page is never an empty box while the full catalogue is still being
 * migrated.
 *
 * Photography lives in `public/deals/` (800×960, the same crops the live site
 * uses).
 */

export interface DealCategory {
  slug: string;
  title: string;
  /** Live-site tour count, kept as a label (e.g. "14 tours"). */
  tourLabel: string;
  image: string;
  blurb: string;
  /** Slugs in `sample-data.ts` this category links to. */
  safariSlugs: string[];
}

export interface DealGroup {
  slug: string;
  title: string;
  description: string;
  image: string;
  categories: DealCategory[];
}

const COASTAL = ['diani-beach-escape'];

export const dealGroups: DealGroup[] = [
  {
    slug: 'diani',
    title: 'Diani Holiday Deals',
    description:
      'Kenya’s south-coast favourite — white sand, turquoise reef and direct flights. Our Diani packages bundle flights, transfers and beach nights.',
    image: '/deals/diani-deals.jpg',
    categories: [
      {
        slug: 'diani-flying-package',
        title: 'Diani Flying Package',
        tourLabel: '5 tours',
        image: '/deals/diani-flying-package.webp',
        blurb: 'Fly-in beach stays with direct Nairobi–Ukunda flights — no long road transfer.',
        safariSlugs: COASTAL,
      },
      {
        slug: 'diani-easter-package',
        title: 'Diani Easter Package',
        tourLabel: '0 tours',
        image: '/deals/diani-easter-package.webp',
        blurb: 'Easter-week beach packages. Released seasonally — ask us for this year’s dates.',
        safariSlugs: COASTAL,
      },
      {
        slug: 'diani-deals',
        title: 'Diani Deals',
        tourLabel: '9 tours',
        image: '/deals/diani-deals.jpg',
        blurb: 'The full Diani catalogue: hotels, self-catering apartments and all-inclusive stays.',
        safariSlugs: COASTAL,
      },
    ],
  },
  {
    slug: 'mombasa',
    title: 'Mombasa Holiday Deals',
    description:
      'The Kenyan coast from Watamu to Kilifi — travel by SGR, by air, or as part of a longer Kenya safari.',
    image: '/deals/mombasa-holiday-deals.webp',
    categories: [
      {
        slug: 'watamu-holiday-deals',
        title: 'Watamu Holiday Deals',
        tourLabel: '8 tours',
        image: '/deals/watamu-holiday-deals.webp',
        blurb: 'Watamu’s marine park, turtle conservation and quiet sandy bays.',
        safariSlugs: COASTAL,
      },
      {
        slug: 'mombasa-sgr-deals',
        title: 'Mombasa SGR Deals',
        tourLabel: '7 tours',
        image: '/deals/mombasa-sgr-deals.webp',
        blurb: 'Coast by Standard Gauge Railway from Nairobi — the scenic, affordable way down.',
        safariSlugs: COASTAL,
      },
      {
        slug: 'mombasa-holiday-deals',
        title: 'Mombasa Holiday Deals',
        tourLabel: '14 tours',
        image: '/deals/mombasa-holiday-deals.webp',
        blurb: 'Nyali, Bamburi and Shanzu beach stays with optional Old Town and Fort Jesus add-ons.',
        safariSlugs: COASTAL,
      },
      {
        slug: 'mombasa-flight-deals',
        title: 'Mombasa Flight Deals',
        tourLabel: '10 tours',
        image: '/deals/mombasa-flight-deals.webp',
        blurb: 'Fly to Moi International and be poolside the same afternoon.',
        safariSlugs: COASTAL,
      },
      {
        slug: 'malindi-holiday-deals',
        title: 'Malindi Holiday Deals',
        tourLabel: '6 tours',
        image: '/deals/malindi-holiday-deals.webp',
        blurb: 'Italian-influenced Malindi: Marine National Park, Gedi Ruins and long empty beaches.',
        safariSlugs: COASTAL,
      },
      {
        slug: 'kilifi-holiday-deals',
        title: 'Kilifi Holiday Deals',
        tourLabel: '6 tours',
        image: '/deals/kilifi-holiday-deals.webp',
        blurb: 'Kilifi Creek, mangrove channels and boutique lodges — the coast, quietly.',
        safariSlugs: COASTAL,
      },
    ],
  },
  {
    slug: 'mara',
    title: 'Mara Daily Departures',
    description:
      'Guaranteed-departure Masai Mara trips. Join a fixed-date group and pay only for your seat — no need to fill a private vehicle.',
    image: '/deals/masai-mara-group-joining-deals.webp',
    categories: [
      {
        slug: 'masai-mara-group-joining-deals',
        title: 'Masai Mara Group Joining Deals',
        tourLabel: '4 tours',
        image: '/deals/masai-mara-group-joining-deals.webp',
        blurb: 'Daily group-joining departures on shared game-drive vehicles, all year round.',
        safariSlugs: ['masai-mara-group-joining', 'great-migration-special', 'tented-camp-safari'],
      },
      {
        slug: 'masai-mara-easter-group-joining',
        title: 'Masai Mara Easter Group Joining',
        tourLabel: '1 tour',
        image: '/deals/masai-mara-easter-group-joining.webp',
        blurb: 'Fixed Easter-week departures for solo travellers and small groups.',
        safariSlugs: ['masai-mara-group-joining'],
      },
      {
        slug: '3-days-masai-mara-deals',
        title: '3 Days Masai Mara Deals',
        tourLabel: '3 tours',
        image: '/deals/3-days-masai-mara-deals.webp',
        blurb: 'The classic three-day, two-night Mara break — the shortest safari worth doing.',
        safariSlugs: ['tented-camp-safari', 'masai-mara-group-joining'],
      },
    ],
  },
  {
    slug: 'corporate',
    title: 'Corporate Deals',
    description:
      'Company travel, team building and school programmes — invoiced, VAT-compliant and planned around your calendar.',
    image: '/deals/team-building-packages.jpg',
    categories: [
      {
        slug: 'team-building-packages',
        title: 'Team Building Packages',
        tourLabel: '0 tours',
        image: '/deals/team-building-packages.jpg',
        blurb: 'Outdoor team programmes with guides, venues and facilitators arranged end to end.',
        safariSlugs: ['corporate-team-retreat'],
      },
      {
        slug: 'school-holiday-trips',
        title: 'School Holiday Trips',
        tourLabel: '3 tours',
        image: '/deals/school-holiday-trips.jpg',
        blurb: 'Supervised holiday trips for schools — parks, museums and coast, safely chaperoned.',
        safariSlugs: ['christmas-bush-holiday'],
      },
      {
        slug: 'business-travel-packages',
        title: 'Business Travel Packages',
        tourLabel: '0 tours',
        image: '/deals/business-travel-packages.jpg',
        blurb: 'Flights, accommodation and ground transport for conferences and site visits.',
        safariSlugs: ['corporate-team-retreat'],
      },
    ],
  },
  {
    slug: 'themed',
    title: 'Themed Holidays',
    description:
      'Trips built around an occasion — honeymoons, birthdays, anniversaries and everything worth celebrating.',
    image: '/deals/valentine-gateways.webp',
    categories: [
      {
        slug: 'valentine-gateways',
        title: 'Valentine Gateways',
        tourLabel: '23 tours',
        image: '/deals/valentine-gateways.webp',
        blurb: 'February escapes: beach dinners, private dinners and bush sundowners for two.',
        safariSlugs: ['zanzibar-beach-extension', 'diani-beach-escape'],
      },
      {
        slug: 'romatic-gateaways',
        title: 'Romantic Getaways',
        tourLabel: '14 tours',
        image: '/deals/romatic-gateaways.jpg',
        blurb: 'Couples-only lodges, island hideaways and quiet corners of the bush.',
        safariSlugs: ['zanzibar-beach-extension', 'seychelles-island-escape'],
      },
      {
        slug: 'honeymoon-holiday',
        title: 'Honeymoon Holiday',
        tourLabel: '14 tours',
        image: '/deals/honeymoon-holiday.jpg',
        blurb: 'Safari-then-beach honeymoons — Mara mornings, then barefoot on the Indian Ocean.',
        safariSlugs: ['zanzibar-beach-extension', 'maldives-island-escape', 'seychelles-island-escape'],
      },
      {
        slug: 'engagement-holidays',
        title: 'Engagement Holidays',
        tourLabel: '11 tours',
        blurb: 'Proposals and engagement trips, from bush picnics to private dhow sunsets.',
        image: '/deals/engagement-holidays.jpg',
        safariSlugs: ['zanzibar-beach-extension', 'seychelles-island-escape'],
      },
      {
        slug: 'birthday-gateways',
        title: 'Birthday Gateways',
        tourLabel: '25 tours',
        image: '/deals/birthday-gateways.jpg',
        blurb: 'Big-birthday trips with cake in camp and a view worth the extra year.',
        safariSlugs: ['nairobi-staycation', 'dubai-city-escape'],
      },
      {
        slug: 'babymoon-gateways',
        title: 'BabyMoon Gateways',
        tourLabel: '5 tours',
        image: '/deals/babymoon-gateways.webp',
        blurb: 'Slow, comfortable trips before the baby arrives — short transfers, soft beds.',
        safariSlugs: ['diani-beach-escape', 'mauritius-island-escape'],
      },
    ],
  },
  {
    slug: 'nonresidents',
    title: 'Non-Residents',
    description:
      'Safaris priced and packaged for visitors travelling into East Africa — park fees, permits and airport transfers included.',
    image: '/deals/kenya-safaris.jpg',
    categories: [
      {
        slug: 'kenya-safaris',
        title: 'Kenya Safaris',
        tourLabel: '35 tours',
        image: '/deals/kenya-safaris.jpg',
        blurb: 'The Mara, Amboseli, Samburu, Nakuru and Mount Kenya for international visitors.',
        safariSlugs: [
          'great-migration-special',
          'mount-kenya-sirimon-route',
          'tented-camp-safari',
          'lodge-tented-camp-collection',
          'leopard-photographic-safari',
          'amboseli-kilimanjaro-views',
          'lake-nakuru-flamingos',
          'samburu-gerenuk-special',
        ],
      },
      {
        slug: 'tanzania-safaris',
        title: 'Tanzania Safaris',
        tourLabel: '6 tours',
        image: '/deals/tanzania-safaris.jpg',
        blurb: 'Serengeti, Ngorongoro Crater and the Zanzibar coast across the border.',
        safariSlugs: ['ngorongoro-crater-serengeti', 'serengeti-classic-safari', 'zanzibar-beach-extension'],
      },
      {
        slug: 'uganda-safaris',
        title: 'Uganda Safaris',
        tourLabel: '1 tour',
        image: '/deals/uganda-safaris.jpg',
        blurb: 'Gorilla trekking in Bwindi and chimpanzee tracking in Kibale.',
        safariSlugs: ['bwindi-gorilla-trekking', 'rwanda-gorilla-trekking'],
      },
    ],
  },
];

export function getDealGroup(slug: string): DealGroup | undefined {
  return dealGroups.find((group) => group.slug === slug);
}

export function getDealCategory(
  group: DealGroup,
  slug: string
): DealCategory | undefined {
  return group.categories.find((category) => category.slug === slug);
}

/** Resolve a category's linked safaris, preserving the order they're listed in. */
export function safarisForCategory(
  category: DealCategory,
  safaris: SafariCardData[]
): SafariCardData[] {
  return category.safariSlugs
    .map((slug) => safaris.find((safari) => safari.slug === slug))
    .filter((safari): safari is SafariCardData => Boolean(safari));
}
