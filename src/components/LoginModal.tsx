import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  X, Mail, Lock, MessageSquare, Sparkles, ArrowRight, Check,
} from 'lucide-react';
import { INITIAL_USER } from '../data/mockData.ts';
import { RegisterModal } from './RegisterModal.tsx';
// IMPORTAÇÕES DO FIREBASE
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, setUser } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(''); 
  
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  if (!isLoginModalOpen) return null;

  // 1. LOGIN TRADICIONAL (BANCO DE DADOS LOCAL)
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const existingUsers = JSON.parse(localStorage.getItem('gamex_db_users') || '[]');

      const foundUser = existingUsers.find(
        (u: any) => 
          (u.email.toLowerCase() === identifier.toLowerCase() || u.username.toLowerCase() === identifier.toLowerCase()) 
          && u.password === password
      );

      if (!foundUser) {
        setError('Credenciais inválidas. Verifique seu e-mail/nick e senha.');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setIsSuccess(true);
      
      const loggedUser = {
        ...INITIAL_USER,
        id: `user-${Date.now()}`,
        name: foundUser.username,
        handle: `@${foundUser.username.toLowerCase()}`,
        bio: 'Explorando o GAMEx FEED!',
        joinedDate: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=200&auto=format&fit=crop&q=80',
      };

      setUser(loggedUser);

      setTimeout(() => {
        setIsSuccess(false);
        setIsLoginModalOpen(false);
        window.location.reload();
      }, 900);
    }, 600);
  };

  // 2. LOGIN REAL COM O GOOGLE (FIREBASE)
  const handleRealGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      // Abre o pop-up do Google
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      // Verifica se o usuário já tem conta no "banco local"
      const existingUsers = JSON.parse(localStorage.getItem('gamex_db_users') || '[]');
      const userExists = existingUsers.find((u: any) => u.email === googleUser.email);

      // Se não existir, cria o registro no banco local
      if (!userExists) {
        const newUserCredentials = { 
          username: googleUser.displayName || googleUser.email?.split('@')[0], 
          email: googleUser.email, 
          password: 'google_auth_login' 
        };
        localStorage.setItem('gamex_db_users', JSON.stringify([...existingUsers, newUserCredentials]));
      }

      // Cria o perfil no site e loga
      const loggedUser = {
        ...INITIAL_USER,
        id: googleUser.uid,
        name: googleUser.displayName || 'Gamer do Google',
        handle: `@${googleUser.email?.split('@')[0]}`,
        bio: 'Conectado via Google! 🚀',
        joinedDate: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        avatar: googleUser.photoURL || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=200&auto=format&fit=crop&q=80',
      };

      setIsSuccess(true);
      setUser(loggedUser);
      
      setTimeout(() => {
        setIsSuccess(false);
        setIsLoginModalOpen(false);
        window.location.reload();
      }, 900);

    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Login cancelado. O pop-up do Google foi fechado.');
      } else {
        setError('Falha ao logar com o Google. Verifique sua conexão.');
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
        onClick={() => setIsLoginModalOpen(false)}
      >
        <div
          className="w-full max-w-md bg-[#0D0D14] border border-white/15 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(57,255,20,0.2)] my-auto relative flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>

          <div className="pt-8 px-6 pb-4 bg-gradient-to-b from-[#131422] to-[#0D0D14] border-b border-white/5 text-center flex flex-col items-center">
            <div className="relative mb-4 flex items-center justify-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 aspect-square rounded-full p-1 bg-[#0A0A0E] ring-2 ring-[#39FF14] shadow-[0_0_30px_rgba(57,255,20,0.4)] flex items-center justify-center">
                <img src="/logotipo.png" alt="GAMEx FEED Logo" className="w-full h-full aspect-square object-contain rounded-full" onError={(e) => { (e.target as HTMLImageElement).src = 'https://i.imgur.com/uXOvpRq.png'; }} />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#39FF14] rounded-full border-2 border-[#0D0D14] shadow-[0_0_8px_#39FF14] animate-pulse" />
            </div>
            <h2 className="font-orbitron font-extrabold text-xl text-white">ACESSO GAMER</h2>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">Entre na sua conta para interagir na comunidade e acumular XP.</p>
          </div>

          <div className="p-6 space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-bold">
                {error}
              </div>
            )}

            <div className="space-y-2.5">
              <button type="button" onClick={() => setError('Login via Discord em manutenção. Use o Google ou crie uma conta.')} className="w-full py-2.5 px-4 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95">
                <MessageSquare className="w-4 h-4 fill-white" /><span>Continuar com Discord</span>
              </button>
              
              {/* BOTÃO REAL DO GOOGLE AQUI */}
              <button type="button" onClick={handleRealGoogleLogin} disabled={isLoading} className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2.5 border border-white/10 transition-all active:scale-95 disabled:opacity-50">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                <span>{isLoading ? 'Conectando...' : 'Continuar com Google'}</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#0D0D14] px-3 text-[10px] text-gray-500 uppercase font-orbitron font-bold">ou com Gamer Tag / E-mail</span>
              <div className="border-t border-white/10 w-full" />
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase font-orbitron mb-1">Gamer Tag ou E-mail</label>
                <div className="relative">
                  <input type="text" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="seu_gamertag@gamex.com" className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14] transition-colors" />
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-gray-300 uppercase font-orbitron">Senha</label>
                  <button type="button" className="text-[10px] text-[#00FFFF] hover:underline">Esqueci minha senha</button>
                </div>
                <div className="relative">
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14] transition-colors" />
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 text-xs text-gray-400">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="rounded bg-white/10 border-white/20 text-[#39FF14] focus:ring-0" />
                  <span>Lembrar neste navegador</span>
                </label>
                <span className="text-[#39FF14] text-[11px] font-bold flex items-center gap-1"><Sparkles className="w-3 h-3" /> +50 XP bônus</span>
              </div>
              <button type="submit" disabled={isLoading || isSuccess} className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(57,255,20,0.3)] ${isSuccess ? 'bg-emerald-500 text-white' : 'bg-[#39FF14] text-black hover:bg-[#32e012] active:scale-95'}`}>
                {isLoading ? <span>Verificando Conta...</span> : isSuccess ? <><Check className="w-4 h-4 stroke-[3]" /><span>Acesso Concedido!</span></> : <><span>ENTRAR NO FEED</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <div className="text-center text-xs text-gray-400 pt-1 border-t border-white/5">
              Não tem uma conta gamer?{' '}
              <button onClick={() => setIsRegisterOpen(true)} className="text-[#39FF14] font-bold hover:underline">
                Criar conta em 10 segundos
              </button>
            </div>
          </div>
        </div>
      </div>

      <RegisterModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
        onSwitchToLogin={() => setIsRegisterOpen(false)} 
      />
    </>
  );
};