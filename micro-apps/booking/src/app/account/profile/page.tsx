'use client';

import Link from 'next/link';
import { User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

export default function ProfilePage() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return (
      <section className="pb-20 pt-32">
        <div className="container-custom max-w-xl text-center">
          <UserIcon className="mx-auto h-10 w-10 text-gray-300" />
          <h1 className="mt-4 font-heading text-2xl font-bold text-safari-dusk">
            Sign in to view your profile
          </h1>
          <p className="mt-2 text-gray-500">
            Your details and booking history are only shown once you are signed in.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/auth/login" className="btn btn-primary">
              Sign in
            </Link>
            <Link href="/auth/register" className="btn btn-outline">
              Create account
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-20 pt-32">
      <div className="container-custom max-w-2xl">
        <h1 className="font-heading text-3xl font-bold text-safari-dusk">My profile</h1>
        <dl className="mt-8 divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white">
          {[
            ['Name', `${user.firstName} ${user.lastName}`.trim()],
            ['Email', user.email],
            ['Phone', user.phone ?? '—'],
            ['Role', user.role],
            ['Member since', new Date(user.createdAt).toLocaleDateString()],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 px-5 py-4">
              <dt className="text-sm text-gray-500">{label}</dt>
              <dd className="text-sm font-medium text-safari-dusk">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex gap-3">
          <Link href="/booking/my-bookings" className="btn btn-primary">
            My bookings
          </Link>
          <Link href="/safaris" className="btn btn-outline">
            Browse safaris
          </Link>
        </div>
      </div>
    </section>
  );
}
