import React, { useState, useRef, useEffect } from 'react';
import { LeafBranch } from './Icons';
import { RESTAURANT_DATA } from '../data/restaurantData';
import type { GalleryItem } from '../data/restaurantData';

export const RestaurantGallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const [showAllModal, setShowAllModal] = useState(false);
  const [borderAnimated, setBorderAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Trigger border animation ONCE when section scrolls into viewport, then finish and never repeat
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !borderAnimated) {
          setBorderAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [borderAnimated]);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 sm:py-2 md:py-2.5"
      aria-label="Restaurant Ambience Gallery"
    >
      
      {/* Section Header */}
      <div className="text-center mb-2 sm:mb-3">
        <div className="inline-flex items-center justify-center gap-1.5 sm:gap-3">
          <LeafBranch flip={false} className="w-5 h-2.5 sm:w-8 sm:h-4 text-[#2E5A3A]" />
          <h2 className="font-serif text-lg sm:text-3xl md:text-4xl font-bold text-[#17261D] tracking-tight">
            A Glimpse of Greenwood
          </h2>
          <LeafBranch flip={true} className="w-5 h-2.5 sm:w-8 sm:h-4 text-[#2E5A3A]" />
        </div>
        <p className="text-[9px] sm:text-xs font-semibold tracking-[0.22em] text-[#77766D] uppercase mt-0.5 sm:mt-1">
          WHERE NATURE MEETS UNFORGETTABLE DINING.
        </p>
      </div>

      {/* Mobile Layout (2x2 Grid with Sequential Single-Run Border Animation) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 md:hidden">
        {/* Item 1: Conservatory / Gazebo */}
        <div
          onClick={() => setSelectedPhoto(RESTAURANT_DATA.gallery[0])}
          className={`group relative h-28 sm:h-36 rounded-xl overflow-hidden cursor-pointer shadow-2xs border border-[#E8DDCA]/80 bg-[#FFFDF8] transition-all ${
            borderAnimated ? 'gallery-border-sweep-1' : ''
          }`}
        >
          <img
            src={RESTAURANT_DATA.gallery[0].image}
            alt={RESTAURANT_DATA.gallery[0].alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors" />
        </div>

        {/* Item 2: Botanical Wall Feature */}
        <div
          onClick={() => setSelectedPhoto(RESTAURANT_DATA.gallery[1])}
          className={`group relative h-28 sm:h-36 rounded-xl overflow-hidden cursor-pointer shadow-2xs border border-[#E8DDCA]/80 bg-[#FFFDF8] transition-all ${
            borderAnimated ? 'gallery-border-sweep-2' : ''
          }`}
        >
          <img
            src={RESTAURANT_DATA.gallery[1].image}
            alt={RESTAURANT_DATA.gallery[1].alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors" />
        </div>

        {/* Item 3: Wooden Swing Seating */}
        <div
          onClick={() => setSelectedPhoto(RESTAURANT_DATA.gallery[2])}
          className={`group relative h-28 sm:h-36 rounded-xl overflow-hidden cursor-pointer shadow-2xs border border-[#E8DDCA]/80 bg-[#FFFDF8] transition-all ${
            borderAnimated ? 'gallery-border-sweep-3' : ''
          }`}
        >
          <img
            src={RESTAURANT_DATA.gallery[2].image}
            alt={RESTAURANT_DATA.gallery[2].alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors" />
        </div>

        {/* Item 4: "View More Photos →" */}
        <div
          onClick={() => setShowAllModal(true)}
          className={`relative h-28 sm:h-36 rounded-xl overflow-hidden cursor-pointer shadow-2xs border border-[#1F5434] bg-[#163E26] group flex flex-col items-center justify-center p-3 text-center transition-all duration-300 hover:bg-[#1E5635] ${
            borderAnimated ? 'gallery-border-sweep-4' : ''
          }`}
        >
          <img
            src={RESTAURANT_DATA.gallery[3].image}
            alt="Ambience preview"
            className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-500"
            loading="eager"
          />
          <div className="relative z-10 flex flex-col items-center">
            <span className="font-serif text-xs font-bold text-[#E8D094] group-hover:text-[#FAF6EE] transition-colors">
              View More
            </span>
            <span className="font-serif text-xs font-bold text-[#E8D094] group-hover:text-[#FAF6EE] transition-colors mt-0.5">
              Photos &rarr;
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Layout: 4 Columns with Sequential Single-Run Border Animation */}
      <div className="hidden md:grid md:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Item 1: Conservatory Room */}
        <div
          onClick={() => setSelectedPhoto(RESTAURANT_DATA.gallery[0])}
          className={`group relative h-36 sm:h-40 md:h-44 lg:h-48 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-[#E8DDCA]/80 bg-[#FFFDF8] transition-all ${
            borderAnimated ? 'gallery-border-sweep-1' : ''
          }`}
        >
          <img
            src={RESTAURANT_DATA.gallery[0].image}
            alt={RESTAURANT_DATA.gallery[0].alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/15 group-hover:bg-black/30 transition-colors" />
        </div>

        {/* Item 2: Wooden Gazebo Pod */}
        <div
          onClick={() => setSelectedPhoto(RESTAURANT_DATA.gallery[1])}
          className={`group relative h-36 sm:h-40 md:h-44 lg:h-48 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-[#E8DDCA]/80 bg-[#FFFDF8] transition-all ${
            borderAnimated ? 'gallery-border-sweep-2' : ''
          }`}
        >
          <img
            src={RESTAURANT_DATA.gallery[1].image}
            alt={RESTAURANT_DATA.gallery[1].alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/15 group-hover:bg-black/30 transition-colors" />
        </div>

        {/* Item 3: Ambience with "Good Food. Greener Moods." overlay */}
        <div
          onClick={() => setSelectedPhoto(RESTAURANT_DATA.gallery[2])}
          className={`group relative h-36 sm:h-40 md:h-44 lg:h-48 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-[#E8DDCA]/80 bg-[#FFFDF8] transition-all ${
            borderAnimated ? 'gallery-border-sweep-3' : ''
          }`}
        >
          <img
            src={RESTAURANT_DATA.gallery[2].image}
            alt={RESTAURANT_DATA.gallery[2].alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/30" />
          
          {/* Script Text Overlay matching reference image */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <span className="font-script text-xl lg:text-2xl text-[#FFFFFF] drop-shadow-md">
              Good Food.
            </span>
            <span className="font-script text-xl lg:text-2xl text-[#E8D094] drop-shadow-md -mt-1">
              Greener Moods.
            </span>
          </div>
        </div>

        {/* Item 4: "View More Photos →" Tile */}
        <div
          onClick={() => setShowAllModal(true)}
          className={`relative h-36 sm:h-40 md:h-44 lg:h-48 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-[#1F5434] bg-[#163E26] group flex flex-col items-center justify-center p-4 text-center transition-all duration-300 hover:bg-[#1E5635] ${
            borderAnimated ? 'gallery-border-sweep-4' : ''
          }`}
        >
          {/* Background subtle image under dark green overlay */}
          <img
            src={RESTAURANT_DATA.gallery[3].image}
            alt="Ambience overview"
            className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity"
          />
          <div className="relative z-10 flex flex-col items-center gap-1 text-[#FAF6EE]">
            <span className="font-serif text-sm sm:text-base lg:text-lg font-bold text-[#E8D094] group-hover:text-white transition-colors">
              View More
            </span>
            <span className="font-serif text-sm sm:text-base lg:text-lg font-bold text-[#E8D094] group-hover:text-white transition-colors">
              Photos &rarr;
            </span>
          </div>
        </div>

      </div>

      {/* Lightbox Modal for Single Photo */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#1A1A1A] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center transition-colors"
              aria-label="Close photo preview"
            >
              ✕
            </button>
            <img
              src={selectedPhoto.image}
              alt={selectedPhoto.alt}
              className="w-full max-h-[75vh] object-contain"
            />
            <div className="p-4 bg-[#2B180F] text-[#FAF6EE] flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-base text-[#E8D094]">
                  {selectedPhoto.title}
                </h4>
                <p className="text-xs text-[#D4C3A3] mt-0.5">{selectedPhoto.alt}</p>
              </div>
              <span className="text-xs text-[#C9A45C] font-script text-lg">
                Greenwood Ambience
              </span>
            </div>
          </div>
        </div>
      )}

      {/* "View More Photos" Modal */}
      {showAllModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowAllModal(false)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#FAF6EE] rounded-3xl overflow-hidden shadow-2xl border border-[#E8DDCA] max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-6 bg-walnut-wood text-[#FAF6EE] flex items-center justify-between border-b border-[#C9A45C]/30 shadow-md">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#E8D094]">
                  Greenwood Ambience Gallery
                </h3>
                <p className="text-xs text-[#D4C3A3] mt-0.5">
                  Real Photographs from Greenwood Café &amp; Restaurant • Narela, Delhi
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllModal(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/15"
                aria-label="Close full gallery modal"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
              {RESTAURANT_DATA.gallery.filter(i => !i.isActionTile).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedPhoto(item);
                  }}
                  className="group relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-[#E8DDCA] bg-[#FFFDF8] cursor-pointer shadow-sm hover:shadow-lg transition-all"
                >
                  <img src={item.image} alt={item.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3.5 text-white">
                    <span className="font-serif font-bold text-sm text-[#E8D094] block">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-white/80 line-clamp-1 mt-0.5">
                      {item.alt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
