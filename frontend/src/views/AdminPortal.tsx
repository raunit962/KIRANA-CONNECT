import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { findBestKiranaStores } from '../lib/matchingEngine';
import { CapacityGauge } from '../components/CapacityGauge';
import { InteractiveMap } from '../components/InteractiveMap';
import { soundEffects } from '../lib/soundEffects';
import {
  LayoutDashboard,
  Store,
  Package,
  TrendingDown,
  Coins,
  Send,
  Plus,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Sliders,
  Percent,
  TrendingUp,
  SlidersHorizontal,
  Flame,
  IndianRupee,
} from 'lucide-react';
import { KiranaStore } from '../types';

export const AdminPortal: React.FC = () => {
  const {
    stores,
    parcels,
    payoutLogs,
    createAndDispatchParcel,
    registerKiranaStore,
    language,
  } = useApp();

  // Dispatch Form State
  const [customerName, setCustomerName] = useState('Ananya Singhania');
  const [customerPhone, setCustomerPhone] = useState('+91 98201 99214');
  const [packageItem, setPackageItem] = useState('Apple AirPods Pro (2nd Gen)');
  const [destinationAddress, setDestinationAddress] = useState('Flat 402, Block C, Lajpat Nagar IV');
  const [destinationPincode, setDestinationPincode] = useState('110024');
  const [destLat, setDestLat] = useState('28.5682');
  const [destLng, setDestLng] = useState('77.2438');
  const [packageSize, setPackageSize] = useState<'SMALL' | 'MEDIUM' | 'LARGE'>('SMALL');
  const [dispatchFeedback, setDispatchFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // New Store Onboarding Form State
  const [isAddingStore, setIsAddingStore] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPincode, setNewPincode] = useState('110024');
  const [newAddress, setNewAddress] = useState('');
  const [newCapacity, setNewCapacity] = useState('40');
  const [storeFeedback, setStoreFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // AI Matching Algorithm Sensitivity Parameters
  const [proximityWeight, setProximityWeight] = useState(10);
  const [capacityWeight, setCapacityWeight] = useState(5);
  const [ratingBonus, setRatingBonus] = useState(3);

  const simulatedCoords = {
    latitude: parseFloat(destLat) || 28.5680,
    longitude: parseFloat(destLng) || 77.2432,
  };

  const rankedCandidateStores = findBestKiranaStores(
    simulatedCoords,
    destinationPincode,
    stores
  );

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playScanBeep();
    const res = createAndDispatchParcel({
      customerName,
      customerPhone,
      packageItem,
      destinationAddress,
      destinationPincode,
      destinationCoords: simulatedCoords,
      packageSize,
    });

    setDispatchFeedback(res);
    if (res.success) {
      setTimeout(() => setDispatchFeedback(null), 4000);
    }
  };

  const handleAddStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName || !newOwnerName) return;

    const res = registerKiranaStore({
      storeName: newStoreName,
      ownerName: newOwnerName,
      phone: newPhone || '+91 99000 11223',
      pincode: newPincode,
      address: newAddress || 'Main Market Road',
      city: 'New Delhi',
      maxCapacity: parseInt(newCapacity) || 40,
    });

    setStoreFeedback(res);
    if (res.success) {
      setIsAddingStore(false);
      setNewStoreName('');
      setNewOwnerName('');
      setTimeout(() => setStoreFeedback(null), 4000);
    }
  };

  // Cost Savings ROI Model Calculations
  const completedCount = parcels.filter((p) => p.status === 'COLLECTED').length;
  const doorstepCostPerUnit = 60; // ₹60 per doorstep drop attempt (incl. repeats)
  const kiranaConnectCostPerUnit = 22; // ₹15 merchant + ₹7 platform
  const savingsPerParcel = doorstepCostPerUnit - kiranaConnectCostPerUnit;
  const totalCostSaved = (completedCount + parcels.length) * savingsPerParcel;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow">
            <LayoutDashboard className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">
                {language === 'hi' ? 'लॉजिस्टिक्स कंट्रोल टॉवर' : 'Logistics Command & ONDC Dispatch Hub'}
              </h2>
              <span className="bg-purple-500/20 text-purple-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-purple-500/30">
                PUDO AI Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              13M+ Kirana Infrastructure Routing & Real-time Doorstep Failure Prevention
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddingStore(!isAddingStore)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-4 py-2.5 rounded-2xl text-xs shadow-lg shadow-purple-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard Partner Kirana (KYC)</span>
        </button>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Verified PUDO Hubs</span>
            <Store className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-2xl font-black text-white">{stores.length} Stores</div>
          <div className="text-[11px] text-emerald-400 font-medium">100% KYC Verified & Active</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>RTO Failure Reduction</span>
            <TrendingDown className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">~24.8% Saved</div>
          <div className="text-[11px] text-slate-400">Industry avg: 18-25% failed</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>3PL Net Cost Savings</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">₹{totalCostSaved.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-emerald-400 font-medium">₹38 saved per parcel drop</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Merchant Payouts</span>
            <IndianRupee className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">
            ₹{payoutLogs.reduce((a, b) => a + b.amount, 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-purple-300 font-medium">Instant UPI settlements</div>
        </div>
      </div>

      {/* Doorstep vs. KiranaConnect ROI Breakdown Matrix */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Economic Unit Economics: Traditional Doorstep vs. KiranaConnect PUDO</span>
          </h3>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            63% COST REDUCTION
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Traditional Doorstep */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-red-500/30 space-y-2">
            <div className="flex justify-between font-bold text-red-400">
              <span>Traditional Doorstep Drop (High Risk)</span>
              <span>₹60 - ₹75 / drop</span>
            </div>
            <ul className="space-y-1 text-slate-400 text-[11px]">
              <li>❌ 18-25% Failed deliveries (door locked, customer at office)</li>
              <li>❌ ₹120+ RTO Return To Origin penalty per failed attempt</li>
              <li>❌ 15 mins wasted per drop in congested narrow lanes</li>
            </ul>
          </div>

          {/* KiranaConnect PUDO */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-emerald-500/40 space-y-2">
            <div className="flex justify-between font-bold text-emerald-400">
              <span>KiranaConnect PUDO Hub (Zero Failure)</span>
              <span>₹22 Total Cost</span>
            </div>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              <li>✅ 0% Failed Drops (Always accepted at trusted local dukan)</li>
              <li>✅ ₹15 Direct micro-income for local store merchant</li>
              <li>✅ Batch drop (Rider drops 10 parcels in 1 stop in 3 mins)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Split: Left = Smart Matching & Order Dispatch, Right = Live Radar & Tuner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Dispatch Order Studio (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-brand-400" />
              <h3 className="text-base font-bold text-white">Smart Kirana Dispatch Studio</h3>
            </div>
            <span className="text-[11px] text-slate-400">Haversine Matching Engine</span>
          </div>

          <form onSubmit={handleDispatch} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Recipient Name:</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Customer Phone:</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Package Item / SKU:</label>
              <input
                type="text"
                value={packageItem}
                onChange={(e) => setPackageItem(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-semibold mb-1">Delivery Address:</label>
                <input
                  type="text"
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">PIN Code:</label>
                <input
                  type="text"
                  value={destinationPincode}
                  onChange={(e) => setDestinationPincode(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Latitude:</label>
                <input
                  type="text"
                  value={destLat}
                  onChange={(e) => setDestLat(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Longitude:</label>
                <input
                  type="text"
                  value={destLng}
                  onChange={(e) => setDestLng(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Package Size:</label>
                <select
                  value={packageSize}
                  onChange={(e) => setPackageSize(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-brand-500"
                >
                  <option value="SMALL">Small Box (&lt;1 kg)</option>
                  <option value="MEDIUM">Medium Box (1-5 kg)</option>
                  <option value="LARGE">Large Box (5-10 kg)</option>
                </select>
              </div>
            </div>

            {dispatchFeedback && (
              <div
                className={`p-3 rounded-xl flex items-start space-x-2 text-xs font-semibold ${
                  dispatchFeedback.success
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                    : 'bg-red-950/80 text-red-300 border border-red-500/40'
                }`}
              >
                {dispatchFeedback.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <span>{dispatchFeedback.message}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-400 hover:to-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-brand-500/20 flex items-center justify-center space-x-2 transition"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>Auto-Match & Dispatch to Optimal Kirana Hub</span>
            </button>
          </form>
        </div>

        {/* Right: Live Interactive Radar & Store Candidates (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Interactive Radar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span>Active Network Coverage & Geofence Map</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">100% Hub Uptime</span>
            </div>
            <InteractiveMap stores={stores} />
          </div>

          {/* Candidate Ranked Stores */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider">
              Algorithm Recommendation Ranking:
            </h4>
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {rankedCandidateStores.map((res, index) => {
                const isTopPick = index === 0 && res.hasCapacity;
                return (
                  <div
                    key={res.store.id}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                      isTopPick
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200 font-semibold'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
                    }`}
                  >
                    <div>
                      <div className="text-white font-bold">{res.store.storeName}</div>
                      <div className="text-[10px] text-slate-400">{res.matchReason}</div>
                    </div>
                    <div className="text-right font-mono font-bold text-brand-400">
                      {res.distanceKm} km
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
