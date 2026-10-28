// API Client for Greenwood Café & Restaurant
// Seamlessly connects the Frontend to the SQLite-backed REST API

export interface ApiSettings {
  is_kitchen_open: boolean;
  home_delivery_enabled: boolean;
  takeaway_enabled: boolean;
  opening_hours: string;
  avg_prep_time: string;
  delivery_radius: string;
  restaurant_phone: string;
  kitchen_phone: string;
  audio_alerts: boolean;
}

export interface ApiDish {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  description: string;
  image: string;
  inStock: boolean;
  rating?: number;
  reviews_count?: number;
  isVeg: boolean;
}

export interface ApiOrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  dishId?: string;
}

export interface ApiOrder {
  id: string;
  status: 'New' | 'Preparing' | 'Out for Delivery' | 'Completed' | 'Declined';
  placedTime: string;
  prepTime?: string;
  completedTime?: string;
  orderType: 'Home Delivery' | 'Dine-in' | 'Takeaway';
  paymentMode: 'Cash on Delivery' | 'Paid via UPI' | 'Paid via Card';
  customerName: string;
  customerPhone: string;
  customerAddressOrTable: string;
  items: ApiOrderItem[];
  specialInstruction?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  declineReason?: string;
}

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  orderType: 'delivery' | 'takeaway' | 'Dine-in';
  paymentMode: string;
  specialInstruction?: string;
  items: {
    dishId?: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
}

export interface ApiAddress {
  id: string;
  type: 'Home' | 'Office' | 'Other';
  addressLine: string;
  phone: string;
  isDefault: boolean;
}

export interface ApiProfile {
  name: string;
  phone: string;
  email: string;
  membership: string;
}

const API_BASE = '/api';

// Helper for HTTP requests
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  // Settings
  async getSettings(): Promise<ApiSettings> {
    return request<ApiSettings>('/settings');
  },

  async updateSettings(settings: Partial<ApiSettings>): Promise<{ success: boolean; settings: ApiSettings }> {
    return request<{ success: boolean; settings: ApiSettings }>('/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  },

  // Dishes
  async getDishes(): Promise<ApiDish[]> {
    return request<ApiDish[]>('/dishes');
  },

  async addDish(dish: Partial<ApiDish>): Promise<{ success: boolean; dish: ApiDish }> {
    return request<{ success: boolean; dish: ApiDish }>('/dishes', {
      method: 'POST',
      body: JSON.stringify(dish),
    });
  },

  async updateDish(dishId: string, updates: Partial<ApiDish>): Promise<{ success: boolean; dish: ApiDish }> {
    return request<{ success: boolean; dish: ApiDish }>(`/dishes/${encodeURIComponent(dishId)}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  // Orders
  async getOrders(status?: string, search?: string): Promise<ApiOrder[]> {
    const params = new URLSearchParams();
    if (status && status !== 'All') params.append('status', status);
    if (search) params.append('search', search);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request<ApiOrder[]>(`/orders${qs}`);
  },

  async getLatestOrder(): Promise<ApiOrder | null> {
    return request<ApiOrder | null>('/orders/latest');
  },

  async createOrder(payload: CreateOrderPayload): Promise<{ success: boolean; order: ApiOrder }> {
    return request<{ success: boolean; order: ApiOrder }>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateOrderStatus(
    orderId: string,
    status: ApiOrder['status'],
    options: { declineReason?: string; prepTime?: string } = {}
  ): Promise<{ success: boolean; order: ApiOrder }> {
    return request<{ success: boolean; order: ApiOrder }>(`/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({
        status,
        declineReason: options.declineReason,
        prepTime: options.prepTime,
      }),
    });
  },

  // Profile & Addresses
  async getProfile(): Promise<ApiProfile> {
    return request<ApiProfile>('/profile');
  },

  async updateProfile(profile: Partial<ApiProfile>): Promise<{ success: boolean; profile: ApiProfile }> {
    return request<{ success: boolean; profile: ApiProfile }>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  },

  async getAddresses(): Promise<ApiAddress[]> {
    return request<ApiAddress[]>('/addresses');
  },

  async addAddress(address: Partial<ApiAddress>): Promise<{ success: boolean; address: ApiAddress }> {
    return request<{ success: boolean; address: ApiAddress }>('/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    });
  },

  async deleteAddress(addressId: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/addresses/${encodeURIComponent(addressId)}`, {
      method: 'DELETE',
    });
  },
};
