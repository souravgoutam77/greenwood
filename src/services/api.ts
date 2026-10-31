import { SEARCHABLE_MENU } from '../data/searchableMenu';
// Pure Firebase Firestore Client SDK & LocalStorage Service for Greenwood Café & Restaurant
// 100% Serverless & Production-Ready for Firebase Hosting (No Express/SQLite Backend Required)

import { firestore } from './firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  getDoc,
  query,
  where,
} from 'firebase/firestore';
import { normalizePhone, getCustomerAuth } from './auth';
import { userService } from './userService';

export interface ApiSettings {
  is_kitchen_open: boolean;
  manual_override?: boolean;
  manual_override_time?: string;
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
  isTrending?: boolean;
}

export interface ApiOrderItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
  dishId?: string;
}

export interface ApiOrder {
  id: string;
  status: 'New' | 'Preparing' | 'Out for Delivery' | 'Completed' | 'Declined';
  placedTime: string;
  completedTime?: string;
  orderType: 'Home Delivery' | 'Takeaway' | 'Dine-in';
  paymentMode: 'Cash on Delivery' | 'UPI / Online' | 'Card';
  customerName: string;
  customerPhone: string;
  customerId?: string;
  customerAddressOrTable: string;
  specialInstruction?: string;
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
  items: ApiOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  prepTime?: string;
  declineReason?: string;
  timestamp?: number;
  rating?: number;
  reviewText?: string;
  reviewPhoto?: string;
  ratedAt?: number | string;
}

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  orderType: string;
  paymentMode: string;
  specialInstruction?: string;
  items: Array<{
    dishId?: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
}

export interface ApiBanner {
  id: string;
  title: string;
  subtitle: string;
  imageDesktop: string;
  imageMobile: string;
  linkUrl: string;
  isActive: boolean;
  displayOrder: number;
}

export interface ApiAddress {
  id: string;
  type: string;
  addressLine: string;
  phone: string;
  isDefault: boolean;
}

export interface ApiProfile {
  name: string;
  phone: string;
  email: string;
  membership?: string;
  photoURL?: string;
}

// -------------------------------------------------------------------
// DEFAULT SEED DATA (Used when offline or initializing Firestore)
// -------------------------------------------------------------------
export function isWithinAutoStoreHours(date = new Date()): boolean {
  try {
    const istTimeStr = date.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
    const parts = istTimeStr.split(':').map(Number);
    const hours = parts[0];
    const minutes = parts[1] || 0;
    const totalMinutes = hours * 60 + minutes;
    // 11:00 AM (660 mins) to 11:00 PM (1380 mins) IST
    return totalMinutes >= 660 && totalMinutes < 1380;
  } catch (_e) {
    const utcHours = date.getUTCHours();
    const utcMinutes = date.getUTCMinutes();
    const istMinutes = (utcHours * 60 + utcMinutes + 330) % 1440;
    return istMinutes >= 660 && istMinutes < 1380;
  }
}

export function computeEffectiveStoreStatus(settings?: Partial<ApiSettings> | null): boolean {
  if (settings && typeof settings.manual_override === 'boolean' && settings.manual_override) {
    return Boolean(settings.is_kitchen_open);
  }
  return isWithinAutoStoreHours();
}

const DEFAULT_SETTINGS: ApiSettings = {
  is_kitchen_open: isWithinAutoStoreHours(),
  manual_override: false,
  home_delivery_enabled: true,
  takeaway_enabled: true,
  opening_hours: '11:00 AM – 11:00 PM',
  avg_prep_time: '18 mins',
  delivery_radius: '15 km',
  restaurant_phone: '+91 90669 06607',
  kitchen_phone: '+91 90669 06607',
  audio_alerts: true,
};

const DEFAULT_DISHES: ApiDish[] = SEARCHABLE_MENU.map((i) => ({
  id: i.id,
  name: i.name,
  category: i.category,
  subcategory: i.subcategory,
  price: i.price,
  inStock: true,
  image: i.image,
  description: i.description,
  isVeg: true,
  isTrending: Boolean(i.isTrending),
  rating: i.rating || 4.8,
  reviews_count: i.reviewsCount || 45,
}));

