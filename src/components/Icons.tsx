import React from 'react';

// Stylized Golden Leaf Logo Mark matching the reference image
export const GreenwoodLeafIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path
      d="M8 39C8 39 12 26 21 17C30 8 40 7 40 7C40 7 38 18 29 27C20 36 8 39 8 39Z"
      fill="url(#leafGoldGrad)"
      stroke="#C9A45C"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Veins */}
    <path d="M8 39C16 31 25 21 40 7" stroke="#7C591D" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M17 30C22 29 27 26 31 22" stroke="#7C591D" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M23 24C27 22 31 19 34 14" stroke="#7C591D" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M19 21C16 19 14 17 13 14" stroke="#7C591D" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M26 15C23 13 21 11 19 8" stroke="#7C591D" strokeWidth="1.2" strokeLinecap="round" />
    <defs>
      <linearGradient id="leafGoldGrad" x1="8" y1="39" x2="40" y2="7" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F5DC9A" />
        <stop offset="0.5" stopColor="#C9A45C" />
        <stop offset="1" stopColor="#966F2A" />
      </linearGradient>
    </defs>
  </svg>
);

// Botanical Leaf Branch Flourish for Section Headings
export const LeafBranch: React.FC<{ flip?: boolean; className?: string }> = ({ flip = false, className = "w-9 h-5 inline-block" }) => (
  <svg
    viewBox="0 0 60 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${flip ? 'scale-x-[-1]' : ''}`}
    aria-hidden="true"
  >
    {/* Stem */}
    <path d="M2 14C16 14 34 12 56 10" stroke="#254C31" strokeWidth="1.8" strokeLinecap="round" />
    {/* Terminal Leaf */}
    <path d="M58 9.5C53 6 46 6 45 10.5C47 13 54 12.5 58 9.5Z" fill="#2E5A3A" />
    {/* Upper Leaf 1 */}
    <path d="M42 11C38 5 31 6 32 10.5C33 13 39 13.5 42 11Z" fill="#3D6649" />
    {/* Upper Leaf 2 */}
    <path d="M28 12C24 6 18 7 19 11.5C20 14 26 14.5 28 12Z" fill="#4E785A" />
    {/* Lower Leaf 1 */}
    <path d="M46 11C43 17 36 17 35 13C37 11 43 10.5 46 11Z" fill="#274D2E" />
    {/* Lower Leaf 2 */}
    <path d="M33 12.5C30 18 23 18 22 14C24 12 30 11.5 33 12.5Z" fill="#366143" />
  </svg>
);

// Botanical Ivy Leaf Shape
const IvyLeaf: React.FC<{ x: number; y: number; scale?: number; rotate?: number; color?: string }> = ({
  x,
  y,
  scale = 1,
  rotate = 0,
  color = "#2E5A3A",
}) => (
  <g transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}>
    {/* Distinct 3-lobed ivy leaf */}
    <path
      d="M0 -15 C-4 -12 -9 -5 -14 -4 C-17 -3 -16 5 -10 8 C-6 10 -4 14 0 16 C4 14 6 10 10 8 C16 5 17 -3 14 -4 C9 -5 4 -12 0 -15 Z"
      fill={color}
      stroke="#193821"
      strokeWidth="0.8"
    />
    <path d="M0 16 L0 -12" stroke="#1F4229" strokeWidth="0.7" />
    <path d="M0 2 L-8 -2" stroke="#1F4229" strokeWidth="0.5" />
    <path d="M0 2 L8 -2" stroke="#1F4229" strokeWidth="0.5" />
  </g>
);

