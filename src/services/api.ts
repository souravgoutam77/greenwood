// Hybrid API & Cloud Client for Greenwood Café & Restaurant
// Seamlessly operates across:
// 1. Local / Remote Node.js SQLite Backend (/api/*)
// 2. Firebase Hosting CDN & Cloud Firestore (Zero-downtime Serverless Mode)

import { firestore } from './firebase';
import { collection, doc, getDocs, setDoc, updateDoc, getDoc } from 'firebase/firestore';

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
  isTrending?: boolean;
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
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
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

// -------------------------------------------------------------------
// DEFAULT SEED DATA (Used when in Cloud / Static Hosting Mode)
// -------------------------------------------------------------------
const DEFAULT_SETTINGS: ApiSettings = {
  is_kitchen_open: true,
  home_delivery_enabled: true,
  takeaway_enabled: true,
  opening_hours: '11:00 AM – 11:00 PM',
  avg_prep_time: '18 mins',
  delivery_radius: '15 km',
  restaurant_phone: '+91 98765 43210',
  kitchen_phone: '+91 98123 45678',
  audio_alerts: true,
};

const DEFAULT_ORDERS: ApiOrder[] = [
  {
    id: '#GW-8495',
    status: 'New',
    placedTime: '2 mins ago',
    orderType: 'Home Delivery',
    paymentMode: 'Cash on Delivery',
    customerName: 'Amit Verma',
    customerPhone: '+91 98123 45678',
    customerAddressOrTable: 'Sector 14, Noida, UP (Hub Delivery)',
    items: [
      { name: 'Dal Makhani', quantity: 1, price: 249, image: '/images/dish-detail/rec-dal-makhani.jpg' },
      { name: 'Butter Naan', quantity: 2, price: 118, image: '/images/dish-detail/pairing-butter-naan.jpg' },
      { name: 'Veg Biryani', quantity: 1, price: 180, image: '/images/dish-detail/pairing-jeera-rice.jpg' },
    ],
    specialInstruction: 'Less Spicy / No Extra Butter',
    subtotal: 547,
    deliveryFee: 50,
    total: 597,
  },
  {
    id: '#GW-8492',
    status: 'Preparing',
    placedTime: '15 mins ago',
    prepTime: 'Prep: 18 mins',
    orderType: 'Dine-in',
    paymentMode: 'Paid via UPI',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    customerAddressOrTable: 'Table No. 4',
    items: [
      { name: 'Shahi Paneer Butter Masala', quantity: 1, price: 299, image: '/images/dish-detail/rec-shahi-paneer.jpg' },
      { name: 'Garlic Naan', quantity: 2, price: 98, image: '/images/dish-detail/pairing-garlic-naan.jpg' },
      { name: 'Mango Lassi', quantity: 1, price: 129, image: '/images/orders/item3_mango_lassi.jpg' },
    ],
    specialInstruction: 'Jain Food (No Onion/Garlic)',
    subtotal: 526,
    deliveryFee: 0,
    total: 526,
  },
  {
    id: '#GW-8488',
    status: 'New',
    placedTime: '5 mins ago',
    orderType: 'Takeaway',
    paymentMode: 'Paid via UPI',
    customerName: 'Vikram Malhotra',
    customerPhone: '+91 98451 23456',
    customerAddressOrTable: 'Pickup at Narela Counter',
    items: [
      { name: 'Farmhouse Pizza', quantity: 1, price: 399, image: '/images/menu/dish-farmhouse-pizza.jpg' },
      { name: 'Mango Lassi', quantity: 1, price: 129, image: '/images/orders/item3_mango_lassi.jpg' },
    ],
    specialInstruction: 'Pack extra oregano & chilli flakes',
    subtotal: 528,
    deliveryFee: 0,
    total: 528,
  },
  {
    id: '#GW-8481',
    status: 'Out for Delivery',
    placedTime: '28 mins ago',
    prepTime: 'ETA: 10-15 mins',
    orderType: 'Home Delivery',
    paymentMode: 'Paid via Card',
    customerName: 'Priya Kapoor',
    customerPhone: '+91 99901 22334',
    customerAddressOrTable: 'Pocket 3, Sector A6, Narela, Delhi',
    items: [
      { name: 'Paneer Tikka Masala', quantity: 1, price: 279, image: '/images/dish-detail/rec-paneer-tikka-masala.jpg' },
      { name: 'Jeera Rice', quantity: 1, price: 129, image: '/images/dish-detail/pairing-jeera-rice.jpg' },
    ],
    subtotal: 408,
    deliveryFee: 50,
    total: 458,
    deliveryPartnerName: 'Vikas Sharma',
    deliveryPartnerPhone: '9811223344',
  },
  {
    id: '#GW-8468',
    status: 'Completed',
    placedTime: '45 mins ago',
    completedTime: 'Completed at 6:50 PM',
    orderType: 'Dine-in',
    paymentMode: 'Paid via UPI',
    customerName: 'Sneha Singh',
    customerPhone: '+91 98711 44556',
    customerAddressOrTable: 'Table No. 2',
    items: [
      { name: 'Paneer Butter Masala', quantity: 2, price: 598, image: '/images/dish-detail/rec-shahi-paneer.jpg' },
      { name: 'Garlic Naan', quantity: 2, price: 196, image: '/images/dish-detail/pairing-garlic-naan.jpg' },
    ],
    subtotal: 794,
    deliveryFee: 0,
    total: 794,
  },
  {
    id: '#GW-8455',
    status: 'Declined',
    placedTime: '1 hr 15 mins ago',
    orderType: 'Home Delivery',
    paymentMode: 'Cash on Delivery',
    customerName: 'Rajesh Kumar',
    customerPhone: '+91 99100 88776',
    customerAddressOrTable: 'Alipur Extension (Beyond 15km Limit)',
    items: [
      { name: 'Farmhouse Pizza', quantity: 1, price: 399, image: '/images/menu/dish-farmhouse-pizza.jpg' },
    ],
    subtotal: 399,
    deliveryFee: 50,
    total: 449,
    declineReason: 'Address location falls outside maximum 15km delivery hub radius.',
  },
];

