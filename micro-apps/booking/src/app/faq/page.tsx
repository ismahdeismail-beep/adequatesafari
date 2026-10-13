import type { Metadata } from 'next';
import { ContentPage } from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'FAQs | Absolute Adventure Safaris',
};

const faqs = [
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
