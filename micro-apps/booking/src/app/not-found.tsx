import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center pb-20 pt-32">
      <div className="container-custom text-center">
        <p className="font-heading text-6xl font-bold text-primary-600">404</p>
        <h1 className="mt-4 font-heading text-3xl font-bold text-safari-dusk">Page not found</h1>
        <p className="mt-3 text-gray-500">
          The page you’re looking for doesn’t exist — but the savannah is this way.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            Back home
          </Link>
          <Link
            href="/safaris"
            className="rounded-lg border border-gray-200 px-6 py-3 font-medium text-safari-dusk transition-colors hover:bg-gray-50"
          >
            Browse safaris
          </Link>
        </div>
      </div>
    </section>
  );
}
