import type { Dish } from './restaurantData';
import { SEARCHABLE_MENU } from './searchableMenu';

export interface MenuCategory {
  id: string;
  name: string;
  count?: number;
}

export const MENU_CATEGORIES: MenuCategory[] = [
  { id: 'all', name: 'All Dishes (166)' },
  { id: 'chinese', name: 'Chinese (33)' },
  { id: 'tandoori', name: 'Tandoori (20)' },
  { id: 'continental', name: 'Continental (42)' },
  { id: 'north-indian', name: 'North Indian (49)' },
  { id: 'cold-beverages', name: 'Cold Beverages & Shakes (22)' },
];

export const SIGNATURE_TRENDING_DISHES: Dish[] = SEARCHABLE_MENU
  .filter((i) => i.isTrending)
  .slice(0, 8)
  .map((i) => ({
    id: i.id,
    name: i.name,
    category: i.category,
    price: i.price,
    image: i.image,
    description: i.description,
    rating: i.rating || 4.8,
    reviewsCount: i.reviewsCount || 85,
    isVeg: true,
  }));

export const NORTH_INDIAN_DISHES: Dish[] = SEARCHABLE_MENU
  .filter((i) => i.category === 'North Indian')
  .slice(0, 8)
  .map((i) => ({
    id: i.id,
    name: i.name,
    category: i.category,
    price: i.price,
    image: i.image,
    description: i.description,
    rating: i.rating || 4.8,
    reviewsCount: i.reviewsCount || 95,
    isVeg: true,
  }));

export const getDishImage = (name: string, _category?: string): string => {
  const match = SEARCHABLE_MENU.find((i) => i.name.toLowerCase() === name.toLowerCase());
  if (match) return match.image;
  return '/images/zomato/dishes/paneer-butter-masala.jpeg';
};

export const getDishesByCategory = (categoryId: string): Dish[] => {
  let catName = '';
  if (categoryId === 'chinese') catName = 'Chinese';
  else if (categoryId === 'tandoori') catName = 'Tandoori';
  else if (categoryId === 'continental') catName = 'Continental';
  else if (categoryId === 'north-indian') catName = 'North Indian';
  else if (categoryId === 'cold-beverages') catName = 'Cold Beverages & Shakes';

  if (!catName) {
    return SEARCHABLE_MENU.map((i) => ({
      id: i.id,
      name: i.name,
      category: i.category,
      price: i.price,
      image: i.image,
      description: i.description,
      rating: i.rating || 4.7,
      reviewsCount: i.reviewsCount || 40,
      isVeg: true,
    }));
  }

  return SEARCHABLE_MENU
    .filter((i) => i.category === catName)
    .map((i) => ({
      id: i.id,
      name: i.name,
      category: i.category,
      price: i.price,
      image: i.image,
      description: i.description,
      rating: i.rating || 4.7,
      reviewsCount: i.reviewsCount || 40,
      isVeg: true,
    }));
};
