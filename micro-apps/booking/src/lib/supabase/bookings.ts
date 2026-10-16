'use client';

import { createClient } from '@/lib/supabase/client';
import type { Booking, SafariDate } from '@/types';

/**
 * Persistence for real bookings in the isolated `safari` schema.
 *
 * The database is the single source of truth for bookings: a signed-in user's
 * row carries their auth id, so it can be listed back to them in "My bookings".
 * Row-level security already scopes reads/writes to the owner (`auth.uid()` or
 * a matching `email`), so these queries never need an explicit user filter.
 */
const SCHEMA = 'safari';

export interface NewBookingInput {
  /** Safari slug (the catalog is static, so the slug is the stable identifier). */
  safariId: string;
  startDate?: string | null;
  endDate?: string | null;
  guests: number;
  totalAmount: number;
  currency: string;
  specialRequests?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  passengers: Array<{
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    nationality?: string;
    passportNumber?: string;
    specialNeeds?: string;
  }>;
}

/** Short human-friendly reference derived from the booking uuid. */
export function bookingRefFromId(id: string): string {
  return `ADQ-${id.replace(/-/g, '').slice(0, 8).toUpperCase()}`;
}

interface BookingRow {
  id: string;
  user_id: string | null;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  safari_id: string | null;
  start_date: string | null;
  end_date: string | null;
  guests: number | null;
  total_amount: number | string | null;
  currency: string | null;
  status: string | null;
  special_requests: string | null;
  created_at: string;
  updated_at: string;
}

function toSafariDate(row: BookingRow, currency: string): SafariDate | undefined {
  if (!row.start_date) return undefined;
  return {
    id: `${row.id}:date`,
    safariId: row.safari_id ?? '',
    startDate: row.start_date,
    endDate: row.end_date ?? row.start_date,
    price: 0,
    currency,
    availability: 0,
    booked: 0,
    isGuaranteed: false,
    status: 'OPEN',
  };
}

/** Map a database row onto the app's `Booking` shape used by the UI. */
export function mapBookingRow(row: BookingRow): Booking {
  const currency = row.currency ?? 'USD';
  return {
    id: row.id,
    bookingRef: bookingRefFromId(row.id),
    userId: row.user_id ?? '',
    safariId: row.safari_id ?? '',
    safariDateId: '',
    status: (row.status ?? 'pending').toUpperCase() as Booking['status'],
    paymentStatus: 'UNPAID',
    adults: row.guests ?? 1,
    children: 0,
    specialRequests: row.special_requests ?? undefined,
    totalAmount: Number(row.total_amount ?? 0),
    currency,
    commissionPaid: false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    payments: [],
    passengers: [],
    safariDate: toSafariDate(row, currency),
  };
}

/** Create a booking (and its passengers) for the current user, guest included. */
export async function createBooking(input: NewBookingInput): Promise<Booking> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Generate the id on the client so a guest can book (anonymous inserts are
  // allowed but cannot read the row back — no SELECT policy matches a guest).
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const now = new Date().toISOString();
  const userId = user?.id ?? null;

  const row: BookingRow = {
    id,
    user_id: userId,
    email: input.email,
    first_name: input.firstName,
    last_name: input.lastName,
    phone: input.phone ?? null,
    safari_id: input.safariId,
    start_date: input.startDate ?? null,
    end_date: input.endDate ?? null,
    guests: input.guests,
    total_amount: input.totalAmount,
    currency: input.currency,
    status: 'pending',
    special_requests: input.specialRequests ?? null,
    created_at: now,
    updated_at: now,
  };

  const { error } = await supabase.schema(SCHEMA).from('bookings').insert(row);
  if (error) throw error;

  if (input.passengers.length > 0) {
    const { error: paxError } = await supabase
      .schema(SCHEMA)
      .from('passengers')
      .insert(
        input.passengers.map((p) => ({
          booking_id: id,
          first_name: p.firstName,
          last_name: p.lastName,
          date_of_birth: p.dateOfBirth ?? null,
          nationality: p.nationality ?? null,
          passport_number: p.passportNumber ?? null,
          special_needs: p.specialNeeds ?? null,
        }))
      );
    if (paxError) throw paxError;
  }

  return mapBookingRow(row);
}

/** List the current user's bookings, newest first (RLS scopes to the owner). */
export async function getMyBookings(): Promise<Booking[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .schema(SCHEMA)
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return ((data ?? []) as BookingRow[]).map(mapBookingRow);
}

/** Cancel one of the current user's bookings. */
export async function cancelMyBooking(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .schema(SCHEMA)
    .from('bookings')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}
