// api/news.js (Back-end da Vercel)
const API_KEYS = [
  "81f4e37bbd147c199a3498c85ff7c572",
  "ce0b57eb8b3c6cf8d6549d098bee7e2c",
  "2b42036f62c14806b415a240b15b999f"
];

export default async function handler(req, res) {
  // Permite que o seu site acesse essa API
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const query = 'games OR videogame OR esports OR PlayStation OR Xbox OR Nintendo';
  let fetchedArticles = null;

  // ROTAÇÃO DAS CHAVES
  for (const key of API_KEYS) {
    try {
      const gnewsUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=pt&sortby=publishedAt&max=10&apikey=${key}`;
      
      const apiResponse = await fetch(gnewsUrl);
      
      if (apiResponse.ok) {
        const data = await apiResponse.json();
        if (data.articles && data.articles.length > 0) {
          fetchedArticles = data.articles;
          break; 
        }
      }
    } catch (error) {
      console.error(`Erro com a chave ...${key.slice(-4)}`);
    }
  }

  if (fetchedArticles) {
    res.status(200).json({ success: true, articles: fetchedArticles });
  } else {
    res.status(500).json({ success: false, message: "Nenhuma API key funcionou ou limite atingido." });
  }
}