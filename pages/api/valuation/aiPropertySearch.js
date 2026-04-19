import Anthropic from "@anthropic-ai/sdk";
import axios from "axios";
import cheerio from "cheerio";
import { verify } from "jsonwebtoken";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SCRAPE_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "pt-BR,pt;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  Connection: "keep-alive",
  "Upgrade-Insecure-Requests": "1",
};

function extractPriceFromText(text) {
  if (!text) return null;
  const match = text.match(/R\$\s*[\d.,]+/i);
  if (!match) return null;

  let priceStr = match[0].replace(/R\$\s*/i, "").trim();

  // Formato brasileiro: ponto = separador de milhar, vírgula = decimal
  // "410.000,00" → remove parte decimal → "410.000" → remove pontos → "410000"
  priceStr = priceStr.split(",")[0].replace(/\./g, "");

  const numeric = priceStr.replace(/\D/g, "");
  return numeric.length >= 3 ? numeric : null;
}

async function fetchPropertyData(url) {
  try {
    const response = await axios.get(url, {
      headers: SCRAPE_HEADERS,
      timeout: 8000,
      maxRedirects: 5,
      validateStatus: (status) => status < 500,
    });

    if (
      response.status === 403 ||
      response.status === 503 ||
      (typeof response.data === "string" &&
        (response.data.includes("cf-browser-verification") ||
          response.data.includes("Just a moment")))
    ) {
      return { image: null, price: null };
    }

    const $ = cheerio.load(response.data);

    // --- Imagem ---
    let image =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[property="og:image:url"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      $("main img, article img, .property img, .imovel img").first().attr("src") ||
      $("img[src]").first().attr("src") ||
      "";

    if (image && !image.startsWith("http")) {
      const urlObj = new URL(url);
      if (image.startsWith("//")) image = `${urlObj.protocol}${image}`;
      else if (image.startsWith("/")) image = `${urlObj.protocol}//${urlObj.host}${image}`;
      else image = `${urlObj.protocol}//${urlObj.host}/${image}`;
    }

    const validExtensions = [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".webp"];
    const lowerImage = (image || "").toLowerCase().split("?")[0];
    if (image && !validExtensions.some((ext) => lowerImage.endsWith(ext))) {
      image = "";
    }

    // --- Preço ---
    let price = null;

    const ogPrice =
      $('meta[property="og:price:amount"]').attr("content") ||
      $('meta[property="product:price:amount"]').attr("content");
    if (ogPrice) {
      const numeric = ogPrice.replace(/[^\d]/g, "");
      if (numeric.length >= 3) price = numeric;
    }

    if (!price) {
      const priceSelectors = [
        '[class*="price"]',
        '[class*="preco"]',
        '[class*="valor"]',
        '[class*="Price"]',
        '[class*="Preco"]',
        '[class*="Valor"]',
        '[itemprop="price"]',
        '[data-testid*="price"]',
        '[data-testid*="preco"]',
        '[data-testid*="valor"]',
      ];
      for (const sel of priceSelectors) {
        const text = $(sel).first().text();
        price = extractPriceFromText(text);
        if (price) break;
      }
    }

    if (!price) {
      const bodyText = $("body").text().slice(0, 5000);
      price = extractPriceFromText(bodyText);
    }

    return { image: image || null, price };
  } catch {
    return { image: null, price: null };
  }
}

async function searchGoogle(query) {
  const response = await axios.post(
    "https://google.serper.dev/search",
    { q: query, gl: "br", hl: "pt-br", num: 10 },
    {
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY,
        "Content-Type": "application/json",
      },
      timeout: 12000,
    }
  );
  return response.data.organic || [];
}

function buildSearchQueries(client) {
  const type = client.propertyType || "imóvel";
  const locationParts = [client.bairro, client.cidade, client.uf].filter(Boolean);
  const location = locationParts.join(" ");
  const portals =
    "site:zapimoveis.com.br OR site:vivareal.com.br OR site:olx.com.br OR site:imovelweb.com.br OR site:quintoandar.com.br";

  const queries = [];

  const roomsStr = client.quartos ? `${client.quartos} quartos` : "";
  queries.push(`${type} ${roomsStr} venda ${location} ${portals}`.replace(/\s+/g, " ").trim());

  const areaStr = client.areaTotal ? `${client.areaTotal}m²` : "";
  queries.push(`${type} ${areaStr} venda ${location} imobiliária`.replace(/\s+/g, " ").trim());

  queries.push(`${type} à venda ${location}`.trim());

  return queries.filter((q) => q.length > 5);
}

