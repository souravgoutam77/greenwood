import { LogoLoader } from './components/LogoLoader';
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
import { MenuPage } from './components/MenuPage';
import { CartPage } from './components/CartPage';
import { ContactModal } from './components/ContactModal';
import type { PolicyTab } from './components/LegalPolicyModal';
import { api, computeEffectiveStoreStatus } from './services/api';

// High-Performance Dynamic Code Splitting for Non-Critical & Admin Views
const ItemDetailPage = React.lazy(() => import('./components/ItemDetailPage').then(m => ({ default: m.ItemDetailPage })));
const OrdersPage = React.lazy(() => import('./components/OrdersPage').then(m => ({ default: m.OrdersPage })));
const ProfilePage = React.lazy(() => import('./components/ProfilePage').then(m => ({ default: m.ProfilePage })));
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AboutPage = React.lazy(() => import('./components/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = React.lazy(() => import('./components/ContactPage').then(m => ({ default: m.ContactPage })));
const FavouritesPage = React.lazy(() => import('./components/FavouritesPage').then(m => ({ default: m.FavouritesPage })));
const LegalPolicyModal = React.lazy(() => import('./components/LegalPolicyModal').then(m => ({ default: m.LegalPolicyModal })));
import { RESTAURANT_DATA } from './data/restaurantData';
import type { Dish } from './data/restaurantData';
import { firestore } from './services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export const App: React.FC = () => {
  // View routing (Default to home or hash-based view)
  const [currentView, setCurrentView] = useState<'item-detail' | 'home' | 'menu' | 'cart' | 'orders' | 'profile' | 'admin' | 'about' | 'contact' | 'favourites'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#favourites' || window.location.hash === '#favorites') {
        return 'favourites';
      }
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
      if (window.location.hash.startsWith('#admin') || window.location.hash === '#pending-orders') {
        return 'admin';
      }
      if (window.location.hash === '#about') {
        return 'about';
      }
      if (window.location.hash === '#gallery') {
        setTimeout(() => {
          const el = document.getElementById('gallery');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
        return 'home';
      }
      if (window.location.hash === '#contact') {
        return 'contact';
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
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('greenwood_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('greenwood_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [policyModal, setPolicyModal] = useState<{ isOpen: boolean; tab: PolicyTab }>({
    isOpen: false,
    tab: 'terms',
  });
  const [mobileTab, setMobileTab] = useState<'home' | 'menu' | 'cart' | 'orders' | 'profile'>('menu');
  const [infoModal, setInfoModal] = useState<{ title: string; message: string } | null>(null);
  const [isKitchenOpen, setIsKitchenOpen] = useState<boolean>(() => computeEffectiveStoreStatus());

  // Sync kitchen status & operational schedule in real time
  useEffect(() => {
    let isMounted = true;
    api.getSettings().then((s) => {
      if (s && isMounted) {
        setIsKitchenOpen(computeEffectiveStoreStatus(s));
      }
    }).catch(() => {});

    // Live Firestore onSnapshot subscription for settings/config
    let unsubscribeSettings: (() => void) | null = null;
    if (firestore) {
      try {
        unsubscribeSettings = onSnapshot(doc(firestore, 'settings', 'config'), (snap) => {
          if (snap.exists() && isMounted) {
            setIsKitchenOpen(computeEffectiveStoreStatus(snap.data() as any));
          }
        }, (err) => console.warn('Live settings sync notice in App:', err));
      } catch {}
    }

    const handleSettingsUpdate = (e: any) => {
      const s = e.detail;
      if (s && isMounted) {
        setIsKitchenOpen(computeEffectiveStoreStatus(s));
      }
    };
    window.addEventListener('gw_settings_updated', handleSettingsUpdate);
    window.addEventListener('storage', handleSettingsUpdate);

    return () => {
      isMounted = false;
      unsubscribeSettings?.();
      window.removeEventListener('gw_settings_updated', handleSettingsUpdate);
      window.removeEventListener('storage', handleSettingsUpdate);
    };
  }, []);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      if (!window.location.hash || window.location.hash === '#home' || window.location.hash === '#') {
        setCurrentView('home');
      } else if (window.location.hash === '#favourites' || window.location.hash === '#favorites') {
        setCurrentView('favourites');
      } else if (window.location.hash === '#menu') {
        setCurrentView('menu');
      } else if (window.location.hash === '#cart') {
        setCurrentView('cart');
      } else if (window.location.hash === '#orders') {
        setCurrentView('orders');
      } else if (window.location.hash === '#profile') {
        setCurrentView('profile');
      } else if (window.location.hash.startsWith('#admin') || window.location.hash === '#pending-orders') {
        setCurrentView('admin');
      } else if (window.location.hash === '#about') {
        setCurrentView('about');
      } else if (window.location.hash === '#gallery') {
        setCurrentView('home');
        setTimeout(() => {
          const el = document.getElementById('gallery');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else if (window.location.hash === '#contact') {
        setCurrentView('contact');
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
    } else if (href === '#favourites' || href === '#favorites') {
      setCurrentView('favourites');
      window.location.hash = '#favourites';
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
    } else if (href.startsWith('#admin') || href === '#pending-orders') {
      setCurrentView('admin');
      window.location.hash = href;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href === '#gallery') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById('gallery');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (href === '#about') {
      setCurrentView('about');
      window.location.hash = '#about';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href === '#contact') {
      setCurrentView('contact');
      window.location.hash = '#contact';
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
                  : currentView === 'about'
                  ? '#about'
                  : currentView === 'contact'
                  ? '#contact'
                  : undefined
              }
            />
          </div>
        )}

        {/* Real-time Store Closed Announcement Banner */}
        {!isKitchenOpen && currentView !== 'admin' && (
          <div className="bg-[#B91C1C] text-white px-3 py-2 text-center text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-inner z-40">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />
            <span>⚠️ <strong>Kitchen Closed for Online Orders:</strong> Greenwood Café is currently closed (Hours: 11:00 AM – 11:00 PM). Browsing menu only.</span>
          </div>
        )}

        <React.Suspense fallback={<LogoLoader />}>
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
        ) : currentView === 'about' ? (
          <AboutPage
            onNavigateToMenu={handleSeeAllDishes}
            onNavigateToContact={() => {
              setCurrentView('contact');
              window.location.hash = '#contact';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : currentView === 'contact' ? (
          <ContactPage
            onNavigateToMenu={handleSeeAllDishes}
          />
        ) : currentView === 'favourites' ? (
          <FavouritesPage
            onAddToCart={handleAddToCart}
            onNavigateToMenu={handleSeeAllDishes}
            onDishClick={(_dish) => {
              setCurrentView('item-detail');
              window.location.hash = '#butter-paneer';
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
            <div id="signature-section" className="content-auto">
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
        </React.Suspense>

      </main>

      {/* SECTION 8: COMPLETE FOOTER */}
      {(currentView === 'home' || currentView === 'about' || currentView === 'contact') && (
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
        isKitchenOpen={isKitchenOpen}
      />

      {/* CONTACT MODAL (Opens anywhere when clicking 'Contact' in 3-line menu, header, or footer) */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* LEGAL & POLICIES MODAL (Terms & Conditions, Refund Policy, Privacy Policy) */}
      {policyModal.isOpen && (
        <React.Suspense fallback={null}>
          <LegalPolicyModal
            isOpen={policyModal.isOpen}
            onClose={() => setPolicyModal((prev) => ({ ...prev, isOpen: false }))}
            initialTab={policyModal.tab}
          />
        </React.Suspense>
      )}

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
