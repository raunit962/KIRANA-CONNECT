import React, { useState } from 'react';
import {
  Search,
  User,
  Bike,
  Store,
  ShieldCheck,
  PlayCircle,
  Menu,
  ArrowRight,
  MapPin,
  Package,
  KeyRound,
  Network
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface BookCoverPageProps {
  onOpenSlideMenu: () => void;
  onNavigatePortal: (portalKey: string) => void;
}

export const BookCoverPage: React.FC<BookCoverPageProps> = ({
  onOpenSlideMenu,
  onNavigatePortal,
}) => {
  const { parcels, currentUser, openAuthModal, logoutUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResult(null);
      setHasSearched(false);
      return;
    }

    const q = searchQuery.toLowerCase().trim();
    const found = parcels.find(
      (p) =>
        p.trackingNumber.toLowerCase().includes(q) ||
        p.orderId.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q) ||
        p.customerPhone.toLowerCase().includes(q) ||
        p.packageItem.toLowerCase().includes(q)
    );

    setSearchResult(found || null);
    setHasSearched(true);
  };

  return (
    <div className="relative min-h-[calc(100vh-1rem)] flex flex-col justify-between overflow-hidden bg-[#E2EBE2]">
      {/* Background Image Layer (3 parcels with KiranaConnect barcode sticker on flap) */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{
          backgroundImage: `url('/cover-hero.jpg')`,
        }}
      >
        {/* Soft atmospheric gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F291E]/35 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Top Header Navigation */}
      <header className="relative z-20 px-4 sm:px-6 lg:px-10 pt-4 pb-2">
        <div className="w-full flex flex-col md:flex-row items-start justify-between gap-4">
          
          {/* Front Page Logo (Double size: 300px, completely transparent background without white box) */}
          <div
            onClick={() => onNavigatePortal('COVER')}
            className="cursor-pointer group flex items-center transition select-none -mt-2 -ml-2 sm:-ml-3"
            title="KiranaConnect Home"
          >
            <div className="w-[240px] sm:w-[300px] h-[240px] sm:h-[300px] flex items-center justify-center group-hover:scale-105 transition duration-300">
              <img
                src="/logo-transparent.png"
                alt="KiranaConnect Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_10px_24px_rgba(0,0,0,0.22)]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Extreme Upper Right Corner: Portals navigation pills + Explore Portals button */}
          <div className="ml-auto flex flex-wrap items-center justify-end gap-2.5">
            <nav className="hidden xl:flex items-center flex-wrap gap-2.5">
              {[
                {
                  id: 'CUSTOMER',
                  label: 'Customer pickup',
                  icon: User,
                },
                {
                  id: 'AGENT',
                  label: 'Delivery Rider',
                  icon: Bike,
                },
                {
                  id: 'MERCHANT',
                  label: 'Kirana Merchant',
                  icon: Store,
                },
                {
                  id: 'ADMIN',
                  label: 'Logistics Admin Hub',
                  icon: ShieldCheck,
                },
                {
                  id: 'SIMULATOR',
                  label: 'Interactive flow Lab',
                  icon: PlayCircle,
                },
                {
                  id: 'ARCHITECTURE',
                  label: 'Architecture',
                  icon: Network,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigatePortal(item.id)}
                    className="glass-pill px-3.5 py-2 rounded-2xl flex items-center space-x-2 text-xs font-bold text-[#0F291E] hover:text-[#1A5336] transition hover:scale-102 active:scale-98 shadow-xs hover:border-[#1A5336]/30 group"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#fffd47] text-[#0F291E] flex items-center justify-center font-black shadow-xs shrink-0 group-hover:bg-[#1A5336] group-hover:text-[#fffd47] transition">
                      <Icon className="w-3 h-3" />
                    </div>
                    <span className="font-roxborough font-bold text-xs tracking-normal">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* User Session Chip / Login Button */}
            {currentUser ? (
              <div className="glass-pill px-3 py-1.5 rounded-2xl flex items-center space-x-2 shadow-md border-2 border-white/95">
                <div className="w-7 h-7 rounded-full bg-[#1A5336] text-[#fffd47] flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser.role === 'MERCHANT' ? '🏪' : currentUser.role === 'AGENT' ? '🛵' : '👤'}
                </div>
                <div className="text-left hidden xs:block">
                  <div className="text-xs font-bold text-[#0F291E] leading-tight font-roxborough">
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] font-mono text-[#1A5336] font-semibold">
                    {currentUser.role === 'MERCHANT' ? 'Kirana Hub' : currentUser.role === 'AGENT' ? 'Rider' : 'Shopper'}
                  </div>
                </div>
                <button
                  onClick={logoutUser}
                  className="ml-1 text-[10px] font-bold text-red-700 hover:bg-red-100/80 px-2 py-1 rounded-lg transition"
                  title="Log Out"
                >
                  Exit
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('CUSTOMER')}
                className="glass-pill px-4 py-2.5 rounded-2xl flex items-center space-x-2 text-xs font-black text-[#0F291E] hover:text-[#1A5336] hover:scale-105 transition shadow-md border-2 border-[#fffd47] bg-[#fffd47]/30 hover:bg-[#fffd47]/60 group"
                title="Log in to KiranaConnect"
              >
                <KeyRound className="w-4 h-4 text-[#1A5336]" />
                <span className="font-roxborough font-bold text-xs tracking-normal">Log In</span>
              </button>
            )}

            {/* Explore Portals Slide Drawer Button in Extreme Right Corner */}
            <button
              onClick={onOpenSlideMenu}
              className="glass-pill px-4 py-2.5 rounded-2xl flex items-center space-x-2 text-xs font-black text-[#0F291E] hover:text-[#1A5336] hover:scale-105 transition shadow-md border-2 border-white/95 group"
              title="Open Portals Slide Bar"
            >
              <Menu className="w-4 h-4 text-[#1A5336]" />
              <span className="font-roxborough font-bold text-xs tracking-normal">Explore Portals</span>
              <span className="w-2 h-2 rounded-full bg-[#1A5336] animate-pulse" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Content Area: Shifted Leftward as per Red Arrow */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-14 py-6">
        <div className="w-full max-w-7xl mx-auto">
          {/* Shifted Leftward Column */}
          <div className="max-w-xl space-y-6">
            
            {/* Thematic Script Callout in #fffd47 */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-[#fffd47]">
                <MapPin className="w-5 h-5 text-[#fffd47] animate-bounce" />
                <div className="h-0.5 w-16 border-t-2 border-dashed border-[#fffd47]/80" />
                <span className="text-xs font-mono font-bold tracking-widest uppercase bg-black/35 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[#fffd47]">
                  HyperLocal Zero-Emission PUDO
                </span>
              </div>

              {/* Thematic headline in Maharlika / RoxboroughCF / #fffd47 */}
              <h2 className="thematic-line text-4xl sm:text-5xl lg:text-6xl font-normal tracking-wide drop-shadow-lg leading-tight select-none">
                from your gali <br />
                <span className="text-[#fffd47] ml-6">to your doorstep</span>
              </h2>
            </div>

            {/* Subtext in DM Sans */}
            <p className="text-sm sm:text-base text-[#F8F5EF] font-medium leading-relaxed drop-shadow-md bg-black/30 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15 max-w-lg">
              Transforming India's 13M+ neighborhood Kiranas into zero-capex, failed-delivery smart recovery hubs. Pick up parcels whenever you want, just around your corner.
            </p>

            {/* Central White Pill Search Bar */}
            <div className="max-w-md w-full">
              <form
                onSubmit={handleSearch}
                className="relative flex items-center bg-white/95 backdrop-blur-md rounded-full p-1.5 shadow-2xl border-2 border-white focus-within:border-[#1A5336] focus-within:ring-4 focus-within:ring-[#fffd47]/40 transition duration-300"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Tracking ID, Pincode or Phone..."
                  className="w-full bg-transparent px-5 py-2.5 text-xs sm:text-sm font-medium text-[#0F291E] placeholder-[#4A5B52] focus:outline-none"
                />

                <button
                  type="submit"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1A5336] hover:bg-[#133F28] text-[#fffd47] flex items-center justify-center shrink-0 shadow-md transition transform active:scale-95"
                  title="Search Tracking ID"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </form>

              {/* 3 Personas Direct Login Quick-Launch Chips */}
              <div className="mt-3 bg-black/35 backdrop-blur-md rounded-2xl p-2.5 border border-white/15">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#fffd47] px-1 mb-1.5">
                  <span>Sign In as:</span>
                  <span className="text-white/70 font-normal">Phone + OTP Verification</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => openAuthModal('CUSTOMER')}
                    className="py-1.5 px-2 rounded-xl bg-white/90 hover:bg-white text-[#0F291E] hover:text-[#1A5336] text-xs font-bold flex items-center justify-center space-x-1.5 transition shadow-xs group"
                  >
                    <User className="w-3.5 h-3.5 text-[#1A5336] group-hover:scale-110 transition" />
                    <span>Customer</span>
                  </button>
                  <button
                    onClick={() => openAuthModal('AGENT')}
                    className="py-1.5 px-2 rounded-xl bg-white/90 hover:bg-white text-[#0F291E] hover:text-[#0284C7] text-xs font-bold flex items-center justify-center space-x-1.5 transition shadow-xs group"
                  >
                    <Bike className="w-3.5 h-3.5 text-[#0284C7] group-hover:scale-110 transition" />
                    <span>Rider</span>
                  </button>
                  <button
                    onClick={() => openAuthModal('MERCHANT')}
                    className="py-1.5 px-2 rounded-xl bg-white/90 hover:bg-white text-[#0F291E] hover:text-[#1A5336] text-xs font-bold flex items-center justify-center space-x-1.5 transition shadow-xs group"
                  >
                    <Store className="w-3.5 h-3.5 text-[#1A5336] group-hover:scale-110 transition" />
                    <span>Kirana Hub</span>
                  </button>
                </div>
              </div>

              {/* Instant Search Result Flyout Card */}
              {hasSearched && (
                <div className="mt-4 bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-[#CDE3D5] animate-fadeIn space-y-3">
                  {searchResult ? (
                    <div>
                      <div className="flex items-center justify-between border-b border-[#CDE3D5] pb-2">
                        <div className="flex items-center space-x-2">
                          <Package className="w-4 h-4 text-[#1A5336]" />
                          <span className="font-bold text-xs text-[#0F291E]">
                            {searchResult.trackingNumber}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold bg-[#EAF3ED] text-[#1A5336] px-2 py-0.5 rounded-full border border-[#CDE3D5]">
                          {searchResult.status}
                        </span>
                      </div>

                      <div className="text-xs text-[#4A5B52] mt-2 space-y-1">
                        <div>Recipient: <strong className="text-[#0F291E]">{searchResult.customerName}</strong></div>
                        <div>Package: <strong className="text-[#0F291E]">{searchResult.packageItem}</strong></div>
                        <div className="flex items-center gap-1 text-[#1A5336] font-bold pt-1">
                          <Store className="w-3.5 h-3.5" />
                          <span>Pickup Hub: Ghosh Brothers Daily Provisions (Salt Lake Sector V)</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#F5A623] font-mono font-bold pt-0.5">
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Pickup PIN: {searchResult.pickupOtp}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onNavigatePortal('CUSTOMER')}
                        className="w-full mt-3 py-2 bg-[#1A5336] hover:bg-[#133F28] text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition shadow-sm"
                      >
                        <span>Open Full Digital Pickup Pass</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#fffd47]" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-xs font-semibold text-red-600">
                        No active parcel found matching "{searchQuery}"
                      </p>
                      <p className="text-[11px] text-[#4A5B52] mt-0.5">
                        Try searching with <strong>KC-8842-KOL</strong> or click Customer Pickup in the menu.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Clean Bottom Footer Bar (No "Book Cover" labels) */}
      <footer className="relative z-10 px-4 sm:px-6 lg:px-8 py-3 bg-black/45 backdrop-blur-md border-t border-white/10 text-white text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#fffd47]">KiranaConnect</span>
            <span className="text-white/70">• India's HyperLocal PUDO Network</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px] text-white/80">
            <button
              onClick={() => onNavigatePortal('ARCHITECTURE')}
              className="text-[#fffd47] hover:underline font-bold flex items-center gap-1 transition"
            >
              <Network className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>System Architecture</span>
            </button>
            <span className="bg-[#1A5336]/60 text-[#fffd47] px-2.5 py-0.5 rounded-full border border-white/20">
              Salt Lake Sector V, Kolkata
            </span>
            <span>Zero Infrastructure Capex</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
