import React, { useState, useEffect, useRef } from 'react';
import { api, type ApiBanner } from '../services/api';
import { firestore } from '../services/firebase';
import { doc, onSnapshot, collection } from 'firebase/firestore';

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

  // Touch gesture refs
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Fetch banners from API / DB and subscribe to real-time updates
  useEffect(() => {
    let isMounted = true;

    // 1. Initial load from API / Local Cache
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
      .catch(() => {});

    // 2. Real-time Cloud Firestore Listeners for Instant Multi-Device Sync
    let unsubscribeStoreConfig: (() => void) | null = null;
    let unsubscribeBanners: (() => void) | null = null;

    if (firestore) {
      try {
        // Listener A: Store Settings Config bannerUrl (updated via fast canvas compression)
        const configRef = doc(firestore, 'settings', 'storeConfig');
        unsubscribeStoreConfig = onSnapshot(
          configRef,
          (snapshot) => {
            if (snapshot.exists() && isMounted) {
              const data = snapshot.data();
              const effectiveUrl =
                data?.bannerUrl && typeof data.bannerUrl === 'string' && data.bannerUrl.trim().length > 0
                  ? data.bannerUrl
                  : '/images/hero-bg-2400.jpg';
              setBanners((prev) => {
                const updated = [...prev];
                if (updated.length > 0) {
                  updated[0] = {
                    ...updated[0],
                    imageDesktop: effectiveUrl,
                    imageMobile: effectiveUrl,
                  };
                }
                return updated;
              });
            }
          },
          (err) => console.warn('[HeroBanner] storeConfig sync notice:', err)
        );

        // Listener B: Banners collection
        const bannersCollectionRef = collection(firestore, 'banners');
        unsubscribeBanners = onSnapshot(
          bannersCollectionRef,
          (snapshot) => {
            if (!snapshot.empty && isMounted) {
              const liveBanners: ApiBanner[] = [];
              snapshot.forEach((doc) => {
                liveBanners.push({ id: doc.id, ...(doc.data() as any) });
              });
              const active = liveBanners.filter((b) => b.isActive !== false);
              if (active.length > 0) {
                active.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
                setBanners(active);
              }
            }
          },
          (err) => console.warn('[HeroBanner] banners collection sync notice:', err)
        );
      } catch (err) {
        console.warn('[HeroBanner] Firestore listener init notice:', err);
      }
    }

    return () => {
      isMounted = false;
      if (unsubscribeStoreConfig) unsubscribeStoreConfig();
      if (unsubscribeBanners) unsubscribeBanners();
    };
  }, []);

  const totalSlides = banners.length;

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <section
      className="relative w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-2.5 sm:pt-3 pb-3 sm:pb-4 select-none"
      aria-label="Featured Promotions & Highlights"
    >
      {/* Outer Banner Card Container */}
      <div
        className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-[#E8DDCA] shadow-sm bg-[#2B180F]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Banner Slide Frame (Mobile: square 1:1, Tablet: 16:10, Desktop: 1920/800 ~2.4:1 high impact height) */}
        <div className="relative w-full aspect-square sm:aspect-[16/10] md:aspect-[1920/800] min-h-[360px] sm:min-h-[440px] md:min-h-[550px] lg:min-h-[640px] overflow-hidden">
          {banners.map((slide, index) => {
            const isActive = index === currentSlide;
            const desktopSrc = slide.imageDesktop || '/images/hero-bg-2400.jpg';
            const mobileSrc = slide.imageMobile || desktopSrc;
            const content = (
              <picture className="w-full h-full block">
                <source media="(max-width: 640px)" srcSet={mobileSrc} />
                <img
                  src={desktopSrc}
                  alt={slide.title || 'Greenwood Cafe Special'}
                  className="w-full h-full object-cover object-center"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (!img.src.includes('hero-bg-2400.jpg')) {
                      img.src = '/images/hero-bg-2400.jpg';
                    }
                  }}
                />
              </picture>
            );

            return (
              <div
                key={slide.id || index}
                className={`absolute inset-0 w-full h-full transition-opacity duration-200 ease-out ${
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
                  className={`h-1.5 sm:h-2 rounded-full cursor-pointer ${
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
