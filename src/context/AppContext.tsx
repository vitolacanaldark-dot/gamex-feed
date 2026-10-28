import React, { createContext, useContext, useState, useEffect } from 'react';
import { NewsArticle, CommunityPost, GameRelease, UserProfile, CategoryType, CommunityCategory, NotificationItem } from '../types.ts';
import { INITIAL_USER, INITIAL_NEWS, INITIAL_RELEASES, INITIAL_NOTIFICATIONS } from '../data/mockData.ts';
import { calculateLevel, checkBadges, countUnreadNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../utils/gamerLogic.ts';
import { fetchRealNews } from '../newsService.ts';
import { supabase } from '../lib/supabase.ts';

interface XpToast { id: string; amount: number; reason: string; }

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
  createPost: (data: any) => void;
  toggleLikePost: (postId: string) => void;
  addCommentToPost: (postId: string, content: string) => void;
  votePoll: (postId: string, optionId: string) => void;
  repostPost: (postId: string) => void;
  releases: GameRelease[];
  toggleReleaseReminder: (releaseId: string) => void;
  isSearchOpen: boolean; setIsSearchOpen: (open: boolean) => void;
  isCreatePostOpen: boolean; setIsCreatePostOpen: (open: boolean) => void;
  isDiscordModalOpen: boolean; setIsDiscordModalOpen: (open: boolean) => void;
  isLoginModalOpen: boolean; setIsLoginModalOpen: (open: boolean) => void;
  isSplashOpen: boolean; setIsSplashOpen: (open: boolean) => void;
  notifications: NotificationItem[]; unreadNotificationsCount: number; isNotificationsOpen: boolean; setIsNotificationsOpen: (open: boolean) => void; markNotificationRead: (id: string) => void; markAllNotificationsRead: () => void;
  pushNotification: (data: any) => void; activePushToast: NotificationItem | null; dismissPushToast: () => void; simulateIncomingNotification: (type?: 'comment' | 'reply') => void; browserNotificationsEnabled: boolean; requestBrowserPushPermission: () => Promise<boolean>;
  isLevelingUp: boolean; lastLevelUpNumber: number | null; xpGainTick: number; triggerLevelUpBonus: () => void;
  refreshPosts: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'news' | 'community' | 'calendar' | 'profile'>('home');
  const [newsCategoryFilter, setNewsCategoryFilter] = useState<CategoryType>('Todos');
  const [communityCategoryFilter, setCommunityCategoryFilter] = useState<CommunityCategory>('Todos');
  
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [articles, setArticles] = useState<NewsArticle[]>(INITIAL_NEWS);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
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
  
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [xpToasts, setXpToasts] = useState<XpToast[]>([]);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [lastLevelUpNumber, setLastLevelUpNumber] = useState<number | null>(null);
  const [xpGainTick, setXpGainTick] = useState(0);

  // --- FUNÇÕES DO SUPABASE ---

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`*, profiles:user_id (username, avatar_url, level)`)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      const formattedPosts = data.map((p: any) => ({
        id: p.id,
        author: { 
          id: p.user_id, 
          name: p.profiles?.username || 'Usuário', 
          handle: `@${p.profiles?.username || 'user'}`, 
          avatar: p.profiles?.avatar_url || 'https://i.imgur.com/uXOvpRq.png', 
          level: p.profiles?.level || 1 
        },
        category: p.category,
        content: p.content,
        tags: p.tags || [],
        imageUrl: p.image_url,
        likes: p.likes,
        commentsCount: p.comments_count,
        repostsCount: p.reposts_count,
        createdAt: p.created_at,
        hasLiked: false,
        isPinned: p.is_pinned || false, // Garantindo que o fixado seja lido
        comments: []
      }));
      setPosts(formattedPosts);
    }
  };

  const createWelcomePost = async () => {
    // Verifica se o post de boas-vindas já existe
    const { data } = await supabase.from('posts').select('id').eq('is_pinned', true).limit(1);
    
    if (!data || data.length === 0) {
      // Cria o post usando o ID do admin (o user.id será substituído pelo Admin)
      // Como não temos um ID de Auth para o admin, usamos um texto genérico ou criamos um "sistema"
      // No Supabase, precisamos de um user_id válido. Vamos usar o primeiro admin que encontrar.
      const { data: adminProfile } = await supabase.from('profiles').select('id').limit(1).single();
      
      if (adminProfile) {
        await supabase.from('posts').insert([{
          user_id: adminProfile.id,
          content: `Bem-vindo à Comunidade GAMEx FEED! 🎮\n\nEste é o seu espaço para compartilhar notícias, tirar dúvidas, criar enquetes, encontrar esquadrões (LFG) e muito mais. \n\nPara começar a interagir e ganhar XP, crie sua conta agora mesmo!`,
          category: 'Notícia',
          is_pinned: true,
          likes: 0,
          comments_count: 0,
          reposts_count: 0
        }]);
        // Recarrega os posts para mostrar o novo
        fetchPosts();
      }
    }
  };

  const loadUserProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) {
      setUser({
        ...INITIAL_USER,
        id: data.id,
        name: data.username || 'Gamer',
        handle: `@${data.username || 'gamer'}`,
        avatar: data.avatar_url || 'https://i.imgur.com/uXOvpRq.png',
        bio: data.bio,
        level: data.level,
        currentXp: data.current_xp,
        gamerRank: data.gamer_rank,
        followersCount: data.followers_count,
        followingCount: data.following_count,
        savedArticles: data.saved_articles || [],
        repostedPostIds: data.reposted_posts || [],
      });
    }
  };

  useEffect(() => {
    const loadNews = async () => {
      const realNews = await fetchRealNews();
      if (realNews.length > 0) setArticles(realNews);
    };
    loadNews();
    
    // Carrega os posts e verifica se precisa criar o post fixado
    const initCommunity = async () => {
      await fetchPosts();
      await createWelcomePost();
    };
    initCommunity();

    // Verifica se o usuário já está logado
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadUserProfile(session.user.id);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setUser(INITIAL_USER);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const addXp = async (amount: number, reason: string) => {
    if (!user.id) return;
    const toastId = Math.random().toString(36).substring(2, 9);
    setXpToasts(prev => [...prev, { id: toastId, amount, reason }]);
    setTimeout(() => setXpToasts(prev => prev.filter(t => t.id !== toastId)), 3500);

    const newXp = user.currentXp + amount;
    const levelInfo = calculateLevel(newXp);
    
    if (levelInfo.level > user.level) {
      setIsLevelingUp(true);
      setLastLevelUpNumber(levelInfo.level);
      setTimeout(() => setIsLevelingUp(false), 4500);
    }

    setUser(prev => ({ ...prev, currentXp: newXp, level: levelInfo.level, gamerRank: levelInfo.gamerRank }));
    
    await supabase.from('profiles').update({ 
      current_xp: newXp, 
      level: levelInfo.level, 
      gamer_rank: levelInfo.gamerRank 
    }).eq('id', user.id);
  };

  const createPost = async (data: any) => {
    if (!user.id) return;
    const { error } = await supabase.from('posts').insert([{
      user_id: user.id,
      content: data.content,
      category: data.category,
      tags: data.tags,
      image_url: data.imageUrl
    }]);
    
    if (!error) {
      fetchPosts(); 
      addXp(50, `Novo tópico em #${data.category}`);
    }
  };

  const toggleLikePost = async (postId: string) => {
     setPosts(prev => prev.map(p => p.id === postId ? { ...p, hasLiked: !p.hasLiked, likes: p.hasLiked ? p.likes - 1 : p.likes + 1 } : p));
     const post = posts.find(p => p.id === postId);
     if (post) {
       const newLikes = post.hasLiked ? post.likes - 1 : post.likes + 1;
       await supabase.from('posts').update({ likes: newLikes }).eq('id', postId);
     }
  };

  const openArticleModal = (article: NewsArticle) => { setSelectedArticle(article); if (user.id) addXp(15, `Leitura: ${article.title.substring(0, 24)}...`); };
  const closeArticleModal = () => setSelectedArticle(null);
  const toggleSaveArticle = (articleId: string) => { setUser(prev => { const isSaved = prev.savedArticles.includes(articleId); return { ...prev, savedArticles: isSaved ? prev.savedArticles.filter(id => id !== articleId) : [...prev.savedArticles, articleId] }}) };
  const isArticleSaved = (articleId: string) => user.savedArticles.includes(articleId);
  const likeArticle = (articleId: string) => { setArticles(prev => prev.map(art => art.id === articleId ? { ...art, likes: art.likes + 1 } : art)); if (user.id) addXp(10, 'Curtida em matéria'); };
  const addCommentToPost = (postId: string, content: string) => { addXp(25, 'Comentário'); };
  const votePoll = (postId: string, optionId: string) => { };
  const repostPost = (postId: string) => { };
  const toggleReleaseReminder = (releaseId: string) => { setReleases(prev => prev.map(rel => rel.id === releaseId ? { ...rel, isReminded: !rel.isReminded } : rel)); if (user.id) addXp(10, 'Lembrete'); };
  const markNotificationRead = (id: string) => setNotifications(prev => markNotificationAsRead(prev, id));
  const markAllNotificationsRead = () => setNotifications(prev => markAllNotificationsAsRead(prev));
  const dismissPushToast = () => setActivePushToast(null);
  const requestBrowserPushPermission = async () => false;
  const pushNotification = (data: any) => {};
  const simulateIncomingNotification = (type: 'comment' | 'reply' = 'reply') => {};
  const triggerLevelUpBonus = () => addXp(50, 'Bônus de Nível');
  
  const unreadNotificationsCount = countUnreadNotifications(notifications);

  return (
    <AppContext.Provider value={{
      activeTab, setActiveTab, newsCategoryFilter, setNewsCategoryFilter, communityCategoryFilter, setCommunityCategoryFilter,
      user, setUser, addXp, xpToasts, articles, selectedArticle, openArticleModal, closeArticleModal, toggleSaveArticle, isArticleSaved, likeArticle,
      posts, createPost, toggleLikePost, addCommentToPost, votePoll, repostPost, releases, toggleReleaseReminder,
      isSearchOpen, setIsSearchOpen, isCreatePostOpen, setIsCreatePostOpen, isDiscordModalOpen, setIsDiscordModalOpen, isLoginModalOpen, setIsLoginModalOpen, isSplashOpen, setIsSplashOpen,
      notifications, unreadNotificationsCount, isNotificationsOpen, setIsNotificationsOpen, markNotificationRead, markAllNotificationsRead, pushNotification, activePushToast, dismissPushToast, simulateIncomingNotification, browserNotificationsEnabled, requestBrowserPushPermission,
      isLevelingUp, lastLevelUpNumber, xpGainTick, triggerLevelUpBonus, refreshPosts: fetchPosts,
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