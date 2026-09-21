import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CapacityGauge } from '../components/CapacityGauge';
import { QRScannerModal } from '../components/QRScannerModal';
import { ShelfRackVisualizer } from '../components/ShelfRackVisualizer';
import { UPISoundbox } from '../components/UPISoundbox';
import { soundEffects } from '../lib/soundEffects';
import { getStoreShelfParcels } from '../lib/mockData';
import { getParcelCategory, getCategoryConfig, PARCEL_CATEGORIES } from '../lib/parcelCategories';
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
  AlertCircle,
  Filter,
} from 'lucide-react';
import { Parcel, ParcelCategory } from '../types';

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
  const [tableCategoryFilter, setTableCategoryFilter] = useState<string>('ALL');
  const [dropdownSelectedParcelId, setDropdownSelectedParcelId] = useState<string>('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [upiId, setUpiId] = useState('rameshgupta@okhdfcbank');
  const [payoutFeedback, setPayoutFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [selectedShelfParcel, setSelectedShelfParcel] = useState<Parcel | null>(null);

  const currentStore = stores.find((s) => s.id === activeStoreId) || stores[0];

  // Parcels currently resting on this store's shelf awaiting collection (matches currentCapacity slots filled)
  const parcelsOnShelf = useMemo(() => {
    return getStoreShelfParcels(currentStore, parcels);
  }, [currentStore, parcels]);

  // Group parcels by Category for the Dropdown list
  const groupedParcelsForDropdown = useMemo(() => {
    const groups: Record<string, Parcel[]> = {
      ELECTRONICS_FRAGILE: [],
      APPAREL_SKINCARE: [],
      BOOKS_DOCUMENTS: [],
      HOME_KITCHEN: [],
      HEALTH_BABY_ESSENTIALS: [],
    };
    parcelsOnShelf.forEach((p) => {
      const cat = p.category || getParcelCategory(p.packageItem);
      if (groups[cat]) {
        groups[cat].push(p);
      } else {
        groups.ELECTRONICS_FRAGILE.push(p);
      }
    });
    return groups;
  }, [parcelsOnShelf]);

  // Filtered parcels by search term and table category filter
  const filteredParcels = parcelsOnShelf.filter((p) => {
    const cat = p.category || getParcelCategory(p.packageItem);
    const matchesCategory = tableCategoryFilter === 'ALL' || cat === tableCategoryFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      p.trackingNumber.toLowerCase().includes(q) ||
      p.customerName.toLowerCase().includes(q) ||
      p.customerPhone.includes(searchTerm) ||
      p.pickupOtp.includes(searchTerm) ||
      (p.company && p.company.toLowerCase().includes(q)) ||
      (p.serialTag && p.serialTag.toLowerCase().includes(q)) ||
      (p.shelfSlot && p.shelfSlot.toLowerCase().includes(q)) ||
      (p.packageItem && p.packageItem.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

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
      {/* Top Store Selector & Status Bar in Lush Green */}
      <div className="bg-[#0F291E] border border-[#1A5336] rounded-3xl p-6 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-white">
        <div className="flex items-center space-x-4">
          <img
            src={currentStore.photoUrl}
            alt={currentStore.storeName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#1A5336] shadow-sm"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black text-[#F8F5EF]">{currentStore.storeName}</h2>
              {currentStore.isVerified && (
                <span className="bg-[#fffd47]/20 text-[#fffd47] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#fffd47]/40 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#fffd47]" />
                  {language === 'hi' ? 'सत्यापित किराना हब' : 'Official PUDO Hub'}
                </span>
              )}
            </div>
            <p className="text-xs text-[#D1E7DD] mt-0.5">
              Owner: <strong className="text-[#fffd47]">{currentStore.ownerName}</strong> | PIN: {currentStore.pincode} ({currentStore.city})
            </p>
          </div>
        </div>

        {/* Store Switcher */}
        <div className="flex items-center space-x-3">
          <span className="text-xs text-[#D1E7DD] font-medium whitespace-nowrap">
            {language === 'hi' ? 'दुकान चुनें:' : 'Active Dukan:'}
          </span>
          <select
            value={currentStore.id}
            onChange={(e) => setActiveStoreId(e.target.value)}
            className="bg-[#133827] border border-[#1A5336] text-[#F8F5EF] rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none focus:border-[#fffd47]"
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
        <div className="bg-white border border-[#CDE3D5] rounded-3xl p-4 shadow-sm flex flex-col justify-between">
          <CapacityGauge
            current={currentStore.currentCapacity}
            max={currentStore.maxCapacity}
            label={language === 'hi' ? 'शेल्फ क्षमता' : 'Shelf Storage Capacity'}
          />
        </div>

        {/* Commission Wallet */}
        <div className="bg-white border border-[#CDE3D5] rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A5B52]">
              {language === 'hi' ? 'कमीशन वॉलेट' : 'Merchant Wallet'}
            </span>
            <span className="text-[10px] font-bold bg-[#1A5336] text-[#fffd47] border border-[#1A5336] px-2.5 py-0.5 rounded-full shadow-xs">
              ₹{currentStore.commissionRate} / parcel
            </span>
          </div>

          <div className="my-2">
            <div className="text-3xl font-black text-[#0F291E]">
              ₹{currentStore.walletBalance.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[#1A5336] font-semibold">
              • {currentStore.totalParcelsHandled} parcels completed
            </p>
          </div>

          <div className="text-[10px] text-[#4A5B52] flex items-center justify-between pt-1 border-t border-[#CDE3D5]">
            <span>Instant UPI settlement</span>
            <span className="text-[#1A5336] font-bold">0% Fee</span>
          </div>
        </div>

        {/* Extra Footfall & Grocery Cross-Sell Analytics */}
        <div className="bg-white border border-[#CDE3D5] rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A5B52]">Store Footfall Gain</span>
            <Users className="w-4 h-4 text-[#0284C7]" />
          </div>

          <div className="my-2">
            <div className="text-2xl font-black text-[#0F291E]">+142 Walk-ins</div>
            <p className="text-[11px] text-[#4A5B52]">
              Generated <strong className="text-[#0284C7] font-bold">+₹4,250</strong> in extra grocery sales
            </p>
          </div>

          <div className="text-[10px] text-[#0284C7] font-semibold pt-1 border-t border-[#CDE3D5] flex items-center justify-between">
            <span>Local Conversion</span>
            <span className="bg-[#E0F2FE] text-[#0284C7] px-2 py-0.5 rounded-md border border-[#38BDF8]/30">High Footfall</span>
          </div>
        </div>

        {/* Big Release Action Button */}
        <div className="bg-white border border-[#CDE3D5] rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-[#4A5B52]">Handoff Station</span>
            <h3 className="text-base font-black text-[#0F291E] mt-1">
              {language === 'hi' ? 'पार्सल रिलीज करें' : 'Release Package'}
            </h3>
          </div>

          <button
            onClick={() => setIsScannerOpen(true)}
            className="w-full mt-3 py-3 bg-[#1A5336] hover:bg-[#133F28] text-[#fffd47] font-extrabold text-xs rounded-2xl shadow-sm border border-[#fffd47]/30 flex items-center justify-center space-x-2 transition"
          >
            <QrCode className="w-4 h-4 text-[#fffd47]" />
            <span>{language === 'hi' ? 'QR / OTP स्कैन' : 'Scan QR & Verify OTP'}</span>
          </button>
        </div>
      </div>

      {/* ALL PARCELS FOR EACH KIRANA STORE IN A DROPDOWN LIST */}
      <div className="bg-white border-2 border-[#1A5336]/40 rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-[#CDE3D5] pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1A5336] text-[#fffd47] flex items-center justify-center font-black text-lg shadow-sm">
              📦
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#0F291E]">
                All Parcels Directory &amp; Dropdown Explorer
              </h3>
              <p className="text-xs text-[#4A5B52]">
                Instant dropdown access to every parcel stored in <strong className="text-[#1A5336]">{currentStore.storeName}</strong> ({parcelsOnShelf.length} total)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-red-50 text-red-700 font-bold px-2.5 py-1 rounded-lg border border-red-200">
              🔴 Electronics ({groupedParcelsForDropdown.ELECTRONICS_FRAGILE.length})
            </span>
            <span className="bg-amber-50 text-amber-800 font-bold px-2.5 py-1 rounded-lg border border-amber-200">
              🟡 Clothes &amp; Skincare ({groupedParcelsForDropdown.APPAREL_SKINCARE.length})
            </span>
            <span className="bg-sky-50 text-sky-800 font-bold px-2.5 py-1 rounded-lg border border-sky-200">
              🔵 Books ({groupedParcelsForDropdown.BOOKS_DOCUMENTS.length})
            </span>
          </div>
        </div>

        {/* The Two-Stage Dropdown Selector (Store + Parcels in that store) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Store Switcher */}
          <div className="md:col-span-4 space-y-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A5336]">
              1. Select Kirana Hub
            </label>
            <select
              value={currentStore.id}
              onChange={(e) => {
                setActiveStoreId(e.target.value);
                setDropdownSelectedParcelId('');
                setSelectedShelfParcel(null);
              }}
              className="w-full bg-[#F4F8F5] border-2 border-[#CDE3D5] focus:border-[#1A5336] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#0F291E] shadow-xs outline-none transition"
            >
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  🏪 {s.storeName} ({s.city}) — {s.currentCapacity} Stored Parcels
                </option>
              ))}
            </select>
          </div>

          {/* All Parcels Dropdown List */}
          <div className="md:col-span-8 space-y-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A5336] flex items-center justify-between">
              <span>2. Choose Any Stored Parcel from Dropdown List ({parcelsOnShelf.length} Available):</span>
              {dropdownSelectedParcelId && (
                <button
                  type="button"
                  onClick={() => {
                    setDropdownSelectedParcelId('');
                    setSelectedShelfParcel(null);
                  }}
                  className="text-[10px] text-red-600 hover:underline lowercase font-semibold"
                >
                  ✕ clear selection
                </button>
              )}
            </label>

            <select
              value={dropdownSelectedParcelId}
              onChange={(e) => {
                const found = parcelsOnShelf.find((p) => p.id === e.target.value) || null;
                setDropdownSelectedParcelId(e.target.value);
                setSelectedShelfParcel(found);
              }}
              className="w-full bg-white border-2 border-[#1A5336] focus:border-[#fffd47] focus:ring-2 focus:ring-[#fffd47]/60 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#0F291E] shadow-sm outline-none transition cursor-pointer"
            >
              <option value="">
                -- Click to view and choose from all {parcelsOnShelf.length} parcels in {currentStore.storeName} --
              </option>

              {/* 🔴 RED: Electronics & Breakable */}
              {groupedParcelsForDropdown.ELECTRONICS_FRAGILE.length > 0 && (
                <optgroup label={`🔴 ELECTRONICS & BREAKABLE (${groupedParcelsForDropdown.ELECTRONICS_FRAGILE.length} pkgs)`}>
                  {groupedParcelsForDropdown.ELECTRONICS_FRAGILE.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.shelfSlot || 'Slot'}] 🔴 {p.packageItem} — {p.customerName} ({p.company || 'Carrier'}) • OTP: {p.pickupOtp}
                    </option>
                  ))}
                </optgroup>
              )}

              {/* 🟡 YELLOW: Clothes & Skincare */}
              {groupedParcelsForDropdown.APPAREL_SKINCARE.length > 0 && (
                <optgroup label={`🟡 CLOTHES & SKINCARE (${groupedParcelsForDropdown.APPAREL_SKINCARE.length} pkgs)`}>
                  {groupedParcelsForDropdown.APPAREL_SKINCARE.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.shelfSlot || 'Slot'}] 🟡 {p.packageItem} — {p.customerName} ({p.company || 'Carrier'}) • OTP: {p.pickupOtp}
                    </option>
                  ))}
                </optgroup>
              )}

              {/* 🔵 BLUE: Books & Documents */}
              {groupedParcelsForDropdown.BOOKS_DOCUMENTS.length > 0 && (
                <optgroup label={`🔵 BOOKS & BANK DOCS (${groupedParcelsForDropdown.BOOKS_DOCUMENTS.length} pkgs)`}>
                  {groupedParcelsForDropdown.BOOKS_DOCUMENTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.shelfSlot || 'Slot'}] 🔵 {p.packageItem} — {p.customerName} ({p.company || 'Carrier'}) • OTP: {p.pickupOtp}
                    </option>
                  ))}
                </optgroup>
              )}

              {/* 🟢 GREEN: Home & Kitchen */}
              {groupedParcelsForDropdown.HOME_KITCHEN.length > 0 && (
                <optgroup label={`🟢 HOME & KITCHEN (${groupedParcelsForDropdown.HOME_KITCHEN.length} pkgs)`}>
                  {groupedParcelsForDropdown.HOME_KITCHEN.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.shelfSlot || 'Slot'}] 🟢 {p.packageItem} — {p.customerName} ({p.company || 'Carrier'}) • OTP: {p.pickupOtp}
                    </option>
                  ))}
                </optgroup>
              )}

              {/* 🟣 PURPLE: Health & Baby */}
              {groupedParcelsForDropdown.HEALTH_BABY_ESSENTIALS.length > 0 && (
                <optgroup label={`🟣 HEALTH & BABY CARE (${groupedParcelsForDropdown.HEALTH_BABY_ESSENTIALS.length} pkgs)`}>
                  {groupedParcelsForDropdown.HEALTH_BABY_ESSENTIALS.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.shelfSlot || 'Slot'}] 🟣 {p.packageItem} — {p.customerName} ({p.company || 'Carrier'}) • OTP: {p.pickupOtp}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
        </div>

        {/* Selected Parcel Quick Focus Banner */}
        {selectedShelfParcel && (
          <div className="p-4 rounded-2xl bg-[#0F291E] text-white border-2 border-[#fffd47] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-start sm:items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#fffd47] text-[#0F291E] font-mono font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                {selectedShelfParcel.shelfSlot || 'Slot'}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold text-sm text-[#fffd47]">
                    {selectedShelfParcel.packageItem}
                  </span>
                  {(() => {
                    const cat = selectedShelfParcel.category || getParcelCategory(selectedShelfParcel.packageItem);
                    const conf = getCategoryConfig(cat);
                    return (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${conf.badgeBg} ${conf.badgeText} ${conf.borderColor}`}>
                        {conf.icon} {conf.name} ({conf.colorName})
                      </span>
                    );
                  })()}
                  <span className="text-[10px] font-mono text-[#D1E7DD] bg-[#1A5336] px-2 py-0.5 rounded border border-[#1A5336]">
                    Tag: {selectedShelfParcel.serialTag}
                  </span>
                </div>
                <div className="text-xs text-[#D1E7DD] flex flex-wrap items-center gap-3">
                  <span>Customer: <strong className="text-white">{selectedShelfParcel.customerName}</strong> ({selectedShelfParcel.customerPhone})</span>
                  <span>•</span>
                  <span>Carrier: <strong className="text-[#38BDF8]">{selectedShelfParcel.company}</strong></span>
                  <span>•</span>
                  <span>Size: <strong className="text-white">{selectedShelfParcel.packageDimensions}</strong> ({selectedShelfParcel.packageWeight})</span>
                  <span>•</span>
                  <span>Pickup OTP: <strong className="font-mono text-[#fffd47] bg-[#1A5336] px-1.5 py-0.5 rounded">{selectedShelfParcel.pickupOtp}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
              <button
                onClick={() => setIsScannerOpen(true)}
                className="px-4 py-2 bg-[#fffd47] hover:bg-[#fffd47]/90 text-[#0F291E] font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 active:scale-95"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Verify &amp; Handover</span>
              </button>
              <button
                onClick={() => {
                  setDropdownSelectedParcelId('');
                  setSelectedShelfParcel(null);
                }}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2D Shelf Rack Visualizer Matrix */}
      <ShelfRackVisualizer
        maxSlots={currentStore.maxCapacity}
        parcelsOnShelf={parcelsOnShelf}
        selectedParcelId={selectedShelfParcel?.id}
        onSelectSlot={(p) => {
          setSelectedShelfParcel(p);
          setDropdownSelectedParcelId(p.id);
          setIsScannerOpen(true);
        }}
      />

      {/* Main Content Split: Left = Active Shelf Inventory, Right = Soundbox & UPI Settlement */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Shelf Inventory Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-[#CDE3D5] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#CDE3D5] pb-4">
            <div>
              <h3 className="text-base font-bold text-[#0F291E] flex items-center gap-2">
                <Package className="w-5 h-5 text-[#1A5336]" />
                <span>
                  {language === 'hi' ? 'दुकान शेल्फ पर उपलब्ध पार्सल' : 'Parcels On Store Shelf'} ({filteredParcels.length}/{parcelsOnShelf.length})
                </span>
              </h3>
              <p className="text-xs text-[#4A5B52]">
                Color classified by product category. Verify customer OTP / QR pass to hand over package
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Category Filter Dropdown */}
              <select
                value={tableCategoryFilter}
                onChange={(e) => setTableCategoryFilter(e.target.value)}
                className="bg-[#F4F8F5] border border-[#CDE3D5] rounded-xl px-2.5 py-2 text-xs font-bold text-[#0F291E] focus:outline-none focus:border-[#1A5336]"
              >
                <option value="ALL">All Categories</option>
                <option value="ELECTRONICS_FRAGILE">🔴 Electronics &amp; Fragile</option>
                <option value="APPAREL_SKINCARE">🟡 Clothes &amp; Skincare</option>
                <option value="BOOKS_DOCUMENTS">🔵 Books &amp; Documents</option>
                <option value="HOME_KITCHEN">🟢 Home &amp; Kitchen</option>
                <option value="HEALTH_BABY_ESSENTIALS">🟣 Health &amp; Baby Care</option>
              </select>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-[#4A5B52] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search item, OTP, phone..."
                  className="bg-[#F4F8F5] border border-[#CDE3D5] rounded-xl pl-9 pr-4 py-2 text-xs text-[#0F291E] placeholder-[#4A5B52] focus:outline-none focus:border-[#1A5336]"
                />
              </div>
            </div>
          </div>

          {/* Shelf Table */}
          {filteredParcels.length === 0 ? (
            <div className="p-10 text-center bg-[#F4F8F5] rounded-2xl border border-dashed border-[#CDE3D5] space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#1A5336] mx-auto" />
              <p className="text-sm font-bold text-[#0F291E]">No parcels matching criteria</p>
              <p className="text-xs text-[#4A5B52]">
                Try selecting "All Categories" or clearing the search box.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#CDE3D5] text-[#4A5B52] uppercase text-[10px] font-bold">
                    <th className="pb-3 px-2">Slot / Tag</th>
                    <th className="pb-3 px-2">Category</th>
                    <th className="pb-3 px-2">Package &amp; Carrier</th>
                    <th className="pb-3 px-2">Customer</th>
                    <th className="pb-3 px-2">Arrived At</th>
                    <th className="pb-3 px-2 text-center">Pickup OTP</th>
                    <th className="pb-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CDE3D5]/50">
                  {filteredParcels.map((parcel) => {
                    const cat = parcel.category || getParcelCategory(parcel.packageItem);
                    const conf = getCategoryConfig(cat);
                    const isRowSelected = selectedShelfParcel?.id === parcel.id;

                    return (
                      <tr
                        key={parcel.id}
                        onClick={() => {
                          setSelectedShelfParcel(parcel);
                          setDropdownSelectedParcelId(parcel.id);
                        }}
                        className={`transition cursor-pointer ${
                          isRowSelected
                            ? 'bg-[#EAF3ED] font-medium'
                            : 'hover:bg-[#F4F8F5]'
                        }`}
                      >
                        <td className="py-3.5 px-2">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="font-mono font-black text-[10px] bg-[#fffd47] text-[#0F291E] px-2 py-0.5 rounded-md shadow-xs">
                              {parcel.shelfSlot || 'Slot'}
                            </span>
                            <span className="font-mono font-bold text-[#0F291E] text-xs">{parcel.trackingNumber}</span>
                          </div>
                          <div className="text-[10px] font-mono text-[#4A5B52]">
                            Tag: <strong className="text-[#1A5336]">{parcel.serialTag}</strong>
                          </div>
                        </td>

                        {/* Category with Color Badge */}
                        <td className="py-3.5 px-2">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${conf.badgeBg} ${conf.badgeText} ${conf.borderColor}`}>
                            <span>{conf.icon}</span>
                            <span className="whitespace-nowrap">{conf.name}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-2">
                          <div className="font-bold text-[#0F291E] truncate max-w-[190px]">
                            {parcel.packageItem}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-bold bg-[#EAF3ED] text-[#1A5336] px-2 py-0.2 rounded border border-[#CDE3D5]">
                              {parcel.company}
                            </span>
                            <span className="text-[10px] text-[#4A5B52]">
                              {parcel.packageDimensions}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-2">
                          <div className="font-semibold text-[#0F291E]">{parcel.customerName}</div>
                          <div className="text-[#4A5B52]">{parcel.customerPhone}</div>
                        </td>

                        <td className="py-3.5 px-2">
                          <span className="flex items-center gap-1 text-[#4A5B52]">
                            <Clock className="w-3.5 h-3.5 text-[#1A5336]" />
                            {parcel.droppedAt ? new Date(parcel.droppedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}
                          </span>
                          <span className="text-[10px] text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-full border border-[#38BDF8]/30 font-medium inline-block mt-0.5">
                            72h window
                          </span>
                        </td>

                        <td className="py-3.5 px-2 text-center">
                          <span className="font-mono font-black bg-[#F4F8F5] text-[#0F291E] border border-[#CDE3D5] px-2.5 py-1 rounded-lg text-xs tracking-wider">
                            {parcel.pickupOtp}
                          </span>
                        </td>

                        <td className="py-3.5 px-2 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedShelfParcel(parcel);
                              setDropdownSelectedParcelId(parcel.id);
                              setIsScannerOpen(true);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-[#1A5336] hover:bg-[#133F28] text-[#fffd47] font-bold text-xs shadow-xs transition border border-[#1A5336]"
                          >
                            Verify &amp; Handover
                          </button>
                        </td>
                      </tr>
                    );
                  })}
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
          <div className="bg-white border border-[#CDE3D5] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-[#CDE3D5] pb-3">
              <IndianRupee className="w-4 h-4 text-[#1A5336]" />
              <h3 className="text-sm font-bold text-[#0F291E]">Instant UPI Bank Transfer</h3>
            </div>

            <form onSubmit={handleWithdrawal} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#4A5B52] font-semibold mb-1">
                  UPI ID (VPA):
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-[#F4F8F5] border border-[#CDE3D5] rounded-xl px-3 py-2 text-[#0F291E] font-mono text-xs focus:outline-none focus:border-[#1A5336]"
                  placeholder="e.g. yourname@okhdfcbank"
                />
              </div>

              <div>
                <label className="block text-[#4A5B52] font-semibold mb-1 flex items-center justify-between">
                  <span>Withdraw Amount:</span>
                  <span className="text-[#1A5336] font-bold">Available: ₹{currentStore.walletBalance}</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-[#4A5B52] font-bold">₹</span>
                  <input
                    type="number"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    placeholder="500"
                    className="w-full bg-[#F4F8F5] border border-[#CDE3D5] rounded-xl pl-7 pr-3 py-2 text-[#0F291E] font-bold text-xs focus:outline-none focus:border-[#1A5336]"
                  />
                </div>
              </div>

              {payoutFeedback && (
                <div
                  className={`p-3 rounded-xl flex items-start space-x-2 text-xs font-semibold ${
                    payoutFeedback.success
                      ? 'bg-[#E0F2FE] text-[#0284C7] border border-[#38BDF8]/40'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}
                >
                  {payoutFeedback.success ? (
                    <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <span>{payoutFeedback.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={currentStore.walletBalance <= 0}
                className="w-full py-2.5 bg-[#1A5336] hover:bg-[#133F28] text-[#fffd47] font-bold rounded-xl text-xs shadow-sm disabled:opacity-50 transition border border-[#fffd47]/30"
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
