'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

/**
 * Minimal-data sign-up.
 *
 * We deliberately collect ONE field: the email address. Creating the account and
 * signing in are the same action (a magic link), so there is no password to
 * store or leak. Name and phone are only requested later, at booking time, and
 * only where a trip actually requires them.
 */
export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configured) {
      toast.error('Sign-up is not configured for this deployment yet.');
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      toast.error(err?.message || 'Could not send the sign-up link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pb-20 pt-32">
      <div className="container-custom max-w-md">
        <h1 className="text-center font-heading text-3xl font-bold text-safari-dusk">
          Create your account
        </h1>
        <p className="mt-2 text-center text-gray-500">
          We only need your email. No password, no forms to fill.
        </p>

        {sent ? (
          <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
            <p className="text-gray-700">
              We sent a sign-in link to <strong>{email}</strong>
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Open it on this device to finish creating your account. Your name and
              any trip details are only asked when you book.
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Sending link…' : 'Continue with email'}
            </button>

            <p className="text-center text-xs text-gray-400">
              By continuing you agree to our{' '}
              <Link href="/terms" className="underline hover:text-gray-600">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline hover:text-gray-600">
                Privacy Policy
              </Link>
              . We store your email to run your account — nothing else at sign-up.
            </p>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-700">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