function buildPropertyDescription(client) {
  const parts = [];
  if (client.propertyType) parts.push(`Tipo: ${client.propertyType}`);
  if (client.cidade) parts.push(`Cidade: ${client.cidade}${client.uf ? "-" + client.uf : ""}`);
  if (client.bairro) parts.push(`Bairro: ${client.bairro}`);
  if (client.areaTotal) parts.push(`Área total: ${client.areaTotal}m²`);
  if (client.areaTotalPrivativa) parts.push(`Área privativa: ${client.areaTotalPrivativa}m²`);
  if (client.quartos) parts.push(`Quartos: ${client.quartos}`);
  if (client.suites) parts.push(`Suítes: ${client.suites}`);
  if (client.banheiros) parts.push(`Banheiros: ${client.banheiros}`);
  if (client.vagasGaragem) parts.push(`Vagas: ${client.vagasGaragem}`);
  if (client.andar) parts.push(`Andar: ${client.andar}`);
  if (client.pavimentos) parts.push(`Pavimentos: ${client.pavimentos}`);
  return parts.join(", ");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    verify(req.cookies.auth, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: "Não autorizado" });
  }

  const { client } = req.body;
  if (!client) return res.status(400).json({ error: "Dados do imóvel não fornecidos" });

  if (!process.env.SERPER_API_KEY) {
    return res.status(500).json({
      error:
        "SERPER_API_KEY não configurado. Obtenha uma chave gratuita em serper.dev e adicione ao .env.local.",
    });
  }

  const queries = buildSearchQueries(client);
  const allResults = [];

  for (const query of queries) {
    try {
      const results = await searchGoogle(query);
      allResults.push(
        ...results.map((r) => ({
          title: r.title,
          link: r.link,
          snippet: r.snippet || "",
        }))
      );
    } catch (e) {
      console.error("Serper search error:", e.message);
    }
  }

  const seen = new Set();
  const uniqueResults = allResults.filter((r) => {
    if (seen.has(r.link)) return false;
    seen.add(r.link);
    return true;
  });

  if (!uniqueResults.length) {
    return res.status(404).json({
      error: "Nenhum resultado encontrado no Google. Tente adicionar imóveis manualmente.",
    });
  }

  const propertyDesc = buildPropertyDescription(client);
  const resultsText = uniqueResults
    .map((r, i) => `[${i + 1}] Título: ${r.title}\nLink: ${r.link}\nDescrição: ${r.snippet}`)
    .join("\n\n");

  const analysisPrompt = `Você é um especialista em mercado imobiliário brasileiro.

Imóvel sendo avaliado:
${propertyDesc}

Resultados do Google sobre imóveis semelhantes:
${resultsText}

Analise os resultados acima e selecione os 6 melhores anúncios de imóveis para VENDA que sejam mais semelhantes ao imóvel avaliado. Extraia as informações disponíveis de cada anúncio.

Inclua apenas anúncios de venda (não aluguel). Descarte resultados que não sejam anúncios de imóveis (artigos, blogs, notícias, etc).

Retorne APENAS um JSON válido, sem texto antes ou depois:
{
  "properties": [
    {
      "propertyName": "nome ou descrição extraída do título do anúncio",
      "propertyLink": "URL completa do anúncio",
      "propertyPrice": "valor numérico sem pontuação e sem R$ (ex: 350000), ou string vazia se não encontrado",
      "imageUrl": "",
      "areaTotal": "área em m² como número, ou string vazia",
      "areaTotalPrivativa": "",
      "quartos": "número inteiro ou string vazia",
      "banheiros": "número inteiro ou string vazia",
      "vagasGaragem": "número inteiro ou string vazia",
      "bairro": "bairro extraído do título/snippet ou string vazia",
      "cidade": "cidade do imóvel",
      "uf": "sigla do estado com 2 letras maiúsculas"
    }
  ]
}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [{ role: "user", content: analysisPrompt }],
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: "Formato de resposta inválido da IA" });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const properties = parsed.properties || [];

    const pageDataResults = await Promise.allSettled(
      properties.map((p) => (p.propertyLink ? fetchPropertyData(p.propertyLink) : { image: null, price: null }))
    );

    const propertiesWithData = properties.map((p, i) => {
      const pageData =
        pageDataResults[i].status === "fulfilled" ? pageDataResults[i].value : { image: null, price: null };

      return {
        ...p,
        imageUrl: pageData.image || "",
        propertyPrice: p.propertyPrice || pageData.price || "",
      };
    });

    return res.status(200).json({ properties: propertiesWithData });
  } catch (error) {
    console.error("Claude analysis error:", error);
    return res.status(500).json({ error: "Erro ao analisar resultados com IA" });
  }
}
