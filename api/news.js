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
    const groqKeys = getGroqKeys();

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
            // 👇 MODELO ATUAL DA GROQ (GPT-OSS)
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
            console.log(`✅ Notícia reescrita com sucesso usando a chave Groq ...${groqKey.slice(-4)}`);
            rewrittenMainArticle = {
              ...mainArticle,
              content: newText,
              isRewritten: true,
            };
            break; 
          }
        } else {
           const errText = await response.text();
           console.warn(`⚠️ Chave Groq ...${groqKey.slice(-4)} falhou: ${errText}`);
        }
      } catch (error) {
        console.error("Erro no fetch do Groq:", error);
      }
    }

    const finalArticles = [rewrittenMainArticle, ...otherArticles];
    res.status(200).json({ success: true, articles: finalArticles });

  } catch (error) {
    console.error("Erro geral:", error);
    res.status(200).json({ success: true, articles: fetchedArticles });
  }
}