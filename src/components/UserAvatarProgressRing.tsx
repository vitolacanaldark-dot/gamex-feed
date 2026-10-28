import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { calculateLevelProgress, calculateStrokeDashoffset } from '../utils/gamerLogic.ts';
import { Flame, Shield, Sparkles, Zap, ChevronUp } from 'lucide-react';

export const UserAvatarProgressRing: React.FC = () => {
  const { user, isLevelingUp, lastLevelUpNumber, xpGainTick, setActiveTab, activeTab } = useApp();
  const [showTooltip, setShowTooltip] = useState(false);
  const [pulseGain, setPulseGain] = useState(false);

  const progress = calculateLevelProgress(user.currentXp);
  
  // SVG Ring Dimensions
  const size = 48;
  const strokeWidth = 3;
  const radius = 20.5;
  const circumference = 2 * Math.PI * radius; // ~128.8
  const strokeDashoffset = calculateStrokeDashoffset(progress.progressPercentage, circumference);

  // Trigger pulse flash whenever user gains XP
  useEffect(() => {
    if (xpGainTick > 0) {
      setPulseGain(true);
      const timer = setTimeout(() => setPulseGain(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [xpGainTick]);

  return (
    <div
      className="relative flex items-center shrink-0"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        onClick={() => setActiveTab('profile')}
        className={`relative group flex items-center gap-2 p-1 rounded-full transition-all focus:outline-none shrink-0 ${
          activeTab === 'profile'
            ? 'bg-white/10 ring-1 ring-[#39FF14]/50'
            : 'hover:bg-white/5'
        }`}
        aria-label={`Perfil de ${user.name}, Nível ${progress.level}, ${progress.progressPercentage}% para o próximo nível`}
      >
        {/* Avatar + Progress Ring Container */}
        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
          
          {/* Level Up Celebratory Halo Waves */}
          {isLevelingUp && (
            <>
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#39FF14] to-[#00FFFF] opacity-75 blur-md animate-ping" />
              <span className="absolute -inset-1 rounded-full border-2 border-[#39FF14] animate-spin shadow-[0_0_20px_#39FF14]" />
            </>
          )}

          {/* XP Gain Flash Glow */}
          {pulseGain && !isLevelingUp && (
            <span className="absolute inset-0 rounded-full bg-[#39FF14]/30 blur-sm animate-pulse" />
          )}

          {/* SVG Circular Progress Ring */}
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="absolute inset-0 -rotate-90 pointer-events-none transform"
          >
            <defs>
              <linearGradient id="avatarProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#39FF14" />
                <stop offset="100%" stopColor="#00FFFF" />
              </linearGradient>
              <linearGradient id="avatarLevelUpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#39FF14" />
                <stop offset="100%" stopColor="#00FFFF" />
              </linearGradient>
              <filter id="neonProgressGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#39FF14" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* Background Track Circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth={strokeWidth}
            />

            {/* Animated Dynamic Progress Ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={isLevelingUp ? 'url(#avatarLevelUpGradient)' : 'url(#avatarProgressGradient)'}
              strokeWidth={isLevelingUp ? strokeWidth + 1 : strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              filter={pulseGain || isLevelingUp ? 'url(#neonProgressGlow)' : undefined}
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* User Avatar Image Inside Ring */}
          <img
            src={user.avatar}
            alt={user.name}
            className={`w-9 h-9 rounded-full object-cover ring-1 ring-black/80 transition-transform duration-300 ${
              isLevelingUp ? 'scale-105' : 'group-hover:scale-105'
            }`}
          />

          {/* Level Badge at bottom-right */}
          <span
            className={`absolute -bottom-0.5 -right-0.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full text-[9px] font-black transition-all duration-300 ${
              isLevelingUp
                ? 'bg-gradient-to-r from-[#FFD700] to-[#39FF14] text-black ring-2 ring-white scale-125 shadow-[0_0_12px_#FFD700] animate-bounce'
                : pulseGain
                ? 'bg-[#39FF14] text-black ring-2 ring-[#0A0A0E] scale-110 shadow-[0_0_8px_#39FF14]'
                : 'bg-[#0A0A0E] text-[#39FF14] ring-1 ring-[#39FF14]'
            }`}
          >
            {progress.level}
          </span>
        </div>

        {/* User Info (Visible on large screens) */}
        <div className="text-left hidden 2xl:block shrink-0 pr-1">
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-white max-w-[85px] truncate group-hover:text-[#39FF14] transition-colors">
              {user.name}
            </span>
            {user.isVerified && (
              <Shield className="w-3 h-3 text-[#00FFFF] fill-[#00FFFF]/20" />
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="text-[#39FF14] font-semibold flex items-center gap-0.5">
              <Flame className="w-3 h-3" />
              {user.currentXp} XP
            </span>
            <span className="text-gray-400 font-medium">({progress.progressPercentage}%)</span>
          </div>
        </div>
      </button>

      {/* Celebratory 'LEVEL UP' Popover Banner */}
      {isLevelingUp && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in zoom-in-75 duration-300">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#FFD700] via-[#39FF14] to-[#00FFFF] text-black font-black text-[10px] uppercase tracking-wider shadow-[0_0_20px_rgba(57,255,20,0.8)] border border-white animate-bounce whitespace-nowrap">
            <Zap className="w-3 h-3 fill-black animate-spin" />
            <span>LEVEL UP! NVL {lastLevelUpNumber || progress.level}</span>
          </div>
        </div>
      )}

      {/* Floating Gain Pill when XP received in community feed */}
      {pulseGain && !isLevelingUp && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#39FF14] text-black font-black text-[9px] shadow-[0_0_10px_#39FF14] whitespace-nowrap">
            <ChevronUp className="w-3 h-3 stroke-[3]" />
            XP UP!
          </span>
        </div>
      )}

      {/* Interactive Tooltip on Hover */}
      {showTooltip && !isLevelingUp && (
        <div className="absolute top-14 right-0 z-50 w-64 p-3 rounded-xl bg-[#0D0D14]/98 border border-[#39FF14]/40 shadow-[0_10px_30px_rgba(0,0,0,0.9),0_0_15px_rgba(57,255,20,0.2)] text-left pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between gap-2 mb-1.5 pb-1.5 border-b border-white/10">
            <div>
              <p className="font-orbitron font-bold text-xs text-white">{user.name}</p>
              <p className="text-[10px] text-gray-400">{progress.gamerRank}</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#39FF14]/15 border border-[#39FF14]/30 text-[#39FF14] font-bold text-[10px]">
              Nível {progress.level}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-gray-300">
              <span>Progresso do Nível</span>
              <span className="font-bold text-[#39FF14]">
                {progress.currentInLevel} / {progress.span} XP ({progress.progressPercentage}%)
              </span>
            </div>

            {/* Mini Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#39FF14] to-[#00FFFF] transition-all duration-500 rounded-full"
                style={{ width: `${progress.progressPercentage}%` }}
              />
            </div>

            <p className="text-[9px] text-gray-400 pt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#39FF14] shrink-0" />
              <span>Ganhe XP interagindo no Feed da Comunidade!</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
