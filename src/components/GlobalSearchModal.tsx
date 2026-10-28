import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { searchContent } from '../utils/gamerLogic.ts';
import { Search, X, Newspaper, Users, ArrowRight, Clock, Heart } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    articles,
    posts,
    openArticleModal,
    setActiveTab,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  // Handle keyboard shortcut '/' or 'Escape'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchOpen && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const { matchedArticles, matchedPosts, totalMatches } = searchContent(
    searchQuery,
    articles,
    posts
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/85 backdrop-blur-md"
      onClick={() => setIsSearchOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Busca Global"
    >
      <div
        className="w-full max-w-2xl bg-[#0D0D14] border border-white/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-[#0A0A0E] gap-3">
          <Search className="w-5 h-5 text-[#39FF14]" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar notícias, jogos, posts da comunidade ou tags..."
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-md text-gray-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2 py-1 rounded bg-white/10 text-xs text-gray-400 hover:text-white font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-6">
          <div className="text-xs text-gray-400 flex items-center justify-between">
            <span>
              Resultados para: <strong className="text-white">"{searchQuery || 'Todos'}"</strong>
            </span>
            <span className="text-[#39FF14] font-bold">{totalMatches} encontrados</span>
          </div>

          {/* Section: Notícias do Portal */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-300 font-orbitron uppercase">
              <Newspaper className="w-4 h-4 text-[#39FF14]" />
              <span>NOTÍCIAS DO PORTAL ({matchedArticles.length})</span>
            </div>

            {matchedArticles.length === 0 ? (
              <p className="text-xs text-gray-500 italic pl-6">Nenhuma matéria encontrada com esse termo.</p>
            ) : (
              <div className="space-y-2">
                {matchedArticles.slice(0, 4).map((art) => (
                  <div
                    key={art.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      openArticleModal(art);
                    }}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#39FF14]/40 cursor-pointer flex items-center gap-3 transition-colors group"
                  >
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      className="w-14 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#39FF14] uppercase">
                          {art.category}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {art.readTime}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white group-hover:text-[#39FF14] truncate">
                        {art.title}
                      </h4>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#39FF14] transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Discussões da Comunidade */}
          <div className="space-y-3 pt-2 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-300 font-orbitron uppercase">
              <Users className="w-4 h-4 text-[#00FFFF]" />
              <span>DISCUSSÕES DA COMUNIDADE ({matchedPosts.length})</span>
            </div>

            {matchedPosts.length === 0 ? (
              <p className="text-xs text-gray-500 italic pl-6">Nenhum post da comunidade encontrado com esse termo.</p>
            ) : (
              <div className="space-y-2">
                {matchedPosts.slice(0, 4).map((post) => (
                  <div
                    key={post.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setActiveTab('community');
                    }}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#00FFFF]/40 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-white group-hover:text-[#00FFFF]">
                        {post.author.name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-[#00FFFF]">
                        #{post.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-3 text-[10px] text-gray-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-400" /> {post.likes}
                      </span>
                      <span>{post.commentsCount} comentários</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
