'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();
  const next = params.get('next') || '/account/profile';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      toast.success('Welcome back.');
      router.push(next);
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || 'Could not sign in. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">
            Adequate Safaris
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-safari-dusk">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to track your bookings and saved details.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-safari-dusk"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                className="input-field pl-9"
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-safari-dusk">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                className="input-field pl-9 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-safari-dusk"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          New here?{' '}
          <Link
            href="/auth/register"
            className="font-medium text-primary-600 hover:text-primary-700"
          >
            Create an account
          </Link>
        </p>

        <p className="mt-3 text-center text-xs text-gray-400">
          You can book as a guest without an account — creating one just saves your
          details and lets you track bookings.
        </p>
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
