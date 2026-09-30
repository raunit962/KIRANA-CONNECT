import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  ExternalLink,
  Sparkles,
  MapPin,
  Clock,
  QrCode,
  ShieldCheck,
  Search,
  Package,
  CheckCircle2,
  ArrowRight,
  Bike,
  Store,
  User,
  Sliders,
  Camera,
  Flashlight,
  RefreshCw,
  Gift,
  Phone,
  Navigation,
  Check,
  TrendingUp,
  Leaf,
  Coins,
  Radio,
  FileText,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CanvaPresentationViewProps {
  onNavigatePortal: (portalKey: string) => void;
}

export const CanvaPresentationView: React.FC<CanvaPresentationViewProps> = ({
  onNavigatePortal,
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right');
  const [isAutoplay, setIsAutoplay] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [revealedOffer, setRevealedOffer] = useState<boolean>(false);
  const [trackingInput, setTrackingInput] = useState<string>('KC123456789IN');
  const [riderChecklist, setRiderChecklist] = useState({
    boardVisible: true,
    counterVisible: true,
    goodLighting: true,
  });
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [selectedShelf, setSelectedShelf] = useState<string>('A2');

  const containerRef = useRef<HTMLDivElement>(null);

  const totalSlides = 6;

  const slidesMeta = [
    { title: 'Home Landing Page', tag: 'From your gali to your doorstep', color: '#1b4235' },
    { title: 'Customer Pickup Pass', tag: 'Dynamic QR & OTP Boarding Pass', color: '#1b4235' },
    { title: 'Delivery Rider OS', tag: 'Consolidated Drop & Photo-Proof', color: '#1c3927' },
    { title: 'Kirana Merchant Hub', tag: '2D Shelf Matrix & UPI Handoff', color: '#1c3927' },
    { title: 'Logistics Admin Hub', tag: 'Green Footprint & NDR Recovery', color: '#20372c' },
    { title: 'Interactive Flow Lab', tag: 'First Mile to Final Smile', color: '#003c27' },
  ];

  const goToSlide = (newIndex: number) => {
    if (newIndex === currentSlide) return;
    setSlideDirection(newIndex > currentSlide ? 'right' : 'left');
    setCurrentSlide(newIndex);
  };

  const nextSlide = () => {
    setSlideDirection('right');
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setSlideDirection('left');
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  // Autoplay timer
  useEffect(() => {
    if (!isAutoplay) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoplay, currentSlide]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-[#F4F8F5] text-[#223024] flex flex-col justify-between select-none ${
        isFullscreen ? 'p-4 bg-black/90' : 'p-3 sm:p-6 max-w-7xl mx-auto'
      }`}
    >
      {/* 1. Canva Slide Control Header */}
      <div className="bg-white border-2 border-[#CDE3D5] rounded-3xl p-3 sm:p-4 mb-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Left: Canva Badge & Slide Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1b4235] text-[#f4c96b] flex items-center justify-center font-black text-xs shadow-xs">
            CANVA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs sm:text-sm text-[#1b4235]">
                {slidesMeta[currentSlide].title}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EAF3ED] text-[#1b4235] font-bold border border-[#CDE3D5]">
                Slide {currentSlide + 1} of {totalSlides}
              </span>
            </div>
            <p className="text-[11px] text-[#4A5B52] hidden sm:block">
              {slidesMeta[currentSlide].tag}
            </p>
          </div>
        </div>

        {/* Center: Slide indicator pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
          {slidesMeta.map((s, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === idx
                  ? 'w-8 bg-[#1b4235] ring-2 ring-[#f4c96b]'
                  : 'w-2.5 bg-[#CDE3D5] hover:bg-[#89a66d]'
              }`}
              title={`Slide ${idx + 1}: ${s.title}`}
            />
          ))}
        </div>

        {/* Right: Presentation Controls */}
        <div className="flex items-center space-x-2">
          {/* Autoplay toggle */}
          <button
            onClick={() => setIsAutoplay(!isAutoplay)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              isAutoplay
                ? 'bg-[#1b4235] text-[#f4c96b] border-[#1b4235]'
                : 'bg-[#EAF3ED] text-[#1b4235] border-[#CDE3D5] hover:bg-[#D1E7DD]'
            }`}
            title="Auto-play presentation slides"
          >
            {isAutoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isAutoplay ? 'Pause' : 'Autoplay'}</span>
          </button>

          {/* Prev / Next */}
          <div className="flex items-center space-x-1 bg-[#EAF3ED] rounded-xl p-0.5 border border-[#CDE3D5]">
            <button
              onClick={prevSlide}
              className="p-1.5 text-[#1b4235] hover:bg-white rounded-lg transition"
              title="Previous Slide (Arrow Left)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="p-1.5 text-[#1b4235] hover:bg-white rounded-lg transition"
              title="Next Slide (Arrow Right)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-[#EAF3ED] hover:bg-[#D1E7DD] text-[#1b4235] rounded-xl transition border border-[#CDE3D5]"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Direct link to Canva design */}
          <a
            href="https://canva.link/twxqtrg3sniz79s"
            target="_blank"
            rel="noreferrer"
            className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#1b4235] text-white hover:bg-[#003c27] text-xs font-bold transition border border-[#f4c96b]/40"
            title="Open original design on Canva"
          >
            <span>Canva Design</span>
            <ExternalLink className="w-3 h-3 text-[#f4c96b]" />
          </a>
        </div>
      </div>

      {/* 2. Main Slide Viewport with Smooth Animation */}
      <div className="relative flex-1 bg-white border-2 border-[#CDE3D5] rounded-3xl shadow-xl overflow-hidden min-h-[620px] flex flex-col justify-between">
        {/* Animated Slide Content Switcher */}
        <div
          key={currentSlide}
          className={`flex-1 flex flex-col ${
            slideDirection === 'right' ? 'canva-slide-right' : 'canva-slide-left'
          }`}
        >
          {/* ========================================================== */}
          {/* SLIDE 1: HOME LANDING PAGE                                 */}
          {/* ========================================================== */}
          {currentSlide === 0 && (
            <div className="p-6 sm:p-10 lg:p-12 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#F4F8F5] via-white to-[#EAF3ED]/40">
              <div className="space-y-6 max-w-4xl">
                {/* Brand Top Header */}
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-2xl text-[#1b4235] tracking-tight">
                    Kirana<span className="text-[#c29a3d]">Connect</span>
                  </span>
                  <span className="text-xs bg-[#c29a3d]/20 text-[#1b4235] px-2.5 py-0.5 rounded-full font-bold border border-[#c29a3d]/40">
                    PUDO Network
                  </span>
                </div>

                {/* Big Typographic Headline from Canva */}
                <div className="space-y-2">
                  <h1 className="font-roxborough text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#223024] tracking-tight leading-tight">
                    From your gali <br />
                    <span className="text-[#1b4235]">to your doorstep</span>
                  </h1>
                  <p className="text-base sm:text-xl font-bold text-[#223024]/80 max-w-2xl leading-relaxed">
                    India&apos;s hyperlocal, zero-emission PUDO network that prevents delivery failures.
                  </p>
                </div>

                {/* Interactive Search Card from Canva */}
                <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-[#CDE3D5] shadow-md max-w-xl space-y-3">
                  <div className="text-xs font-bold text-[#223024] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-[#1b4235]" />
                      <span>Track your parcel</span>
                    </span>
                    <span className="text-[10px] text-[#4A5B52] font-mono">Real-time status</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-[#4A5B52] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={trackingInput}
                        onChange={(e) => setTrackingInput(e.target.value)}
                        placeholder="Enter tracking ID (e.g. KC123456789IN)..."
                        className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-[#F4F8F5] border border-[#CDE3D5] text-xs font-semibold text-[#0F291E] focus:outline-none focus:ring-2 focus:ring-[#1b4235]"
                      />
                    </div>
                    <button
                      onClick={() => onNavigatePortal('CUSTOMER')}
                      className="px-5 py-2.5 rounded-2xl bg-[#1b4235] hover:bg-[#003c27] text-[#e9e4d8] text-xs font-extrabold transition shadow-sm shrink-0 flex items-center gap-1.5"
                    >
                      <span>Track Now</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#f4c96b]" />
                    </button>
                  </div>

                  <p className="text-[11px] text-[#4A5B52] font-medium pt-1 border-t border-[#CDE3D5]">
                    Pickup from nearby kirana stores • Safe • Convenient • Sustainable
                  </p>
                </div>

                {/* Mission Statement Card */}
                <div className="p-5 rounded-3xl bg-[#EAF3ED] border border-[#CDE3D5] max-w-3xl space-y-2">
                  <h3 className="font-roxborough font-bold text-lg text-[#223024]">
                    Solving last-mile failures, one neighbourhood at a time.
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4A5B52] leading-relaxed">
                    KiranaConnect turns trusted kirana stores into secure pickup points, so parcels
                    never miss you. When you&apos;re not home, we hold it close to home — for you to
                    collect on your time.
                  </p>
                </div>

                {/* 3-Step Proof Journey from Canva */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#1b4235]">
                    Your parcel. Your route. Your proof.
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white border border-[#CDE3D5] shadow-xs flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-[#EAF3ED] text-[#1b4235] flex items-center justify-center font-bold text-xs">
                        1
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0F291E]">Picked up</div>
                        <span className="text-[10px] text-[#4A5B52]">From warehouse/seller</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#EAF3ED] border-2 border-[#1b4235] shadow-xs flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-[#1b4235] text-[#f4c96b] flex items-center justify-center font-bold text-xs">
                        2
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1b4235]">At your kirana pickup point</div>
                        <span className="text-[10px] text-[#1b4235] font-bold">Ready for pickup</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border border-[#CDE3D5] shadow-xs flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-[#EAF3ED] text-[#1b4235] flex items-center justify-center font-bold text-xs">
                        3
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0F291E]">Collected by you</div>
                        <span className="text-[10px] text-[#4A5B52]">With OTP / QR confirmation</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide Bottom Bar with Quick Portal Launch */}
              <div className="mt-6 pt-4 border-t border-[#CDE3D5] flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-[#4A5B52] font-semibold">
                  Local stores. Reliable deliveries. Happier neighbourhoods.
                </span>
                <button
                  onClick={() => onNavigatePortal('CUSTOMER')}
                  className="px-4 py-2 bg-[#1b4235] hover:bg-[#003c27] text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <span>Explore the Network</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#f4c96b]" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* SLIDE 2: CUSTOMER PICKUP PASS                              */}
          {/* ========================================================== */}
          {currentSlide === 1 && (
            <div className="p-6 sm:p-10 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#EAF3ED]/30 via-white to-[#F4F8F5]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Digital Boarding Pass Card */}
                <div className="lg:col-span-5 bg-[#1b4235] text-white rounded-3xl p-6 shadow-xl space-y-5 border border-[#1b4235]">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[#f4c96b] font-bold">
                        Digital Boarding Pass
                      </span>
                      <h2 className="font-roxborough font-extrabold text-2xl text-white">
                        Customer Pickup
                      </h2>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                      <QrCode className="w-4 h-4 text-[#f4c96b]" />
                    </div>
                  </div>

                  <p className="text-xs text-white/80 uppercase tracking-wider font-semibold">
                    Show this pass to collect your parcel
                  </p>

                  {/* Big OTP Box */}
                  <div className="bg-black/30 border border-white/15 rounded-2xl p-4 text-center space-y-1">
                    <span className="text-[10px] uppercase font-mono text-white/70">
                      OTP for verification
                    </span>
                    <div className="font-mono text-4xl font-black text-[#f4c96b] tracking-widest">
                      472198
                    </div>
                    <div className="flex items-center justify-center gap-1.5 text-xs text-white/90 font-bold pt-1">
                      <Clock className="w-3.5 h-3.5 text-[#f4c96b] animate-spin" />
                      <span>Valid for 10:00</span>
                    </div>
                  </div>

                  {/* Parcel Summary Specs */}
                  <div className="space-y-2 text-xs text-white/90 border-t border-white/10 pt-3">
                    <div className="flex justify-between">
                      <span className="text-white/60">Tracking ID:</span>
                      <span className="font-mono font-bold text-[#f4c96b]">KCI23456789IN</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Courier Partner:</span>
                      <span className="font-bold">KiranaConnect</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Item:</span>
                      <span className="font-bold">Document</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Route:</span>
                      <span className="font-bold">Mumbai, MH → Bengaluru, KA</span>
                    </div>
                  </div>
                </div>

                {/* Right: Pickup Shop, 4-Step Journey & Discount Offer */}
                <div className="lg:col-span-7 space-y-4">
                  {/* 4-Step Pickup Journey from Canva */}
                  <div className="bg-white p-5 rounded-3xl border-2 border-[#CDE3D5] shadow-sm space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#1b4235] flex items-center justify-between">
                      <span>Pickup Journey</span>
                      <span className="text-[10px] font-mono text-[#4A5B52]">4 Simple Steps</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="p-3 rounded-2xl bg-[#EAF3ED] border border-[#CDE3D5] space-y-1">
                        <div className="text-xs font-bold text-[#1b4235]">1. Locate</div>
                        <p className="text-[10px] text-[#4A5B52]">
                          Find a nearby Kirana shop with your parcel.
                        </p>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#EAF3ED] border border-[#CDE3D5] space-y-1">
                        <div className="text-xs font-bold text-[#1b4235]">2. Show Pass</div>
                        <p className="text-[10px] text-[#4A5B52]">
                          Show QR code or OTP to the shop.
                        </p>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#EAF3ED] border border-[#CDE3D5] space-y-1">
                        <div className="text-xs font-bold text-[#1b4235]">3. Collect</div>
                        <p className="text-[10px] text-[#4A5B52]">
                          Receive your parcel and confirm pickup.
                        </p>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#EAF3ED] border border-[#CDE3D5] space-y-1">
                        <div className="text-xs font-bold text-[#1b4235]">4. Save More</div>
                        <p className="text-[10px] text-[#4A5B52]">
                          Thank the shop and unlock your discount.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Your Pickup Shop Card from Canva */}
                  <div className="bg-white p-5 rounded-3xl border-2 border-[#CDE3D5] shadow-sm space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#89a66d]">
                          Your Pickup Shop
                        </span>
                        <h3 className="font-roxborough font-bold text-xl text-[#1b4235]">
                          Sri Ganesh provisions
                        </h3>
                        <p className="text-xs text-[#4A5B52]">
                          #12, 123 Cross, 55th Main, BTM Layout, Bengaluru, Karnataka 560076
                        </p>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full border border-emerald-300">
                        Open • Closes 10:00 PM
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <button className="px-3.5 py-2 bg-[#1b4235] hover:bg-[#003c27] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition">
                        <Navigation className="w-3.5 h-3.5 text-[#f4c96b]" />
                        <span>Get Directions</span>
                      </button>
                      <button className="px-3.5 py-2 bg-[#EAF3ED] hover:bg-[#D1E7DD] text-[#1b4235] rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-[#CDE3D5]">
                        <Phone className="w-3.5 h-3.5 text-[#1b4235]" />
                        <span>Call Shop</span>
                      </button>
                    </div>
                  </div>

                  {/* Green Footprint & Loyalty Discount Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Footprint */}
                    <div className="p-4 rounded-3xl bg-[#EAF3ED] border border-[#CDE3D5] space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-[#1b4235]">
                        <Leaf className="w-4 h-4 text-emerald-600" />
                        <span>Your Green Footprint</span>
                      </div>
                      <p className="text-[11px] text-[#4A5B52] leading-relaxed">
                        Thank you for choosing pickup! Fewer failed deliveries. Smaller footprint.
                      </p>
                    </div>

                    {/* Shop Discount with Interactive Reveal */}
                    <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-[#1b4235]">
                          <Gift className="w-4 h-4 text-[#c29a3d]" />
                          <span>Shop Discount for You</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#4A5B52]">
                        Show this pass after pickup to get a special discount at this shop!
                      </p>
                      {revealedOffer ? (
                        <div className="p-2 rounded-xl bg-[#1b4235] text-[#f4c96b] text-center font-mono font-bold text-xs animate-scale-up">
                          10% OFF at Sri Ganesh Provisions (Code: KIRANA10)
                        </div>
                      ) : (
                        <button
                          onClick={() => setRevealedOffer(true)}
                          className="w-full py-1.5 bg-[#1b4235] hover:bg-[#003c27] text-white text-xs font-bold rounded-xl transition"
                        >
                          Reveal Offer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="mt-6 pt-4 border-t border-[#CDE3D5] flex items-center justify-between text-xs">
                <span className="text-[#4A5B52]">Need to return? Initiate return from the shop.</span>
                <button
                  onClick={() => onNavigatePortal('CUSTOMER')}
                  className="px-4 py-2 bg-[#1b4235] hover:bg-[#003c27] text-white rounded-xl font-bold transition flex items-center gap-1.5"
                >
                  <span>Launch Live Customer Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* SLIDE 3: DELIVERY RIDER OS                                 */}
          {/* ========================================================== */}
          {currentSlide === 2 && (
            <div className="p-6 sm:p-10 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#F4F8F5] via-white to-[#EAF3ED]/30">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#CDE3D5] pb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-full border border-[#BAE6FD]">
                      PUDO Network Rider OS
                    </span>
                    <h2 className="font-roxborough font-extrabold text-3xl text-[#1c3927] mt-1">
                      Delivery Rider
                    </h2>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold border border-amber-300">
                    One active delivery • Complete the drop to finish
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: 3 Parcels in Bag & Target Hub */}
                  <div className="lg:col-span-6 space-y-4">
                    {/* Parcels in Bag */}
                    <div className="bg-white p-5 rounded-3xl border-2 border-[#CDE3D5] shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#1c3927] flex items-center gap-1.5">
                          <Package className="w-4 h-4 text-[#1c3927]" />
                          <span>Parcels in bag</span>
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#1c3927] text-white text-xs font-black">
                          3 Items
                        </span>
                      </div>

                      <div className="space-y-2">
                        {[
                          { id: 'KC123456789IN', category: 'Electronics', color: 'border-l-4 border-red-500' },
                          { id: 'KC987654321N', category: 'Health & Personal Care', color: 'border-l-4 border-purple-500' },
                          { id: 'KC55567778N', category: 'Home Essentials', color: 'border-l-4 border-green-500' },
                        ].map((pkg, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-2xl bg-[#F4F8F5] border border-[#CDE3D5] flex items-center justify-between ${pkg.color}`}
                          >
                            <div>
                              <div className="font-mono font-bold text-xs text-[#0F291E]">{pkg.id}</div>
                              <span className="text-[10px] text-[#4A5B52]">{pkg.category}</span>
                            </div>
                            <span className="text-[10px] font-bold bg-[#EAF3ED] text-[#1c3927] px-2 py-0.5 rounded-full">
                              PUDO Drop
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Target Kirana PUDO Hub */}
                    <div className="bg-[#1c3927] text-white p-5 rounded-3xl shadow-md space-y-3 border border-[#1c3927]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#f4c96b] uppercase tracking-wider font-bold">
                          Target Kirana PUDO Hub
                        </span>
                        <span className="text-xs font-mono font-bold bg-white/10 px-2 py-0.5 rounded">
                          2.2 km away
                        </span>
                      </div>

                      <div>
                        <h4 className="font-roxborough font-bold text-xl text-white">
                          Shri Laxmi Kirana Store
                        </h4>
                        <p className="text-xs text-white/80 mt-1">
                          #12, 2nd Cross, 4th Main, Banashankari 3rd Stage, Bengaluru – 560065
                        </p>
                        <p className="text-xs text-[#f4c96b] font-mono mt-0.5">📞 080 2671 2345</p>
                      </div>

                      <button className="w-full py-2.5 bg-white text-[#1c3927] hover:bg-white/90 rounded-2xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-sm">
                        <Navigation className="w-3.5 h-3.5 text-[#1c3927]" />
                        <span>Open Route in Google Maps</span>
                      </button>
                    </div>
                  </div>

                  {/* Right: AI Proof-of-Drop Camera Scanner */}
                  <div className="lg:col-span-6 bg-white p-5 rounded-3xl border-2 border-[#CDE3D5] shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Camera className="w-4 h-4 text-[#1c3927]" />
                        <span className="font-bold text-xs text-[#1c3927]">
                          AI proof-of-drop camera scanner
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => setIsTorchOn(!isTorchOn)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
                            isTorchOn ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white border-[#CDE3D5]'
                          }`}
                        >
                          Torch {isTorchOn ? 'ON' : 'OFF'}
                        </button>
                      </div>
                    </div>

                    {/* Camera Viewport Simulation */}
                    <div
                      className={`relative h-44 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed transition-all ${
                        isTorchOn
                          ? 'bg-amber-50/80 border-amber-400'
                          : 'bg-[#0F291E]/90 border-white/20 text-white'
                      }`}
                    >
                      <div className="w-24 h-24 rounded-2xl border-2 border-white/40 flex items-center justify-center">
                        <Camera className="w-8 h-8 opacity-60 animate-pulse" />
                      </div>
                      <span className="text-[11px] font-mono mt-2 opacity-80">
                        Guide: Clear shop board &amp; counter
                      </span>
                    </div>

                    {/* Checklist Requirements */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2 rounded-xl bg-[#EAF3ED] border border-[#CDE3D5] text-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mx-auto mb-0.5" />
                        <span className="text-[10px] font-bold text-[#1c3927]">Shop board visible</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#EAF3ED] border border-[#CDE3D5] text-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mx-auto mb-0.5" />
                        <span className="text-[10px] font-bold text-[#1c3927]">Counter visible</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#EAF3ED] border border-[#CDE3D5] text-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mx-auto mb-0.5" />
                        <span className="text-[10px] font-bold text-[#1c3927]">Good lighting</span>
                      </div>
                    </div>

                    {/* Confirm Button */}
                    <button
                      onClick={() => onNavigatePortal('AGENT')}
                      className="w-full py-3 bg-[#1c3927] hover:bg-[#003c27] text-white rounded-2xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#f4c96b]" />
                      <span>Confirm Parcel Drop (Batch of 3)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="mt-6 pt-4 border-t border-[#CDE3D5] flex items-center justify-between text-xs">
                <span className="text-[#4A5B52]">Rider: Ravi Kumar • Active Route Batch</span>
                <button
                  onClick={() => onNavigatePortal('AGENT')}
                  className="px-4 py-2 bg-[#1c3927] hover:bg-[#003c27] text-white rounded-xl font-bold transition flex items-center gap-1.5"
                >
                  <span>Open Full Rider OS</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* SLIDE 4: KIRANA MERCHANT HUB                               */}
          {/* ========================================================== */}
          {currentSlide === 3 && (
            <div className="p-6 sm:p-10 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#EAF3ED]/30 via-white to-[#F4F8F5]">
              <div className="space-y-6">
                {/* Merchant Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#CDE3D5] pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#1c3927] text-[#f4c96b] flex items-center justify-center font-bold text-xl shadow-xs">
                      AK
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-roxborough font-extrabold text-2xl text-[#1c3927]">
                          Amit Kumar
                        </h2>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                          Verified Merchant
                        </span>
                      </div>
                      <p className="text-xs text-[#4A5B52]">
                        Sharma Kirana Store • Lajpat Nagar, New Delhi
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-[#1c3927] bg-[#EAF3ED] px-3 py-1 rounded-full border border-[#CDE3D5]">
                    Har Gali. Har Parcel. Safe &amp; Simple.
                  </span>
                </div>

                {/* 3 Metric Cards from Canva */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-3xl bg-[#1c3927] text-white shadow-xs space-y-1">
                    <span className="text-[10px] text-white/70 uppercase font-mono font-bold">
                      Shelf Storage Capacity
                    </span>
                    <div className="flex items-baseline space-x-3 pt-1">
                      <div>
                        <span className="text-xl font-black text-[#f4c96b]">100</span>
                        <span className="text-[10px] text-white/60 ml-1">Used</span>
                      </div>
                      <div>
                        <span className="text-xl font-black text-white">200</span>
                        <span className="text-[10px] text-white/60 ml-1">Hold</span>
                      </div>
                      <div>
                        <span className="text-xl font-black text-emerald-400">300</span>
                        <span className="text-[10px] text-white/60 ml-1">Available</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-3xl bg-white border-2 border-[#CDE3D5] shadow-xs space-y-1">
                    <span className="text-[10px] text-[#4A5B52] uppercase font-mono font-bold">
                      Merchant Wallet
                    </span>
                    <div className="text-2xl font-black text-[#1c3927]">₹4,500</div>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      +₹15/drop • +18% vs Last Month
                    </span>
                  </div>

                  <div className="p-4 rounded-3xl bg-white border-2 border-[#CDE3D5] shadow-xs space-y-1">
                    <span className="text-[10px] text-[#4A5B52] uppercase font-mono font-bold">
                      Store Footfall Gain
                    </span>
                    <div className="text-2xl font-black text-[#0284C7]">+142 Shoppers</div>
                    <span className="text-[10px] text-[#4A5B52]">
                      New: 88 • Returned: 54
                    </span>
                  </div>
                </div>

                {/* Shelf Matrix & Quick Handoff */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: 2D Shelf Matrix */}
                  <div className="lg:col-span-8 bg-white p-5 rounded-3xl border-2 border-[#CDE3D5] shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#1c3927] flex items-center gap-1.5">
                        <Store className="w-4 h-4 text-[#1c3927]" />
                        <span>Shelf Map (Locate Parcels Quickly)</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-[11px] font-bold">
                        <button className="px-2 py-0.5 rounded bg-[#1c3927] text-white">All</button>
                        <button className="px-2 py-0.5 rounded bg-[#EAF3ED] text-[#1c3927]">Due Today</button>
                        <button className="px-2 py-0.5 rounded bg-[#EAF3ED] text-[#1c3927]">Ready</button>
                      </div>
                    </div>

                    {/* Shelf Grid Simulation */}
                    <div className="grid grid-cols-6 gap-2 pt-2">
                      {['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6'].map(
                        (slot) => {
                          const isOccupied = ['A2', 'A4', 'B1', 'B3', 'B5'].includes(slot);
                          const isSelected = selectedShelf === slot;
                          return (
                            <div
                              key={slot}
                              onClick={() => setSelectedShelf(slot)}
                              className={`p-3 rounded-2xl text-center cursor-pointer transition select-none border ${
                                isSelected
                                  ? 'bg-[#1c3927] text-[#f4c96b] border-[#f4c96b] shadow-md ring-2 ring-[#f4c96b]/50'
                                  : isOccupied
                                  ? 'bg-[#EAF3ED] text-[#1c3927] border-[#1c3927]/40 hover:bg-[#D1E7DD]'
                                  : 'bg-[#F4F8F5] text-[#4A5B52] border-[#CDE3D5]'
                              }`}
                            >
                              <div className="font-mono font-black text-sm">{slot}</div>
                              <span className="text-[9px] font-semibold">
                                {isOccupied ? 'Occupied' : 'Empty'}
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Right: Quick Handoff QR / OTP */}
                  <div className="lg:col-span-4 bg-[#1c3927] text-white p-5 rounded-3xl shadow-sm space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-[#f4c96b] text-xs font-bold mb-1">
                        <QrCode className="w-4 h-4" />
                        <span>Quick Handoff (QR / OTP)</span>
                      </div>
                      <p className="text-xs text-white/80 leading-relaxed">
                        Scan QR code or enter OTP to hand over parcel to customer.
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigatePortal('MERCHANT')}
                      className="w-full py-3 bg-[#f4c96b] hover:bg-[#e0b457] text-[#1c3927] rounded-2xl font-extrabold text-xs transition shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Start Handoff</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="mt-6 pt-4 border-t border-[#CDE3D5] flex items-center justify-between text-xs">
                <span className="text-[#4A5B52]">Selected Slot: {selectedShelf} • Active Inventory</span>
                <button
                  onClick={() => onNavigatePortal('MERCHANT')}
                  className="px-4 py-2 bg-[#1c3927] hover:bg-[#003c27] text-white rounded-xl font-bold transition flex items-center gap-1.5"
                >
                  <span>Open Full Merchant Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* SLIDE 5: LOGISTICS ADMIN HUB                               */}
          {/* ========================================================== */}
          {currentSlide === 4 && (
            <div className="p-6 sm:p-10 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#F4F8F5] via-white to-[#EAF3ED]/30">
              <div className="space-y-6">
                {/* Admin Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#CDE3D5] pb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-[#c29a3d] bg-[#c29a3d]/20 px-2 py-0.5 rounded-full border border-[#c29a3d]/40">
                      Urban Command Center
                    </span>
                    <h2 className="font-roxborough font-extrabold text-3xl text-[#20372c] mt-1">
                      Logistics Admin Hub
                    </h2>
                  </div>
                  <span className="text-xs font-semibold text-[#4A5B52]">
                    Real-time visibility. Smarter neighbourhoods.
                  </span>
                </div>

                {/* Hero Green Footprint Tracker Card from Canva */}
                <div className="bg-[#20372c] text-white p-6 rounded-3xl shadow-xl space-y-4 relative overflow-hidden">
                  <div className="relative z-10 max-w-2xl space-y-2">
                    <span className="text-[10px] font-mono text-[#f4c96b] uppercase tracking-wider font-bold">
                      ESG &amp; Carbon Analytics
                    </span>
                    <h3 className="font-roxborough font-bold text-2xl text-white">
                      Neighbourhood Green Footprint Tracker
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                      Track how hyperlocal delivery through KiranaConnect reduces failed deliveries,
                      cuts emissions, and strengthens local ecosystems.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-center">
                      <div className="text-lg font-black text-[#f4c96b]">13,420 kg</div>
                      <div className="text-[10px] text-white/70">CO₂ Avoided</div>
                    </div>
                    <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-center">
                      <div className="text-lg font-black text-emerald-400">94.8%</div>
                      <div className="text-[10px] text-white/70">NDR Recovery</div>
                    </div>
                    <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-center">
                      <div className="text-lg font-black text-white">₹38/drop</div>
                      <div className="text-[10px] text-white/70">3PL Savings</div>
                    </div>
                    <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-center">
                      <div className="text-lg font-black text-[#38BDF8]">4,820</div>
                      <div className="text-[10px] text-white/70">Verified Kiranas</div>
                    </div>
                  </div>
                </div>

                {/* Dispatch Queue & Active Network */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-3xl bg-white border-2 border-[#CDE3D5] shadow-xs space-y-1">
                    <span className="text-[10px] font-bold text-[#4A5B52] uppercase font-mono">
                      Active Network Coverage
                    </span>
                    <div className="text-xl font-black text-[#20372c]">Bengaluru South</div>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      High Coverage • 98 PUDO Hubs Active
                    </span>
                  </div>

                  <div className="p-4 rounded-3xl bg-white border-2 border-[#CDE3D5] shadow-xs space-y-1">
                    <span className="text-[10px] font-bold text-[#4A5B52] uppercase font-mono">
                      Smart DispatchQueue
                    </span>
                    <div className="text-xl font-black text-[#20372c]">142 In-Flight</div>
                    <span className="text-[10px] text-[#4A5B52]">
                      Consolidated to 12 Hubs
                    </span>
                  </div>

                  <div className="p-4 rounded-3xl bg-white border-2 border-[#CDE3D5] shadow-xs space-y-1">
                    <span className="text-[10px] font-bold text-[#4A5B52] uppercase font-mono">
                      Urban Relief Metric
                    </span>
                    <div className="text-xl font-black text-emerald-700">-64% Vans</div>
                    <span className="text-[10px] text-[#4A5B52]">
                      Relieving Residential Streets
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="mt-6 pt-4 border-t border-[#CDE3D5] flex items-center justify-between text-xs">
                <span className="text-[#4A5B52]">Deliver locally. Prevent returns.</span>
                <button
                  onClick={() => onNavigatePortal('ADMIN')}
                  className="px-4 py-2 bg-[#20372c] hover:bg-[#003c27] text-white rounded-xl font-bold transition flex items-center gap-1.5"
                >
                  <span>Open Full Logistics Admin Hub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* SLIDE 6: INTERACTIVE FLOW LAB                              */}
          {/* ========================================================== */}
          {currentSlide === 5 && (
            <div className="p-6 sm:p-10 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#F4F8F5] via-white to-[#EAF3ED]/30">
              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-1 border-b border-[#CDE3D5] pb-4">
                  <div className="flex items-center space-x-2">
                    <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold uppercase text-[#003c27]">
                      Interactive Flow Lab • 5-Step Lifecycle
                    </span>
                  </div>
                  <h2 className="font-roxborough font-extrabold text-3xl sm:text-4xl text-[#003c27]">
                    See the journey. From first mile to final smile.
                  </h2>
                  <p className="text-xs sm:text-sm text-[#4A5B52]">
                    This simulator walks through how KiranaConnect prevents delivery failures using
                    the trusted neighborhood PUDO network.
                  </p>
                </div>

                {/* 5-Step Pipeline Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { num: 1, title: 'Order Placed & Accepted' },
                    { num: 2, title: 'Delivery Attempt & Failure' },
                    { num: 3, title: 'PUDO Placement at Kirana' },
                    { num: 4, title: 'Customer Pickup via QR/OTP' },
                    { num: 5, title: 'Completion & Returns' },
                  ].map((st) => (
                    <div
                      key={st.num}
                      className={`p-3 rounded-2xl border text-center transition ${
                        st.num === 3
                          ? 'bg-[#003c27] text-white border-[#f4c96b] shadow-md ring-2 ring-[#f4c96b]/40'
                          : 'bg-white text-[#4A5B52] border-[#CDE3D5]'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center text-xs font-bold ${
                          st.num === 3 ? 'bg-[#f4c96b] text-[#003c27]' : 'bg-[#EAF3ED] text-[#4A5B52]'
                        }`}
                      >
                        {st.num}
                      </div>
                      <div className="text-[10px] font-bold leading-tight">{st.title}</div>
                    </div>
                  ))}
                </div>

                {/* Active Step 3 Focus Card from Canva */}
                <div className="bg-white p-6 rounded-3xl border-2 border-[#CDE3D5] shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#c29a3d]">Step 3 of 5</span>
                      <h3 className="font-roxborough font-bold text-xl text-[#003c27]">
                        PUDO Placement at Kirana Store
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold bg-[#EAF3ED] text-[#003c27] px-3 py-1 rounded-full border border-[#CDE3D5]">
                      Ref: KC-PUDO-78452
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#4A5B52] leading-relaxed">
                    Rider places the parcel at a verified KiranaConnect PUDO point after a failed
                    delivery attempt. The store scans and securely holds the package for customer
                    pickup.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-3 rounded-2xl bg-[#F4F8F5] border border-[#CDE3D5]">
                      <span className="text-[10px] text-[#4A5B52]">Customer</span>
                      <div className="text-xs font-bold text-[#0F291E]">Nina O.</div>
                      <span className="text-[10px] text-emerald-700">Willing to pick up</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#F4F8F5] border border-[#CDE3D5]">
                      <span className="text-[10px] text-[#4A5B52]">Rider</span>
                      <div className="text-xs font-bold text-[#0F291E]">Ravi Kumar</div>
                      <span className="text-[10px] text-amber-700">Marked attempted</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#F4F8F5] border border-[#CDE3D5]">
                      <span className="text-[10px] text-[#4A5B52]">Merchant</span>
                      <div className="text-xs font-bold text-[#0F291E]">Sharma General Store</div>
                      <span className="text-[10px] text-[#003c27]">Order handed over</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#F4F8F5] border border-[#CDE3D5]">
                      <span className="text-[10px] text-[#4A5B52]">Logistics Admin</span>
                      <div className="text-xs font-bold text-[#0F291E]">Control Tower</div>
                      <span className="text-[10px] text-[#0284C7]">Monitoring flow</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="mt-6 pt-4 border-t border-[#CDE3D5] flex items-center justify-between text-xs">
                <span className="text-[#4A5B52]">Nearby, Reliable, Always.</span>
                <button
                  onClick={() => onNavigatePortal('SIMULATOR')}
                  className="px-4 py-2 bg-[#003c27] hover:bg-[#1b4235] text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <span>Launch Live Interactive Simulator</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CanvaPresentationView;
