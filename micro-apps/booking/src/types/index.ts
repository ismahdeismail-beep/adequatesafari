export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'CUSTOMER' | 'AGENT' | 'ADMIN' | 'SUPER_ADMIN';
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Safari {
  id: string;
  slug: string;
  title: string;
  shortDescription?: string;
  description: string;
  country: 'KENYA' | 'TANZANIA' | 'UGANDA' | 'RWANDA' | 'BURUNDI';
  region?: string;
  durationDays: number;
  durationNights: number;
  minPrice: number;
  maxPrice: number;
  currency: 'USD' | 'KES' | 'EUR' | 'GBP';
  accommodationType: 'LODGE' | 'TENTED_CAMP' | 'CAMPING' | 'HOTEL' | 'GUEST_HOUSE';
  safariStyle: 'LODGE_SAFARI' | 'CAMPING_SAFARI' | 'FLYING_SAFARI' | 'WALKING_TREKKING' | 'MOUNTAIN_CLIMB' | 'SHORT_EXCURSION' | 'CULTURAL';
  difficulty: 'EASY' | 'MODERATE' | 'CHALLENGING' | 'EXTREME';
  groupSizeMin: number;
  groupSizeMax: number;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  images: string[];
  thumbnail?: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  safariDates: SafariDate[];
  reviews?: Review[];
  averageRating?: number;
  reviewCount?: number;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities?: string[];
  accommodation?: string;
  meals?: string;
}

export interface SafariDate {
  id: string;
  safariId: string;
  startDate: string;
  endDate: string;
  price: number;
  currency: string;
  availability: number;
  booked: number;
  isGuaranteed: boolean;
  status: 'OPEN' | 'FULL' | 'CANCELLED' | 'GUARANTEED';
  available?: number;
}

export interface Review {
  id: string;
  safariId: string;
  userId: string;
  rating: number;
  title?: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

export interface Booking {
  id: string;
  bookingRef: string;
  userId: string;
  safariId: string;
  safariDateId: string;
  agentId?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  paymentStatus: 'UNPAID' | 'PARTIAL' | 'PAID' | 'REFUNDED' | 'FAILED';
  adults: number;
  children: number;
  specialRequests?: string;
  internalNotes?: string;
  confirmedAt?: string;
  cancelledAt?: string;
  cancelledReason?: string;
  totalAmount: number;
  currency: string;
  commissionAmount?: number;
  commissionPaid: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
  safari?: Safari;
  safariDate?: SafariDate;
  agent?: {
    id: string;
    companyName: string;
    user: User;
  };
  payments: Payment[];
  passengers: Passenger[];
}

export interface Passenger {
  id: string;
  bookingId: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  passportNumber?: string;
  nationality?: string;
  specialNeeds?: string;
  isLead: boolean;
}

export interface Payment {
  id: string;
  paymentRef: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  provider: 'STRIPE' | 'MPESA' | 'BANK_TRANSFER' | 'CASH';
  providerRef?: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  method?: 'CARD' | 'MPESA_STK_PUSH' | 'MPESA_PAYBILL' | 'BANK_TRANSFER' | 'CASH';
  metadata?: Record<string, any>;
  paidAt?: string;
  failedAt?: string;
  failureReason?: string;
  refundedAt?: string;
  refundAmount?: number;
  createdAt: string;
}

export interface AgentProfile {
  id: string;
  userId: string;
  companyName: string;
  licenseNumber: string;
  commissionRate: number;
  isApproved: boolean;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  bookings?: Booking[];
}

export interface SafariCardData {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  price?: number;
  currency?: string;
  durationDays?: number;
  country?: string;
  featured?: boolean;
}

export interface SafariDetailData extends SafariCardData {
  region?: string;
  accommodationType?: string;
  safariStyle?: string;
  groupSizeMin?: number;
  groupSizeMax?: number;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  gallery?: string[];
  rating?: number;
  reviewCount?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
    path: string;
    method: string;
  };
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: 'CUSTOMER' | 'AGENT';
}

export interface BookingFormData {
  safariId: string;
  safariDateId: string;
  adults: number;
  children: number;
  specialRequests?: string;
  passengers: PassengerFormData[];
}

export interface PassengerFormData {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  passportNumber?: string;
  nationality?: string;
  specialNeeds?: string;
  isLead?: boolean;
}

export type Country = 'KENYA' | 'TANZANIA' | 'UGANDA' | 'RWANDA' | 'BURUNDI';

export const COUNTRY_LABELS: Record<Country, string> = {
  KENYA: 'Kenya',
  TANZANIA: 'Tanzania',
  UGANDA: 'Uganda',
  RWANDA: 'Rwanda',
  BURUNDI: 'Burundi',
};

export const ACCOMMODATION_LABELS: Record<Safari['accommodationType'], string> = {
  LODGE: 'Lodge',
  TENTED_CAMP: 'Tented Camp',
  CAMPING: 'Camping',
  HOTEL: 'Hotel',
  GUEST_HOUSE: 'Guest House',
};

export const STYLE_LABELS: Record<Safari['safariStyle'], string> = {
  LODGE_SAFARI: 'Lodge Safari',
  CAMPING_SAFARI: 'Camping Safari',
  FLYING_SAFARI: 'Flying Safari',
  WALKING_TREKKING: 'Walking/Trekking',
  MOUNTAIN_CLIMB: 'Mountain Climb',
  SHORT_EXCURSION: 'Short Excursion',
  CULTURAL: 'Cultural',
};

export const DIFFICULTY_LABELS: Record<Safari['difficulty'], string> = {
  EASY: 'Easy',
  MODERATE: 'Moderate',
  CHALLENGING: 'Challenging',
  EXTREME: 'Extreme',
};

export const BOOKING_STATUS_LABELS: Record<Booking['status'], string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
  NO_SHOW: 'No Show',
};

export const PAYMENT_STATUS_LABELS: Record<Payment['status'], string> = {
  PENDING: 'Pending',
  PAID: 'Paid',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
};