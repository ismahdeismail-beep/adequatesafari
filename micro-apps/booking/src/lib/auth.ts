'use client';

import { useEffect, useState } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store';

/** True only when the Supabase public env vars are present at build time. */
export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export interface CurrentUser {
  id?: string;
  email: string;
  /** Display name (may be empty — we do not ask for it at sign-up). */
  name: string;
  firstName?: string;
  lastName?: string;
  source: 'supabase' | 'legacy';
}

function splitName(full: string) {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
  };
}

function toCurrentUser(u: SupabaseUser): CurrentUser {
  const meta = (u.user_metadata ?? {}) as Record<string, string>;
  const full = meta.full_name || meta.name || '';
  const { firstName, lastName } = splitName(full);
  return {
    id: u.id,
    email: u.email ?? '',
    name: full,
    firstName,
    lastName,
    source: 'supabase',
  };
}

/**
 * Single source of truth for "who is signed in".
 *
 * With Supabase configured it tracks the real session (set-cookie based, so no
 * tokens live in localStorage). If Supabase is not configured it falls back to
 * the legacy Zustand store so the app keeps working in sample-data mode.
 */
export function useCurrentUser(): { user: CurrentUser | null; loading: boolean } {
  const storeUser = useAuthStore((s) => s.user);
  const storeAuthed = useAuthStore((s) => s.isAuthenticated);
  const [sbUser, setSbUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    const supabase = createClient();
    let active = true;

    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!active) return;
        setSbUser(data.user ?? null);
        setLoading(false);
      })
      .catch(() => active && setLoading(false));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setSbUser(session?.user ?? null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (isSupabaseConfigured) {
    return { user: sbUser ? toCurrentUser(sbUser) : null, loading };
  }

  const legacy =
    storeAuthed && storeUser
      ? {
          id: storeUser.id,
          email: storeUser.email,
          name: `${storeUser.firstName ?? ''} ${storeUser.lastName ?? ''}`.trim(),
          firstName: storeUser.firstName,
          lastName: storeUser.lastName,
          source: 'legacy' as const,
        }
      : null;

  return { user: legacy, loading: false };
}

/** Sign out of both Supabase and the legacy store. */
export async function signOut() {
  if (isSupabaseConfigured) {
    try {
      await createClient().auth.signOut();
    } catch {
      /* ignore network errors — we still clear local state */
    }
  }
  useAuthStore.getState().clearAuth();
}
