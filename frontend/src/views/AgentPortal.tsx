import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveMap } from '../components/InteractiveMap';
import { soundEffects } from '../lib/soundEffects';
import {
  Bike,
  Package,
  Store,
  MapPin,
  Camera,
  CheckCircle2,
  AlertCircle,
  Navigation,
  ArrowRight,
  Layers,
  Sparkles,
  Battery,
  Wifi,
  IndianRupee,
  ShieldCheck,
  ScanLine,
  Zap,
} from 'lucide-react';

export const AgentPortal: React.FC = () => {
  const { parcels, stores, dropParcelAtKirana, language } = useApp();
  const [selectedParcelId, setSelectedParcelId] = useState<string>('');
  const [proofPhotoUrl, setProofPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=80'
  );
  const [dropFeedback, setDropFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Filter parcels that are currently IN_TRANSIT with delivery agents
  const transitParcels = parcels.filter((p) => p.status === 'IN_TRANSIT');
  const activeParcel = transitParcels.find((p) => p.id === selectedParcelId) || transitParcels[0];
  const targetStore = stores.find((s) => s.id === activeParcel?.kiranaStoreId);

  const handleDropConfirm = () => {
    if (!activeParcel) return;
    soundEffects.playScanBeep();
    const res = dropParcelAtKirana(activeParcel.id, proofPhotoUrl);
    setDropFeedback(res);

    if (res.success) {
      setTimeout(() => {
        setDropFeedback(null);
      }, 3500);
    }
  };

  const sampleDropProofs = [
    {
      id: 'shelf-1',
      title: 'Store Shelf View',
      url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'counter-2',
      title: 'Merchant Counter Handover',
      url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'shelf-3',
      title: 'Rack Storage Box',
      url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Rider Telemetry & Status Bar in Lush Green */}
      <div className="bg-[#0F291E] border border-[#1A5336] rounded-3xl p-5 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-white">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#1A5336] border border-[#fffd47]/30 flex items-center justify-center text-[#fffd47] shadow-xs">
            <Bike className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-[#F8F5EF]">
                {language === 'hi' ? 'डिलीवरी राइडर कंसोल' : 'Rider Gig Hub (Shadowfax / Delhivery)'}
              </h2>
              <span className="bg-[#fffd47]/20 text-[#fffd47] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#fffd47]/40 uppercase flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#fffd47] animate-ping" />
                ONLINE • GPS ACTIVE
              </span>
            </div>
            <p className="text-xs text-[#D1E7DD]">
              Rider ID: <strong className="text-[#fffd47]">Vikram Singh</strong> (MH-12-DL-8812)
            </p>
          </div>
        </div>

        {/* Live Device & Earnings Counters */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="bg-[#133827] px-3.5 py-2 rounded-xl border border-[#1A5336] font-medium text-[#D1E7DD] flex items-center gap-1.5">
            <IndianRupee className="w-4 h-4 text-[#fffd47]" />
            <span>Today's Earning: <strong className="text-white">₹528</strong> (24 Drops)</span>
          </div>

          <div className="bg-[#133827] px-3 py-2 rounded-xl border border-[#1A5336] font-mono text-[#D1E7DD] flex items-center gap-2">
            <span className="flex items-center gap-1 text-[#38BDF8] font-bold">
              <Battery className="w-4 h-4" /> 92%
            </span>
            <span className="flex items-center gap-1 text-[#fffd47] font-bold">
              <Wifi className="w-4 h-4" /> 5G
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Bag Parcels & Map, Right = Drop Action & AI Viewfinder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (5 Cols) - Parcels in Bag & Neighborhood Map */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active In-Transit Parcels List */}
          <div className="bg-white border border-[#CDE3D5] rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#CDE3D5] pb-3">
              <h3 className="font-bold text-sm text-[#0F291E] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#1A5336]" />
                <span>Parcels in Delivery Bag ({transitParcels.length})</span>
              </h3>
              <span className="text-[10px] text-[#0F291E] font-extrabold bg-[#fffd47] px-2.5 py-0.5 rounded-full border border-[#fffd47]/60 shadow-xs">
                ₹22 / Drop Payout
              </span>
            </div>

            {transitParcels.length === 0 ? (
              <div className="p-8 text-center bg-[#F4F8F5] rounded-2xl border border-dashed border-[#CDE3D5] space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#1A5336] mx-auto" />
                <p className="text-xs font-bold text-[#0F291E]">All assigned parcels dropped at Kirana hubs!</p>
                <p className="text-[11px] text-[#4A5B52]">
                  Switch to Admin Hub to dispatch more test parcels into the network.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {transitParcels.map((parcel) => {
                  const store = stores.find((s) => s.id === parcel.kiranaStoreId);
                  const isSelected = activeParcel?.id === parcel.id;

                  return (
                    <div
                      key={parcel.id}
                      onClick={() => setSelectedParcelId(parcel.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'bg-[#F4F8F5] border-[#1A5336] shadow ring-1 ring-[#1A5336]/40'
                          : 'bg-white hover:bg-[#F4F8F5] border-[#CDE3D5]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#0F291E]">
                          {parcel.trackingNumber}
                        </span>
                        <span className="text-[10px] font-bold uppercase bg-[#E0F2FE] text-[#0284C7] px-2 py-0.5 rounded border border-[#38BDF8]/40">
                          {parcel.packageSize} Box
                        </span>
                      </div>

                      <div className="text-xs text-[#0F291E] font-semibold mt-1">
                        {parcel.packageItem}
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#CDE3D5]/60 text-[11px] text-[#4A5B52]">
                        <span className="flex items-center gap-1 text-[#4A5B52]">
                          <Store className="w-3.5 h-3.5 text-[#1A5336]" />
                          {store?.storeName || 'Assigned Kirana'}
                        </span>
                        <span className="text-[#1A5336] font-mono font-bold">
                          PIN {parcel.destinationPincode}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mini Interactive Map */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F291E] flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#1A5336]" />
                <span>Rider GPS Route to Target Kirana</span>
              </span>
              <span className="text-[10px] text-[#0284C7] bg-[#E0F2FE] border border-[#38BDF8]/30 px-2 py-0.5 rounded-full font-bold">
                ETA: 4 mins (0.45 km)
              </span>
            </div>
            <InteractiveMap
              stores={stores}
              activeParcel={activeParcel}
              showRiderTrack={true}
            />
          </div>
        </div>

        {/* Right (7 Cols) - Target Store & Drop Proof AI Camera Viewfinder */}
        <div className="lg:col-span-7 space-y-6">
          {activeParcel && targetStore ? (
            <div className="bg-white border border-[#CDE3D5] rounded-3xl p-6 shadow-sm space-y-5">
              {/* Target Kirana Card */}
              <div className="bg-[#F4F8F5] rounded-2xl p-4 border border-[#CDE3D5] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F291E] uppercase tracking-wider flex items-center gap-1">
                    <Store className="w-4 h-4 text-[#1A5336]" />
                    Target Kirana PUDO Hub:
                  </span>
                  <span className="text-xs font-semibold text-[#0284C7] bg-[#E0F2FE] px-2.5 py-0.5 rounded-full border border-[#38BDF8]/40">
                    {targetStore.maxCapacity - targetStore.currentCapacity} Shelf Slots Open
                  </span>
                </div>

                <div className="flex items-start space-x-3.5">
                  <img
                    src={targetStore.photoUrl}
                    alt={targetStore.storeName}
                    className="w-16 h-16 rounded-2xl object-cover border border-[#CDE3D5] shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="text-base font-extrabold text-[#0F291E]">{targetStore.storeName}</h4>
                    <p className="text-xs text-[#4A5B52] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#1A5336] shrink-0" />
                      <span>{targetStore.address} (PIN {targetStore.pincode})</span>
                    </p>
                    <p className="text-[11px] text-[#4A5B52] mt-1">
                      Store Owner: <strong className="text-[#0F291E]">{targetStore.ownerName}</strong> ({targetStore.phone})
                    </p>
                  </div>
                </div>

                <div className="pt-1 flex items-center space-x-3">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${targetStore.latitude},${targetStore.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center space-x-2 bg-[#1A5336] hover:bg-[#133F28] text-[#fffd47] font-bold py-2.5 rounded-xl text-xs shadow transition border border-[#1A5336]"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Open Turn-by-Turn GPS Navigation</span>
                  </a>
                </div>
              </div>

              {/* AI Drop Proof Camera Viewfinder */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#0F291E] flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[#1A5336]" />
                    <span>AI Proof-of-Drop Camera Scanner</span>
                  </label>
                  <span className="text-[10px] text-[#0284C7] bg-[#E0F2FE] border border-[#38BDF8]/40 px-2.5 py-0.5 rounded-full font-mono font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#16a34a]" /> AI Quality Check: PASSED
                  </span>
                </div>

                {/* Simulated Camera Viewfinder with HUD Crosshairs */}
                <div className="relative bg-[#0F291E] rounded-2xl border-2 border-[#1A5336] p-4 overflow-hidden shadow-sm">
                  {/* Viewfinder Crosshair overlays */}
                  <div className="absolute inset-x-8 top-4 bottom-4 border border-[#fffd47]/40 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                    <div className="flex justify-between text-[9px] font-mono text-[#fffd47] font-bold">
                      <span>[ AI_BOX_BOUNDS ]</span>
                      <span>FPS: 60</span>
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-[#38BDF8] font-bold">
                      <span>SEAL_INTACT: TRUE</span>
                      <span>GEOFENCE: 100%</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center relative z-10">
                    <img
                      src={proofPhotoUrl}
                      alt="Drop proof preview"
                      className="w-full sm:w-48 h-32 object-cover rounded-xl border border-[#1A5336] shadow"
                    />

                    <div className="flex-1 space-y-2 text-xs">
                      <p className="text-[#D1E7DD] font-semibold">
                        Photo automatically tags timestamp, GPS coordinates, and tamper-proof package barcode.
                      </p>

                      {/* Photo Preset Buttons */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {sampleDropProofs.map((sample) => (
                          <button
                            key={sample.id}
                            type="button"
                            onClick={() => {
                              soundEffects.playScanBeep();
                              setProofPhotoUrl(sample.url);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition ${
                              proofPhotoUrl === sample.url
                                ? 'bg-[#fffd47] text-[#0F291E] border-[#fffd47] font-bold shadow-xs'
                                : 'bg-[#133827] text-[#D1E7DD] border-[#1A5336] hover:bg-[#1A5336]'
                            }`}
                          >
                            📷 {sample.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedback alert */}
              {dropFeedback && (
                <div
                  className={`p-3.5 rounded-2xl flex items-center space-x-2 text-xs font-semibold ${
                    dropFeedback.success
                      ? 'bg-[#E0F2FE] text-[#0284C7] border border-[#38BDF8]/40'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}
                >
                  {dropFeedback.success ? (
                    <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span>{dropFeedback.message}</span>
                </div>
              )}

              {/* Drop Execution Button */}
              <button
                type="button"
                onClick={handleDropConfirm}
                className="w-full py-4 bg-[#1A5336] hover:bg-[#133F28] text-[#fffd47] font-black text-sm rounded-2xl shadow-md border border-[#fffd47]/30 flex items-center justify-center space-x-2 transition-all transform active:scale-[0.99]"
              >
                <Package className="w-5 h-5 text-[#fffd47]" />
                <span>Confirm Parcel Drop at {targetStore.storeName}</span>
                <ArrowRight className="w-4 h-4 text-[#fffd47]" />
              </button>

              <p className="text-[11px] text-center text-[#4A5B52]">
                ⚡ Automatically updates Kirana shelf inventory and triggers customer WhatsApp with pickup OTP.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-[#CDE3D5] rounded-3xl p-12 text-center space-y-3">
              <Package className="w-12 h-12 text-[#4A5B52] mx-auto" />
              <h4 className="font-bold text-[#0F291E] text-base">No In-Transit Parcel Selected</h4>
              <p className="text-xs text-[#4A5B52]">
                Select an active package from the left column or dispatch a new order from the Admin Hub.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
