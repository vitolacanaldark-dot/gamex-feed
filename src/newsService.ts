// src/newsService.ts
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
  return articles.map((art: any, index: number) => {
    const isRewritten = art.isRewritten || false;
    const rawContent = art.content || art.description || '';
    const cleanContent = rawContent.replace(/\[\+\d+\s+chars\]/gi, '').replace(/\[\d+\s+chars\]/gi, '').trim();

    return {
      id: `gnews-${Date.now()}-${index}`,
      title: art.title,
      slug: isRewritten ? `noticia-${Date.now()}-${index}` : art.url, 
      excerpt: art.description,
      content: cleanContent, 
      coverImage: art.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
      category: 'Notícias', 
      tags: ['Games', 'GAMEx FEED'],
      author: GAMEX_AUTHOR,
      readTime: '3 min',
      publishedAt: art.publishedAt || new Date().toISOString(),
      views: 0,
      likes: 0,
    };
  });
};

export const fetchRealNews = async (force: boolean = false) => {
  const lastFetch = localStorage.getItem('gamex_news_last_fetch');
  const cachedNewsString = localStorage.getItem('gamex_news_cache');
  const now = Date.now();
  const timeSinceLastFetch = lastFetch ? now - parseInt(lastFetch) : Infinity;

  // Se não for forçado e o cache for recente (menos de 5 min), retorna o cache
  if (!force && cachedNewsString && timeSinceLastFetch < CACHE_TIME_MS) {
    return JSON.parse(cachedNewsString);
  }

  console.log("🔄 Buscando novas notícias para atualizar o histórico...");
  let fetchedNews: any[] = [];

  try {
    const apiUrl = `/api/news?t=${Date.now()}`; // Evita cache da Vercel
    const response = await fetch(apiUrl);
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.articles) {
        console.log(`✅ ${data.articles.length} notícias novas carregadas.`);
        fetchedNews = formatGNews(data.articles);
      }
    } else {
        console.warn(`⚠️ API Route falhou.`);
    }
  } catch (error) {
    console.warn(`⚠️ Erro ao chamar a API Route.`);
  }

  // JUNTA NOTÍCIAS NOVAS COM O HISTÓRICO DO CACHE
  const existingNews = cachedNewsString ? JSON.parse(cachedNewsString) : [];
  const allNews = [...fetchedNews, ...existingNews];
  
  // Remove duplicatas (pelo título)
  const uniqueNewsMap = new Map();
  allNews.forEach(news => {
    if (!uniqueNewsMap.has(news.title)) {
      uniqueNewsMap.set(news.title, news);
    }
  });

  // Ordena da mais recente para a mais antiga e mantém o histórico de 50 notícias
  const sortedNews = Array.from(uniqueNewsMap.values())
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 50);

  // SALVA NO CACHE
  localStorage.setItem('gamex_news_cache', JSON.stringify(sortedNews));
  localStorage.setItem('gamex_news_last_fetch', now.toString());

  return sortedNews;
};