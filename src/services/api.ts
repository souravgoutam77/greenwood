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
} from 'firebase/firestore';

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

const DEFAULT_ORDERS: ApiOrder[] = [];

const DEFAULT_DISHES: ApiDish[] = [
  { id: 'item-1', name: 'Paneer Butter Masala', category: 'North Indian', price: 349, inStock: true, image: '/images/admin/dish_paneer.jpg', description: 'Rich cottage cheese cubes simmered in a luscious butter tomato gravy.', isVeg: true, isTrending: false },
  { id: 'item-2', name: 'Farmhouse Pizza', category: 'Pizza & Pasta', price: 399, inStock: true, image: '/images/admin/dish_pizza.jpg', description: 'Crispy thin crust topped with bell peppers, olives, corn and mozzarella.', isVeg: true, isTrending: false },
  { id: 'item-3', name: 'Dal Makhani', category: 'North Indian', price: 249, inStock: true, image: '/images/admin/dish_dal.jpg', description: 'Slow-simmered black lentils infused with white butter and fresh cream.', isVeg: true, isTrending: false },
  { id: 'item-7', name: 'Shahi Paneer Butter Masala', category: 'North Indian', price: 299, inStock: true, image: '/images/dish-detail/rec-shahi-paneer.jpg', description: 'Royal Mughlai style paneer in creamy cashew almond gravy.', isVeg: true, isTrending: false },
  { id: 'item-9', name: 'Paneer Tikka Masala', category: 'North Indian', price: 279, inStock: true, image: '/images/dish-detail/rec-paneer-tikka-masala.jpg', description: 'Smoky grilled paneer tikka tossed in spicy tandoori gravy.', isVeg: true, isTrending: true },
  { id: 'item-10', name: 'Tandoori Tikka Platter', category: 'Starters', price: 299, inStock: true, image: '/images/menu/dish-tandoori-tikka.jpg', description: 'Assorted marinated vegetables & paneer roasted over charcoal.', isVeg: true, isTrending: false },
  { id: 'item-11', name: 'Steamed Veg Momos', category: 'Starters', price: 199, inStock: true, image: '/images/menu/dish-veg-momos.jpg', description: 'Tender dumplings stuffed with crunchy veggies served with spicy dip.', isVeg: true, isTrending: false },
  { id: 'item-4', name: 'Mango Lassi', category: 'Beverages & Desserts', price: 129, inStock: true, image: '/images/admin/dish_lassi.jpg', description: 'Chilled Punjabi yogurt churned with sweet Alphonso mango pulp.', isVeg: true },
  { id: 'item-5', name: 'Garlic Naan', category: 'Breads & Rice', price: 49, inStock: true, image: '/images/admin/dish_naan.jpg', description: 'Tandoor-baked flatbread glazed with crushed garlic and fresh coriander.', isVeg: true },
  { id: 'item-6', name: 'Butter Naan', category: 'Breads & Rice', price: 59, inStock: true, image: '/images/dish-detail/pairing-butter-naan.jpg', description: 'Fluffy tandoori bread brushed with melted butter.', isVeg: true },
  { id: 'item-8', name: 'Veg Biryani', category: 'Breads & Rice', price: 180, inStock: true, image: '/images/dish-detail/pairing-jeera-rice.jpg', description: 'Fragrant basmati rice layered with garden vegetables and saffron.', isVeg: true },
  { id: 'item-12', name: 'Gulab Jamun (2 Pcs)', category: 'Beverages & Desserts', price: 99, inStock: true, image: '/images/offers/dessert_bowl.jpg', description: 'Soft golden milk dumplings soaked in cardamom sugar syrup.', isVeg: true },
  { id: 'item-13', name: 'Kadhai Paneer Special', category: 'North Indian', price: 289, inStock: true, image: '/images/menu/ni-kadhai-paneer.jpg', description: 'Paneer tossed with crisp bell peppers, whole spices and rich tomato gravy.', isVeg: true },
  { id: 'item-14', name: 'Chole Bhature Amritsari', category: 'North Indian', price: 189, inStock: true, image: '/images/menu/ni-chole-bhature.jpg', description: 'Authentic spiced chickpea curry served with golden fluffy bhature.', isVeg: true },
  { id: 'item-15', name: 'Chilli Paneer Crispy', category: 'Starters', price: 250, inStock: true, image: '/images/menu/sig-tandoori-tikka.jpg', description: 'Crisp batter fried paneer tossed with peppers in tangy garlic chilli sauce.', isVeg: true },
  { id: 'item-16', name: 'Margherita Gourmet Pizza', category: 'Pizza & Pasta', price: 349, inStock: true, image: '/images/menu/sig-farmhouse-pizza.jpg', description: 'Classic Italian thin crust with san marzano tomato sauce, fresh mozzarella and basil.', isVeg: true },
  { id: 'item-17', name: 'Veg Hakka Noodles', category: 'Chinese', price: 219, inStock: true, image: '/images/menu/sig-veg-momos.jpg', description: 'Wok-tossed noodles with shredded vegetables and aromatic scallions.', isVeg: true },
  { id: 'item-18', name: 'Jeera Rice Fragrant', category: 'Breads & Rice', price: 140, inStock: true, image: '/images/dish-detail/pairing-jeera-rice.jpg', description: 'Aromatic aged basmati rice tempered with roasted cumin seeds and ghee.', isVeg: true },
];

