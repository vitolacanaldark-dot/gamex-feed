// api/news.js
const GROQ_API_KEY = process.env.GROQ_API_KEY;

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

  // 2. REESCREVER A PRIMEIRA NOTÍCIA USANDO GROQ (Llama 3)
  try {
    const mainArticle = fetchedArticles[0];
    const otherArticles = fetchedArticles.slice(1);

    const prompt = `
      Você é um jornalista profissional do portal de games "GAMEx FEED".
      Sua tarefa é reescrever a notícia abaixo de forma 100% original, com as suas próprias palavras, mantendo todos os fatos reais.
      O texto deve ser em português do Brasil, empolgante, voltado para gamers, e ter entre 3 a 5 parágrafos.
      Não use o nome do veículo original. Comece o texto direto com a informação.
      Não inclua links no texto.

      Título original: ${mainArticle.title}
      Resumo original: ${mainArticle.description}
      Conteúdo original: ${mainArticle.content || ''}
    `;

    let rewrittenMainArticle = mainArticle;

    try {
      const groqUrl = `https://api.groq.com/openai/v1/chat/completions`;
      
      const response = await fetch(groqUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}` // Autenticação do Groq
        },
        body: JSON.stringify({
          model: "llama3-8b-8192", // Modelo gratuito e rápido
          messages: [
            { role: "system", content: "Você é um jornalista de games focado em notícias reais e textos autorais." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newText = data.choices?.[0]?.message?.content;
        
        if (newText) {
          rewrittenMainArticle = {
            ...mainArticle,
            content: newText,
            isRewritten: true,
          };
        }
      } else {
         const errText = await response.text();
         console.error("Erro na API do Groq:", errText);
      }
    } catch (error) {
      console.error("Erro no fetch do Groq:", error);
    }

    const finalArticles = [rewrittenMainArticle, ...otherArticles];
    res.status(200).json({ success: true, articles: finalArticles });

  } catch (error) {
    console.error("Erro geral:", error);
    res.status(200).json({ success: true, articles: fetchedArticles });
  }
}