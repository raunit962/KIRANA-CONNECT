import React, { useState, useMemo } from 'react';
import { Parcel, ParcelCategory } from '../types';
import { getParcelCategory, getCategoryConfig, PARCEL_CATEGORIES } from '../lib/parcelCategories';
import { Package, Layers, Sparkles, ShieldCheck, Tag, Truck, Ruler, Info, Filter, AlertTriangle } from 'lucide-react';

interface ShelfRackVisualizerProps {
  maxSlots?: number;
  parcelsOnShelf: Parcel[];
  selectedParcelId?: string;
  onSelectSlot?: (parcel: Parcel) => void;
}

export const ShelfRackVisualizer: React.FC<ShelfRackVisualizerProps> = ({
  maxSlots = 30,
  parcelsOnShelf,
  selectedParcelId,
  onSelectSlot,
}) => {
  // Generate 3 racks: Rack A (Top), Rack B (Middle), Rack C (Bottom)
  const slotsPerRack = Math.ceil(maxSlots / 3);
  const racks = ['Rack A (Top Shelf)', 'Rack B (Eye Level)', 'Rack C (Heavy/Bulk)'];

  const [hoveredData, setHoveredData] = useState<{
    parcel: Parcel;
    slotCode: string;
  } | null>(null);

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Category counts tally
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: parcelsOnShelf.length,
      ELECTRONICS_FRAGILE: 0,
      APPAREL_SKINCARE: 0,
      BOOKS_DOCUMENTS: 0,
      HOME_KITCHEN: 0,
      HEALTH_BABY_ESSENTIALS: 0,
    };
    parcelsOnShelf.forEach((p) => {
      const cat = p.category || getParcelCategory(p.packageItem);
      if (counts[cat] !== undefined) {
        counts[cat]++;
      }
    });
    return counts;
  }, [parcelsOnShelf]);

  const selectedParcel = parcelsOnShelf.find((p) => p.id === selectedParcelId);
  const activeDisplayParcel = hoveredData?.parcel || selectedParcel;
  const activeDisplaySlot = hoveredData?.slotCode || (selectedParcel ? (selectedParcel.shelfSlot || 'Selected') : null);

  return (
    <div className="bg-white p-5 rounded-3xl border border-[#CDE3D5] shadow-sm space-y-4">
      {/* Visualizer Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#CDE3D5] pb-3">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-[#1A5336]" />
          <div>
            <h3 className="font-black text-sm text-[#0F291E]">Physical Store Shelf Rack Map</h3>
            <p className="text-[11px] text-[#4A5B52]">Categorized visual inventory with color-coded classification</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="flex items-center gap-1.5 text-[#1A5336] font-bold bg-[#EAF3ED] px-2.5 py-1 rounded-full border border-[#CDE3D5]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1A5336] animate-pulse" />
            Occupied Slots ({parcelsOnShelf.length})
          </span>
          <span className="flex items-center gap-1.5 text-[#4A5B52] bg-[#F4F8F5] px-2.5 py-1 rounded-full border border-[#CDE3D5]">
            <span className="w-2.5 h-2.5 rounded-full bg-white border border-[#CDE3D5]" />
            Empty ({Math.max(0, maxSlots - parcelsOnShelf.length)})
          </span>
        </div>
      </div>

      {/* Category Color Legend & Filter Pills Bar */}
      <div className="bg-[#F4F8F5] p-3 rounded-2xl border border-[#CDE3D5] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-[#0F291E]">
            <Filter className="w-3.5 h-3.5 text-[#1A5336]" />
            <span>Category Color Classification:</span>
          </div>
          <span className="text-[10px] text-[#4A5B52]">Click any category to highlight on shelf</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* ALL */}
          <button
            type="button"
            onClick={() => setCategoryFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-xs ${
              categoryFilter === 'ALL'
                ? 'bg-[#1A5336] text-[#fffd47] border-[#1A5336] ring-2 ring-[#fffd47]/60'
                : 'bg-white text-[#4A5B52] border-[#CDE3D5] hover:bg-[#EAF3ED]'
            }`}
          >
            <span>All Parcels</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-md bg-black/20">
              {categoryCounts.ALL}
            </span>
          </button>

          {/* 🔴 RED: Electronics & Breakable */}
          <button
            type="button"
            onClick={() => setCategoryFilter(categoryFilter === 'ELECTRONICS_FRAGILE' ? 'ALL' : 'ELECTRONICS_FRAGILE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-xs ${
              categoryFilter === 'ELECTRONICS_FRAGILE'
                ? 'bg-red-600 text-white border-red-600 ring-2 ring-red-400'
                : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-xs" />
            <span>🔴 Electronics & Breakable</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-md bg-red-200/80 text-red-950 font-black">
              {categoryCounts.ELECTRONICS_FRAGILE}
            </span>
          </button>

          {/* 🟡 YELLOW: Clothes & Skincare */}
          <button
            type="button"
            onClick={() => setCategoryFilter(categoryFilter === 'APPAREL_SKINCARE' ? 'ALL' : 'APPAREL_SKINCARE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-xs ${
              categoryFilter === 'APPAREL_SKINCARE'
                ? 'bg-amber-500 text-black border-amber-500 ring-2 ring-amber-400'
                : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-xs" />
            <span>🟡 Clothes & Skincare</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-md bg-amber-200/80 text-amber-950 font-black">
              {categoryCounts.APPAREL_SKINCARE}
            </span>
          </button>

          {/* 🔵 BLUE: Books & Documents */}
          <button
            type="button"
            onClick={() => setCategoryFilter(categoryFilter === 'BOOKS_DOCUMENTS' ? 'ALL' : 'BOOKS_DOCUMENTS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-xs ${
              categoryFilter === 'BOOKS_DOCUMENTS'
                ? 'bg-sky-600 text-white border-sky-600 ring-2 ring-sky-400'
                : 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-xs" />
            <span>🔵 Books & Bank Docs</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-md bg-sky-200/80 text-sky-950 font-black">
              {categoryCounts.BOOKS_DOCUMENTS}
            </span>
          </button>

          {/* 🟢 GREEN: Home & Kitchen */}
          <button
            type="button"
            onClick={() => setCategoryFilter(categoryFilter === 'HOME_KITCHEN' ? 'ALL' : 'HOME_KITCHEN')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-xs ${
              categoryFilter === 'HOME_KITCHEN'
                ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-400'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
            <span>🟢 Home & Kitchen</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-200/80 text-emerald-950 font-black">
              {categoryCounts.HOME_KITCHEN}
            </span>
          </button>

          {/* 🟣 PURPLE: Health & Baby */}
          <button
            type="button"
            onClick={() => setCategoryFilter(categoryFilter === 'HEALTH_BABY_ESSENTIALS' ? 'ALL' : 'HEALTH_BABY_ESSENTIALS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-xs ${
              categoryFilter === 'HEALTH_BABY_ESSENTIALS'
                ? 'bg-purple-600 text-white border-purple-600 ring-2 ring-purple-400'
                : 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-xs" />
            <span>🟣 Health & Baby</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-md bg-purple-200/80 text-purple-950 font-black">
              {categoryCounts.HEALTH_BABY_ESSENTIALS}
            </span>
          </button>
        </div>
      </div>

      {/* Racks Container */}
      <div className="space-y-4">
        {racks.map((rackName, rackIdx) => {
          return (
            <div key={rackName} className="space-y-1.5">
              <div className="text-[11px] font-semibold text-[#4A5B52] flex items-center justify-between">
                <span className="font-bold text-[#0F291E] flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-[#1A5336] rounded-full" />
                  {rackName}
                </span>
                <span className="text-[10px] text-[#4A5B52] font-mono bg-[#F4F8F5] px-2 py-0.5 rounded border border-[#CDE3D5]">
                  Row {rackIdx + 1}
                </span>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14 gap-2 bg-[#F4F8F5] p-2.5 rounded-2xl border border-[#CDE3D5]">
                {Array.from({ length: slotsPerRack }).map((_, slotIdx) => {
                  const globalIdx = rackIdx * slotsPerRack + slotIdx;
                  if (globalIdx >= maxSlots) return null;

                  const slotLetter = String.fromCharCode(65 + rackIdx);
                  const slotCode = `${slotLetter}-${String(slotIdx + 1).padStart(2, '0')}`;
                  const parcelInSlot = parcelsOnShelf[globalIdx];
                  const isSelected = parcelInSlot && parcelInSlot.id === selectedParcelId;

                  if (parcelInSlot) {
                    const cat = parcelInSlot.category || getParcelCategory(parcelInSlot.packageItem);
                    const catConfig = getCategoryConfig(cat);
                    const isMatched = categoryFilter === 'ALL' || categoryFilter === cat;

                    // Compute dynamic slot styling per category
                    let slotThemeClasses = '';
                    if (cat === 'ELECTRONICS_FRAGILE') {
                      slotThemeClasses = isSelected
                        ? 'bg-red-600 border-red-300 text-white shadow-xl ring-4 ring-red-400 scale-110 z-20'
                        : 'bg-red-50 hover:bg-red-500 border-red-300 hover:border-red-600 text-red-800 hover:text-white';
                    } else if (cat === 'APPAREL_SKINCARE') {
                      slotThemeClasses = isSelected
                        ? 'bg-amber-500 border-amber-300 text-black shadow-xl ring-4 ring-amber-400 scale-110 z-20'
                        : 'bg-amber-50 hover:bg-amber-400 border-amber-300 hover:border-amber-500 text-amber-900 hover:text-black';
                    } else if (cat === 'BOOKS_DOCUMENTS') {
                      slotThemeClasses = isSelected
                        ? 'bg-sky-600 border-sky-300 text-white shadow-xl ring-4 ring-sky-400 scale-110 z-20'
                        : 'bg-sky-50 hover:bg-sky-500 border-sky-300 hover:border-sky-600 text-sky-900 hover:text-white';
                    } else if (cat === 'HOME_KITCHEN') {
                      slotThemeClasses = isSelected
                        ? 'bg-emerald-600 border-emerald-300 text-white shadow-xl ring-4 ring-emerald-400 scale-110 z-20'
                        : 'bg-emerald-50 hover:bg-emerald-500 border-emerald-300 hover:border-emerald-600 text-emerald-900 hover:text-white';
                    } else {
                      slotThemeClasses = isSelected
                        ? 'bg-purple-600 border-purple-300 text-white shadow-xl ring-4 ring-purple-400 scale-110 z-20'
                        : 'bg-purple-50 hover:bg-purple-500 border-purple-300 hover:border-purple-600 text-purple-900 hover:text-white';
                    }

                    return (
                      <div
                        key={slotCode}
                        onClick={() => onSelectSlot && onSelectSlot(parcelInSlot)}
                        onMouseEnter={() => setHoveredData({ parcel: parcelInSlot, slotCode })}
                        onMouseLeave={() => setHoveredData(null)}
                        className={`group relative p-2 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-200 aspect-square hover:z-50 shadow-xs ${slotThemeClasses} ${
                          !isMatched ? 'opacity-25 grayscale-[70%] scale-95' : 'scale-100'
                        }`}
                      >
                        <Package className="w-4 h-4 transition-transform group-hover:scale-110" />
                        <span className="text-[9px] font-bold font-mono mt-0.5">{slotCode}</span>
                        
                        {/* Categorical Color Corner Dot Indicator */}
                        <div
                          className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${catConfig.dotColor} border border-white shadow-xs`}
                          title={`Category: ${catConfig.name} (${catConfig.colorName})`}
                        />

                        {/* Floating Small Box Comment Tooltip (Hover Card) */}
                        <div
                          className={`absolute z-50 pointer-events-none w-72 sm:w-84 p-3.5 rounded-2xl bg-[#0F291E] text-white shadow-2xl border-2 border-[#fffd47] backdrop-blur-md transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-95 origin-center ${
                            rackIdx === 0
                              ? 'top-full mt-2.5'
                              : 'bottom-full mb-2.5'
                          } ${
                            slotIdx <= 2
                              ? 'left-0'
                              : slotIdx >= slotsPerRack - 3
                              ? 'right-0'
                              : 'left-1/2 -translate-x-1/2'
                          }`}
                        >
                          {/* Pointing triangle arrow */}
                          <div
                            className={`absolute w-3 h-3 bg-[#0F291E] border-[#fffd47] transform rotate-45 ${
                              rackIdx === 0
                                ? '-top-1.5 border-t-2 border-l-2'
                                : '-bottom-1.5 border-b-2 border-r-2'
                            } ${
                              slotIdx <= 2
                                ? 'left-6'
                                : slotIdx >= slotsPerRack - 3
                                ? 'right-6'
                                : 'left-1/2 -translate-x-1/2'
                            }`}
                          />

                          {/* Top Header: Slot & Category Color Tag */}
                          <div className="flex items-center justify-between border-b border-[#1A5336] pb-2 mb-2">
                            <div className="flex items-center space-x-1.5">
                              <span className="font-mono font-black text-[11px] bg-[#fffd47] text-[#0F291E] px-2 py-0.5 rounded-md shadow-xs">
                                Slot {slotCode}
                              </span>
                              {/* Category Badge with user requested color */}
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 shadow-xs ${catConfig.badgeBg} ${catConfig.badgeText} ${catConfig.borderColor}`}>
                                <span>{catConfig.icon}</span>
                                <span>{catConfig.name}</span>
                              </span>
                            </div>
                            <span className="text-[10px] font-bold bg-[#133827] text-[#38BDF8] px-2 py-0.5 rounded-full border border-[#38BDF8]/40">
                              {parcelInSlot.company || 'Flipkart Logistics'}
                            </span>
                          </div>

                          {/* Category Handling Warning Hint */}
                          {cat === 'ELECTRONICS_FRAGILE' && (
                            <div className="mb-2 p-1.5 rounded-xl bg-red-950/70 border border-red-500/50 text-[10px] text-red-200 flex items-center gap-1.5 font-semibold">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                              <span>Fragile Electronics: Do not stack heavy items on top</span>
                            </div>
                          )}
                          {cat === 'APPAREL_SKINCARE' && (
                            <div className="mb-2 p-1.5 rounded-xl bg-amber-950/70 border border-amber-500/50 text-[10px] text-amber-200 flex items-center gap-1.5 font-semibold">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>Fashion & Skincare: Keep in clean, dry shelf section</span>
                            </div>
                          )}

                          {/* Main 4 Attributes Requested */}
                          <div className="space-y-2 text-left">
                            {/* 1. Contents */}
                            <div>
                              <div className="text-[9px] font-bold uppercase tracking-wider text-[#A3B8AD] flex items-center gap-1">
                                <span>📦</span>
                                <span>Contents</span>
                              </div>
                              <div className="font-black text-[#fffd47] text-xs leading-snug mt-0.5">
                                {parcelInSlot.packageItem}
                              </div>
                            </div>

                            {/* 2. Size & Dimensions */}
                            <div className="bg-[#0B2317] p-2 rounded-xl border border-[#1A5336]/80 flex items-center justify-between">
                              <div>
                                <div className="text-[9px] font-bold uppercase tracking-wider text-[#A3B8AD] flex items-center gap-1">
                                  <span>📐</span>
                                  <span>Size & Dimensions</span>
                                </div>
                                <div className="text-[11px] font-bold text-white mt-0.5">
                                  {parcelInSlot.packageDimensions || '28 × 20 × 12 cm'}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-[9px] font-bold uppercase tracking-wider text-[#A3B8AD]">
                                  Weight
                                </div>
                                <div className="text-[11px] font-mono font-bold text-[#38BDF8] mt-0.5 flex items-center gap-1 justify-end">
                                  <span>{parcelInSlot.packageWeight || '1.2 kg'}</span>
                                  <span className="text-[9px] bg-[#1A5336] text-[#fffd47] px-1 py-0.5 rounded">
                                    {parcelInSlot.packageSize}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* 3. Company & 4. Serial Tag Number */}
                            <div className="grid grid-cols-2 gap-2 pt-0.5">
                              <div>
                                <div className="text-[9px] font-bold uppercase tracking-wider text-[#A3B8AD] flex items-center gap-1">
                                  <span>🚚</span>
                                  <span>Company</span>
                                </div>
                                <div className="font-bold text-white text-[11px] truncate mt-0.5">
                                  {parcelInSlot.company || 'Flipkart Logistics'}
                                </div>
                              </div>
                              <div>
                                <div className="text-[9px] font-bold uppercase tracking-wider text-[#A3B8AD] flex items-center gap-1">
                                  <span>🏷️</span>
                                  <span>Serial Tag No</span>
                                </div>
                                <div className="font-mono font-black text-[#fffd47] text-[11px] truncate mt-0.5">
                                  {parcelInSlot.serialTag || `TAG-${parcelInSlot.trackingNumber}`}
                                </div>
                              </div>
                            </div>

                            {/* Extra: Customer & Pickup OTP */}
                            <div className="pt-2 border-t border-[#1A5336] flex items-center justify-between text-[10px] text-[#D1E7DD]">
                              <span className="truncate max-w-[130px]">
                                Recipient: <strong className="text-white">{parcelInSlot.customerName}</strong>
                              </span>
                              <span className="font-mono text-[#fffd47] bg-[#1A5336] px-2 py-0.5 rounded border border-[#fffd47]/30">
                                OTP: {parcelInSlot.pickupOtp}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={slotCode}
                      className="p-2 rounded-xl bg-white border border-[#CDE3D5]/60 text-[#4A5B52]/50 flex flex-col items-center justify-center aspect-square text-[9px] font-mono select-none hover:border-[#1A5336]/40 transition"
                      title={`Empty Slot: ${slotCode}`}
                    >
                      <span>{slotCode}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Parcel Inspector Comment Bar */}
      <div className="bg-[#0F291E] p-3.5 rounded-2xl border border-[#1A5336] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        {activeDisplayParcel ? (
          <div className="flex items-start sm:items-center space-x-3">
            <span className="font-mono font-black text-xs bg-[#fffd47] text-[#0F291E] px-2.5 py-1 rounded-xl shadow-xs shrink-0 mt-0.5 sm:mt-0">
              Slot {activeDisplaySlot}
            </span>
            <div className="space-y-0.5">
              <div className="text-xs font-black text-white flex flex-wrap items-center gap-2">
                <span className="text-[#fffd47]">{activeDisplayParcel.packageItem}</span>
                
                {/* Category Pill */}
                {(() => {
                  const pCat = activeDisplayParcel.category || getParcelCategory(activeDisplayParcel.packageItem);
                  const pConf = getCategoryConfig(pCat);
                  return (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pConf.badgeBg} ${pConf.badgeText} ${pConf.borderColor}`}>
                      {pConf.icon} {pConf.name}
                    </span>
                  );
                })()}

                <span className="text-[10px] text-[#38BDF8] bg-[#133827] px-2 py-0.5 rounded-full border border-[#38BDF8]/40">
                  {activeDisplayParcel.company}
                </span>
                <span className="text-[10px] font-mono text-[#fffd47] bg-[#1A5336] px-2 py-0.5 rounded-md border border-[#fffd47]/30">
                  Tag: {activeDisplayParcel.serialTag}
                </span>
              </div>
              <div className="text-[11px] text-[#D1E7DD] flex flex-wrap items-center gap-3">
                <span>Size: <strong className="text-white">{activeDisplayParcel.packageDimensions} ({activeDisplayParcel.packageWeight})</strong></span>
                <span>•</span>
                <span>Recipient: <strong className="text-white">{activeDisplayParcel.customerName} ({activeDisplayParcel.customerPhone})</strong></span>
                <span>•</span>
                <span>OTP: <strong className="text-[#fffd47] font-mono">{activeDisplayParcel.pickupOtp}</strong></span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-xs text-[#D1E7DD]">
            <Sparkles className="w-4 h-4 text-[#fffd47] shrink-0" />
            <span>
              <strong>Categorized Shelf Inventory:</strong> Hover your mouse over any color-coded slot (🔴 Red = Electronics & Breakable, 🟡 Yellow = Clothes & Skincare, 🔵 Blue = Documents, 🟢 Green = Kitchen, 🟣 Purple = Health). Click to verify customer OTP.
            </span>
          </div>
        )}

        {activeDisplayParcel && (
          <button
            onClick={() => onSelectSlot && onSelectSlot(activeDisplayParcel)}
            className="px-3.5 py-1.5 bg-[#1A5336] hover:bg-[#133F28] text-[#fffd47] text-xs font-bold rounded-xl border border-[#fffd47]/30 transition shrink-0 self-end sm:self-center"
          >
            Release Package
          </button>
        )}
      </div>

      <div className="pt-1 text-[11px] text-[#4A5B52] flex items-center justify-between border-t border-[#CDE3D5]">
        <span>💡 Color-coded slots let you instantly locate fragile items or fashion packages</span>
        <span className="font-mono text-[#1A5336] font-bold">5 Categories • Zero Damage • Fast Handoff</span>
      </div>
    </div>
  );
};
