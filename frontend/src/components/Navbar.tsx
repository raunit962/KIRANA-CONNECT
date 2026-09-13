import React from 'react';
import { useApp } from '../context/AppContext';
import { Store, RefreshCw, Languages } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, setLanguage, resetToDemoState } = useApp();

  return (
    <>
      {/* SIH 2026 PS 26205 Top Banner */}
      <div className="bg-[#171717] border-b border-[#D8C3A5]/20 text-xs py-1.5 px-4 text-center flex flex-wrap items-center justify-center gap-2 z-50 relative">
        <span className="bg-[#B85C38] text-white font-black px-2.5 py-0.5 rounded text-[10px] tracking-wider uppercase shadow-sm">
          SIH 2026 • PS ID: 26205
        </span>
        <span className="text-[#D8C3A5] font-semibold text-xs">
          Transportation &amp; Logistics: Relieving Urban Transport Networks &amp; Logistics Infrastructure
        </span>
        <span className="text-[#F8F5EF] font-bold text-xs hidden sm:inline">
          • Failed-Delivery Smart Recovery Hub Network
        </span>
      </div>

      <header className="bg-[#171717] border-b border-[#D8C3A5]/20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left Decorative Brand Icon */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#B85C38] to-[#A94D2F] flex items-center justify-center shadow-md text-white font-black text-2xl">
              <Store className="w-7 h-7" />
            </div>
          </div>

          {/* Centered Large Project Name & Description */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center gap-2.5">
              <div className="md:hidden w-9 h-9 rounded-xl bg-gradient-to-tr from-[#B85C38] to-[#A94D2F] flex items-center justify-center shadow text-white font-black text-lg">
                <Store className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#F8F5EF] flex items-center gap-2">
                <span>Kirana</span><span className="text-[#B85C38]">Connect</span>
                <span className="px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider bg-[#B85C38]/20 text-[#D8C3A5] border border-[#D8C3A5]/40 rounded-full shadow-xs">
                  PUDO 2.0
                </span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm font-medium text-[#D8C3A5] mt-1 max-w-xl">
              {language === 'hi'
                ? 'भारत का भरोसेमंद किराना डिलीवरी नेटवर्क • डोरस्टेप डिलीवरी फेलियर रिकवरी हब'
                : "India's Hyper-Local Last-Mile Logistics Network • Failed-Delivery Smart Recovery Hub"}
            </p>
          </div>

          {/* Action Controls (Right) */}
          <div className="flex items-center space-x-2.5">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#B85C38] hover:bg-[#A94D2F] text-white border border-[#D8C3A5]/30 text-xs font-bold transition shadow-sm"
              title="Switch Language / भाषा बदलें"
            >
              <Languages className="w-4 h-4 text-white" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Reset Demo Button */}
            <button
              onClick={() => {
                if (confirm('Reset application to original demo state?')) {
                  resetToDemoState();
                }
              }}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#262626] hover:bg-red-950/40 text-[#D8C3A5] hover:text-red-300 border border-[#D8C3A5]/30 hover:border-red-500/50 text-xs font-semibold transition shadow-sm"
              title="Reset to fresh demo state"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
