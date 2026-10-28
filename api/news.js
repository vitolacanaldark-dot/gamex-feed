// api/news.js
const API_KEYS_GNEWS = [
  "81f4e37bbd147c199a3498c85ff7c572",
  "ce0b57eb8b3c6cf8d6549d098bee7e2c",
  "2b42036f62c14806b415a240b15b999f"
];

const getGroqKeys = () => {
  return Object.keys(process.env)
    .filter(key => key.startsWith('GROQ_API_KEY'))
    .map(key => process.env[key])
    .filter(Boolean);
};

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
  for (const key of API_KEYS_GNEWS) {
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
      console.error(`Erro com a chave GNews ...${key.slice(-4)}`);
    }
  }

  if (!fetchedArticles) {
    return res.status(500).json({ success: false, message: "Nenhuma API key do GNews funcionou." });
  }

  // 2. REESCREVER TODAS AS NOTÍCIAS COM ROTAÇÃO DE CHAVES DO GROQ
  try {
    const groqKeys = getGroqKeys();
    const rewrittenArticles = [];

    for (const article of fetchedArticles) {
      let rewritten = false;
      
      const prompt = `
        Você é um jornalista profissional do portal de games "GAMEx FEED".
        Sua tarefa é reescrever a notícia abaixo de forma 100% original, com as suas próprias palavras, mantendo todos os fatos reais.
        O texto deve ser em português do Brasil, empolgante, voltado para gamers, e ter entre 3 a 5 parágrafos.
        Não use o nome do veículo original. Comece o texto direto com a informação.
        Não inclua links no texto.

        Título original: ${article.title}
        Resumo original: ${article.description}
        Conteúdo original: ${article.content || ''}
      `;

      // Tenta reescrever esta notícia com cada chave do Groq
      for (const groqKey of groqKeys) {
        try {
          const groqUrl = `https://api.groq.com/openai/v1/chat/completions`;
          
          const response = await fetch(groqUrl, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${groqKey}`
            },
            body: JSON.stringify({
              model: "openai/gpt-oss-120b",
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
              console.log(`✅ Notícia "${article.title.substring(0, 20)}..." reescrita com chave ...${groqKey.slice(-4)}`);
              rewrittenArticles.push({ ...article, content: newText, isRewritten: true });
              rewritten = true;
              break; // Sucesso, para de tentar as outras chaves
            }
          } else {
             console.warn(`⚠️ Chave ...${groqKey.slice(-4)} falhou para "${article.title.substring(0, 20)}...". Tentando próxima...`);
          }
        } catch (error) {
          console.error("Erro no fetch do Groq:", error);
        }
      }

      // Se nenhuma chave funcionou, mantém a notícia original
      if (!rewritten) {
        console.warn(`⚠️ Não foi possível reescrever: "${article.title.substring(0, 30)}...". Mantendo original.`);
        rewrittenArticles.push(article);
      }
    }

    res.status(200).json({ success: true, articles: rewrittenArticles });

  } catch (error) {
    console.error("Erro geral no processamento:", error);
    // Em caso de erro catastrófico, retorna as notícias originais para o site não quebrar
    res.status(200).json({ success: true, articles: fetchedArticles });
  }
}