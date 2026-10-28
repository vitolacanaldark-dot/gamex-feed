import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { calculateDaysRemaining } from '../utils/gamerLogic.ts';
import { Calendar, Bell, Check, Flame, Sparkles, Filter } from 'lucide-react';

export const ReleaseCalendar: React.FC = () => {
  const { releases, toggleReleaseReminder } = useApp();
  const [platformFilter, setPlatformFilter] = useState<string>('Todos');

  const platforms = ['Todos', 'PC', 'PS5', 'Xbox Series', 'Switch 2'];

  const filteredReleases = releases.filter((game) => {
    if (platformFilter === 'Todos') return true;
    return game.platforms.includes(platformFilter as any);
  });

  return (
    <div className="space-y-6" aria-label="Calendário de Lançamentos de Games">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-6 bg-[#00FFFF] rounded-sm shadow-[0_0_10px_#00FFFF]" />
            <h1 className="font-orbitron text-xl sm:text-2xl font-black text-white tracking-wide">
              CALENDÁRIO DE LANÇAMENTOS
            </h1>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#00FFFF]/10 text-[#00FFFF] border border-[#00FFFF]/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            TEMPORADA 2026/2027
          </span>
        </div>

        <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
          Fique por dentro de todos os grandes lançamentos de jogos para consoles e PC. Ative o alarme de
          lançamento para receber alertas e garantir bônus de XP!
        </p>

        {/* Platform Filters */}
        <div className="flex items-center gap-2 pt-2 overflow-x-auto scrollbar-none">
          <span className="text-xs text-gray-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filtrar:
          </span>
          {platforms.map((plat) => (
            <button
              key={plat}
              onClick={() => setPlatformFilter(plat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                platformFilter === plat
                  ? 'bg-[#00FFFF] text-black border-[#00FFFF] shadow-[0_0_10px_rgba(0,255,255,0.4)]'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
              }`}
            >
              {plat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Upcoming Games */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReleases.map((game) => {
          const remaining = calculateDaysRemaining(game.releaseDate);

          return (
            <div
              key={game.id}
              className="glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-[#00FFFF]/50 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Cover Image & Count Down Badge */}
                <div className="relative aspect-video w-full bg-black/40 overflow-hidden">
                  <img
                    src={game.coverImage}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D14] via-transparent to-black/30" />

                  {/* Countdown Badge */}
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-black font-orbitron uppercase backdrop-blur-md border ${
                      remaining.isReleased
                        ? 'bg-emerald-500/90 text-white border-emerald-400'
                        : 'bg-black/80 text-[#39FF14] border-[#39FF14]/50 shadow-[0_0_10px_rgba(57,255,20,0.3)]'
                    }`}
                  >
                    {remaining.label}
                  </span>

                  {/* Hype Score Pill */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-amber-500/40 text-[11px] text-amber-400 font-bold">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" />
                    <span>Hype {game.hypeScore}%</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="text-[#00FFFF] font-bold">{game.genre}</span>
                    <span>•</span>
                    <span>{game.developer}</span>
                  </div>

                  <h3 className="font-orbitron font-bold text-base sm:text-lg text-white group-hover:text-[#00FFFF] transition-colors">
                    {game.title}
                  </h3>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {game.platforms.map((plat) => (
                      <span
                        key={plat}
                        className="px-2 py-0.5 rounded bg-white/5 text-[11px] font-semibold text-gray-300 border border-white/5"
                      >
                        {plat}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 text-xs text-gray-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      Data prevista:{' '}
                      <strong className="text-white">
                        {new Date(game.releaseDate).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 sm:p-5 pt-0">
                <button
                  onClick={() => toggleReleaseReminder(game.id)}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    game.isReminded
                      ? 'bg-[#39FF14] text-black shadow-[0_0_12px_rgba(57,255,20,0.4)]'
                      : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                  aria-label={`Lembrar lançamento de ${game.title}`}
                >
                  {game.isReminded ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Lembrete Ativo (+10 XP)</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4" />
                      <span>Lembrar no Lançamento</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
