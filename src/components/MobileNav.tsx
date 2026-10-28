import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Home, Newspaper, Plus, Users, User, Calendar } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsCreatePostOpen, user } = useApp();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0D0D12]/95 backdrop-blur-xl border-t border-white/10 px-3 py-2"
      aria-label="Navegação móvel"
    >
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {/* Início */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
            activeTab === 'home' ? 'text-[#39FF14]' : 'text-gray-400 hover:text-gray-200'
          }`}
          aria-label="Ir para Início"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Início</span>
        </button>

        {/* Notícias */}
        <button
          onClick={() => setActiveTab('news')}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
            activeTab === 'news' ? 'text-[#39FF14]' : 'text-gray-400 hover:text-gray-200'
          }`}
          aria-label="Ir para Notícias"
        >
          <Newspaper className="w-5 h-5" />
          <span className="text-[10px] font-medium">Notícias</span>
        </button>

        {/* Floating Center Create Button */}
        <div className="relative -top-3">
          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#39FF14] to-[#00FFFF] text-black shadow-[0_0_20px_rgba(57,255,20,0.5)] active:scale-90 transition-transform"
            aria-label="Criar Novo Post"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Comunidade */}
        <button
          onClick={() => setActiveTab('community')}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
            activeTab === 'community' ? 'text-[#39FF14]' : 'text-gray-400 hover:text-gray-200'
          }`}
          aria-label="Ir para Comunidade"
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-medium">Social</span>
        </button>

        {/* Perfil */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors relative ${
            activeTab === 'profile' ? 'text-[#39FF14]' : 'text-gray-400 hover:text-gray-200'
          }`}
          aria-label="Ver Perfil"
        >
          <div className="relative">
            <User className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#39FF14] text-[8px] font-black text-black">
              {user.level}
            </span>
          </div>
          <span className="text-[10px] font-medium">Perfil</span>
        </button>
      </div>
    </nav>
  );
};
