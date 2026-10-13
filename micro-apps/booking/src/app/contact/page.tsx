import type { Metadata } from 'next';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | Adequate Safaris',
  description: 'Talk to our safari consultants in Nairobi, Kenya.',
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

          <ul className="mt-8 space-y-4 text-gray-600">
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary-600" />
              <span>+254 (0) 700 000 000</span>
            </li>
            <li className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-primary-600" />
              <span>WhatsApp: +254 (0) 700 000 000</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary-600" />
              <a href="mailto:info@example.com" className="hover:text-primary-600">
                info@example.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary-600" />
              <span>Nairobi, Kenya</span>
            </li>
          </ul>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
