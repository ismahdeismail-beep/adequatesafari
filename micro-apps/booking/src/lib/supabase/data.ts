'use client';

import { createClient } from '@/lib/supabase/client';

const SCHEMA = 'safari';

/** All Adequate Safaris data lives in a dedicated `safari` Postgres schema. */
function db() {
  return createClient().schema(SCHEMA);
}

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
}

export async function upsertProfile(row: ProfileRow) {
  const { error } = await db()
    .from('profiles')
    .upsert({ ...row, updated_at: new Date().toISOString() }, { onConflict: 'id' });
  if (error) throw error;
}

export async function getProfile(id: string): Promise<ProfileRow | null> {
  const { data, error } = await db().from('profiles').select('id,email,full_name').eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as ProfileRow) ?? null;
}

export interface ContactInput {
  email: string;
  name?: string;
  message: string;
}

export async function submitContact(input: ContactInput) {
  const { error } = await db().from('contact_submissions').insert({
    email: input.email,
    name: input.name ?? null,
    message: input.message,
  });
  if (error) throw error;
}

export async function subscribeNewsletter(email: string, source = 'website') {
  const { error } = await db()
    .from('newsletter_subscribers')
    .upsert({ email, source }, { onConflict: 'email', ignoreDuplicates: true });
  if (error) throw error;
}

export interface BookingInput {
  user_id?: string | null;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  safari_id?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  guests?: number;
  total_amount?: number | null;
  currency?: string;
  special_requests?: string | null;
}

/** Create a booking (+ optional passengers) in one round trip. */
export async function createBooking(
  input: BookingInput,
  passengers: Array<Record<string, unknown>> = []
) {
  const { data, error } = await db().from('bookings').insert(input).select('id').single();
  if (error) throw error;
  const bookingId = (data as { id: string }).id;

  if (passengers.length) {
    const rows = passengers.map((p) => ({ ...p, booking_id: bookingId }));
    const { error: pErr } = await db().from('passengers').insert(rows);
    if (pErr) throw pErr;
  }
  return bookingId;
}
