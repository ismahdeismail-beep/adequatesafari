'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { User as UserIcon, LogOut, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCurrentUser, signOut, isSupabaseConfigured } from '@/lib/auth';
import { createClient } from '@/lib/supabase/client';
import { getProfile, upsertProfile } from '@/lib/supabase/data';

export default function ProfilePage() {
  const { user, loading } = useCurrentUser();
  const [fullName, setFullName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFullName(user.name ?? '');
    if (isSupabaseConfigured && user.id) {
      getProfile(user.id)
        .then((p) => p?.full_name && setFullName(p.full_name))
        .catch(() => {
          /* profile row is optional */
        });
    }
  }, [user]);

  const save = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      await createClient().auth.updateUser({ data: { full_name: fullName } });
      await upsertProfile({ id: user.id, email: user.email, full_name: fullName });
      toast.success('Profile saved');
    } catch (err: any) {
      toast.error(err?.message || 'Could not save your profile');
    } finally {
      setSaving(false);
    }
  };

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
      <div className="container-custom max-w-xl">
        <h1 className="font-heading text-3xl font-bold text-safari-dusk">My profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          We only keep your email and, if you add one, a display name.
        </p>

        <div className="mt-8 space-y-5 rounded-xl border border-gray-100 bg-white p-6">
          <div>
            <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-gray-700">
              Display name (optional)
            </label>
            <input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-field"
              placeholder="How we should address you"
            />
          </div>

          <div>
            <span className="mb-1 block text-sm font-medium text-gray-700">Email</span>
            <p className="text-sm text-safari-dusk">{user.email}</p>
            <p className="mt-1 text-xs text-gray-400">
              Your email is your sign-in. Contact us if you need to change it.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button onClick={save} disabled={saving} className="btn btn-primary">
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <Link href="/booking/my-bookings" className="btn btn-outline">
              My bookings
            </Link>
            <button
              onClick={() => signOut()}
              className="btn inline-flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
