import React, { useState } from 'react';
import { X, QrCode, KeyRound, CheckCircle2, AlertCircle, Camera } from 'lucide-react';
import { Parcel } from '../types';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcelsAtStore: Parcel[];
  onVerify: (parcelId: string, inputCode: string) => { success: boolean; message: string; method?: string };
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  parcelsAtStore,
  onVerify,
}) => {
  const [selectedParcelId, setSelectedParcelId] = useState<string>(
    parcelsAtStore[0]?.id || ''
  );
  const [manualCode, setManualCode] = useState<string>('');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleVerifySubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedParcelId) {
      setFeedback({ success: false, message: 'Please select a parcel to verify.' });
      return;
    }

    const res = onVerify(selectedParcelId, manualCode);
    setFeedback({ success: res.success, message: res.message });

    if (res.success) {
      setTimeout(() => {
        onClose();
        setFeedback(null);
        setManualCode('');
      }, 1800);
    }
  };

  const activeParcel = parcelsAtStore.find((p) => p.id === selectedParcelId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-slate-800/90 px-5 py-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Kirana Parcel Release Scanner</h3>
              <p className="text-[11px] text-slate-400">Validate Customer QR Pass or 4-Digit OTP</p>
            </div>
          </div>
          <button
            onClick={() => {
              setFeedback(null);
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Target Parcel Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Pending Parcel from Store Shelf:
            </label>
            {parcelsAtStore.length === 0 ? (
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 text-xs text-amber-300">
                No parcels currently waiting on shelf for customer collection.
              </div>
            ) : (
              <select
                value={selectedParcelId}
                onChange={(e) => setSelectedParcelId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500 transition"
              >
                {parcelsAtStore.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.trackingNumber} — {p.customerName} ({p.packageItem})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Camera Visual Simulator */}
          <div className="relative bg-slate-950 rounded-xl border-2 border-dashed border-slate-700 p-6 flex flex-col items-center justify-center text-center overflow-hidden">
            {/* Scanner laser beam animation */}
            <div className="absolute inset-x-4 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse shadow-[0_0_12px_#34d399]" />
            
            <div className="w-20 h-20 rounded-2xl bg-slate-900/90 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3 relative group">
              <Camera className="w-8 h-8" />
              <div className="absolute inset-0 border-2 border-emerald-400 rounded-2xl animate-ping opacity-25" />
            </div>

            <p className="text-xs font-bold text-slate-200">Point Camera at Customer QR Code</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Supports high-speed optical scanning & instant OTP validation</p>

            {/* Quick Demo Autofill helper */}
            {activeParcel && (
              <div className="mt-4 pt-3 border-t border-slate-800/80 w-full flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setManualCode(activeParcel.pickupOtp);
                    onVerify(activeParcel.id, activeParcel.pickupOtp);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition"
                >
                  ⚡ Auto-Inject Valid OTP ({activeParcel.pickupOtp})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setManualCode(activeParcel.qrToken);
                    onVerify(activeParcel.id, activeParcel.qrToken);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-semibold transition"
                >
                  📱 Auto-Scan Customer QR
                </button>
              </div>
            )}
          </div>

          {/* Manual OTP / QR Input Form */}
          <form onSubmit={handleVerifySubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Or Enter 4-Digit OTP / QR Token Manually:</span>
                <KeyRound className="w-3.5 h-3.5 text-brand-400" />
              </label>
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="e.g. 4892 or KC-AUTH-..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-center tracking-widest text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-xl flex items-start space-x-2 text-xs font-medium ${
                  feedback.success
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                    : 'bg-red-950/80 text-red-300 border border-red-500/40'
                }`}
              >
                {feedback.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={parcelsAtStore.length === 0}
                className="w-2/3 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition"
              >
                Verify & Handover Parcel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
