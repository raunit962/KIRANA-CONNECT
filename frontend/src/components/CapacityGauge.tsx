import React from 'react';
import { Package, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface CapacityGaugeProps {
  current: number;
  max: number;
  label?: string;
  showDetails?: boolean;
}

export const CapacityGauge: React.FC<CapacityGaugeProps> = ({
  current,
  max,
  label = 'Shelf Capacity',
  showDetails = true,
}) => {
  const percentage = Math.min(100, Math.round((current / max) * 100));
  const availableSlots = Math.max(0, max - current);

  // Color grading
  let colorClass = 'bg-emerald-500';
  let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let statusText = 'Optimal Space Available';

  if (percentage >= 85) {
    colorClass = 'bg-red-500';
    badgeColor = 'bg-red-500/10 text-red-400 border-red-500/30';
    statusText = 'Critical: Near Volumetric Cap';
  } else if (percentage >= 60) {
    colorClass = 'bg-amber-500';
    badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    statusText = 'Moderate Utilization';
  }

  return (
    <div className="bg-[#F4F8F5] rounded-xl p-4 border border-[#CDE3D5] shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Package className="w-4 h-4 text-[#1A5336]" />
          <span className="text-sm font-bold text-[#0F291E]">{label}</span>
        </div>
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
          {percentage}% Used
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3.5 bg-white rounded-full overflow-hidden p-0.5 border border-[#CDE3D5]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {showDetails && (
        <div className="flex items-center justify-between mt-2.5 text-xs text-[#4A5B52]">
          <span className="font-medium text-[#0F291E]">
            <strong>{current}</strong> / {max} parcels held
          </span>
          <span className="flex items-center gap-1 font-medium text-[#0F291E]">
            {percentage >= 85 ? (
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            )}
            {availableSlots} slots remaining
          </span>
        </div>
      )}
    </div>
  );
};
