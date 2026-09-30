import React from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Bike,
  Store,
  LayoutDashboard,
  PlayCircle,
  Sparkles,
  Ticket,
  Package,
  ShieldCheck,
} from 'lucide-react';

export const RoleSwitcher: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({
  activeTab,
  setActiveTab,
}) => {
  const { language, currentUser } = useApp();

  let roles = [];

  // Strict role isolation: If customer logs in, only show the 2 customer portals!
  if (currentUser?.role === 'CUSTOMER') {
    roles = [
      {
        id: 'CUSTOMER',
        label: language === 'hi' ? 'ग्राहक पिकअप पोर्टल' : 'Customer Pickup Pass',
        sublabel: 'Dynamic QR & 4-Digit PIN Pass',
        icon: Ticket,
        badge: 'Smart Pass',
      },
      {
        id: 'CUSTOMER_HUB',
        label: language === 'hi' ? 'ग्राहक लॉजिस्टिक्स हब' : 'Customer Logistics Hub',
        sublabel: 'Picked Orders & 5-Box ₹15 Reward',
        icon: Package,
        badge: '₹15 Box',
      },
    ];
  } else if (currentUser?.role === 'AGENT') {
    roles = [
      {
        id: 'AGENT',
        label: language === 'hi' ? 'डिलीवरी राइडर (Agent)' : 'Delivery Rider',
        sublabel: 'Kirana Drop & Proof Photo',
        icon: Bike,
        badge: 'Gig Agent',
      },
      {
        id: 'SIMULATOR',
        label: language === 'hi' ? 'लाइव सिमुलेशन' : 'Interactive Flow Lab',
        sublabel: 'Delivery Lifecycle Demo',
        icon: PlayCircle,
        badge: 'Live Demo',
      },
    ];
  } else if (currentUser?.role === 'MERCHANT') {
    roles = [
      {
        id: 'MERCHANT',
        label: language === 'hi' ? '1. काउंटर व रैक ओएस' : '1. Counter & Shelf OS',
        sublabel: 'Scanner, Shelf Rack & Soundbox',
        icon: Store,
        badge: 'Counter OS',
      },
      {
        id: 'MERCHANT_LOGISTICS',
        label: language === 'hi' ? '2. स्टोर लॉजिस्टिक्स हब' : '2. Store Logistics Hub',
        sublabel: 'Amazon MyHub & Helper Fleet',
        icon: Package,
        badge: 'Amazon MyHub',
      },
      {
        id: 'MERCHANT_PROFILE',
        label: language === 'hi' ? '3. दुकान प्रोफ़ाइल विवरण' : '3. Store Details & Profile',
        sublabel: 'Credentials, Radius & Bank Settings',
        icon: ShieldCheck,
        badge: 'Store Profile',
      },
    ];
  } else {
    // Admin or Guest / Unauthenticated demo view
    roles = [
      {
        id: 'CUSTOMER',
        label: language === 'hi' ? 'ग्राहक पिकअप पास' : 'Customer Pickup',
        sublabel: 'Dynamic QR & OTP Pass',
        icon: User,
        badge: 'B2C',
      },
      {
        id: 'CUSTOMER_HUB',
        label: language === 'hi' ? 'ग्राहक लॉजिस्टिक्स हब' : 'Customer Hub',
        sublabel: '5-Box Loyalty & ₹15 Reward',
        icon: Package,
        badge: '₹15 Box',
      },
      {
        id: 'AGENT',
        label: language === 'hi' ? 'डिलीवरी राइडर (Agent)' : 'Delivery Rider',
        sublabel: 'Kirana Drop & Proof Photo',
        icon: Bike,
        badge: 'Gig Agent',
      },
      {
        id: 'MERCHANT',
        label: language === 'hi' ? 'किराना पार्टनर (Store)' : 'Kirana Merchant',
        sublabel: 'Scanner, Shelf & ₹ Wallet',
        icon: Store,
        badge: 'PUDO Partner',
      },
      {
        id: 'ADMIN',
        label: language === 'hi' ? 'लॉजिस्टिक्स एडमिन' : 'Logistics Admin Hub',
        sublabel: 'Smart Matching & Network',
        icon: LayoutDashboard,
        badge: 'Control Tower',
      },
      {
        id: 'SIMULATOR',
        label: language === 'hi' ? 'लाइव सिमुलेशन' : 'Interactive Flow Lab',
        sublabel: '5-Step Full Lifecycle Demo',
        icon: PlayCircle,
        badge: 'Live Demo',
      },
    ];
  }

  return (
    <div className="bg-[#0F291E] border-b border-[#1A5336]/40 p-2 sm:p-3 sticky top-0 z-30 shadow-md backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-2 py-1 scrollbar-none">
        <div className="flex items-center space-x-2 min-w-max">
          <span className="text-[11px] uppercase font-bold text-[#D1E7DD] tracking-wider flex items-center gap-1.5 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-[#fffd47]" />
            {currentUser?.role === 'CUSTOMER' ? 'Customer Portals:' : 'Switch Portal:'}
          </span>
          
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = activeTab === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setActiveTab(role.id)}
                className={`flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shadow-sm ${
                  isActive
                    ? 'bg-[#1A5336] text-white shadow-lg ring-2 ring-[#fffd47] border border-[#fffd47]/60 scale-[1.02]'
                    : 'bg-[#133827] hover:bg-[#1A5336] text-[#D1E7DD] hover:text-white border border-[#1A5336]'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isActive ? 'bg-[#fffd47] text-[#0F291E]' : 'bg-[#0B2317] text-[#38BDF8]'}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className={`font-roxborough font-bold text-xs flex items-center gap-1.5 ${isActive ? 'text-[#fffd47]' : 'text-[#F8F5EF]'}`}>
                    {role.label}
                  </div>
                  <div className={`text-[10px] font-normal leading-tight hidden lg:block ${isActive ? 'text-white/90' : 'text-[#A3B8AD]'}`}>
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
