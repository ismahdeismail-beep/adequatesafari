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
- [x] Auth login/register templates refreshed: simpler, professional layout (icons, show/hide password, marketing copy with booking-as-guest note)
- [x] App icon set generated from the old website's own icon files (icon/apple-icon/favicon + web manifest)
- [x] App name / identification fixed — was showing "Book Your Safari", now "Adequate Safaris"
- [x] KSH/USD currency switcher; every price shown consistently in both currencies
- [x] Home page rebuilt: popular destinations, moving deal carousels, international packages, journal, FAQ accordion
- [x] Mobile quick-action bar (Call / WhatsApp / Book) on phones

## In Progress
- [x] Mobile quick actions: Call / WhatsApp / Book bar on phones (`MobileActionBar`)
- [x] Currency switcher in header (desktop + mobile menu) — KSH/USD
- [x] Improve mobile UX: login/register buttons sizing for phones
- [ ] Fix overlaying issues (z-index, modals, mobile nav, hero CTAs)
- [ ] Verify mobile menu works properly across devices
- [x] Auth flow verified end-to-end — email+password signup and sign-in both return a session (magic-link rate limit no longer blocks signup)

## Services/Features from Old Site
- [x] Compare the old site's menu/services against the app and close the gaps (see below)
- [x] Dedicated `/services` page — tailor-made planning, beach & coastal, fly-in safaris, mountain trekking, themed holidays, corporate & group travel, excursions, gorilla trekking, international holidays, transfers & hotel booking, car hire, visa/documents
- [x] `/offers` rebuilt to surface every live offer collection (residents, non-residents, themed, corporate, international) with KSH+USD prices
- [x] Safari **style** filter (Lodge, Camping, Flying, Trekking, Mountain climbing, Excursion, Cultural) — footer/deal `?style=` links now actually filter
- [x] "More than safari" services strip on the home page; Services added to header nav + footer
- [x] Contact form integration with Supabase (safari.contact_submissions)
- [x] Newsletter subscription (safari.newsletter_subscribers)
- [x] Guest booking flow with minimal PII — no account needed; only a contact email (+ optional phone)
- [x] Privacy-first traveller form — no ID/passport collected at booking (only names, optional DOB/nationality); inputs smoothed (autocomplete/inputMode/autocapitalize)
- [ ] Booking management UI improvements
- [ ] Remaining old-site gaps: blog article bodies migrated, site-wide search (now /search), multi-language (partial: new routes created; content depth still open)

## Supabase Integration
- [x] Schema created: profiles, bookings, passengers, contact_submissions, newsletter_subscribers
- [x] RLS policies configured
- [x] Wire booking submission to Supabase (`.schema('safari')`) — bookings + passengers saved on confirm; client-generated id so guests can book
- [x] Wire contact form to Supabase (safari.contact_submissions)
- [x] Wire newsletter to Supabase (safari.newsletter_subscribers)
- [x] Guest + signed-in booking both supported: guests can book (anon INSERT grants + `passengers_insert_guest` policy added); signed-in users get saved details + "My bookings"(RLS by `auth.uid()`/`auth.email()`)
- [ ] Anonymous inserts are open (spam risk) — add rate-limit / captcha or move creation to a server route with the service role

## Deployment & Testing
- [ ] Test on mobile devices (iOS/Android)
- [ ] Verify all pages load without console errors
- [ ] Type check/build verification
- [x] Update Vercel env vars if needed (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, +NEXT_PUBLIC_DEPOSIT_PERCENT)

## Low Priority
- [ ] Optional: passwordless sign-in (magic link / email OTP) as an alternative to email + password
- [ ] Improve error messages and loading states

## Auth / Signup (email + password)
- [x] Standard sign-up: email + password + confirm (`signUp`); Supabase `mailer_autoconfirm = true` so the account is usable immediately with no confirmation email
- [x] Standard sign-in: email + password (`signInWithPassword`), honours `?next=`
- [x] No magic-link dependency (avoids Supabase shared-email rate limit / spam-folder failure)
- [ ] Password reset ("forgot password") — needs SMTP configured (recovery email)
- [ ] Validate phone/email properly; don't require phone if not essential (booking-time)
- [x] Guest booking enabled without sign-in; account optional for tracking (bookings matched by email)

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
- [x] Site search (com_finder equivalent) — /search indexes safaris + deals + services; SearchSection on /safaris still safaris-only
- [x] Currency switcher (KSH/USD) — header switcher (desktop + mobile), prices rendered in both currencies
- [x] Home page — popular destinations, "Adequate Residents Deals" + "Adequate Non-Residents Specials" moving carousels, international packages, journal, FAQ accordion
- [x] Services — `/services` page (12 services) + "More than safari" strip on home + header/footer links
- [x] Offers — `/offers` now surfaces every live collection (residents, non-residents, themed, corporate, international) with prices
- [x] Safari style filter — Lodge/Camping/Flying/Trekking/Mountain climbing/Excursion/Cultural; `?style=` links now filter
- [x] App identity — web manifest + icon set generated from the old website's own files
- [ ] Deal prices — full KSH/USD table for every safari (specials carry the live pair; other safaris derive KSH at the fixed rate)
- [x] Guest booking ("Continue as Guest") — app now allows it: guests book + pay via paybill; sign-in optional (saves details, unlocks "My bookings")
- [ ] Deals taxonomy from /adequate-holiday-deals/ (15 destination groups: Mount Kenya, Maasai Mara, Naivasha, Amboseli, Watamu, Diani, Mombasa, South Africa, Seychelles, Mauritius, Maldives, Thailand, Malaysia, Bali, Dubai)
- [x] Non-resident landing pages: /kenya-short-stay-safari/, /tanzania-safaris-2/, /uganda-safari-tours/
- [ ] Multi-language support (template ships en-GB/es-ES/fr-FR/zh-CN strings)
- [ ] Admin area beyond profile (all bookings, safari management) — enforced by RLS
- [ ] API services not surfaced in the app: payments (M-Pesa/Stripe live), webhooks, agents/partner portal, content sync

## Config / Env to set before deploy
- [x] Vercel (booking app): NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SITE_URL set and deployed (commit 1c12d493)
- [x] Supabase Auth: Site URL = https://adequatesafari.vercel.app; redirect allowlist permissive so /auth/callback works
- [x] Supabase: `safari` schema exposed in API settings
- [ ] Supabase SMTP: still needed for password-reset emails and transactional booking confirmation (signup/sign-in no longer send email)
