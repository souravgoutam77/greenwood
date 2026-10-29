import React, { useState } from 'react';
import { LeafBranch } from './Icons';
import { RESTAURANT_DATA } from '../data/restaurantData';
import type { GalleryItem } from '../data/restaurantData';

export const RestaurantGallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const [showAllModal, setShowAllModal] = useState(false);

  return (
    <section
      id="gallery"
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-5 content-auto"
      aria-label="Restaurant Ambience Gallery"
    >
      
      {/* Section Header */}
      <div className="text-center mb-3 sm:mb-4">
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

      {/* Mobile Layout (2x2 Grid — EXACT Match to Screenshot 1) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 md:hidden">
        {/* Item 1: Gazebo Dining Pods */}
        <div
          onClick={() => setSelectedPhoto(RESTAURANT_DATA.gallery[0])}
          className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-2xs border border-[#E8DDCA]/80 bg-[#FFFDF8]"
        >
          <img
            src={RESTAURANT_DATA.gallery[0].image}
            alt={RESTAURANT_DATA.gallery[0].alt}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors" />
        </div>

        {/* Item 2: Botanical Wall Feature */}
        <div
          onClick={() => setSelectedPhoto(RESTAURANT_DATA.gallery[1])}
          className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-2xs border border-[#E8DDCA]/80 bg-[#FFFDF8]"
        >
          <img
            src={RESTAURANT_DATA.gallery[1].image}
            alt={RESTAURANT_DATA.gallery[1].alt}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors" />
        </div>

        {/* Item 3: Wooden Swing Seating */}
        <div
          onClick={() => setSelectedPhoto(RESTAURANT_DATA.gallery[2])}
          className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-2xs border border-[#E8DDCA]/80 bg-[#FFFDF8]"
        >
          <img
            src={RESTAURANT_DATA.gallery[2].image}
            alt={RESTAURANT_DATA.gallery[2].alt}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors" />
        </div>

        {/* Item 4: "View More Photos →" (Dark Green Card) */}
        <div
          onClick={() => setShowAllModal(true)}
          className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-2xs border border-[#1F5434] bg-[#163E26] group flex flex-col items-center justify-center p-3 text-center transition-colors hover:bg-[#1E5635]"
        >
          <img
            src={RESTAURANT_DATA.gallery[3].image}
            alt="Ambience preview"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            loading="lazy"
            decoding="async"
          />
          <div className="relative z-10 flex flex-col items-center">
            <span className="font-serif text-xs sm:text-sm font-bold text-[#E8D094] group-hover:text-[#FAF6EE] transition-colors">
              View More
            </span>
            <span className="font-serif text-xs sm:text-sm font-bold text-[#E8D094] group-hover:text-[#FAF6EE] transition-colors mt-0.5">
              Photos &rarr;
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Layout: 4 Columns */}
      <div className="hidden md:grid md:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Item 1: Conservatory Room */}
        <div
          onClick={() => setSelectedPhoto(RESTAURANT_DATA.gallery[0])}
          className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-[#E8DDCA]/80 bg-[#FFFDF8]"
        >
          <img
            src={RESTAURANT_DATA.gallery[0].image}
            alt={RESTAURANT_DATA.gallery[0].alt}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors" />
        </div>

        {/* Item 2: Wooden Gazebo Pod */}
        <div
          onClick={() => setSelectedPhoto(RESTAURANT_DATA.gallery[1])}
          className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-[#E8DDCA]/80 bg-[#FFFDF8]"
        >
          <img
            src={RESTAURANT_DATA.gallery[1].image}
            alt={RESTAURANT_DATA.gallery[1].alt}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors" />
        </div>

        {/* Item 3: Ambience with "Good Food. Greener Moods." overlay */}
        <div
          onClick={() => setSelectedPhoto(RESTAURANT_DATA.gallery[2])}
          className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-[#E8DDCA]/80 bg-[#FFFDF8]"
        >
          <img
            src={RESTAURANT_DATA.gallery[2].image}
            alt={RESTAURANT_DATA.gallery[2].alt}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/30" />
          
          {/* Script Text Overlay matching reference */}
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
          className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-[#1F5434] bg-[#163E26] group flex flex-col items-center justify-center p-4 text-center hover:bg-[#1E5635] transition-colors"
        >
          <img
            src={RESTAURANT_DATA.gallery[3].image}
            alt="Ambience overview"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            loading="lazy"
            decoding="async"
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

      {/* 1. Single Photo Lightbox Modal — EXACT Match to User's Screenshot 2 (media_1793255501716_561a5f50.png) */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative w-[92%] max-w-sm sm:max-w-md mx-auto bg-[#24140D] rounded-3xl overflow-hidden shadow-2xl border border-[#C9A45C]/35 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Photo Frame */}
            <div className="relative w-full aspect-[4/3] bg-black overflow-hidden">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.alt}
                className="w-full h-full object-cover"
              />
              {/* Close Button on Top Right (Exact match to screenshot) */}
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-colors cursor-pointer text-xs font-bold"
                aria-label="Close photo preview"
              >
                ✕
              </button>
            </div>

            {/* Bottom Details Strip (Exact match to screenshot) */}
            <div className="p-4 sm:p-5 bg-[#24140D] text-[#FAF6EE] flex items-center justify-between border-t border-[#C9A45C]/25">
              <div className="pr-2 min-w-0">
                <h4 className="font-serif font-bold text-base sm:text-lg text-[#E8D094] leading-snug">
                  {selectedPhoto.title}
                </h4>
                <p className="text-xs text-[#D4C3A3] mt-1 leading-relaxed">
                  {selectedPhoto.alt}
                </p>
              </div>
              <span className="text-xs sm:text-sm text-[#C9A45C] font-script italic whitespace-nowrap pl-2 shrink-0">
                Greenwood Ambience
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. "View More Photos" Modal — EXACT Match to User's Screenshot 3 (media_1793255518260_20fbecc2.png) */}
      {showAllModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3.5 sm:p-6"
          onClick={() => setShowAllModal(false)}
        >
          <div
            className="relative w-[92%] max-w-sm sm:max-w-md mx-auto bg-[#FAF6EE] rounded-3xl overflow-hidden shadow-2xl border border-[#E8DDCA] max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Walnut Header Strip (Exact match to screenshot) */}
            <div className="px-4 py-3.5 bg-[#2B180F] text-[#FAF6EE] flex items-center justify-between border-b border-[#3D2517] shadow-md">
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#E8D094]">
                  Greenwood Ambience Gallery
                </h3>
                <p className="text-[11px] text-[#D4C3A3] mt-0.5">
                  Real Photographs from Greenwood Café &amp; Restaurant • Narela, Delhi
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/20 cursor-pointer text-xs font-bold shrink-0 ml-3"
                aria-label="Close full gallery modal"
              >
                ✕
              </button>
            </div>
            
            {/* Scrollable Ambience Card Feed (Exact match to screenshot 3) */}
            <div className="p-3.5 overflow-y-auto space-y-3">
              {RESTAURANT_DATA.gallery.filter(i => !i.isActionTile).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedPhoto(item);
                  }}
                  className="group relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-[#E8DDCA] bg-[#2B180F] cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Bottom Text Overlay with Dark Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-3.5 text-white">
                    <span className="font-serif font-bold text-sm sm:text-base text-[#E8D094] block">
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