const DEFAULT_DISHES: ApiDish[] = [
  { id: 'item-1', name: 'Paneer Butter Masala', category: 'North Indian', price: 349, inStock: true, image: '/images/admin/dish_paneer.jpg', description: 'Rich cottage cheese cubes simmered in a luscious butter tomato gravy.', isVeg: true, isTrending: true },
  { id: 'item-2', name: 'Farmhouse Pizza', category: 'Pizza & Pasta', price: 399, inStock: true, image: '/images/admin/dish_pizza.jpg', description: 'Crispy thin crust topped with bell peppers, olives, corn and mozzarella.', isVeg: true, isTrending: true },
  { id: 'item-3', name: 'Dal Makhani', category: 'North Indian', price: 249, inStock: true, image: '/images/admin/dish_dal.jpg', description: 'Slow-simmered black lentils infused with white butter and fresh cream.', isVeg: true, isTrending: true },
  { id: 'item-4', name: 'Mango Lassi', category: 'Beverages & Desserts', price: 129, inStock: true, image: '/images/admin/dish_lassi.jpg', description: 'Chilled Punjabi yogurt churned with sweet Alphonso mango pulp.', isVeg: true },
  { id: 'item-5', name: 'Garlic Naan', category: 'Breads & Rice', price: 49, inStock: true, image: '/images/admin/dish_naan.jpg', description: 'Tandoor-baked flatbread glazed with crushed garlic and fresh coriander.', isVeg: true },
  { id: 'item-6', name: 'Butter Naan', category: 'Breads & Rice', price: 59, inStock: true, image: '/images/dish-detail/pairing-butter-naan.jpg', description: 'Fluffy tandoori bread brushed with melted butter.', isVeg: true },
  { id: 'item-7', name: 'Shahi Paneer Butter Masala', category: 'North Indian', price: 299, inStock: true, image: '/images/dish-detail/rec-shahi-paneer.jpg', description: 'Royal Mughlai style paneer in creamy cashew almond gravy.', isVeg: true, isTrending: true },
  { id: 'item-8', name: 'Veg Biryani', category: 'Breads & Rice', price: 180, inStock: true, image: '/images/dish-detail/pairing-jeera-rice.jpg', description: 'Fragrant basmati rice layered with garden vegetables and saffron.', isVeg: true },
  { id: 'item-9', name: 'Paneer Tikka Masala', category: 'North Indian', price: 279, inStock: true, image: '/images/dish-detail/rec-paneer-tikka-masala.jpg', description: 'Smoky grilled paneer tikka tossed in spicy tandoori gravy.', isVeg: true },
  { id: 'item-10', name: 'Tandoori Tikka Platter', category: 'Starters', price: 299, inStock: true, image: '/images/menu/dish-tandoori-tikka.jpg', description: 'Assorted marinated vegetables & paneer roasted over charcoal.', isVeg: true },
  { id: 'item-11', name: 'Steamed Veg Momos', category: 'Starters', price: 199, inStock: true, image: '/images/menu/dish-veg-momos.jpg', description: 'Tender dumplings stuffed with crunchy veggies served with spicy dip.', isVeg: true },
  { id: 'item-12', name: 'Gulab Jamun (2 Pcs)', category: 'Beverages & Desserts', price: 99, inStock: true, image: '/images/offers/dessert_bowl.jpg', description: 'Soft golden milk dumplings soaked in cardamom sugar syrup.', isVeg: true },
];

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
  name: 'Rahul Sharma',
  phone: '+91 98765 43210',
  email: 'rahul.sharma@example.com',
  membership: 'Pure Veg Dining Club Member',
};

