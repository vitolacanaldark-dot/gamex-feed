import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { calculateDaysRemaining } from '../utils/gamerLogic.ts';
import { Flame, Calendar, Instagram, MessageSquare, ExternalLink, Bell, Check } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { releases, toggleReleaseReminder, setActiveTab, setIsDiscordModalOpen } = useApp();
  const [gameCovers, setGameCovers] = useState<Record<string, string>>({});

  const topHypeReleases = [...releases]
    .filter(game => !calculateDaysRemaining(game.releaseDate).isReleased)
    .sort((a, b) => b.hypeScore - a.hypeScore)
    .slice(0, 3);

  // Busca as capas reais na API da Vercel
  useEffect(() => {
    const fetchCovers = async () => {
      const covers: Record<string, string> = {};
      
      for (const game of topHypeReleases) {
        try {
          const response = await fetch(`/api/game-cover?title=${encodeURIComponent(game.title)}`);
          if (response.ok) {
            const data = await response.json();
            if (data.imageUrl) {
              covers[game.id] = data.imageUrl;
            }
          }
        } catch (error) {
          console.warn(`Erro ao buscar capa para ${game.title}`);
        }
      }
      setGameCovers(covers);
    };

    fetchCovers();
  }, [releases]); // Executa quando a lista de lançamentos muda

  return (
    <aside className="space-y-5 w-full" aria-label="Barra Lateral de Destaques">
      
      {/* 1. Discord Official Banner */}
      <div className="relative rounded-2xl p-5 overflow-hidden border border-[#5865F2]/40 bg-gradient-to-br from-[#5865F2]/20 via-[#131422] to-[#0D0D12] shadow-[0_0_20px_rgba(88,101,242,0.15)] group w-full">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#5865F2] flex items-center justify-center shadow-lg shadow-[#5865F2]/40">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-orbitron font-bold text-sm text-white">DISCORD OFICIAL</span>
                <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-ping" />
              </div>
              <p className="text-[11px] text-gray-300">Comunidade GAMEx FEED</p>
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-300 leading-relaxed">Encontre esquadrões (LFG), debata campeonatos em call e receba notícias no segundo em que acontecem.</p>
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10">
          <div className="text-[11px] text-gray-400"><span className="text-[#39FF14] font-bold">Seja o primeiro</span> a entrar hoje</div>
          <button onClick={() => setIsDiscordModalOpen(true)} className="px-3.5 py-1.5 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5">
            Entrar <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 2. Principais Colaboradores */}
      <div className="glass-panel rounded-2xl p-5 border border-white/10 w-full">
        <div className="flex items-center gap-2 mb-1">
          <Flame className="w-5 h-5 text-[#39FF14]" />
          <h3 className="font-orbitron text-sm font-bold text-white tracking-wider uppercase">PRINCIPAIS COLABORADORES</h3>
        </div>
        <p className="text-[11px] text-gray-400 mb-6">Ganhe XP interagindo no Feed da Comunidade e seja o primeiro a ocupar o pódio!</p>
        
        <div className="flex items-end justify-center gap-3 mb-6">
          <div className="flex flex-col items-center opacity-50">
            <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center text-gray-500 font-bold">?</div>
            <div className="w-12 h-12 bg-gray-800 mt-1 rounded-t-sm border-t border-gray-600"></div>
            <span className="text-xs text-gray-500 mt-2">2º</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-gray-800 border-2 border-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.4)] flex items-center justify-center text-[#39FF14] font-bold text-xl">?</div>
            <div className="w-16 h-16 bg-gray-800 mt-1 rounded-t-sm border-t-2 border-[#39FF14]"></div>
            <span className="text-xs text-[#39FF14] font-bold mt-2">1º</span>
          </div>
          <div className="flex flex-col items-center opacity-50">
            <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-orange-700 flex items-center justify-center text-gray-500 font-bold">?</div>
            <div className="w-12 h-8 bg-gray-800 mt-1 rounded-t-sm border-t border-orange-700"></div>
            <span className="text-xs text-gray-500 mt-2">3º</span>
          </div>
        </div>
      </div>

      {/* 3. Game Release Radar (Com capas reais) */}
      <div className="glass-panel rounded-2xl p-5 border border-white/10 w-full">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#00FFFF]" />
            <h3 className="font-orbitron text-sm font-bold text-white tracking-wider uppercase">RADAR DE LANÇAMENTOS</h3>
          </div>
          <button onClick={() => setActiveTab('calendar')} className="text-[11px] font-bold text-[#00FFFF] hover:underline">Ver Todos</button>
        </div>
        <div className="space-y-3.5">
          {topHypeReleases.map((game) => {
            const remaining = calculateDaysRemaining(game.releaseDate);
            const coverUrl = gameCovers[game.id] || game.coverImage; // Usa a capa real ou a que já estava no mock

            return (
              <div key={game.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#00FFFF]/40 transition-all group">
                <div className="relative shrink-0">
                  <img src={coverUrl} alt={game.title} className="w-12 h-14 rounded-lg object-cover ring-1 ring-white/10" />
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5">
                    <Flame className="w-2.5 h-2.5 fill-black" /> {game.hypeScore}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-[#00FFFF] transition-colors">{game.title}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5"><span className="text-[10px] text-gray-400 truncate">{game.platforms.join(', ')}</span></div>
                  <span className="inline-block mt-1 text-[10px] font-bold text-[#39FF14]">{remaining.label}</span>
                </div>
                <button onClick={() => toggleReleaseReminder(game.id)} className={`p-2 rounded-lg transition-colors shrink-0 ${game.isReminded ? 'bg-[#39FF14] text-black shadow-[0_0_8px_rgba(57,255,20,0.4)]' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}>
                  {game.isReminded ? (<Check className="w-3.5 h-3.5 stroke-[3]" />) : (<Bell className="w-3.5 h-3.5" />)}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Instagram do GAMEx FEED */}
      <div className="glass-panel rounded-2xl p-5 border border-white/10 w-full">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Instagram className="w-4 h-4 text-pink-500" />
            <h3 className="font-orbitron text-sm font-bold text-white tracking-wider uppercase">INSTAGRAM OFICIAL</h3>
          </div>
          <span className="text-[10px] font-bold text-[#39FF14]">128.4K seguidores</span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <img src="/logotipo.png" alt="GAMEx FEED Avatar Oficial" className="w-10 h-10 rounded-full aspect-square object-contain p-0.5 bg-black/60 border border-[#39FF14]/70 shadow-[0_0_8px_rgba(57,255,20,0.3)]" onError={(e) => { (e.target as HTMLImageElement).src = 'https://i.imgur.com/uXOvpRq.png'; }} />
          <div>
            <div className="text-xs font-bold text-white">@gamexfeed</div>
            <div className="text-[11px] text-gray-400">Reels diários, memes e notícias rápidas</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden bg-black/40 relative group">
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">Foto {i}</div>
            </div>
          ))}
        </div>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-full block py-2 text-center rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-bold text-xs hover:opacity-90 transition-opacity">Seguir @gamexfeed no Instagram</a>
      </div>
    </aside>
  );
};