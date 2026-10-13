# Data Model — Adequate Safaris

## Core Entities (Joomla Custom Fields + Micro-app Tables)

### 1. Safari Package (`#__content` + Custom Fields)
```yaml
# Joomla Article (catid=17 "Kenya Lodge Safaris", etc.)
title: "Masai Mara – Big Game Safari"
alias: "masai-mara-big-game-safari"
catid: 17
state: 1
featured: 0
language: "en-GB"

# Custom Fields (com_fields)
custom_fields:
  safari_type: "lodge"              # lodge | camping | flying | trek
  duration_days: 3
  duration_nights: 2
  base_price_usd: 450
  base_price_kes: 65000
  currency: "USD"
  parks: ["masai-mara"]             # Multi-select from Parks taxonomy
  accommodation_tier: "mid-range"   # budget | mid-range | luxury | premium
  meal_plan: "full-board"           # fb | hb | bb | ai
  transport: "4x4-landcruiser"      # 4x4-landcruiser | 4x4-van | flight
  group_size_min: 2
  group_size_max: 7
  departure_from: "nairobi"
  includes:
    - "Park fees"
    - "Game drives"
    - "Meals as specified"
    - "Driver-guide"
  excludes:
    - "International flights"
    - "Visas"
    - "Tips"
    - "Personal items"
  highlights:
    - "Big Five viewing"
    - "Great Migration (Jul-Oct)"
    - "Maasai village visit (optional)"
  itinerary_summary: |
    Day 1: Nairobi → Masai Mara (afternoon game drive)
    Day 2: Full day Masai Mara (morning & afternoon drives)
    Day 3: Morning drive → Nairobi
  images: ["mara-1.jpg", "mara-2.jpg", "mara-3.jpg"]
  seo_title: "3-Day Masai Mara Big Five Safari | Adequate Safaris"
  seo_description: "Experience the Big Five in Masai Mara on a 3-day luxury lodge safari. Expert guides, 4x4 Land Cruiser, all meals included."
  slug: "masai-mara-big-game-safari"
```

### 2. Park / Destination Taxonomy (`#__categories` hierarchy)
```
- Kenya (id: 10)
  - Masai Mara (id: 11)
  - Amboseli (id: 12)
  - Tsavo East (id: 13)
  - Tsavo West (id: 14)
  - Lake Nakuru (id: 15)
  - Samburu (id: 16)
  - Aberdares (id: 17)
  - Meru (id: 18)
  - Mt Kenya (id: 19)
  - Nairobi National Park (id: 20)
  - Shimba Hills (id: 21)
- Tanzania (id: 22)
  - Serengeti (id: 23)
  - Ngorongoro (id: 24)
  - Tarangire (id: 25)
  - Lake Manyara (id: 26)
  - Kilimanjaro (id: 27)
  - Nyerere (Selous) (id: 28)
  - Ruaha (id: 29)
- Uganda (id: 30)
  - Bwindi (id: 31)
  - Queen Elizabeth (id: 32)
  - Murchison Falls (id: 33)
  - Kibale (id: 34)
  - Lake Mburo (id: 35)
- Rwanda (id: 36)
  - Volcanoes (id: 37)
  - Akagera (id: 38)
- Zanzibar (id: 39)
  - Stone Town (id: 40)
  - Nungwi (id: 41)
  - Paje (id: 42)
```

### 3. Accommodation (`#__content` catid=14 "Accommodation")
```yaml
title: "Mara Intrepids Club"
alias: "mara-intrepids-club"
catid: 14
custom_fields:
  property_type: "tented-camp"      # lodge | tented-camp | hotel | guesthouse | mobile-camp
  tier: "luxury"                    # budget | mid-range | luxury | premium
  park: "masai-mara"                # Reference to Park category
  coordinates: "-1.4061, 35.0189"
  rooms: 30
  room_types:
    - name: "Deluxe Tent"
      capacity: 2
      base_rate_usd: 380
    - name: "Family Tent"
      capacity: 4
      base_rate_usd: 650
  amenities: ["wifi", "pool", "bar", "laundry", "campfire"]
  meal_plans: ["fb", "hb"]
  children_policy: "All ages welcome"
  images: ["intrepids-1.jpg", "intrepids-2.jpg"]
  booking_contact: "reservations@example.com"
```

