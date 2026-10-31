// Greenwood Customer Favourites Service
// Synchronizes favorite dishes across localStorage and Firestore users/{phone}.favouriteDishIds

import { firestore } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getCustomerAuth } from './auth';
import { SEARCHABLE_MENU } from '../data/searchableMenu';
import { api, type ApiDish } from './api';

const FAVORITES_STORAGE_KEY = 'gw_favorites';

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isFavorite(dishId: string): boolean {
  if (!dishId) return false;
  const list = getFavorites();
  return list.includes(dishId);
}

export async function syncFavoritesFromCloud(phone?: string): Promise<string[]> {
  const currentAuth = getCustomerAuth();
  const rawPhone = phone || currentAuth?.phone;
  if (!rawPhone || !firestore) return getFavorites();

  const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);
  if (cleanPhone.length !== 10) return getFavorites();

  try {
    const snap = await getDoc(doc(firestore, 'users', cleanPhone));
    if (snap.exists()) {
      const data = snap.data();
      if (Array.isArray(data?.favouriteDishIds)) {
        const localFavs = getFavorites();
        const merged = Array.from(new Set([...localFavs, ...data.favouriteDishIds]));
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(merged));
        window.dispatchEvent(
          new CustomEvent('gw_favorites_changed', { detail: { favorites: merged } })
        );
        return merged;
      }
    }
  } catch (err) {
    console.warn('[Favorites] Cloud sync notice:', err);
  }
  return getFavorites();
}

export async function toggleFavorite(dishId: string, phone?: string): Promise<boolean> {
  if (!dishId || typeof window === 'undefined') return false;
  try {
    const list = getFavorites();
    let next: string[];
    let isNowFav = false;

    if (list.includes(dishId)) {
      next = list.filter((id) => id !== dishId);
      isNowFav = false;
    } else {
      next = [...list, dishId];
      isNowFav = true;
    }

    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(
      new CustomEvent('gw_favorites_changed', { detail: { favorites: next, dishId, isNowFav } })
    );

    // Sync to Firestore if user has phone
    const currentAuth = getCustomerAuth();
    const rawPhone = phone || currentAuth?.phone;
    if (rawPhone && firestore) {
      const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);
      if (cleanPhone.length === 10) {
        setDoc(
          doc(firestore, 'users', cleanPhone),
          { favouriteDishIds: next },
          { merge: true }
        ).catch((err) => console.warn('[Favorites] Firestore sync notice:', err));
      }
    }

    return isNowFav;
  } catch (err) {
    console.error('Failed to toggle favorite:', err);
    return false;
  }
}

export function getFavoriteDishes(_phone?: string): ApiDish[] {
  const favIds = getFavorites();
  if (favIds.length === 0) return [];

  // Match against current dishes or SEARCHABLE_MENU
  const allDishes = api.getDishesSync();
  const dishMap = new Map(allDishes.map((d) => [d.id, d]));

  const favDishes: ApiDish[] = [];
  favIds.forEach((id) => {
    const dish = dishMap.get(id);
    if (dish) {
      favDishes.push(dish);
    } else {
      const s = SEARCHABLE_MENU.find((item) => item.id === id);
      if (s) {
        favDishes.push({
          id: s.id,
          name: s.name,
          category: s.category,
          subcategory: s.subcategory,
          price: s.price,
          inStock: true,
          image: s.image,
          description: s.description,
          isVeg: true,
          isTrending: Boolean(s.isTrending),
          rating: s.rating || 4.8,
          reviews_count: s.reviewsCount || 40,
        });
      }
    }
  });

  return favDishes;
}
