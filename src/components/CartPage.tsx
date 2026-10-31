import React, { useState, useEffect } from 'react';
import type { CartItem } from './CartDrawer';
import { VegBadge, LeafBranch } from './Icons';
import { api } from '../services/api';
import { getCustomerAuth, clearCustomerAuth, type CustomerAuth } from '../services/auth';
import { AuthModal } from './AuthModal';
import { firestore } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface CartPageProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearCart: () => void;
  onNavigateToMenu: () => void;
  orderType: 'delivery' | 'takeaway';
  setOrderType: (type: 'delivery' | 'takeaway') => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  items,
  onUpdateQuantity,
  onClearCart,
  onNavigateToMenu,
  orderType,
  setOrderType,
}) => {
  const [specialNote, setSpecialNote] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Authenticated Customer State (Strict - No Guest Checkout)
  const [auth, setAuth] = useState<CustomerAuth | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // Structured Indian Delivery Address Fields (Clear, Unconfusing)
  const [addrHouse, setAddrHouse] = useState('');
  const [addrArea, setAddrArea] = useState('');
  const [addrLandmark, setAddrLandmark] = useState('');
  const [addrCity, setAddrCity] = useState('Narela, Delhi');
  const [addrPincode, setAddrPincode] = useState('110040');

  // Keep full address formatted and synchronized
  useEffect(() => {
    if (addrHouse || addrArea) {
      const parts = [
        addrHouse.trim(),
        addrArea.trim(),
        addrLandmark.trim() ? `Near ${addrLandmark.trim()}` : null,
        `${addrCity.trim()} - ${addrPincode.trim()}`,
      ].filter(Boolean);
      setCustomerAddress(parts.join(', '));
    }
  }, [addrHouse, addrArea, addrLandmark, addrCity, addrPincode]);
  const [paymentMode, setPaymentMode] = useState<'Cash on Delivery' | 'UPI Payment'>('Cash on Delivery');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string>('');
  const [isKitchenOpen, setIsKitchenOpen] = useState(true);
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState('15');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    // 1. Fetch kitchen status & settings
    api.getSettings().then((s: any) => {
      if (s && isMounted) {
        if (s.is_kitchen_open !== undefined) setIsKitchenOpen(s.is_kitchen_open);
        if (s.delivery_radius) setDeliveryRadiusKm(String(s.delivery_radius).replace(/\D/g, '') || '15');
      }
    }).catch(() => {});

    // Listen to live settings changes
    const handleSettingsUpdate = (e: any) => {
      const s = e.detail;
      if (s && isMounted && s.is_kitchen_open !== undefined) {
        setIsKitchenOpen(s.is_kitchen_open);
      }
    };
    window.addEventListener('gw_settings_updated', handleSettingsUpdate);
    window.addEventListener('storage', handleSettingsUpdate);

    let unsubscribeSettings: (() => void) | null = null;
    if (firestore) {
      try {
        unsubscribeSettings = onSnapshot(doc(firestore, 'settings', 'config'), (snap) => {
          if (snap.exists() && isMounted) {
            const data = snap.data();
            if (data.is_kitchen_open !== undefined) setIsKitchenOpen(data.is_kitchen_open);
          }
        });
      } catch {}
    }

    // 2. Fetch authenticated user session
    const currentAuth = getCustomerAuth();
    if (currentAuth && currentAuth.verified) {
      setAuth(currentAuth);
      setCustomerName(currentAuth.name);
      setCustomerPhone(currentAuth.phone);
    }

    const handleAuthChange = (e: any) => {
      const user = e.detail as CustomerAuth | null;
      setAuth(user);
      if (user && user.verified) {
        setCustomerName(user.name);
        setCustomerPhone(user.phone);
      }
    };

    window.addEventListener('gw_auth_changed', handleAuthChange);
    return () => {
      isMounted = false;
      if (unsubscribeSettings) unsubscribeSettings();
      window.removeEventListener('gw_settings_updated', handleSettingsUpdate);
      window.removeEventListener('storage', handleSettingsUpdate);
      window.removeEventListener('gw_auth_changed', handleAuthChange);
    };
  }, []);

  // Bill Calculations
  const subtotal = items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const packagingFee = items.length > 0 ? 20 : 0;
  const deliveryFee = orderType === 'takeaway' || subtotal >= 499 ? 0 : 40;
  const gst = Math.round(subtotal * 0.05);

  let discount = 0;
  if (appliedCoupon === 'GREENWOOD20') {
    discount = Math.round(subtotal * 0.2);
  } else if (appliedCoupon === 'FREEDEL' && orderType === 'delivery') {
    discount = 40;
  }

  const grandTotal = Math.max(0, subtotal + packagingFee + (appliedCoupon === 'FREEDEL' ? 0 : deliveryFee) + gst - (appliedCoupon === 'GREENWOOD20' ? discount : 0));

  const handleApplyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'GREENWOOD20') {
      setAppliedCoupon('GREENWOOD20');
      setCouponError(null);
      setCouponCode('GREENWOOD20');
    } else if (clean === 'FREEDEL') {
      setAppliedCoupon('FREEDEL');
      setCouponError(null);
      setCouponCode('FREEDEL');
    } else {
      setCouponError('Invalid coupon code. Try GREENWOOD20');
    }
  };

  const handleQuickTag = (tag: string) => {
    if (!specialNote.includes(tag)) {
      setSpecialNote((prev) => (prev ? `${prev}, ${tag}` : tag));
    }
  };

  // Submit verified order to backend & show confirmed modal
  const submitVerifiedOrder = async (verifiedAuth: CustomerAuth) => {
    if (items.length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    setValidationError(null);

    const effectiveName = verifiedAuth.name || customerName.trim() || 'Greenwood Guest';
    const effectivePhone = verifiedAuth.phone || customerPhone.replace(/\D/g, '').slice(-10);

    let assignedId = `#GW-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      // 1. Force Cloud Firestore on Order Placement (Phone -> Database)
      const res = await api.createOrder({
        customerName: effectiveName,
        customerPhone: effectivePhone,
        customerAddress: orderType === 'delivery' ? customerAddress.trim() : 'Narela Hub (Takeaway Counter)',
        orderType,
        paymentMode: 'Cash on Delivery',
        specialInstruction: specialNote.trim() || undefined,
        items: items.map((i) => ({
          dishId: i.dish.id,
          name: i.dish.name,
          price: i.dish.price,
          quantity: i.quantity,
          image: i.dish.image,
        })),
      });

      if (res && res.order) {
        assignedId = res.order.id;
      }
    } catch (error: any) {
      console.error('[Order Placement Error]', error);
      alert('Order failed to reach server: ' + (error?.message || 'Network error occurred'));
      setValidationError(error?.message || 'Order failed to reach server. Please try again.');
      setIsSubmitting(false);
      return;
    } finally {
      setIsSubmitting(false);
    }

    setCreatedOrderId(assignedId);

    // Save active order locally for immediate tracking sync
    try {
      const activeOrderPayload = {
        id: assignedId,
        placedTime: 'Just now',
        status: 'New',
        customerName: effectiveName,
        customerPhone: effectivePhone,
        orderType: orderType === 'delivery' ? 'Home Delivery' : 'Takeaway',
        addressOrTable: orderType === 'delivery' ? customerAddress.trim() : 'Counter Pickup',
        total: grandTotal,
        paymentMode: 'Cash on Delivery',
        items: items.map((i) => ({
          name: i.dish.name,
          quantity: i.quantity,
          price: i.dish.price * i.quantity,
          image: i.dish.image,
        })),
      };
      localStorage.setItem('gw_live_order', JSON.stringify(activeOrderPayload));
    } catch {}

    // Open pre-formatted WhatsApp order message
    try {
      const itemsSummary = items
        .map((i) => `• ${i.dish.name} × ${i.quantity} (₹${i.dish.price * i.quantity})`)
        .join('\n');

      const msg = `🌿 *NEW ORDER [${assignedId}] — GREENWOOD CAFÉ & RESTAURANT* 🌿
-------------------------------------------
*Order ID:* ${assignedId}
*Customer:* ${effectiveName} (Verified Customer)
*Phone:* +91 ${effectivePhone}
*Order Mode:* ${orderType === 'delivery' ? `Home Delivery (Within ${deliveryRadiusKm}km Radius)` : 'Self Takeaway'}
${orderType === 'delivery' ? `*Address:* ${customerAddress.trim()}` : '*Pickup:* Greenwood Café & Restaurant, Sector A10, Narela'}
*Payment Mode:* Cash on Delivery

*Items Ordered:*
${itemsSummary}

${specialNote ? `*Chef Special Note:* ${specialNote}\n` : ''}-------------------------------------------
*Item Subtotal:* ₹${subtotal}
*Packaging & Handling:* ₹${packagingFee}
*Delivery Fee:* ${deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
*GST (5%):* ₹${gst}
${appliedCoupon ? `*Discount Applied (${appliedCoupon}):* -₹${discount}\n` : ''}*GRAND TOTAL:* ₹${grandTotal}
-------------------------------------------
_Please confirm kitchen acceptance and live preparation status!_`;

      const encoded = encodeURIComponent(msg);
      window.open(`https://wa.me/919066906607?text=${encoded}`, '_blank');
    } catch {}

    setOrderSuccess(true);
  };

  // Order Placement Handler: Triggers OTP popup ONLY upon clicking Place Order if unverified
  const handlePlaceOrderWhatsApp = async () => {
    setValidationError(null);

    // Guard 1: Kitchen Operational Status
    if (!isKitchenOpen) {
      setValidationError('Greenwood Café & Restaurant is currently closed for online orders. Please check opening hours or contact us via WhatsApp.');
      return;
    }

    if (!customerName || customerName.trim().length < 2) {
      setValidationError('Please enter your full name before placing the order.');
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setValidationError('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Guard 2: Delivery Address (for Delivery orders)
    if (orderType === 'delivery') {
      if ((!addrHouse.trim() || !addrArea.trim()) && (!customerAddress || customerAddress.trim().length < 5)) {
        setValidationError('Please enter your House/Flat number and Area/Sector for delivery in Narela.');
        return;
      }
    }

    if (items.length === 0 || isSubmitting) return;

    // Guard 3: Customer Identity Verification: Popup ONLY upon clicking Place Order!
    if (!auth || !auth.verified || auth.phone !== cleanPhone) {
      setShowAuthModal(true);
      return;
    }

    await submitVerifiedOrder(auth);
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#4B5149] pb-28 md:pb-16 pt-3 sm:pt-5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#77766D] mb-4 sm:mb-6">
          <button
            type="button"
            onClick={onNavigateToMenu}
            className="hover:text-[#163E26] transition-colors"
          >
            Menu
          </button>
          <span className="text-[#C9A45C] text-[10px]">&gt;</span>
          <span className="text-[#17261D] font-medium">Your Food Cart</span>
        </nav>

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-[#E8DDCA]">
          <div>
            <div className="inline-flex items-center gap-2">
              <LeafBranch flip={false} className="w-5 h-2.5 text-[#163E26]" />
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#17261D] tracking-tight">
                Your Food Cart
              </h1>
              <LeafBranch flip={true} className="w-5 h-2.5 text-[#163E26]" />
            </div>
            <p className="text-xs sm:text-sm text-[#77766D] mt-0.5">
              100% Pure Vegetarian Fine Dining • Fast Delivery from Narela Hub
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={onClearCart}
              className="self-start sm:self-auto text-xs text-[#C83A25] hover:underline font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>🗑️</span>
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {/* EMPTY CART STATE */}
        {items.length === 0 ? (
          <div className="bg-[#FFFDF8] border border-[#E8DDCA] rounded-2xl p-8 sm:p-14 text-center mt-6 shadow-xs max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-full bg-[#FAF6EE] border border-[#E8DDCA] flex items-center justify-center text-3xl mx-auto mb-4">
              🛍️
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17261D] mb-2">
              Your cart is hungry!
            </h2>
            <p className="text-xs sm:text-sm text-[#77766D] leading-relaxed mb-6 max-w-sm mx-auto">
              You haven&apos;t added any delicious dishes yet. Explore our signature pure vegetarian curries, tandoori starters, and breads!
            </p>
            <button
              type="button"
              onClick={onNavigateToMenu}
              className="inline-flex items-center gap-2 bg-[#163E26] hover:bg-[#1E5635] text-white px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>Explore Greenwood Menu</span>
              <span>&rarr;</span>
            </button>
          </div>
        ) : (
          /* ACTIVE CART: 2-COLUMN LAYOUT ON DESKTOP */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mt-6">
            
            {/* LEFT COLUMN: ITEMS & PREFERENCES (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Order Mode Toggle (Delivery vs Takeaway) */}
              <div className="bg-[#FFFDF8] border border-[#E8DDCA] rounded-2xl p-4 shadow-xs">
                <div className="text-xs font-semibold text-[#17261D] mb-3 uppercase tracking-wider">
                  Select Order Type
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      orderType === 'delivery'
                        ? 'bg-[#163E26] text-white border-[#163E26] shadow-sm'
                        : 'bg-[#FAF6EE] text-[#4B5149] border-[#E8DDCA] hover:border-[#163E26]'
                    }`}
                  >
                    <span>🛵</span>
                    <span>Home Delivery (25 Mins)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('takeaway')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      orderType === 'takeaway'
                        ? 'bg-[#163E26] text-white border-[#163E26] shadow-sm'
                        : 'bg-[#FAF6EE] text-[#4B5149] border-[#E8DDCA] hover:border-[#163E26]'
                    }`}
                  >
                    <span>🥡</span>
                    <span>Self Takeaway (15 Mins)</span>
                  </button>
                </div>

                <p className="text-[11px] text-[#77766D] mt-2.5">
                  {orderType === 'delivery'
                    ? '📍 Delivered hot and fresh within 15 km of Narela Hub.'
                    : '📍 Pick up directly at Greenwood Café & Restaurant, Sector-A10, Narela.'}
                </p>
              </div>

              {/* Items List */}
              <div className="bg-[#FFFDF8] border border-[#E8DDCA] rounded-2xl p-4 sm:p-5 shadow-xs divide-y divide-[#E8DDCA]/60">
                <div className="flex items-center justify-between pb-3">
                  <span className="text-xs font-semibold text-[#17261D] uppercase tracking-wider">
                    Cart Items ({items.reduce((s, i) => s + i.quantity, 0)})
                  </span>
                  <button
                    type="button"
                    onClick={onNavigateToMenu}
                    className="text-xs font-semibold text-[#163E26] hover:underline cursor-pointer"
                  >
                    + Add More Dishes
                  </button>
                </div>

                {items.map((item) => (
                  <div key={item.dish.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Dish Thumbnail */}
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-[#FAF6EE] shrink-0 border border-[#E8DDCA]/60">
                        <img
                          src={item.dish.image}
                          alt={item.dish.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 right-1 bg-white/95 p-0.5 rounded-xs">
                          <VegBadge />
                        </div>
                      </div>

                      {/* Name & Unit Price */}
                      <div className="min-w-0">
                        <h3 className="font-serif font-bold text-sm sm:text-base text-[#17261D] truncate">
                          {item.dish.name}
                        </h3>
                        <p className="text-xs text-[#C83A25] font-semibold mt-0.5">
                          ₹{item.dish.price} each
                        </p>
                      </div>
                    </div>

                    {/* Quantity Stepper & Subtotal */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center bg-[#FAF6EE] border border-[#E8DDCA] rounded-lg">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.dish.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-sm font-bold text-[#163E26] hover:bg-[#E8DDCA]/50 rounded-l-lg transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-[#17261D]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.dish.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-sm font-bold text-[#163E26] hover:bg-[#E8DDCA]/50 rounded-r-lg transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-sans font-bold text-sm sm:text-base text-[#17261D] w-16 text-right">
                        ₹{item.dish.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cooking Instructions / Special Requests */}
              <div className="bg-[#FFFDF8] border border-[#E8DDCA] rounded-2xl p-4 sm:p-5 shadow-xs">
                <label htmlFor="cooking-note" className="block text-xs font-semibold text-[#17261D] mb-2 uppercase tracking-wider">
                  Special Cooking Instructions &amp; Requests
                </label>
                <textarea
                  id="cooking-note"
                  rows={2}
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  placeholder="e.g. Jain preparation (no onion/garlic), make it mild spicy, extra green chutney..."
                  className="w-full p-3 bg-[#FAF6EE] border border-[#E8DDCA] rounded-xl text-xs sm:text-sm text-[#17261D] placeholder-[#77766D] focus:outline-none focus:border-[#163E26] transition-colors resize-none"
                />

                {/* Quick Selection Tags */}
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {[
                    'Jain Option (No Onion/Garlic)',
                    'Mild Spicy',
                    'Extra Mint Chutney',
                    'Less Oil / Butter',
                    'No Cutlery Needed 🌱',
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleQuickTag(tag)}
                      className="text-[11px] bg-[#FAF6EE] hover:bg-[#DCE8CB] text-[#163E26] border border-[#E8DDCA] px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: VERIFIED DETAILS, PAYMENT, COUPONS & BILL (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Customer Identification & Delivery Details (No Guest Checkout) */}
              <div className="bg-[#FFFDF8] border border-[#E8DDCA] rounded-2xl p-4 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#17261D] uppercase tracking-wider">
                    Customer &amp; Delivery Details
                  </span>
                  {auth?.verified ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-[#DCE8CB] text-[#163E26] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                        <span>✓</span>
                        <span>Verified Mobile (+91 {auth.phone ? `${auth.phone.slice(0, 5)} XXXXX` : ''})</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          clearCustomerAuth();
                          setAuth(null);
                          setCustomerPhone('');
                        }}
                        className="text-[10px] text-[#C83A25] font-semibold hover:underline cursor-pointer"
                        title="Log Out / Switch Account"
                      >
                        (Log Out)
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-[#77766D] font-medium">
                      OTP on place order
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#4B5149] mb-1">
                        Full Name <span className="text-[#C83A25]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#E8DDCA] rounded-xl text-xs sm:text-sm text-[#17261D] focus:outline-none focus:border-[#163E26]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#4B5149] mb-1">
                        10-Digit Mobile Number <span className="text-[#C83A25]">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#77766D]">+91</span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="98765 XXXXX"
                          className="w-full pl-11 pr-3 py-2 bg-[#FAF6EE] border border-[#E8DDCA] rounded-xl text-xs sm:text-sm text-[#17261D] font-mono focus:outline-none focus:border-[#163E26]"
                        />
                      </div>
                    </div>
                  </div>

                  {orderType === 'delivery' && (
                    <div className="space-y-2.5 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-[#4B5149]">
                          Delivery Address Details <span className="text-[#C83A25]">*</span>
                        </label>
                        <span className="text-[10px] text-[#163E26] font-medium">
                          Hub Delivery (within {deliveryRadiusKm} km)
                        </span>
                      </div>

                      {/* 1. House / Flat & Building */}
                      <div>
                        <input
                          type="text"
                          required
                          value={addrHouse}
                          onChange={(e) => setAddrHouse(e.target.value)}
                          placeholder="House / Flat No., Floor, Building Name *"
                          className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#E8DDCA] rounded-xl text-xs sm:text-sm text-[#17261D] focus:outline-none focus:border-[#163E26]"
                        />
                      </div>

                      {/* 2. Street, Sector, Area */}
                      <div>
                        <input
                          type="text"
                          required
                          value={addrArea}
                          onChange={(e) => setAddrArea(e.target.value)}
                          placeholder="Street, Area, Pocket or Sector (e.g. Sector A10, Pocket 6) *"
                          className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#E8DDCA] rounded-xl text-xs sm:text-sm text-[#17261D] focus:outline-none focus:border-[#163E26]"
                        />
                      </div>

                      {/* 3. Nearby Landmark (Lending mark) */}
                      <div>
                        <input
                          type="text"
                          value={addrLandmark}
                          onChange={(e) => setAddrLandmark(e.target.value)}
                          placeholder="Nearby Landmark (e.g. Near Shiv Mandir / Opp DDA Park)"
                          className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#E8DDCA] rounded-xl text-xs sm:text-sm text-[#17261D] focus:outline-none focus:border-[#163E26]"
                        />
                      </div>

                      {/* 4. City & Pincode (Compact 2-col) */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-[#77766D] font-semibold mb-0.5">City</label>
                          <input
                            type="text"
                            required
                            value={addrCity}
                            onChange={(e) => setAddrCity(e.target.value)}
                            placeholder="Narela, Delhi"
                            className="w-full px-3 py-1.5 bg-[#FAF6EE] border border-[#E8DDCA] rounded-xl text-xs text-[#17261D] focus:outline-none focus:border-[#163E26]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#77766D] font-semibold mb-0.5">Pincode</label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={addrPincode}
                            onChange={(e) => setAddrPincode(e.target.value.replace(/\D/g, ''))}
                            placeholder="110040"
                            className="w-full px-3 py-1.5 bg-[#FAF6EE] border border-[#E8DDCA] rounded-xl text-xs text-[#17261D] font-mono focus:outline-none focus:border-[#163E26]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-[#77766D] mt-2.5">
                  📍 Verified orders are synchronized in real-time with Greenwood Narela kitchen &amp; delivery rider.
                </p>
              </div>

              {/* Payment Mode Selection */}
              <div className="bg-[#FFFDF8] border border-[#E8DDCA] rounded-2xl p-4 sm:p-5 shadow-xs">
                <span className="block text-xs font-semibold text-[#17261D] mb-2.5 uppercase tracking-wider">
                  Payment Method
                </span>

                <div className="space-y-2">
                  {/* Cash on Delivery */}
                  <label className="flex items-center justify-between p-3 rounded-xl border border-[#163E26] bg-[#DCE8CB]/20 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="paymentMode"
                        checked={paymentMode === 'Cash on Delivery'}
                        onChange={() => setPaymentMode('Cash on Delivery')}
                        className="text-[#163E26] focus:ring-[#163E26]"
                      />
                      <div>
                        <div className="text-xs font-semibold text-[#17261D]">
                          Cash on Delivery / Pay on Pickup
                        </div>
                        <div className="text-[10px] text-[#77766D]">
                          Pay cash or scan QR at your doorstep
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-[#163E26] text-white px-2 py-0.5 rounded-full font-medium">
                      Active
                    </span>
                  </label>

                  {/* UPI Payment - Disabled Coming Soon */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-[#E8DDCA] bg-[#FAF6EE]/60 opacity-65 cursor-not-allowed">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="paymentMode"
                        disabled
                        checked={false}
                        className="text-gray-400 cursor-not-allowed"
                      />
                      <div>
                        <div className="text-xs font-semibold text-[#4B5149]">
                          Instant UPI (GPay / PhonePe / Paytm)
                        </div>
                        <div className="text-[10px] text-[#77766D]">
                          Direct in-app payment gateway
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-[#E8DDCA] text-[#4B5149] px-2 py-0.5 rounded-full font-semibold">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </div>

              {/* Coupons & Promo Codes */}
              <div className="bg-[#FFFDF8] border border-[#E8DDCA] rounded-2xl p-4 sm:p-5 shadow-xs">
                <span className="block text-xs font-semibold text-[#17261D] mb-2 uppercase tracking-wider">
                  Apply Coupon Code
                </span>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      setCouponError(null);
                    }}
                    placeholder="Enter code (e.g. GREENWOOD20)"
                    className="flex-1 px-3 py-2 bg-[#FAF6EE] border border-[#E8DDCA] rounded-xl text-xs uppercase font-medium text-[#17261D] focus:outline-none focus:border-[#163E26]"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon(couponCode)}
                    className="bg-[#163E26] hover:bg-[#1E5635] text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {couponError && (
                  <p className="text-[11px] text-[#C83A25] mt-1.5">{couponError}</p>
                )}

                {appliedCoupon && (
                  <div className="mt-2.5 p-2 bg-[#DCE8CB]/60 border border-[#A7C89A] rounded-xl flex items-center justify-between text-xs text-[#163E26]">
                    <span>🎉 <strong>{appliedCoupon}</strong> applied successfully!</span>
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponCode('');
                      }}
                      className="text-[#C83A25] font-bold text-xs hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Available Coupons Shortcut */}
                <div className="mt-3 pt-2.5 border-t border-[#E8DDCA]/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#17261D]">GREENWOOD20</span>
                    <span className="text-[#77766D] text-[11px] block">Flat 20% off on first order</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon('GREENWOOD20')}
                    className="text-[#163E26] font-semibold text-xs hover:underline cursor-pointer"
                  >
                    Apply &rarr;
                  </button>
                </div>
              </div>

              {/* Bill Details Breakdown */}
              <div className="bg-[#FFFDF8] border border-[#E8DDCA] rounded-2xl p-4 sm:p-5 shadow-xs space-y-2.5">
                <span className="block text-xs font-semibold text-[#17261D] pb-1 border-b border-[#E8DDCA]/60 uppercase tracking-wider">
                  Bill Summary
                </span>

                <div className="flex items-center justify-between text-xs text-[#4B5149]">
                  <span>Item Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#4B5149]">
                  <span>Packaging &amp; Handling</span>
                  <span>₹{packagingFee}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#4B5149]">
                  <span>Delivery Partner Fee</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <strong className="text-[#163E26]">FREE</strong>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#4B5149]">
                  <span>Taxes (5% GST)</span>
                  <span>₹{gst}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-xs text-[#163E26] font-semibold">
                    <span>Coupon Discount ({appliedCoupon})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="pt-2.5 border-t border-[#E8DDCA] flex items-center justify-between">
                  <div>
                    <span className="font-serif font-bold text-base sm:text-lg text-[#17261D]">
                      Grand Total
                    </span>
                    <span className="block text-[10px] text-[#77766D]">Inclusive of all taxes</span>
                  </div>
                  <span className="font-sans font-bold text-xl sm:text-2xl text-[#C83A25]">
                    ₹{grandTotal}
                  </span>
                </div>

                {/* Validation Error Message */}
                {validationError && (
                  <div className="p-2.5 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-center text-xs text-[#C83A25] font-medium">
                    ⚠️ {validationError}
                  </div>
                )}

                {/* Kitchen Status Notice */}
                {!isKitchenOpen && (
                  <div className="p-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl text-center text-xs text-[#92400E] mb-2 leading-relaxed">
                    ⚠️ <strong>Kitchen Closed:</strong> Greenwood Café is currently not accepting online orders. Operational hours: 11:00 AM – 11:00 PM. Please browse our menu or WhatsApp us.
                  </div>
                )}

                {/* Primary Action Button */}
                {!isKitchenOpen ? (
                  <button
                    type="button"
                    disabled
                    className="w-full mt-3 bg-gray-400 text-white py-3 rounded-xl font-semibold text-sm shadow-none cursor-not-allowed opacity-80"
                  >
                    Kitchen Currently Closed • Reopening Soon
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handlePlaceOrderWhatsApp}
                    className="w-full mt-3 bg-[#163E26] hover:bg-[#1E5635] text-white py-3 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-75"
                  >
                    <span>{isSubmitting ? 'Placing Order...' : `Place Order • ₹${grandTotal}`}</span>
                    <span>&rarr;</span>
                  </button>
                )}

                <p className="text-center text-[10px] text-[#77766D]">
                  ⚡ Fast order dispatch from Sector A10, Narela. Pay upon delivery.
                </p>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Mobile OTP Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(user) => {
          setAuth(user);
          setCustomerName(user.name);
          setCustomerPhone(user.phone);
          setShowAuthModal(false);
          submitVerifiedOrder(user);
        }}
        initialName={customerName}
        initialPhone={customerPhone}
      />

      {/* Success Modal / Toast */}
      {orderSuccess && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setOrderSuccess(false)}
        >
          <div
            className="w-full max-w-sm bg-[#FFFDF8] rounded-2xl p-6 border border-[#E8DDCA] shadow-2xl text-center space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-[#DCE8CB] text-[#163E26] mx-auto flex items-center justify-center text-2xl font-bold">
              ✓
            </div>
            <h3 className="font-serif text-xl font-bold text-[#17261D]">
              Order Confirmed!
            </h3>
            {/* Clean Inter font for Order ID */}
            <div className="inline-block px-3 py-1 bg-[#FAF6EE] border border-[#E8DDCA] rounded-full font-sans font-semibold text-sm text-[#17261D]">
              Order ID: {createdOrderId}
            </div>
            <p className="text-xs text-[#77766D] leading-relaxed">
              Your verified order has been submitted to Greenwood Narela kitchen. You can track real-time preparation &amp; rider status!
            </p>
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setOrderSuccess(false);
                  onClearCart();
                  window.location.hash = '#orders';
                }}
                className="w-full bg-[#163E26] text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-[#1E5635] transition-colors cursor-pointer"
              >
                Track Live Order ({createdOrderId}) →
              </button>
              <button
                type="button"
                onClick={() => {
                  setOrderSuccess(false);
                  onClearCart();
                  onNavigateToMenu();
                }}
                className="w-full bg-[#FAF6EE] text-[#4B5149] border border-[#E8DDCA] py-2 rounded-xl text-xs font-semibold hover:bg-[#E8DDCA] transition-colors cursor-pointer"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
