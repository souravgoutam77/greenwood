import { firestore } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { normalizePhone } from './auth';

export interface UserAddress {
  id: string;
  type: 'Home' | 'Office' | 'Other';
  addressLine: string;
  phone: string;
  isDefault: boolean;
  flatHouse?: string;
  streetArea?: string;
  landmark?: string;
  city?: string;
  pincode?: string;
}

export interface UserProfileDocument {
  phone: string;
  name: string;
  email?: string;
  photoURL?: string;
  favouriteDishIds?: string[];
  addresses: UserAddress[];
  createdAt: number;
  updatedAt: number;
}

function getLocalUserKey(phone: string): string {
  const clean = normalizePhone(phone);
  return `gw_user_${clean || 'guest'}`;
}

export const userService = {
  // 1. Get or create user profile
  async getUserProfile(phone: string, defaultName = 'Greenwood Guest'): Promise<UserProfileDocument> {
    const clean = normalizePhone(phone);
    if (!clean) {
      return {
        phone: '',
        name: defaultName,
        email: '',
        addresses: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    }

    const localKey = getLocalUserKey(clean);

    // 1. Check local cache
    let cached: UserProfileDocument | null = null;
    try {
      const raw = localStorage.getItem(localKey);
      if (raw) cached = JSON.parse(raw);
    } catch {}

    // 2. Fetch live from Firestore /users/{clean}
    if (firestore) {
      try {
        const userRef = doc(firestore, 'users', clean);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const cloudData = snap.data() as UserProfileDocument;
          const merged: UserProfileDocument = {
            phone: clean,
            name: cloudData.name || cached?.name || defaultName,
            email: cloudData.email || cached?.email || '',
            addresses: Array.isArray(cloudData.addresses) ? cloudData.addresses : (cached?.addresses || []),
            createdAt: cloudData.createdAt || cached?.createdAt || Date.now(),
            updatedAt: Date.now(),
          };
          localStorage.setItem(localKey, JSON.stringify(merged));
          return merged;
        } else {
          // Initialize document in Firestore for new user
          const initial: UserProfileDocument = {
            phone: clean,
            name: cached?.name || defaultName,
            email: cached?.email || '',
            addresses: cached?.addresses || [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          await setDoc(userRef, initial, { merge: true });
          localStorage.setItem(localKey, JSON.stringify(initial));
          return initial;
        }
      } catch (err) {
        console.warn('[UserService] Firestore user sync notice:', err);
      }
    }

    if (cached) return cached;

    const fallback: UserProfileDocument = {
      phone: clean,
      name: defaultName,
      email: '',
      addresses: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    try {
      localStorage.setItem(localKey, JSON.stringify(fallback));
    } catch {}
    return fallback;
  },

  // 2. Update user profile
  async updateUserProfile(phone: string, updates: Partial<UserProfileDocument>): Promise<UserProfileDocument> {
    const clean = normalizePhone(phone);
    const current = await this.getUserProfile(clean);
    const updated: UserProfileDocument = {
      ...current,
      ...updates,
      phone: clean,
      updatedAt: Date.now(),
    };

    const localKey = getLocalUserKey(clean);
    try {
      localStorage.setItem(localKey, JSON.stringify(updated));
    } catch {}

    if (firestore && clean) {
      try {
        const userRef = doc(firestore, 'users', clean);
        await setDoc(userRef, updated, { merge: true });
      } catch (err) {
        console.warn('[UserService] Firestore updateUserProfile notice:', err);
      }
    }

    window.dispatchEvent(new CustomEvent('gw_user_profile_updated', { detail: updated }));
    return updated;
  },

  // 3. User Addresses
  async getUserAddresses(phone: string): Promise<UserAddress[]> {
    const profile = await this.getUserProfile(phone);
    return profile.addresses || [];
  },

  async addUserAddress(phone: string, address: Omit<UserAddress, 'id'>): Promise<UserAddress[]> {
    const clean = normalizePhone(phone);
    const profile = await this.getUserProfile(clean);
    const newAddress: UserAddress = {
      ...address,
      id: `addr-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    };

    let nextAddresses: UserAddress[];
    if (newAddress.isDefault) {
      nextAddresses = [
        newAddress,
        ...(profile.addresses || []).map((a) => ({ ...a, isDefault: false })),
      ];
    } else {
      nextAddresses = [...(profile.addresses || []), newAddress];
    }

    await this.updateUserProfile(clean, { addresses: nextAddresses });
    return nextAddresses;
  },

  async deleteUserAddress(phone: string, addressId: string): Promise<UserAddress[]> {
    const clean = normalizePhone(phone);
    const profile = await this.getUserProfile(clean);
    const nextAddresses = (profile.addresses || []).filter((a) => a.id !== addressId);
    await this.updateUserProfile(clean, { addresses: nextAddresses });
    return nextAddresses;
  },

  async setDefaultAddress(phone: string, addressId: string): Promise<UserAddress[]> {
    const clean = normalizePhone(phone);
    const profile = await this.getUserProfile(clean);
    const nextAddresses = (profile.addresses || []).map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));
    await this.updateUserProfile(clean, { addresses: nextAddresses });
    return nextAddresses;
  },
};
