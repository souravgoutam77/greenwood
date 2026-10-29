import React, { useState } from 'react';
import { LeafBranch } from './Icons';

interface GalleryItem {
  id: string;
  title: string;
  category: 'Gazebo Pods' | 'Dishes' | 'Mocktails' | 'Celebrations';
  image: string;
  description: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Private Gazebo Dining Pods',
    category: 'Gazebo Pods',
    image: '/images/real/real-gazebo-pods.jpg',
    description: 'Bespoke insulated gazebo pod nestled in lush botanical greenery for candlelit dining.',
  },
  {
    id: 'g-2',
    title: 'Lush Botanical Indoor Ambiance',
    category: 'Gazebo Pods',
    image: '/images/real/real-botanical-wall.jpg',
    description: 'Natural greenery, warm Edison lighting, and handcrafted wooden tables in Narela.',
  },
  {
    id: 'g-3',
    title: 'Rich Shahi Paneer Butter Masala',
    category: 'Dishes',
    image: '/images/menu/dish-paneer-butter-masala.jpg',
    description: 'Velvety cottage cheese cubes simmered in a luscious tomato butter gravy.',
  },
  {
    id: 'g-4',
    title: 'Tandoori Tikka Platter',
    category: 'Dishes',
    image: '/images/menu/dish-tandoori-tikka.jpg',
    description: 'Charcoal roasted paneer, bell peppers, and broccoli infused with spiced hung curd.',
  },
  {
    id: 'g-5',
    title: 'Hand-Stretched Farmhouse Pizza',
    category: 'Dishes',
    image: '/images/menu/dish-farmhouse-pizza.jpg',
    description: 'Thin crust loaded with black olives, golden corn, crisp bell peppers, and mozzarella.',
  },
  {
    id: 'g-6',
    title: 'Fluted Velvet Lounge & Mocktails',
    category: 'Mocktails',
    image: '/images/real/real-yellow-lounge.jpg',
    description: 'Thick, creamy Alphonso mango puree whipped with rich curd and cardamom.',
  },
  {
    id: 'g-7',
    title: 'Steamed Himalayan Veg Momos',
    category: 'Dishes',
    image: '/images/menu/dish-veg-momos.jpg',
    description: 'Translucent dumplings filled with finely chopped organic veggies and spicy red chutney.',
  },
  {
    id: 'g-8',
    title: 'Natural Wooden Swing Table Setup',
    category: 'Celebrations',
    image: '/images/real/real-swing-seats.jpg',
    description: 'Custom anniversary and birthday decor in private gazebo pods with celebration platters.',
  },
  {
    id: 'g-9',
    title: 'Dal Makhani Simmered Overnight',
    category: 'Dishes',
    image: '/images/dish-detail/rec-dal-makhani.jpg',
    description: 'Slow-simmered black lentils infused with white butter and fresh milk cream.',
  },
  {
    id: 'g-10',
    title: 'Warm Gulab Jamun with Saffron',
    category: 'Dishes',
    image: '/images/offers/dessert_bowl.jpg',
    description: 'Khoya dumplings steeped in aromatic green cardamom and saffron syrup.',
  },
];

interface GalleryPageProps {
  onNavigateToMenu: () => void;
  onNavigateToContact: () => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  onNavigateToMenu,
  onNavigateToContact,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['All', 'Gazebo Pods', 'Dishes', 'Mocktails', 'Celebrations'];

  const filteredItems = selectedCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  const activeLightboxItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  const handleNextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const handlePrevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <div className="w-full bg-[#FAF6EE] min-h-screen text-[#4B5149] pb-24 md:pb-16 font-sans">
      
