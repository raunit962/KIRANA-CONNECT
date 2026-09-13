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
} from 'lucide-react';

export const CustomerPortal: React.FC = () => {
  const { parcels, stores, activeTrackingNumber, setActiveTrackingNumber, language } = useApp();
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [timeLeft, setTimeLeft] = useState('47h 18m 42s');

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
      <div className="p-8 text-center text-slate-400">
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
      {/* Top Banner & Selector */}
      <div className="bg-[#EFE8DC] border border-[#D8C3A5] rounded-3xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#B85C38] flex items-center justify-center text-white shadow-md">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-[#171717]">
                {language === 'hi' ? 'स्मार्ट पिकअप पास' : 'Kirana Smart Delivery Pass'}
              </h2>
              <span className="bg-[#D8C3A5]/50 text-[#171717] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#D8C3A5]">
                PUDO 2.0
              </span>
            </div>
            <p className="text-xs text-[#786F67] mt-0.5">
              Recipient: <strong className="text-[#171717]">{activeParcel.customerName}</strong> ({activeParcel.customerPhone})
            </p>
          </div>
        </div>

        {/* Parcel Switcher & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={activeParcel.trackingNumber}
            onChange={(e) => setActiveTrackingNumber(e.target.value)}
            className="bg-[#F8F5EF] border border-[#D8C3A5] text-[#171717] rounded-xl px-3.5 py-2 text-xs font-mono font-bold focus:outline-none focus:border-[#B85C38]"
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
            className="flex items-center space-x-1.5 bg-[#B85C38] hover:bg-[#A94D2F] text-white border border-[#D8C3A5]/40 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Alert</span>
          </button>

          <button
            onClick={handleShareFamily}
            className="flex items-center space-x-1.5 bg-[#F8F5EF] hover:bg-white text-[#171717] border border-[#D8C3A5] px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm"
            title="Share pickup pass with family on WhatsApp"
          >
            <Share2 className="w-4 h-4 text-[#B85C38]" />
            <span className="hidden sm:inline">Share with Family</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left = Digital Boarding Pass Ticket, Right = Live Neighborhood Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Smart Boarding Pass Style Card (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Digital Boarding Pass Ticket */}
          <div className="bg-[#EFE8DC] border-2 border-[#D8C3A5] rounded-3xl overflow-hidden shadow-md relative">
            {/* Ticket Header */}
            <div className="bg-[#171717] p-5 text-white flex items-center justify-between font-bold border-b border-[#D8C3A5]/30">
              <div className="flex items-center space-x-2">
                <Store className="w-5 h-5 text-[#B85C38]" />
                <span className="text-sm font-black uppercase tracking-wider text-[#F8F5EF]">KiranaConnect Digital Pass</span>
              </div>
              <span className="bg-[#B85C38] text-white text-xs px-3 py-1 rounded-full font-mono font-bold shadow">
                {activeParcel.trackingNumber}
              </span>
            </div>

            {/* Ticket Main Body */}
            <div className="p-6 space-y-6">
              {/* Status & Expiry Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F8F5EF] p-3.5 rounded-2xl border border-[#D8C3A5]">
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${
                    isReadyForPickup ? 'bg-[#B85C38] animate-ping' : isCollected ? 'bg-slate-400' : 'bg-amber-600 animate-pulse'
                  }`} />
                  <span className="text-xs font-extrabold uppercase text-[#171717]">
                    {isReadyForPickup ? '✅ Ready For Instant Collection' : isCollected ? '📦 Delivered & Collected' : '🛵 Out For Kirana Drop'}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-[#B85C38] font-mono font-bold bg-[#D8C3A5]/30 px-2.5 py-1 rounded-lg border border-[#D8C3A5]">
                  <Timer className="w-3.5 h-3.5 text-[#B85C38]" />
                  <span>Time Left: {timeLeft}</span>
                </div>
              </div>

              {/* QR & OTP Pass Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                {/* Dynamic QR Badge */}
                <div className="bg-white p-5 rounded-3xl shadow-md flex flex-col items-center justify-center text-center border-2 border-[#D8C3A5]">
                  <QRCodeSVG
                    value={activeParcel.qrToken}
                    size={175}
                    level="H"
                    includeMargin={true}
                    className="rounded-xl"
                  />
                  <div className="mt-2 text-[11px] font-mono font-bold text-[#171717] flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-[#B85C38]" />
                    <span>Scan at Kirana Counter</span>
                  </div>
                </div>

                {/* OTP Display with Audio & Copy */}
                <div className="space-y-4 text-center sm:text-left">
                  <div>
                    <span className="text-xs font-bold text-[#786F67] uppercase tracking-wider block mb-1">
                      4-Digit Collection PIN:
                    </span>
                    <div className="flex items-center justify-center sm:justify-start space-x-2">
                      <div className="bg-[#B85C38] text-white font-black text-4xl tracking-widest px-5 py-2.5 rounded-2xl shadow-md font-mono">
                        {activeParcel.pickupOtp}
                      </div>

                      <button
                        onClick={handleCopyPin}
                        className="p-2.5 bg-[#F8F5EF] hover:bg-white text-[#171717] rounded-xl border border-[#D8C3A5] transition"
                        title="Copy PIN"
                      >
                        {copiedOtp ? <CheckCircle2 className="w-5 h-5 text-[#B85C38]" /> : <Copy className="w-5 h-5" />}
                      </button>

                      <button
                        onClick={handleListenPin}
                        className="p-2.5 bg-[#F8F5EF] hover:bg-white text-[#B85C38] rounded-xl border border-[#D8C3A5] transition"
                        title="Pronounce PIN out loud (Hindi/English)"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#F8F5EF] p-3 rounded-2xl border border-[#D8C3A5] text-xs space-y-1.5">
                    <div className="text-[#786F67]">Item: <strong className="text-[#171717]">{activeParcel.packageItem}</strong></div>
                    <div className="text-[#786F67]">Order ID: <span className="font-mono text-[#171717]">{activeParcel.orderId}</span></div>
                    <div className="text-[#786F67]">Package: <span className="text-[#B85C38] font-bold">{activeParcel.packageSize === 'LARGE' ? '📦 LARGE (Heavy Box)' : activeParcel.packageSize === 'MEDIUM' ? '📦 MEDIUM Box' : '✉️ SMALL Box'}</span></div>
                  </div>

                  {/* PS 26205: Neighbourhood Green Footprint Tracker Badge */}
                  <div className="bg-[#F8F5EF] border border-[#D8C3A5] rounded-2xl p-3 text-xs text-[#786F67] space-y-1.5">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5 text-[#171717]">
                        <span>🌱</span>
                        <span>Neighbourhood Green Footprint Tracker</span>
                      </span>
                      <span className="text-[10px] bg-[#D8C3A5]/50 text-[#171717] px-2 py-0.5 rounded-full border border-[#D8C3A5] font-bold">
                        Your Green Impact
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                      <div className="bg-white p-2 rounded-xl border border-[#D8C3A5]">
                        <span className="text-[#786F67] block text-[10px]">Repeat Trips Avoided</span>
                        <strong className="text-[#171717] text-xs">1 Courier Run</strong>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-[#D8C3A5]">
                        <span className="text-[#786F67] block text-[10px]">CO₂ Emissions Avoided</span>
                        <strong className="text-[#B85C38] text-xs">320g CO₂ (1.4 km)</strong>
                      </div>
                    </div>
                    <p className="text-[10px] text-[#786F67] leading-tight pt-0.5">
                      Walking 280m to {assignedStore.storeName} eliminated a repeat multi-day van delivery trip.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Perforated Tear Edge between Pass & Store info */}
            <div className="relative py-2 bg-[#EFE8DC] flex items-center justify-between">
              <div className="w-6 h-6 -ml-3 rounded-full bg-[#F8F5EF] border-r border-[#D8C3A5]" />
              <div className="flex-1 border-t-2 border-dashed border-[#D8C3A5] mx-2" />
              <div className="w-6 h-6 -mr-3 rounded-full bg-[#F8F5EF] border-l border-[#D8C3A5]" />
            </div>

            {/* Designated Kirana Hub Footer on Ticket */}
            <div className="p-6 bg-[#EFE8DC] border-t border-[#D8C3A5] space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={assignedStore.photoUrl}
                    alt={assignedStore.storeName}
                    className="w-14 h-14 rounded-2xl object-cover border border-[#D8C3A5] shadow"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-extrabold text-sm text-[#171717]">
                      <span>{assignedStore.storeName}</span>
                      <ShieldCheck className="w-4 h-4 text-[#B85C38]" />
                    </div>
                    <p className="text-xs text-[#786F67] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#B85C38] shrink-0" />
                      <span>{assignedStore.address} (PIN {assignedStore.pincode})</span>
                    </p>
                    <p className="text-[11px] text-[#B85C38] font-bold mt-0.5">
                      ⏰ Open Today: {assignedStore.openTime} - {assignedStore.closeTime}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#171717] bg-[#D8C3A5]/40 px-2.5 py-1 rounded-xl border border-[#D8C3A5]">
                  ⭐ {assignedStore.rating}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${assignedStore.latitude},${assignedStore.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-2 bg-[#B85C38] hover:bg-[#A94D2F] text-white font-bold py-2.5 rounded-xl text-xs shadow transition"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Directions (Google Maps)</span>
                </a>

                <a
                  href={`tel:${assignedStore.phone}`}
                  className="flex items-center justify-center space-x-2 bg-[#F8F5EF] hover:bg-white text-[#171717] font-bold py-2.5 rounded-xl text-xs border border-[#D8C3A5] transition"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Store Owner ({assignedStore.ownerName})</span>
                </a>
              </div>
            </div>
          </div>

          {/* "Drop & Buy" Kirana Customer Cross-Sell Perk Card */}
          <div className="bg-[#EFE8DC] border border-[#D8C3A5] rounded-3xl p-5 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#D8C3A5]/40 border border-[#D8C3A5] flex items-center justify-center text-[#B85C38]">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-[#171717]">
                  {language === 'hi' ? 'किराना ग्राहक ऑफर: ₹15 की छूट' : 'Kirana "Pick & Shop" Special'}
                </h4>
                <p className="text-xs text-[#786F67] mt-0.5">
                  Get <strong className="text-[#B85C38]">₹15 OFF</strong> on daily milk/snacks when you collect this parcel!
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-[#B85C38] text-white px-3 py-1.5 rounded-xl uppercase whitespace-nowrap shadow-sm">
              KIRANA15
            </span>
          </div>

          {/* PS 26205: Reverse PUDO (Zero-Courier Return Hub) */}
          <div className="bg-[#EFE8DC] border border-[#D8C3A5] rounded-3xl p-4 shadow-sm flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#D8C3A5]/40 border border-[#D8C3A5] flex items-center justify-center text-[#B85C38] font-bold text-base">
                🔄
              </div>
              <div>
                <div className="font-extrabold text-[#171717] text-sm">Two-Way Circular Logistics (Return PUDO)</div>
                <div className="text-[#786F67] text-[11px] mt-0.5">
                  Returning an Amazon/Flipkart order? Drop it back at this counter — eliminates dedicated courier return trips across city roads!
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-[#D8C3A5]/50 text-[#171717] px-3 py-1.5 rounded-xl border border-[#D8C3A5] whitespace-nowrap">
              Return Hub
            </span>
          </div>
        </div>

        {/* Right: Live Interactive Neighborhood Map & Telemetry (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interactive Neighborhood Vector Map */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#171717] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B85C38]" />
                <span>Hyper-Local Neighborhood Radar</span>
              </h3>
              <span className="text-[11px] text-[#B85C38] font-bold">Live GPS Vector</span>
            </div>
            <InteractiveMap
              stores={stores}
              activeParcel={activeParcel}
              selectedStoreId={assignedStore.id}
            />
          </div>

          {/* 4-Stage Delivery Progress Timeline */}
          <div className="bg-[#EFE8DC] border border-[#D8C3A5] rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-[#171717]">Live Parcel Journey Progress</h3>
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
