import React, { useState, useRef, useEffect } from 'react';
import { LeafBranch, VegBadge } from './Icons';
import type { Dish } from '../data/restaurantData';
import { api, computeEffectiveStoreStatus, isLegacyMockDishId } from '../services/api';
import { firestore } from '../services/firebase';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { getCustomerAuth } from '../services/auth';
import { getFavorites, toggleFavorite as toggleFavoriteService } from '../services/favorites';

interface SignatureDishesProps {
  onAddToCart: (dish: Dish) => void;
  onSeeAllClick: () => void;
  onDishClick?: (dish: Dish) => void;
}

// Helper to format dishes for Signature & Trending showcase:
// STRICTLY show ONLY the dishes that the admin has added to Signature & Trending!
const formatSignatureDishes = (allDishes: any[]): Dish[] => {
  if (!allDishes || allDishes.length === 0) return [];
  const cleanDishes = allDishes.filter((d) => !isLegacyMockDishId(d.id));
  const inStock = cleanDishes.filter((d) => Boolean(d.inStock !== false));
  // Sirf wahi dishes show hongi jisme admin ne Signature & Trending on kiya hai
  const trending = inStock.filter((d) => Boolean(d.isTrending));

  // Strictly show ONLY dishes with isTrending === true (zero fallback to general inStock items)
  const listToDisplay = trending;

  // If admin has selected specific dishes, strictly show ONLY those selected dishes (no cap of 4!)
  // Fallback to top in-stock dishes only if admin hasn't marked any dish yet


  return listToDisplay.map((d) => ({
    id: d.id,
    name: d.name || 'Greenwood Special',
    category: d.category || 'Chef Special',
    price: Number(d.price) || 249,
    image: d.image || '/images/dish-detail/rec-dal-makhani.jpg',
    description: d.description || '100% Pure Vegetarian delicacy.',
    rating: d.rating || 4.8,
    reviewsCount: d.reviews_count || 42,
    isVeg: true,
    isTrending: Boolean(d.isTrending),
  }));
};

