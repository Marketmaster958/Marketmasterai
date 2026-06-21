export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { query } = req.body;
  if (!query || query.trim().length < 3) {
    return res.status(400).json({ results: [] });
  }
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const prompt = `You are a stock market data assistant for Indian markets. The user is searching for: "${query}". Find matching instruments from NSE/BSE stocks, F&O contracts, MCX Commodities (Gold, Silver, Crude Oil), Currency pairs, and Indices. Return ONLY a raw JSON array (no markdown) of up to 10 matches: [{ "name": "Full name", "symbol": "NSE symbol", "type": "Stock|F&O|Commodity|Index|Currency" }]. Return [] if no matches.`;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 500 },
        }),
      }
    );
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const clean = text.replace(/```json|```/g, "").trim();
    const results = JSON.parse(clean);
    return res.status(200).json({ results });
  } catch (error) {
    return res.status(500).json({ results: [] });
  }
}
