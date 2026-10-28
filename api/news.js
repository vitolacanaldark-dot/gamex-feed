// api/news.js
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const API_KEYS = [
  "81f4e37bbd147c199a3498c85ff7c572",
  "ce0b57eb8b3c6cf8d6549d098bee7e2c",
  "2b42036f62c14806b415a240b15b999f"
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const query = 'games OR videogame OR esports OR PlayStation OR Xbox OR Nintendo';
  let fetchedArticles = null;

  // 1. BUSCAR NOTÍCIAS NO GNEWS
  for (const key of API_KEYS) {
    try {
      const gnewsUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=pt&sortby=publishedAt&max=5&apikey=${key}`;
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

  if (!fetchedArticles) {
    return res.status(500).json({ success: false, message: "Nenhuma API key do GNews funcionou." });
  }

  // 2. REESCREVER COM O GEMINI (Usando o novo Header X-goog-api-key)
  try {
    const rewrittenArticles = await Promise.all(fetchedArticles.map(async (art) => {
      
      const prompt = `
        Você é um jornalista profissional do portal de games "GAMEx FEED".
        Sua tarefa é reescrever a notícia abaixo de forma 100% original, com as suas próprias palavras, mantendo todos os fatos reais.
        O texto deve ser em português do Brasil, empolgante, voltado para gamers, e ter entre 3 a 5 parágrafos.
        Não use o nome do veículo original. Comece o texto direto com a informação.
        Não inclua links no texto.

        Título original: ${art.title}
        Resumo original: ${art.description}
        Conteúdo original: ${art.content || ''}
      `;

      try {
        // Usando o endpoint que o seu curl mostrou que funciona
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`;
        
        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-goog-api-key': GEMINI_API_KEY // <--- AQUI ESTÁ A MÁGICA
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          console.error("Erro na API do Gemini:", errText);
          return art; // Retorna a original se falhar
        }

        const data = await response.json();
        const newText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!newText) {
          console.error("Gemini não retornou texto.");
          return art;
        }

        return {
          ...art,
          content: newText,
          isRewritten: true,
        };

      } catch (geminiError) {
        console.error("Erro no fetch do Gemini:", geminiError);
        return art; // Retorna a original se falhar
      }
    }));

    res.status(200).json({ success: true, articles: rewrittenArticles });

  } catch (error) {
    console.error("Erro geral no Gemini:", error);
    res.status(200).json({ success: true, articles: fetchedArticles });
  }
}