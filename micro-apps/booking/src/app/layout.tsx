import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Providers } from './providers';

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
  title: 'Book Your Safari | Absolute Adventure Safaris',
  description: 'Book unforgettable safari adventures in Kenya, Tanzania, and Uganda. Secure online booking with M-Pesa and Stripe.',
  keywords: ['safari booking', 'Kenya safari', 'Tanzania safari', 'Uganda gorilla trekking', 'African safari'],
  openGraph: {
    title: 'Book Your Safari | Absolute Adventure Safaris',
    description: 'Book unforgettable safari adventures in Kenya, Tanzania, and Uganda.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Absolute Adventure Safaris',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" class={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-white">
        <Providers>
          {children}
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