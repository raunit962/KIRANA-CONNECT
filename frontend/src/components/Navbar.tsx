import React from 'react';
import { useApp } from '../context/AppContext';
import { RefreshCw, Languages, ArrowLeft, Menu, BookOpen } from 'lucide-react';

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
  const { language, setLanguage, resetToDemoState } = useApp();

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
      <div className="bg-[#171717] border-b border-[#D8C3A5]/20 text-xs py-1.5 px-4 text-center flex flex-wrap items-center justify-between gap-2 z-50 relative">
        <div className="flex items-center space-x-2 mx-auto sm:mx-0">
          <span className="bg-[#B85C38] text-white font-black px-2 py-0.5 rounded text-[10px] tracking-wider uppercase shadow-xs">
            PUDO 2.0
          </span>
          <span className="text-[#D8C3A5] font-semibold text-xs">
            Transportation &amp; Logistics: Relieving Urban Transport Networks &amp; Logistics Infrastructure
          </span>
        </div>

        {onSelectTab && (
          <button
            onClick={() => onSelectTab('COVER')}
            className="hidden sm:flex items-center space-x-1.5 text-xs text-[#fffd47] hover:underline font-bold"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>View Book Cover Page</span>
          </button>
        )}
      </div>

      <header className="bg-[#171717] border-b border-[#D8C3A5]/20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-3">
          {/* Left: Logo & Back to Cover Page */}
          <div className="flex items-center space-x-3">
            {onSelectTab && activeTab !== 'COVER' && (
              <button
                onClick={() => onSelectTab('COVER')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#F8F5EF] hover:bg-white text-[#171717] text-xs font-bold transition shadow-xs border border-[#D8C3A5]"
                title="Return to Book Cover Page"
              >
                <ArrowLeft className="w-4 h-4 text-[#B85C38]" />
                <span className="hidden md:inline">Cover Page</span>
              </button>
            )}

            <div
              onClick={() => onSelectTab && onSelectTab('COVER')}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-xs border border-white/80">
                <img
                  src="/logo-transparent.png"
                  alt="KiranaConnect Logo"
                  className="w-full h-full object-contain group-hover:scale-105 transition"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#F8F5EF] leading-tight">
                  <span>Kirana</span><span className="text-[#B85C38]">Connect</span>
                </h2>
                <div className="text-[10px] text-[#D8C3A5] font-semibold flex items-center gap-1">
                  <span>{getPortalTitle()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Controls (Right) */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Slide Bar Menu Toggle */}
            {onOpenSlideMenu && (
              <button
                onClick={onOpenSlideMenu}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#B85C38] hover:bg-[#A94D2F] text-white text-xs font-bold transition shadow-sm border border-[#D8C3A5]/40"
                title="Open All Portals Slide Bar"
              >
                <Menu className="w-4 h-4 text-[#fffd47]" />
                <span className="hidden sm:inline">Portals Menu</span>
              </button>
            )}

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#262626] hover:bg-[#333] text-[#F8F5EF] border border-[#D8C3A5]/30 text-xs font-bold transition shadow-xs"
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
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#262626] hover:bg-red-950/40 text-[#D8C3A5] hover:text-red-300 border border-[#D8C3A5]/30 hover:border-red-500/50 text-xs font-semibold transition shadow-xs"
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
