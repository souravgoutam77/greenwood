import React, { useState } from 'react';
import { LeafBranch } from './Icons';
import { RESTAURANT_DATA } from '../data/restaurantData';

export const RestaurantGallery: React.FC = () => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [showAllModal, setShowAllModal] = useState(false);

  // Ambience photos list (strictly authentic Greenwood photographs)
  const ambiencePhotos = RESTAURANT_DATA.gallery.filter((i) => !i.isActionTile);

  const selectedPhoto = selectedPhotoIndex !== null ? ambiencePhotos[selectedPhotoIndex] : null;

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % ambiencePhotos.length);
    }
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex - 1 + ambiencePhotos.length) % ambiencePhotos.length);
    }
  };

  return (
    <section
      id="gallery"
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 content-auto"
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
        <p className="text-[9px] sm:text-xs font-semibold tracking-[0.24em] text-[#C9A45C] uppercase mt-0.5 sm:mt-1">
          WHERE NATURE MEETS UNFORGETTABLE DINING
        </p>
        <div className="mx-auto mt-1.5 w-16 h-0.5 bg-gradient-to-r from-transparent via-[#C9A45C]/70 to-transparent rounded-full" />
      </div>

      {/* ========================================================= */}
      {/* CLEAN ASYMMETRICAL LUXURY SHOWCASE (Zero Clutter, Pure Photos) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3.5 md:gap-4">
        
        {/* TILE 1: Cinematic Wide Hero Photo (Signature Gazebo Pods) */}
        <div
          onClick={() => setSelectedPhotoIndex(0)}
          className="col-span-2 relative aspect-[16/10] sm:aspect-[21/9] md:aspect-[16/8] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-xs border border-[#E8DDCA] bg-[#120703] group transition-all duration-300 hover:shadow-md hover:border-[#C9A45C]"
        >
          <img
            src={ambiencePhotos[0].image}
            alt={ambiencePhotos[0].alt}
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
        </div>

        {/* TILE 2: Botanical Plant Wall Feature */}
        <div
          onClick={() => setSelectedPhotoIndex(1)}
          className="col-span-1 relative aspect-square sm:aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-xs border border-[#E8DDCA] bg-[#120703] group transition-all duration-300 hover:shadow-md hover:border-[#C9A45C]"
        >
          <img
            src={ambiencePhotos[1].image}
            alt={ambiencePhotos[1].alt}
            className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
        </div>

        {/* TILE 3: Wooden Swing Seating */}
        <div
          onClick={() => setSelectedPhotoIndex(2)}
          className="col-span-1 relative aspect-square sm:aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-xs border border-[#E8DDCA] bg-[#120703] group transition-all duration-300 hover:shadow-md hover:border-[#C9A45C]"
        >
          <img
            src={ambiencePhotos[2].image}
            alt={ambiencePhotos[2].alt}
            className="w-full h-full object-cover object-[center_60%] group-hover:scale-104 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
        </div>

        {/* TILE 4: Fluted Velvet Lounge */}
        <div
          onClick={() => setSelectedPhotoIndex(3)}
          className="col-span-1 relative aspect-square sm:aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-xs border border-[#E8DDCA] bg-[#120703] group transition-all duration-300 hover:shadow-md hover:border-[#C9A45C]"
        >
          <img
            src={ambiencePhotos[3].image}
            alt={ambiencePhotos[3].alt}
            className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
        </div>

        {/* TILE 5: Dark Green "View More Photos →" Card */}
        <div
          onClick={() => setShowAllModal(true)}
          className="col-span-1 relative aspect-square sm:aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-xs border border-[#1F5434] bg-[#163E26] group flex flex-col items-center justify-center p-3 text-center transition-all duration-300 hover:bg-[#1E5635] hover:shadow-md hover:border-[#C9A45C]"
        >
          <img
            src={ambiencePhotos[4]?.image || ambiencePhotos[0].image}
            alt="Ambience preview"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            loading="lazy"
            decoding="async"
          />
          <div className="relative z-10 flex flex-col items-center">
            <span className="font-serif text-xs sm:text-base md:text-lg font-bold text-[#E8D094] group-hover:text-white transition-colors">
              View More
            </span>
            <span className="font-serif text-xs sm:text-base md:text-lg font-bold text-[#E8D094] group-hover:text-white transition-colors mt-0.5 sm:mt-1">
              Photos &rarr;
            </span>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 1. SLEEK LIGHTBOX MODAL (Full Photo View + Previous / Next) */}
      {/* ========================================================= */}
      {selectedPhoto && selectedPhotoIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <div
            className="relative w-[94%] max-w-lg sm:max-w-xl mx-auto bg-[#24140D] rounded-3xl overflow-hidden shadow-2xl border border-[#C9A45C]/40 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Photo Frame — Clean fit without cutting */}
            <div className="relative w-full bg-black/95 flex items-center justify-center min-h-[240px] max-h-[64vh] overflow-hidden select-none">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.alt}
                className="w-full max-h-[64vh] object-contain object-center"
              />

              {/* Close Button on Top Right */}
              <button
                type="button"
                onClick={() => setSelectedPhotoIndex(null)}
                className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/25 transition-all cursor-pointer text-xs font-bold shadow-md hover:scale-105 active:scale-95"
                aria-label="Close photo preview"
              >
                ✕
              </button>

              {/* Photo Counter Pill on Top Left */}
              <div className="absolute top-3 left-3 z-30 px-2.5 py-1 rounded-full bg-black/70 border border-white/20 text-[#FAF6EE] text-[10px] font-mono">
                {selectedPhotoIndex + 1} / {ambiencePhotos.length}
              </div>

              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={handlePrevPhoto}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/65 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-md hover:scale-110 active:scale-95 text-lg"
                aria-label="Previous photo"
              >
                ‹
              </button>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={handleNextPhoto}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/65 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-md hover:scale-110 active:scale-95 text-lg"
                aria-label="Next photo"
              >
                ›
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

      {/* ========================================================= */}
      {/* 2. COMPREHENSIVE GALLERY MODAL (All 6 Ambience Photos)    */}
      {/* ========================================================= */}
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
                  Real Photographs • Greenwood Café &amp; Restaurant, Narela
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
              {ambiencePhotos.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setShowAllModal(false);
                    setSelectedPhotoIndex(idx);
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-3.5 text-white">
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
