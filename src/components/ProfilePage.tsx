import React, { useState, useEffect } from 'react';
import { VegBadge } from './Icons';
import { api } from '../services/api';
import { isAdminLoggedIn, getCustomerAuth, clearCustomerAuth, type CustomerAuth } from '../services/auth';
import { AuthModal } from './AuthModal';

interface Address {
  id: string;
  type: 'Home' | 'Office' | 'Other';
  isDefault: boolean;
  addressLine: string;
  phone: string;
}

interface ProfilePageProps {
  onNavigateToOrders?: () => void;
  onNavigateToMenu?: () => void;
  onNavigateToCart?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onNavigateToOrders,
  onNavigateToMenu,
  onNavigateToCart: _onNavigateToCart,
}) => {
  const [userAuth, setUserAuth] = useState<CustomerAuth | null>(() => getCustomerAuth());
  const [isAdmin, setIsAdmin] = useState<boolean>(() => isAdminLoggedIn());
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Customer Profile State initialized dynamically
  const [profile, setProfile] = useState(() => {
    const auth = getCustomerAuth();
    if (auth && auth.verified) {
      const cleanPhone = (auth.phone || '').replace(/\D/g, '');
      const masked = cleanPhone.length >= 10 ? `+91 ${cleanPhone.slice(0, 5)} XXXXX` : `+91 ${auth.phone}`;
      return {
        name: auth.name,
        phone: masked,
        email: auth.email || '',
      };
    }
    return {
      name: 'Guest Diner',
      phone: 'Not signed in',
      email: '',
    };
  });

  // Saved Addresses State (Clean zero-demo start)
  const [addresses, setAddresses] = useState<Address[]>([]);

  // Listen to auth state changes across windows & components
  useEffect(() => {
    const handleAuthChange = () => {
      const freshAuth = getCustomerAuth();
      setUserAuth(freshAuth);
      setIsAdmin(isAdminLoggedIn());
      if (freshAuth && freshAuth.verified) {
        const cleanPhone = (freshAuth.phone || '').replace(/\D/g, '');
        const masked = cleanPhone.length >= 10 ? `+91 ${cleanPhone.slice(0, 5)} XXXXX` : `+91 ${freshAuth.phone}`;
        setProfile((prev) => ({
          ...prev,
          name: freshAuth.name,
          phone: masked,
          email: freshAuth.email || prev.email,
        }));
      } else {
        setProfile({
          name: 'Guest Diner',
          phone: 'Not signed in',
          email: '',
        });
      }
    };
    window.addEventListener('gw_auth_changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('gw_auth_changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    clearCustomerAuth();
    setUserAuth(null);
    setIsAdmin(false);
    setProfile({
      name: 'Guest Diner',
      phone: 'Not signed in',
      email: '',
    });
    showToast('Logged out successfully. See you again at Greenwood!');
  };

  // Sync profile and addresses with persistent backend
  useEffect(() => {
    let isMounted = true;
    const fetchUserData = async () => {
      try {
        const [fetchedProfile, fetchedAddresses] = await Promise.all([
          api.getProfile(),
          api.getAddresses(),
        ]);
        if (!isMounted) return;
        if (fetchedProfile && fetchedProfile.name && fetchedProfile.name !== 'Guest User') {
          setProfile(fetchedProfile);
          setEditName(fetchedProfile.name);
          setEditPhone(fetchedProfile.phone);
          setEditEmail(fetchedProfile.email);
        }
        if (fetchedAddresses && Array.isArray(fetchedAddresses)) {
          setAddresses(fetchedAddresses as Address[]);
        }
      } catch {
        // graceful fallback to local defaults
      }
    };
    fetchUserData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Modal & Toast States
  const [activeModal, setActiveModal] = useState<{
    type: 'edit-profile' | 'add-address' | 'edit-address' | 'delete-address' | 'google-sync' | 'favorites' | 'support' | 'fssai';
    title: string;
    targetAddress?: Address;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for modals
  const [editName, setEditName] = useState(profile.name);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editEmail, setEditEmail] = useState(profile.email);

  const [newAddrType, setNewAddrType] = useState<'Home' | 'Office' | 'Other'>('Home');
  const [addrHouse, setAddrHouse] = useState('');
  const [addrArea, setAddrArea] = useState('');
  const [addrLandmark, setAddrLandmark] = useState('');
  const [addrCity, setAddrCity] = useState('Narela, Delhi');
  const [addrPincode, setAddrPincode] = useState('110040');
  const [newAddrPhone, setNewAddrPhone] = useState(userAuth?.phone || '');
  const [newAddrIsDefault, setNewAddrIsDefault] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...profile,
      name: editName.trim() || profile.name,
      phone: editPhone.trim() || profile.phone,
      email: editEmail.trim() || profile.email,
    };
    setProfile(updated);
    setActiveModal(null);
    showToast('Profile updated successfully!');
    try {
      await api.updateProfile(updated);
    } catch (err) {
      console.error('Failed to persist profile to backend:', err);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrHouse.trim() || !addrArea.trim()) {
      showToast('Please enter your house/flat number and area.');
      return;
    }

    const fullLine = `${addrHouse.trim()}, ${addrArea.trim()}${
      addrLandmark.trim() ? `, Near ${addrLandmark.trim()}` : ''
    }, ${addrCity.trim()} - ${addrPincode.trim()}`;

    const effectivePhone = newAddrPhone.trim() || userAuth?.phone || '';

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      type: newAddrType,
      isDefault: newAddrIsDefault || addresses.length === 0,
      addressLine: fullLine,
      phone: effectivePhone,
    };

    setAddresses((prev) => {
      if (newAddr.isDefault) {
        return [newAddr, ...prev.map((a) => ({ ...a, isDefault: false }))];
      }
      return [...prev, newAddr];
    });

    setAddrHouse('');
    setAddrArea('');
    setAddrLandmark('');
    setActiveModal(null);
    showToast(`${newAddrType} address added!`);
    try {
      await api.addAddress(newAddr);
    } catch (err) {
      console.error('Failed to persist address to backend:', err);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    setActiveModal(null);
    showToast('Address deleted.');
    try {
      await api.deleteAddress(id);
    } catch (err) {
      console.error('Failed to delete address on backend:', err);
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
        {/* SECTION 1: PAGE INTRODUCTION WITH WATERMARK & DIVIDER     */}
        {/* ========================================================= */}
        <div className="relative pt-2 pb-5 text-center sm:text-left sm:pl-16 sm:pr-16">
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
            My Account
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#77766D]">
            Manage your profile, saved addresses, orders and favourites.
          </p>
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: PROFILE HEADER CARD (Rahul Sharma)             */}
        {/* ========================================================= */}
        <div className="bg-[#FFFDF8] rounded-2xl border border-[#E8DDCA] shadow-sm p-4 sm:p-6 mb-4 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Left: Avatar + Details */}
            <div className="flex items-center gap-4 sm:gap-5">
              
              {/* Circular Avatar with Camera Badge */}
              <div className="relative shrink-0">
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#B38C4F] text-white flex items-center justify-center font-serif text-3xl sm:text-4xl font-bold ring-2 ring-[#C9A45C] shadow-sm">
                  {profile.name.charAt(0) || 'R'}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditName(profile.name);
                    setEditPhone(profile.phone);
                    setEditEmail(profile.email);
                    setActiveModal({ type: 'edit-profile', title: 'Edit Profile Information' });
                  }}
                  className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#163E26] text-white flex items-center justify-center border-2 border-white shadow-xs hover:bg-[#1E5233] transition-colors"
                  title="Change avatar photo"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                </button>
              </div>

              {/* Name, Contact, & Loyalty Badge */}
              <div className="min-w-0 space-y-1">
                <h2 className="font-serif text-xl sm:text-2xl lg:text-[28px] font-bold text-[#17261D] tracking-tight">
                  {profile.name}
                </h2>

                <div className="flex items-center gap-4 flex-wrap text-xs sm:text-[13px] text-[#4B5149] font-sans">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-[#8F5D2C]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>{profile.phone}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[#646B62]">
                    <svg className="w-3.5 h-3.5 text-[#8F5D2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate max-w-[200px] sm:max-w-none">{profile.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Profile Actions (Edit Profile + Log Out / Sign In) */}
            <div className="pt-2 sm:pt-0 flex items-center gap-2 flex-wrap">
              {userAuth && userAuth.verified ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setEditName(profile.name);
                      setEditPhone(profile.phone);
                      setEditEmail(profile.email);
                      setActiveModal({ type: 'edit-profile', title: 'Edit Profile Information' });
                    }}
                    className="flex-1 sm:flex-initial bg-[#163E26] hover:bg-[#1E5233] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Profile
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex-1 sm:flex-initial bg-white hover:bg-[#FDF2F2] text-[#C83A25] border border-[#C83A25]/40 hover:border-[#C83A25] text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    title="Log Out of your Greenwood account"
                  >
                    <svg className="w-4 h-4 text-[#C83A25]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log Out
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className="w-full sm:w-auto bg-[#163E26] hover:bg-[#1E5233] text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In / Log In
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 4: SAVED DELIVERY ADDRESSES                       */}
        {/* ========================================================= */}
        <div className="mb-6">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#C9A45C]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#17261D]">
                Saved Delivery Addresses
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setAddrHouse('');
                setAddrArea('');
                setAddrLandmark('');
                setAddrCity('Narela, Delhi');
                setAddrPincode('110040');
                setNewAddrPhone(userAuth?.phone || '');
                setNewAddrType('Home');
                setNewAddrIsDefault(false);
                setActiveModal({ type: 'add-address', title: 'Add New Delivery Address' });
              }}
              className="bg-[#163E26] hover:bg-[#1E5233] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              + Add Address
            </button>
          </div>

          {/* Address Cards 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {addresses.length === 0 ? (
              <div className="col-span-full bg-[#FFFDF8] rounded-xl border border-dashed border-[#E8DDCA] p-6 text-center">
                <div className="w-10 h-10 rounded-full bg-[#FAF6EE] border border-[#E8DDCA] flex items-center justify-center text-[#8F5D2C] mx-auto mb-2 text-base">
                  📍
                </div>
                <h4 className="font-serif font-bold text-sm text-[#17261D] mb-1">No Saved Addresses Yet</h4>
                <p className="text-xs text-[#77766D] mb-3">Add your home or office address for seamless delivery at Greenwood.</p>
                <button
                  type="button"
                  onClick={() => {
                    setAddrHouse('');
                    setAddrArea('');
                    setAddrLandmark('');
                    setAddrCity('Narela, Delhi');
                    setAddrPincode('110040');
                    setNewAddrPhone(userAuth?.phone || '');
                    setNewAddrType('Home');
                    setNewAddrIsDefault(true);
                    setActiveModal({ type: 'add-address', title: 'Add New Delivery Address' });
                  }}
                  className="bg-[#163E26] hover:bg-[#1E5233] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  + Add First Address
                </button>
              </div>
            ) : (
              addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-[#FFFDF8] rounded-xl border border-[#E8DDCA] p-3.5 shadow-2xs hover:border-[#C9A45C]/60 transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* Address Icon (Home / Office) */}
                    <div className="w-9 h-9 rounded-full bg-[#FAF6EE] border border-[#E8DDCA] flex items-center justify-center text-[#8F5D2C] shrink-0 mt-0.5">
                      {addr.type === 'Home' ? (
                        <svg className="w-4 h-4 text-[#C9A45C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-[#C9A45C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      )}
                    </div>

                    {/* Address Info */}
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-serif font-bold text-sm text-[#17261D]">
                          {addr.type}
                        </span>
                        {addr.isDefault && (
                          <span className="bg-[#DCE8CB] text-[#163E26] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#4B5149] leading-relaxed max-w-sm">
                        {addr.addressLine}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#77766D] mt-1">
                        <svg className="w-3 h-3 text-[#8F5D2C]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span>
                          {addr.phone
                            ? addr.phone.replace(/\D/g, '').length >= 10
                              ? `+91 ${addr.phone.replace(/\D/g, '').slice(0, 5)} XXXXX`
                              : addr.phone
                            : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-2.5 shrink-0 pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setAddrHouse(addr.addressLine);
                        setAddrArea('Narela Hub');
                        setAddrLandmark('');
                        setAddrCity('Narela, Delhi');
                        setAddrPincode('110040');
                        setNewAddrPhone(addr.phone || userAuth?.phone || '');
                        setNewAddrType(addr.type);
                        setNewAddrIsDefault(addr.isDefault);
                        setActiveModal({
                          type: 'add-address',
                          title: `Edit ${addr.type} Address`,
                          targetAddress: addr,
                        });
                      }}
                      className="text-xs font-medium text-[#4B5149] hover:text-[#163E26] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveModal({
                          type: 'delete-address',
                          title: `Delete ${addr.type} Address?`,
                          targetAddress: addr,
                        })
                      }
                      className="text-xs font-medium text-[#C83A25] hover:text-[#9E2A18] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 5: QUICK ACTIONS (Compact, Space-Efficient)       */}
        {/* ========================================================= */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-[#163E26]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.52-11 4 4.5-.5 7.5.5 11 2-4.5 1.5-8 2-11 2" />
            </svg>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#17261D]">
              Quick Actions
            </h3>
          </div>

          {/* Compact responsive grid for Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            
            {/* Action 1: My Orders */}
            <button
              type="button"
              onClick={() => {
                if (onNavigateToOrders) onNavigateToOrders();
                else window.location.hash = '#orders';
              }}
              className="bg-[#FFFDF8] hover:bg-[#FAF6EE] border border-[#E8DDCA] hover:border-[#C9A45C] rounded-xl p-3 text-left transition-all shadow-2xs hover:shadow-xs flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#FAF6EE] border border-[#E8DDCA] flex items-center justify-center text-[#8F5D2C] shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4 text-[#C9A45C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-[#17261D] truncate">
                    My Orders
                  </h4>
                  <span className="text-[10px] text-[#77766D] font-medium block">
                    Tracking &amp; History
                  </span>
                </div>
              </div>
              <span className="text-xs text-[#163E26] group-hover:translate-x-0.5 transition-transform shrink-0 pl-1">→</span>
            </button>

            {/* Action 2: Favourites */}
            <button
              type="button"
              onClick={() =>
                setActiveModal({
                  type: 'favorites',
                  title: 'Your Favorite Vegetarian Dishes',
                })
              }
              className="bg-[#FFFDF8] hover:bg-[#FAF6EE] border border-[#E8DDCA] hover:border-[#C9A45C] rounded-xl p-3 text-left transition-all shadow-2xs hover:shadow-xs flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#FAF6EE] border border-[#E8DDCA] flex items-center justify-center text-[#C83A25] shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4 text-[#C83A25]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-[#17261D] truncate">
                    Favourites
                  </h4>
                  <span className="text-[10px] text-[#77766D] block">
                    Saved pure veg
                  </span>
                </div>
              </div>
              <span className="text-xs text-[#163E26] group-hover:translate-x-0.5 transition-transform shrink-0 pl-1">→</span>
            </button>


            {/* Action 4: Help & Contact */}
            <button
              type="button"
              onClick={() =>
                setActiveModal({
                  type: 'support',
                  title: 'Help & Contact Greenwood Café',
                })
              }
              className="bg-[#FFFDF8] hover:bg-[#FAF6EE] border border-[#E8DDCA] hover:border-[#C9A45C] rounded-xl p-3 text-left transition-all shadow-2xs hover:shadow-xs flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#FAF6EE] border border-[#E8DDCA] flex items-center justify-center text-[#8F5D2C] shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4 text-[#C9A45C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-[#17261D] truncate">
                    Contact Café
                  </h4>
                  <span className="text-[10px] text-[#77766D] block">
                    WhatsApp &amp; Call
                  </span>
                </div>
              </div>
              <span className="text-xs text-[#163E26] group-hover:translate-x-0.5 transition-transform shrink-0 pl-1">→</span>
            </button>

            {/* Action 5: Food Safety */}
            <button
              type="button"
              onClick={() =>
                setActiveModal({
                  type: 'fssai',
                  title: '100% Pure Vegetarian & Food Safety Certification',
                })
              }
              className="bg-[#FFFDF8] hover:bg-[#FAF6EE] border border-[#E8DDCA] hover:border-[#C9A45C] rounded-xl p-3 text-left transition-all shadow-2xs hover:shadow-xs flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#FAF6EE] border border-[#E8DDCA] flex items-center justify-center text-[#163E26] shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4 text-[#163E26]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-[#17261D] truncate">
                    Food Safety
                  </h4>
                  <span className="text-[10px] text-[#168039] font-semibold block">
                    FSSAI Certified
                  </span>
                </div>
              </div>
              <span className="text-xs text-[#163E26] group-hover:translate-x-0.5 transition-transform shrink-0 pl-1">→</span>
            </button>

            {/* Action 6: Staff Admin Portal: Strictly visible to logged-in admins only */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  window.location.hash = '#admin';
                }}
                className="bg-[#FFFDF8] hover:bg-[#FAF6EE] border border-[#C9A45C]/60 hover:border-[#163E26] rounded-xl p-3 text-left transition-all shadow-2xs hover:shadow-xs flex items-center justify-between group cursor-pointer col-span-2 sm:col-span-1"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#2B180F] border border-[#C9A45C] flex items-center justify-center text-[#C9A45C] shrink-0 group-hover:scale-105 transition-transform">
                    <span className="text-xs">🔑</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-[#17261D] truncate">
                      Staff Admin
                    </h4>
                    <span className="text-[10px] text-[#8F5D2C] font-semibold block">
                      Kitchen POS Portal
                    </span>
                  </div>
                </div>
                <span className="text-xs text-[#163E26] group-hover:translate-x-0.5 transition-transform shrink-0 pl-1">→</span>
              </button>
            )}

            {/* Action 7: Log Out (when signed in) / Sign In (when guest) */}
            {userAuth && userAuth.verified ? (
              <button
                type="button"
                onClick={handleLogout}
                className="bg-[#FFFDF8] hover:bg-[#FDF2F2] border border-[#E8DDCA] hover:border-[#C83A25]/50 rounded-xl p-3 text-left transition-all shadow-2xs hover:shadow-xs flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#FDF2F2] border border-[#C83A25]/30 flex items-center justify-center text-[#C83A25] shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-4 h-4 text-[#C83A25]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-[#C83A25] truncate">
                      Log Out
                    </h4>
                    <span className="text-[10px] text-[#77766D] font-medium block">
                      End Session
                    </span>
                  </div>
                </div>
                <span className="text-xs text-[#C83A25] group-hover:translate-x-0.5 transition-transform shrink-0 pl-1">→</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="bg-[#FFFDF8] hover:bg-[#FAF6EE] border border-[#E8DDCA] hover:border-[#163E26]/50 rounded-xl p-3 text-left transition-all shadow-2xs hover:shadow-xs flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#EBF3ED] border border-[#163E26]/30 flex items-center justify-center text-[#163E26] shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-4 h-4 text-[#163E26]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-[#163E26] truncate">
                      Sign In
                    </h4>
                    <span className="text-[10px] text-[#77766D] font-medium block">
                      Manage Account
                    </span>
                  </div>
                </div>
                <span className="text-xs text-[#163E26] group-hover:translate-x-0.5 transition-transform shrink-0 pl-1">→</span>
              </button>
            )}

          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 6: LOWER BOTANICAL BRAND BANNER                   */}
        {/* ========================================================= */}
        <div className="bg-[#FFFDF8] rounded-2xl border border-[#E8DDCA] shadow-sm overflow-hidden mb-4 relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 sm:p-4">
            
            {/* Left: Rich Paneer Butter Masala Dish */}
            <div className="shrink-0 w-full sm:w-auto flex justify-center sm:justify-start">
              <img
                src="/images/profile/banner_dish.jpg"
                alt="Greenwood Vegetarian Specialty"
                className="w-48 h-20 sm:w-56 sm:h-22 object-cover rounded-xl border border-[#E8DDCA] shadow-xs"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/dish-detail/rec-shahi-paneer.jpg';
                }}
              />
            </div>

            {/* Center: Brand Message */}
            <div className="text-center px-2 py-1">
              <h4 className="font-serif text-lg sm:text-2xl font-bold text-[#17261D] tracking-tight mb-1">
                Good Food Brings Good People Together
              </h4>
              <p className="font-sans text-xs sm:text-sm text-[#77766D] mb-2">
                Thank you for being a part of the Greenwood family.
              </p>
              {/* Golden Leaf Flourish */}
              <div className="flex items-center justify-center gap-2 text-[#C9A45C]">
                <span className="w-6 h-[1px] bg-gradient-to-r from-transparent to-[#C9A45C]"></span>
                <svg className="w-3.5 h-3.5 text-[#C9A45C]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.52-11 4 4.5-.5 7.5.5 11 2-4.5 1.5-8 2-11 2" />
                </svg>
                <span className="w-6 h-[1px] bg-gradient-to-l from-transparent to-[#C9A45C]"></span>
              </div>
            </div>

            {/* Right: Botanical Leaves */}
            <div className="shrink-0 hidden lg:block">
              <img
                src="/images/profile/banner_leaves.jpg"
                alt=""
                className="w-36 h-20 object-contain mix-blend-multiply opacity-80"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* INTERACTIVE MODALS                                        */}
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

            {/* Modal Title */}
            <h3 className="font-serif text-xl font-bold text-[#17261D] mb-3 pr-6">
              {activeModal.title}
            </h3>

            {/* Modal Content: Edit Profile */}
            {activeModal.type === 'edit-profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-3.5 my-3">
                <div>
                  <label className="block text-xs font-semibold text-[#17261D] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full bg-[#FAF6EE] text-sm text-[#17261D] px-3.5 py-2 rounded-xl border border-[#E8DDCA] focus:border-[#163E26] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#17261D] mb-1">Phone Number (Order Sync)</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    required
                    className="w-full bg-[#FAF6EE] text-sm text-[#17261D] px-3.5 py-2 rounded-xl border border-[#E8DDCA] focus:border-[#163E26] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#17261D] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                    className="w-full bg-[#FAF6EE] text-sm text-[#17261D] px-3.5 py-2 rounded-xl border border-[#E8DDCA] focus:border-[#163E26] focus:outline-none"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 text-xs font-medium text-[#77766D] hover:bg-[#FAF6EE] rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#163E26] text-white px-5 py-2 text-xs font-semibold rounded-lg shadow-xs hover:bg-[#1E5233]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Modal Content: Add Address */}
            {activeModal.type === 'add-address' && (
              <form onSubmit={handleAddAddress} className="space-y-3.5 my-3">
                <div>
                  <label className="block text-xs font-semibold text-[#17261D] mb-1">Address Type</label>
                  <div className="flex gap-2">
                    {(['Home', 'Office', 'Other'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setNewAddrType(t)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                          newAddrType === t
                            ? 'bg-[#163E26] text-white border-[#163E26]'
                            : 'bg-[#FAF6EE] text-[#4B5149] border-[#E8DDCA]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 1. House / Flat No. & Building */}
                <div>
                  <label className="block text-xs font-semibold text-[#17261D] mb-1">
                    House / Flat No., Floor &amp; Building <span className="text-[#C83A25]">*</span>
                  </label>
                  <input
                    type="text"
                    value={addrHouse}
                    onChange={(e) => setAddrHouse(e.target.value)}
                    placeholder="e.g. Flat 302, Tower B / Plot No. 2"
                    required
                    className="w-full bg-[#FAF6EE] text-xs sm:text-sm text-[#17261D] px-3.5 py-2 rounded-xl border border-[#E8DDCA] focus:border-[#163E26] focus:outline-none"
                  />
                </div>

                {/* 2. Street / Area / Sector */}
                <div>
                  <label className="block text-xs font-semibold text-[#17261D] mb-1">
                    Street, Area or Sector <span className="text-[#C83A25]">*</span>
                  </label>
                  <input
                    type="text"
                    value={addrArea}
                    onChange={(e) => setAddrArea(e.target.value)}
                    placeholder="e.g. Sector A10, Pocket 6 / Singhu Road"
                    required
                    className="w-full bg-[#FAF6EE] text-xs sm:text-sm text-[#17261D] px-3.5 py-2 rounded-xl border border-[#E8DDCA] focus:border-[#163E26] focus:outline-none"
                  />
                </div>

                {/* 3. Nearby Landmark (Lending mark) */}
                <div>
                  <label className="block text-xs font-semibold text-[#17261D] mb-1">
                    Nearby Landmark <span className="text-[10px] text-[#77766D] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={addrLandmark}
                    onChange={(e) => setAddrLandmark(e.target.value)}
                    placeholder="e.g. Near Shiv Mandir / Opp. DDA Park"
                    className="w-full bg-[#FAF6EE] text-xs sm:text-sm text-[#17261D] px-3.5 py-2 rounded-xl border border-[#E8DDCA] focus:border-[#163E26] focus:outline-none"
                  />
                </div>

                {/* 4. City & Pincode (Compact 2-col) */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#17261D] mb-1">
                      City <span className="text-[#C83A25]">*</span>
                    </label>
                    <input
                      type="text"
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      placeholder="Narela, Delhi"
                      required
                      className="w-full bg-[#FAF6EE] text-xs sm:text-sm text-[#17261D] px-3 py-2 rounded-xl border border-[#E8DDCA] focus:border-[#163E26] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#17261D] mb-1">
                      Pincode <span className="text-[#C83A25]">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={addrPincode}
                      onChange={(e) => setAddrPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="110040"
                      required
                      className="w-full bg-[#FAF6EE] text-xs sm:text-sm text-[#17261D] font-mono px-3 py-2 rounded-xl border border-[#E8DDCA] focus:border-[#163E26] focus:outline-none"
                    />
                  </div>
                </div>

                {/* 5. Contact Phone */}
                <div>
                  <label className="block text-xs font-semibold text-[#17261D] mb-1">
                    Contact Mobile for Delivery Partner <span className="text-[10px] text-[#77766D] font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#77766D]">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={newAddrPhone}
                      onChange={(e) => setNewAddrPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 XXXXX"
                      className="w-full pl-11 pr-3 py-2 bg-[#FAF6EE] text-xs sm:text-sm text-[#17261D] font-mono rounded-xl border border-[#E8DDCA] focus:border-[#163E26] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="set-default"
                    checked={newAddrIsDefault}
                    onChange={(e) => setNewAddrIsDefault(e.target.checked)}
                    className="rounded text-[#163E26] focus:ring-[#163E26]"
                  />
                  <label htmlFor="set-default" className="text-xs text-[#4B5149]">
                    Set as default delivery address
                  </label>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 text-xs font-medium text-[#77766D] hover:bg-[#FAF6EE] rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#163E26] text-white px-5 py-2 text-xs font-semibold rounded-lg shadow-xs hover:bg-[#1E5233]"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            {/* Modal Content: Delete Address */}
            {activeModal.type === 'delete-address' && activeModal.targetAddress && (
              <div className="my-3 space-y-3">
                <p className="text-xs sm:text-sm text-[#4B5149]">
                  Are you sure you want to delete your <strong>{activeModal.targetAddress.type}</strong> address?
                </p>
                <div className="p-3 bg-[#FAF6EE] rounded-lg text-xs text-[#77766D] border border-[#E8DDCA]">
                  {activeModal.targetAddress.addressLine}
                </div>
                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 text-xs font-medium text-[#77766D] rounded-lg"
                  >
                    Keep Address
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(activeModal.targetAddress!.id)}
                    className="bg-[#C83A25] text-white px-4 py-2 text-xs font-semibold rounded-lg shadow-xs hover:bg-[#A82B18]"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            )}



            {/* Modal Content: Favorites */}
            {activeModal.type === 'favorites' && (
              <div className="my-3 space-y-2.5">
                <p className="text-xs text-[#77766D]">Your saved pure vegetarian dishes:</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-[#FAF6EE] rounded-xl border border-[#E8DDCA]">
                    <div className="flex items-center gap-2">
                      <VegBadge />
                      <span className="font-serif font-medium text-xs text-[#17261D]">Shahi Paneer Butter Masala</span>
                    </div>
                    <span className="font-semibold text-xs text-[#C83A25]">₹299</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-[#FAF6EE] rounded-xl border border-[#E8DDCA]">
                    <div className="flex items-center gap-2">
                      <VegBadge />
                      <span className="font-serif font-medium text-xs text-[#17261D]">Farmhouse Pizza (Fresh Veggies)</span>
                    </div>
                    <span className="font-semibold text-xs text-[#C83A25]">₹299</span>
                  </div>
                </div>
                <div className="pt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal(null);
                      if (onNavigateToMenu) onNavigateToMenu();
                      else window.location.hash = '#menu';
                    }}
                    className="bg-[#163E26] text-white px-4 py-2 text-xs font-semibold rounded-lg shadow-xs"
                  >
                    Order from Menu
                  </button>
                </div>
              </div>
            )}


            {/* Modal Content: Support */}
            {activeModal.type === 'support' && (
              <div className="my-3 space-y-3">
                <p className="text-xs text-[#4B5149]">
                  Have a question about your order, dietary requirements, or table booking? We are here to help:
                </p>
                <div className="space-y-2">
                  <a
                    href="tel:+919066906607"
                    className="flex items-center justify-between p-3 bg-[#FAF6EE] rounded-xl border border-[#E8DDCA] hover:border-[#163E26] text-xs font-semibold text-[#17261D]"
                  >
                    <span>📞 Call Restaurant: +91 90669 06607</span>
                    <span className="text-[#163E26]">Call →</span>
                  </a>
                  <a
                    href="https://wa.me/919066906607?text=Hi%20Greenwood%20Caf%C3%A9%21"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-[#FAF6EE] rounded-xl border border-[#E8DDCA] hover:border-[#25D366] text-xs font-semibold text-[#17261D]"
                  >
                    <span>💬 WhatsApp Greenwood Helpline</span>
                    <span className="text-[#25D366]">Chat →</span>
                  </a>
                </div>
              </div>
            )}

            {/* Modal Content: FSSAI & Pure Veg Info */}
            {activeModal.type === 'fssai' && (
              <div className="my-3 space-y-3 text-xs text-[#4B5149] leading-relaxed">
                <div className="flex items-center gap-2 p-2.5 bg-[#EBF3E6] rounded-xl border border-[#CDE1BE]">
                  <VegBadge />
                  <span className="font-bold text-[#163E26]">100% Strictly Pure Vegetarian Kitchen</span>
                </div>
                <p>
                  Greenwood Café & Restaurant operates with zero meat, poultry, seafood, or egg products on the entire premises. All gravies, curries, tandoori marinades, and baked goods are prepared in segregated clean vegetarian vessels.
                </p>
                <div className="p-2.5 bg-[#FAF6EE] rounded-xl border border-[#E8DDCA] text-[11px] text-[#77766D]">
                  FSSAI License: <strong>13324001000123</strong> • Food Safety Certified
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Customer Login / Verification Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(freshAuth) => {
          setShowAuthModal(false);
          setUserAuth(freshAuth);
          const cleanPhone = (freshAuth.phone || '').replace(/\D/g, '');
          const masked = cleanPhone.length >= 10 ? `+91 ${cleanPhone.slice(0, 5)} XXXXX` : `+91 ${freshAuth.phone}`;
          setProfile({
            name: freshAuth.name,
            phone: masked,
            email: freshAuth.email || '',
          });
          showToast(`Welcome, ${freshAuth.name}! Logged in successfully.`);
        }}
      />
    </div>
  );
};
