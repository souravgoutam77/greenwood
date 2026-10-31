import React, { useState, useRef, useEffect } from 'react';
import { RESTAURANT_DATA } from '../data/restaurantData';
import type { Dish } from '../data/restaurantData';
import { SEARCHABLE_MENU } from '../data/searchableMenu';
import type { SearchableMenuItem } from '../data/searchableMenu';
import { VegBadge, WhatsAppIcon } from './Icons';
import { isAdminLoggedIn, getCustomerAuth, clearCustomerAuth, type CustomerAuth } from '../services/auth';
import { getFavorites } from '../services/favorites';
import { getDishImage } from '../data/menuPageData';

interface HeaderProps {
  onNavClick: (href: string) => void;
  onAddToCart?: (dish: Dish) => void;
  onCartClick?: () => void;
  cartCount?: number;
  activeNav?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onNavClick,
  onAddToCart,
  onCartClick: _onCartClick,
  cartCount: _cartCount = 0,
  activeNav,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [userAuth, setUserAuth] = useState<CustomerAuth | null>(() => getCustomerAuth());
  const [isAdmin, setIsAdmin] = useState<boolean>(() => isAdminLoggedIn());
  const [favCount, setFavCount] = useState<number>(() => getFavorites().length);

  useEffect(() => {
    const handleAuthChange = () => {
      setUserAuth(getCustomerAuth());
      setIsAdmin(isAdminLoggedIn());
    };
    const handleFavChange = () => {
      setFavCount(getFavorites().length);
    };
    window.addEventListener('gw_auth_changed', handleAuthChange);
    window.addEventListener('gw_favorites_changed', handleFavChange);
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('storage', handleFavChange);
    return () => {
      window.removeEventListener('gw_auth_changed', handleAuthChange);
      window.removeEventListener('gw_favorites_changed', handleFavChange);
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('storage', handleFavChange);
    };
  }, []);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const handleLinkClick = (href: string) => {
    onNavClick(href);
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter menu items based on search query
  const query = searchQuery.trim().toLowerCase();
  const searchResults = query.length > 0
    ? SEARCHABLE_MENU.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.subcategory.toLowerCase().includes(query)
      ).slice(0, 6)
    : [];

  const handleAddItem = (item: SearchableMenuItem) => {
    if (onAddToCart) {
      onAddToCart({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        rating: 4.8,
        reviewsCount: 36,
        isVeg: true,
        image: item.name.toLowerCase().includes('pizza')
          ? '/images/farmhouse-pizza.jpg'
          : item.name.toLowerCase().includes('tikka')
            ? '/images/tandoori-tikka.jpg'
            : '/images/paneer-butter-masala.jpg',
      });
      setAddedToast(item.name);
      setTimeout(() => setAddedToast(null), 2200);
    }
  };

