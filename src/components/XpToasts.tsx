import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Flame, Sparkles } from 'lucide-react';

export const XpToasts: React.FC = () => {
  const { xpToasts } = useApp();

  if (xpToasts.length === 0) return null;

  return (
    <div className="fixed top-24 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-xs">
      {xpToasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-bounce bg-[#0D0D14]/95 border-2 border-[#39FF14] text-white p-3 rounded-2xl shadow-[0_0_20px_rgba(57,255,20,0.5)] flex items-center gap-3 backdrop-blur-md"
        >
          <div className="w-9 h-9 rounded-xl bg-[#39FF14] text-black flex items-center justify-center font-black font-orbitron text-xs flex-shrink-0 shadow-md">
            +{toast.amount}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#39FF14] uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>XP GANHO!</span>
            </div>
            <p className="text-xs text-gray-200 font-medium truncate">{toast.reason}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
