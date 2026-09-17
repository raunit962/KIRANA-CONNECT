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
  Sparkles,
  Package,
  CheckCircle2,
  Clock,
  Heart,
  KeyRound
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
  const { parcels, stores, language } = useApp();
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
    <div className="relative min-h-[calc(100vh-2rem)] flex flex-col justify-between overflow-hidden bg-[#E2EBE2]">
      {/* Background Image Layer (Matching laptop reference photo) */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{
          backgroundImage: `url('/cover-hero.jpg')`,
        }}
      >
        {/* Soft Vignette and Sage Gradient for perfect contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#17291F]/30 via-transparent to-[#101d16]/25" />
      </div>

      {/* Top Header Navigation (Frosted Translucent Pills from Laptop Mockup) */}
      <header className="relative z-20 px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo on Left */}
          <div
            onClick={() => onNavigatePortal('COVER')}
            className="flex items-center space-x-2.5 cursor-pointer group bg-white/80 hover:bg-white backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-sm border border-white/90 transition"
          >
            <img
              src="/logo-transparent.png"
              alt="KiranaConnect Logo"
              className="w-9 h-9 object-contain group-hover:scale-105 transition"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-base text-[#1A5336] leading-none tracking-tight">
                Kirana<span className="text-[#F5A623]">Connect</span>
              </span>
              <span className="text-[9px] font-bold text-[#786F67] tracking-wider uppercase mt-0.5">
                PUDO 2.0
              </span>
            </div>
          </div>

          {/* Frosted Translucent Pill Buttons (Center) */}
          <nav className="hidden lg:flex items-center space-x-2">
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
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigatePortal(item.id)}
                  className="glass-pill px-4 py-2 rounded-2xl flex items-center space-x-2 text-xs font-bold text-[#171717] hover:text-[#1A5336] transition hover:scale-102 active:scale-98"
                >
                  <div className="w-5 h-5 rounded-full bg-[#fffd47] text-[#171717] flex items-center justify-center font-black shadow-xs">
                    <Icon className="w-3 h-3" />
                  </div>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Menu Drawer Toggle Button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenSlideMenu}
              className="glass-pill px-4 py-2 rounded-2xl flex items-center space-x-2 text-xs font-bold text-[#171717] hover:text-[#1A5336] hover:scale-105 transition shadow-sm border border-white"
              title="Open Portals Slide Bar"
            >
              <Menu className="w-4 h-4 text-[#1A5336]" />
              <span className="hidden sm:inline">Explore Portals</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Book Cover Content Area */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-14 py-8">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Thematic Line + Pill Search Bar */}
          <div className="lg:col-span-6 space-y-6">
            {/* Thematic Script Callout in #fffd47 */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-[#fffd47]">
                <MapPin className="w-5 h-5 text-[#fffd47] animate-bounce" />
                <div className="h-0.5 w-16 border-t-2 border-dashed border-[#fffd47]/80" />
                <span className="text-xs font-mono font-bold tracking-widest uppercase bg-black/30 backdrop-blur-xs px-2 py-0.5 rounded-full">
                  HyperLocal Zero-Emission PUDO
                </span>
              </div>

              {/* Thematic line: "from your gali to your doorstep" in RoxboroughCF / Maharlika / #fffd47 */}
              <h1 className="thematic-line text-4xl sm:text-5xl lg:text-6xl font-normal tracking-wide drop-shadow-lg leading-tight select-none">
                from your gali <br />
                <span className="text-[#fffd47] ml-6">to your doorstep</span>
              </h1>
            </div>

            {/* Subtext description in DM Sans */}
            <p className="text-sm sm:text-base text-[#F8F5EF] font-medium leading-relaxed max-w-lg drop-shadow-md bg-black/25 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
              Transforming India's 13M+ neighborhood Kiranas into zero-capex, failed-delivery smart recovery hubs. Pick up parcels whenever you want, just around your corner.
            </p>

            {/* Central White Pill Search Bar matching reference image */}
            <div className="max-w-md w-full">
              <form
                onSubmit={handleSearch}
                className="relative flex items-center bg-white/95 backdrop-blur-md rounded-full p-1.5 shadow-xl border-2 border-white focus-within:border-[#1A5336] focus-within:ring-4 focus-within:ring-[#fffd47]/40 transition duration-300"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Tracking ID, Pincode or Phone..."
                  className="w-full bg-transparent px-5 py-2.5 text-xs sm:text-sm font-medium text-[#171717] placeholder-[#786F67] focus:outline-none"
                />

                <button
                  type="submit"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1A5336] hover:bg-[#133f28] text-[#fffd47] flex items-center justify-center shrink-0 shadow-md transition transform active:scale-95"
                  title="Search Tracking ID"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </form>

              {/* Quick Search Chips */}
              <div className="flex flex-wrap items-center gap-2 mt-2.5 px-2">
                <span className="text-[11px] font-bold text-[#fffd47] drop-shadow-sm">Quick Demo:</span>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('KC-8842-KOL');
                    setSearchResult(parcels[0]);
                    setHasSearched(true);
                  }}
                  className="text-[10px] font-mono bg-black/40 hover:bg-black/60 text-white border border-white/20 px-2 py-0.5 rounded-full transition"
                >
                  KC-8842-KOL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('98300 12894');
                    setSearchResult(parcels[0]);
                    setHasSearched(true);
                  }}
                  className="text-[10px] font-mono bg-black/40 hover:bg-black/60 text-white border border-white/20 px-2 py-0.5 rounded-full transition"
                >
                  +91 98300 12894
                </button>
              </div>

              {/* Instant Search Result Flyout Card */}
              {hasSearched && (
                <div className="mt-4 bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-[#D8C3A5] animate-fadeIn space-y-3">
                  {searchResult ? (
                    <div>
                      <div className="flex items-center justify-between border-b border-[#D8C3A5] pb-2">
                        <div className="flex items-center space-x-2">
                          <Package className="w-4 h-4 text-[#1A5336]" />
                          <span className="font-bold text-xs text-[#171717]">
                            {searchResult.trackingNumber}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold bg-[#1A5336]/10 text-[#1A5336] px-2 py-0.5 rounded-full">
                          {searchResult.status}
                        </span>
                      </div>

                      <div className="text-xs text-[#786F67] mt-2 space-y-1">
                        <div>Recipient: <strong className="text-[#171717]">{searchResult.customerName}</strong></div>
                        <div>Package: <strong className="text-[#171717]">{searchResult.packageItem}</strong></div>
                        <div className="flex items-center gap-1 text-[#1A5336] font-bold pt-1">
                          <Store className="w-3.5 h-3.5" />
                          <span>Pickup Hub: Ghosh Brothers Daily Provisions (Salt Lake Sector V)</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#B85C38] font-mono font-bold pt-0.5">
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Pickup PIN: {searchResult.pickupOtp}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onNavigatePortal('CUSTOMER')}
                        className="w-full mt-3 py-2 bg-[#1A5336] hover:bg-[#133f28] text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition shadow-sm"
                      >
                        <span>Open Full Digital Pickup Pass</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-xs font-semibold text-red-600">
                        No active parcel found matching "{searchQuery}"
                      </p>
                      <p className="text-[11px] text-[#786F67] mt-0.5">
                        Try searching with <strong>KC-8842-KOL</strong> or open Customer Pickup portal.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Book Cover Storytelling Highlights */}
          <div className="lg:col-span-6 hidden lg:flex flex-col items-end justify-center space-y-4 pointer-events-none">
            {/* Story Card 1 */}
            <div className="bg-white/85 backdrop-blur-md p-4 rounded-3xl border border-white shadow-xl max-w-sm text-left pointer-events-auto transform hover:scale-102 transition">
              <div className="flex items-center space-x-2 text-[#1A5336]">
                <Heart className="w-4 h-4 fill-[#1A5336]" />
                <span className="font-bold text-xs">Supporting Local Always</span>
              </div>
              <p className="text-xs text-[#786F67] mt-1.5 leading-relaxed">
                Every recovered parcel adds ₹15 instant UPI income into your local neighborhood store's pocket, turning footfall into organic grocery sales.
              </p>
            </div>

            {/* Story Card 2 */}
            <div className="bg-white/85 backdrop-blur-md p-4 rounded-3xl border border-white shadow-xl max-w-sm text-left pointer-events-auto transform hover:scale-102 transition">
              <div className="flex items-center space-x-2 text-[#1A5336]">
                <Sparkles className="w-4 h-4" />
                <span className="font-bold text-xs">Local Stores • Stronger Tomorrows</span>
              </div>
              <p className="text-xs text-[#786F67] mt-1.5 leading-relaxed">
                Riders batch-drop packages in 3 minutes, cutting ~60% re-attempt delivery emissions while keeping city alleys free of double-parking gridlock.
              </p>
            </div>

            {/* Quick Button to Slide Menu */}
            <button
              onClick={onOpenSlideMenu}
              className="pointer-events-auto mt-2 px-5 py-2.5 rounded-full bg-[#1A5336] hover:bg-[#133f28] text-[#fffd47] font-bold text-xs shadow-xl flex items-center space-x-2 transition hover:scale-105"
            >
              <span>Explore All 5 Operational Portals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Cover Footer Bar */}
      <footer className="relative z-10 px-4 sm:px-6 lg:px-8 py-3 bg-black/40 backdrop-blur-md border-t border-white/10 text-white text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#fffd47]">KiranaConnect</span>
            <span className="text-white/70">• India's HyperLocal PUDO Network</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px] text-white/80">
            <span className="bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
              Salt Lake Sector V, Kolkata
            </span>
            <span>Zero Infrastructure Capex</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
