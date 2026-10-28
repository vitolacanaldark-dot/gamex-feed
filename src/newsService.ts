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

  if (!force && cachedNewsString && timeSinceLastFetch < CACHE_TIME_MS) {
    return JSON.parse(cachedNewsString);
  }

  console.log("🔄 Buscando notícias via API Route (Vercel)...");
  let fetchedNews: any[] = [];

  try {
    const apiUrl = `/api/news?t=${Date.now()}`; // O '?t=' evita cache da Vercel
    
    const response = await fetch(apiUrl);
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.articles) {
        console.log(`✅ Sucesso! ${data.articles.length} notícias carregadas via Back-end.`);
        fetchedNews = formatGNews(data.articles);
      }
    } else {
        console.warn(`⚠️ API Route falhou.`);
    }
  } catch (error) {
    console.warn(`⚠️ Erro ao chamar a API Route.`);
  }

  // Se a API falhar, o array fica vazio. O site mostra a mensagem de "sem notícias".
  const sortedNews = fetchedNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  localStorage.setItem('gamex_news_cache', JSON.stringify(sortedNews));
  localStorage.setItem('gamex_news_last_fetch', now.toString());

  return sortedNews;
};