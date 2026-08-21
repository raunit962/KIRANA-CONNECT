import React, { useState } from 'react';
import { KiranaStore, Parcel, Coordinates } from '../types';
import { Store, User, Bike, Navigation, Layers, Compass, Zap, MapPin } from 'lucide-react';

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
  const [activeLayer, setActiveLayer] = useState<'STANDARD' | 'GEOFENCE' | 'CAPACITY'>('STANDARD');

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
    <div className="relative w-full h-80 sm:h-96 bg-[#090d16] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
      {/* Map Grid Background */}
      <div 
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, #1e293b 1px, transparent 1px),
            linear-gradient(to bottom, #1e293b 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Radial ambient glow */}
      <div className="absolute inset-0 bg-radial-gradient from-brand-500/10 via-transparent to-transparent pointer-events-none" />

      {/* SVG Canvas for Vector Lines, Geofences & Paths */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 400">
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="1" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
          </linearGradient>

          <pattern id="dotPattern" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#334155" />
          </pattern>
        </defs>

        {/* Connective Delivery Route Polyline */}
        <path
          d={`M ${custSvg.x} ${custSvg.y} Q ${riderSvg.x} ${riderSvg.y} ${storeSvg.x} ${storeSvg.y}`}
          fill="none"
          stroke="url(#routeGradient)"
          strokeWidth="3"
          strokeDasharray="6 4"
          className="animate-pulse"
        />

        {/* Geofence Radii for Stores */}
        {stores.map((store) => {
          const coords = getSvgCoords(store.latitude, store.longitude);
          const isSelected = store.id === activeStore.id;
          const utilization = store.currentCapacity / store.maxCapacity;

          let ringColor = '#10b981';
          if (utilization >= 0.85) ringColor = '#ef4444';
          else if (utilization >= 0.6) ringColor = '#f59e0b';

          return (
            <g key={`geofence-${store.id}`}>
              {/* Geofence 500m circle */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r={isSelected ? 45 : 32}
                fill={ringColor}
                fillOpacity={activeLayer === 'GEOFENCE' ? 0.18 : 0.06}
                stroke={ringColor}
                strokeWidth={isSelected ? '1.5' : '0.75'}
                strokeDasharray={isSelected ? '4 2' : 'none'}
              />
              {/* Proximity line to customer */}
              {isSelected && (
                <line
                  x1={custSvg.x}
                  y1={custSvg.y}
                  x2={coords.x}
                  y2={coords.y}
                  stroke="#f97316"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.6"
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
            <div className="w-8 h-8 rounded-full bg-sky-500/20 border-2 border-sky-400 flex items-center justify-center text-sky-300 shadow-[0_0_15px_#38bdf8] animate-pulse">
              <User className="w-4 h-4" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-sky-400 border border-slate-900" />
          </div>
          <div className="mt-1 bg-slate-900/90 text-sky-300 border border-sky-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full shadow whitespace-nowrap">
            📍 Godrej Waterside (Sector V)
          </div>
        </div>

        {/* Live Rider Marker */}
        {showRiderTrack && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-30"
            style={{ left: `${(riderSvg.x / 600) * 100}%`, top: `${(riderSvg.y / 400) * 100}%` }}
          >
            <div className="w-8 h-8 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-[0_0_20px_#f59e0b] border-2 border-white animate-bounce">
              <Bike className="w-4 h-4" />
            </div>
            <div className="bg-amber-500 text-slate-950 text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md shadow mt-0.5 tracking-tight">
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
                className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-all ${
                  isSelected
                    ? 'bg-brand-500 text-white ring-4 ring-brand-500/30 scale-110 shadow-brand-500/50'
                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-brand-500/50'
                }`}
              >
                <Store className="w-5 h-5" />
              </div>

              {/* Tag tooltip */}
              <div
                className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-lg border shadow-lg whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-slate-900 text-brand-400 border-brand-500 font-extrabold'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800'
                }`}
              >
                <span>{store.storeName.split(' ')[0]}</span>
                <span className="ml-1 text-[9px] text-emerald-400">({percent}%)</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Control Overlay */}
      <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-2xl flex items-center space-x-2 text-xs text-slate-300 shadow-xl">
        <Compass className="w-4 h-4 text-brand-400" />
        <span className="font-bold">Salt Lake Sector V, Kolkata (PIN 700091)</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
      </div>

      {/* Layer Toggles */}
      <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-1.5 rounded-xl flex items-center space-x-1 text-[11px] shadow-xl">
        <button
          onClick={() => setActiveLayer('STANDARD')}
          className={`px-2.5 py-1 rounded-lg font-semibold transition ${
            activeLayer === 'STANDARD' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Routing
        </button>
        <button
          onClick={() => setActiveLayer('GEOFENCE')}
          className={`px-2.5 py-1 rounded-lg font-semibold transition ${
            activeLayer === 'GEOFENCE' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
          }`}
        >
          500m Geofence
        </button>
      </div>
    </div>
  );
};
