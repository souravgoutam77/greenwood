// Customer Authentication State Management
// Enforces: NO GUEST CHECKOUT
// Requires verified mobile number & name before checkout
import { firestore } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export interface CustomerAuth {
  name: string;
  phone: string;
  email?: string;
  verified: boolean;
  loggedInAt?: number;
}

export const PRIMARY_ADMIN_PHONE = '8802325537';
export const PRIMARY_ADMIN_NAME = 'Sourav';

const AUTH_STORAGE_KEY = 'gw_customer_auth';
const ADMIN_STORAGE_KEY = 'gw_admin_session';

export function normalizePhone(rawPhone?: string | null): string {
  if (!rawPhone) return '';
  return rawPhone.replace(/\D/g, '').slice(-10);
}

export function isAuthorizedAdminPhone(phone?: string | null): boolean {
  if (!phone) return false;
  const clean = normalizePhone(phone);
  if (clean === PRIMARY_ADMIN_PHONE) return true;
  try {
    const listRaw = localStorage.getItem('gw_authorized_admins');
    if (listRaw) {
      const list: string[] = JSON.parse(listRaw);
      return list.map(normalizePhone).includes(clean);
    }
  } catch {}
  return false;
}

export function getCustomerAuth(): CustomerAuth | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.verified && parsed.phone) {
      return parsed;
    }
  } catch {}
  return null;
}

export function setCustomerAuth(auth: CustomerAuth): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
    // If the logged in user is the primary admin Sourav (8802325537), automatically authorize admin session
    if (isAuthorizedAdminPhone(auth.phone)) {
      localStorage.setItem(
        ADMIN_STORAGE_KEY,
        JSON.stringify({
          authorized: true,
          phone: PRIMARY_ADMIN_PHONE,
          name: auth.name || PRIMARY_ADMIN_NAME,
          role: 'owner',
          timestamp: Date.now(),
        })
      );
      ensurePrimaryAdminInFirestore().catch(() => {});
    }
    window.dispatchEvent(new CustomEvent('gw_auth_changed', { detail: auth }));
  } catch (err) {
    console.error('Failed to save customer auth:', err);
  }
}

export function clearCustomerAuth(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('gw_auth_changed', { detail: null }));
  } catch (err) {
    console.error('Failed to clear customer auth:', err);
  }
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    // 1. Direct admin session
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.authorized) return true;
    }

    // 2. Check if customer auth is the primary owner
    const customer = getCustomerAuth();
    if (customer && customer.verified && isAuthorizedAdminPhone(customer.phone)) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

export async function ensurePrimaryAdminInFirestore(): Promise<void> {
  if (!firestore) return;
  try {
    const adminDocRef = doc(firestore, 'admins', PRIMARY_ADMIN_PHONE);
    const snapshot = await getDoc(adminDocRef);
    if (!snapshot.exists()) {
      await setDoc(adminDocRef, {
        phone: PRIMARY_ADMIN_PHONE,
        name: PRIMARY_ADMIN_NAME,
        role: 'owner',
        isPrimary: true,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.warn('[Auth] Firestore admin sync notice:', err);
  }
}
