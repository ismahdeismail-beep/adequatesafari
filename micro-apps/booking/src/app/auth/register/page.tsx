'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-600">
            Adequate Safaris
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-safari-dusk">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Track bookings and save your details for next time. Booking is always
            available as a guest.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7"
        >
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-safari-dusk">
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
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-safari-dusk"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="At least 6 characters"
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

          <div>
            <label
              htmlFor="confirm"
              className="mb-1.5 block text-sm font-medium text-safari-dusk"
            >
              Confirm password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="confirm"
                type={showConfirm ? 'text' : 'password'}
                required
                minLength={6}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                placeholder="Repeat your password"
                className="input-field pl-9 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-safari-dusk"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account…' : 'Create account'}
          </button>

          <p className="text-center text-xs text-gray-400">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-gray-600">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-gray-600">
              Privacy Policy
            </Link>
            . We store your email and password only, to run your account.
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-primary-600 hover:text-primary-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
