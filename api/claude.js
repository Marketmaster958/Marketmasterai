// /api/claude.js
// This is a SECRET backend function. Your API key stays here, never sent to browsers.
// Runs on Vercel automatically when deployed.

import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, useWebSearch } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY, // Set this in Vercel settings (Step 5)
    });

    const requestBody = {
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    };

    if (useWebSearch) {
      requestBody.tools = [{ type: "web_search_20250305", name: "web_search" }];
    }

    const response = await anthropic.messages.create(requestBody);

    // Extract text content
    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    return res.status(200).json({ text });
  } catch (error) {
    console.error("Claude API error:", error);
    return res.status(500).json({ error: "AI request failed. Please try again." });
  }
}
