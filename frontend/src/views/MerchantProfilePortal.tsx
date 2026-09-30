import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { soundEffects } from '../lib/soundEffects';
import {
  Store,
  Package,
  ShieldCheck,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  QrCode,
  Calendar,
  CheckCircle2,
  Camera,
  Flame,
  Award,
  IndianRupee,
  Navigation,
  ExternalLink,
  Edit3,
  Save,
  Check,
  Building,
  Bike,
  Sparkles,
  Lock,
} from 'lucide-react';

interface MerchantProfilePortalProps {
  onNavigateOperations?: () => void;
  onNavigateLogistics?: () => void;
}

export const MerchantProfilePortal: React.FC<MerchantProfilePortalProps> = ({
  onNavigateOperations,
  onNavigateLogistics,
}) => {
  const { stores, activeStoreId, setActiveStoreId, language } = useApp();
  const currentStore = stores.find((s) => s.id === activeStoreId) || stores[0];

  const [isEditing, setIsEditing] = useState(false);
  const [storeName, setStoreName] = useState(currentStore.storeName);
  const [ownerName, setOwnerName] = useState(currentStore.ownerName);
  const [phone, setPhone] = useState(currentStore.phone);
  const [address, setAddress] = useState(currentStore.address);
  const [openTime, setOpenTime] = useState(currentStore.openTime);
  const [closeTime, setCloseTime] = useState(currentStore.closeTime);
  const [upiId, setUpiId] = useState(currentStore.upiId || 'subhashishghosh@okhdfcbank');
  const [deliveryRadius, setDeliveryRadius] = useState(currentStore.deliveryRadiusKm || 2.5);
  const [helperName, setHelperName] = useState(currentStore.helperName || 'Ramesh Kumar (Store Helper)');
  const [helperPhone, setHelperPhone] = useState(currentStore.helperPhone || '+91 98308 12345');
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSavedFeedback(true);
    soundEffects.playCashRegister();
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Top 3-Portal Switcher Tabs for Kirana Merchant */}
      <div className="bg-white border-2 border-[#CDE3D5] rounded-3xl p-3 shadow-md flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={onNavigateOperations}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl text-xs font-bold text-[#0F291E] hover:bg-[#EAF3ED] border border-transparent hover:border-[#CDE3D5] transition flex items-center justify-center space-x-2 group"
          >
            <Store className="w-4 h-4 text-[#1A5336] group-hover:scale-110 transition" />
            <span className="font-roxborough text-xs font-bold">1. Counter &amp; Shelf OS</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded-full font-bold">
              Scanner &amp; Rack
            </span>
          </button>

          <button
            onClick={onNavigateLogistics}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl text-xs font-bold text-[#0F291E] hover:bg-[#EAF3ED] border border-transparent hover:border-[#CDE3D5] transition flex items-center justify-center space-x-2 group"
          >
            <Package className="w-4 h-4 text-[#1A5336] group-hover:scale-110 transition" />
            <span className="font-roxborough text-xs font-bold">2. Store Logistics Hub</span>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-mono px-2 py-0.5 rounded-full font-bold">
              Amazon MyHub
            </span>
          </button>

          <button
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl text-xs font-bold bg-[#1A5336] text-white shadow-md border border-[#fffd47]/40 flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#fffd47]" />
            <span className="font-roxborough text-xs font-bold text-[#fffd47]">3. Store Profile &amp; Details</span>
          </button>
        </div>

        {/* Current Store Switcher */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <select
            value={currentStore.id}
            onChange={(e) => setActiveStoreId(e.target.value)}
            className="bg-[#F4F8F5] border border-[#CDE3D5] text-[#0F291E] font-bold text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#1A5336]"
          >
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                🏪 {s.storeName.split(' ')[0]} ({s.pincode})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Store Header Banner with Photo & Badges */}
      <div className="bg-gradient-to-r from-[#0F291E] via-[#143d27] to-[#1A5336] border border-[#1A5336] rounded-3xl p-6 shadow-xl text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center space-x-4">
            <img
              src={currentStore.photoUrl}
              alt={currentStore.storeName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-[#fffd47] shadow-lg shrink-0"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#fffd47] text-[#0F291E] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Verified Kirana Partner
                </span>
                <span className="text-xs text-emerald-300 font-mono">
                  ID: KC-HUB-{currentStore.pincode}-{currentStore.id.slice(-2)}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#F8F5EF] tracking-tight">
                {currentStore.storeName}
              </h1>
              <p className="text-xs text-[#D1E7DD] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#fffd47] shrink-0" />
                <span>{currentStore.address} (PIN {currentStore.pincode})</span>
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs pt-1 text-white/80">
                <span>Owner: <strong>{currentStore.ownerName}</strong></span>
                <span>•</span>
                <span>Phone: <strong>{currentStore.phone}</strong></span>
                <span>•</span>
                <span className="text-[#fffd47] font-bold">⭐ {currentStore.rating} (215 Reviews)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 self-start md:self-auto">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="px-4 py-2.5 bg-[#fffd47] hover:bg-[#fffd47]/90 text-[#0F291E] font-black text-xs rounded-xl shadow-md flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5 transition"
              >
                <Edit3 className="w-4 h-4 text-[#fffd47]" />
                <span>Edit Store Details</span>
              </button>
            )}
          </div>
        </div>

        {savedFeedback && (
          <div className="mt-4 bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs font-bold p-3 rounded-2xl animate-fadeIn flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Store profile details updated successfully!</span>
          </div>
        )}
      </div>

      {/* 3. Detailed Specifications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Store Information & Operational Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information Card */}
          <div className="bg-white border-2 border-[#CDE3D5] rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center space-x-2 border-b border-[#CDE3D5] pb-3">
              <Building className="w-5 h-5 text-[#1A5336]" />
              <h2 className="text-base font-extrabold text-[#0B2317]">General Store Profile</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#4A5B52] font-semibold mb-1">Store Name:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full bg-[#F4F8F5] border border-[#CDE3D5] rounded-xl px-3 py-2 font-bold text-[#0B2317]"
                  />
                ) : (
                  <div className="p-2.5 bg-[#F4F8F5] rounded-xl font-bold text-[#0B2317] border border-[#CDE3D5]">
                    {storeName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#4A5B52] font-semibold mb-1">Owner / Manager Name:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-[#F4F8F5] border border-[#CDE3D5] rounded-xl px-3 py-2 font-bold text-[#0B2317]"
                  />
                ) : (
                  <div className="p-2.5 bg-[#F4F8F5] rounded-xl font-bold text-[#0B2317] border border-[#CDE3D5]">
                    {ownerName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#4A5B52] font-semibold mb-1">Contact Phone:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F4F8F5] border border-[#CDE3D5] rounded-xl px-3 py-2 font-bold text-[#0B2317]"
                  />
                ) : (
                  <div className="p-2.5 bg-[#F4F8F5] rounded-xl font-bold text-[#0B2317] border border-[#CDE3D5]">
                    {phone}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#4A5B52] font-semibold mb-1">UPI ID for Automated Settlement:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-[#F4F8F5] border border-[#CDE3D5] rounded-xl px-3 py-2 font-bold font-mono text-[#0B2317]"
                  />
                ) : (
                  <div className="p-2.5 bg-[#F4F8F5] rounded-xl font-bold font-mono text-[#1A5336] border border-[#CDE3D5]">
                    {upiId}
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#4A5B52] font-semibold mb-1">Store Address:</label>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#F4F8F5] border border-[#CDE3D5] rounded-xl px-3 py-2 font-bold text-[#0B2317]"
                  />
                ) : (
                  <div className="p-2.5 bg-[#F4F8F5] rounded-xl font-bold text-[#0B2317] border border-[#CDE3D5]">
                    {address}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Operational Hours & Amazon Hub Delivery Settings */}
          <div className="bg-white border-2 border-[#CDE3D5] rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center space-x-2 border-b border-[#CDE3D5] pb-3">
              <Bike className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-extrabold text-[#0B2317]">
                Amazon Hub Delivery &amp; Helper Fleet Parameters
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#4A5B52] font-semibold mb-1">Store Opening Time:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                    className="w-full bg-[#F4F8F5] border border-[#CDE3D5] rounded-xl px-3 py-2 font-bold text-[#0B2317]"
                  />
                ) : (
                  <div className="p-2.5 bg-[#F4F8F5] rounded-xl font-bold text-[#0B2317] border border-[#CDE3D5]">
                    {openTime}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#4A5B52] font-semibold mb-1">Store Closing Time:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                    className="w-full bg-[#F4F8F5] border border-[#CDE3D5] rounded-xl px-3 py-2 font-bold text-[#0B2317]"
                  />
                ) : (
                  <div className="p-2.5 bg-[#F4F8F5] rounded-xl font-bold text-[#0B2317] border border-[#CDE3D5]">
                    {closeTime}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#4A5B52] font-semibold mb-1">Store Helper Name (Delivery Boy):</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={helperName}
                    onChange={(e) => setHelperName(e.target.value)}
                    className="w-full bg-[#F4F8F5] border border-[#CDE3D5] rounded-xl px-3 py-2 font-bold text-[#0B2317]"
                  />
                ) : (
                  <div className="p-2.5 bg-[#F4F8F5] rounded-xl font-bold text-[#0B2317] border border-[#CDE3D5]">
                    {helperName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#4A5B52] font-semibold mb-1">Helper Contact Phone:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={helperPhone}
                    onChange={(e) => setHelperPhone(e.target.value)}
                    className="w-full bg-[#F4F8F5] border border-[#CDE3D5] rounded-xl px-3 py-2 font-bold text-[#0B2317]"
                  />
                ) : (
                  <div className="p-2.5 bg-[#F4F8F5] rounded-xl font-bold text-[#0B2317] border border-[#CDE3D5]">
                    {helperPhone}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#4A5B52] font-semibold mb-1">Delivery Radius (km):</label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.5"
                    value={deliveryRadius}
                    onChange={(e) => setDeliveryRadius(parseFloat(e.target.value))}
                    className="w-full bg-[#F4F8F5] border border-[#CDE3D5] rounded-xl px-3 py-2 font-bold text-[#0B2317]"
                  />
                ) : (
                  <div className="p-2.5 bg-[#F4F8F5] rounded-xl font-bold text-[#0B2317] border border-[#CDE3D5]">
                    {deliveryRadius} km Neighborhood Zone
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#4A5B52] font-semibold mb-1">Hub Commission Rate:</label>
                <div className="p-2.5 bg-emerald-50 rounded-xl font-bold text-[#1A5336] border border-emerald-300">
                  ₹15 (Holding) + ₹30 (Doorstep Run)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Security, Verification & Counter Standee QR */}
        <div className="space-y-6">
          {/* Physical Security & Storage Specs */}
          <div className="bg-white border-2 border-[#CDE3D5] rounded-3xl p-6 shadow-md space-y-4 text-xs">
            <div className="flex items-center space-x-2 border-b border-[#CDE3D5] pb-3">
              <ShieldCheck className="w-5 h-5 text-[#1A5336]" />
              <h3 className="text-sm font-extrabold text-[#0B2317]">Storage &amp; Security Specs</h3>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 bg-[#F4F8F5] rounded-xl border border-[#CDE3D5]">
                <span className="text-[#4A5B52]">Max Shelf Capacity:</span>
                <strong className="text-[#0B2317]">{currentStore.maxCapacity} Parcels</strong>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#F4F8F5] rounded-xl border border-[#CDE3D5]">
                <span className="text-[#4A5B52]">Rack Layout:</span>
                <strong className="text-[#0B2317]">3 Tiers (A, B, C) × 10 Slots</strong>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#F4F8F5] rounded-xl border border-[#CDE3D5]">
                <span className="text-[#4A5B52]">CCTV Camera:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>24x7 HD Monitored</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#F4F8F5] rounded-xl border border-[#CDE3D5]">
                <span className="text-[#4A5B52]">Weatherproofing:</span>
                <strong className="text-emerald-700 font-bold">100% Dry Storage</strong>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#F4F8F5] rounded-xl border border-[#CDE3D5]">
                <span className="text-[#4A5B52]">Fire Extinguisher:</span>
                <strong className="text-emerald-700 font-bold">ABC Certified</strong>
              </div>
            </div>
          </div>

          {/* Official Counter QR Standee Card */}
          <div className="bg-gradient-to-b from-[#F4F8F5] to-emerald-50 border-2 border-[#1A5336]/40 rounded-3xl p-6 shadow-md text-center space-y-3">
            <div className="flex items-center justify-center space-x-1.5 text-xs font-extrabold text-[#1A5336]">
              <QrCode className="w-4 h-4 text-[#1A5336]" />
              <span>Counter Standee QR Code</span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#CDE3D5] inline-block">
              <img
                src="/logo-transparent.png"
                alt="Store QR Standee"
                className="w-24 h-24 object-contain mx-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="font-mono text-[10px] font-bold text-[#0B2317] mt-1">
                SCAN TO CONFIRM PICKUP
              </div>
            </div>

            <p className="text-[11px] text-[#4A5B52]">
              Place this official KiranaConnect QR standee at your payment counter for 1-second customer scan verification.
            </p>

            <button
              onClick={() => alert(`Standee QR Code generated for ${currentStore.storeName}!`)}
              className="w-full py-2 bg-[#1A5336] hover:bg-[#133F28] text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              Download Standee PDF (A4)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
