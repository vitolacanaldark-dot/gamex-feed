import { Badge, NewsArticle, CommunityPost, PollOption, NotificationItem } from '../types.ts';

/**
 * Calculates gamer level, rank title, and level progress based on total XP.
 */
export function calculateLevel(totalXp: number): {
  level: number;
  gamerRank: string;
  levelXpFloor: number;
  levelXpCeiling: number;
  progressPercentage: number;
} {
  // Each level requires progressively 250 * level XP
  // Level 1: 0 - 250 XP
  // Level 2: 250 - 600 XP (gap 350)
  // etc.
  let level = 1;
  let accumulatedXp = 0;
  let nextThreshold = 250;

  while (totalXp >= accumulatedXp + nextThreshold) {
    accumulatedXp += nextThreshold;
    level += 1;
    nextThreshold = 250 + (level - 1) * 150;
  }

  const levelXpFloor = accumulatedXp;
  const levelXpCeiling = accumulatedXp + nextThreshold;
  const currentInLevel = Math.max(0, totalXp - levelXpFloor);
  const span = levelXpCeiling - levelXpFloor;
  const progressPercentage = Math.min(100, Math.round((currentInLevel / span) * 100));

  let gamerRank = 'Novato Arcade';
  if (level >= 20) gamerRank = 'Imortal Cyber-Legend';
  else if (level >= 15) gamerRank = 'Mestre dos eSports';
  else if (level >= 10) gamerRank = 'Veterano da Comunidade';
  else if (level >= 7) gamerRank = 'Caçador de Notícias';
  else if (level >= 4) gamerRank = 'Competidor Ouro';
  else if (level >= 2) gamerRank = 'Gamer Prata';

  return {
    level,
    gamerRank,
    levelXpFloor,
    levelXpCeiling,
    progressPercentage,
  };
}

/**
 * Detailed level progress breakdown with current and remaining XP in the level.
 */
export function calculateLevelProgress(totalXp: number): {
  level: number;
  gamerRank: string;
  levelXpFloor: number;
  levelXpCeiling: number;
  currentInLevel: number;
  span: number;
  progressPercentage: number;
} {
  const info = calculateLevel(totalXp);
  const currentInLevel = Math.max(0, totalXp - info.levelXpFloor);
  const span = Math.max(1, info.levelXpCeiling - info.levelXpFloor);
  return {
    ...info,
    currentInLevel,
    span,
  };
}

/**
 * Calculates stroke dashoffset for an SVG progress ring.
 */
export function calculateStrokeDashoffset(progressPercentage: number, circumference: number): number {
  const clamped = Math.max(0, Math.min(100, progressPercentage));
  return circumference - (circumference * clamped) / 100;
}

/**
 * Checks if a gain in XP caused the gamer to level up.
 */
export function hasLeveledUp(prevXp: number, newXp: number): boolean {
  const prevLevel = calculateLevel(prevXp).level;
  const newLevel = calculateLevel(newXp).level;
  return newLevel > prevLevel;
}

/**
 * Calculates percentages for each option in a poll.
 */
export function calculatePollPercentages(options: PollOption[]): Record<string, number> {
  const total = options.reduce((sum, opt) => sum + opt.votes, 0);
  const result: Record<string, number> = {};

  if (total === 0) {
    options.forEach(opt => {
      result[opt.id] = 0;
    });
    return result;
  }

  options.forEach(opt => {
    result[opt.id] = Math.round((opt.votes / total) * 100);
  });

  return result;
}

/**
 * Filter articles and community posts by a search query string.
 */
export function searchContent(
  query: string,
  articles: NewsArticle[],
  posts: CommunityPost[]
): {
  matchedArticles: NewsArticle[];
  matchedPosts: CommunityPost[];
  totalMatches: number;
} {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return {
      matchedArticles: articles,
      matchedPosts: posts,
      totalMatches: articles.length + posts.length,
    };
  }

  const matchedArticles = articles.filter(article => {
    return (
      article.title.toLowerCase().includes(trimmed) ||
      article.excerpt.toLowerCase().includes(trimmed) ||
      article.category.toLowerCase().includes(trimmed) ||
      article.tags.some(tag => tag.toLowerCase().includes(trimmed)) ||
      article.author.name.toLowerCase().includes(trimmed)
    );
  });

  const matchedPosts = posts.filter(post => {
    return (
      post.content.toLowerCase().includes(trimmed) ||
      post.category.toLowerCase().includes(trimmed) ||
      post.tags.some(tag => tag.toLowerCase().includes(trimmed)) ||
      post.author.name.toLowerCase().includes(trimmed) ||
      post.author.handle.toLowerCase().includes(trimmed)
    );
  });

  return {
    matchedArticles,
    matchedPosts,
    totalMatches: matchedArticles.length + matchedPosts.length,
  };
}

/**
 * Estimate reading time for content
 */
export function estimateReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min`;
}

/**
 * Calculates countdown / days remaining until release
 */
export function calculateDaysRemaining(
  targetDateIso: string,
  currentDate: Date = new Date()
): {
  days: number;
  isReleased: boolean;
  label: string;
} {
  const target = new Date(targetDateIso);
  const diffTime = target.getTime() - currentDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return {
      days: 0,
      isReleased: true,
      label: 'Já Lançado!',
    };
  } else if (diffDays === 1) {
    return {
      days: 1,
      isReleased: false,
      label: 'Lança Amanhã!',
    };
  } else {
    return {
      days: diffDays,
      isReleased: false,
      label: `Faltam ${diffDays} dias`,
    };
  }
}

/**
 * Updates unlocked badges given user stats
 */
export function checkBadges(
  badges: Badge[],
  stats: {
    xp: number;
    postCount: number;
    savedCount: number;
    commentCount: number;
  }
): Badge[] {
  return badges.map(badge => {
    let unlocked = badge.isUnlocked;
    if (badge.id === 'badge-novato' && stats.xp >= 100) unlocked = true;
    if (badge.id === 'badge-veterano' && stats.xp >= 1000) unlocked = true;
    if (badge.id === 'badge-cacador' && stats.savedCount >= 3) unlocked = true;
    if (badge.id === 'badge-criador' && stats.postCount >= 2) unlocked = true;
    if (badge.id === 'badge-debatedor' && stats.commentCount >= 3) unlocked = true;

    return {
      ...badge,
      isUnlocked: unlocked,
      unlockedAt: unlocked && !badge.unlockedAt ? new Date().toISOString() : badge.unlockedAt,
    };
  });
}

/**
 * Filter notifications by type or return all
 */
export function filterNotifications(
  notifications: NotificationItem[],
  filter: 'all' | 'comment' | 'reply' | 'system'
): NotificationItem[] {
  if (filter === 'all') return notifications;
  if (filter === 'comment') return notifications.filter(n => n.type === 'comment');
  if (filter === 'reply') return notifications.filter(n => n.type === 'reply');
  if (filter === 'system') return notifications.filter(n => n.type === 'xp' || n.type === 'system');
  return notifications;
}

/**
 * Counts how many unread notifications exist
 */
export function countUnreadNotifications(notifications: NotificationItem[]): number {
  return notifications.filter(n => !n.isRead).length;
}

/**
 * Marks a single notification as read
 */
export function markNotificationAsRead(
  notifications: NotificationItem[],
  id: string
): NotificationItem[] {
  return notifications.map(n => (n.id === id ? { ...n, isRead: true } : n));
}

/**
 * Marks all notifications as read
 */
export function markAllNotificationsAsRead(
  notifications: NotificationItem[]
): NotificationItem[] {
  return notifications.map(n => ({ ...n, isRead: true }));
}

