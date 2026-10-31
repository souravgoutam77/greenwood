import React, { useState, useRef, useEffect } from 'react';
import { LeafBranch, VegBadge } from './Icons';
import { BUTTER_PANEER_DETAIL } from '../data/dishDetailData';
import type { DishDetail, PairingItem, RecommendationItem } from '../data/dishDetailData';
import type { Dish } from '../data/restaurantData';
import { getCustomerAuth } from '../services/auth';
import { isFavorite as checkIsFavorite, toggleFavorite as toggleFavoriteService } from '../services/favorites';

interface ItemDetailPageProps {
  onBackToHome: () => void;
  onBackToMenu?: () => void;
  onAddToCart: (dish: Dish) => void;
}

export const ItemDetailPage: React.FC<ItemDetailPageProps> = ({
  onBackToHome,
  onBackToMenu,
  onAddToCart,
}) => {
  const dish: DishDetail = BUTTER_PANEER_DETAIL;

  // Local state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(() => checkIsFavorite(dish.id));

  useEffect(() => {
    const handleFavs = () => {
      setIsFavorite(checkIsFavorite(dish.id));
    };
    window.addEventListener('gw_favorites_changed', handleFavs);
    window.addEventListener('storage', handleFavs);
    return () => {
      window.removeEventListener('gw_favorites_changed', handleFavs);
      window.removeEventListener('storage', handleFavs);
    };
  }, [dish.id]);

  const handleToggleFavorite = () => {
    const auth = getCustomerAuth();
    toggleFavoriteService(dish.id, auth?.phone);
  };
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [helpfulLikes, setHelpfulLikes] = useState<Record<string, number>>({
    'rev-1': 24,
    'rev-2': 12,
  });
  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const reviewsSectionRef = useRef<HTMLDivElement>(null);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? dish.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) =>
      prev === dish.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleScrollToReviews = (e: React.MouseEvent) => {
    e.preventDefault();
    reviewsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const triggerToast = (itemName: string) => {
    setAddedToast(itemName);
    setTimeout(() => {
      setAddedToast(null);
    }, 2400);
  };

  const handleMainAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart({
        id: dish.id,
        name: dish.name,
        description: dish.description,
        price: dish.price,
        rating: dish.rating,
        reviewsCount: dish.reviewsCount,
        isVeg: true,
        image: dish.images[0].url,
      });
    }
    triggerToast(`${quantity} × ${dish.name} added to cart`);
  };

  const handleAddPairing = (pair: PairingItem) => {
    onAddToCart({
      id: pair.id,
      name: pair.name,
      description: "Authentic vegetarian pairing",
      price: pair.price,
      rating: 4.8,
      reviewsCount: 45,
      isVeg: true,
      image: pair.image,
    });
    triggerToast(`${pair.name} added to cart`);
  };

  const handleAddRecommendation = (rec: RecommendationItem) => {
    onAddToCart({
      id: rec.id,
      name: rec.name,
      description: "Chef's gourmet pure vegetarian specialty",
      price: rec.price,
      rating: rec.rating,
      reviewsCount: rec.reviewsCount,
      isVeg: true,
      image: rec.image,
    });
    triggerToast(`${rec.name} added to cart`);
  };

  const toggleHelpful = (reviewId: string) => {
    if (hasLiked[reviewId]) {
      setHelpfulLikes((prev) => ({ ...prev, [reviewId]: prev[reviewId] - 1 }));
      setHasLiked((prev) => ({ ...prev, [reviewId]: false }));
    } else {
      setHelpfulLikes((prev) => ({ ...prev, [reviewId]: prev[reviewId] + 1 }));
      setHasLiked((prev) => ({ ...prev, [reviewId]: true }));
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#FAF6EE] text-[#4B5149] selection:bg-[#163E26] selection:text-[#FAF6EE] overflow-x-hidden pb-24 md:pb-10">
      {/* Floating Add To Cart Notification Toast */}
      {addedToast && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-[#163E26] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-medium border border-[#235C38] animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#85D49B] animate-pulse" />
          <span>{addedToast}</span>
        </div>
      )}

      {/* Main Centered Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-5 relative z-10">
        
        {/* 1. BREADCRUMBS NAVIGATION */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center justify-between text-xs text-[#77766D] mb-3 sm:mb-5"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            {/* Mobile Back Button */}
            <button
              type="button"
              onClick={onBackToMenu || onBackToHome}
              className="md:hidden p-1 -ml-1 text-[#17261D] hover:text-[#163E26] transition-colors"
              aria-label="Go back to menu"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={onBackToMenu || onBackToHome}
              className="hover:text-[#163E26] transition-colors focus:outline-none"
            >
              Menu
            </button>
            <span className="text-[#C9A45C] text-[10px] select-none">&gt;</span>
            <button
              type="button"
              onClick={onBackToMenu || onBackToHome}
              className="hover:text-[#163E26] transition-colors focus:outline-none"
            >
              {dish.category}
            </button>
            <span className="text-[#C9A45C] text-[10px] select-none">&gt;</span>
            <span className="text-[#17261D] font-medium truncate">
              {dish.name}
            </span>
          </div>

          {/* Mobile Top Favorite Icon */}
          <button
            type="button"
            onClick={handleToggleFavorite}
            className="md:hidden w-8 h-8 rounded-full bg-[#FFFDF8] border border-[#E8DDCA] flex items-center justify-center text-base hover:bg-black/5 transition-colors focus:outline-none"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <span className={isFavorite ? "text-[#C83A25]" : "text-[#77766D]"}>
              {isFavorite ? '♥' : '♡'}
            </span>
          </button>
        </nav>

        {/* 2. TOP HERO PRODUCT SECTION (Gallery on left, Details on right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-8 items-start mb-8 sm:mb-10">
          
          {/* LEFT COLUMN: IMAGE GALLERY (54% on desktop) */}
          <div className="md:col-span-6 lg:col-span-7 space-y-3">
            {/* Main Image Box */}
            <div className="relative w-full aspect-[5/4] sm:aspect-[4/3] rounded-2xl overflow-hidden bg-[#FFFDF8] border border-[#E8DDCA] shadow-2xs group">
              <img
                src={dish.images[activeImageIndex].url}
                alt={dish.images[activeImageIndex].alt}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />

              {/* Prev Image Button */}
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#17261D] flex items-center justify-center shadow-md backdrop-blur-xs transition-all hover:scale-105 focus:outline-none"
                aria-label="Previous image"
              >
                <svg className="w-4 h-4 ml--0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Next Image Button */}
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#17261D] flex items-center justify-center shadow-md backdrop-blur-xs transition-all hover:scale-105 focus:outline-none"
                aria-label="Next image"
              >
                <svg className="w-4 h-4 mr--0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Expand Lightbox Button */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-all"
                aria-label="Expand image"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>

            {/* Thumbnail Navigation Row */}
            <div className="flex gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {dish.images.map((thumb, idx) => (
                <button
                  key={thumb.id}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 sm:w-20 aspect-square shrink-0 rounded-lg sm:rounded-xl overflow-hidden border transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#163E26] ring-2 ring-[#163E26]/40 shadow-xs scale-102'
                      : 'border-[#E8DDCA] opacity-75 hover:opacity-100'
                  }`}
                  aria-label={`Select photo ${idx + 1}`}
                >
                  <img
                    src={thumb.url}
                    alt={thumb.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: DISH DETAILS & PURCHASE CONTROLS (46% on desktop) */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Vegetarian Indicator Pill & Desktop Favorite Heart */}
              <div className="flex items-center justify-between mb-2">
                <div className="inline-flex items-center gap-1.5 bg-[#DCE8CB]/70 text-[#163E26] text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#B8D3A2]">
                  <VegBadge />
                  <span>{dish.vegLabel}</span>
                </div>

                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className="hidden md:flex w-9 h-9 rounded-full bg-[#FFFDF8] border border-[#E8DDCA] items-center justify-center text-lg shadow-2xs hover:scale-105 transition-all text-[#C83A25] focus:outline-none"
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <span className={isFavorite ? "text-[#C83A25]" : "text-[#77766D]"}>
                    {isFavorite ? '♥' : '♡'}
                  </span>
                </button>
              </div>

              {/* Dish Name */}
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#17261D] tracking-tight mb-2">
                {dish.name}
              </h1>

              {/* Main Description */}
              <p className="text-xs sm:text-sm text-[#4B5149] leading-relaxed mb-3">
                {dish.description}
              </p>

              {/* Rating and Review Summary */}
              <div className="flex items-center gap-2 text-xs sm:text-sm mb-4">
                <span className="text-[#E5A93C] text-sm">★</span>
                <span className="font-bold text-[#17261D]">{dish.rating}</span>
                <span className="text-[#77766D]">({dish.reviewsCount} reviews)</span>
                <a
                  href="#reviews"
                  onClick={handleScrollToReviews}
                  className="text-[#163E26] font-semibold underline underline-offset-2 ml-2 hover:text-[#235C38] transition-colors"
                >
                  See all reviews &rarr;
                </a>
              </div>

              {/* Price */}
              <div className="font-sans text-2xl sm:text-3xl font-bold text-[#C83A25] mb-5">
                ₹{dish.price}
              </div>

              {/* Quantity Selector & Add to Cart Row */}
              <div className="flex items-center gap-3 sm:gap-4 mb-6">
                {/* Quantity Controls */}
                <div className="bg-[#FFFDF8] border border-[#E8DDCA] rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-3 sm:gap-4 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-6 h-6 flex items-center justify-center text-[#17261D] font-bold text-base disabled:opacity-35 hover:bg-black/5 rounded-md transition-colors"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="text-sm sm:text-base font-bold text-[#17261D] min-w-4 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-6 h-6 flex items-center justify-center text-[#17261D] font-bold text-base hover:bg-black/5 rounded-md transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleMainAddToCart}
                  className="flex-1 bg-[#163E26] hover:bg-[#1E5233] text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  <span>Add to Cart</span>
                  <span className="text-white/60 mx-0.5">|</span>
                  <span>₹{dish.price * quantity}</span>
                </button>
              </div>

              {/* Compact Dish Information Row */}
              <div className="border-t border-[#E8DDCA] pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                {/* Serves */}
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#FAF6EE] text-[#163E26] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#77766D] block leading-tight">Serves</span>
                    <span className="text-xs font-semibold text-[#17261D]">{dish.metadata.serves}</span>
                  </div>
                </div>

                {/* Cuisine */}
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#FAF6EE] text-[#163E26] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#77766D] block leading-tight">Cuisine</span>
                    <span className="text-xs font-semibold text-[#17261D]">{dish.metadata.cuisine}</span>
                  </div>
                </div>

                {/* Preparation Time */}
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#FAF6EE] text-[#163E26] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" strokeWidth="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7v5l3 2" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#77766D] block leading-tight">Prep Time</span>
                    <span className="text-xs font-semibold text-[#17261D]">{dish.metadata.preparationTime}</span>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#FAF6EE] text-[#163E26] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#77766D] block leading-tight">Availability</span>
                    <span className="text-xs font-semibold text-[#17261D] leading-tight block">Dine-in, Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. MIDDLE SECTION: ABOUT THIS DISH & PAIRS WELL WITH */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-8 mb-8 sm:mb-10 items-stretch">
          
          {/* ABOUT THIS DISH (Left card, ~45% width) */}
          <div className="md:col-span-5 flex flex-col">
            <div className="flex items-center gap-1.5 mb-2.5">
              <LeafBranch flip={false} className="w-4 h-2 text-[#2E5A3A]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#17261D] tracking-tight">
                About This Dish
              </h2>
            </div>
            <div className="flex-1 bg-[#FFFDF8] rounded-2xl border border-[#E8DDCA] p-4 sm:p-5 shadow-2xs flex flex-col justify-center">
              <p className="text-xs sm:text-sm text-[#4B5149] leading-relaxed">
                {dish.about.description}
              </p>
            </div>
          </div>

          {/* PAIRS WELL WITH (Right card, ~55% width) */}
          <div className="md:col-span-7 flex flex-col">
            <div className="flex items-center gap-1.5 mb-2.5">
              <LeafBranch flip={false} className="w-4 h-2 text-[#2E5A3A]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#17261D] tracking-tight">
                Pairs Well With
              </h2>
            </div>
            <div className="flex-1 bg-[#FFFDF8] rounded-2xl border border-[#E8DDCA] p-3 sm:p-4 shadow-2xs flex items-center">
              <div className="w-full flex md:grid md:grid-cols-3 gap-2.5 sm:gap-3 overflow-x-auto md:overflow-visible no-scrollbar pb-1 md:pb-0">
                {dish.pairings.map((pair) => (
                  <div
                    key={pair.id}
                    className="w-28 sm:w-32 md:w-auto shrink-0 bg-[#FAF6EE]/70 rounded-xl border border-[#E8DDCA]/80 p-2 sm:p-2.5 flex flex-col justify-between group hover:border-[#163E26]/40 transition-colors"
                  >
                    <div className="aspect-square w-full rounded-lg overflow-hidden bg-white mb-2 shadow-2xs">
                      <img
                        src={pair.image}
                        alt={pair.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-[#17261D] truncate leading-tight">
                        {pair.name}
                      </h3>
                      <div className="flex items-center justify-between mt-1 pt-1">
                        <span className="font-sans text-xs font-bold text-[#C83A25]">
                          ₹{pair.price}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddPairing(pair)}
                          className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-[#163E26] hover:bg-[#1E5233] text-white flex items-center justify-center text-xs font-bold transition-transform active:scale-90"
                          aria-label={`Add ${pair.name} to cart`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* 4. RECOMMENDATIONS SECTION: "YOU MAY ALSO LIKE" */}
        <section className="mb-8 sm:mb-10" aria-label="Similar dishes">
          <div className="flex items-center gap-1.5 mb-3 sm:mb-4">
            <LeafBranch flip={false} className="w-4 h-2 text-[#2E5A3A]" />
            <h2 className="font-serif text-lg sm:text-2xl font-bold text-[#17261D] tracking-tight">
              You May Also Like
            </h2>
          </div>

          <div className="flex md:grid md:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto md:overflow-visible no-scrollbar snap-x pb-2 md:pb-0">
            {dish.recommendations.map((rec) => (
              <div
                key={rec.id}
                className="w-36 sm:w-44 md:w-auto shrink-0 snap-start bg-[#FFFDF8] rounded-xl sm:rounded-2xl border border-[#E8DDCA] p-2.5 sm:p-3 shadow-2xs flex flex-col justify-between group hover:shadow-sm transition-all"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full rounded-lg sm:rounded-xl overflow-hidden bg-[#FAF6EE] mb-2.5">
                    <img
                      src={rec.image}
                      alt={rec.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1.5 right-1.5 scale-75">
                      <VegBadge />
                    </div>
                  </div>

                  <h3 className="font-serif text-xs sm:text-sm font-bold text-[#17261D] truncate group-hover:text-[#163E26] transition-colors">
                    {rec.name}
                  </h3>

                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-[#77766D] mt-0.5">
                    <span className="text-[#E5A93C]">★</span>
                    <span className="font-semibold text-[#17261D]">{rec.rating}</span>
                    <span>({rec.reviewsCount})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#E8DDCA]/60">
                  <span className="font-sans text-xs sm:text-sm font-bold text-[#C83A25]">
                    ₹{rec.price}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddRecommendation(rec)}
                    className="bg-[#163E26] hover:bg-[#1E5233] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full transition-transform active:scale-95"
                    aria-label={`Add ${rec.name} to cart`}
                  >
                    + Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. CUSTOMER REVIEWS SECTION */}
        <section ref={reviewsSectionRef} id="reviews" className="mb-6 sm:mb-8" aria-label="Customer Reviews">
          <div className="flex items-center gap-1.5 mb-3 sm:mb-4">
            <LeafBranch flip={false} className="w-4 h-2 text-[#2E5A3A]" />
            <h2 className="font-serif text-lg sm:text-2xl font-bold text-[#17261D] tracking-tight">
              Customer Reviews
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 items-stretch">
            
            {/* RATING SUMMARY CARD (Left side, ~35%) */}
            <div className="md:col-span-4 bg-[#FFFDF8] rounded-2xl border border-[#E8DDCA] p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-serif text-4xl sm:text-5xl font-bold text-[#17261D]">
                    {dish.reviewsSummary.average}
                  </span>
                  <div className="flex items-center text-[#E5A93C] text-lg">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
                <p className="text-xs text-[#77766D] mb-4">
                  Based on {dish.reviewsSummary.total} verified reviews
                </p>

                {/* Rating Distribution Bars */}
                <div className="space-y-1.5">
                  {dish.reviewsSummary.distribution.map((dist) => (
                    <div key={dist.stars} className="flex items-center gap-2 text-xs">
                      <span className="w-3 text-[#17261D] font-medium">{dist.stars}</span>
                      <span className="text-[#E5A93C] text-[10px]">★</span>
                      <div className="flex-1 h-1.5 bg-[#E8DDCA]/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#163E26] rounded-full transition-all duration-500"
                          style={{ width: `${dist.percentage}%` }}
                        />
                      </div>
                      <span className="w-7 text-[11px] text-[#77766D] text-right">
                        {dist.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* REVIEW CARDS (Right side, ~65% width, 2 columns on desktop matching reference mockup) */}
            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-stretch">
              {dish.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-[#FFFDF8] rounded-2xl border border-[#E8DDCA] p-4 shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#3F5043] text-white text-xs font-bold flex items-center justify-center">
                        {rev.avatarInitial}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-[#17261D] leading-tight">
                          {rev.author}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-[#77766D]">
                          <div className="flex text-[#E5A93C]">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i}>★</span>
                            ))}
                          </div>
                          <span>{rev.rating.toFixed(1)}</span>
                          <span>&bull;</span>
                          <span>{rev.timeAgo}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="text-[#77766D] hover:text-[#17261D] p-1"
                      aria-label="More options"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="5" r="1.5" />
                        <circle cx="12" cy="12" r="1.5" />
                        <circle cx="12" cy="19" r="1.5" />
                      </svg>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-[#4B5149] leading-relaxed mb-3">
                    {rev.text}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    {/* User review thumbnails */}
                    <div className="flex gap-2">
                      {rev.images?.map((imgUrl, i) => (
                        <div
                          key={i}
                          className="w-12 h-12 rounded-lg overflow-hidden border border-[#E8DDCA] bg-black/5"
                        >
                          <img
                            src={imgUrl}
                            alt="Customer photo"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Helpful Like Button */}
                    <button
                      type="button"
                      onClick={() => toggleHelpful(rev.id)}
                      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        hasLiked[rev.id]
                          ? 'bg-[#163E26] text-white border-[#163E26]'
                          : 'bg-[#FAF6EE] text-[#77766D] border-[#E8DDCA] hover:border-[#163E26]'
                      }`}
                      aria-label="Mark review as helpful"
                    >
                      <span>👍</span>
                      <span>{helpfulLikes[rev.id]}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

      </div>

      {/* LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute -top-10 right-0 text-white text-2xl font-bold hover:text-gray-300"
              aria-label="Close image"
            >
              ✕
            </button>
            <img
              src={dish.images[activeImageIndex].url}
              alt={dish.images[activeImageIndex].alt}
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
