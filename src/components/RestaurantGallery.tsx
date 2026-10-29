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
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-6 content-auto"
      aria-label="Restaurant Ambience Gallery"
    >
      
      {/* Section Header: Luxury Fine Dining Aesthetic */}
      <div className="text-center mb-3 sm:mb-5">
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

      {/* Ambience Quick Spaces Pills: Interactive Shortcuts */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-2.5 sm:pb-3.5 no-scrollbar px-1">
        <button
          type="button"
          onClick={() => setSelectedPhotoIndex(0)}
          className="shrink-0 px-2.5 sm:px-3.5 py-1 rounded-full bg-[#FFFDF8] hover:bg-[#163E26] text-[#17261D] hover:text-[#FAF6EE] text-[10px] sm:text-xs font-medium border border-[#E8DDCA] hover:border-[#163E26] shadow-2xs transition-all cursor-pointer flex items-center gap-1 active:scale-95"
        >
          <span>✨</span>
          <span>Gazebo Pods</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedPhotoIndex(1)}
          className="shrink-0 px-2.5 sm:px-3.5 py-1 rounded-full bg-[#FFFDF8] hover:bg-[#163E26] text-[#17261D] hover:text-[#FAF6EE] text-[10px] sm:text-xs font-medium border border-[#E8DDCA] hover:border-[#163E26] shadow-2xs transition-all cursor-pointer flex items-center gap-1 active:scale-95"
        >
          <span>🌿</span>
          <span>Green Wall</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedPhotoIndex(2)}
          className="shrink-0 px-2.5 sm:px-3.5 py-1 rounded-full bg-[#FFFDF8] hover:bg-[#163E26] text-[#17261D] hover:text-[#FAF6EE] text-[10px] sm:text-xs font-medium border border-[#E8DDCA] hover:border-[#163E26] shadow-2xs transition-all cursor-pointer flex items-center gap-1 active:scale-95"
        >
          <span>🪵</span>
          <span>Swing Dining</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedPhotoIndex(3)}
          className="shrink-0 px-2.5 sm:px-3.5 py-1 rounded-full bg-[#FFFDF8] hover:bg-[#163E26] text-[#17261D] hover:text-[#FAF6EE] text-[10px] sm:text-xs font-medium border border-[#E8DDCA] hover:border-[#163E26] shadow-2xs transition-all cursor-pointer flex items-center gap-1 active:scale-95"
        >
          <span>🛋️</span>
          <span>Velvet Lounge</span>
        </button>
        <button
          type="button"
          onClick={() => setShowAllModal(true)}
          className="shrink-0 px-2.5 sm:px-3.5 py-1 rounded-full bg-[#163E26] text-[#E8D094] hover:text-white text-[10px] sm:text-xs font-semibold border border-[#C9A45C]/50 shadow-2xs transition-all cursor-pointer flex items-center gap-1 active:scale-95"
        >
          <span>📸</span>
          <span>View All (6)</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* LUXURY BENTO MOSAIC GRID (New High-End Design)            */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3.5 md:gap-4.5">
        
        {/* BENTO TILE 1: Wide Panoramic Hero Card (Gazebo Dining Pods) */}
        <div
          onClick={() => setSelectedPhotoIndex(0)}
          className="col-span-2 relative aspect-[16/9] sm:aspect-[21/9] md:aspect-[16/8] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-xs border border-[#E8DDCA] bg-[#120703] group transition-all duration-300 hover:shadow-lg hover:border-[#C9A45C]"
        >
          <img
            src={ambiencePhotos[0].image}
            alt={ambiencePhotos[0].alt}
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
            loading="lazy"
            decoding="async"
          />
          {/* Top-Left Frosted Tag Badge */}
          <div className="absolute top-2.5 sm:top-3.5 left-2.5 sm:left-3.5 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full border border-white/20 text-[#FAF6EE] text-[10px] sm:text-xs font-medium shadow-xs">
            <span className="text-[#E8D094]">✨</span>
            <span>Signature Gazebo Pods</span>
          </div>

          {/* Top-Right Expand Icon */}
          <div className="absolute top-2.5 sm:top-3.5 right-2.5 sm:right-3.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 backdrop-blur-md text-white/90 flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all border border-white/20">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          </div>

          {/* Bottom Gradient with Ambient Caption */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-3 sm:p-4.5 text-white">
            <span className="font-serif font-bold text-sm sm:text-lg md:text-xl text-[#E8D094] block leading-tight">
              {ambiencePhotos[0].title}
            </span>
            <p className="text-[10px] sm:text-xs text-white/80 line-clamp-1 mt-0.5 max-w-lg">
              {ambiencePhotos[0].alt}
            </p>
          </div>
        </div>

        {/* BENTO TILE 2: Botanical Plant Feature Wall */}
        <div
          onClick={() => setSelectedPhotoIndex(1)}
          className="col-span-1 relative aspect-square sm:aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-xs border border-[#E8DDCA] bg-[#120703] group transition-all duration-300 hover:shadow-lg hover:border-[#C9A45C]"
        >
          <img
            src={ambiencePhotos[1].image}
            alt={ambiencePhotos[1].alt}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
            decoding="async"
          />
          {/* Top-Left Badge */}
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 text-[#FAF6EE] text-[9px] sm:text-[11px] font-medium">
            <span className="text-[#C9A45C]">🌿</span>
            <span>Living Wall</span>
          </div>
          {/* Bottom Gradient with Title */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent flex flex-col justify-end p-2.5 sm:p-3.5 text-white">
            <span className="font-serif font-bold text-xs sm:text-sm text-[#E8D094] block line-clamp-1">
              {ambiencePhotos[1].title}
            </span>
            <span className="text-[9px] sm:text-[11px] text-white/75 line-clamp-1 mt-0.5">
              Illuminated vertical greenery
            </span>
          </div>
        </div>

        {/* BENTO TILE 3: Wooden Swing Seating */}
        <div
          onClick={() => setSelectedPhotoIndex(2)}
          className="col-span-1 relative aspect-square sm:aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-xs border border-[#E8DDCA] bg-[#120703] group transition-all duration-300 hover:shadow-lg hover:border-[#C9A45C]"
        >
          <img
            src={ambiencePhotos[2].image}
            alt={ambiencePhotos[2].alt}
            className="w-full h-full object-cover object-[center_60%] group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
            decoding="async"
          />
          {/* Top-Left Badge */}
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 text-[#FAF6EE] text-[9px] sm:text-[11px] font-medium">
            <span className="text-[#C9A45C]">🪵</span>
            <span>Swing Seats</span>
          </div>
          {/* Bottom Gradient with Title */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent flex flex-col justify-end p-2.5 sm:p-3.5 text-white">
            <span className="font-serif font-bold text-xs sm:text-sm text-[#E8D094] block line-clamp-1">
              {ambiencePhotos[2].title}
            </span>
            <span className="text-[9px] sm:text-[11px] text-white/75 line-clamp-1 mt-0.5">
              Indoor swing table dining
            </span>
          </div>
        </div>

        {/* BENTO TILE 4: Fluted Velvet Lounge */}
        <div
          onClick={() => setSelectedPhotoIndex(3)}
          className="col-span-1 relative aspect-square sm:aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-xs border border-[#E8DDCA] bg-[#120703] group transition-all duration-300 hover:shadow-lg hover:border-[#C9A45C]"
        >
          <img
            src={ambiencePhotos[3].image}
            alt={ambiencePhotos[3].alt}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
            decoding="async"
          />
          {/* Top-Left Badge */}
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 text-[#FAF6EE] text-[9px] sm:text-[11px] font-medium">
            <span className="text-[#C9A45C]">🛋️</span>
            <span>Velvet Lounge</span>
          </div>
          {/* Bottom Gradient with Title */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent flex flex-col justify-end p-2.5 sm:p-3.5 text-white">
            <span className="font-serif font-bold text-xs sm:text-sm text-[#E8D094] block line-clamp-1">
              {ambiencePhotos[3].title}
            </span>
            <span className="text-[9px] sm:text-[11px] text-white/75 line-clamp-1 mt-0.5">
              Mustard fluted sofa lounge
            </span>
          </div>
        </div>

        {/* BENTO TILE 5: Luxury Emerald Ambience Hub Portal */}
        <div
          onClick={() => setShowAllModal(true)}
          className="col-span-1 relative aspect-square sm:aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-xs border border-[#2B5E3C] bg-gradient-to-br from-[#163E26] via-[#102F1D] to-[#0A2013] group flex flex-col items-center justify-between p-3.5 sm:p-5 text-center transition-all duration-300 hover:shadow-lg hover:border-[#C9A45C] hover:scale-102"
        >
          {/* Decorative Subtle Background Glimmer */}
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#C9A45C]/15 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-[#2E5A3A]/40 rounded-full blur-xl pointer-events-none" />

          {/* Top Micro-Label */}
          <div className="relative z-10 w-full pt-1">
            <span className="inline-block px-2 py-0.5 rounded-full bg-white/10 text-[#E8D094] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border border-white/10">
              Ambience Tour
            </span>
          </div>

          {/* Center Brand Highlights */}
          <div className="relative z-10 my-auto">
            <div className="font-serif text-base sm:text-xl md:text-2xl font-bold text-[#FAF6EE] group-hover:text-[#E8D094] transition-colors leading-tight">
              Explore All 6
            </div>
            <div className="font-serif text-xs sm:text-sm text-[#E8D094] font-semibold mt-0.5">
              Ambience Zones
            </div>
            <p className="text-[9px] sm:text-[11px] text-[#C5BDB0] mt-1 max-w-[140px] mx-auto line-clamp-2">
              Gazebos, swings, lounges &amp; private booths
            </p>
          </div>

          {/* Bottom Action Button */}
          <div className="relative z-10 w-full">
            <span className="inline-flex items-center justify-center gap-1.5 w-full bg-[#FAF6EE] group-hover:bg-[#E8D094] text-[#163E26] text-[10px] sm:text-xs font-bold py-1.5 sm:py-2 rounded-full transition-all shadow-xs">
              <span>View Gallery</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 1. SLEEK LIGHTBOX MODAL (With Next/Prev Navigation)        */}
      {/* ========================================================= */}
      {selectedPhoto && selectedPhotoIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 bg-black/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <div
            className="relative w-[94%] max-w-xl mx-auto bg-[#24140D] rounded-3xl overflow-hidden shadow-2xl border border-[#C9A45C]/40 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Photo Frame — Clean fit without cutting */}
            <div className="relative w-full bg-black/95 flex items-center justify-center min-h-[250px] max-h-[64vh] overflow-hidden select-none">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.alt}
                className="w-full max-h-[64vh] object-contain object-center"
              />

              {/* Close Button on Top Right */}
              <button
                type="button"
                onClick={() => setSelectedPhotoIndex(null)}
                className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center border border-white/25 transition-all cursor-pointer text-xs font-bold shadow-md hover:scale-105 active:scale-95"
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
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/65 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-md hover:scale-110 active:scale-95"
                aria-label="Previous photo"
              >
                ‹
              </button>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={handleNextPhoto}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/65 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-md hover:scale-110 active:scale-95"
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
                  6 Real Photographs • Greenwood Café &amp; Restaurant, Narela
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
                  {/* Top-Right Tap to Expand Badge */}
                  <div className="absolute top-2.5 right-2.5 z-10 bg-black/60 backdrop-blur-xs text-[10px] text-white px-2 py-0.5 rounded-full border border-white/20">
                    Tap to view ⤢
                  </div>

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
