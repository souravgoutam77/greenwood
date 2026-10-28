import React from 'react';

interface MobileBottomNavigationProps {
  cartCount: number;
  activeTab: 'home' | 'menu' | 'cart' | 'orders' | 'profile';
  setActiveTab: (tab: 'home' | 'menu' | 'cart' | 'orders' | 'profile') => void;
  onCartClick: () => void;
  onHomeClick: () => void;
  onMenuClick: () => void;
}

export const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  cartCount,
  activeTab,
  setActiveTab,
  onCartClick,
  onHomeClick,
  onMenuClick,
}) => {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FFFDF8]/95 backdrop-blur-md border-t border-[#E8DDCA] px-3 py-1.5 shadow-2xl flex items-center justify-around"
      aria-label="Mobile Bottom Navigation"
    >
      {/* 1. Home */}
      <button
        type="button"
        onClick={() => {
          setActiveTab('home');
          onHomeClick();
        }}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
          activeTab === 'home'
            ? 'bg-[#163E26] text-white shadow-xs'
            : 'text-[#646B62] hover:text-[#163E26]'
        }`}
      >
        <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span className="text-[10px] font-medium tracking-tight">Home</span>
      </button>

      {/* 2. Menu (Cutlery fork & knife) */}
      <button
        type="button"
        onClick={() => {
          setActiveTab('menu');
          onMenuClick();
        }}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
          activeTab === 'menu'
            ? 'bg-[#163E26] text-white shadow-xs'
            : 'text-[#646B62] hover:text-[#163E26]'
        }`}
      >
        <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path d="M18 2v8a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V2M15 12v10M7 2v20M4 2v6a3 3 0 0 0 6 0V2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[10px] font-medium tracking-tight">Menu</span>
      </button>

      {/* 3. Cart with dynamic badge */}
      <button
        type="button"
        onClick={() => {
          setActiveTab('cart');
          onCartClick();
        }}
        className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
          activeTab === 'cart'
            ? 'bg-[#163E26] text-white shadow-xs'
            : 'text-[#646B62] hover:text-[#163E26]'
        }`}
      >
        <div className="relative">
          <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="absolute -top-1.5 -right-2 bg-[#C83A25] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-1 ring-white">
            {cartCount > 0 ? cartCount : 3}
          </span>
        </div>
        <span className="text-[10px] font-medium tracking-tight">Cart</span>
      </button>

      {/* 4. Orders (Actively highlighted in reference) */}
      <button
        type="button"
        onClick={() => setActiveTab('orders')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          activeTab === 'orders'
            ? 'bg-[#163E26] text-white shadow-xs'
            : 'text-[#646B62] hover:text-[#163E26]'
        }`}
      >
        <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[10px] font-medium tracking-tight">Orders</span>
      </button>

      {/* 5. Profile */}
      <button
        type="button"
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
          activeTab === 'profile'
            ? 'bg-[#163E26] text-white shadow-xs'
            : 'text-[#646B62] hover:text-[#163E26]'
        }`}
      >
        <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[10px] font-medium tracking-tight">Profile</span>
      </button>
    </nav>
  );
};
