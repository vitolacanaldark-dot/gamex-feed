import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  BellRing,
  MessageSquare,
  Reply,
  Flame,
  Award,
  Sparkles,
  X,
  ArrowRight,
} from 'lucide-react';

export const PushNotificationToast: React.FC = () => {
  const { activePushToast, dismissPushToast, markNotificationRead, setActiveTab } = useApp();

  if (!activePushToast) return null;

  const handleClickToast = () => {
    markNotificationRead(activePushToast.id);
    if (activePushToast.linkTab) {
      setActiveTab(activePushToast.linkTab);
    } else {
      setActiveTab('community');
    }
    dismissPushToast();
  };

  const getTypeIcon = () => {
    switch (activePushToast.type) {
      case 'comment':
        return <MessageSquare className="w-3.5 h-3.5 text-[#39FF14]" />;
      case 'reply':
        return <Reply className="w-3.5 h-3.5 text-[#00FFFF]" />;
      case 'xp':
        return <Flame className="w-3.5 h-3.5 text-[#FF6B00]" />;
      case 'like':
        return <Sparkles className="w-3.5 h-3.5 text-pink-400" />;
      default:
        return <Award className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div
      role="alert"
      className="fixed top-24 right-4 sm:right-6 z-50 max-w-sm sm:max-w-md w-full animate-in slide-in-from-top-4 duration-300 pointer-events-auto"
    >
      <div className="relative overflow-hidden rounded-2xl bg-[#0D0D14]/95 border-2 border-[#39FF14] p-4 shadow-[0_0_25px_rgba(57,255,20,0.35),0_15px_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
        
        {/* Neon top scanline accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#39FF14] via-[#00FFFF] to-[#39FF14] animate-pulse" />

        <div className="flex items-start gap-3">
          {/* Sender Avatar with Indicator */}
          <div className="relative shrink-0 mt-0.5">
            <img
              src={activePushToast.sender.avatar}
              alt={activePushToast.sender.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-[#39FF14]/80 shadow-[0_0_10px_rgba(57,255,20,0.4)]"
            />
            <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#0D0D14] ring-1 ring-[#39FF14]">
              {getTypeIcon()}
            </span>
          </div>

          {/* Text Info */}
          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#39FF14]/15 text-[#39FF14] uppercase tracking-wider">
                <BellRing className="w-3 h-3 animate-bounce" />
                Push Notificação
              </span>
              <span className="text-[10px] text-gray-400 truncate">
                {activePushToast.sender.handle}
              </span>
            </div>

            <h3 className="font-bold text-xs sm:text-sm text-white truncate">
              {activePushToast.title}
            </h3>

            <p className="text-xs text-gray-300 mt-1 line-clamp-2 italic bg-black/40 p-2 rounded-lg border border-white/10">
              "{activePushToast.message}"
            </p>

            {/* Quick Action Button */}
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={handleClickToast}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-[#39FF14] to-[#00FFFF] text-black text-xs font-black hover:opacity-90 transition-opacity shadow-[0_0_10px_rgba(57,255,20,0.3)]"
              >
                <span>Ver Comentário</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={dismissPushToast}
                className="px-2.5 py-1 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                Dispensar
              </button>
            </div>
          </div>

          {/* Dismiss X Button */}
          <button
            onClick={dismissPushToast}
            className="absolute top-3 right-3 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Fechar notificação"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
