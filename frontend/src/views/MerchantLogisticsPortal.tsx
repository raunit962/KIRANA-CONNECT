import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { soundEffects } from '../lib/soundEffects';
import confetti from 'canvas-confetti';
import {
  Store,
  Package,
  Bike,
  User,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Wallet,
  ArrowUpRight,
  TrendingUp,
  Search,
  Filter,
  Users,
  Sparkles,
  Zap,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink,
  Check,
  Receipt,
  RotateCcw,
  Navigation,
} from 'lucide-react';
import { Parcel } from '../types';

interface MerchantLogisticsPortalProps {
  onNavigateOperations?: () => void;
  onNavigateProfile?: () => void;
}

export const MerchantLogisticsPortal: React.FC<MerchantLogisticsPortalProps> = ({
  onNavigateOperations,
  onNavigateProfile,
}) => {
  const {
    stores,
    parcels,
    activeStoreId,
    setActiveStoreId,
    deliverParcelAtDoorstep,
    assignKiranaHelper,
    requestUpiWithdrawal,
    language,
    currentUser,
  } = useApp();

  const currentStore = stores.find((s) => s.id === activeStoreId) || stores[0];

  // Parcels that belong to this store
  const storeParcels = useMemo(() => {
    return parcels.filter((p) => p.kiranaStoreId === currentStore.id);
  }, [parcels, currentStore.id]);

  // Tab filter: ALL, PICKUP, DOORSTEP, COMPLETED
  const [activeTabFilter, setActiveTabFilter] = useState<'ALL' | 'PICKUP' | 'DOORSTEP' | 'COMPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [otpModalParcel, setOtpModalParcel] = useState<Parcel | null>(null);
  const [inputOtp, setInputOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState('');

  // Helper management state (Amazon Hub Delivery model)
  const [helperName, setHelperName] = useState(currentStore.helperName || 'Ramesh Kumar (Store Helper)');
  const [helperPhone, setHelperPhone] = useState(currentStore.helperPhone || '+91 98308 12345');
  const [deliveryRadius, setDeliveryRadius] = useState<number>(currentStore.deliveryRadiusKm || 2.5);
  const [isHelperDispatched, setIsHelperDispatched] = useState(false);

  // Filter parcels
  const filteredList = useMemo(() => {
    return storeParcels.filter((p) => {
      const isCompleted = p.status === 'COLLECTED';
      const isDoorstep = p.deliveryPreference === 'STORE_DOORSTEP';
      const isPickup = !isDoorstep;

      if (activeTabFilter === 'COMPLETED' && !isCompleted) return false;
      if (activeTabFilter === 'DOORSTEP' && (isCompleted || !isDoorstep)) return false;
      if (activeTabFilter === 'PICKUP' && (isCompleted || !isPickup)) return false;

      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.trackingNumber.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q) ||
        p.customerPhone.includes(q) ||
        p.packageItem.toLowerCase().includes(q) ||
        p.orderId.toLowerCase().includes(q)
      );
    });
  }, [storeParcels, activeTabFilter, searchQuery]);

  // Counts for tabs
  const activePickupCount = storeParcels.filter((p) => p.status !== 'COLLECTED' && p.deliveryPreference !== 'STORE_DOORSTEP').length;
  const activeDoorstepCount = storeParcels.filter((p) => p.status !== 'COLLECTED' && p.deliveryPreference === 'STORE_DOORSTEP').length;
  const completedCount = storeParcels.filter((p) => p.status === 'COLLECTED').length;

  // Revenue analytics (Amazon Hub Delivery Model)
  const pudoHoldingEarnings = completedCount * 15;
  const doorstepEarnings = storeParcels.filter((p) => p.status === 'COLLECTED' && p.deliveryPreference === 'STORE_DOORSTEP').length * 30;
  const totalEarningsCalculated = currentStore.walletBalance + pudoHoldingEarnings + doorstepEarnings;

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawalAmount);
    if (!amt || amt <= 0 || amt > currentStore.walletBalance) {
      alert('Invalid withdrawal amount');
      return;
    }
    const res = requestUpiWithdrawal(currentStore.id, amt, currentStore.upiId || 'subhashishghosh@okhdfcbank');
    if (res.success) {
      soundEffects.playCashRegister();
      setPayoutSuccessMsg(`₹${amt} transferred to ${currentStore.upiId || 'UPI'}!`);
      setWithdrawalAmount('');
      setIsWithdrawing(false);
      setTimeout(() => setPayoutSuccessMsg(''), 4000);
    }
  };

  const handleConfirmDoorstep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpModalParcel) return;
    const res = deliverParcelAtDoorstep(otpModalParcel.id, inputOtp.trim());
    if (res.success) {
      soundEffects.playCashRegister();
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
      setOtpModalParcel(null);
      setInputOtp('');
      setOtpError('');
    } else {
      setOtpError(res.message);
    }
  };

  const handleDispatchHelperBatch = () => {
    setIsHelperDispatched(true);
    soundEffects.playScanBeep();
    setTimeout(() => {
      alert(`🛵 Helper ${helperName} dispatched with ${activeDoorstepCount || 1} parcel(s) within ${deliveryRadius} km radius!`);
    }, 300);
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
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl text-xs font-bold bg-[#1A5336] text-white shadow-md border border-[#fffd47]/40 flex items-center justify-center space-x-2"
          >
            <Package className="w-4 h-4 text-[#fffd47]" />
            <span className="font-roxborough text-xs font-bold text-[#fffd47]">2. Store Logistics Hub</span>
            <span className="text-[10px] bg-[#fffd47] text-[#0F291E] font-black px-2 py-0.5 rounded-full">
              Amazon MyHub
            </span>
          </button>

          <button
            onClick={onNavigateProfile}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl text-xs font-bold text-[#0F291E] hover:bg-[#EAF3ED] border border-transparent hover:border-[#CDE3D5] transition flex items-center justify-center space-x-2 group"
          >
            <ShieldCheck className="w-4 h-4 text-[#1A5336] group-hover:scale-110 transition" />
            <span className="font-roxborough text-xs font-bold">3. Store Profile &amp; Details</span>
          </button>
        </div>

        {/* Current Store Switcher Pill */}
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

      {/* 2. Top Banner: Amazon Hub Delivery & Revenue Analytics */}
      <div className="bg-gradient-to-r from-[#0F291E] via-[#143d27] to-[#1A5336] border border-[#1A5336] rounded-3xl p-6 shadow-xl text-white space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#fffd47] text-[#0F291E] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Amazon Hub Delivery Partner
              </span>
              <span className="text-xs text-white/70 font-mono">
                Store ID: {currentStore.id.toUpperCase()} • Pincode: {currentStore.pincode}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8F5EF] tracking-tight">
              {currentStore.storeName} — Logistics Command
            </h1>
            <p className="text-xs sm:text-sm text-[#D1E7DD] max-w-2xl leading-relaxed">
              Earn steady revenue with zero capex: <strong>₹15</strong> per customer pickup + <strong>₹30</strong> per doorstep delivery handled by your store helper in a 2-3 km neighborhood radius.
            </p>
          </div>

          {/* Wallet Balance & Instant Payout Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 w-full lg:w-80 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wallet className="w-4 h-4 text-[#fffd47]" />
                <span className="text-xs font-bold text-white/80">Available Wallet</span>
              </div>
              <span className="text-[10px] bg-emerald-400/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full font-mono">
                Daily Payout
              </span>
            </div>

            <div className="text-2xl font-black text-[#fffd47] font-mono">
              ₹{currentStore.walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>

            {payoutSuccessMsg && (
              <div className="text-[11px] text-emerald-300 font-bold animate-fadeIn">
                ✓ {payoutSuccessMsg}
              </div>
            )}

            {isWithdrawing ? (
              <form onSubmit={handleWithdrawalSubmit} className="space-y-2 pt-1">
                <input
                  type="number"
                  placeholder="Enter amount (e.g. 500)"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  max={currentStore.walletBalance}
                  className="w-full bg-white/15 border border-white/30 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/50 focus:outline-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-1.5 bg-[#fffd47] text-[#0F291E] font-black text-xs rounded-xl shadow-xs"
                  >
                    Transfer to UPI
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsWithdrawing(false)}
                    className="px-3 py-1.5 bg-white/10 text-white text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsWithdrawing(true)}
                className="w-full py-2 bg-[#fffd47] hover:bg-[#fffd47]/90 text-[#0F291E] font-black text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-1.5 active:scale-95"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Instant UPI Withdrawal</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Revenue & Operational Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-white/15">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-white/70 block uppercase font-bold">PUDO Holding Earned</span>
            <div className="text-lg font-black text-[#fffd47] font-mono mt-0.5">
              ₹{pudoHoldingEarnings}
            </div>
            <span className="text-[9px] text-emerald-300">₹15/box held for counter</span>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-white/70 block uppercase font-bold">Doorstep Run Earned</span>
            <div className="text-lg font-black text-emerald-300 font-mono mt-0.5">
              ₹{doorstepEarnings}
            </div>
            <span className="text-[9px] text-white/70">₹30/drop by store helper</span>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-white/70 block uppercase font-bold">Total Handled</span>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              {currentStore.totalParcelsHandled + completedCount}
            </div>
            <span className="text-[9px] text-[#fffd47]">⭐ {currentStore.rating} Star Store</span>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-white/70 block uppercase font-bold">Shelf Occupancy</span>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              {currentStore.currentCapacity} / {currentStore.maxCapacity}
            </div>
            <span className="text-[9px] text-emerald-300">
              {currentStore.maxCapacity - currentStore.currentCapacity} slots open
            </span>
          </div>
        </div>
      </div>

      {/* 3. HELPER MANAGEMENT & DISPATCH (AMAZON HUB DELIVERY MODEL) */}
      <section className="bg-white border-2 border-[#CDE3D5] rounded-3xl p-6 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#CDE3D5] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center font-bold shadow-xs">
              <Bike className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-[#0B2317]">
                  Store Helper &amp; Neighborhood Delivery Fleet (2-3 km)
                </h2>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Amazon Hub Delivery
                </span>
              </div>
              <p className="text-xs text-[#4A5B52] mt-0.5">
                Deliver packages in your 2-3 km neighborhood during afternoon or evening grocery lull times using existing staff (no extra vehicles needed).
              </p>
            </div>
          </div>

          <button
            onClick={handleDispatchHelperBatch}
            className="px-4 py-2.5 bg-[#1A5336] hover:bg-[#133F28] text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 self-start md:self-auto active:scale-95"
          >
            <Bike className="w-4 h-4 text-[#fffd47]" />
            <span>Dispatch Helper Batch Run ({activeDoorstepCount} Parcels)</span>
          </button>
        </div>

        {/* Helper Configuration Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="bg-[#F4F8F5] p-3.5 rounded-2xl border border-[#CDE3D5] space-y-1">
            <span className="text-[11px] font-bold text-[#4A5B52] block uppercase">Assigned Store Helper:</span>
            <div className="font-extrabold text-sm text-[#0B2317] flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#1A5336]" />
              <span>{helperName}</span>
            </div>
            <span className="text-[11px] text-[#4A5B52] block font-mono">{helperPhone}</span>
          </div>

          <div className="bg-[#F4F8F5] p-3.5 rounded-2xl border border-[#CDE3D5] space-y-1">
            <span className="text-[11px] font-bold text-[#4A5B52] block uppercase">Delivery Radius (Amazon Model):</span>
            <div className="font-extrabold text-sm text-[#1A5336] flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-[#1A5336]" />
              <span>{deliveryRadius} km Radius Zone</span>
            </div>
            <span className="text-[11px] text-[#4A5B52] block">Salt Lake Sector V IT &amp; Residential</span>
          </div>

          <div className="bg-[#F4F8F5] p-3.5 rounded-2xl border border-[#CDE3D5] space-y-1">
            <span className="text-[11px] font-bold text-[#4A5B52] block uppercase">Preferred Delivery Hours:</span>
            <div className="font-extrabold text-sm text-[#0B2317] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>02:00 PM - 04:00 PM &amp; 08:00 PM</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold block">Off-peak grocery walk batching</span>
          </div>
        </div>
      </section>

      {/* 4. PARCELS LIST: COUNTER PICKUP VS KIRANA DOORSTEP DELIVERIES */}
      <section className="bg-white border-2 border-[#CDE3D5] rounded-3xl p-6 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CDE3D5] pb-4">
          <div>
            <h2 className="text-base font-extrabold text-[#0B2317]">
              Store Parcels: Counter Pickups &amp; Doorstep Deliveries
            </h2>
            <p className="text-xs text-[#4A5B52] mt-0.5">
              Live split of customer walk-ins vs packages to be delivered by your store assistant.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tracking, recipient, phone..."
              className="w-full bg-[#F4F8F5] border border-[#CDE3D5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#0F291E] placeholder-[#4A5B52] focus:outline-none focus:border-[#1A5336]"
            />
            <Search className="w-4 h-4 text-[#4A5B52] absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTabFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTabFilter === 'ALL'
                ? 'bg-[#1A5336] text-white shadow-xs'
                : 'bg-[#F4F8F5] text-[#4A5B52] hover:bg-[#EAF3ED]'
            }`}
          >
            All Active Parcels ({activePickupCount + activeDoorstepCount})
          </button>

          <button
            onClick={() => setActiveTabFilter('PICKUP')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTabFilter === 'PICKUP'
                ? 'bg-[#1A5336] text-white shadow-xs'
                : 'bg-[#F4F8F5] text-[#4A5B52] hover:bg-[#EAF3ED]'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Counter Walk-In ({activePickupCount})</span>
          </button>

          <button
            onClick={() => setActiveTabFilter('DOORSTEP')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTabFilter === 'DOORSTEP'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Kirana Doorstep Delivery ({activeDoorstepCount})</span>
          </button>

          <button
            onClick={() => setActiveTabFilter('COMPLETED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTabFilter === 'COMPLETED'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-[#F4F8F5] text-[#4A5B52] hover:bg-[#EAF3ED]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed Orders ({completedCount})</span>
          </button>
        </div>

        {/* Parcels Table / Cards */}
        <div className="space-y-3">
          {filteredList.map((parcel) => {
            const isDoorstep = parcel.deliveryPreference === 'STORE_DOORSTEP';
            const isCollected = parcel.status === 'COLLECTED';
            const totalFee = 15 + (isDoorstep ? 30 : 0);

            return (
              <div
                key={parcel.id}
                className={`rounded-2xl p-4 border transition duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCollected
                    ? 'bg-stone-50 border-stone-200 opacity-70'
                    : isDoorstep
                    ? 'bg-amber-50/70 border-amber-300 hover:bg-amber-50'
                    : 'bg-[#F4F8F5] border-[#CDE3D5] hover:bg-[#EAF3ED]'
                }`}
              >
                {/* Left: Parcel details */}
                <div className="flex items-start space-x-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-xs shrink-0 ${
                      isDoorstep ? 'bg-amber-200 text-amber-900' : 'bg-white text-[#1A5336] border border-[#CDE3D5]'
                    }`}
                  >
                    {isDoorstep ? '🛵' : '📦'}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-sm text-[#0B2317]">
                        {parcel.packageItem}
                      </span>
                      <span className="font-mono text-[10px] font-bold bg-white text-[#0F291E] px-2 py-0.5 rounded-md border border-[#CDE3D5]">
                        {parcel.trackingNumber}
                      </span>
                      {isDoorstep ? (
                        <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                          🛵 Store Doorstep Delivery
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                          🚶 Counter Pickup
                        </span>
                      )}
                      {isCollected && (
                        <span className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-full">
                          ✓ Handoff Complete
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#4A5B52]">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#1A5336]" />
                        <strong>{parcel.customerName}</strong> ({parcel.customerPhone})
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-500" />
                        <span>{parcel.destinationAddress}</span>
                      </span>
                      {isDoorstep && (
                        <span className="text-amber-800 font-medium">
                          Slot: {parcel.deliverySlot || 'Evening (7 PM - 9 PM)'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Earning & Action */}
                <div className="flex items-center justify-between md:justify-end space-x-4 border-t md:border-t-0 pt-2 md:pt-0 border-[#CDE3D5]">
                  <div className="text-left md:text-right text-xs">
                    <div className="font-black text-[#1A5336] font-mono text-sm">
                      +₹{totalFee} Earned
                    </div>
                    <div className="text-[10px] text-[#4A5B52]">
                      {isDoorstep ? '₹15 hold + ₹30 delivery' : '₹15 PUDO hold fee'}
                    </div>
                  </div>

                  {!isCollected && (
                    <div>
                      {isDoorstep ? (
                        <button
                          onClick={() => {
                            setOtpModalParcel(parcel);
                            setInputOtp('');
                            setOtpError('');
                          }}
                          className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirm Doorstep OTP</span>
                        </button>
                      ) : (
                        <button
                          onClick={onNavigateOperations}
                          className="px-3.5 py-2 bg-[#1A5336] hover:bg-[#133F28] text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center space-x-1"
                        >
                          <span>Counter Release</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredList.length === 0 && (
            <div className="text-center py-8 text-xs text-[#4A5B52]">
              No matching parcels found in this category.
            </div>
          )}
        </div>
      </section>

      {/* 5. AMAZON MYHUB EXTRA OPERATIONAL FEATURES: 72H COMPLIANCE & RTO */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 72H Hold Compliance */}
        <div className="bg-white border-2 border-[#CDE3D5] rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              ⏱️
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#0B2317]">72-Hour Hold Compliance Monitor</h3>
              <p className="text-[11px] text-[#4A5B52]">Ensure timely handoffs before SLA triggers return to warehouse.</p>
            </div>
          </div>
          <div className="bg-[#F4F8F5] p-3 rounded-2xl border border-[#CDE3D5] space-y-2 text-xs">
            <div className="flex justify-between font-medium">
              <span>Parcels &lt; 24h on shelf:</span>
              <strong className="text-emerald-700">12 Packages (100% Safe)</strong>
            </div>
            <div className="flex justify-between font-medium">
              <span>Parcels 24-48h on shelf:</span>
              <strong className="text-amber-700">4 Packages (WhatsApp alert sent)</strong>
            </div>
            <div className="flex justify-between font-medium">
              <span>Parcels &gt; 48h (Urgent Warning):</span>
              <strong className="text-red-700">0 Packages (No Breaches)</strong>
            </div>
          </div>
        </div>

        {/* Reverse Logistics / RTO Hub */}
        <div className="bg-white border-2 border-[#CDE3D5] rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold">
              🔄
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#0B2317]">Reverse PUDO (Returns Consolidation)</h3>
              <p className="text-[11px] text-[#4A5B52]">Staged customer returns to be picked up by Delhivery/Amazon courier.</p>
            </div>
          </div>
          <div className="bg-[#F4F8F5] p-3 rounded-2xl border border-[#CDE3D5] space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Returns currently at counter:</span>
              <strong className="text-[#0B2317]">2 Packages</strong>
            </div>
            <div className="flex justify-between">
              <span>Courier van arrival:</span>
              <strong className="text-[#1A5336]">Today at 05:30 PM (Shadowfax)</strong>
            </div>
            <div className="flex justify-between">
              <span>Return compensation:</span>
              <strong className="text-emerald-700 font-bold">+₹15 / reverse drop</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Doorstep Delivery OTP Verification Modal */}
      {otpModalParcel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#CDE3D5] space-y-4">
            <div className="flex items-center justify-between border-b border-[#CDE3D5] pb-3">
              <div className="flex items-center space-x-2">
                <Bike className="w-5 h-5 text-amber-700" />
                <span className="font-extrabold text-sm text-[#0F291E]">Confirm Doorstep Delivery Handoff</span>
              </div>
              <button
                onClick={() => setOtpModalParcel(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#F4F8F5] p-3.5 rounded-2xl border border-[#CDE3D5] text-xs space-y-1">
              <div>Item: <strong className="text-[#0B2317]">{otpModalParcel.packageItem}</strong></div>
              <div>Customer: <strong className="text-[#0B2317]">{otpModalParcel.customerName}</strong></div>
              <div>Address: <span className="text-[#4A5B52]">{otpModalParcel.destinationAddress}</span></div>
              <div className="text-amber-800 font-bold pt-1">
                Earning: ₹45 (₹15 holding fee + ₹30 doorstep delivery)
              </div>
            </div>

            <form onSubmit={handleConfirmDoorstep} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#0F291E] mb-1">
                  Enter Customer 4-Digit PIN:
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={inputOtp}
                  onChange={(e) => setInputOtp(e.target.value)}
                  placeholder="e.g. 4892"
                  className="w-full bg-[#F4F8F5] border border-[#CDE3D5] rounded-xl px-4 py-2.5 font-mono font-bold text-center text-lg tracking-widest text-[#0F291E] focus:outline-none focus:border-[#1A5336]"
                  autoFocus
                />
                <span className="text-[10px] text-[#4A5B52] block mt-1">
                  Collection PIN for this package: <strong>{otpModalParcel.pickupOtp}</strong>
                </span>
              </div>

              {otpError && (
                <div className="text-xs text-red-600 font-bold">
                  {otpError}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1A5336] hover:bg-[#133F28] text-white font-bold text-xs rounded-xl shadow-sm transition"
                >
                  Confirm &amp; Credit ₹45
                </button>
                <button
                  type="button"
                  onClick={() => setOtpModalParcel(null)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
