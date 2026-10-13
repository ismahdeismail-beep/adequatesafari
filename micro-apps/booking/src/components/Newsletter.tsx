'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setDone(true);
    setEmail('');
  };

  return (
    <section className="bg-safari-dusk py-16 text-white">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl text-center">
          <Mail className="mx-auto h-10 w-10 text-safari-gold" />
          <h2 className="mt-4 font-heading text-3xl font-bold">Safari inspiration, straight to your inbox</h2>
          <p className="mt-2 text-white/80">
            Seasonal offers, migration updates and expert travel tips. No spam — unsubscribe any time.
          </p>

          {done ? (
            <p className="mt-6 rounded-lg bg-white/10 px-4 py-3 text-white">
              Thanks — you’re subscribed. Keep an eye on your inbox.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-safari-gold"
              />
              <button type="submit" className="btn-primary">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
