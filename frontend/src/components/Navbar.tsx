import React from 'react';
import { useApp } from '../context/AppContext';
import { Store, Package, RefreshCw, Languages, ShieldCheck, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, setLanguage, stores, parcels, resetToDemoState } = useApp();

  const totalDelivered = parcels.filter((p) => p.status === 'COLLECTED').length;
  const activeParcels = parcels.filter((p) => p.status !== 'COLLECTED').length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center shadow-lg shadow-brand-500/20 text-white font-black text-xl">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-white">
                Kirana<span className="text-brand-500">Connect</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-400 border border-brand-500/30 rounded-full">
                PUDO 2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              {language === 'hi'
                ? 'भारत का भरोसेमंद किराना डिलीवरी नेटवर्क'
                : "India's Hyper-Local Last-Mile Logistics Network"}
            </p>
          </div>
        </div>

        {/* Live Network Quick Pills */}
        <div className="hidden md:flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
            <Store className="w-4 h-4 text-brand-400" />
            <span className="text-slate-300 font-medium">
              <strong className="text-white">{stores.length}</strong> Partner Hubs
            </span>
          </div>

          <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
            <Package className="w-4 h-4 text-blue-400" />
            <span className="text-slate-300 font-medium">
              <strong className="text-white">{activeParcels}</strong> Active | <strong className="text-emerald-400">{totalDelivered}</strong> Picked Up
            </span>
          </div>

          <div className="flex items-center space-x-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1.5 rounded-lg border border-emerald-500/20 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>0% Failed Drops</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
            title="Switch Language / भाषा बदलें"
          >
            <Languages className="w-3.5 h-3.5 text-brand-400" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={() => {
              if (confirm('Reset application to original demo state?')) {
                resetToDemoState();
              }
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-red-950/40 text-slate-400 hover:text-red-300 border border-slate-700 hover:border-red-500/30 text-xs font-medium transition"
            title="Reset to fresh demo state"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