export const isLegacyMockDishId = (id: string): boolean =>
  /^(?:item|dish)-(?:[1-9]|1[0-8])$/.test(id);

export function ensureFullCatalogue(dishesList: ApiDish[]): ApiDish[] {
  if (!dishesList || dishesList.length === 0) return DEFAULT_DISHES;
  // Strictly filter out any legacy mock dishes (dish-1 to dish-18)
  const cleanList = dishesList.filter((d) => !isLegacyMockDishId(d.id));
  const existingMap = new Map(cleanList.map((d) => [d.id, d]));
  const full = DEFAULT_DISHES.map((def) => {
    const existing = existingMap.get(def.id);
    return existing ? { ...def, ...existing } : def;
  });
  // Also preserve custom dishes added by admin (excluding legacy mock IDs)
  cleanList.forEach((dish) => {
    if (!DEFAULT_DISHES.some((d) => d.id === dish.id)) {
      full.push(dish);
    }
  });
  return full;
}

const DEFAULT_BANNERS: ApiBanner[] = [
  {
    id: 'banner-1',
    title: 'Good Food. Greener Moods.',
    subtitle: '100% Pure Vegetarian Fine Dining in Narela',
    imageDesktop: '/images/hero-bg-2400.jpg',
    imageMobile: '/images/hero-bg-mobile-1200.jpg',
    linkUrl: '#menu',
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 'banner-2',
    title: 'Signature North Indian Specials',
    subtitle: 'Slow simmered Dal Makhani & Tandoor Breads',
    imageDesktop: '/images/gallery-1.jpg',
    imageMobile: '/images/gallery-1.jpg',
    linkUrl: '#menu',
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 'banner-3',
    title: 'Private Gazebo Pods & Ambience',
    subtitle: 'Botanical luxury dining experience for families',
    imageDesktop: '/images/gallery-2.jpg',
    imageMobile: '/images/gallery-2.jpg',
    linkUrl: '#gallery',
    isActive: true,
    displayOrder: 3,
  },
];

const DEFAULT_ADMINS = ['8802325537'];

const DEFAULT_PROFILE: ApiProfile = {
  name: 'Greenwood Guest',
  phone: 'Not Signed In',
  email: '',
};

// -------------------------------------------------------------------
// CLIENT STORAGE ADAPTER
// -------------------------------------------------------------------
function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const val = localStorage.getItem(`gw_${key}`);
    return val ? JSON.parse(val) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T, notify = false): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`gw_${key}`, JSON.stringify(value));
    if (notify) {
      window.dispatchEvent(new CustomEvent(`gw_${key}_updated`, { detail: value }));
      if ('BroadcastChannel' in window) {
        const bc = new BroadcastChannel('gw_sync_channel');
        bc.postMessage({ key, value });
        bc.close();
      }
    }
  } catch (err) {
    console.warn(`Storage error for gw_${key}:`, err);
  }
}

function broadcastCustomEvent(eventName: string, detail?: any): void {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel('gw_sync_channel');
      bc.postMessage({ event: eventName, detail });
      bc.close();
    }
  } catch (err) {
    console.warn(`Broadcast error for ${eventName}:`, err);
  }
}

// Strip undefined fields to strictly adhere to Firestore constraints
function cleanFirestoreData<T extends Record<string, any>>(obj: T): T {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = cleanFirestoreData(value);
      } else if (Array.isArray(value)) {
        result[key] = value.map((item) =>
          item && typeof item === 'object' ? cleanFirestoreData(item) : item
        );
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

// Helper for fast Firestore timeout
function withTimeout<T>(promise: Promise<T>, ms = 1200): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), ms)),
  ]);
}

