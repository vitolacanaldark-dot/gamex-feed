import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  X, Bookmark, Heart, Share2, Clock, Eye, Check, Send, MessageSquare, Shield, Flame,
} from 'lucide-react';

export const ArticleModal: React.FC = () => {
  const {
    selectedArticle, closeArticleModal, toggleSaveArticle, isArticleSaved,
    likeArticle, articles, openArticleModal, user, addXp,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  // ESTADO ZERADO: Nenhum comentário fictício inicial
  const [localComments, setLocalComments] = useState<
    { id: string; author: string; avatar: string; text: string; time: string; likes: number }[]
  >([]);

  if (!selectedArticle) return null;

  const isSaved = isArticleSaved(selectedArticle.id);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`Confira no GAMEx FEED: ${selectedArticle.title}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Confira no GAMEx FEED: ${selectedArticle.title} ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user.id) return; // Bloqueia se não estiver logado

    const newCom = {
      id: `comm-${Date.now()}`,
      author: user.name,
      avatar: user.avatar,
      text: commentText.trim(),
      time: 'Agora mesmo',
      likes: 0,
    };

    setLocalComments(prev => [newCom, ...prev]);
    setCommentText('');
    addXp(25, 'Comentário em matéria jornalística');
  };

  const relatedArticles = articles
    .filter(a => a.id !== selectedArticle.id)
    .slice(0, 2);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={closeArticleModal}
    >
      <div
        className="relative w-full max-w-4xl bg-[#0D0D14] border border-white/15 rounded-2xl overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#0A0A0E]/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-black uppercase font-orbitron bg-[#39FF14] text-black">NOTÍCIA</span>
            <span className="text-xs text-gray-400 hidden sm:inline">GAMEx FEED</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => toggleSaveArticle(selectedArticle.id)} className={`p-2 rounded-lg transition-all ${isSaved ? 'bg-[#39FF14] text-black' : 'bg-white/5 text-gray-300 hover:text-white'}`}>
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-black' : ''}`} />
            </button>
            <button onClick={closeArticleModal} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-5 sm:p-8 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1 text-[#39FF14] font-medium"><Clock className="w-3.5 h-3.5" />{selectedArticle.readTime} de leitura</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{selectedArticle.views} visualizações</span>
            </div>

            <h1 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
              {selectedArticle.title}
            </h1>

            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-normal">
              {selectedArticle.excerpt}
            </p>

            <div className="pt-2 flex items-center justify-between flex-wrap gap-3 border-y border-white/10 py-3">
              <div className="flex items-center gap-3">
                <img src={selectedArticle.author.avatar} alt={selectedArticle.author.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-[#39FF14]/50 bg-black" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">{selectedArticle.author.name}</span>
                    {selectedArticle.author.isVerified && <Shield className="w-3.5 h-3.5 text-[#00FFFF]" />}
                  </div>
                  <span className="text-xs text-gray-400">{selectedArticle.author.handle}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleShareTwitter} className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 hover:text-white">X / Twitter</button>
                <button onClick={handleShareWhatsApp} className="px-2.5 py-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-xs text-green-400">WhatsApp</button>
                <button onClick={handleCopyLink} className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 hover:text-white flex items-center gap-1">
                  {copied ? <Check className="w-3.5 h-3.5 text-[#39FF14]" /> : <Share2 className="w-3.5 h-3.5" />}
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden aspect-video bg-black/50 border border-white/10">
            <img src={selectedArticle.coverImage} alt={selectedArticle.title} className="w-full h-full object-cover" />
          </div>

          <div className="prose prose-invert max-w-none space-y-4 text-gray-200 text-sm sm:text-base leading-relaxed">
            {selectedArticle.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button onClick={() => likeArticle(selectedArticle.id)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors font-bold text-sm">
                <Heart className="w-4 h-4 fill-red-400" /><span>{selectedArticle.likes} Curtidas</span>
              </button>
            </div>
            <button onClick={() => toggleSaveArticle(selectedArticle.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isSaved ? 'bg-[#39FF14] text-black font-bold' : 'bg-white/10 text-white hover:bg-white/15'}`}>
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-black' : ''}`} /><span>{isSaved ? 'Salvo' : 'Salvar para Ler Depois'}</span>
            </button>
          </div>

          <section className="pt-6 border-t border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#39FF14]" />
                <h3 className="font-orbitron text-lg font-bold text-white">COMENTÁRIOS ({localComments.length})</h3>
              </div>
              {user.id && <span className="text-xs text-[#00FFFF]">+25 XP por comentário</span>}
            </div>

            {user.id ? (
              <form onSubmit={handleAddComment} className="flex gap-3">
                <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover ring-1 ring-[#39FF14]" />
                <div className="flex-1 flex gap-2">
                  <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="O que você achou desta notícia?" className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]" />
                  <button type="submit" disabled={!commentText.trim()} className="px-4 py-2 rounded-xl bg-[#39FF14] text-black font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#32e012] flex items-center gap-1.5"><Send className="w-4 h-4" /><span className="hidden sm:inline">Comentar</span></button>
                </div>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center text-sm text-gray-400">
                Faça login para participar da discussão e ganhar XP.
              </div>
            )}

            <div className="space-y-3">
              {localComments.length === 0 ? (
                <p className="text-xs text-gray-500 italic py-1">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
              ) : (
                localComments.map((com) => (
                  <div key={com.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img src={com.avatar} alt={com.author} className="w-6 h-6 rounded-full object-cover" />
                        <span className="font-bold text-white">{com.author}</span>
                      </div>
                      <span className="text-gray-500">{com.time}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 pl-8">{com.text}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};