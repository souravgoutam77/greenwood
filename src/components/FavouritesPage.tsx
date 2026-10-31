import React, { useState, useEffect, useMemo } from 'react';
import { getFavorites, toggleFavorite } from '../services/favorites';
import { SEARCHABLE_MENU } from '../data/searchableMenu';
import type { Dish } from '../data/restaurantData';
import { LeafBranch, VegBadge } from './Icons';

interface FavouritesPageProps {
  onAddToCart: (dish: Dish) => void;
  onNavigateToMenu: () => void;
  onDishClick?: (dish: Dish) => void;
}

export const FavouritesPage: React.FC<FavouritesPageProps> = ({
  onAddToCart,
  onNavigateToMenu,
  onDishClick,
}) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => getFavorites());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleFavChange = () => {
      setFavoriteIds(getFavorites());
    };
    window.addEventListener('gw_favorites_changed', handleFavChange);
    window.addEventListener('storage', handleFavChange);
    return () => {
      window.removeEventListener('gw_favorites_changed', handleFavChange);
      window.removeEventListener('storage', handleFavChange);
    };
  }, []);

  const favoriteDishes = useMemo(() => {
    return favoriteIds
      .map((id) => SEARCHABLE_MENU.find((item) => item.id === id))
      .filter((item): item is NonNullable<typeof item> => item !== undefined);
  }, [favoriteIds]);

  const handleRemove = (dishId: string, dishName: string) => {
    toggleFavorite(dishId);
    setToastMessage(`Removed ${dishName} from favourites`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAdd = (dish: any) => {
    onAddToCart({
      id: dish.id,
      name: dish.name,
      category: dish.category,
      price: dish.price,
      image: dish.image,
      description: dish.description,
      rating: dish.rating || 4.8,
      reviewsCount: dish.reviewsCount || 45,
      isVeg: true,
    });
    setToastMessage(`Added ${dish.name} to cart!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] pt-24 pb-28 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#163E26] text-white px-4 py-2.5 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 animate-fade-in border border-[#C9A45C]">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center gap-2 text-[#163E26] mb-1.5">
          <LeafBranch flip={false} className="w-6 h-3 text-[#163E26]" />
          <span className="font-serif text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold text-[#8F5D2C]">
            Your Saved Pure Veg Selection
          </span>
          <LeafBranch flip={true} className="w-6 h-3 text-[#163E26]" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17261D] tracking-tight">
          My Favourites ({favoriteDishes.length})
        </h1>
        <p className="text-xs sm:text-sm text-[#77766D] mt-1.5 max-w-md mx-auto">
          Quickly reorder your beloved Greenwood dishes with a single tap.
        </p>
      </div>

      {favoriteDishes.length === 0 ? (
        /* Empty State */
        <div className="max-w-md mx-auto text-center py-12 px-6 bg-[#FAF6EE] rounded-2xl border border-[#E8DDCA] shadow-xs">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FFFDF8] border border-[#E8DDCA] flex items-center justify-center text-3xl shadow-inner">
            ❤️
          </div>
          <h2 className="font-serif text-xl font-bold text-[#17261D] mb-1">
            No Favourite Dishes Saved Yet
          </h2>
          <p className="text-xs text-[#77766D] mb-6 leading-relaxed">
            Explore our authentic 166-item fine-dining menu. Whenever you see a dish you love, tap the heart icon to save it here!
          </p>
          <button
            type="button"
            onClick={onNavigateToMenu}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#163E26] hover:bg-[#1E5233] text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-all shadow-md active:scale-98 cursor-pointer"
          >
            <span>🍽️</span>
            <span>Explore Menu</span>
          </button>
        </div>
      ) : (
        /* Grid of Saved Dishes */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {favoriteDishes.map((dish) => (
            <div
              key={dish.id}
              className="bg-[#FFFDF8] rounded-2xl border border-[#E8DDCA] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative"
            >
              {/* Remove from Favourites Button */}
              <button
                type="button"
                onClick={() => handleRemove(dish.id, dish.name)}
                className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs text-[#C83A25] hover:bg-white flex items-center justify-center shadow-xs transition-transform active:scale-90 cursor-pointer"
                title="Remove from favourites"
                aria-label="Remove from favourites"
              >
                ❤️
              </button>

              <div>
                {/* Food Image */}
                <div
                  className="aspect-4/3 w-full bg-[#FAF6EE] overflow-hidden relative cursor-pointer"
                  onClick={() => onDishClick && onDishClick(dish as any)}
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 scale-90">
                    <VegBadge />
                  </div>
                </div>

                {/* Dish Info */}
                <div className="p-3 sm:p-4">
                  <div className="flex items-center justify-between text-[11px] text-[#8F5D2C] mb-1">
                    <span className="font-semibold uppercase tracking-wider">{dish.category}</span>
                    <span className="flex items-center gap-0.5 text-[#163E26] font-bold">
                      ★ {dish.rating || 4.8}
                    </span>
                  </div>

                  <h3
                    className="font-serif text-sm sm:text-base font-bold text-[#17261D] line-clamp-1 group-hover:text-[#163E26] transition-colors cursor-pointer"
                    onClick={() => onDishClick && onDishClick(dish as any)}
                  >
                    {dish.name}
                  </h3>

                  {dish.description && (
                    <p className="text-[11px] text-[#77766D] line-clamp-2 mt-1 leading-snug">
                      {dish.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Price & Add Button */}
              <div className="p-3 sm:p-4 pt-0 flex items-center justify-between border-t border-[#E8DDCA]/50 mt-2">
                <span className="font-serif text-sm sm:text-base font-bold text-[#17261D]">
                  ₹{dish.price}
                </span>

                <button
                  type="button"
                  onClick={() => handleAdd(dish)}
                  className="px-3.5 py-1.5 bg-[#163E26] hover:bg-[#1E5233] text-white rounded-lg text-xs font-semibold shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                >
                  <span>+ Add</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
