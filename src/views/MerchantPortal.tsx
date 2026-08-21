import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CapacityGauge } from '../components/CapacityGauge';
import { QRScannerModal } from '../components/QRScannerModal';
import { ShelfRackVisualizer } from '../components/ShelfRackVisualizer';
import { UPISoundbox } from '../components/UPISoundbox';
import { soundEffects } from '../lib/soundEffects';
import {
  Store,
  QrCode,
  Wallet,
  ArrowUpRight,
  Package,
  Search,
  CheckCircle2,
  Clock,
  User,
  Phone,
  ShieldCheck,
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  Sparkles,
  Users,
} from 'lucide-react';
import { Parcel } from '../types';

export const MerchantPortal: React.FC = () => {
  const {
    stores,
    parcels,
    payoutLogs,
    activeStoreId,
    setActiveStoreId,
    verifyAndReleaseParcel,
    requestUpiWithdrawal,
    language,
  } = useApp();

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [upiId, setUpiId] = useState('rameshgupta@okhdfcbank');
  const [payoutFeedback, setPayoutFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [selectedShelfParcel, setSelectedShelfParcel] = useState<Parcel | null>(null);

  const currentStore = stores.find((s) => s.id === activeStoreId) || stores[0];

  // Parcels currently resting on this store's shelf awaiting collection
  const parcelsOnShelf = parcels.filter(
    (p) => p.kiranaStoreId === currentStore.id && p.status === 'DROPPED_AT_KIRANA'
  );

  // Filtered parcels by search term
  const filteredParcels = parcelsOnShelf.filter(
    (p) =>
      p.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerPhone.includes(searchTerm) ||
      p.pickupOtp.includes(searchTerm)
  );

  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawalAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setPayoutFeedback({ success: false, message: 'Please enter a valid payout amount.' });
      return;
    }

    soundEffects.playCashRegister();
    const res = requestUpiWithdrawal(currentStore.id, amountNum, upiId);
    setPayoutFeedback(res);

    if (res.success) {
      setWithdrawalAmount('');
      setTimeout(() => setPayoutFeedback(null), 4000);
    }
  };

  const handleVerifyHandoff = (parcelId: string, inputCode: string) => {
    const res = verifyAndReleaseParcel(parcelId, inputCode);
    if (res.success) {
      soundEffects.playCashRegister();
      setTimeout(() => {
        soundEffects.speakUpiAlert(currentStore.commissionRate, currentStore.storeName, language);
      }, 500);
    }
    return res;
  };

  const storePayouts = payoutLogs.filter((p) => p.kiranaStoreId === currentStore.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Store Selector & Status Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={currentStore.photoUrl}
            alt={currentStore.storeName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-lg"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black text-white">{currentStore.storeName}</h2>
              {currentStore.isVerified && (
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'सत्यापित किराना हब' : 'Official PUDO Hub'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Owner: <strong className="text-slate-200">{currentStore.ownerName}</strong> | PIN: {currentStore.pincode} ({currentStore.city})
            </p>
          </div>
        </div>

        {/* Store Switcher */}
        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
            {language === 'hi' ? 'दुकान चुनें:' : 'Active Dukan:'}
          </span>
          <select
            value={currentStore.id}
            onChange={(e) => setActiveStoreId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none focus:border-emerald-500"
          >
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.storeName} ({s.city}) — {s.currentCapacity}/{s.maxCapacity} Pkgs
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Shelf Capacity Gauge */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col justify-between">
          <CapacityGauge
            current={currentStore.currentCapacity}
            max={currentStore.maxCapacity}
            label={language === 'hi' ? 'शेल्फ क्षमता' : 'Shelf Storage Capacity'}
          />
        </div>

        {/* Commission Wallet */}
        <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              {language === 'hi' ? 'कमीशन वॉलेट' : 'Merchant Wallet'}
            </span>
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
              ₹{currentStore.commissionRate} / parcel
            </span>
          </div>

          <div className="my-2">
            <div className="text-3xl font-black text-white">
              ₹{currentStore.walletBalance.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-emerald-400 font-medium">
              • {currentStore.totalParcelsHandled} parcels completed
            </p>
          </div>

          <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
            <span>Instant UPI settlement</span>
            <span className="text-emerald-400 font-bold">0% Fee</span>
          </div>
        </div>

        {/* Extra Footfall & Grocery Cross-Sell Analytics */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Store Footfall Gain</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>

          <div className="my-2">
            <div className="text-2xl font-black text-sky-400">+142 Walk-ins</div>
            <p className="text-[11px] text-slate-400">
              Generated <strong className="text-emerald-400">+₹4,250</strong> in extra grocery sales
            </p>
          </div>

          <div className="text-[10px] text-sky-400 font-medium pt-1 border-t border-slate-800">
            High-converting local footfall
          </div>
        </div>

        {/* Big Release Action Button */}
        <div className="bg-gradient-to-br from-brand-950/40 via-slate-900 to-slate-900 border border-brand-500/30 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-300">Handoff Station</span>
            <h3 className="text-base font-black text-white mt-1">
              {language === 'hi' ? 'पार्सल रिलीज करें' : 'Release Package'}
            </h3>
          </div>

          <button
            onClick={() => setIsScannerOpen(true)}
            className="w-full mt-3 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center justify-center space-x-2 transition"
          >
            <QrCode className="w-4 h-4" />
            <span>{language === 'hi' ? 'QR / OTP स्कैन' : 'Scan QR & Verify OTP'}</span>
          </button>
        </div>
      </div>

      {/* 2D Shelf Rack Visualizer Matrix */}
      <ShelfRackVisualizer
        maxSlots={currentStore.maxCapacity}
        parcelsOnShelf={parcelsOnShelf}
        selectedParcelId={selectedShelfParcel?.id}
        onSelectSlot={(p) => {
          setSelectedShelfParcel(p);
          setIsScannerOpen(true);
        }}
      />

      {/* Main Content Split: Left = Active Shelf Inventory, Right = Soundbox & UPI Settlement */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Shelf Inventory Table (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <span>
                  {language === 'hi' ? 'दुकान शेल्फ पर उपलब्ध पार्सल' : 'Parcels On Store Shelf'} ({parcelsOnShelf.length})
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Verify customer OTP / QR pass to hand over package
              </p>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search phone, OTP, item..."
                className="bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Shelf Table */}
          {filteredParcels.length === 0 ? (
            <div className="p-10 text-center bg-slate-800/40 rounded-2xl border border-dashed border-slate-700 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-sm font-bold text-white">No parcels waiting on shelf</p>
              <p className="text-xs text-slate-400">
                All packages have been successfully collected!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                    <th className="pb-3 px-2">Tracking / Item</th>
                    <th className="pb-3 px-2">Customer</th>
                    <th className="pb-3 px-2">Arrived At</th>
                    <th className="pb-3 px-2 text-center">Pickup OTP</th>
                    <th className="pb-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredParcels.map((parcel) => (
                    <tr key={parcel.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-2">
                        <div className="font-mono font-bold text-white">{parcel.trackingNumber}</div>
                        <div className="text-slate-400 font-medium truncate max-w-[190px]">
                          {parcel.packageItem}
                        </div>
                      </td>

                      <td className="py-3.5 px-2">
                        <div className="font-semibold text-slate-200">{parcel.customerName}</div>
                        <div className="text-slate-400">{parcel.customerPhone}</div>
                      </td>

                      <td className="py-3.5 px-2">
                        <span className="flex items-center gap-1 text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-brand-400" />
                          {parcel.droppedAt ? new Date(parcel.droppedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-medium">Safe in 72h window</span>
                      </td>

                      <td className="py-3.5 px-2 text-center">
                        <span className="font-mono font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg text-xs tracking-wider">
                          {parcel.pickupOtp}
                        </span>
                      </td>

                      <td className="py-3.5 px-2 text-right">
                        <button
                          onClick={() => {
                            setSelectedShelfParcel(parcel);
                            setIsScannerOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow transition"
                        >
                          Verify & Handover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: UPI Soundbox Replica & Withdrawal Form (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Authentic UPI Soundbox Widget */}
          <UPISoundbox
            storeName={currentStore.storeName}
            lastAmount={currentStore.commissionRate}
          />

          {/* Instant UPI Withdrawal Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <IndianRupee className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Instant UPI Bank Transfer</h3>
            </div>

            <form onSubmit={handleWithdrawal} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  UPI ID (VPA):
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. yourname@okhdfcbank"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1 flex items-center justify-between">
                  <span>Withdraw Amount:</span>
                  <span className="text-emerald-400 font-bold">Available: ₹{currentStore.walletBalance}</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    placeholder="500"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-white font-bold text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {payoutFeedback && (
                <div
                  className={`p-3 rounded-xl flex items-start space-x-2 text-xs font-semibold ${
                    payoutFeedback.success
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                      : 'bg-red-950/80 text-red-300 border border-red-500/40'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{payoutFeedback.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={currentStore.walletBalance <= 0}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition"
              >
                Transfer to Bank Account (Instant)
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* QR & OTP Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => {
          setIsScannerOpen(false);
          setSelectedShelfParcel(null);
        }}
        parcelsAtStore={parcelsOnShelf}
        onVerify={handleVerifyHandoff}
      />
    </div>
  );
};
