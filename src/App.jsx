import { useState, useEffect } from "react";

const sectorOptions = ["Nifty 50", "Bank Nifty", "IT Sector", "Pharma", "Auto", "FMCG", "Metal", "Energy"];
const signalOptions = ["Strong Buy", "Buy", "Neutral", "Sell", "Strong Sell"];
const timeframeOptions = ["Intraday", "Short Term (1–2 weeks)", "Medium Term (1–3 months)", "Long Term (6+ months)"];

function Badge({ label, color }) {
  const colors = {
    green: { background: "#14532d", color: "#86efac", border: "1px solid #166534" },
    red: { background: "#450a0a", color: "#fca5a5", border: "1px solid #7f1d1d" },
    yellow: { background: "#451a03", color: "#fcd34d", border: "1px solid #92400e" },
    blue: { background: "#1e3a5f", color: "#93c5fd", border: "1px solid #1d4ed8" },
    gray: { background: "#1e2535", color: "#94a3b8", border: "1px solid #334155" },
    orange: { background: "#431407", color: "#fb923c", border: "1px solid #9a3412" },
  };
  const s = colors[color] || colors.gray;
  return (
    <span style={{ ...s, fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700, letterSpacing: "0.04em", display: "inline-block" }}>
      {label}
    </span>
  );
}

function SignalBadge({ signal }) {
  const map = { "Strong Buy": "green", "Buy": "green", "Neutral": "yellow", "Sell": "red", "Strong Sell": "red" };
  return <Badge label={signal} color={map[signal] || "gray"} />;
}

