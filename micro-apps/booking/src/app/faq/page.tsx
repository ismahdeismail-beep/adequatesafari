import type { Metadata } from 'next';
import { ContentPage } from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'FAQs | Adequate Safaris',
};

const faqs = [
  {
    q: 'How is the price calculated?',
    a: 'Every safari has a per-person price, shown in full next to each departure date. Your trip total is simply the per-person rate multiplied by the number of travellers — adults and children alike. You’ll see the exact total on the review step before you confirm, and we never add hidden fees.',
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
];

export default function FaqPage() {
  return (
    <ContentPage title="Frequently asked questions" subtitle="Answers to the questions we hear most.">
      <dl className="space-y-6">
        {faqs.map((f) => (
          <div key={f.q}>
            <dt className="font-semibold text-safari-dusk">{f.q}</dt>
            <dd className="mt-1">{f.a}</dd>
          </div>
        ))}
      </dl>
    </ContentPage>
  );
}
