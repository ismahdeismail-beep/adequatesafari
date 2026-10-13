import { Award, Headphones, ShieldCheck, Users } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: '10+ years of expertise',
    text: 'Locally owned and operated, with deep knowledge of East Africa’s parks, lodges and hidden gems.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure booking',
    text: 'Pay safely with Stripe or M-Pesa. Your deposit is protected and fully transparent.',
  },
  {
    icon: Users,
    title: 'Small-group & private',
    text: 'Private departures or small groups — never crowded vehicles, always the best seats.',
  },
  {
    icon: Headphones,
    title: '24/7 on-safari support',
    text: 'A dedicated consultant on WhatsApp from your first enquiry to the flight home.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-safari-sand/40 py-16">
      <div className="container-custom">
        <h2 className="text-center font-heading text-3xl font-bold text-safari-dusk">Why travel with us</h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-gray-500">
          We design journeys that match your pace, budget and curiosity — and we look after every detail.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                <feature.icon className="h-6 w-6 text-primary-700" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-safari-dusk">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