  return (
    <header className="relative w-full bg-[#24140D] text-[#FAF6EE] shadow-md z-40 border-b border-[#C9A45C]/35">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-15 md:h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand Identity with Shine Animation (20% Larger) */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('#home');
          }}
          className="flex items-center shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A45C] rounded-lg p-0.5 transition-transform"
          aria-label="Greenwood Café Home"
        >
          <div className="shine-logo-wrapper">
            <img
              src="/logo-official-trimmed.png"
              alt="Greenwood Café"
              className="shine-logo-img h-[40px] sm:h-[46px] md:h-[50px] w-auto object-contain"
            />
            <div className="logo-mask-shine" aria-hidden="true" />
          </div>
        </a>

        {/* Center: Desktop Food Search Bar (Slim & Compact) */}
        <div className="relative max-w-[190px] md:max-w-[220px] lg:max-w-[250px] w-full mx-2 hidden sm:block" ref={searchContainerRef}>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-[#C9A45C] pointer-events-none">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2.2" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search dishes..."
              className="w-full bg-[#180B05]/85 hover:bg-[#120703] focus:bg-[#120703] text-[11px] lg:text-xs text-[#FAF6EE] placeholder-[#C5B39C] pl-8 pr-7 py-1 h-7.5 rounded-full border border-[#C9A45C]/40 focus:border-[#C9A45C] focus:outline-none transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchFocused(false);
                }}
                className="absolute right-3 text-[#C5B39C] hover:text-white transition-colors"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Desktop Search Dropdown */}
          {isSearchFocused && query.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1C1009] border border-[#C9A45C]/40 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2.5 bg-[#140B06] border-b border-[#2C190F] flex items-center justify-between text-[11px] text-[#C9A45C]">
                <span className="font-semibold uppercase tracking-wider">
                  Menu Results ({searchResults.length})
                </span>
                <span className="text-[#9E8E7C]">from 198 items</span>
              </div>

              {searchResults.length > 0 ? (
                <div className="max-h-80 overflow-y-auto divide-y divide-[#2C190F]/60">
                  {searchResults.map((item) => {
                    const dishImg = getDishImage(item.name, item.category);
                    return (
                      <div
                        key={item.id}
                        className="p-3 hover:bg-[#2B180F] transition-colors flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={dishImg}
                            alt={item.name}
                            className="w-11 h-11 rounded-lg object-cover shrink-0 border border-[#3D2517] bg-[#120703]"
                            loading="lazy"
                          />
                          <div className="mt-0.5 shrink-0 scale-90">
                            <VegBadge />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-semibold text-[#FAF6EE] group-hover:text-[#E8D094] transition-colors truncate">
                              {item.name}
                            </h4>
                            <span className="text-[10px] text-[#9E8E7C] block truncate">
                              {item.category} • {item.subcategory || 'Specialty'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="font-sans font-bold text-xs sm:text-sm text-[#E8D094]">
                            ₹{item.price}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAddItem(item)}
                            className="bg-[#163E26] hover:bg-[#1E5233] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#235C38] transition-all hover:scale-105 active:scale-95"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-[#C5B39C]">
                  No dishes found matching "<span className="text-white">{searchQuery}</span>". Try searching for Paneer Tikka, Farmhouse Pizza, Momos, or Dal Makhani.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center/Right: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7" aria-label="Main Navigation">
          {RESTAURANT_DATA.navLinks.map((link) => {
            const isLinkActive = activeNav ? link.href === activeNav : link.isActive;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className={`relative py-1 text-sm lg:text-[15px] font-medium tracking-wide transition-colors ${
                  isLinkActive
                    ? 'text-[#FFFFFF] font-semibold'
                    : 'text-[#E5DCB8] hover:text-[#FFFFFF]'
                }`}
              >
                {link.label}
                {isLinkActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#C9A45C] rounded-full shadow-xs" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Far Right: Food Search, Cart Icon & Hamburger */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile Search Button */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="p-2 text-[#FAF6EE] hover:text-[#C9A45C] focus:outline-none focus:ring-2 focus:ring-[#C9A45C] rounded-md transition-colors sm:hidden"
            aria-label="Toggle food search"
          >
            <svg className="w-5 h-5 text-[#C9A45C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeWidth="2.2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>

          {/* Desktop Staff Admin Shortcut Button for Authorized Admins */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => handleLinkClick('#admin')}
              className="hidden md:inline-flex items-center gap-1.5 bg-[#C9A45C]/20 hover:bg-[#C9A45C]/30 text-[#E5DCB8] hover:text-white px-2.5 py-1 rounded-full border border-[#C9A45C]/60 text-xs font-semibold transition-all cursor-pointer shadow-2xs ml-1"
              title="Kitchen POS & Staff Admin Portal"
            >
              <span className="text-xs">🔑</span>
              <span>Staff Admin</span>
            </button>
          )}

          {/* User Profile / My Account Pill & Quick Logout (Desktop) */}
          <div className="hidden md:flex items-center gap-1.5 ml-1">
            <button
              type="button"
              onClick={() => handleLinkClick('#profile')}
              className="flex items-center gap-1.5 bg-[#FAF6EE]/10 hover:bg-[#FAF6EE]/20 px-2.5 py-1 rounded-full border border-[#C9A45C]/40 text-xs text-[#FAF6EE] transition-colors cursor-pointer"
              title="My Account & Profile"
            >
              <div className="w-5 h-5 rounded-full bg-[#C9A45C] text-[#2B180F] font-bold text-[10px] flex items-center justify-center uppercase">
                {userAuth?.name?.charAt(0) || 'G'}
              </div>
              <span className="font-medium text-xs text-[#FAF6EE] max-w-[90px] truncate">
                {userAuth?.name ? userAuth.name.split(' ')[0] : 'Profile'}
              </span>
            </button>

            {userAuth && userAuth.verified && (
              <button
                type="button"
                onClick={() => {
                  clearCustomerAuth();
                  setUserAuth(null);
                  setAddedToast('Logged out successfully');
                  setTimeout(() => setAddedToast(null), 2500);
                }}
                className="text-[11px] text-[#FF8A80] hover:text-white bg-[#2B180F]/80 hover:bg-[#C83A25] border border-[#FF8A80]/40 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                title="Log Out of your Greenwood account"
              >
                Log Out
              </button>
            )}
          </div>

          {/* Hamburger Icon (Visible on mobile only, hidden on desktop md: and above) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="block md:hidden p-2 text-[#FAF6EE] hover:text-[#C9A45C] focus:outline-none focus:ring-2 focus:ring-[#C9A45C] rounded-md transition-colors"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-6 h-6 md:w-7 md:h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Food Search Bar (Expands below header) */}
      {mobileSearchOpen && (
        <div className="sm:hidden px-4 pb-3 pt-1 border-t border-[#3D2517]/80 bg-[#1A0E08]" ref={mobileSearchRef}>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-[#C9A45C] pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2.2" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pure veg dishes (e.g. Paneer Tikka, Pizza)..."
              autoFocus
              className="w-full bg-[#120703] text-xs text-[#FAF6EE] placeholder-[#C5B39C] pl-9 pr-8 py-2.5 rounded-full border border-[#C9A45C]/50 focus:border-[#C9A45C] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-[#C5B39C] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Mobile Search Results List */}
          {query.length > 0 && (
            <div className="mt-2 bg-[#1C1009] border border-[#C9A45C]/35 rounded-xl overflow-hidden shadow-2xl max-h-72 overflow-y-auto divide-y divide-[#2C190F]/70">
              {searchResults.length > 0 ? (
                searchResults.map((item) => {
                  const dishImg = getDishImage(item.name, item.category);
                  return (
                    <div key={item.id} className="p-2.5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={dishImg}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-[#3D2517] bg-[#120703]"
                          loading="lazy"
                        />
                        <div className="scale-75 shrink-0 -ml-1">
                          <VegBadge />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-[#FAF6EE] block truncate">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-[#9E8E7C] block truncate">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-sans font-bold text-xs text-[#E8D094]">
                          ₹{item.price}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddItem(item)}
                          className="bg-[#163E26] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full border border-[#235C38]"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-3 text-center text-xs text-[#C5B39C]">
                  No dishes found.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Added / Action Toast Notification */}
      {addedToast && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-[#163E26] text-[#FAF6EE] text-xs font-semibold px-4 py-2 rounded-full shadow-2xl border border-[#C9A45C] flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="text-[#C9A45C]">✓</span>
          <span>{addedToast.includes('Logged') ? addedToast : <>Added <strong>{addedToast}</strong> to cart!</>}</span>
        </div>
      )}

      {/* Mobile Slide-Down Menu (3 lines hamburger) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1E110A] border-t border-[#3D2517] px-4 pt-3 pb-6 space-y-2.5 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="py-2 px-3 border-b border-[#3D2517]/60 mb-1 flex items-center justify-between">
            <span className="text-xs text-[#C9A45C] font-serif italic">
              {RESTAURANT_DATA.brand.tagline}
            </span>
            <span className="text-[10px] bg-[#163E26] text-[#DCE8CB] px-2 py-0.5 rounded-full font-semibold">
              Pure Veg 🌿
            </span>
          </div>

          {/* Navigation Links */}
          {RESTAURANT_DATA.navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.href);
              }}
              className={`block px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                link.isActive
                  ? 'bg-[#163E26] text-[#FAF6EE] font-semibold border-l-4 border-[#C9A45C]'
                  : 'text-[#E5DCB8] hover:bg-[#2B180F] hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}

          {/* My Favourites (3-lines menu) */}
          <a
            href="#favourites"
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              handleLinkClick('#favourites');
            }}
            className="flex items-center justify-between px-3 py-2.5 rounded-md text-base font-medium text-[#E5DCB8] hover:bg-[#2B180F] hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="text-red-400">❤️</span>
              <span>My Favourites</span>
            </span>
            <span className="text-xs bg-[#C9A45C] text-[#1E110A] font-bold px-2.5 py-0.5 rounded-full">
              {favCount}
            </span>
          </a>

          {/* User Account & Log Out / Sign In option in Mobile Menu */}
          {userAuth && userAuth.verified ? (
            <div className="pt-2 border-t border-[#3D2517]/60 flex items-center justify-between px-3 py-2 bg-[#2B180F]/70 rounded-xl border border-[#C9A45C]/25">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#C9A45C] text-[#2B180F] font-bold text-xs flex items-center justify-center uppercase shrink-0">
                  {userAuth.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-[#FAF6EE] font-semibold truncate">{userAuth.name}</div>
                  <div className="text-[10px] text-[#C9A45C]">
                    +91 {userAuth.phone ? `${userAuth.phone.slice(0, 5)} XXXXX` : ''}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  clearCustomerAuth();
                  setUserAuth(null);
                  setMobileMenuOpen(false);
                  setAddedToast('Logged out successfully');
                  setTimeout(() => setAddedToast(null), 2500);
                }}
                className="text-xs text-[#FF8A80] hover:text-white font-medium flex items-center gap-1 bg-[#1A0E08] hover:bg-[#C83A25] border border-[#FF8A80]/40 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                title="Log Out of your Greenwood account"
              >
                <span>Log Out</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-[#3D2517]/60">
              <a
                href="#profile"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  handleLinkClick('#profile');
                }}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#FAF6EE] bg-[#163E26]/80 hover:bg-[#163E26] border border-[#C9A45C]/30 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span>👤</span>
                  <span>Sign In to Account / Profile</span>
                </span>
                <span className="text-xs text-[#C9A45C]">→</span>
              </a>
            </div>
          )}

          {/* WhatsApp Direct Option in 3-line menu */}
          <div className="pt-2 border-t border-[#3D2517]/60">
            <a
              href={RESTAURANT_DATA.contact.whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-xs shadow-md transition-all active:scale-98"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span>Order / Chat on WhatsApp</span>
            </a>
          </div>

          {/* Staff Kitchen POS Portal Link: Strictly restricted to logged-in administrators */}
          {isAdminLoggedIn() && (
            <div>
              <a
                href="#admin"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('#admin');
                }}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-[#E8D094] hover:bg-[#2B180F] border border-[#C9A45C]/35 bg-[#2B180F]/60 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span>🍳</span>
                  <span>Kitchen POS & Admin Portal</span>
                </span>
                <span className="text-xs">→</span>
              </a>
            </div>
          )}

          <div className="pt-2 text-xs text-[#9B8C7E] px-3">
            Open daily: 11:00 AM – 11:00 PM • Narela, Delhi
          </div>
        </div>
      )}
    </header>
  );
};
