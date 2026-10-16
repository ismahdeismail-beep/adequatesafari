'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import type { Faq } from '@/lib/faqs';
import { cn } from '@/lib/utils';

/** Collapsible FAQ list used on the home page. */
export function FaqAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-white">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-safari-sand/40"
              >
                <span className="font-medium text-safari-dusk">{item.q}</span>
                <span
                  className={cn(
                    'grid h-7 w-7 shrink-0 place-items-center rounded-full transition-colors',
                    isOpen ? 'bg-primary-600 text-white' : 'bg-safari-sand text-safari-dusk'
                  )}
                  aria-hidden
                >
                  {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>
            </h3>
            <div
              className={cn(
                'grid transition-all duration-300',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-gray-600">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
