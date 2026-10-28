import React from 'react';
import { InstagramIcon, GoogleMapsIcon, WhatsAppIcon, ScooterDeliveryIcon } from './Icons';
import { RESTAURANT_DATA } from '../data/restaurantData';

interface FooterProps {
  onNavClick: (href: string) => void;
  onPolicyClick?: (tab: 'terms' | 'refund' | 'privacy') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick, onPolicyClick }) => {
  const handleLegalClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (!onPolicyClick) return;
    if (href.includes('terms')) onPolicyClick('terms');
    else if (href.includes('refund')) onPolicyClick('refund');
    else if (href.includes('privacy')) onPolicyClick('privacy');
  };

  return (
    <footer className="relative w-full bg-[#0B130F] text-[#EAE5D9] pt-5 pb-16 md:pt-8 md:pb-8 border-t border-[#C9A45C]/25 overflow-hidden" aria-label="Site Footer">
      {/* Wood top trim accent */}
      <div className="absolute top-0 left-0 right-0 h-1 wood-plank-trim border-b border-[#C9A45C]/20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================= */}
        {/* DESKTOP 4-COLUMN LAYOUT (Unchanged, rich & structured)    */}
        {/* ========================================================= */}
        <div className="hidden md:grid md:grid-cols-4 gap-6 lg:gap-8 pb-6 md:pb-8 border-b border-[#1A2E22]">
          
          {/* Column 1: Brand */}
          <div className="space-y-3.5">
            <div className="flex items-center">
              <img
                src="/logo-official-trimmed.png"
                alt="Greenwood Café"
                className="h-10 md:h-12 w-auto object-contain drop-shadow-xs"
              />
            </div>

            <div className="font-script text-2xl text-[#E8D094] pt-1">
              {RESTAURANT_DATA.brand.tagline}
            </div>

            <p className="text-xs text-[#C5BDB0] leading-relaxed max-w-xs">
              {RESTAURANT_DATA.brand.description}
            </p>

            <div className="pt-2">
              <span className="inline-block bg-[#163E26] text-[#DCE8CB] text-[11px] font-semibold px-3 py-1 rounded-full border border-[#235C38]">
                100% Pure Vegetarian 🌿
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif text-base lg:text-lg font-bold text-[#FAF6EE] mb-4 tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-[#C5BDB0]">
              {RESTAURANT_DATA.navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavClick(link.href);
                    }}
                    className="hover:text-[#E8D094] transition-colors focus:outline-none flex items-center gap-1.5"
                  >
                    <span className="text-[#C9A45C] text-[10px]">›</span>
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Location */}
          <div>
            <h4 className="font-serif text-base lg:text-lg font-bold text-[#FAF6EE] mb-4 tracking-wide">
              Our Location
            </h4>
            <ul className="space-y-3 text-xs sm:text-[13px] text-[#C5BDB0]">
              <li className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-[#C9A45C] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{RESTAURANT_DATA.contact.address}</span>
              </li>

              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-[#C9A45C] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 4V3z" />
                </svg>
                <a href={`tel:${RESTAURANT_DATA.contact.phone}`} className="hover:text-[#E8D094] transition-colors">
                  {RESTAURANT_DATA.contact.phoneDisplay}
                </a>
              </li>

              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-[#C9A45C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" strokeLinecap="round" />
                </svg>
                <span>{RESTAURANT_DATA.contact.hours}</span>
              </li>

              <li className="flex items-start gap-2.5">
                <ScooterDeliveryIcon className="w-4 h-4 text-[#C9A45C] shrink-0 mt-0.5" />
                <span>{RESTAURANT_DATA.contact.deliveryInfo}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Follow Us & WhatsApp */}
          <div className="space-y-4">
            <h4 className="font-serif text-base lg:text-lg font-bold text-[#FAF6EE] tracking-wide">
              Follow Us
            </h4>
            
            <div className="flex items-center gap-3">
              <a href={RESTAURANT_DATA.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform" title="Instagram" aria-label="Instagram">
                <InstagramIcon className="w-6 h-6" />
              </a>
              <a href={RESTAURANT_DATA.socialLinks.googleMaps} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform" title="Google Maps" aria-label="Google Maps">
                <GoogleMapsIcon className="w-6 h-6" />
              </a>
            </div>

            {/* WhatsApp CTA */}
            <div className="pt-2">
              <a
                href={RESTAURANT_DATA.contact.whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#163E26] hover:bg-[#1E5635] text-white px-4 py-2.5 rounded-full text-xs font-semibold border border-[#235C38] shadow-md transition-all duration-200 hover:scale-105"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* COMPACT MOBILE FOOTER (Request 3: sleek, small height)    */}
        {/* ========================================================= */}
        <div className="md:hidden space-y-3.5 pb-4 border-b border-[#1A2E22]">
          
          {/* Row 1: Brand & Veg badge in one slim line */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <img
                src="/logo-official-trimmed.png"
                alt="Greenwood Café"
                className="h-7 w-auto object-contain drop-shadow-xs"
              />
              <span className="font-script text-base text-[#E8D094]">
                {RESTAURANT_DATA.brand.tagline}
              </span>
            </div>
            <span className="bg-[#163E26] text-[#DCE8CB] text-[9px] font-semibold px-2 py-0.5 rounded-full border border-[#235C38] shrink-0">
              Pure Veg 🌿
            </span>
          </div>

          {/* Row 2: Compact Quick Links Row */}
          <div className="flex items-center justify-around text-xs text-[#C5BDB0] py-1 border-y border-[#1A2E22]/60">
            {RESTAURANT_DATA.navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  onNavClick(link.href);
                }}
                className="hover:text-[#E8D094] transition-colors py-0.5 px-1"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Row 3: Compact Location & Phone Strip */}
          <div className="text-[11px] text-[#A69E8F] text-center space-y-0.5">
            <div>
              📍 {RESTAURANT_DATA.contact.address}
            </div>
            <div>
              📞 <a href={`tel:${RESTAURANT_DATA.contact.phone}`} className="text-[#E8D094] font-medium">+91 {RESTAURANT_DATA.contact.phoneDisplay}</a> &bull; ⏰ {RESTAURANT_DATA.contact.hours}
            </div>
          </div>

          {/* Row 4: WhatsApp Button + Socials in one compact line */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <a
              href={RESTAURANT_DATA.contact.whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#163E26] hover:bg-[#1E5635] text-white py-1.5 px-3.5 rounded-full text-xs font-semibold border border-[#235C38] shadow-xs"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
            <a
              href={RESTAURANT_DATA.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-[#101D16] rounded-full border border-[#1A2E22] hover:text-[#E8D094]"
              title="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href={RESTAURANT_DATA.socialLinks.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-[#101D16] rounded-full border border-[#1A2E22] hover:text-[#E8D094]"
              title="Google Maps"
            >
              <GoogleMapsIcon className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* ========================================================= */}
        {/* BOTTOM BAR: COPYRIGHT & LEGAL WITH MODAL TRIGGERS         */}
        {/* ========================================================= */}
        <div className="pt-3.5 flex flex-col md:flex-row items-center justify-between gap-2.5 text-[11px] text-[#A69E8F] text-center md:text-left">
          <div>
            &copy; {RESTAURANT_DATA.brand.copyrightYear} {RESTAURANT_DATA.brand.name} Café &amp; Restaurant.
          </div>
          
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {RESTAURANT_DATA.legalLinks.map((item, idx) => (
              <React.Fragment key={item.label}>
                <button
                  type="button"
                  onClick={(e) => handleLegalClick(e, item.href)}
                  className="hover:text-[#E8D094] transition-colors focus:outline-none cursor-pointer text-[11px]"
                >
                  {item.label}
                </button>
                {idx < RESTAURANT_DATA.legalLinks.length - 1 && (
                  <span className="text-[#344E3F]" aria-hidden="true">&bull;</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};
