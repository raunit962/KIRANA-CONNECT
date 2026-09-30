import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import { StatusTimeline } from '../components/StatusTimeline';
import { WhatsAppModal } from '../components/WhatsAppModal';
import { InteractiveMap } from '../components/InteractiveMap';
import { soundEffects } from '../lib/soundEffects';
import {
  Package,
  Store,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  QrCode,
  KeyRound,
  MessageSquare,
  Volume2,
  Share2,
  Navigation,
  Sparkles,
  ShoppingBag,
  Timer,
  CheckCircle2,
  Copy,
  ExternalLink,
  Ticket,
  Bike,
  Calendar,
  Zap,
} from 'lucide-react';

interface CustomerPortalProps {
  onNavigateHub?: () => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({ onNavigateHub }) => {
  const {
    parcels,
    stores,
    activeTrackingNumber,
    setActiveTrackingNumber,
    language,
    currentUser,
    setParcelDeliveryPreference,
  } = useApp();
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [timeLeft, setTimeLeft] = useState('47h 18m 42s');
  const [revealDiscount, setRevealDiscount] = useState(false);

  const activeParcel =
    parcels.find((p) => p.trackingNumber === activeTrackingNumber) || parcels[0];
  const assignedStore = stores.find((s) => s.id === activeParcel?.kiranaStoreId) || stores[0];

  // Dynamic live countdown simulator for 72h window
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const seconds = 59 - now.getSeconds();
      const minutes = 59 - now.getMinutes();
      setTimeLeft(`47h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!activeParcel) {
    return (
      <div className="p-8 text-center text-[#4A5B52]">
        No active deliveries found.
      </div>
    );
  }

  const isReadyForPickup = activeParcel.status === 'DROPPED_AT_KIRANA';
  const isCollected = activeParcel.status === 'COLLECTED';

  const handleCopyPin = () => {
    navigator.clipboard.writeText(activeParcel.pickupOtp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const handleListenPin = () => {
    soundEffects.speakOtp(activeParcel.pickupOtp);
  };

  const handleShareFamily = () => {
    const text = `Hey! My package (${activeParcel.packageItem}) is ready for pickup at ${assignedStore.storeName}, ${assignedStore.address}. Pickup OTP is ${activeParcel.pickupOtp}. Collect link: http://localhost:3000`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Dual-Portal Switcher Tabs for Customer */}
      <div className="bg-white border-2 border-[#CDE3D5] rounded-3xl p-3 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl text-xs font-bold bg-[#1A5336] text-white shadow-md border border-[#fffd47]/40 flex items-center justify-center space-x-2"
          >
            <Ticket className="w-4 h-4 text-[#fffd47]" />
            <span className="font-roxborough text-xs font-bold text-[#fffd47]">1. Customer Pickup Pass</span>
            <span className="text-[10px] bg-[#fffd47] text-[#0F291E] font-bold px-2 py-0.5 rounded-full">
              Active Pass
            </span>
          </button>

          <button
            onClick={onNavigateHub}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl text-xs font-bold text-[#0F291E] hover:bg-[#EAF3ED] border border-transparent hover:border-[#CDE3D5] transition flex items-center justify-center space-x-2 group"
          >
            <Package className="w-4 h-4 text-[#1A5336] group-hover:scale-110 transition" />
            <span className="font-roxborough text-xs font-bold">2. Customer Logistics Hub</span>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-black px-2 py-0.5 rounded-full font-mono">
              ₹15 Box
            </span>
          </button>
        </div>

        {/* User Grahak Badge */}
        <div className="flex items-center space-x-2.5 text-xs text-[#0F291E] font-medium bg-[#F4F8F5] px-3.5 py-1.5 rounded-2xl border border-[#CDE3D5]">
          <div className="w-6 h-6 rounded-full bg-[#1A5336] text-[#fffd47] flex items-center justify-center font-bold text-[11px]">
            👤
          </div>
          <div>
            <span className="font-bold text-[#0F291E]">
              {currentUser?.name || 'Anirban Chatterjee'}
            </span>
            <span className="text-[10px] text-[#1A5336] font-mono ml-1.5 font-bold">
              • Verified Grahak
            </span>
          </div>
        </div>
      </div>

      {/* Top Banner & Selector in Lush Green */}
      <div className="bg-[#0F291E] border border-[#1A5336] rounded-3xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-md text-white">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#1A5336] border border-[#fffd47]/30 flex items-center justify-center text-[#fffd47] shadow-md">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-[#F8F5EF]">
                {language === 'hi' ? 'स्मार्ट पिकअप पास' : 'Kirana Smart Delivery Pass'}
              </h2>
              <span className="bg-[#fffd47]/20 text-[#fffd47] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#fffd47]/40">
                PUDO
              </span>
            </div>
            <p className="text-xs text-[#D1E7DD] mt-0.5">
              Recipient: <strong className="text-[#fffd47]">{activeParcel.customerName}</strong> ({activeParcel.customerPhone})
            </p>
          </div>
        </div>

        {/* Parcel Switcher & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={activeParcel.trackingNumber}
            onChange={(e) => setActiveTrackingNumber(e.target.value)}
            className="bg-[#133827] border border-[#1A5336] text-[#F8F5EF] rounded-xl px-3.5 py-2 text-xs font-mono font-bold focus:outline-none focus:border-[#fffd47]"
          >
            {parcels.map((p) => {
              const store = stores.find((s) => s.id === p.kiranaStoreId);
              const sizeLabel = p.packageSize === 'LARGE' ? '📦 HEAVY' : p.packageSize === 'MEDIUM' ? '📦 MED' : '✉️ SML';
              return (
                <option key={p.id} value={p.trackingNumber}>
                  {sizeLabel} | {p.packageItem.slice(0, 28)}... ➔ {store?.storeName.split(' ')[0] || 'Hub'} ({p.status.replace(/_/g, ' ')})
                </option>
              );
            })}
          </select>

          <button
            onClick={() => setIsWhatsAppOpen(true)}
            className="flex items-center space-x-1.5 bg-[#1A5336] hover:bg-[#133F28] text-white border border-[#38BDF8]/40 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <MessageSquare className="w-4 h-4 text-[#fffd47]" />
            <span>WhatsApp Alert</span>
          </button>

          <button
            onClick={handleShareFamily}
            className="flex items-center space-x-1.5 bg-[#133827] hover:bg-[#1A5336] text-[#fffd47] border border-[#1A5336] px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm"
            title="Share pickup pass with family on WhatsApp"
          >
            <Share2 className="w-4 h-4 text-[#38BDF8]" />
            <span className="hidden sm:inline">Share with Family</span>
          </button>
        </div>
      </div>

      {/* 2. Customer Delivery Mode Choice: Self-Pickup vs Kirana Doorstep Delivery (Amazon Hub Model) */}
      <div className="bg-white border-2 border-[#CDE3D5] rounded-3xl p-5 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#CDE3D5] pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#1A5336] text-[#fffd47] flex items-center justify-center font-bold shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#0B2317]">
                {language === 'hi' ? 'पार्सल डिलीवरी का तरीका चुनें' : 'How Would You Like Your Parcel Delivered?'}
              </h3>
              <p className="text-xs text-[#4A5B52]">
                Choose between free neighborhood walk-in pickup or direct doorstep delivery by the Kirana store helper.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-[#fffd47]/30 text-[#0F291E] px-2.5 py-1 rounded-full border border-[#fffd47] self-start sm:self-auto font-mono">
            Amazon Hub Option
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option A: Walk-In Self Pickup */}
          <div
            onClick={() => {
              setParcelDeliveryPreference(activeParcel.id, 'SELF_PICKUP');
              soundEffects.playScanBeep();
            }}
            className={`cursor-pointer rounded-2xl p-4 border-2 transition-all relative flex flex-col justify-between ${
              (activeParcel.deliveryPreference || 'SELF_PICKUP') === 'SELF_PICKUP'
                ? 'bg-[#F4F8F5] border-[#1A5336] ring-2 ring-[#fffd47] shadow-sm'
                : 'bg-white border-stone-200 hover:border-[#1A5336]/40 opacity-80 hover:opacity-100'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-[#0B2317] flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-[#1A5336]" />
                  <span>1. Walk-In Self Pickup</span>
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  FREE (Zero Extra Fee)
                </span>
              </div>
              <p className="text-xs text-[#4A5B52] mt-2">
                Walk 2-5 minutes to <strong>{assignedStore.storeName}</strong> at your own convenience today.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[#1A5336] font-semibold">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1A5336]" />
                  <span>Instant Counter Pickup</span>
                </span>
                <span>•</span>
                <span>Fills 1 Box toward ₹15 Reward</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[#CDE3D5] flex items-center justify-between text-[11px]">
              <span className="text-[#4A5B52]">Verification:</span>
              <span className="font-mono font-bold text-[#0B2317]">Counter QR / 4-Digit PIN</span>
            </div>
          </div>

          {/* Option B: Kirana Store Doorstep Delivery */}
          <div
            onClick={() => {
              setParcelDeliveryPreference(activeParcel.id, 'STORE_DOORSTEP', 'Evening (7:00 PM - 9:00 PM)');
              soundEffects.playCashRegister();
            }}
            className={`cursor-pointer rounded-2xl p-4 border-2 transition-all relative flex flex-col justify-between ${
              activeParcel.deliveryPreference === 'STORE_DOORSTEP'
                ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-400 shadow-sm'
                : 'bg-white border-stone-200 hover:border-amber-400/60 opacity-80 hover:opacity-100'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-[#0B2317] flex items-center gap-1.5">
                  <Bike className="w-4 h-4 text-amber-600" />
                  <span>2. Kirana Store Doorstep Delivery</span>
                </span>
                <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-mono">
                  Store Helper Run (2-3 km)
                </span>
              </div>
              <p className="text-xs text-[#4A5B52] mt-2">
                {assignedStore.storeName}&apos;s staff/helper delivers it directly to your address during store delivery hours.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-amber-900 font-semibold">
                <span className="flex items-center gap-1">
                  <Bike className="w-3.5 h-3.5 text-amber-700" />
                  <span>Delivered by Store Helper ({assignedStore.ownerName.split(' ')[0]}&apos;s team)</span>
                </span>
                <span>•</span>
                <span>Slot: Evening (7 PM - 9 PM)</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-amber-200 flex items-center justify-between text-[11px]">
              <span className="text-[#4A5B52]">Delivery Address:</span>
              <span className="font-bold text-[#0B2317] truncate max-w-[200px]">{activeParcel.destinationAddress}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Helper Delivery Confirmation Bar */}
        {activeParcel.deliveryPreference === 'STORE_DOORSTEP' && (
          <div className="bg-amber-100/90 border border-amber-300 rounded-2xl p-3.5 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="space-y-0.5">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <CheckCircle2 className="w-4 h-4 text-amber-700" />
                <span>Kirana Doorstep Delivery Confirmed!</span>
              </div>
              <div className="text-[11px] text-amber-800">
                The Kirana store helper will bring this parcel to your doorstep today during the evening delivery window. Please have your 4-digit PIN (<strong>{activeParcel.pickupOtp}</strong>) ready to confirm delivery.
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0 self-start sm:self-auto">
              <a
                href={`tel:${assignedStore.phone}`}
                className="px-3 py-1.5 bg-white hover:bg-amber-50 text-[#0B2317] border border-amber-300 rounded-xl font-bold text-xs flex items-center gap-1 transition shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 text-amber-800" />
                <span>Call Store</span>
              </a>
              <button
                onClick={() => soundEffects.speakOtp(activeParcel.pickupOtp)}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 transition shadow-xs"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Audio PIN</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Left = Digital Boarding Pass Ticket, Right = Live Neighborhood Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Smart Boarding Pass Style Card (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Digital Boarding Pass Ticket */}
          <div className="bg-white border-2 border-[#CDE3D5] rounded-3xl overflow-hidden shadow-lg relative">
            {/* Ticket Header in Lush Evergreen */}
            <div className="bg-gradient-to-r from-[#0F291E] to-[#15432B] p-5 text-white flex items-center justify-between font-bold border-b border-[#1A5336]/40">
              <div className="flex items-center space-x-2">
                <Store className="w-5 h-5 text-[#fffd47]" />
                <span className="text-sm font-black uppercase tracking-wider text-[#F8F5EF]">KiranaConnect Digital Pass</span>
              </div>
              <span className="bg-[#fffd47] text-[#0F291E] text-xs px-3 py-1 rounded-full font-mono font-black shadow">
                {activeParcel.trackingNumber}
              </span>
            </div>

            {/* Canva 4-Step Pickup Journey Pill */}
            <div className="grid grid-cols-4 gap-1 p-2 bg-[#133827] text-white text-[11px] font-bold text-center border-b border-[#1A5336]">
              <div className="p-1.5 rounded-xl bg-white/10 flex flex-col items-center">
                <span className="text-emerald-300">1. Locate</span>
                <span className="text-[9px] text-white/70 font-normal">Walk to Hub</span>
              </div>
              <div className="p-1.5 rounded-xl bg-white/10 flex flex-col items-center">
                <span className="text-emerald-300">2. Show Pass</span>
                <span className="text-[9px] text-white/70 font-normal">QR / 4-Digit PIN</span>
              </div>
              <div className="p-1.5 rounded-xl bg-white/10 flex flex-col items-center">
                <span className="text-emerald-300">3. Collect</span>
                <span className="text-[9px] text-white/70 font-normal">Merchant release</span>
              </div>
              <div className="p-1.5 rounded-xl bg-white/10 flex flex-col items-center">
                <span className="text-[#fffd47]">4. Save More</span>
                <span className="text-[9px] text-white/70 font-normal">Shop Discount</span>
              </div>
            </div>

            {/* Ticket Main Body */}
            <div className="p-6 space-y-6 bg-white">
              {/* Status & Expiry Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F4F8F5] p-3.5 rounded-2xl border border-[#CDE3D5]">
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${
                    isReadyForPickup ? 'bg-[#1A5336] animate-ping' : isCollected ? 'bg-slate-400' : 'bg-[#F5A623] animate-pulse'
                  }`} />
                  <span className="text-xs font-extrabold uppercase text-[#0B2317]">
                    {isReadyForPickup ? '✅ Ready For Instant Collection' : isCollected ? '📦 Delivered & Collected' : '🛵 Out For Kirana Drop'}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-[#0284C7] font-mono font-bold bg-[#E0F2FE] px-2.5 py-1 rounded-lg border border-[#BAE6FD]">
                  <Timer className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Time Left: {timeLeft}</span>
                </div>
              </div>

              {/* QR & OTP Pass Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                {/* Dynamic QR Badge */}
                <div className="bg-white p-5 rounded-3xl shadow-md flex flex-col items-center justify-center text-center border-2 border-[#1A5336]/30">
                  <QRCodeSVG
                    value={activeParcel.qrToken}
                    size={175}
                    level="H"
                    includeMargin={true}
                    className="rounded-xl"
                  />
                  <div className="mt-2 text-[11px] font-mono font-bold text-[#0B2317] flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-[#1A5336]" />
                    <span>Scan at Kirana Counter</span>
                  </div>
                </div>

                {/* OTP Display with Audio & Copy */}
                <div className="space-y-4 text-center sm:text-left">
                  <div>
                    <span className="text-xs font-bold text-[#4A5B52] uppercase tracking-wider block mb-1">
                      4-Digit Collection PIN:
                    </span>
                    <div className="flex items-center justify-center sm:justify-start space-x-2">
                      <div className="bg-[#1A5336] text-[#fffd47] font-black text-4xl tracking-widest px-5 py-2.5 rounded-2xl shadow-md font-mono border border-[#fffd47]/40">
                        {activeParcel.pickupOtp}
                      </div>

                      <button
                        onClick={handleCopyPin}
                        className="p-2.5 bg-[#F4F8F5] hover:bg-[#EAF3ED] text-[#0F291E] rounded-xl border border-[#CDE3D5] transition shadow-xs"
                        title="Copy PIN"
                      >
                        {copiedOtp ? <CheckCircle2 className="w-5 h-5 text-[#1A5336]" /> : <Copy className="w-5 h-5" />}
                      </button>

                      <button
                        onClick={handleListenPin}
                        className="p-2.5 bg-[#F4F8F5] hover:bg-[#EAF3ED] text-[#1A5336] rounded-xl border border-[#CDE3D5] transition shadow-xs"
                        title="Pronounce PIN out loud (Hindi/English)"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#F4F8F5] p-3 rounded-2xl border border-[#CDE3D5] text-xs space-y-1.5">
                    <div className="text-[#4A5B52]">Item: <strong className="text-[#0B2317]">{activeParcel.packageItem}</strong></div>
                    <div className="text-[#4A5B52]">Order ID: <span className="font-mono text-[#0B2317]">{activeParcel.orderId}</span></div>
                    <div className="text-[#4A5B52]">Package: <span className="text-[#1A5336] font-bold">{activeParcel.packageSize === 'LARGE' ? '📦 LARGE (Heavy Box)' : activeParcel.packageSize === 'MEDIUM' ? '📦 MEDIUM Box' : '✉️ SMALL Box'}</span></div>
                  </div>

                  {/* PS 26205: Neighbourhood Green Footprint Tracker Badge */}
                  <div className="bg-[#F4F8F5] border border-[#CDE3D5] rounded-2xl p-3 text-xs text-[#4A5B52] space-y-1.5">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5 text-[#0B2317]">
                        <span>🌱</span>
                        <span>Neighbourhood Green Footprint Tracker</span>
                      </span>
                      <span className="text-[10px] bg-[#E0F2FE] text-[#0284C7] px-2 py-0.5 rounded-full border border-[#BAE6FD] font-bold">
                        Your Green Impact
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                      <div className="bg-white p-2 rounded-xl border border-[#CDE3D5]">
                        <span className="text-[#4A5B52] block text-[10px]">Repeat Trips Avoided</span>
                        <strong className="text-[#0B2317] text-xs">1 Courier Run</strong>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-[#CDE3D5]">
                        <span className="text-[#4A5B52] block text-[10px]">CO₂ Emissions Avoided</span>
                        <strong className="text-[#1A5336] text-xs">320g CO₂ (1.4 km)</strong>
                      </div>
                    </div>
                    <p className="text-[10px] text-[#4A5B52] leading-tight pt-0.5">
                      Walking 280m to {assignedStore.storeName} eliminated a repeat multi-day van delivery trip.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Perforated Tear Edge between Pass & Store info */}
            <div className="relative py-2 bg-white flex items-center justify-between">
              <div className="w-6 h-6 -ml-3 rounded-full bg-[#F4F8F5] border-r border-[#CDE3D5]" />
              <div className="flex-1 border-t-2 border-dashed border-[#CDE3D5] mx-2" />
              <div className="w-6 h-6 -mr-3 rounded-full bg-[#F4F8F5] border-l border-[#CDE3D5]" />
            </div>

            {/* Designated Kirana Hub Footer on Ticket */}
            <div className="p-6 bg-[#F4F8F5] border-t border-[#CDE3D5] space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={assignedStore.photoUrl}
                    alt={assignedStore.storeName}
                    className="w-14 h-14 rounded-2xl object-cover border border-[#CDE3D5] shadow"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-extrabold text-sm text-[#0B2317]">
                      <span>{assignedStore.storeName}</span>
                      <ShieldCheck className="w-4 h-4 text-[#1A5336]" />
                    </div>
                    <p className="text-xs text-[#4A5B52] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#1A5336] shrink-0" />
                      <span>{assignedStore.address} (PIN {assignedStore.pincode})</span>
                    </p>
                    <p className="text-[11px] text-[#1A5336] font-bold mt-0.5">
                      ⏰ Open Today: {assignedStore.openTime} - {assignedStore.closeTime}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#0F291E] bg-[#fffd47]/30 px-2.5 py-1 rounded-xl border border-[#fffd47]/50">
                  ⭐ {assignedStore.rating}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${assignedStore.latitude},${assignedStore.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-2 bg-[#1A5336] hover:bg-[#133F28] text-white font-bold py-2.5 rounded-xl text-xs shadow transition border border-[#fffd47]/30"
                >
                  <Navigation className="w-4 h-4 text-[#fffd47]" />
                  <span>Directions (Google Maps)</span>
                </a>

                <a
                  href={`tel:${assignedStore.phone}`}
                  className="flex items-center justify-center space-x-2 bg-white hover:bg-[#EAF3ED] text-[#0B2317] font-bold py-2.5 rounded-xl text-xs border border-[#CDE3D5] transition shadow-xs"
                >
                  <Phone className="w-4 h-4 text-[#1A5336]" />
                  <span>Call Store Owner ({assignedStore.ownerName})</span>
                </a>
              </div>
            </div>
          </div>

          {/* "Drop & Buy" Kirana Customer Cross-Sell Perk Card (Canva Slide 2 Design) */}
          <div className="bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/80 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-[#0F291E] shrink-0">
                <ShoppingBag className="w-6 h-6 text-[#1A5336]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-sm text-[#0B2317]">
                    {language === 'hi' ? 'किराना ग्राहक ऑफर: दुकान छूट' : 'Shop Discount for You'}
                  </h4>
                  <span className="text-[10px] font-bold bg-[#1A5336] text-[#fffd47] px-2 py-0.5 rounded-full">
                    Canva Perk
                  </span>
                </div>
                <p className="text-xs text-[#4A5B52] mt-0.5">
                  Get <strong className="text-[#1A5336]">₹20 OFF</strong> on grocery purchase above ₹100 at this Kirana counter!
                </p>
              </div>
            </div>

            {revealDiscount ? (
              <div className="flex items-center gap-2 animate-scaleUp">
                <span className="text-xs font-mono font-black bg-[#1A5336] text-[#fffd47] px-4 py-2 rounded-xl uppercase whitespace-nowrap shadow-sm border border-[#fffd47]/30 tracking-wider">
                  KIRANAPASS20
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-1 rounded-lg">
                  Applied!
                </span>
              </div>
            ) : (
              <button
                onClick={() => {
                  soundEffects.playCashRegister();
                  setRevealDiscount(true);
                }}
                className="bg-amber-400 hover:bg-amber-300 text-stone-900 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition active:scale-95 whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-stone-900" />
                <span>Reveal Offer</span>
              </button>
            )}
          </div>

          {/* PS 26205: Reverse PUDO (Zero-Courier Return Hub) */}
          <div className="bg-white border border-[#CDE3D5] rounded-3xl p-4 shadow-sm flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7] font-bold text-base">
                🔄
              </div>
              <div>
                <div className="font-extrabold text-[#0B2317] text-sm">Two-Way Circular Logistics (Return PUDO)</div>
                <div className="text-[#4A5B52] text-[11px] mt-0.5">
                  Returning an Amazon/Flipkart order? Drop it back at this counter — eliminates dedicated courier return trips across city roads!
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-[#E0F2FE] text-[#0284C7] px-3 py-1.5 rounded-xl border border-[#BAE6FD] whitespace-nowrap">
              Return Hub
            </span>
          </div>
        </div>

        {/* Right: Live Interactive Neighborhood Map & Telemetry (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interactive Neighborhood Vector Map */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#0B2317] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1A5336]" />
                <span>Hyper-Local Neighborhood Radar</span>
              </h3>
              <span className="text-[10px] text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-md font-bold border border-[#BAE6FD]">
                Live GPS Vector
              </span>
            </div>
            <InteractiveMap
              stores={stores}
              activeParcel={activeParcel}
              selectedStoreId={assignedStore.id}
            />
          </div>

          {/* 4-Stage Delivery Progress Timeline */}
          <div className="bg-white border border-[#CDE3D5] rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-[#0B2317]">Live Parcel Journey Progress</h3>
            <StatusTimeline parcel={activeParcel} />
          </div>
        </div>
      </div>

      {/* WhatsApp Modal */}
      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        parcel={activeParcel}
        store={assignedStore}
      />
    </div>
  );
};
