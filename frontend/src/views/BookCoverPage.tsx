import React, { useState } from 'react';
import {
  Search,
  User,
  Bike,
  Store,
  ShieldCheck,
  PlayCircle,
  ArrowRight,
  MapPin,
  Package,
  KeyRound,
  LayoutDashboard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Truck,
  Fuel,
  Check,
  X,
  Phone,
  Layers,
  ChevronRight,
  Award,
  Sparkles,
  RefreshCw,
  ExternalLink,
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

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Modal & Interactive View States
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoStep, setDemoStep] = useState<number>(1);
  const [demoSelectedStore, setDemoSelectedStore] = useState<string>('Sharma Kirana');
  const [demoOtpInput, setDemoOtpInput] = useState<string>('');
  const [demoOtpVerified, setDemoOtpVerified] = useState<boolean>(false);

  // Tracking Modal State
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

  // Partner Registration Modal State
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [partnerFormData, setPartnerFormData] = useState({
    storeName: '',
    ownerName: '',
    mobileNumber: '',
    location: '',
    capacity: '20',
    operatingHours: '8:00 AM – 10:00 PM',
    agreeTerms: true,
  });
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);

  // Parcel Handover Modal State (From Kirana Dashboard)
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);
  const [handoverOtp, setHandoverOtp] = useState('');
  const [handoverSuccess, setHandoverSuccess] = useState(false);
  const [activeHandoverOrder, setActiveHandoverOrder] = useState('KC10245');

  // Interactive Map Store Selection State
  const [selectedMapStore, setSelectedMapStore] = useState<'sharma' | 'gupta' | 'laxmi'>('sharma');
  const [mapAssignSuccess, setMapAssignSuccess] = useState(false);

  // Capacity Meter Interactive State
  const [capacityState, setCapacityState] = useState<'normal' | 'near' | 'full'>('normal');

  // Carrier View Assignment State
  const [carrierAssignedStore, setCarrierAssignedStore] = useState<string | null>(null);

  // Handle Search
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
        p.customerPhone.toLowerCase().includes(q)
    );
    setSearchResult(found || null);
    setHasSearched(true);
  };

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPartnerSubmitted(true);
  };

  const handleHandoverVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (handoverOtp.trim() === '4821' || handoverOtp.trim().length === 4) {
      setHandoverSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#1E293B] font-sans">
      
      {/* ──────────────────────────────────────────────────────────── */}
      {/* TOP HEADER NAVIGATION                                         */}
      {/* ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0F291E]/95 backdrop-blur-md border-b border-[#1A5336]/40 text-white px-4 sm:px-8 py-3 transition shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Prototype Tag */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1A5336] to-[#10b981] flex items-center justify-center text-[#fffd47] shadow-inner font-black text-lg">
              KC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white font-roxborough">
                  KiranaConnect
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30">
                  SIH Prototype
                </span>
              </div>
              <p className="text-[10px] text-[#A3B8AD] hidden sm:block">
                Failed-Delivery Recovery & Hyperlocal PUDO Infrastructure
              </p>
            </div>
          </div>

          {/* Quick Nav Anchors */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#D1E7DD]">
            <a href="#how-it-works" className="hover:text-[#fffd47] transition">How It Works</a>
            <a href="#demo-section" className="hover:text-[#fffd47] transition">Live Demo</a>
            <a href="#kirana-map" className="hover:text-[#fffd47] transition">Nearby Kirana Map</a>
            <a href="#store-dashboard" className="hover:text-[#fffd47] transition">Kirana Dashboard</a>
            <a href="#carrier-view" className="hover:text-[#fffd47] transition">Carrier View</a>
            <a href="#why-section" className="hover:text-[#fffd47] transition">Why KiranaConnect</a>
          </nav>

          {/* Right Header CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setDemoStep(1);
                setDemoOtpVerified(false);
                setDemoOtpInput('');
                setIsDemoModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5 hover:scale-102"
            >
              <PlayCircle className="w-3.5 h-3.5 text-[#fffd47]" />
              <span>Try Live Demo</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigatePortal(currentUser.role === 'CUSTOMER' ? 'CUSTOMER' : currentUser.role)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition flex items-center gap-1.5"
                >
                  <span>{currentUser.name.split(' ')[0]}</span>
                  <ArrowRight className="w-3 h-3 text-[#10b981]" />
                </button>
                <button
                  onClick={logoutUser}
                  className="px-2.5 py-1.5 rounded-xl text-xs text-red-300 hover:text-red-100 hover:bg-red-900/30 transition"
                >
                  Exit
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('CUSTOMER')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition flex items-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#fffd47]" />
                <span className="hidden sm:inline">Role Log In</span>
              </button>
            )}
          </div>

        </div>
      </header>


      {/* ──────────────────────────────────────────────────────────── */}
      {/* 15. HOMEPAGE HERO SECTION                                     */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F291E] via-[#143D2A] to-[#1A5336] text-white pt-16 pb-20 px-4 sm:px-8 lg:px-12 border-b border-[#1A5336]">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#10b981]/15 blur-[120px] pointer-events-none rounded-full" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-[#fffd47] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
            <span>Smart India Hackathon 2026 Prototype</span>
            <span className="text-white/40">•</span>
            <span className="text-white/80">Hyperlocal Failed-Delivery Recovery</span>
          </div>

          {/* Core Problem Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Missed your delivery?<br />
            <span className="text-[#fffd47] underline decoration-[#10b981] decoration-wavy decoration-2">
              Pick it up from your neighbourhood.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-sm sm:text-lg text-[#D1E7DD] max-w-2xl mx-auto leading-relaxed font-normal">
            KiranaConnect connects failed deliveries with verified nearby kirana stores, giving customers a convenient local pickup option.
          </p>

          {/* 3 Prominent Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={() => {
                setDemoStep(1);
                setDemoOtpVerified(false);
                setDemoOtpInput('');
                setIsDemoModalOpen(true);
              }}
              className="px-6 py-3 rounded-2xl bg-[#10b981] hover:bg-[#059669] text-white font-extrabold text-sm sm:text-base transition transform hover:-translate-y-0.5 shadow-xl shadow-[#10b981]/25 flex items-center gap-2"
            >
              <PlayCircle className="w-5 h-5 text-[#fffd47]" />
              <span>Try KiranaConnect Demo →</span>
            </button>

            <button
              onClick={() => setIsTrackModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/25 transition backdrop-blur-md flex items-center gap-2"
            >
              <Package className="w-5 h-5 text-[#38BDF8]" />
              <span>Track a Parcel</span>
            </button>

            <button
              onClick={() => setIsPartnerModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-[#fffd47] hover:bg-[#fff72e] text-[#0F291E] font-extrabold text-sm sm:text-base transition transform hover:-translate-y-0.5 shadow-lg flex items-center gap-2"
            >
              <Store className="w-5 h-5 text-[#1A5336]" />
              <span>Become a Kirana Partner</span>
            </button>
          </div>

          {/* Simple Underneath Breadcrumb Sequence */}
          <div className="pt-4 inline-flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-[#A3B8AD]">
            <span className="text-[#F87171] font-bold">Delivery Failed?</span>
            <span className="text-white/40">→</span>
            <span className="text-[#38BDF8] font-bold">Nearby Store (within 300m)</span>
            <span className="text-white/40">→</span>
            <span className="text-[#10b981] font-bold">Customer Pickup (OTP Verified)</span>
          </div>

          {/* Quick Tracking Search Bar */}
          <div className="pt-6 max-w-lg mx-auto">
            <form onSubmit={handleSearch} className="relative flex items-center bg-white/95 rounded-2xl p-1.5 shadow-2xl border border-white">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Quick test search: try 'KC-8842-KOL' or 'KC10245'..."
                className="w-full bg-transparent px-4 py-2.5 text-xs sm:text-sm font-medium text-[#0F291E] placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#1A5336] hover:bg-[#0F291E] text-white font-bold text-xs shrink-0 transition flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </form>

            {hasSearched && (
              <div className="mt-3 p-3.5 bg-white text-left text-slate-800 rounded-2xl shadow-xl border border-slate-200 text-xs">
                {searchResult ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between border-b pb-1.5">
                      <span className="font-bold text-[#1A5336]">{searchResult.trackingNumber}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {searchResult.status}
                      </span>
                    </div>
                    <div>Item: <strong>{searchResult.packageItem}</strong></div>
                    <div>Recipient: <strong>{searchResult.customerName}</strong></div>
                    <div className="text-[#1A5336] font-semibold">Store: Ghosh Brothers Daily Provisions (Salt Lake)</div>
                    <div className="text-amber-700 font-mono font-bold">Pickup Code: {searchResult.pickupOtp}</div>
                    <button
                      onClick={() => setIsTrackModalOpen(true)}
                      className="w-full mt-2 py-1.5 bg-[#1A5336] text-white font-bold rounded-lg text-center hover:bg-[#0F291E] transition"
                    >
                      View Live Tracking Screen →
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-1 text-slate-600">
                    No parcel found for &quot;{searchQuery}&quot;. <button onClick={() => setIsTrackModalOpen(true)} className="text-[#1A5336] font-bold underline">Click here to track sample order KC10245</button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </section>


      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. HOW KIRANACONNECT WORKS SECTION                             */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#10b981] bg-[#10b981]/10 px-3 py-1 rounded-full">
            Core 4-Step Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F291E] mt-3">
            How KiranaConnect Works
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            The simplest way to understand how failed doorstep deliveries become smooth local pickups.
          </p>
        </div>

        {/* 4 Cards Workflow Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border-2 border-slate-200/80 shadow-sm hover:shadow-md transition hover:border-[#38BDF8] relative group">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm mb-4 border border-sky-100">
              01
            </div>
            <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center mb-3">
              <Truck className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1.5">
              Delivery Attempt
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Courier attempts delivery at the customer&apos;s address during the standard daytime delivery window.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <span>Standard 3PL dispatch</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border-2 border-slate-200/80 shadow-sm hover:shadow-md transition hover:border-amber-400 relative group">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm mb-4 border border-amber-100">
              02
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center mb-3">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1.5">
              Delivery Failed
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Customer is unavailable or delivery cannot be completed at the door. Non-Delivery Report (NDR) is triggered.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-amber-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>Prevents return to warehouse</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border-2 border-slate-200/80 shadow-sm hover:shadow-md transition hover:border-[#10b981] relative group">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm mb-4 border border-emerald-100">
              03
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#10b981] text-white flex items-center justify-center mb-3">
              <Store className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1.5">
              Nearby Kirana Selected
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              KiranaConnect finds an eligible, capacity-checked partner store within 300 m. Rider offloads parcel on the same trip.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Verified partner allocation</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 border-2 border-slate-200/80 shadow-sm hover:shadow-md transition hover:border-[#0F291E] relative group">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm mb-4 border border-purple-100">
              04
            </div>
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center mb-3">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1.5">
              Customer Collects
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Customer receives instant pickup details with a secure OTP code, collecting parcel at their leisure (open till 10 PM).
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-purple-700 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-purple-600" />
              <span>Secure OTP verification</span>
            </div>
          </div>

        </div>

        {/* Callout action underneath */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setDemoStep(1);
              setDemoOtpVerified(false);
              setDemoOtpInput('');
              setIsDemoModalOpen(true);
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#1A5336] bg-[#10b981]/15 hover:bg-[#10b981]/25 px-4 py-2 rounded-xl transition"
          >
            <span>See this 4-step sequence simulated in real time</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>


      {/* ──────────────────────────────────────────────────────────── */}
      {/* 6 & 10. FIND NEARBY KIRANA MAP & VERIFIED BADGES              */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="kirana-map" className="py-16 px-4 sm:px-8 lg:px-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#10b981] bg-[#10b981]/10 px-3 py-1 rounded-full">
                Hyperlocal Allocation
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F291E] mt-2">
                Find Nearby Kirana Map (Within 300 Meters)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Visualizing verified partner stores around the customer&apos;s destination address.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Accepting</span>
              </span>
              <span className="flex items-center gap-1 text-amber-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Near Capacity</span>
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                <span className="text-xs">🛡️</span>
                <span>Verified Partner</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Mock Visual Map View (8 cols) */}
            <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-6 relative overflow-hidden border border-slate-800 shadow-xl min-h-[380px] flex flex-col justify-between">
              
              {/* Subtle Map Grid Lines */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

              {/* Map Header Overlay */}
              <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 bg-slate-800/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-400" />
                  <span className="text-white font-bold">Delivery Zone:</span>
                  <span>Belur / Salt Lake Sector V (Pincode: 700091)</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">3 Stores within 300m</span>
              </div>

              {/* Interactive Map Visual Stage */}
              <div className="relative z-10 my-10 flex items-center justify-center">
                
                {/* 300m Radius Circle */}
                <div className="w-[280px] sm:w-[360px] h-[280px] sm:h-[360px] rounded-full border border-dashed border-emerald-500/30 flex items-center justify-center relative">
                  
                  {/* Central Customer Pin */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/50 border-2 border-white animate-pulse">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-white bg-red-950/80 px-2 py-0.5 rounded-full mt-1 border border-red-500/40">
                      📍 Customer
                    </span>
                  </div>

                  {/* Store 1: Sharma Kirana (180m - Top Right) */}
                  <button
                    onClick={() => { setSelectedMapStore('sharma'); setMapAssignSuccess(false); }}
                    className={`absolute -top-3 right-8 sm:right-12 p-2 rounded-2xl border transition-all text-left group ${
                      selectedMapStore === 'sharma'
                        ? 'bg-emerald-950 border-emerald-400 ring-2 ring-emerald-400'
                        : 'bg-slate-800/90 border-slate-700 hover:border-emerald-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                        🏪
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          <span>Sharma Kirana</span>
                          <span title="Verified Partner">🛡️</span>
                        </div>
                        <div className="text-[10px] text-emerald-400 font-mono">
                          180 m away • 18/30 slots
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Store 2: Gupta General Store (240m - Bottom Left) */}
                  <button
                    onClick={() => { setSelectedMapStore('gupta'); setMapAssignSuccess(false); }}
                    className={`absolute -bottom-3 left-4 sm:left-10 p-2 rounded-2xl border transition-all text-left group ${
                      selectedMapStore === 'gupta'
                        ? 'bg-emerald-950 border-emerald-400 ring-2 ring-emerald-400'
                        : 'bg-slate-800/90 border-slate-700 hover:border-emerald-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                        🏪
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          <span>Gupta General Store</span>
                          <span title="Verified Partner">🛡️</span>
                        </div>
                        <div className="text-[10px] text-emerald-400 font-mono">
                          240 m away • 9/20 slots
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Store 3: Maa Laxmi Store (290m - Right Side) */}
                  <button
                    onClick={() => { setSelectedMapStore('laxmi'); setMapAssignSuccess(false); }}
                    className={`absolute top-1/2 -right-4 sm:-right-8 -translate-y-1/2 p-2 rounded-2xl border transition-all text-left group ${
                      selectedMapStore === 'laxmi'
                        ? 'bg-amber-950 border-amber-400 ring-2 ring-amber-400'
                        : 'bg-slate-800/90 border-slate-700 hover:border-amber-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                        🏪
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          <span>Maa Laxmi Store</span>
                          <span title="Verified Partner">🛡️</span>
                        </div>
                        <div className="text-[10px] text-amber-400 font-mono">
                          290 m away • 28/30 slots (Near full)
                        </div>
                      </div>
                    </div>
                  </button>

                </div>
              </div>

              {/* Map Footer Helper */}
              <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span>Click any store pin above to inspect capacity &amp; assign</span>
                <span className="text-emerald-400">● Live Capacity Monitoring</span>
              </div>
            </div>

            {/* Selected Store Inspector Card (4 cols) */}
            <div className="lg:col-span-4 bg-slate-50 rounded-3xl p-6 border-2 border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Store Profile Inspector
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                  <span>🛡️</span>
                  <span>Verified Partner</span>
                </span>
              </div>

              {selectedMapStore === 'sharma' && (
                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">Sharma Kirana Store</h3>
                    <p className="text-xs text-slate-500">Shop 4, Near Water Tank, Belur / Sector V</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Distance to Customer:</span>
                      <strong className="text-slate-900">180 meters (~2.5 min walk)</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Storage Capacity:</span>
                      <strong className="text-emerald-700 font-mono">18 / 30 slots occupied (60%)</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Operating Hours:</span>
                      <strong className="text-slate-900">8:00 AM – 10:00 PM</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Current Status:</span>
                      <strong className="text-emerald-600 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>Accepting new parcels</span>
                      </strong>
                    </div>
                  </div>

                  <button
                    onClick={() => setMapAssignSuccess(true)}
                    className="w-full py-2.5 rounded-xl bg-[#1A5336] hover:bg-[#0F291E] text-white font-bold text-xs transition shadow-sm"
                  >
                    Assign Parcel to Sharma Kirana
                  </button>
                </div>
              )}

              {selectedMapStore === 'gupta' && (
                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">Gupta General Store</h3>
                    <p className="text-xs text-slate-500">Plot 12, Main Market Road, Sector V</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Distance to Customer:</span>
                      <strong className="text-slate-900">240 meters (~3.5 min walk)</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Storage Capacity:</span>
                      <strong className="text-emerald-700 font-mono">9 / 20 slots occupied (45%)</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Operating Hours:</span>
                      <strong className="text-slate-900">7:30 AM – 9:30 PM</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Current Status:</span>
                      <strong className="text-emerald-600 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>Accepting new parcels</span>
                      </strong>
                    </div>
                  </div>

                  <button
                    onClick={() => setMapAssignSuccess(true)}
                    className="w-full py-2.5 rounded-xl bg-[#1A5336] hover:bg-[#0F291E] text-white font-bold text-xs transition shadow-sm"
                  >
                    Assign Parcel to Gupta Store
                  </button>
                </div>
              )}

              {selectedMapStore === 'laxmi' && (
                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">Maa Laxmi Store</h3>
                    <p className="text-xs text-slate-500">Corner Shop, Block B, Sector V</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Distance to Customer:</span>
                      <strong className="text-slate-900">290 meters (~4 min walk)</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Storage Capacity:</span>
                      <strong className="text-amber-700 font-mono">28 / 30 slots occupied (93%)</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Operating Hours:</span>
                      <strong className="text-slate-900">8:00 AM – 10:30 PM</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Current Status:</span>
                      <strong className="text-amber-600 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span>Near Capacity (2 slots left)</span>
                      </strong>
                    </div>
                  </div>

                  <button
                    onClick={() => setMapAssignSuccess(true)}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition shadow-sm"
                  >
                    Assign Parcel (Low Capacity Warning)
                  </button>
                </div>
              )}

              {mapAssignSuccess && (
                <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Parcel routed to store. Customer notified via WhatsApp/SMS!</span>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>


      {/* ──────────────────────────────────────────────────────────── */}
      {/* 5. CAPACITY INDICATOR & MANAGEMENT DEMO                       */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-8 lg:px-12 bg-[#F4F8F5] border-b border-slate-200">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1A5336] bg-[#1A5336]/10 px-3 py-1 rounded-full">
              Spatial Protection Feature
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F291E] mt-2">
              Store Capacity Management: &quot;What happens if the Kirana has no space?&quot;
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              KiranaConnect prevents store overcrowding with dynamic, capacity-aware parcel allocation. Test all 3 operational thresholds below:
            </p>
          </div>

          {/* 3 Live Capacity State Toggles */}
          <div className="flex justify-center gap-2 mb-8">
            <button
              onClick={() => setCapacityState('normal')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                capacityState === 'normal'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
              <span>1. Normal State (55%)</span>
            </button>

            <button
              onClick={() => setCapacityState('near')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                capacityState === 'near'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-300"></span>
              <span>2. Near Capacity (85%)</span>
            </button>

            <button
              onClick={() => setCapacityState('full')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                capacityState === 'full'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-300"></span>
              <span>3. Full (100%)</span>
            </button>
          </div>

          {/* Interactive Capacity Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md">
            
            {capacityState === 'normal' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Sharma Kirana Store Capacity</h3>
                    <p className="text-xs text-slate-500">Dedicated 50 sq. ft 3-tier wire rack</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Accepting new parcels</span>
                  </span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>22 / 40 slots occupied</span>
                    <span className="text-emerald-700">55% capacity</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: '55%' }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900">
                  <strong>System Behaviour:</strong> Store is operating smoothly within its 50 sq. ft spatial envelope. Ingests parcels from incoming courier batch drops without delay.
                </div>
              </div>
            )}

            {capacityState === 'near' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Sharma Kirana Store Capacity</h3>
                    <p className="text-xs text-slate-500">Dedicated 50 sq. ft 3-tier wire rack</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>Near capacity</span>
                  </span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>34 / 40 slots occupied</span>
                    <span className="text-amber-700">85% capacity (6 slots remaining)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: '85%' }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  <strong>System Behaviour:</strong> Automated warning dispatched to logistics dispatcher. Subsequent large bulky packages are automatically diverted to Gupta General Store (240m away).
                </div>
              </div>
            )}

            {capacityState === 'full' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Sharma Kirana Store Capacity</h3>
                    <p className="text-xs text-slate-500">Dedicated 50 sq. ft 3-tier wire rack</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 font-bold text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span>Full — New parcels temporarily disabled</span>
                  </span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>40 / 40 slots occupied</span>
                    <span className="text-red-700">100% capacity (0 slots left)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full transition-all duration-500" style={{ width: '100%' }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900">
                  <strong>System Behaviour:</strong> Store is marked as <em>temporarily saturated</em> on rider routing maps. All incoming parcels auto-reroute to the secondary verified node. Re-enables automatically as customers collect packages.
                </div>
              </div>
            )}

          </div>

        </div>
      </section>


      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. KIRANA STORE DASHBOARD (SIH DEMO FAVORITE)                 */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="store-dashboard" className="py-16 px-4 sm:px-8 lg:px-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#10b981] bg-[#10b981]/10 px-3 py-1 rounded-full">
                Hackathon Showcase
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F291E] mt-2">
                Kirana Partner Dashboard
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                How a neighborhood shopkeeper monitors incoming shipments, manages rack capacity, and verifies handovers.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl font-mono font-semibold">
                Handling Fee: ₹15 / parcel
              </span>
              <button
                onClick={() => onNavigatePortal('MERCHANT')}
                className="px-4 py-2 rounded-xl bg-[#1A5336] hover:bg-[#0F291E] text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>Open Full Merchant Portal</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#fffd47]" />
              </button>
            </div>
          </div>

          {/* Today's Overview Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Parcels Received</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">18</div>
              <span className="text-[10px] text-slate-500">From 2 courier drops today</span>
            </div>

            <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-200">
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Ready for Pickup</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-900 mt-1">12</div>
              <span className="text-[10px] text-purple-600">Waiting for customers</span>
            </div>

            <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Collected</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 mt-1">6</div>
              <span className="text-[10px] text-emerald-600">₹90 commission earned</span>
            </div>

            <div className="bg-sky-50/60 rounded-2xl p-4 border border-sky-200">
              <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">Available Slots</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-sky-900 mt-1">22 / 40</div>
              <span className="text-[10px] text-sky-600">55% capacity utilized</span>
            </div>

          </div>

          {/* Incoming & Ready Parcels Table */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-800 text-sm">
                Incoming &amp; Active Parcels at Counter
              </h3>
              <span className="text-xs text-slate-500">Demo Store: Sharma Kirana</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/70 text-slate-600 border-b border-slate-200">
                    <th className="py-3 px-4 font-bold">Order ID</th>
                    <th className="py-3 px-4 font-bold">Customer</th>
                    <th className="py-3 px-4 font-bold">Package Item</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold">Shelf Slot</th>
                    <th className="py-3 px-4 font-bold text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#1A5336]">KC10245</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">Rahul S. (+91 98301...)</td>
                    <td className="py-3 px-4">boAt Airdopes 141 Headphones</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px]">
                        🟣 Ready for Pickup
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">Slot A-04</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setActiveHandoverOrder('KC10245');
                          setHandoverOtp('');
                          setHandoverSuccess(false);
                          setIsHandoverModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#1A5336] hover:bg-[#0F291E] text-white font-bold text-[11px] transition shadow-xs"
                      >
                        Enter OTP Handover
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#1A5336]">KC10246</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">Priya M. (+91 98312...)</td>
                    <td className="py-3 px-4">FabIndia Cotton Kurti (Yellow)</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px]">
                        🟣 Ready for Pickup
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">Slot B-08</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setActiveHandoverOrder('KC10246');
                          setHandoverOtp('');
                          setHandoverSuccess(false);
                          setIsHandoverModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#1A5336] hover:bg-[#0F291E] text-white font-bold text-[11px] transition shadow-xs"
                      >
                        Enter OTP Handover
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-500">KC10247</td>
                    <td className="py-3 px-4 font-semibold text-slate-600">Amit K. (+91 98360...)</td>
                    <td className="py-3 px-4 text-slate-500">Dabur Organic Honey (500g)</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        ✅ Collected
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">Slot C-02</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-emerald-700 font-semibold text-[11px] flex items-center justify-end gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Completed (11:42 AM)</span>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

        </div>
      </section>


      {/* ──────────────────────────────────────────────────────────── */}
      {/* 13. CARRIER VIEW / CARRIER DASHBOARD                          */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="carrier-view" className="py-16 px-4 sm:px-8 lg:px-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#38BDF8] bg-sky-950 px-3 py-1 rounded-full border border-sky-800">
                Logistics Dispatch Layer
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                Carrier Dashboard (Delhivery / Shadowfax View)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Demonstrates that KiranaConnect coordinates between carriers, corner stores, and buyers.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700">
                Dispatch Terminal: DEL-KOL-04
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Failed Delivery Card */}
            <div className="lg:col-span-4 bg-slate-800/90 rounded-2xl p-6 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                  Active Failed Delivery Event
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                  NDR Code #04
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400">Order ID:</span>
                  <div className="text-sm font-mono font-bold text-white">AMZ10234</div>
                </div>
                <div>
                  <span className="text-slate-400">Customer Location:</span>
                  <div className="font-semibold text-white">Flat 4B, Belur Towers, Sector V</div>
                </div>
                <div>
                  <span className="text-slate-400">Failure Reason:</span>
                  <div className="text-amber-400 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Customer unavailable / Phone unanswered</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-700">
                <button
                  onClick={() => setCarrierAssignedStore('Sharma Kirana (180m)')}
                  className="w-full py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#fffd47]" />
                  <span>Assign Best Available Store</span>
                </button>
              </div>

              {carrierAssignedStore && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs">
                  ✅ <strong>Rerouted to {carrierAssignedStore}:</strong> Courier rider instructions updated on mobile app.
                </div>
              )}
            </div>

            {/* Nearby Store Allocation Table */}
            <div className="lg:col-span-8 bg-slate-800/90 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-white">
                  Eligible Stores within 300m Radius
                </h3>
                <span className="text-xs text-slate-400">Capacity-Weighted Ranking</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400">
                      <th className="py-2.5 px-3">Store Name</th>
                      <th className="py-2.5 px-3">Distance</th>
                      <th className="py-2.5 px-3">Capacity</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60 text-slate-300">
                    <tr className="hover:bg-slate-700/40 transition">
                      <td className="py-3 px-3 font-bold text-white flex items-center gap-1">
                        <span>Sharma Kirana</span>
                        <span>🛡️</span>
                      </td>
                      <td className="py-3 px-3">180 m</td>
                      <td className="py-3 px-3">
                        <span className="text-emerald-400 font-mono font-bold">40%</span> (12/30)
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                          🟢 Optimal
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setCarrierAssignedStore('Sharma Kirana (180m)')}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition"
                        >
                          Assign
                        </button>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-700/40 transition">
                      <td className="py-3 px-3 font-bold text-white flex items-center gap-1">
                        <span>Gupta Store</span>
                        <span>🛡️</span>
                      </td>
                      <td className="py-3 px-3">240 m</td>
                      <td className="py-3 px-3">
                        <span className="text-emerald-400 font-mono font-bold">55%</span> (11/20)
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                          🟢 Available
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setCarrierAssignedStore('Gupta Store (240m)')}
                          className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-[11px] transition"
                        >
                          Assign
                        </button>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-700/40 transition opacity-80">
                      <td className="py-3 px-3 font-bold text-slate-400 flex items-center gap-1">
                        <span>Maa Laxmi</span>
                        <span>🛡️</span>
                      </td>
                      <td className="py-3 px-3">290 m</td>
                      <td className="py-3 px-3">
                        <span className="text-amber-400 font-mono font-bold">88%</span> (26/30)
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold">
                          🟠 Near Full
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="text-slate-500 text-[11px]">Bypassed</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ──────────────────────────────────────────────────────────── */}
      {/* 12. NETWORK CONTROL DASHBOARD                                 */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-8 lg:px-12 bg-[#F8FAF9] border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F291E]">
                  Network Dashboard
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-mono font-bold">
                  Demo Data
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Central control panel for monitoring active clusters and participating store capacity.
              </p>
            </div>

            <button
              onClick={() => onNavigatePortal('ADMIN')}
              className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Full Control Tower</span>
            </button>
          </div>

          {/* 5 Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Kirana Partners</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">24</div>
              <span className="text-[10px] text-emerald-600 font-semibold">Across Salt Lake Sector V</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Parcels in Network</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">86</div>
              <span className="text-[10px] text-slate-500">Currently held in racks</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Ready for Pickup</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-800 mt-1">31</div>
              <span className="text-[10px] text-purple-600 font-semibold">Customers notified</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Collected Today</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 mt-1">42</div>
              <span className="text-[10px] text-emerald-600 font-semibold">Verified via OTP/PIN</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Stores Near Capacity</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-800 mt-1">3</div>
              <span className="text-[10px] text-amber-600 font-semibold">&gt;80% slot usage</span>
            </div>

          </div>

        </div>
      </section>


      {/* ──────────────────────────────────────────────────────────── */}
      {/* 7 & 18. WHY KIRANACONNECT? (CLEAN, NO EXAGGERATED CLAIMS)    */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="why-section" className="py-16 px-4 sm:px-8 lg:px-12 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#10b981] bg-[#10b981]/10 px-3 py-1 rounded-full">
              Problem &amp; Solution
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F291E] mt-2">
              Why KiranaConnect?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              A straightforward comparison between the current delivery failure loop and our decentralized micro-hub model.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Current Problem Card */}
            <div className="bg-red-50/50 rounded-3xl p-6 sm:p-8 border-2 border-red-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-red-500 text-white flex items-center justify-center font-bold">
                  <XCircle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-red-950">
                  Current Problem: Repeated Doorstep Attempts
                </h3>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm text-red-950">
                <div className="flex items-start gap-2.5">
                  <Truck className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span><strong>Extra rider travel:</strong> Unsuccessful deliveries force riders to repeatedly re-visit the same address.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Fuel className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span><strong>Fuel consumption:</strong> Multiple runs through crowded residential lanes consume uncompensated fuel.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span><strong>More delivery time:</strong> Couriers lose 15–20 minutes per failure calling unanswered phones.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span><strong>Pressure on logistics:</strong> Warehouses get clogged sorting and storing returned NDR packages.</span>
                </div>
              </div>
            </div>

            {/* KiranaConnect Solution Card */}
            <div className="bg-emerald-50/50 rounded-3xl p-6 sm:p-8 border-2 border-emerald-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-emerald-950">
                  KiranaConnect: Nearby Pickup Points
                </h3>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm text-emerald-950">
                <div className="flex items-start gap-2.5">
                  <Store className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Existing local store:</strong> Activates community grocers already operating within 200–300 meters.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Convenient collection:</strong> Customer picks up whenever they want (open till 10 PM) or during their walk.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>No repeat doorstep attempt:</strong> Package resolved on the first run; never returns to the central warehouse.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Merchant commission:</strong> Neighborhood shopkeeper earns a handling fee for every completed parcel.</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ──────────────────────────────────────────────────────────── */}
      {/* 8, 9 & 10. FOR KIRANA PARTNERS & REGISTRATION FORM           */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-8 lg:px-12 bg-[#F4F8F5]">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1A5336] bg-[#1A5336]/10 px-3 py-1 rounded-full">
              Merchant Opportunity
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F291E] mt-2">
              Turn Your Local Store Into a Pickup Point
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Earn additional income by helping your neighbourhood receive parcels.
            </p>
          </div>

          {/* 3 Step Cards: Receive, Store, Earn */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            
            <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 text-center shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto mb-3 text-xl">
                📦
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mb-1">Receive</h3>
              <p className="text-xs text-slate-600">
                Accept eligible parcels from delivery partners during standard shop hours.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 text-center shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 text-xl">
                🔐
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mb-1">Store</h3>
              <p className="text-xs text-slate-600">
                Keep parcels safely in designated shelf space until customer pickup.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 text-center shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 text-xl">
                💰
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mb-1">Earn</h3>
              <p className="text-xs text-slate-600">
                Receive a handling fee for every completed parcel, plus walk-in grocery sales.
              </p>
            </div>

          </div>

          {/* Partner Registration Form Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md">
            <div className="max-w-xl mx-auto">
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-extrabold text-slate-900">
                  Become a Kirana Partner
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fill out store details below to submit an onboarding application.
                </p>
              </div>

              {partnerSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-xl font-bold">
                    ✓
                  </div>
                  <h4 className="text-base font-extrabold text-emerald-900">
                    Application received
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Your store will be verified before activation. Our local team will inspect spatial capacity and contact you within 24 hours.
                  </p>
                  <button
                    onClick={() => setPartnerSubmitted(false)}
                    className="mt-3 text-xs text-emerald-700 underline font-semibold"
                  >
                    Submit another store
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePartnerSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Store Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sharma Kirana Store"
                      value={partnerFormData.storeName}
                      onChange={(e) => setPartnerFormData({ ...partnerFormData, storeName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#10b981] text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Owner Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Sharma"
                        value={partnerFormData.ownerName}
                        onChange={(e) => setPartnerFormData({ ...partnerFormData, ownerName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#10b981] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={partnerFormData.mobileNumber}
                        onChange={(e) => setPartnerFormData({ ...partnerFormData, mobileNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#10b981] text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Location / Address</label>
                    <input
                      type="text"
                      required
                      placeholder="Shop 4, Near Water Tank, Belur / Salt Lake"
                      value={partnerFormData.location}
                      onChange={(e) => setPartnerFormData({ ...partnerFormData, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#10b981] text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Available Storage Capacity</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {['10', '20', '30', '40+'].map((cap) => (
                          <button
                            type="button"
                            key={cap}
                            onClick={() => setPartnerFormData({ ...partnerFormData, capacity: cap })}
                            className={`py-2 rounded-lg font-bold border transition text-center ${
                              partnerFormData.capacity === cap
                                ? 'bg-[#1A5336] text-white border-[#1A5336]'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {cap}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Operating Hours</label>
                      <input
                        type="text"
                        placeholder="8:00 AM – 10:00 PM"
                        value={partnerFormData.operatingHours}
                        onChange={(e) => setPartnerFormData({ ...partnerFormData, operatingHours: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#10b981] text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={partnerFormData.agreeTerms}
                      onChange={(e) => setPartnerFormData({ ...partnerFormData, agreeTerms: e.target.checked })}
                      className="w-4 h-4 text-[#1A5336] rounded border-slate-300"
                    />
                    <label htmlFor="terms" className="text-slate-600 text-[11px]">
                      I agree to the partner terms and background verification audit
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#1A5336] hover:bg-[#0F291E] text-white font-extrabold text-xs transition shadow-md"
                  >
                    Submit Application
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </section>


      {/* ──────────────────────────────────────────────────────────── */}
      {/* 14. DESIGNED TO REDUCE (IMPACT SECTION - CAREFULLY WORDED)     */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="py-14 px-4 sm:px-8 lg:px-12 bg-white border-b border-slate-200 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#10b981] bg-[#10b981]/10 px-3 py-1 rounded-full">
            Projected Impact
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F291E]">
            Designed to reduce
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-2xl mb-1">🚚</div>
              <strong className="block text-xs text-slate-800">Repeat delivery trips</strong>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-2xl mb-1">⛽</div>
              <strong className="block text-xs text-slate-800">Unnecessary fuel usage</strong>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-2xl mb-1">⏱️</div>
              <strong className="block text-xs text-slate-800">Delivery time spent on re-attempts</strong>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-2xl mb-1">🏙️</div>
              <strong className="block text-xs text-slate-800">Pressure on urban delivery networks</strong>
            </div>
          </div>

          <p className="text-xs text-slate-500 italic pt-2">
            *Impact will be validated through pilot testing. Prototype metrics represent simulated operational models.
          </p>
        </div>
      </section>


      {/* ──────────────────────────────────────────────────────────── */}
      {/* QUICK ROLE PORTAL LAUNCH BAR                                  */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="py-12 px-4 sm:px-8 bg-[#0F291E] text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white">
              Explore All Prototype Workspaces
            </h3>
            <p className="text-xs text-[#A3B8AD]">
              Switch into any actor&apos;s interface to see how the system operates end-to-end.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigatePortal('CUSTOMER')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold border border-white/20 transition"
            >
              👤 Customer Pass
            </button>
            <button
              onClick={() => onNavigatePortal('CUSTOMER_HUB')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold border border-white/20 transition"
            >
              📦 Customer Hub
            </button>
            <button
              onClick={() => onNavigatePortal('AGENT')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold border border-white/20 transition"
            >
              🛵 Rider Drop OS
            </button>
            <button
              onClick={() => onNavigatePortal('MERCHANT')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold border border-white/20 transition"
            >
              🏪 Kirana Hub
            </button>
            <button
              onClick={() => onNavigatePortal('ADMIN')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold border border-white/20 transition"
            >
              🏢 Control Tower
            </button>
          </div>
        </div>
      </section>


      {/* ──────────────────────────────────────────────────────────── */}
      {/* FOOTER                                                        */}
      {/* ──────────────────────────────────────────────────────────── */}
      <footer className="py-6 px-4 sm:px-8 bg-[#0B2117] text-slate-400 text-xs border-t border-[#1A5336]/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-roxborough">KiranaConnect</span>
            <span>• Smart India Hackathon 2026</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="/KiranaConnect_2000_Word_Report.html" target="_blank" className="hover:text-white underline">
              2,000-Word Report
            </a>
            <a href="/KiranaConnect_Financial_Model.html" target="_blank" className="hover:text-white underline">
              Financial Model
            </a>
            <span>Salt Lake Sector V, Kolkata</span>
          </div>
        </div>
      </footer>


      {/* ──────────────────────────────────────────────────────────── */}
      {/* MODAL 1: LIVE FAILED DELIVERY DEMO JOURNEY (4/8 STEPS)       */}
      {/* ──────────────────────────────────────────────────────────── */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            
            {/* Close Button */}
            <button
              onClick={() => setIsDemoModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] font-bold text-[10px] uppercase">
                Simulated Journey
              </span>
              <span className="text-xs text-slate-500">Step {demoStep} of 4</span>
            </div>

            {/* Step 1: Failed Delivery */}
            {demoStep === 1 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-slate-700">Order #KC10245</span>
                    <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-[10px]">
                      🟠 Delivery Attempt Failed
                    </span>
                  </div>
                  <div className="mt-2 text-xs space-y-1 text-slate-700">
                    <div>Recipient: <strong>Rahul S.</strong></div>
                    <div>Address: <strong>Belur Towers, Sector V</strong></div>
                    <div className="text-amber-800 font-semibold">
                      Reason: <em>Customer unavailable / Phone unanswered</em>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600">
                  Instead of hauling this parcel 20km back to the warehouse, KiranaConnect triggers an automated nearby store query.
                </p>

                <button
                  onClick={() => setDemoStep(2)}
                  className="w-full py-3 rounded-xl bg-[#1A5336] hover:bg-[#0F291E] text-white font-bold text-xs transition shadow-md"
                >
                  Find Nearby Pickup Points →
                </button>
              </div>
            )}

            {/* Step 2: Nearby Store Selection */}
            {demoStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    We found 3 nearby pickup points
                  </h4>
                  <p className="text-[11px] text-slate-500">All within 300m walking radius</p>
                </div>

                <div className="space-y-2 text-xs">
                  
                  {/* Option 1 */}
                  <div
                    onClick={() => setDemoSelectedStore('Sharma Kirana')}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${
                      demoSelectedStore === 'Sharma Kirana'
                        ? 'border-[#10b981] bg-emerald-50/60'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <strong className="block text-slate-900">Sharma Kirana 🛡️</strong>
                      <span className="text-slate-500">📍 180 m away</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      🟢 18/30 slots available
                    </span>
                  </div>

                  {/* Option 2 */}
                  <div
                    onClick={() => setDemoSelectedStore('Gupta General Store')}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${
                      demoSelectedStore === 'Gupta General Store'
                        ? 'border-[#10b981] bg-emerald-50/60'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <strong className="block text-slate-900">Gupta General Store 🛡️</strong>
                      <span className="text-slate-500">📍 240 m away</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      🟢 9/20 slots available
                    </span>
                  </div>

                  {/* Option 3 */}
                  <div
                    onClick={() => setDemoSelectedStore('Maa Laxmi Store')}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${
                      demoSelectedStore === 'Maa Laxmi Store'
                        ? 'border-amber-500 bg-amber-50/60'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <strong className="block text-slate-900">Maa Laxmi Store 🛡️</strong>
                      <span className="text-slate-500">📍 290 m away</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                      🟡 Almost full (28/30)
                    </span>
                  </div>

                </div>

                <button
                  onClick={() => setDemoStep(3)}
                  className="w-full py-3 rounded-xl bg-[#1A5336] hover:bg-[#0F291E] text-white font-bold text-xs transition shadow-md"
                >
                  Assign to {demoSelectedStore} →
                </button>
              </div>
            )}

            {/* Step 3: Parcel Assigned & Received */}
            {demoStep === 3 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-slate-800 text-xs space-y-2">
                  <div className="text-sm font-extrabold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Parcel assigned successfully</span>
                  </div>
                  <div>Pickup Point: <strong>{demoSelectedStore}</strong></div>
                  <div>Distance: <strong>180 m</strong> from customer address</div>
                  <div>Status: <span className="text-emerald-700 font-semibold">Ready for transfer</span></div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                  📦 <strong>Store Received Parcel:</strong> Shopkeeper scanned parcel onto Shelf Rack Slot <code>A-04</code>. Customer received notification with Pickup PIN <code>4821</code>.
                </div>

                <button
                  onClick={() => setDemoStep(4)}
                  className="w-full py-3 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Proceed to Customer Pickup →</span>
                </button>
              </div>
            )}

            {/* Step 4: Customer Pickup & OTP Verification */}
            {demoStep === 4 && (
              <div className="space-y-4">
                <div className="text-center pb-2">
                  <h4 className="font-extrabold text-base text-slate-900">
                    Customer Pickup Handshake
                  </h4>
                  <p className="text-xs text-slate-500">
                    Customer arrives at Sharma Kirana to collect parcel
                  </p>
                </div>

                {demoOtpVerified ? (
                  <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-lg">
                      ✓
                    </div>
                    <strong className="block text-sm text-emerald-900">
                      Parcel Successfully Collected!
                    </strong>
                    <p className="text-xs text-emerald-800">
                      Handling fee of ₹15 credited to Kirana wallet. Customer avoided delivery delay!
                    </p>
                    <button
                      onClick={() => setIsDemoModalOpen(false)}
                      className="mt-2 px-4 py-2 bg-emerald-700 text-white font-bold rounded-xl text-xs"
                    >
                      Done with Demo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div>Order: <strong>KC10245</strong> (boAt Headphones)</div>
                      <div>Pickup Location: <strong>Sharma Kirana (180m away)</strong></div>
                      <div className="text-slate-500 mt-1">Hint: Test OTP is <strong className="text-slate-900">4821</strong></div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Enter Customer Pickup OTP</label>
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="_ _ _ _"
                        value={demoOtpInput}
                        onChange={(e) => setDemoOtpInput(e.target.value)}
                        className="w-full text-center font-mono text-xl tracking-widest py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#10b981]"
                      />
                    </div>

                    <button
                      onClick={() => {
                        if (demoOtpInput === '4821' || demoOtpInput.length === 4) {
                          setDemoOtpVerified(true);
                        }
                      }}
                      className="w-full py-3 rounded-xl bg-[#1A5336] hover:bg-[#0F291E] text-white font-bold text-xs transition shadow-md"
                    >
                      Verify Pickup &amp; Release Parcel
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}


      {/* ──────────────────────────────────────────────────────────── */}
      {/* MODAL 2: CUSTOMER TRACKING SCREEN (ITEM 3)                    */}
      {/* ──────────────────────────────────────────────────────────── */}
      {isTrackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative space-y-5">
            
            <button
              onClick={() => setIsTrackModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>

            <div>
              <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-wider">KiranaConnect Tracking</span>
              <h3 className="text-lg font-extrabold text-slate-900">Order: KC10245</h3>
              <p className="text-xs text-slate-500">Item: boAt Airdopes 141 Headphones</p>
            </div>

            {/* Realistic Tracking Timeline */}
            <div className="space-y-3 text-xs border-l-2 border-slate-200 ml-2 pl-4 py-1">
              <div className="relative">
                <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                <span className="font-semibold text-slate-800">✓ Order placed</span>
                <div className="text-[10px] text-slate-400">Sep 29, 09:30 AM</div>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                <span className="font-semibold text-slate-800">✓ Out for delivery</span>
                <div className="text-[10px] text-slate-400">Sep 30, 11:15 AM</div>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-amber-500 ring-2 ring-white"></span>
                <span className="font-semibold text-amber-800">✓ Delivery attempt failed</span>
                <div className="text-[10px] text-amber-600">Customer unavailable at address</div>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                <span className="font-semibold text-slate-800">✓ Assigned to Sharma Kirana</span>
                <div className="text-[10px] text-slate-400">180m from your doorstep</div>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-purple-600 ring-2 ring-purple-100 animate-pulse"></span>
                <span className="font-extrabold text-purple-900">● Ready for pickup</span>
                <div className="text-[10px] text-purple-700">Parcel held safely on shelf</div>
              </div>
              <div className="relative opacity-40">
                <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-slate-300 ring-2 ring-white"></span>
                <span className="text-slate-500">○ Collected</span>
              </div>
            </div>

            {/* Pickup Location Details Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pickup Location</span>
              <div className="font-bold text-slate-900 text-sm">Sharma Kirana Store</div>
              <div className="text-slate-600">180 m from your address (Shop 4, Belur / Sector V)</div>
              <div className="text-slate-600 font-semibold">Store Hours: 8 AM – 10 PM</div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">Pickup Code:</span>
                  <span className="font-mono text-lg font-black text-[#1A5336]">4821</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md font-bold">
                  Show code at counter
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsTrackModalOpen(false);
                onNavigatePortal('CUSTOMER');
              }}
              className="w-full py-2.5 rounded-xl bg-[#1A5336] text-white font-bold text-xs hover:bg-[#0F291E] transition"
            >
              Open Full Digital Pass View →
            </button>
          </div>
        </div>
      )}


      {/* ──────────────────────────────────────────────────────────── */}
      {/* MODAL 3: BECOME A KIRANA PARTNER REGISTRATION FORM            */}
      {/* ──────────────────────────────────────────────────────────── */}
      {isPartnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative space-y-4">
            
            <button
              onClick={() => setIsPartnerModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>

            <div>
              <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-wider">Partner Onboarding</span>
              <h3 className="text-lg font-extrabold text-slate-900">Become a Kirana Partner</h3>
              <p className="text-xs text-slate-500">Monetize shelf space with zero investment</p>
            </div>

            {partnerSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-lg">
                  ✓
                </div>
                <strong className="block text-sm text-emerald-900">Application received</strong>
                <p className="text-xs text-emerald-800">
                  Your store will be verified before activation. Our local operations team will contact you for a 50 sq. ft space check.
                </p>
                <button
                  onClick={() => { setPartnerSubmitted(false); setIsPartnerModalOpen(false); }}
                  className="mt-2 px-4 py-2 bg-emerald-700 text-white font-bold rounded-xl text-xs"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handlePartnerSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Store Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sharma Kirana Store"
                    value={partnerFormData.storeName}
                    onChange={(e) => setPartnerFormData({ ...partnerFormData, storeName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#10b981]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Owner Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={partnerFormData.ownerName}
                    onChange={(e) => setPartnerFormData({ ...partnerFormData, ownerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#10b981]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={partnerFormData.mobileNumber}
                    onChange={(e) => setPartnerFormData({ ...partnerFormData, mobileNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#10b981]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Location</label>
                  <input
                    type="text"
                    required
                    placeholder="Shop 4, Belur / Sector V"
                    value={partnerFormData.location}
                    onChange={(e) => setPartnerFormData({ ...partnerFormData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#10b981]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Available Storage Capacity</label>
                  <div className="grid grid-cols-4 gap-1">
                    {['10', '20', '30', '40+'].map((cap) => (
                      <button
                        type="button"
                        key={cap}
                        onClick={() => setPartnerFormData({ ...partnerFormData, capacity: cap })}
                        className={`py-1.5 rounded-lg font-bold border text-center ${
                          partnerFormData.capacity === cap
                            ? 'bg-[#1A5336] text-white border-[#1A5336]'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {cap}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="modal-terms"
                    checked={partnerFormData.agreeTerms}
                    onChange={(e) => setPartnerFormData({ ...partnerFormData, agreeTerms: e.target.checked })}
                    className="w-3.5 h-3.5 text-[#1A5336] rounded"
                  />
                  <label htmlFor="modal-terms" className="text-slate-600 text-[11px]">
                    I agree to the partner verification terms
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#1A5336] hover:bg-[#0F291E] text-white font-bold transition shadow-md"
                >
                  Submit Application
                </button>
              </form>
            )}

          </div>
        </div>
      )}


      {/* ──────────────────────────────────────────────────────────── */}
      {/* MODAL 4: PARCEL HANDOVER SCREEN (ITEM 11)                     */}
      {/* ──────────────────────────────────────────────────────────── */}
      {isHandoverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative space-y-4">
            
            <button
              onClick={() => setIsHandoverModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>

            <div>
              <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-wider">Counter Handover</span>
              <h3 className="text-lg font-extrabold text-slate-900">Parcel Handover</h3>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div>Order: <strong>{activeHandoverOrder}</strong></div>
              <div>Customer: <strong>Rahul S.</strong></div>
              <div>Parcel ID: <span className="font-mono">KC-10245</span></div>
              <div>Status: <span className="text-purple-700 font-bold">Ready for customer</span></div>
              <div className="text-emerald-700 font-semibold pt-1">Store verification: ✓ Passed</div>
            </div>

            {handoverSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-lg">
                  ✓
                </div>
                <strong className="block text-sm text-emerald-900">
                  Parcel Successfully Collected
                </strong>
                <p className="text-xs text-emerald-800">
                  Handover logged cryptographically. ₹15 handling fee disbursed to store UPI wallet!
                </p>
                <button
                  onClick={() => setIsHandoverModalOpen(false)}
                  className="mt-2 px-4 py-1.5 bg-emerald-700 text-white font-bold rounded-xl text-xs"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleHandoverVerify} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Enter Customer Pickup OTP (e.g. 4821)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    placeholder="_ _ _ _"
                    value={handoverOtp}
                    onChange={(e) => setHandoverOtp(e.target.value)}
                    className="w-full text-center font-mono text-xl tracking-widest py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#10b981]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#1A5336] hover:bg-[#0F291E] text-white font-bold transition shadow-md"
                >
                  Verify Pickup
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
