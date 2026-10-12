/**
 * Absolute Adventure Safaris — Prisma seed.
 *
 * Idempotent: users upserted by email, safaris upserted by slug, safari dates
 * rebuilt each run. Safe to re-run (`npm run db:seed`).
 *
 * Credentials for seeded users (unless SEED_PASSWORD is set):
 *   demo@absoluteadventuresafaris.com  / CHANGE_ME   (customer)
 *   admin@absoluteadventuresafaris.com / CHANGE_ME   (admin)
 *   agent@absoluteadventuresafaris.com / CHANGE_ME   (agent)
 *
 * Image paths point at the Joomla template's card set; swap CDN_URL at runtime
 * to serve them from your CDN. Real photography replaces these after content
 * migration (same filenames).
 */

import { PrismaClient, Prisma, Role, Country, Currency, AccommodationType, SafariStyle, Difficulty } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const IMG_BASE = process.env.CDN_URL ?? 'https://www.absoluteadventuresafaris.com';
const PASSWORD = process.env.SEED_PASSWORD ?? 'CHANGE_ME';
const card = (slug: string, size = 800) => `${IMG_BASE}/templates/absolute/images/cards/${slug}-${size}.jpg`;

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
];

function nextMonday(weeksAhead = 0): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = Sun
  const diff = day === 0 ? 1 : 8 - day; // days until next Monday
  d.setDate(d.getDate() + diff + weeksAhead * 7);
  return d;
}

async function main(): Promise<void> {
  const hash = await bcrypt.hash(PASSWORD, 10);

  // ── Users ─────────────────────────────────────────────────────
  const customer = await prisma.user.upsert({
    where: { email: 'demo@absoluteadventuresafaris.com' },
    update: { passwordHash: hash, isActive: true },
    create: {
      email: 'demo@absoluteadventuresafaris.com',
      passwordHash: hash,
      firstName: 'Demo',
      lastName: 'Guest',
      phone: '+254700000000',
      role: Role.CUSTOMER,
      emailVerified: true,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@absoluteadventuresafaris.com' },
    update: { passwordHash: hash, isActive: true },
    create: {
      email: 'admin@absoluteadventuresafaris.com',
      passwordHash: hash,
      firstName: 'Site',
      lastName: 'Admin',
      role: Role.ADMIN,
      emailVerified: true,
    },
  });

  const agentUser = await prisma.user.upsert({
    where: { email: 'agent@absoluteadventuresafaris.com' },
    update: { passwordHash: hash, isActive: true },
    create: {
      email: 'agent@absoluteadventuresafaris.com',
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

    // Rebuild the next ~8 weekly departures.
    await prisma.safariDate.deleteMany({ where: { safariId: safari.id } });
    const startDates = Array.from({ length: 8 }, (_, i) => nextMonday(i));
    for (let i = 0; i < startDates.length; i++) {
      const start = startDates[i];
      const end = new Date(start);
      end.setDate(end.getDate() + s.durationDays + s.durationNights - 1);
      await prisma.safariDate.create({
        data: {
          safariId: safari.id,
          startDate: start,
          endDate: end,
          price: new Prisma.Decimal(s.minPrice),
          availability: 10,
          booked: 0,
          status: 'OPEN',
        },
      });
    }

    console.log(`✓ safari: ${s.slug} (+${startDates.length} departures)`);
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