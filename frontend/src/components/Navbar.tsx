import React from 'react';
import { useApp } from '../context/AppContext';
import { RefreshCw, Languages, Home, Menu, Sparkles, KeyRound } from 'lucide-react';

interface NavbarProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  onOpenSlideMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab = 'COVER',
  onSelectTab,
  onOpenSlideMenu,
}) => {
  const {
    language,
    setLanguage,
    resetToDemoState,
    currentUser,
    openAuthModal,
    logoutUser,
  } = useApp();

  const getPortalTitle = () => {
    switch (activeTab) {
      case 'CUSTOMER':
        return language === 'hi' ? 'ग्राहक पिकअप पोर्टल' : 'Customer Pickup Portal';
      case 'AGENT':
        return language === 'hi' ? 'राइडर डिलीवरी ओएस' : 'Delivery Rider Gig OS';
      case 'MERCHANT':
        return language === 'hi' ? 'किराना मर्चेंट हब' : 'Kirana Merchant Hub';
      case 'ADMIN':
        return language === 'hi' ? 'लॉजिस्टिक्स एडमिन टॉवर' : 'Logistics Admin Hub';
      case 'SIMULATOR':
        return language === 'hi' ? 'इंटरैक्टिव फ्लो सिमुलेटर' : 'Interactive Flow Lab';
      default:
        return 'Logistics Network';
    }
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#0B2317] border-b border-[#1A5336]/40 text-xs py-1.5 px-4 text-center flex flex-wrap items-center justify-between gap-2 z-50 relative">
        <div className="flex items-center space-x-2 mx-auto sm:mx-0">
          <span className="bg-[#1A5336] text-[#fffd47] font-black px-2 py-0.5 rounded text-[10px] tracking-wider uppercase shadow-xs border border-[#fffd47]/30">
            PUDO
          </span>
          <span className="text-[#D1E7DD] font-medium text-xs">
            Transportation &amp; Logistics: Relieving Urban Transport Networks &amp; Logistics Infrastructure
          </span>
        </div>

        {onSelectTab && (
          <button
            onClick={() => onSelectTab('COVER')}
            className="hidden sm:flex items-center space-x-1.5 text-xs text-[#fffd47] hover:underline font-bold"
          >
            <Home className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Home</span>
          </button>
        )}
      </div>

      <header className="bg-[#0F291E] border-b border-[#1A5336]/40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          {/* Left: Logo & Return to Home */}
          <div className="flex items-center space-x-3">
            {onSelectTab && activeTab !== 'COVER' && (
              <button
                onClick={() => onSelectTab('COVER')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#1A5336] hover:bg-[#133F28] text-white text-xs font-bold transition shadow-xs border border-[#38BDF8]/40"
                title="Return to Home"
              >
                <Home className="w-4 h-4 text-[#fffd47]" />
                <span className="hidden md:inline">Home</span>
              </button>
            )}

            <div
              onClick={() => onSelectTab && onSelectTab('COVER')}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-md border border-white/80 group-hover:scale-105 transition">
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
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#F8F5EF] leading-tight">
                  <span>Kirana</span>
                  <span className="text-[#F5A623]">Connect</span>
                </h2>
                <div className="font-roxborough font-bold text-xs sm:text-sm md:text-base text-[#fffd47] flex items-center gap-1">
                  <span>{getPortalTitle()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Controls (Right) */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* User Session Chip / Login Button */}
            {currentUser ? (
              <div className="flex items-center space-x-2 bg-[#133827] border border-[#1A5336] rounded-xl px-2.5 py-1.5 text-xs shadow-xs">
                <div className="w-6 h-6 rounded-full bg-[#1A5336] border border-[#fffd47]/60 flex items-center justify-center font-bold text-white text-[11px] shrink-0">
                  {currentUser.role === 'MERCHANT' ? '🏪' : currentUser.role === 'AGENT' ? '🛵' : '👤'}
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <div className="text-[#F8F5EF] font-bold text-xs flex items-center gap-1.5">
                    <span className="truncate max-w-[110px]">{currentUser.name.split(' ')[0]}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#fffd47]/20 text-[#fffd47] rounded font-bold">
                      {currentUser.role === 'MERCHANT' ? 'Dukandar' : currentUser.role === 'AGENT' ? 'Rider' : 'Shopper'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={logoutUser}
                  className="text-[10px] text-red-300 hover:text-white hover:bg-red-900/60 px-1.5 py-0.5 rounded transition font-semibold"
                  title="Log out of session"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('CUSTOMER')}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#fffd47] hover:bg-[#fffd47]/90 text-[#0F291E] text-xs font-black transition shadow-sm border border-[#fffd47] active:scale-95"
                title="Log in to KiranaConnect"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#0F291E]" />
                <span className="font-bold">Log In</span>
              </button>
            )}

            {/* Slide Bar Menu Toggle */}
            {onOpenSlideMenu && (
              <button
                onClick={onOpenSlideMenu}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#1A5336] hover:bg-[#133F28] text-white text-xs font-bold transition shadow-sm border border-[#fffd47]/30"
                title="Open All Portals Slide Bar"
              >
                <Menu className="w-4 h-4 text-[#fffd47]" />
                <span className="hidden sm:inline">Portals Menu</span>
              </button>
            )}

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#133827] hover:bg-[#1A5336] text-[#F8F5EF] border border-[#1A5336] text-xs font-bold transition shadow-xs"
              title="Switch Language / भाषा बदलें"
            >
              <Languages className="w-4 h-4 text-[#fffd47]" />
              <span className="hidden xs:inline">{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Reset Demo Button */}
            <button
              onClick={() => {
                if (confirm('Reset application to original demo state?')) {
                  resetToDemoState();
                }
              }}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#133827] hover:bg-red-950/50 text-[#D1E7DD] hover:text-red-300 border border-[#1A5336] hover:border-red-500/50 text-xs font-semibold transition shadow-xs"
              title="Reset demo data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
