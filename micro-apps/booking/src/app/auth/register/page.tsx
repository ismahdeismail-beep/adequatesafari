'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

/**
 * Email + password sign-up.
 *
 * Supabase has autoconfirm enabled, so creating the account and signing in
 * happen in one step — no confirmation email is required. Name and phone are
 * only requested later, at booking time, and only where a trip needs them.
 */
export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configured) {
      toast.error('Sign-up is not configured for this deployment yet.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      // Autoconfirm is on, so signUp returns a session immediately.
      if (data.session) {
        toast.success('Account created — you are signed in.');
        router.push('/account/profile');
        router.refresh();
      } else {
        toast.success('Account created. You can sign in now.');
        router.push('/auth/login');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Could not create your account. Please try again.');
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
          Set an email and password to track your bookings.
        </p>

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

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              autoComplete="new-password"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label htmlFor="confirm" className="mb-1 block text-sm font-medium text-gray-700">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              required
              minLength={6}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="input-field"
              autoComplete="new-password"
              placeholder="Repeat your password"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account…' : 'Create account'}
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
