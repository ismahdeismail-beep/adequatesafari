import type { Metadata } from 'next';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';
import { siteConfig, whatsappLink } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Contact Us | Adequate Safaris',
  description: 'Talk to our safari consultants in East Africa.',
};

export default function ContactPage() {
  return (
    <section className="pb-20 pt-32">
      <div className="container-custom grid gap-10 lg:grid-cols-2">
        <div>
          <h1 className="font-heading text-3xl font-bold text-safari-dusk sm:text-4xl">Get in touch</h1>
          <p className="mt-2 text-gray-500">
            Tell us where you’d like to go and we’ll design the perfect itinerary.
          </p>

          {siteConfig.phone || siteConfig.whatsapp || siteConfig.email || siteConfig.address ? (
            <ul className="mt-8 space-y-4 text-gray-600">
              {siteConfig.phone && (
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary-600" />
                  <span>{siteConfig.phone}</span>
                </li>
              )}
              {siteConfig.whatsapp && (
                <li className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-primary-600" />
                  <a
                    href={whatsappLink(siteConfig.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary-700"
                  >
                    WhatsApp: {siteConfig.whatsapp}
                  </a>
                </li>
              )}
              {siteConfig.email && (
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary-600" />
                  <a href={`mailto:${siteConfig.email}`} className="hover:text-primary-700">
                    {siteConfig.email}
                  </a>
                </li>
              )}
              {siteConfig.address && (
                <li className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary-600" />
                  <span>{siteConfig.address}</span>
                </li>
              )}
            </ul>
          ) : (
            <p className="mt-8 text-gray-600">
              Use the form to reach us — we reply within one business day.
            </p>
          )}
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
