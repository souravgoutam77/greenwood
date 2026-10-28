// Customer Authentication State Management
// Enforces: NO GUEST CHECKOUT
// Requires verified mobile number & name before checkout

export interface CustomerAuth {
  name: string;
  phone: string;
  verified: boolean;
  loggedInAt?: number;
}

const AUTH_STORAGE_KEY = 'gw_customer_auth';

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
    window.dispatchEvent(new CustomEvent('gw_auth_changed', { detail: auth }));
  } catch (err) {
    console.error('Failed to save customer auth:', err);
  }
}

export function clearCustomerAuth(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('gw_auth_changed', { detail: null }));
  } catch (err) {
    console.error('Failed to clear customer auth:', err);
  }
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem('gw_admin_session');
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return Boolean(parsed && parsed.authorized);
  } catch {
    return false;
  }
}
