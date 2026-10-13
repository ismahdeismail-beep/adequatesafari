import Link from 'next/link';
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';

const footerLinks = [
  {
    title: 'Safaris',
    links: [
      { label: 'Kenya Safaris', href: '/safaris?country=KENYA' },
      { label: 'Tanzania Safaris', href: '/safaris?country=TANZANIA' },
      { label: 'Uganda Safaris', href: '/safaris?country=UGANDA' },
      { label: 'Mountain Climbing', href: '/safaris?style=MOUNTAIN_CLIMB' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Special Offers', href: '/offers' },
      { label: 'Travel Blog', href: '/blog' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Booking Terms', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'FAQs', href: '/faq' },
      { label: 'My Bookings', href: '/booking/my-bookings' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-safari-dusk text-white/80" role="contentinfo">
      <div className="container-custom py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <span className="font-heading text-xl font-bold text-white">Absolute Adventure Safaris</span>
            <p className="mt-3 max-w-sm text-sm leading-relaxed">
              Leading provider of quality leisure and vacation experiences and services across East Africa.
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-safari-gold" />
                <span>+254 (0) 700 000 000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-safari-gold" />
                <a href="mailto:info@absoluteadventuresafaris.com" className="hover:text-white">
                  info@absoluteadventuresafaris.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-safari-gold" />
                <span>Nairobi, Kenya</span>
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-4">
              <a href="#" aria-label="Facebook" className="hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" aria-label="X / Twitter" className="hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="font-heading text-base font-semibold text-white">{column.title}</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-custom flex flex-col items-center justify-between gap-3 py-5 text-xs sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Absolute Adventure Safaris. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link href="/credits" className="hover:text-white">
              Photo credits
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
