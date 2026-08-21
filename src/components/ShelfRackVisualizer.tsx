import React from 'react';
import { Parcel } from '../types';
import { Package, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

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

  return (
    <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-sm text-white">Physical Store Shelf Rack Map</h3>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            Occupied ({parcelsOnShelf.length})
          </span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
            Empty ({maxSlots - parcelsOnShelf.length})
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {racks.map((rackName, rackIdx) => {
          return (
            <div key={rackName} className="space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                <span>{rackName}</span>
                <span className="text-[10px] text-slate-500 font-mono">Row {rackIdx + 1}</span>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800/80">
                {Array.from({ length: slotsPerRack }).map((_, slotIdx) => {
                  const globalIdx = rackIdx * slotsPerRack + slotIdx;
                  const slotLetter = String.fromCharCode(65 + rackIdx);
                  const slotCode = `${slotLetter}-${String(slotIdx + 1).padStart(2, '0')}`;
                  const parcelInSlot = parcelsOnShelf[globalIdx];
                  const isSelected = parcelInSlot && parcelInSlot.id === selectedParcelId;

                  if (parcelInSlot) {
                    return (
                      <div
                        key={slotCode}
                        onClick={() => onSelectSlot && onSelectSlot(parcelInSlot)}
                        className={`group relative p-2 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-200 aspect-square ${
                          isSelected
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-white text-white shadow-[0_0_15px_#10b981] scale-105 ring-2 ring-white/40'
                            : 'bg-emerald-950/70 hover:bg-emerald-900/90 border-emerald-500/40 text-emerald-300'
                        }`}
                        title={`${slotCode}: ${parcelInSlot.customerName} - ${parcelInSlot.packageItem}`}
                      >
                        <Package className="w-4 h-4" />
                        <span className="text-[9px] font-bold font-mono mt-0.5">{slotCode}</span>
                        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                      </div>
                    );
                  }

                  return (
                    <div
                      key={slotCode}
                      className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/60 text-slate-600 flex flex-col items-center justify-center aspect-square text-[9px] font-mono select-none"
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

      <div className="pt-1 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-900">
        <span>💡 Click any filled slot to instantly locate parcel details & customer OTP</span>
        <span className="font-mono text-emerald-400">Zero Shelf Clutter</span>
      </div>
    </div>
  );
};
