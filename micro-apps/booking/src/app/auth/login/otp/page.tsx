'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function LoginOtpPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setSent(true);
      toast.success('Magic link sent to your email');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in with Magic Link
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            No password needed. Just your email address.
          </p>
        </div>
        {!sent ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
            <div className="text-center">
              <Link href="/auth/login" className="text-sm text-green-600 hover:text-green-500">
                Back to login
              </Link>
            </div>
          </form>
        ) : (
          <div className="mt-8 text-center bg-white p-6 rounded-lg shadow">
            <p className="text-gray-700 mb-4">
              We sent a magic link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-600">
              Click the link in your email to sign in. You can close this window.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-4 text-sm text-green-600 hover:text-green-500"
            >
              Send again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
