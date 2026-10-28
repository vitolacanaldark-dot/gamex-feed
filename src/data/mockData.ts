import { NewsArticle, CommunityPost, GameRelease, UserProfile, Badge, NotificationItem } from '../types.ts';

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-adotante',
    name: 'Adotante Inicial',
    description: 'Cadastre-se e complete seu perfil para fazer parte da comunidade.',
    iconName: 'Star',
    requirement: 'Completar Perfil',
    isUnlocked: false,
  },
  {
    id: 'badge-colaborador',
    name: 'Colaborador Principal',
    description: 'Alcance 1.000 XP postando e interagindo na comunidade.',
    iconName: 'MessageSquare',
    requirement: '1.000 XP',
    isUnlocked: false,
  },
  {
    id: 'badge-vencedor',
    name: 'Vencedor do Torneio',
    description: 'Vença um evento oficial da comunidade GAMEx FEED.',
    iconName: 'Trophy',
    requirement: 'Vitória em Torneio',
    isUnlocked: false,
  },
];

export const INITIAL_USER: UserProfile = {
  id: '',
  name: '',
  handle: '',
  bio: '',
  avatar: '',
  bannerImage: '',
  isVerified: false,
  level: 1,
  currentXp: 0,
  nextLevelXp: 250,
  gamerRank: 'Visitante',
  followersCount: 0,
  followingCount: 0,
  joinedDate: '',
  badges: INITIAL_BADGES,
  savedArticles: [],
  repostedPostIds: [],
};

// 👇 ARRAY DE NOTÍCIAS VAZIO (Elas virão 100% da API agora)
export const INITIAL_NEWS: NewsArticle[] = []; 

export const INITIAL_POSTS: CommunityPost[] = [];

export const INITIAL_RELEASES: GameRelease[] = [
  {
    id: 'rel-1',
    title: 'Monster Hunter Wilds',
    developer: 'Capcom',
    releaseDate: '2026-11-15',
    platforms: ['PC', 'PS5', 'Xbox Series'],
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
    genre: 'RPG de Ação / Co-op',
    hypeScore: 98,
    isReminded: false,
  },
  {
    id: 'rel-2',
    title: 'Grand Theft Auto VI',
    developer: 'Rockstar Games',
    releaseDate: '2026-12-05',
    platforms: ['PS5', 'Xbox Series'],
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
    genre: 'Ação / Mundo Aberto',
    hypeScore: 100,
    isReminded: false,
  },
  {
    id: 'rel-3',
    title: 'Doom: The Dark Ages',
    developer: 'id Software / Bethesda',
    releaseDate: '2026-11-28',
    platforms: ['PC', 'PS5', 'Xbox Series'],
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
    genre: 'FPS Rápido / Ação Brutal',
    hypeScore: 94,
    isReminded: false,
  },
  {
    id: 'rel-4',
    title: 'Novo Metroid Prime 4: Beyond',
    developer: 'Retro Studios / Nintendo',
    releaseDate: '2026-12-18',
    platforms: ['Switch 2'],
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800',
    genre: 'Aventura / Tiro em 1ª Pessoa',
    hypeScore: 96,
    isReminded: false,
  },
  {
    id: 'rel-5',
    title: 'Death Stranding 2: On The Beach',
    developer: 'Kojima Productions',
    releaseDate: '2027-01-20',
    platforms: ['PS5'],
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
    genre: 'Ação Cinematográfica / Sci-Fi',
    hypeScore: 92,
    isReminded: false,
  },
];

export const TRENDING_TOPICS: { tag: string; postsCount: string; category: string }[] = [];

export const INSTAGRAM_EMBED_DATA = {
  account: '@gamexfeed',
  name: 'GAMEx FEED Oficial',
  followers: '128.4K',
  postsCount: '1.450+',
  recentPhotos: [
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&auto=format&fit=crop&q=80',
  ],
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];