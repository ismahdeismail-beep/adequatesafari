import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Providers } from './providers';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CookieConsent } from '@/components/CookieConsent';
import { MobileActionBar } from '@/components/MobileActionBar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.adequatesafaris.com'),
  title: 'Adequate Safaris',
  applicationName: 'Adequate Safaris',
  description:
    'Adequate Safaris — safaris, beach holidays and international packages across Kenya, Tanzania and Uganda. Secure online booking with M-Pesa and Stripe.',
  keywords: ['safari booking', 'Kenya safari', 'Tanzania safari', 'Uganda gorilla trekking', 'African safari'],
  // App icons come from the file conventions in src/app (icon.png, apple-icon.png,
  // favicon.ico) and are generated from the existing adequatesafaris.com website's
  // own icon files — see images/brand/ and src/app/manifest.ts.
  appleWebApp: {
    capable: true,
    title: 'Adequate Safaris',
    statusBarStyle: 'default',
  },
  openGraph: {
    title: 'Adequate Safaris',
    description: 'Book safari adventures in Kenya, Tanzania, and Uganda.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Adequate Safaris',
    images: [{ url: '/adequate-logo.png', width: 1200, height: 630, alt: 'Adequate Safaris' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col bg-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow"
        >
          Skip to content
        </a>
        <Providers>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          {/* Space for the phone-only quick action bar. */}
          <div className="h-16 md:hidden" aria-hidden />
          <MobileActionBar />
          <CookieConsent />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: '#15803d', color: '#fff' },
              success: { iconTheme: { primary: '#fff', secondary: '#15803d' } },
              error: { iconTheme: { primary: '#fff', secondary: '#dc2626' } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
