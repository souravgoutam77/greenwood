import React, { useState, useEffect } from 'react';
import { VegBadge } from './Icons';
import { api } from '../services/api';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface PastOrder {
  id: string;
  date: string;
  itemsCount: number;
  total: number;
  status: 'Delivered' | 'Cancelled';
  mainImage: string;
  subImages: string[];
  dishesSummary: string;
  moreCount?: number;
  items: OrderItem[];
}

interface OrdersPageProps {
  onNavigateToMenu?: () => void;
  onNavigateToCart?: () => void;
  onReorder?: (items: OrderItem[]) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  onNavigateToMenu,
  onNavigateToCart,
  onReorder,
}) => {
  // Live Active Order Fallback / Default
  const defaultLiveOrder = {
    id: '#GW-8492',
    placedAt: '12 Jan 2024, 7:15 PM',
    status: 'Preparing in Kitchen',
    eta: 'Arriving in 25–30 mins',
    etaSubtext: 'Your delicious food is on the way!',
    items: [
      {
        id: 'live-1',
        name: 'Shahi Paneer Butter Masala',
        quantity: 1,
        price: 299,
        image: '/images/orders/item1_shahi_paneer.jpg',
      },
      {
        id: 'live-2',
        name: 'Garlic Naan',
        quantity: 2,
        price: 98,
        image: '/images/orders/item2_garlic_naan.jpg',
      },
      {
        id: 'live-3',
        name: 'Mango Lassi',
        quantity: 1,
        price: 129,
        image: '/images/orders/item3_mango_lassi.jpg',
      },
    ],
    address: {
      name: 'Rahul Sharma',
      line1: '123, Green Park, Sector 15',
      line2: 'Noida, Uttar Pradesh – 201301',
      phone: '+91 98765 43210',
    },
    rider: {
      name: 'Amit Kumar',
      status: 'On the way to you',
      rating: '4.8',
      deliveries: '320+ deliveries',
      image: '/images/orders/rider_amit.jpg',
      phone: '+91 98111 22334',
    },
  };

  const [activeOrder, setActiveOrder] = useState<any>(null);
  const liveOrder = activeOrder || defaultLiveOrder;

  // Past Orders History Data (100% Pure Vegetarian)
  const defaultPastOrders: PastOrder[] = [
    {
      id: '#GW-7231',
      date: '5 Jan 2024, 1:20 PM',
      itemsCount: 4,
      total: 542,
      status: 'Delivered',
      mainImage: '/images/orders/past1_thali.jpg',
      subImages: [
        '/images/orders/p1_sub1.jpg',
        '/images/orders/p1_sub2.jpg',
        '/images/orders/p1_sub3.jpg',
      ],
      dishesSummary: 'Paneer Tikka Masala, Garlic Naan, Jeera Rice',
      moreCount: 1,
      items: [
        { id: 'p1-1', name: 'Paneer Tikka Masala', quantity: 1, price: 289, image: '/images/orders/p1_sub1.jpg' },
        { id: 'p1-2', name: 'Garlic Naan', quantity: 2, price: 98, image: '/images/orders/p1_sub2.jpg' },
        { id: 'p1-3', name: 'Jeera Rice', quantity: 1, price: 155, image: '/images/orders/p1_sub3.jpg' },
      ],
    },
    {
      id: '#GW-6885',
      date: '28 Dec 2023, 7:05 PM',
      itemsCount: 3,
      total: 412,
      status: 'Delivered',
      mainImage: '/images/orders/past2_pizza.jpg',
      subImages: [
        '/images/orders/p2_sub1.jpg',
        '/images/orders/p2_sub2.jpg',
      ],
      dishesSummary: 'Farmhouse Pizza, Mango Lassi',
      moreCount: 1,
      items: [
        { id: 'p2-1', name: 'Farmhouse Pizza', quantity: 1, price: 299, image: '/images/orders/p2_sub1.jpg' },
        { id: 'p2-2', name: 'Mango Lassi', quantity: 1, price: 113, image: '/images/orders/p2_sub2.jpg' },
      ],
    },
    {
      id: '#GW-6510',
      date: '14 Dec 2023, 2:30 PM',
      itemsCount: 5,
      total: 620,
      status: 'Cancelled',
      mainImage: '/images/orders/past3_curries.jpg',
      subImages: [
        '/images/orders/p3_sub1.jpg',
        '/images/orders/p3_sub2.jpg',
        '/images/orders/p3_sub3.jpg',
      ],
      dishesSummary: 'Dal Makhani, Butter Naan, Kadhai Paneer',
      moreCount: 2,
      items: [
        { id: 'p3-1', name: 'Dal Makhani', quantity: 1, price: 249, image: '/images/orders/p3_sub1.jpg' },
        { id: 'p3-2', name: 'Butter Naan', quantity: 2, price: 90, image: '/images/orders/p3_sub2.jpg' },
        { id: 'p3-3', name: 'Kadhai Paneer', quantity: 1, price: 281, image: '/images/orders/p3_sub3.jpg' },
      ],
    },
  ];

  const [pastOrders, setPastOrders] = useState<PastOrder[]>(defaultPastOrders);

  // Real-time backend sync for latest live order & past orders
  useEffect(() => {
    const fetchOrders = () => {
      api.getLatestOrder().then((latest) => {
        if (latest) {
          const isDelivery = latest.orderType === 'Home Delivery';
          const isOutForDelivery = latest.status === 'Out for Delivery';
          const hasRider = Boolean(latest.deliveryPartnerName && latest.deliveryPartnerPhone);

          setActiveOrder({
            id: latest.id,
            placedAt: latest.placedTime || 'Recently placed',
            status: latest.status === 'New' ? 'Order Placed & Confirmed' : latest.status === 'Preparing' ? 'Preparing in Kitchen' : latest.status === 'Out for Delivery' ? 'Out for Delivery' : latest.status,
            orderType: latest.orderType,
            eta: latest.status === 'Out for Delivery' ? 'Arriving in 10–15 mins' : latest.status === 'Preparing' ? 'Ready in 15–20 mins' : 'Estimated 25–30 mins',
            etaSubtext: latest.status === 'Out for Delivery' ? (isDelivery ? 'Rider is on the way to your address!' : 'Ready for pickup at counter!') : 'Freshly prepared by Greenwood chefs',
            items: latest.items.map((i, idx) => ({
              id: `live-item-${idx}`,
              name: i.name,
              quantity: i.quantity,
              price: i.price,
              image: i.image || '/images/dish-detail/rec-dal-makhani.jpg',
            })),
            address: {
              name: latest.customerName,
              line1: latest.customerAddressOrTable,
              line2: 'Narela Delivery Zone',
              phone: latest.customerPhone,
            },
            rider: (isOutForDelivery && hasRider)
              ? {
                  name: latest.deliveryPartnerName,
                  status: 'On the way to your address',
                  rating: '4.8',
                  deliveries: 'Greenwood Delivery Partner',
                  image: '/images/orders/rider_amit.jpg',
                  phone: latest.deliveryPartnerPhone,
                }
              : null,
          });
        }
      }).catch(() => {});

      api.getOrders('Completed').then((completed) => {
        if (completed && completed.length > 0) {
          const mapped: PastOrder[] = completed.map((o) => ({
            id: o.id,
            date: o.completedTime || o.placedTime || 'Recently',
            itemsCount: o.items.reduce((s, i) => s + i.quantity, 0),
            total: o.total,
            status: 'Delivered',
            mainImage: o.items[0]?.image || '/images/orders/past1_thali.jpg',
            subImages: o.items.slice(1, 4).map((i) => i.image || '/images/orders/p1_sub1.jpg'),
            dishesSummary: o.items.map((i) => i.name).slice(0, 3).join(', '),
            moreCount: Math.max(0, o.items.length - 3),
            items: o.items.map((i, idx) => ({
              id: `past-it-${idx}`,
              name: i.name,
              quantity: i.quantity,
              price: i.price,
              image: i.image || '/images/dish-detail/rec-dal-makhani.jpg',
            })),
          }));
          setPastOrders(mapped);
        }
      }).catch(() => {});
    };

    fetchOrders();
    const timer = setInterval(fetchOrders, 4000);
    return () => clearInterval(timer);
  }, []);

  // Modal & Toast States
  const [activeModal, setActiveModal] = useState<{
    type: 'details' | 'cancel' | 'address' | 'help' | 'toast';
    title: string;
    message?: string;
    items?: OrderItem[];
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReorderClick = (order: PastOrder) => {
    if (onReorder) {
      onReorder(order.items);
    }
    showToast(`Items from Order ${order.id} added to cart!`);
    if (onNavigateToCart) {
      setTimeout(() => onNavigateToCart(), 800);
    }
  };

  return (
    <div className="w-full bg-[#FAF6EE] min-h-screen text-[#4B5149] pb-28 md:pb-16 relative overflow-hidden font-sans">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-[#163E26] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#2B5E3C] animate-fade-in-down">
          <svg className="w-5 h-5 text-[#C9A45C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        
        {/* ========================================================= */}
        {/* SECTION 1: PAGE HEADER WITH BOTANICAL WATERMARK & DIVIDER */}
        {/* ========================================================= */}
        <div className="relative pt-2 pb-6 text-center sm:text-left sm:pl-16 sm:pr-16">
          {/* Subtle Decorative Leaves in Top Corners */}
          <div className="hidden sm:block absolute -top-2 left-0 w-12 h-16 opacity-85 pointer-events-none">
            <img
              src="/images/orders/clean_leaves_left.jpg"
              alt=""
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>
          <div className="hidden sm:block absolute -top-2 right-0 w-12 h-16 opacity-85 pointer-events-none">
            <img
              src="/images/orders/clean_leaves_right.jpg"
              alt=""
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>

          {/* Faint Background Restaurant Sketch (Desktop) */}
          <div className="hidden lg:block absolute -top-4 right-16 w-80 h-28 opacity-25 pointer-events-none">
            <img
              src="/images/orders/header_sketch.jpg"
              alt=""
              className="w-full h-full object-cover mix-blend-multiply rounded-xl"
            />
          </div>

          {/* Golden Center Flourish Accent */}
          <div className="flex items-center justify-center gap-2 mb-2 text-[#C9A45C]">
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#C9A45C]"></span>
            <svg className="w-4 h-4 text-[#C9A45C]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.52-11 4 4.5-.5 7.5.5 11 2-4.5 1.5-8 2-11 2" />
            </svg>
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#C9A45C]"></span>
          </div>

          {/* Main Title & Subtitle */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#17261D] tracking-tight mb-1.5">
            My Orders
          </h1>
          <div className="flex items-center justify-center sm:justify-start flex-wrap gap-2">
            <p className="font-sans text-xs sm:text-sm text-[#77766D]">
              Track your current order and view your past orders.
            </p>
            {onNavigateToMenu && (
              <>
                <span className="hidden sm:inline text-[#D4C3A3]">•</span>
                <button
                  type="button"
                  onClick={onNavigateToMenu}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#163E26] hover:bg-[#1E5233] text-white font-sans text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
                >
                  <span>Order More Dishes</span>
                  <span>→</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: ACTIVE / LIVE ORDER CARD (Order #GW-8492)     */}
        {/* ========================================================= */}
        <div className="bg-[#FFFDF8] rounded-2xl border border-[#E8DDCA] shadow-sm p-4 sm:p-6 mb-8 relative">
          
          {/* Top Row: Live Order Label + ID + Timestamp + Estimated Arrival Panel */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E8DDCA]">
            <div>
              {/* Green Live Indicator */}
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#168039] animate-pulse"></span>
                <span className="text-[11px] font-bold tracking-widest text-[#163E26] uppercase font-sans">
                  LIVE ORDER
                </span>
              </div>

              {/* Order Heading with Clean Inter Font */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17261D]">
                  Order <span className="font-sans font-bold text-lg sm:text-xl text-[#17261D]">{liveOrder.id}</span>
                </h2>
                <span className="text-xs sm:text-[13px] text-[#77766D] font-sans">
                  Placed on {liveOrder.placedAt}
                </span>
              </div>
            </div>

            {/* Estimated Arrival Box (Soft Botanical Green) */}
            <div className="bg-[#EBF3E6] border border-[#CDE1BE] rounded-xl px-4 py-2.5 flex items-center gap-3 shrink-0 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-[#163E26]/10 flex items-center justify-center text-[#163E26] shrink-0">
                <svg className="w-5 h-5 text-[#163E26]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-[#163E26] leading-tight">
                  {liveOrder.eta}
                </div>
                <div className="text-[11px] text-[#2B5238] font-sans">
                  {liveOrder.etaSubtext}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* FOUR-STAGE ORDER TIMELINE (Confirmed ➔ Preparing ➔ Out ➔ Delivered) */}
          {/* ========================================================= */}
          <div className="py-6 px-1 sm:px-6">
            <div className="relative flex items-center justify-between max-w-3xl mx-auto">
              
              {/* Connecting Lines Behind Stepper (Visible on Desktop & Mobile) */}
              <div className="absolute top-4 sm:top-5 left-6 sm:left-8 right-6 sm:right-8 h-0.5 -z-0 flex items-center">
                {/* Stage 1 to 2: Completed line */}
                <div className="w-1/3 h-0.5 bg-[#163E26]"></div>
                {/* Stage 2 to 3: Active to Upcoming Dotted line */}
                <div className="w-1/3 h-0.5 border-t-2 border-dotted border-[#C9A45C]"></div>
                {/* Stage 3 to 4: Upcoming Dotted line */}
                <div className="w-1/3 h-0.5 border-t-2 border-dotted border-[#D4C3A3]"></div>
              </div>

              {/* Step 1: Order Confirmed (Completed) */}
              <div className="flex flex-col items-center text-center relative z-10 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#163E26] text-white flex items-center justify-center shadow-md mb-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-[11px] sm:text-[13px] font-semibold text-[#163E26] leading-tight">
                  Order Confirmed
                </div>
                <div className="text-[9px] sm:text-[11px] text-[#77766D] mt-0.5">
                  7:15 PM
                </div>
              </div>

              {/* Step 2: Preparing in Kitchen (Current Active) */}
              <div className="flex flex-col items-center text-center relative z-10 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#163E26] text-white flex items-center justify-center shadow-md ring-4 ring-[#DCE8CB] mb-2 animate-pulse">
                  {/* Chef Hat Toque Icon matching reference */}
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
                    <line x1="6" y1="17" x2="18" y2="17" />
                  </svg>
                </div>
                <div className="text-[11px] sm:text-[13px] font-bold text-[#163E26] leading-tight">
                  Preparing in Kitchen
                </div>
                <div className="text-[9px] sm:text-[11px] text-[#163E26] font-medium mt-0.5">
                  7:28 PM
                </div>
              </div>

              {/* Step 3: Out for Delivery (Upcoming) */}
              <div className="flex flex-col items-center text-center relative z-10 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#F5EFE6] border border-[#E0D8CB] text-[#9A9488] flex items-center justify-center mb-2">
                  {/* Delivery Bike Icon */}
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#9A9488]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                    <circle cx="5" cy="17" r="3" />
                    <circle cx="19" cy="17" r="3" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 17h4l3-6h5l2 3h2M9 11h3" />
                  </svg>
                </div>
                <div className="text-[11px] sm:text-[13px] text-[#77766D] leading-tight">
                  Out for Delivery
                </div>
                <div className="text-[9px] sm:text-[11px] text-[#9A9488] mt-0.5">
                  Waiting...
                </div>
              </div>

              {/* Step 4: Delivered (Upcoming) */}
              <div className="flex flex-col items-center text-center relative z-10 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#F5EFE6] border border-[#E0D8CB] text-[#9A9488] flex items-center justify-center mb-2">
                  {/* Home Icon */}
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#9A9488]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div className="text-[11px] sm:text-[13px] text-[#77766D] leading-tight">
                  Delivered
                </div>
                <div className="text-[9px] sm:text-[11px] text-[#9A9488] mt-0.5">
                  Waiting...
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* THREE PANELS: ORDER ITEMS | DELIVERY ADDRESS | RIDER     */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 pt-4 border-t border-[#E8DDCA]">
            
            {/* Panel 1: Order Items (4 items) */}
            <div className="bg-[#FAF6EE]/50 border border-[#E8DDCA] rounded-xl p-3.5 sm:p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif text-sm sm:text-base font-bold text-[#17261D]">
                    Order Items <span className="text-xs font-normal text-[#77766D] font-sans">(4 items)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveModal({
                        type: 'details',
                        title: 'Order Details • #GW-8492',
                        items: liveOrder.items,
                      })
                    }
                    className="text-xs font-medium text-[#163E26] hover:text-[#C9A45C] transition-colors flex items-center gap-1 font-sans"
                  >
                    View Details →
                  </button>
                </div>

                {/* Items List */}
                <div className="space-y-2.5">
                  {liveOrder.items.map((item: any, idx: number) => (
                    <div key={item.id || idx} className="flex items-center justify-between gap-2 text-xs sm:text-[13px]">
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Food Thumbnail */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover border border-[#E8DDCA] shrink-0"
                          onError={(e) => {
                            // Fallback to crisp paneer if image fails
                            (e.target as HTMLImageElement).src = '/images/dish-detail/rec-shahi-paneer.jpg';
                          }}
                        />
                        {/* 100% Pure Veg Indicator */}
                        <VegBadge />
                        <span className="font-serif font-medium text-[#17261D] truncate">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[#77766D] font-sans">{item.quantity} ×</span>
                        <span className="font-semibold text-[#C83A25] font-sans">₹{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel 2: Delivery Address */}
            <div className="bg-[#FAF6EE]/50 border border-[#E8DDCA] rounded-xl p-3.5 sm:p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-2.5 text-[#8F5D2C]">
                  <svg className="w-4 h-4 text-[#C9A45C]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <h3 className="font-serif text-sm sm:text-base font-bold text-[#17261D]">
                    Delivery Address
                  </h3>
                </div>

                <div className="text-xs sm:text-[13px] text-[#4B5149] space-y-1">
                  <div className="font-bold text-[#17261D]">{liveOrder.address.name}</div>
                  <div className="text-[#646B62] leading-relaxed">
                    {liveOrder.address.line1}<br />
                    {liveOrder.address.line2}
                  </div>
                </div>
              </div>

              {/* Change Address Button */}
              <div className="mt-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveModal({
                      type: 'address',
                      title: 'Change Delivery Address',
                      message:
                        'Your order is currently being prepared in the kitchen. To update the drop-off location or delivery instructions, please contact our helpline directly.',
                    })
                  }
                  className="w-full sm:w-auto bg-[#FFFDF8] hover:bg-[#FAF6EE] text-[#2B180F] border border-[#E8DDCA] hover:border-[#C9A45C] text-xs font-medium px-4 py-1.5 rounded-lg transition-colors shadow-2xs"
                >
                  Change Address
                </button>
              </div>
            </div>

            {/* Panel 3: Delivery / Fulfillment Partner */}
            <div className="bg-[#FAF6EE]/50 border border-[#E8DDCA] rounded-xl p-3.5 sm:p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="font-sans text-xs sm:text-sm font-bold text-[#17261D] uppercase tracking-wider">
                    {liveOrder.orderType === 'Takeaway' ? 'Pickup Counter' : 'Delivery Partner'}
                  </h3>
                  <svg className="w-4 h-4 text-[#8F5D2C]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>

                {/* If Out for Delivery AND rider is assigned */}
                {liveOrder.rider && (liveOrder.status === 'Out for Delivery' || activeOrder?.status === 'Out for Delivery') ? (
                  <div>
                    <div className="flex items-center gap-3">
                      <img
                        src={liveOrder.rider.image || '/images/orders/rider_amit.jpg'}
                        alt={liveOrder.rider.name}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-[#163E26]/20 border border-[#E8DDCA]"
                      />
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-[#17261D]">
                          {liveOrder.rider.name}
                        </div>
                        <div className="text-[11px] text-[#163E26] font-medium">
                          {liveOrder.rider.status || 'On the way to you'}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-[#4B5149] mt-0.5">
                          <span className="text-[#C9A45C]">★</span>
                          <span className="font-semibold">{liveOrder.rider.rating || '4.8'}</span>
                          <span className="text-[#77766D]">(Greenwood Partner)</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Buttons: Call Rider + WhatsApp */}
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-2">
                      <a
                        href={`tel:${liveOrder.rider.phone}`}
                        className="bg-[#163E26] hover:bg-[#1E5233] text-white text-xs font-medium py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        Call Rider
                      </a>
                      <a
                        href={`https://wa.me/91${String(liveOrder.rider.phone).replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(`Hi ${liveOrder.rider.name}, I am following up on my Greenwood order ${liveOrder.id}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#FFFDF8] hover:bg-[#F0EBE1] text-[#163E26] border border-[#163E26] text-xs font-medium py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
                        </svg>
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ) : liveOrder.orderType === 'Takeaway' ? (
                  <div>
                    <div className="p-3 bg-[#FAF6EE] rounded-lg border border-[#E8DDCA]">
                      <div className="font-bold text-xs sm:text-sm text-[#17261D] mb-0.5">
                        Self Pickup Order
                      </div>
                      <p className="text-[11px] text-[#77766D] leading-relaxed">
                        Please collect your food package directly from the counter at Greenwood Café &amp; Restaurant, Sector A10, Narela.
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#163E26] font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#168039]"></span>
                      <span>Takeaway packaging prepared fresh</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="p-3 bg-[#FAF6EE] rounded-lg border border-[#E8DDCA]">
                      <div className="font-bold text-xs sm:text-sm text-[#17261D] mb-0.5">
                        Kitchen Preparation
                      </div>
                      <p className="text-[11px] text-[#77766D] leading-relaxed">
                        Your order is being freshly cooked in the Greenwood kitchen. A delivery executive will be assigned automatically upon dispatch.
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#C9A45C] font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#C9A45C] animate-pulse"></span>
                      <span>Partner assignment upon dispatch</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* BOTTOM ROW: NEED HELP? + CANCEL ORDER BUTTON             */}
          {/* ========================================================= */}
          <div className="mt-5 pt-4 border-t border-[#E8DDCA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Need Help link */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FAF6EE] border border-[#E8DDCA] flex items-center justify-center text-[#C9A45C]">
                {/* Lifebuoy / Help Icon */}
                <svg className="w-4 h-4 text-[#C9A45C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="4" />
                  <path strokeLinecap="round" d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setActiveModal({
                      type: 'help',
                      title: 'Need Help with your Order?',
                      message:
                        'For order modifications, delayed delivery assistance, or quality queries, our manager is available at +91 98765 43210 (11 AM to 11 PM).',
                    })
                  }
                  className="text-xs sm:text-[13px] font-bold text-[#17261D] hover:text-[#C9A45C] text-left transition-colors"
                >
                  Need Help?
                </button>
                <div className="text-[11px] text-[#77766D]">
                  Get help with your order
                </div>
              </div>
            </div>

            {/* Cancel Order Button */}
            <div>
              <button
                type="button"
                onClick={() =>
                  setActiveModal({
                    type: 'cancel',
                    title: `Cancel Order ${liveOrder.id}?`,
                    message:
                      'Our kitchen has already started preparing your fresh vegetarian dishes. Orders can only be cancelled within 2 minutes of placement. Would you like to call the café directly?',
                  })
                }
                className="w-full sm:w-auto bg-[#FFFDF8] hover:bg-[#FFF5F3] text-[#C83A25] border border-[#C83A25] hover:border-[#A82B18] text-xs font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel Order
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 3: PREVIOUS ORDERS HISTORY (Compact Elegant Cards) */}
        {/* ========================================================= */}
        <div className="mb-10">
          
          {/* Section Heading with Botanical Leaf Icon */}
          <div className="flex items-center gap-2 mb-1 text-[#163E26]">
            <svg className="w-5 h-5 text-[#163E26]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.52-11 4 4.5-.5 7.5.5 11 2-4.5 1.5-8 2-11 2" />
            </svg>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17261D] tracking-tight">
              Previous Orders
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#77766D] mb-5">
            Your order history
          </p>

          {/* Past Orders List */}
          <div className="space-y-3.5">
            {pastOrders.map((order) => (
              <div
                key={order.id}
                className="bg-[#FFFDF8] rounded-xl border border-[#E8DDCA] p-3 sm:p-4 hover:border-[#C9A45C]/60 transition-all shadow-2xs hover:shadow-xs"
              >
                {/* Desktop View: Horizontal Row Layout */}
                <div className="hidden sm:flex items-center justify-between gap-4">
                  
                  {/* Left Column: Food Thumbnail + Order Number + Date + Total */}
                  <div className="flex items-center gap-3.5 min-w-[240px]">
                    <img
                      src={order.mainImage}
                      alt={order.id}
                      className="w-20 h-14 rounded-lg object-cover border border-[#E8DDCA] shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/dish-detail/rec-shahi-paneer.jpg';
                      }}
                    />
                    <div>
                      <div className="font-sans font-bold text-sm sm:text-base text-[#17261D]">
                        Order {order.id}
                      </div>
                      <div className="text-[11px] text-[#77766D] font-sans">
                        {order.date}
                      </div>
                      <div className="text-xs font-semibold text-[#17261D] mt-0.5 font-sans">
                        {order.itemsCount} items &nbsp;|&nbsp; <span className="text-[#C83A25]">₹{order.total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Mini Thumbnails + Dish Names Snippet */}
                  <div className="flex items-center gap-3 flex-1 px-4 border-l border-r border-[#E8DDCA]/60">
                    <div className="flex items-center -space-x-1 shrink-0">
                      {order.subImages.map((subImg, idx) => (
                        <img
                          key={idx}
                          src={subImg}
                          alt=""
                          className="w-9 h-9 rounded-md object-cover border-2 border-white shadow-2xs"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/dish-detail/rec-shahi-paneer.jpg';
                          }}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-[#4B5149] truncate">
                      <span className="font-medium text-[#17261D]">{order.dishesSummary}</span>
                      {order.moreCount && (
                        <span className="text-[#77766D] ml-1">+{order.moreCount} more</span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Status Badge + Action Button (Reorder / View Details) */}
                  <div className="flex items-center gap-3 shrink-0">
                    {/* Status Badge */}
                    {order.status === 'Delivered' ? (
                      <span className="inline-flex items-center gap-1 bg-[#DCE8CB] text-[#163E26] text-[11px] font-semibold px-3 py-1 rounded-full">
                        <svg className="w-3 h-3 text-[#163E26]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Delivered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-[#FCE8E6] text-[#C83A25] text-[11px] font-semibold px-3 py-1 rounded-full">
                        <svg className="w-3 h-3 text-[#C83A25]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancelled
                      </span>
                    )}

                    {/* Action Button */}
                    {order.status === 'Delivered' ? (
                      <button
                        type="button"
                        onClick={() => handleReorderClick(order)}
                        className="bg-[#163E26] hover:bg-[#1E5233] text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Reorder
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setActiveModal({
                            type: 'details',
                            title: `Order Details • ${order.id}`,
                            items: order.items,
                          })
                        }
                        className="bg-[#FFFDF8] hover:bg-[#FAF6EE] text-[#4B5149] border border-[#E8DDCA] hover:border-[#C9A45C] text-xs font-medium px-3.5 py-2 rounded-lg transition-colors"
                      >
                        View Details
                      </button>
                    )}

                    {/* Chevron Arrow */}
                    <button
                      type="button"
                      onClick={() =>
                        setActiveModal({
                          type: 'details',
                          title: `Order Details (${order.id})`,
                          items: order.items,
                        })
                      }
                      className="text-[#9A9488] hover:text-[#163E26] p-1 transition-colors"
                      aria-label="View Order"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Mobile View: Compact Vertical Stacked Card */}
                <div className="sm:hidden space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-bold text-sm text-[#17261D]">
                      Order {order.id}
                    </span>
                    {order.status === 'Delivered' ? (
                      <span className="inline-flex items-center gap-1 bg-[#DCE8CB] text-[#163E26] text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                        ✓ Delivered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-[#FCE8E6] text-[#C83A25] text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                        ✕ Cancelled
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={order.mainImage}
                      alt={order.id}
                      className="w-16 h-12 rounded-lg object-cover border border-[#E8DDCA] shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/dish-detail/rec-shahi-paneer.jpg';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] text-[#77766D] font-sans">
                        {order.date}
                      </div>
                      <div className="text-xs font-semibold text-[#17261D] mt-0.5 font-sans">
                        {order.itemsCount} items &nbsp;|&nbsp; <span className="text-[#C83A25]">₹{order.total}</span>
                      </div>
                      <div className="text-[11px] text-[#4B5149] truncate mt-0.5">
                        {order.dishesSummary}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E8DDCA]/60 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveModal({
                          type: 'details',
                          title: `Order Details (${order.id})`,
                          items: order.items,
                        })
                      }
                      className="text-xs text-[#163E26] hover:underline font-medium"
                    >
                      View Details →
                    </button>

                    {order.status === 'Delivered' ? (
                      <button
                        type="button"
                        onClick={() => handleReorderClick(order)}
                        className="bg-[#163E26] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs"
                      >
                        ⟳ Reorder
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setActiveModal({
                            type: 'details',
                            title: `Order Details • ${order.id}`,
                            items: order.items,
                          })
                        }
                        className="text-xs font-medium text-[#4B5149] border border-[#E8DDCA] px-3 py-1.5 rounded-lg"
                      >
                        Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL DIALOGS (Details / Cancel / Address / Help)         */}
      {/* ========================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-[#0B130F]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] rounded-2xl max-w-md w-full border border-[#E8DDCA] p-5 sm:p-6 shadow-2xl relative animate-scale-up">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-[#77766D] hover:text-[#17261D] p-1"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Title with clean font for Order IDs */}
            <h3 className="font-sans text-base sm:text-lg font-bold text-[#17261D] mb-3 pr-6">
              {activeModal.title}
            </h3>

            {/* Modal Body */}
            {activeModal.type === 'details' && activeModal.items && (
              <div className="space-y-3 my-4 max-h-60 overflow-y-auto pr-1">
                {activeModal.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs sm:text-sm py-1.5 border-b border-[#E8DDCA]/60">
                    <div className="flex items-center gap-2">
                      <VegBadge />
                      <span className="font-serif font-medium text-[#17261D]">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#77766D] mr-2">{item.quantity} ×</span>
                      <span className="font-semibold text-[#C83A25]">₹{item.price}</span>
                    </div>
                  </div>
                ))}
                <div className="pt-2 text-xs text-[#77766D] flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-medium text-[#17261D]">Cash on Delivery / UPI</span>
                </div>
              </div>
            )}

            {activeModal.message && (
              <p className="text-xs sm:text-sm text-[#4B5149] leading-relaxed my-4">
                {activeModal.message}
              </p>
            )}

            {/* Modal Actions */}
            <div className="mt-5 pt-3 border-t border-[#E8DDCA] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="bg-[#FAF6EE] hover:bg-[#E8DDCA] text-[#4B5149] text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
              {activeModal.type === 'cancel' && (
                <a
                  href="tel:+919066906607"
                  className="bg-[#C83A25] hover:bg-[#A82B18] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Call Restaurant (+91 90669 06607)
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
