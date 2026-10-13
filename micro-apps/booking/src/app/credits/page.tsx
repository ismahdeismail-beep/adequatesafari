import type { Metadata } from 'next';
import { ContentPage } from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'Photo Credits | Absolute Adventure Safaris',
};

export default function CreditsPage() {
  return (
    <ContentPage title="Photo credits" subtitle="Thank you to the photographers who make this site possible.">
      <p>
        Destination photography on this site is used under Creative Commons licences. Full
        attribution (author, licence and source links) lives with the Joomla template assets at
        <code className="mx-1 rounded bg-gray-100 px-1">joomla-site/templates/absolute/images/cards/CREDITS.md</code>
        and is mirrored on the static preview page
        <code className="mx-1 rounded bg-gray-100 px-1">preview/credits.html</code>.
      </p>
      <p>
        If you believe an image has been used incorrectly, contact us at
        <a href="mailto:info@absoluteadventuresafaris.com" className="ml-1 text-primary-600 hover:text-primary-700">
          info@absoluteadventuresafaris.com
        </a>{' '}
        and we’ll resolve it promptly.
      </p>
    </ContentPage>
  );
}
