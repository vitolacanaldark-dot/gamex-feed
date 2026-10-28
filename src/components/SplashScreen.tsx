import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Sparkles, ArrowRight, Play, Volume2, Shield } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { isSplashOpen, setIsSplashOpen, addXp } = useApp();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Iniciando feed de notícias gamer...');

  // Auto-fill progress bar on open
  useEffect(() => {
    if (!isSplashOpen) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatusText('Servidores conectados! Pronto para iniciar.');
          return 100;
        }
        if (prev === 25) setStatusText('Sincronizando tópicos da comunidade e LFG...');
        if (prev === 60) setStatusText('Carregando lançamentos 2026/2027 e scores de hype...');
        if (prev === 85) setStatusText('Autenticando perfil cyber-esports...');
        return prev + 5;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [isSplashOpen]);

  if (!isSplashOpen) return null;

  const handleEnter = () => {
    addXp(20, 'Bem-vindo ao GAMEx FEED!');
    setIsSplashOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-[#060609]/95 backdrop-blur-2xl text-center cyber-grid-bg overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Tela de Abertura GAMEx FEED"
    >
      {/* Background radial glow */}
      <div className="absolute w-[600px] h-[600px] bg-[#39FF14]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-[#00FFFF]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-xl w-full flex flex-col items-center space-y-6">
        
        {/* Top Tag */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
          <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-ping" />
          <span className="font-orbitron font-bold tracking-widest text-[#39FF14]">
            GAMEx FEED v2.6 • SISTEMA ONLINE
          </span>
        </div>

        {/* Logo Alternativa Banner - Perfectly Proportioned */}
        <div className="w-full max-w-lg p-3 sm:p-5 rounded-3xl bg-black/80 border border-white/15 shadow-[0_0_50px_rgba(57,255,20,0.3)] flex items-center justify-center relative group">
          <img
            src="/logotipo-banner.jpeg"
            alt="GAMEx FEED Logo Alternativa - Splash Screen"
            className="w-full h-auto aspect-[4328/1454] object-contain rounded-xl"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://i.imgur.com/R7sOVTx.jpeg';
            }}
          />
        </div>

        {/* Headline & Description */}
        <div className="space-y-2">
          <h1 className="font-orbitron text-2xl sm:text-3xl font-black text-white tracking-wide">
            PORTAL & REDE SOCIAL GAMER
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
            Notícias em tempo real, discussões em comunidade, radar de lançamentos e sistema de XP para verdadeiros gamers.
          </p>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-full max-w-md space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-gray-400 text-[11px] truncate">{statusText}</span>
            <span className="text-[#39FF14] font-bold">{progress}%</span>
          </div>

          <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#39FF14] via-[#00FFFF] to-[#39FF14] shadow-[0_0_12px_rgba(57,255,20,0.7)] transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pt-2">
          <button
            onClick={handleEnter}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#39FF14] hover:bg-[#32e012] text-black font-extrabold font-orbitron text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(57,255,20,0.45)] transition-all active:scale-95"
          >
            <span>ENTRAR NO GAMEx FEED</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          <button
            onClick={() => setIsSplashOpen(false)}
            className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-semibold border border-white/10 transition-colors"
          >
            Pular Intro
          </button>
        </div>

      </div>
    </div>
  );
};
