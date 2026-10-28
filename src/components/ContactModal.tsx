import React, { useState } from 'react';
import { RESTAURANT_DATA } from '../data/restaurantData';
import { WhatsAppIcon, GoogleMapsIcon } from './Icons';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
    inquiryType: 'Table Reservation',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi Greenwood Café, I would like to inquire about *${formData.inquiryType}*.\nName: ${formData.name}\nPhone: ${formData.phone}\nMessage: ${formData.message}`;
    const url = `https://wa.me/91${RESTAURANT_DATA.contact.phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#FFFDF8] rounded-2xl border border-[#E8DDCA] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#2B180F] text-[#FAF6EE] px-5 py-4 flex items-center justify-between border-b border-[#C9A45C]/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-[#C9A45C] text-xl">🌿</span>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#FAF6EE]">
                Contact Greenwood Café &amp; Restaurant
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

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* Quick Contact Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Phone Card */}
            <div className="bg-[#FAF6EE] p-3.5 rounded-xl border border-[#E8DDCA] flex flex-col justify-between space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#163E26] text-white flex items-center justify-center shrink-0 text-sm">
                  📞
                </div>
                <div>
                  <span className="text-[10px] text-[#77766D] font-medium block">Phone Helpline</span>
                  <a
                    href={`tel:${RESTAURANT_DATA.contact.phone}`}
                    className="font-sans font-bold text-sm text-[#17261D] hover:text-[#163E26] transition-colors"
                  >
                    +91 {RESTAURANT_DATA.contact.phoneDisplay}
                  </a>
                </div>
              </div>
              <a
                href={`tel:${RESTAURANT_DATA.contact.phone}`}
                className="w-full text-center bg-[#163E26] hover:bg-[#1E5635] text-white text-[11px] font-semibold py-1.5 rounded-lg transition-colors block"
              >
                Call Restaurant
              </a>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-[#FAF6EE] p-3.5 rounded-xl border border-[#E8DDCA] flex flex-col justify-between space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <span className="text-[10px] text-[#77766D] font-medium block">WhatsApp Chat</span>
                  <span className="font-sans font-bold text-sm text-[#17261D]">Instant Support</span>
                </div>
              </div>
              <a
                href={RESTAURANT_DATA.contact.whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center bg-[#25D366] hover:bg-[#20BD5A] text-white text-[11px] font-semibold py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Address Card */}
            <div className="bg-[#FAF6EE] p-3.5 rounded-xl border border-[#E8DDCA] sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#8F5D2C] text-white flex items-center justify-center shrink-0 text-sm mt-0.5">
                  📍
                </div>
                <div>
                  <span className="text-[10px] text-[#77766D] font-medium block">Restaurant Address</span>
                  <p className="font-sans text-xs text-[#17261D] leading-snug">
                    {RESTAURANT_DATA.contact.address}
                  </p>
                  <span className="text-[10px] text-[#8F5D2C] block mt-0.5">
                    Open Daily: {RESTAURANT_DATA.contact.hours}
                  </span>
                </div>
              </div>
              <a
                href={RESTAURANT_DATA.socialLinks.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 bg-[#FFFDF8] hover:bg-[#FAF6EE] border border-[#C9A45C] text-[#2B180F] text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                <GoogleMapsIcon className="w-4 h-4" />
                <span>Get Directions</span>
              </a>
            </div>

          </div>

          {/* Quick Message / Table Booking Form */}
          <div className="bg-[#FAF6EE]/80 p-4 rounded-xl border border-[#E8DDCA]">
            <h4 className="font-serif font-bold text-sm text-[#17261D] mb-1">
              Send an Instant Inquiry or Reserve a Table
            </h4>
            <p className="text-[11px] text-[#77766D] mb-3">
              Fill details below and we will directly connect with you on WhatsApp.
            </p>

            <form onSubmit={handleSubmit} className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-semibold text-[#4B5149] block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-[#FFFDF8] border border-[#E8DDCA] rounded-lg px-3 py-1.5 text-xs text-[#17261D] focus:outline-none focus:border-[#163E26]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-[#4B5149] block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full bg-[#FFFDF8] border border-[#E8DDCA] rounded-lg px-3 py-1.5 text-xs text-[#17261D] focus:outline-none focus:border-[#163E26]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-[#4B5149] block mb-1">Inquiry Purpose</label>
                <select
                  value={formData.inquiryType}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  className="w-full bg-[#FFFDF8] border border-[#E8DDCA] rounded-lg px-3 py-1.5 text-xs text-[#17261D] focus:outline-none focus:border-[#163E26]"
                >
                  <option value="Table Reservation">Table Reservation (Family / Party)</option>
                  <option value="Bulk Catering Order">Bulk Catering / Event Order</option>
                  <option value="Jain Food Special Inquiry">Jain Food Special Inquiry</option>
                  <option value="General Feedback">General Feedback or Support</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-[#4B5149] block mb-1">Message (Optional)</label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Date, number of guests, or special dietary request..."
                  className="w-full bg-[#FFFDF8] border border-[#E8DDCA] rounded-lg px-3 py-1.5 text-xs text-[#17261D] focus:outline-none focus:border-[#163E26] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#163E26] hover:bg-[#1E5635] text-white py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
                <span>Send via WhatsApp</span>
              </button>

              {submitted && (
                <div className="text-center text-xs font-semibold text-[#168039] pt-1">
                  ✓ Opening WhatsApp to complete your inquiry!
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-[#FAF6EE] px-5 py-2.5 border-t border-[#E8DDCA] flex items-center justify-between text-[11px] text-[#77766D] shrink-0">
          <span>Delivery within 15 km of Narela Hub</span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-[#163E26] hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
