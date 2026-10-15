'use client';

import Link from 'next/link';
import { ShieldCheck, Loader2, LogOut } from 'lucide-react';
import { useCurrentUser, signOut } from '@/lib/auth';

/**
 * Minimal admin profile.
 *
 * Deliberately simple: it shows the signed-in account and a Supabase status
 * line. Real admin actions (viewing all bookings, editing safaris) come later;
 * server-side authorisation will live in the `safari` schema / RLS, not here.
 */
export default function AdminProfilePage() {
  const { user, loading } = useCurrentUser();

  if (loading) {
    return (
      <section className="pb-20 pt-32">
        <div className="container-custom max-w-xl text-center text-gray-400">
          <Loader2 className="mx-auto h-8 w-8 animate-spin" />
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="pb-20 pt-32">
        <div className="container-custom max-w-xl text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-gray-300" />
          <h1 className="mt-4 font-heading text-2xl font-bold text-safari-dusk">
            Admin sign in required
          </h1>
          <p className="mt-2 text-gray-500">This area is for staff accounts.</p>
          <Link href="/auth/login" className="btn btn-primary mt-6 inline-flex">
            Sign in
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-20 pt-32">
      <div className="container-custom max-w-xl">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary-600" />
          <h1 className="font-heading text-3xl font-bold text-safari-dusk">Admin profile</h1>
        </div>

        <dl className="mt-8 divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white">
          {[
            ['Account', user.name || '—'],
            ['Email', user.email],
            ['User ID', user.id ?? '—'],
            ['Data store', 'Supabase · schema `safari`'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 px-5 py-4">
              <dt className="text-sm text-gray-500">{label}</dt>
              <dd className="truncate text-sm font-medium text-safari-dusk">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex gap-3">
          <Link href="/booking/my-bookings" className="btn btn-primary">
            Bookings
          </Link>
          <Link href="/account/profile" className="btn btn-outline">
            My profile
          </Link>
          <button
            onClick={() => signOut()}
            className="btn inline-flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Admin actions (all bookings, safari management) are not enabled yet — they will be
          enforced by row-level security in the <code>safari</code> schema.
        </p>
      </div>
    </section>
  );
}
