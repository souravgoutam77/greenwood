import React, { useRef, useEffect, useState } from 'react';
import { LeafBranch, InstagramIcon, GoogleMapsIcon } from './Icons';
import { RESTAURANT_DATA } from '../data/restaurantData';

interface SocialPost {
  id: string;
  image: string;
  reelUrl?: string;
  alt: string;
}

export const SocialSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInteractingRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [posts, setPosts] = useState<SocialPost[]>(() => {
    try {
      const saved = localStorage.getItem('greenwood_social_reels');
      return saved ? (JSON.parse(saved) as SocialPost[]) : RESTAURANT_DATA.socialThumbnails;
    } catch {
      return RESTAURANT_DATA.socialThumbnails;
    }
  });

  useEffect(() => {
    const handleReelsUpdated = () => {
      try {
        const saved = localStorage.getItem('greenwood_social_reels');
        if (saved) {
          setPosts(JSON.parse(saved));
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('greenwood_reels_updated', handleReelsUpdated);
    return () => window.removeEventListener('greenwood_reels_updated', handleReelsUpdated);
  }, []);

  // Pause on user interaction and resume after 2.5s of idle
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

  // Gentle 1-by-1 step slide: every 3.2s slides by 1 video card smoothly
  useEffect(() => {
    const timer = setInterval(() => {
      if (isInteractingRef.current || !scrollRef.current || posts.length <= 1) return;
      const el = scrollRef.current;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 10) return;

      const cardStep = el.clientWidth < 640 ? 150 : 210;
      const nextScroll = el.scrollLeft + cardStep >= maxScroll - 15 ? 0 : el.scrollLeft + cardStep;
      el.scrollTo({ left: nextScroll, behavior: 'smooth' });
    }, 3200);

    return () => {
      clearInterval(timer);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [posts.length]);

  const handleManualNav = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      handleInteractionStart();
      const step = scrollRef.current.clientWidth < 640 ? 150 : 220;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -step : step,
        behavior: 'smooth',
      });
      handleInteractionEnd();
    }
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 md:py-4 content-auto" aria-label="Social Media Feed">
      
      {/* Section Header */}
      <div className="text-center mb-2.5 sm:mb-3.5">
        <div className="inline-flex items-center justify-center gap-1.5 sm:gap-3">
          <LeafBranch flip={false} className="w-5 h-2.5 sm:w-8 sm:h-4 text-[#2E5A3A]" />
          <h2 className="font-serif text-lg sm:text-3xl md:text-4xl font-bold text-[#17261D] tracking-tight">
            Follow Our Journey
          </h2>
          <LeafBranch flip={true} className="w-5 h-2.5 sm:w-8 sm:h-4 text-[#2E5A3A]" />
        </div>
        <p className="text-[9px] sm:text-xs font-semibold tracking-[0.22em] text-[#77766D] uppercase mt-0.5 sm:mt-1">
          STAY CONNECTED FOR FOOD, UPDATES &amp; STORIES
        </p>
      </div>

      {/* Slider Container with Desktop Arrows and Universal Smooth Track */}
      <div className="relative group/social-slider max-w-7xl mx-auto px-1">
        
        {/* Desktop Previous Button */}
        <button
          type="button"
          onClick={() => handleManualNav('left')}
          className="hidden sm:flex absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#FFFDF8] border border-[#C9A45C]/60 text-[#163E26] hover:bg-[#163E26] hover:text-[#FAF6EE] shadow-md items-center justify-center transition-all cursor-pointer opacity-80 hover:opacity-100 hover:scale-105 active:scale-95"
          aria-label="Previous videos"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Desktop Next Button */}
        <button
          type="button"
          onClick={() => handleManualNav('right')}
          className="hidden sm:flex absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#FFFDF8] border border-[#C9A45C]/60 text-[#163E26] hover:bg-[#163E26] hover:text-[#FAF6EE] shadow-md items-center justify-center transition-all cursor-pointer opacity-80 hover:opacity-100 hover:scale-105 active:scale-95"
          aria-label="Next videos"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Universal Horizontal Smooth Sliding Track */}
        <div
          ref={scrollRef}
          onMouseEnter={handleInteractionStart}
          onMouseLeave={handleInteractionEnd}
          onTouchStart={handleInteractionStart}
          onTouchEnd={handleInteractionEnd}
          className="flex gap-2.5 sm:gap-3.5 md:gap-4 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth items-stretch"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {posts.map((post) => {
            const reelIdMatch = (post.reelUrl || '').match(/(?:reel|p)\/([A-Za-z0-9_-]+)/);
            const reelId = reelIdMatch ? reelIdMatch[1] : '';
            const hasCustomImage = Boolean(post.image && post.image.trim() !== '' && post.image !== 'auto');

            return (
              <a
                key={post.id}
                href={post.reelUrl || RESTAURANT_DATA.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-32 sm:w-36 md:w-44 lg:w-48 aspect-[9/13] shrink-0 rounded-xl sm:rounded-2xl overflow-hidden shadow-xs border border-[#E8DDCA] bg-[#120703] block cursor-pointer transition-transform duration-300 hover:scale-102"
                aria-label={`Watch ${post.alt} on Greenwood Instagram`}
              >
                {hasCustomImage ? (
                  <img
                    src={post.image}
                    alt={post.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : reelId ? (
                  <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-[#2B180F] via-[#1A0E08] to-[#120703] flex flex-col justify-between p-3">
                    <iframe
                      src={`https://www.instagram.com/reel/${reelId}/embed`}
                      className="absolute inset-0 w-full h-full border-0 pointer-events-none opacity-90 scale-105"
                      scrolling="no"
                      title={post.alt}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors pointer-events-none" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-b from-[#2B180F] to-[#120703] flex flex-col items-center justify-center p-3 text-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] flex items-center justify-center text-white mb-2 shadow-sm">
                      <InstagramIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-[#FAF6EE] line-clamp-2">
                      {post.alt}
                    </span>
                  </div>
                )}

                {/* Top Right Instagram Badge */}
                <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black/65 flex items-center justify-center text-white/90 shadow-2xs">
                  <InstagramIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>

                {/* Play Button in Center */}
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/30 flex items-center justify-center transition-colors pointer-events-none">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/75 text-white flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform shadow-md">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Bottom Handle Tag */}
                <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 right-1.5 sm:right-2 z-10">
                  <div className="bg-black/80 backdrop-blur-2xs text-[8px] sm:text-[10px] text-white/90 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex items-center justify-between">
                    <span className="truncate">@greenwoodcafeindia</span>
                    <span className="text-[#C9A45C]">↗</span>
                  </div>
                </div>
              </a>
            );
          })}

          {/* Follow Us End Card */}
          <div className="w-32 sm:w-36 md:w-44 lg:w-48 aspect-[9/13] shrink-0 rounded-xl sm:rounded-2xl bg-[#163E26] border border-[#1F5434] p-3 sm:p-4 flex flex-col items-center justify-between text-center shadow-xs">
            <div className="w-full pt-1">
              <span className="font-serif text-xs sm:text-base font-bold text-[#FAF6EE] block tracking-tight">
                Follow Us
              </span>
              <span className="text-[8px] sm:text-[11px] text-[#C9A45C] block mt-0.5">@greenwoodcafeindia</span>
            </div>

            <div className="flex items-center justify-center gap-2 sm:gap-3.5 my-auto">
              <a
                href={RESTAURANT_DATA.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                aria-label="Follow us on Instagram"
                className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF6EE] hover:scale-110 transition-transform"
              >
                <InstagramIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href={RESTAURANT_DATA.socialLinks.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                title="Google Maps"
                aria-label="View on Google Maps"
                className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF6EE] hover:scale-110 transition-transform"
              >
                <GoogleMapsIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>

            <a
              href={RESTAURANT_DATA.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#FAF6EE] hover:bg-white text-[#163E26] text-[9px] sm:text-xs font-bold py-1.5 rounded-full transition-all shadow"
            >
              Open ↗
            </a>
          </div>

        </div>
      </div>

    </section>
  );
};
