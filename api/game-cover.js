// api/game-cover.js
const RAWG_API_KEY = process.env.RAWG_API_KEY;

export default async function handler(req, res) {
  // Permite o site buscar a imagem
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { title } = req.query;

  if (!title || !RAWG_API_KEY) {
    return res.status(400).json({ error: 'Parâmetros inválidos ou chave da RAWG não configurada.' });
  }

  try {
    // Limpa o título para buscar apenas o nome do jogo (ex: GTA VI em vez de "GTA VI: Novo vazamento...")
    const cleanTitle = title.split(':')[0].split('-')[0].trim();
    
    const response = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(cleanTitle)}&page_size=1`);
    
    if (!response.ok) {
      throw new Error(`RAWG respondeu com status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const game = data.results[0];
      // Retorna a imagem de capa oficial do jogo
      return res.status(200).json({ imageUrl: game.background_image, name: game.name });
    } else {
      return res.status(404).json({ message: 'Jogo não encontrado no RAWG' });
    }

  } catch (error) {
    console.error('Erro ao buscar capa:', error);
    return res.status(500).json({ error: 'Erro ao buscar capa no RAWG' });
  }
}