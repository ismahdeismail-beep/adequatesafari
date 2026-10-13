/**
 * Adequate Safaris — Prisma seed.
 *
 * Idempotent: users upserted by email, safaris upserted by slug, safari dates
 * rebuilt each run. Safe to re-run (`npm run db:seed`).
 *
 * Always-ahead departures: every safari date is computed from "today" at seed
 * time, so the calendar can never hold a past departure. Weekly departures run
 * from next Monday, and themed safaris additionally roll their seasonal windows
 * forward automatically — Christmas/New Year/Easter/Valentine/school-holiday
 * occurrences are derived from the date (see the date engine below) rather than
 * being fixed editions, so nothing ever goes stale between seasons.
 *
 * Credentials for seeded users (unless SEED_PASSWORD is set):
 *   demo@example.com  / CHANGE_ME   (customer)
 *   admin@example.com / CHANGE_ME   (admin)
 *   agent@example.com / CHANGE_ME   (agent)
 *
 * Image paths point at the Joomla template's card set; swap CDN_URL at runtime
 * to serve them from your CDN. Real photography replaces these after content
 * migration (same filenames).
 */

import { PrismaClient, Prisma, Role, Country, Currency, AccommodationType, SafariStyle, Difficulty } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ThemeTag, planDepartures } from './dates';

const prisma = new PrismaClient();

const IMG_BASE = process.env.CDN_URL ?? 'https://www.adequatesafaris.com';
const PASSWORD = process.env.SEED_PASSWORD ?? 'CHANGE_ME';
const card = (slug: string, size = 800) => `${IMG_BASE}/templates/adequate/images/cards/${slug}-${size}.jpg`;

interface SeedSafari {
  slug: string;
  title: string;
  shortDescription: string;
  country: Country;
  description: string;
  durationDays: number;
  durationNights: number;
  minPrice: number;
  maxPrice: number;
  currency: Currency;
  accommodationType: AccommodationType;
  safariStyle: SafariStyle;
  difficulty: Difficulty;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: Prisma.InputJsonValue;
  imageSlug: string;
  isFeatured: boolean;
  sortOrder: number;
  /** Optional recurring themes — drives seasonal departure windows (always future-dated). */
  themes?: ThemeTag[];
}

