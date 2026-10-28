import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  NewsArticle,
  CommunityPost,
  GameRelease,
  UserProfile,
  CategoryType,
  CommunityCategory,
  NotificationItem,
} from '../types.ts';
import {
  INITIAL_USER,
  INITIAL_NEWS,
  INITIAL_POSTS,
  INITIAL_RELEASES,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData.ts';
import {
  calculateLevel,
  checkBadges,
  countUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../utils/gamerLogic.ts';
import { fetchRealNews } from '../newsService.ts';

interface XpToast {
  id: string;
  amount: number;
  reason: string;
}

interface AppContextType {
  activeTab: 'home' | 'news' | 'community' | 'calendar' | 'profile';
  setActiveTab: (tab: 'home' | 'news' | 'community' | 'calendar' | 'profile') => void;
  newsCategoryFilter: CategoryType;
  setNewsCategoryFilter: (cat: CategoryType) => void;
  communityCategoryFilter: CommunityCategory;
  setCommunityCategoryFilter: (cat: CommunityCategory) => void;
  
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  addXp: (amount: number, reason: string) => void;
  xpToasts: XpToast[];
  
  articles: NewsArticle[];
  selectedArticle: NewsArticle | null;
  openArticleModal: (article: NewsArticle) => void;
  closeArticleModal: () => void;
  toggleSaveArticle: (articleId: string) => void;
  isArticleSaved: (articleId: string) => boolean;
  likeArticle: (articleId: string) => void;
  
  posts: CommunityPost[];
  createPost: (data: {
    category: CommunityCategory;
    content: string;
    tags: string[];
    imageUrl?: string;
    pollQuestion?: string;
    pollOptions?: string[];
  }) => void;
  toggleLikePost: (postId: string) => void;
  addCommentToPost: (postId: string, content: string) => void;
  votePoll: (postId: string, optionId: string) => void;
  repostPost: (postId: string) => void;
  
  releases: GameRelease[];
  toggleReleaseReminder: (releaseId: string) => void;
  
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isCreatePostOpen: boolean;
  setIsCreatePostOpen: (open: boolean) => void;
  isDiscordModalOpen: boolean;
  setIsDiscordModalOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isSplashOpen: boolean;
  setIsSplashOpen: (open: boolean) => void;

  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  pushNotification: (data: {
    type: 'comment' | 'reply' | 'like' | 'xp' | 'system';
    title: string;
    message: string;
    postId?: string;
    sender: { name: string; avatar: string; handle: string };
    linkTab?: 'community' | 'profile' | 'news';
  }) => void;
  activePushToast: NotificationItem | null;
  dismissPushToast: () => void;
  simulateIncomingNotification: (type?: 'comment' | 'reply') => void;
  browserNotificationsEnabled: boolean;
  requestBrowserPushPermission: () => Promise<boolean>;

  isLevelingUp: boolean;
  lastLevelUpNumber: number | null;
  xpGainTick: number;
  triggerLevelUpBonus: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'news' | 'community' | 'calendar' | 'profile'>('home');
  const [newsCategoryFilter, setNewsCategoryFilter] = useState<CategoryType>('Todos');
  const [communityCategoryFilter, setCommunityCategoryFilter] = useState<CommunityCategory>('Todos');
  
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('gamex_user');
    return saved && JSON.parse(saved).id ? JSON.parse(saved) : INITIAL_USER;
  });
  
  const [articles, setArticles] = useState<NewsArticle[]>(() => {
    const saved = localStorage.getItem('gamex_articles');
    return saved ? JSON.parse(saved) : INITIAL_NEWS;
  });
  
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('gamex_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });
  
  const [releases, setReleases] = useState<GameRelease[]>(INITIAL_RELEASES);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSplashOpen, setIsSplashOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activePushToast, setActivePushToast] = useState<NotificationItem | null>(null);
  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState(false);
  
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('gamex_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [xpToasts, setXpToasts] = useState<XpToast[]>([]);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [lastLevelUpNumber, setLastLevelUpNumber] = useState<number | null>(null);
  const [xpGainTick, setXpGainTick] = useState(0);

  // =========================================================================
  // CARREGAMENTO INICIAL E LOOP DE ATUALIZAÇÃO AUTOMÁTICA (A CADA 5 MINUTOS)
  // =========================================================================
  useEffect(() => {
    // 1. Busca inicial assim que o site abre
    const loadInitialNews = async () => {
      const realNews = await fetchRealNews();
      if (realNews.length > 0) setArticles(realNews);
    };
    loadInitialNews();

    // 2. O Loop Infinito (300.000 ms = 5 minutos)
    const intervalId = setInterval(async () => {
      // Só busca se a aba do navegador estiver visível (economiza API e bateria)
      if (document.visibilityState === 'visible') {
        const realNews = await fetchRealNews();
        if (realNews.length > 0) setArticles(realNews);
      }
    }, 300000); 

    // Limpa o loop se o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setBrowserNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  useEffect(() => {
    if (user.id) localStorage.setItem('gamex_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('gamex_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('gamex_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('gamex_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addXp = (amount: number, reason: string) => {
    if (!user.id) return; // Só ganha XP se estiver logado
    
    const toastId = Math.random().toString(36).substring(2, 9);
    setXpToasts(prev => [...prev, { id: toastId, amount, reason }]);
    setTimeout(() => {
      setXpToasts(prev => prev.filter(t => t.id !== toastId));
    }, 3500);

    setXpGainTick(t => t + 1);

    setUser(prev => {
      const prevLevel = calculateLevel(prev.currentXp).level;
      const newTotalXp = prev.currentXp + amount;
      const levelInfo = calculateLevel(newTotalXp);
      const leveledUp = levelInfo.level > prevLevel;

      if (leveledUp) {
        setIsLevelingUp(true);
        setLastLevelUpNumber(levelInfo.level);
        setTimeout(() => setIsLevelingUp(false), 4500);
        setTimeout(() => {
          pushNotification({
            type: 'xp',
            title: `⚡ LEVEL UP! Você alcançou o Nível ${levelInfo.level}!`,
            message: `Parabéns, ${prev.name}! Sua patente agora é "${levelInfo.gamerRank}".`,
            sender: { name: 'Sistema GAMEx', avatar: '/logotipo.png', handle: '@gamex_system' },
            linkTab: 'profile',
          });
        }, 300);
      }
      
      const updatedBadges = checkBadges(prev.badges, {
        xp: newTotalXp,
        postCount: posts.filter(p => p.author.id === prev.id).length,
        savedCount: prev.savedArticles.length,
        commentCount: 0,
      });

      return {
        ...prev,
        currentXp: newTotalXp,
        level: levelInfo.level,
        gamerRank: levelInfo.gamerRank,
        nextLevelXp: levelInfo.levelXpCeiling,
        badges: updatedBadges,
      };
    });
  };

  const triggerLevelUpBonus = () => {
    const currentProgress = calculateLevel(user.currentXp);
    const xpNeeded = Math.max(50, currentProgress.levelXpCeiling - user.currentXp + 25);
    addXp(xpNeeded, '⚡ Conquista Especial da Comunidade (Level Up!)');
  };

  const openArticleModal = (article: NewsArticle) => {
    setSelectedArticle(article);
    if (user.id) addXp(15, `Leitura: ${article.title.substring(0, 24)}...`);
  };

  const closeArticleModal = () => setSelectedArticle(null);

  const toggleSaveArticle = (articleId: string) => {
    if (!user.id) return;
    setUser(prev => {
      const isSaved = prev.savedArticles.includes(articleId);
      const newSaved = isSaved ? prev.savedArticles.filter(id => id !== articleId) : [...prev.savedArticles, articleId];
      if (!isSaved) addXp(20, 'Notícia salva para ler depois!');
      return { ...prev, savedArticles: newSaved };
    });
  };

  const isArticleSaved = (articleId: string) => user.savedArticles.includes(articleId);

  const likeArticle = (articleId: string) => {
    setArticles(prev => prev.map(art => art.id === articleId ? { ...art, likes: art.likes + 1 } : art));
    if (user.id) addXp(10, 'Curtida em matéria jornalística');
  };

  const createPost = (data: any) => {
    if (!user.id) return;
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author: { id: user.id, name: user.name, handle: user.handle, avatar: user.avatar, isVerified: user.isVerified, level: user.level, role: 'Membro Ativo' },
      category: data.category,
      content: data.content,
      tags: data.tags,
      imageUrl: data.imageUrl,
      poll: data.pollQuestion && data.pollOptions?.length >= 2 ? {
        question: data.pollQuestion,
        options: data.pollOptions.map((opt: string, idx: number) => ({ id: `opt-${idx + 1}`, text: opt, votes: 0 })),
        totalVotes: 0,
      } : undefined,
      likes: 0,
      commentsCount: 0,
      repostsCount: 0,
      createdAt: new Date().toISOString(),
      hasLiked: false,
      comments: [],
    };
    setPosts(prev => [newPost, ...prev]);
    addXp(50, `Novo tópico em #${data.category}`);
  };

  const toggleLikePost = (postId: string) => {
    if (!user.id) return;
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !!p.hasLiked;
        if (!isLiked) addXp(5, 'Engajamento na comunidade');
        return { ...p, hasLiked: !isLiked, likes: isLiked ? Math.max(0, p.likes - 1) : p.likes + 1 };
      }
      return p;
    }));
  };

  const addCommentToPost = (postId: string, content: string) => {
    if (!content.trim() || !user.id) return;
    const newComment = {
      id: `comment-${Date.now()}`,
      postId,
      author: { id: user.id, name: user.name, handle: user.handle, avatar: user.avatar, level: user.level },
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, commentsCount: p.commentsCount + 1, comments: [...p.comments, newComment] } : p));
    addXp(25, 'Comentário em discussão gamer');
  };

  const votePoll = (postId: string, optionId: string) => {
    if (!user.id) return;
    setPosts(prev => prev.map(p => {
      if (p.id === postId && p.poll && !p.poll.userVotedOptionId) {
        addXp(15, 'Voto registrado na enquete');
        return { ...p, poll: { ...p.poll, userVotedOptionId: optionId, totalVotes: p.poll.totalVotes + 1, options: p.poll.options.map(opt => opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt) } };
      }
      return p;
    }));
  };

  const repostPost = (postId: string) => {
    if (!user.id) return;
    setUser(prev => {
      const alreadyReposted = prev.repostedPostIds.includes(postId);
      return { ...prev, repostedPostIds: alreadyReposted ? prev.repostedPostIds.filter(id => id !== postId) : [...prev.repostedPostIds, postId] };
    });
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isReposted = !!p.hasReposted;
        if (!isReposted) addXp(30, 'Post compartilhado no seu perfil!');
        return { ...p, hasReposted: !isReposted, repostsCount: isReposted ? Math.max(0, p.repostsCount - 1) : p.repostsCount + 1 };
      }
      return p;
    }));
  };

  const toggleReleaseReminder = (releaseId: string) => {
    setReleases(prev => prev.map(rel => {
      if (rel.id === releaseId) {
        const nextState = !rel.isReminded;
        if (nextState && user.id) addXp(10, `Lembrete ativado: ${rel.title}`);
        return { ...rel, isReminded: nextState };
      }
      return rel;
    }));
  };

  const markNotificationRead = (id: string) => setNotifications(prev => markNotificationAsRead(prev, id));
  const markAllNotificationsRead = () => setNotifications(prev => markAllNotificationsAsRead(prev));
  const dismissPushToast = () => setActivePushToast(null);

  const requestBrowserPushPermission = async (): Promise<boolean> => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        const granted = permission === 'granted';
        setBrowserNotificationsEnabled(granted);
        return granted;
      } catch { return false; }
    }
    return false;
  };

  const pushNotification = (data: any) => {
    const newNotification: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: data.type, title: data.title, message: data.message, postId: data.postId, sender: data.sender,
      createdAt: new Date().toISOString(), isRead: false, linkTab: data.linkTab || 'community',
    };
    setNotifications(prev => [newNotification, ...prev]);
    setActivePushToast(newNotification);
    setTimeout(() => setActivePushToast(current => (current?.id === newNotification.id ? null : current)), 6000);
  };

  const simulateIncomingNotification = (type: 'comment' | 'reply' = 'reply') => {
    const communityMembers = [{ name: 'Kira "Cyber" Vance', handle: '@cyber_valk', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }];
    const randomMember = communityMembers[0];
    pushNotification({
      type, title: 'Nova notificação', message: 'Teste de push.', sender: randomMember, linkTab: 'community',
    });
  };

  const unreadNotificationsCount = countUnreadNotifications(notifications);

  return (
    <AppContext.Provider value={{
      activeTab, setActiveTab, newsCategoryFilter, setNewsCategoryFilter, communityCategoryFilter, setCommunityCategoryFilter,
      user, setUser, addXp, xpToasts, articles, selectedArticle, openArticleModal, closeArticleModal, toggleSaveArticle, isArticleSaved, likeArticle,
      posts, createPost, toggleLikePost, addCommentToPost, votePoll, repostPost, releases, toggleReleaseReminder,
      isSearchOpen, setIsSearchOpen, isCreatePostOpen, setIsCreatePostOpen, isDiscordModalOpen, setIsDiscordModalOpen, isLoginModalOpen, setIsLoginModalOpen, isSplashOpen, setIsSplashOpen,
      notifications, unreadNotificationsCount, isNotificationsOpen, setIsNotificationsOpen, markNotificationRead, markAllNotificationsRead, pushNotification, activePushToast, dismissPushToast, simulateIncomingNotification, browserNotificationsEnabled, requestBrowserPushPermission,
      isLevelingUp, lastLevelUpNumber, xpGainTick, triggerLevelUpBonus,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};