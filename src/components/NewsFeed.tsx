import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { CategoryType } from '../types.ts';
import { Bookmark, Clock, Eye, Heart, ArrowUpRight, SearchX } from 'lucide-react';

const CATEGORIES: CategoryType[] = [
  'Todos', 'PlayStation', 'Xbox', 'Nintendo', 'PC', 'eSports', 'Hardware', 'Mobile',
];

interface NewsFeedProps {
  isHomeScreen?: boolean;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ isHomeScreen = false }) => {
  const {
    articles, newsCategoryFilter, setNewsCategoryFilter, openArticleModal,
    toggleSaveArticle, isArticleSaved, likeArticle,
  } = useApp();

  let filtered = newsCategoryFilter === 'Todos' 
    ? articles 
    : articles.filter((a) => a.category === newsCategoryFilter);

  if (isHomeScreen) {
    filtered = filtered.slice(1, 5); // Ignora a principal (Hero) e pega 4
  }

  return (
    <section className="space-y-6" aria-label="Portal de Notícias Gamer">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-6 bg-[#00FFFF] rounded-sm shadow-[0_0_10px_#00FFFF]" />
          <h2 className="font-orbitron text-xl sm:text-2xl font-black text-white tracking-wide">
            {isHomeScreen ? 'FEED DE NOTÍCIAS' : 'TODAS AS NOTÍCIAS'}
          </h2>
        </div>
        <div className="text-xs text-gray-400">
          Exibindo <span className="text-[#39FF14] font-bold">{filtered.length}</span> matérias
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setNewsCategoryFilter(cat)} className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${newsCategoryFilter === cat ? 'bg-[#39FF14] text-black border-[#39FF14] shadow-[0_0_12px_rgba(57,255,20,0.35)] font-bold' : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/30 hover:bg-white/10'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* AVISO DE SEM NOTÍCIAS */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-white/10 rounded-2xl">
          <SearchX className="w-12 h-12 text-gray-500 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Nenhuma notícia encontrada</h3>
          <p className="text-sm text-gray-400 text-center max-w-md">Nossas APIs podem estar temporariamente indisponíveis ou não há novas notícias nesta categoria. Tente novamente mais tarde.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((article) => {
            const isSaved = isArticleSaved(article.id);
            return (
              <article key={article.id} onClick={() => openArticleModal(article)} className="group glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-[#39FF14]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1">
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                    <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12] via-transparent to-black/30" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-black uppercase font-orbitron bg-black/80 text-[#39FF14] border border-[#39FF14]/40 backdrop-blur-md">
                      {article.category}
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); toggleSaveArticle(article.id); }} className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-md transition-all ${isSaved ? 'bg-[#39FF14] text-black shadow-[0_0_10px_rgba(57,255,20,0.5)]' : 'bg-black/60 text-white/80 hover:text-white hover:bg-black/90'}`}>
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-black' : ''}`} />
                    </button>
                  </div>
                  <div className="p-4 sm:p-5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1 text-[#39FF14] font-medium"><Clock className="w-3.5 h-3.5" />{article.readTime}</span>
                      <span className="flex items-center gap-1 text-gray-400"><Eye className="w-3.5 h-3.5" />{article.views.toLocaleString()} views</span>
                    </div>
                    <h3 className="font-orbitron text-base sm:text-lg font-bold text-white group-hover:text-[#39FF14] transition-colors leading-snug line-clamp-2">{article.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">{article.excerpt}</p>
                  </div>
                </div>
                <div className="px-4 sm:px-5 pb-4 pt-1 flex items-center justify-between border-t border-white/5 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <img src={article.author.avatar} alt={article.author.name} className="w-6 h-6 rounded-full object-cover ring-1 ring-white/20 bg-black" />
                    <span className="truncate max-w-[120px] font-medium text-gray-300">{article.author.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={(e) => { e.stopPropagation(); likeArticle(article.id); }} className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors"><Heart className="w-3.5 h-3.5" /><span>{article.likes}</span></button>
                    <span className="flex items-center gap-0.5 text-[#39FF14] font-semibold group-hover:translate-x-0.5 transition-transform">Ler <ArrowUpRight className="w-3.5 h-3.5" /></span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};