const SAFARIS: SeedSafari[] = [
  {
    slug: 'masai-mara-big-game',
    title: 'Masai Mara – Big Game Safari',
    shortDescription: 'Big Five game drives in Kenya’s legendary Masai Mara.',
    country: Country.KENYA,
    description:
      'Experience the greatest wildlife spectacle on earth. This three-day Masai Mara safari takes you deep into Kenya’s most famous reserve, where lions, elephants, buffalo, leopard and rhino roam the golden plains. Game drives are led by expert driver-guides in comfortable 4x4 Land Cruisers with pop-up roofs for unmatched viewing.',
    durationDays: 3,
    durationNights: 2,
    minPrice: 1450,
    maxPrice: 1950,
    currency: Currency.USD,
    accommodationType: AccommodationType.LODGE,
    safariStyle: SafariStyle.LODGE_SAFARI,
    difficulty: Difficulty.EASY,
    highlights: ['Big Five game drives', 'Sunset sundowners on the plains', 'Night game drive (optional)', 'Visit a Maasai village'],
    inclusions: ['Full-board accommodation', 'Shared 4x4 game drives', 'Park fees', 'Services of a professional guide', 'Filtered water in vehicle'],
    exclusions: ['International flights', 'Visa fees', 'Travel insurance', 'Drinks & tips', 'Balloon safari (bookable extra)'],
    itinerary: {
      days: [
        { day: 1, title: 'Nairobi → Masai Mara', description: 'Drive via the Great Rift Valley viewpoint, arrive in time for an afternoon game drive.', meals: 'L, D', accommodation: 'Mara lodge' },
        { day: 2, title: 'Full day in the Mara', description: 'Morning and afternoon game drives; picnic lunch in the reserve.', meals: 'B, L, D', accommodation: 'Mara lodge' },
        { day: 3, title: 'Depart', description: 'Early morning drive, then return to Nairobi by road or light aircraft (upgrade).', meals: 'B' },
      ],
    },
    imageSlug: 'masai-mara-lion',
    isFeatured: true,
    sortOrder: 10,
  },
  {
    slug: 'great-migration-special',
    title: 'Great Migration Special',
    shortDescription: 'Time your visit for the river crossings (July–October).',
    country: Country.KENYA,
    description:
      'Over a million wildebeest and zebra thunder across the Mara each year. This four-day special positions you at the river crossings with early-morning departures and extended drives — the best chance to witness the spectacle.',
    durationDays: 4,
    durationNights: 3,
    minPrice: 1950,
    maxPrice: 2650,
    currency: Currency.USD,
    accommodationType: AccommodationType.TENTED_CAMP,
    safariStyle: SafariStyle.LODGE_SAFARI,
    difficulty: Difficulty.MODERATE,
    highlights: ['River-crossing drives (seasonal)', 'Extended morning drives with bush breakfasts', 'Maasai cultural visit', 'Optional hot-air balloon'],
    inclusions: ['Full-board at a migration-front tented camp', '4x4 with pop-up roof', 'Park fees', 'Professional guide', 'Bush breakfasts'],
    exclusions: ['Flights', 'Tips & drinks', 'Laundry', 'Balloon safari'],
    itinerary: {
      days: [
        { day: 1, title: 'Arrive Nairobi → Mara', description: 'Fly or drive to the Mara conservancy; evening game drive.', meals: 'L, D' },
        { day: 2, title: 'River crossings', description: 'Full day manoeuvring the crossing point; packed lunch at the river.', meals: 'B, L, D' },
        { day: 3, title: 'Migration herds', description: 'Follow the herds with the guide’s daily intel; sundowner on the escarpment.', meals: 'B, L, D' },
        { day: 4, title: 'Depart', description: 'Morning drive then departure.', meals: 'B' },
      ],
    },
    imageSlug: 'maasai-mara-wildebeest',
    isFeatured: true,
    sortOrder: 20,
  },
  {
    slug: 'lake-nakuru-rhino',
    title: 'Lake Nakuru – Rhino Safari',
    shortDescription: 'Flamingos and rhino in the Rift Valley.',
    country: Country.KENYA,
    description:
      'A compact safari to Lake Nakuru National Park, famous for its flamingo flocks and rhino sanctuary. Ideal as a pre- or post-Mara add-on from Nairobi.',
    durationDays: 2,
    durationNights: 1,
    minPrice: 620,
    maxPrice: 890,
    currency: Currency.USD,
    accommodationType: AccommodationType.LODGE,
    safariStyle: SafariStyle.SHORT_EXCURSION,
    difficulty: Difficulty.EASY,
    highlights: ['Flamingo & pelican flocks', 'Black and white rhino sanctuary', 'Baboon cliff lookout', 'Lake Nakuru viewpoints'],
    inclusions: ['Half-board lodge accommodation', 'Game drives', 'Park fees', 'Professional guide'],
    exclusions: ['Flights', 'Tips', 'Drinks'],
    itinerary: {
      days: [
        { day: 1, title: 'Nairobi → Lake Nakuru', description: 'Afternoon arrival and first game drive around the lakeshore.', meals: 'L, D' },
        { day: 2, title: 'Morning drive → Nairobi', description: 'Early drive, breakfast, then return to Nairobi.', meals: 'B' },
      ],
    },
    imageSlug: 'lake-nakuru-flamingos',
    isFeatured: false,
    sortOrder: 30,
  },
  {
    slug: 'amboseli-kilimanjaro',
    title: 'Amboseli & Kilimanjaro Safari',
    shortDescription: 'Elephants beneath Africa’s highest peak.',
    country: Country.KENYA,
    description:
      'Amboseli’s swamps attract vast elephant herds with Mount Kilimanjaro towering behind them. A classic photography safari, best at dawn and dusk.',
    durationDays: 3,
    durationNights: 2,
    minPrice: 1280,
    maxPrice: 1720,
    currency: Currency.USD,
    accommodationType: AccommodationType.LODGE,
    safariStyle: SafariStyle.LODGE_SAFARI,
    difficulty: Difficulty.EASY,
    highlights: ['Elephant herds & swamps', 'Kilimanjaro sunrise viewpoints', 'Maasai community visit', 'Observation hill panorama'],
    inclusions: ['Full-board lodge', 'Game drives', 'Park fees', 'Guide & driver', 'Water in vehicle'],
    exclusions: ['Flights', 'Visa', 'Insurance', 'Tips'],
    itinerary: {
      days: [
        { day: 1, title: 'Nairobi → Amboseli', description: 'Drive via Emali, afternoon game drive at the swamps.', meals: 'L, D' },
        { day: 2, title: 'Full day Amboseli', description: 'Dawn drive for Kilimanjaro views; afternoon Maasai village visit.', meals: 'B, L, D' },
        { day: 3, title: 'Depart', description: 'Morning drive then return to Nairobi.', meals: 'B' },
      ],
    },
    imageSlug: 'amboseli-kilimanjaro',
    isFeatured: true,
    sortOrder: 40,
  },
  {
    slug: 'samburu-gerenuk',
    title: 'Samburu – The Gerenuk Safari',
    shortDescription: 'The Samburu Special Five in Kenya’s arid north.',
    country: Country.KENYA,
    description:
      'Samburu’s stark beauty is home to grevy’s zebra, reticulated giraffe, gerenuk, oryx and Somali ostrich — the famous “Special Five”.',
    durationDays: 3,
    durationNights: 2,
    minPrice: 1180,
    maxPrice: 1540,
    currency: Currency.USD,
    accommodationType: AccommodationType.TENTED_CAMP,
    safariStyle: SafariStyle.LODGE_SAFARI,
    difficulty: Difficulty.EASY,
    highlights: ['Samburu Special Five', 'Ewaso Ng’iro river wildlife', 'Samburu cultural visit', 'Night drives (conservancy)'],
    inclusions: ['Full-board tented camp', 'Game drives', 'Park fees', 'Guide'],
    exclusions: ['Flights', 'Tips', 'Drinks'],
    itinerary: {
      days: [
        { day: 1, title: 'Nairobi → Samburu', description: 'Drive north via Nanyuki, crossing the equator; afternoon drive.', meals: 'L, D' },
        { day: 2, title: 'Full day Samburu', description: 'Dawn drive along the river; optional cultural visit.', meals: 'B, L, D' },
        { day: 3, title: 'Depart', description: 'Morning drive then return to Nairobi.', meals: 'B' },
      ],
    },
    imageSlug: 'samburu-gerenuk',
    isFeatured: false,
    sortOrder: 50,
  },
  {
    slug: 'aberdare-nyeri',
    title: 'Aberdares & Nyeri Safari',
    shortDescription: 'Moorland, waterfalls and the Ark’s night game viewing.',
    country: Country.KENYA,
    description:
      'The Aberdare ranges offer dramatic moorlands and the historic Treetops/Ark experience — night viewing platforms over a floodlit waterhole.',
    durationDays: 2,
    durationNights: 1,
    minPrice: 540,
    maxPrice: 760,
    currency: Currency.USD,
    accommodationType: AccommodationType.HOTEL,
    safariStyle: SafariStyle.SHORT_EXCURSION,
    difficulty: Difficulty.EASY,
    highlights: ['Night-viewing waterhole', 'Chania Falls', 'Moorland walks', 'Karuru & Gura waterfalls'],
    inclusions: ['Half-board stay', 'Park fees', 'Night viewing', 'Transfers'],
    exclusions: ['Tips', 'Drinks', 'Laundry'],
    itinerary: {
      days: [
        { day: 1, title: 'Nairobi → Aberdares', description: 'Arrive, afternoon walk, evening at the floodlit viewing deck.', meals: 'L, D' },
        { day: 2, title: 'Game drive → Nairobi', description: 'Morning drive, breakfast, return via Nyeri.', meals: 'B' },
      ],
    },
    imageSlug: 'aberdare-range',
    isFeatured: false,
    sortOrder: 60,
  },
  {
    slug: 'rift-valley-lakes',
    title: 'Great Rift Valley Lakes',
    shortDescription: 'Lake Naivasha, Lake Bogoria and the flamingo shores.',
    country: Country.KENYA,
    description:
      'A weekend under canvas across the Rift Valley lakes: hippos at Naivasha, the flamingo-covered shores of Bogoria and the geothermal geysers of Lake Baringo.',
    durationDays: 3,
    durationNights: 2,
    minPrice: 850,
    maxPrice: 1150,
    currency: Currency.USD,
    accommodationType: AccommodationType.TENTED_CAMP,
    safariStyle: SafariStyle.CAMPING_SAFARI,
    difficulty: Difficulty.MODERATE,
    highlights: ['Lake Bogoria flamingos', 'Geothermal geysers', 'Boat safari (Naivasha)', 'Hippo & fish-eagle spotting'],
    inclusions: ['Full-board tented camp', 'Boat safari', 'Park fees', 'Guide'],
    exclusions: ['Tips', 'Drinks', 'Insurance'],
    itinerary: {
      days: [
        { day: 1, title: 'Nairobi → Lake Naivasha', description: 'Boat safari and lake walk; overnight near the lake.', meals: 'L, D' },
        { day: 2, title: 'Lake Bogoria', description: 'Drive to Bogoria for flamingos and geysers.', meals: 'B, L, D' },
        { day: 3, title: 'Baringo → Nairobi', description: 'Morning birding, then return to Nairobi.', meals: 'B' },
      ],
    },
    imageSlug: 'rift-valley-bogoria',
    isFeatured: false,
    sortOrder: 70,
  },
  {
    slug: 'mount-kenya-sirimon',
    title: 'Mount Kenya – Sirimon Route',
    shortDescription: 'A five-day trek to Point Lenana (4,985 m).',
    country: Country.KENYA,
    description:
      'Trek Africa’s second-highest mountain via the scenic Sirimon route with acclimatisation days and mountain-hut nights, summiting Point Lenana for sunrise.',
    durationDays: 5,
    durationNights: 4,
    minPrice: 980,
    maxPrice: 1390,
    currency: Currency.USD,
    accommodationType: AccommodationType.GUEST_HOUSE,
    safariStyle: SafariStyle.MOUNTAIN_CLIMB,
    difficulty: Difficulty.CHALLENGING,
    highlights: ['Point Lenana summit sunrise', 'Old Moses & Shipton camps', 'Alpine moorlands & glaciers', 'Qualified mountain guides & porters'],
    inclusions: ['Park fees & hut fees', 'Mountain guide & porters', 'Meals on the mountain', 'Hut accommodation'],
    exclusions: ['Trekking gear (rentable)', 'Tips', 'Insurance', 'Nairobi transfers'],
    itinerary: {
      days: [
        { day: 1, title: 'Nairobi → Sirimon Gate → Old Moses', description: 'Drive to the gate, trek to Old Moses Camp (3,300 m).', meals: 'L, D' },
        { day: 2, title: 'Old Moses → Shipton Camp', description: 'Trek over moorlands to Shipton Camp (4,200 m), acclimatisation walk.', meals: 'B, L, D' },
        { day: 3, title: 'Acclimatisation day', description: 'Hike towards Point Lenana for altitude adjustment.', meals: 'B, L, D' },
        { day: 4, title: 'Summit attempt', description: 'Pre-dawn start, summit at sunrise, descend to Old Moses.', meals: 'B, L, D' },
        { day: 5, title: 'Descend → Nairobi', description: 'Trek out to Sirimon Gate and return to Nairobi.', meals: 'B' },
      ],
    },
    imageSlug: 'mount-kenya',
    isFeatured: true,
    sortOrder: 80,
  },
  {
    slug: 'ngorongoro-tarangire',
    title: 'Ngorongoro Crater & Tarangire',
    shortDescription: 'The crater floor and baobab-studded Tarangire.',
    country: Country.TANZANIA,
    description:
      'Descend into the Ngorongoro Crater — a natural amphitheatre teeming with wildlife — then explore Tarangire’s elephant herds beneath ancient baobabs.',
    durationDays: 4,
    durationNights: 3,
    minPrice: 2180,
    maxPrice: 2890,
    currency: Currency.USD,
    accommodationType: AccommodationType.LODGE,
    safariStyle: SafariStyle.LODGE_SAFARI,
    difficulty: Difficulty.MODERATE,
    highlights: ['Ngorongoro Crater floor', 'Tarangire elephants & baobabs', 'Lake Manyara viewpoints', 'Maasai highlands'],
    inclusions: ['Full-board lodges', 'Safari vehicle & guide', 'Park & crater fees', 'Internal transfers'],
    exclusions: ['Flights to Arusha', 'Visa', 'Tips'],
    itinerary: {
      days: [
        { day: 1, title: 'Arusha → Tarangire', description: 'Afternoon game drive in Tarangire National Park.', meals: 'L, D' },
        { day: 2, title: 'Tarangire → Ngorongoro', description: 'Morning drive, then ascend to the crater rim.', meals: 'B, L, D' },
        { day: 3, title: 'Crater floor', description: 'Full day descending into the crater for game viewing.', meals: 'B, L, D' },
        { day: 4, title: 'Return to Arusha', description: 'Morning drive, return to Arusha.', meals: 'B' },
      ],
    },
    imageSlug: 'tanzania-ngorongoro',
    isFeatured: true,
    sortOrder: 90,
  },
  {
    slug: 'zanzibar-beach',
    title: 'Zanzibar Beach Escape',
    shortDescription: 'Dhow sails and white sands off Stone Town.',
    country: Country.TANZANIA,
    description:
      'Wind down after safari on Zanzibar’s powder-white beaches — swim in turquoise water, sail a traditional dhow and explore the alleyways of Stone Town.',
    durationDays: 5,
    durationNights: 4,
    minPrice: 1490,
    maxPrice: 2190,
    currency: Currency.USD,
    accommodationType: AccommodationType.HOTEL,
    safariStyle: SafariStyle.SHORT_EXCURSION,
    difficulty: Difficulty.EASY,
    highlights: ['Nungwi white-sand beaches', 'Traditional dhow sunset sail', 'Stone Town walking tour', 'Spice farm visit'],
    inclusions: ['Beach-front hotel (BB)', 'Airport transfers', 'Stone Town tour', 'Dhow cruise'],
    exclusions: ['Flights from the mainland', 'Marine park fees', 'Tips', 'Water sports'],
    itinerary: {
      days: [
        { day: 1, title: 'Arusha → Zanzibar', description: 'Fly to Zanzibar, transfer to the north coast.', meals: '-' },
        { day: 2, title: 'Beach & dhow', description: 'Free day; sunset dhow cruise.', meals: 'B' },
        { day: 3, title: 'Stone Town', description: 'Walking tour of Stone Town and the spice market.', meals: 'B' },
        { day: 4, title: 'Beach day', description: 'Swim, snorkel or simply relax.', meals: 'B' },
        { day: 5, title: 'Depart', description: 'Transfer to the airport.', meals: 'B' },
      ],
    },
    imageSlug: 'zanzibar-beach',
    isFeatured: false,
    sortOrder: 100,
  },
  // ── Seasonal flagship (auto-rolling windows) ──────────────────────────
  {
    slug: 'christmas-bush-holiday',
    title: 'Christmas in the Bush',
    shortDescription: 'Spend Christmas on the Mara plains — no year needed, it re-rolls every season.',
    country: Country.KENYA,
    description:
      'Trade the tinsel for the treeline: Christmas in the bush means game drives on the golden Mara plains, a festive sundowner on the escarpment and a bush banquet under the stars. Departures are generated around the upcoming Christmas and New Year window, so the offer is always ahead of the calendar.',
    durationDays: 3,
    durationNights: 2,
    minPrice: 690,
    maxPrice: 990,
    currency: Currency.USD,
    accommodationType: AccommodationType.TENTED_CAMP,
    safariStyle: SafariStyle.LODGE_SAFARI,
    difficulty: Difficulty.EASY,
    highlights: ['Festive bush dinner', 'Christmas morning game drive', 'New Year sundowner', 'Small-group tented camp'],
    inclusions: ['Full-board tented camp', 'Shared 4x4 game drives', 'Park fees', 'Festive dinner & sundowner'],
    exclusions: ['Flights', 'Tips', 'Drinks', 'Balloon safari (optional)'],
    itinerary: {
      days: [
        { day: 1, title: 'Nairobi → Mara', description: 'Arrive in time for an afternoon game drive; festive welcome dinner.', meals: 'L, D' },
        { day: 2, title: 'Christmas / New Year day', description: 'Sunrise drive, bush breakfast, afternoon at camp for the festive lunch.', meals: 'B, L, D' },
        { day: 3, title: 'Depart', description: 'Morning drive, then return to Nairobi.', meals: 'B' },
      ],
    },
    imageSlug: 'tented-camp',
    isFeatured: false,
    sortOrder: 105,
    themes: ['CHRISTMAS', 'NEW_YEAR'],
  },
  // ── Kenya coast ────────────────────────────────────────────────────────
  {
    slug: 'diani-beach-escape',
    title: 'Diani Beach Escape',
    shortDescription: 'White sands and turquoise water on Kenya’s south coast.',
    country: Country.KENYA,
    description:
      'Sixty kilometres of white sand fringed by palms and coral reef — Diani is Kenya’s classic beach break. Build sandcastles by day, kite-surf the shallows, and end with seafood on the beachfront. A favourite for Christmas and Easter coast escapes.',
    durationDays: 3,
    durationNights: 2,
    minPrice: 340,
    maxPrice: 560,
    currency: Currency.USD,
    accommodationType: AccommodationType.HOTEL,
    safariStyle: SafariStyle.SHORT_EXCURSION,
    difficulty: Difficulty.EASY,
    highlights: ['Powder-white beach', 'Snorkelling at the reef', 'Dhow sunset cruise', 'Kite-surfing (seasonal)'],
    inclusions: ['Beach-front hotel (BB)', 'Airport transfers (Ukunda)', 'Sunset dhow cruise'],
    exclusions: ['Flights', 'Water sports rentals', 'Tips', 'Laundry'],
    itinerary: {
      days: [
        { day: 1, title: 'Arrive Diani', description: 'Fly or drive to the coast; afternoon on the beach.', meals: 'D' },
        { day: 2, title: 'Beach & reef', description: 'Snorkel at the reef or simply relax; optional dhow sail.', meals: 'B, D' },
        { day: 3, title: 'Depart', description: 'Morning swim, then transfer onward.', meals: 'B' },
      ],
    },
    imageSlug: 'zanzibar-beach',
    isFeatured: false,
    sortOrder: 110,
    themes: ['CHRISTMAS', 'EASTER'],
  },
  // ── Local staycations & self-drive ────────────────────────────────────
  {
    slug: 'nairobi-staycation',
    title: 'Nairobi Staycation',
    shortDescription: 'A two-day city reset with a safari park on the doorstep.',
    country: Country.KENYA,
    description:
      'No flights, no packing stress — just a night in a favourite Nairobi hotel, a lazy pool day and an optional afternoon in Nairobi National Park. Perfect for school-holiday family breaks and long weekends.',
    durationDays: 2,
    durationNights: 1,
    minPrice: 120,
    maxPrice: 240,
    currency: Currency.USD,
    accommodationType: AccommodationType.HOTEL,
    safariStyle: SafariStyle.SHORT_EXCURSION,
    difficulty: Difficulty.EASY,
    highlights: ['City-centre or Karen hotel', 'Pool & spa time', 'Nairobi National Park option', 'Giraffe Centre add-on'],
    inclusions: ['One night’s stay (BB)', 'Park entry option at cost'],
    exclusions: ['Lunches & dinners', 'Transport', 'Tips'],
    itinerary: {
      days: [
        { day: 1, title: 'Check-in & unwind', description: 'Afternoon pool time; optional late game drive in Nairobi National Park.', meals: 'D' },
        { day: 2, title: 'Leisure morning', description: 'Breakfast, optional Giraffe Centre, check out.', meals: 'B' },
      ],
    },
    imageSlug: 'accommodation-lodge',
    isFeatured: false,
    sortOrder: 150,
    themes: ['SCHOOL_HOLIDAY'],
  },
  {
    slug: 'great-lakes-staycation',
    title: 'Great Lakes Staycation',
    shortDescription: 'A weekend of hippos, birds and lakeside chill in the Rift Valley.',
    country: Country.KENYA,
    description:
      'An hour-and-a-half from Nairobi, the Rift Valley lakes do the deep-clean: boat safari past hippos on Naivasha, sundowners at the lakehouse and cycling among zebra at Crescent Island — guilt-free and fuel-light.',
    durationDays: 2,
    durationNights: 1,
    minPrice: 180,
    maxPrice: 320,
    currency: Currency.USD,
    accommodationType: AccommodationType.TENTED_CAMP,
    safariStyle: SafariStyle.SHORT_EXCURSION,
    difficulty: Difficulty.EASY,
    highlights: ['Lake Naivasha boat safari', 'Crescent Island walking safari', 'Hippo & fish-eagle viewing', 'Lakeside sundowner'],
    inclusions: ['One night lakeside (HB)', 'Boat safari', 'Crescent Island entry'],
    exclusions: ['Transport from Nairobi', 'Tips', 'Drinks'],
    itinerary: {
      days: [
        { day: 1, title: 'Nairobi → Naivasha', description: 'Afternoon boat safari and lakeside sundowner.', meals: 'D' },
        { day: 2, title: 'Crescent Island → Nairobi', description: 'Morning walking safari, brunch, return.', meals: 'B' },
      ],
    },
    imageSlug: 'tented-camp',
    isFeatured: false,
    sortOrder: 160,
  },
  // ── Group joining / shared departures ─────────────────────────────────
  {
    slug: 'masai-mara-group-joining',
    title: 'Masai Mara Group-Joining Safari',
    shortDescription: 'Join a shared departure to the Mara — set Saturday dates, low cost.',
    country: Country.KENYA,
    description:
      'A budget-friendly way into the Mara: join a guaranteed shared departure with fellow travellers, share the vehicle and split the cost. Ideal for solo travellers and students — fixed Saturday departures keep it simple.',
    durationDays: 3,
    durationNights: 2,
    minPrice: 620,
    maxPrice: 890,
    currency: Currency.USD,
    accommodationType: AccommodationType.LODGE,
    safariStyle: SafariStyle.LODGE_SAFARI,
    difficulty: Difficulty.EASY,
    highlights: ['Guaranteed shared departures', 'Big Five game drives', 'Budget-friendly group pricing', 'Easter & school-break extras'],
    inclusions: ['Full-board lodge', 'Shared 4x4 game drives', 'Park fees', 'Guide'],
    exclusions: ['Flights', 'Tips', 'Drinks', 'Balloon safari (optional)'],
    itinerary: {
      days: [
        { day: 1, title: 'Nairobi → Mara (Sat)', description: 'Group meet-up in Nairobi, drive to the Mara, afternoon game drive.', meals: 'L, D' },
        { day: 2, title: 'Full day in the Mara', description: 'Sunrise and afternoon drives, picnic lunch in the reserve.', meals: 'B, L, D' },
        { day: 3, title: 'Depart', description: 'Morning drive, return to Nairobi.', meals: 'B' },
      ],
    },
    imageSlug: 'masai-mara-lion',
    isFeatured: false,
    sortOrder: 170,
    themes: ['GROUP_DEPARTURE', 'EASTER'],
  },
  // ── Tanzania ───────────────────────────────────────────────────────────
  {
    slug: 'serengeti-classic-safari',
    title: 'Serengeti Classic Safari',
    shortDescription: 'The classic northern circuit: Serengeti plains and the Ngorongoro crater.',
    country: Country.TANZANIA,
    description:
      'The definitive Tanzania itinerary — endless Serengeti plains teeming with wildebeest and lion, the wildlife-dense Ngorongoro crater floor, and a final morning at the rim. A photographer’s dream and a first-timer’s perfect Tanzania safari.',
    durationDays: 6,
    durationNights: 5,
    minPrice: 2420,
    maxPrice: 3290,
    currency: Currency.USD,
    accommodationType: AccommodationType.LODGE,
    safariStyle: SafariStyle.LODGE_SAFARI,
    difficulty: Difficulty.MODERATE,
    highlights: ['Serengeti plains game viewing', 'Ngorongoro crater descent', 'Migration herds (seasonal)', 'Olakira & Seronera camps'],
    inclusions: ['Full-board lodges/camps', 'Safari vehicle & guide', 'Park & crater fees', 'Internal transfers'],
    exclusions: ['Flights to Arusha/Kilimanjaro', 'Visa', 'Tips', 'Travel insurance'],
    itinerary: {
      days: [
        { day: 1, title: 'Arusha → Serengeti', description: 'Fly or drive into the park; afternoon game drive.', meals: 'L, D' },
        { day: 2, title: 'Central Serengeti', description: 'Full day on the Seronera plains.', meals: 'B, L, D' },
        { day: 3, title: 'South & migration herds', description: 'Follow the herds (seasonal) with a bush lunch.', meals: 'B, L, D' },
        { day: 4, title: 'Serengeti → Ngorongoro', description: 'Morning drive, ascend to the crater rim.', meals: 'B, L, D' },
        { day: 5, title: 'Crater floor', description: 'Full day descending into the crater.', meals: 'B, L, D' },
        { day: 6, title: 'Return to Arusha', description: 'Morning rim game drive, return to Arusha.', meals: 'B' },
      ],
    },
    imageSlug: 'maasai-mara-wildebeest',
    isFeatured: false,
    sortOrder: 120,
  },
  {
    slug: 'kilimanjaro-lemosho-climb',
    title: 'Kilimanjaro – Lemosho Route',
    shortDescription: 'Eight days on Africa’s roof via the wild, scenic Lemosho route.',
    country: Country.TANZANIA,
    description:
      'The Lemosho route approaches Kilimanjaro from the west — longer, wilder and with the best acclimatisation profile of the classic trails. Summit Uhuru Peak (5,895 m) at sunrise with a fully supported crew of guides and porters.',
    durationDays: 8,
    durationNights: 7,
    minPrice: 2480,
    maxPrice: 3420,
    currency: Currency.USD,
    accommodationType: AccommodationType.TENTED_CAMP,
    safariStyle: SafariStyle.MOUNTAIN_CLIMB,
    difficulty: Difficulty.CHALLENGING,
    highlights: ['Uhuru Peak summit (5,895 m)', 'Wild western approach', 'Stella Point sunrise', 'Qualified guides & porters'],
    inclusions: ['Park & camping fees', 'Tents & mountain meals', 'Guide, cook & porters', 'Oxygen & pulse-oximeter'],
    exclusions: ['Flights', 'Tips & gratuities', 'Rental gear', 'Insurance'],
    itinerary: {
      days: [
        { day: 1, title: 'Londorossi Gate → Mti Mkubwa', description: 'Drive to the gate, trek through rainforest to camp.', meals: 'L, D' },
        { day: 2, title: 'Shira Plateau', description: 'Cross moorland to Shira 1 Camp (3,610 m).', meals: 'B, L, D' },
        { day: 3, title: 'Shira → Barranco', description: 'Traverse the plateau and descend into the Barranco Valley.', meals: 'B, L, D' },
        { day: 4, title: 'Barranco Wall', description: 'Scramble the wall to Karanga Camp for acclimatisation.', meals: 'B, L, D' },
        { day: 5, title: 'Karanga → Barafu', description: 'Short day to the base camp below the summit cone.', meals: 'B, L, D' },
        { day: 6, title: 'Summit night', description: 'Pre-midnight start, summit at dawn, descend to Mweka Camp.', meals: 'B, L, D' },
        { day: 7, title: 'Mweka → Millennium', description: 'Descend through rainforest into the foothills.', meals: 'B, L, D' },
        { day: 8, title: 'Exit & transfer', description: 'Certificate ceremony, transfer to Moshi/Arusha.', meals: 'B' },
      ],
    },
    imageSlug: 'mount-kenya-climbers',
    isFeatured: false,
    sortOrder: 130,
  },
  // ── Uganda ─────────────────────────────────────────────────────────────
  {
    slug: 'bwindi-gorilla-trekking',
    title: 'Bwindi Gorilla Trekking',
    shortDescription: 'An hour with the mountain gorillas of Bwindi Impenetrable Forest.',
    country: Country.UGANDA,
    description:
      'Trek into the misty heights of Bwindi Impenetrable Forest for the encounter of a lifetime — a guided hour with a habituated mountain gorilla family. Entry-level Uganda safari with permits, tracking guides and forest lodge stays included.',
    durationDays: 3,
    durationNights: 2,
    minPrice: 1650,
    maxPrice: 2100,
    currency: Currency.USD,
    accommodationType: AccommodationType.LODGE,
    safariStyle: SafariStyle.WALKING_TREKKING,
    difficulty: Difficulty.MODERATE,
    highlights: ['Gorilla permit (included)', 'Habituated mountain gorilla family', 'Bwindi forest walk', 'Batwa cultural experience (optional)'],
    inclusions: ['Gorilla permit', 'Full-board forest lodge', 'Trekking guide & porter', 'Transfers (Kihihi/Entebbe option)'],
    exclusions: ['Flights to Entebbe', 'Visa', 'Tips', 'Insurance'],
    itinerary: {
      days: [
        { day: 1, title: 'Arrive Bwindi', description: 'Fly or drive to Bwindi; afternoon village walk.', meals: 'L, D' },
        { day: 2, title: 'Gorilla trek', description: 'Early briefing, trek to your assigned family, one hour face-to-face.', meals: 'B, L, D' },
        { day: 3, title: 'Depart', description: 'Morning forest walk, then transfer out.', meals: 'B' },
      ],
    },
    imageSlug: 'bwindi-gorilla',
    isFeatured: false,
    sortOrder: 140,
  },
  // ── Islands — Indian Ocean & Bali ──────────────────────────────────────
  {
    slug: 'mauritius-island-escape',
    title: 'Mauritius Island Escape',
    shortDescription: 'Lagoons, seven-coloured earth and Creole hospitality.',
    country: Country.MAURITIUS,
    description:
      'A pint-sized island with a big heart: turquoise lagoons in the north, dramatic cliffs at Le Morne, street stalls in Port Louis and the surreal seven-coloured earths of Chamarel. Beach-plus-culture in the Indian Ocean’s friendliest corner.',
    durationDays: 5,
    durationNights: 4,
    minPrice: 1890,
    maxPrice: 2690,
    currency: Currency.USD,
    accommodationType: AccommodationType.HOTEL,
    safariStyle: SafariStyle.SHORT_EXCURSION,
    difficulty: Difficulty.EASY,
    highlights: ['North-coast lagoons', 'Chamarel seven-coloured earth', 'Port Louis market walk', 'Catamaran day trip'],
    inclusions: ['Beach-front hotel (BB)', 'Airport transfers', 'Chamarel excursion', 'Catamaran trip'],
    exclusions: ['International flights', 'Visa', 'Tips', 'Water sports'],
    itinerary: {
      days: [
        { day: 1, title: 'Arrive Mauritius', description: 'Transfer to the north coast; evening beach walk.', meals: 'D' },
        { day: 2, title: 'Lagoons & catamaran', description: 'Full-day catamaran cruise to the island’s lagoons.', meals: 'B, L' },
        { day: 3, title: 'Chamarel & Port Louis', description: 'Seven-coloured earths, waterfall lookout and market lunch.', meals: 'B' },
        { day: 4, title: 'Beach day', description: 'Free day — swim, snorkel or spa.', meals: 'B' },
        { day: 5, title: 'Depart', description: 'Transfer to the airport.', meals: 'B' },
      ],
    },
    imageSlug: 'zanzibar-beach',
    isFeatured: false,
    sortOrder: 180,
  },
  {
    slug: 'maldives-island-escape',
    title: 'Maldives Island Escape',
    shortDescription: 'Overwater villas and reef snorkelling in a ring of atolls.',
    country: Country.MALDIVES,
    description:
      'The quintessential barefoot honeymoon: seaplane across the atolls, step off your overwater villa straight into the reef and let the house reef’s turtles and rays do the entertaining.',
    durationDays: 5,
    durationNights: 4,
    minPrice: 2390,
    maxPrice: 3390,
    currency: Currency.USD,
    accommodationType: AccommodationType.HOTEL,
    safariStyle: SafariStyle.SHORT_EXCURSION,
    difficulty: Difficulty.EASY,
    highlights: ['Overwater villa stay', 'House-reef snorkelling', 'Seaplane transfers', 'Private sandbank picnic'],
    inclusions: ['Overwater villa (BB)', 'Seaplane or speedboat transfers', 'Snorkelling gear', 'Sandbank picnic'],
    exclusions: ['International flights', 'Visa', 'Tips', 'Scuba packages'],
    itinerary: {
      days: [
        { day: 1, title: 'Arrive & transfer', description: 'Seaplane to your island resort.', meals: 'D' },
        { day: 2, title: 'Reef day', description: 'Snorkel the house reef; sunset fishing (optional).', meals: 'B, D' },
        { day: 3, title: 'Sandbank picnic', description: 'Private sandbank picnic; beach time.', meals: 'B, L, D' },
        { day: 4, title: 'Free day', description: 'Spa, kayak or do nothing at all.', meals: 'B, D' },
        { day: 5, title: 'Depart', description: 'Seaplane back to Male.', meals: 'B' },
      ],
    },
    imageSlug: 'zanzibar-beach',
    isFeatured: false,
    sortOrder: 190,
  },
  {
    slug: 'seychelles-island-escape',
    title: 'Seychelles Island Escape',
    shortDescription: 'Granite boulders, giant tortoises and beaches of the year.',
    country: Country.SEYCHELLES,
    description:
      'Seychelles trades the long flat beach for drama: granite boulders, a jungle interior and an island tour that takes in Victoria, a giant-tortoise sanctuary and Anse Lazio — routinely ranked among the world’s best beaches.',
    durationDays: 5,
    durationNights: 4,
    minPrice: 2150,
    maxPrice: 3050,
    currency: Currency.USD,
    accommodationType: AccommodationType.HOTEL,
    safariStyle: SafariStyle.SHORT_EXCURSION,
    difficulty: Difficulty.EASY,
    highlights: ['Anse Lazio beach', 'Giant tortoise sanctuary', 'Victoria city tour', 'Island boat excursion'],
    inclusions: ['Beach-front hotel (BB)', 'Airport transfers', 'La Digue & Praslin boat day', 'Island tours'],
    exclusions: ['International flights', 'Visa', 'Tips', 'Water sports'],
    itinerary: {
      days: [
        { day: 1, title: 'Arrive Mahé', description: 'Transfer to Beau Vallon beach.', meals: 'D' },
        { day: 2, title: 'Victoria & tortoises', description: 'City tour and giant-tortoise sanctuary.', meals: 'B' },
        { day: 3, title: 'Praslin & La Digue', description: 'Day boat to Praslin; Anse Lazio afternoon.', meals: 'B, L' },
        { day: 4, title: 'Beach day', description: 'Free day at Beau Vallon.', meals: 'B' },
        { day: 5, title: 'Depart', description: 'Transfer to the airport.', meals: 'B' },
      ],
    },
    imageSlug: 'zanzibar-beach',
    isFeatured: false,
    sortOrder: 200,
  },
  {
    slug: 'bali-island-escape',
    title: 'Bali Island Escape',
    shortDescription: 'Temples, rice terraces and surf on the Island of the Gods.',
    country: Country.INDONESIA,
    description:
      'Bali in five days: a Ubud rice-terrace morning, the cliff temple of Uluwatu at sunset, a surf lesson on Seminyak’s beach and enough bintang and babi guling to feel properly on holiday.',
    durationDays: 5,
    durationNights: 4,
    minPrice: 1490,
    maxPrice: 2190,
    currency: Currency.USD,
    accommodationType: AccommodationType.HOTEL,
    safariStyle: SafariStyle.CULTURAL,
    difficulty: Difficulty.EASY,
    highlights: ['Ubud rice terraces', 'Uluwatu cliff temple', 'Seminyak beach & surf', 'Tirta Empul water temple'],
    inclusions: ['Hotel stays (BB)', 'Airport transfers', 'Ubud & temple tour', 'Guided temple visits'],
    exclusions: ['International flights', 'Visa on arrival', 'Tips', 'Surf lessons'],
    itinerary: {
      days: [
        { day: 1, title: 'Arrive Bali', description: 'Transfer to Seminyak; beachfront evening.', meals: 'D' },
        { day: 2, title: 'Ubud & terraces', description: 'Tegallalang terraces, monkey forest, Ubud palace.', meals: 'B' },
        { day: 3, title: 'Uluwatu sunset', description: 'Cliff temple and kecak fire dance at dusk.', meals: 'B' },
        { day: 4, title: 'Beach & temples', description: 'Morning surf or pool; Tirta Empul temple.', meals: 'B' },
        { day: 5, title: 'Depart', description: 'Transfer to the airport.', meals: 'B' },
      ],
    },
    imageSlug: 'zanzibar-beach',
    isFeatured: false,
    sortOrder: 210,
  },
  // ── International — city & country tours ───────────────────────────────
  {
    slug: 'dubai-city-escape',
    title: 'Dubai City Escape',
    shortDescription: 'Skyscrapers, souks and desert dunes in the UAE.',
    country: Country.UNITED_ARAB_EMIRATES,
    description:
      'A five-day Dubai sampler: Burj Khalifa viewpoints, the gold and spice souks, a dune-bash and barbecue in the desert, and enough mall-time to please everyone in the group. Christmas and school-break departures roll forward automatically.',
    durationDays: 5,
    durationNights: 4,
    minPrice: 1590,
    maxPrice: 2290,
    currency: Currency.USD,
    accommodationType: AccommodationType.HOTEL,
    safariStyle: SafariStyle.CULTURAL,
    difficulty: Difficulty.EASY,
    highlights: ['Burj Khalifa observation deck', 'Gold & spice souks', 'Desert safari & BBQ', 'Dubai Marina dhow dinner'],
    inclusions: ['Hotel (BB)', 'Airport transfers', 'City tour', 'Desert safari evening'],
    exclusions: ['International flights', 'Visa', 'Tips', 'Optional attractions'],
    itinerary: {
      days: [
        { day: 1, title: 'Arrive Dubai', description: 'Transfer, evening at Dubai Marina.', meals: 'D' },
        { day: 2, title: 'City tour & Burj', description: 'Downtown tour, Burj Khalifa deck, fountain show.', meals: 'B' },
        { day: 3, title: 'Souks & creek', description: 'Gold souk, spice souk, abra ride across the creek.', meals: 'B' },
        { day: 4, title: 'Desert safari', description: 'Dune drive, camel ride, BBQ and shows.', meals: 'B, D' },
        { day: 5, title: 'Depart', description: 'Free morning, transfer to the airport.', meals: 'B' },
      ],
    },
    imageSlug: 'lodge-pool',
    isFeatured: false,
    sortOrder: 220,
  },
  {
    slug: 'europe-epic-tour',
    title: 'Europe Epic Tour',
    shortDescription: 'Seven days across Paris, the Alps and Italy’s northern lakes.',
    country: Country.EUROPE,
    description:
      'A whistle-stop classic: the Eiffel Tower and Montmartre, alpine passes and lakes in Switzerland and Italy, and fair Verona en route to Venice. Fast-paced, hotel-based and perfect for first-time Europe.',
    durationDays: 7,
    durationNights: 6,
    minPrice: 3290,
    maxPrice: 4590,
    currency: Currency.USD,
    accommodationType: AccommodationType.HOTEL,
    safariStyle: SafariStyle.CULTURAL,
    difficulty: Difficulty.MODERATE,
    highlights: ['Paris — Eiffel & Montmartre', 'Swiss Alps scenic rail', 'Lake Como', 'Venice & Verona'],
    inclusions: ['Hotels (BB)', 'Modern coach & driver', 'English-speaking tour leader', 'Airport transfers'],
    exclusions: ['International flights', 'Visa/Schengen', 'Lunches & dinners', 'Tips'],
    itinerary: {
      days: [
        { day: 1, title: 'Arrive Paris', description: 'Check-in, evening Seine cruise.', meals: 'D' },
        { day: 2, title: 'Paris city tour', description: 'Eiffel Tower, Montmartre, Louvre (exterior).', meals: 'B' },
        { day: 3, title: 'Paris → Swiss Alps', description: 'Scenic coach day via Lake Geneva to Interlaken.', meals: 'B, D' },
        { day: 4, title: 'Jungfrau region', description: 'Alpine rail day on the Bernese Oberland.', meals: 'B' },
        { day: 5, title: 'Alps → Lake Como', description: 'Cross into Italy; lakeside afternoon.', meals: 'B, D' },
        { day: 6, title: 'Como → Venice', description: 'Via Verona for a quick arena visit.', meals: 'B' },
        { day: 7, title: 'Venice & depart', description: 'Morning St Mark’s visit, transfer out.', meals: 'B' },
      ],
    },
    imageSlug: 'lodge-pool',
    isFeatured: false,
    sortOrder: 230,
  },
  {
    slug: 'turkey-istanbul-cappadocia',
    title: 'Turkey – Istanbul & Cappadocia',
    shortDescription: 'Hagia Sophia to hot-air balloons over the fairy chimneys.',
    country: Country.TURKEY,
    description:
      'Two Turkey icons in one week: the bazaars, mosques and straits of Istanbul, then Cappadocia’s lunar valleys with an optional sunrise balloon flight over the fairy chimneys.',
    durationDays: 8,
    durationNights: 7,
    minPrice: 2190,
    maxPrice: 2990,
    currency: Currency.USD,
    accommodationType: AccommodationType.HOTEL,
    safariStyle: SafariStyle.CULTURAL,
    difficulty: Difficulty.MODERATE,
    highlights: ['Hagia Sophia & Blue Mosque', 'Grand Bazaar', 'Cappadocia hot-air balloon (optional)', 'Göreme Open-Air Museum'],
    inclusions: ['Hotels (BB)', 'Domestic flight to Cappadocia', 'Guided tours', 'Airport transfers'],
    exclusions: ['International flights', 'Visa', 'Lunches & dinners', 'Balloon ride (optional)'],
    itinerary: {
      days: [
        { day: 1, title: 'Arrive Istanbul', description: 'Transfer, evening Bosphorus cruise.', meals: 'D' },
        { day: 2, title: 'Istanbul old city', description: 'Hagia Sophia, Blue Mosque, Grand Bazaar.', meals: 'B' },
        { day: 3, title: 'Fly to Cappadocia', description: 'Morning flight; Göreme Open-Air Museum.', meals: 'B' },
        { day: 4, title: 'Balloon & valleys', description: 'Optional sunrise balloon; Red Valley hike.', meals: 'B' },
        { day: 5, title: 'Underground city', description: 'Kaymakli underground city, pottery town Avanos.', meals: 'B' },
        { day: 6, title: 'Return to Istanbul', description: 'Fly back; free afternoon.', meals: 'B' },
        { day: 7, title: 'Spice bazaar & palaces', description: 'Topkapi Palace, Spice Bazaar, Galata.', meals: 'B' },
        { day: 8, title: 'Depart', description: 'Transfer to the airport.', meals: 'B' },
      ],
    },
    imageSlug: 'lodge-pool',
    isFeatured: false,
    sortOrder: 240,
  },
  {
    slug: 'thailand-bangkok-pattaya',
    title: 'Thailand – Bangkok & Pattaya',
    shortDescription: 'Temples, street food and Gulf-of-Thailand beach time.',
    country: Country.THAILAND,
    description:
      'The classic first-timer combo: the Grand Palace and canals of Bangkok, then the Gulf coast at Pattaya for beach days and island hops to Koh Larn’s coral waters.',
    durationDays: 5,
    durationNights: 4,
    minPrice: 1790,
    maxPrice: 2590,
    currency: Currency.USD,
    accommodationType: AccommodationType.HOTEL,
    safariStyle: SafariStyle.CULTURAL,
    difficulty: Difficulty.EASY,
    highlights: ['Grand Palace & Wat Pho', 'Bangkok canals (khlong) tour', 'Pattaya beach', 'Koh Larn island day'],
    inclusions: ['Hotels (BB)', 'Airport transfers', 'Guided Bangkok tour', 'Koh Larn boat trip'],
    exclusions: ['International flights', 'Visa exemption/on arrival', 'Lunches & dinners', 'Tips'],
    itinerary: {
      days: [
        { day: 1, title: 'Arrive Bangkok', description: 'Transfer; evening street-food walk.', meals: 'D' },
        { day: 2, title: 'Grand Palace & canals', description: 'Palace, Wat Pho, khlong boat tour.', meals: 'B' },
        { day: 3, title: 'Bangkok → Pattaya', description: 'Coach to the coast; beach afternoon.', meals: 'B' },
        { day: 4, title: 'Koh Larn island', description: 'Ferry to the island; snorkel and beach time.', meals: 'B, L' },
        { day: 5, title: 'Depart', description: 'Return to Bangkok airport.', meals: 'B' },
      ],
    },
    imageSlug: 'zanzibar-beach',
    isFeatured: false,
    sortOrder: 250,
  },
  {
    slug: 'kuala-lumpur-singapore',
    title: 'Kuala Lumpur & Singapore',
    shortDescription: 'Twin towers, hawker food and a strait-crossing finale.',
    country: Country.MALAYSIA,
    description:
      'Two gleaming city-states, one easy week: Petronas Towers and Batu Caves in Kuala Lumpur, then the high-speed rail south to Singapore for Gardens by the Bay, Sentosa and a final night on Marina Bay.',
    durationDays: 8,
    durationNights: 7,
    minPrice: 1990,
    maxPrice: 2890,
    currency: Currency.USD,
    accommodationType: AccommodationType.HOTEL,
    safariStyle: SafariStyle.CULTURAL,
    difficulty: Difficulty.EASY,
    highlights: ['Petronas Towers', 'Batu Caves', 'Singapore Gardens by the Bay', 'Sentosa & Marina Bay'],
    inclusions: ['Hotels (BB)', 'Airport transfers', 'KL & Singapore city tours', 'KL→Singapore transfer'],
    exclusions: ['International flights', 'Visa', 'Lunches & dinners', 'Tips'],
    itinerary: {
      days: [
        { day: 1, title: 'Arrive Kuala Lumpur', description: 'Transfer; evening Petronas lights.', meals: 'D' },
        { day: 2, title: 'KL city tour', description: 'Petronas, Batu Caves, Chinatown.', meals: 'B' },
        { day: 3, title: 'KL free day', description: 'Shopping or Genting day trip (optional).', meals: 'B' },
        { day: 4, title: 'KL → Singapore', description: 'HSR or coach across the strait.', meals: 'B' },
        { day: 5, title: 'Singapore city tour', description: 'Marina Bay, Merlion, Chinatown & Little India.', meals: 'B' },
        { day: 6, title: 'Sentosa day', description: 'Universal Studios or beaches and cable car.', meals: 'B' },
        { day: 7, title: 'Gardens by the Bay', description: 'Supertree Grove, flower dome, light show.', meals: 'B' },
        { day: 8, title: 'Depart', description: 'Transfer to Singapore airport.', meals: 'B' },
      ],
    },
    imageSlug: 'zanzibar-beach',
    isFeatured: false,
    sortOrder: 260,
  },
  {
    slug: 'cape-town-family-vacation',
    title: 'Cape Town Family Vacation',
    shortDescription: 'Table Mountain, penguins and the Cape Winelands — family-sized.',
    country: Country.SOUTH_AFRICA,
    description:
      'Cape Town does family well: the cable car up Table Mountain, boulders penguins at Simon’s Town, whales and wine in the Cape Winelands, and beaches that end with sundowners at the V&A Waterfront.',
    durationDays: 5,
    durationNights: 4,
    minPrice: 2290,
    maxPrice: 3190,
    currency: Currency.USD,
    accommodationType: AccommodationType.HOTEL,
    safariStyle: SafariStyle.CULTURAL,
    difficulty: Difficulty.EASY,
    highlights: ['Table Mountain cableway', 'Simon’s Town penguins', 'Cape Winelands tasting', 'Cape Peninsula drive'],
    inclusions: ['Hotels (BB)', 'Airport transfers', 'City & Peninsula tours', 'Table Mountain tickets'],
    exclusions: ['International flights', 'Visa', 'Lunches & dinners', 'Tips'],
    itinerary: {
      days: [
        { day: 1, title: 'Arrive Cape Town', description: 'Transfer; V&A Waterfront evening.', meals: 'D' },
        { day: 2, title: 'Table Mountain & city', description: 'Cable car, Bo-Kaap, Company’s Garden.', meals: 'B' },
        { day: 3, title: 'Cape Peninsula', description: 'Chapman’s Peak, Cape of Good Hope, penguins.', meals: 'B, L' },
        { day: 4, title: 'Winelands day', description: 'Stellenbosch & Franschhoek tasting lunch.', meals: 'B' },
        { day: 5, title: 'Depart', description: 'Free morning; transfer to the airport.', meals: 'B' },
      ],
    },
    imageSlug: 'zanzibar-beach',
    isFeatured: false,
    sortOrder: 270,
  },
  {
    slug: 'jordan-timeless-treasures',
    title: 'Jordan – Timeless Treasures',
    shortDescription: 'Petra’s rose city, Wadi Rum and the Dead Sea in one week.',
    country: Country.JORDAN,
    description:
      'Walk the Siq to the Treasury at dawn, camp under the stars in Wadi Rum and float in the Dead Sea — Jordan packs eight days with the ancient world’s greatest hits, all with a local guide.',
    durationDays: 8,
    durationNights: 7,
    minPrice: 2390,
    maxPrice: 3190,
    currency: Currency.USD,
    accommodationType: AccommodationType.HOTEL,
    safariStyle: SafariStyle.CULTURAL,
    difficulty: Difficulty.MODERATE,
    highlights: ['Petra at sunrise', 'Wadi Rum desert camp', 'Dead Sea float', 'Jerash & Amman citadel'],
    inclusions: ['Hotels & desert camp', 'Guided tours', 'Petra & Wadi Rum entry', 'Airport transfers'],
    exclusions: ['International flights', 'Visa (Jordan Pass)', 'Lunches & dinners', 'Tips'],
    itinerary: {
      days: [
        { day: 1, title: 'Arrive Amman', description: 'Transfer; Amman citadel walk.', meals: 'D' },
        { day: 2, title: 'Jerash & Ajloun', description: 'Roman ruins and castle day trip.', meals: 'B' },
        { day: 3, title: 'Dead Sea', description: 'Float and spa day at the Dead Sea.', meals: 'B' },
        { day: 4, title: 'Madaba → Petra', description: 'Mosaic map, Mount Nebo, drive to Petra.', meals: 'B, D' },
        { day: 5, title: 'Petra full day', description: 'Siq, Treasury, monastery trail.', meals: 'B' },
        { day: 6, title: 'Wadi Rum', description: 'Jeep tour and desert-camp night.', meals: 'B, D' },
        { day: 7, title: 'Wadi Rum → Amman', description: 'Morning desert drive, return via Aqaba coast.', meals: 'B' },
        { day: 8, title: 'Depart', description: 'Transfer to the airport.', meals: 'B' },
      ],
    },
    imageSlug: 'lodge-pool',
    isFeatured: false,
    sortOrder: 280,
  },
  {
    slug: 'egypt-nile-cruise',
    title: 'Egypt Nile Cruise',
    shortDescription: 'Pyramids, temples and a slow sail between Luxor and Aswan.',
    country: Country.EGYPT,
    description:
      'Giza’s pyramids at sunrise, the Sphinx, then a four-night Nile cruise between Luxor and Aswan — Karnak and Valley of the Kings, Edfu and Kom Ombo, and Philae’s island temple — sailing gently through history.',
    durationDays: 8,
    durationNights: 7,
    minPrice: 2190,
    maxPrice: 3090,
    currency: Currency.USD,
    accommodationType: AccommodationType.HOTEL,
    safariStyle: SafariStyle.CULTURAL,
    difficulty: Difficulty.MODERATE,
    highlights: ['Pyramids of Giza & Sphinx', 'Valley of the Kings', 'Nile cruise (Luxor–Aswan)', 'Philae & Abu Simbel options'],
    inclusions: ['Hotels & Nile cruise (FB)', 'Guided tours with egyptologist', 'Site entry fees', 'Airport transfers'],
    exclusions: ['International flights', 'Visa', 'Tips', 'Abu Simbel optional excursion'],
    itinerary: {
      days: [
        { day: 1, title: 'Arrive Cairo', description: 'Transfer; evening pyramids sound & light.', meals: 'D' },
        { day: 2, title: 'Giza plateau', description: 'Pyramids, Sphinx, Solar Boat museum.', meals: 'B' },
        { day: 3, title: 'Fly to Luxor', description: 'Karnak temple, board the cruise ship.', meals: 'B, D' },
        { day: 4, title: 'Valley of the Kings', description: 'Tombs, Hatshepsut temple, Colossi of Memnon.', meals: 'B, L, D' },
        { day: 5, title: 'Edfu & Kom Ombo', description: 'Sailing day with temple visits en route.', meals: 'B, L, D' },
        { day: 6, title: 'Aswan', description: 'Philae temple, Aswan High Dam, felucca sail.', meals: 'B, L, D' },
        { day: 7, title: 'Fly back to Cairo', description: 'Morning at leisure; Cairo evening.', meals: 'B' },
        { day: 8, title: 'Depart', description: 'Egyptian Museum visit (if time), airport.', meals: 'B' },
      ],
    },
    imageSlug: 'zanzibar-beach',
    isFeatured: false,
    sortOrder: 290,
  },
  // ── Corporate ──────────────────────────────────────────────────────────
  {
    slug: 'corporate-team-retreat',
    title: 'Corporate Team Retreat',
    shortDescription: 'Strategy, bonding and bush sundowners — a two-day team reset.',
    country: Country.KENYA,
    description:
      'Get the team out of the office and into the bush: a two-day retreat combining a working session with game drives, team activities and a fire-side strategy dinner at a lodge within reach of Nairobi.',
    durationDays: 2,
    durationNights: 1,
    minPrice: 250,
    maxPrice: 450,
    currency: Currency.USD,
    accommodationType: AccommodationType.LODGE,
    safariStyle: SafariStyle.SHORT_EXCURSION,
    difficulty: Difficulty.EASY,
    highlights: ['Meeting room & AV on site', 'Team game drive', 'Fire-side strategy dinner', 'Group transport from Nairobi'],
    inclusions: ['Lodge stay (FB)', 'Meeting facilities', 'Game drive', 'Group transfers'],
    exclusions: ['Flights', 'Alcohol', 'Individual spa treatments'],
    itinerary: {
      days: [
        { day: 1, title: 'Transfer & strategy', description: 'Midday arrival, afternoon workshop, evening game drive and dinner.', meals: 'L, D' },
        { day: 2, title: 'Wrap-up & return', description: 'Morning session, brunch, return to Nairobi.', meals: 'B' },
      ],
    },
    imageSlug: 'lodge-pool',
    isFeatured: false,
    sortOrder: 300,
  },
];