### 4. Booking (Micro-app DB — `bookings` table)
```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference VARCHAR(20) UNIQUE NOT NULL,  -- ADQ-2026-001234
    user_id UUID REFERENCES users(id),
    agent_id UUID REFERENCES agents(id),    -- NULL if direct booking
    status ENUM('pending','confirmed','cancelled','completed','failed') DEFAULT 'pending',
    safari_id INT NOT NULL,                 -- Joomla article ID
    departure_date DATE NOT NULL,
    return_date DATE NOT NULL,
    adults INT NOT NULL DEFAULT 2,
    children INT NOT NULL DEFAULT 0,
    children_ages JSONB,                    -- [8, 12]
    accommodation_id INT,                   -- Joomla article ID
    room_type VARCHAR(100),
    special_requests TEXT,
    pricing JSONB NOT NULL,                 -- { base: 450, park_fees: 120, supplement: 50, discount: 0, total_usd: 620, total_kes: 89500, currency: "USD", exchange_rate: 144.3 }
    payment JSONB,                          -- { method: "mpesa", transaction_id: "OEI12345", amount: 620, currency: "USD", status: "completed", paid_at: "2026-01-15T10:30:00Z" }
    commission JSONB,                       -- { agent_rate: 0.10, agent_amount_usd: 62, status: "pending" }
    documents JSONB,                        -- { voucher: "url", invoice: "url", itinerary_pdf: "url" }
    metadata JSONB,                         -- { utm_source, utm_medium, referrer, user_agent }
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_agent ON bookings(agent_id);
CREATE INDEX idx_bookings_dates ON bookings(departure_date, return_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_reference ON bookings(reference);
```

### 5. Itinerary Builder Session (`itinerary_sessions` table)
```sql
CREATE TABLE itinerary_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    session_token VARCHAR(64) UNIQUE NOT NULL,
    status ENUM('draft','priced','booked','expired') DEFAULT 'draft',
    data JSONB NOT NULL,                    -- Full itinerary state
    pricing JSONB,                          -- Calculated pricing
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Itinerary data structure (JSONB)
{
  "days": [
    {
      "day": 1,
      "date": "2026-07-15",
      "location": "nairobi",
      "activities": [
        { "type": "transfer", "from": "Jomo Kenyatta Airport", "to": "Hotel", "time": "14:00" },
        { "type": "accommodation", "property_id": 45, "meal_plan": "bb" }
      ]
    },
    {
      "day": 2,
      "date": "2026-07-16",
      "location": "masai-mara",
      "activities": [
        { "type": "transfer", "from": "Nairobi", "to": "Masai Mara", "mode": "road", "duration_hours": 5.5 },
        { "type": "game-drive", "time": "16:00", "duration_hours": 2 },
        { "type": "accommodation", "property_id": 78, "meal_plan": "fb" }
      ]
    }
  ],
  "preferences": {
    "pace": "moderate",           # relaxed | moderate | packed
    "budget_tier": "mid-range",
    "interests": ["wildlife", "photography", "culture"],
    "mobility": "standard"
  }
}
```

### 6. Agent / Partner (`agents` table)
```sql
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(2) NOT NULL,           -- ISO 3166-1 alpha-2
    commission_rate DECIMAL(5,4) DEFAULT 0.1000,  -- 10%
    tier ENUM('bronze','silver','gold','platinum') DEFAULT 'bronze',
    status ENUM('pending','active','suspended','terminated') DEFAULT 'pending',
    joomla_user_id INT UNIQUE,             -- Link to Joomla user for SSO
    api_key_hash VARCHAR(255),             -- For API access
    metadata JSONB,                        -- { website, iata_number, abta_number, preferred_currency }
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE agent_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    commission_amount_usd DECIMAL(10,2) NOT NULL,
    commission_status ENUM('pending','approved','paid','cancelled') DEFAULT 'pending',
    invoice_number VARCHAR(50),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(agent_id, booking_id)
);
```

