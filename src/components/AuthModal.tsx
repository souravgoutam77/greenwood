import React, { useState, useEffect } from 'react';
import {
  type CustomerAuth,
  setCustomerAuth,
  PRIMARY_ADMIN_PHONE,
  PRIMARY_ADMIN_NAME,
} from '../services/auth';
import { auth, googleProvider, firestore } from '../services/firebase';
import { signInWithPopup, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { LeafBranch } from './Icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (auth: CustomerAuth) => void;
  initialPhone?: string;
  initialName?: string;
  initialAddress?: {
    house?: string;
    area?: string;
    landmark?: string;
    pincode?: string;
  };
}

type AuthStep = 'phone' | 'otp' | 'onboarding' | 'welcome';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialPhone = '',
  initialName = '',
  initialAddress,
}) => {
  const [step, setStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [verifiedPhone, setVerifiedPhone] = useState('');

  // Onboarding fields (ONLY shown for first-time / new user registrations)
  const [onboardName, setOnboardName] = useState(initialName || '');
  const [onboardEmail, setOnboardEmail] = useState('');
  const [onboardHouse, setOnboardHouse] = useState(initialAddress?.house || '');
  const [onboardArea, setOnboardArea] = useState(initialAddress?.area || '');
  const [onboardLandmark, setOnboardLandmark] = useState(initialAddress?.landmark || '');
  const [onboardPincode, setOnboardPincode] = useState(initialAddress?.pincode || '110040');

  // Welcome state
  const [welcomeName, setWelcomeName] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [verifiedAuthData, setVerifiedAuthData] = useState<CustomerAuth | null>(null);

  useEffect(() => {
    if (initialPhone) setPhone(initialPhone);
  }, [initialPhone]);

  useEffect(() => {
    if (initialAddress) {
      if (initialAddress.house && !onboardHouse) setOnboardHouse(initialAddress.house);
      if (initialAddress.area && !onboardArea) setOnboardArea(initialAddress.area);
      if (initialAddress.landmark && !onboardLandmark) setOnboardLandmark(initialAddress.landmark);
      if (initialAddress.pincode && !onboardPincode) setOnboardPincode(initialAddress.pincode);
    }
  }, [initialAddress]);

  useEffect(() => {
    let timer: any;
    if (step === 'otp' && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  if (!isOpen) return null;

  // Initialize invisible Recaptcha Verifier safely for Firebase
  const setupRecaptcha = () => {
    if (typeof window === 'undefined' || !auth) return null;
    try {
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
        } catch {}
      }
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
        'expired-callback': () => {
          setError('reCAPTCHA expired. Please request OTP again.');
        },
      });
      (window as any).recaptchaVerifier = verifier;
      return verifier;
    } catch (err) {
      console.warn('[Firebase Auth] Recaptcha notice:', err);
      return null;
    }
  };

  // STEP 1: Send SMS OTP (Only Phone Number Required)
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setOtp(['', '', '', '', '', '']);

    try {
      if (!auth) {
        throw new Error('Authentication service is temporarily unavailable. Please try again.');
      }
      const appVerifier = setupRecaptcha();
      if (!appVerifier) {
        throw new Error('Security verification service could not be initialized. Please refresh and try again.');
      }
      const e164Phone = `+91${cleanPhone}`;
      const confirmation = await signInWithPhoneNumber(auth, e164Phone, appVerifier);
      setConfirmationResult(confirmation);
      setVerifiedPhone(cleanPhone);
      setLoading(false);
      setStep('otp');
      setResendTimer(30);

      // Auto-focus first OTP box after state transition
      setTimeout(() => {
        document.getElementById('otp-0')?.focus();
      }, 150);
    } catch (firebaseErr: any) {
      console.error('[Firebase Auth] Phone Auth error:', firebaseErr);
      setLoading(false);
      const code = firebaseErr?.code || '';
      if (code === 'auth/invalid-phone-number') {
        setError('Invalid phone number format. Please enter a valid 10-digit Indian mobile number.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many SMS requests in a short time. Please wait a few minutes or sign in with Google.');
      } else if (code === 'auth/captcha-check-failed') {
        setError('Security check failed. Please refresh the page and try again.');
      } else if (code === 'auth/quota-exceeded') {
        setError('SMS service quota reached. Please sign in with Google for instant access.');
      } else {
        setError(firebaseErr?.message || 'Failed to dispatch SMS verification. Please try again or use Google Sign-In.');
      }
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, '');
    if (!clean) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = clean.slice(-1);
    setOtp(newOtp);

    if (index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newOtp = ['', '', '', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const focusIdx = Math.min(pasted.length, 5);
    document.getElementById(`otp-${focusIdx}`)?.focus();
  };

  // STEP 2: Verify OTP -> Check if user exists in Firestore
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const code = otp.join('').trim();
    if (code.length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);
    const cleanPhone = (verifiedPhone || phone).replace(/\D/g, '').slice(-10);

    if (!confirmationResult || typeof confirmationResult.confirm !== 'function') {
      setError('Session expired. Please request a new SMS verification code.');
      setLoading(false);
      setStep('phone');
      return;
    }

    try {
      await confirmationResult.confirm(code);

      // Successfully verified phone ownership via Firebase Auth!
      // Look up existing user profile in Firestore
      let existingProfile: any = null;

      // Special authoritative check for primary owner
      if (cleanPhone === PRIMARY_ADMIN_PHONE) {
        existingProfile = {
          name: PRIMARY_ADMIN_NAME,
          phone: PRIMARY_ADMIN_PHONE,
          email: '',
        };
      }

      // Check Cloud Firestore /users/{cleanPhone}
      if (firestore && !existingProfile) {
        try {
          const userRef = doc(firestore, 'users', cleanPhone);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data && data.name && data.name.trim() && data.name !== 'Greenwood Guest') {
              existingProfile = data;
            }
          }
        } catch (dbErr) {
          console.warn('[AuthModal] Firestore lookup error:', dbErr);
        }
      }

      // Check local storage cache
      if (!existingProfile) {
        try {
          const cachedRaw = localStorage.getItem(`gw_user_${cleanPhone}`);
          if (cachedRaw) {
            const parsed = JSON.parse(cachedRaw);
            if (parsed && parsed.name && parsed.name.trim() && parsed.name !== 'Greenwood Guest') {
              existingProfile = parsed;
            }
          }
        } catch {}
      }

      // CASE A: EXISTING REGISTERED USER -> Direct "Welcome Back, {Name}"!
      // We NEVER ask for name again, and NEVER overwrite their saved name!
      if (existingProfile && existingProfile.name) {
        const authData: CustomerAuth = {
          name: existingProfile.name,
          phone: cleanPhone,
          email: existingProfile.email || undefined,
          verified: true,
          loggedInAt: Date.now(),
        };

        setCustomerAuth(authData);
        setWelcomeName(existingProfile.name);
        setIsExistingUser(true);
        setVerifiedAuthData(authData);
        setLoading(false);
        setStep('welcome');

        // Auto close and proceed after a short friendly celebration
        setTimeout(() => {
          onSuccess(authData);
          onClose();
        }, 1300);
      } else {
        // CASE B: FIRST-TIME REGISTRATION -> Move to Onboarding step (Name & Address)
        setLoading(false);
        setStep('onboarding');
      }
    } catch (err: any) {
      console.error('[Firebase Auth] Code verification error:', err);
      setLoading(false);
      const errCode = err?.code || '';
      if (errCode === 'auth/invalid-verification-code') {
        setError('Incorrect verification code. Please check your SMS messages and enter the correct 6-digit code.');
      } else if (errCode === 'auth/code-expired') {
        setError('The verification code has expired. Please click "Resend OTP" to receive a new code.');
      } else {
        setError(err?.message || 'Invalid code. Please enter the 6-digit code received on your phone.');
      }
    }
  };

  // STEP 3: Save First-Time Profile (Name & Delivery Address)
  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = onboardName.trim();
    if (!cleanName || cleanName.length < 2) {
      setError('Please enter your full name (minimum 2 characters).');
      return;
    }

    const cleanPhone = (verifiedPhone || phone).replace(/\D/g, '').slice(-10);
    const house = onboardHouse.trim();
    const area = onboardArea.trim();
    const landmark = onboardLandmark.trim();
    const pincode = onboardPincode.trim() || '110040';

    if (!house) {
      setError('Please enter your House / Flat / Floor Number.');
      return;
    }
    if (!area) {
      setError('Please enter your Sector, Pocket, or Colony in Narela.');
      return;
    }

    setLoading(true);

    try {
      const fullAddressLine = `${house}, ${area}${landmark ? `, Near ${landmark}` : ''}, Narela, Delhi - ${pincode}`;

      const initialAddress = {
        id: `addr-${Date.now()}`,
        type: 'Home' as const,
        addressLine: fullAddressLine,
        flatHouse: house,
        streetArea: area,
        landmark: landmark,
        city: 'Narela, Delhi',
        pincode: pincode,
        phone: cleanPhone,
        isDefault: true,
      };

      const newProfile = {
        phone: cleanPhone,
        name: cleanName,
        email: onboardEmail.trim() || '',
        addresses: [initialAddress],
        favouriteDishIds: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // 1. Save new account to Cloud Firestore /users/{cleanPhone}
      if (firestore) {
        await setDoc(doc(firestore, 'users', cleanPhone), newProfile, { merge: true });
      }

      // 2. Cache in localStorage
      localStorage.setItem(`gw_user_${cleanPhone}`, JSON.stringify(newProfile));

      // 3. Set customer session
      const authData: CustomerAuth = {
        name: cleanName,
        phone: cleanPhone,
        email: onboardEmail.trim() || undefined,
        verified: true,
        loggedInAt: Date.now(),
      };

      setCustomerAuth(authData);
      setWelcomeName(cleanName);
      setIsExistingUser(false);
      setVerifiedAuthData(authData);
      setLoading(false);
      setStep('welcome');

      setTimeout(() => {
        onSuccess(authData);
        onClose();
      }, 1300);
    } catch (err: any) {
      console.error('[AuthModal] Profile creation error:', err);
      setLoading(false);
      setError('Failed to save profile: ' + (err?.message || 'Please try again'));
    }
  };

  // Google One-Click Sign-in Handler
  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      if (!auth) {
        throw new Error('Firebase Auth is not initialized');
      }
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const displayName = user.displayName || 'Greenwood Guest';
      const email = user.email || undefined;
      const userPhone = user.phoneNumber ? user.phoneNumber.replace(/\D/g, '').slice(-10) : '';

      if (userPhone) {
        let existingProfile: any = null;
        if (firestore) {
          try {
            const snap = await getDoc(doc(firestore, 'users', userPhone));
            if (snap.exists() && snap.data()?.name && snap.data()?.name !== 'Greenwood Guest') {
              existingProfile = snap.data();
            }
          } catch {}
        }

        const finalName = existingProfile?.name || displayName;
        const authData: CustomerAuth = {
          name: finalName,
          phone: userPhone,
          email: email,
          verified: true,
          loggedInAt: Date.now(),
        };

        setCustomerAuth(authData);
        setWelcomeName(finalName);
        setIsExistingUser(Boolean(existingProfile));
        setVerifiedAuthData(authData);
        setGoogleLoading(false);
        setStep('welcome');

        setTimeout(() => {
          onSuccess(authData);
          onClose();
        }, 1300);
      } else {
        // For delivery orders, we need a 10-digit mobile number
        setOnboardName(displayName);
        setOnboardEmail(email || '');
        setGoogleLoading(false);
        setError('Please enter your 10-digit mobile number to complete Google Sign-In.');
      }
    } catch (err: any) {
      console.error('[Firebase Auth] Google Sign-in error:', err);
      setGoogleLoading(false);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in popup was closed.');
      } else {
        setError(err.message || 'Google sign-in could not be completed.');
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FFFDF8] rounded-2xl border border-[#E8DDCA] shadow-2xl p-6 sm:p-7 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Invisible Recaptcha Container */}
        <div id="recaptcha-container" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF6EE] text-[#4B5149] hover:text-[#17261D] hover:bg-[#E8DDCA] flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
          aria-label="Close dialog"
        >
          ✕
        </button>

        {/* Header with Botanical Branding */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center gap-1.5 text-[#163E26] mb-1">
            <LeafBranch flip={false} className="w-5 h-2.5" />
            <span className="font-serif text-sm tracking-wider uppercase font-semibold text-[#163E26]">
              Greenwood Customer Auth
            </span>
            <LeafBranch flip={true} className="w-5 h-2.5" />
          </div>

          <h2 className="font-serif text-2xl font-bold text-[#17261D] mt-1">
            {step === 'phone' && 'Customer Sign In'}
            {step === 'otp' && 'Verify Mobile OTP'}
            {step === 'onboarding' && 'Complete Your Profile'}
            {step === 'welcome' && (isExistingUser ? 'Welcome Back!' : 'Account Created!')}
          </h2>

          <p className="text-xs text-[#77766D] mt-1 max-w-xs mx-auto">
            {step === 'phone' && 'Enter your 10-digit mobile number to access your account & track orders.'}
            {step === 'otp' && `A 6-digit code has been dispatched for +91 ${phone.replace(/\D/g, '').slice(-10)}`}
            {step === 'onboarding' && 'First time at Greenwood Café? Please enter your name and delivery address.'}
            {step === 'welcome' && `Signed in as +91 ${(verifiedPhone || phone).replace(/\D/g, '').slice(-10)}`}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#C83A25] text-xs font-medium text-center">
            {error}
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 1: ONLY MOBILE NUMBER INPUT (No Name Upfront!)       */}
        {/* ======================================================== */}
        {step === 'phone' && (
          <div className="space-y-4">
            {/* Google One-Click Sign-in Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-[#FAF6EE] border border-[#E8DDCA] py-2.5 px-4 rounded-xl text-sm font-semibold text-[#17261D] shadow-xs hover:border-[#C9A45C] transition-all cursor-pointer active:scale-98 disabled:opacity-75"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{googleLoading ? 'Signing in with Google...' : 'Continue with Google'}</span>
            </button>

            <div className="flex items-center my-3">
              <div className="flex-1 border-t border-[#E8DDCA]" />
              <span className="px-3 text-[11px] font-semibold text-[#8F5D2C] uppercase tracking-wider">
                Or Mobile OTP
              </span>
              <div className="flex-1 border-t border-[#E8DDCA]" />
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#17261D] mb-1.5">
                  Mobile Number <span className="text-[#C83A25]">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-[#E8DDCA] bg-[#FAF6EE] text-[#4B5149] text-sm font-semibold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 XXXXX"
                    className="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#E8DDCA] rounded-r-xl text-sm text-[#17261D] placeholder-[#9CA3AF] focus:outline-none focus:border-[#163E26] transition-colors tracking-wider font-mono text-base"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-[#77766D] mt-1.5 flex items-center gap-1">
                  <span>🔒</span> Fast 6-digit OTP verification for instant order tracking and account access.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full bg-[#163E26] hover:bg-[#1f5635] text-white py-3 rounded-xl font-semibold text-sm shadow-md transition-all active:scale-98 disabled:opacity-75 cursor-pointer mt-2"
              >
                {loading ? 'Sending SMS OTP...' : 'Send 6-Digit OTP →'}
              </button>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: 6-DIGIT OTP VERIFICATION                         */}
        {/* ======================================================== */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="bg-[#F0FDF4] border border-[#86EFAC] rounded-xl p-3.5 text-center">
              <p className="text-xs text-[#166534] font-semibold flex items-center justify-center gap-1.5">
                <span>📲</span> 6-Digit SMS Code Sent to +91 {phone.replace(/\D/g, '').slice(-10)}
              </p>
              <p className="text-[11px] text-[#14532D] mt-1">
                Google SMS service has dispatched a code to your phone. Check your Messages app and enter the 6 digits below.
              </p>
            </div>

            <div className="text-center">
              <label className="block text-xs font-semibold text-[#17261D] mb-2.5">
                Enter 6-Digit Code from SMS
              </label>

              <div className="flex justify-center gap-1.5 sm:gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={otp[index] || ''}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold bg-[#FAF6EE] border border-[#E8DDCA] focus:border-[#163E26] focus:bg-white rounded-xl text-[#17261D] focus:outline-none transition-all shadow-2xs font-mono"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#77766D] pt-2">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-[#163E26] hover:underline font-medium cursor-pointer"
              >
                ← Edit Number
              </button>

              <button
                type="button"
                onClick={() => handleSendOtp()}
                disabled={resendTimer > 0 || loading}
                className="text-[#163E26] hover:underline disabled:text-[#77766D] disabled:opacity-50 font-medium cursor-pointer"
              >
                {resendTimer > 0 ? `Resend SMS OTP in ${resendTimer}s` : 'Resend SMS Code'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#163E26] hover:bg-[#1f5635] text-white py-3 rounded-xl font-semibold text-sm shadow-md transition-all active:scale-98 disabled:opacity-75 cursor-pointer mt-2"
            >
              {loading ? 'Verifying with Firebase...' : 'Verify & Continue →'}
            </button>
          </form>
        )}

        {/* ======================================================== */}
        {/* STEP 3: FIRST-TIME USER ONBOARDING (Name & Address)       */}
        {/* ======================================================== */}
        {step === 'onboarding' && (
          <form onSubmit={handleCompleteOnboarding} className="space-y-3.5 max-h-[70vh] overflow-y-auto pr-1">
            <div className="bg-[#FAF6EE] border border-[#C9A45C]/50 rounded-xl p-3 text-xs text-[#8F5D2C] leading-relaxed">
              👋 <strong>Almost done!</strong> Set your name and delivery address once. Future logins for <strong>+91 {verifiedPhone}</strong> will automatically sign you straight in!
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17261D] mb-1">
                Full Name <span className="text-[#C83A25]">*</span>
              </label>
              <input
                type="text"
                required
                value={onboardName}
                onChange={(e) => setOnboardName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#E8DDCA] rounded-xl text-sm text-[#17261D] placeholder-[#9CA3AF] focus:outline-none focus:border-[#163E26] transition-colors"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17261D] mb-1">
                Email Address <span className="text-[#77766D] font-normal">(Optional for receipts)</span>
              </label>
              <input
                type="email"
                value={onboardEmail}
                onChange={(e) => setOnboardEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#E8DDCA] rounded-xl text-sm text-[#17261D] placeholder-[#9CA3AF] focus:outline-none focus:border-[#163E26] transition-colors"
              />
            </div>

            <div className="pt-2 border-t border-[#E8DDCA]/60">
              <span className="block text-xs font-bold text-[#163E26] uppercase tracking-wider mb-2">
                🏠 Primary Delivery Address (Narela)
              </span>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#17261D] mb-1">
                    House / Flat / Floor No. <span className="text-[#C83A25]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={onboardHouse}
                    onChange={(e) => setOnboardHouse(e.target.value)}
                    placeholder="e.g. Flat 402, Tower B"
                    className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#E8DDCA] rounded-xl text-xs text-[#17261D] placeholder-[#9CA3AF] focus:outline-none focus:border-[#163E26]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#17261D] mb-1">
                    Sector / Area / Colony <span className="text-[#C83A25]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={onboardArea}
                    onChange={(e) => setOnboardArea(e.target.value)}
                    placeholder="e.g. Sector A10, Pocket 2, Narela"
                    className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#E8DDCA] rounded-xl text-xs text-[#17261D] placeholder-[#9CA3AF] focus:outline-none focus:border-[#163E26]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#17261D] mb-1">
                      Landmark <span className="text-[#77766D] font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={onboardLandmark}
                      onChange={(e) => setOnboardLandmark(e.target.value)}
                      placeholder="e.g. Near DDA Park"
                      className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#E8DDCA] rounded-xl text-xs text-[#17261D] placeholder-[#9CA3AF] focus:outline-none focus:border-[#163E26]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#17261D] mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={onboardPincode}
                      onChange={(e) => setOnboardPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="110040"
                      className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#E8DDCA] rounded-xl text-xs text-[#17261D] placeholder-[#9CA3AF] focus:outline-none focus:border-[#163E26]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#163E26] hover:bg-[#1f5635] text-white py-3 rounded-xl font-semibold text-sm shadow-md transition-all active:scale-98 disabled:opacity-75 cursor-pointer mt-3"
            >
              {loading ? 'Creating Account...' : 'Complete Account & Continue →'}
            </button>
          </form>
        )}

        {/* ======================================================== */}
        {/* STEP 4: CELEBRATION / WELCOME BACK SCREEN                */}
        {/* ======================================================== */}
        {step === 'welcome' && (
          <div className="text-center py-6 space-y-4 animate-scale-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#EAF5E9] border-2 border-[#163E26] text-[#163E26] flex items-center justify-center text-3xl shadow-inner">
              ✓
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold text-[#17261D]">
                {isExistingUser ? `Welcome Back, ${welcomeName}! 👋` : `Welcome, ${welcomeName}! 🎉`}
              </h3>
              <p className="text-xs text-[#77766D] mt-1.5 max-w-xs mx-auto">
                {isExistingUser
                  ? `Your Greenwood account (+91 ${verifiedPhone || phone}) is verified.`
                  : `Your account and default delivery address have been saved successfully.`}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  if (verifiedAuthData) onSuccess(verifiedAuthData);
                  onClose();
                }}
                className="w-full bg-[#163E26] hover:bg-[#1f5635] text-white py-3 rounded-xl font-semibold text-sm shadow-md transition-all active:scale-98 cursor-pointer"
              >
                Continue to Greenwood &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
