import axios from "axios";
import cheerio from "cheerio";
import Anthropic from "@anthropic-ai/sdk";
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

function extractPriceBr(text) {
  if (!text) return "";
  const match = text.match(/R\$\s*[\d.,]+/i);
  if (!match) return "";
  let str = match[0].replace(/R\$\s*/i, "").trim();
  str = str.split(",")[0].replace(/\./g, "");
  const numeric = str.replace(/\D/g, "");
  return numeric.length >= 3 ? numeric : "";
}

function extractJsonLd($) {
  const results = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const json = JSON.parse($(el).html());
      results.push(json);
    } catch {
      // ignore invalid JSON-LD
    }
  });
  return results;
}

function extractMetaContent($) {
  const metas = {};
  $("meta").each((_, el) => {
    const name = $(el).attr("name") || $(el).attr("property") || $(el).attr("itemprop");
    const content = $(el).attr("content");
    if (name && content) metas[name] = content;
  });
  return metas;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    verify(req.cookies.auth, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: "Não autorizado" });
  }

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL obrigatória" });

  let html = "";
  let pageImage = "";
  let pageTitle = "";

  try {
    const response = await axios.get(url, {
      headers: SCRAPE_HEADERS,
      timeout: 15000,
      maxRedirects: 5,
      validateStatus: (s) => s < 500,
    });

    if (
      response.status === 403 ||
      response.status === 503 ||
      (typeof response.data === "string" &&
        (response.data.includes("cf-browser-verification") ||
          response.data.includes("Just a moment")))
    ) {
      return res.status(403).json({ error: "Site protegido. Preencha os dados manualmente." });
    }

    html = response.data;
    const $ = cheerio.load(html);

    // Extract page title
    pageTitle =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      $("title").text() ||
      $("h1").first().text() ||
      "";

    // Extract best image
    let img =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[property="og:image:url"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      $("main img, article img").first().attr("src") ||
      "";

    if (img && !img.startsWith("http")) {
      const urlObj = new URL(url);
      if (img.startsWith("//")) img = `${urlObj.protocol}${img}`;
      else if (img.startsWith("/")) img = `${urlObj.protocol}//${urlObj.host}${img}`;
      else img = `${urlObj.protocol}//${urlObj.host}/${img}`;
    }
    const validExts = [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".webp"];
    const lowerImg = (img || "").toLowerCase().split("?")[0];
    pageImage = validExts.some((e) => lowerImg.endsWith(e)) ? img : "";

    // Extract structured data sources for Claude
    const jsonLdData = extractJsonLd($);
    const metaContent = extractMetaContent($);

    // Remove scripts, styles, nav, footer to get cleaner text
    $("script, style, nav, footer, header, noscript, iframe").remove();
    const pageText = $("body").text().replace(/\s+/g, " ").trim().slice(0, 8000);

    // Build a rich context for Claude
    const jsonLdStr = jsonLdData.length
      ? `\n\nDados estruturados JSON-LD:\n${JSON.stringify(jsonLdData).slice(0, 3000)}`
      : "";

    const metaStr = Object.keys(metaContent).length
      ? `\n\nMeta tags relevantes:\n${JSON.stringify(metaContent).slice(0, 1000)}`
      : "";

    const prompt = `Você é um especialista em imóveis brasileiros. Analise as informações abaixo de uma página de anúncio imobiliário e extraia os dados do imóvel.

Título da página: ${pageTitle}

Texto da página:
"""
${pageText}
"""
${jsonLdStr}
${metaStr}

INSTRUÇÕES IMPORTANTES:
- propertyPrice: valor numérico inteiro SEM pontuação, SEM R$. Ex: se vir "R$ 650.000" retorne "650000". Se vir "R$ 1.200.000" retorne "1200000".
- Para áreas: retorne apenas o número inteiro (ex: se vir "85 m²" retorne "85").
- Para quartos/banheiros/vagas: retorne apenas o número inteiro.
- Se uma informação não estiver claramente disponível, retorne string vazia "".

Retorne APENAS um JSON válido, sem texto antes ou depois:
{
  "propertyName": "título/nome do anúncio",
  "propertyPrice": "valor numérico inteiro sem pontuação (ex: 650000)",
  "areaTotal": "área total em m² como número inteiro",
  "areaTotalPrivativa": "área privativa/útil em m² como número inteiro",
  "quartos": "número inteiro de quartos/dormitórios",
  "suites": "número inteiro de suítes",
  "banheiros": "número inteiro de banheiros",
  "sacadas": "número inteiro de sacadas/varandas",
  "andar": "número inteiro do andar",
  "vagasGaragem": "número inteiro de vagas de garagem",
  "pavimentos": "número inteiro de pavimentos/andares da casa",
  "salas": "número inteiro de salas",
  "bairro": "nome do bairro",
  "cidade": "nome da cidade",
  "uf": "sigla do estado com 2 letras maiúsculas",
  "logradouro": "nome da rua/avenida"
}`;

    const aiResponse = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const aiText = aiResponse.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON not found");

    const extracted = JSON.parse(jsonMatch[0]);

    // Fallback: regex price from page text if Claude missed it
    if (!extracted.propertyPrice) {
      extracted.propertyPrice = extractPriceBr(pageText) || extractPriceBr(html.slice(0, 20000));
    }

    return res.status(200).json({
      ...extracted,
      propertyName: extracted.propertyName || pageTitle.trim(),
      imageUrl: pageImage,
    });
  } catch (error) {
    console.error("extractPropertyInfo error:", error.message);

    return res.status(200).json({
      propertyName: pageTitle.trim(),
      imageUrl: pageImage,
      propertyPrice: extractPriceBr(html),
      areaTotal: "",
      areaTotalPrivativa: "",
      quartos: "",
      suites: "",
      banheiros: "",
      sacadas: "",
      andar: "",
      vagasGaragem: "",
      pavimentos: "",
      salas: "",
      bairro: "",
      cidade: "",
      uf: "",
      logradouro: "",
    });
  }
}