export const SignatureDishes: React.FC<SignatureDishesProps> = ({
  onAddToCart,
  onSeeAllClick,
  onDishClick,
}) => {
  const [favorites, setFavorites] = useState<Record<string, boolean>>(() => {
    const list = getFavorites();
    const map: Record<string, boolean> = {};
    list.forEach((id) => { map[id] = true; });
    return map;
  });

  useEffect(() => {
    const handleFavs = () => {
      const list = getFavorites();
      const map: Record<string, boolean> = {};
      list.forEach((id) => { map[id] = true; });
      setFavorites(map);
    };
    window.addEventListener('gw_favorites_changed', handleFavs);
    window.addEventListener('storage', handleFavs);
    return () => {
      window.removeEventListener('gw_favorites_changed', handleFavs);
      window.removeEventListener('storage', handleFavs);
    };
  }, []);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [activeSlide, setActiveSlide] = useState(0);
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  // Live Store Operational Status: determines gray effect when store is closed (NO icons, NO text)
  useEffect(() => {
    let isMounted = true;
    api.getSettings().then((s) => {
      if (isMounted && s) {
        setIsStoreOpen(computeEffectiveStoreStatus(s));
      }
    }).catch(() => {});

    const handleSettingsUpdate = (e: any) => {
      const s = e.detail;
      if (s && isMounted) {
        setIsStoreOpen(computeEffectiveStoreStatus(s));
      }
    };
    window.addEventListener('gw_settings_updated', handleSettingsUpdate);
    window.addEventListener('storage', handleSettingsUpdate);

    let unsubSettings: (() => void) | null = null;
    if (firestore) {
      try {
        unsubSettings = onSnapshot(doc(firestore, 'settings', 'config'), (snap) => {
          if (snap.exists() && isMounted) {
            setIsStoreOpen(computeEffectiveStoreStatus(snap.data()));
          }
        });
      } catch {}
    }

    return () => {
      isMounted = false;
      if (unsubSettings) unsubSettings();
      window.removeEventListener('gw_settings_updated', handleSettingsUpdate);
      window.removeEventListener('storage', handleSettingsUpdate);
    };
  }, []);

  // Synchronous cache-first initialization to prevent ANY 1-second flash or layout shift!
  const [dishes, setDishes] = useState<Dish[]>(() => formatSignatureDishes(api.getDishesSync()));

  const scrollRef = useRef<HTMLDivElement>(null);

  // Real-time dynamic sync with Firestore & backend database
  useEffect(() => {
    let isMounted = true;

    const updateFromDishesList = (incomingDishes: any[]) => {
      if (!isMounted || !incomingDishes || incomingDishes.length === 0) return;
      const currentAll = api.getDishesSync();
      const incomingMap = new Map(incomingDishes.map((d) => [d.id, d]));
      const fullList = currentAll.map((d) => {
        const update = incomingMap.get(d.id);
        return update ? { ...d, ...update } : d;
      });
      incomingDishes.forEach((idish) => {
        if (!currentAll.some((c) => c.id === idish.id)) {
          fullList.push(idish);
        }
      });

      const formatted = formatSignatureDishes(fullList);
      setDishes((prev) => {
        const isSame =
          prev.length === formatted.length &&
          prev.every(
            (d, i) =>
              d.id === formatted[i]?.id &&
              d.price === formatted[i]?.price &&
              d.isTrending === formatted[i]?.isTrending &&
              d.image === formatted[i]?.image
          );
        return isSame ? prev : formatted;
      });
    };

    // 1. Live Firestore onSnapshot subscription
    let unsubscribeFirestore: (() => void) | null = null;
    if (firestore) {
      try {
        const dishesRef = collection(firestore, 'dishes');
        unsubscribeFirestore = onSnapshot(dishesRef, (snapshot) => {
          if (!snapshot.empty) {
            const liveDishes: any[] = [];
            snapshot.forEach((doc) => {
              liveDishes.push({ id: doc.id, ...doc.data() });
            });
            updateFromDishesList(liveDishes);
          }
        }, (err) => {
          console.warn('[SignatureDishes] Firestore live sync notice:', err);
        });
      } catch (err) {
        console.warn('[SignatureDishes] Firestore listener init notice:', err);
      }
    }

    // 2. Fetch initial dishes via API service & local cache
    const loadDishes = () => {
      const syncDishes = api.getDishesSync();
      if (syncDishes && syncDishes.length > 0) {
        updateFromDishesList(syncDishes);
      }
      api.getDishes()
        .then((allDishes) => updateFromDishesList(allDishes))
        .catch((err) => console.warn('Fallback to local signature dishes:', err));
    };
    loadDishes();

    // 3. Instant local & cross-tab events listener via CustomEvent, storage & BroadcastChannel
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const handleDishesChanged = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (isMounted) loadDishes();
      }, 300);
    };
    window.addEventListener('gw_dishes_changed', handleDishesChanged);
    window.addEventListener('storage', handleDishesChanged);

    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('gw_sync_channel');
        bc.onmessage = (msg) => {
          if (msg.data?.event === 'gw_dishes_changed') {
            handleDishesChanged();
          }
        };
      } catch {}
    }

    return () => {
      isMounted = false;
      if (unsubscribeFirestore) unsubscribeFirestore();
      if (bc) bc.close();
      window.removeEventListener('gw_dishes_changed', handleDishesChanged);
            window.removeEventListener('storage', handleDishesChanged);
    };
  }, []);

  // Gentle 1-by-1 step slider: Slides 1 dish card at a time with 3.2s rest between steps
  const isInteractingRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInteractionStart = () => {
    isInteractingRef.current = true;
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  };

  const handleInteractionEnd = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, 2500);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (isInteractingRef.current || !scrollRef.current || dishes.length <= 1) return;
      const el = scrollRef.current;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 10) return;

      const cardStep = el.clientWidth < 640 ? 230 : 280; // width of 1 card + gap
      const nextScroll = el.scrollLeft + cardStep >= maxScroll - 15 ? 0 : el.scrollLeft + cardStep;
      el.scrollTo({ left: nextScroll, behavior: 'smooth' });
    }, 3200);

    return () => {
      clearInterval(timer);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [dishes.length]);

  // Track scroll position to update active dot index (throttled with RAF)
  const scrollRafId = useRef<number | null>(null);
  const handleScroll = () => {
    if (scrollRafId.current !== null) return;
    scrollRafId.current = requestAnimationFrame(() => {
      scrollRafId.current = null;
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const totalItems = dishes.length;
        if (totalItems <= 1) return;
        const maxScroll = scrollWidth - clientWidth;
        if (maxScroll <= 0) return;
        const itemWidth = maxScroll / (totalItems - 1);
        const index = Math.min(totalItems - 1, Math.max(0, Math.round(scrollLeft / itemWidth)));
        setActiveSlide((prev) => (prev === index ? prev : index));
      }
    });
  };

  // Jump to specific slide when dot clicked
  const handleDotClick = (index: number) => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current;
      const totalItems = dishes.length;
      if (totalItems <= 1) return;
      const maxScroll = scrollWidth - clientWidth;
      const targetLeft = (maxScroll / (totalItems - 1)) * index;
      scrollRef.current.scrollTo({ left: targetLeft, behavior: 'smooth' });
      setActiveSlide(index);
    }
  };

  // Manual arrow navigation for desktop & tablet
  const handleManualNav = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const step = 290;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -step : step,
        behavior: 'smooth',
      });
    }
  };

  const toggleFavorite = (id: string) => {
    const auth = getCustomerAuth();
    toggleFavoriteService(id, auth?.phone);
  };

  const handleAdd = (dish: Dish) => {
    if (!isStoreOpen) return;
    onAddToCart(dish);
    setAddedItems((prev) => ({ ...prev, [dish.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [dish.id]: false }));
    }, 1500);
  };

  if (dishes.length === 0) {
    return (
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-3 select-none" aria-label="Signature &amp; Trending Dishes">
        <div className="text-center py-7 px-4 bg-[#FAF6EE] rounded-2xl border border-[#E8DDCA]/60">
          <LeafBranch flip={false} className="w-6 h-3 text-[#2E5A3A] mx-auto mb-2 opacity-80" />
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#163E26]">Signature &amp; Trending</h3>
          <p className="text-xs text-[#77766D] mt-1 font-sans">Chef specials updating soon. Explore our full 100% Pure Vegetarian menu!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 md:pt-5 pb-2 sm:pb-3 md:pb-3.5" aria-label="Signature &amp; Trending Dishes">
      
      {/* Section Header: Perfectly Centered with Golden-Emerald Botanical Accent */}
      <div className="text-center mb-3 sm:mb-4">
        <div className="inline-flex items-center justify-center gap-1.5 sm:gap-3">
          <LeafBranch flip={false} className="w-5 h-2.5 sm:w-8 sm:h-4 text-[#2E5A3A]" />
          <h2 className="font-serif text-lg sm:text-3xl md:text-4xl font-bold text-[#163E26] tracking-tight">
            Signature &amp; Trending
          </h2>
          <LeafBranch flip={true} className="w-5 h-2.5 sm:w-8 sm:h-4 text-[#2E5A3A]" />
        </div>
        <div className="flex items-center justify-center gap-2 mt-0.5 sm:mt-1">
          <p className="text-[9px] sm:text-xs font-semibold tracking-[0.24em] text-[#C9A45C] uppercase">
            OUR CHEF'S SPECIALS
          </p>
        </div>
        <div className="mx-auto mt-1.5 w-16 h-0.5 bg-gradient-to-r from-transparent via-[#C9A45C]/70 to-transparent rounded-full" />
      </div>

      {/* Slider Container with Left/Right Arrows for Desktop and Continuous Track */}
      <div className="relative group/slider max-w-7xl mx-auto px-1">
        {/* Desktop Previous Button */}
        {dishes.length > 2 && (
          <button
            type="button"
            onClick={() => handleManualNav('left')}
            className="hidden sm:flex absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#FFFDF8] border border-[#C9A45C]/60 text-[#163E26] hover:bg-[#163E26] hover:text-[#FAF6EE] shadow-md items-center justify-center transition-all cursor-pointer opacity-80 hover:opacity-100 hover:scale-105 active:scale-95"
            aria-label="Previous dishes"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Desktop Next Button */}
        {dishes.length > 2 && (
          <button
            type="button"
            onClick={() => handleManualNav('right')}
            className="hidden sm:flex absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#FFFDF8] border border-[#C9A45C]/60 text-[#163E26] hover:bg-[#163E26] hover:text-[#FAF6EE] shadow-md items-center justify-center transition-all cursor-pointer opacity-80 hover:opacity-100 hover:scale-105 active:scale-95"
            aria-label="Next dishes"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Continuous Horizontal Scroll Track with zero-lag smooth auto-slide */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseEnter={handleInteractionStart}
          onMouseLeave={handleInteractionEnd}
          onTouchStart={handleInteractionStart}
          onTouchEnd={handleInteractionEnd}
          className={`flex overflow-x-auto gap-3.5 sm:gap-4 md:gap-5 pb-2.5 pt-1 no-scrollbar items-stretch scroll-smooth ${
            dishes.length <= 2 ? 'justify-center' : ''
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {dishes.map((dish, idx) => {
            const isFav = !!favorites[dish.id];
            const isRecentlyAdded = !!addedItems[dish.id];

            return (
              <div
                key={dish.id}
                className={`w-[220px] sm:w-[250px] md:w-[280px] shrink-0 bg-[#FFFDF8] rounded-xl sm:rounded-2xl border border-[#E8DDCA] p-2.5 sm:p-3.5 shadow-2xs flex flex-col justify-between group ${
                  !isStoreOpen ? 'filter grayscale-[35%] opacity-85' : ''
                }`}
              >
                {/* Dish Image Box: Clean zero-lag rendering */}
                <div
                  onClick={() => onDishClick?.(dish)}
                  className="relative w-full h-36 sm:h-44 md:h-48 rounded-lg sm:rounded-xl overflow-hidden bg-[#FAF6EE] cursor-pointer"
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover object-center"
                    loading={idx < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/dish-detail/rec-dal-makhani.jpg';
                    }}
                  />

                  {/* 100% Pure Veg Indicator Badge on Top Right */}
                  <div className="absolute top-2 right-2 z-10">
                    <VegBadge />
                  </div>
                </div>

                {/* Dish Content: Focused on dish name & price */}
                <div className="pt-2 sm:pt-2.5 flex flex-col flex-grow justify-between">
                  <div>
                    <h3
                      onClick={() => onDishClick?.(dish)}
                      className="font-serif text-sm sm:text-base md:text-lg font-bold text-[#17261D] group-hover:text-[#163E26] line-clamp-1 cursor-pointer"
                    >
                      {dish.name}
                    </h3>
                  </div>

                  {/* Rating + Price + Like Heart + Add Button */}
                  <div className="flex items-end justify-between mt-2 pt-0.5">
                    <div className="flex flex-col">
                      {/* Rating */}
                      <div className="flex items-center gap-1 text-[11px] sm:text-xs text-[#17261D] font-medium leading-none mb-1">
                        <span className="text-[#C9A45C]">★</span>
                        <span className="font-bold">{dish.rating}</span>
                        <span className="text-[#77766D] text-[10px]">({dish.reviewsCount})</span>
                      </div>

                      {/* Price (MRP) & Like Heart Button side by side */}
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="font-sans text-sm sm:text-lg font-bold text-[#C83A25] leading-none">
                          ₹{dish.price}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleFavorite(dish.id)}
                          className="p-0.5 text-[#C83A25] focus:outline-none cursor-pointer"
                          aria-label={`Favorite ${dish.name}`}
                          title={isFav ? "Favorited" : "Add to favorites"}
                        >
                          <svg
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
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
                      disabled={!isStoreOpen}
                      onClick={() => handleAdd(dish)}
                      className={`px-3 sm:px-4 md:px-5 py-1.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1 shadow-2xs ${
                        !isStoreOpen
                          ? 'bg-[#E5E7EB] text-[#6B7280] border border-[#D1D5DB] cursor-not-allowed opacity-90'
                          : isRecentlyAdded
                          ? 'bg-[#2E5A3A] text-white cursor-pointer'
                          : 'bg-[#163E26] hover:bg-[#1E5233] text-white cursor-pointer'
                      }`}
                    >
                      {!isStoreOpen ? (
                        <span>+ Add</span>
                      ) : isRecentlyAdded ? (
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
      </div>

      {/* Slider Indicator Dots: Interactive & dynamically tracking swipe position */}
      {dishes.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-2.5">
          {dishes.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleDotClick(i)}
              aria-label={`Go to dish slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeSlide === i ? 'w-5 bg-[#163E26]' : 'w-1.5 bg-[#D5CBBA] hover:bg-[#A89885]'
              }`}
            />
          ))}
        </div>
      )}

      {/* "Explore Menu" Button Option below sliding images */}
      <div className="flex justify-center mt-3 sm:mt-4 md:mt-5">
        <button
          type="button"
          onClick={onSeeAllClick}
          className="inline-flex items-center gap-2 px-6 py-2 sm:px-7 sm:py-2.5 rounded-full bg-[#163E26] hover:bg-[#1E5233] text-[#FAF6EE] text-xs sm:text-sm font-semibold tracking-wide border border-[#C9A45C]/50 shadow-sm cursor-pointer group"
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
