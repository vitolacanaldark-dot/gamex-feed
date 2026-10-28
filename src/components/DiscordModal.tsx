import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, MessageSquare, CheckCircle, ExternalLink, Shield, Zap } from 'lucide-react';

export const DiscordModal: React.FC = () => {
  const { isDiscordModalOpen, setIsDiscordModalOpen, addXp } = useApp();

  if (!isDiscordModalOpen) return null;

  const handleJoin = () => {
    addXp(30, 'Entrou na comunidade oficial do Discord!');
    setIsDiscordModalOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={() => setIsDiscordModalOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="discord-modal-title"
    >
      <div
        className="w-full max-w-md bg-[#131422] border border-[#5865F2]/40 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-5 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsDiscordModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-[#5865F2] flex items-center justify-center mx-auto shadow-lg shadow-[#5865F2]/50">
          <MessageSquare className="w-9 h-9 text-white" />
        </div>

        <div>
          <h2 id="discord-modal-title" className="font-orbitron font-bold text-xl text-white">
            GAMEx FEED DISCORD
          </h2>
          <p className="text-xs text-[#39FF14] font-semibold mt-1">
            1.482 gamers online • 24.890 membros
          </p>
        </div>

        <div className="bg-black/30 rounded-xl p-4 text-left text-xs text-gray-300 space-y-2 border border-white/5">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#39FF14]" />
            <span>Canais exclusivos de LFG para montar times competitivos</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#39FF14]" />
            <span>Alertas instantâneos de jogos grátis na Steam e Epic</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#39FF14]" />
            <span>Sorteios mensais de passes de batalha e gift cards</span>
          </div>
        </div>

        <button
          onClick={handleJoin}
          className="w-full py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-sm shadow-lg shadow-[#5865F2]/40 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <span>Conectar Conta do Discord (+30 XP)</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