export function ensureFullCatalogue(dishesList: ApiDish[]): ApiDish[] {
  if (!dishesList || dishesList.length === 0) return DEFAULT_DISHES;
  const existingMap = new Map(dishesList.map((d) => [d.id, d]));
  const full = DEFAULT_DISHES.map((def) => {
    const existing = existingMap.get(def.id);
    return existing ? { ...def, ...existing } : def;
  });
  // Also preserve custom dishes added by admin
  dishesList.forEach((dish) => {
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

const DEFAULT_ADDRESSES: ApiAddress[] = [];

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
    let settings: ApiSettings = DEFAULT_SETTINGS;
    if (firestore) {
      try {
        const snap = await getDoc(doc(firestore, 'settings', 'config'));
        if (snap.exists()) {
          const cloudSettings = snap.data() as ApiSettings;
          settings = { ...DEFAULT_SETTINGS, ...cloudSettings };
        }
      } catch (err) {
        console.warn('Firestore getSettings notice:', err);
      }
    } else {
      settings = getStorageItem<ApiSettings>('settings', DEFAULT_SETTINGS);
    }

    // Auto schedule: 11:00 AM – 11:00 PM if no manual override is active
    if (!settings.manual_override) {
      settings.is_kitchen_open = isWithinAutoStoreHours();
    }

    setStorageItem('settings', settings, false);
    return settings;
  },

  async updateSettings(settings: Partial<ApiSettings>): Promise<{ success: boolean; settings: ApiSettings }> {
    const current = getStorageItem<ApiSettings>('settings', DEFAULT_SETTINGS);
    const updated = { ...current, ...settings };
    setStorageItem('settings', updated, true);

    if (firestore) {
      setDoc(doc(firestore, 'settings', 'config'), cleanFirestoreData(updated), { merge: true }).catch((err) => {
        console.warn('Firestore updateSettings notice:', err);
      });
    }

    return { success: true, settings: updated };
  },

  // 2. Dishes
  getDishesSync(): ApiDish[] {
    const raw = getStorageItem<ApiDish[]>('dishes', DEFAULT_DISHES);
    return ensureFullCatalogue(raw);
  },

  async getDishes(): Promise<ApiDish[]> {
    const cached = ensureFullCatalogue(getStorageItem<ApiDish[]>('dishes', DEFAULT_DISHES));
    if (firestore) {
      try {
        const snap = await withTimeout(getDocs(collection(firestore, 'dishes')), 1200);
        if (!snap.empty) {
          const cloudDishes: ApiDish[] = [];
          snap.forEach((d) => cloudDishes.push(d.data() as ApiDish));
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

  // 3. Orders
  async getOrders(status?: string, search?: string): Promise<ApiOrder[]> {
    let list = getStorageItem<ApiOrder[]>('orders', DEFAULT_ORDERS);

    if (firestore) {
      withTimeout(getDocs(collection(firestore, 'orders')), 1200)
        .then((snap) => {
          if (!snap.empty) {
            const cloudOrders: ApiOrder[] = [];
            snap.forEach((d) => cloudOrders.push(d.data() as ApiOrder));
            setStorageItem('orders', cloudOrders, false);
          }
        })
        .catch(() => {});
    }

    if (status && status !== 'All') {
      list = list.filter((o) => o.status === status);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q)
      );
    }
    return list;
  },

  async getLatestOrder(): Promise<ApiOrder | null> {
    const orders = await this.getOrders();
    return orders.length > 0 ? orders[0] : null;
  },

  async createOrder(payload: CreateOrderPayload): Promise<{ success: boolean; order: ApiOrder }> {
    const currentOrders = getStorageItem<ApiOrder[]>('orders', DEFAULT_ORDERS);
    const newId = `#GW-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const subtotal = payload.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const isTakeaway = payload.orderType === 'takeaway' || payload.orderType === 'Takeaway';
    const deliveryFee = isTakeaway || subtotal >= 500 ? 0 : 49;
    const total = subtotal + deliveryFee;

    const newOrder: ApiOrder = {
      id: newId,
      status: 'New',
      placedTime: `Placed at ${timeFormatted}`,
      orderType: isTakeaway ? 'Takeaway' : payload.orderType === 'dine-in' ? 'Dine-in' : 'Home Delivery',
      paymentMode: (payload.paymentMode as any) || 'Cash on Delivery',
      customerName: payload.customerName || 'Customer',
      customerPhone: payload.customerPhone || '',
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

    const updatedList = [newOrder, ...currentOrders];
    setStorageItem('orders', updatedList, true);

    broadcastCustomEvent('gw_orders_changed', newOrder);

    if (firestore) {
      setDoc(doc(firestore, 'orders', newId), cleanFirestoreData(newOrder)).catch((err) => {
        console.warn('Firestore createOrder notice:', err);
      });
    }

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
    } = {}
  ): Promise<{ success: boolean; order: ApiOrder }> {
    const currentOrders = getStorageItem<ApiOrder[]>('orders', DEFAULT_ORDERS);
    let updatedOrder: ApiOrder | null = null;
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const nextList = currentOrders.map((o) => {
      if (o.id === orderId) {
        updatedOrder = {
          ...o,
          status,
          declineReason: options.declineReason ?? o.declineReason,
          prepTime: options.prepTime ?? o.prepTime,
          completedTime: status === 'Completed' ? `Delivered at ${timeFormatted}` : o.completedTime,
          deliveryPartnerName: options.deliveryPartnerName ?? o.deliveryPartnerName,
          deliveryPartnerPhone: options.deliveryPartnerPhone ?? o.deliveryPartnerPhone,
        };
        return updatedOrder;
      }
      return o;
    });

    setStorageItem('orders', nextList, true);

    broadcastCustomEvent('gw_orders_changed', updatedOrder);

    if (firestore && updatedOrder) {
      setDoc(doc(firestore, 'orders', orderId), cleanFirestoreData(updatedOrder), { merge: true }).catch((err) => {
        console.warn('Firestore updateOrderStatus notice:', err);
      });
    }

    return { success: true, order: updatedOrder || (currentOrders[0] as ApiOrder) };
  },

  // 4. Profile & Addresses
  async getProfile(): Promise<ApiProfile> {
    return getStorageItem<ApiProfile>('profile', DEFAULT_PROFILE);
  },

  async updateProfile(profile: Partial<ApiProfile>): Promise<{ success: boolean; profile: ApiProfile }> {
    const current = getStorageItem<ApiProfile>('profile', DEFAULT_PROFILE);
    const updated = { ...current, ...profile };
    setStorageItem('profile', updated);
    return { success: true, profile: updated };
  },

  async getAddresses(): Promise<ApiAddress[]> {
    return getStorageItem<ApiAddress[]>('addresses', DEFAULT_ADDRESSES);
  },

  async addAddress(address: Partial<ApiAddress>): Promise<{ success: boolean; address: ApiAddress }> {
    const current = getStorageItem<ApiAddress[]>('addresses', DEFAULT_ADDRESSES);
    const newAddr: ApiAddress = {
      id: `addr-${Date.now()}`,
      type: address.type || 'Home',
      addressLine: address.addressLine || 'Narela Hub, Delhi',
      phone: address.phone || '+91 90669 06607',
      isDefault: address.isDefault ?? false,
    };
    const nextList = newAddr.isDefault
      ? [newAddr, ...current.map((a) => ({ ...a, isDefault: false }))]
      : [...current, newAddr];

    setStorageItem('addresses', nextList);
    return { success: true, address: newAddr };
  },

  async deleteAddress(addressId: string): Promise<{ success: boolean }> {
    const current = getStorageItem<ApiAddress[]>('addresses', DEFAULT_ADDRESSES);
    const nextList = current.filter((a) => a.id !== addressId);
    setStorageItem('addresses', nextList);
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

