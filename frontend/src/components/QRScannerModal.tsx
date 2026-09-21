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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-[#CDE3D5] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-[#0F291E] px-5 py-4 flex items-center justify-between border-b border-[#1A5336]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1A5336] border border-[#fffd47]/30 flex items-center justify-center text-[#fffd47]">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#F8F5EF]">Kirana Parcel Release Scanner</h3>
              <p className="text-[11px] text-[#D1E7DD]">Validate Customer QR Pass or 4-Digit OTP</p>
            </div>
          </div>
          <button
            onClick={() => {
              setFeedback(null);
              onClose();
            }}
            className="text-[#D1E7DD] hover:text-[#fffd47] p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Target Parcel Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#0F291E] mb-1.5">
              Select Pending Parcel from Store Shelf:
            </label>
            {parcelsAtStore.length === 0 ? (
              <div className="p-3 bg-[#F4F8F5] rounded-xl border border-[#CDE3D5] text-xs text-[#1A5336] font-medium">
                No parcels currently waiting on shelf for customer collection.
              </div>
            ) : (
              <select
                value={selectedParcelId}
                onChange={(e) => setSelectedParcelId(e.target.value)}
                className="w-full bg-[#F4F8F5] border border-[#CDE3D5] rounded-xl px-3.5 py-2.5 text-xs text-[#0F291E] focus:outline-none focus:border-[#1A5336] transition"
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
          <div className="relative bg-[#0F291E] rounded-xl border-2 border-[#1A5336] p-6 flex flex-col items-center justify-center text-center overflow-hidden text-white">
            {/* Scanner laser beam animation */}
            <div className="absolute inset-x-4 top-0 h-1 bg-gradient-to-r from-transparent via-[#fffd47] to-transparent animate-pulse shadow-sm" />
            
            <div className="w-20 h-20 rounded-2xl bg-[#133827] border border-[#1A5336] flex items-center justify-center text-[#fffd47] mb-3 relative group">
              <Camera className="w-8 h-8" />
              <div className="absolute inset-0 border-2 border-[#fffd47] rounded-2xl animate-ping opacity-25" />
            </div>

            <p className="text-xs font-bold text-[#F8F5EF]">Point Camera at Customer QR Code</p>
            <p className="text-[11px] text-[#D1E7DD] mt-0.5">Supports high-speed optical scanning & instant OTP validation</p>

            {/* Quick Demo Autofill helper */}
            {activeParcel && (
              <div className="mt-4 pt-3 border-t border-[#1A5336] w-full flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setManualCode(activeParcel.pickupOtp);
                    onVerify(activeParcel.id, activeParcel.pickupOtp);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#133827] hover:bg-[#1A5336] text-[#fffd47] border border-[#1A5336] text-[11px] font-semibold transition shadow-sm"
                >
                  ⚡ Auto-Inject Valid OTP ({activeParcel.pickupOtp})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setManualCode(activeParcel.qrToken);
                    onVerify(activeParcel.id, activeParcel.qrToken);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#133827] hover:bg-[#1A5336] text-[#38BDF8] border border-[#1A5336] text-[11px] font-semibold transition shadow-sm"
                >
                  📱 Auto-Scan Customer QR
                </button>
              </div>
            )}
          </div>

          {/* Manual OTP / QR Input Form */}
          <form onSubmit={handleVerifySubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#0F291E] mb-1.5 flex items-center justify-between">
                <span>Or Enter 4-Digit OTP / QR Token Manually:</span>
                <KeyRound className="w-3.5 h-3.5 text-[#1A5336]" />
              </label>
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="e.g. 4892 or KC-AUTH-..."
                className="w-full bg-[#F4F8F5] border border-[#CDE3D5] rounded-xl px-4 py-2.5 text-sm font-mono text-center tracking-widest text-[#0F291E] placeholder-[#4A5B52] focus:outline-none focus:border-[#1A5336] transition"
              />
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-xl flex items-start space-x-2 text-xs font-medium ${
                  feedback.success
                    ? 'bg-[#E0F2FE] text-[#0284C7] border border-[#38BDF8]/40'
                    : 'bg-red-100 text-red-900 border border-red-300'
                }`}
              >
                {feedback.success ? (
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 bg-[#F4F8F5] hover:bg-white text-[#0F291E] font-semibold rounded-xl text-xs border border-[#CDE3D5] transition shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={parcelsAtStore.length === 0}
                className="w-2/3 py-2.5 bg-[#1A5336] hover:bg-[#133F28] text-[#fffd47] font-bold rounded-xl text-xs shadow-md disabled:opacity-50 transition border border-[#fffd47]/30"
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
