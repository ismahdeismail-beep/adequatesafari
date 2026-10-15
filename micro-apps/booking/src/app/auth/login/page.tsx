'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { api, isApiConfigured } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [next, setNext] = useState('/booking/my-bookings');
  const [loading, setLoading] = useState(false);

  // Read ?next= after mount (client-side) so this static page doesn't need a Suspense boundary.
  useEffect(() => {
    const n = new URLSearchParams(window.location.search).get('next');
    if (n && n.startsWith('/') && !n.startsWith('//')) {
      setNext(n);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isApiConfigured) {
      toast.error('Sign-in is unavailable — the booking API is not configured for this deployment.');
      return;
    }
    setLoading(true);
    try {
      const data = await api.login(email, password);
      const payload = data?.data ?? data;
      setAuth(payload.user, payload.accessToken, payload.refreshToken);
      toast.success('Welcome back!');
      router.push(next);
    } catch {
      toast.error('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pb-20 pt-32">
      <div className="container-custom max-w-md">
        <h1 className="text-center font-heading text-3xl font-bold text-safari-dusk">Welcome back</h1>
        <p className="mt-2 text-center text-gray-500">Sign in to manage your bookings.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 space-y-2 text-center">
          <p className="text-sm text-gray-500">
            Don’t have an account?{' '}
            <Link href="/auth/register" className="font-medium text-primary-600 hover:text-primary-700">
              Create one
            </Link>
          </p>
          <p className="text-sm text-gray-500">
            Prefer no password?{' '}
            <Link href="/auth/login/otp" className="font-medium text-primary-600 hover:text-primary-700">
              Sign in with Magic Link
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
