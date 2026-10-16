'use client';

import { ReactNode } from 'react';
import { CurrencyProvider } from '@/components/CurrencyContext';

export function Providers({ children }: { children: ReactNode }) {
  return <CurrencyProvider>{children}</CurrencyProvider>;
}
