import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Safari, SafariDate, Booking, BookingFormData, PassengerFormData } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),
      clearAuth: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'adq-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

interface SafariState {
  featuredSafaris: Safari[];
  safaris: Safari[];
  currentSafari: Safari | null;
  safariDates: SafariDate[];
  isLoading: boolean;
  error: string | null;
  setFeaturedSafaris: (safaris: Safari[]) => void;
  setSafaris: (safaris: Safari[]) => void;
  setCurrentSafari: (safari: Safari | null) => void;
  setSafariDates: (dates: SafariDate[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSafariStore = create<SafariState>((set) => ({
  featuredSafaris: [],
  safaris: [],
  currentSafari: null,
  safariDates: [],
  isLoading: false,
  error: null,
  setFeaturedSafaris: (safaris) => set({ featuredSafaris: safaris }),
  setSafaris: (safaris) => set({ safaris }),
  setCurrentSafari: (safari) => set({ currentSafari: safari }),
  setSafariDates: (dates) => set({ safariDates: dates }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));

interface BookingState {
  currentBooking: Booking | null;
  bookingFormData: Partial<BookingFormData> | null;
  passengers: PassengerFormData[];
  selectedSafariDate: SafariDate | null;
  isBooking: boolean;
  bookingStep: 'details' | 'passengers' | 'payment' | 'confirmation';
  setCurrentBooking: (booking: Booking | null) => void;
  setBookingFormData: (data: Partial<BookingFormData>) => void;
  setPassengers: (passengers: PassengerFormData[]) => void;
  addPassenger: (passenger: PassengerFormData) => void;
  updatePassenger: (index: number, passenger: Partial<PassengerFormData>) => void;
  removePassenger: (index: number) => void;
  setSelectedSafariDate: (date: SafariDate | null) => void;
  setBookingStep: (step: BookingState['bookingStep']) => void;
  setIsBooking: (booking: boolean) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  currentBooking: null,
  bookingFormData: null,
  passengers: [],
  selectedSafariDate: null,
  isBooking: false,
  bookingStep: 'details',
  setCurrentBooking: (booking) => set({ currentBooking: booking }),
  setBookingFormData: (data) => set((state) => ({ bookingFormData: { ...state.bookingFormData, ...data } })),
  setPassengers: (passengers) => set({ passengers }),
  addPassenger: (passenger) => set((state) => ({ passengers: [...state.passengers, passenger] })),
  updatePassenger: (index, passenger) =>
    set((state) => ({
      passengers: state.passengers.map((p, i) => (i === index ? { ...p, ...passenger } : p)),
    })),
  removePassenger: (index) =>
    set((state) => ({ passengers: state.passengers.filter((_, i) => i !== index) })),
  setSelectedSafariDate: (date) => set({ selectedSafariDate: date }),
  setBookingStep: (step) => set({ bookingStep: step }),
  setIsBooking: (booking) => set({ isBooking: booking }),
  resetBooking: () =>
    set({
      currentBooking: null,
      bookingFormData: null,
      passengers: [],
      selectedSafariDate: null,
      isBooking: false,
      bookingStep: 'details',
    }),
}));

interface UIState {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleSearch: () => void;
  setSearchOpen: (open: boolean) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  toast: null,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  showToast: (message, type) => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null }),
}));