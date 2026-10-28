import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Bookmark, Clock, Flame, ChevronRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { articles, openArticleModal, toggleSaveArticle, isArticleSaved } = useApp();

  // Pega a notícia mais recente (que está na posição 0 do array ordenado)
  const mainArticle = articles[0];

  if (!mainArticle) return null;

  return (
    <section className="mb-2" aria-label="Notícias em Destaque">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-6 bg-[#39FF14] rounded-sm shadow-[0_0_10px_#39FF14]" />
          <h2 className="font-orbitron text-xl sm:text-2xl font-black text-white tracking-wide">
            DESTAQUES DO DIA
          </h2>
        </div>
        <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1.5 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          AO VIVO & EM ALTA
        </span>
      </div>

      <div className="group relative rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-[#39FF14]/50 transition-all duration-300 flex flex-col justify-end min-h-[380px] sm:min-h-[440px] w-full">
        <img
          src={mainArticle.coverImage}
          alt={mainArticle.title}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0E] via-[#0A0A0E]/70 to-transparent" />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <span className="px-3 py-1 rounded-lg bg-[#39FF14] text-black font-black text-xs font-orbitron uppercase tracking-wider shadow-[0_0_12px_rgba(57,255,20,0.5)]">
            {mainArticle.category}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveArticle(mainArticle.id);
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition-all ${
              isArticleSaved(mainArticle.id)
                ? 'bg-[#39FF14] text-black shadow-[0_0_12px_rgba(57,255,20,0.5)]'
                : 'bg-black/60 text-white/80 hover:text-white hover:bg-black/80'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isArticleSaved(mainArticle.id) ? 'fill-black' : ''}`} />
          </button>
        </div>

        <div className="relative z-10 p-5 sm:p-7 space-y-3">
          <div className="flex items-center gap-3 text-xs text-gray-300">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#39FF14]" />
              {mainArticle.readTime} de leitura
            </span>
            <span>•</span>
            <span className="text-gray-400">Por {mainArticle.author.name}</span>
          </div>

          <h3
            onClick={() => openArticleModal(mainArticle)}
            className="font-orbitron text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight cursor-pointer hover:text-[#39FF14] transition-colors line-clamp-3"
          >
            {mainArticle.title}
          </h3>

          <p className="text-sm text-gray-300 line-clamp-2 max-w-2xl hidden sm:block">
            {mainArticle.excerpt}
          </p>

          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={() => openArticleModal(mainArticle)}
              className="px-5 py-2.5 rounded-xl bg-[#39FF14] text-black font-bold text-sm flex items-center gap-2 hover:bg-[#32e012] shadow-[0_0_15px_rgba(57,255,20,0.4)] transition-all active:scale-95"
            >
              Ler Matéria Completa
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 text-xs text-[#00FFFF] font-semibold bg-[#00FFFF]/10 px-3 py-1.5 rounded-lg border border-[#00FFFF]/30 hidden sm:flex">
              <Flame className="w-3.5 h-3.5" />
              <span>+15 XP ao ler</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};