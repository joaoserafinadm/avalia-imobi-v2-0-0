import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Headers mais realistas e completos
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0',
      'DNT': '1',
      'Referer': new URL(url).origin,
    };

    // Tenta com axios primeiro
    let response;
    try {
      response = await axios.get(url, {
        headers,
        timeout: 15000,
        maxRedirects: 5,
        validateStatus: (status) => status < 500, // Aceita até erros 4xx
      });
    } catch (axiosError) {
      // Se falhar, tenta com fetch nativo (às vezes contorna bloqueios)
      console.log('Axios failed, trying fetch...');
      const fetchResponse = await fetch(url, {
        headers,
        redirect: 'follow',
      });
      
      if (!fetchResponse.ok && fetchResponse.status === 403) {
        throw new Error('Site bloqueou o acesso (403 Forbidden)');
      }
      
      response = {
        data: await fetchResponse.text(),
        status: fetchResponse.status
      };
    }

    // Se recebeu 403 mesmo assim
    if (response.status === 403) {
      return res.status(403).json({
        error: 'Access forbidden',
        message: 'O site bloqueou o acesso. Isso pode acontecer devido a proteções anti-bot. Considere usar um serviço de scraping terceirizado.',
        suggestions: [
          'Usar APIs oficiais do site quando disponível',
          'Usar serviços como ScrapingBee, ScraperAPI ou Bright Data',
          'Implementar um proxy rotativo',
          'Usar Puppeteer/Playwright para simular um navegador real'
        ]
      });
    }
    
    const html = response.data;
    const $ = cheerio.load(html);

    // Estratégia de fallback para título
    const title = 
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('meta[property="twitter:title"]').attr('content') ||
      $('title').text() ||
      $('h1').first().text() ||
      '';

    // Estratégia de fallback para descrição
    const description = 
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[property="twitter:description"]').attr('content') ||
      $('p').first().text().substring(0, 200) ||
      '';

    // Estratégia de fallback para imagem
    let image = 
      $('meta[property="og:image"]').attr('content') ||
      $('meta[property="og:image:url"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[property="twitter:image"]').attr('content') ||
      $('meta[name="twitter:image:src"]').attr('content') ||
      $('img').first().attr('src') ||
      '';

    // Extração de preço com múltiplas estratégias
    let price = '';
    
    // 1. Procura em meta tags específicas de preço
    price = 
      $('meta[property="og:price:amount"]').attr('content') ||
      $('meta[property="product:price:amount"]').attr('content') ||
      $('meta[name="price"]').attr('content') ||
      '';

    // 2. Se não encontrou, procura em classes e IDs comuns
    if (!price) {
      const priceSelectors = [
        '[class*="price"]',
        '[id*="price"]',
        '[class*="preco"]',
        '[id*="preco"]',
        '[class*="valor"]',
        '[id*="valor"]',
        '[class*="value"]',
        '[data-price]',
        '.price',
        '.valor',
        '.preco',
        '#price',
        '#valor',
        '#preco'
      ];

      for (const selector of priceSelectors) {
        const element = $(selector).first();
        if (element.length) {
          price = element.text();
          if (price && /[R$0-9]/.test(price)) {
            break;
          }
        }
      }
    }

    // 3. Busca por padrões de preço no texto (R$, BRL, reais)
    if (!price) {
      const bodyText = $('body').text();
      const pricePatterns = [
        /R\$\s*[\d.,]+/g,
        /BRL\s*[\d.,]+/g,
        /(?:preço|valor|price):\s*R\$?\s*[\d.,]+/gi,
        /[\d.,]+\s*(?:reais|milhões?|mil)/gi
      ];

      for (const pattern of pricePatterns) {
        const matches = bodyText.match(pattern);
        if (matches && matches.length > 0) {
          price = matches[0];
          break;
        }
      }
    }

    // Limpa o preço encontrado
    if (price) {
      price = price.trim().replace(/\s+/g, ' ');
    }

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
        console.error('Error parsing URL:', e.message);
      }
    }

    // Limpa strings
    const cleanText = (text) => text.trim().replace(/\s+/g, ' ');

    res.status(200).json({ 
      title: cleanText(title), 
      description: cleanText(description), 
      image: image.trim(),
      price: cleanText(price)
    });
  } catch (error) {
    console.error('Error fetching URL:', error.message);
    
    // Detecta tipo de erro
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return res.status(408).json({ 
        error: 'Request timeout',
        message: 'O site demorou muito para responder'
      });
    }

    if (error.message.includes('403')) {
      return res.status(403).json({
        error: 'Access forbidden',
        message: 'O site bloqueou o acesso. Use uma solução alternativa como Puppeteer ou serviços de scraping.',
        hint: 'Sites de imóveis como OLX, VivaReal, etc costumam ter proteções anti-bot fortes'
      });
    }

    res.status(400).json({ 
      error: 'Error fetching URL',
      message: error.message 
    });
  }
}

