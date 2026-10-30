import React, { useState } from 'react';
import { LeafBranch, WhatsAppIcon } from './Icons';

interface ContactPageProps {
  onNavigateToMenu: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigateToMenu,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('07:30 PM');
  const [guests, setGuests] = useState('2 Guests');
  const [seatingPreference, setSeatingPreference] = useState<'Private Gazebo Pod' | 'Botanical Indoor Hall' | 'Family Large Table'>('Private Gazebo Pod');
  const [specialRequest, setSpecialRequest] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      showToast('Please enter your name and contact number.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      showToast('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitted(true);
    showToast('Reservation inquiry confirmed! Opening WhatsApp booking desk...');

    // Compose prefilled WhatsApp reservation message
    const msg = `*Greenwood Café Table / Gazebo Reservation Inquiry*
• *Name:* ${name.trim()}
• *Phone:* +91 ${cleanPhone}
• *Date:* ${date}
• *Time:* ${time}
• *Guests:* ${guests}
• *Seating:* ${seatingPreference}
${specialRequest.trim() ? `• *Special Notes:* ${specialRequest.trim()}` : ''}
• *Location:* Sector A10, Narela, Delhi`;

    const waUrl = `https://wa.me/919066906607?text=${encodeURIComponent(msg)}`;
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 1200);
  };

  return (
    <div className="w-full bg-[#FAF6EE] min-h-screen text-[#4B5149] pb-24 md:pb-16 font-sans">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-[#163E26] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#2B5E3C] animate-fade-in-down">
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. HEADER HERO                                            */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden pt-8 pb-10 bg-gradient-to-b from-[#FAF6EE] to-[#FFFDF8] border-b border-[#E8DDCA] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center justify-center gap-2 text-[#163E26] mb-2">
            <LeafBranch flip={false} className="w-5 h-2.5" />
            <span className="font-serif text-xs sm:text-sm tracking-widest uppercase font-semibold text-[#163E26]">
              Reservations &amp; Support
            </span>
            <LeafBranch flip={true} className="w-5 h-2.5" />
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#17261D] tracking-tight mb-3">
            Contact Greenwood Café
          </h1>
          <p className="text-xs sm:text-sm text-[#77766D] max-w-xl mx-auto font-sans leading-relaxed">
            Reserve your private Gazebo pod, inquire about birthday or anniversary celebrations, or get in touch for bulk corporate catering and delivery queries in Narela, Delhi.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. CONTACT DETAILS & RESERVATION FORM GRID                */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Contact Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Primary Address Card */}
            <div className="bg-[#FFFDF8] rounded-2xl border border-[#E8DDCA] p-5 sm:p-6 shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAF6EE] border border-[#E8DDCA] flex items-center justify-center text-[#163E26] shrink-0 text-lg">
                  📍
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#17261D]">
                    Restaurant Location
                  </h3>
                  <p className="text-xs text-[#4B5149] mt-1 leading-relaxed">
                    Plot No-2, Pocket-6, Sector-A10,<br />
                    Narela, Delhi – 110040<br />
                    <span className="text-[#77766D]">(Near Narela Hub &amp; Main Market)</span>
                  </p>
                  <a
                    href="https://maps.google.com/?q=Plot+No-2,+Pocket-6,+Sector-A10,+Narela,+Delhi+-+110040"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#163E26] hover:text-[#C9A45C] mt-2 underline"
                  >
                    <span>Open in Google Maps Directions</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Calling & Hotline Card */}
            <div className="bg-[#FFFDF8] rounded-2xl border border-[#E8DDCA] p-5 sm:p-6 shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAF6EE] border border-[#E8DDCA] flex items-center justify-center text-[#C9A45C] shrink-0 text-lg">
                  📞
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-base text-[#17261D]">
                    Phone &amp; Order Hotline
                  </h3>
                  <div className="text-xs text-[#4B5149] space-y-1 pt-1">
                    <div>
                      <span className="text-[#77766D]">Order Desk &amp; Customer Support: </span>
                      <a href="tel:+919066906607" className="font-bold text-[#163E26] hover:underline">
                        +91 90669 06607
                      </a>
                    </div>
                    <div>
                      <span className="text-[#77766D]">Direct Table Booking &amp; Gazebo Desk: </span>
                      <a href="tel:+919066906607" className="font-bold text-[#163E26] hover:underline">
                        +91 90669 06607
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timings Card */}
            <div className="bg-[#FFFDF8] rounded-2xl border border-[#E8DDCA] p-5 sm:p-6 shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAF6EE] border border-[#E8DDCA] flex items-center justify-center text-[#8F5D2C] shrink-0 text-lg">
                  ⏰
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#17261D]">
                    Operating Hours
                  </h3>
                  <p className="text-xs text-[#4B5149] mt-1">
                    <strong>Monday – Sunday:</strong> 11:00 AM – 11:00 PM<br />
                    <span className="text-[#168039] font-medium">● Kitchen active for Dine-in, Takeaway &amp; Delivery</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Connect */}
            <a
              href="https://wa.me/919066906607?text=Hi%20Greenwood%2C%20I%20would%20like%20to%20inquire%20about%20table%20reservations%20and%20orders."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full py-3 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <WhatsAppIcon className="w-5 h-5 fill-white" />
              <span>Direct WhatsApp Desk (+91 90669 06607)</span>
            </a>

          </div>

          {/* Right Column: Interactive Gazebo / Table Booking Form (7 Cols) */}
          <div className="lg:col-span-7 bg-[#FFFDF8] rounded-3xl border border-[#E8DDCA] p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <span className="text-xs font-bold text-[#8F5D2C] uppercase tracking-wider block">
                Instant Table &amp; Gazebo Pod Booking
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17261D] mt-1">
                Book Your Dining Experience
              </h2>
              <p className="text-xs text-[#77766D] mt-1">
                Fill the details below to reserve your private pod or family feast table.
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-[#FAF6EE] border border-[#DCE8CB] rounded-2xl p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#163E26] text-white flex items-center justify-center text-xl mx-auto">
                  ✓
                </div>
                <h3 className="font-serif text-xl font-bold text-[#17261D]">
                  Booking Request Received!
                </h3>
                <p className="text-xs text-[#4B5149] max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{name}</strong>! We have routed your reservation for <strong>{seatingPreference}</strong> on <strong>{date} at {time}</strong> to our restaurant desk.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs text-[#8F5D2C] underline cursor-pointer"
                  >
                    Submit another reservation
                  </button>
                  <button
                    type="button"
                    onClick={onNavigateToMenu}
                    className="bg-[#163E26] text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer"
                  >
                    View Food Menu
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReservationSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#17261D] mb-1">
                      Full Name <span className="text-[#C83A25]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sourav"
                      className="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#E8DDCA] rounded-xl text-xs sm:text-sm text-[#17261D] focus:outline-none focus:border-[#163E26]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17261D] mb-1">
                      10-Digit Mobile Number <span className="text-[#C83A25]">*</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-[#E8DDCA] bg-[#FAF6EE] text-[#4B5149] text-xs font-semibold">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#E8DDCA] rounded-r-xl text-xs sm:text-sm text-[#17261D] font-mono focus:outline-none focus:border-[#163E26]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#17261D] mb-1">
                      Date <span className="text-[#C83A25]">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#E8DDCA] rounded-xl text-xs sm:text-sm text-[#17261D] focus:outline-none focus:border-[#163E26]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17261D] mb-1">
                      Preferred Time <span className="text-[#C83A25]">*</span>
                    </label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#E8DDCA] rounded-xl text-xs sm:text-sm text-[#17261D] focus:outline-none focus:border-[#163E26] cursor-pointer"
                    >
                      <option value="12:30 PM">12:30 PM (Lunch)</option>
                      <option value="01:30 PM">01:30 PM (Lunch)</option>
                      <option value="03:00 PM">03:00 PM (Afternoon)</option>
                      <option value="06:30 PM">06:30 PM (Early Dinner)</option>
                      <option value="07:30 PM">07:30 PM (Dinner)</option>
                      <option value="08:30 PM">08:30 PM (Dinner)</option>
                      <option value="09:30 PM">09:30 PM (Late Dinner)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17261D] mb-1">
                      Number of Guests
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#E8DDCA] rounded-xl text-xs sm:text-sm text-[#17261D] focus:outline-none focus:border-[#163E26] cursor-pointer"
                    >
                      <option value="2 Guests">2 Guests (Couple)</option>
                      <option value="3-4 Guests">3–4 Guests (Small Family)</option>
                      <option value="5-8 Guests">5–8 Guests (Family Group)</option>
                      <option value="10+ Guests">10+ Guests (Celebration / Party)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17261D] mb-1.5">
                    Seating Experience Preference
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(['Private Gazebo Pod', 'Botanical Indoor Hall', 'Family Large Table'] as const).map((seat) => (
                      <button
                        key={seat}
                        type="button"
                        onClick={() => setSeatingPreference(seat)}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                          seatingPreference === seat
                            ? 'bg-[#163E26] text-white border-[#163E26] shadow-xs'
                            : 'bg-[#FAF6EE] text-[#4B5149] border-[#E8DDCA] hover:border-[#C9A45C]'
                        }`}
                      >
                        <div className="text-sm mb-0.5">{seat === 'Private Gazebo Pod' ? '🏡' : seat === 'Botanical Indoor Hall' ? '🌿' : '🍽️'}</div>
                        <div>{seat}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17261D] mb-1">
                    Special Requests / Dietary Notes
                  </label>
                  <textarea
                    rows={2}
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    placeholder="e.g. Birthday decoration in Gazebo pod, Jain (no onion/garlic) preparations..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#E8DDCA] rounded-xl text-xs text-[#17261D] focus:outline-none focus:border-[#163E26]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#163E26] hover:bg-[#1E5233] text-white py-3 rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer mt-2"
                >
                  Confirm Table / Gazebo Reservation →
                </button>
              </form>
            )}

          </div>

        </div>
      </section>

      

    </div>
  );
};
