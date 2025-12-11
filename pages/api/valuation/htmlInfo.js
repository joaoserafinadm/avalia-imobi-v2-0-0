import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL é obrigatória' });
  }

  try {
    // Configuração simplificada com headers mais realistas
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none'
      },
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: (status) => status < 500
    });

    // Detecta proteção do Cloudflare
    if (response.status === 403 || 
        response.status === 503 
        // || 
        // response.data.includes('cf-browser-verification') ||
        // response.data.includes('Checking your browser') ||
        // response.data.includes('Just a moment')
      ) {
      
      return res.status(403).json({ 
        error: 'Cloudflare Protection Detected',
        message: 'Este site está protegido. Tente usar scraping no lado do cliente (navegador)',
        suggestion: 'Use um proxy ou serviço como ScraperAPI/Bright Data',
        needsClientScraping: true
      });
    }

    const html = response.data;
    const $ = cheerio.load(html);

    // EXTRAÇÃO DO TÍTULO (nome do imóvel)
    const title = 
      // Open Graph
      $('meta[property="og:title"]').attr('content') ||
      // Twitter Card
      $('meta[name="twitter:title"]').attr('content') ||
      // Tag title padrão
      $('title').text() ||
      // Primeiro H1
      $('h1').first().text() ||
      // Fallback: primeiro elemento com "title" no class/id
      $('[class*="title"], [id*="title"]').first().text() ||
      $('[class*="titulo"], [id*="titulo"]').first().text() ||
      '';

    // EXTRAÇÃO DA IMAGEM PRINCIPAL
    let image = 
      // Open Graph (mais confiável)
      $('meta[property="og:image"]').attr('content') ||
      $('meta[property="og:image:url"]').attr('content') ||
      // Twitter Card
      $('meta[name="twitter:image"]').attr('content') ||
      // Primeira imagem no conteúdo principal
      $('main img, article img, .property img, .imovel img').first().attr('src') ||
      // Fallback: primeira imagem da página
      $('img[src]').first().attr('src') ||
      '';

    // Converte URLs relativas em absolutas
    if (image && !image.startsWith('http')) {
      try {
        const urlObj = new URL(url);
        if (image.startsWith('//')) {
          image = `${urlObj.protocol}${image}`;
        } else if (image.startsWith('/')) {
          image = `${urlObj.protocol}//${urlObj.host}${image}`;
        } else {
          image = `${urlObj.protocol}//${urlObj.host}/${image}`;
        }
      } catch (e) {
        console.error('Erro ao converter URL da imagem:', e.message);
      }
    }

    // Limpa o texto (remove espaços extras, quebras de linha)
    const cleanText = (text) => text.trim().replace(/\s+/g, ' ');

    // Resposta simplificada
    const result = {
      success: true,
      title: cleanText(title) || 'Título não encontrado',
      image: image.trim() || null,
      url: url
    };

    return res.status(200).json(result);

  } catch (error) {
    console.error('Erro ao buscar URL:', error.message);
    
    // Timeout
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return res.status(408).json({ 
        error: 'Timeout',
        message: 'O site demorou muito para responder. Tente novamente.'
      });
    }

    // Erro de conexão (possível Cloudflare)
    if (error.code === 'ECONNREFUSED' || 
        error.response?.status === 403 || 
        error.response?.status === 503) {
      return res.status(403).json({ 
        error: 'Connection Blocked',
        message: 'Site protegido ou bloqueando requisições automáticas',
        needsClientScraping: true
      });
    }

    // Erro genérico
    return res.status(500).json({ 
      error: 'Server Error',
      message: error.message,
      suggestion: 'Verifique se a URL está correta e acessível'
    });
  }
}