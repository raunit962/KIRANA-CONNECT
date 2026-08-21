import React from 'react';
import { Parcel, ParcelStatus } from '../types';
import { ShoppingCart, Truck, Store, CheckCircle, Clock } from 'lucide-react';

interface StatusTimelineProps {
  parcel: Parcel;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ parcel }) => {
  const steps: Array<{
    status: ParcelStatus;
    title: string;
    description: string;
    icon: React.ElementType;
    timestamp?: string;
  }> = [
    {
      status: 'ORDERED',
      title: 'Order Dispatched',
      description: 'Handed over by merchant seller to 3PL logistics',
      icon: ShoppingCart,
      timestamp: parcel.orderedAt ? new Date(parcel.orderedAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : undefined,
    },
    {
      status: 'IN_TRANSIT',
      title: 'Out for Kirana Drop',
      description: parcel.agentName ? `With delivery rider ${parcel.agentName}` : 'In transit to local neighborhood hub',
      icon: Truck,
      timestamp: parcel.dispatchedAt ? new Date(parcel.dispatchedAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : undefined,
    },
    {
      status: 'DROPPED_AT_KIRANA',
      title: 'Safely at Kirana Hub',
      description: 'Verified drop-off completed. Waiting for customer collection.',
      icon: Store,
      timestamp: parcel.droppedAt ? new Date(parcel.droppedAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : undefined,
    },
    {
      status: 'COLLECTED',
      title: 'Collected by Customer',
      description: 'Cryptographically verified via OTP / QR pass. Mission accomplished.',
      icon: CheckCircle,
      timestamp: parcel.collectedAt ? new Date(parcel.collectedAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : undefined,
    },
  ];

  const getStepState = (stepStatus: ParcelStatus) => {
    const order: Record<ParcelStatus, number> = {
      ORDERED: 1,
      IN_TRANSIT: 2,
      DROPPED_AT_KIRANA: 3,
      COLLECTED: 4,
      RETURNED_TO_ORIGIN: 0,
    };

    const currentIdx = order[parcel.status] || 1;
    const stepIdx = order[stepStatus];

    if (currentIdx > stepIdx) return 'COMPLETED';
    if (currentIdx === stepIdx) return 'CURRENT';
    return 'UPCOMING';
  };

  return (
    <div className="py-4">
      <div className="relative">
        <div className="space-y-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const state = getStepState(step.status);
            const isLast = idx === steps.length - 1;

            return (
              <div key={step.status} className="relative flex items-start group">
                {/* Connecting vertical line */}
                {!isLast && (
                  <div
                    className={`absolute left-5 top-10 -bottom-6 w-0.5 transition-colors duration-300 ${
                      state === 'COMPLETED' ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  />
                )}

                {/* Step Circle Icon */}
                <div
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    state === 'COMPLETED'
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : state === 'CURRENT'
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/40 ring-4 ring-brand-500/20 animate-pulse'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Step Content */}
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-sm font-bold ${
                        state === 'COMPLETED'
                          ? 'text-emerald-400'
                          : state === 'CURRENT'
                          ? 'text-brand-400 font-extrabold'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </h4>
                    {step.timestamp && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {step.timestamp}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
