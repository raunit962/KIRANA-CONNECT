import React from 'react';
import { Parcel, KiranaStore } from '../types';
import { X, CheckCheck, MessageSquare, ExternalLink, MapPin, KeyRound, ShieldCheck } from 'lucide-react';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcel: Parcel;
  store: KiranaStore;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  parcel,
  store,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0b141a] text-slate-100 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-emerald-500/30">
        {/* WhatsApp Header */}
        <div className="bg-[#1f2c34] px-4 py-3 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold shadow">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-sm text-slate-100">
                <span>KiranaConnect India</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">Verified Official Business</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Body (WhatsApp Green Bubble) */}
        <div className="p-4 bg-[#0b141a] bg-opacity-95 space-y-3 max-h-[75vh] overflow-y-auto">
          <div className="text-center">
            <span className="bg-[#182229] text-slate-400 text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
              Today • Real-time Delivery Alert
            </span>
          </div>

          <div className="bg-[#005c4b] text-white p-3.5 rounded-2xl rounded-tl-sm shadow-md space-y-2 text-xs leading-relaxed max-w-[95%]">
            <p className="font-bold text-sm text-amber-200">
              Namaste {parcel.customerName}! 🙏
            </p>
            <p>
              Your order <span className="font-mono font-bold bg-emerald-900/60 px-1 py-0.5 rounded">{parcel.orderId}</span> ({parcel.packageItem}) has safely arrived at your neighborhood Kirana pickup hub!
            </p>

            <div className="bg-emerald-950/70 p-2.5 rounded-xl border border-emerald-400/30 space-y-1.5 my-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-emerald-200 uppercase font-semibold">Pickup Hub:</span>
                <span className="text-[11px] font-bold text-amber-300">⭐ {store.rating}</span>
              </div>
              <div className="font-bold text-white text-xs">{store.storeName}</div>
              <div className="text-[11px] text-slate-300 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-400 mt-0.5" />
                <span>{store.address} (PIN {store.pincode})</span>
              </div>
              <div className="text-[11px] text-emerald-300 font-medium pt-1">
                ⏰ Open: {store.openTime} - {store.closeTime}
              </div>
            </div>

            <div className="bg-amber-400 text-slate-950 p-2.5 rounded-xl font-bold flex items-center justify-between shadow">
              <div className="flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-slate-900" />
                <span>Pickup OTP:</span>
              </div>
              <span className="text-base tracking-widest font-black font-mono">{parcel.pickupOtp}</span>
            </div>

            <p className="text-[11px] text-emerald-100">
              Show this OTP or your secure QR pass to the store counter to receive your parcel. No doorstep waiting required!
            </p>

            <div className="flex justify-end items-center space-x-1 text-[10px] text-emerald-200/80 pt-1">
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <CheckCheck className="w-3.5 h-3.5 text-sky-300" />
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-[#1f2c34] p-3 text-center text-xs text-slate-400 border-t border-slate-800">
          Simulated WhatsApp Business API notification webhook payload
        </div>
      </div>
    </div>
  );
};
