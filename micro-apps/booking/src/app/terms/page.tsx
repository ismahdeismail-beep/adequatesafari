import type { Metadata } from 'next';
import { ContentPage } from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'Booking Terms | Absolute Adventure Safaris',
};

export default function TermsPage() {
  return (
    <ContentPage title="Booking terms & conditions" subtitle="Please read before you book.">
      <h2>Bookings & payments</h2>
      <p>
        A deposit confirms your reservation; the balance is due before travel. Payments are handled
        securely via Stripe (cards) or M-Pesa.
      </p>
      <h2>Cancellations</h2>
      <ul>
        <li>Cancellations more than 60 days before travel: deposit refundable per camp policy</li>
        <li>30–60 days: 50% of the tour cost may be charged</li>
        <li>Less than 30 days: full cost may be charged</li>
      </ul>
      <h2>Travel insurance</h2>
      <p>Comprehensive travel and medical insurance is required for all guests.</p>
      <p className="text-sm text-gray-400">
        This is placeholder copy — final terms must be reviewed by the business before go-live.
      </p>
    </ContentPage>
  );
}
