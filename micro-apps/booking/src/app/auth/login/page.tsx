'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();
  const next = params.get('next') || '/account/profile';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Signed in');
      router.push(next);
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || 'Could not sign in. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pb-20 pt-32">
      <div className="container-custom max-w-md">
        <h1 className="text-center font-heading text-3xl font-bold text-safari-dusk">Sign in</h1>
        <p className="mt-2 text-center text-gray-500">
          Sign in with your email and password.
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
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 space-y-2 text-center">
          <p className="text-sm text-gray-500">
            New here?{' '}
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
