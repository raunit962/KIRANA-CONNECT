import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  PlayCircle,
  Package,
  Bike,
  Store,
  QrCode,
  Wallet,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Send,
  MessageSquare,
  KeyRound,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LiveFlowSimulator: React.FC = () => {
  const {
    stores,
    parcels,
    createAndDispatchParcel,
    dropParcelAtKirana,
    verifyAndReleaseParcel,
    resetToDemoState,
    language,
  } = useApp();

  const [simStep, setSimStep] = useState<number>(1);
  const [createdParcelId, setCreatedParcelId] = useState<string>('parcel-101');
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  const targetParcel = parcels.find((p) => p.id === createdParcelId) || parcels[0];
  const matchedStore = stores.find((s) => s.id === targetParcel?.kiranaStoreId) || stores[0];

  // Step 1: Dispatch new order in Salt Lake Sector V, Kolkata
  const handleStep1Dispatch = () => {
    const res = createAndDispatchParcel({
      customerName: 'Anirban Chatterjee',
      customerPhone: '+91 98300 12894',
      packageItem: 'boAt Rockerz 450 Pro Bluetooth Headphone',
      destinationAddress: 'Godrej Waterside, Tower 3, Sector V, Salt Lake',
      destinationPincode: '700091',
      destinationCoords: { latitude: 22.5815, longitude: 88.4385 },
      packageSize: 'SMALL',
    });

    if (res.success && res.parcel) {
      setCreatedParcelId(res.parcel.id);
      addLog(`Step 1 Complete: Order matched to "${matchedStore.storeName}" (Near Webel More, Sector V) via Haversine Proximity.`);
      setSimStep(2);
    }
  };

  // Step 2: Rider Drops at Kirana
  const handleStep2RiderDrop = () => {
    if (!targetParcel) return;
    const res = dropParcelAtKirana(targetParcel.id);
    if (res.success) {
      addLog(`Step 2 Complete: Rider dropped package at ${matchedStore.storeName}. Drop proof photo verified.`);
      setSimStep(3);
    }
  };

  // Step 3: Customer receives Notification
  const handleStep3Notification = () => {
    addLog(`Step 3 Complete: WhatsApp webhook fired to ${targetParcel.customerPhone} with OTP: ${targetParcel.pickupOtp} & QR token.`);
    setSimStep(4);
  };

  // Step 4: Kirana verification & Handover
  const handleStep4KiranaRelease = () => {
    if (!targetParcel) return;
    const res = verifyAndReleaseParcel(targetParcel.id, targetParcel.pickupOtp);
    if (res.success) {
      soundEffectsConfetti();
      addLog(`Step 4 Complete: Parcel verified & released. ₹${matchedStore.commissionRate} added to merchant wallet!`);
      setSimStep(5);
    }
  };

  const soundEffectsConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#9fa683', '#5B6341', '#E8EBD8', '#24281B'],
      });
    } catch {
      // safe fallback
    }
  };

  const handleResetSim = () => {
    resetToDemoState();
    setSimStep(1);
    setLog([]);
    addLog('Simulation reset to initial state for Salt Lake Sector V, Kolkata.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title Card themed in #9fa683 (Earthy Sage Olive) */}
      <div className="bg-[#24281B] border border-[#9fa683]/50 rounded-3xl p-6 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-white">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#9fa683] text-[#24281B] flex items-center justify-center shadow-sm font-black">
            <PlayCircle className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-[#F7F8F4]">
                {language === 'hi' ? 'इंटरैक्टिव एंड-टू-एंड सिमुलेटर' : 'KiranaConnect End-to-End Flow Simulator'}
              </h2>
              <span className="bg-[#9fa683]/25 text-[#E6EAD8] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#9fa683]/50">
                Salt Lake Sector V, Kolkata
              </span>
            </div>
            <p className="text-xs text-[#D5D9C8]">
              Walk step-by-step through the full Indian PUDO delivery lifecycle in under 60 seconds
            </p>
          </div>
        </div>

        <button
          onClick={handleResetSim}
          className="flex items-center space-x-2 bg-[#353B28] hover:bg-[#464D35] text-[#F7F8F4] font-semibold px-4 py-2 rounded-xl text-xs border border-[#9fa683]/40 transition shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Simulation</span>
        </button>
      </div>

      {/* 5-Step Visual Stepper Header with #9fa683 Accent */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {[
          { step: 1, title: '1. Ingest & Match', icon: Package, desc: 'Haversine Kirana Match' },
          { step: 2, title: '2. Rider Batch Drop', icon: Bike, desc: 'Photo Proof Upload' },
          { step: 3, title: '3. OTP & QR Pass', icon: MessageSquare, desc: 'WhatsApp Dispatch' },
          { step: 4, title: '4. Counter Verify', icon: QrCode, desc: 'Dual-Ended Release' },
          { step: 5, title: '5. Instant UPI', icon: Wallet, desc: '₹15 Merchant Payout' },
        ].map((s) => {
          const Icon = s.icon;
          const isDone = simStep > s.step;
          const isCurrent = simStep === s.step;

          return (
            <div
              key={s.step}
              className={`p-3.5 rounded-2xl border transition-all duration-300 ${
                isDone
                  ? 'bg-[#F4F5EF] border-[#9fa683] text-[#4E5637] shadow-sm'
                  : isCurrent
                  ? 'bg-[#F4F5EF] border-[#9fa683] text-[#24281B] ring-2 ring-[#9fa683] shadow-md'
                  : 'bg-white border-[#C4C9B4] text-[#555C46]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isDone
                      ? 'bg-[#9fa683] text-[#24281B]'
                      : isCurrent
                      ? 'bg-[#9fa683] text-[#24281B] shadow-sm'
                      : 'bg-[#F4F5EF] text-[#555C46] border border-[#C4C9B4]'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={`text-[10px] font-mono font-bold ${
                  isCurrent ? 'text-[#24281B] bg-[#9fa683] px-2 py-0.5 rounded border border-[#9fa683]' : isDone ? 'text-[#4E5637]' : 'text-[#555C46]'
                }`}>
                  {isDone ? 'DONE' : isCurrent ? 'ACTIVE' : 'NEXT'}
                </span>
              </div>
              <div className="font-bold text-xs mt-2 text-[#24281B]">{s.title}</div>
              <div className="text-[10px] text-[#555C46] mt-0.5">{s.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Interactive Step Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Stage Execution Box (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-[#C4C9B4] rounded-3xl p-6 shadow-sm space-y-5">
          {simStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#C4C9B4] pb-3">
                <h3 className="font-bold text-base text-[#24281B] flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#656E4A]" />
                  <span>Step 1: Order Creation & Smart Matching Engine</span>
                </h3>
              </div>

              <p className="text-xs text-[#555C46] leading-relaxed">
                An e-commerce order is placed in Sector V, Salt Lake (PIN 700091). The matching algorithm evaluates local Kirana capacity and assigns the closest active hub within a <strong>zero-emission 4-minute walking radius</strong>.
              </p>

              <div className="bg-[#F4F5EF] p-4 rounded-2xl border border-[#C4C9B4] space-y-2 text-xs">
                <div className="text-[#555C46]">Order: <strong className="text-[#24281B]">boAt Rockerz 450 Pro Headphones</strong></div>
                <div className="text-[#555C46]">Destination: <strong className="text-[#24281B]">Godrej Waterside, Tower 3, Sector V, Salt Lake (PIN 700091)</strong></div>
                <div className="text-[#4E5637] font-bold">Matched Hub: Ghosh Brothers Daily Provisions (~0.35 km away, Near Webel More)</div>
                <div className="text-[#555C46] text-[11px] font-medium">🚶 Pedestrian Geofence: 280m walk from customer home (Zero net-new traffic)</div>
              </div>

              <button
                onClick={handleStep1Dispatch}
                className="w-full py-3.5 bg-[#9fa683] hover:bg-[#8D9472] text-[#1E2217] font-black text-sm rounded-2xl shadow-md border border-[#8D9472] flex items-center justify-center space-x-2 transition transform active:scale-[0.99]"
              >
                <span>Execute Step 1: Auto-Match & Ingest Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {simStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#C4C9B4] pb-3">
                <h3 className="font-bold text-base text-[#24281B] flex items-center gap-2">
                  <Bike className="w-5 h-5 text-[#656E4A]" />
                  <span>Step 2: Delivery Rider Batch Drop at Kirana (Terminates Re-Attempt Loop)</span>
                </h3>
              </div>

              <p className="text-xs text-[#555C46] leading-relaxed">
                Rider avoids 15 fragmented doorstep delivery attempts through congested city alleys. A single 3-minute batch drop eliminates road congestion and double-parking choke points.
              </p>

              <div className="bg-[#F4F5EF] p-4 rounded-2xl border border-[#C4C9B4] flex items-center space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=80"
                  alt="Drop Proof"
                  className="w-20 h-16 object-cover rounded-xl border border-[#C4C9B4]"
                />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-[#24281B]">{matchedStore.storeName}</div>
                  <div className="text-[#555C46]">Rider: Tapas Sen (Shadowfax / Delhivery)</div>
                  <div className="text-[#4E5637] font-bold">Status: Arrived at Shop Counter (Webel More)</div>
                </div>
              </div>

              <button
                onClick={handleStep2RiderDrop}
                className="w-full py-3.5 bg-[#9fa683] hover:bg-[#8D9472] text-[#1E2217] font-black text-sm rounded-2xl shadow-md border border-[#8D9472] flex items-center justify-center space-x-2 transition transform active:scale-[0.99]"
              >
                <span>Execute Step 2: Confirm Rider Drop & Photo Proof</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {simStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#C4C9B4] pb-3">
                <h3 className="font-bold text-base text-[#24281B] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#656E4A]" />
                  <span>Step 3: Automated WhatsApp & SMS Pickup Pass</span>
                </h3>
              </div>

              <p className="text-xs text-[#555C46] leading-relaxed">
                Customer receives instant WhatsApp notification containing the Kirana location, opening hours, and 4-digit pickup PIN with dynamic QR pass.
              </p>

              <div className="bg-[#0b141a] p-4 rounded-2xl border border-emerald-500/30 space-y-2 text-xs">
                <div className="text-emerald-400 font-bold">📲 WhatsApp Alert Sent to Customer:</div>
                <div className="bg-[#005c4b] p-3 rounded-xl text-white space-y-1">
                  <div>Your parcel is waiting at <strong>{matchedStore.storeName}</strong> ({matchedStore.address}).</div>
                  <div className="font-mono font-bold text-amber-300">Pickup OTP: {targetParcel?.pickupOtp}</div>
                </div>
              </div>

              <button
                onClick={handleStep3Notification}
                className="w-full py-3.5 bg-[#9fa683] hover:bg-[#8D9472] text-[#1E2217] font-black text-sm rounded-2xl shadow-md border border-[#8D9472] flex items-center justify-center space-x-2 transition transform active:scale-[0.99]"
              >
                <span>Execute Step 3: Customer Receives OTP Pass</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {simStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#C4C9B4] pb-3">
                <h3 className="font-bold text-base text-[#24281B] flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-[#656E4A]" />
                  <span>Step 4: Customer Visits Kirana & Verifies OTP</span>
                </h3>
              </div>

              <p className="text-xs text-[#555C46] leading-relaxed">
                Customer arrives at the Kirana store at their own convenience. Merchant verifies customer's 4-digit OTP / scans QR pass to release parcel.
              </p>

              <div className="bg-[#F4F5EF] p-4 rounded-2xl border border-[#C4C9B4] space-y-2 text-xs text-center">
                <div className="text-[#555C46]">Verifying Pickup PIN:</div>
                <div className="text-3xl font-black font-mono tracking-widest text-[#3B4228] bg-white p-3 rounded-xl border border-[#9fa683]/40 inline-block px-6">
                  {targetParcel?.pickupOtp}
                </div>
                <div className="text-[#4E5637] font-bold text-[11px]">HMAC Cryptographic Validation Passed</div>
              </div>

              <button
                onClick={handleStep4KiranaRelease}
                className="w-full py-3.5 bg-[#9fa683] hover:bg-[#8D9472] text-[#1E2217] font-black text-sm rounded-2xl shadow-md border border-[#8D9472] flex items-center justify-center space-x-2 transition transform active:scale-[0.99]"
              >
                <span>Execute Step 4: Verify OTP & Handover Parcel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {simStep === 5 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#C4C9B4] pb-3">
                <h3 className="font-bold text-base text-[#24281B] flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-[#656E4A]" />
                  <span>Step 5: Delivery Completed & ₹15 Merchant Credit</span>
                </h3>
              </div>

              <div className="bg-[#F4F5EF] border border-[#C4C9B4] p-5 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#9fa683] mx-auto" />
                <h4 className="font-black text-lg text-[#24281B]">Full PUDO Lifecycle Successful!</h4>
                <p className="text-xs text-[#555C46]">
                  Missed doorstep delivery securely recovered at corner Kirana. ₹15 credited directly to {matchedStore.storeName}'s UPI wallet.
                </p>
                <div className="bg-white p-2.5 rounded-xl border border-[#C4C9B4] text-[11px] text-[#555C46] font-semibold space-y-0.5">
                  <div>🚦 Urban Impact: Eliminates Day-2/Day-3 courier re-attempt runs</div>
                  <div>🏢 Infrastructure: Cuts NDR holding clutter in city sorting warehouses by ~82%</div>
                </div>
                <div className="text-2xl font-black text-[#24281B]">Wallet Balance: ₹{matchedStore.walletBalance}</div>
              </div>

              <button
                onClick={handleResetSim}
                className="w-full py-3 bg-[#9fa683] hover:bg-[#8D9472] text-[#1E2217] font-bold text-xs rounded-xl transition shadow-sm border border-[#8D9472]"
              >
                Run Simulation Again
              </button>
            </div>
          )}
        </div>

        {/* Right: Live Event Telemetry Stream (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-[#C4C9B4] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#C4C9B4] pb-3">
            <h3 className="text-sm font-bold text-[#24281B] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#656E4A]" />
              <span>Real-Time Event Stream Log</span>
            </h3>
            <span className="text-[10px] font-mono text-[#24281B] bg-[#9fa683]/30 border border-[#9fa683]/50 px-2 py-0.5 rounded-md font-bold">
              KOLKATA SECTOR V
            </span>
          </div>

          <div className="bg-[#F4F5EF] p-3.5 rounded-2xl border border-[#C4C9B4] space-y-2 font-mono text-[11px] max-h-[380px] overflow-y-auto">
            {log.length === 0 ? (
              <p className="text-[#555C46]">Click any step to start streaming live logistics events...</p>
            ) : (
              log.map((entry, idx) => (
                <div key={idx} className="text-[#555C46] leading-tight border-b border-[#C4C9B4]/50 pb-1.5">
                  <span className="text-[#4E5637] font-bold">{entry.slice(0, 10)}</span>{' '}
                  <span className="text-[#24281B]">{entry.slice(10)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
