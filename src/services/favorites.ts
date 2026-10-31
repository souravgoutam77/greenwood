// Greenwood Customer Favourites Service
// Manages favorited dish IDs with persistent localStorage & multi-tab/window event synchronization

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

export function toggleFavorite(dishId: string): boolean {
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
    window.dispatchEvent(new CustomEvent('gw_favorites_changed', { detail: { favorites: next, dishId, isNowFav } }));
    return isNowFav;
  } catch (err) {
    console.error('Failed to toggle favorite:', err);
    return false;
  }
}
