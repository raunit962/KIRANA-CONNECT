import React, { useState } from 'react';
import { KiranaStore, Parcel, Coordinates } from '../types';
import { Store, User, Bike, Navigation, Layers, Compass, Zap, MapPin, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface InteractiveMapProps {
  stores: KiranaStore[];
  activeParcel?: Parcel;
  selectedStoreId?: string;
  onSelectStore?: (storeId: string) => void;
  showRiderTrack?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  stores,
  activeParcel,
  selectedStoreId,
  onSelectStore,
  showRiderTrack = true,
}) => {
  const [activeLayer, setActiveLayer] = useState<'STANDARD' | 'DOORSTEP_TRAFFIC' | 'GEOFENCE'>('STANDARD');

  // Customer location or default center (Salt Lake Sector V, Kolkata)
  const customerLoc: Coordinates = activeParcel?.destinationCoords || {
    latitude: 22.5815,
    longitude: 88.4385,
  };

  // Map Center: Salt Lake Sector V, Kolkata (Lat: 22.5804, Lng: 88.4378)
  const centerLat = 22.5804;
  const centerLng = 88.4378;
  const scale = 22000; // Zoom scale factor for hyper-local neighborhood

  const getSvgCoords = (lat: number, lng: number) => {
    const x = 300 + (lng - centerLng) * scale;
    const y = 200 - (lat - centerLat) * scale;
    return {
      x: Math.max(30, Math.min(570, x)),
      y: Math.max(30, Math.min(370, y)),
    };
  };

  const custSvg = getSvgCoords(customerLoc.latitude, customerLoc.longitude);
  const activeStore = stores.find((s) => s.id === (selectedStoreId || activeParcel?.kiranaStoreId)) || stores[0];
  const storeSvg = getSvgCoords(activeStore.latitude, activeStore.longitude);

  // Rider intermediate position (simulated between hub & store)
  const riderSvg = {
    x: (custSvg.x + storeSvg.x) / 2 + 35,
    y: (custSvg.y + storeSvg.y) / 2 - 25,
  };

  return (
    <div className="relative w-full h-84 sm:h-[400px] bg-[#07130E] rounded-3xl overflow-hidden border border-[#CDE3D5] shadow-sm group">
      {/* Map Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #1A5336 1px, transparent 1px),
            linear-gradient(to bottom, #1A5336 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Radial ambient glow */}
      <div className="absolute inset-0 bg-radial-gradient from-[#1A5336]/25 via-transparent to-transparent pointer-events-none" />

      {/* SVG Canvas for Vector Lines, Geofences & Paths */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 400">
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#fffd47" stopOpacity="1" />
            <stop offset="100%" stopColor="#16a34a" stopOpacity="1" />
          </linearGradient>

          <pattern id="dotPattern" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#4A5B52" />
          </pattern>
        </defs>

        {/* Mode 1: Consolidated Single PUDO Batch Drop Route */}
        {activeLayer !== 'DOORSTEP_TRAFFIC' && (
          <path
            d={`M ${custSvg.x} ${custSvg.y} Q ${riderSvg.x} ${riderSvg.y} ${storeSvg.x} ${storeSvg.y}`}
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="3.5"
            strokeDasharray="6 4"
            className="animate-pulse"
          />
        )}

        {/* Mode 2: Traditional Fragmented Doorstep Delivery (Simulating 15 stops, narrow lanes, traffic congestion) */}
        {activeLayer === 'DOORSTEP_TRAFFIC' && (
          <g>
            <path
              d="M 90 70 L 150 130 L 190 85 L 260 140 L 230 220 L 310 270 L 390 230 L 460 300 L 510 240 L 440 130 L 370 85 L 280 50 L 170 65 Z"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2.5"
              strokeDasharray="5 4"
              className="animate-pulse"
            />
            {/* Failed delivery red markers */}
            <circle cx="190" cy="85" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="310" cy="270" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="460" cy="300" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="170" cy="65" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
          </g>
        )}

        {/* Geofence Radii for Stores */}
        {stores.map((store) => {
          const coords = getSvgCoords(store.latitude, store.longitude);
          const isSelected = store.id === activeStore.id;
          const utilization = store.currentCapacity / store.maxCapacity;

          let ringColor = '#16a34a';
          if (utilization >= 0.85) ringColor = '#ef4444';
          else if (utilization >= 0.6) ringColor = '#F5A623';

          return (
            <g key={`geofence-${store.id}`}>
              {/* Geofence 500m circle */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r={isSelected ? 45 : 32}
                fill={ringColor}
                fillOpacity={activeLayer === 'GEOFENCE' ? 0.22 : 0.06}
                stroke={ringColor}
                strokeWidth={isSelected ? '1.5' : '0.75'}
                strokeDasharray={isSelected ? '4 2' : 'none'}
              />
              {/* Proximity line to customer */}
              {isSelected && activeLayer !== 'DOORSTEP_TRAFFIC' && (
                <line
                  x1={custSvg.x}
                  y1={custSvg.y}
                  x2={coords.x}
                  y2={coords.y}
                  stroke="#fffd47"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  opacity="0.8"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* HTML Markers layer */}
      <div className="absolute inset-0 pointer-events-auto">
        {/* Customer Location Marker */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-20"
          style={{ left: `${(custSvg.x / 600) * 100}%`, top: `${(custSvg.y / 400) * 100}%` }}
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#0F291E] border-2 border-[#38BDF8] flex items-center justify-center text-[#38BDF8] shadow-md animate-pulse">
              <User className="w-4 h-4" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#fffd47] border border-white" />
          </div>
          <div className="mt-1 bg-[#0F291E]/95 text-[#F8F5EF] border border-[#38BDF8]/40 text-[10px] font-bold px-2 py-0.5 rounded-full shadow whitespace-nowrap">
            📍 Godrej Waterside (Sector V)
          </div>
        </div>

        {/* Live Rider Marker */}
        {showRiderTrack && activeLayer !== 'DOORSTEP_TRAFFIC' && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-30"
            style={{ left: `${(riderSvg.x / 600) * 100}%`, top: `${(riderSvg.y / 400) * 100}%` }}
          >
            <div className="w-8 h-8 rounded-2xl bg-[#1A5336] text-[#fffd47] flex items-center justify-center font-bold shadow-md border-2 border-[#fffd47] animate-bounce">
              <Bike className="w-4 h-4" />
            </div>
            <div className="bg-[#1A5336] text-[#fffd47] text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md shadow mt-0.5 tracking-tight border border-[#fffd47]/30">
              Rider En-Route
            </div>
          </div>
        )}

        {/* Kirana Stores Markers */}
        {stores.map((store) => {
          const coords = getSvgCoords(store.latitude, store.longitude);
          const isSelected = store.id === activeStore.id;
          const percent = Math.round((store.currentCapacity / store.maxCapacity) * 100);

          return (
            <div
              key={store.id}
              onClick={() => onSelectStore && onSelectStore(store.id)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer transition-all duration-300 z-20 hover:scale-110"
              style={{ left: `${(coords.x / 600) * 100}%`, top: `${(coords.y / 400) * 100}%` }}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-all ${
                  isSelected
                    ? 'bg-[#1A5336] text-[#fffd47] ring-4 ring-[#fffd47]/40 scale-110 shadow-md border-2 border-[#fffd47]'
                    : 'bg-white text-[#0F291E] border border-[#CDE3D5] hover:border-[#1A5336]'
                }`}
              >
                <Store className="w-5 h-5" />
              </div>

              {/* Tag tooltip */}
              <div
                className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-lg border shadow-md whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-[#0F291E] text-[#F8F5EF] border-[#fffd47] font-extrabold'
                    : 'bg-white text-[#4A5B52] border-[#CDE3D5]'
                }`}
              >
                <span>{store.storeName.split(' ')[0]}</span>
                <span className={`ml-1 text-[9px] font-bold ${isSelected ? 'text-[#fffd47]' : 'text-[#1A5336]'}`}>({percent}%)</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Header Location Overlay */}
      <div className="absolute top-3 left-3 bg-[#0F291E]/95 backdrop-blur-md border border-[#1A5336] px-3 py-1.5 rounded-2xl flex items-center space-x-2 text-xs text-[#F8F5EF] shadow-md">
        <Compass className="w-4 h-4 text-[#fffd47]" />
        <span className="font-bold">Salt Lake Sector V, Kolkata (PIN 700091)</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#fffd47] animate-ping" />
      </div>

      {/* PS 26205 Route Comparison Alert Banner */}
      {activeLayer === 'DOORSTEP_TRAFFIC' ? (
        <div className="absolute top-12 left-3 right-3 bg-red-950/90 backdrop-blur-md border border-red-500/50 p-2.5 rounded-2xl text-xs text-red-200 flex flex-wrap items-center justify-between shadow-md z-30 animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>
              <strong>Traditional Doorstep Grid:</strong> 18.4 km across 15 zig-zag stops • 110 mins • 4 failed deliveries • High road congestion
            </span>
          </div>
          <span className="bg-red-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow">
            Severe Road Congestion
          </span>
        </div>
      ) : activeLayer === 'STANDARD' ? (
        <div className="absolute top-12 left-3 right-3 bg-[#0F291E]/90 backdrop-blur-md border border-[#1A5336] p-2.5 rounded-2xl text-xs text-[#F8F5EF] flex flex-wrap items-center justify-between shadow-md z-30 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#fffd47] flex-shrink-0" />
            <span>
              <strong className="text-[#fffd47]">KiranaConnect PUDO Route:</strong> Single Fallback Batch Drop (2.8 km, 12 mins) • Eliminates Multi-Day Re-attempts • ~60% Re-attempt Mileage Saved
            </span>
          </div>
          <span className="bg-[#1A5336] text-[#fffd47] font-black text-[10px] px-2 py-0.5 rounded-full shadow border border-[#fffd47]/30">
            Green Consolidated Route
          </span>
        </div>
      ) : null}

      {/* Layer Controls with SIH PS 26205 Route Comparison */}
      <div className="absolute bottom-3 right-3 bg-[#0F291E]/95 backdrop-blur-md border border-[#1A5336] p-1.5 rounded-2xl flex items-center space-x-1 text-[11px] shadow-md z-30">
        <button
          onClick={() => setActiveLayer('STANDARD')}
          className={`px-2.5 py-1 rounded-xl font-bold transition flex items-center gap-1 ${
            activeLayer === 'STANDARD' ? 'bg-[#1A5336] text-[#fffd47] shadow border border-[#fffd47]/30' : 'text-[#D1E7DD] hover:text-white'
          }`}
          title="Consolidated PUDO batch route"
        >
          <span>PUDO Batch (Green)</span>
        </button>
        <button
          onClick={() => setActiveLayer('DOORSTEP_TRAFFIC')}
          className={`px-2.5 py-1 rounded-xl font-bold transition flex items-center gap-1 ${
            activeLayer === 'DOORSTEP_TRAFFIC' ? 'bg-red-600 text-white shadow' : 'text-[#D1E7DD] hover:text-red-300'
          }`}
          title="Compare with fragmented doorstep delivery"
        >
          <span>Doorstep Traffic (Red)</span>
        </button>
        <button
          onClick={() => setActiveLayer('GEOFENCE')}
          className={`px-2.5 py-1 rounded-xl font-bold transition ${
            activeLayer === 'GEOFENCE' ? 'bg-[#38BDF8] text-[#0F291E] font-bold shadow' : 'text-[#D1E7DD] hover:text-white'
          }`}
          title="500m pedestrian walking radius"
        >
          <span>500m Walk Zone</span>
        </button>
      </div>
    </div>
  );
};
