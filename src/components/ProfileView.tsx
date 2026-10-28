import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Shield, Flame, Award, Bookmark, Calendar, Users, Repeat2, Heart, MessageSquare, Sparkles, Zap, CheckCircle2, Lock, Trophy, LogIn
} from 'lucide-react';
import { calculateLevel } from '../utils/gamerLogic.ts';

export const ProfileView: React.FC = () => {
  const { user, articles, posts, openArticleModal, toggleSaveArticle, setIsLoginModalOpen } = useApp();
  const [activeProfileTab, setActiveProfileTab] = useState<'posts' | 'reposts' | 'saved' | 'badges'>('posts');

  // 🛑 TRAVA DE SEGURANÇA (ÁREA RESTRITA)
  if (!user.id) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center bg-[#0D0D14] rounded-2xl border border-white/10">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <Shield className="w-10 h-10 text-gray-500" />
        </div>
        <h2 className="font-orbitron text-2xl font-black text-white mb-2">ÁREA RESTRITA</h2>
        <p className="text-gray-400 mb-8 max-w-sm">Você precisa estar logado para ver seu perfil, acumular XP e desbloquear conquistas.</p>
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="px-6 py-3 bg-[#39FF14] text-black font-bold rounded-xl hover:bg-[#32e012] transition-all shadow-[0_0_15px_rgba(57,255,20,0.4)] flex items-center gap-2"
        >
          <LogIn className="w-5 h-5" /> Fazer Login / Criar Conta
        </button>
      </div>
    );
  }

  const levelInfo = calculateLevel(user.currentXp);
  const myPosts = posts.filter((p) => p.author.id === user.id);
  const repostedPosts = posts.filter((p) => user.repostedPostIds.includes(p.id));
  const savedArticlesList = articles.filter((a) => user.savedArticles.includes(a.id));

  return (
    <div className="space-y-6" aria-label="Perfil do Gamer">
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 relative">
        <div className="h-44 sm:h-56 w-full relative bg-gradient-to-r from-purple-900 via-indigo-950 to-black overflow-hidden">
          {user.bannerImage && <img src={user.bannerImage} alt="Profile Banner" className="w-full h-full object-cover opacity-60" />}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D14] via-transparent to-black/40" />
        </div>
        <div className="px-5 sm:px-8 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            <div className="flex items-end gap-4">
              <div className="relative">
                <img src={user.avatar} alt={user.name} className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-[#0D0D14] border-2 border-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.4)]" />
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-[#39FF14] text-black font-black font-orbitron text-xs shadow-md">LVL {user.level}</span>
              </div>
              <div className="mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-orbitron text-xl sm:text-2xl font-black text-white">{user.name}</h1>
                  {user.isVerified && (
                    <span title="Gamer Verificado GAMEx" className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#00FFFF]/15 text-[#00FFFF] border border-[#00FFFF]/30">
                      <Shield className="w-3.5 h-3.5 fill-[#00FFFF]/20" /> PRO GAMER
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-[#39FF14] font-medium">{user.handle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 self-stretch sm:self-auto justify-between sm:justify-start">
              <div className="text-left">
                <span className="text-[10px] text-gray-400 block font-orbitron">PATENTE GAMER</span>
                <span className="text-sm font-bold text-white font-orbitron text-[#00FFFF]">{levelInfo.gamerRank}</span>
              </div>
              <Award className="w-6 h-6 text-[#00FFFF]" />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-300 max-w-3xl leading-relaxed">{user.bio}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-1">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-gray-400" /> Membro desde {user.joinedDate}</span>
              <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-gray-400" /> <strong className="text-white">{user.followersCount}</strong> seguidores</span>
              <span className="flex items-center gap-1.5"><strong className="text-white">{user.followingCount}</strong> seguindo</span>
            </div>
          </div>
          <div className="mt-5 p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-orbitron font-bold text-white flex items-center gap-1.5"><Flame className="w-4 h-4 text-[#39FF14]" /> PROGRESSO DO NÍVEL {user.level} → {user.level + 1}</span>
              <span className="text-[#39FF14] font-mono font-bold">{user.currentXp} / {levelInfo.levelXpCeiling} XP ({levelInfo.progressPercentage}%)</span>
            </div>
            <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
              <div className="h-full rounded-full bg-gradient-to-r from-[#39FF14] to-[#00FFFF] shadow-[0_0_12px_rgba(57,255,20,0.6)] transition-all duration-500" style={{ width: `${levelInfo.progressPercentage}%` }} />
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
              <span>Ganhe XP ao ler notícias (+15), comentar (+25) e criar tópicos (+50).</span>
              <span className="text-gray-300 font-semibold">Faltam {levelInfo.levelXpCeiling - user.currentXp} XP para subir de rank</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto scrollbar-none">
        <button onClick={() => setActiveProfileTab('posts')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeProfileTab === 'posts' ? 'bg-[#39FF14] text-black font-extrabold shadow-[0_0_12px_rgba(57,255,20,0.3)]' : 'text-gray-400 hover:text-white bg-white/5'}`}><MessageSquare className="w-4 h-4" /> Meus Posts ({myPosts.length})</button>
        <button onClick={() => setActiveProfileTab('reposts')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeProfileTab === 'reposts' ? 'bg-[#39FF14] text-black font-extrabold shadow-[0_0_12px_rgba(57,255,20,0.3)]' : 'text-gray-400 hover:text-white bg-white/5'}`}><Repeat2 className="w-4 h-4" /> Reposts ({repostedPosts.length})</button>
        <button onClick={() => setActiveProfileTab('saved')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeProfileTab === 'saved' ? 'bg-[#39FF14] text-black font-extrabold shadow-[0_0_12px_rgba(57,255,20,0.3)]' : 'text-gray-400 hover:text-white bg-white/5'}`}><Bookmark className="w-4 h-4" /> Notícias Salvas ({savedArticlesList.length})</button>
        <button onClick={() => setActiveProfileTab('badges')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeProfileTab === 'badges' ? 'bg-[#39FF14] text-black font-extrabold shadow-[0_0_12px_rgba(57,255,20,0.3)]' : 'text-gray-400 hover:text-white bg-white/5'}`}><Award className="w-4 h-4" /> Badges & Conquistas ({user.badges.filter((b) => b.isUnlocked).length})</button>
      </div>

      {activeProfileTab === 'posts' && (
        <div className="space-y-4">
          {myPosts.length === 0 ? (
            <div className="text-center py-12 glass-panel rounded-2xl border border-white/10">
              <MessageSquare className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-gray-300 font-bold">Você ainda não publicou nenhum post</p>
              <p className="text-xs text-gray-500 mt-1">Compartilhe dicas, notícias ou crie um LFG para ganhar XP!</p>
            </div>
          ) : (
            myPosts.map((post) => (
              <div key={post.id} className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/10">
                <div className="flex items-center justify-between mb-2"><span className="text-[11px] font-bold text-[#39FF14] uppercase">#{post.category}</span><span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString('pt-BR')}</span></div>
                <p className="text-sm text-gray-200">{post.content}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-red-400" /> {post.likes} curtidas</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {post.commentsCount} comentários</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeProfileTab === 'reposts' && (
        <div className="space-y-4">
          {repostedPosts.length === 0 ? (
            <div className="text-center py-12 glass-panel rounded-2xl border border-white/10">
              <Repeat2 className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-gray-300 font-bold">Nenhum repost ainda</p>
              <p className="text-xs text-gray-500 mt-1">Clique no botão de repost em qualquer post da comunidade para exibi-lo aqui.</p>
            </div>
          ) : (
            repostedPosts.map((post) => (
              <div key={post.id} className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/10">
                <div className="flex items-center gap-2 text-xs text-[#39FF14] font-bold mb-2"><Repeat2 className="w-3.5 h-3.5" /><span>Você repostou este tópico</span></div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-xs font-bold text-white">{post.author.name}</span>
                  <p className="text-sm text-gray-300 mt-1">{post.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeProfileTab === 'saved' && (
        <div className="space-y-4">
          {savedArticlesList.length === 0 ? (
            <div className="text-center py-12 glass-panel rounded-2xl border border-white/10">
              <Bookmark className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-gray-300 font-bold">Nenhuma notícia salva</p>
              <p className="text-xs text-gray-500 mt-1">Clique no ícone de salvar em qualquer matéria para ler depois aqui.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedArticlesList.map((art) => (
                <div key={art.id} onClick={() => openArticleModal(art)} className="glass-panel rounded-xl p-4 border border-white/10 hover:border-[#39FF14]/50 transition-colors cursor-pointer flex gap-3 group">
                  <img src={art.coverImage} alt={art.title} className="w-24 h-24 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#39FF14] uppercase">{art.category}</span>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#39FF14] line-clamp-2">{art.title}</h4>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
                      <span>{art.readTime}</span>
                      <button onClick={(e) => { e.stopPropagation(); toggleSaveArticle(art.id); }} className="text-red-400 hover:underline text-[11px]">Remover</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeProfileTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.badges.map((badge) => (
            <div key={badge.id} className={`group relative p-5 rounded-2xl border transition-all ${badge.isUnlocked ? 'glass-panel border-[#39FF14]/40 shadow-[0_0_15px_rgba(57,255,20,0.15)]' : 'bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100 hover:border-white/20'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${badge.isUnlocked ? 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/50' : 'bg-white/5 text-gray-500 border border-white/10 grayscale'}`}>
                  {badge.id === 'badge-adotante' && <Award className="w-6 h-6" />}
                  {badge.id === 'badge-colaborador' && <MessageSquare className="w-6 h-6" />}
                  {badge.id === 'badge-vencedor' && <Trophy className="w-6 h-6" />}
                </div>
                {badge.isUnlocked ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-[#39FF14] bg-[#39FF14]/15 px-2 py-0.5 rounded-full border border-[#39FF14]/30"><CheckCircle2 className="w-3 h-3" /> Desbloqueada</span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10"><Lock className="w-3 h-3" /> Bloqueada</span>
                )}
              </div>
              <h4 className="font-orbitron font-bold text-sm text-white mb-1">{badge.name}</h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">{badge.description}</p>
              <div className="text-[11px] font-mono font-semibold text-gray-400 pt-2 border-t border-white/5">Requisito: <span className="text-[#00FFFF]">{badge.requirement}</span></div>
              {!badge.isUnlocked && (
                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-black text-white text-xs rounded-lg border border-[#39FF14] shadow-lg z-10 text-center pointer-events-none">Como desbloquear: {badge.requirement}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};