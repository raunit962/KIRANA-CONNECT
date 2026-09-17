import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { User, Bike, Store, LayoutDashboard, PlayCircle, Sparkles } from 'lucide-react';

export const RoleSwitcher: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({
  activeTab,
  setActiveTab,
}) => {
  const { language } = useApp();

  const roles = [
    {
      id: 'CUSTOMER',
      label: language === 'hi' ? 'ग्राहक (Customer)' : 'Customer Pickup',
      sublabel: 'Dynamic QR & OTP Pass',
      icon: User,
      color: 'from-sky-500 to-blue-600',
      badge: 'B2C',
    },
    {
      id: 'AGENT',
      label: language === 'hi' ? 'डिलीवरी राइडर (Agent)' : 'Delivery Rider',
      sublabel: 'Kirana Drop & Proof Photo',
      icon: Bike,
      color: 'from-amber-500 to-orange-600',
      badge: 'Gig Agent',
    },
    {
      id: 'MERCHANT',
      label: language === 'hi' ? 'किराना पार्टनर (Store)' : 'Kirana Merchant',
      sublabel: 'Scanner, Shelf & ₹ Wallet',
      icon: Store,
      color: 'from-emerald-500 to-teal-600',
      badge: 'PUDO Partner',
    },
    {
      id: 'ADMIN',
      label: language === 'hi' ? 'लॉजिस्टिक्स एडमिन' : 'Logistics Admin Hub',
      sublabel: 'Smart Matching & Network',
      icon: LayoutDashboard,
      color: 'from-purple-500 to-indigo-600',
      badge: 'Control Tower',
    },
    {
      id: 'SIMULATOR',
      label: language === 'hi' ? 'लाइव सिमुलेशन' : 'Interactive Flow Lab',
      sublabel: '5-Step Full Lifecycle Demo',
      icon: PlayCircle,
      color: 'from-rose-500 to-pink-600',
      badge: 'Live Demo',
    },
  ];

  return (
    <div className="bg-[#EFE8DC]/95 border-b border-[#D8C3A5] p-2 sm:p-3 sticky top-0 z-30 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-2 py-1 scrollbar-none">
        <div className="flex items-center space-x-2 min-w-max">
          <button
            onClick={() => setActiveTab('COVER')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
              activeTab === 'COVER'
                ? 'bg-[#1A5336] text-[#fffd47] ring-2 ring-[#fffd47]/50'
                : 'bg-[#1A5336] hover:bg-[#133f28] text-white'
            }`}
            title="Return to Book Cover Page"
          >
            <span>📖 Book Cover</span>
          </button>

          <span className="text-[11px] uppercase font-bold text-[#171717] tracking-wider flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-[#B85C38]" />
            Portals:
          </span>
          
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = activeTab === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setActiveTab(role.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shadow-sm ${
                  isActive
                    ? 'bg-[#B85C38] text-white shadow-md ring-2 ring-[#B85C38]/30 scale-[1.02]'
                    : 'bg-[#F8F5EF] hover:bg-white text-[#786F67] hover:text-[#171717] border border-[#D8C3A5]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#786F67]'}`} />
                <div className="text-left">
                  <div className={`font-bold flex items-center gap-1.5 ${isActive ? 'text-white' : 'text-[#171717]'}`}>
                    {role.label}
                  </div>
                  <div className={`text-[10px] font-normal leading-tight hidden lg:block ${isActive ? 'text-white/90' : 'text-[#786F67]'}`}>
                    {role.sublabel}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