      {/* ========================================================= */}
      {/* 1. HEADER SECTION                                         */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden pt-8 pb-10 bg-gradient-to-b from-[#FAF6EE] to-[#FFFDF8] border-b border-[#E8DDCA] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center justify-center gap-2 text-[#163E26] mb-2">
            <LeafBranch flip={false} className="w-5 h-2.5" />
            <span className="font-serif text-xs sm:text-sm tracking-widest uppercase font-semibold text-[#163E26]">
              Visual Moments
            </span>
            <LeafBranch flip={true} className="w-5 h-2.5" />
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#17261D] tracking-tight mb-3">
            Greenwood Photo Gallery
          </h1>
          <p className="text-xs sm:text-sm text-[#77766D] max-w-xl mx-auto font-sans leading-relaxed">
            Take a visual tour through our private gazebo dining pods, pure vegetarian culinary creations, artisan coolers, and joyful family celebrations in Narela, Delhi.
          </p>

          {/* Interactive Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 pt-6 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setLightboxIndex(null);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#163E26] text-white shadow-sm'
                    : 'bg-[#FFFDF8] hover:bg-[#FAF6EE] text-[#4B5149] border border-[#E8DDCA]'
                }`}
              >
                {cat === 'All' ? '📸 All Photos' : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. PHOTO GRID                                             */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(index)}
              className="group bg-[#FFFDF8] rounded-2xl border border-[#E8DDCA] overflow-hidden shadow-xs hover:shadow-md hover:border-[#C9A45C] transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden bg-[#E8DDCA]/40">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/dish-detail/rec-shahi-paneer.jpg';
                  }}
                />
                <span className="absolute top-3 left-3 bg-[#17261D]/80 backdrop-blur-xs text-[#E5DCB8] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {item.category}
                </span>
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-semibold">
                  <span>🔍 View Fullscreen</span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#17261D] group-hover:text-[#163E26] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#77766D] mt-1 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#E8DDCA]/60 flex items-center justify-between text-[11px] text-[#8F5D2C] font-semibold">
                  <span>Tap to expand</span>
                  <span>↗</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. LIGHTBOX MODAL                                         */}
      {/* ========================================================= */}
      {activeLightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#17261D] rounded-2xl overflow-hidden border border-[#C9A45C]/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              aria-label="Close lightbox"
            >
              ✕
            </button>

            {/* Left Prev Button */}
            <button
              type="button"
              onClick={handlePrevLightbox}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center text-lg cursor-pointer"
              aria-label="Previous photo"
            >
              ‹
            </button>

            {/* Right Next Button */}
            <button
              type="button"
              onClick={handleNextLightbox}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center text-lg cursor-pointer"
              aria-label="Next photo"
            >
              ›
            </button>

            <div className="w-full max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activeLightboxItem.image}
                alt={activeLightboxItem.title}
                className="max-w-full max-h-[70vh] object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/dish-detail/rec-shahi-paneer.jpg';
                }}
              />
            </div>

            <div className="p-4 sm:p-5 bg-[#17261D] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-[#C9A45C] font-semibold uppercase tracking-wider block">
                  {activeLightboxItem.category} • Greenwood Gallery
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white mt-0.5">
                  {activeLightboxItem.title}
                </h3>
                <p className="text-xs text-[#E5DCB8] mt-1 max-w-xl">
                  {activeLightboxItem.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setLightboxIndex(null);
                    onNavigateToMenu();
                  }}
                  className="bg-[#163E26] hover:bg-[#1E5233] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Order Food
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLightboxIndex(null);
                    onNavigateToContact();
                  }}
                  className="bg-[#C9A45C] hover:bg-[#B38C4F] text-[#17261D] px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Book Gazebo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. FOOTER VISIT CTA                                       */}
      {/* ========================================================= */}
      <section className="max-w-3xl mx-auto px-4 text-center pt-4">
        <p className="text-xs text-[#77766D]">
          Follow our daily stories on Instagram{' '}
          <a
            href="https://www.instagram.com/greenwoodcafeindia/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#163E26] font-bold underline hover:text-[#8F5D2C]"
          >
            @greenwoodcafeindia
          </a>
        </p>
      </section>

    </div>
  );
};
