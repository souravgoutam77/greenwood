import React, { useState } from 'react';
import { RESTAURANT_DATA } from '../data/restaurantData';

export type PolicyTab = 'terms' | 'refund' | 'privacy';

interface LegalPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: PolicyTab;
}

export const LegalPolicyModal: React.FC<LegalPolicyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms',
}) => {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#FFFDF8] rounded-2xl border border-[#E8DDCA] shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#2B180F] text-[#FAF6EE] px-5 py-4 flex items-center justify-between border-b border-[#C9A45C]/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-[#C9A45C] text-lg">📜</span>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#FAF6EE]">
                Greenwood Legal &amp; Policies
              </h3>
              <p className="text-[11px] text-[#C5BDB0]">
                100% Pure Vegetarian Fine Dining &bull; Narela, Delhi
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF6EE] flex items-center justify-center text-sm transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Policy Tab Switcher */}
        <div className="bg-[#FAF6EE] border-b border-[#E8DDCA] px-4 pt-2.5 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`py-2 px-3.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-[#FFFDF8] text-[#163E26] border-[#163E26] shadow-xs'
                : 'text-[#646B62] hover:text-[#17261D] border-transparent'
            }`}
          >
            Terms &amp; Conditions
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('refund')}
            className={`py-2 px-3.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 cursor-pointer ${
              activeTab === 'refund'
                ? 'bg-[#FFFDF8] text-[#163E26] border-[#163E26] shadow-xs'
                : 'text-[#646B62] hover:text-[#17261D] border-transparent'
            }`}
          >
            Refund Policy
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`py-2 px-3.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-[#FFFDF8] text-[#163E26] border-[#163E26] shadow-xs'
                : 'text-[#646B62] hover:text-[#17261D] border-transparent'
            }`}
          >
            Privacy Policy
          </button>
        </div>

        {/* Policy Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-[13px] text-[#4B5149] leading-relaxed">
          {activeTab === 'terms' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-[#17261D] mb-1">
                  1. 100% Pure Vegetarian Assurance
                </h4>
                <p>
                  Greenwood Café &amp; Restaurant is strictly a pure vegetarian establishment. We do not use, store, or process meat, poultry, seafood, or egg products anywhere in our kitchen premises. Jain-friendly dishes (without onion and garlic) are prepared in separate hygienic cookware upon request.
                </p>
              </div>

              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-[#17261D] mb-1">
                  2. Order Acceptance &amp; Delivery Timings
                </h4>
                <p>
                  Our kitchen accepts orders daily between <strong>{RESTAURANT_DATA.contact.hours}</strong>. Deliveries are serviced within our active 15 km delivery radius around our Narela Hub. Estimated delivery times (typically 30–45 minutes) may vary slightly during peak lunch/dinner rush or severe weather conditions.
                </p>
              </div>

              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-[#17261D] mb-1">
                  3. Pricing, Taxes &amp; Packaging
                </h4>
                <p>
                  All menu prices are listed in Indian Rupees (₹). Applicable GST (5%) and government-mandated taxes are calculated transparently at checkout. Food is packaged using food-grade, tamper-evident, eco-conscious containers to maintain maximum freshness and heat.
                </p>
              </div>

              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-[#17261D] mb-1">
                  4. Cancellation Policy
                </h4>
                <p>
                  Orders can be cancelled free of charge within 2 minutes of placing them or before the kitchen begins active preparation. Once cooking or baking has commenced, cancellation may not be possible as fresh gourmet dishes are made to order.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-[#DCE8CB]/40 border border-[#163E26]/20 p-3 rounded-xl flex items-start gap-2.5">
                <span className="text-base text-[#163E26]">🛡️</span>
                <p className="text-xs text-[#163E26] font-medium leading-snug">
                  <strong>Greenwood Freshness Guarantee:</strong> If your meal is not freshly prepared, is damaged in transit, or an item is missing, we will make it right immediately.
                </p>
              </div>

              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-[#17261D] mb-1">
                  1. Eligible Refund Scenarios
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#4B5149]">
                  <li>Order cancelled prior to kitchen preparation approval.</li>
                  <li>Tampered packaging, spilled food, or severe transit damage caused during courier transit.</li>
                  <li>Missing dishes or incorrect preparation contrary to your confirmed order ticket.</li>
                  <li>Undelivered orders due to restaurant operational constraints or delivery partner unavailability.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-[#17261D] mb-1">
                  2. Refund Processing Time
                </h4>
                <p>
                  Approved refunds are initiated immediately:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-xs">
                  <li><strong>UPI Payments:</strong> Credited within 2 to 24 hours back to original VPA.</li>
                  <li><strong>Credit / Debit Cards / Netbanking:</strong> Processed within 2 to 4 business days per standard banking cycle.</li>
                  <li><strong>Cash on Delivery:</strong> Reimbursed as store dining credit or instant UPI transfer.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-[#17261D] mb-1">
                  3. How to Request Support
                </h4>
                <p>
                  Contact our restaurant team immediately via WhatsApp at <strong>{RESTAURANT_DATA.contact.phoneDisplay}</strong> or email with your Order ID (e.g. #GW-8495) and a photograph if there is transit damage.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-[#17261D] mb-1">
                  1. Information We Collect
                </h4>
                <p>
                  When you place an order or create a guest profile, we collect minimal operational information required to fulfill your order: your name, contact phone number, delivery address, and food instructions.
                </p>
              </div>

              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-[#17261D] mb-1">
                  2. Use of Your Data
                </h4>
                <p>
                  Your phone number is strictly used for order status updates, delivery coordination via rider phone/WhatsApp, and OTP verification. We <strong>never sell, rent, or lease</strong> your personal contact details to any third-party marketing companies.
                </p>
              </div>

              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-[#17261D] mb-1">
                  3. Payment Security
                </h4>
                <p>
                  We do not store your credit card, debit card, or netbanking credentials on our servers. All digital transactions are securely processed through RBI-authorized payment gateways and encrypted UPI channels.
                </p>
              </div>

              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-[#17261D] mb-1">
                  4. Your Rights
                </h4>
                <p>
                  You can delete your saved delivery addresses or update your guest profile details at any time directly through your Account &amp; Profile page.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer with WhatsApp Support */}
        <div className="bg-[#FAF6EE] px-5 py-3 border-t border-[#E8DDCA] flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-[#77766D]">
            Have questions? Contact <strong>{RESTAURANT_DATA.contact.phoneDisplay}</strong>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="bg-[#163E26] hover:bg-[#1E5635] text-white text-xs font-semibold py-2 px-5 rounded-full transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
