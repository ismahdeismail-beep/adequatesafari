'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

function LoginForm() {
  const params = useSearchParams();
  const next = params.get('next') || '/account/profile';
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configured) {
      toast.error('Sign-in is not configured for this deployment yet.');
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true, emailRedirectTo: redirectTo },
      });
      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      toast.error(err?.message || 'Could not send the sign-in link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pb-20 pt-32">
      <div className="container-custom max-w-md">
        <h1 className="text-center font-heading text-3xl font-bold text-safari-dusk">Sign in</h1>
        <p className="mt-2 text-center text-gray-500">
          Enter your email and we&rsquo;ll send you a one-time sign-in link.
        </p>

        {sent ? (
          <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
            <p className="text-gray-700">
              Check <strong>{email}</strong> for your sign-in link.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              The link works once and expires shortly. You can close this tab.
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
              {loading ? 'Sending link…' : 'Send sign-in link'}
            </button>
            <p className="text-center text-xs text-gray-400">
              No password needed. New here? This creates your account automatically.
            </p>
          </form>
        )}

        <div className="mt-6 space-y-2 text-center">
          <p className="text-sm text-gray-500">
            Prefer a password?{' '}
            <Link href="/auth/register" className="font-medium text-primary-600 hover:text-primary-700">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
