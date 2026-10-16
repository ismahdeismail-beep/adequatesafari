'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  Smartphone,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { api, isApiConfigured } from '@/lib/api';
import { safariToDetail } from '@/lib/mappers';
import { getSampleSafari } from '@/lib/sample-data';
import { useBookingStore } from '@/lib/store';
import { useCurrentUser } from '@/lib/auth';
import { siteConfig } from '@/lib/site-config';
import { cn, generateBookingRef } from '@/lib/utils';
import { formatAmount as formatCurrency } from '@/lib/currency';
import type { Booking, PassengerFormData, Safari, SafariDate, SafariDetailData } from '@/types';

const STEPS = [
  { id: 'details', label: 'Dates & travellers', short: 'Dates' },
  { id: 'passengers', label: 'Traveller details', short: 'Travellers' },
  { id: 'payment', label: 'Review & confirm', short: 'Review' },
  { id: 'confirmation', label: 'Confirmed', short: 'Done' },
] as const;

type StepId = (typeof STEPS)[number]['id'];

function weekdayLabel(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Fallback departure for sample-data mode (no live API): next Monday at the card price. */
function synthesizeDate(safari: SafariDetailData): SafariDate | null {
  const price = safari.price ?? 0;
  if (!price) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const daysUntilMonday = (1 + 7 - now.getDay()) % 7 || 7;
  const start = new Date(now.getTime() + daysUntilMonday * 86400000);
  return {
    id: `preview-${safari.slug}`,
    safariId: safari.id ?? safari.slug,
    startDate: start.toISOString().slice(0, 10),
    endDate: start.toISOString().slice(0, 10),
    price,
    currency: safari.currency ?? 'USD',
    availability: 6,
    booked: 0,
    isGuaranteed: false,
    status: 'OPEN',
    available: 6,
  };
}

function Stepper({
  label,
  sub,
  value,
  min,
  max,
  disabled,
  onChange,
}: {
  label: string;
  sub?: string;
  value: number;
  min: number;
  max: number;
  disabled?: boolean;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-safari-dusk">{label}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Fewer ${label}`}
          disabled={disabled || value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-safari-dusk transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center text-lg font-bold text-safari-dusk">{value}</span>
        <button
          type="button"
          aria-label={`More ${label}`}
          disabled={disabled || value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-safari-dusk transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function PassengerForm({
  index,
  passenger,
  onChange,
}: {
  index: number;
  passenger: PassengerFormData;
  onChange: (patch: Partial<PassengerFormData>) => void;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="mb-3 font-semibold text-safari-dusk">
        Traveller {index + 1}
        {index === 0 && <span className="ml-2 text-xs font-normal text-gray-400">— lead traveller</span>}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">First name *</label>
          <input
            required
            value={passenger.firstName ?? ''}
            onChange={(e) => onChange({ firstName: e.target.value })}
            className="input-field"
            placeholder="First name"
            autoComplete={index === 0 ? 'given-name' : 'off'}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Last name *</label>
          <input
            required
            value={passenger.lastName ?? ''}
            onChange={(e) => onChange({ lastName: e.target.value })}
            className="input-field"
            placeholder="Last name"
            autoComplete={index === 0 ? 'family-name' : 'off'}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Date of birth</label>
          <input
            type="date"
            value={passenger.dateOfBirth ?? ''}
            onChange={(e) => onChange({ dateOfBirth: e.target.value || undefined })}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Nationality</label>
          <input
            value={passenger.nationality ?? ''}
            onChange={(e) => onChange({ nationality: e.target.value })}
            className="input-field"
            placeholder="e.g. Kenyan"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-500">Passport number</label>
          <input
            value={passenger.passportNumber ?? ''}
            onChange={(e) => onChange({ passportNumber: e.target.value })}
            className="input-field"
            placeholder="Passport / ID number"
          />
        </div>
      </div>
    </div>
  );
}

export function BookingFlow({ initialSlug }: { initialSlug: string }) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const isAuthenticated = Boolean(user);
  const {
    selectedSafariDate,
    passengers,
    bookingStep,
    currentBooking,
    setSelectedSafariDate: setSelectedDate,
    setPassengers,
    updatePassenger,
    setBookingStep,
    setCurrentBooking,
    resetBooking,
  } = useBookingStore();

  const [slug, setSlug] = useState(initialSlug);
  const [detail, setDetail] = useState<SafariDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    if (!isApiConfigured) {
      const sample = getSampleSafari(slug);
      if (!sample) {
        setLoadError('That safari could not be found.');
      } else {
        setDetail(sample);
        setIsPreview(true);
      }
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    api
      .getSafari(slug)
      .then((res) => {
        const item = (res?.data ?? res) as Safari | undefined;
        if (!item?.slug) throw new Error('missing safari');
        if (!cancelled) {
          setDetail(safariToDetail(item));
          setIsPreview(false);
        }
      })
      .catch(() => {
        const sample = getSampleSafari(slug);
        if (cancelled) return;
        if (!sample) {
          setLoadError('That safari could not be found.');
          return;
        }
        setDetail(sample);
        setIsPreview(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const dates = useMemo<SafariDate[]>(() => {
    if (!detail) return [];
    const list = detail.dates ?? [];
    if (list.length > 0) return list;
    const synthetic = synthesizeDate(detail);
    return synthetic ? [synthetic] : [];
  }, [detail]);

  const upcoming = useMemo(() => {
    const now = Date.now();
    return dates
      .filter((d) => d.status === 'OPEN' || d.status === 'GUARANTEED')
      .filter((d) => new Date(d.startDate).getTime() > now - 86400000)
      .sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate));
  }, [dates]);

  // Auto-select the soonest departure so the price is always visible.
  useEffect(() => {
    if (upcoming.length === 0) return;
    if (!selectedSafariDate || !upcoming.some((d) => d.id === selectedSafariDate.id)) {
      setSelectedDate(upcoming[0]);
    }
  }, [upcoming, selectedSafariDate, setSelectedDate]);

  const travellers = adults + children;
  const rate = selectedSafariDate?.price ?? 0;
  const currency = selectedSafariDate?.currency ?? detail?.currency ?? 'USD';
  const total = rate * travellers;

  const passengersValid =
    passengers.length === travellers &&
    passengers.every((p) => p.firstName?.trim() && p.lastName?.trim());

  const goToPassengers = () => {
    setPassengers(
      Array.from(
        { length: travellers },
        (_, i) =>
          passengers[i] ?? {
            firstName: i === 0 ? user?.firstName ?? '' : '',
            lastName: i === 0 ? user?.lastName ?? '' : '',
            isLead: i === 0,
          },
      ),
    );
    setBookingStep('passengers');
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detail || !selectedSafariDate) return;

    if (!isPreview && !isAuthenticated) {
      const next = encodeURIComponent(`/booking/new?safari=${detail.slug}`);
      router.push(`/auth/login?next=${next}`);
      return;
    }

    setIsSubmitting(true);
    try {
      let booking: Booking;
      if (isPreview) {
        const now = new Date().toISOString();
        booking = {
          id: `preview-${Date.now()}`,
          bookingRef: generateBookingRef(),
          userId: user?.id ?? 'guest',
          safariId: detail.id ?? detail.slug,
          safariDateId: selectedSafariDate.id,
          status: 'PENDING',
          paymentStatus: 'UNPAID',
          adults,
          children,
          specialRequests: specialRequests || undefined,
          totalAmount: total,
          currency,
          commissionPaid: false,
          createdAt: now,
          updatedAt: now,
          payments: [],
          passengers: passengers.map((p, i) => ({
            id: `preview-p-${i}`,
            bookingId: `preview-${Date.now()}`,
            firstName: p.firstName,
            lastName: p.lastName,
            dateOfBirth: p.dateOfBirth,
            passportNumber: p.passportNumber,
            nationality: p.nationality,
            specialNeeds: p.specialNeeds,
            isLead: i === 0,
          })),
        };
      } else {
        const res = await api.createBooking({
          safariId: detail.id as string,
          safariDateId: selectedSafariDate.id,
          adults,
          children,
          specialRequests: specialRequests || undefined,
          passengers: passengers.map((p, i) => ({
            firstName: p.firstName,
            lastName: p.lastName,
            dateOfBirth: p.dateOfBirth,
            passportNumber: p.passportNumber,
            nationality: p.nationality,
            specialNeeds: p.specialNeeds,
            isLead: i === 0,
          })),
        });
        booking = (res?.data ?? res) as Booking;
      }
      setCurrentBooking(booking);
      setBookingStep('confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.success('Booking received — we’ll confirm availability shortly.');
    } catch {
      toast.error('We could not create the booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startNewBooking = () => {
    resetBooking();
    setAdults(2);
    setChildren(0);
    setSpecialRequests('');
  };

  const stepIndex = STEPS.findIndex((s) => s.id === bookingStep);

  const pricePanel = (
    <aside className="lg:col-span-1">
      <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Your trip</p>
        {detail ? (
          <Link
            href={`/safaris/${detail.slug}`}
            className="mt-1 block font-heading text-lg font-bold text-safari-dusk hover:text-primary-600"
          >
            {detail.title}
          </Link>
        ) : (
          <p className="mt-1 text-sm text-gray-500">Loading safari…</p>
        )}

        <div className="mt-4 space-y-2.5 border-y border-gray-100 py-4 text-sm">
          <div className="flex items-start justify-between gap-3">
            <span className="text-gray-500">Departure</span>
            <span className="text-right font-medium text-safari-dusk">
              {selectedSafariDate ? (
                <>
                  {weekdayLabel(selectedSafariDate.startDate)}
                  {selectedSafariDate.isGuaranteed && (
                    <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-wide text-emerald-600">
                      Guaranteed departure
                    </span>
                  )}
                </>
              ) : (
                <span className="text-gray-400">Select a date</span>
              )}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Per person</span>
            <span className="font-semibold text-safari-dusk">{formatCurrency(rate, currency)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Adults ({adults})</span>
            <span className="text-safari-dusk">{formatCurrency(rate * adults, currency)}</span>
          </div>
          {children > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Children ({children})</span>
              <span className="text-safari-dusk">{formatCurrency(rate * children, currency)}</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-end justify-between">
          <span className="text-sm font-medium text-gray-500">Trip total</span>
          <span className="font-heading text-2xl font-bold text-safari-dusk">
            {formatCurrency(total, currency)}
          </span>
        </div>
        {rate > 0 && (
          <p className="mt-1 text-right text-xs text-gray-400">per person {formatCurrency(rate, currency)}</p>
        )}

        {bookingStep !== 'confirmation' && (
          <p className="mt-4 flex items-start gap-1.5 text-xs text-gray-400">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            No payment now — your total is fixed here, and we confirm availability before invoicing.
          </p>
        )}
      </div>
    </aside>
  );

  if (loading) {
    return (
      <section className="pb-20 pt-32">
        <div className="container-custom max-w-5xl">
          <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
        </div>
      </section>
    );
  }

  if (!slug || loadError || !detail) {
    return (
      <section className="pb-20 pt-32">
        <div className="container-custom text-center">
          <h1 className="font-heading text-3xl font-bold text-safari-dusk">Book a safari</h1>
          <p className="mt-3 text-gray-500">
            {loadError ? 'That safari could not be found.' : 'Choose a safari to start booking — you’ll see the full price before you confirm.'}
          </p>
          <Link href="/safaris" className="btn-primary mt-6 inline-block">
            Browse all safaris
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-20 pt-28">
      <div className="container-custom max-w-6xl">
        {/* Step rail */}
        <ol className="mb-8 flex items-center gap-2 overflow-x-auto">
          {STEPS.map((step, i) => {
            const active = i === stepIndex;
            const done = i < stepIndex;
            return (
              <li key={step.id} className="flex items-center gap-2">
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    done && 'bg-emerald-500 text-white',
                    active && 'bg-primary-600 text-white',
                    !done && !active && 'border border-gray-200 bg-white text-gray-400',
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span
                  className={cn(
                    'whitespace-nowrap text-xs font-medium',
                    active || done ? 'text-safari-dusk' : 'text-gray-400',
                  )}
                >
                  {step.label}
                </span>
                {i < STEPS.length - 1 && <span className="h-px w-5 bg-gray-200 sm:w-8" />}
              </li>
            );
          })}
        </ol>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {bookingStep === 'details' && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-heading text-2xl font-bold text-safari-dusk">
                    Pick your departure
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Every departure shows its own per-person price. Choose a date, then how many are travelling.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {upcoming.map((d) => {
                    const available = (d.available ?? d.availability ?? 0) - (d.booked ?? 0);
                    const soldOut = available <= 0;
                    const selected = selectedSafariDate?.id === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        disabled={soldOut}
                        onClick={() => setSelectedDate(d)}
                        className={cn(
                          'rounded-xl border-2 bg-white p-4 text-left transition-all',
                          selected ? 'border-primary-600 shadow-md' : 'border-gray-100 hover:border-gray-200',
                          soldOut && 'cursor-not-allowed opacity-50',
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-semibold text-safari-dusk">
                            {weekdayLabel(d.startDate)}
                            {d.isGuaranteed && (
                              <span className="ml-2 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                                Guaranteed
                              </span>
                            )}
                          </span>
                          {selected && <Check className="h-4 w-4 shrink-0 text-primary-600" />}
                        </div>
                        <div className="mt-2 flex items-end justify-between gap-2">
                          <span className="text-xs text-gray-400">
                            {soldOut
                              ? 'Sold out'
                              : available <= 3
                                ? `Only ${available} ${available === 1 ? 'place' : 'places'} left`
                                : `${available} places available`}
                          </span>
                          <span className="whitespace-nowrap font-heading text-lg font-bold text-safari-dusk">
                            {formatCurrency(d.price, d.currency ?? currency)}
                            <span className="ml-1 text-[11px] font-normal text-gray-400">/ person</span>
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-400">
                  Showing {upcoming.length} upcoming {upcoming.length === 1 ? 'departure' : 'departures'} — new dates are released continuously.
                </p>

                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="mb-4 flex items-center gap-2 font-medium text-safari-dusk">
                    <Users className="h-4 w-4" /> How many are travelling?
                  </p>
                  <div className="space-y-4">
                    <Stepper label="Adults" sub="Ages 13 and over" value={adults} min={1} max={12} onChange={setAdults} />
                    <Stepper label="Children" sub="Ages 2–12 — same per-person rate, discounts on request" value={children} min={0} max={12} onChange={setChildren} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    href={`/safaris/${detail.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-safari-dusk"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to safari
                  </Link>
                  <button
                    type="button"
                    disabled={!selectedSafariDate}
                    onClick={goToPassengers}
                    className={cn('btn-primary', !selectedSafariDate && 'cursor-not-allowed opacity-50')}
                  >
                    Continue — traveller details <ArrowRight className="ml-1 inline h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {bookingStep === 'passengers' && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-heading text-2xl font-bold text-safari-dusk">
                    Who is travelling?
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    {travellers} {travellers === 1 ? 'traveller' : 'travellers'} at{' '}
                    {formatCurrency(rate, currency)} per person — total{' '}
                    <span className="font-semibold text-safari-dusk">{formatCurrency(total, currency)}</span>.
                  </p>
                </div>

                <div className="space-y-4">
                  {Array.from({ length: travellers }, (_, i) => (
                    <PassengerForm
                      key={i}
                      index={i}
                      passenger={passengers[i] ?? { firstName: '', lastName: '', isLead: i === 0 }}
                      onChange={(patch) => updatePassenger(i, patch)}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setBookingStep('details')}
                    className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-safari-dusk"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to dates
                  </button>
                  <button
                    type="button"
                    disabled={!passengersValid}
                    onClick={() => setBookingStep('payment')}
                    className={cn('btn-primary', !passengersValid && 'cursor-not-allowed opacity-50')}
                  >
                    Review &amp; confirm <ArrowRight className="ml-1 inline h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {bookingStep === 'payment' && (
              <form onSubmit={handleConfirm} className="space-y-6">
                <div>
                  <h1 className="font-heading text-2xl font-bold text-safari-dusk">Review your booking</h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Here is the full price for your trip — nothing changes later.
                  </p>
                </div>

                {/* Final price breakdown */}
                <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                  <div className="border-b border-gray-100 bg-gray-50 px-5 py-3">
                    <p className="text-sm font-semibold text-safari-dusk">Price summary</p>
                  </div>
                  <dl className="divide-y divide-gray-100 px-5">
                    <div className="flex items-center justify-between py-3 text-sm">
                      <dt className="text-gray-500">Safari</dt>
                      <dd className="text-right font-medium text-safari-dusk">{detail.title}</dd>
                    </div>
                    <div className="flex items-center justify-between py-3 text-sm">
                      <dt className="text-gray-500">Departure</dt>
                      <dd className="text-right font-medium text-safari-dusk">
                        {weekdayLabel(selectedSafariDate?.startDate ?? '')}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-3 text-sm">
                      <dt className="text-gray-500">Per-person rate</dt>
                      <dd className="text-right font-semibold text-safari-dusk">
                        {formatCurrency(rate, currency)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-3 text-sm">
                      <dt className="text-gray-500">
                        {adults} × adult{adults === 1 ? '' : 's'}
                      </dt>
                      <dd className="text-right text-safari-dusk">{formatCurrency(rate * adults, currency)}</dd>
                    </div>
                    {children > 0 && (
                      <div className="flex items-center justify-between py-3 text-sm">
                        <dt className="text-gray-500">
                          {children} × child{children === 1 ? '' : 'ren'}
                        </dt>
                        <dd className="text-right text-safari-dusk">{formatCurrency(rate * children, currency)}</dd>
                      </div>
                    )}
                    <div className="flex items-center justify-between bg-safari-sand/50 py-3 text-sm">
                      <dt className="font-semibold text-safari-dusk">Total</dt>
                      <dd className="font-heading text-xl font-bold text-safari-dusk">
                        {formatCurrency(total, currency)}
                      </dd>
                    </div>
                  </dl>
                  <p className="border-t border-gray-100 px-5 py-3 text-xs text-gray-400">
                    Rates are per person for all travellers. Family or child discounts are applied on
                    request at confirmation. Payment is taken only after we confirm availability.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="mb-3 text-sm font-semibold text-safari-dusk">Travellers</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {passengers.map((p, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                        {p.firstName} {p.lastName}
                        {p.nationality && <span className="text-gray-400">· {p.nationality}</span>}
                        {i === 0 && <span className="text-xs text-gray-400">(lead)</span>}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <label htmlFor="specialRequests" className="mb-1 block text-sm font-semibold text-safari-dusk">
                    Special requests <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    id="specialRequests"
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Dietary needs, hotel preferences, anniversary surprises…"
                  />
                </div>

                {isPreview && (
                  <p className="flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    <InfoIcon />
                    You’re on the demo catalog. Create an account to save real bookings — your price is
                    still shown here in full.
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setBookingStep('passengers')}
                    className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-safari-dusk"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button type="submit" disabled={isSubmitting} className="btn-primary">
                    {isSubmitting ? (
                      'Creating booking…'
                    ) : (
                      <>
                        <Lock className="mr-1 inline h-4 w-4" />
                        Confirm booking — {formatCurrency(total, currency)}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {bookingStep === 'confirmation' && currentBooking && (
              <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="h-7 w-7 text-emerald-600" />
                </span>
                <h1 className="mt-4 font-heading text-2xl font-bold text-safari-dusk">
                  Booking received!
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Reference{' '}
                  <span className="font-mono font-semibold text-safari-dusk">{currentBooking.bookingRef}</span>
                  {isPreview && (
                    <span className="ml-2 rounded bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                      preview
                    </span>
                  )}
                </p>

                <dl className="mx-auto mt-6 max-w-sm space-y-2.5 rounded-xl bg-gray-50 p-5 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-gray-500">Departure</dt>
                    <dd className="font-medium text-safari-dusk">
                      {weekdayLabel(currentBooking.safariDate?.startDate ?? selectedSafariDate?.startDate ?? '')}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-gray-500">Travellers</dt>
                    <dd className="font-medium text-safari-dusk">
                      {currentBooking.adults} adult{currentBooking.adults === 1 ? '' : 's'}
                      {currentBooking.children > 0 && (
                        <>
                          {' '}
                          + {currentBooking.children} child{currentBooking.children === 1 ? '' : 'ren'}
                        </>
                      )}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-2.5">
                    <dt className="font-semibold text-safari-dusk">Total</dt>
                    <dd className="font-heading text-xl font-bold text-safari-dusk">
                      {formatCurrency(currentBooking.totalAmount, currentBooking.currency ?? currency)}
                    </dd>
                  </div>
                </dl>

                <div className="mx-auto mt-6 max-w-sm text-left">
                  <p className="text-sm font-semibold text-safari-dusk">What happens next</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-gray-500">
                    <li>● We confirm availability within 24 hours.</li>
                    <li>● You’ll receive an invoice with M-Pesa, card and bank-transfer options.</li>
                    <li>● Your booking is confirmed once the deposit is received.</li>
                  </ul>
                </div>

                {siteConfig.paybill && (
                  <div className="mx-auto mt-6 max-w-sm rounded-xl border border-primary-100 bg-primary-50/60 p-4 text-left">
                    <p className="flex items-center gap-2 text-sm font-semibold text-safari-dusk">
                      <Smartphone className="h-4 w-4 text-primary-600" />
                      Pay your deposit via M-Pesa
                    </p>
                    <dl className="mt-3 space-y-1.5 text-sm">
                      <div className="flex items-center justify-between">
                        <dt className="text-gray-500">Paybill number</dt>
                        <dd className="font-mono font-semibold text-safari-dusk">{siteConfig.paybill}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-gray-500">Account number</dt>
                        <dd className="font-mono font-semibold text-safari-dusk">
                          {siteConfig.paybillAccount || currentBooking.bookingRef}
                        </dd>
                      </div>
                    </dl>
                    <p className="mt-2 text-xs text-gray-500">
                      In M-Pesa: Lipa na M-Pesa → Pay Bill → enter the paybill above, then use your
                      reference <span className="font-mono">{currentBooking.bookingRef}</span> as the
                      account number. Share the confirmation message with us to lock in your dates.
                    </p>
                  </div>
                )}

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href={isAuthenticated ? '/booking/my-bookings' : '/auth/register'}
                    className="btn-primary"
                  >
                    {isAuthenticated ? 'View my bookings' : 'Create an account to save this booking'}
                  </Link>
                  <button type="button" onClick={startNewBooking} className="btn-secondary">
                    Book another safari
                  </button>
                </div>
              </div>
            )}
          </div>

          {pricePanel}
        </div>
      </div>
    </section>
  );
}

function InfoIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
    </svg>
  );
}