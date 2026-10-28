export type CategoryType = 'Todos' | 'PC' | 'PlayStation' | 'Xbox' | 'Nintendo' | 'eSports' | 'Mobile' | 'Hardware';

export type CommunityCategory = 'Todos' | 'Dúvida' | 'Curiosidade' | 'Notícia' | 'Review' | 'LFG';

export interface Author {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role?: string;
  isVerified?: boolean;
  level?: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: CategoryType;
  tags: string[];
  author: Author;
  readTime: string;
  publishedAt: string;
  views: number;
  likes: number;
  isHero?: boolean;
  isHeroTop?: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface CommunityComment {
  id: string;
  postId: string;
  author: Author;
  content: string;
  createdAt: string;
  likes: number;
  hasLiked?: boolean;
  replyTo?: string;
}

export interface CommunityPost {
  id: string;
  author: Author;
  category: CommunityCategory;
  content: string;
  tags: string[];
  imageUrl?: string;
  poll?: {
    question: string;
    options: PollOption[];
    userVotedOptionId?: string;
    totalVotes: number;
  };
  likes: number;
  commentsCount: number;
  repostsCount: number;
  createdAt: string;
  hasLiked?: boolean;
  hasReposted?: boolean;
  comments: CommunityComment[];
  isPinned?: boolean;
}

export interface GameRelease {
  id: string;
  title: string;
  developer: string;
  releaseDate: string; // ISO date format YYYY-MM-DD
  platforms: ('PC' | 'PS5' | 'Xbox Series' | 'Switch 2' | 'Mobile')[];
  coverImage: string;
  genre: string;
  isReminded?: boolean;
  hypeScore: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  unlockedAt?: string;
  requirement: string;
  isUnlocked: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  bio: string;
  avatar: string;
  bannerImage: string;
  isVerified: boolean;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  gamerRank: string;
  followersCount: number;
  followingCount: number;
  joinedDate: string;
  badges: Badge[];
  savedArticles: string[]; // article IDs
  repostedPostIds: string[];
}

export type NotificationType = 'comment' | 'reply' | 'like' | 'xp' | 'system';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  postId?: string;
  sender: {
    name: string;
    avatar: string;
    handle: string;
  };
  createdAt: string;
  isRead: boolean;
  linkTab?: 'community' | 'profile' | 'news';
}