### 7. User (Joomla `#__users` + Micro-app profile)
```yaml
# Joomla User (core)
id: 42
name: "John Safari"
username: "john.safari"
email: "john@example.com"
password: "$2y$10$..."          # bcrypt
block: 0
sendEmail: 1
registerDate: "2026-01-15 10:30:00"
lastvisitDate: "2026-01-20 14:22:00"
groups: [2]                     # Registered

# Micro-app Profile (API DB - user_profiles)
user_id: 42
preferences:
  currency: "USD"
  language: "en"
  newsletter: true
  sms_notifications: false
  whatsapp_notifications: true
marketing_consent:
  email: true
  sms: false
  whatsapp: true
  updated_at: "2026-01-15T10:30:00Z"
loyalty_tier: "bronze"
total_bookings: 3
total_spent_usd: 4500
```

### 8. Payment Transaction (`payment_transactions` table)
```sql
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    provider ENUM('stripe','mpesa','bank_transfer','cash') NOT NULL,
    provider_transaction_id VARCHAR(255) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    exchange_rate DECIMAL(10,6),
    status ENUM('initiated','pending','processing','completed','failed','refunded','cancelled') NOT NULL,
    type ENUM('deposit','balance','supplement','refund') NOT NULL,
    raw_response JSONB,                     -- Full provider response
    metadata JSONB,                         -- { mpesa_receipt, stripe_payment_intent_id }
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(provider, provider_transaction_id)
);

CREATE INDEX idx_payments_booking ON payment_transactions(booking_id);
CREATE INDEX idx_payments_status ON payment_transactions(status);
CREATE INDEX idx_payments_provider ON payment_transactions(provider, provider_transaction_id);
```

## API Endpoints (REST + GraphQL)

### Safari Catalog
```
GET    /api/v1/safaris                    # List with filters
GET    /api/v1/safaris/:id                # Single safari detail
GET    /api/v1/safaris/:id/availability   # Check dates
GET    /api/v1/parks                      # Park taxonomy
GET    /api/v1/accommodations             # Lodges/camps
```

### Booking Flow
```
POST   /api/v1/bookings                   # Create booking (hold inventory)
GET    /api/v1/bookings/:reference        # Get booking details
POST   /api/v1/bookings/:reference/pay    # Initiate payment
POST   /api/v1/payments/mpesa/callback    # M-Pesa webhook
POST   /api/v1/payments/stripe/webhook    # Stripe webhook
GET    /api/v1/bookings/:reference/voucher # Download voucher
```

### Itinerary Builder
```
POST   /api/v1/itinerary/sessions         # Create session
GET    /api/v1/itinerary/sessions/:token  # Load session
PATCH  /api/v1/itinerary/sessions/:token  # Update session
POST   /api/v1/itinerary/sessions/:token/price  # Calculate price
POST   /api/v1/itinerary/sessions/:token/book   # Convert to booking
GET    /api/v1/itinerary/sessions/:token/pdf    # Export PDF
```

### Agent Portal
```
POST   /api/v1/auth/agent/login           # JWT login
GET    /api/v1/agent/bookings             # List agent bookings
GET    /api/v1/agent/commissions          # Commission report
GET    /api/v1/agent/clients              # Client list
POST   /api/v1/agent/bookings             # Create booking for client
```

### Auth (Shared)
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
GET    /api/v1/auth/me
```

## Joomla → API Sync Strategy

| Joomla Change | Sync Mechanism | Target |
|---------------|----------------|--------|
| Safari article saved | Plugin `onContentAfterSave` → RabbitMQ/Redis queue → API sync | API DB (safaris cache) |
| Accommodation saved | Same as above | API DB (accommodations cache) |
| Category/Park changed | Plugin `onCategoryAfterSave` | API DB (taxonomy cache) |
| User registered | Plugin `onUserAfterSave` | API DB (users) |
| Booking created (micro-app) | API writes to Joomla `#__content` (custom table) | Joomla (reporting) |

## Multi-language Fields

```yaml
# Each translatable field has language variants
title:
  en-GB: "Masai Mara – Big Game Safari"
  de-DE: "Masai Mara – Big Game Safari"
  fr-FR: "Masai Mara – Safari Grand Gibier"
  zh-CN: "马赛马拉 - 五大兽类野生动物园"
  es-ES: "Masai Mara - Safari de los Cinco Grandes"

description:
  en-GB: "Experience the Big Five..."
  de-DE: "Erleben Sie die Big Five..."
  # ...
```

Joomla handles this natively with `language` field on articles + FaLang/Joomfish for custom fields. API exposes `?lang=de` parameter.