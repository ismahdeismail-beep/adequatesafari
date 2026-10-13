import type { Metadata } from 'next';
import { ContentPage } from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'Privacy Policy | Absolute Adventure Safaris',
};

export default function PrivacyPage() {
  return (
    <ContentPage title="Privacy policy" subtitle="How we handle your personal data.">
      <h2>What we collect</h2>
      <p>
        We collect the details you provide when you enquire or book — name, contact details, travel
        dates and passenger information — to arrange and operate your safari.
      </p>
      <h2>How we use it</h2>
      <ul>
        <li>To process bookings and payments</li>
        <li>To communicate about your trip</li>
        <li>To meet legal and safety requirements</li>
      </ul>
      <h2>Cookies</h2>
      <p>
        We use essential cookies and, with your consent, analytics cookies. You can change your
        choice at any time.
      </p>
      <p className="text-sm text-gray-400">
        Placeholder copy — replace with the final policy (GDPR-compliant) before go-live.
      </p>
    </ContentPage>
  );
}
