/**
 * Frequently asked questions, shared by the /faq page and the home page
 * accordion. Answers are our own copy.
 */
export interface Faq {
  q: string;
  a: string;
}

export const faqs: Faq[] = [
  {
    q: 'How is the price calculated?',
    a: 'Every safari has a per-person price, shown next to each departure date and quoted in both KSH and USD. Your trip total is simply the per-person rate multiplied by the number of travellers. You’ll see the exact total on the review step before you confirm, and we never add hidden fees.',
  },
  {
    q: 'Are children charged the same rate?',
    a: 'Children are quoted at the same per-person rate as adults on each departure. Family and child discounts are applied on request once we confirm your booking.',
  },
  {
    q: 'When do I actually pay?',
    a: 'Nothing is charged when you book. We confirm availability first, then send you an invoice with M-Pesa, card and bank-transfer options. Your price is fixed at the moment you book.',
  },
  {
    q: 'When is the best time to go on safari?',
    a: 'Kenya and Tanzania are year-round destinations. July–October is prime for the Great Migration; January–March offers excellent general game viewing and calving season.',
  },
  {
    q: 'Do I need a visa?',
    a: 'Most visitors require an e-visa or eTA for Kenya, Tanzania and Uganda. We’ll send the current requirements after booking.',
  },
  {
    q: 'Can I pay with M-Pesa?',
    a: 'Yes. We accept M-Pesa for local and international guests, as well as card payments via Stripe.',
  },
  {
    q: 'Are the safaris private?',
    a: 'Most of our departures are private. Small-group departures are clearly marked and never exceed six travellers.',
  },
  {
    q: 'Do you arrange group and corporate holidays?',
    a: 'Yes — team-building retreats, school trips and company getaways are a core part of what we do. Tell us your numbers and dates and we’ll build a package around them.',
  },
  {
    q: 'Can I customise a package?',
    a: 'Absolutely. Any itinerary here can be tailored — add nights, change lodges, or combine the bush with the coast. Send us what you have in mind and we’ll price it.',
  },
  {
    q: 'Is Kenya safe for tourists?',
    a: 'The parks and beaches we operate in are well-established tourism areas with experienced guides and drivers throughout. We brief every guest on arrival and stay reachable for the whole trip.',
  },
];