// import axios from 'axios';
// import cheerio from 'cheerio';

// export default async function handler(req, res) {
//   const { url } = req.query;

//   if (!url) {
//     return res.status(400).json({ error: 'URL is required' });
//   }

//   try {
//     const response = await axios.get(url, {
//       headers: {
//         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//         'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
//       },
//       timeout: 10000,
//       timeoutErrorMessage: 'Request timeout - site demorou muito para responder'
//     });
    
//     const html = response.data;
//     const $ = cheerio.load(html);

//     // Estratégia de fallback para título
//     const title = 
//       $('meta[property="og:title"]').attr('content') ||
//       $('meta[name="twitter:title"]').attr('content') ||
//       $('meta[property="twitter:title"]').attr('content') ||
//       $('title').text() ||
//       $('h1').first().text() ||
//       '';

//     // Estratégia de fallback para descrição
//     const description = 
//       $('meta[property="og:description"]').attr('content') ||
//       $('meta[name="description"]').attr('content') ||
//       $('meta[name="twitter:description"]').attr('content') ||
//       $('meta[property="twitter:description"]').attr('content') ||
//       $('p').first().text().substring(0, 200) ||
//       '';

//     // Estratégia de fallback para imagem
//     let image = 
//       $('meta[property="og:image"]').attr('content') ||
//       $('meta[property="og:image:url"]').attr('content') ||
//       $('meta[name="twitter:image"]').attr('content') ||
//       $('meta[property="twitter:image"]').attr('content') ||
//       $('meta[name="twitter:image:src"]').attr('content') ||
//       $('img').first().attr('src') ||
//       '';

//     // Extração de preço com múltiplas estratégias
//     let price = '';
    
//     // 1. Procura em meta tags específicas de preço
//     price = 
//       $('meta[property="og:price:amount"]').attr('content') ||
//       $('meta[property="product:price:amount"]').attr('content') ||
//       $('meta[name="price"]').attr('content') ||
//       '';

//     // 2. Se não encontrou, procura em classes e IDs comuns
//     if (!price) {
//       const priceSelectors = [
//         '[class*="price"]',
//         '[id*="price"]',
//         '[class*="preco"]',
//         '[id*="preco"]',
//         '[class*="valor"]',
//         '[id*="valor"]',
//         '[class*="value"]',
//         '[data-price]',
//         '.price',
//         '.valor',
//         '.preco',
//         '#price',
//         '#valor',
//         '#preco'
//       ];

//       for (const selector of priceSelectors) {
//         const element = $(selector).first();
//         if (element.length) {
//           price = element.text();
//           if (price && /[R$0-9]/.test(price)) {
//             break;
//           }
//         }
//       }
//     }

//     // 3. Busca por padrões de preço no texto (R$, BRL, reais)
//     if (!price) {
//       const bodyText = $('body').text();
//       const pricePatterns = [
//         /R\$\s*[\d.,]+/g,
//         /BRL\s*[\d.,]+/g,
//         /(?:preço|valor|price):\s*R\$?\s*[\d.,]+/gi,
//         /[\d.,]+\s*(?:reais|milhões?|mil)/gi
//       ];

//       for (const pattern of pricePatterns) {
//         const matches = bodyText.match(pattern);
//         if (matches && matches.length > 0) {
//           // Pega o primeiro match que pareça um preço válido
//           price = matches[0];
//           break;
//         }
//       }
//     }

//     // Limpa o preço encontrado
//     if (price) {
//       price = price.trim().replace(/\s+/g, ' ');
//     }

//     // Converte URLs relativas em absolutas
//     if (image && !image.startsWith('http')) {
//       try {
//         const urlObj = new URL(url);
//         if (image.startsWith('//')) {
//           image = `${urlObj.protocol}${image}`;
//         } else if (image.startsWith('/')) {
//           image = `${urlObj.protocol}//${urlObj.host}${image}`;
//         } else {
//           image = `${urlObj.protocol}//${urlObj.host}/${image}`;
//         }
//       } catch (e) {
//         console.error('Error parsing URL:', e.message);
//       }
//     }

//     // Limpa strings (remove espaços extras, quebras de linha, etc)
//     const cleanText = (text) => text.trim().replace(/\s+/g, ' ');

//     res.status(200).json({ 
//       title: cleanText(title), 
//       description: cleanText(description), 
//       image: image.trim(),
//       price: cleanText(price)
//     });
//   } catch (error) {
//     console.error('Error fetching URL:', error.message);
    
//     // Detecta se foi timeout
//     if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
//       return res.status(408).json({ 
//         error: 'Request timeout',
//         message: 'O site demorou muito para responder'
//       });
//     }

//     res.status(400).json({ 
//       error: 'Error fetching URL',
//       message: error.message 
//     });
//   }
// }