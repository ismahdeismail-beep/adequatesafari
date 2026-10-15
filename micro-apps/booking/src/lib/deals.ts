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
  {
    slug: 'specials',
    title: 'Adequate Specials',
    description:
      'The current run of short-break discounts — coast, Mara and Amboseli, quoted in KSH and refreshed through the year.',
    image: '/deals/5-days-mombasa-flying.webp',
    categories: [
      {
        slug: '5-days-mombasa-flying',
        title: '5 Days Mombasa Flying',
        tourLabel: 'From KSH.37,500',
        image: '/deals/5-days-mombasa-flying.webp',
        blurb: 'Fly-in Mombasa break with transfers and four beach nights — the longest of the running specials.',
        safariSlugs: COASTAL,
      },
      {
        slug: '3-days-masai-mara-easter-deals',
        title: '3 Days Masai Mara August Deals',
        tourLabel: 'From KSH.18,000',
        image: '/deals/3-days-masai-mara-easter-deals.jpg',
        blurb: 'The cheapest way into the Mara: a fixed-date group departure over three days.',
        safariSlugs: ['masai-mara-group-joining', 'tented-camp-safari'],
      },
      {
        slug: '3-days-mombasa-package',
        title: '3 Days Mombasa SGR Package',
        tourLabel: 'From KSH.16,500',
        image: '/deals/3-days-mombasa-package.webp',
        blurb: 'Coast by Standard Gauge Railway — the scenic overnight run from Nairobi to Mombasa.',
        safariSlugs: COASTAL,
      },
      {
        slug: '3-days-mombasa-all-inclusive-deals',
        title: '3 Days Mombasa Flying Deals',
        tourLabel: 'From KSH.27,500',
        image: '/deals/3-days-mombasa-all-inclusive-deals.jpg',
        blurb: 'A short fly-in beach weekend with no road time at all.',
        safariSlugs: COASTAL,
      },
      {
        slug: '3-days-diani-flying-package',
        title: '3 Days Diani Flying Package',
        tourLabel: 'From KSH.37,999',
        image: '/deals/3-days-diani-flying-package.jpg',
        blurb: 'Fly to Ukunda and be on the sand the same morning.',
        safariSlugs: COASTAL,
      },
      {
        slug: '3-days-amboseli-deals',
        title: '3 Days Amboseli Deals',
        tourLabel: 'From KSH.14,000',
        image: '/deals/3-days-amboseli-deals.jpg',
        blurb: 'Elephants beneath Kilimanjaro — the classic three-day southern-circuit safari.',
        safariSlugs: ['amboseli-kilimanjaro-views'],
      },
      {
        slug: '3-days-diani-sgr-deals',
        title: '3 Days Diani SGR Deals',
        tourLabel: 'From KSH.24,500',
        image: '/deals/3-days-diani-sgr-deals.jpg',
        blurb: 'Rail to the coast, then straight onto Diani beach.',
        safariSlugs: COASTAL,
      },
      {
        slug: '5-days-diani-sgr-deals',
        title: '5 Days Diani SGR Deals',
        tourLabel: 'From KSH.47,700',
        image: '/deals/5-days-diani-sgr-deals.jpg',
        blurb: 'A longer beach stay with the rail transfer built in.',
        safariSlugs: COASTAL,
      },
      {
        slug: '3-days-watamu-flying-deals',
        title: '3 Days Watamu / Malindi / Kilifi SGR Deals',
        tourLabel: 'From KSH.53,100',
        image: '/deals/3-days-watamu-flying-deals.webp',
        blurb: 'The quieter north coast — pick between Watamu, Malindi and Kilifi.',
        safariSlugs: COASTAL,
      },
      {
        slug: '2-days-laikipia-nanyuki-self-drive-deals',
        title: '2 Days Laikipia / Nanyuki Self-Drive Deals',
        tourLabel: 'From KSH.5,900',
        image: '/deals/2-days-laikipia-nanyuki-self-drive-deals.jpg',
        blurb: 'Take your own vehicle upcountry for a weekend in Laikipia and around Nanyuki.',
        safariSlugs: ['mount-kenya-sirimon-route'],
      },
    ],
  },
  {
    slug: 'international',
    title: 'International',
    description:
      'Long-haul escapes sold alongside the East African programmes — Dubai, the Indian Ocean islands, Asia, Europe and beyond.',
    image: '/cards/dubai-city-escape-800.jpg',
    categories: [
      {
        slug: 'dubai',
        title: 'Dubai',
        tourLabel: '10 tours',
        image: '/cards/dubai-city-escape-800.jpg',
        blurb: 'City breaks, desert safaris and the seasonal Christmas and Easter programmes.',
        safariSlugs: ['dubai-city-escape'],
      },
      {
        slug: 'bali',
        title: 'Bali',
        tourLabel: '1 tour',
        image: '/cards/bali-island-escape-800.jpg',
        blurb: 'Temples, rice terraces and beach time on the Island of the Gods.',
        safariSlugs: ['bali-island-escape'],
      },
      {
        slug: 'mauritius',
        title: 'Mauritius',
        tourLabel: '1 tour',
        image: '/cards/mauritius-island-escape-800.jpg',
        blurb: 'A warm-water island stopover that pairs neatly with a Kenya safari.',
        safariSlugs: ['mauritius-island-escape'],
      },
      {
        slug: 'maldives',
        title: 'Maldives',
        tourLabel: '1 tour',
        image: '/cards/maldives-island-escape-800.jpg',
        blurb: 'Overwater villas and reef — the shortest flight to total quiet.',
        safariSlugs: ['maldives-island-escape'],
      },
      {
        slug: 'seychelles',
        title: 'Seychelles',
        tourLabel: '1 tour',
        image: '/cards/seychelles-island-escape-800.jpg',
        blurb: 'Granite islands, giant tortoises and some of the best snorkelling in the region.',
        safariSlugs: ['seychelles-island-escape'],
      },
      {
        slug: 'europe',
        title: 'Europe',
        tourLabel: '3 tours',
        image: '/cards/europe-epic-tour-800.jpg',
        blurb: 'Multi-country escorted tours through the classic European capitals.',
        safariSlugs: ['europe-epic-tour'],
      },
      {
        slug: 'thailand',
        title: 'Thailand',
        tourLabel: '2 tours',
        image: '/cards/thailand-bangkok-pattaya-800.jpg',
        blurb: 'Bangkok and Pattaya, usually as a Christmas-season departure.',
        safariSlugs: ['thailand-bangkok-pattaya'],
      },
      {
        slug: 'malaysia-singapore',
        title: 'Malaysia & Singapore',
        tourLabel: '3 tours',
        image: '/cards/kuala-lumpur-singapore-800.jpg',
        blurb: 'Kuala Lumpur, the Genting highlands and Singapore — sometimes with a cruise.',
        safariSlugs: ['kuala-lumpur-singapore'],
      },
      {
        slug: 'south-africa',
        title: 'South Africa',
        tourLabel: '2 tours',
        image: '/cards/cape-town-family-vacation-800.jpg',
        blurb: 'Cape Town and the Western Cape, including family programmes.',
        safariSlugs: ['cape-town-family-vacation'],
      },
      {
        slug: 'jordan',
        title: 'Jordan',
        tourLabel: '3 tours',
        image: '/cards/jordan-timeless-treasures-800.jpg',
        blurb: 'Petra, Wadi Rum and the Dead Sea, plus the Holy Land pilgrimage departures.',
        safariSlugs: ['jordan-timeless-treasures'],
      },
      {
        slug: 'egypt',
        title: 'Egypt',
        tourLabel: '1 tour',
        image: '/cards/egypt-nile-cruise-800.jpg',
        blurb: 'Nile cruises with the pyramids either side.',
        safariSlugs: ['egypt-nile-cruise'],
      },
      {
        slug: 'turkey',
        title: 'Turkey',
        tourLabel: '2 tours',
        image: '/cards/turkey-istanbul-cappadocia-800.jpg',
        blurb: 'Istanbul, the Cappadocia balloons and the Mediterranean coast.',
        safariSlugs: ['turkey-istanbul-cappadocia'],
      },
      {
        slug: 'china',
        title: 'China',
        tourLabel: '1 tour',
        image: '/deals/china-canton-fair.jpeg',
        blurb: 'Trade-fair departures such as the Canton Fair in Guangzhou.',
        safariSlugs: [],
      },
      {
        slug: 'usa',
        title: 'USA',
        tourLabel: '1 tour',
        image: '/deals/usa-world-cup.webp',
        blurb: 'One-off sporting programmes, currently the 2026 World Cup experience.',
        safariSlugs: [],
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
