import type { ReactNode } from 'react';

export function ContentPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="pb-20 pt-32">
      <div className="container-custom max-w-3xl">
        <h1 className="font-heading text-3xl font-bold text-safari-dusk sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 text-gray-500">{subtitle}</p>}
        <div className="mt-8 space-y-6 leading-relaxed text-gray-600 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-safari-dusk [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
          {children}
        </div>
      </div>
    </section>
  );
}