async function main(): Promise<void> {
  const hash = await bcrypt.hash(PASSWORD, 10);

  // ── Users ─────────────────────────────────────────────────────
  const customer = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: { passwordHash: hash, isActive: true },
    create: {
      email: 'demo@example.com',
      passwordHash: hash,
      firstName: 'Demo',
      lastName: 'Guest',
      phone: '+254700000000',
      role: Role.CUSTOMER,
      emailVerified: true,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { passwordHash: hash, isActive: true },
    create: {
      email: 'admin@example.com',
      passwordHash: hash,
      firstName: 'Site',
      lastName: 'Admin',
      role: Role.ADMIN,
      emailVerified: true,
    },
  });

  const agentUser = await prisma.user.upsert({
    where: { email: 'agent@example.com' },
    update: { passwordHash: hash, isActive: true },
    create: {
      email: 'agent@example.com',
      passwordHash: hash,
      firstName: 'Travel',
      lastName: 'Agent',
      role: Role.AGENT,
      emailVerified: true,
    },
  });

  await prisma.agentProfile.upsert({
    where: { userId: agentUser.id },
    update: { companyName: 'Safari Partners Ltd', isApproved: true },
    create: {
      userId: agentUser.id,
      companyName: 'Safari Partners Ltd',
      licenseNumber: 'KTA-2026-001',
      commissionRate: 12.5,
      isApproved: true,
      approvedAt: new Date(),
    },
  });

  console.log(`✓ users: customer=${customer.email} admin=${admin.email} agent=${agentUser.email} (pw: ${PASSWORD})`);

  // ── Safaris + availability dates ──────────────────────────────
  for (const s of SAFARIS) {
    const fields = {
      title: s.title,
      shortDescription: s.shortDescription,
      description: s.description,
      country: s.country,
      durationDays: s.durationDays,
      durationNights: s.durationNights,
      minPrice: new Prisma.Decimal(s.minPrice),
      maxPrice: new Prisma.Decimal(s.maxPrice),
      currency: s.currency,
      accommodationType: s.accommodationType,
      safariStyle: s.safariStyle,
      difficulty: s.difficulty,
      highlights: s.highlights,
      inclusions: s.inclusions,
      exclusions: s.exclusions,
      itinerary: s.itinerary,
      images: [card(s.imageSlug, 800), card(s.imageSlug, 1280)],
      thumbnail: card(s.imageSlug, 400),
      isActive: true,
      isFeatured: s.isFeatured,
      sortOrder: s.sortOrder,
    };

    const safari = await prisma.safari.upsert({
      where: { slug: s.slug },
      update: fields,
      create: { slug: s.slug, ...fields },
    });

    // Rebuild the forward departure calendar (always-ahead: no past dates).
    await prisma.safariDate.deleteMany({ where: { safariId: safari.id } });
    const planned = planDepartures(s, new Date());
    for (let i = 0; i < planned.length; i++) {
      const p = planned[i];
      const end = new Date(p.startDate);
      end.setDate(end.getDate() + s.durationDays + s.durationNights - 1);
      await prisma.safariDate.create({
        data: {
          safariId: safari.id,
          startDate: p.startDate,
          endDate: end,
          price: new Prisma.Decimal(p.price),
          availability: 10,
          booked: 0,
          status: p.isGuaranteed ? 'GUARANTEED' : 'OPEN',
        },
      });
    }

    console.log(`✓ safari: ${s.slug} (+${planned.length} departures)`);
  }

  console.log('\nSeed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });