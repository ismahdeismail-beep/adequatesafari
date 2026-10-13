'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

const destinations = [
  'Masai Mara',
  'Amboseli',
  'Tsavo East & West',
  'Lake Nakuru',
  'Samburu',
  'Serengeti',
  'Ngorongoro',
  'Bwindi (Uganda)',
];

const styles = ['Lodge safari', 'Camping safari', 'Flying safari', 'Trekking / climb'];
const durations = ['1–2 days', '3 days', '4 days', '5 days', '7 days', '10+ days'];
const budgets = ['Budget', 'Mid-range', 'Luxury', 'Premium'];

export function SearchSection() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [style, setStyle] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState('');
  const [travellers, setTravellers] = useState(2);
  const [budget, setBudget] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set('search', destination);
    if (style) params.set('style', style);
    if (duration) params.set('duration', duration);
    if (date) params.set('availableFrom', date);
    if (travellers) params.set('adults', String(travellers));
    if (budget) params.set('budget', budget);
    router.push(`/safaris${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <section className="bg-safari-sand/40 py-14">
      <div className="container-custom">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-md sm:p-8">
          <h2 className="text-center font-heading text-2xl font-bold text-safari-dusk sm:text-3xl">
            Find your perfect safari
          </h2>
          <p className="mt-2 text-center text-gray-500">Search by destination, duration or budget</p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label htmlFor="destination" className="mb-1 block text-sm font-medium text-gray-700">
                Destination
              </label>
              <select
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="input-field"
              >
                <option value="">Any destination</option>
                {destinations.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="style" className="mb-1 block text-sm font-medium text-gray-700">
                Safari style
              </label>
              <select id="style" value={style} onChange={(e) => setStyle(e.target.value)} className="input-field">
                <option value="">Any style</option>
                {styles.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="duration" className="mb-1 block text-sm font-medium text-gray-700">
                Duration
              </label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="input-field"
              >
                <option value="">Any duration</option>
                {durations.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-700">
                Travel date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="travellers" className="mb-1 block text-sm font-medium text-gray-700">
                Travellers
              </label>
              <input
                id="travellers"
                type="number"
                min={1}
                max={20}
                value={travellers}
                onChange={(e) => setTravellers(Number(e.target.value))}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="budget" className="mb-1 block text-sm font-medium text-gray-700">
                Budget
              </label>
              <select id="budget" value={budget} onChange={(e) => setBudget(e.target.value)} className="input-field">
                <option value="">Any budget</option>
                {budgets.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <button type="submit" className="btn-primary flex w-full items-center justify-center gap-2">
                <Search className="h-5 w-5" />
                Search safaris
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
