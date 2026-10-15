# Adequate Safaris - TODO

## High Priority
- [x] Wire responsive card/hero images, add destinations/blog/account pages
- [x] Fix API opt-in to eliminate console errors
- [x] Regenerate image variants; build green
- [x] Push new photos and code
- [x] Supabase setup: created dedicated `safari` schema, exposed schema, RLS + policies
- [x] Supabase token stored securely (~/supabase-ops, Desktop/supabase-ops)
- [x] Add @supabase/ssr and @supabase/supabase-js
- [x] Set app icon to Adequate Safaris logo (favicon + manifest icons)
- [x] Add Supabase SSR clients, magic-link login (OTP), auth callback
- [x] Magic-link login flow integrated

## In Progress
- [ ] Improve mobile UX: login/register buttons sizing for phones
- [ ] Fix overlaying issues (z-index, modals, mobile nav, hero CTAs)
- [ ] Verify mobile menu works properly across devices
- [ ] Test OTP flow end-to-end with Supabase

## Services/Features from Old Site
- [ ] Compare and restore missing services/features from Joomla site
- [ ] Contact form integration with Supabase (safari.contact_submissions)
- [ ] Newsletter subscription (safari.newsletter_subscribers)
- [ ] Guest booking flow with minimal PII
- [ ] Booking management UI improvements

## Supabase Integration
- [x] Schema created: profiles, bookings, passengers, contact_submissions, newsletter_subscribers
- [x] RLS policies configured
- [ ] Wire booking submission to Supabase (use .schema('safari'))
- [ ] Wire contact form to Supabase
- [ ] Wire newsletter to Supabase
- [ ] Test authenticated vs guest booking flows

## Deployment & Testing
- [ ] Test on mobile devices (iOS/Android)
- [ ] Verify all pages load without console errors
- [ ] Type check/build verification
- [ ] Update Vercel env vars if needed (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)

## Low Priority
- [ ] Remove password-based login entirely (keep magic link only) - user choice pending
- [ ] Add passwordless registration flow
- [ ] Improve error messages and loading states
