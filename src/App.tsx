import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DeliverySelector } from './components/DeliverySelector';
import { HeroBanner } from './components/HeroBanner';
import { SignatureDishes } from './components/SignatureDishes';
import { RestaurantGallery } from './components/RestaurantGallery';
import { SocialSection } from './components/SocialSection';
import { Footer } from './components/Footer';
import { MobileBottomNavigation } from './components/MobileBottomNavigation';
import { CartDrawer } from './components/CartDrawer';
import type { CartItem } from './components/CartDrawer';
import { ItemDetailPage } from './components/ItemDetailPage';
import { MenuPage } from './components/MenuPage';
import { CartPage } from './components/CartPage';
import { OrdersPage } from './components/OrdersPage';
import { ProfilePage } from './components/ProfilePage';
import { AdminDashboard } from './components/AdminDashboard';
import { ContactModal } from './components/ContactModal';
import { LegalPolicyModal } from './components/LegalPolicyModal';
import type { PolicyTab } from './components/LegalPolicyModal';
import { RESTAURANT_DATA } from './data/restaurantData';
import type { Dish } from './data/restaurantData';

export const App: React.FC = () => {
  // View routing (Default to home or hash-based view)
  const [currentView, setCurrentView] = useState<'item-detail' | 'home' | 'menu' | 'cart' | 'orders' | 'profile' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#menu') {
        return 'menu';
      }
      if (window.location.hash === '#cart') {
        return 'cart';
      }
      if (window.location.hash === '#orders') {
        return 'orders';
      }
      if (window.location.hash === '#profile') {
        return 'profile';
      }
      if (window.location.hash === '#admin') {
        return 'admin';
      }
      if (
        window.location.hash === '#dish' ||
        window.location.hash === '#butter-paneer' ||
        window.location.hash === '#detail'
      ) {
        return 'item-detail';
      }
    }
    return 'home';
  });

  // Application State
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway'>('delivery');
  const [selectedHub, setSelectedHub] = useState<string>(RESTAURANT_DATA.delivery.location);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [policyModal, setPolicyModal] = useState<{ isOpen: boolean; tab: PolicyTab }>({
    isOpen: false,
    tab: 'terms',
  });
  const [mobileTab, setMobileTab] = useState<'home' | 'menu' | 'cart' | 'orders' | 'profile'>('menu');
  const [infoModal, setInfoModal] = useState<{ title: string; message: string } | null>(null);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      if (!window.location.hash || window.location.hash === '#home' || window.location.hash === '#') {
        setCurrentView('home');
      } else if (window.location.hash === '#menu') {
        setCurrentView('menu');
      } else if (window.location.hash === '#cart') {
        setCurrentView('cart');
      } else if (window.location.hash === '#orders') {
        setCurrentView('orders');
      } else if (window.location.hash === '#profile') {
        setCurrentView('profile');
      } else if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else if (window.location.hash === '#contact') {
        setIsContactOpen(true);
      } else if (window.location.hash === '#terms') {
        setPolicyModal({ isOpen: true, tab: 'terms' });
      } else if (window.location.hash === '#refund') {
        setPolicyModal({ isOpen: true, tab: 'refund' });
      } else if (window.location.hash === '#privacy') {
        setPolicyModal({ isOpen: true, tab: 'privacy' });
      } else if (
        window.location.hash === '#dish' ||
        window.location.hash === '#butter-paneer' ||
        window.location.hash === '#detail'
      ) {
        setCurrentView('item-detail');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Cart operations
  const handleAddToCart = (dish: Dish) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { dish, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (dishId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.dish.id === dishId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Navigation handlers
  const handleNavClick = (href: string) => {
    if (href === '#home') {
      setCurrentView('home');
      window.location.hash = '#home';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href === '#menu') {
      setCurrentView('menu');
      window.location.hash = '#menu';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href === '#cart') {
      setCurrentView('cart');
      window.location.hash = '#cart';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href === '#orders') {
      setCurrentView('orders');
      setMobileTab('orders');
      window.location.hash = '#orders';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href === '#profile') {
      setCurrentView('profile');
      setMobileTab('profile');
      window.location.hash = '#profile';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href === '#admin') {
      setCurrentView('admin');
      window.location.hash = '#admin';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href === '#gallery') {
      if (currentView !== 'home') {
        setCurrentView('home');
        setTimeout(() => {
          document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (href === '#about') {
      setCurrentView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href === '#contact') {
      setIsContactOpen(true);
    } else if (href === '#terms') {
      setPolicyModal({ isOpen: true, tab: 'terms' });
    } else if (href === '#refund') {
      setPolicyModal({ isOpen: true, tab: 'refund' });
    } else if (href === '#privacy') {
      setPolicyModal({ isOpen: true, tab: 'privacy' });
    }
  };

  const handleSeeAllDishes = () => {
    setCurrentView('menu');
    window.location.hash = '#menu';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mobile Bottom Nav handlers
  const handleMobileTabClick = (tab: 'home' | 'menu' | 'cart' | 'orders' | 'profile') => {
    setMobileTab(tab);
    if (tab === 'home') {
      setCurrentView('home');
      window.location.hash = '#home';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'menu') {
      setCurrentView('menu');
      window.location.hash = '#menu';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'cart') {
      setCurrentView('cart');
      window.location.hash = '#cart';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'orders') {
      setCurrentView('orders');
      setMobileTab('orders');
      window.location.hash = '#orders';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'profile') {
      setCurrentView('profile');
      setMobileTab('profile');
      window.location.hash = '#profile';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#4B5149] flex flex-col relative selection:bg-[#163E26] selection:text-[#FAF6EE]">
      {/* Main Page Content Wrapper */}
      <main className="flex-1">
        
        {/* SECTION 1: HEADER (Hidden in dedicated Admin Kitchen POS Portal) */}
        {currentView !== 'admin' && (
          <div id="home">
            <Header
              onNavClick={handleNavClick}
              onAddToCart={handleAddToCart}
              onCartClick={() => {
                setCurrentView('cart');
                window.location.hash = '#cart';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              cartCount={totalCartItems}
              activeNav={
                currentView === 'home'
                  ? '#home'
                  : currentView === 'menu'
                  ? '#menu'
                  : currentView === 'cart'
                  ? '#cart'
                  : undefined
              }
            />
          </div>
        )}

        {currentView === 'item-detail' ? (
          <ItemDetailPage
            onBackToHome={() => {
              setCurrentView('home');
              window.location.hash = '#home';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToMenu={() => {
              setCurrentView('menu');
              window.location.hash = '#menu';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAddToCart={handleAddToCart}
          />
        ) : currentView === 'menu' ? (
          <MenuPage
            onDishClick={(_dish) => {
              setCurrentView('item-detail');
              window.location.hash = '#butter-paneer';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAddToCart={handleAddToCart}
            onSeeAllDishes={handleSeeAllDishes}
          />
        ) : currentView === 'cart' ? (
          <CartPage
            items={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onClearCart={handleClearCart}
            onNavigateToMenu={() => {
              setCurrentView('menu');
              window.location.hash = '#menu';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            orderType={orderType}
            setOrderType={setOrderType}
          />
        ) : currentView === 'orders' ? (
          <OrdersPage
            onNavigateToMenu={handleSeeAllDishes}
            onNavigateToCart={() => {
              setCurrentView('cart');
              window.location.hash = '#cart';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onReorder={(reorderItems) => {
              reorderItems.forEach((item) => {
                handleAddToCart({
                  id: item.id,
                  name: item.name,
                  description: '100% Pure Vegetarian classic from Greenwood Café',
                  price: item.price,
                  rating: 4.8,
                  reviewsCount: 42,
                  isVeg: true,
                  image: item.image,
                });
              });
            }}
          />
        ) : currentView === 'profile' ? (
          <ProfilePage
            onNavigateToOrders={() => {
              setCurrentView('orders');
              window.location.hash = '#orders';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToMenu={handleSeeAllDishes}
            onNavigateToCart={() => {
              setCurrentView('cart');
              window.location.hash = '#cart';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : currentView === 'admin' ? (
          <AdminDashboard
            onNavigateToCustomerSite={() => {
              setCurrentView('home');
              window.location.hash = '#home';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          <>
            {/* SECTION 2: DELIVERY & LOCATION STRIP */}
            <DeliverySelector
              selectedHub={selectedHub}
              setSelectedHub={setSelectedHub}
            />

            {/* SECTION 3: HERO BANNER */}
            <HeroBanner />

            {/* SECTION 4: SIGNATURE & TRENDING */}
            <div id="signature-section">
              <SignatureDishes
                onAddToCart={handleAddToCart}
                onSeeAllClick={handleSeeAllDishes}
                onDishClick={() => {
                  setCurrentView('item-detail');
                  window.location.hash = '#butter-paneer';
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>

            {/* SECTION 5: A GLIMPSE OF GREENWOOD (GALLERY) */}
            <RestaurantGallery />

            {/* SECTION 7: FOLLOW OUR JOURNEY (SOCIAL) */}
            <SocialSection />
          </>
        )}

      </main>

      {/* SECTION 8: COMPLETE FOOTER (Only shown on home page as per strict user instruction) */}
      {currentView === 'home' && (
        <Footer
          onNavClick={handleNavClick}
          onPolicyClick={(tab) => setPolicyModal({ isOpen: true, tab })}
        />
      )}

      {/* SECTION 9: MOBILE BOTTOM NAVIGATION (Permanently fixed at bottom on customer pages in mobile UI) */}
      {currentView !== 'admin' && (
        <MobileBottomNavigation
          cartCount={totalCartItems}
          activeTab={
            currentView === 'cart'
              ? 'cart'
              : currentView === 'orders'
              ? 'orders'
              : currentView === 'profile'
              ? 'profile'
              : currentView === 'menu' || currentView === 'item-detail'
              ? 'menu'
              : currentView === 'home'
              ? 'home'
              : mobileTab
          }
          setActiveTab={handleMobileTabClick}
          onCartClick={() => {
            setCurrentView('cart');
            window.location.hash = '#cart';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onHomeClick={() => {
            setCurrentView('home');
            window.location.hash = '#home';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onMenuClick={() => {
            setCurrentView('menu');
            window.location.hash = '#menu';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* CART DRAWER / MODAL */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        orderType={orderType}
        setOrderType={setOrderType}
      />

      {/* CONTACT MODAL (Opens anywhere when clicking 'Contact' in 3-line menu, header, or footer) */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* LEGAL & POLICIES MODAL (Terms & Conditions, Refund Policy, Privacy Policy) */}
      <LegalPolicyModal
        isOpen={policyModal.isOpen}
        onClose={() => setPolicyModal((prev) => ({ ...prev, isOpen: false }))}
        initialTab={policyModal.tab}
      />

      {/* Info Modal for Mobile Orders/Profile tabs */}
      {infoModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setInfoModal(null)}
        >
          <div
            className="w-full max-w-sm bg-[#FFFDF8] rounded-2xl p-5 border border-[#E8DDCA] shadow-2xl text-center space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-[#DCE8CB] text-[#163E26] mx-auto flex items-center justify-center text-xl">
              🌿
            </div>
            <h3 className="font-serif text-lg font-bold text-[#17261D]">
              {infoModal.title}
            </h3>
            <p className="text-xs text-[#77766D] leading-relaxed">
              {infoModal.message}
            </p>
            <button
              type="button"
              onClick={() => setInfoModal(null)}
              className="w-full bg-[#163E26] text-white py-2.5 rounded-full text-xs font-semibold hover:bg-[#1E5635] transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
