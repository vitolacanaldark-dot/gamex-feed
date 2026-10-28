import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Search, PlusCircle, Calendar, Newspaper, Users, Home, Shield, MessageSquare, LogIn, Bell, LogOut
} from 'lucide-react';
import { NotificationCenter } from './NotificationCenter.tsx';
import { UserAvatarProgressRing } from './UserAvatarProgressRing.tsx';
import { INITIAL_USER } from '../data/mockData.ts'; // Importando o usuário vazio

export const Header: React.FC = () => {
  const {
    activeTab, setActiveTab, setIsSearchOpen, setIsCreatePostOpen, setIsDiscordModalOpen, setIsLoginModalOpen,
    unreadNotificationsCount, isNotificationsOpen, setIsNotificationsOpen, user, setUser,
  } = useApp();

  // Função de Logout
  const handleLogout = () => {
    if (window.confirm("Deseja realmente sair da sua conta Gamer?")) {
      setUser(INITIAL_USER); // Reseta o usuário para o estado zerado
      localStorage.removeItem('gamex_user'); // Apaga da memória do navegador
      window.location.reload(); // Recarrega a página para voltar ao estado inicial
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0A0A0E]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        <div className="flex items-center shrink-0 min-w-max">
          <button onClick={() => setActiveTab('home')} className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none shrink-0">
            <div className="relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
              <img src="/logotipo.png" alt="GAMEx FEED" className="w-12 h-12 sm:w-14 sm:h-14 min-w-[48px] min-h-[48px] aspect-square object-contain rounded-full bg-[#0A0A0E] p-0.5 ring-2 ring-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.45)] group-hover:scale-105 transition-transform duration-300 block shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = 'https://i.imgur.com/uXOvpRq.png'; }} />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#39FF14] rounded-full border-2 border-[#0A0A0E] shadow-[0_0_8px_#39FF14] animate-pulse" />
            </div>
            <div className="text-left hidden md:block shrink-0 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <span className="font-orbitron text-lg sm:text-xl font-black tracking-wider text-white group-hover:text-[#39FF14] transition-colors whitespace-nowrap">GAMEx<span className="text-[#39FF14]"> FEED</span></span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#39FF14]/15 text-[#39FF14] border border-[#39FF14]/30 uppercase tracking-widest hidden xl:inline-block">PORTAL & SOCIAL</span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-400 font-medium hidden xl:block">Rápido, real e relevante</p>
            </div>
          </button>
        </div>

        <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-white/10 shrink-0">
          <button onClick={() => setActiveTab('home')} className={`flex items-center gap-1.5 px-3 py-1.5 xl:px-4 xl:py-2 rounded-full text-xs xl:text-sm font-semibold transition-all ${activeTab === 'home' ? 'bg-[#39FF14] text-black shadow-[0_0_15px_rgba(57,255,20,0.4)] font-bold' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}><Home className="w-3.5 h-3.5" />Início</button>
          <button onClick={() => setActiveTab('news')} className={`flex items-center gap-1.5 px-3 py-1.5 xl:px-4 xl:py-2 rounded-full text-xs xl:text-sm font-semibold transition-all ${activeTab === 'news' ? 'bg-[#39FF14] text-black shadow-[0_0_15px_rgba(57,255,20,0.4)] font-bold' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}><Newspaper className="w-3.5 h-3.5" />Notícias</button>
          <button onClick={() => setActiveTab('community')} className={`flex items-center gap-1.5 px-3 py-1.5 xl:px-4 xl:py-2 rounded-full text-xs xl:text-sm font-semibold transition-all ${activeTab === 'community' ? 'bg-[#39FF14] text-black shadow-[0_0_15px_rgba(57,255,20,0.4)] font-bold' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}><Users className="w-3.5 h-3.5" />Comunidade</button>
          <button onClick={() => setActiveTab('calendar')} className={`flex items-center gap-1.5 px-3 py-1.5 xl:px-4 xl:py-2 rounded-full text-xs xl:text-sm font-semibold transition-all ${activeTab === 'calendar' ? 'bg-[#39FF14] text-black shadow-[0_0_15px_rgba(57,255,20,0.4)] font-bold' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}><Calendar className="w-3.5 h-3.5" />Lançamentos</button>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button onClick={() => setIsSearchOpen(true)} className="flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors shrink-0" aria-label="Abrir busca global">
            <Search className="w-4 h-4 text-[#39FF14]" />
            <span className="hidden xl:inline text-xs text-gray-400">Buscar...</span>
          </button>

          {user.id && (
            <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className={`relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all shrink-0 ${isNotificationsOpen ? 'bg-[#39FF14] text-black shadow-[0_0_15px_rgba(57,255,20,0.5)] font-bold' : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 hover:border-[#39FF14]/40'}`} aria-label="Centro de Notificações">
              <Bell className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${unreadNotificationsCount > 0 ? 'text-[#39FF14]' : ''}`} />
              {unreadNotificationsCount > 0 && (<span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#39FF14] text-[10px] font-black text-black shadow-[0_0_8px_#39FF14] ring-2 ring-[#0A0A0E] animate-pulse">{unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}</span>)}
            </button>
          )}

          <button onClick={() => setIsDiscordModalOpen(true)} className="hidden 2xl:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2]/30 text-[#8b96f8] hover:text-white border border-[#5865F2]/40 transition-all shrink-0" aria-label="Discord">
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs font-semibold">Discord</span>
          </button>

          {!user.id ? (
            <button onClick={() => setIsLoginModalOpen(true)} className="flex items-center gap-1.5 px-2.5 sm:px-4 py-2 rounded-xl bg-[#39FF14] hover:bg-[#32e012] text-black transition-colors text-xs font-bold shrink-0 shadow-[0_0_12px_rgba(57,255,20,0.4)]" aria-label="Abrir tela de login">
              <LogIn className="w-3.5 h-3.5" />
              <span>Entrar</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button onClick={() => setIsCreatePostOpen(true)} className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-gradient-to-r from-[#39FF14] to-[#00FFFF] text-black font-bold text-xs hover:opacity-95 shadow-[0_0_12px_rgba(57,255,20,0.3)] transition-transform active:scale-95 shrink-0" aria-label="Criar novo post">
                <PlusCircle className="w-4 h-4" />
                <span className="hidden xl:inline">Criar Post</span>
              </button>
              <UserAvatarProgressRing />
              {/* BOTÃO DE LOGOUT ADICIONADO AQUI */}
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 transition-all shrink-0"
                title="Sair da Conta"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      <NotificationCenter />
    </header>
  );
};