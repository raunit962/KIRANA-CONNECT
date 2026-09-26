import React from 'react';
import {
  X,
  Store,
  Bike,
  UserCheck,
  BarChart3,
  PlayCircle,
  Home,
  Globe,
  RotateCcw,
  KeyRound,
  User,
  Network,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PortalSlideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const PortalSlideMenu: React.FC<PortalSlideMenuProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
}) => {
  const {
    language,
    setLanguage,
    resetToDemoState,
    currentUser,
    openAuthModal,
    logoutUser,
  } = useApp();

  if (!isOpen) return null;

  const portals = [
    {
      id: 'CUSTOMER',
      title: 'Customer Pickup',
      hindiTitle: 'ग्राहक पिकअप पोर्टल',
      desc: 'Digital QR Boarding Pass, 72h countdown, audio OTP & WhatsApp alert pass',
      icon: UserCheck,
      color: 'bg-[#fffd47]/25 text-[#0F291E] border-[#fffd47]/40',
      activeBorder: 'border-[#1A5336] ring-2 ring-[#fffd47]',
      badge: 'Self Collection',
      badgeColor: 'bg-[#fffd47]/20 text-[#1A5336] border-[#fffd47]/40',
    },
    {
      id: 'AGENT',
      title: 'Delivery Rider',
      hindiTitle: 'डिलीवरी राइडर ओएस',
      desc: 'Consolidated batch drop, camera photo-proof verification & route navigation',
      icon: Bike,
      color: 'bg-[#38BDF8]/20 text-[#0284C7] border-[#38BDF8]/40',
      activeBorder: 'border-[#0284C7] ring-2 ring-[#38BDF8]',
      badge: 'Batch Logistics',
      badgeColor: 'bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]',
    },
    {
      id: 'MERCHANT',
      title: 'Kirana Merchant',
      hindiTitle: 'किराना मर्चेंट हब',
      desc: 'Physical 2D shelf rack map (A-01 to C-10), UPI Soundbox & ₹15/drop settlement',
      icon: Store,
      color: 'bg-[#1A5336]/20 text-[#1A5336] border-[#1A5336]/30',
      activeBorder: 'border-[#1A5336] ring-2 ring-[#fffd47]',
      badge: 'Soundbox Verified',
      badgeColor: 'bg-[#EAF3ED] text-[#1A5336] border-[#CDE3D5]',
    },
    {
      id: 'ADMIN',
      title: 'Logistics Admin Hub',
      hindiTitle: 'लॉजिस्टिक्स एडमिन टॉवर',
      desc: 'Haversine store matchmaking, Green Footprint Tracker & Doorstep vs PUDO ROI',
      icon: BarChart3,
      color: 'bg-[#38BDF8]/20 text-[#0284C7] border-[#38BDF8]/40',
      activeBorder: 'border-[#0284C7] ring-2 ring-[#38BDF8]',
      badge: 'Urban Command',
      badgeColor: 'bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]',
    },
    {
      id: 'SIMULATOR',
      title: 'Interactive Flow Lab',
      hindiTitle: 'इंटरैक्टिव फ्लो लैब',
      desc: 'Step-by-step 60-second end-to-end delivery lifecycle simulation with event stream',
      icon: PlayCircle,
      color: 'bg-[#9fa683]/20 text-[#3A4027] border-[#9fa683]/40',
      activeBorder: 'border-[#9fa683] ring-2 ring-[#9fa683]',
      badge: 'Live Simulator',
      badgeColor: 'bg-[#9fa683]/25 text-[#2C311F] border-[#9fa683]/50',
    },
    {
      id: 'ARCHITECTURE',
      title: 'System Architecture',
      hindiTitle: 'सिस्टम आर्किटेक्चर',
      desc: 'Interactive 4-tier GitDiagram topology: Actors, Portals, UI, Express APIs, & Domain Services',
      icon: Network,
      color: 'bg-[#1A5336]/20 text-[#1A5336] border-[#1A5336]/30',
      activeBorder: 'border-[#1A5336] ring-2 ring-[#fffd47]',
      badge: 'GitDiagram',
      badgeColor: 'bg-[#EAF3ED] text-[#1A5336] border-[#CDE3D5]',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Dimmed Backdrop with blur */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Slide Drawer from Right */}
      <aside className="absolute inset-y-0 right-0 max-w-md w-full bg-[#F4F8F5] shadow-2xl border-l border-[#CDE3D5] flex flex-col z-50 transform transition-transform duration-300 ease-out">
        {/* Drawer Header */}
        <div className="p-5 bg-[#0F291E] text-white border-b border-[#1A5336]/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-md">
              <img
                src="/logo-transparent.png"
                alt="KiranaConnect Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-[#F8F5EF] tracking-tight">
                  Kirana<span className="text-[#fffd47]">Connect</span>
                </span>
                <span className="text-[10px] bg-[#fffd47]/20 text-[#fffd47] px-2 py-0.5 rounded-full font-mono font-bold border border-[#fffd47]/40">
                  PORTALS
                </span>
              </div>
              <p className="text-xs text-[#D1E7DD]">Select any operational portal</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onSelectTab('COVER');
                onClose();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-[#1A5336] hover:bg-[#133F28] text-[#fffd47] text-xs font-bold transition flex items-center gap-1 border border-[#fffd47]/30"
              title="Return to Home"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Portal Cards List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* User Account Session Card */}
          {currentUser ? (
            <div className="p-3.5 bg-white rounded-2xl border border-[#CDE3D5] shadow-xs flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1A5336] text-[#fffd47] flex items-center justify-center font-bold text-base shadow-xs">
                  {currentUser.role === 'MERCHANT' ? '🏪' : currentUser.role === 'AGENT' ? '🛵' : '👤'}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0F291E] flex items-center gap-1.5">
                    <span>{currentUser.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#fffd47]/30 text-[#1A5336] font-bold rounded-full">
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#4A5B52] font-mono">{currentUser.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => {
                    openAuthModal(currentUser.role);
                  }}
                  className="px-2 py-1 bg-[#EAF3ED] hover:bg-[#D1E7DD] text-[#1A5336] rounded-lg text-[10px] font-bold transition"
                >
                  Switch
                </button>
                <button
                  onClick={logoutUser}
                  className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-[10px] font-bold transition"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-[#0F291E] text-white rounded-2xl border border-[#1A5336] shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-[#fffd47]">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Account Login</span>
                </div>
                <span className="text-[9px] text-[#D1E7DD] font-mono">OTP Verified</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => {
                    openAuthModal('CUSTOMER');
                    onClose();
                  }}
                  className="py-1.5 bg-[#1A5336] hover:bg-[#133F28] text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition"
                >
                  <User className="w-3 h-3 text-[#fffd47]" />
                  <span>Customer</span>
                </button>
                <button
                  onClick={() => {
                    openAuthModal('AGENT');
                    onClose();
                  }}
                  className="py-1.5 bg-[#1A5336] hover:bg-[#133F28] text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition"
                >
                  <Bike className="w-3 h-3 text-[#38BDF8]" />
                  <span>Rider</span>
                </button>
                <button
                  onClick={() => {
                    openAuthModal('MERCHANT');
                    onClose();
                  }}
                  className="py-1.5 bg-[#1A5336] hover:bg-[#133F28] text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition"
                >
                  <Store className="w-3 h-3 text-[#fffd47]" />
                  <span>Merchant</span>
                </button>
              </div>
            </div>
          )}

          <div className="text-[11px] font-bold uppercase tracking-wider text-[#1A5336] px-1 flex items-center justify-between pt-1">
            <span>{language === 'hi' ? 'संचालन पोर्टल' : 'Operational Portals'}</span>
            <span className="text-[10px] font-mono text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-full border border-[#BAE6FD]">
              6 Active Modules
            </span>
          </div>

          {portals.map((p) => {
            const Icon = p.icon;
            const isSelected = activeTab === p.id;

            return (
              <div
                key={p.id}
                onClick={() => {
                  onSelectTab(p.id);
                  onClose();
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 group relative ${
                  isSelected
                    ? 'bg-white ' + p.activeBorder + ' shadow-md'
                    : 'bg-white hover:bg-[#EAF3ED]/60 border-[#CDE3D5] hover:border-[#1A5336]/40 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${p.color} shadow-xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-roxborough font-bold text-sm text-[#0B2317] leading-tight">
                          {language === 'hi' ? p.hindiTitle : p.title}
                        </h4>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#1A5336] animate-ping shrink-0" />
                        )}
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mt-0.5 inline-block ${p.badgeColor}`}>
                        {p.badge}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                    isSelected
                      ? 'bg-[#1A5336] text-[#fffd47] border-[#1A5336]'
                      : 'bg-[#F4F8F5] text-[#4A5B52] border-[#CDE3D5]'
                  }`}>
                    {isSelected ? 'ACTIVE' : 'OPEN'}
                  </span>
                </div>

                <p className="text-xs text-[#4A5B52] mt-2.5 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Drawer Bottom Utility Bar */}
        <div className="p-4 bg-white border-t border-[#CDE3D5] flex items-center justify-between text-xs">
          {/* Language toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#EAF3ED] border border-[#CDE3D5] text-[#0F291E] font-semibold hover:border-[#1A5336] transition shadow-xs"
          >
            <Globe className="w-3.5 h-3.5 text-[#1A5336]" />
            <span>{language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}</span>
          </button>

          {/* Reset demo */}
          <button
            onClick={() => {
              resetToDemoState();
              onSelectTab('COVER');
              onClose();
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#EAF3ED] border border-[#CDE3D5] text-[#4A5B52] hover:text-[#0F291E] font-medium transition shadow-xs"
            title="Reset demo data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>Reset Demo</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
