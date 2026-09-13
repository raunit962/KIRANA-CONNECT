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
  const [destinationAddress, setDestinationAddress] = useState('Tower 2, Godrej Genesis, EP Block, Sector V, Salt Lake');
  const [destinationPincode, setDestinationPincode] = useState('700091');
  const [destLat, setDestLat] = useState('22.5815');
  const [destLng, setDestLng] = useState('88.4385');
  const [packageSize, setPackageSize] = useState<'SMALL' | 'MEDIUM' | 'LARGE'>('SMALL');
  const [dispatchFeedback, setDispatchFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // New Store Onboarding Form State
  const [isAddingStore, setIsAddingStore] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPincode, setNewPincode] = useState('700091');
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
      <div className="bg-[#EFE8DC] border border-[#D8C3A5] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#D8C3A5]/40 border border-[#D8C3A5] flex items-center justify-center text-[#B85C38] shadow-xs">
            <LayoutDashboard className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-[#171717]">
                {language === 'hi' ? 'लॉजिस्टिक्स कंट्रोल टॉवर' : 'Logistics Command & ONDC Dispatch Hub'}
              </h2>
              <span className="bg-[#D8C3A5]/50 text-[#171717] text-[10px] font-black px-2.5 py-0.5 rounded-full border border-[#D8C3A5]">
                PUDO AI Engine
              </span>
            </div>
            <p className="text-xs text-[#786F67] mt-0.5">
              13M+ Kirana Infrastructure Routing & Real-time Doorstep Failure Prevention
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddingStore(!isAddingStore)}
          className="flex items-center space-x-2 bg-[#B85C38] hover:bg-[#A94D2F] text-white font-bold px-4 py-2.5 rounded-2xl text-xs shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard Partner Kirana (KYC)</span>
        </button>
      </div>

      {/* SIH PS 26205 Smart City & Urban Transport Telemetry HUD */}
      <div className="bg-[#EFE8DC] border border-[#D8C3A5] rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#D8C3A5] pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-[#171717] font-black text-[10px] bg-[#D8C3A5]/50 px-2.5 py-0.5 rounded-full border border-[#D8C3A5] uppercase tracking-wider">
              SIH 2026 • PS ID: 26205
            </span>
            <h3 className="font-extrabold text-sm text-[#171717] flex items-center gap-1.5">
              <span>🌱</span>
              <span>NEIGHBOURHOOD GREEN FOOTPRINT TRACKER</span>
            </h3>
          </div>
          <span className="text-[11px] text-[#B85C38] font-bold bg-[#D8C3A5]/40 px-2.5 py-0.5 rounded-full border border-[#D8C3A5]">
            Logistics Relief Telemetry • Kolkata Sector V
          </span>
        </div>

        {/* Feature Context Description */}
        <p className="text-xs text-[#786F67] leading-relaxed bg-[#F8F5EF] p-3 rounded-2xl border border-[#D8C3A5]">
          <strong className="text-[#171717]">Neighbourhood Green Footprint Tracker:</strong> Estimates the environmental impact of local pickup by tracking repeat delivery trips avoided, vehicle kilometers reduced &amp; established CO₂ emissions avoided, providing customers a measurable view of their contribution to a greener last mile logistics.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-[#F8F5EF] p-3 rounded-xl border border-[#D8C3A5] space-y-1">
            <div className="text-[#786F67] text-[11px]">Repeat Delivery Trips Avoided</div>
            <div className="text-xl font-black text-[#171717]">142 Trips</div>
            <div className="text-[10px] text-[#786F67]">Eliminates multi-day re-attempt loops</div>
          </div>
          <div className="bg-[#F8F5EF] p-3 rounded-xl border border-[#D8C3A5] space-y-1">
            <div className="text-[#786F67] text-[11px]">Vehicle Kilometers Reduced</div>
            <div className="text-xl font-black text-[#171717]">13.1 km</div>
            <div className="text-[10px] text-[#786F67]">Cuts 50-60% of repeat courier miles</div>
          </div>
          <div className="bg-[#F8F5EF] p-3 rounded-xl border border-[#D8C3A5] space-y-1">
            <div className="text-[#786F67] text-[11px]">Established CO₂ Avoided</div>
            <div className="text-xl font-black text-[#B85C38]">7.6 kg CO₂</div>
            <div className="text-[10px] text-[#786F67]">~0.23 kg CO₂/km 2-wheeler savings</div>
          </div>
          <div className="bg-[#F8F5EF] p-3 rounded-xl border border-[#D8C3A5] space-y-1">
            <div className="text-[#786F67] text-[11px]">Central Warehouse RTO Relief</div>
            <div className="text-xl font-black text-[#171717]">~71% RTO Cut</div>
            <div className="text-[10px] text-[#786F67]">Reduces holding backlog from 22% to &lt;6%</div>
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#EFE8DC] border border-[#D8C3A5] rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#786F67] text-xs">
            <span>Verified Kiranas</span>
            <Store className="w-4 h-4 text-[#B85C38]" />
          </div>
          <div className="text-2xl font-black text-[#171717]">{stores.length} Stores</div>
          <div className="text-[11px] text-[#B85C38] font-medium">Tiered KYC Verified & Active</div>
        </div>

        <div className="bg-[#EFE8DC] border border-[#D8C3A5] rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#786F67] text-xs">
            <span>NDR Recovery Rate</span>
            <TrendingDown className="w-4 h-4 text-[#B85C38]" />
          </div>
          <div className="text-2xl font-black text-[#171717]">~71% Picked Up</div>
          <div className="text-[11px] text-[#786F67]">Industry avg: 18-20% failed</div>
        </div>

        <div className="bg-[#EFE8DC] border border-[#D8C3A5] rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#786F67] text-xs">
            <span>3PL Net Cost Savings</span>
            <Coins className="w-4 h-4 text-[#B85C38]" />
          </div>
          <div className="text-2xl font-black text-[#171717]">₹{totalCostSaved.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-[#B85C38] font-medium">₹38 saved for 3 re-attempt cycles</div>
        </div>

        <div className="bg-[#EFE8DC] border border-[#D8C3A5] rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#786F67] text-xs">
            <span>Merchant Payout</span>
            <IndianRupee className="w-4 h-4 text-[#B85C38]" />
          </div>
          <div className="text-2xl font-black text-[#171717]">
            ₹{payoutLogs.reduce((a, b) => a + b.amount, 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#786F67] font-medium">Instant UPI settlements</div>
        </div>
      </div>

      {/* Doorstep vs. KiranaConnect ROI & Urban Transport Relief Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Economic Unit Economics */}
        <div className="bg-[#EFE8DC] border border-[#D8C3A5] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#D8C3A5] pb-3">
            <h3 className="font-extrabold text-sm text-[#171717] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#B85C38]" />
              <span>Unit Economics: Doorstep vs PUDO</span>
            </h3>
            <span className="text-[10px] font-bold text-white bg-[#B85C38] px-2.5 py-0.5 rounded-full shadow-xs">
              Significant COST CUT
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-[#F8F5EF] p-3.5 rounded-2xl border border-red-300 space-y-1.5">
              <div className="flex justify-between font-bold text-red-700">
                <span>Traditional Doorstep</span>
                <span>₹40-60</span>
              </div>
              <ul className="space-y-1 text-[#786F67] text-[11px]">
                <li>❌ 18-20% Failed doorstep drops</li>
                <li>❌ ₹80+ RTO penalty per return</li>
                <li>❌ High fuel & delivery re-attempts</li>
              </ul>
            </div>

            <div className="bg-[#F8F5EF] p-3.5 rounded-2xl border border-[#D8C3A5] space-y-1.5">
              <div className="flex justify-between font-bold text-[#171717]">
                <span>KiranaConnect PUDO</span>
                <span className="text-[#B85C38]">₹22.00</span>
              </div>
              <ul className="space-y-1 text-[#786F67] text-[11px]">
                <li>✅ 72%+ Customer Retrieval (&lt;4% RTO)</li>
                <li>✅ ₹15 Direct to Kirana UPI wallet</li>
                <li>✅ Batch drop 15 parcels in 15 mins</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Card 2: SIH PS 26205 Urban Transport & Logistics Relief */}
        <div className="bg-[#EFE8DC] border border-[#D8C3A5] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#D8C3A5] pb-3">
            <h3 className="font-extrabold text-sm text-[#171717] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#B85C38]" />
              <span>Urban Transport & Infrastructure Relief</span>
            </h3>
            <span className="text-[10px] font-bold text-white bg-[#B85C38] px-2.5 py-0.5 rounded-full shadow-xs">
              ~70% RE-ATTEMPT VMT CUT
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-[#F8F5EF] p-3.5 rounded-2xl border border-red-300 space-y-1.5">
              <div className="flex justify-between font-bold text-red-700">
                <span>Doorstep Traffic Impact</span>
                <span>Choked Roads</span>
              </div>
              <ul className="space-y-1 text-[#786F67] text-[11px]">
                <li>🚦 15 separate bikes clogging lanes</li>
                <li>🛣️ 18.4 km total travel per cluster</li>
                <li>🏢 Sorting hubs clogged with RTOs</li>
              </ul>
            </div>

            <div className="bg-[#F8F5EF] p-3.5 rounded-2xl border border-[#D8C3A5] space-y-1.5">
              <div className="flex justify-between font-bold text-[#171717]">
                <span>KIRANA Grid Impact</span>
                <span className="text-[#B85C38]">Clean Traffic</span>
              </div>
              <ul className="space-y-1 text-[#786F67] text-[11px]">
                <li>🟢 1 single courier drop run (2.8 km)</li>
                <li>🚶 ~70% within 400m walking radius</li>
                <li>🏢 Sorting hubs freed from failed loops</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split: Left = Smart Matching & Order Dispatch, Right = Live Radar & Tuner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Dispatch Order Studio (6 Cols) */}
        <div className="lg:col-span-6 bg-[#EFE8DC] border border-[#D8C3A5] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#D8C3A5] pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#B85C38]" />
              <h3 className="text-base font-bold text-[#171717]">Smart Kirana Dispatch Studio</h3>
            </div>
            <span className="text-[11px] text-[#786F67]">Haversine Matching Engine</span>
          </div>

          <form onSubmit={handleDispatch} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#786F67] font-semibold mb-1">Recipient Name:</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#F8F5EF] border border-[#D8C3A5] rounded-xl px-3 py-2 text-[#171717] text-xs focus:outline-none focus:border-[#B85C38]"
                />
              </div>

              <div>
                <label className="block text-[#786F67] font-semibold mb-1">Customer Phone:</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#F8F5EF] border border-[#D8C3A5] rounded-xl px-3 py-2 text-[#171717] text-xs focus:outline-none focus:border-[#B85C38]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#786F67] font-semibold mb-1">Package Item / SKU:</label>
              <input
                type="text"
                value={packageItem}
                onChange={(e) => setPackageItem(e.target.value)}
                className="w-full bg-[#F8F5EF] border border-[#D8C3A5] rounded-xl px-3 py-2 text-[#171717] text-xs focus:outline-none focus:border-[#B85C38]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[#786F67] font-semibold mb-1">Delivery Address:</label>
                <input
                  type="text"
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  className="w-full bg-[#F8F5EF] border border-[#D8C3A5] rounded-xl px-3 py-2 text-[#171717] text-xs focus:outline-none focus:border-[#B85C38]"
                />
              </div>

              <div>
                <label className="block text-[#786F67] font-semibold mb-1">PIN Code:</label>
                <input
                  type="text"
                  value={destinationPincode}
                  onChange={(e) => setDestinationPincode(e.target.value)}
                  className="w-full bg-[#F8F5EF] border border-[#D8C3A5] rounded-xl px-3 py-2 text-[#171717] text-xs focus:outline-none focus:border-[#B85C38]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[#786F67] font-semibold mb-1">Latitude:</label>
                <input
                  type="text"
                  value={destLat}
                  onChange={(e) => setDestLat(e.target.value)}
                  className="w-full bg-[#F8F5EF] border border-[#D8C3A5] rounded-xl px-3 py-2 text-[#171717] text-xs font-mono focus:outline-none focus:border-[#B85C38]"
                />
              </div>

              <div>
                <label className="block text-[#786F67] font-semibold mb-1">Longitude:</label>
                <input
                  type="text"
                  value={destLng}
                  onChange={(e) => setDestLng(e.target.value)}
                  className="w-full bg-[#F8F5EF] border border-[#D8C3A5] rounded-xl px-3 py-2 text-[#171717] text-xs font-mono focus:outline-none focus:border-[#B85C38]"
                />
              </div>

              <div>
                <label className="block text-[#786F67] font-semibold mb-1">Package Size:</label>
                <select
                  value={packageSize}
                  onChange={(e) => setPackageSize(e.target.value as any)}
                  className="w-full bg-[#F8F5EF] border border-[#D8C3A5] rounded-xl px-3 py-2 text-[#171717] text-xs focus:outline-none focus:border-[#B85C38]"
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
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}
              >
                {dispatchFeedback.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <span>{dispatchFeedback.message}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#B85C38] hover:bg-[#A94D2F] text-white font-bold text-sm rounded-2xl shadow-sm flex items-center justify-center space-x-2 transition"
            >
              <Send className="w-4 h-4 text-white" />
              <span>Auto-Match & Dispatch to Optimal Kirana Hub</span>
            </button>
          </form>
        </div>

        {/* Right: Live Interactive Radar & Store Candidates (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Interactive Radar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#171717] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#B85C38]" />
                <span>Active Network Coverage & Geofence Map</span>
              </span>
              <span className="text-[10px] text-[#B85C38] font-bold">100% Hub Uptime</span>
            </div>
            <InteractiveMap stores={stores} />
          </div>

          {/* Candidate Ranked Stores */}
          <div className="bg-[#EFE8DC] border border-[#D8C3A5] rounded-3xl p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-xs text-[#171717] uppercase tracking-wider">
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
                        ? 'bg-white border-[#B85C38] text-[#171717] font-semibold shadow-xs'
                        : 'bg-[#F8F5EF] border-[#D8C3A5] text-[#786F67]'
                    }`}
                  >
                    <div>
                      <div className="text-[#171717] font-bold">{res.store.storeName}</div>
                      <div className="text-[10px] text-[#786F67]">{res.matchReason}</div>
                    </div>
                    <div className="text-right font-mono font-bold text-[#B85C38]">
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
