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
      <div className="bg-[#EFE8DC] border border-[#D8C3A5] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={currentStore.photoUrl}
            alt={currentStore.storeName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#D8C3A5] shadow-sm"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black text-[#171717]">{currentStore.storeName}</h2>
              {currentStore.isVerified && (
                <span className="bg-[#D8C3A5]/40 text-[#171717] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#D8C3A5] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B85C38]" />
                  {language === 'hi' ? 'सत्यापित किराना हब' : 'Official PUDO Hub'}
                </span>
              )}
            </div>
            <p className="text-xs text-[#786F67] mt-0.5">
              Owner: <strong className="text-[#171717]">{currentStore.ownerName}</strong> | PIN: {currentStore.pincode} ({currentStore.city})
            </p>
          </div>
        </div>

        {/* Store Switcher */}
        <div className="flex items-center space-x-3">
          <span className="text-xs text-[#786F67] font-medium whitespace-nowrap">
            {language === 'hi' ? 'दुकान चुनें:' : 'Active Dukan:'}
          </span>
          <select
            value={currentStore.id}
            onChange={(e) => setActiveStoreId(e.target.value)}
            className="bg-[#F8F5EF] border border-[#D8C3A5] text-[#171717] rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none focus:border-[#B85C38]"
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
        <div className="bg-[#EFE8DC] border border-[#D8C3A5] rounded-3xl p-4 shadow-sm flex flex-col justify-between">
          <CapacityGauge
            current={currentStore.currentCapacity}
            max={currentStore.maxCapacity}
            label={language === 'hi' ? 'शेल्फ क्षमता' : 'Shelf Storage Capacity'}
          />
        </div>

        {/* Commission Wallet */}
        <div className="bg-[#EFE8DC] border border-[#D8C3A5] rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#786F67]">
              {language === 'hi' ? 'कमीशन वॉलेट' : 'Merchant Wallet'}
            </span>
            <span className="text-[10px] font-bold bg-[#B85C38] text-white px-2 py-0.5 rounded-full shadow-xs">
              ₹{currentStore.commissionRate} / parcel
            </span>
          </div>

          <div className="my-2">
            <div className="text-3xl font-black text-[#171717]">
              ₹{currentStore.walletBalance.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[#B85C38] font-medium">
              • {currentStore.totalParcelsHandled} parcels completed
            </p>
          </div>

          <div className="text-[10px] text-[#786F67] flex items-center justify-between pt-1 border-t border-[#D8C3A5]">
            <span>Instant UPI settlement</span>
            <span className="text-[#B85C38] font-bold">0% Fee</span>
          </div>
        </div>

        {/* Extra Footfall & Grocery Cross-Sell Analytics */}
        <div className="bg-[#EFE8DC] border border-[#D8C3A5] rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#786F67]">Store Footfall Gain</span>
            <Users className="w-4 h-4 text-[#B85C38]" />
          </div>

          <div className="my-2">
            <div className="text-2xl font-black text-[#171717]">+142 Walk-ins</div>
            <p className="text-[11px] text-[#786F67]">
              Generated <strong className="text-[#B85C38]">+₹4,250</strong> in extra grocery sales
            </p>
          </div>

          <div className="text-[10px] text-[#B85C38] font-medium pt-1 border-t border-[#D8C3A5]">
            High-converting local footfall
          </div>
        </div>

        {/* Big Release Action Button */}
        <div className="bg-[#EFE8DC] border border-[#D8C3A5] rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-[#786F67]">Handoff Station</span>
            <h3 className="text-base font-black text-[#171717] mt-1">
              {language === 'hi' ? 'पार्सल रिलीज करें' : 'Release Package'}
            </h3>
          </div>

          <button
            onClick={() => setIsScannerOpen(true)}
            className="w-full mt-3 py-3 bg-[#B85C38] hover:bg-[#A94D2F] text-white font-extrabold text-xs rounded-2xl shadow-sm flex items-center justify-center space-x-2 transition"
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
        <div className="lg:col-span-8 bg-[#EFE8DC] border border-[#D8C3A5] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#D8C3A5] pb-4">
            <div>
              <h3 className="text-base font-bold text-[#171717] flex items-center gap-2">
                <Package className="w-5 h-5 text-[#B85C38]" />
                <span>
                  {language === 'hi' ? 'दुकान शेल्फ पर उपलब्ध पार्सल' : 'Parcels On Store Shelf'} ({parcelsOnShelf.length})
                </span>
              </h3>
              <p className="text-xs text-[#786F67]">
                Verify customer OTP / QR pass to hand over package
              </p>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#786F67] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search phone, OTP, item..."
                className="bg-[#F8F5EF] border border-[#D8C3A5] rounded-xl pl-9 pr-4 py-2 text-xs text-[#171717] placeholder-[#786F67] focus:outline-none focus:border-[#B85C38]"
              />
            </div>
          </div>

          {/* Shelf Table */}
          {filteredParcels.length === 0 ? (
            <div className="p-10 text-center bg-[#F8F5EF] rounded-2xl border border-dashed border-[#D8C3A5] space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#B85C38] mx-auto" />
              <p className="text-sm font-bold text-[#171717]">No parcels waiting on shelf</p>
              <p className="text-xs text-[#786F67]">
                All packages have been successfully collected!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#D8C3A5] text-[#786F67] uppercase text-[10px] font-bold">
                    <th className="pb-3 px-2">Tracking / Item</th>
                    <th className="pb-3 px-2">Customer</th>
                    <th className="pb-3 px-2">Arrived At</th>
                    <th className="pb-3 px-2 text-center">Pickup OTP</th>
                    <th className="pb-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8C3A5]/50">
                  {filteredParcels.map((parcel) => (
                    <tr key={parcel.id} className="hover:bg-[#F8F5EF] transition">
                      <td className="py-3.5 px-2">
                        <div className="font-mono font-bold text-[#171717]">{parcel.trackingNumber}</div>
                        <div className="text-[#786F67] font-medium truncate max-w-[190px]">
                          {parcel.packageItem}
                        </div>
                      </td>

                      <td className="py-3.5 px-2">
                        <div className="font-semibold text-[#171717]">{parcel.customerName}</div>
                        <div className="text-[#786F67]">{parcel.customerPhone}</div>
                      </td>

                      <td className="py-3.5 px-2">
                        <span className="flex items-center gap-1 text-[#786F67]">
                          <Clock className="w-3.5 h-3.5 text-[#B85C38]" />
                          {parcel.droppedAt ? new Date(parcel.droppedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}
                        </span>
                        <span className="text-[10px] text-[#B85C38] font-medium">Safe in 72h window</span>
                      </td>

                      <td className="py-3.5 px-2 text-center">
                        <span className="font-mono font-black bg-[#D8C3A5]/40 text-[#171717] border border-[#D8C3A5] px-2.5 py-1 rounded-lg text-xs tracking-wider">
                          {parcel.pickupOtp}
                        </span>
                      </td>

                      <td className="py-3.5 px-2 text-right">
                        <button
                          onClick={() => {
                            setSelectedShelfParcel(parcel);
                            setIsScannerOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-[#B85C38] hover:bg-[#A94D2F] text-white font-bold text-xs shadow-xs transition"
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
          <div className="bg-[#EFE8DC] border border-[#D8C3A5] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-[#D8C3A5] pb-3">
              <IndianRupee className="w-4 h-4 text-[#B85C38]" />
              <h3 className="text-sm font-bold text-[#171717]">Instant UPI Bank Transfer</h3>
            </div>

            <form onSubmit={handleWithdrawal} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#786F67] font-semibold mb-1">
                  UPI ID (VPA):
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-[#F8F5EF] border border-[#D8C3A5] rounded-xl px-3 py-2 text-[#171717] font-mono text-xs focus:outline-none focus:border-[#B85C38]"
                  placeholder="e.g. yourname@okhdfcbank"
                />
              </div>

              <div>
                <label className="block text-[#786F67] font-semibold mb-1 flex items-center justify-between">
                  <span>Withdraw Amount:</span>
                  <span className="text-[#B85C38] font-bold">Available: ₹{currentStore.walletBalance}</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-[#786F67] font-bold">₹</span>
                  <input
                    type="number"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    placeholder="500"
                    className="w-full bg-[#F8F5EF] border border-[#D8C3A5] rounded-xl pl-7 pr-3 py-2 text-[#171717] font-bold text-xs focus:outline-none focus:border-[#B85C38]"
                  />
                </div>
              </div>

              {payoutFeedback && (
                <div
                  className={`p-3 rounded-xl flex items-start space-x-2 text-xs font-semibold ${
                    payoutFeedback.success
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{payoutFeedback.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={currentStore.walletBalance <= 0}
                className="w-full py-2.5 bg-[#B85C38] hover:bg-[#A94D2F] text-white font-bold rounded-xl text-xs shadow-sm disabled:opacity-50 transition"
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
