import React, { useState } from 'react';
import { LeafBranch, WhatsAppIcon } from './Icons';

interface AboutPageProps {
  onNavigateToMenu: () => void;
  onNavigateToContact: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigateToMenu,
  onNavigateToContact: _onNavigateToContact,
}) => {
  const [mobileStoryExpanded, setMobileStoryExpanded] = useState(false);

  const googleMapsUrl =
    'https://maps.google.com/?q=Plot+No-2,+Pocket-6,+Sector-A10,+Narela,+Delhi+-+110040';
  const whatsappUrl =
    'https://wa.me/919066906607?text=Hi%20Greenwood%20Caf%C3%A9!';

  return (
    <div className="w-full bg-[#FAF6EE] min-h-screen text-[#4B5149] font-sans antialiased pb-20 md:pb-12">

      {/* ========================================================= */}
      {/* 1. HEADER HERO (Clean & Elegant)                          */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden pt-8 pb-8 sm:pb-10 bg-gradient-to-b from-[#FAF6EE] to-[#FFFDF8] border-b border-[#E8DDCA] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center justify-center gap-2 text-[#163E26] mb-2">
            <LeafBranch flip={false} className="w-5 h-2.5" />
            <span className="font-serif text-xs sm:text-sm tracking-widest uppercase font-semibold text-[#163E26]">
              Our Story &amp; Ambience
            </span>
            <LeafBranch flip={true} className="w-5 h-2.5" />
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#17261D] tracking-tight mb-2">
            About Greenwood Café
          </h1>
          <p className="text-xs sm:text-sm text-[#77766D] max-w-xl mx-auto font-sans leading-relaxed">
            A fine-dine vegetarian family restaurant in Narela, Delhi, bringing people together over pure food, lush botanical ambience, and memorable moments.
          </p>
        </div>
      </section>


      {/* ========================================================= */}
      {/* SECTION B — OUR PHILOSOPHY ("OUR STORY")                   */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20" aria-label="Our Philosophy">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column (Desktop 4 cols): Real Interior Photo */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl border border-[#E8DDCA] shadow-md bg-[#FFFDF8]">
              <img
                src="/images/real/real-dining-hall.jpg"
                alt="Greenwood Café spacious dining hall with chandeliers and wooden botanical tables in Narela"
                className="w-full h-64 sm:h-72 lg:h-96 object-cover object-center group-hover:scale-103 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/gallery-1.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 text-white text-[11px] font-medium bg-black/65 px-2.5 py-1 rounded-lg">
                📍 Greenwood Fine-Dining Hall, Narela
              </div>
            </div>
          </div>

          {/* Center Column (Desktop 4 cols): Story & Philosophy Copy */}
          <div className="lg:col-span-4 order-1 lg:order-2 space-y-3.5 sm:space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center justify-center lg:justify-start gap-1.5">
              <LeafBranch flip={false} className="w-5 h-2.5 text-[#2E5A3A]" />
              <span className="text-xs font-bold tracking-[0.25em] text-[#C9A45C] uppercase">
                OUR STORY
              </span>
              <LeafBranch flip={true} className="w-5 h-2.5 text-[#2E5A3A]" />
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#17261D] leading-snug tracking-tight">
              A Place for Great Food and Good Company
            </h2>

            <p className="text-xs sm:text-sm md:text-[15px] text-[#4B5149] leading-relaxed">
              Greenwood Café &amp; Restaurant is a fine-dine family restaurant in Narela, Delhi, where delicious vegetarian food, warm ambience and comfortable space come together to create a memorable dining experience.
            </p>

            <div className={`${mobileStoryExpanded ? 'block' : 'hidden sm:block'} space-y-3`}>
              <p className="text-xs sm:text-sm md:text-[15px] text-[#4B5149] leading-relaxed">
                From flavourful North Indian classics to popular Chinese and Continental dishes, every dish is prepared with fresh vegetables and 100% desi ghee, served with care in a beautiful and peaceful environment.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 justify-center lg:justify-start">
                <span className="text-[11px] font-semibold text-[#163E26] bg-[#E8F3EB] px-2.5 py-1 rounded-full border border-[#2E5A3A]/30">
                  ✓ North Indian, Chinese &amp; Continental
                </span>
                <span className="text-[11px] font-semibold text-[#163E26] bg-[#E8F3EB] px-2.5 py-1 rounded-full border border-[#2E5A3A]/30">
                  ✓ 100% Desi Ghee in Main Courses
                </span>
              </div>
            </div>

            {/* Mobile Read More Toggle */}
            <div className="sm:hidden pt-1">
              <button
                type="button"
                onClick={() => setMobileStoryExpanded(!mobileStoryExpanded)}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#163E26] hover:text-[#C9A45C] bg-[#E8F3EB] px-4 py-1.5 rounded-full cursor-pointer transition-colors"
              >
                <span>{mobileStoryExpanded ? 'Read Less' : 'Read More'}</span>
                <span>{mobileStoryExpanded ? '▲' : '▼'}</span>
              </button>
            </div>
          </div>

          {/* Right Column (Desktop 4 cols): Real Food Photography */}
          <div className="lg:col-span-4 order-3">
            <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl border border-[#E8DDCA] shadow-md bg-[#FFFDF8]">
              <img
                src="/images/dish-detail/real-butter-paneer-hero.jpg"
                alt="Greenwood signature rich Paneer Butter Masala prepared with 100% desi ghee"
                className="w-full h-64 sm:h-72 lg:h-96 object-cover object-center group-hover:scale-103 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/dish-detail/real-butter-paneer-hero.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 text-white text-[11px] font-medium bg-black/65 px-2.5 py-1 rounded-lg">
                🍲 Prepared with 100% Desi Ghee &amp; Fresh Spices
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* SECTION C — WHAT MAKES GREENWOOD SPECIAL (3 CARDS)        */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" aria-label="What Makes Greenwood Special">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          
          {/* Card 1: Pure Vegetarian Dining */}
          <div className="bg-[#FFFDF8] rounded-2xl sm:rounded-3xl border border-[#E8DDCA] p-6 sm:p-7 shadow-2xs hover:shadow-md hover:border-[#C9A45C] transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#E8F3EB] border border-[#2E5A3A]/20 flex items-center justify-center text-[#163E26] mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-[#163E26]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#17261D] mb-2 group-hover:text-[#163E26] transition-colors">
                Pure Vegetarian Dining
              </h3>
              <p className="text-xs sm:text-sm text-[#4B5149] leading-relaxed">
                Delicious North Indian, Chinese and Continental dishes, made with fresh ingredients and 100% desi ghee.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E8DDCA]/60 flex items-center gap-1.5 text-[11px] font-bold text-[#168039]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#168039]" />
              <span>100% Vegetarian • Fresh Ingredients</span>
            </div>
          </div>

          {/* Card 2: A Space for Family & Friends */}
          <div className="bg-[#FFFDF8] rounded-2xl sm:rounded-3xl border border-[#E8DDCA] p-6 sm:p-7 shadow-2xs hover:shadow-md hover:border-[#C9A45C] transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#F7EFE2] border border-[#C9A45C]/30 flex items-center justify-center text-[#8F5D2C] mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-[#8F5D2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#17261D] mb-2 group-hover:text-[#163E26] transition-colors">
                A Space for Family &amp; Friends
              </h3>
              <p className="text-xs sm:text-sm text-[#4B5149] leading-relaxed">
                A comfortable and stylish place to dine with family, friends and loved ones in a peaceful botanical environment.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E8DDCA]/60 flex items-center gap-1.5 text-[11px] font-bold text-[#8F5D2C]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8F5D2C]" />
              <span>Comfortable Dining • Peaceful Ambience</span>
            </div>
          </div>

          {/* Card 3: Special Arrangements for Parties & Functions */}
          <div className="bg-[#FFFDF8] rounded-2xl sm:rounded-3xl border border-[#E8DDCA] p-6 sm:p-7 shadow-2xs hover:shadow-md hover:border-[#C9A45C] transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#FFF8E7] border border-[#C9A45C]/40 flex items-center justify-center text-[#C9A45C] mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-[#C9A45C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#17261D] mb-2 group-hover:text-[#163E26] transition-colors">
                Special Arrangements for Parties &amp; Functions
              </h3>
              <p className="text-xs sm:text-sm text-[#4B5149] leading-relaxed">
                Celebrate birthdays, get-togethers and special occasions with dedicated restaurant arrangements and curated menus.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E8DDCA]/60 flex items-center gap-1.5 text-[11px] font-bold text-[#C9A45C]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A45C]" />
              <span>Birthdays • Anniversaries • Gatherings</span>
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* SECTION D — A GLIMPSE OF GREENWOOD (PHOTO GALLERY)         */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16" aria-label="A Glimpse of Greenwood">
        
        {/* Section Header with View More Link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.25em] text-[#C9A45C] uppercase">
              OUR AMBIENCE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#17261D] tracking-tight mt-0.5">
              A Glimpse of Greenwood
            </h2>
          </div>

          
        </div>

        {/* 5 Real Verified Greenwood Photos (Grid on Desktop, Swipe on Mobile) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          
          {/* Photo 1: Dining Hall */}
          <div className="relative group overflow-hidden rounded-xl sm:rounded-2xl border border-[#E8DDCA] bg-[#FAF6EE] shadow-2xs aspect-4/5">
            <img
              src="/images/real/real-dining-hall.jpg"
              alt="Greenwood Café fine dining hall with chandeliers and green plants in Narela"
              className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
              <span className="text-[11px] font-semibold text-white">Dining Hall</span>
            </div>
          </div>

          {/* Photo 2: Neon Leaf & Gazebo Pods */}
          <div className="relative group overflow-hidden rounded-xl sm:rounded-2xl border border-[#E8DDCA] bg-[#FAF6EE] shadow-2xs aspect-4/5">
            <img
              src="/images/real/real-gazebo-pods.jpg"
              alt="Greenwood private gazebo pod wrapped in botanical greenery"
              className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
              <span className="text-[11px] font-semibold text-white">Gazebo Pods</span>
            </div>
          </div>

          {/* Photo 3: Yellow Velvet Lounge */}
          <div className="relative group overflow-hidden rounded-xl sm:rounded-2xl border border-[#E8DDCA] bg-[#FAF6EE] shadow-2xs aspect-4/5">
            <img
              src="/images/real/real-yellow-lounge.jpg"
              alt="Greenwood comfortable circular yellow velvet booths with brass ceiling lights"
              className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
              <span className="text-[11px] font-semibold text-white">Lounge Booths</span>
            </div>
          </div>

          {/* Photo 4: Emerald Booths */}
          <div className="relative group overflow-hidden rounded-xl sm:rounded-2xl border border-[#E8DDCA] bg-[#FAF6EE] shadow-2xs aspect-4/5">
            <img
              src="/images/real/real-emerald-booths.jpg"
              alt="Greenwood intimate emerald booths with curated botanical artwork"
              className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
              <span className="text-[11px] font-semibold text-white">Emerald Booths</span>
            </div>
          </div>

          {/* Photo 5: Backlit Botanical Sign Wall */}
          <div className="relative group overflow-hidden rounded-xl sm:rounded-2xl border border-[#E8DDCA] bg-[#FAF6EE] shadow-2xs aspect-4/5 col-span-2 sm:col-span-1">
            <img
              src="/images/real/real-botanical-wall.jpg"
              alt="Greenwood Café and Restaurant signature illuminated logo on live moss wall"
              className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
              <span className="text-[11px] font-semibold text-white">Moss Wall Logo</span>
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* SECTION E — VISIT US & VERIFIED CONTACT DETAILS           */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14" aria-label="Visit Greenwood Café">
        <div className="bg-[#FFFDF8] rounded-2xl sm:rounded-3xl border border-[#E8DDCA] p-6 sm:p-8 md:p-10 shadow-sm">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Column 1 (lg: 3 cols): Real Exterior Facade */}
            <div className="lg:col-span-3">
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-[#E8DDCA] h-48 sm:h-56 lg:h-64 shadow-xs">
                <img
                  src="/images/real/real-swing-seats.jpg"
                  alt="Greenwood Café & Restaurant garden outdoor seating in Narela"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/gallery-1.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white text-[10px] sm:text-[11px] font-bold bg-black/70 px-2.5 py-1 rounded-md">
                  GREENWOOD CAFÉ &amp; RESTAURANT
                </div>
              </div>
            </div>

            {/* Column 2 (lg: 3 cols): Visit Us & Address */}
            <div className="lg:col-span-3 space-y-2.5">
              <span className="text-[11px] font-bold tracking-wider text-[#8F5D2C] uppercase">
                Location
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#17261D]">
                Visit Us
              </h3>
              <div className="flex items-start gap-2 pt-1 text-xs sm:text-sm text-[#4B5149] leading-relaxed">
                <span className="text-base text-[#163E26] shrink-0 mt-0.5">📍</span>
                <span>
                  Plot No. 2, Pocket-6, Sector-A10,<br />
                  Narela, Delhi – 110040
                </span>
              </div>
              <div className="pt-2">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#163E26] hover:bg-[#1E5233] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer hover:scale-102"
                >
                  <span>Get Directions</span>
                  <span>→</span>
                </a>
              </div>
            </div>

            {/* Column 3 (lg: 3 cols): Contact Info */}
            <div className="lg:col-span-3 space-y-2.5">
              <span className="text-[11px] font-bold tracking-wider text-[#8F5D2C] uppercase">
                Reach Out
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#17261D]">
                Contact
              </h3>
              <div className="space-y-2 text-xs sm:text-sm text-[#4B5149]">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#163E26] shrink-0">📞</span>
                  <a
                    href="tel:+919066906607"
                    className="font-bold text-[#17261D] hover:text-[#C9A45C] transition-colors"
                  >
                    +91 90669 06607
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#163E26] shrink-0">✉️</span>
                  <a
                    href="mailto:greenwoodcafeindia@gmail.com"
                    className="text-[#4B5149] hover:text-[#163E26] transition-colors text-xs truncate"
                  >
                    greenwoodcafeindia@gmail.com
                  </a>
                </div>
                <div className="flex items-start gap-2 pt-0.5 text-xs text-[#77766D]">
                  <span className="text-sm text-[#C9A45C] shrink-0">🕒</span>
                  <div>
                    <span className="font-semibold text-[#17261D]">Daily • 11:00 AM – 11:00 PM</span>
                    <span className="block text-[10px] text-[#A89885]">
                      (Dine-in, Takeaway &amp; Online Delivery)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 4 (lg: 3 cols): Styled Google Map Pin Preview Card */}
            <div className="lg:col-span-3">
              <span className="text-[11px] font-bold tracking-wider text-[#8F5D2C] uppercase block mb-1.5">
                Find Us on Map
              </span>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block rounded-xl overflow-hidden border border-[#E8DDCA] bg-[#FAF6EE] shadow-2xs hover:border-[#163E26] transition-all cursor-pointer h-36"
                aria-label="Open Greenwood Café on Google Maps"
              >
                {/* Styled Map Background */}
                <div className="absolute inset-0 bg-[#E8F0E9] flex flex-col items-center justify-center p-3 text-center">
                  <div className="w-10 h-10 rounded-full bg-[#163E26] text-white flex items-center justify-center shadow-md mb-1.5 group-hover:scale-110 transition-transform">
                    <span className="text-lg">📍</span>
                  </div>
                  <span className="font-serif font-bold text-xs text-[#163E26] block">
                    Greenwood Café &amp; Restaurant
                  </span>
                  <span className="text-[10px] text-[#77766D] block">
                    Sector A10, Narela, Delhi
                  </span>
                  <span className="mt-1 text-[9px] font-bold text-[#8F5D2C] bg-white/80 px-2 py-0.5 rounded-full border border-[#E8DDCA]">
                    Tap to Open in Google Maps ↗
                  </span>
                </div>
              </a>
            </div>

          </div>

          {/* Mobile Quick Action Buttons Bar (<md screens) */}
          <div className="md:hidden pt-6 mt-6 border-t border-[#E8DDCA]/70 grid grid-cols-3 gap-2">
            <a
              href="tel:+919066906607"
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-[#163E26] text-white rounded-xl text-xs font-semibold shadow-2xs"
            >
              <span>📞</span>
              <span>Call</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-[#25D366] text-white rounded-xl text-xs font-semibold shadow-2xs"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
              <span>WhatsApp</span>
            </a>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-[#FAF6EE] text-[#163E26] border border-[#163E26]/30 rounded-xl text-xs font-semibold shadow-2xs"
            >
              <span>📍</span>
              <span>Directions</span>
            </a>
          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* SECTION F — CLOSING CTA ("MAKE ROOM FOR GOOD MOMENTS")    */}
      {/* ========================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-center" aria-label="Closing Call to Action">
        <div className="bg-[#163E26] text-white rounded-3xl p-8 sm:p-12 md:p-14 shadow-xl border border-[#2B5E3C] relative overflow-hidden">
          
          {/* Subtle Decorative Ambient Golden Arc */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A45C]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C9A45C]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center gap-2">
              <LeafBranch flip={false} className="w-5 h-2.5 text-[#C9A45C]" />
              <span className="text-[11px] font-semibold text-[#E5DCB8] tracking-[0.25em] uppercase">
                EXPERIENCE GREENWOOD
              </span>
              <LeafBranch flip={true} className="w-5 h-2.5 text-[#C9A45C]" />
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Make Room for Good Moments
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-[#E5DCB8] leading-relaxed max-w-lg mx-auto">
              Visit Greenwood Café &amp; Restaurant in Narela and enjoy a delicious meal with family and friends.
            </p>

            <div className="pt-4 flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#C9A45C] hover:bg-[#B38C4F] text-[#17261D] font-bold text-xs sm:text-sm px-6 sm:px-7 py-3 rounded-full shadow-md transition-all cursor-pointer hover:scale-103"
              >
                <span>📍 Get Directions</span>
                <span>→</span>
              </a>

              <button
                type="button"
                onClick={onNavigateToMenu}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-6 sm:px-7 py-3 rounded-full border border-white/30 transition-all cursor-pointer hover:scale-103"
              >
                <span>Explore Menu</span>
                <span>→</span>
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