// Trailing Ivy Vine for outer margins framing the page
export const TrailingIvyLeft: React.FC<{ className?: string }> = ({ className = "w-20 h-auto" }) => (
  <svg viewBox="0 0 90 600" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    {/* Main Curving Vine Stem */}
    <path
      d="M15 0 C25 80 5 160 30 250 C55 340 10 420 35 510 C45 550 20 590 15 600"
      stroke="#204229"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    {/* Secondary Vine Twig */}
    <path d="M18 120 C40 130 55 160 65 190" stroke="#2B5436" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    <path d="M26 310 C45 325 58 360 62 390" stroke="#2B5436" strokeWidth="1.6" strokeLinecap="round" fill="none" />

    {/* Clusters of Ivy Leaves along the vine */}
    <IvyLeaf x={24} y={35} scale={1.2} rotate={25} color="#2A5334" />
    <IvyLeaf x={12} y={75} scale={1.4} rotate={-35} color="#366540" />
    <IvyLeaf x={30} y={115} scale={1.1} rotate={45} color="#254C2F" />
    
    <IvyLeaf x={48} y={150} scale={1.3} rotate={55} color="#3D7048" />
    <IvyLeaf x={65} y={190} scale={1.0} rotate={30} color="#2A5334" />
    <IvyLeaf x={14} y={195} scale={1.5} rotate={-20} color="#34633E" />

    <IvyLeaf x={28} y={250} scale={1.3} rotate={40} color="#254C2F" />
    <IvyLeaf x={42} y={285} scale={1.1} rotate={-15} color="#3D7048" />

    <IvyLeaf x={32} y={335} scale={1.4} rotate={35} color="#2A5334" />
    <IvyLeaf x={58} y={370} scale={1.2} rotate={60} color="#34633E" />
    <IvyLeaf x={18} y={395} scale={1.5} rotate={-45} color="#254C2F" />

    <IvyLeaf x={26} y={450} scale={1.2} rotate={20} color="#3D7048" />
    <IvyLeaf x={42} y={490} scale={1.4} rotate={-30} color="#2A5334" />
    <IvyLeaf x={22} y={540} scale={1.3} rotate={35} color="#34633E" />
    <IvyLeaf x={16} y={585} scale={1.0} rotate={-10} color="#254C2F" />
  </svg>
);

export const TrailingIvyRight: React.FC<{ className?: string }> = ({ className = "w-20 h-auto" }) => (
  <div className={`scale-x-[-1] ${className}`}>
    <TrailingIvyLeft className="w-full h-full" />
  </div>
);

// 100% Pure Vegetarian Indicator
export const VegBadge: React.FC = () => (
  <span className="w-4 h-4 bg-white/95 rounded border border-[#168039] flex items-center justify-center p-0.5 shadow-xs" title="100% Pure Vegetarian">
    <span className="w-2 h-2 rounded-full bg-[#168039]"></span>
  </span>
);

// Category Icons
export const CategoryIcon: React.FC<{ type: string; active?: boolean }> = ({ type, active = false }) => {
  const iconColor = active ? '#FAF6EE' : '#8F5D2C';

  switch (type) {
    case 'cloche': // All
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 22H26" />
          <path d="M8 22A8 8 0 0 1 24 22" />
          <path d="M16 10V7" />
          <circle cx="16" cy="6" r="1.5" fill={iconColor} />
          <path d="M5 25H27" />
        </svg>
      );
    case 'starters': // French fries
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 14L10 26H22L23 14" />
          <path d="M11 14L12 6" />
          <path d="M14 14L15 5" />
          <path d="M17 14L17 4" />
          <path d="M20 14L19 6" />
          <path d="M9 14H23" />
        </svg>
      );
    case 'main-course': // Curry bowl
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 14C6 20 10.5 24 16 24C21.5 24 26 20 26 14H6Z" />
          <path d="M11 9C11 11 13 11 13 13" />
          <path d="M16 8C16 10 18 10 18 13" />
          <path d="M21 9C21 11 23 11 23 13" />
          <path d="M10 25H22" />
        </svg>
      );
    case 'south-indian': // Dosa platter
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="16" cy="20" rx="11" ry="5" />
          <path d="M7 17C10 10 22 10 25 17" />
          <ellipse cx="12" cy="19" rx="2.5" ry="1.2" fill={iconColor} opacity="0.3" />
          <ellipse cx="19" cy="19" rx="2" ry="1" fill={iconColor} opacity="0.3" />
        </svg>
      );
    case 'chinese': // Noodles & chopsticks
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 15C7 21 11 25 16 25C21 25 25 21 25 15H7Z" />
          <path d="M10 15C10 12 12 10 16 10C20 10 22 12 22 15" />
          <path d="M24 7L13 18" />
          <path d="M27 9L15 20" />
        </svg>
      );
    case 'pizza-pasta': // Pizza slice
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 6L7 22C11 25 21 25 25 22L16 6Z" />
          <circle cx="15" cy="13" r="1.5" fill={iconColor} />
          <circle cx="13" cy="18" r="1.5" fill={iconColor} />
          <circle cx="19" cy="17" r="1.5" fill={iconColor} />
        </svg>
      );
    case 'breads': // Naan basket
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="16" cy="18" rx="10" ry="6" />
          <path d="M10 16C12 13 20 13 22 16" />
          <path d="M12 18L14 17" />
          <path d="M16 19L18 18" />
        </svg>
      );
    case 'desserts': // Dessert / cake
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 16L7 24H25L23 16" />
          <path d="M9 16C10 14 12 14 13 16C14 14 16 14 17 16C18 14 20 14 21 16C22 14 23 15 23 16" />
          <circle cx="16" cy="10" r="2.5" fill={iconColor} />
          <path d="M16 7.5V6" />
        </svg>
      );
    case 'beverages': // Drink cooler
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 9H23L21 25H11L9 9Z" />
          <path d="M8 9H24" />
          <path d="M18 5L15 9" />
          <path d="M10 14H22" strokeDasharray="2 2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7" stroke={iconColor} strokeWidth="1.8">
          <circle cx="16" cy="16" r="8" />
        </svg>
      );
  }
};

