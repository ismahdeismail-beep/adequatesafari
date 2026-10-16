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
- [x] App icon set generated from the old website's own icon files (icon/apple-icon/favicon + web manifest)
- [x] App name / identification fixed — was showing "Book Your Safari", now "Adequate Safaris"
- [x] KSH/USD currency switcher; every price shown consistently in both currencies
- [x] Home page rebuilt: popular destinations, moving deal carousels, international packages, journal, FAQ accordion
- [x] Mobile quick-action bar (Call / WhatsApp / Book) on phones

## In Progress
- [x] Mobile quick actions: Call / WhatsApp / Book bar on phones (`MobileActionBar`)
- [x] Currency switcher in header (desktop + mobile menu) — KSH/USD
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

## Auth / Signup (email-only + minimal data)
- [ ] Review signup page fields (limit PII). Currently requires: firstName, lastName, email, password, phone. With magic link approach, prefer email-only signup; move name/phone to booking if needed.
- [ ] Add "Sign up with Magic Link" alternative on register page
- [ ] Remove password requirement if moving to OTP-only
- [ ] Enforce minimal data: collect only what's necessary
- [ ] Validate phone/email properly; don't require phone if not essential
- [ ] Consider guest booking without account

## Communication & Business Email
- [ ] Design a single "business inbox" address that all site communication funnels through (e.g. bookings@ / hello@) — decide the address and provider
- [ ] Send transactional email: booking confirmation, magic-link delivery, contact-form acknowledgement, newsletter welcome
- [ ] Wire Supabase Auth SMTP (custom SMTP so magic links come from the business domain, not Supabase)
- [ ] Reply-to / from alignment (SPF, DKIM, DMARC) for the business domain
- [ ] Route contact submissions + booking notifications to the shared inbox
- [ ] Templates: confirmation, reminder, cancellation, enquiry auto-reply

## Content (information) — separate workstream
- [ ] Audit real content vs placeholder copy: safaris, destinations, about, FAQ, offers, blog, policies
- [ ] Source and enter real tour descriptions, itineraries, inclusions/exclusions, pricing
- [ ] Replace placeholder testimonial/blog text
- [ ] Confirm contact details, office address, phone, opening hours
- [ ] Review legal pages (terms, privacy) against actual data practices
- [ ] SEO: titles, meta descriptions, OG images per page

## Services provided but NOT yet built/pushed (from the old Joomla / WordPress site)
- [x] Topbar (contact strip: phone / email) — in Header, env-driven
- [x] Cookie consent banner — CookieConsent, localStorage + /privacy link
- [x] Photo gallery — /gallery with lightbox
- [x] Breadcrumbs on inner pages — Breadcrumbs, auto-derived + in ContentPage
- [x] Deal collections — /deals: Diani, Mombasa, Mara daily departures, corporate, themed, non-residents
- [x] Adequate Specials — /deals/specials (10 KSH-priced short breaks)
- [x] International — /deals/international (14 destinations, incl. Dubai, Bali, Europe, China, USA)
- [x] Blog listing — /blog rebuilt as the live 3-column journal (10 camp/lodge write-ups)
- [ ] Blog article bodies — cards currently link out to WordPress; migrate the text
- [ ] Site search (com_finder equivalent) — SearchSection searches safaris only
- [x] Currency switcher (KSH/USD) — header switcher (desktop + mobile), prices rendered in both currencies
- [x] Home page — popular destinations, "Adequate Residents Deals" + "Adequate Non-Residents Specials" moving carousels, international packages, journal, FAQ accordion
- [x] App identity — web manifest + icon set generated from the old website's own files
- [ ] Deal prices — full KSH/USD table for every safari (specials carry the live pair; other safaris derive KSH at the fixed rate)
- [ ] Guest booking ("Continue as Guest") — live site offers it, app requires sign-in
- [ ] Deals taxonomy from /adequate-holiday-deals/ (15 destination groups: Mount Kenya, Maasai Mara, Naivasha, Amboseli, Watamu, Diani, Mombasa, South Africa, Seychelles, Mauritius, Maldives, Thailand, Malaysia, Bali, Dubai)
- [ ] Non-resident landing pages: /kenya-short-stay-safari/, /tanzania-safaris-2/, /uganda-safari-tours/
- [ ] Multi-language support (template ships en-GB/es-ES/fr-FR/zh-CN strings)
- [ ] Admin area beyond profile (all bookings, safari management) — enforced by RLS
- [ ] API services not surfaced in the app: payments (M-Pesa/Stripe live), webhooks, agents/partner portal, content sync

## Config / Env to set before deploy
- [ ] Vercel (booking app): NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SITE_URL
- [ ] Supabase Auth: Site URL + Redirect URLs include /auth/callback
- [ ] Supabase: expose `safari` schema in API settings (confirm saved)
