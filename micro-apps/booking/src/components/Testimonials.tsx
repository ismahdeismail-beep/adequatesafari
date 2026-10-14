import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Verified traveller',
    location: 'United Kingdom',
    rating: 5,
    text: 'The Great Migration safari exceeded every expectation. Our guide read the bush like a book — we saw all of the Big Five in three days.',
  },
  {
    name: 'Guest from Kenya',
    location: 'Kenya',
    rating: 5,
    text: 'We booked a private Mount Kenya climb for our team. Flawless logistics, great guides and total peace of mind from start to finish.',
  },
  {
    name: 'Guest from France',
    location: 'France',
    rating: 5,
    text: 'Gorilla trekking in Bwindi was the trip of a lifetime. Everything was arranged perfectly, including permits and transfers.',
  },
];

export function Testimonials() {
  return (
    <section className="py-16">
      <div className="container-custom">
        <h2 className="text-center font-heading text-3xl font-bold text-safari-dusk">
          Loved by travellers worldwide
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-gray-500">
          Real stories from guests who travelled with Adequate Safaris.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-xl bg-white p-6 shadow-sm">
              <div className="flex gap-0.5 text-safari-gold">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-gray-600">“{t.text}”</blockquote>
              <figcaption className="mt-5 border-t border-gray-100 pt-4">
                <span className="block font-semibold text-safari-dusk">{t.name}</span>
                <span className="text-sm text-gray-500">{t.location}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
