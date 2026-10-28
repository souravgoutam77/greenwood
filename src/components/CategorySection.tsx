import React from 'react';
import { LeafBranch, CategoryIcon } from './Icons';
import { RESTAURANT_DATA } from '../data/restaurantData';

interface CategorySectionProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  onExploreMenuClick: () => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  selectedCategory,
  onSelectCategory,
  onExploreMenuClick,
}) => {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 sm:py-2 md:py-2.5" aria-label="Food Categories">
      
      {/* Section Header */}
      <div className="flex items-center justify-between mb-1.5 sm:mb-2 md:mb-2.5">
        <div className="flex-1 text-center pl-6 sm:pl-0">
          <div className="inline-flex items-center justify-center gap-1.5 sm:gap-3">
            <LeafBranch flip={false} className="w-5 h-2.5 sm:w-8 sm:h-4 text-[#2E5A3A]" />
            <h2 className="font-serif text-lg sm:text-3xl md:text-4xl font-bold text-[#17261D] tracking-tight">
              Categories
            </h2>
            <LeafBranch flip={true} className="w-5 h-2.5 sm:w-8 sm:h-4 text-[#2E5A3A]" />
          </div>
        </div>

        {/* Right side Explore Our Menu */}
        <button
          type="button"
          onClick={onExploreMenuClick}
          className="inline-flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm font-semibold text-[#163E26] hover:text-[#23633D] transition-colors focus:outline-none cursor-pointer shrink-0"
        >
          <span className="hidden sm:inline">Explore Our Menu</span>
          <span className="sm:hidden">Explore</span>
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Horizontal Category Items */}
      <div className="flex items-center justify-start lg:justify-between gap-3 sm:gap-4 md:gap-5 overflow-x-auto pb-3 pt-1 no-scrollbar snap-x">
        {RESTAURANT_DATA.categories.map((category) => {
          const isSelected = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.id)}
              className="flex flex-col items-center gap-2 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#163E26] rounded-xl p-1 transition-transform cursor-pointer snap-start"
              aria-pressed={isSelected}
            >
              {/* Circular Icon Container */}
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full flex items-center justify-center transition-all duration-300 shadow-xs ${
                  isSelected
                    ? 'bg-[#163E26] text-[#FAF6EE] scale-105 shadow-md ring-2 ring-[#C9A45C]'
                    : 'bg-[#FFFDF8] border border-[#E8DDCA] hover:border-[#C9A45C] hover:bg-[#FAF6EE]'
                }`}
              >
                <CategoryIcon type={category.icon} active={isSelected} />
              </div>

              {/* Category Label */}
              <span
                className={`text-xs sm:text-[13px] font-medium tracking-tight whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'text-[#163E26] font-bold'
                    : 'text-[#4B5149] group-hover:text-[#17261D]'
                }`}
              >
                {category.name}
              </span>
            </button>
          );
        })}
      </div>

    </section>
  );
};
