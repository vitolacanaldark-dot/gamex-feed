import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLevel,
  calculateLevelProgress,
  calculateStrokeDashoffset,
  hasLeveledUp,
  calculatePollPercentages,
  searchContent,
  estimateReadingTime,
  calculateDaysRemaining,
  checkBadges,
  filterNotifications,
  countUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from './gamerLogic.ts';
import { Badge, NewsArticle, CommunityPost, PollOption } from '../types.ts';

test('calculateLevel properly calculates levels and rank thresholds', () => {
  const lvl1 = calculateLevel(0);
  assert.equal(lvl1.level, 1);
  assert.equal(lvl1.gamerRank, 'Novato Arcade');
  assert.equal(lvl1.progressPercentage, 0);

  const lvl2 = calculateLevel(300);
  assert.equal(lvl2.level, 2);
  assert.equal(lvl2.gamerRank, 'Gamer Prata');
  assert.ok(lvl2.progressPercentage > 0);

  const lvlHigh = calculateLevel(15000);
  assert.ok(lvlHigh.level >= 10);
  assert.ok(lvlHigh.gamerRank.length > 0);
});

test('calculateLevelProgress and calculateStrokeDashoffset return precise progress ring metrics', () => {
  const progressZero = calculateLevelProgress(0);
  assert.equal(progressZero.currentInLevel, 0);
  assert.equal(progressZero.progressPercentage, 0);
  const circumference = 120;
  assert.equal(calculateStrokeDashoffset(0, circumference), 120);
  assert.equal(calculateStrokeDashoffset(50, circumference), 60);
  assert.equal(calculateStrokeDashoffset(100, circumference), 0);

  const progressMid = calculateLevelProgress(125);
  assert.equal(progressMid.level, 1);
  assert.equal(progressMid.currentInLevel, 125);
  assert.equal(progressMid.span, 250);
  assert.equal(progressMid.progressPercentage, 50);

  // Check level up detection
  assert.equal(hasLeveledUp(240, 260), true);
  assert.equal(hasLeveledUp(200, 240), false);
});

test('calculatePollPercentages handles zero and multiple votes with accurate ratios', () => {
  const emptyOptions: PollOption[] = [
    { id: '1', text: 'Opção A', votes: 0 },
    { id: '2', text: 'Opção B', votes: 0 },
  ];
  const zeroPercentages = calculatePollPercentages(emptyOptions);
  assert.equal(zeroPercentages['1'], 0);
  assert.equal(zeroPercentages['2'], 0);

  const options: PollOption[] = [
    { id: '1', text: 'GTA VI', votes: 75 },
    { id: '2', text: 'Witcher 4', votes: 25 },
  ];
  const percentages = calculatePollPercentages(options);
  assert.equal(percentages['1'], 75);
  assert.equal(percentages['2'], 25);
});

test('searchContent finds matches in articles and community posts', () => {
  const mockArticles: NewsArticle[] = [
    {
      id: 'art-1',
      title: 'GTA 6 ganha novo trailer épico em Vice City',
      slug: 'gta-6-novo-trailer',
      excerpt: 'Rockstar revela novos detalhes gráficos e mapa imenso.',
      content: 'Texto completo sobre GTA 6...',
      coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      category: 'PlayStation',
      tags: ['GTA', 'Rockstar', 'Vice City'],
      author: { id: 'u1', name: 'Lucas Gamer', handle: '@lucas', avatar: '' },
      readTime: '3 min',
      publishedAt: '2026-10-27T10:00:00Z',
      views: 1200,
      likes: 150,
    },
  ];

  const mockPosts: CommunityPost[] = [
    {
      id: 'post-1',
      author: { id: 'u2', name: 'Ana Cyber', handle: '@anacyber', avatar: '' },
      category: 'Dúvida',
      content: 'Alguém mais com hype absurdo para o lançamento do novo console?',
      tags: ['hype', 'consoles'],
      likes: 20,
      commentsCount: 5,
      repostsCount: 2,
      createdAt: '2026-10-27T12:00:00Z',
      comments: [],
    },
  ];

  const gtaSearch = searchContent('GTA', mockArticles, mockPosts);
  assert.equal(gtaSearch.matchedArticles.length, 1);
  assert.equal(gtaSearch.matchedPosts.length, 0);

  const hypeSearch = searchContent('hype', mockArticles, mockPosts);
  assert.equal(hypeSearch.matchedArticles.length, 0);
  assert.equal(hypeSearch.matchedPosts.length, 1);

  const blankSearch = searchContent('', mockArticles, mockPosts);
  assert.equal(blankSearch.totalMatches, 2);
});