// AI Review Panel
function ReviewPanel({ review }) {
  if (!review) return null;
  const scoreColor = review.overallScore >= 75 ? "#22c55e" : review.overallScore >= 50 ? "#f59e0b" : "#ef4444";
  const scoreBg = review.overallScore >= 75 ? "#14532d" : review.overallScore >= 50 ? "#451a03" : "#450a0a";

  return (
    <div style={{ background: "#1a1f2e", border: `1px solid ${scoreColor}44`, borderRadius: 16, padding: 24, marginBottom: 24, animation: "fadeIn 0.4s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>🤖 AI Analysis Review</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>{review.verdict}</div>
        </div>
        <div style={{ textAlign: "center", background: scoreBg, borderRadius: 12, padding: "10px 18px", border: `1px solid ${scoreColor}66` }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{review.overallScore}</div>
          <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>/ 100</div>
        </div>
      </div>

      {/* Score Bars */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {review.scores && Object.entries(review.scores).map(([key, val]) => {
          const c = val >= 75 ? "#22c55e" : val >= 50 ? "#f59e0b" : "#ef4444";
          return (
            <div key={key} style={{ background: "#0f1117", borderRadius: 10, padding: "10px 14px", border: "1px solid #1e2535" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#94a3b8", textTransform: "capitalize" }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: c }}>{val}/100</span>
              </div>
              <div style={{ height: 4, background: "#1e2535", borderRadius: 4 }}>
                <div style={{ height: 4, width: `${val}%`, background: c, borderRadius: 4, transition: "width 0.8s ease" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Warnings */}
      {review.warnings && review.warnings.length > 0 && (
        <div style={{ background: "#2d1b00", border: "1px solid #92400e", borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#fb923c", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>⚠️ Warnings & Corrections</div>
          {review.warnings.map((w, i) => (
            <div key={i} style={{ fontSize: 13, color: "#fed7aa", marginBottom: 8, display: "flex", gap: 8, lineHeight: 1.5 }}>
              <span style={{ color: "#fb923c", flexShrink: 0, marginTop: 1 }}>▶</span>{w}
            </div>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {review.suggestions && review.suggestions.length > 0 && (
        <div style={{ background: "#0d2818", border: "1px solid #166534", borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#22c55e", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>💡 AI Suggestions to Improve</div>
          {review.suggestions.map((s, i) => (
            <div key={i} style={{ fontSize: 13, color: "#bbf7d0", marginBottom: 8, display: "flex", gap: 8, lineHeight: 1.5 }}>
              <span style={{ color: "#22c55e", flexShrink: 0, marginTop: 1 }}>✓</span>{s}
            </div>
          ))}
        </div>
      )}

      {/* Indicator Check */}
      {review.indicatorCheck && (
        <div style={{ background: "#0f1117", borderRadius: 12, padding: 16, border: "1px solid #1e2535", marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#60a5fa", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>📊 Technical Indicator Check</div>
          <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>{review.indicatorCheck}</p>
        </div>
      )}

      {/* Confidence */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#64748b" }}>AI Confidence in your setup:</span>
        <Badge label={review.confidence} color={review.confidence === "High" ? "green" : review.confidence === "Medium" ? "yellow" : "red"} />
      </div>
    </div>
  );
}

export default function StockTipsApp() {
  const [page, setPage] = useState("analyze"); // "analyze" | "tracker"
  const [form, setForm] = useState({
    stockName: "", sector: "Nifty 50", signal: "Buy",
    entryPrice: "", targetPrice: "", stopLoss: "",
    timeframe: "Short Term (1–2 weeks)", technicalNotes: "", riskLevel: "Medium",
  });
  const [review, setReview] = useState(null);
  const [tip, setTip] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [tipLoading, setTipLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Track Record state
  const [tips, setTips] = useState([]);
  const [tipsLoaded, setTipsLoaded] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  // Payment / subscription settings
  const [paySettings, setPaySettings] = useState({ upiId: "", planName: "Monthly Tips Plan", price: "999", whatsapp: "" });
  const [paySaved, setPaySaved] = useState(false);

  // Price-check state: { [tipId]: { loading, result, error } }
  const [priceChecks, setPriceChecks] = useState({});

  // Load saved settings on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("pay-settings");
      if (raw) setPaySettings(JSON.parse(raw));
    } catch (e) {}
  }, []);

  const savePaySettings = async (next) => {
    setPaySettings(next);
    try {
      localStorage.setItem("pay-settings", JSON.stringify(next));
      setPaySaved(true);
      setTimeout(() => setPaySaved(false), 2000);
    } catch (e) {}
  };

  const checkLivePrice = async (t) => {
    setPriceChecks((p) => ({ ...p, [t.id]: { loading: true } }));
    const prompt = `Search the web for the current/latest stock price of "${t.stockName}" (Indian stock market, NSE/BSE). Then compare it to:
- Entry: ₹${t.entryPrice}
- Target: ₹${t.targetPrice}
- Stop Loss: ₹${t.stopLoss}
- Signal: ${t.signal}

Respond ONLY with raw JSON (no markdown):
{
  "currentPrice": <number>,
  "asOf": "<short note on data freshness/source>",
  "status": "<one of: Target Hit | SL Hit | Open | Near Target | Near SL>",
  "note": "<1 sentence explanation>"
}`;
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, useWebSearch: true }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const clean = data.text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setPriceChecks((p) => ({ ...p, [t.id]: { loading: false, result: parsed } }));
    } catch (e) {
      setPriceChecks((p) => ({ ...p, [t.id]: { loading: false, error: "Couldn't fetch live price. Try again or check manually." } }));
    }
  };

  // Load saved tips on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("tips-history");
      if (raw) setTips(JSON.parse(raw));
    } catch (e) {
      // no data yet
    }
    setTipsLoaded(true);
  }, []);

  const saveTipsList = async (newList) => {
    setTips(newList);
    try {
      localStorage.setItem("tips-history", JSON.stringify(newList));
    } catch (e) {
      console.error("Save failed", e);
    }
  };
const saveCurrentTip = async () => {
    if (!tip) return;
    const entry = {
      id: Date.now().toString(),
      stockName: tip.form.stockName,
      sector: tip.form.sector,
      signal: tip.form.signal,
      entryPrice: parseFloat(tip.form.entryPrice),
      targetPrice: parseFloat(tip.form.targetPrice),
      stopLoss: parseFloat(tip.form.stopLoss),
      timeframe: tip.form.timeframe,
      headline: tip.headline,
      date: new Date().toISOString(),
      status: "Open", // Open | Target Hit | SL Hit | Closed
    };
    const newList = [entry, ...tips];
    await saveTipsList(newList);
    setSavedMsg("✓ Saved to Track Record!");
    setTimeout(() => setSavedMsg(""), 2500);
  };

  const updateTipStatus = async (id, status) => {
    const newList = tips.map((t) => (t.id === id ? { ...t, status } : t));
    await saveTipsList(newList);
  };

  const deleteTip = async (id) => {
    const newList = tips.filter((t) => t.id !== id);
    await saveTipsList(newList);
  };

  // Stats
  const closedTips = tips.filter((t) => t.status === "Target Hit" || t.status === "SL Hit");
  const wins = tips.filter((t) => t.status === "Target Hit").length;
  const losses = tips.filter((t) => t.status === "SL Hit").length;
  const openCount = tips.filter((t) => t.status === "Open").length;
  const winRate = closedTips.length > 0 ? ((wins / closedTips.length) * 100).toFixed(1) : null;
  const totalTips = tips.length;

  const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const upside = form.entryPrice && form.targetPrice
    ? (((parseFloat(form.targetPrice) - parseFloat(form.entryPrice)) / parseFloat(form.entryPrice)) * 100).toFixed(1) : null;
  const downside = form.entryPrice && form.stopLoss
    ? (((parseFloat(form.entryPrice) - parseFloat(form.stopLoss)) / parseFloat(form.entryPrice)) * 100).toFixed(1) : null;
  const rr = upside && downside ? (parseFloat(upside) / parseFloat(downside)).toFixed(2) : null;

  const runReview = async () => {
    if (!form.stockName || !form.entryPrice || !form.targetPrice || !form.stopLoss) {
      setError("Please fill in Stock Name, Entry, Target and Stop Loss first.");
      return;
    }
    setError("");
    setReviewLoading(true);
    setReview(null);

    const prompt = `You are a senior Indian stock market technical analyst and mentor. An analyst has submitted a trade setup. Review it critically — check for errors, inconsistencies, and improvement opportunities. Be honest and helpful.

Trade Setup:
- Stock: ${form.stockName}
- Sector: ${form.sector}
- Signal: ${form.signal}
- Entry: ₹${form.entryPrice}
- Target: ₹${form.targetPrice} (${upside}% upside)
- Stop Loss: ₹${form.stopLoss} (${downside}% risk)
- Risk/Reward: ${rr}x
- Timeframe: ${form.timeframe}
- Risk Level: ${form.riskLevel}
- Technical Notes: ${form.technicalNotes || "None provided"}

Analyze this setup and respond ONLY with raw JSON (no markdown, no backticks):
{
  "overallScore": <number 0-100>,
  "verdict": "<one sentence overall verdict>",
  "confidence": "<High|Medium|Low>",
  "scores": {
    "riskReward": <0-100>,
    "technicalSetup": <0-100>,
    "priceAction": <0-100>,
    "consistency": <0-100>
  },
  "warnings": ["<specific warning or error in the analysis if any>", ...],
  "suggestions": ["<actionable improvement suggestion>", ...],
  "indicatorCheck": "<2-3 sentence review of the technical indicators mentioned, and what's missing or conflicting>"
}

Be specific. If R:R is below 1.5, warn them. If stop loss is too tight or too wide, say so. If indicators conflict with the signal, flag it. If notes are missing, suggest what to add.`;

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const clean = data.text.replace(/```json|```/g, "").trim();
      setReview(JSON.parse(clean));
    } catch (e) {
      setError("Review failed. Please try again.");
    }
    setReviewLoading(false);
  };

  const generateTip = async () => {
    if (!form.stockName || !form.entryPrice || !form.targetPrice || !form.stopLoss) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setTipLoading(true);
    setTip(null);

    const prompt = `You are an expert Indian stock market analyst assistant. Transform this analyst's input into a professional client-ready stock tip.

Input:
- Stock: ${form.stockName} | Sector: ${form.sector} | Signal: ${form.signal}
- Entry: ₹${form.entryPrice} | Target: ₹${form.targetPrice} (+${upside}%) | SL: ₹${form.stopLoss}
- Timeframe: ${form.timeframe} | Risk: ${form.riskLevel}
- Notes: ${form.technicalNotes || "Standard technical setup."}

Respond ONLY with raw JSON (no markdown):
{
  "headline": "short punchy headline",
  "summary": "2-sentence professional summary",
  "keyReasons": ["reason 1", "reason 2", "reason 3"],
  "riskFactors": ["risk 1", "risk 2"],
  "actionPlan": "clear 2-3 sentence action plan",
  "disclaimer": "short standard disclaimer"
}`;

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const clean = data.text.replace(/```json|```/g, "").trim();
      setTip({ ...JSON.parse(clean), form: { ...form }, upside, downside });
    } catch (e) {
      setError("Failed to generate tip. Please try again.");
    }
    setTipLoading(false);
  };

  const copyTip = () => {
    if (!tip) return;
    const text = `📈 ${tip.headline}\n\n${tip.summary}\n\nEntry: ₹${tip.form.entryPrice} | Target: ₹${tip.form.targetPrice} (+${tip.upside}%) | SL: ₹${tip.form.stopLoss}\nSignal: ${tip.form.signal} | Timeframe: ${tip.form.timeframe}\n\n✅ Key Reasons:\n${tip.keyReasons.map((r) => `• ${r}`).join("\n")}\n\n⚠️ Risks:\n${tip.riskFactors.map((r) => `• ${r}`).join("\n")}\n\n📋 Action Plan:\n${tip.actionPlan}\n\n${tip.disclaimer}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "#0f1117", minHeight: "100vh", color: "#e2e8f0" }}>
      {/* Header */}
      <div style={{ background: "#1a1f2e", borderBottom: "1px solid #1e2535", padding: "16px 24px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📊</div>
          <div style={{ flex: "1 1 auto" }}>
            <div style={{ fontWeight: 800, fontSize: 17, color: "#f1f5f9", letterSpacing: "-0.4px" }}>MarketMaster AI</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>AI-powered analysis review + client tip generator</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setPage("analyze")} style={{
              padding: "8px 16px", borderRadius: 8, border: "1px solid #1e2535", cursor: "pointer",
              fontWeight: 700, fontSize: 13,
              background: page === "analyze" ? "#22c55e" : "transparent",
              color: page === "analyze" ? "#0f1117" : "#94a3b8",
            }}>📝 Analyze</button>
            <button onClick={() => setPage("tracker")} style={{
              padding: "8px 16px", borderRadius: 8, border: "1px solid #1e2535", cursor: "pointer",
              fontWeight: 700, fontSize: 13,
              background: page === "tracker" ? "#22c55e" : "transparent",
              color: page === "tracker" ? "#0f1117" : "#94a3b8",
            }}>📊 Track Record{totalTips > 0 ? ` (${totalTips})` : ""}</button>
            <button onClick={() => setPage("subscribe")} style={{
              padding: "8px 16px", borderRadius: 8, border: "1px solid #1e2535", cursor: "pointer",
              fontWeight: 700, fontSize: 13,
              background: page === "subscribe" ? "#22c55e" : "transparent",
              color: page === "subscribe" ? "#0f1117" : "#94a3b8",
            }}>💳 Subscribe</button>
          </div>
        </div>
      </div>

      {page === "analyze" && (
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "20px 16px" }}>

        {/* Input Card */}
        <div style={{ background: "#1a1f2e", border: "1px solid #1e2535", borderRadius: 16, padding: 24, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", marginBottom: 18, textTransform: "uppercase", letterSpacing: "0.06em" }}>📝 Your Trade Setup</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={lbl}>Stock / Index Name</label>
              <input style={inp} placeholder="e.g. Reliance Industries, HDFC Bank, Nifty 50" value={form.stockName} onChange={(e) => handleChange("stockName", e.target.value)} />
