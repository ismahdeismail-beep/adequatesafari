'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'adq-cookie-consent';

/**
 * Cookie consent banner. Essential cookies are always allowed (they keep you
 * signed in); this records the visitor's choice for anything non-essential.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      /* storage blocked — stay hidden rather than nag */
    }
  }, []);

  const choose = (value: 'accepted' | 'declined') => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-gray-200 bg-white/98 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur sm:p-5"
    >
      <div className="container-custom flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">
          We use essential cookies to keep you signed in, and optional ones to understand how the
          site is used. Read our{' '}
          <Link href="/privacy" className="font-medium text-primary-600 underline hover:text-primary-700">
            privacy policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => choose('declined')}
            className="btn btn-outline min-h-[44px] px-4"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => choose('accepted')}
            className="btn btn-primary min-h-[44px] px-4"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
