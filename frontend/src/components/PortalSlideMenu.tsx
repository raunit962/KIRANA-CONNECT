import React from 'react';
import {
  X,
  Store,
  Bike,
  UserCheck,
  BarChart3,
  PlayCircle,
  ArrowRight,
  BookOpen,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Globe,
  RotateCcw
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
  const { language, setLanguage, resetToDemoState } = useApp();

  if (!isOpen) return null;

  const portals = [
    {
      id: 'CUSTOMER',
      title: 'Customer Pickup',
      hindiTitle: 'ग्राहक पिकअप पोर्टल',
      desc: 'Digital QR Boarding Pass, 72h countdown, audio OTP & WhatsApp alert pass',
      icon: UserCheck,
      color: 'bg-amber-400/20 text-amber-600 border-amber-400/30',
      activeBorder: 'border-amber-500 ring-2 ring-amber-400/30',
      badge: 'Self Collection',
    },
    {
      id: 'AGENT',
      title: 'Delivery Rider',
      hindiTitle: 'डिलीवरी राइडर ओएस',
      desc: 'Consolidated batch drop, camera photo-proof verification & route navigation',
      icon: Bike,
      color: 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-400/30',
      badge: 'Batch Logistics',
    },
    {
      id: 'MERCHANT',
      title: 'Kirana Merchant',
      hindiTitle: 'किराना मर्चेंट हब',
      desc: 'Physical 2D shelf rack map (A-01 to C-10), UPI Soundbox & ₹15/drop settlement',
      icon: Store,
      color: 'bg-[#B85C38]/20 text-[#B85C38] border-[#B85C38]/30',
      activeBorder: 'border-[#B85C38] ring-2 ring-[#B85C38]/30',
      badge: 'Soundbox Verified',
    },
    {
      id: 'ADMIN',
      title: 'Logistics Admin Hub',
      hindiTitle: 'लॉजिस्टिक्स एडमिन टॉवर',
      desc: 'Haversine store matchmaking, Green Footprint Tracker & Doorstep vs PUDO ROI',
      icon: BarChart3,
      color: 'bg-sky-500/20 text-sky-600 border-sky-500/30',
      activeBorder: 'border-sky-500 ring-2 ring-sky-400/30',
      badge: 'Urban Command',
    },
    {
      id: 'SIMULATOR',
      title: 'Interactive Flow Lab',
      hindiTitle: 'इंटरैक्टिव फ्लो लैब',
      desc: 'Step-by-step 60-second end-to-end delivery lifecycle simulation with event stream',
      icon: PlayCircle,
      color: 'bg-rose-500/20 text-rose-600 border-rose-500/30',
      activeBorder: 'border-rose-500 ring-2 ring-rose-400/30',
      badge: 'Live Simulator',
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
      <aside className="absolute inset-y-0 right-0 max-w-md w-full bg-[#F8F5EF] shadow-2xl border-l border-[#D8C3A5] flex flex-col z-50 transform transition-transform duration-300 ease-out">
        {/* Drawer Header */}
        <div className="p-5 bg-[#171717] text-white border-b border-[#D8C3A5]/30 flex items-center justify-between">
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
                  SLIDE MENU
                </span>
              </div>
              <p className="text-xs text-[#D8C3A5]">Select a portal or experience</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Return to Cover Page Action Button */}
        <div className="p-4 bg-[#EFE8DC] border-b border-[#D8C3A5]">
          <button
            onClick={() => {
              onSelectTab('COVER');
              onClose();
            }}
            className={`w-full py-3 px-4 rounded-2xl border flex items-center justify-between transition group shadow-sm ${
              activeTab === 'COVER'
                ? 'bg-[#1A5336] text-white border-[#1A5336] ring-2 ring-[#fffd47]/50'
                : 'bg-white hover:bg-[#F4EFE6] text-[#171717] border-[#D8C3A5]'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-[#fffd47]/30 text-[#1A5336] flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-bold text-xs">
                  {language === 'hi' ? '📖 बुक कवर फ्रंट पेज' : '📖 Book Cover Front Page'}
                </div>
                <div className="text-[10px] text-[#786F67]">Editorial landing scene & parcel search</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#786F67] group-hover:translate-x-1 transition" />
          </button>
        </div>

        {/* Portal Cards List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#786F67] px-1">
            {language === 'hi' ? 'संचालन पोर्टल' : 'Operational Portals'}
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
                    ? 'bg-[#EFE8DC] ' + p.activeBorder + ' shadow-md'
                    : 'bg-white hover:bg-[#EFE8DC]/80 border-[#D8C3A5] hover:border-[#B85C38]/40 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${p.color} shadow-xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#171717]">
                          {language === 'hi' ? p.hindiTitle : p.title}
                        </h4>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#1A5336] animate-ping" />
                        )}
                      </div>
                      <span className="text-[10px] font-semibold text-[#B85C38]">
                        {p.badge}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    isSelected
                      ? 'bg-[#1A5336] text-[#fffd47] border-[#1A5336]'
                      : 'bg-[#F8F5EF] text-[#786F67] border-[#D8C3A5]'
                  }`}>
                    {isSelected ? 'VIEWING' : 'OPEN'}
                  </span>
                </div>

                <p className="text-xs text-[#786F67] mt-2.5 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Drawer Bottom Utility Bar */}
        <div className="p-4 bg-[#EFE8DC] border-t border-[#D8C3A5] flex items-center justify-between text-xs">
          {/* Language toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D8C3A5] text-[#171717] font-semibold hover:border-[#B85C38] transition shadow-xs"
          >
            <Globe className="w-3.5 h-3.5 text-[#B85C38]" />
            <span>{language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}</span>
          </button>

          {/* Reset demo */}
          <button
            onClick={() => {
              resetToDemoState();
              onSelectTab('COVER');
              onClose();
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D8C3A5] text-[#786F67] hover:text-[#171717] font-medium transition shadow-xs"
            title="Reset demo data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
