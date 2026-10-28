import React, { useState, useRef, useEffect } from 'react';
import { LeafBranch, VegBadge } from './Icons';
import { RESTAURANT_DATA } from '../data/restaurantData';
import type { Dish } from '../data/restaurantData';
import { api } from '../services/api';

interface SignatureDishesProps {
  onAddToCart: (dish: Dish) => void;
  onSeeAllClick: () => void;
  onDishClick?: (dish: Dish) => void;
}

export const SignatureDishes: React.FC<SignatureDishesProps> = ({
  onAddToCart,
  onSeeAllClick,
  onDishClick,
}) => {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [isInteracting, setIsInteracting] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [dishes, setDishes] = useState<Dish[]>(RESTAURANT_DATA.signatureDishes);

  const scrollRef = useRef<HTMLDivElement>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Dynamic sync with backend database: load dishes marked as Trending 🔥
  useEffect(() => {
    let isMounted = true;
    api
      .getDishes()
      .then((allDishes) => {
        if (!isMounted || !allDishes || allDishes.length === 0) return;
        const trendingOnly = allDishes.filter((d) => d.isTrending && d.inStock);
        if (trendingOnly.length > 0) {
          setDishes(
            trendingOnly.map((d) => ({
              id: d.id,
              name: d.name,
              category: d.category,
              price: d.price,
              image: d.image || '/images/dish-detail/rec-dal-makhani.jpg',
              description: d.description || 'Pure Vegetarian signature delicacy.',
              rating: d.rating || 4.8,
              reviewsCount: d.reviews_count || 32,
              isVeg: true,
            }))
          );
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Gentle auto-slide on mobile / scrollable viewports
  useEffect(() => {
    if (isInteracting) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollWidth > clientWidth + 10) {
          const step = 185;
          const maxScroll = scrollWidth - clientWidth;
          const nextScroll = scrollLeft + step >= maxScroll - 10 ? 0 : scrollLeft + step;
          scrollRef.current.scrollTo({ left: nextScroll, behavior: 'smooth' });
          setActiveSlide((prev) => (prev + 1) % dishes.length);
        }
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [isInteracting, dishes.length]);

  const handleInteractionStart = () => {
    setIsInteracting(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
  };

  const handleInteractionEnd = () => {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 2500);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = (dish: Dish) => {
    onAddToCart(dish);
    setAddedItems((prev) => ({ ...prev, [dish.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [dish.id]: false }));
    }, 1500);
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 md:pt-5 pb-2 sm:pb-3 md:pb-3.5" aria-label="Signature & Trending Dishes">
      
      {/* Section Header: Perfectly Centered with Golden-Emerald Botanical Accent */}
      <div className="text-center mb-3 sm:mb-4">
        <div className="inline-flex items-center justify-center gap-1.5 sm:gap-3">
          <LeafBranch flip={false} className="w-5 h-2.5 sm:w-8 sm:h-4 text-[#2E5A3A]" />
          <h2 className="font-serif text-lg sm:text-3xl md:text-4xl font-bold text-[#163E26] tracking-tight">
            Signature &amp; Trending
          </h2>
          <LeafBranch flip={true} className="w-5 h-2.5 sm:w-8 sm:h-4 text-[#2E5A3A]" />
        </div>
        <p className="text-[9px] sm:text-xs font-semibold tracking-[0.24em] text-[#C9A45C] uppercase mt-0.5 sm:mt-1">
          OUR CHEF'S SPECIALS
        </p>
        <div className="mx-auto mt-1.5 w-16 h-0.5 bg-gradient-to-r from-transparent via-[#C9A45C]/70 to-transparent rounded-full" />
      </div>

      {/* Cards Grid: Desktop 3 columns / Mobile 40% Scaled Cards with Ambient Breathing Light & Gentle Auto-Slide */}
      <div
        ref={scrollRef}
        onMouseEnter={handleInteractionStart}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
        className="flex overflow-x-auto md:grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-5 pb-2 md:pb-0 no-scrollbar snap-x snap-mandatory"
      >
        {dishes.map((dish) => {
          const isFav = !!favorites[dish.id];
          const isRecentlyAdded = !!addedItems[dish.id];

          return (
            <div
              key={dish.id}
              className="w-[175px] sm:w-[205px] md:w-auto shrink-0 snap-center bg-[#FFFDF8] rounded-xl sm:rounded-2xl border border-[#E8DDCA] p-2.5 sm:p-3 md:p-3.5 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Dish Image Box with Pure Veg Marker & Ambient Soft Light Glow */}
              <div
                onClick={() => onDishClick?.(dish)}
                className="relative w-full h-26 sm:h-30 md:h-44 rounded-lg sm:rounded-xl overflow-hidden bg-[#FAF6EE] dish-ambient-light cursor-pointer"
              >
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="eager"
                />

                {/* Gentle Ambient Gold Light Gradient Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-transparent to-[#C9A45C]/20 mix-blend-screen" />
                
                {/* 100% Pure Veg Indicator Badge on Top Right */}
                <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 scale-85 sm:scale-95 md:scale-100">
                  <VegBadge />
                </div>
              </div>

              {/* Dish Content — Zero inner divider borders, compact natural spacing */}
              <div className="pt-2 sm:pt-2.5 flex flex-col flex-grow justify-between">
                <div>
                  <h3
                    onClick={() => onDishClick?.(dish)}
                    className="font-serif text-xs sm:text-sm md:text-xl font-bold text-[#17261D] group-hover:text-[#163E26] transition-colors line-clamp-1 cursor-pointer"
                  >
                    {dish.name}
                  </h3>

                  <p className="text-[10px] sm:text-xs text-[#77766D] line-clamp-2 mt-0.5 leading-snug">
                    {dish.description}
                  </p>
                </div>

                {/* Rating + Price + Like Heart + Add Button (All compact without divider borders) */}
                <div className="flex items-end justify-between mt-2 pt-0.5">
                  <div className="flex flex-col">
                    {/* Rating */}
                    <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-[#17261D] font-medium leading-none mb-1">
                      <span className="text-[#C9A45C] text-xs">★</span>
                      <span className="font-bold">{dish.rating}</span>
                      <span className="text-[#77766D] text-[9px] sm:text-[10px]">({dish.reviewsCount})</span>
                    </div>

                    {/* Price (MRP) & Like Heart Button side by side */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="font-sans text-xs sm:text-base md:text-xl font-bold text-[#C83A25] leading-none">
                        ₹{dish.price}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(dish.id)}
                        className="p-0.5 text-[#C83A25] hover:scale-120 focus:outline-none transition-transform cursor-pointer"
                        aria-label={`Favorite ${dish.name}`}
                        title={isFav ? "Favorited" : "Add to favorites"}
                      >
                        <svg
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                            isFav ? 'fill-[#C83A25] text-[#C83A25]' : 'fill-none stroke-current'
                          }`}
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Right: + Add Button */}
                  <button
                    type="button"
                    onClick={() => handleAdd(dish)}
                    className={`px-2.5 sm:px-3.5 md:px-5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-0.5 sm:gap-1 shadow-2xs ${
                      isRecentlyAdded
                        ? 'bg-[#2E5A3A] text-white scale-95'
                        : 'bg-[#163E26] hover:bg-[#1E5233] text-white active:scale-95'
                    }`}
                  >
                    {isRecentlyAdded ? (
                      <>
                        <span>Added</span>
                        <span>✓</span>
                      </>
                    ) : (
                      <>
                        <span>+</span>
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Mobile Slider Indicator Dots */}
      <div className="md:hidden flex items-center justify-center gap-1.5 pt-2">
        {dishes.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeSlide === i ? 'w-4 bg-[#163E26]' : 'w-1.5 bg-[#D5CBBA]'
            }`}
          />
        ))}
      </div>

      {/* "Explore Menu" Button Option below sliding images */}
      <div className="flex justify-center mt-3 sm:mt-4 md:mt-5">
        <button
          type="button"
          onClick={onSeeAllClick}
          className="inline-flex items-center gap-2 px-6 py-2 sm:px-7 sm:py-2.5 rounded-full bg-[#163E26] hover:bg-[#1E5233] text-[#FAF6EE] text-xs sm:text-sm font-semibold tracking-wide border border-[#C9A45C]/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-103 cursor-pointer group"
          aria-label="Explore Full Greenwood Menu"
        >
          <span>Explore Menu</span>
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C9A45C] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

    </section>
  );
};
