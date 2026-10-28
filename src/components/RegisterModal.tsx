import React, { useState } from 'react';
import { X, Mail, Lock, User, Check } from 'lucide-react';
import { supabase } from '../lib/supabase.ts';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) return setError('As senhas não coincidem!');
    if (username.length < 3) return setError('O nick precisa ter pelo menos 3 caracteres.');

    setIsLoading(true);

    // Cria a conta no Supabase Auth. O gatilho no banco criará o perfil.
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: username } // Enviado para a tabela profiles via trigger
      }
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-md bg-[#0D0D14] border border-[#39FF14]/30 rounded-3xl p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        <h2 className="font-orbitron font-extrabold text-xl text-white text-center mb-4">CRIAR CONTA</h2>
        
        {error && <div className="p-3 mb-3 rounded-lg bg-red-500/10 text-red-400 text-xs text-center">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Nick</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Ex: cyber_sniper" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">E-mail</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Senha</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Repetir Senha</label>
            <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-3 mt-4 rounded-xl font-bold text-sm bg-[#39FF14] text-black hover:bg-[#32e012]">
            {isLoading ? 'Criando...' : 'CRIAR CONTA'}
          </button>
        </form>
        <div className="text-center text-xs text-gray-400 mt-4">
          Já tem conta? <button onClick={onSwitchToLogin} className="text-[#39FF14] font-bold">Fazer Login</button>
        </div>
      </div>
    </div>
  );
};