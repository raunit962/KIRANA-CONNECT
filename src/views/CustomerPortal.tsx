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
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">
                {language === 'hi' ? 'स्मार्ट पिकअप पास' : 'Kirana Smart Delivery Pass'}
              </h2>
              <span className="bg-sky-500/20 text-sky-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-sky-500/30">
                PUDO 2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Recipient: <strong className="text-slate-200">{activeParcel.customerName}</strong> ({activeParcel.customerPhone})
            </p>
          </div>
        </div>

        {/* Parcel Switcher & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={activeParcel.trackingNumber}
            onChange={(e) => setActiveTrackingNumber(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2 text-xs font-mono font-bold focus:outline-none focus:border-brand-500"
          >
            {parcels.map((p) => (
              <option key={p.id} value={p.trackingNumber}>
                {p.trackingNumber} — {p.packageItem} ({p.status.replace(/_/g, ' ')})
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsWhatsAppOpen(true)}
            className="flex items-center space-x-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Alert</span>
          </button>

          <button
            onClick={handleShareFamily}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow"
            title="Share pickup pass with family on WhatsApp"
          >
            <Share2 className="w-4 h-4 text-brand-400" />
            <span className="hidden sm:inline">Share with Family</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left = Digital Boarding Pass Ticket, Right = Live Neighborhood Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Smart Boarding Pass Style Card (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Digital Boarding Pass Ticket */}
          <div className="bg-[#0e1626] border-2 border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl relative">
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-brand-600 via-amber-500 to-brand-500 p-5 text-slate-950 flex items-center justify-between font-bold">
              <div className="flex items-center space-x-2">
                <Store className="w-5 h-5" />
                <span className="text-sm font-black uppercase tracking-wider">KiranaConnect Digital Pass</span>
              </div>
              <span className="bg-slate-950 text-amber-300 text-xs px-3 py-1 rounded-full font-mono font-bold shadow">
                {activeParcel.trackingNumber}
              </span>
            </div>

            {/* Ticket Main Body */}
            <div className="p-6 space-y-6">
              {/* Status & Expiry Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${
                    isReadyForPickup ? 'bg-emerald-500 animate-ping' : isCollected ? 'bg-slate-500' : 'bg-amber-500 animate-pulse'
                  }`} />
                  <span className="text-xs font-extrabold uppercase text-slate-200">
                    {isReadyForPickup ? '✅ Ready For Instant Collection' : isCollected ? '📦 Delivered & Collected' : '🛵 Out For Kirana Drop'}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-amber-300 font-mono font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  <Timer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Time Left: {timeLeft}</span>
                </div>
              </div>

              {/* QR & OTP Pass Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                {/* Dynamic QR Badge */}
                <div className="bg-white p-5 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-center border-4 border-slate-800">
                  <QRCodeSVG
                    value={activeParcel.qrToken}
                    size={175}
                    level="H"
                    includeMargin={true}
                    className="rounded-xl"
                  />
                  <div className="mt-2 text-[11px] font-mono font-bold text-slate-950 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-brand-600" />
                    <span>Scan at Kirana Counter</span>
                  </div>
                </div>

                {/* OTP Display with Audio & Copy */}
                <div className="space-y-4 text-center sm:text-left">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      4-Digit Collection PIN:
                    </span>
                    <div className="flex items-center justify-center sm:justify-start space-x-2">
                      <div className="bg-gradient-to-r from-brand-500 to-amber-500 text-slate-950 font-black text-4xl tracking-widest px-5 py-2.5 rounded-2xl shadow-xl font-mono shadow-brand-500/30">
                        {activeParcel.pickupOtp}
                      </div>

                      <button
                        onClick={handleCopyPin}
                        className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
                        title="Copy PIN"
                      >
                        {copiedOtp ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                      </button>

                      <button
                        onClick={handleListenPin}
                        className="p-2.5 bg-slate-800 hover:bg-slate-700 text-brand-400 rounded-xl border border-slate-700 transition"
                        title="Pronounce PIN out loud (Hindi/English)"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-xs space-y-1.5">
                    <div className="text-slate-300">Item: <strong className="text-white">{activeParcel.packageItem}</strong></div>
                    <div className="text-slate-400">Order ID: <span className="font-mono text-slate-200">{activeParcel.orderId}</span></div>
                    <div className="text-slate-400">Package: <span className="text-brand-400 font-bold">{activeParcel.packageSize} Box</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Perforated Tear Edge between Pass & Store info */}
            <div className="relative py-2 bg-[#0e1626] flex items-center justify-between">
              <div className="w-6 h-6 -ml-3 rounded-full bg-slate-950 border-r border-slate-700" />
              <div className="flex-1 border-t-2 border-dashed border-slate-700/80 mx-2" />
              <div className="w-6 h-6 -mr-3 rounded-full bg-slate-950 border-l border-slate-700" />
            </div>

            {/* Designated Kirana Hub Footer on Ticket */}
            <div className="p-6 bg-slate-950/80 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={assignedStore.photoUrl}
                    alt={assignedStore.storeName}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shadow"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-extrabold text-sm text-white">
                      <span>{assignedStore.storeName}</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                      <span>{assignedStore.address} (PIN {assignedStore.pincode})</span>
                    </p>
                    <p className="text-[11px] text-emerald-400 font-medium mt-0.5">
                      ⏰ Open Today: {assignedStore.openTime} - {assignedStore.closeTime}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                  ⭐ {assignedStore.rating}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${assignedStore.latitude},${assignedStore.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-400 hover:to-amber-400 text-slate-950 font-black py-2.5 rounded-xl text-xs shadow-lg shadow-brand-500/20 transition"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Google Maps Directions</span>
                </a>

                <a
                  href={`tel:${assignedStore.phone}`}
                  className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl text-xs border border-slate-700 transition"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Store Owner ({assignedStore.ownerName})</span>
                </a>
              </div>
            </div>
          </div>

          {/* "Drop & Buy" Kirana Customer Cross-Sell Perk Card */}
          <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-3xl p-5 shadow-xl flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">
                  {language === 'hi' ? 'किराना ग्राहक ऑफर: ₹15 की छूट' : 'Kirana "Pick & Shop" Special'}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Get <strong className="text-emerald-400">₹15 OFF</strong> on daily milk/snacks when you collect this parcel!
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-500/30 uppercase whitespace-nowrap">
              KIRANA15
            </span>
          </div>
        </div>

        {/* Right: Live Interactive Neighborhood Map & Telemetry (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interactive Neighborhood Vector Map */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400" />
                <span>Hyper-Local Neighborhood Radar</span>
              </h3>
              <span className="text-[11px] text-emerald-400 font-semibold">Live GPS Vector</span>
            </div>
            <InteractiveMap
              stores={stores}
              activeParcel={activeParcel}
              selectedStoreId={assignedStore.id}
            />
          </div>

          {/* 4-Stage Delivery Progress Timeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="font-bold text-sm text-white">Live Parcel Journey Progress</h3>
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
