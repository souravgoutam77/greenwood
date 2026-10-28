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
  const [isInteracting, setIsInteracting] = useState(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Gentle auto-slide for Instagram videos
  useEffect(() => {
    if (isInteracting) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollWidth > clientWidth + 10) {
          const step = 200;
          const maxScroll = scrollWidth - clientWidth;
          const nextScroll = scrollLeft + step >= maxScroll - 10 ? 0 : scrollLeft + step;
          scrollRef.current.scrollTo({ left: nextScroll, behavior: 'smooth' });
        }
      }
    }, 3400);

    return () => clearInterval(interval);
  }, [isInteracting]);

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

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 sm:py-2 md:py-2.5" aria-label="Social Media Feed">
      
      {/* Section Header */}
      <div className="text-center mb-2 sm:mb-3">
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

      {/* Mobile Social Row (Gentle Auto-Slide Carousel, Direct Instagram Link) */}
      <div
        ref={scrollRef}
        onMouseEnter={handleInteractionStart}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
        className="flex gap-2.5 overflow-x-auto pb-2 lg:hidden no-scrollbar snap-x"
      >
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.reelUrl || RESTAURANT_DATA.socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-32 sm:w-36 aspect-[9/13] shrink-0 rounded-xl overflow-hidden shadow-2xs border border-[#E8DDCA] bg-[#120703] block cursor-pointer snap-start"
            aria-label={`Watch ${post.alt} on Greenwood Instagram`}
          >
            <img
              src={post.image}
              alt={post.alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="eager"
            />
            {/* Top Right Instagram Badge */}
            <div className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-black/50 backdrop-blur-xs flex items-center justify-center text-white/90 shadow-2xs">
              <InstagramIcon className="w-3 h-3" />
            </div>

            {/* Play Button in Center */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 flex items-center justify-center transition-colors">
              <div className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-xs group-hover:scale-110 transition-transform border border-white/20">
                <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* Bottom Handle Tag */}
            <div className="absolute bottom-1.5 left-1.5 right-1.5 z-10">
              <div className="bg-black/60 backdrop-blur-xs text-[8px] text-white/90 px-1.5 py-0.5 rounded flex items-center justify-center">
                <span className="truncate">@greenwoodcafeindia</span>
              </div>
            </div>
          </a>
        ))}

        {/* Card: Deep Forest Green "Follow Us" Panel */}
        <div className="w-32 sm:w-36 aspect-[9/13] shrink-0 rounded-xl bg-[#163E26] border border-[#1F5434] p-2 flex flex-col items-center justify-between text-center shadow-xs snap-start">
          <div className="w-full pt-1">
            <span className="font-serif text-xs font-bold text-[#FAF6EE] block tracking-tight">
              Follow Us
            </span>
            <span className="text-[8px] text-[#C9A45C] block">@greenwoodcafeindia</span>
          </div>
          <div className="flex items-center justify-center gap-2.5 my-auto">
            <a
              href={RESTAURANT_DATA.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              aria-label="Follow us on Instagram"
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 transition-all text-[#FAF6EE]"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href={RESTAURANT_DATA.socialLinks.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              title="Google Maps"
              aria-label="View on Google Maps"
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 transition-all text-[#FAF6EE]"
            >
              <GoogleMapsIcon className="w-4 h-4" />
            </a>
          </div>
          <a
            href={RESTAURANT_DATA.socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#FAF6EE] text-[#163E26] text-[9px] font-bold py-1 rounded-full transition-transform hover:scale-105"
          >
            Open ↗
          </a>
        </div>
      </div>

      {/* Desktop Layout: 6 columns matching reference image (5 direct videos + 1 Follow Us Panel) */}
      <div className="hidden lg:grid lg:grid-cols-6 gap-3 sm:gap-4">
        {posts.slice(0, 5).map((post) => (
          <a
            key={post.id}
            href={post.reelUrl || RESTAURANT_DATA.socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-[9/13] rounded-xl sm:rounded-2xl overflow-hidden shadow-xs border border-[#E8DDCA] bg-[#120703] cursor-pointer block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#163E26]"
            aria-label={`Open Instagram video: ${post.alt}`}
          >
            <img
              src={post.image}
              alt={post.alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="eager"
            />
            {/* Top Right Instagram Glyph */}
            <div className="absolute top-2.5 right-2.5 z-10 w-6 h-6 rounded-full bg-black/50 backdrop-blur-xs flex items-center justify-center text-white/90 shadow-2xs">
              <InstagramIcon className="w-3.5 h-3.5" />
            </div>

            {/* Play Button in Center with hover glow */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 flex items-center justify-center transition-colors">
              <div className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-xs group-hover:scale-110 transition-transform border border-white/25 shadow-lg">
                <svg className="w-4 h-4 fill-current ml-0.5 text-[#FAF6EE]" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* Bottom Reel Handle Overlay */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between text-[11px] text-[#FAF6EE] bg-black/65 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10">
              <span className="truncate text-[10px] text-white/90 font-medium">@greenwoodcafeindia</span>
              <span className="text-[10px] text-[#C9A45C]">↗</span>
            </div>
          </a>
        ))}

        {/* 6th Card: Deep Forest Green "Follow Us On" Panel */}
        <div className="aspect-[9/13] rounded-xl sm:rounded-2xl bg-[#163E26] border border-[#1F5434] p-3 sm:p-4 flex flex-col items-center justify-between text-center shadow-md">
          <div className="pt-1">
            <span className="font-serif text-sm sm:text-base font-bold text-[#FAF6EE] block tracking-wide">
              Follow Us On
            </span>
            <span className="text-[11px] text-[#C9A45C] font-mono mt-0.5 block">
              @greenwoodcafeindia
            </span>
          </div>

          <div className="flex items-center justify-center gap-3.5 my-auto">
            <a
              href={RESTAURANT_DATA.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 transition-all text-[#FAF6EE]"
              title="Instagram"
              aria-label="Follow us on Instagram"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
            <a
              href={RESTAURANT_DATA.socialLinks.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 transition-all text-[#FAF6EE]"
              title="Google Maps"
              aria-label="View on Google Maps"
            >
              <GoogleMapsIcon className="w-5 h-5" />
            </a>
          </div>

          <a
            href={RESTAURANT_DATA.socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#FAF6EE] hover:bg-white text-[#163E26] text-xs font-bold py-2 rounded-full transition-all hover:scale-102 shadow"
          >
            Watch on App &rarr;
          </a>
        </div>
      </div>

    </section>
  );
};
