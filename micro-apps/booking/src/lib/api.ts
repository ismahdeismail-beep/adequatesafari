import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';

// The booking API is optional. The app ships with a complete sample-data set and
// renders standalone, so we only call the API when it has been explicitly
// configured via NEXT_PUBLIC_API_URL. Without it we skip the request entirely,
// which avoids failed requests to a non-existent backend (and the browser
// console errors they produce) in deployments that do not run the NestJS API.
export const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export const isApiConfigured = API_URL.length > 0;

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry && this.refreshToken) {
          originalRequest._retry = true;
          try {
            await this.refreshAccessToken();
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
            }
            return this.client(originalRequest);
          } catch (refreshError) {
            this.clearTokens();
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login';
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  loadTokens() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
    }
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  private async refreshAccessToken() {
    if (!this.refreshToken) throw new Error('No refresh token');
    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken: this.refreshToken,
    });
    this.setTokens(response.data.accessToken, response.data.refreshToken);
  }

  // Auth
  async register(data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) {
    const response = await this.client.post('/auth/register', data);
    this.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    this.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  }

  async logout() {
    if (isApiConfigured && this.refreshToken) {
      await this.client.post('/auth/logout', { refreshToken: this.refreshToken });
    }
    this.clearTokens();
  }

  async getMe() {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  // Safaris
  async getSafaris(params?: Record<string, any>) {
    const response = await this.client.get('/safaris', { params });
    return response.data;
  }

  async getSafari(slug: string) {
    const response = await this.client.get(`/safaris/${slug}`);
    return response.data;
  }

  async getFeaturedSafaris(limit = 6) {
    const response = await this.client.get('/safaris/featured', { params: { limit } });
    return response.data;
  }

  async getSafarisByCountry(country: string, limit = 20) {
    const response = await this.client.get(`/safaris/country/${country}`, { params: { limit } });
    return response.data;
  }

  async getAvailability(safariId: string, startDate: string, endDate: string) {
    const response = await this.client.get(`/safaris/${safariId}/availability`, {
      params: { startDate, endDate },
    });
    return response.data;
  }

  // Bookings
  async createBooking(data: {
    safariId: string;
    safariDateId: string;
    adults: number;
    children: number;
    specialRequests?: string;
    passengers: Array<{
      firstName: string;
      lastName: string;
      dateOfBirth?: string;
      passportNumber?: string;
      nationality?: string;
      specialNeeds?: string;
      isLead?: boolean;
    }>;
  }) {
    const response = await this.client.post('/bookings', data);
    return response.data;
  }

  async getMyBookings(params?: { skip?: number; take?: number; status?: string }) {
    const response = await this.client.get('/bookings', { params });
    return response.data;
  }

  async getBooking(id: string) {
    const response = await this.client.get(`/bookings/${id}`);
    return response.data;
  }

  async getBookingByRef(bookingRef: string) {
    const response = await this.client.get(`/bookings/ref/${bookingRef}`);
    return response.data;
  }

  async cancelBooking(id: string, reason?: string) {
    const response = await this.client.put(`/bookings/${id}/cancel`, { reason });
    return response.data;
  }

  // Payments
  async createStripeIntent(bookingId: string) {
    const response = await this.client.post('/payments/stripe/intent', { bookingId });
    return response.data;
  }

  async initiateMpesaSTKPush(bookingId: string, phoneNumber: string) {
    const response = await this.client.post('/payments/mpesa/stk-push', { bookingId, phoneNumber });
    return response.data;
  }

  async getBookingPayments(bookingId: string) {
    const response = await this.client.get(`/payments/booking/${bookingId}`);
    return response.data;
  }

  // Users
  async updateProfile(data: Partial<{ firstName: string; lastName: string; phone: string }>) {
    const response = await this.client.put('/users/me', data);
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string) {
    const response = await this.client.put('/users/me/password', { currentPassword, newPassword });
    return response.data;
  }

  // Agents
  async applyForAgent(companyName: string, licenseNumber: string) {
    const response = await this.client.post('/agents/apply', { companyName, licenseNumber });
    return response.data;
  }

  async getMyAgentProfile() {
    const response = await this.client.get('/agents/me');
    return response.data;
  }

  async getMyAgentStats() {
    const response = await this.client.get('/agents/me/stats');
    return response.data;
  }
}

export const api = new ApiClient();