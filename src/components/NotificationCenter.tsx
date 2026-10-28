import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Bell,
  CheckCheck,
  MessageSquare,
  Reply,
  Flame,
  Award,
  ExternalLink,
  X,
  Volume2,
  Sparkles,
  Radio,
} from 'lucide-react';
import { NotificationType, NotificationItem } from '../types.ts';
import { filterNotifications } from '../utils/gamerLogic.ts';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadNotificationsCount,
    isNotificationsOpen,
    setIsNotificationsOpen,
    markNotificationRead,
    markAllNotificationsRead,
    simulateIncomingNotification,
    browserNotificationsEnabled,
    requestBrowserPushPermission,
    setActiveTab,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | NotificationType>('all');
  const [requestingPerm, setRequestingPerm] = useState(false);

  if (!isNotificationsOpen) return null;

  const filtered = filterNotifications(notifications, activeFilter);

  const handleNotificationClick = (item: NotificationItem) => {
    markNotificationRead(item.id);
    if (item.linkTab) {
      setActiveTab(item.linkTab);
    } else {
      setActiveTab('community');
    }
    setIsNotificationsOpen(false);
  };

  const handleEnablePush = async () => {
    setRequestingPerm(true);
    await requestBrowserPushPermission();
    setRequestingPerm(false);
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="w-3.5 h-3.5 text-[#39FF14]" />;
      case 'reply':
        return <Reply className="w-3.5 h-3.5 text-[#00FFFF]" />;
      case 'xp':
        return <Flame className="w-3.5 h-3.5 text-[#FF6B00]" />;
      case 'like':
        return <Sparkles className="w-3.5 h-3.5 text-pink-400" />;
      case 'system':
      default:
        return <Award className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  const formatRelativeTime = (isoString: string) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'agora';
    if (minutes < 60) return `há ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours}h`;
    const days = Math.floor(hours / 24);
    return `há ${days}d`;
  };

  return (
    <>
      {/* Backdrop overlay for mobile & desktop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 animate-in fade-in duration-200"
        onClick={() => setIsNotificationsOpen(false)}
      />

      {/* Popover / Drawer Container */}
      <div className="fixed top-20 right-2 sm:right-6 md:right-8 z-50 w-[95vw] max-w-md bg-[#0D0D14]/98 border border-[#39FF14]/30 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(57,255,20,0.15)] flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="relative p-2 rounded-xl bg-[#39FF14]/10 border border-[#39FF14]/30">
              <Bell className="w-5 h-5 text-[#39FF14]" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#39FF14] text-[10px] font-black text-black ring-2 ring-[#0D0D14] animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </div>
            <div>
              <h2 className="font-orbitron font-bold text-sm sm:text-base text-white tracking-wide">
                Centro de Notificações
              </h2>
              <p className="text-[11px] text-gray-400">
                {unreadNotificationsCount} {unreadNotificationsCount === 1 ? 'não lida' : 'não lidas'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadNotificationsCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="p-1.5 text-xs text-gray-300 hover:text-[#39FF14] hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1 font-medium"
                title="Marcar todas como lidas"
              >
                <CheckCheck className="w-4 h-4 text-[#39FF14]" />
                <span className="hidden sm:inline text-[11px]">Marcar lidas</span>
              </button>
            )}
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Fechar painel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Browser Push Permission Banner */}
        <div className="px-4 py-2.5 bg-gradient-to-r from-purple-900/20 via-[#00FFFF]/10 to-[#39FF14]/10 border-b border-white/10 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Radio className={`w-3.5 h-3.5 ${browserNotificationsEnabled ? 'text-[#39FF14]' : 'text-gray-400'}`} />
            <span className="text-gray-300 text-[11px]">
              {browserNotificationsEnabled
                ? 'Alertas push no navegador ativos'
                : 'Ative alertas sonoros e no desktop'}
            </span>
          </div>
          {!browserNotificationsEnabled && (
            <button
              onClick={handleEnablePush}
              disabled={requestingPerm}
              className="px-2.5 py-1 text-[11px] font-bold bg-[#39FF14]/20 hover:bg-[#39FF14]/30 text-[#39FF14] border border-[#39FF14]/40 rounded-md transition-colors shrink-0"
            >
              {requestingPerm ? 'Ativando...' : 'Ativar Push'}
            </button>
          )}
        </div>

        {/* Filter Navigation Tabs */}
        <div className="px-3 pt-2 pb-1 border-b border-white/10 flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === 'all'
                ? 'bg-[#39FF14] text-black font-bold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Todas ({notifications.length})
          </button>
          <button
            onClick={() => setActiveFilter('comment')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === 'comment'
                ? 'bg-[#39FF14] text-black font-bold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-3 h-3" />
            Comentários
          </button>
          <button
            onClick={() => setActiveFilter('reply')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === 'reply'
                ? 'bg-[#00FFFF] text-black font-bold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Reply className="w-3 h-3" />
            Respostas
          </button>
          <button
            onClick={() => setActiveFilter('xp')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === 'xp'
                ? 'bg-[#FF6B00] text-black font-bold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Flame className="w-3 h-3" />
            XP & Nível
          </button>
        </div>

        {/* Notification List Scroll Area */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5 p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                <Bell className="w-6 h-6 text-gray-500" />
              </div>
              <p className="font-orbitron text-sm font-bold text-gray-300">
                Tudo limpo, Gamer!
              </p>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                Você não tem nenhuma notificação pendente nesta categoria.
              </p>
              <button
                onClick={() => simulateIncomingNotification('reply')}
                className="mt-4 px-3 py-1.5 rounded-lg bg-[#39FF14]/15 hover:bg-[#39FF14]/25 text-[#39FF14] border border-[#39FF14]/30 text-xs font-bold transition-all"
              >
                Simular Nova Resposta Push
              </button>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`group relative p-3 rounded-xl transition-all duration-200 cursor-pointer flex items-start gap-3 ${
                  !item.isRead
                    ? 'bg-[#39FF14]/[0.06] border border-[#39FF14]/30 hover:bg-[#39FF14]/[0.1]'
                    : 'bg-white/[0.02] border border-transparent hover:bg-white/5'
                }`}
              >
                {/* Sender Avatar with Type Badge */}
                <div className="relative shrink-0">
                  <img
                    src={item.sender.avatar}
                    alt={item.sender.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10 group-hover:ring-[#39FF14]/50 transition-all"
                  />
                  <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#0D0D14] ring-1 ring-white/20">
                    {getNotificationIcon(item.type)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-bold text-white group-hover:text-[#39FF14] transition-colors truncate">
                      {item.sender.name}
                    </span>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </div>

                  <p className="text-[11px] font-semibold text-gray-300 mb-1 leading-snug">
                    {item.title}
                  </p>
                  
                  <p className="text-xs text-gray-400 line-clamp-2 italic bg-black/30 p-1.5 rounded border border-white/5">
                    "{item.message}"
                  </p>
                </div>

                {/* Unread Glow Indicator */}
                {!item.isRead && (
                  <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-[#39FF14] shadow-[0_0_8px_#39FF14] mt-1.5 animate-pulse" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Actions: Simulated Push Test Buttons */}
        <div className="p-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between gap-2">
          <span className="text-[10px] text-gray-400">Testar Push ao Vivo:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => simulateIncomingNotification('comment')}
              className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-[11px] font-semibold transition-colors border border-white/10"
              title="Disparar push simulando novo comentário em seu post"
            >
              + Comentário
            </button>
            <button
              onClick={() => simulateIncomingNotification('reply')}
              className="px-2 py-1 rounded bg-[#00FFFF]/10 hover:bg-[#00FFFF]/20 text-[#00FFFF] text-[11px] font-semibold transition-colors border border-[#00FFFF]/30"
              title="Disparar push simulando nova resposta na sua thread"
            >
              + Resposta
            </button>
          </div>
        </div>

      </div>
    </>
  );
};
