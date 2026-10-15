'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useCurrentUser } from '@/lib/auth';
import { extractList } from '@/lib/mappers';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Booking } from '@/types';

export default function MyBookingsPage() {
  const { user } = useCurrentUser();
  const isAuthenticated = Boolean(user);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    api
      .getMyBookings()
      .then((res) => {
        if (!cancelled) setBookings(extractList<Booking>(res));
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  return (
    <section className="pb-20 pt-32">
      <div className="container-custom">
        <h1 className="font-heading text-3xl font-bold text-safari-dusk">My bookings</h1>

        {!isAuthenticated ? (
          <div className="mt-8 rounded-2xl border border-dashed border-gray-300 p-10 text-center">
            <p className="text-gray-500">Please sign in to view your bookings.</p>
            <Link href="/auth/login" className="btn-primary mt-5 inline-block">
              Sign in
            </Link>
          </div>
        ) : loading ? (
          <p className="mt-8 text-gray-500">Loading your bookings…</p>
        ) : bookings.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-gray-300 p-10 text-center">
            <p className="text-gray-500">You don’t have any bookings yet.</p>
            <Link href="/safaris" className="btn-primary mt-5 inline-block">
              Browse safaris
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {bookings.map((b) => (
              <li key={b.id} className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-safari-dusk">{b.safari?.title ?? 'Safari'}</p>
                  <p className="text-sm text-gray-500">
                    Ref {b.bookingRef}
                    {b.safariDate?.startDate ? ` · ${formatDate(b.safariDate.startDate)}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                    {b.status}
                  </span>
                  <span className="font-medium text-safari-dusk">
                    {formatCurrency(b.totalAmount, b.currency)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