const DEFAULT_ADDRESSES: ApiAddress[] = [
  { id: 'addr-1', type: 'Home', isDefault: true, addressLine: '123, Green Park, Sector 15, Noida, Uttar Pradesh - 201301', phone: '+91 98765 43210' },
  { id: 'addr-2', type: 'Office', isDefault: false, addressLine: 'Tower B, Cyber City, Phase 2, Gurugram, Haryana - 122002', phone: '+91 98765 43210' },
];

// Helper to determine if we are running in local dev/server mode or static Firebase Hosting mode
let _isServerApiAvailable: boolean | null = null;

async function checkApiAvailability(): Promise<boolean> {
  if (_isServerApiAvailable !== null) return _isServerApiAvailable;
  // If explicitly hosted on firebaseapp or web.app, use Cloud Firestore & client-storage
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('firebaseapp.com') || host.includes('web.app')) {
      _isServerApiAvailable = false;
      return false;
    }
  }

  try {
    const res = await fetch('/api/health', { method: 'GET', signal: AbortSignal.timeout(2000) });
    const cType = res.headers.get('content-type') || '';
    if (res.ok && cType.includes('application/json')) {
      _isServerApiAvailable = true;
      return true;
    }
  } catch {
    // API not reachable
  }
  _isServerApiAvailable = false;
  return false;
}

// -------------------------------------------------------------------
// CLOUD STORAGE & FIRESTORE ADAPTER
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

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`gw_${key}`, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(`gw_${key}_updated`, { detail: value }));
  } catch (err) {
    console.warn(`Storage error for gw_${key}:`, err);
  }
}

