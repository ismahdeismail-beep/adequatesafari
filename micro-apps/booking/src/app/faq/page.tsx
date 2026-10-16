import type { Metadata } from 'next';
import { ContentPage } from '@/components/ContentPage';
import { faqs } from '@/lib/faqs';

export const metadata: Metadata = {
  title: 'FAQs | Adequate Safaris',
};

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
