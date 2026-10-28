// src/newsService.ts
import { INITIAL_NEWS } from './data/mockData';

const GAMEX_AUTHOR = {
  id: 'user-admin',
  name: 'GAMEx FEED',
  handle: '@gamexfeed',
  avatar: 'https://i.imgur.com/uXOvpRq.png',
  isVerified: true,
  role: 'Portal Oficial',
  level: 99,
};

const CACHE_TIME_MS = 5 * 60 * 1000; // 5 minutos

const formatGNews = (articles: any[]) => {
  return articles.map((art: any, index: number) => ({
    id: `gnews-${Date.now()}-${index}`,
    title: art.title,
    slug: art.url,
    excerpt: art.description,
    content: art.content || art.description, 
    coverImage: art.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    category: 'Notícias', 
    tags: ['Games', 'GAMEx FEED'],
    author: GAMEX_AUTHOR,
    readTime: '3 min',
    publishedAt: art.publishedAt || new Date().toISOString(),
    views: 0,
    likes: 0,
  }));
};

export const fetchRealNews = async (force: boolean = false) => {
  const lastFetch = localStorage.getItem('gamex_news_last_fetch');
  const cachedNewsString = localStorage.getItem('gamex_news_cache');
  const now = Date.now();
  const timeSinceLastFetch = lastFetch ? now - parseInt(lastFetch) : Infinity;

  if (!force && cachedNewsString && timeSinceLastFetch < CACHE_TIME_MS) {
    return JSON.parse(cachedNewsString);
  }

  console.log("🔄 Buscando notícias via API Route (Vercel)...");
  let fetchedNews: any[] = [];

  try {
    // No localhost, a Vercel não roda a pasta api. 
    // Mas quando você fizer o deploy, ela vai funcionar perfeitamente.
    const apiUrl = "/api/news"; 
    
    const response = await fetch(apiUrl);
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.articles) {
        console.log(`✅ Sucesso! ${data.articles.length} notícias carregadas via Back-end.`);
        fetchedNews = formatGNews(data.articles);
      }
    } else {
        console.warn(`⚠️ API Route falhou. (Normal no localhost sem vercel dev)`);
    }
  } catch (error) {
    console.warn(`⚠️ Erro ao chamar a API Route.`);
  }

  // Juntar notícias e cache (Fallback)
  let existingNews = cachedNewsString ? JSON.parse(cachedNewsString) : [];
  
  if (existingNews.length === 0) {
     existingNews = INITIAL_NEWS.map((art, index) => ({
      ...art,
      id: `local-${index}`,
      author: GAMEX_AUTHOR,
      publishedAt: art.publishedAt || new Date(Date.now() - index * 3600000).toISOString(),
    }));
  }

  const allNews = [...fetchedNews, ...existingNews];
  const uniqueNewsMap = new Map();
  
  allNews.forEach(news => {
    if (!uniqueNewsMap.has(news.title)) {
      uniqueNewsMap.set(news.title, news);
    }
  });

  const sortedNews = Array.from(uniqueNewsMap.values())
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 50);

  localStorage.setItem('gamex_news_cache', JSON.stringify(sortedNews));
  localStorage.setItem('gamex_news_last_fetch', now.toString());

  return sortedNews;
};