// -------------------------------------------------------------------
// UNIFIED PURE FIRESTORE CLIENT API (Zero Node.js/SQLite Dependency)
// -------------------------------------------------------------------
export const api = {
  // 1. Settings
  async getSettings(): Promise<ApiSettings> {
    // 1. Start with local storage so admin manual toggles persist without being overwritten
    let settings = getStorageItem<ApiSettings>('settings', DEFAULT_SETTINGS);

    if (firestore) {
      try {
        const snap = await getDoc(doc(firestore, 'settings', 'config'));
        if (snap.exists()) {
          const cloudSettings = snap.data() as ApiSettings;
          settings = { ...settings, ...cloudSettings };
        }
      } catch (err) {
        console.warn('Firestore getSettings notice:', err);
      }
    }

    // Determine actual effective kitchen status (respects manual override if set)
    settings.is_kitchen_open = computeEffectiveStoreStatus(settings);

    setStorageItem('settings', settings, false);
    return settings;
  },

  async updateSettings(settings: Partial<ApiSettings>): Promise<{ success: boolean; settings: ApiSettings }> {
    const current = getStorageItem<ApiSettings>('settings', DEFAULT_SETTINGS);
    const updated = { ...current, ...settings };

    // When admin explicitly updates is_kitchen_open, enforce manual override
    if (settings.is_kitchen_open !== undefined) {
      updated.manual_override = true;
      updated.manual_override_time = new Date().toISOString();
    }

    setStorageItem('settings', updated, true);

    if (firestore) {
      // Build safe config object that strictly adheres to Firestore rules whitelist
      const safeConfig = {
        is_kitchen_open: Boolean(updated.is_kitchen_open),
        manual_override: Boolean(updated.manual_override),
        manual_override_time: String(updated.manual_override_time || ''),
        home_delivery_enabled: Boolean(updated.home_delivery_enabled),
        takeaway_enabled: Boolean(updated.takeaway_enabled),
        opening_hours: String(updated.opening_hours || '11:00 AM – 11:00 PM'),
        avg_prep_time: String(updated.avg_prep_time || '18 mins'),
        delivery_radius: String(updated.delivery_radius || '15 km'),
        restaurant_phone: String(updated.restaurant_phone || '+91 90669 06607'),
        kitchen_phone: String(updated.kitchen_phone || '+91 90669 06607'),
        audio_alerts: updated.audio_alerts !== false,
      };
      setDoc(doc(firestore, 'settings', 'config'), safeConfig, { merge: true }).catch((err) => {
        console.warn('Firestore updateSettings notice:', err);
      });
    }

    broadcastCustomEvent('gw_settings_updated', updated);
    return { success: true, settings: updated };
  },

  // 2. Dishes
  getDishesSync(): ApiDish[] {
    const raw = getStorageItem<ApiDish[]>('dishes', DEFAULT_DISHES);
    const clean = ensureFullCatalogue(raw);
    // If cache had legacy items, overwrite localStorage with clean catalogue
    if (Array.isArray(raw) && raw.some((d) => isLegacyMockDishId(d.id))) {
      setStorageItem('dishes', clean, false);
    }
    return clean;
  },

  async getDishes(): Promise<ApiDish[]> {
    const cached = ensureFullCatalogue(getStorageItem<ApiDish[]>('dishes', DEFAULT_DISHES));
    if (firestore) {
      try {
        const snap = await withTimeout(getDocs(collection(firestore, 'dishes')), 1500);
        if (!snap.empty) {
          const cloudDishes: ApiDish[] = [];
          snap.forEach((d) => {
            const item = d.data() as ApiDish;
            if (isLegacyMockDishId(item.id)) {
              // Automatically delete legacy mock dishes from Firestore to prevent count mismatch
              if (firestore) deleteDoc(doc(firestore, 'dishes', item.id)).catch(() => {});
            } else {
              cloudDishes.push(item);
            }
          });
          const cloudMap = new Map(cloudDishes.map((d) => [d.id, d]));
          const mergedList = cached.map((d) => {
            const upd = cloudMap.get(d.id);
            return upd ? { ...d, ...upd } : d;
          });
          cloudDishes.forEach((cd) => {
            if (!cached.some((c) => c.id === cd.id)) {
              mergedList.push(cd);
            }
          });
          const fullCatalogue = ensureFullCatalogue(mergedList);
          setStorageItem('dishes', fullCatalogue, false);
          return fullCatalogue;
        } else if (firestore) {
          const fsInstance = firestore;
          // Firestore is empty: auto-seed with default pure veg dishes
          DEFAULT_DISHES.forEach((d) => {
            setDoc(doc(fsInstance, 'dishes', d.id), cleanFirestoreData(d)).catch(() => {});
          });
        }
      } catch (err) {
        console.warn('Firestore getDishes notice:', err);
      }
    }
    return cached;
  },

  async addDish(dish: Partial<ApiDish>): Promise<{ success: boolean; dish: ApiDish }> {
    const current = ensureFullCatalogue(getStorageItem<ApiDish[]>('dishes', DEFAULT_DISHES));
    const newDish: ApiDish = {
      id: dish.id || `dish-${Date.now()}`,
      name: dish.name || 'Special Dish',
      category: dish.category || 'North Indian',
      subcategory: dish.subcategory,
      price: dish.price || 250,
      description: dish.description || 'Pure Vegetarian specialty.',
      image: dish.image || '/images/dish-detail/rec-dal-makhani.jpg',
      inStock: dish.inStock ?? true,
      isTrending: dish.isTrending ?? false,
      rating: 4.8,
      reviews_count: 24,
      isVeg: true,
    };

    const updated = [newDish, ...current];
    setStorageItem('dishes', updated, true);

    broadcastCustomEvent('gw_dishes_changed', { dishId: newDish.id, dish: newDish });

    if (firestore) {
      setDoc(doc(firestore, 'dishes', newDish.id), cleanFirestoreData(newDish)).catch((err) => {
        console.warn('Firestore addDish notice:', err);
      });
    }

    return { success: true, dish: newDish };
  },

  async updateDish(dishId: string, updates: Partial<ApiDish>): Promise<{ success: boolean; dish: ApiDish }> {
    const current = ensureFullCatalogue(getStorageItem<ApiDish[]>('dishes', DEFAULT_DISHES));
    let updatedDish: ApiDish | null = null;
    const nextList = current.map((d) => {
      if (d.id === dishId) {
        updatedDish = { ...d, ...updates };
        return updatedDish;
      }
      return d;
    });

    // If the dish wasn't in current, add it
    if (!updatedDish) {
      updatedDish = {
        id: dishId,
        name: updates.name || 'Special Dish',
        category: updates.category || 'North Indian',
        price: updates.price || 250,
        inStock: updates.inStock ?? true,
        isTrending: updates.isTrending ?? false,
        image: updates.image || '/images/dish-detail/rec-dal-makhani.jpg',
        description: updates.description || '100% Pure Veg',
        rating: 4.8,
        reviews_count: 24,
        isVeg: true,
        ...updates,
      };
      nextList.push(updatedDish);
    }

    setStorageItem('dishes', nextList, true);

    broadcastCustomEvent('gw_dishes_changed', { dishId, updates, dish: updatedDish });

    if (firestore && updatedDish) {
      try {
        await withTimeout(
          setDoc(doc(firestore, 'dishes', dishId), cleanFirestoreData(updatedDish), { merge: true }),
          2500
        );
      } catch (err) {
        console.warn('Firestore updateDish notice:', err);
      }
    }

    return { success: true, dish: updatedDish };
  },

  async deleteDish(dishId: string): Promise<{ success: boolean }> {
    const current = getStorageItem<ApiDish[]>('dishes', DEFAULT_DISHES);
    const next = current.filter((d) => d.id !== dishId);
    setStorageItem('dishes', next, true);

    broadcastCustomEvent('gw_dishes_changed', { dishId, deleted: true });

    if (firestore) {
      deleteDoc(doc(firestore, 'dishes', dishId)).catch((err) => {
        console.warn('Firestore deleteDish notice:', err);
      });
    }

    return { success: true };
  },

  // 3. Orders (Strictly User-Scoped & Protected)
  async getOrders(
    filterOrStatus?: string | { status?: string; search?: string; forPhone?: string; forAdmin?: boolean },
    search?: string
  ): Promise<ApiOrder[]> {
    let statusFilter: string | undefined;
    let searchFilter: string | undefined = search;
    let forPhone: string | undefined;
    let forAdmin = false;

    if (typeof filterOrStatus === 'object' && filterOrStatus !== null) {
      statusFilter = filterOrStatus.status;
      searchFilter = filterOrStatus.search;
      forPhone = filterOrStatus.forPhone;
      forAdmin = Boolean(filterOrStatus.forAdmin);
    } else {
      statusFilter = filterOrStatus;
    }

    const currentAuth = getCustomerAuth();
    const effectivePhone = normalizePhone(forPhone || (!forAdmin ? currentAuth?.phone : undefined));

    // A. Admin mode: fetches all restaurant kitchen orders
    if (forAdmin) {
      let adminList = getStorageItem<ApiOrder[]>('orders_admin', []);
      if (firestore) {
        try {
          const snap = await withTimeout(getDocs(collection(firestore, 'orders')), 1500);
          if (!snap.empty) {
            const cloudOrders: ApiOrder[] = [];
            snap.forEach((d) => cloudOrders.push(d.data() as ApiOrder));
            cloudOrders.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            setStorageItem('orders_admin', cloudOrders, false);
            adminList = cloudOrders;
          }
        } catch (err) {
          console.warn('[API] Admin orders query notice:', err);
        }
      }
      return this._applyFilters(adminList, statusFilter, searchFilter);
    }

    // B. Customer mode: strictly scoped to logged-in customer phone
    if (!effectivePhone) {
      // Unauthenticated visitor has NO order history
      return [];
    }

    const storageKey = `orders_${effectivePhone}`;
    let userList = getStorageItem<ApiOrder[]>(storageKey, []);

    if (firestore) {
      try {
        const q = query(collection(firestore, 'orders'), where('customerPhone', '==', effectivePhone));
        const snap = await withTimeout(getDocs(q), 1500);
        const cloudOrders: ApiOrder[] = [];
        snap.forEach((d) => cloudOrders.push(d.data() as ApiOrder));
        cloudOrders.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setStorageItem(storageKey, cloudOrders, false);
        userList = cloudOrders;
      } catch (err) {
        console.warn('[API] Customer orders query notice:', err);
      }
    }

    return this._applyFilters(userList, statusFilter, searchFilter);
  },

  _applyFilters(list: ApiOrder[], status?: string, search?: string): ApiOrder[] {
    let result = [...list];
    if (status && status !== 'All') {
      result = result.filter((o) => o.status === status);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q)
      );
    }
    return result;
  },

  async getLatestOrder(phone?: string): Promise<ApiOrder | null> {
    const orders = await this.getOrders({ forPhone: phone });
    return orders.length > 0 ? orders[0] : null;
  },

  async createOrder(payload: CreateOrderPayload): Promise<{ success: boolean; order: ApiOrder }> {
    const cleanPhone = normalizePhone(payload.customerPhone);
    const storageKey = cleanPhone ? `orders_${cleanPhone}` : 'orders_guest';
    const currentOrders = getStorageItem<ApiOrder[]>(storageKey, []);
    const newId = `#GW-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeFormatted = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const subtotal = payload.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const isTakeaway = payload.orderType === 'takeaway' || payload.orderType === 'Takeaway';
    const deliveryFee = isTakeaway || subtotal >= 500 ? 0 : 49;
    const total = subtotal + deliveryFee;

    const newOrder: ApiOrder = {
      id: newId,
      status: 'New',
      placedTime: `${dateFormatted} at ${timeFormatted}`,
      orderType: isTakeaway ? 'Takeaway' : payload.orderType === 'dine-in' ? 'Dine-in' : 'Home Delivery',
      paymentMode: (payload.paymentMode as any) || 'Cash on Delivery',
      customerName: payload.customerName || 'Customer',
      customerPhone: cleanPhone,
      customerId: cleanPhone,
      customerAddressOrTable: payload.customerAddress || 'Narela Hub, Delhi - 110040',
      specialInstruction: payload.specialInstruction,
      items: payload.items.map((it) => ({
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        image: it.image || '/images/dish-detail/rec-dal-makhani.jpg',
      })),
      subtotal,
      deliveryFee,
      total,
      timestamp: Date.now(),
    };

    // 1. Write directly to Cloud Firestore as the authoritative persistence engine
    if (!firestore) {
      throw new Error('Database is not initialized. Please check your internet connection.');
    }

    const orderPayload = {
      ...newOrder,
      orderId: newId,
      customerId: cleanPhone || 'guest',
      customerName: payload.customerName || 'Customer',
      customerPhone: cleanPhone || '9876543210',
      deliveryAddress: payload.customerAddress || 'Narela Hub, Delhi - 110040',
      pricing: { subtotal, deliveryFee, total },
      status: 'New',
      createdAt: Date.now(),
      timestamp: Date.now(),
    };

    // FORCE CLOUD FIRESTORE ON ORDER PLACEMENT (PHONE -> DATABASE)
    // We strictly await the real cloud write so network or permission failures are never hidden!
    await setDoc(doc(firestore, 'orders', newId), cleanFirestoreData(orderPayload));

    // 2. Update local state and caches ONLY after cloud write succeeds
    const updatedList = [newOrder, ...currentOrders];
    setStorageItem(storageKey, updatedList, true);

    try {
      const adminList = getStorageItem<ApiOrder[]>('orders_admin', []);
      setStorageItem('orders_admin', [newOrder, ...adminList], false);
    } catch {}

    broadcastCustomEvent('gw_orders_changed', newOrder);

    return { success: true, order: newOrder };
  },

  async updateOrderStatus(
    orderId: string,
    status: ApiOrder['status'],
    options: {
      declineReason?: string;
      prepTime?: string;
      deliveryPartnerName?: string;
      deliveryPartnerPhone?: string;
      customerPhone?: string;
    } = {}
  ): Promise<{ success: boolean; order: ApiOrder }> {
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeFormatted = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    // 1. Update in Admin orders list
    const adminOrders = getStorageItem<ApiOrder[]>('orders_admin', []);
    const existing = adminOrders.find((o) => o.id === orderId);
    let updatedOrder: ApiOrder | null = null;
    if (existing) {
      updatedOrder = {
        ...existing,
        status,
        declineReason: options.declineReason ?? existing.declineReason,
        prepTime: options.prepTime ?? existing.prepTime,
        completedTime: status === 'Completed' ? `${dateFormatted} at ${timeFormatted}` : existing.completedTime,
        deliveryPartnerName: options.deliveryPartnerName ?? existing.deliveryPartnerName,
        deliveryPartnerPhone: options.deliveryPartnerPhone ?? existing.deliveryPartnerPhone,
      };
    }
    const nextAdminList = adminOrders.map((o) => (o.id === orderId && updatedOrder ? updatedOrder : o));
    setStorageItem('orders_admin', nextAdminList, true);

    // 2. Update in user-scoped cache if known
    const targetPhone = normalizePhone(options.customerPhone || updatedOrder?.customerPhone || getCustomerAuth()?.phone);
    if (targetPhone) {
      const userKey = `orders_${targetPhone}`;
      const userOrders = getStorageItem<ApiOrder[]>(userKey, []);
      const nextUserList = userOrders.map((o) => (o.id === orderId && updatedOrder ? updatedOrder : o));
      setStorageItem(userKey, nextUserList, true);
    }

    broadcastCustomEvent('gw_orders_changed', updatedOrder);

    if (firestore && updatedOrder) {
      try {
        await setDoc(doc(firestore, 'orders', orderId), cleanFirestoreData(updatedOrder), { merge: true });
      } catch (err) {
        console.warn('Firestore updateOrderStatus error:', err);
      }
    }

    return { success: true, order: updatedOrder || (adminOrders[0] as ApiOrder) };
  },

  async submitOrderReview(
    orderId: string,
    rating: number,
    reviewText = '',
    reviewPhoto = '',
    customerPhone?: string
  ): Promise<{ success: boolean }> {
    const currentAuth = getCustomerAuth();
    const phone = normalizePhone(customerPhone || currentAuth?.phone);
    const storageKey = phone ? `orders_${phone}` : 'orders_guest';
    const currentOrders = getStorageItem<ApiOrder[]>(storageKey, []);

    let updatedOrder: ApiOrder | null = null;
    const nextList = currentOrders.map((o) => {
      if (o.id === orderId) {
        updatedOrder = {
          ...o,
          rating,
          reviewText,
          reviewPhoto,
          ratedAt: Date.now(),
        };
        return updatedOrder;
      }
      return o;
    });

    setStorageItem(storageKey, nextList, true);

    // Also update in admin list
    try {
      const adminOrders = getStorageItem<ApiOrder[]>('orders_admin', []);
      const nextAdminList = adminOrders.map((o) => (o.id === orderId && updatedOrder ? updatedOrder : o));
      setStorageItem('orders_admin', nextAdminList, false);
    } catch {}

    broadcastCustomEvent('gw_orders_changed', updatedOrder);

    if (firestore && updatedOrder) {
      try {
        await setDoc(doc(firestore, 'orders', orderId), cleanFirestoreData(updatedOrder), { merge: true });
        // Also add to public reviews collection
        const safeReviewId = `rev-${orderId.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}`;
        await setDoc(doc(firestore, 'reviews', safeReviewId), {
          id: safeReviewId,
          orderId,
          customerName: (updatedOrder as any).customerName || 'Greenwood Guest',
          customerPhone: phone || '',
          rating,
          reviewText,
          reviewPhoto,
          createdAt: Date.now(),
        });
      } catch (err) {
        console.warn('Firestore submitOrderReview error:', err);
      }
    }

    return { success: true };
  },

  // 4. Profile & Addresses (Strictly isolated per user via userService & Firestore /users/{phone})
  async getProfile(phone?: string): Promise<ApiProfile> {
    const clean = normalizePhone(phone || getCustomerAuth()?.phone);
    if (!clean) return DEFAULT_PROFILE;
    const userDoc = await userService.getUserProfile(clean);
    return {
      name: userDoc.name,
      phone: `+91 ${clean.slice(0, 5)} XXXXX`,
      email: userDoc.email || '',
      photoURL: userDoc.photoURL,
    };
  },

  async updateProfile(profile: Partial<ApiProfile>, phone?: string): Promise<{ success: boolean; profile: ApiProfile }> {
    const clean = normalizePhone(phone || getCustomerAuth()?.phone);
    if (!clean) return { success: false, profile: DEFAULT_PROFILE };
    const userDoc = await userService.updateUserProfile(clean, {
      name: profile.name,
      email: profile.email,
      photoURL: profile.photoURL,
    });
    return {
      success: true,
      profile: {
        name: userDoc.name,
        phone: `+91 ${clean.slice(0, 5)} XXXXX`,
        email: userDoc.email || '',
        photoURL: userDoc.photoURL,
      },
    };
  },

  async getAddresses(phone?: string): Promise<ApiAddress[]> {
    const clean = normalizePhone(phone || getCustomerAuth()?.phone);
    if (!clean) return [];
    const addrs = await userService.getUserAddresses(clean);
    return addrs as any;
  },

  async addAddress(address: Partial<ApiAddress>, phone?: string): Promise<{ success: boolean; address: ApiAddress }> {
    const clean = normalizePhone(phone || getCustomerAuth()?.phone);
    if (!clean) throw new Error('Sign in required to save addresses');
    const addrs = await userService.addUserAddress(clean, {
      type: (address.type as any) || 'Home',
      addressLine: address.addressLine || 'Narela Hub, Delhi',
      phone: address.phone || clean,
      isDefault: Boolean(address.isDefault),
    });
    const created = addrs[addrs.length - 1];
    return { success: true, address: created as any };
  },

  async deleteAddress(addressId: string, phone?: string): Promise<{ success: boolean }> {
    const clean = normalizePhone(phone || getCustomerAuth()?.phone);
    if (!clean) return { success: false };
    await userService.deleteUserAddress(clean, addressId);
    return { success: true };
  },

  // 5. Banners
  async getBanners(): Promise<ApiBanner[]> {
    if (firestore) {
      try {
        const snap = await getDocs(collection(firestore, 'banners'));
        if (!snap.empty) {
          const cloudBanners: ApiBanner[] = [];
          snap.forEach((d) => cloudBanners.push(d.data() as ApiBanner));
          setStorageItem('banners', cloudBanners, false);
          return cloudBanners;
        }
      } catch (err) {
        console.warn('Firestore getBanners notice:', err);
      }
    }
    return getStorageItem<ApiBanner[]>('banners', DEFAULT_BANNERS);
  },

  async addBanner(banner: Partial<ApiBanner>): Promise<{ success: boolean; banner: ApiBanner }> {
    const current = getStorageItem<ApiBanner[]>('banners', DEFAULT_BANNERS);
    const newBanner: ApiBanner = {
      id: `banner-${Date.now()}`,
      title: banner.title || 'Greenwood Café',
      subtitle: banner.subtitle || '',
      imageDesktop: banner.imageDesktop || '/images/hero-bg-2400.jpg',
      imageMobile: banner.imageMobile || banner.imageDesktop || '/images/hero-bg-mobile-1200.jpg',
      linkUrl: banner.linkUrl || '#menu',
      isActive: banner.isActive ?? true,
      displayOrder: banner.displayOrder ?? current.length + 1,
    };
    const next = [...current, newBanner];
    setStorageItem('banners', next);

    if (firestore) {
      setDoc(doc(firestore, 'banners', newBanner.id), cleanFirestoreData(newBanner)).catch((err) => {
        console.warn('Firestore addBanner notice:', err);
      });
    }

    return { success: true, banner: newBanner };
  },

  async updateBanner(id: string, updates: Partial<ApiBanner>): Promise<{ success: boolean; banner: ApiBanner }> {
    const current = getStorageItem<ApiBanner[]>('banners', DEFAULT_BANNERS);
    let updated: ApiBanner | null = null;
    const next = current.map((b) => {
      if (b.id === id) {
        updated = { ...b, ...updates };
        return updated;
      }
      return b;
    });
    setStorageItem('banners', next);

    if (firestore && updated) {
      setDoc(doc(firestore, 'banners', id), cleanFirestoreData(updated), { merge: true }).catch((err) => {
        console.warn('Firestore updateBanner notice:', err);
      });
    }

    return { success: true, banner: updated || current[0] };
  },

  async deleteBanner(id: string): Promise<{ success: boolean }> {
    const current = getStorageItem<ApiBanner[]>('banners', DEFAULT_BANNERS);
    const next = current.filter((b) => b.id !== id);
    setStorageItem('banners', next);

    if (firestore) {
      deleteDoc(doc(firestore, 'banners', id)).catch((err) => {
        console.warn('Firestore deleteBanner notice:', err);
      });
    }

    return { success: true };
  },

  // 6. Admin Authentication & Verification
  async verifyAdmin(phone: string): Promise<{ authorized: boolean; error?: string }> {
    const clean = phone.replace(/\D/g, '').slice(-10);
    // Primary authorized owner check (Sourav)
    if (clean === '8802325537') {
      return { authorized: true };
    }

    const currentAdmins = getStorageItem<string[]>('admin_phones', DEFAULT_ADMINS);
    const isAuth = currentAdmins.some((p) => p.replace(/\D/g, '').slice(-10) === clean);
    return {
      authorized: isAuth,
      error: isAuth ? undefined : 'This mobile number is not authorized to access Greenwood Admin Panel.',
    };
  },

  async getAdminPhones(): Promise<string[]> {
    if (firestore) {
      try {
        const snap = await getDoc(doc(firestore, 'settings', 'admins'));
        if (snap.exists() && snap.data().phones) {
          const phones = snap.data().phones as string[];
          setStorageItem('admin_phones', phones, false);
          return phones;
        }
      } catch (err) {
        console.warn('Firestore getAdminPhones notice:', err);
      }
    }
    return getStorageItem<string[]>('admin_phones', DEFAULT_ADMINS);
  },

  async updateAdminPhones(admins: string[]): Promise<string[]> {
    const cleanAdmins = admins.map((p) => p.replace(/\D/g, '').slice(-10)).filter((p) => p.length === 10);
    if (!cleanAdmins.includes('8802325537')) cleanAdmins.unshift('8802325537');

    setStorageItem('admin_phones', cleanAdmins);

    if (firestore) {
      setDoc(doc(firestore, 'settings', 'admins'), { phones: cleanAdmins }, { merge: true }).catch((err) => {
        console.warn('Firestore updateAdminPhones notice:', err);
      });
    }

    return cleanAdmins;
  },
};

if (typeof window !== 'undefined') {
  (window as any).__GW_API__ = api;
}

