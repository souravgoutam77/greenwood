import React, { useState, useEffect, useRef } from 'react';
import { api, type ApiBanner } from '../services/api';

const FALLBACK_BANNERS: ApiBanner[] = [
  {
    id: 'banner-1',
    title: 'Good Food. Greener Moods.',
    subtitle: '100% Pure Vegetarian Fine Dining in Narela',
    imageDesktop: '/images/hero-bg-2400.jpg',
    imageMobile: '/images/hero-bg-mobile-1200.jpg',
    linkUrl: '#menu',
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 'banner-2',
    title: 'Signature North Indian Specials',
    subtitle: 'Slow simmered Dal Makhani & Fresh Tandoor Breads',
    imageDesktop: '/images/gallery-1.jpg',
    imageMobile: '/images/gallery-1.jpg',
    linkUrl: '#menu',
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 'banner-3',
    title: 'Private Gazebo Dining Pods',
    subtitle: 'Botanical luxury ambience for memorable family dinners',
    imageDesktop: '/images/gallery-2.jpg',
    imageMobile: '/images/gallery-2.jpg',
    linkUrl: '#gallery',
    isActive: true,
    displayOrder: 3,
  },
];

export const HeroBanner: React.FC = () => {
  const [banners, setBanners] = useState<ApiBanner[]>(FALLBACK_BANNERS);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch gesture refs
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Fetch banners from API / DB
  useEffect(() => {
    let isMounted = true;
    api
      .getBanners()
      .then((data) => {
        if (!isMounted) return;
        const active = (data || []).filter((b) => b.isActive !== false);
        if (active.length > 0) {
          active.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          setBanners(active);
        }
      })
      .catch((err) => {
        console.warn('Could not load banners, using fallback:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const totalSlides = banners.length;

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  // Autoplay timer
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5500);

    return () => clearInterval(interval);
  }, [totalSlides, isPaused]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (_e: React.TouchEvent) => {
    // If movement is mostly horizontal, we let it swipe; if vertical, browser scrolls normally
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) {
      setIsPaused(false);
      return;
    }

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Verify it is a true horizontal swipe (dx > 40 and horizontal dominates vertical)
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    setIsPaused(false);
  };


  return (
    <section
      className="relative w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-2.5 sm:pt-3 pb-3 sm:pb-4 select-none"
      aria-label="Featured Promotions & Highlights"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Outer Banner Card Container */}
      <div
        className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-[#E8DDCA] shadow-md bg-[#2B180F]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Banner Slide Frame: 20% increased mobile height (aspect-[4/3] on mobile) */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[21/9] md:aspect-[674/144] min-h-[240px] sm:min-h-0 overflow-hidden">
          {banners.map((slide, index) => {
            const isActive = index === currentSlide;
            const content = (
              <picture className="w-full h-full block">
                <source media="(max-width: 640px)" srcSet={slide.imageMobile || slide.imageDesktop} />
                <img
                  src={slide.imageDesktop}
                  alt={slide.title || 'Greenwood Cafe Special'}
                  className="w-full h-full object-cover object-center"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </picture>
            );

            return (
              <div
                key={slide.id || index}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
                aria-hidden={!isActive}
              >
                {slide.linkUrl ? (
                  <a href={slide.linkUrl} className="block w-full h-full cursor-pointer" tabIndex={isActive ? 0 : -1}>
                    {content}
                  </a>
                ) : (
                  content
                )}
              </div>
            );
          })}

          {/* Left / Right Carousel Navigation Chevrons */}
          {totalSlides > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center border border-white/30 backdrop-blur-xs transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-md"
                aria-label="Previous slide"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M15 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center border border-white/30 backdrop-blur-xs transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-md"
                aria-label="Next slide"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          )}

          {/* Bottom Pagination Dots */}
          {totalSlides > 1 && (
            <div className="absolute bottom-2.5 sm:bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2">
              {banners.map((_, dot) => (
                <button
                  key={dot}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(dot);
                  }}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === dot ? 'w-5 sm:w-6 bg-[#C9A45C]' : 'w-1.5 sm:w-2 bg-white/60 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${dot + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