// -------------------------------------------------------------------
// UNIFIED API OBJECT
// -------------------------------------------------------------------
export const api = {
  // 1. Settings
  async getSettings(): Promise<ApiSettings> {
    const hasServer = await checkApiAvailability();
    if (hasServer) {
      const res = await fetch('/api/settings');
      if (res.ok) return res.json();
    }

    // Try Firestore if initialized
    if (firestore) {
      try {
        const snap = await getDoc(doc(firestore, 'settings', 'config'));
        if (snap.exists()) {
          const cloudSettings = snap.data() as ApiSettings;
          setStorageItem('settings', cloudSettings);
          return cloudSettings;
        }
      } catch {
        // Fallback to local storage
      }
    }

    return getStorageItem<ApiSettings>('settings', DEFAULT_SETTINGS);
  },

  async updateSettings(settings: Partial<ApiSettings>): Promise<{ success: boolean; settings: ApiSettings }> {
    const hasServer = await checkApiAvailability();
    if (hasServer) {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) return res.json();
    }

    const current = getStorageItem<ApiSettings>('settings', DEFAULT_SETTINGS);
    const updated = { ...current, ...settings };
    setStorageItem('settings', updated);

    // Sync to Firestore if available
    if (firestore) {
      setDoc(doc(firestore, 'settings', 'config'), updated, { merge: true }).catch(() => {});
    }

    return { success: true, settings: updated };
  },

  // 2. Dishes
  async getDishes(): Promise<ApiDish[]> {
    const hasServer = await checkApiAvailability();
    if (hasServer) {
      const res = await fetch('/api/dishes');
      if (res.ok) return res.json();
    }

    // Try Firestore if initialized
    if (firestore) {
      try {
        const snap = await getDocs(collection(firestore, 'dishes'));
        if (!snap.empty) {
          const cloudDishes: ApiDish[] = [];
          snap.forEach((d) => cloudDishes.push(d.data() as ApiDish));
          setStorageItem('dishes', cloudDishes);
          return cloudDishes;
        }
      } catch {
        // fallback
      }
    }

    return getStorageItem<ApiDish[]>('dishes', DEFAULT_DISHES);
  },

  async addDish(dish: Partial<ApiDish>): Promise<{ success: boolean; dish: ApiDish }> {
    const hasServer = await checkApiAvailability();
    if (hasServer) {
      const res = await fetch('/api/dishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dish),
      });
      if (res.ok) return res.json();
    }

    const current = getStorageItem<ApiDish[]>('dishes', DEFAULT_DISHES);
    const newDish: ApiDish = {
      id: dish.id || `dish-${Date.now()}`,
      name: dish.name || 'Special Dish',
      category: dish.category || 'North Indian',
      subcategory: dish.subcategory,
      price: dish.price || 250,
      description: dish.description || 'Pure Vegetarian specialty.',
      image: dish.image || '/images/dish-detail/rec-dal-makhani.jpg',
      inStock: dish.inStock ?? true,
      rating: 4.8,
      reviews_count: 24,
      isVeg: true,
    };

    const updated = [newDish, ...current];
    setStorageItem('dishes', updated);

    if (firestore) {
      setDoc(doc(firestore, 'dishes', newDish.id), newDish).catch(() => {});
    }

    return { success: true, dish: newDish };
  },

  async updateDish(dishId: string, updates: Partial<ApiDish>): Promise<{ success: boolean; dish: ApiDish }> {
    const hasServer = await checkApiAvailability();
    if (hasServer) {
      const res = await fetch(`/api/dishes/${encodeURIComponent(dishId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) return res.json();
    }

    const current = getStorageItem<ApiDish[]>('dishes', DEFAULT_DISHES);
    let updatedDish: ApiDish | null = null;
    const nextList = current.map((d) => {
      if (d.id === dishId) {
        updatedDish = { ...d, ...updates };
        return updatedDish;
      }
      return d;
    });

    setStorageItem('dishes', nextList);

    if (firestore && updatedDish) {
      updateDoc(doc(firestore, 'dishes', dishId), updates).catch(() => {});
    }

    return { success: true, dish: updatedDish || (current[0] as ApiDish) };
  },

  // 3. Orders
  async getOrders(status?: string, search?: string): Promise<ApiOrder[]> {
    const hasServer = await checkApiAvailability();
    if (hasServer) {
      const params = new URLSearchParams();
      if (status && status !== 'All') params.append('status', status);
      if (search) params.append('search', search);
      const qs = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`/api/orders${qs}`);
      if (res.ok) return res.json();
    }

    // Try Firestore if available
    if (firestore) {
      try {
        const snap = await getDocs(collection(firestore, 'orders'));
        if (!snap.empty) {
          const cloudOrders: ApiOrder[] = [];
          snap.forEach((d) => cloudOrders.push(d.data() as ApiOrder));
          setStorageItem('orders', cloudOrders);
        }
      } catch {
        // fallback
      }
    }

    let list = getStorageItem<ApiOrder[]>('orders', DEFAULT_ORDERS);
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
    const hasServer = await checkApiAvailability();
    if (hasServer) {
      const res = await fetch('/api/orders/latest');
      if (res.ok) return res.json();
    }

    const orders = getStorageItem<ApiOrder[]>('orders', DEFAULT_ORDERS);
    return orders.length > 0 ? orders[0] : null;
  },

  async createOrder(payload: CreateOrderPayload): Promise<{ success: boolean; order: ApiOrder }> {
    const hasServer = await checkApiAvailability();
    if (hasServer) {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) return res.json();
    }

    const currentOrders = getStorageItem<ApiOrder[]>('orders', DEFAULT_ORDERS);
    const newId = `#GW-${8496 + currentOrders.length}`;
    const subtotal = payload.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const deliveryFee = payload.orderType === 'delivery' ? 50 : 0;
    const total = subtotal + deliveryFee;

    const newOrder: ApiOrder = {
      id: newId,
      status: 'New',
      placedTime: 'Just now',
      orderType: payload.orderType === 'delivery' ? 'Home Delivery' : payload.orderType === 'takeaway' ? 'Takeaway' : 'Dine-in',
      paymentMode: (payload.paymentMode as any) || 'Cash on Delivery',
      customerName: payload.customerName || 'Guest Customer',
      customerPhone: payload.customerPhone || '+91 98765 43210',
      customerAddressOrTable: payload.customerAddress || 'Narela Hub',
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
    };

    const updatedList = [newOrder, ...currentOrders];
    setStorageItem('orders', updatedList);

    if (firestore) {
      setDoc(doc(firestore, 'orders', newId), newOrder).catch(() => {});
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
    const hasServer = await checkApiAvailability();
    if (hasServer) {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          declineReason: options.declineReason,
          prepTime: options.prepTime,
          deliveryPartnerName: options.deliveryPartnerName,
          deliveryPartnerPhone: options.deliveryPartnerPhone,
        }),
      });
      if (res.ok) return res.json();
    }

    const currentOrders = getStorageItem<ApiOrder[]>('orders', DEFAULT_ORDERS);
    let updatedOrder: ApiOrder | null = null;
    const nextList = currentOrders.map((o) => {
      if (o.id === orderId) {
        updatedOrder = {
          ...o,
          status,
          declineReason: options.declineReason ?? o.declineReason,
          prepTime: options.prepTime ?? o.prepTime,
          completedTime: status === 'Completed' ? 'Completed just now' : o.completedTime,
          deliveryPartnerName: options.deliveryPartnerName ?? o.deliveryPartnerName,
          deliveryPartnerPhone: options.deliveryPartnerPhone ?? o.deliveryPartnerPhone,
        };
        return updatedOrder;
      }
      return o;
    });

    setStorageItem('orders', nextList);

    if (firestore && updatedOrder) {
      updateDoc(doc(firestore, 'orders', orderId), {
        status,
        declineReason: options.declineReason,
        prepTime: options.prepTime,
        deliveryPartnerName: options.deliveryPartnerName,
        deliveryPartnerPhone: options.deliveryPartnerPhone,
      }).catch(() => {});
    }

    return { success: true, order: updatedOrder || (currentOrders[0] as ApiOrder) };
  },

  // 4. Profile & Addresses
  async getProfile(): Promise<ApiProfile> {
    const hasServer = await checkApiAvailability();
    if (hasServer) {
      const res = await fetch('/api/profile');
      if (res.ok) return res.json();
    }
    return getStorageItem<ApiProfile>('profile', DEFAULT_PROFILE);
  },

  async updateProfile(profile: Partial<ApiProfile>): Promise<{ success: boolean; profile: ApiProfile }> {
    const hasServer = await checkApiAvailability();
    if (hasServer) {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (res.ok) return res.json();
    }

    const current = getStorageItem<ApiProfile>('profile', DEFAULT_PROFILE);
    const updated = { ...current, ...profile };
    setStorageItem('profile', updated);
    return { success: true, profile: updated };
  },

  async getAddresses(): Promise<ApiAddress[]> {
    const hasServer = await checkApiAvailability();
    if (hasServer) {
      const res = await fetch('/api/addresses');
      if (res.ok) return res.json();
    }
    return getStorageItem<ApiAddress[]>('addresses', DEFAULT_ADDRESSES);
  },

  async addAddress(address: Partial<ApiAddress>): Promise<{ success: boolean; address: ApiAddress }> {
    const hasServer = await checkApiAvailability();
    if (hasServer) {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address),
      });
      if (res.ok) return res.json();
    }

    const current = getStorageItem<ApiAddress[]>('addresses', DEFAULT_ADDRESSES);
    const newAddr: ApiAddress = {
      id: `addr-${Date.now()}`,
      type: address.type || 'Home',
      addressLine: address.addressLine || 'Narela Hub, Delhi',
      phone: address.phone || '+91 98765 43210',
      isDefault: address.isDefault ?? false,
    };
    const nextList = newAddr.isDefault
      ? [newAddr, ...current.map((a) => ({ ...a, isDefault: false }))]
      : [...current, newAddr];

    setStorageItem('addresses', nextList);
    return { success: true, address: newAddr };
  },

  async deleteAddress(addressId: string): Promise<{ success: boolean }> {
    const hasServer = await checkApiAvailability();
    if (hasServer) {
      const res = await fetch(`/api/addresses/${encodeURIComponent(addressId)}`, {
        method: 'DELETE',
      });
      if (res.ok) return res.json();
    }

    const current = getStorageItem<ApiAddress[]>('addresses', DEFAULT_ADDRESSES);
    const nextList = current.filter((a) => a.id !== addressId);
    setStorageItem('addresses', nextList);
    return { success: true };
  },

  // 5. Banners
  async getBanners(): Promise<ApiBanner[]> {
    const hasServer = await checkApiAvailability();
    if (hasServer) {
      const res = await fetch('/api/banners');
      if (res.ok) return res.json();
    }
    return getStorageItem<ApiBanner[]>('banners', DEFAULT_BANNERS);
  },

  async addBanner(banner: Partial<ApiBanner>): Promise<{ success: boolean; banner: ApiBanner }> {
    const hasServer = await checkApiAvailability();
    if (hasServer) {
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(banner),
      });
      if (res.ok) return res.json();
    }

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
    return { success: true, banner: newBanner };
  },

  async updateBanner(id: string, updates: Partial<ApiBanner>): Promise<{ success: boolean; banner: ApiBanner }> {
    const hasServer = await checkApiAvailability();
    if (hasServer) {
      const res = await fetch(`/api/banners/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) return res.json();
    }

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
    return { success: true, banner: updated || current[0] };
  },

  async deleteBanner(id: string): Promise<{ success: boolean }> {
    const hasServer = await checkApiAvailability();
    if (hasServer) {
      const res = await fetch(`/api/banners/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) return res.json();
    }

    const current = getStorageItem<ApiBanner[]>('banners', DEFAULT_BANNERS);
    const next = current.filter((b) => b.id !== id);
    setStorageItem('banners', next);
    return { success: true };
  },

  // 6. Admin Authentication & Verification
  async verifyAdmin(phone: string): Promise<{ authorized: boolean; error?: string }> {
    const clean = phone.replace(/\D/g, '').slice(-10);
    const hasServer = await checkApiAvailability();
    if (hasServer) {
      try {
        const res = await fetch('/api/admin/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: clean }),
        });
        const data = await res.json();
        return { authorized: res.ok && data.authorized, error: data.error };
      } catch (err: any) {
        return { authorized: false, error: err.message };
      }
    }

    const currentAdmins = getStorageItem<string[]>('admin_phones', DEFAULT_ADMINS);
    const isAuth = currentAdmins.some((p) => p.replace(/\D/g, '').slice(-10) === clean);
    return {
      authorized: isAuth,
      error: isAuth ? undefined : 'This mobile number is not authorized to access Greenwood Admin Panel.',
    };
  },

  async getAdminPhones(): Promise<string[]> {
    const hasServer = await checkApiAvailability();
    if (hasServer) {
      const res = await fetch('/api/settings/admins');
      if (res.ok) {
        const data = await res.json();
        return data.admins || [];
      }
    }
    return getStorageItem<string[]>('admin_phones', DEFAULT_ADMINS);
  },

  async updateAdminPhones(admins: string[]): Promise<string[]> {
    const cleanAdmins = admins.map((p) => p.replace(/\D/g, '').slice(-10)).filter((p) => p.length === 10);
    if (!cleanAdmins.includes('8802325537')) cleanAdmins.unshift('8802325537');

    const hasServer = await checkApiAvailability();
    if (hasServer) {
      const res = await fetch('/api/settings/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admins: cleanAdmins }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.admins;
      }
    }

    setStorageItem('admin_phones', cleanAdmins);
    return cleanAdmins;
  },
};
