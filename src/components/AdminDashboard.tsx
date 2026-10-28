import React, { useState, useEffect } from 'react';
import { VegBadge, LeafBranch } from './Icons';
import { api, type ApiBanner } from '../services/api';

export interface AdminOrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface AdminOrder {
  id: string;
  status: 'New' | 'Preparing' | 'Out for Delivery' | 'Completed' | 'Declined';
  placedTime: string;
  prepTime?: string;
  completedTime?: string;
  orderType: 'Home Delivery' | 'Dine-in' | 'Takeaway';
  paymentMode: 'Cash on Delivery' | 'Paid via UPI' | 'Paid via Card';
  customerName: string;
  customerPhone: string;
  customerAddressOrTable: string;
  items: AdminOrderItem[];
  specialInstruction?: string;
  total: number;
  declineReason?: string;
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
}

export interface MenuItemData {
  id: string;
  name: string;
  category: 'North Indian' | 'Starters' | 'Pizza & Pasta' | 'Breads & Rice' | 'Beverages & Desserts';
  price: number;
  inStock: boolean;
  image: string;
  isTrending?: boolean;
}

interface AdminDashboardProps {
  onNavigateToCustomerSite?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateToCustomerSite,
}) => {
  // Admin Security / Login Guard (Authorized Admin Mobile: 8802325537)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      const sess = localStorage.getItem('gw_admin_session');
      return Boolean(sess && JSON.parse(sess).authorized);
    } catch {
      return false;
    }
  });

  const [adminLoginPhone, setAdminLoginPhone] = useState('');
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);

  // Navigation State — strictly the 5 core sections
  const [activeSection, setActiveSection] = useState<'Dashboard' | 'Live Orders' | 'Menu Items' | 'Order History' | 'Settings'>('Dashboard');
  
  // Live / Pending Orders Filter & Search
  const [activeTab, setActiveTab] = useState<'All' | 'New' | 'Preparing' | 'Out for Delivery' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'Latest First' | 'Oldest First' | 'Highest Amount'>('Latest First');

  // Menu Items Filter & Search
  const [menuCategoryFilter, setMenuCategoryFilter] = useState<string>('All');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');

  // History Filter & Search
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState<'All' | 'Completed' | 'Declined'>('All');

  // Operational & Settings States
  const [isKitchenOpen, setIsKitchenOpen] = useState(true);
  const [homeDeliveryEnabled, setHomeDeliveryEnabled] = useState(true);
  const [takeawayEnabled, setTakeawayEnabled] = useState(true);
  const [audioAlerts, setAudioAlerts] = useState(true);
  const [openingHours, setOpeningHours] = useState('11:00 AM – 11:00 PM');
  const [avgKitchenPrepTime, setAvgKitchenPrepTime] = useState('18 mins');
  const [deliveryRadius, setDeliveryRadius] = useState('15 km');
  const [restaurantPhone, setRestaurantPhone] = useState('+91 98765 43210');
  const [kitchenPhone, setKitchenPhone] = useState('+91 98123 45678');

  // Banners & Admins
  const [banners, setBanners] = useState<ApiBanner[]>([]);
  const [adminPhones, setAdminPhones] = useState<string[]>(['8802325537']);
  const [newAdminPhone, setNewAdminPhone] = useState('');

  // Dispatch Rider State
  const [dispatchRiderName, setDispatchRiderName] = useState('Vikas Sharma');
  const [dispatchRiderPhone, setDispatchRiderPhone] = useState('9811223344');

  // UI state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [activeModal, setActiveModal] = useState<{
    type: 'kot' | 'details' | 'decline' | 'edit-dish' | 'add-dish' | 'receipt' | 'dispatch' | 'banner';
    title: string;
    order?: AdminOrder;
    dish?: MenuItemData;
    banner?: Partial<ApiBanner>;
  } | null>(null);

  // Decline order input
  const [declineReasonInput, setDeclineReasonInput] = useState('');

  // Editing dish state
  const [editDishForm, setEditDishForm] = useState<Partial<MenuItemData>>({});

  // Adding new dish state
  const [newDishForm, setNewDishForm] = useState<Partial<MenuItemData>>({
    name: '',
    category: 'North Indian',
    price: 250,
    inStock: true,
    isTrending: false,
    image: '/images/dish-detail/rec-dal-makhani.jpg',
  });

  // Banner form state
  const [bannerForm, setBannerForm] = useState<Partial<ApiBanner>>({
    title: '',
    subtitle: '',
    imageDesktop: '/images/hero-bg-2400.jpg',
    imageMobile: '/images/hero-bg-mobile-1200.jpg',
    linkUrl: '#menu',
    isActive: true,
    displayOrder: 1,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSwitchToCustomerSite = () => {
    if (onNavigateToCustomerSite) {
      onNavigateToCustomerSite();
    } else {
      window.location.hash = '#home';
    }
  };

  // Live Orders Data (100% Pure Vegetarian)
  const [orders, setOrders] = useState<AdminOrder[]>([
    {
      id: '#GW-8495',
      status: 'New',
      placedTime: '2 mins ago',
      orderType: 'Home Delivery',
      paymentMode: 'Cash on Delivery',
      customerName: 'Amit Verma',
      customerPhone: '+91 98123 45678',
      customerAddressOrTable: 'Sector 14, Noida, UP (Hub Delivery)',
      items: [
        { name: 'Dal Makhani', quantity: 1, price: 249, image: '/images/dish-detail/rec-dal-makhani.jpg' },
        { name: 'Butter Naan', quantity: 2, price: 118, image: '/images/dish-detail/pairing-butter-naan.jpg' },
        { name: 'Veg Biryani', quantity: 1, price: 180, image: '/images/dish-detail/pairing-jeera-rice.jpg' },
      ],
      specialInstruction: 'Less Spicy / No Extra Butter',
      total: 540,
    },
    {
      id: '#GW-8492',
      status: 'Preparing',
      placedTime: '15 mins ago',
      prepTime: 'Prep: 18 mins',
      orderType: 'Dine-in',
      paymentMode: 'Paid via UPI',
      customerName: 'Rahul Sharma',
      customerPhone: '+91 98765 43210',
      customerAddressOrTable: 'Table No. 4',
      items: [
        { name: 'Shahi Paneer Butter Masala', quantity: 1, price: 299, image: '/images/dish-detail/rec-shahi-paneer.jpg' },
        { name: 'Garlic Naan', quantity: 2, price: 98, image: '/images/dish-detail/pairing-garlic-naan.jpg' },
        { name: 'Mango Lassi', quantity: 1, price: 129, image: '/images/orders/item3_mango_lassi.jpg' },
      ],
      specialInstruction: 'Jain Food (No Onion/Garlic)',
      total: 526,
    },
    {
      id: '#GW-8488',
      status: 'New',
      placedTime: '5 mins ago',
      orderType: 'Takeaway',
      paymentMode: 'Paid via UPI',
      customerName: 'Vikram Malhotra',
      customerPhone: '+91 98451 23456',
      customerAddressOrTable: 'Pickup at Narela Counter',
      items: [
        { name: 'Farmhouse Pizza', quantity: 1, price: 399, image: '/images/menu/dish-farmhouse-pizza.jpg' },
        { name: 'Mango Lassi', quantity: 1, price: 129, image: '/images/orders/item3_mango_lassi.jpg' },
      ],
      specialInstruction: 'Pack extra oregano & chilli flakes',
      total: 528,
    },
    {
      id: '#GW-8481',
      status: 'Out for Delivery',
      placedTime: '28 mins ago',
      prepTime: 'ETA: 10-15 mins',
      orderType: 'Home Delivery',
      paymentMode: 'Paid via Card',
      customerName: 'Priya Kapoor',
      customerPhone: '+91 99901 22334',
      customerAddressOrTable: 'Pocket 3, Sector A6, Narela, Delhi',
      items: [
        { name: 'Paneer Tikka Masala', quantity: 1, price: 279, image: '/images/dish-detail/rec-paneer-tikka-masala.jpg' },
        { name: 'Jeera Rice', quantity: 1, price: 129, image: '/images/dish-detail/pairing-jeera-rice.jpg' },
      ],
      total: 408,
    },
    {
      id: '#GW-8475',
      status: 'Preparing',
      placedTime: '20 mins ago',
      prepTime: 'Prep: 20 mins',
      orderType: 'Home Delivery',
      paymentMode: 'Paid via UPI',
      customerName: 'Rohit Mehra',
      customerPhone: '+91 98112 33445',
      customerAddressOrTable: 'Sector B4, Narela Hub Area',
      items: [
        { name: 'Dal Makhani', quantity: 1, price: 249, image: '/images/dish-detail/rec-dal-makhani.jpg' },
        { name: 'Garlic Naan', quantity: 2, price: 98, image: '/images/dish-detail/pairing-garlic-naan.jpg' },
      ],
      total: 347,
    },
    {
      id: '#GW-8468',
      status: 'Completed',
      placedTime: '45 mins ago',
      completedTime: 'Completed at 6:50 PM',
      orderType: 'Dine-in',
      paymentMode: 'Paid via UPI',
      customerName: 'Sneha Singh',
      customerPhone: '+91 98711 44556',
      customerAddressOrTable: 'Table No. 2',
      items: [
        { name: 'Paneer Butter Masala', quantity: 2, price: 598, image: '/images/dish-detail/rec-shahi-paneer.jpg' },
        { name: 'Garlic Naan', quantity: 2, price: 196, image: '/images/dish-detail/pairing-garlic-naan.jpg' },
      ],
      total: 794,
    },
    {
      id: '#GW-8462',
      status: 'Completed',
      placedTime: '1 hr ago',
      completedTime: 'Completed at 6:30 PM',
      orderType: 'Home Delivery',
      paymentMode: 'Cash on Delivery',
      customerName: 'Deepak Gupta',
      customerPhone: '+91 97182 55667',
      customerAddressOrTable: 'Pocket 5, Narela Sector A5',
      items: [
        { name: 'Dal Makhani', quantity: 1, price: 249, image: '/images/dish-detail/rec-dal-makhani.jpg' },
        { name: 'Veg Biryani', quantity: 1, price: 180, image: '/images/dish-detail/pairing-jeera-rice.jpg' },
      ],
      total: 429,
    },
    {
      id: '#GW-8455',
      status: 'Declined',
      placedTime: '1 hr 15 mins ago',
      orderType: 'Home Delivery',
      paymentMode: 'Cash on Delivery',
      customerName: 'Rajesh Kumar',
      customerPhone: '+91 99100 88776',
      customerAddressOrTable: 'Alipur Extension (Beyond 15km Limit)',
      items: [
        { name: 'Farmhouse Pizza', quantity: 1, price: 399, image: '/images/menu/dish-farmhouse-pizza.jpg' },
      ],
      total: 399,
      declineReason: 'Address location falls outside maximum 15km delivery hub radius.',
    },
  ]);

  // Menu Items State (100% Pure Veg)
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([
    { id: 'item-1', name: 'Paneer Butter Masala', category: 'North Indian', price: 349, inStock: true, image: '/images/admin/dish_paneer.jpg' },
    { id: 'item-2', name: 'Farmhouse Pizza', category: 'Pizza & Pasta', price: 399, inStock: true, image: '/images/admin/dish_pizza.jpg' },
    { id: 'item-3', name: 'Dal Makhani', category: 'North Indian', price: 249, inStock: true, image: '/images/admin/dish_dal.jpg' },
    { id: 'item-4', name: 'Mango Lassi', category: 'Beverages & Desserts', price: 129, inStock: false, image: '/images/admin/dish_lassi.jpg' },
    { id: 'item-5', name: 'Garlic Naan', category: 'Breads & Rice', price: 49, inStock: true, image: '/images/admin/dish_naan.jpg' },
    { id: 'item-6', name: 'Butter Naan', category: 'Breads & Rice', price: 59, inStock: true, image: '/images/dish-detail/pairing-butter-naan.jpg' },
    { id: 'item-7', name: 'Shahi Paneer Butter Masala', category: 'North Indian', price: 299, inStock: true, image: '/images/dish-detail/rec-shahi-paneer.jpg' },
    { id: 'item-8', name: 'Veg Biryani', category: 'Breads & Rice', price: 180, inStock: true, image: '/images/dish-detail/pairing-jeera-rice.jpg' },
    { id: 'item-9', name: 'Paneer Tikka Masala', category: 'North Indian', price: 279, inStock: true, image: '/images/dish-detail/rec-paneer-tikka-masala.jpg' },
    { id: 'item-10', name: 'Tandoori Tikka Platter', category: 'Starters', price: 299, inStock: true, image: '/images/menu/dish-tandoori-tikka.jpg' },
    { id: 'item-11', name: 'Steamed Veg Momos', category: 'Starters', price: 199, inStock: true, image: '/images/menu/dish-veg-momos.jpg' },
    { id: 'item-12', name: 'Gulab Jamun (2 Pcs)', category: 'Beverages & Desserts', price: 99, inStock: true, image: '/images/offers/dessert_bowl.jpg' },
  ]);

  // Load and sync real persistent data from SQLite REST API
  useEffect(() => {
    let isMounted = true;
    const loadInitialData = async () => {
      try {
        const [fetchedOrders, fetchedDishes, fetchedSettings, fetchedBanners, fetchedAdmins] = await Promise.all([
          api.getOrders(),
          api.getDishes(),
          api.getSettings(),
          api.getBanners(),
          api.getAdminPhones(),
        ]);
        if (!isMounted) return;
        if (fetchedOrders && fetchedOrders.length > 0) {
          setOrders(fetchedOrders as any);
        }
        if (fetchedDishes && fetchedDishes.length > 0) {
          setMenuItems(fetchedDishes as any);
        }
        if (fetchedBanners && fetchedBanners.length > 0) {
          setBanners(fetchedBanners);
        }
        if (fetchedAdmins && fetchedAdmins.length > 0) {
          setAdminPhones(fetchedAdmins);
        }
        if (fetchedSettings) {
          setIsKitchenOpen(fetchedSettings.is_kitchen_open);
          setHomeDeliveryEnabled(fetchedSettings.home_delivery_enabled);
          setTakeawayEnabled(fetchedSettings.takeaway_enabled);
          setOpeningHours(fetchedSettings.opening_hours || '11:00 AM – 11:00 PM');
          setAvgKitchenPrepTime(fetchedSettings.avg_prep_time || '18 mins');
          setDeliveryRadius(fetchedSettings.delivery_radius || '15 km');
          setRestaurantPhone(fetchedSettings.restaurant_phone || '+91 98765 43210');
          setKitchenPhone(fetchedSettings.kitchen_phone || '+91 98123 45678');
          setAudioAlerts(fetchedSettings.audio_alerts ?? true);
        }
      } catch (err) {
        console.warn('Initial admin data sync fallback to defaults:', err);
      }
    };

    loadInitialData();

    // Poll orders every 4 seconds for live restaurant management
    const interval = setInterval(async () => {
      try {
        const freshOrders = await api.getOrders();
        if (isMounted && freshOrders && freshOrders.length > 0) {
          setOrders(freshOrders as any);
        }
      } catch {
        // silent poll retry
      }
    }, 4000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Admin Login & Logout handlers
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginError(null);
    const clean = adminLoginPhone.replace(/\D/g, '').slice(-10);
    if (clean.length !== 10) {
      setAdminLoginError('Please enter a valid 10-digit mobile number');
      return;
    }
    setAdminLoginLoading(true);
    try {
      const res = await api.verifyAdmin(clean);
      if (res.authorized) {
        setIsAdminLoggedIn(true);
        localStorage.setItem(
          'gw_admin_session',
          JSON.stringify({ authorized: true, phone: clean, time: Date.now() })
        );
        showToast('Admin authorized! Welcome to Greenwood Control Panel.');
      } else {
        setAdminLoginError(res.error || 'This mobile number is not authorized for Admin Panel access.');
      }
    } catch (err: any) {
      setAdminLoginError(err.message || 'Verification connection failed');
    } finally {
      setAdminLoginLoading(false);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('gw_admin_session');
    setIsAdminLoggedIn(false);
    showToast('Admin session locked.');
  };

  // Order Actions & Transitions (Connected to SQLite REST API)
  const handleAcceptOrder = async (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'Preparing', prepTime: 'Prep: 18 mins' } : o))
    );
    showToast(`Order ${orderId} accepted & sent to kitchen!`);
    try {
      await api.updateOrderStatus(orderId, 'Preparing', { prepTime: 'Prep: 18 mins' });
    } catch (err) {
      console.error('Failed to sync accepted status to API:', err);
    }
  };

  const handleOpenDispatchModal = (order: AdminOrder) => {
    if (order.orderType === 'Takeaway' || order.orderType === 'Dine-in') {
      handleMarkReady(order.id);
    } else {
      setActiveModal({
        type: 'dispatch',
        title: `Dispatch Order ${order.id} • Assign Rider`,
        order,
      });
    }
  };

  const handleConfirmDispatch = async () => {
    if (!activeModal?.order) return;
    const orderId = activeModal.order.id;
    const name = dispatchRiderName.trim() || 'Greenwood Express Rider';
    const phone = dispatchRiderPhone.replace(/\D/g, '').slice(-10);

    if (phone.length !== 10) {
      showToast('Please enter a valid 10-digit rider phone number');
      return;
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'Out for Delivery',
              prepTime: 'Out for Delivery',
              deliveryPartnerName: name,
              deliveryPartnerPhone: phone,
            }
          : o
      )
    );

    setActiveModal(null);
    showToast(`Order ${orderId} dispatched with rider ${name}!`);

    try {
      await api.updateOrderStatus(orderId, 'Out for Delivery', {
        prepTime: 'Out for Delivery',
        deliveryPartnerName: name,
        deliveryPartnerPhone: phone,
      });
    } catch (err) {
      console.error('Failed to sync dispatch status to API:', err);
    }
  };

  const handleMarkReady = async (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'Out for Delivery', prepTime: 'Ready for Pickup' } : o))
    );
    showToast(`Order ${orderId} marked ready for pickup!`);
    try {
      await api.updateOrderStatus(orderId, 'Out for Delivery', { prepTime: 'Ready for Pickup' });
    } catch (err) {
      console.error('Failed to sync ready status to API:', err);
    }
  };

  const handleMarkCompleted = async (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'Completed', completedTime: 'Just now' } : o))
    );
    showToast(`Order ${orderId} marked completed!`);
    try {
      await api.updateOrderStatus(orderId, 'Completed');
    } catch (err) {
      console.error('Failed to sync completed status to API:', err);
    }
  };

  const handleToggleTrending = async (dishId: string) => {
    let nextState = false;
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === dishId) {
          nextState = !item.isTrending;
          showToast(`${item.name} is ${nextState ? 'now Trending 🔥' : 'removed from Trending'}`);
          return { ...item, isTrending: nextState };
        }
        return item;
      })
    );
    try {
      await api.updateDish(dishId, { isTrending: nextState });
    } catch (err) {
      console.error('Failed to sync trending status to API:', err);
    }
  };

  const handleConfirmDecline = async () => {
    if (!activeModal?.order) return;
    const orderId = activeModal.order.id;
    const reason = declineReasonInput.trim() || 'Kitchen temporarily overloaded';
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'Declined', declineReason: reason } : o))
    );
    setActiveModal(null);
    setDeclineReasonInput('');
    showToast(`Order ${orderId} declined.`);
    try {
      await api.updateOrderStatus(orderId, 'Declined', { declineReason: reason });
    } catch (err) {
      console.error('Failed to sync decline status to API:', err);
    }
  };

  const handleToggleMenuAvailability = async (dishId: string) => {
    let nextState = true;
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === dishId) {
          nextState = !item.inStock;
          showToast(`${item.name} is now ${nextState ? 'In Stock 🟢' : 'Sold Out 🔴'}`);
          return { ...item, inStock: nextState };
        }
        return item;
      })
    );
    try {
      await api.updateDish(dishId, { inStock: nextState });
    } catch (err) {
      console.error('Failed to sync dish stock status to API:', err);
    }
  };

  const handleSaveEditDish = async () => {
    if (!activeModal?.dish) return;
    const dishId = activeModal.dish.id;
    const updates = { ...editDishForm };
    setMenuItems((prev) =>
      prev.map((item) => (item.id === dishId ? { ...item, ...updates } : item))
    );
    setActiveModal(null);
    showToast('Menu item updated successfully!');
    try {
      await api.updateDish(dishId, updates as any);
    } catch (err) {
      console.error('Failed to sync dish updates to API:', err);
    }
  };

  const handleAddNewDish = async () => {
    if (!newDishForm.name?.trim() || !newDishForm.price) {
      showToast('Please enter a valid dish name and price.');
      return;
    }
    const newId = `item-${Date.now()}`;
    const dishToAdd: MenuItemData = {
      id: newId,
      name: newDishForm.name.trim(),
      category: (newDishForm.category as any) || 'North Indian',
      price: Number(newDishForm.price),
      inStock: newDishForm.inStock ?? true,
      isTrending: Boolean(newDishForm.isTrending),
      image: newDishForm.image || '/images/dish-detail/rec-dal-makhani.jpg',
    };
    setMenuItems((prev) => [dishToAdd, ...prev]);
    setActiveModal(null);
    setNewDishForm({
      name: '',
      category: 'North Indian',
      price: 250,
      inStock: true,
      isTrending: false,
      image: '/images/dish-detail/rec-dal-makhani.jpg',
    });
    showToast(`"${dishToAdd.name}" added to menu catalog!`);
    try {
      await api.addDish({
        id: dishToAdd.id,
        name: dishToAdd.name,
        category: dishToAdd.category,
        price: dishToAdd.price,
        inStock: dishToAdd.inStock,
        isTrending: dishToAdd.isTrending,
        image: dishToAdd.image,
        description: 'Freshly prepared Pure Vegetarian specialty.',
        isVeg: true,
      });
    } catch (err) {
      console.error('Failed to persist new dish to API:', err);
    }
  };

  const handleToggleBannerActive = async (bannerId: string) => {
    let nextState = true;
    setBanners((prev) =>
      prev.map((b) => {
        if (b.id === bannerId) {
          nextState = !b.isActive;
          return { ...b, isActive: nextState };
        }
        return b;
      })
    );
    try {
      await api.updateBanner(bannerId, { isActive: nextState });
      showToast(`Banner ${nextState ? 'Activated 🟢' : 'Disabled ⏸'}`);
    } catch (err) {
      console.error('Failed to update banner:', err);
    }
  };

  const handleSaveBanner = async () => {
    if (!bannerForm.title?.trim()) {
      showToast('Banner title is required');
      return;
    }

    if (activeModal?.banner?.id) {
      const bannerId = activeModal.banner.id;
      setBanners((prev) =>
        prev.map((b) => (b.id === bannerId ? ({ ...b, ...bannerForm } as ApiBanner) : b))
      );
      try {
        await api.updateBanner(bannerId, bannerForm);
        showToast('Banner updated successfully!');
      } catch (err) {
        console.error('Failed to update banner:', err);
      }
    } else {
      try {
        const res = await api.addBanner(bannerForm);
        if (res.banner) {
          setBanners((prev) => [...prev, res.banner]);
          showToast('New homepage banner added!');
        }
      } catch (err) {
        console.error('Failed to create banner:', err);
      }
    }
    setActiveModal(null);
  };

  const handleDeleteBanner = async (bannerId: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== bannerId));
    try {
      await api.deleteBanner(bannerId);
      showToast('Banner deleted.');
    } catch (err) {
      console.error('Failed to delete banner:', err);
    }
  };

  const handleAddAdminPhone = async () => {
    const clean = newAdminPhone.replace(/\D/g, '').slice(-10);
    if (clean.length !== 10) {
      showToast('Please enter a valid 10-digit mobile number');
      return;
    }
    if (adminPhones.includes(clean)) {
      showToast('This admin phone is already authorized');
      return;
    }
    const updated = [...adminPhones, clean];
    setAdminPhones(updated);
    setNewAdminPhone('');
    showToast(`Admin +91 ${clean} authorized!`);
    try {
      await api.updateAdminPhones(updated);
    } catch (err) {
      console.error('Failed to sync admin phones:', err);
    }
  };

  const handleRemoveAdminPhone = async (phone: string) => {
    if (phone === '8802325537') {
      showToast('Primary owner mobile cannot be removed');
      return;
    }
    const updated = adminPhones.filter((p) => p !== phone);
    setAdminPhones(updated);
    showToast(`Admin +91 ${phone} removed.`);
    try {
      await api.updateAdminPhones(updated);
    } catch (err) {
      console.error('Failed to remove admin phone:', err);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await api.updateSettings({
        is_kitchen_open: isKitchenOpen,
        home_delivery_enabled: homeDeliveryEnabled,
        takeaway_enabled: takeawayEnabled,
        opening_hours: openingHours,
        avg_prep_time: avgKitchenPrepTime,
        delivery_radius: deliveryRadius,
        restaurant_phone: restaurantPhone,
        kitchen_phone: kitchenPhone,
        audio_alerts: audioAlerts,
      });
      showToast('Settings saved successfully!');
    } catch (err) {
      console.error('Failed to save settings:', err);
      showToast('Error saving settings');
    }
  };

  // Metrics Calculations
  const activeOrdersCount = orders.filter((o) => o.status === 'New' || o.status === 'Preparing' || o.status === 'Out for Delivery').length;
  const newOrdersCount = orders.filter((o) => o.status === 'New').length;
  const preparingOrdersCount = orders.filter((o) => o.status === 'Preparing').length;
  const readyOrdersCount = orders.filter((o) => o.status === 'Out for Delivery').length;
  const completedOrdersCount = orders.filter((o) => o.status === 'Completed').length;
  const declinedOrdersCount = orders.filter((o) => o.status === 'Declined').length;

  // Filtered Live Orders
  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'New' && o.status !== 'New') return false;
    if (activeTab === 'Preparing' && o.status !== 'Preparing') return false;
    if (activeTab === 'Out for Delivery' && o.status !== 'Out for Delivery') return false;
    if (activeTab === 'Completed' && o.status !== 'Completed') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = o.id.toLowerCase().includes(q);
      const matchCustomer = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.includes(q);
      const matchItem = o.items.some((i) => i.name.toLowerCase().includes(q));
      return matchId || matchCustomer || matchPhone || matchItem;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'Highest Amount') return b.total - a.total;
    if (sortBy === 'Oldest First') return a.id.localeCompare(b.id);
    return b.id.localeCompare(a.id);
  });

  // Filtered Menu Items
  const filteredMenuItems = menuItems.filter((item) => {
    if (menuCategoryFilter !== 'All' && item.category !== menuCategoryFilter) return false;
    if (menuSearchQuery.trim()) {
      const q = menuSearchQuery.toLowerCase().trim();
      return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    }
    return true;
  });

  // Filtered Order History
  const historyOrders = orders.filter((o) => {
    if (historyStatusFilter === 'Completed' && o.status !== 'Completed') return false;
    if (historyStatusFilter === 'Declined' && o.status !== 'Declined') return false;
    if (historySearchQuery.trim()) {
      const q = historySearchQuery.toLowerCase().trim();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    return true;
  });

  // Admin Security Portal Guard (8802325537)
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FAF6EE] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#FFFDF8] rounded-2xl border border-[#E8DDCA] shadow-2xl p-6 sm:p-8 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center gap-2 text-[#163E26] mb-2">
            <LeafBranch flip={false} className="w-5 h-2.5" />
            <span className="font-serif text-sm tracking-widest uppercase font-semibold">
              Greenwood Café &amp; Restaurant
            </span>
            <LeafBranch flip={true} className="w-5 h-2.5" />
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#17261D] mt-1 mb-2">
            Restaurant Admin Access
          </h1>
          <p className="text-xs text-[#77766D] mb-6 max-w-sm mx-auto leading-relaxed font-sans">
            Restricted operational portal. Please enter your authorized administrator mobile number to manage orders, catalog, and kitchen status.
          </p>

          {adminLoginError && (
            <div className="mb-4 p-3 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#C83A25] text-xs font-semibold text-center">
              ⚠️ {adminLoginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-[#17261D] mb-1.5 font-sans">
                Authorized Administrator Mobile Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-[#E8DDCA] bg-[#FAF6EE] text-[#4B5149] text-sm font-semibold font-sans">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={adminLoginPhone}
                  onChange={(e) => setAdminLoginPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="8802325537"
                  className="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#E8DDCA] rounded-r-xl text-sm text-[#17261D] font-medium font-sans focus:outline-none focus:border-[#163E26]"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-[#77766D] mt-1.5 font-sans">
                Authorized Admin: <strong className="text-[#163E26]">8802325537</strong>
              </p>
            </div>

            <button
              type="submit"
              disabled={adminLoginLoading}
              className="w-full bg-[#163E26] hover:bg-[#1E5233] text-white py-3 rounded-xl font-semibold text-sm shadow-md transition-all active:scale-98 disabled:opacity-75 cursor-pointer font-sans"
            >
              {adminLoginLoading ? 'Verifying Authorization...' : 'Unlock Admin Panel →'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#E8DDCA]/60 flex items-center justify-center">
            <button
              type="button"
              onClick={handleSwitchToCustomerSite}
              className="text-xs font-semibold text-[#8F5D2C] hover:text-[#163E26] flex items-center gap-1 cursor-pointer font-sans"
            >
              <span>← Return to Customer Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#4B5149] font-sans flex flex-col antialiased">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 sm:top-16 right-4 sm:right-8 z-50 bg-[#163E26] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-[#2B5E3C] text-xs sm:text-sm">
          <svg className="w-4 h-4 text-[#C9A45C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* TOP HEADER BAR (Clean, Settled, Fast)                     */}
      {/* ========================================================= */}
      <header className="bg-[#2B180F] text-[#FAF6EE] px-3.5 sm:px-6 py-2.5 flex items-center justify-between border-b border-[#3D2517] z-30 shadow-sm shrink-0">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-[#E8DDCA] hover:text-white"
            aria-label="Toggle Sidebar Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#C9A45C]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.52-11 4 4.5-.5 7.5.5 11 2-4.5 1.5-8 2-11 2" />
            </svg>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5">
              <span className="font-serif font-bold text-sm sm:text-base tracking-wider text-[#FAF6EE]">GREENWOOD</span>
              <span className="text-[10px] tracking-widest text-[#C9A45C] uppercase font-medium">
                Admin POS
              </span>
            </div>
          </div>
        </div>

        {/* Center: Live Operational Status */}
        <div className="hidden md:flex items-center gap-3 text-xs">
          <button
            type="button"
            onClick={() => {
              const nextState = !isKitchenOpen;
              setIsKitchenOpen(nextState);
              showToast(`Kitchen is now: ${nextState ? 'Open 🟢' : 'Paused 🔴'}`);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
              isKitchenOpen
                ? 'bg-[#163E26] border-[#2D7344] text-[#DCE8CB]'
                : 'bg-[#C83A25]/20 border-[#C83A25]/60 text-[#FCA5A5]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isKitchenOpen ? 'bg-[#4ADE80]' : 'bg-[#EF4444]'}`} />
            <span className="font-semibold text-[11px]">
              {isKitchenOpen ? 'Kitchen Open & Taking Orders' : 'Kitchen Paused'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAudioAlerts(!audioAlerts);
              showToast(`Chime alerts: ${!audioAlerts ? 'ON 🔔' : 'OFF 🔕'}`);
            }}
            className="flex items-center gap-1.5 text-[#E8DDCA] hover:text-white"
          >
            <span>{audioAlerts ? '🔔' : '🔕'}</span>
            <span className="text-[11px]">Alerts: <strong>{audioAlerts ? 'ON' : 'OFF'}</strong></span>
          </button>

          <div className="text-[#B3A694] text-[11px]">
            12 Jan 2024, 7:35 PM
          </div>
        </div>

        {/* Right: Switch to Customer Site Button + Manager Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Notification Counter */}
          <div className="relative text-[#E8DDCA] p-1.5">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-[#C83A25] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              1
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-[#FAF6EE]/10 px-2 py-1 rounded-full border border-[#C9A45C]/30 text-xs text-[#FAF6EE]">
            <div className="w-5 h-5 rounded-full bg-[#C9A45C] text-[#2B180F] font-bold text-[10px] flex items-center justify-center">
              M
            </div>
            <span className="font-medium text-[11px]">Manager</span>
          </div>

          {/* Lock / Logout Session */}
          <button
            type="button"
            onClick={handleAdminLogout}
            className="bg-[#2B180F] hover:bg-[#3D2517] text-[#C9A45C] border border-[#C9A45C]/40 text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-xs cursor-pointer"
            title="Lock Admin Session"
          >
            <span>🔒</span>
            <span className="hidden sm:inline">Lock</span>
          </button>

          {/* Switch to Customer Site Button */}
          <button
            type="button"
            onClick={handleSwitchToCustomerSite}
            className="bg-[#FFFDF8] hover:bg-[#FAF6EE] text-[#2B180F] border border-[#C9A45C] text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
            title="Switch from Admin Panel to Customer Website"
          >
            <span>Customer Site</span>
            <svg className="w-3.5 h-3.5 text-[#8F5D2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* WORKSPACE: SIDEBAR + CONTENT                             */}
      {/* ========================================================= */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar (5 sections) */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-56 sm:w-60 bg-[#2B180F] text-[#E8DDCA] border-r border-[#3D2517] flex flex-col justify-between transition-transform duration-150 lg:static lg:translate-x-0 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="py-4 px-3 space-y-1">
            <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider uppercase text-[#C9A45C]/80">
              Admin Operations
            </div>

            {[
              {
                id: 'Dashboard' as const,
                label: 'Dashboard',
                icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
              },
              {
                id: 'Live Orders' as const,
                label: 'Pending Orders',
                badge: activeOrdersCount > 0 ? String(activeOrdersCount) : undefined,
                icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
              },
              {
                id: 'Menu Items' as const,
                label: 'Menu Items',
                icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
              },
              {
                id: 'Order History' as const,
                label: 'Order History',
                icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
              },
              {
                id: 'Settings' as const,
                label: 'Settings',
                icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
              },
            ].map((item) => {
              const isSelected = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#163E26] text-white font-bold shadow-xs'
                      : 'text-[#E8DDCA]/80 hover:bg-[#1A0E08] hover:text-white font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <svg
                      className={`w-4 h-4 ${isSelected ? 'text-[#C9A45C]' : 'text-[#C9A45C]/70'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-[#C83A25] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Sidebar: Return to Customer Site */}
          <div className="p-3 border-t border-[#3D2517]/80">
            <button
              type="button"
              onClick={handleSwitchToCustomerSite}
              className="w-full bg-[#1A0E08] hover:bg-[#2B180F] text-[#FAF6EE] border border-[#C9A45C]/40 text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>← View Customer Site</span>
            </button>
          </div>
        </aside>

        {/* Mobile backdrop */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-[#0B130F]/60 z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* ========================================================= */}
        {/* MAIN WORKSPACE                                            */}
        {/* ========================================================= */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 lg:p-6 pb-24 lg:pb-8">
          <div className="max-w-7xl mx-auto space-y-5">
            
            {/* ======================================================= */}
            {/* 1. DASHBOARD VIEW                                       */}
            {/* ======================================================= */}
            {activeSection === 'Dashboard' && (
              <div className="space-y-5">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#17261D] tracking-tight">
                      Kitchen Dashboard
                    </h1>
                    <p className="font-sans text-xs sm:text-sm text-[#77766D] mt-0.5">
                      Live restaurant operations & kitchen summary.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveSection('Live Orders')}
                    className="inline-flex items-center gap-1.5 self-start sm:self-auto bg-[#163E26] hover:bg-[#1E5233] text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    <span>View Pending Orders ({activeOrdersCount})</span>
                    <span className="text-[#C9A45C]">→</span>
                  </button>
                </div>

                {/* 4 Compact Uniform KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {/* KPI 1 */}
                  <div className="bg-[#FFFDF8] rounded-xl border border-[#E8DDCA] p-3.5 sm:p-4 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[11px] sm:text-xs text-[#77766D] font-medium block mb-0.5">Today's Orders</span>
                      <div className="font-sans text-xl sm:text-2xl font-bold text-[#17261D]">38</div>
                      <div className="flex items-center gap-1 mt-1 text-[10px] sm:text-[11px]">
                        <span className="text-[#168039] font-bold">{newOrdersCount} New</span>
                        <span className="text-[#9A9488]">•</span>
                        <span className="text-[#77766D]">{completedOrdersCount} Done</span>
                        {declinedOrdersCount > 0 && (
                          <>
                            <span className="text-[#9A9488]">•</span>
                            <span className="text-[#C83A25] font-semibold">{declinedOrdersCount} Cancelled</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#FAF6EE] border border-[#E8DDCA] flex items-center justify-center text-[#8F5D2C] shrink-0">
                      <svg className="w-5 h-5 text-[#8F5D2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>

                  {/* KPI 2 */}
                  <div className="bg-[#FFFDF8] rounded-xl border border-[#E8DDCA] p-3.5 sm:p-4 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[11px] sm:text-xs text-[#77766D] font-medium block mb-0.5">Today's Revenue</span>
                      <div className="font-sans text-xl sm:text-2xl font-bold text-[#17261D]">₹18,450</div>
                      <span className="inline-block mt-1 text-[10px] sm:text-[11px] font-semibold text-[#168039] bg-[#DCE8CB] px-2 py-0.5 rounded-full">
                        ↑ 14% vs yesterday
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#FAF6EE] border border-[#E8DDCA] flex items-center justify-center text-[#C9A45C] shrink-0">
                      <svg className="w-5 h-5 text-[#C9A45C]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  {/* KPI 3 */}
                  <div className="bg-[#FFFDF8] rounded-xl border border-[#E8DDCA] p-3.5 sm:p-4 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[11px] sm:text-xs text-[#77766D] font-medium block mb-0.5">Avg. Prep Time</span>
                      <div className="font-sans text-xl sm:text-2xl font-bold text-[#17261D]">{avgKitchenPrepTime}</div>
                      <span className="inline-block mt-1 text-[10px] sm:text-[11px] font-semibold text-[#168039] bg-[#DCE8CB] px-2 py-0.5 rounded-full">
                        ↓ 12% vs yesterday
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#FAF6EE] border border-[#E8DDCA] flex items-center justify-center text-[#C9A45C] shrink-0">
                      <svg className="w-5 h-5 text-[#C9A45C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <circle cx="12" cy="12" r="9" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
                      </svg>
                    </div>
                  </div>

                  {/* KPI 4 */}
                  <div className="bg-[#FFFDF8] rounded-xl border border-[#E8DDCA] p-3.5 sm:p-4 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[11px] sm:text-xs text-[#77766D] font-medium block mb-0.5">Pending Delivery</span>
                      <div className="font-sans text-xl sm:text-2xl font-bold text-[#17261D]">{readyOrdersCount}</div>
                      <span className="text-[10px] sm:text-[11px] text-[#77766D] block mt-1">On the way to customers</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#FAF6EE] border border-[#E8DDCA] flex items-center justify-center text-[#8F5D2C] shrink-0">
                      <svg className="w-5 h-5 text-[#8F5D2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <circle cx="5" cy="17" r="3" />
                        <circle cx="19" cy="17" r="3" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 17h4l3-6h5l2 3h2M9 11h3" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 2-Column Split: Orders Preview + Quick Stock */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Left: Orders Needing Attention */}
                  <div className="lg:col-span-2 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <h2 className="font-serif text-base sm:text-lg font-bold text-[#17261D] flex items-center gap-2">
                        <span>Pending Orders Requiring Action</span>
                        <span className="bg-[#C83A25] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {orders.filter((o) => o.status === 'New' || o.status === 'Preparing').length} Active
                        </span>
                      </h2>
                      <button
                        type="button"
                        onClick={() => setActiveSection('Live Orders')}
                        className="text-xs font-semibold text-[#163E26] hover:text-[#C9A45C]"
                      >
                        All Orders →
                      </button>
                    </div>

                    {orders
                      .filter((o) => o.status === 'New' || o.status === 'Preparing')
                      .slice(0, 3)
                      .map((order) => {
                        const isNew = order.status === 'New';
                        return (
                          <div
                            key={order.id}
                            className={`bg-[#FFFDF8] rounded-xl border p-4 shadow-xs ${
                              isNew ? 'border-[#C9A45C] ring-1 ring-[#C9A45C]/40' : 'border-[#E8DDCA]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  isNew
                                    ? 'bg-[#FDF3D8] text-[#8F5D2C] border border-[#E8D094]'
                                    : 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                                }`}>
                                  {isNew ? '★ NEW ORDER' : '🍳 PREPARING'}
                                </span>
                                <span className="font-bold text-xs text-[#17261D]">{order.id}</span>
                              </div>
                              <span className="text-[11px] text-[#77766D]">{order.placedTime}</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#E8DDCA]/60 text-xs">
                              <div>
                                <div className="font-bold text-[#17261D]">{order.customerName}</div>
                                <div className="text-[#77766D]">{order.customerPhone}</div>
                                <div className="text-[#163E26] font-medium mt-0.5">{order.orderType} • {order.paymentMode}</div>
                              </div>

                              <div className="space-y-1">
                                {order.items.map((it, idx) => (
                                  <div key={idx} className="flex justify-between text-[11px]">
                                    <span className="truncate">{it.quantity} × {it.name}</span>
                                    <span className="font-semibold text-[#17261D]">₹{it.price}</span>
                                  </div>
                                ))}
                              </div>

                              <div className="flex flex-col justify-between items-end gap-2">
                                <div className="font-sans text-base font-bold text-[#C83A25]">
                                  ₹{order.total}
                                </div>
                                <div className="flex gap-2 w-full justify-end">
                                  {isNew ? (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => handleAcceptOrder(order.id)}
                                        className="bg-[#163E26] hover:bg-[#1E5233] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs cursor-pointer"
                                      >
                                        Accept
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setActiveModal({ type: 'decline', title: `Decline ${order.id}?`, order })}
                                        className="text-[#C83A25] border border-[#C83A25] text-xs font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer"
                                      >
                                        Decline
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleMarkReady(order.id)}
                                      className="bg-[#163E26] hover:bg-[#1E5233] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs cursor-pointer"
                                    >
                                      Mark Ready
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Right: Quick Dish Stock */}
                  <div className="space-y-4">
                    <div className="bg-[#FFFDF8] rounded-xl border border-[#E8DDCA] p-4 shadow-xs">
                      <h3 className="font-serif text-sm sm:text-base font-bold text-[#17261D] mb-1">
                        Quick Dish Availability
                      </h3>
                      <p className="text-[11px] text-[#77766D] mb-3">
                        Instant 1-tap stock switch for popular dishes.
                      </p>

                      <div className="divide-y divide-[#E8DDCA]/70">
                        {menuItems.slice(0, 5).map((item) => (
                          <div key={item.id} className="py-2 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-8 h-8 rounded-lg object-cover border border-[#E8DDCA] shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/images/dish-detail/rec-dal-makhani.jpg';
                                }}
                              />
                              <div className="min-w-0">
                                <span className="text-xs font-semibold text-[#17261D] block truncate">
                                  {item.name}
                                </span>
                                <span className={`text-[10px] font-bold ${item.inStock ? 'text-[#168039]' : 'text-[#C83A25]'}`}>
                                  {item.inStock ? '● In Stock' : '● Sold Out'}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              role="switch"
                              aria-checked={item.inStock}
                              onClick={() => handleToggleMenuAvailability(item.id)}
                              className={`w-9 h-5 rounded-full relative shrink-0 p-0.5 cursor-pointer ${
                                item.inStock ? 'bg-[#163E26]' : 'bg-[#E0D8CB]'
                              }`}
                            >
                              <span
                                className={`block w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform ${
                                  item.inStock ? 'translate-x-4' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-[#E8DDCA]/60 text-center">
                        <button
                          type="button"
                          onClick={() => setActiveSection('Menu Items')}
                          className="text-xs font-semibold text-[#163E26] hover:text-[#C9A45C]"
                        >
                          View Full Menu ({menuItems.length} items) →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ======================================================= */}
            {/* 2. PENDING / LIVE ORDERS VIEW                           */}
            {/* ======================================================= */}
            {activeSection === 'Live Orders' && (
              <div className="space-y-4">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#17261D] tracking-tight">
                      Pending & Live Orders
                    </h1>
                    <p className="font-sans text-xs sm:text-sm text-[#77766D] mt-0.5">
                      Accept orders, dispatch to kitchen, and print KOT tickets.
                    </p>
                  </div>

                  <span className="bg-[#163E26] text-[#FAF6EE] text-xs font-bold px-3 py-1 rounded-full self-start sm:self-auto">
                    {activeOrdersCount} Pending Action
                  </span>
                </div>

                {/* Filter Tabs & Search Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
                  {/* Status Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                    {(['All', 'New', 'Preparing', 'Out for Delivery', 'Completed'] as const).map((tab) => {
                      const isSelected = activeTab === tab;
                      const count =
                        tab === 'All'
                          ? orders.length
                          : tab === 'New'
                          ? newOrdersCount
                          : tab === 'Preparing'
                          ? preparingOrdersCount
                          : tab === 'Out for Delivery'
                          ? readyOrdersCount
                          : completedOrdersCount;

                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                            isSelected
                              ? 'bg-[#163E26] text-white shadow-xs'
                              : 'bg-[#FFFDF8] hover:bg-[#FAF6EE] text-[#4B5149] border border-[#E8DDCA]'
                          }`}
                        >
                          <span>{tab === 'All' ? 'All Orders' : tab}</span>
                          <span className="ml-1 opacity-80">({count})</span>
                          {tab === 'New' && count > 0 && <span className="ml-1 text-[#C83A25]">●</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Search Box */}
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Order ID, Customer..."
                      className="w-full sm:w-56 bg-[#FFFDF8] text-xs text-[#17261D] px-3 py-1.5 rounded-lg border border-[#E8DDCA] focus:outline-none"
                    />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-[#FFFDF8] text-xs text-[#4B5149] font-medium px-2 py-1.5 rounded-lg border border-[#E8DDCA] focus:outline-none cursor-pointer"
                    >
                      <option value="Latest First">Latest First</option>
                      <option value="Oldest First">Oldest First</option>
                      <option value="Highest Amount">Highest Amount</option>
                    </select>
                  </div>
                </div>

                {/* Orders List */}
                <div className="space-y-3.5">
                  {filteredOrders.length === 0 ? (
                    <div className="bg-[#FFFDF8] rounded-xl border border-[#E8DDCA] p-8 text-center text-[#77766D]">
                      <p className="text-sm font-bold text-[#17261D]">No orders found for this filter.</p>
                      <p className="text-xs mt-1">Switch to "All Orders" or clear search filter.</p>
                    </div>
                  ) : (
                    filteredOrders.map((order) => {
                      const isNew = order.status === 'New';
                      const isPreparing = order.status === 'Preparing';
                      const isDelivery = order.status === 'Out for Delivery';
                      const isCompleted = order.status === 'Completed';
                      const isDeclined = order.status === 'Declined';

                      return (
                        <div
                          key={order.id}
                          className={`bg-[#FFFDF8] rounded-xl border p-4 sm:p-5 shadow-xs ${
                            isNew ? 'border-[#C9A45C] ring-1 ring-[#C9A45C]/50' : 'border-[#E8DDCA]'
                          }`}
                        >
                          {/* Top Meta Bar */}
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2">
                              {isNew && (
                                <span className="bg-[#FDF3D8] text-[#8F5D2C] border border-[#E8D094] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                  ★ NEW ORDER
                                </span>
                              )}
                              {isPreparing && (
                                <span className="bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                  🍳 PREPARING
                                </span>
                              )}
                              {isDelivery && (
                                <span className="bg-[#DCE8CB] text-[#163E26] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                  🛵 OUT FOR DELIVERY
                                </span>
                              )}
                              {isCompleted && (
                                <span className="bg-[#F3F4F6] text-[#4B5563] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                  ✓ COMPLETED
                                </span>
                              )}
                              {isDeclined && (
                                <span className="bg-[#FEE2E2] text-[#991B1B] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                  ✕ DECLINED
                                </span>
                              )}
                              <span className="font-bold text-sm text-[#17261D]">{order.id}</span>
                            </div>

                            <div className="text-[11px] text-[#77766D]">
                              {order.placedTime} {order.prepTime && `| ${order.prepTime}`}
                            </div>
                          </div>

                          {/* 3-Column Content */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-[#E8DDCA]/60 pt-3 text-xs">
                            
                            {/* Col 1: Customer Details */}
                            <div className="space-y-1">
                              <div className="font-bold text-sm text-[#17261D]">{order.customerName}</div>
                              <div className="text-[#77766D]">{order.customerPhone}</div>
                              <div className="text-[#4B5149] mt-0.5">{order.customerAddressOrTable}</div>
                              <div className="text-[#163E26] font-semibold pt-1">
                                {order.orderType} • {order.paymentMode}
                              </div>
                            </div>

                            {/* Col 2: Dishes List */}
                            <div className="space-y-1.5 border-l-0 md:border-l md:border-r border-[#E8DDCA]/60 md:px-3">
                              <span className="text-[10px] font-bold text-[#77766D] uppercase">
                                Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
                              </span>
                              {order.items.map((it, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs">
                                  <span className="font-medium text-[#17261D] truncate">{it.quantity} × {it.name}</span>
                                  <span className="font-bold text-[#C83A25] shrink-0">₹{it.price}</span>
                                </div>
                              ))}

                              {order.specialInstruction && (
                                <div className="mt-2 p-1.5 bg-[#FAF6EE] border border-[#E8DDCA] rounded text-[11px] text-[#8F5D2C]">
                                  <strong>Note:</strong> {order.specialInstruction}
                                </div>
                              )}
                            </div>

                            {/* Col 3: Total & Actions */}
                            <div className="flex flex-col justify-between space-y-3 md:pl-2">
                              <div>
                                <span className="text-[11px] text-[#77766D]">Total Amount</span>
                                <div className="font-sans text-xl font-bold text-[#C83A25]">
                                  ₹{order.total}
                                </div>
                              </div>

                              <div className="space-y-2">
                                {isNew && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleAcceptOrder(order.id)}
                                      className="w-full bg-[#163E26] hover:bg-[#1E5233] text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                                    >
                                      <span>Accept & Send to Kitchen</span>
                                    </button>
                                    <div className="grid grid-cols-2 gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setDeclineReasonInput('');
                                          setActiveModal({ type: 'decline', title: `Decline Order ${order.id}?`, order });
                                        }}
                                        className="text-[#C83A25] border border-[#C83A25] hover:bg-[#FFF5F3] text-xs font-medium py-1.5 rounded-lg text-center cursor-pointer"
                                      >
                                        ✕ Decline
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setActiveModal({ type: 'kot', title: `Print KOT • ${order.id}`, order })}
                                        className="bg-[#FAF6EE] hover:bg-[#E8DDCA] text-[#4B5149] text-xs font-medium py-1.5 rounded-lg text-center cursor-pointer"
                                      >
                                        🖨 Print KOT
                                      </button>
                                    </div>
                                  </>
                                )}

                                {isPreparing && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenDispatchModal(order)}
                                      className="w-full bg-[#163E26] hover:bg-[#1E5233] text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-xs cursor-pointer"
                                    >
                                      {order.orderType === 'Home Delivery' ? 'Assign Rider & Dispatch →' : 'Mark Ready for Pickup'}
                                    </button>
                                    <div className="grid grid-cols-2 gap-2">
                                      <button
                                        type="button"
                                        onClick={() => setActiveModal({ type: 'details', title: `Order ${order.id} Details`, order })}
                                        className="bg-[#FFFDF8] hover:bg-[#FAF6EE] text-[#4B5149] border border-[#E8DDCA] text-xs font-medium py-1.5 rounded-lg text-center cursor-pointer"
                                      >
                                        View Details
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setActiveModal({ type: 'kot', title: `Print KOT • ${order.id}`, order })}
                                        className="bg-[#FAF6EE] hover:bg-[#E8DDCA] text-[#4B5149] text-xs font-medium py-1.5 rounded-lg text-center cursor-pointer"
                                      >
                                        🖨 Print KOT
                                      </button>
                                    </div>
                                  </>
                                )}

                                {isDelivery && (
                                  <div className="space-y-2">
                                    <div className="bg-[#DCE8CB] text-[#163E26] p-2 rounded-lg text-xs font-semibold">
                                      <div className="flex items-center justify-between">
                                        <span>🛵 Out for Delivery</span>
                                        {order.deliveryPartnerPhone && (
                                          <a
                                            href={`tel:${order.deliveryPartnerPhone}`}
                                            className="underline text-[11px]"
                                          >
                                            Call Rider
                                          </a>
                                        )}
                                      </div>
                                      {order.deliveryPartnerName && (
                                        <div className="text-[11px] font-normal text-[#163E26]/90 mt-0.5">
                                          Rider: {order.deliveryPartnerName} • +91 {order.deliveryPartnerPhone}
                                        </div>
                                      )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <button
                                        type="button"
                                        onClick={() => handleMarkCompleted(order.id)}
                                        className="bg-[#163E26] hover:bg-[#1E5233] text-white text-xs font-medium py-1.5 rounded-lg text-center cursor-pointer"
                                      >
                                        ✓ Mark Delivered
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setActiveModal({ type: 'details', title: `Order ${order.id}`, order })}
                                        className="bg-[#FFFDF8] hover:bg-[#FAF6EE] border border-[#E8DDCA] text-xs font-medium py-1.5 rounded-lg text-center cursor-pointer"
                                      >
                                        Details
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {isCompleted && (
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setActiveModal({ type: 'details', title: `Order ${order.id}`, order })}
                                      className="flex-1 bg-[#FFFDF8] border border-[#E8DDCA] text-xs font-medium py-1.5 rounded-lg text-center cursor-pointer"
                                    >
                                      View Details
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setActiveModal({ type: 'kot', title: `Reprint KOT • ${order.id}`, order })}
                                      className="flex-1 bg-[#FAF6EE] text-[#4B5149] text-xs font-medium py-1.5 rounded-lg text-center cursor-pointer"
                                    >
                                      Reprint KOT
                                    </button>
                                  </div>
                                )}

                                {isDeclined && (
                                  <div className="bg-[#FAF6EE] border border-[#E8DDCA] text-[#77766D] p-2 rounded text-center text-xs">
                                    Declined Order
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            )}

            {/* ======================================================= */}
            {/* 3. MENU ITEMS VIEW                                      */}
            {/* ======================================================= */}
            {activeSection === 'Menu Items' && (
              <div className="space-y-4">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#17261D] tracking-tight">
                      Menu Items Management
                    </h1>
                    <p className="font-sans text-xs sm:text-sm text-[#77766D] mt-0.5">
                      100% Pure Vegetarian menu catalogue. Toggle stock status or update pricing.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveModal({ type: 'add-dish', title: 'Add New Vegetarian Dish' })}
                    className="inline-flex items-center gap-1.5 bg-[#163E26] hover:bg-[#1E5233] text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
                  >
                    <span>+ Add New Dish</span>
                  </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                    {['All', 'North Indian', 'Starters', 'Pizza & Pasta', 'Breads & Rice', 'Beverages & Desserts'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setMenuCategoryFilter(cat)}
                        className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                          menuCategoryFilter === cat
                            ? 'bg-[#163E26] text-white shadow-xs'
                            : 'bg-[#FFFDF8] hover:bg-[#FAF6EE] text-[#4B5149] border border-[#E8DDCA]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={menuSearchQuery}
                    onChange={(e) => setMenuSearchQuery(e.target.value)}
                    placeholder="Search dish by name..."
                    className="w-full sm:w-56 bg-[#FFFDF8] text-xs text-[#17261D] px-3 py-1.5 rounded-lg border border-[#E8DDCA] focus:outline-none"
                  />
                </div>

                {/* Table */}
                <div className="bg-[#FFFDF8] rounded-xl border border-[#E8DDCA] overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF6EE] text-[#77766D] border-b border-[#E8DDCA] text-[11px] uppercase tracking-wider font-semibold">
                        <tr>
                          <th className="py-2.5 px-3 sm:px-4">Dish</th>
                          <th className="py-2.5 px-3 sm:px-4">Category</th>
                          <th className="py-2.5 px-3 sm:px-4">Price</th>
                          <th className="py-2.5 px-3 sm:px-4">Stock</th>
                          <th className="py-2.5 px-3 sm:px-4">Trending 🔥</th>
                          <th className="py-2.5 px-3 sm:px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8DDCA]/70">
                        {filteredMenuItems.map((dish) => (
                          <tr key={dish.id} className="hover:bg-[#FAF6EE]/50">
                            <td className="py-2.5 px-3 sm:px-4">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={dish.image}
                                  alt={dish.name}
                                  className="w-9 h-9 rounded-lg object-cover border border-[#E8DDCA] shrink-0"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/images/dish-detail/rec-dal-makhani.jpg';
                                  }}
                                />
                                <div>
                                  <div className="font-bold text-[#17261D] flex items-center gap-1.5">
                                    <VegBadge />
                                    <span>{dish.name}</span>
                                  </div>
                                  <span className="text-[10px] text-[#A89885]">100% Pure Veg</span>
                                </div>
                              </div>
                            </td>

                            <td className="py-2.5 px-3 sm:px-4">
                              <span className="bg-[#FAF6EE] text-[#8F5D2C] border border-[#E8DDCA] px-2 py-0.5 rounded-full text-[10px] font-medium">
                                {dish.category}
                              </span>
                            </td>

                            <td className="py-2.5 px-3 sm:px-4 font-bold text-sm text-[#17261D]">
                              ₹{dish.price}
                            </td>

                            <td className="py-2.5 px-3 sm:px-4">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  role="switch"
                                  aria-checked={dish.inStock}
                                  onClick={() => handleToggleMenuAvailability(dish.id)}
                                  className={`w-9 h-5 rounded-full relative shrink-0 p-0.5 cursor-pointer ${
                                    dish.inStock ? 'bg-[#163E26]' : 'bg-[#E0D8CB]'
                                  }`}
                                >
                                  <span
                                    className={`block w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform ${
                                      dish.inStock ? 'translate-x-4' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                                <span className={`text-[11px] font-bold ${dish.inStock ? 'text-[#168039]' : 'text-[#C83A25]'}`}>
                                  {dish.inStock ? 'In Stock' : 'Sold Out'}
                                </span>
                              </div>
                            </td>

                            <td className="py-2.5 px-3 sm:px-4">
                              <button
                                type="button"
                                onClick={() => handleToggleTrending(dish.id)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                                  dish.isTrending
                                    ? 'bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B] shadow-2xs'
                                    : 'bg-[#FAF6EE] text-[#77766D] border border-[#E8DDCA] hover:border-[#F59E0B]'
                                }`}
                              >
                                <span>🔥</span>
                                <span>{dish.isTrending ? 'Trending' : 'Normal'}</span>
                              </button>
                            </td>

                            <td className="py-2.5 px-3 sm:px-4 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditDishForm({ ...dish });
                                  setActiveModal({ type: 'edit-dish', title: `Edit ${dish.name}`, dish });
                                }}
                                className="text-xs font-semibold text-[#163E26] hover:text-[#C9A45C] px-2.5 py-1 rounded border border-[#E8DDCA] cursor-pointer"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ======================================================= */}
            {/* 4. ORDER HISTORY VIEW                                   */}
            {/* ======================================================= */}
            {activeSection === 'Order History' && (
              <div className="space-y-4">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#17261D] tracking-tight">
                      Order History & Past Logs
                    </h1>
                    <p className="font-sans text-xs sm:text-sm text-[#77766D] mt-0.5">
                      Review completed and past restaurant orders with itemized billing receipts.
                    </p>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    {(['All', 'Completed', 'Declined'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setHistoryStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                          historyStatusFilter === st
                            ? 'bg-[#163E26] text-white shadow-xs'
                            : 'bg-[#FFFDF8] hover:bg-[#FAF6EE] text-[#4B5149] border border-[#E8DDCA]'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    placeholder="Search ID, customer or phone..."
                    className="w-full sm:w-60 bg-[#FFFDF8] text-xs text-[#17261D] px-3 py-1.5 rounded-lg border border-[#E8DDCA] focus:outline-none"
                  />
                </div>

                {/* Table */}
                <div className="bg-[#FFFDF8] rounded-xl border border-[#E8DDCA] overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF6EE] text-[#77766D] border-b border-[#E8DDCA] text-[11px] uppercase tracking-wider font-semibold">
                        <tr>
                          <th className="py-2.5 px-3 sm:px-4">Order ID</th>
                          <th className="py-2.5 px-3 sm:px-4">Date & Time</th>
                          <th className="py-2.5 px-3 sm:px-4">Customer</th>
                          <th className="py-2.5 px-3 sm:px-4">Fulfillment</th>
                          <th className="py-2.5 px-3 sm:px-4">Total</th>
                          <th className="py-2.5 px-3 sm:px-4">Payment</th>
                          <th className="py-2.5 px-3 sm:px-4">Status</th>
                          <th className="py-2.5 px-3 sm:px-4 text-right">Receipt</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8DDCA]/70">
                        {historyOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-[#FAF6EE]/50">
                            <td className="py-2.5 px-3 sm:px-4 font-bold text-[#17261D]">{order.id}</td>
                            <td className="py-2.5 px-3 sm:px-4 text-[#77766D]">{order.completedTime || order.placedTime}</td>
                            <td className="py-2.5 px-3 sm:px-4">
                              <div className="font-semibold text-[#17261D]">{order.customerName}</div>
                              <div className="text-[10px] text-[#A89885]">{order.customerPhone}</div>
                            </td>
                            <td className="py-2.5 px-3 sm:px-4">{order.orderType}</td>
                            <td className="py-2.5 px-3 sm:px-4 font-bold text-[#C83A25]">₹{order.total}</td>
                            <td className="py-2.5 px-3 sm:px-4 text-[#77766D]">{order.paymentMode}</td>
                            <td className="py-2.5 px-3 sm:px-4">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                order.status === 'Completed'
                                  ? 'bg-[#DCE8CB] text-[#163E26]'
                                  : 'bg-[#FEE2E2] text-[#991B1B]'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 sm:px-4 text-right">
                              <button
                                type="button"
                                onClick={() => setActiveModal({ type: 'receipt', title: `Receipt • ${order.id}`, order })}
                                className="text-xs font-semibold text-[#163E26] hover:text-[#C9A45C] underline cursor-pointer"
                              >
                                View Receipt
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ======================================================= */}
            {/* 5. SETTINGS VIEW                                        */}
            {/* ======================================================= */}
            {activeSection === 'Settings' && (
              <div className="space-y-4 max-w-4xl">
                
                {/* Header */}
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#17261D] tracking-tight">
                    Restaurant Settings
                  </h1>
                  <p className="font-sans text-xs sm:text-sm text-[#77766D] mt-0.5">
                    Essential operational controls, opening hours, and service availability.
                  </p>
                </div>

                {/* Operations Toggles */}
                <div className="bg-[#FFFDF8] rounded-xl border border-[#E8DDCA] p-4 sm:p-5 shadow-xs space-y-3">
                  <h2 className="font-serif text-base font-bold text-[#17261D] border-b border-[#E8DDCA]/60 pb-2">
                    Ordering Availability
                  </h2>

                  {/* Kitchen Status Toggle */}
                  <div className="flex items-center justify-between py-1.5">
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[#17261D]">
                        Kitchen Operations (Accepting Online Orders)
                      </div>
                      <p className="text-xs text-[#77766D]">
                        Pause online order intake during kitchen rush or break hours.
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isKitchenOpen}
                      onClick={async () => {
                        const next = !isKitchenOpen;
                        setIsKitchenOpen(next);
                        showToast(`Kitchen: ${next ? 'Open 🟢' : 'Paused 🔴'}`);
                        try {
                          await api.updateSettings({ is_kitchen_open: next });
                        } catch (err) {
                          console.error('Failed to sync kitchen status:', err);
                        }
                      }}
                      className={`w-11 h-6 rounded-full relative shrink-0 p-0.5 cursor-pointer ${
                        isKitchenOpen ? 'bg-[#163E26]' : 'bg-[#E0D8CB]'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                          isKitchenOpen ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Delivery Service Toggle */}
                  <div className="flex items-center justify-between py-1.5 border-t border-[#E8DDCA]/40">
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[#17261D]">
                        Home Delivery Service
                      </div>
                      <p className="text-xs text-[#77766D]">
                        Toggle doorstep delivery within 15km hub zone.
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={homeDeliveryEnabled}
                      onClick={async () => {
                        const next = !homeDeliveryEnabled;
                        setHomeDeliveryEnabled(next);
                        showToast(`Delivery: ${next ? 'Enabled 🛵' : 'Paused ⏸'}`);
                        try {
                          await api.updateSettings({ home_delivery_enabled: next });
                        } catch (err) {
                          console.error('Failed to sync delivery service status:', err);
                        }
                      }}
                      className={`w-11 h-6 rounded-full relative shrink-0 p-0.5 cursor-pointer ${
                        homeDeliveryEnabled ? 'bg-[#163E26]' : 'bg-[#E0D8CB]'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                          homeDeliveryEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Takeaway Service Toggle */}
                  <div className="flex items-center justify-between py-1.5 border-t border-[#E8DDCA]/40">
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[#17261D]">
                        Takeaway (Self Pickup) Service
                      </div>
                      <p className="text-xs text-[#77766D]">
                        Allow customer pickup directly at Narela Hub counter.
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={takeawayEnabled}
                      onClick={async () => {
                        const next = !takeawayEnabled;
                        setTakeawayEnabled(next);
                        showToast(`Takeaway: ${next ? 'Enabled 🥡' : 'Paused ⏸'}`);
                        try {
                          await api.updateSettings({ takeaway_enabled: next });
                        } catch (err) {
                          console.error('Failed to sync takeaway status:', err);
                        }
                      }}
                      className={`w-11 h-6 rounded-full relative shrink-0 p-0.5 cursor-pointer ${
                        takeawayEnabled ? 'bg-[#163E26]' : 'bg-[#E0D8CB]'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                          takeawayEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Timings & Radius */}
                <div className="bg-[#FFFDF8] rounded-xl border border-[#E8DDCA] p-4 sm:p-5 shadow-xs space-y-3">
                  <h2 className="font-serif text-base font-bold text-[#17261D] border-b border-[#E8DDCA]/60 pb-2">
                    Timings & Hub Specifications
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-[#77766D] block mb-1">Opening Hours</label>
                      <input
                        type="text"
                        value={openingHours}
                        onChange={(e) => setOpeningHours(e.target.value)}
                        className="w-full bg-[#FAF6EE] px-3 py-1.5 rounded-lg border border-[#E8DDCA] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-[#77766D] block mb-1">Avg. Prep Time</label>
                      <input
                        type="text"
                        value={avgKitchenPrepTime}
                        onChange={(e) => setAvgKitchenPrepTime(e.target.value)}
                        className="w-full bg-[#FAF6EE] px-3 py-1.5 rounded-lg border border-[#E8DDCA] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-[#77766D] block mb-1">Max Radius</label>
                      <input
                        type="text"
                        value={deliveryRadius}
                        onChange={(e) => setDeliveryRadius(e.target.value)}
                        className="w-full bg-[#FAF6EE] px-3 py-1.5 rounded-lg border border-[#E8DDCA] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-[#E8DDCA]/40">
                    <div>
                      <label className="font-semibold text-[#77766D] block mb-1">Manager Hotline Phone</label>
                      <input
                        type="text"
                        value={restaurantPhone}
                        onChange={(e) => setRestaurantPhone(e.target.value)}
                        className="w-full bg-[#FAF6EE] px-3 py-1.5 rounded-lg border border-[#E8DDCA] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-[#77766D] block mb-1">Kitchen Dispatch Phone</label>
                      <input
                        type="text"
                        value={kitchenPhone}
                        onChange={(e) => setKitchenPhone(e.target.value)}
                        className="w-full bg-[#FAF6EE] px-3 py-1.5 rounded-lg border border-[#E8DDCA] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 text-right">
                    <button
                      type="button"
                      onClick={handleSaveSettings}
                      className="bg-[#163E26] hover:bg-[#1E5233] text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer shadow-xs"
                    >
                      Save Settings
                    </button>
                  </div>
                </div>

                {/* Homepage Banner Slider Management */}
                <div className="bg-[#FFFDF8] rounded-xl border border-[#E8DDCA] p-4 sm:p-5 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DDCA]/60 pb-3">
                    <div>
                      <h2 className="font-serif text-base font-bold text-[#17261D]">
                        Homepage Banner Slider Management
                      </h2>
                      <p className="text-xs text-[#77766D]">
                        Control mobile and desktop promotional slides shown on the customer homepage.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setBannerForm({
                          title: '',
                          subtitle: '',
                          imageDesktop: '/images/hero-bg-2400.jpg',
                          imageMobile: '/images/hero-bg-mobile-1200.jpg',
                          linkUrl: '#menu',
                          displayOrder: banners.length + 1,
                          isActive: true,
                        });
                        setActiveModal({ type: 'banner', title: 'Add Homepage Banner' });
                      }}
                      className="inline-flex items-center gap-1 bg-[#163E26] hover:bg-[#1E5233] text-white text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer self-start sm:self-auto shadow-xs"
                    >
                      <span>+ Add Banner</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {banners.length === 0 ? (
                      <p className="text-xs text-[#77766D] italic py-2">No custom banners found. Using system defaults.</p>
                    ) : (
                      banners.map((b) => (
                        <div
                          key={b.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#FAF6EE] rounded-lg border border-[#E8DDCA]"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={b.imageMobile || b.imageDesktop}
                              alt={b.title}
                              className="w-16 h-10 object-cover rounded border border-[#E8DDCA] shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/hero-bg-mobile-1200.jpg';
                              }}
                            />
                            <div>
                              <div className="font-bold text-xs text-[#17261D] flex items-center gap-1.5">
                                <span>{b.title}</span>
                                {!b.isActive && (
                                  <span className="text-[10px] bg-[#FCE8E6] text-[#C83A25] px-1.5 py-0.2 rounded font-semibold">
                                    Disabled
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#77766D] line-clamp-1">{b.subtitle || 'No subtitle'}</p>
                              <div className="text-[10px] text-[#A89885] mt-0.5 font-mono">
                                Order: {b.displayOrder ?? 0} &nbsp;|&nbsp; Target: {b.linkUrl}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => handleToggleBannerActive(b.id)}
                              className={`text-[11px] font-semibold px-2.5 py-1 rounded cursor-pointer ${
                                b.isActive
                                  ? 'bg-[#DCE8CB] text-[#163E26] border border-[#163E26]/20'
                                  : 'bg-[#FEE2E2] text-[#C83A25] border border-[#C83A25]/20'
                              }`}
                            >
                              {b.isActive ? 'Active 🟢' : 'Paused ⏸'}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setBannerForm({ ...b });
                                setActiveModal({ type: 'banner', title: `Edit Banner: ${b.title}`, banner: b });
                              }}
                              className="text-[11px] font-semibold text-[#163E26] hover:text-[#C9A45C] px-2.5 py-1 bg-white rounded border border-[#E8DDCA] cursor-pointer"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteBanner(b.id)}
                              className="text-[11px] font-semibold text-[#C83A25] hover:text-red-700 px-2 py-1 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Authorized Administrators Management */}
                <div className="bg-[#FFFDF8] rounded-xl border border-[#E8DDCA] p-4 sm:p-5 shadow-xs space-y-4">
                  <div className="border-b border-[#E8DDCA]/60 pb-3">
                    <h2 className="font-serif text-base font-bold text-[#17261D]">
                      Authorized Administrators Access Control
                    </h2>
                    <p className="text-xs text-[#77766D]">
                      Only mobile numbers listed here can unlock the Greenwood Admin Panel.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#4B5149] block">
                      Add New Authorized Admin Mobile (10 Digits):
                    </label>
                    <div className="flex items-center gap-2 max-w-md">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#77766D]">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={newAdminPhone}
                          onChange={(e) => setNewAdminPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="e.g. 9812345678"
                          className="w-full bg-[#FAF6EE] pl-10 pr-3 py-1.5 rounded-lg border border-[#E8DDCA] text-xs font-semibold text-[#17261D] focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddAdminPhone}
                        className="bg-[#163E26] hover:bg-[#1E5233] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg cursor-pointer whitespace-nowrap shadow-xs"
                      >
                        + Authorize Admin
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="text-xs font-semibold text-[#77766D] mb-2 uppercase tracking-wider text-[10px]">
                      Currently Authorized Admin Devices:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {adminPhones.map((phone) => (
                        <div
                          key={phone}
                          className="flex items-center justify-between p-2.5 bg-[#FAF6EE] rounded-lg border border-[#E8DDCA] text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#168039]" />
                            <span className="font-bold text-[#17261D] font-mono">+91 {phone}</span>
                            {phone === '8802325537' && (
                              <span className="bg-[#FEF3C7] text-[#92400E] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#F59E0B]">
                                Primary Owner
                              </span>
                            )}
                          </div>

                          {phone !== '8802325537' ? (
                            <button
                              type="button"
                              onClick={() => handleRemoveAdminPhone(phone)}
                              className="text-[11px] font-semibold text-[#C83A25] hover:underline cursor-pointer"
                            >
                              Revoke
                            </button>
                          ) : (
                            <span className="text-[10px] text-[#A89885] italic">Locked</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        </main>
      </div>

      {/* ========================================================= */}
      {/* MOBILE ADMIN BOTTOM NAVIGATION BAR                        */}
      {/* (Deshobord, Pending Orders, Menu, Settings, Customer Site)*/}
      {/* ========================================================= */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-[#FFFDF8] border-t border-[#E8DDCA] z-30 px-2 py-1 flex items-center justify-around shadow-lg">
        {/* 1. Dashboard */}
        <button
          type="button"
          onClick={() => setActiveSection('Dashboard')}
          className={`flex flex-col items-center py-1 px-2 cursor-pointer ${
            activeSection === 'Dashboard' ? 'text-[#163E26]' : 'text-[#77766D]'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={activeSection === 'Dashboard' ? '2.5' : '1.8'}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className={`text-[10px] mt-0.5 ${activeSection === 'Dashboard' ? 'font-bold text-[#163E26]' : 'font-medium'}`}>
            Dashboard
          </span>
        </button>

        {/* 2. Pending Orders with dynamic badge */}
        <button
          type="button"
          onClick={() => setActiveSection('Live Orders')}
          className={`flex flex-col items-center py-1 px-2 cursor-pointer relative ${
            activeSection === 'Live Orders' ? 'text-[#163E26]' : 'text-[#77766D]'
          }`}
        >
          <div className="relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={activeSection === 'Live Orders' ? '2.5' : '1.8'}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            {activeOrdersCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#C83A25] text-white text-[9px] font-bold px-1 rounded-full">
                {activeOrdersCount}
              </span>
            )}
          </div>
          <span className={`text-[10px] mt-0.5 ${activeSection === 'Live Orders' ? 'font-bold text-[#163E26]' : 'font-medium'}`}>
            Pending Orders
          </span>
        </button>

        {/* 3. Menu Items */}
        <button
          type="button"
          onClick={() => setActiveSection('Menu Items')}
          className={`flex flex-col items-center py-1 px-2 cursor-pointer ${
            activeSection === 'Menu Items' ? 'text-[#163E26]' : 'text-[#77766D]'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={activeSection === 'Menu Items' ? '2.5' : '1.8'}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className={`text-[10px] mt-0.5 ${activeSection === 'Menu Items' ? 'font-bold text-[#163E26]' : 'font-medium'}`}>
            Menu Items
          </span>
        </button>

        {/* 4. Settings */}
        <button
          type="button"
          onClick={() => setActiveSection('Settings')}
          className={`flex flex-col items-center py-1 px-2 cursor-pointer ${
            activeSection === 'Settings' ? 'text-[#163E26]' : 'text-[#77766D]'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={activeSection === 'Settings' ? '2.5' : '1.8'}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
          <span className={`text-[10px] mt-0.5 ${activeSection === 'Settings' ? 'font-bold text-[#163E26]' : 'font-medium'}`}>
            Settings
          </span>
        </button>

        {/* 5. Switch to Customer Site */}
        <button
          type="button"
          onClick={handleSwitchToCustomerSite}
          className="flex flex-col items-center py-1 px-2 text-[#C9A45C] hover:text-[#B38C40] cursor-pointer"
          title="Switch to Customer Site"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span className="text-[10px] font-bold mt-0.5">
            Customer Site
          </span>
        </button>
      </nav>

      {/* ========================================================= */}
      {/* MODAL DIALOGS                                             */}
      {/* ========================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-[#0B130F]/60 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] rounded-xl max-w-md w-full border border-[#E8DDCA] p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Close */}
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-[#77766D] hover:text-[#17261D] p-1 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="font-serif text-lg font-bold text-[#17261D] mb-3 pr-6">
              {activeModal.title}
            </h3>

            {/* Print KOT */}
            {activeModal.type === 'kot' && activeModal.order && (
              <div className="space-y-2 font-mono text-xs bg-[#FAF6EE] p-3.5 rounded-lg border border-[#E8DDCA] my-2">
                <div className="text-center pb-2 border-b border-dashed border-[#A89885]">
                  <div className="font-bold text-[#17261D]">GREENWOOD CAFÉ & RESTAURANT</div>
                  <div className="text-[10px] text-[#77766D]">*** KITCHEN ORDER TICKET (KOT) ***</div>
                  <div className="text-[11px] font-bold text-[#C83A25]">{activeModal.order.id} | {activeModal.order.orderType}</div>
                </div>

                <div className="py-1.5 border-b border-dashed border-[#A89885] text-[11px]">
                  <div>Customer: {activeModal.order.customerName} ({activeModal.order.customerPhone})</div>
                  <div>Table/Address: {activeModal.order.customerAddressOrTable}</div>
                </div>

                <div className="py-1.5 border-b border-dashed border-[#A89885] space-y-1">
                  {activeModal.order.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{i.quantity} × {i.name}</span>
                      <span>₹{i.price}</span>
                    </div>
                  ))}
                </div>

                {activeModal.order.specialInstruction && (
                  <div className="py-1 text-[#C83A25] font-bold text-[11px]">
                    NOTE: {activeModal.order.specialInstruction}
                  </div>
                )}

                <div className="pt-1.5 flex justify-between font-bold text-[#17261D]">
                  <span>TOTAL BILL:</span>
                  <span>₹{activeModal.order.total}</span>
                </div>
              </div>
            )}

            {/* Details / Receipt */}
            {(activeModal.type === 'details' || activeModal.type === 'receipt') && activeModal.order && (
              <div className="my-2 space-y-2.5 text-xs text-[#4B5149]">
                <div className="p-2.5 bg-[#FAF6EE] rounded-lg border border-[#E8DDCA] space-y-1">
                  <div><strong>Customer:</strong> {activeModal.order.customerName} ({activeModal.order.customerPhone})</div>
                  <div><strong>Location:</strong> {activeModal.order.customerAddressOrTable}</div>
                  <div><strong>Payment Mode:</strong> {activeModal.order.paymentMode}</div>
                  <div><strong>Order Status:</strong> {activeModal.order.status}</div>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {activeModal.order.items.map((i, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 border-b border-[#E8DDCA]/60">
                      <div className="flex items-center gap-1.5">
                        <VegBadge />
                        <span className="font-medium text-[#17261D]">{i.quantity} × {i.name}</span>
                      </div>
                      <span className="font-bold text-[#C83A25]">₹{i.price}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between font-bold text-sm text-[#17261D] pt-2 border-t border-[#E8DDCA]">
                  <span>Total Amount:</span>
                  <span className="text-[#C83A25]">₹{activeModal.order.total}</span>
                </div>
              </div>
            )}

            {/* Decline Order */}
            {activeModal.type === 'decline' && activeModal.order && (
              <div className="my-2 space-y-2.5 text-xs text-[#4B5149]">
                <p>
                  Are you sure you want to decline <strong>{activeModal.order.id}</strong> from <strong>{activeModal.order.customerName}</strong>?
                </p>
                <div>
                  <select
                    onChange={(e) => setDeclineReasonInput(e.target.value)}
                    className="w-full bg-[#FAF6EE] p-2 rounded-lg border border-[#E8DDCA] text-xs mb-2 focus:outline-none"
                  >
                    <option value="Kitchen temporarily overloaded">Kitchen temporarily overloaded</option>
                    <option value="One or more items currently out of stock">One or more items currently out of stock</option>
                    <option value="Delivery address exceeds maximum 15km hub limit">Delivery address exceeds maximum 15km hub limit</option>
                  </select>
                  <textarea
                    rows={2}
                    value={declineReasonInput}
                    onChange={(e) => setDeclineReasonInput(e.target.value)}
                    placeholder="Custom decline reason..."
                    className="w-full bg-[#FAF6EE] p-2 rounded-lg border border-[#E8DDCA] text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Edit Dish */}
            {activeModal.type === 'edit-dish' && activeModal.dish && (
              <div className="my-2 space-y-2.5 text-xs text-[#4B5149]">
                <div>
                  <label className="text-[11px] font-semibold text-[#77766D] block mb-1">Dish Name</label>
                  <input
                    type="text"
                    value={editDishForm.name ?? ''}
                    onChange={(e) => setEditDishForm({ ...editDishForm, name: e.target.value })}
                    className="w-full bg-[#FAF6EE] p-2 rounded-lg border border-[#E8DDCA] text-xs text-[#17261D] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-[#77766D] block mb-1">Category</label>
                    <select
                      value={editDishForm.category}
                      onChange={(e) => setEditDishForm({ ...editDishForm, category: e.target.value as any })}
                      className="w-full bg-[#FAF6EE] p-2 rounded-lg border border-[#E8DDCA] text-xs focus:outline-none"
                    >
                      <option value="North Indian">North Indian</option>
                      <option value="Starters">Starters</option>
                      <option value="Pizza & Pasta">Pizza & Pasta</option>
                      <option value="Breads & Rice">Breads & Rice</option>
                      <option value="Beverages & Desserts">Beverages & Desserts</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#77766D] block mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={editDishForm.price ?? 0}
                      onChange={(e) => setEditDishForm({ ...editDishForm, price: Number(e.target.value) })}
                      className="w-full bg-[#FAF6EE] p-2 rounded-lg border border-[#E8DDCA] text-xs text-[#17261D] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-semibold text-[#17261D]">Availability</span>
                  <button
                    type="button"
                    onClick={() => setEditDishForm({ ...editDishForm, inStock: !editDishForm.inStock })}
                    className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${
                      editDishForm.inStock
                        ? 'bg-[#DCE8CB] text-[#163E26]'
                        : 'bg-[#FEE2E2] text-[#C83A25]'
                    }`}
                  >
                    {editDishForm.inStock ? '● In Stock' : '● Sold Out'}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#E8DDCA]/50">
                  <div>
                    <span className="text-xs font-semibold text-[#17261D] block">Trending Specialty 🔥</span>
                    <span className="text-[10px] text-[#77766D]">Highlight on customer home & signature dishes</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditDishForm({ ...editDishForm, isTrending: !editDishForm.isTrending })}
                    className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${
                      editDishForm.isTrending
                        ? 'bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B]'
                        : 'bg-[#FAF6EE] text-[#77766D] border border-[#E8DDCA]'
                    }`}
                  >
                    {editDishForm.isTrending ? '🔥 Trending' : 'Normal'}
                  </button>
                </div>
              </div>
            )}

            {/* Add Dish */}
            {activeModal.type === 'add-dish' && (
              <div className="my-2 space-y-2.5 text-xs text-[#4B5149]">
                <div>
                  <label className="text-[11px] font-semibold text-[#77766D] block mb-1">Dish Name *</label>
                  <input
                    type="text"
                    value={newDishForm.name}
                    onChange={(e) => setNewDishForm({ ...newDishForm, name: e.target.value })}
                    placeholder="e.g. Kadhai Paneer Special"
                    className="w-full bg-[#FAF6EE] p-2 rounded-lg border border-[#E8DDCA] text-xs text-[#17261D] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-[#77766D] block mb-1">Category *</label>
                    <select
                      value={newDishForm.category}
                      onChange={(e) => setNewDishForm({ ...newDishForm, category: e.target.value as any })}
                      className="w-full bg-[#FAF6EE] p-2 rounded-lg border border-[#E8DDCA] text-xs focus:outline-none"
                    >
                      <option value="North Indian">North Indian</option>
                      <option value="Starters">Starters</option>
                      <option value="Pizza & Pasta">Pizza & Pasta</option>
                      <option value="Breads & Rice">Breads & Rice</option>
                      <option value="Beverages & Desserts">Beverages & Desserts</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#77766D] block mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      value={newDishForm.price}
                      onChange={(e) => setNewDishForm({ ...newDishForm, price: Number(e.target.value) })}
                      className="w-full bg-[#FAF6EE] p-2 rounded-lg border border-[#E8DDCA] text-xs text-[#17261D] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#E8DDCA]/50">
                  <div>
                    <span className="text-xs font-semibold text-[#17261D] block">Mark as Trending Signature Dish 🔥</span>
                    <span className="text-[10px] text-[#77766D]">Display in Trending section immediately</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(newDishForm.isTrending)}
                    onChange={(e) => setNewDishForm({ ...newDishForm, isTrending: e.target.checked })}
                    className="w-4 h-4 text-[#163E26] rounded border-[#E8DDCA]"
                  />
                </div>
              </div>
            )}

            {/* Dispatch Order / Assign Delivery Partner Modal */}
            {activeModal.type === 'dispatch' && activeModal.order && (
              <div className="my-2 space-y-3 text-xs text-[#4B5149]">
                <div className="p-3 bg-[#FAF6EE] rounded-lg border border-[#E8DDCA] space-y-1">
                  <div className="flex justify-between font-bold text-xs text-[#17261D]">
                    <span>Order: {activeModal.order.id}</span>
                    <span className="text-[#168039]">Home Delivery</span>
                  </div>
                  <div><strong>Customer:</strong> {activeModal.order.customerName} ({activeModal.order.customerPhone})</div>
                  <div className="text-[11px] text-[#77766D]"><strong>Destination:</strong> {activeModal.order.customerAddressOrTable}</div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#17261D] block">
                    Assign Delivery Partner Details:
                  </label>
                  <p className="text-[11px] text-[#77766D]">
                    Rider information will be visible to the customer on live tracking only after dispatch.
                  </p>

                  <div>
                    <label className="text-[11px] font-semibold text-[#77766D] block mb-1">Rider Full Name *</label>
                    <input
                      type="text"
                      value={dispatchRiderName}
                      onChange={(e) => setDispatchRiderName(e.target.value)}
                      placeholder="e.g. Vikas Sharma"
                      className="w-full bg-[#FAF6EE] p-2 rounded-lg border border-[#E8DDCA] text-xs font-medium text-[#17261D] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#77766D] block mb-1">Rider 10-Digit Mobile *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#77766D]">+91</span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={dispatchRiderPhone}
                        onChange={(e) => setDispatchRiderPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9811223344"
                        className="w-full bg-[#FAF6EE] pl-10 pr-3 py-2 rounded-lg border border-[#E8DDCA] text-xs font-bold text-[#17261D] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Banner Add / Edit Modal */}
            {activeModal.type === 'banner' && (
              <div className="my-2 space-y-2.5 text-xs text-[#4B5149]">
                <div>
                  <label className="text-[11px] font-semibold text-[#77766D] block mb-1">Banner Title *</label>
                  <input
                    type="text"
                    value={bannerForm.title ?? ''}
                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                    placeholder="e.g. Pure Vegetarian Botanical Feast"
                    className="w-full bg-[#FAF6EE] p-2 rounded-lg border border-[#E8DDCA] text-xs text-[#17261D] focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#77766D] block mb-1">Subtitle / Offer Description</label>
                  <input
                    type="text"
                    value={bannerForm.subtitle ?? ''}
                    onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                    placeholder="e.g. Handcrafted Slow-Cooked Dal Makhani & Artisanal Breads"
                    className="w-full bg-[#FAF6EE] p-2 rounded-lg border border-[#E8DDCA] text-xs text-[#17261D] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-[#77766D] block mb-1">Desktop Image URL</label>
                    <input
                      type="text"
                      value={bannerForm.imageDesktop ?? ''}
                      onChange={(e) => setBannerForm({ ...bannerForm, imageDesktop: e.target.value })}
                      placeholder="/images/hero-bg-2400.jpg"
                      className="w-full bg-[#FAF6EE] p-2 rounded-lg border border-[#E8DDCA] text-xs font-mono text-[#17261D] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#77766D] block mb-1">Mobile Image URL</label>
                    <input
                      type="text"
                      value={bannerForm.imageMobile ?? ''}
                      onChange={(e) => setBannerForm({ ...bannerForm, imageMobile: e.target.value })}
                      placeholder="/images/hero-bg-mobile-1200.jpg"
                      className="w-full bg-[#FAF6EE] p-2 rounded-lg border border-[#E8DDCA] text-xs font-mono text-[#17261D] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-[#77766D] block mb-1">Target Link URL</label>
                    <input
                      type="text"
                      value={bannerForm.linkUrl ?? '#menu'}
                      onChange={(e) => setBannerForm({ ...bannerForm, linkUrl: e.target.value })}
                      placeholder="#menu"
                      className="w-full bg-[#FAF6EE] p-2 rounded-lg border border-[#E8DDCA] text-xs text-[#17261D] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#77766D] block mb-1">Display Order</label>
                    <input
                      type="number"
                      value={bannerForm.displayOrder ?? 1}
                      onChange={(e) => setBannerForm({ ...bannerForm, displayOrder: Number(e.target.value) })}
                      className="w-full bg-[#FAF6EE] p-2 rounded-lg border border-[#E8DDCA] text-xs text-[#17261D] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#E8DDCA]/50">
                  <span className="text-xs font-semibold text-[#17261D]">Banner Status</span>
                  <button
                    type="button"
                    onClick={() => setBannerForm({ ...bannerForm, isActive: !bannerForm.isActive })}
                    className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${
                      bannerForm.isActive
                        ? 'bg-[#DCE8CB] text-[#163E26]'
                        : 'bg-[#FEE2E2] text-[#C83A25]'
                    }`}
                  >
                    {bannerForm.isActive ? '● Active' : '● Inactive'}
                  </button>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="mt-4 pt-3 border-t border-[#E8DDCA] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="bg-[#FAF6EE] text-[#4B5149] px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close
              </button>

              {activeModal.type === 'kot' && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    showToast('Ticket sent to Kitchen Thermal Printer!');
                  }}
                  className="bg-[#163E26] hover:bg-[#1E5233] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Print Ticket
                </button>
              )}

              {activeModal.type === 'decline' && (
                <button
                  type="button"
                  onClick={handleConfirmDecline}
                  className="bg-[#C83A25] hover:bg-[#A82A17] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Confirm Decline
                </button>
              )}

              {activeModal.type === 'edit-dish' && (
                <button
                  type="button"
                  onClick={handleSaveEditDish}
                  className="bg-[#163E26] hover:bg-[#1E5233] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Save Changes
                </button>
              )}

              {activeModal.type === 'add-dish' && (
                <button
                  type="button"
                  onClick={handleAddNewDish}
                  className="bg-[#163E26] hover:bg-[#1E5233] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Add Dish
                </button>
              )}

              {activeModal.type === 'dispatch' && (
                <button
                  type="button"
                  onClick={handleConfirmDispatch}
                  className="bg-[#163E26] hover:bg-[#1E5233] text-white px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Confirm Rider & Dispatch Order
                </button>
              )}

              {activeModal.type === 'banner' && (
                <button
                  type="button"
                  onClick={handleSaveBanner}
                  className="bg-[#163E26] hover:bg-[#1E5233] text-white px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Save Banner
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
