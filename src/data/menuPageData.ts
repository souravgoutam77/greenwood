import type { Dish } from './restaurantData';
import { SEARCHABLE_MENU } from './searchableMenu';

export interface MenuCategory {
  id: string;
  name: string;
}

export const MENU_CATEGORIES: MenuCategory[] = [
  { id: 'all', name: 'All Items' },
  { id: 'starters', name: 'Starters' },
  { id: 'north-indian', name: 'North Indian' },
  { id: 'chinese', name: 'Chinese' },
  { id: 'south-indian', name: 'South Indian' },
  { id: 'pizza-pasta', name: 'Pizza & Pasta' },
  { id: 'breads-thalis', name: 'Breads & Thalis' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'beverages', name: 'Beverages' },
];

export const SIGNATURE_TRENDING_DISHES: Dish[] = [
  {
    id: 'sig-butter-paneer',
    name: 'Butter Paneer',
    description: 'Rich, creamy and full of authentic flavours.',
    price: 349,
    rating: 4.8,
    reviewsCount: 184,
    isVeg: true,
    image: '/images/menu/dish-butter-paneer.jpg',
  },
  {
    id: 'sig-farmhouse-pizza',
    name: 'Farmhouse Pizza',
    description: 'Loaded with fresh veggies, cheese and herbs.',
    price: 399,
    rating: 4.7,
    reviewsCount: 120,
    isVeg: true,
    image: '/images/menu/dish-farmhouse-pizza.jpg',
  },
  {
    id: 'sig-tandoori-tikka',
    name: 'Tandoori Tikka',
    description: 'Smoky, spiced and perfectly grilled.',
    price: 299,
    rating: 4.8,
    reviewsCount: 96,
    isVeg: true,
    image: '/images/menu/dish-tandoori-tikka.jpg',
  },
  {
    id: 'sig-veg-momos',
    name: 'Veg Momos',
    description: 'Soft, juicy and served with spicy chutney.',
    price: 249,
    rating: 4.6,
    reviewsCount: 72,
    isVeg: true,
    image: '/images/menu/dish-veg-momos.jpg',
  },
];

export const NORTH_INDIAN_DISHES: Dish[] = [
  {
    id: 'ni-paneer-butter-masala',
    name: 'Paneer Butter Masala',
    description: 'Creamy and flavorful.',
    price: 329,
    rating: 4.7,
    reviewsCount: 98,
    isVeg: true,
    image: '/images/menu/dish-paneer-butter-masala.jpg',
  },
  {
    id: 'ni-dal-makhani',
    name: 'Dal Makhani',
    description: 'Slow-cooked and rich.',
    price: 279,
    rating: 4.6,
    reviewsCount: 84,
    isVeg: true,
    image: '/images/menu/dish-dal-makhani.jpg',
  },
  {
    id: 'ni-kadhai-paneer',
    name: 'Kadhai Paneer',
    description: 'Spicy, aromatic and delicious.',
    price: 299,
    rating: 4.5,
    reviewsCount: 61,
    isVeg: true,
    image: '/images/menu/dish-kadhai-paneer.jpg',
  },
  {
    id: 'ni-chole-bhature',
    name: 'Chole Bhature',
    description: 'Classic and comforting.',
    price: 249,
    rating: 4.4,
    reviewsCount: 93,
    isVeg: true,
    image: '/images/menu/dish-chole-bhature.jpg',
  },
];

// Helper to get curated image for any dish from SEARCHABLE_MENU
export const getDishImage = (name: string, category: string): string => {
  const lowerName = name.toLowerCase();
  const lowerCat = category.toLowerCase();

  if (lowerName.includes('pizza')) return '/images/menu/dish-farmhouse-pizza.jpg';
  if (lowerName.includes('momo')) return '/images/menu/dish-veg-momos.jpg';
  if (lowerName.includes('tikka') || lowerName.includes('kebab') || lowerName.includes('chaap')) {
    return '/images/menu/dish-tandoori-tikka.jpg';
  }
  if (lowerName.includes('dal') || lowerName.includes('makhani')) {
    return '/images/menu/dish-dal-makhani.jpg';
  }
  if (lowerName.includes('kadhai') || lowerName.includes('kadai')) {
    return '/images/menu/dish-kadhai-paneer.jpg';
  }
  if (lowerName.includes('bhature') || lowerName.includes('roti') || lowerName.includes('naan')) {
    return '/images/menu/dish-chole-bhature.jpg';
  }
  if (lowerCat.includes('beverage') || lowerName.includes('shake') || lowerName.includes('lassi')) {
    return '/images/menu/dish-butter-paneer.jpg';
  }
  if (lowerCat.includes('dessert') || lowerName.includes('sundae') || lowerName.includes('ice cream')) {
    return '/images/dish-detail/real-thumb-4.jpg';
  }
  return '/images/menu/dish-paneer-butter-masala.jpg';
};

// Map items from SEARCHABLE_MENU to full Dish objects
export const getDishesByCategory = (categoryId: string): Dish[] => {
  if (categoryId === 'starters') {
    return SEARCHABLE_MENU.filter((i) => i.category === 'Starters').map((i) => ({
      id: i.id,
      name: i.name,
      description: i.description,
      price: i.price,
      rating: 4.6 + (i.price % 3) * 0.1,
      reviewsCount: 30 + (i.price % 40),
      isVeg: true,
      image: getDishImage(i.name, i.category),
    }));
  }
  if (categoryId === 'north-indian') {
    return NORTH_INDIAN_DISHES;
  }
  if (categoryId === 'chinese') {
    return SEARCHABLE_MENU.filter((i) => i.category === 'Chinese').map((i) => ({
      id: i.id,
      name: i.name,
      description: i.description,
      price: i.price,
      rating: 4.5 + (i.price % 4) * 0.1,
      reviewsCount: 25 + (i.price % 35),
      isVeg: true,
      image: getDishImage(i.name, i.category),
    }));
  }
  if (categoryId === 'pizza-pasta') {
    return SEARCHABLE_MENU.filter((i) => i.category === 'Pizza & Pasta').map((i) => ({
      id: i.id,
      name: i.name,
      description: i.description,
      price: i.price,
      rating: 4.7,
      reviewsCount: 54,
      isVeg: true,
      image: getDishImage(i.name, i.category),
    }));
  }
  if (categoryId === 'breads-thalis') {
    return SEARCHABLE_MENU.filter((i) => i.category === 'Breads & Thalis').map((i) => ({
      id: i.id,
      name: i.name,
      description: i.description,
      price: i.price,
      rating: 4.6,
      reviewsCount: 42,
      isVeg: true,
      image: getDishImage(i.name, i.category),
    }));
  }
  if (categoryId === 'desserts') {
    return SEARCHABLE_MENU.filter((i) => i.category === 'Desserts').map((i) => ({
      id: i.id,
      name: i.name,
      description: i.description,
      price: i.price,
      rating: 4.8,
      reviewsCount: 88,
      isVeg: true,
      image: getDishImage(i.name, i.category),
    }));
  }
  if (categoryId === 'beverages') {
    return SEARCHABLE_MENU.filter((i) => i.category === 'Beverages').map((i) => ({
      id: i.id,
      name: i.name,
      description: i.description,
      price: i.price,
      rating: 4.7,
      reviewsCount: 65,
      isVeg: true,
      image: getDishImage(i.name, i.category),
    }));
  }
  return [];
};
