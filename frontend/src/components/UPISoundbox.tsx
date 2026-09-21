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
    <div className="bg-[#0F291E] rounded-3xl p-5 border-2 border-[#1A5336] shadow-md relative overflow-hidden text-white">
      {/* Top Soundbox Header with Status LEDs */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1A5336]">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-[#1A5336] border border-[#fffd47]/30 flex items-center justify-center text-[#fffd47] font-black text-xs shadow-sm">
            ₹
          </div>
          <span className="font-extrabold text-xs text-[#F8F5EF] tracking-wide uppercase">
            Kirana<span className="text-[#fffd47]">Voice</span> Soundbox
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="flex items-center gap-1 text-[10px] text-[#0284C7] font-mono font-bold bg-[#E0F2FE] px-2 py-0.5 rounded-full border border-[#38BDF8]/40">
            <Wifi className="w-3 h-3" /> 4G LTE
          </span>
          <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-[#fffd47] animate-ping' : 'bg-[#16a34a]'}`} />
        </div>
      </div>

      {/* Simulated LCD Screen */}
      <div className="my-4 bg-[#F4F8F5] border border-[#CDE3D5] rounded-2xl p-3.5 shadow-inner text-center font-mono space-y-1">
        <div className="text-[10px] text-[#4A5B52] uppercase tracking-widest">
          UPI Instant Settlement
        </div>
        <div className="text-2xl font-black text-[#0F291E] tracking-tight flex items-center justify-center gap-1">
          <span>₹{lastAmount}.00</span>
          <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
        </div>
        <div className="text-[9px] text-[#1A5336] font-bold truncate">
          COMMISSION CREDITED • INSTANT
        </div>
      </div>

      {/* Speaker Grille Styling */}
      <div className="flex items-center justify-center space-x-1.5 py-1 opacity-70">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className={`w-1 rounded-full bg-[#fffd47] transition-all ${
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
          className="flex items-center justify-center space-x-1.5 bg-[#1A5336] hover:bg-[#133F28] text-[#fffd47] py-2 rounded-xl text-xs font-bold transition active:scale-95 shadow-sm border border-[#fffd47]/30"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>🔊 बोलें (हिंदी)</span>
        </button>

        <button
          type="button"
          onClick={() => handleTestVoice('en')}
          className="flex items-center justify-center space-x-1.5 bg-[#133827] hover:bg-[#1A5336] text-[#F8F5EF] border border-[#1A5336] py-2 rounded-xl text-xs font-bold transition active:scale-95 shadow-sm"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>🔊 Voice (English)</span>
        </button>
      </div>
    </div>
  );
};
