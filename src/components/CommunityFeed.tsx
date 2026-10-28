import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { CommunityCategory } from '../types.ts';
import { calculatePollPercentages } from '../utils/gamerLogic.ts';
import { Heart, MessageSquare, Repeat2, Share2, Flame, Shield, Send, Pin, Sparkles, BarChart2, Image as ImageIcon, Check, UserPlus, LogIn } from 'lucide-react';

const COMMUNITY_CATEGORIES: CommunityCategory[] = [
  'Todos', 'Dúvida', 'Curiosidade', 'Notícia', 'Review', 'LFG',
];

export const CommunityFeed: React.FC = () => {
  const {
    posts, communityCategoryFilter, setCommunityCategoryFilter, toggleLikePost,
    addCommentToPost, votePoll, repostPost, setIsCreatePostOpen, user, setIsLoginModalOpen
  } = useApp();

  const [activeSort, setActiveSort] = useState<'hot' | 'recent' | 'top'>('hot');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  const filteredPosts = communityCategoryFilter === 'Todos' ? posts : posts.filter((p) => p.category === communityCategoryFilter);

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (activeSort === 'hot') return b.likes * 2 + b.commentsCount * 3 - (a.likes * 2 + a.commentsCount * 3);
    if (activeSort === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return b.likes - a.likes;
  });

  const toggleComments = (postId: string) => setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));

  const handleSendComment = (postId: string) => {
    const text = replyInputs[postId]?.trim();
    if (!text) return;
    addCommentToPost(postId, text);
    setReplyInputs((prev) => ({ ...prev, [postId]: '' }));
    setExpandedComments((prev) => ({ ...prev, [postId]: true }));
  };

  const handleSharePost = (postId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/#post-${postId}`);
    setCopiedPostId(postId);
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  const getCategoryBadgeClass = (category: CommunityCategory) => {
    switch (category) {
      case 'LFG': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Review': return 'bg-[#00FFFF]/20 text-[#00FFFF] border-[#00FFFF]/40';
      case 'Dúvida': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Curiosidade': return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'Notícia': return 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/40';
      default: return 'bg-white/10 text-white border-white/20';
    }
  };

  return (
    <div className="space-y-6" aria-label="Comunidade GAMEx FEED">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/10 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-6 bg-[#39FF14] rounded-sm shadow-[0_0_10px_#39FF14]" />
            <h2 className="font-orbitron text-xl sm:text-2xl font-black text-white tracking-wide">COMUNIDADE GAMER</h2>
          </div>
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
            <button onClick={() => setActiveSort('hot')} className={`px-3 py-1 rounded-lg font-semibold transition-all ${activeSort === 'hot' ? 'bg-[#39FF14] text-black font-bold' : 'text-gray-400 hover:text-white'}`}>Em Alta 🔥</button>
            <button onClick={() => setActiveSort('recent')} className={`px-3 py-1 rounded-lg font-semibold transition-all ${activeSort === 'recent' ? 'bg-[#39FF14] text-black font-bold' : 'text-gray-400 hover:text-white'}`}>Recentes ⚡</button>
            <button onClick={() => setActiveSort('top')} className={`px-3 py-1 rounded-lg font-semibold transition-all ${activeSort === 'top' ? 'bg-[#39FF14] text-black font-bold' : 'text-gray-400 hover:text-white'}`}>Top Votados 🏆</button>
          </div>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {COMMUNITY_CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCommunityCategoryFilter(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${communityCategoryFilter === cat ? 'bg-white text-black border-white font-bold' : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/30'}`}>
              {cat === 'LFG' ? 'LFG (Procurando Grupo)' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Composer */}
      {user.id && (
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/10 space-y-3">
          <div className="flex items-start gap-3">
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-[#39FF14]" />
            <div onClick={() => setIsCreatePostOpen(true)} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-400 cursor-pointer transition-colors">
              Qual é a boa do mundo gamer hoje? Compartilhe notícias, reviews, enquetes ou chame pro LFG...
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/5 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button onClick={() => setIsCreatePostOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"><BarChart2 className="w-3.5 h-3.5 text-[#00FFFF]" /><span>Enquete</span></button>
              <button onClick={() => setIsCreatePostOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"><ImageIcon className="w-3.5 h-3.5 text-[#39FF14]" /><span>Imagem</span></button>
              <button onClick={() => setIsCreatePostOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"><Sparkles className="w-3.5 h-3.5 text-amber-400" /><span>+50 XP ao postar</span></button>
            </div>
            <button onClick={() => setIsCreatePostOpen(true)} className="px-4 py-1.5 rounded-xl bg-[#39FF14] text-black font-bold text-xs hover:bg-[#32e012] shadow-[0_0_12px_rgba(57,255,20,0.3)] transition-all">Criar Tópico</button>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {sortedPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 mt-4 text-center bg-[#121212]/50 backdrop-blur-md rounded-2xl border border-gray-800 shadow-xl">
            <div className="text-6xl mb-4 animate-bounce">👾</div>
            <h2 className="text-2xl font-bold text-white mb-2 font-['Orbitron']">Nenhum tópico por aqui</h2>
            <p className="text-gray-400 mb-6 max-w-md">Seja o primeiro a iniciar uma discussão na comunidade GAMEx FEED!</p>
            <button onClick={() => user.id ? setIsCreatePostOpen(true) : setIsLoginModalOpen(true)} className="bg-[#39FF14] hover:bg-green-400 text-black font-bold py-3 px-8 rounded-full shadow-[0_0_20px_rgba(57,255,20,0.6)] transition-all transform hover:scale-105">
              {user.id ? 'Criar Primeiro Post' : 'Entrar para Postar'}
            </button>
          </div>
        ) : (
          sortedPosts.map((post) => {
            const isExpanded = !!expandedComments[post.id];
            const pollPercentages = post.poll ? calculatePollPercentages(post.poll.options) : null;
            const isAdminPost = post.author.name === 'GAMEx FEED' || post.author.handle === '@gamexfeed';

            return (
              <article key={post.id} className={`glass-panel rounded-2xl p-4 sm:p-6 border transition-all ${post.isPinned ? 'border-[#39FF14]/50 shadow-[0_0_20px_rgba(57,255,20,0.1)]' : 'border-white/10 hover:border-white/20'}`}>
                {post.isPinned && (
                  <div className="flex items-center gap-1.5 text-xs text-[#39FF14] font-bold mb-3">
                    <Pin className="w-3.5 h-3.5 fill-[#39FF14]" />
                    <span>TÓPICO FIXADO PELA MODERAÇÃO</span>
                  </div>
                )}
                
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10" />
                      <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0A0A0E] text-[8px] font-black text-[#39FF14] ring-1 ring-[#39FF14]">{post.author.level || 1}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-sm text-white">{post.author.name}</span>
                        {post.author.isVerified && <Shield className="w-3.5 h-3.5 text-[#00FFFF] fill-[#00FFFF]/20" />}
                        <span className="text-xs text-gray-400">{post.author.handle}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500">
                        <span>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase font-orbitron border ${getCategoryBadgeClass(post.category)}`}>{post.category}</span>
                </div>

                <div className="text-sm sm:text-base text-gray-200 leading-relaxed space-y-4 mb-4">
                  <p className="whitespace-pre-line">{post.content}</p>
                  
                  {/* BOTÃO DE CADASTRO PARA O POST FIXADO */}
                  {post.isPinned && !user.id && (
                    <div className="pt-2">
                      <button onClick={() => setIsLoginModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#39FF14] text-black font-bold text-sm hover:bg-[#32e012] shadow-[0_0_15px_rgba(57,255,20,0.4)] transition-all active:scale-95">
                        <UserPlus className="w-4 h-4" /> Criar minha Conta Gamer
                      </button>
                    </div>
                  )}

                  {post.imageUrl && (
                    <div className="rounded-xl overflow-hidden aspect-video bg-black/40 border border-white/10 max-h-80">
                      <img src={post.imageUrl} alt="Post attachment" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Ações (Like, Comment, Repost) */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-gray-400">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <button onClick={() => toggleLikePost(post.id)} className={`flex items-center gap-1.5 transition-colors ${post.hasLiked ? 'text-red-500 font-bold' : 'hover:text-red-400'}`}>
                      <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-red-500 text-red-500 scale-110' : ''} transition-transform`} />
                      <span>{post.likes}</span>
                    </button>
                    <button onClick={() => toggleComments(post.id)} className={`flex items-center gap-1.5 transition-colors ${isExpanded ? 'text-[#39FF14]' : 'hover:text-[#39FF14]'}`}>
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.commentsCount}</span>
                    </button>
                    <button onClick={() => repostPost(post.id)} className={`flex items-center gap-1.5 transition-colors ${post.hasReposted ? 'text-[#39FF14] font-bold' : 'hover:text-[#39FF14]'}`}>
                      <Repeat2 className={`w-4 h-4 ${post.hasReposted ? 'text-[#39FF14]' : ''}`} />
                      <span>{post.repostsCount}</span>
                    </button>
                  </div>
                  <button onClick={() => handleSharePost(post.id)} className="flex items-center gap-1 hover:text-white transition-colors">
                    {copiedPostId === post.id ? (<span className="text-[#39FF14] font-bold">Copiado!</span>) : (<><Share2 className="w-3.5 h-3.5" /><span className="hidden sm:inline">Compartilhar</span></>)}
                  </button>
                </div>

                {/* Comentários */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                    {user.id ? (
                      <div className="flex gap-2">
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-1 ring-white/20" />
                        <div className="flex-1 flex gap-2">
                          <input type="text" value={replyInputs[post.id] || ''} onChange={(e) => setReplyInputs((prev) => ({ ...prev, [post.id]: e.target.value }))} onKeyDown={(e) => { if (e.key === 'Enter') handleSendComment(post.id); }} placeholder="Escreva uma resposta..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]" />
                          <button onClick={() => handleSendComment(post.id)} disabled={!replyInputs[post.id]?.trim()} className="px-3 py-1.5 rounded-xl bg-[#39FF14] text-black font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#32e012]"><Send className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-gray-400">
                        Faça login para comentar e ganhar XP.
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};