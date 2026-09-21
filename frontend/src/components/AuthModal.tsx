import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserSession } from '../types';
import {
  X,
  User,
  Bike,
  Store,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  MessageSquare,
  KeyRound,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'CUSTOMER' | 'AGENT' | 'MERCHANT';
  onLoginSuccess?: (role: 'CUSTOMER' | 'AGENT' | 'MERCHANT') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'CUSTOMER',
  onLoginSuccess,
}) => {
  const { loginUser, stores } = useApp();

  const [activeRole, setActiveRole] = useState<'CUSTOMER' | 'AGENT' | 'MERCHANT'>(defaultRole);
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [demoCodeHint, setDemoCodeHint] = useState('4892');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (defaultRole) {
      setActiveRole(defaultRole);
    }
  }, [defaultRole]);

  useEffect(() => {
    if (!isOpen) {
      setStep('PHONE');
      setOtp(['', '', '', '']);
      setErrorMsg('');
      setPhone('');
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: any;
    if (step === 'OTP' && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  if (!isOpen) return null;

  // Demo Profiles for 1-Click evaluation
  const demoProfiles = {
    CUSTOMER: {
      name: 'Anirban Chatterjee',
      phone: '9830012894',
      code: '4892',
      tag: 'Verified Shopper (Salt Lake)',
    },
    AGENT: {
      name: 'Tapas Sen',
      phone: '9830299881',
      carrier: 'Shadowfax / Delhivery Fleet',
      code: '8841',
      tag: 'Certified Green EV Rider',
    },
    MERCHANT: {
      name: 'Subhashish Ghosh',
      phone: '9830123456',
      storeId: 'store-1',
      storeName: 'Ghosh Brothers Daily Provisions',
      code: '1973',
      tag: 'Official Kirana PUDO Hub',
    },
  };

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setErrorMsg('');
    const genCode = String(1000 + Math.floor(Math.random() * 9000));
    setDemoCodeHint(genCode);
    setStep('OTP');
    setResendTimer(30);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const nextOtp = [...otp];
    nextOtp[index] = val;
    setOtp(nextOtp);

    // Auto-focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const entered = otp.join('');
    if (entered.length !== 4) {
      setErrorMsg('Please enter all 4 digits of the OTP.');
      return;
    }

    completeLogin(phone);
  };

  const completeLogin = (mobileNumber: string) => {
    let session: UserSession;

    if (activeRole === 'CUSTOMER') {
      session = {
        id: 'user-cust-01',
        name: demoProfiles.CUSTOMER.name,
        phone: `+91 ${mobileNumber || demoProfiles.CUSTOMER.phone}`,
        role: 'CUSTOMER',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        loggedInAt: new Date().toISOString(),
      };
    } else if (activeRole === 'AGENT') {
      session = {
        id: 'agent-1',
        name: demoProfiles.AGENT.name,
        phone: `+91 ${mobileNumber || demoProfiles.AGENT.phone}`,
        role: 'AGENT',
        agentId: 'agent-1',
        carrier: demoProfiles.AGENT.carrier,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        loggedInAt: new Date().toISOString(),
      };
    } else {
      const targetStore = stores.find((s) => s.id === 'store-1') || stores[0];
      session = {
        id: 'merchant-1',
        name: demoProfiles.MERCHANT.name,
        phone: `+91 ${mobileNumber || demoProfiles.MERCHANT.phone}`,
        role: 'MERCHANT',
        storeId: targetStore.id,
        storeName: targetStore.storeName,
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        loggedInAt: new Date().toISOString(),
      };
    }

    loginUser(session);
    if (onLoginSuccess) {
      onLoginSuccess(activeRole);
    }
    onClose();
  };

  // 1-Click Fast Pass Demo Login
  const handleFastDemoLogin = (role: 'CUSTOMER' | 'AGENT' | 'MERCHANT') => {
    setActiveRole(role);
    const prof = demoProfiles[role];
    setPhone(prof.phone);
    completeLogin(prof.phone);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Dimmed backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-[#F4F8F5] rounded-3xl shadow-2xl border border-[#CDE3D5] overflow-hidden z-10 transition-all">
        {/* Header Bar */}
        <div className="bg-[#0F291E] p-6 text-white border-b border-[#1A5336] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-md">
              <img
                src="/logo-transparent.png"
                alt="KiranaConnect"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-[#F8F5EF] tracking-tight">
                  Kirana<span className="text-[#fffd47]">Connect</span>
                </h3>
                <span className="text-[10px] bg-[#fffd47]/20 text-[#fffd47] px-2 py-0.5 rounded-full font-mono font-bold border border-[#fffd47]/30">
                  PORTAL AUTH
                </span>
              </div>
              <p className="text-xs text-[#D1E7DD]">HyperLocal Verified Login</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Persona Role Switcher Tabs */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A5336] mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-3 gap-2 bg-[#EAF3ED] p-1.5 rounded-2xl border border-[#CDE3D5]">
              {[
                {
                  id: 'CUSTOMER' as const,
                  label: 'Customer',
                  sub: 'Grahak',
                  icon: User,
                },
                {
                  id: 'AGENT' as const,
                  label: 'Delivery Rider',
                  sub: 'Gig Partner',
                  icon: Bike,
                },
                {
                  id: 'MERCHANT' as const,
                  label: 'Kirana Hub',
                  sub: 'Dukandar',
                  icon: Store,
                },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeRole === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveRole(tab.id);
                      setErrorMsg('');
                    }}
                    className={`py-2 px-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                      isActive
                        ? 'bg-[#1A5336] text-white shadow-md ring-2 ring-[#fffd47]'
                        : 'text-[#4A5B52] hover:bg-white/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-[#fffd47]' : 'text-[#1A5336]'}`} />
                    <span className="text-xs font-bold leading-tight">{tab.label}</span>
                    <span className={`text-[9px] ${isActive ? 'text-[#D1E7DD]' : 'text-[#4A5B52]/70'}`}>{tab.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role Persona Sub-Badge */}
          <div className="bg-white p-3 rounded-2xl border border-[#CDE3D5] flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#1A5336]" />
              <span className="text-[#4A5B52]">
                Logging in as: <strong className="text-[#0F291E]">{activeRole === 'CUSTOMER' ? 'Retail Shopper' : activeRole === 'AGENT' ? '3PL Delivery Rider' : 'Official Kirana Hub Partner'}</strong>
              </span>
            </div>
            <span className="text-[10px] font-bold bg-[#EAF3ED] text-[#1A5336] px-2 py-0.5 rounded-full border border-[#CDE3D5]">
              Secured
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
              {errorMsg}
            </div>
          )}

          {/* Step 1: Phone Input */}
          {step === 'PHONE' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0F291E] mb-1.5">
                  Mobile Number
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center space-x-1.5 text-xs font-bold text-[#1A5336] border-r border-[#CDE3D5] pr-2.5">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit phone number"
                    className="w-full bg-white border border-[#CDE3D5] rounded-2xl pl-20 pr-4 py-3 text-sm font-semibold text-[#0F291E] placeholder-[#4A5B52]/60 focus:outline-none focus:border-[#1A5336] focus:ring-2 focus:ring-[#fffd47]/60 shadow-xs"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-[#4A5B52] mt-1.5 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-[#1A5336]" />
                  A 4-digit verification code will be sent via SMS / WhatsApp
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#1A5336] hover:bg-[#133F28] text-[#fffd47] font-extrabold text-sm rounded-2xl shadow-md border border-[#fffd47]/30 flex items-center justify-center space-x-2 transition"
              >
                <span>Send Verification Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Step 2: 4-Digit OTP Input */}
          {step === 'OTP' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="text-xs text-[#4A5B52]">
                  Code sent to <strong className="text-[#0F291E]">+91 {phone}</strong>{' '}
                  <button
                    type="button"
                    onClick={() => setStep('PHONE')}
                    className="text-[#1A5336] underline font-bold ml-1"
                  >
                    Edit
                  </button>
                </div>
                <div className="inline-block bg-[#fffd47]/30 border border-[#fffd47] px-3 py-1 rounded-xl text-xs font-mono font-bold text-[#0F291E]">
                  Demo OTP Code: <span className="text-[#1A5336] text-sm tracking-widest">{demoCodeHint}</span>
                </div>
              </div>

              {/* 4 Inputs */}
              <div className="flex justify-center space-x-3 my-2">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={otp[idx]}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-12 h-14 bg-white border-2 border-[#CDE3D5] focus:border-[#1A5336] focus:ring-4 focus:ring-[#fffd47]/40 rounded-2xl text-center text-xl font-mono font-black text-[#0F291E] shadow-sm outline-none transition"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-[#4A5B52]">
                <span>Didn't receive code?</span>
                {resendTimer > 0 ? (
                  <span className="font-mono text-[#4A5B52]/70">Resend in {resendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    className="text-[#1A5336] font-bold hover:underline"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#1A5336] hover:bg-[#133F28] text-[#fffd47] font-extrabold text-sm rounded-2xl shadow-md border border-[#fffd47]/30 flex items-center justify-center space-x-2 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Enter {activeRole === 'CUSTOMER' ? 'Pickup Portal' : activeRole === 'AGENT' ? 'Rider OS' : 'Merchant Hub'}</span>
              </button>
            </form>
          )}

          {/* Quick Demo Login Fast-Pass Chips */}
          <div className="pt-2 border-t border-[#CDE3D5]">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A5B52] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#fffd47] fill-[#fffd47]" />
                1-Click Instant Demo Login
              </span>
              <span className="text-[10px] text-[#1A5336] font-mono font-semibold bg-[#EAF3ED] px-2 py-0.5 rounded-md">
                Fast-Pass
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleFastDemoLogin('CUSTOMER')}
                className="p-2.5 rounded-2xl bg-white hover:bg-[#EAF3ED] border border-[#CDE3D5] text-left transition shadow-xs group"
              >
                <div className="flex items-center space-x-1.5 mb-1">
                  <User className="w-3.5 h-3.5 text-[#1A5336]" />
                  <span className="text-[11px] font-bold text-[#0F291E]">Customer</span>
                </div>
                <div className="text-[10px] text-[#4A5B52] truncate">Anirban Chatterjee</div>
                <div className="text-[9px] font-mono text-[#1A5336] font-semibold mt-0.5">Pickup Pass Ready</div>
              </button>

              <button
                type="button"
                onClick={() => handleFastDemoLogin('AGENT')}
                className="p-2.5 rounded-2xl bg-white hover:bg-[#EAF3ED] border border-[#CDE3D5] text-left transition shadow-xs group"
              >
                <div className="flex items-center space-x-1.5 mb-1">
                  <Bike className="w-3.5 h-3.5 text-[#1A5336]" />
                  <span className="text-[11px] font-bold text-[#0F291E]">Rider</span>
                </div>
                <div className="text-[10px] text-[#4A5B52] truncate">Tapas Sen (EV)</div>
                <div className="text-[9px] font-mono text-[#0284C7] font-semibold mt-0.5">Shadowfax Fleet</div>
              </button>

              <button
                type="button"
                onClick={() => handleFastDemoLogin('MERCHANT')}
                className="p-2.5 rounded-2xl bg-white hover:bg-[#EAF3ED] border border-[#CDE3D5] text-left transition shadow-xs group"
              >
                <div className="flex items-center space-x-1.5 mb-1">
                  <Store className="w-3.5 h-3.5 text-[#1A5336]" />
                  <span className="text-[11px] font-bold text-[#0F291E]">Kirana</span>
                </div>
                <div className="text-[10px] text-[#4A5B52] truncate">Ghosh Brothers</div>
                <div className="text-[9px] font-mono text-[#fffd47] bg-[#0F291E] px-1 rounded inline-block mt-0.5">₹1,850 Wallet</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
