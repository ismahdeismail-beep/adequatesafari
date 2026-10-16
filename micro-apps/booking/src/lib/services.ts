import {
  Briefcase,
  Car,
  Compass,
  FileCheck2,
  Footprints,
  Globe2,
  Hotel,
  Mountain,
  PartyPopper,
  Plane,
  Waves,
  type LucideIcon,
} from 'lucide-react';

/**
 * The services Adequate Safaris provides. Mirrors what the live site sells but
 * the booking app never listed in one place: tailor-made planning, beach and
 * fly-in holidays, trekking, themed and corporate travel, excursions, ground
 * handling and travel documentation.
 */
export interface Service {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Where a guest can act on this service (usually an offer collection). */
  href?: string;
  cta?: string;
}

export const services: Service[] = [
  {
    slug: 'tailor-made',
    title: 'Tailor-made safari planning',
    description:
      'Tell us your dates, budget and pace — we design a private itinerary around them, from a two-day Mara dash to a two-week East Africa circuit.',
    icon: Compass,
    href: '/contact',
    cta: 'Plan my trip',
  },
  {
    slug: 'beach-holidays',
    title: 'Beach & coastal holidays',
    description:
      'Diani, Mombasa and Watamu — all-inclusive resorts, boutique stays and self-catering apartments, with flights and transfers arranged.',
    icon: Waves,
    href: '/deals/diani',
    cta: 'See beach deals',
  },
  {
    slug: 'fly-in-safaris',
    title: 'Fly-in safaris',
    description:
      'Skip the long road transfers. Light-aircraft charters to the Maasai Mara, Diani and beyond, so you spend more time in the wild.',
    icon: Plane,
    href: '/safaris?style=FLYING_SAFARI',
    cta: 'Browse fly-in trips',
  },
  {
    slug: 'mountain-trekking',
    title: 'Mountain trekking',
    description:
      'Guided climbs of Mount Kenya and Kilimanjaro with acclimatisation days, mountain huts or camping, and full porter support.',
    icon: Mountain,
    href: '/safaris?style=MOUNTAIN_CLIMB',
    cta: 'View climbs',
  },
  {
    slug: 'themed-holidays',
    title: 'Themed holidays',
    description:
      'Honeymoons, birthdays, Christmas and Easter escapes — celebrations built into the itinerary, at home or abroad.',
    icon: PartyPopper,
    href: '/deals/themed',
    cta: 'Explore themed trips',
  },
  {
    slug: 'corporate-groups',
    title: 'Corporate & group travel',
    description:
      'Team retreats, conferences and incentive trips, plus discounted group departures for families and friends travelling together.',
    icon: Briefcase,
    href: '/deals/corporate',
    cta: 'Corporate deals',
  },
  {
    slug: 'excursions',
    title: 'Excursions & day trips',
    description:
      'Short breaks from Nairobi and the coast — Lake Nakuru, Naivasha, Amboseli and city experiences, ideal as add-ons.',
    icon: Footprints,
    href: '/safaris?style=SHORT_EXCURSION',
    cta: 'See excursions',
  },
  {
    slug: 'gorilla-trekking',
    title: 'Gorilla trekking',
    description:
      'Gorilla permits and guided treks in Uganda’s Bwindi and Rwanda’s Volcanoes National Park, with lodge stays included.',
    icon: Globe2,
    href: '/safaris?country=UGANDA',
    cta: 'Uganda safaris',
  },
  {
    slug: 'international',
    title: 'International holidays',
    description:
      'Dubai, Zanzibar, Bali, the Maldives, Seychelles, Mauritius and more — flight-inclusive packages beyond East Africa.',
    icon: Globe2,
    href: '/deals/international',
    cta: 'International packages',
  },
  {
    slug: 'transfers-accommodation',
    title: 'Airport transfers & hotel booking',
    description:
      'Ground handling, meet-and-greet and airport transfers, plus hotel and lodge bookings on their own or as part of a package.',
    icon: Hotel,
    href: '/contact',
    cta: 'Arrange transfers',
  },
  {
    slug: 'car-hire',
    title: 'Car hire & chauffeur drives',
    description:
      'Self-drive or chauffeured 4×4s and saloons for meetings, city days and road trips, with optional driver-guides.',
    icon: Car,
    href: '/contact',
    cta: 'Hire a vehicle',
  },
  {
    slug: 'visa-documents',
    title: 'Visa & travel documentation',
    description:
      'Guidance on e-visas, eTA, entry requirements and travel insurance for every country on your itinerary.',
    icon: FileCheck2,
    href: '/contact',
    cta: 'Ask about visas',
  },
];
