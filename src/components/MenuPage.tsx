import React, { useState, useMemo, useEffect } from 'react';
import type { Dish } from '../data/restaurantData';
import { LeafBranch } from './Icons';
import { api } from '../services/api';
import {
  MENU_CATEGORIES,
  SIGNATURE_TRENDING_DISHES,
  NORTH_INDIAN_DISHES,
  getDishesByCategory,
} from '../data/menuPageData';
import { SEARCHABLE_MENU } from '../data/searchableMenu';
import { getDishImage } from '../data/menuPageData';

interface MenuPageProps {
  onDishClick: (dish: Dish) => void;
  onAddToCart: (dish: Dish) => void;
  onSeeAllDishes?: () => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  onDishClick,
  onAddToCart,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');

  // Reset subcategory when main category changes
  useEffect(() => {
    setSelectedSubCategory('all');
  }, [activeCategory]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dishStockMap, setDishStockMap] = useState<Record<string, boolean>>({});
  const [trendingDishes, setTrendingDishes] = useState<Dish[]>(SIGNATURE_TRENDING_DISHES);

  useEffect(() => {
    let isMounted = true;
    const fetchStock = async () => {
      try {
        const dishes = await api.getDishes();
        if (!isMounted || !dishes) return;
        const map: Record<string, boolean> = {};
        dishes.forEach((d) => {
          if (d.id) map[d.id] = d.inStock;
          if (d.name) map[d.name.toLowerCase().trim()] = d.inStock;
        });
        setDishStockMap(map);

        const trendingOnly = dishes.filter((d) => d.isTrending);
        if (trendingOnly.length > 0) {
          setTrendingDishes(
            trendingOnly.map((d) => ({
              id: d.id,
              name: d.name,
              category: d.category,
              price: d.price,
              image: d.image || '/images/dish-detail/rec-dal-makhani.jpg',
              description: d.description || 'Special signature pure vegetarian preparation.',
              rating: d.rating || 4.8,
              reviewsCount: d.reviews_count || 45,
              isVeg: true,
            }))
          );
        }
      } catch {
        // graceful fallback to inStock: true
      }
    };
    fetchStock();
    const interval = setInterval(fetchStock, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const toggleFavorite = (dishId: string) => {
    setFavorites((prev) => ({
      ...prev,
      [dishId]: !prev[dishId],
    }));
  };

  const showToast = (dishName: string) => {
    setToastMessage(`Added "${dishName}" to your order!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  // Search filtered dishes
  const searchedDishes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;
    return SEARCHABLE_MENU.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.subcategory.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    ).map((i) => ({
      id: i.id,
      name: i.name,
      description: i.description,
      price: i.price,
      rating: 4.6 + (i.price % 3) * 0.1,
      reviewsCount: 30 + (i.price % 40),
      isVeg: true,
      image: getDishImage(i.name, i.category),
    }));
  }, [searchQuery]);

  // Subcategories available for active category
  const availableSubCategories = useMemo(() => {
    if (activeCategory === 'all') return [];
    const dishes = getDishesByCategory(activeCategory);
    const subMap = new Map<string, number>();
    dishes.forEach((d) => {
      const raw = SEARCHABLE_MENU.find((m) => m.id === d.id);
      if (raw && raw.subcategory) {
        subMap.set(raw.subcategory, (subMap.get(raw.subcategory) || 0) + 1);
      }
    });
    return Array.from(subMap.entries()).map(([sub, count]) => ({ sub, count }));
  }, [activeCategory]);

  // Category specific dishes (filtered by subcategory if selected)
  const categoryDishes = useMemo(() => {
    if (activeCategory === 'all') return null;
    let list = getDishesByCategory(activeCategory);
    if (selectedSubCategory !== 'all') {
      list = list.filter((d) => {
        const raw = SEARCHABLE_MENU.find((m) => m.id === d.id);
        return raw && raw.subcategory === selectedSubCategory;
      });
    }
    return list;
  }, [activeCategory, selectedSubCategory]);

  // Chinese highlights for "All Items" view
  const chineseHighlights: Dish[] = useMemo(() => {
    return SEARCHABLE_MENU.filter((i) => i.category === 'Chinese')
      .slice(0, 4)
      .map((i) => ({
        id: i.id,
        name: i.name,
        category: i.category,
        price: i.price,
        image: i.image,
        description: i.description,
        rating: i.rating || 4.7,
        reviewsCount: i.reviewsCount || 45,
        isVeg: true,
      }));
  }, []);

  // Render a dish card matching the visual reference mockup
  const renderDishCard = (dish: Dish) => {
    const isFav = !!favorites[dish.id];
    const isDishInStock = dishStockMap[dish.id] !== false && dishStockMap[dish.name.toLowerCase().trim()] !== false;

    return (
      <div
        key={dish.id}
        onClick={() => {
          if (!isDishInStock) {
            setToastMessage(`"${dish.name}" is currently sold out.`);
            setTimeout(() => setToastMessage(null), 2000);
            return;
          }
          onDishClick(dish);
        }}
        className={`bg-[#FFFDF8] border border-[#E8DDCA] rounded-2xl p-2.5 sm:p-3.5 flex flex-col justify-between hover:shadow-md transition-all duration-300 group ${
          isDishInStock ? 'cursor-pointer' : 'opacity-75 cursor-not-allowed'
        }`}
      >
        <div>
          {/* Card Image Container */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] rounded-xl overflow-hidden bg-[#FAF6EE] mb-2 sm:mb-2.5">
            <img
              src={dish.image}
              alt={dish.name}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isDishInStock ? 'group-hover:scale-104' : 'grayscale opacity-75'
              }`}
              loading="lazy"
            />
            {/* Pure Vegetarian Badge (Top Right) */}
            <div
              className="absolute top-2 right-2 bg-white/95 backdrop-blur-xs p-1 rounded-sm shadow-xs border border-green-700/20"
              title="100% Pure Vegetarian"
            >
              <div className="w-3.5 h-3.5 border border-green-700 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-green-700" />
              </div>
            </div>

            {/* Sold Out Badge (Top Left) if unavailable */}
            {!isDishInStock && (
              <div className="absolute top-2 left-2 bg-[#C83A25] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                Sold Out
              </div>
            )}
          </div>

          {/* Dish Title */}
          <h3 className="font-serif font-bold text-[#17261D] text-sm sm:text-base leading-snug group-hover:text-[#163E26] transition-colors truncate">
            {dish.name}
          </h3>

          {/* Description (Inter font, 2-line clamp) */}
          <p className="text-xs sm:text-[13px] text-[#77766D] font-sans line-clamp-2 leading-relaxed mt-1 min-h-[2rem] sm:min-h-[2.3rem]">
            {dish.description}
          </p>
        </div>

        <div>
          {/* Rating and Favorite Heart */}
          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#E8DDCA]/50">
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[#C9A45C]">★</span>
              <span className="font-bold text-[#17261D]">{dish.rating.toFixed(1)}</span>
              <span className="text-[#77766D]">({dish.reviewsCount})</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(dish.id);
              }}
              className="text-[#C83A25] hover:scale-115 active:scale-90 transition-transform p-0.5"
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFav ? (
                <svg className="w-4 h-4 fill-[#C83A25]" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 stroke-[#C83A25] fill-none" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              )}
            </button>
          </div>

          {/* Price and Add Button */}
          <div className="flex items-center justify-between mt-2.5">
            <span className="font-sans font-bold text-base sm:text-lg text-[#C83A25]">
              ₹{dish.price}
            </span>
            {isDishInStock ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(dish);
                  showToast(dish.name);
                }}
                className="bg-[#163E26] hover:bg-[#1E5635] active:scale-95 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 rounded-lg sm:rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <span>+</span>
                <span>Add</span>
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="bg-[#E0D8CB] text-[#77766D] text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 rounded-lg sm:rounded-xl cursor-not-allowed shadow-none"
              >
                Sold Out
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#4B5149] pb-24 md:pb-16">
      
      {/* 1. MENU HERO BANNER (Matches Reference Mockup) */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-xs border border-[#E8DDCA]/60 bg-[#FAF6EE]">
          <picture>
            <source media="(max-width: 640px)" srcSet="/images/menu/menu-hero-mobile.jpg" />
            <img
              src="/images/menu/menu-hero-desktop.jpg"
              alt="Greenwood Café & Restaurant — Our Menu, Discover Our Flavours. Thoughtfully prepared. Beautifully served."
              className="w-full h-auto object-cover block"
            />
          </picture>
        </div>
      </section>

      {/* 2. SEARCH FIELD (Matches Reference Mockup) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-5">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none text-[#77766D]">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes, cuisines..."
            className="w-full pl-11 sm:pl-13 pr-10 py-2.5 sm:py-3 bg-[#FFFDF8] border border-[#E8DDCA] rounded-full text-xs sm:text-sm text-[#17261D] placeholder-[#77766D] shadow-xs focus:outline-none focus:border-[#163E26] focus:ring-1 focus:ring-[#163E26] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#77766D] hover:text-[#17261D] text-sm"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </section>

      {/* 3. HORIZONTAL CATEGORY NAVIGATION (Matches Reference Mockup) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3 sm:mt-4">
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto scrollbar-none py-1">
          {MENU_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id && !searchQuery;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSearchQuery('');
                }}
                className={`shrink-0 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#163E26] text-white shadow-sm font-semibold'
                    : 'bg-[#FFFDF8] border border-[#E8DDCA] text-[#4B5149] hover:bg-[#FAF6EE] hover:text-[#17261D]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. DISH CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 space-y-10 sm:space-y-12">
        
        {/* CASE A: LIVE SEARCH ACTIVE */}
        {searchedDishes !== null ? (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17261D]">
                Search Results for &ldquo;{searchQuery}&rdquo;
              </h2>
              <span className="text-xs text-[#77766D]">
                {searchedDishes.length} vegetarian dishes found
              </span>
            </div>

            {searchedDishes.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {searchedDishes.map(renderDishCard)}
              </div>
            ) : (
              <div className="bg-[#FFFDF8] border border-[#E8DDCA] rounded-2xl p-8 text-center text-[#77766D]">
                <p className="text-sm">No dishes found matching &ldquo;{searchQuery}&rdquo;.</p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-xs font-semibold text-[#163E26] underline"
                >
                  Clear search and show all items
                </button>
              </div>
            )}
          </section>
        ) : activeCategory !== 'all' && categoryDishes ? (
          
          /* CASE B: SPECIFIC CATEGORY SELECTED */
          <section>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center gap-2">
                <span className="w-8 sm:w-12 h-px bg-[#C9A45C]/60" />
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17261D] tracking-tight">
                  {MENU_CATEGORIES.find((c) => c.id === activeCategory)?.name}
                </h2>
                <span className="w-8 sm:w-12 h-px bg-[#C9A45C]/60" />
              </div>
              <p className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#8F5D2C] mt-1 font-sans">
                100% PURE VEGETARIAN FINE DINE
              </p>
            </div>

            {/* Subcategories Filter Pills */}
            {availableSubCategories.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-4 mb-2 justify-start sm:justify-center">
                <button
                  type="button"
                  onClick={() => setSelectedSubCategory('all')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    selectedSubCategory === 'all'
                      ? 'bg-[#163E26] text-white shadow-xs'
                      : 'bg-[#FAF6EE] text-[#4B5149] border border-[#E8DDCA] hover:border-[#163E26]'
                  }`}
                >
                  All ({getDishesByCategory(activeCategory).length})
                </button>
                {availableSubCategories.map(({ sub, count }) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSelectedSubCategory(sub)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                      selectedSubCategory === sub
                        ? 'bg-[#163E26] text-white shadow-xs'
                        : 'bg-[#FAF6EE] text-[#4B5149] border border-[#E8DDCA] hover:border-[#163E26]'
                    }`}
                  >
                    {sub} ({count})
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {categoryDishes.map(renderDishCard)}
            </div>
          </section>
        ) : (

          /* CASE C: DEFAULT "ALL ITEMS" VIEW (EXACT REFERENCE MOCKUP) */
          <>
            {/* SECTION 1: SIGNATURE & TRENDING */}
            <section id="signature-trending">
              {/* Centered Heading with Botanical Flourishes */}
              <div className="text-center mb-5 sm:mb-6">
                <div className="inline-flex items-center justify-center gap-1.5 sm:gap-3">
                  <LeafBranch flip={false} className="w-5 h-2.5 sm:w-7 sm:h-3.5 text-[#163E26]" />
                  <h2 className="font-serif text-xl sm:text-2xl md:text-[28px] font-bold text-[#17261D] tracking-tight">
                    Signature &amp; Trending
                  </h2>
                  <LeafBranch flip={true} className="w-5 h-2.5 sm:w-7 sm:h-3.5 text-[#163E26]" />
                </div>
                <p className="text-[10px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-[#8F5D2C] mt-1 font-sans">
                  OUR CHEF&apos;S SPECIALS
                </p>
              </div>

              {/* 4 Cards Grid (Desktop 4 cols, Mobile 2 cols) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                {trendingDishes.map(renderDishCard)}
              </div>
            </section>

            {/* SECTION 2: NORTH INDIAN */}
            <section id="north-indian">
              {/* Section Header with "See All >" Link */}
              <div className="relative flex items-center justify-between mb-5 sm:mb-6">
                <div className="w-full text-center">
                  <div className="inline-flex items-center justify-center gap-1.5 sm:gap-3">
                    <LeafBranch flip={false} className="w-5 h-2.5 sm:w-7 sm:h-3.5 text-[#163E26]" />
                    <h2 className="font-serif text-xl sm:text-2xl md:text-[28px] font-bold text-[#17261D] tracking-tight">
                      North Indian
                    </h2>
                    <LeafBranch flip={true} className="w-5 h-2.5 sm:w-7 sm:h-3.5 text-[#163E26]" />
                  </div>
                  <p className="text-[10px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-[#8F5D2C] mt-1 font-sans">
                    RICH TRADITIONS. TIMELESS TASTES.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('north-indian');
                    window.scrollTo({ top: 320, behavior: 'smooth' });
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-semibold text-[#163E26] hover:text-[#8F5D2C] transition-colors flex items-center gap-0.5"
                >
                  See All &gt;
                </button>
              </div>

              {/* 4 Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                {NORTH_INDIAN_DISHES.map(renderDishCard)}
              </div>
            </section>

            {/* SECTION 3: POPULAR CHINESE SPECIALS */}
            <section id="chinese-specials">
              <div className="relative flex items-center justify-between mb-5 sm:mb-6">
                <div className="w-full text-center">
                  <div className="inline-flex items-center justify-center gap-2">
                    <span className="w-8 sm:w-12 h-px bg-[#C9A45C]/60" />
                    <h2 className="font-serif text-xl sm:text-2xl md:text-[28px] font-bold text-[#17261D] tracking-tight">
                      Chinese Specialties
                    </h2>
                    <span className="w-8 sm:w-12 h-px bg-[#C9A45C]/60" />
                  </div>
                  <p className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#8F5D2C] mt-1 font-sans">
                    WOK FIRED. SIZZLING HOT.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('chinese');
                    window.scrollTo({ top: 320, behavior: 'smooth' });
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-semibold text-[#163E26] hover:text-[#8F5D2C] transition-colors flex items-center gap-0.5"
                >
                  See All &gt;
                </button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                {chineseHighlights.map(renderDishCard)}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Added to cart toast notification */}
      {toastMessage && (
        <div className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#163E26] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="text-[#C9A45C]">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
