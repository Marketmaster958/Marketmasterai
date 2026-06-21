export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "API key not configured" });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
        }),
      }
    );

    const data = await response.json();

    console.log("Gemini status:", response.status);
    console.log("Gemini response:", JSON.stringify(data));

    if (!response.ok) {
      console.error("Gemini error:", data);
      return res.status(500).json({ 
        error: `Gemini error: ${data?.error?.message || "Unknown error"}` 
      });
    }

    if (!data.candidates || data.candidates.length === 0) {
      console.error("No candidates:", data);
      return res.status(500).json({ error: "No response from AI" });
    }

    const text = data.candidates[0]?.content?.parts?.[0]?.text || "";
    if (!text) return res.status(500).json({ error: "Empty response from AI" });

    return res.status(200).json({ text });

  } catch (error) {
    console.error("API error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