// Social Media Icons
export const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="url(#ig-grad)" />
    <rect x="5.5" y="5.5" width="13" height="13" rx="3.5" stroke="#FFFFFF" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="3.2" stroke="#FFFFFF" strokeWidth="1.6" />
    <circle cx="15.8" cy="8.2" r="0.9" fill="#FFFFFF" />
    <defs>
      <radialGradient id="ig-grad" cx="20%" cy="105%" r="130%">
        <stop offset="0%" stopColor="#fa7e1e" />
        <stop offset="15%" stopColor="#f54040" />
        <stop offset="60%" stopColor="#d62976" />
        <stop offset="80%" stopColor="#962fbf" />
        <stop offset="100%" stopColor="#4f5bd5" />
      </radialGradient>
    </defs>
  </svg>
);

export const FacebookIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#1877F2" />
    <path
      d="M14.5 12.2H12.8V18H10.4V12.2H9.2V10.2H10.4V8.8C10.4 7.6 11 6 13.2 6H14.8V7.9H13.6C13.1 7.9 12.8 8.1 12.8 8.6V10.2H14.8L14.5 12.2Z"
      fill="#FFFFFF"
    />
  </svg>
);

export const YouTubeIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="#FF0000" />
    <path d="M10 8.5L15.5 12L10 15.5V8.5Z" fill="#FFFFFF" />
  </svg>
);

export const GoogleMapsIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFFFFF" />
    <path d="M12 4C8.68 4 6 6.68 6 10C6 14.5 12 20 12 20C12 20 18 14.5 18 10C18 6.68 15.32 4 12 4Z" fill="#EA4335" />
    <circle cx="12" cy="10" r="2.8" fill="#FFFFFF" />
    <path d="M12 7.2C10.45 7.2 9.2 8.45 9.2 10C9.2 11.55 10.45 12.8 12 12.8C13.55 12.8 14.8 11.55 14.8 10C14.8 8.45 13.55 7.2 12 7.2Z" fill="#4285F4" />
  </svg>
);

export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 13.85 2.5 15.58 3.38 17.07L2 22L7.07 20.67C8.53 21.52 10.22 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
      fill="#25D366"
    />
    <path
      d="M17.2 14.8C17 15.4 16 15.9 15.4 16C14.9 16.1 14.3 16.1 12.4 15.3C10 14.3 8.4 11.9 8.3 11.7C8.2 11.6 7.3 10.4 7.3 9.1C7.3 7.8 7.9 7.2 8.2 6.9C8.4 6.7 8.7 6.6 9 6.6C9.1 6.6 9.2 6.6 9.3 6.6C9.6 6.6 9.8 6.7 9.9 7.1C10.2 7.7 10.7 9 10.7 9.2C10.8 9.4 10.8 9.6 10.6 9.8C10.5 10 10.4 10.1 10.2 10.3C10.1 10.4 9.9 10.6 10.1 10.9C10.4 11.4 11.1 12.3 12.1 13.1C13.4 14.1 14.4 14.4 14.8 14.5C15.1 14.6 15.3 14.5 15.5 14.3C15.8 14 16.1 13.5 16.4 13.1C16.6 12.8 16.8 12.8 17.1 12.9C17.4 13 18.9 13.7 19.1 13.8C19.3 13.9 19.5 14 19.5 14.2C19.5 14.3 19.5 14.5 17.2 14.8Z"
      fill="#FFFFFF"
    />
  </svg>
);

export const ScooterDeliveryIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="6" cy="17" r="3" />
    <circle cx="18" cy="17" r="3" />
    <path d="M6 14H10L14 9H17" />
    <path d="M12 9V5H10" />
    <path d="M15 17H9" />
  </svg>
);
