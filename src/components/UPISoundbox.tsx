import React, { useState } from 'react';
import { Volume2, Wifi, Zap, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundEffects } from '../lib/soundEffects';

interface UPISoundboxProps {
  storeName: string;
  lastAmount?: number;
}

export const UPISoundbox: React.FC<UPISoundboxProps> = ({
  storeName,
  lastAmount = 15,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTestVoice = (lang: 'hi' | 'en') => {
    setIsPlaying(true);
    soundEffects.playCashRegister();
    setTimeout(() => {
      soundEffects.speakUpiAlert(lastAmount, storeName, lang);
      setTimeout(() => setIsPlaying(false), 2500);
    }, 400);
  };

  return (
    <div className="bg-gradient-to-b from-[#111927] to-[#0a0e17] rounded-3xl p-5 border-2 border-emerald-500/40 shadow-[0_10px_30px_rgba(16,185,129,0.15)] relative overflow-hidden">
      {/* Top Soundbox Header with Status LEDs */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-xs shadow">
            ₹
          </div>
          <span className="font-extrabold text-xs text-white tracking-wide uppercase">
            Kirana<span className="text-emerald-400">Voice</span> Soundbox
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
            <Wifi className="w-3 h-3" /> 4G LTE
          </span>
          <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-emerald-500'}`} />
        </div>
      </div>

      {/* Simulated LCD Screen */}
      <div className="my-4 bg-[#05110d] border border-emerald-500/50 rounded-2xl p-3.5 shadow-inner text-center font-mono space-y-1">
        <div className="text-[10px] text-emerald-400/80 uppercase tracking-widest">
          UPI Instant Settlement
        </div>
        <div className="text-2xl font-black text-emerald-300 tracking-tight flex items-center justify-center gap-1">
          <span>₹{lastAmount}.00</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-[9px] text-emerald-500 font-bold truncate">
          COMMISSION CREDITED • INSTANT
        </div>
      </div>

      {/* Speaker Grille Styling */}
      <div className="flex items-center justify-center space-x-1.5 py-1 opacity-40">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className={`w-1 rounded-full bg-emerald-400 transition-all ${
              isPlaying ? 'animate-pulse h-4' : 'h-2'
            }`}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>

      {/* Trigger Broadcast Buttons */}
      <div className="mt-3 grid grid-cols-2 gap-2 pt-2">
        <button
          type="button"
          onClick={() => handleTestVoice('hi')}
          className="flex items-center justify-center space-x-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 py-2 rounded-xl text-xs font-bold transition active:scale-95 shadow"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>🔊 बोलें (हिंदी)</span>
        </button>

        <button
          type="button"
          onClick={() => handleTestVoice('en')}
          className="flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 py-2 rounded-xl text-xs font-bold transition active:scale-95 shadow"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>🔊 Voice (English)</span>
        </button>
      </div>
    </div>
  );
};
