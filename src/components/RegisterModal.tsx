import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, Mail, Lock, User, Check } from 'lucide-react';
import { INITIAL_USER } from '../data/mockData.ts';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const ALLOWED_DOMAINS = [
  'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'yahoo.com.br',
  'icloud.com', 'live.com', 'msn.com', 'protonmail.com', 'zoho.com', 'bol.com.br', 'uol.com.br'
];

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { setUser } = useApp();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Validação de E-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um endereço de e-mail válido.');
      return;
    }
    const domain = email.split('@')[1].toLowerCase();
    if (!ALLOWED_DOMAINS.includes(domain)) {
      setError('E-mail não permitido. Use um provedor confiável (Gmail, Outlook, etc).');
      return;
    }

    // 2. Validação de Nickname (Apenas letras, números e underline)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      setError('O Nick deve conter apenas letras, números e underline (_). Sem espaços, emojis ou símbolos.');
      return;
    }
    if (username.length < 3) {
      setError('O nick precisa ter pelo menos 3 caracteres.');
      return;
    }

    // 3. Validação de Senha
    if (password !== confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // 4. Verificar se o Nick ou E-mail já existem no "Banco de Dados" (localStorage)
      const existingUsers = JSON.parse(localStorage.getItem('gamex_db_users') || '[]');
      
      const isUsernameTaken = existingUsers.some((u: any) => u.username.toLowerCase() === username.toLowerCase());
      if (isUsernameTaken) {
        setError('Este Nick já está em uso por outro jogador. Escolha outro!');
        setIsLoading(false);
        return;
      }

      const isEmailTaken = existingUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (isEmailTaken) {
        setError('Este e-mail já está cadastrado. Faça login.');
        setIsLoading(false);
        return;
      }

      // 5. Salvar o novo usuário no "Banco de Dados"
      const newUserCredentials = { username, email, password };
      const updatedUsers = [...existingUsers, newUserCredentials];
      localStorage.setItem('gamex_db_users', JSON.stringify(updatedUsers));

      // 6. Criar o perfil no sistema e logar
      const newUserProfile = {
        ...INITIAL_USER,
        id: `user-${Date.now()}`,
        name: username,
        handle: `@${username.toLowerCase()}`,
        bio: 'Novo membro da comunidade GAMEx FEED! 🎮',
        joinedDate: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=200&auto=format&fit=crop&q=80',
      };

      setUser(newUserProfile);
      setIsLoading(false);
      onClose();
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto" onClick={onClose}>
      <div 
        className="w-full max-w-md bg-[#0D0D14] border border-[#39FF14]/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(57,255,20,0.15)] my-auto relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="pt-8 px-6 pb-4 bg-gradient-to-b from-[#131422] to-[#0D0D14] border-b border-white/5 text-center">
          <h2 className="font-orbitron font-extrabold text-xl text-white">CRIAR CONTA GAMER</h2>
          <p className="text-xs text-gray-400 mt-1">Junte-se ao GAMEx FEED e comece a acumular XP.</p>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase font-orbitron mb-1">Nick / Nome de Jogador</label>
              <div className="relative">
                <input
                  type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ex: cyber_sniper"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14] transition-colors"
                />
                <User className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase font-orbitron mb-1">E-mail</label>
              <div className="relative">
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com (Ex: @gmail, @outlook)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14] transition-colors"
                />
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase font-orbitron mb-1">Senha</label>
                <div className="relative">
                  <input
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14] transition-colors"
                  />
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase font-orbitron mb-1">Repetir Senha</label>
                <div className="relative">
                  <input
                    type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14] transition-colors"
                  />
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            <button
              type="submit" disabled={isLoading}
              className="w-full py-3 mt-2 rounded-xl font-bold text-sm bg-[#39FF14] text-black hover:bg-[#32e012] transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] flex items-center justify-center gap-2"
            >
              {isLoading ? 'Criando Perfil...' : 'CRIAR CONTA E ENTRAR'}
              {!isLoading && <Check className="w-4 h-4 stroke-[3]" />}
            </button>
          </form>

          <div className="text-center text-xs text-gray-400 pt-3 border-t border-white/5">
            Já tem uma conta?{' '}
            <button onClick={onSwitchToLogin} className="text-[#39FF14] font-bold hover:underline">
              Fazer Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};