import React, { useState } from 'react';
import { type CustomerAuth, setCustomerAuth } from '../services/auth';
import { api } from '../services/api';
import { LeafBranch } from './Icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (auth: CustomerAuth) => void;
  initialPhone?: string;
  initialName?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialPhone = '',
  initialName = '',
}) => {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState(['1', '2', '3', '4']);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim();
    if (!cleanName || cleanName.length < 2) {
      setError('Please enter your full name');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setResendTimer(30);
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const code = otp.join('');
    if (code.length < 4) {
      setError('Please enter the 4-digit verification code');
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      const cleanPhone = phone.replace(/\D/g, '').slice(-10);
      const authData: CustomerAuth = {
        name: name.trim(),
        phone: cleanPhone,
        verified: true,
        loggedInAt: Date.now(),
      };

      setCustomerAuth(authData);

      try {
        await api.updateProfile({
          name: authData.name,
          phone: `+91 ${authData.phone}`,
        });
      } catch {}

      setLoading(false);
      onSuccess(authData);
      onClose();
    }, 600);
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
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-1.5 text-[#163E26] mb-1">
            <LeafBranch flip={false} className="w-5 h-2.5" />
            <span className="font-serif text-sm tracking-wider uppercase font-semibold text-[#163E26]">
              Greenwood Verification
            </span>
            <LeafBranch flip={true} className="w-5 h-2.5" />
          </div>

          <h2 className="font-serif text-2xl font-bold text-[#17261D] mt-1">
            {step === 'details' ? 'Customer Identification' : 'Verify Mobile Number'}
          </h2>
          <p className="text-xs text-[#77766D] mt-1 max-w-xs mx-auto">
            {step === 'details'
              ? 'To protect your food order & enable live tracking, please provide your verified mobile number.'
              : `Enter the 4-digit code sent to +91 ${phone.replace(/\D/g, '').slice(-10)}`}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#C83A25] text-xs font-medium text-center">
            {error}
          </div>
        )}

        {/* STEP 1: Full Name & Mobile */}
        {step === 'details' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#17261D] mb-1.5">
                Full Name <span className="text-[#C83A25]">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#E8DDCA] rounded-xl text-sm text-[#17261D] placeholder-[#9CA3AF] focus:outline-none focus:border-[#163E26] transition-colors"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17261D] mb-1.5">
                Mobile Number (for OTP &amp; Rider Updates) <span className="text-[#C83A25]">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-[#E8DDCA] bg-[#FAF6EE] text-[#4B5149] text-sm font-semibold">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#E8DDCA] rounded-r-xl text-sm text-[#17261D] placeholder-[#9CA3AF] focus:outline-none focus:border-[#163E26] transition-colors"
                />
              </div>
              <p className="text-[11px] text-[#77766D] mt-1.5">
                🔒 Anonymous &amp; guest checkout is disabled to guarantee kitchen quality and delivery safety.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#163E26] hover:bg-[#1f5635] text-white py-3 rounded-xl font-semibold text-sm shadow-md transition-all active:scale-98 disabled:opacity-75 cursor-pointer mt-2"
            >
              {loading ? 'Sending Code...' : 'Send Verification OTP →'}
            </button>
          </form>
        )}

        {/* STEP 2: 4-digit OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="bg-[#FAF6EE] p-3 rounded-xl border border-[#E8DDCA] text-center mb-3">
              <span className="text-xs text-[#163E26] font-medium">
                Test code: <strong className="text-[#2B180F]">1 2 3 4</strong> (or any 4 digits)
              </span>
            </div>

            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={otp[index] || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    const newOtp = [...otp];
                    newOtp[index] = val;
                    setOtp(newOtp);
                    if (val && index < 3) {
                      const nextInput = document.getElementById(`otp-${index + 1}`);
                      nextInput?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !otp[index] && index > 0) {
                      const prevInput = document.getElementById(`otp-${index - 1}`);
                      prevInput?.focus();
                    }
                  }}
                  className="w-12 h-14 text-center text-xl font-bold bg-[#FAF6EE] border border-[#E8DDCA] focus:border-[#163E26] rounded-xl text-[#17261D] focus:outline-none transition-colors"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-[#77766D] pt-2">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="text-[#163E26] hover:underline font-medium cursor-pointer"
              >
                ← Change Number
              </button>

              <button
                type="button"
                onClick={() => {
                  setOtp(['1', '2', '3', '4']);
                  setResendTimer(30);
                }}
                disabled={resendTimer > 0}
                className="text-[#77766D] hover:text-[#163E26] disabled:opacity-50 cursor-pointer"
              >
                {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Code'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#163E26] hover:bg-[#1f5635] text-white py-3 rounded-xl font-semibold text-sm shadow-md transition-all active:scale-98 disabled:opacity-75 cursor-pointer mt-2"
            >
              {loading ? 'Verifying...' : 'Verify Mobile & Confirm Order'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
