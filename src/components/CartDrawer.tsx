import React from 'react';
import type { Dish } from '../data/restaurantData';
import { VegBadge, WhatsAppIcon } from './Icons';

export interface CartItem {
  dish: Dish;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearCart: () => void;
  orderType: 'delivery' | 'takeaway';
  setOrderType: (type: 'delivery' | 'takeaway') => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onClearCart,
  orderType,
  setOrderType,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const deliveryFee = orderType === 'takeaway' || subtotal > 500 ? 0 : 49;
  const total = subtotal + (items.length > 0 ? deliveryFee : 0);

  const orderSummaryText = items
    .map((i) => `${i.dish.name} x${i.quantity} (₹${i.dish.price * i.quantity})`)
    .join('%0A');
  const whatsappCheckoutUrl = `https://wa.me/919066906607?text=Hi%20Greenwood%20Caf%C3%A9%2C%20I%20would%20like%20to%20place%20an%20order%20(${orderType === 'delivery' ? 'Home%20Delivery' : 'Takeaway'})%3A%0A${orderSummaryText}%0ATotal%3A%20%E2%82%B9${total}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FAF6EE] h-full shadow-2xl flex flex-col justify-between border-l border-[#E8DDCA] animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-[#2B180F] text-[#FAF6EE] flex items-center justify-between border-b border-[#3D2517]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛍️</span>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#E8D094]">Your Food Cart</h3>
              <p className="text-[11px] text-[#C5BDB0]">Greenwood Café &amp; Restaurant Hub</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-sm"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Drawer Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {items.length === 0 ? (
            <div className="py-16 text-center text-[#77766D] space-y-3">
              <span className="text-4xl">🍽️</span>
              <p className="font-serif text-lg font-bold text-[#17261D]">Your cart is empty</p>
              <p className="text-xs">Add some of our chef's signature dishes to start your order!</p>
            </div>
          ) : (
            <>
              {/* Order Mode Toggle in Drawer */}
              <div className="bg-[#FFFDF8] p-2.5 rounded-xl border border-[#E8DDCA] shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#17261D] uppercase tracking-wider">
                  <span>Order Mode</span>
                  <span className="text-[#163E26] normal-case text-[10px]">
                    {orderType === 'delivery' ? 'Delivered in 25 mins' : 'Ready in 15 mins'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      orderType === 'delivery'
                        ? 'bg-[#163E26] text-white shadow-2xs'
                        : 'bg-[#FAF6EE] text-[#4B5149] border border-[#E8DDCA] hover:border-[#163E26]'
                    }`}
                  >
                    <span>🛵</span>
                    <span>Delivery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('takeaway')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      orderType === 'takeaway'
                        ? 'bg-[#163E26] text-white shadow-2xs'
                        : 'bg-[#FAF6EE] text-[#4B5149] border border-[#E8DDCA] hover:border-[#163E26]'
                    }`}
                  >
                    <span>🥡</span>
                    <span>Takeaway</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#E8DDCA]">
                <span className="text-xs font-semibold text-[#17261D]">
                  {items.reduce((acc, i) => acc + i.quantity, 0)} Items Added
                </span>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-xs text-[#C83A25] hover:underline"
                >
                  Clear all
                </button>
              </div>

              {items.map((item) => (
                <div
                  key={item.dish.id}
                  className="flex items-center justify-between gap-3 bg-[#FFFDF8] p-3 rounded-xl border border-[#E8DDCA] shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <VegBadge />
                    <div>
                      <div className="text-sm font-semibold text-[#17261D]">{item.dish.name}</div>
                      <div className="text-xs font-bold text-[#C83A25]">₹{item.dish.price}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.dish.id, -1)}
                      className="w-6 h-6 rounded-md bg-[#FAF6EE] border border-[#E8DDCA] text-[#163E26] font-bold flex items-center justify-center hover:bg-[#E8DDCA] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.dish.id, 1)}
                      className="w-6 h-6 rounded-md bg-[#163E26] text-white font-bold flex items-center justify-center hover:bg-[#1E5233] transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}

              {/* Delivery / Takeaway info box */}
              <div className="p-3 bg-[#DCE8CB]/40 rounded-xl border border-[#C5D8AE] text-xs text-[#163E26] flex items-center justify-between">
                <span className="truncate pr-2">
                  {orderType === 'delivery'
                    ? '⚡ Express Delivery to Narela Hub (Within 15km)'
                    : '📍 Self Pickup at Greenwood Café, Sector-A10 Narela'}
                </span>
                <span className="font-bold shrink-0">
                  {orderType === 'takeaway' || deliveryFee === 0 ? 'FREE' : '₹49'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer & Total */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-[#FFFDF8] border-t border-[#E8DDCA] space-y-3">
            <div className="space-y-1.5 text-xs text-[#4B5149]">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span className="font-semibold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
                <span className="font-semibold">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-bold text-[#17261D] pt-2 border-t border-[#E8DDCA]">
                <span>To Pay</span>
                <span className="text-[#C83A25]">₹{total}</span>
              </div>
            </div>

            <a
              href={whatsappCheckoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#163E26] hover:bg-[#1E5635] text-white py-3 px-4 rounded-full text-sm font-semibold shadow-md transition-all duration-200 hover:scale-[1.01]"
            >
              <WhatsAppIcon className="w-5 h-5" />
              <span>Proceed via WhatsApp (₹{total})</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
