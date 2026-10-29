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

      {/* Mobile Layout (2x2 Grid — 3 Photos + 1 View More Photos Card) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 md:hidden">
        {/* Item 1: Gazebo Dining Pods */}
        <div
          onClick={() => setSelectedPhoto(RESTAURANT_DATA.gallery[0])}
          className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-2xs border border-[#E8DDCA]/80 bg-[#FFFDF8] active:scale-98 transition-transform"
        >
          <img
            src={RESTAURANT_DATA.gallery[0].image}
            alt={RESTAURANT_DATA.gallery[0].alt}
            className="w-full h-full object-cover object-center"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
        </div>

        {/* Item 2: Botanical Wall Feature */}
        <div
          onClick={() => setSelectedPhoto(RESTAURANT_DATA.gallery[1])}
          className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-2xs border border-[#E8DDCA]/80 bg-[#FFFDF8] active:scale-98 transition-transform"
        >
          <img
            src={RESTAURANT_DATA.gallery[1].image}
            alt={RESTAURANT_DATA.gallery[1].alt}
            className="w-full h-full object-cover object-center"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
        </div>

        {/* Item 3: Wooden Swing Seating (Centered to avoid cutting seats) */}
        <div
          onClick={() => setSelectedPhoto(RESTAURANT_DATA.gallery[2])}
          className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-2xs border border-[#E8DDCA]/80 bg-[#FFFDF8] active:scale-98 transition-transform"
        >
          <img
            src={RESTAURANT_DATA.gallery[2].image}
            alt={RESTAURANT_DATA.gallery[2].alt}
            className="w-full h-full object-cover object-[center_60%]"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
        </div>

        {/* Item 4: "View More Photos →" (Dark Green Luxury Card) */}
        <div
          onClick={() => setShowAllModal(true)}
          className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-2xs border border-[#1F5434] bg-[#163E26] group flex flex-col items-center justify-center p-3 text-center transition-all hover:bg-[#1E5635] active:scale-98"
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

      {/* Desktop Layout: 4 Columns (3 Ambience Photos + 1 View More Photos Card) */}
      <div className="hidden md:grid md:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Item 1: Gazebo Dining Pods */}
        <div
          onClick={() => setSelectedPhoto(RESTAURANT_DATA.gallery[0])}
          className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-[#E8DDCA]/80 bg-[#FFFDF8] transition-all hover:shadow-md hover:scale-102"
        >
          <img
            src={RESTAURANT_DATA.gallery[0].image}
            alt={RESTAURANT_DATA.gallery[0].alt}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
        </div>

        {/* Item 2: Botanical Wall Feature */}
        <div
          onClick={() => setSelectedPhoto(RESTAURANT_DATA.gallery[1])}
          className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-[#E8DDCA]/80 bg-[#FFFDF8] transition-all hover:shadow-md hover:scale-102"
        >
          <img
            src={RESTAURANT_DATA.gallery[1].image}
            alt={RESTAURANT_DATA.gallery[1].alt}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
        </div>

        {/* Item 3: Wooden Swing Seating */}
        <div
          onClick={() => setSelectedPhoto(RESTAURANT_DATA.gallery[2])}
          className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-[#E8DDCA]/80 bg-[#FFFDF8] transition-all hover:shadow-md hover:scale-102"
        >
          <img
            src={RESTAURANT_DATA.gallery[2].image}
            alt={RESTAURANT_DATA.gallery[2].alt}
            className="w-full h-full object-cover object-[center_60%] group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
        </div>

        {/* Item 4: "View More Photos →" Tile */}
        <div
          onClick={() => setShowAllModal(true)}
          className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-[#1F5434] bg-[#163E26] group flex flex-col items-center justify-center p-4 text-center hover:bg-[#1E5635] transition-all hover:shadow-md hover:scale-102"
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

      {/* 1. Sleek Full Lightbox Modal for Single Photo — 100% Uncut Photo Display */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative w-[94%] max-w-lg mx-auto bg-[#24140D] rounded-3xl overflow-hidden shadow-2xl border border-[#C9A45C]/40 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Photo Frame — clean fit without cutting */}
            <div className="relative w-full bg-black/95 flex items-center justify-center min-h-[240px] max-h-[62vh] overflow-hidden">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.alt}
                className="w-full max-h-[62vh] object-contain object-center"
              />
              {/* Close Button on Top Right */}
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/25 transition-all cursor-pointer text-xs font-bold shadow-md hover:scale-105 active:scale-95"
                aria-label="Close photo preview"
              >
                ✕
              </button>
            </div>

            {/* Bottom Details Strip */}
            <div className="p-3.5 sm:p-4.5 bg-[#24140D] text-[#FAF6EE] flex items-center justify-between border-t border-[#C9A45C]/25">
              <div className="pr-2 min-w-0">
                <h4 className="font-serif font-bold text-sm sm:text-base text-[#E8D094] leading-snug">
                  {selectedPhoto.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-[#D4C3A3] mt-0.5 line-clamp-2 leading-relaxed">
                  {selectedPhoto.alt}
                </p>
              </div>
              <span className="text-xs text-[#C9A45C] font-script italic whitespace-nowrap pl-2 shrink-0">
                Greenwood Ambience
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. "View More Photos" Modal — Comprehensive Gallery View */}
      {showAllModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3.5 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setShowAllModal(false)}
        >
          <div
            className="relative w-[94%] max-w-lg sm:max-w-xl mx-auto bg-[#FAF6EE] rounded-3xl overflow-hidden shadow-2xl border border-[#E8DDCA] max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Walnut Header Strip */}
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
            
            {/* Scrollable Ambience Card Feed */}
            <div className="p-3.5 overflow-y-auto space-y-3">
              {RESTAURANT_DATA.gallery.filter(i => !i.isActionTile).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedPhoto(item);
                  }}
                  className="group relative aspect-[16/10] rounded-2xl overflow-hidden border border-[#E8DDCA] bg-[#2B180F] cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300"
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
