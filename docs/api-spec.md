# API Specification — Adequate Safaris

## Base URL
```
Production:  https://api.adequatesafaris.com/v1
Staging:     https://api-staging.adequatesafaris.com/v1
Development: http://localhost:4000/v1
```

## Authentication

### JWT (Access Token)
```
Authorization: Bearer <access_token>
```
- Expires: 15 minutes
- Refresh token: HttpOnly cookie (30 days)

### API Key (Agent/Partner)
```
X-API-Key: adq_live_abc123...
```
- Scoped permissions per agent tier

## Rate Limits
| Endpoint | Limit | Window |
|----------|-------|--------|
| `/safaris` | 60 | minute |
| `/bookings` (create) | 10 | minute |
| `/payments` | 30 | minute |
| `/auth/*` | 5 | minute |
| Agent API | 120 | minute |

## Error Format
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": [
    { "field": "departure_date", "message": "Must be in the future" }
  ],
  "timestamp": "2026-01-15T10:30:00.000Z",
  "path": "/v1/bookings"
}
```

## Endpoints

### ──────────────────────────────────────────────
# SAFARI CATALOG
### ──────────────────────────────────────────────

#### List Safaris
```
GET /safaris
```
**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `type` | string | `lodge`, `camping`, `flying`, `trek` |
| `country` | string | `kenya`, `tanzania`, `uganda`, `rwanda` |
| `park` | string | Park alias (e.g., `masai-mara`) |
| `duration_min` | int | Minimum days |
| `duration_max` | int | Maximum days |
| `price_min` | number | Minimum base price (USD) |
| `price_max` | number | Maximum base price (USD) |
| `tier` | string | `budget`, `mid-range`, `luxury`, `premium` |
| `departure_from` | string | `nairobi`, `mombasa`, `kilimanjaro`, `enebbe` |
| `date_from` | date | Departure after (YYYY-MM-DD) |
| `date_to` | date | Departure before (YYYY-MM-DD) |
| `group_size` | int | Number of travelers |
| `lang` | string | `en`, `de`, `fr`, `zh`, `es` |
| `page` | int | Default: 1 |
| `limit` | int | Default: 12, max: 50 |
| `sort` | string | `price_asc`, `price_desc`, `duration`, `popularity`, `newest` |

**Response:**
```json
{
  "data": [
    {
      "id": 57,
      "title": "Lake Nakuru-Rhino Safari-Nairobi",
      "slug": "lake-nakuru-rhino-safari-nairobi",
      "type": "lodge",
      "duration_days": 3,
      "duration_nights": 2,
      "base_price": { "usd": 420, "kes": 60600 },
      "currency": "USD",
      "tier": "mid-range",
      "parks": ["lake-nakuru"],
      "country": "kenya",
      "departure_from": "nairobi",
      "accommodation_tier": "mid-range",
      "meal_plan": "fb",
      "transport": "4x4-landcruiser",
      "group_size_min": 2,
      "group_size_max": 7,
      "highlights": ["Rhino sanctuary", "Flamingo viewing", "Game drives"],
      "images": ["https://cdn.adequatesafaris.com/safaris/nakuru-1.webp"],
      "seo_title": "3-Day Lake Nakuru Rhino Safari | Adequate Safaris",
      "seo_description": "See rhinos at Lake Nakuru National Park on a 3-day lodge safari...",
      "availability": "available"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 47,
    "totalPages": 4,
    "filters": { "applied": { "country": "kenya" } }
  }
}
```

#### Get Safari Detail
```
GET /safaris/:id
```
**Response:** Full safari object with itinerary, includes/excludes, FAQ, reviews, related safaris.

#### Check Availability
```
GET /safaris/:id/availability?date=2026-07-15&adults=2&children=0
```
**Response:**
```json
{
  "date": "2026-07-15",
  "status": "available",  // available | limited | full | closed
  "price": { "usd": 450, "kes": 64935, "breakdown": {...} },
  "accommodation_options": [
    { "id": 78, "name": "Mara Intrepids Club", "tier": "luxury", "supplement_usd": 120 }
  ],
  "notes": "Migration season - book early"
}
```

### ──────────────────────────────────────────────
# PARKS & ACCOMMODATIONS
### ──────────────────────────────────────────────

```
GET /parks
GET /parks/:alias
GET /accommodations?park=masai-mara&tier=luxury
GET /accommodations/:id
```

### ──────────────────────────────────────────────
# BOOKING FLOW
### ──────────────────────────────────────────────

#### Create Booking (Hold Inventory)
```
POST /bookings
```
**Headers:** `Authorization: Bearer <token>` (optional for guest booking)
**Body:**
```json
{
  "safari_id": 57,
  "departure_date": "2026-07-15",
  "return_date": "2026-07-17",
  "adults": 2,
  "children": 1,
  "children_ages": [8],
  "accommodation_id": 78,
  "room_type": "Deluxe Tent",
  "special_requests": "Vegetarian meals, window seat",
  "agent_code": "AGT-2026-001"  // optional
}
```
**Response:**
```json
{
  "reference": "ADQ-2026-001234",
  "status": "pending",
  "expires_at": "2026-01-15T10:45:00Z",  // 15 min hold
  "pricing": {
    "base_usd": 450,
    "park_fees_usd": 120,
    "accommodation_supplement_usd": 120,
    "child_discount_usd": -50,
    "total_usd": 640,
    "total_kes": 92352,
    "currency": "USD",
    "exchange_rate": 144.3,
    "deposit_required_usd": 192  // 30%
  },
  "payment_methods": ["stripe", "mpesa", "bank_transfer"]
}
```

#### Get Booking
```
GET /bookings/:reference
```
**Headers:** `Authorization: Bearer <token>` (owner or agent)

#### Initiate Payment
```
POST /bookings/:reference/pay
```
**Body:**
```json
{
  "method": "mpesa",  // stripe | mpesa | bank_transfer
  "amount_usd": 192,  // deposit amount
  "phone_number": "+254712345678",  // required for M-Pesa
  "return_url": "https://book.adequatesafaris.com/booking/ADQ-2026-001234/success",
  "cancel_url": "https://book.adequatesafaris.com/booking/ADQ-2026-001234/cancel"
}
```
**Response (Stripe):**
```json
{ "payment_url": "https://checkout.stripe.com/pay/cs_test_...", "provider": "stripe" }
```
**Response (M-Pesa):**
```json
{ "checkout_request_id": "ws_CO_12345", "message": "STK push sent to +254712345678", "provider": "mpesa" }
```

#### M-Pesa Callback (Webhook)
```
POST /payments/mpesa/callback
```
**Body:** Safaricom Daraja callback payload
**Response:** `{ "ResultCode": 0, "ResultDesc": "Accepted" }`

#### Stripe Webhook
```
POST /payments/stripe/webhook
```
**Headers:** `Stripe-Signature: ...`

#### Download Voucher
```
GET /bookings/:reference/voucher?format=pdf
```
**Response:** PDF binary with `Content-Disposition: attachment`

### ──────────────────────────────────────────────
# ITINERARY BUILDER
### ──────────────────────────────────────────────

#### Create Session
```
POST /itinerary/sessions
```
**Body:**
```json
{
  "preferences": {
    "pace": "moderate",
    "budget_tier": "mid-range",
    "interests": ["wildlife", "photography"],
    "dates": { "start": "2026-07-15", "end": "2026-07-22" },
    "travelers": { "adults": 2, "children": 0 }
  }
}
```
**Response:**
```json
{
  "token": "itn_abc123xyz",
  "expires_at": "2026-01-22T10:30:00Z",
  "data": { "days": [], "preferences": {...} }
}
```

#### Update Session
```
PATCH /itinerary/sessions/:token
```
**Body:** Full or partial itinerary state (drag-drop updates)

#### Calculate Price
```
POST /itinerary/sessions/:token/price
```
**Response:**
```json
{
  "pricing": { "total_usd": 2850, "breakdown": [...] },
  "warnings": ["Park fees may increase July 1"],
  "suggestions": ["Add night in Naivasha to break journey"]
}
```

#### Convert to Booking
```
POST /itinerary/sessions/:token/book
```
**Body:** `{ "contact_email": "client@example.com", "agent_id": "..." }`
**Response:** Booking object (same as `POST /bookings`)

#### Export PDF
```
GET /itinerary/sessions/:token/pdf?lang=en
```

### ──────────────────────────────────────────────
# AGENT PORTAL
### ──────────────────────────────────────────────

#### Agent Login
```
POST /auth/agent/login
```
**Body:** `{ "email": "agent@example.com", "password": "..." }`
**Response:** `{ "access_token": "...", "refresh_token": "...", "agent": {...} }`

#### List Bookings
```
GET /agent/bookings?status=confirmed&date_from=2026-01-01&page=1&limit=20
```
**Headers:** `Authorization: Bearer <agent_token>`

#### Commission Report
```
GET /agent/commissions?period=2026-01&status=paid
```
**Response:**
```json {
  "summary": { "total_bookings": 12, "total_commission_usd": 3840, "pending_usd": 1200, "paid_usd": 2640 },
  "rows": [
    { "booking_ref": "ADQ-2026-001234", "client": "John Doe", "safari": "Masai Mara 3-Day", "departure": "2026-07-15", "commission_usd": 64, "status": "paid", "paid_at": "2026-01-20" }
  ]
}
```

#### Create Booking for Client
```
POST /agent/bookings
```
**Body:** Same as `POST /bookings` + `client_email`

### ──────────────────────────────────────────────
# AUTH (Shared)
### ──────────────────────────────────────────────

```
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/forgot-password
POST /auth/reset-password
GET  /auth/me
```

## Webhooks

| Event | Endpoint | Retry |
|-------|----------|-------|
| `booking.created` | `POST {webhook_url}/booking.created` | 3x (exp backoff) |
| `booking.confirmed` | `POST {webhook_url}/booking.confirmed` | 3x |
| `booking.cancelled` | `POST {webhook_url}/booking.cancelled` | 3x |
| `payment.completed` | `POST {webhook_url}/payment.completed` | 3x |
| `payment.failed` | `POST {webhook_url}/payment.failed` | 3x |
| `agent.commission.paid` | `POST {webhook_url}/agent.commission.paid` | 3x |

**Payload:**
```json
{
  "event": "booking.confirmed",
  "timestamp": "2026-01-15T10:30:00Z",
  "data": { "reference": "ADQ-2026-001234", ... }
}
```

## SDKs / Client Libraries

```bash
# JavaScript/TypeScript
npm install @adequate-safaris/safari-client

# Python
pip install adequate-safaris
```

```typescript
import { SafariClient } from '@adequate-safaris/safari-client';

const client = new SafariClient({ 
  apiKey: 'adq_live_...', 
  baseUrl: 'https://api.adequatesafaris.com/v1' 
});

const safaris = await client.safaris.list({ country: 'kenya', type: 'lodge' });
const booking = await client.bookings.create({ safari_id: 57, departure_date: '2026-07-15', ... });
const payment = await client.payments.initiate(booking.reference, { method: 'stripe' });
```

## Versioning
- URL versioning (`/v1/`, `/v2/`)
- Deprecation notice: 6 months
- Sunset header: `Sunset: Sat, 01 Jan 2027 00:00:00 GMT`