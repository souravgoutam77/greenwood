import React, { useState } from 'react';

export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = 4;

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-2.5 sm:pt-3 pb-3 sm:pb-4" aria-label="Featured Promotion">
      {/* Container with rounded border matching reference */}
      <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-[#E8DDCA] shadow-md bg-[#FAF6EE]">
        
        {/* Banner Container: Optimized mobile aspect ratio for generous photo height & beautiful aesthetic */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] md:aspect-[674/144] overflow-hidden">
          
          {/* Responsive Background Picture */}
          <picture className="w-full h-full block">
            <source media="(max-width: 640px)" srcSet="/images/hero-bg-mobile-1200.jpg" />
            <img
              src="/images/hero-bg-2400.jpg"
              alt="Greenwood Café luxury botanical dining hall with gazebo pods"
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
          </picture>

          {/* Subtle Contrast Gradient for Crystal-Clear Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent sm:from-black/60 sm:via-black/25 sm:to-transparent pointer-events-none" />

          {/* Banner Content Overlay: Elegant Brand Slogan */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20 z-10 pointer-events-none">
            <div className="max-w-xs sm:max-w-sm md:max-w-md">
              <div className="font-script text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] leading-tight">
                Good Food.
              </div>
              <div className="font-script text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#E8D094] drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] -mt-1 sm:-mt-2">
                Greener Moods.
              </div>
            </div>
          </div>

          {/* Left / Right Carousel Navigation Chevrons */}
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-black/55 hover:bg-black/80 text-white flex items-center justify-center border border-white/30 backdrop-blur-xs transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-md"
            aria-label="Previous slide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-black/55 hover:bg-black/80 text-white flex items-center justify-center border border-white/30 backdrop-blur-xs transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-md"
            aria-label="Next slide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Bottom Pagination Dots */}
          <div className="absolute bottom-2.5 sm:bottom-3.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 sm:gap-2">
            {[0, 1, 2, 3].map((dot) => (
              <button
                key={dot}
                type="button"
                onClick={() => setCurrentSlide(dot)}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === dot
                    ? 'w-4 sm:w-5 bg-[#C9A45C]'
                    : 'bg-white/60 hover:bg-white'
                }`}
                aria-label={`Go to slide ${dot + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