test('estimateReadingTime handles different word lengths', () => {
  const shortText = 'Breve notícia gamer de última hora!';
  assert.equal(estimateReadingTime(shortText), '1 min');

  const longText = new Array(400).fill('gamer').join(' ');
  assert.equal(estimateReadingTime(longText), '3 min');
});

test('calculateDaysRemaining calculates remaining days correctly', () => {
  const baseDate = new Date('2026-10-27T12:00:00Z');
  const futureDate = '2026-10-30T12:00:00Z';
  const pastDate = '2026-10-20T12:00:00Z';

  const remaining = calculateDaysRemaining(futureDate, baseDate);
  assert.equal(remaining.days, 3);
  assert.equal(remaining.isReleased, false);

  const past = calculateDaysRemaining(pastDate, baseDate);
  assert.equal(past.isReleased, true);
});

test('checkBadges unlocks badges based on user engagement metrics', () => {
  const initialBadges: Badge[] = [
    {
      id: 'badge-novato',
      name: 'Novato Arcade',
      description: 'Atinja 100 XP na plataforma',
      iconName: 'Zap',
      requirement: '100 XP',
      isUnlocked: false,
    },
    {
      id: 'badge-cacador',
      name: 'Caçador de Notícias',
      description: 'Salve 3 matérias para ler depois',
      iconName: 'Bookmark',
      requirement: '3 Notícias Salvas',
      isUnlocked: false,
    },
  ];

  const updated = checkBadges(initialBadges, {
    xp: 150,
    postCount: 0,
    savedCount: 3,
    commentCount: 0,
  });

  assert.equal(updated[0].isUnlocked, true);
  assert.equal(updated[1].isUnlocked, true);
});

test('notification logic filters, counts unread, and marks as read', () => {
  const notifs = [
    {
      id: 'n-1',
      type: 'comment' as const,
      title: 'Novo Comentário',
      message: 'Lucas comentou no seu post de CS2',
      sender: { name: 'Lucas', avatar: '', handle: '@lucas' },
      createdAt: '2026-10-27T12:00:00Z',
      isRead: false,
    },
    {
      id: 'n-2',
      type: 'reply' as const,
      title: 'Resposta na Thread',
      message: 'Val respondeu ao seu comentário na enquete',
      sender: { name: 'Val', avatar: '', handle: '@val' },
      createdAt: '2026-10-27T12:05:00Z',
      isRead: false,
    },
    {
      id: 'n-3',
      type: 'xp' as const,
      title: 'XP Concedido',
      message: '+50 XP recebido',
      sender: { name: 'Sistema', avatar: '', handle: '@gamex' },
      createdAt: '2026-10-27T12:10:00Z',
      isRead: true,
    },
  ];

  assert.equal(countUnreadNotifications(notifs), 2);

  const commentsOnly = filterNotifications(notifs, 'comment');
  assert.equal(commentsOnly.length, 1);
  assert.equal(commentsOnly[0].id, 'n-1');

  const repliesOnly = filterNotifications(notifs, 'reply');
  assert.equal(repliesOnly.length, 1);
  assert.equal(repliesOnly[0].id, 'n-2');

  const readOne = markNotificationAsRead(notifs, 'n-1');
  assert.equal(countUnreadNotifications(readOne), 1);
  assert.equal(readOne[0].isRead, true);

  const readAll = markAllNotificationsAsRead(notifs);
  assert.equal(countUnreadNotifications(readAll), 0);
});
