import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Flame,
  MessageSquare,
  Instagram,
  Twitter,
  Youtube,
  Twitch,
  Shield,
  ArrowUp,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setNewsCategoryFilter, setIsLoginModalOpen, setIsSplashOpen } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-white/10 bg-[#07070A] pt-12 pb-24 md:pb-12 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top: Banner Logo Showcase */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="p-2.5 rounded-2xl bg-black/60 border border-white/10 shadow-[0_0_25px_rgba(57,255,20,0.15)] flex items-center justify-center">
              <img
                src="/logotipo-banner.jpeg"
                alt="GAMEx FEED Logo Alternativa Oficial"
                className="w-full max-w-[260px] sm:max-w-[340px] md:max-w-[380px] h-auto aspect-[4328/1454] object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://i.imgur.com/R7sOVTx.jpeg';
                }}
              />
            </div>
            <div className="space-y-1">
              <span className="font-orbitron text-lg sm:text-xl font-black text-white tracking-wider block">
                GAMEx<span className="text-[#39FF14]"> FEED</span>
              </span>
              <p className="text-xs text-gray-400 max-w-sm">
                O ecossistema definitivo de jornalismo gamer e rede social dos apaixonados por eSports.
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-[#39FF14] transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-[#00FFFF] transition-colors"
              aria-label="X / Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href="https://twitch.tv"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-purple-400 transition-colors"
              aria-label="Twitch"
            >
              <Twitch className="w-5 h-5" />
            </a>
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-xl bg-[#39FF14]/10 hover:bg-[#39FF14] text-[#39FF14] hover:text-black transition-colors flex items-center justify-center ml-2"
              title="Voltar ao Topo"
              aria-label="Voltar ao topo da página"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-3">
            <h4 className="font-orbitron font-bold text-white uppercase tracking-wider text-sm">
              NAVEGAÇÃO
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-[#39FF14]">
                  Início (Destaques)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('news')} className="hover:text-[#39FF14]">
                  Feed de Notícias
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('community')} className="hover:text-[#39FF14]">
                  Comunidade Gamer
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('calendar')} className="hover:text-[#39FF14]">
                  Radar de Lançamentos
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('profile')} className="hover:text-[#39FF14]">
                  Minha Conta & XP
                </button>
              </li>
              <li>
                <button onClick={() => setIsLoginModalOpen(true)} className="hover:text-[#39FF14] text-[#00FFFF]">
                  Tela de Login
                </button>
              </li>
              <li>
                <button onClick={() => setIsSplashOpen(true)} className="hover:text-[#39FF14] text-[#39FF14]">
                  Rever Splash Screen 🎮
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-orbitron font-bold text-white uppercase tracking-wider text-sm">
              PLATAFORMAS
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('news');
                    setNewsCategoryFilter('PlayStation');
                  }}
                  className="hover:text-[#39FF14]"
                >
                  PlayStation 5 & Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('news');
                    setNewsCategoryFilter('Xbox');
                  }}
                  className="hover:text-[#39FF14]"
                >
                  Xbox Series X|S & Cloud
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('news');
                    setNewsCategoryFilter('Nintendo');
                  }}
                  className="hover:text-[#39FF14]"
                >
                  Nintendo Switch & Switch 2
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('news');
                    setNewsCategoryFilter('PC');
                  }}
                  className="hover:text-[#39FF14]"
                >
                  PC Gaming & Steam
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('news');
                    setNewsCategoryFilter('Hardware');
                  }}
                  className="hover:text-[#39FF14]"
                >
                  Hardware & Placas RTX
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-orbitron font-bold text-white uppercase tracking-wider text-sm">
              ESPORTS & SOCIAL
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('community');
                  }}
                  className="hover:text-[#39FF14]"
                >
                  Tópicos de LFG (Recrutamento)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('community');
                  }}
                  className="hover:text-[#39FF14]"
                >
                  Enquetes da Comunidade
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('news');
                    setNewsCategoryFilter('eSports');
                  }}
                  className="hover:text-[#39FF14]"
                >
                  Cobertura de Majors
                </button>
              </li>
              <li>
                <span className="text-gray-500">Torneios Comunitários (Em breve)</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-orbitron font-bold text-white uppercase tracking-wider text-sm">
              GAMIFICAÇÃO
            </h4>
            <p className="text-gray-400 leading-relaxed">
              Acumule pontos lendo notícias, participando de discussões e desbloqueie medalhas exclusivas
              para o seu perfil gamer.
            </p>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2 text-[11px] text-[#39FF14]">
              <Flame className="w-4 h-4 flex-shrink-0" />
              <span>Sistema de XP Gamer 100% ativo</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 GAMEx FEED. Todos os direitos reservados. Feito com paixão pela comunidade gamer.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-gray-300 cursor-pointer">Termos de Uso</span>
            <span>•</span>
            <span className="hover:text-gray-300 cursor-pointer">Privacidade</span>
            <span>•</span>
            <span className="hover:text-gray-300 cursor-pointer">Contato de Imprensa</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
