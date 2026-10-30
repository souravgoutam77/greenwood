import React, { useState, useRef, useEffect } from 'react';
import { api, computeEffectiveStoreStatus } from '../services/api';
import { firestore } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface DeliverySelectorProps {
  selectedHub: string;
  setSelectedHub: (hub: string) => void;
}

const AVAILABLE_HUBS = [
  { name: "Narela, Delhi (Hub)", eta: "25 Mins", distance: "Within 15km", isMain: true },
  { name: "Rohini Sector 10 Hub", eta: "35 Mins", distance: "12km away", isMain: false },
  { name: "Pitampura Central Hub", eta: "40 Mins", distance: "14km away", isMain: false },
  { name: "Alipur GT Road Hub", eta: "20 Mins", distance: "8km away", isMain: false },
];

export const DeliverySelector: React.FC<DeliverySelectorProps> = ({
  selectedHub,
  setSelectedHub,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Live Operational Status
  useEffect(() => {
    let isMounted = true;
    api.getSettings().then((s) => {
      if (isMounted && s) {
        setIsStoreOpen(computeEffectiveStoreStatus(s));
      }
    }).catch(() => {});

    const handleSettingsUpdate = (e: any) => {
      const s = e.detail;
      if (s && isMounted) {
        setIsStoreOpen(computeEffectiveStoreStatus(s));
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
            setIsStoreOpen(computeEffectiveStoreStatus(data));
          }
        });
      } catch {}
    }

    return () => {
      isMounted = false;
      if (unsubscribeSettings) unsubscribeSettings();
      window.removeEventListener('gw_settings_updated', handleSettingsUpdate);
      window.removeEventListener('storage', handleSettingsUpdate);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <div className="relative w-full bg-[#FAF6EE] border-b border-[#E8DDCA] py-2 px-3.5 sm:px-6 lg:px-8 z-40 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5 text-xs sm:text-sm">
        
        {/* Deliver to Location Selector with Dropdown */}
        <div className="relative flex items-center justify-between sm:justify-start w-full sm:w-auto gap-2 sm:gap-3" ref={dropdownRef}>
          <div className="flex items-center gap-1.5 sm:gap-2 text-[#17261D] min-w-0">
            {/* Dark green Location Pin */}
            <svg
              className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#163E26] shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>

            <span className="font-normal text-[#4B5149] shrink-0">Deliver to:</span>

            {/* Clickable Location with Chevron */}
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 font-semibold text-[#17261D] hover:text-[#163E26] focus:outline-none focus:ring-1 focus:ring-[#163E26] rounded px-1.5 py-0.5 transition-colors cursor-pointer group"
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
            >
              <span className="truncate max-w-[160px] xs:max-w-[210px] sm:max-w-xs group-hover:underline">
                {selectedHub}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-[#163E26] transition-transform duration-200 shrink-0 ${dropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Dropdown Menu for Location Hubs — 100% Solid Opaque Background */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-[#FFFDF8] border border-[#E8DDCA] rounded-2xl shadow-2xl z-50 py-2 divide-y divide-[#F1E8D9] animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#77766D] bg-[#FFFDF8] flex items-center justify-between">
                <span>Select Delivery Hub</span>
                <span className="text-[10px] text-[#163E26] font-semibold">15 km Live Radius</span>
              </div>
              <div className="py-1 bg-[#FFFDF8]">
                {AVAILABLE_HUBS.map((hub) => (
                  <button
                    key={hub.name}
                    type="button"
                    onClick={() => {
                      setSelectedHub(hub.name);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-[#FAF6EE] transition-colors cursor-pointer ${
                      selectedHub === hub.name ? 'bg-[#DCE8CB]/50 text-[#163E26] font-semibold' : 'text-[#4B5149]'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-[#17261D] text-xs sm:text-[13px]">{hub.name}</div>
                      <div className="text-[10px] text-[#77766D] mt-0.5">{hub.distance} • Est. Arrival {hub.eta}</div>
                    </div>
                    {selectedHub === hub.name && (
                      <span className="w-5 h-5 rounded-full bg-[#163E26] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="px-4 py-2 text-[10px] text-[#77766D] bg-[#F7F3EA] rounded-b-2xl border-t border-[#E8DDCA]/60 flex items-center gap-1.5">
                <span>⚡</span>
                <span>Delivery eligibility confirmed within 15 km perimeter of Narela central hub.</span>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Store Status: Hidden when open, prominent warning banner when CLOSED */}
        <div className="flex items-center gap-2 text-xs">
          {!isStoreOpen ? (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-300 bg-red-50 text-red-700 shadow-2xs font-semibold text-xs"
              title="Store is currently closed. Operating hours: 11:00 AM – 11:00 PM"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-bold text-[11px] whitespace-nowrap">
                Store Closed (Opens 11:00 AM)
              </span>
            </div>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[#4B5149] text-xs">
              <span className="text-amber-600">⚡</span>
              <span>Est. 25 Mins Insulated Delivery</span>
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
