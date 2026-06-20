import { useState, useEffect } from "react";

const sectorOptions = ["Nifty 50", "Bank Nifty", "IT Sector", "Pharma", "Auto", "FMCG", "Metal", "Energy"];
const signalOptions = ["Strong Buy", "Buy", "Neutral", "Sell", "Strong Sell"];
const timeframeOptions = ["Intraday", "Short Term (1–2 weeks)", "Medium Term (1–3 months)", "Long Term (6+ months)"];

const stockList = [
  "Reliance Industries", "Reliance Power", "Reliance Infrastructure",
  "Tata Consultancy Services (TCS)", "Tata Motors", "Tata Steel", "Tata Power", "Tata Chemicals", "Titan Company",
  "HDFC Bank", "HDFC Life", "HDFC Asset Management",
  "ICICI Bank", "ICICI Prudential Life", "ICICI Lombard",
  "State Bank of India (SBI)", "SBI Life Insurance", "SBI Cards",
  "Infosys", "Wipro", "HCL Technologies", "Tech Mahindra", "LTIMindtree",
  "Axis Bank", "Kotak Mahindra Bank", "IndusInd Bank", "Bank of Baroda", "Punjab National Bank",
  "Bharti Airtel", "Vodafone Idea",
  "Larsen & Toubro (L&T)", "Adani Enterprises", "Adani Ports", "Adani Green Energy", "Adani Power", "Adani Total Gas",
  "Asian Paints", "Hindustan Unilever", "ITC", "Nestle India", "Britannia Industries",
  "Maruti Suzuki", "Mahindra & Mahindra (M&M)", "Bajaj Auto", "Eicher Motors", "Hero MotoCorp", "Ashok Leyland",
  "Sun Pharma", "Dr Reddy's Laboratories", "Cipla", "Divi's Laboratories", "Apollo Hospitals",
  "UltraTech Cement", "Shree Cement", "Ambuja Cements",
  "NTPC", "Power Grid Corporation", "Coal India", "ONGC", "Indian Oil Corporation (IOC)", "BPCL",
  "Hindalco Industries", "Vedanta", "JSW Steel", "SAIL",
  "Bajaj Finance", "Bajaj Finserv", "Bajaj Housing Finance",
  "Zomato", "Paytm (One97 Communications)", "Nykaa", "PB Fintech (Policybazaar)",
  "DLF", "Godrej Properties", "Oberoi Realty",
  "Pidilite Industries", "Berger Paints", "Havells India", "Voltas",
  "Grasim Industries", "Siemens India", "ABB India", "Cummins India",
  "Trent", "Avenue Supermarts (DMart)", "Page Industries",
  "Nifty 50", "Nifty Bank", "Nifty IT", "Nifty Pharma", "Nifty Auto", "Nifty FMCG", "Sensex"
];

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

  // Stock name autocomplete
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiSearching, setAiSearching] = useState(false);
  const [lastAiQuery, setLastAiQuery] = useState("");

  // Local hardcoded matches (instant)
  const localSuggestions = form.stockName.trim().length > 0
    ? stockList.filter((s) => s.toLowerCase().includes(form.stockName.trim().toLowerCase())).slice(0, 5)
    : [];

  // Combined suggestions: local first, then AI results
  const allSuggestions = [
    ...localSuggestions,
    ...aiSuggestions.filter((a) => !localSuggestions.find((l) => l.toLowerCase() === a.name.toLowerCase())),
  ].slice(0, 10);

  // AI search trigger (runs when user types 3+ chars, debounced)
  useEffect(() => {
    const q = form.stockName.trim();
    if (q.length < 3 || q === lastAiQuery) return;
    const timer = setTimeout(async () => {
      setAiSearching(true);
      setLastAiQuery(q);
      try {
        const res = await fetch("/api/search-stocks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q }),
        });
        const data = await res.json();
        setAiSuggestions(data.results || []);
      } catch (e) {
        setAiSuggestions([]);
      }
      setAiSearching(false);
    }, 600); // wait 600ms after user stops typing
    return () => clearTimeout(timer);
  }, [form.stockName]);

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
            <div style={{ gridColumn: "1 / -1", position: "relative" }}>
              <label style={lbl}>Stock / Index Name</label>
              <input
                style={{ ...inp, paddingRight: aiSearching ? 36 : 12 }}
                placeholder="Type to search NSE/BSE stocks, F&O, Commodities..."
                value={form.stockName}
                onChange={(e) => { handleChange("stockName", e.target.value); setShowSuggestions(true); setAiSuggestions([]); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                autoComplete="off"
              />
              {aiSearching && (
                <div style={{ position: "absolute", right: 12, top: "65%", transform: "translateY(-50%)", fontSize: 12, color: "#64748b" }}>🔍</div>
              )}
              {showSuggestions && (allSuggestions.length > 0 || aiSearching) && (
                <div style={{
                  position: "absolute", top: "100%", left: 0, right: 0, zIndex: 20,
                  background: "#0f1117", border: "1px solid #22c55e44", borderRadius: 10,
                  marginTop: 4, maxHeight: 300, overflowY: "auto", boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                }}>
                  {aiSearching && allSuggestions.length === 0 && (
                    <div style={{ padding: "10px 14px", fontSize: 13, color: "#64748b" }}>🔍 Searching NSE/BSE/MCX...</div>
                  )}
                  {allSuggestions.map((item, i) => {
                    const isAi = typeof item === "object";
                    const name = isAi ? item.name : item;
                    const symbol = isAi ? item.symbol : null;
                    const type = isAi ? item.type : "Stock";
                    const typeColor = type === "Commodity" ? "#fb923c" : type === "F&O" ? "#a78bfa" : type === "Index" ? "#60a5fa" : type === "Currency" ? "#34d399" : "#22c55e";
                    return (
                      <div
                        key={i}
                        onMouseDown={() => { handleChange("stockName", name); setShowSuggestions(false); }}
                        style={{
                          padding: "10px 14px", fontSize: 14, color: "#e2e8f0", cursor: "pointer",
                          borderBottom: "1px solid #1e2535", display: "flex", justifyContent: "space-between", alignItems: "center",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#1a1f2e"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <span>📈 {name}{symbol ? ` (${symbol})` : ""}</span>
                        <span style={{ fontSize: 10, color: typeColor, fontWeight: 700, background: `${typeColor}22`, padding: "2px 6px", borderRadius: 6 }}>{type}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div>
              <label style={lbl}>Sector</label>
              <select style={inp} value={form.sector} onChange={(e) => handleChange("sector", e.target.value)}>
                {sectorOptions.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Signal</label>
              <select style={inp} value={form.signal} onChange={(e) => handleChange("signal", e.target.value)}>
                {signalOptions.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Entry Price (₹)</label>
              <input style={inp} type="number" placeholder="e.g. 2450" value={form.entryPrice} onChange={(e) => handleChange("entryPrice", e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Target Price (₹)</label>
              <input style={inp} type="number" placeholder="e.g. 2700" value={form.targetPrice} onChange={(e) => handleChange("targetPrice", e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Stop Loss (₹)</label>
              <input style={inp} type="number" placeholder="e.g. 2350" value={form.stopLoss} onChange={(e) => handleChange("stopLoss", e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Timeframe</label>
              <select style={inp} value={form.timeframe} onChange={(e) => handleChange("timeframe", e.target.value)}>
                {timeframeOptions.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={lbl}>Risk Level</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["Low", "Medium", "High"].map((r) => (
                  <button key={r} onClick={() => handleChange("riskLevel", r)} style={{
                    padding: "7px 22px", borderRadius: 8, border: "1px solid",
                    borderColor: form.riskLevel === r ? (r === "Low" ? "#22c55e" : r === "High" ? "#ef4444" : "#f59e0b") : "#1e2535",
                    background: form.riskLevel === r ? (r === "Low" ? "#14532d" : r === "High" ? "#450a0a" : "#451a03") : "transparent",
                    color: form.riskLevel === r ? "#f1f5f9" : "#64748b",
                    cursor: "pointer", fontSize: 13, fontWeight: 600,
                  }}>{r}</button>
                ))}
              </div>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={lbl}>Technical Notes <span style={{ color: "#475569", fontWeight: 400, textTransform: "none" }}>(RSI, MACD, patterns, volume...)</span></label>
              <textarea style={{ ...inp, height: 80, resize: "vertical" }}
                placeholder="e.g. RSI at 62 and rising, MACD bullish crossover, breakout above 200 DMA with 2x average volume, double bottom pattern at support..."
                value={form.technicalNotes} onChange={(e) => handleChange("technicalNotes", e.target.value)} />
            </div>
          </div>

          {/* R:R Strip */}
          {form.entryPrice && form.targetPrice && form.stopLoss && (
            <div style={{ marginTop: 14, padding: "10px 16px", background: "#0f1117", borderRadius: 10, border: "1px solid #1e2535", display: "flex", gap: 24, fontSize: 13, flexWrap: "wrap" }}>
              <span style={{ color: "#22c55e" }}>▲ +{upside}% upside</span>
              <span style={{ color: "#ef4444" }}>▼ -{downside}% risk</span>
              <span style={{ color: rr >= 2 ? "#22c55e" : rr >= 1.5 ? "#f59e0b" : "#ef4444", fontWeight: 700 }}>R:R {rr}x {rr < 1.5 ? "⚠️ Low" : rr >= 2 ? "✅ Good" : "🆗 Ok"}</span>
            </div>
          )}

          {error && <div style={{ color: "#f87171", fontSize: 13, marginTop: 12 }}>⚠️ {error}</div>}

          {/* Two Action Buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 18 }}>
            <button onClick={runReview} disabled={reviewLoading}
              style={{ padding: "12px", borderRadius: 10, background: reviewLoading ? "#1e2535" : "#1e3a5f", color: reviewLoading ? "#64748b" : "#93c5fd", border: "1px solid #1d4ed8", cursor: reviewLoading ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 14 }}>
              {reviewLoading ? "⏳ Reviewing..." : "🔍 Review My Analysis"}
            </button>
            <button onClick={generateTip} disabled={tipLoading}
              style={{ padding: "12px", borderRadius: 10, background: tipLoading ? "#1e2535" : "linear-gradient(135deg, #22c55e, #16a34a)", color: tipLoading ? "#64748b" : "#fff", border: "none", cursor: tipLoading ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 14 }}>
              {tipLoading ? "⏳ Generating..." : "✨ Generate Client Tip"}
            </button>
          </div>
        </div>

        {/* AI Review Panel */}
        {(reviewLoading || review) && (
          reviewLoading
            ? <div style={{ background: "#1a1f2e", border: "1px solid #1e3a5f", borderRadius: 16, padding: 32, textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>🤖</div>
                <div style={{ color: "#93c5fd", fontWeight: 600 }}>AI is reviewing your analysis...</div>
                <div style={{ color: "#475569", fontSize: 13, marginTop: 4 }}>Checking indicators, R:R, consistency...</div>
              </div>
            : <ReviewPanel review={review} />
        )}

        {/* Tab Toggle for Tip Output */}
        {tip && (
          <div style={{ background: "#1a1f2e", border: "1px solid #22c55e33", borderRadius: 16, padding: 24, animation: "fadeIn 0.4s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>✅ Client-Ready Tip</div>
                <div style={{ fontSize: 19, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.4px" }}>{tip.headline}</div>
              </div>
              <button onClick={copyTip} style={{ padding: "8px 16px", borderRadius: 8, background: copied ? "#14532d" : "#0f1117", border: "1px solid #1e2535", color: copied ? "#22c55e" : "#94a3b8", cursor: "pointer", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>
                {copied ? "✓ Copied!" : "📋 Copy"}
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 18 }}>
              {[
                { label: "Entry", value: `₹${tip.form.entryPrice}`, color: "#94a3b8" },
                { label: `Target (+${tip.upside}%)`, value: `₹${tip.form.targetPrice}`, color: "#22c55e" },
                { label: `Stop Loss (-${tip.downside}%)`, value: `₹${tip.form.stopLoss}`, color: "#ef4444" },
              ].map((item) => (
                <div key={item.label} style={{ background: "#0f1117", borderRadius: 10, padding: "10px 12px", border: "1px solid #1e2535" }}>
                  <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              <SignalBadge signal={tip.form.signal} />
              <Badge label={tip.form.timeframe} color="blue" />
              <Badge label={tip.form.sector} color="gray" />
              <Badge label={`Risk: ${tip.form.riskLevel}`} color={tip.form.riskLevel === "Low" ? "green" : tip.form.riskLevel === "High" ? "red" : "yellow"} />
            </div>

            <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.75, marginBottom: 18 }}>{tip.summary}</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
              <div style={{ background: "#0f1117", borderRadius: 12, padding: 14, border: "1px solid #1e2535" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>✅ Key Reasons</div>
                {tip.keyReasons.map((r, i) => (
                  <div key={i} style={{ fontSize: 13, color: "#cbd5e1", marginBottom: 7, display: "flex", gap: 8, lineHeight: 1.5 }}>
                    <span style={{ color: "#22c55e", flexShrink: 0 }}>•</span>{r}
                  </div>
                ))}
              </div>
              <div style={{ background: "#0f1117", borderRadius: 12, padding: 14, border: "1px solid #1e2535" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>⚠️ Risk Factors</div>
                {tip.riskFactors.map((r, i) => (
                  <div key={i} style={{ fontSize: 13, color: "#cbd5e1", marginBottom: 7, display: "flex", gap: 8, lineHeight: 1.5 }}>
                    <span style={{ color: "#f59e0b", flexShrink: 0 }}>•</span>{r}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#0f1117", borderRadius: 12, padding: 14, border: "1px solid #1e2535", marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>📋 Action Plan</div>
              <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.75, margin: 0 }}>{tip.actionPlan}</p>
            </div>

            <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.6, padding: "10px 14px", background: "#0f1117", borderRadius: 8, border: "1px solid #1e2535", marginBottom: 14 }}>
              <strong style={{ color: "#64748b" }}>Disclaimer:</strong> {tip.disclaimer}
            </div>

            <button onClick={saveCurrentTip} style={{
              width: "100%", padding: "12px", borderRadius: 10, border: "1px solid #1d4ed8",
              background: "#1e3a5f", color: "#93c5fd", cursor: "pointer", fontWeight: 700, fontSize: 14,
            }}>
              {savedMsg || "📊 Save to Track Record"}
            </button>
          </div>
        )}

        {!review && !tip && !reviewLoading && !tipLoading && (
          <div style={{ textAlign: "center", padding: "28px 16px", color: "#475569", fontSize: 13 }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🔍 + 📈</div>
            <div style={{ fontWeight: 700, color: "#64748b", marginBottom: 4 }}>Two powerful tools in one</div>
            <div style={{ color: "#475569" }}><strong style={{ color: "#93c5fd" }}>Review</strong> — AI checks your analysis for errors &nbsp;|&nbsp; <strong style={{ color: "#22c55e" }}>Generate</strong> — creates professional client tip</div>
          </div>
        )}
      </div>
      )}

      {page === "tracker" && (
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "20px 16px" }}>

        {/* Stats Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
          <StatCard label="Total Tips" value={totalTips} color="#93c5fd" />
          <StatCard label="Win Rate" value={winRate !== null ? `${winRate}%` : "—"} color={winRate >= 60 ? "#22c55e" : winRate !== null ? "#f59e0b" : "#94a3b8"} />
          <StatCard label="Target Hit" value={wins} color="#22c55e" />
          <StatCard label="SL Hit" value={losses} color="#ef4444" />
        </div>

        {openCount > 0 && (
          <div style={{ background: "#1e3a5f22", border: "1px solid #1d4ed8", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#93c5fd" }}>
            ℹ️ You have {openCount} open tip{openCount > 1 ? "s" : ""}. Update their status once target or stop loss is hit.
          </div>
        )}

        {!tipsLoaded && (
          <div style={{ textAlign: "center", padding: 40, color: "#475569" }}>Loading...</div>
        )}

        {tipsLoaded && tips.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 16px", color: "#475569" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📊</div>
            <div style={{ fontWeight: 700, color: "#64748b", marginBottom: 4 }}>No tips tracked yet</div>
            <div style={{ fontSize: 13 }}>Generate a tip in the Analyze tab and click "Save to Track Record"</div>
          </div>
        )}

        {/* Tip List */}
        {tips.map((t) => {
          const statusColor = { "Open": "blue", "Target Hit": "green", "SL Hit": "red", "Closed": "gray" }[t.status] || "gray";
          const pnl = t.status === "Target Hit"
            ? (((t.targetPrice - t.entryPrice) / t.entryPrice) * 100).toFixed(1)
            : t.status === "SL Hit"
            ? (((t.stopLoss - t.entryPrice) / t.entryPrice) * 100).toFixed(1)
            : null;
          return (
            <div key={t.id} style={{ background: "#1a1f2e", border: "1px solid #1e2535", borderRadius: 14, padding: 16, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 10 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#f1f5f9", marginBottom: 2 }}>{t.stockName}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{new Date(t.date).toLocaleDateString()} • {t.timeframe}</div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <SignalBadge signal={t.signal} />
                  <Badge label={t.status} color={statusColor} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
                <MiniStat label="Entry" value={`₹${t.entryPrice}`} color="#94a3b8" />
                <MiniStat label="Target" value={`₹${t.targetPrice}`} color="#22c55e" />
                <MiniStat label="SL" value={`₹${t.stopLoss}`} color="#ef4444" />
              </div>

              {pnl !== null && (
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: pnl >= 0 ? "#22c55e" : "#ef4444" }}>
                  Result: {pnl >= 0 ? "+" : ""}{pnl}%
                </div>
              )}

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {t.status !== "Target Hit" && (
                  <button onClick={() => updateTipStatus(t.id, "Target Hit")} style={smallBtn("#14532d", "#86efac")}>✅ Target Hit</button>
                )}
                {t.status !== "SL Hit" && (
                  <button onClick={() => updateTipStatus(t.id, "SL Hit")} style={smallBtn("#450a0a", "#fca5a5")}>❌ SL Hit</button>
                )}
                {t.status !== "Open" && (
                  <button onClick={() => updateTipStatus(t.id, "Open")} style={smallBtn("#1e3a5f", "#93c5fd")}>↩ Mark Open</button>
                )}
                {t.status === "Open" && (
                  <button onClick={() => checkLivePrice(t)} disabled={priceChecks[t.id]?.loading} style={smallBtn("#1e3a5f", "#93c5fd")}>
                    {priceChecks[t.id]?.loading ? "⏳ Checking..." : "🔄 Check Live Price"}
                  </button>
                )}
                <button onClick={() => deleteTip(t.id)} style={smallBtn("#1e2535", "#64748b")}>🗑 Delete</button>
              </div>

              {priceChecks[t.id]?.error && (
                <div style={{ marginTop: 10, fontSize: 12, color: "#f87171" }}>⚠️ {priceChecks[t.id].error}</div>
              )}
              {priceChecks[t.id]?.result && (
                <div style={{ marginTop: 10, background: "#0f1117", border: "1px solid #1e2535", borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 13, color: "#cbd5e1", marginBottom: 4 }}>
                    Current Price: <strong style={{ color: "#f1f5f9" }}>₹{priceChecks[t.id].result.currentPrice}</strong>
                    {"  "}<Badge label={priceChecks[t.id].result.status} color={priceChecks[t.id].result.status === "Target Hit" ? "green" : priceChecks[t.id].result.status === "SL Hit" ? "red" : "blue"} />
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>{priceChecks[t.id].result.note}</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>{priceChecks[t.id].result.asOf}</div>
                  {(priceChecks[t.id].result.status === "Target Hit" || priceChecks[t.id].result.status === "SL Hit") && (
                    <button onClick={() => updateTipStatus(t.id, priceChecks[t.id].result.status)} style={{ ...smallBtn("#14532d", "#86efac"), marginTop: 8 }}>
                      Apply: Mark as {priceChecks[t.id].result.status}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}

      {page === "subscribe" && (
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "20px 16px" }}>
        <div style={{ background: "#1a1f2e", border: "1px solid #1e2535", borderRadius: 16, padding: 24, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>⚙️ Setup Your Payment Details</div>
          <div style={{ fontSize: 12, color: "#475569", marginBottom: 18 }}>Stored on this device/account only. Fill once — used to build your subscribe page below.</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={lbl}>UPI ID</label>
              <input style={inp} placeholder="yourname@upi" value={paySettings.upiId} onChange={(e) => setPaySettings((p) => ({ ...p, upiId: e.target.value }))} />
            </div>
            <div>
              <label style={lbl}>Plan Name</label>
              <input style={inp} placeholder="Monthly Tips Plan" value={paySettings.planName} onChange={(e) => setPaySettings((p) => ({ ...p, planName: e.target.value }))} />
            </div>
            <div>
              <label style={lbl}>Price (₹)</label>
              <input style={inp} type="number" placeholder="999" value={paySettings.price} onChange={(e) => setPaySettings((p) => ({ ...p, price: e.target.value }))} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={lbl}>WhatsApp Number <span style={{ color: "#475569", fontWeight: 400, textTransform: "none" }}>(with country code, no + or spaces, e.g. 919876543210)</span></label>
              <input style={inp} placeholder="919876543210" value={paySettings.whatsapp} onChange={(e) => setPaySettings((p) => ({ ...p, whatsapp: e.target.value }))} />
            </div>
          </div>

          <button onClick={() => savePaySettings(paySettings)} style={{ marginTop: 16, width: "100%", padding: "12px", borderRadius: 10, border: "1px solid #1d4ed8", background: "#1e3a5f", color: "#93c5fd", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
            {paySaved ? "✓ Saved!" : "💾 Save Payment Settings"}
          </button>
        </div>

        {/* Customer-facing subscribe card */}
        <div style={{ background: "linear-gradient(135deg, #1a1f2e, #0f1117)", border: "1px solid #22c55e44", borderRadius: 16, padding: 28, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#22c55e", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Customer-Facing Page</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", marginBottom: 6 }}>{paySettings.planName || "Subscription Plan"}</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: "#22c55e", marginBottom: 16 }}>
            ₹{paySettings.price || "—"}<span style={{ fontSize: 14, color: "#64748b", fontWeight: 600 }}> / month</span>
          </div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20, lineHeight: 1.7 }}>
            Get AI-reviewed, professional stock tips with entry, target & stop-loss directly on WhatsApp.
            {winRate !== null && <> Current verified win rate: <strong style={{ color: "#22c55e" }}>{winRate}%</strong>.</>}
          </div>

          {paySettings.upiId ? (
            <a
              href={`upi://pay?pa=${encodeURIComponent(paySettings.upiId)}&pn=${encodeURIComponent(paySettings.planName || "MarketMaster AI")}&am=${encodeURIComponent(paySettings.price || "0")}&cu=INR`}
              style={{ display: "inline-block", padding: "14px 32px", borderRadius: 10, background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", fontWeight: 800, fontSize: 15, textDecoration: "none", marginBottom: 12 }}
            >
              💳 Pay with UPI — ₹{paySettings.price || "0"}
            </a>
          ) : (
            <div style={{ color: "#64748b", fontSize: 13, marginBottom: 12 }}>Add your UPI ID above to enable the pay button.</div>
          )}

          {paySettings.whatsapp && (
            <div>
              <a
                href={`https://wa.me/${paySettings.whatsapp}?text=${encodeURIComponent(`Hi! I've paid ₹${paySettings.price} for ${paySettings.planName}. Here's my payment screenshot for verification.`)}`}
                style={{ display: "inline-block", padding: "10px 24px", borderRadius: 10, background: "#0f1117", border: "1px solid #1e2535", color: "#93c5fd", fontWeight: 700, fontSize: 13, textDecoration: "none" }}
              >
                📲 Send Payment Proof on WhatsApp
              </a>
            </div>
          )}

          <div style={{ fontSize: 11, color: "#475569", marginTop: 18, lineHeight: 1.6 }}>
            After payment, share your screenshot on WhatsApp to get added to the tips group/channel.
          </div>
        </div>

        {/* Security note */}
        <div style={{ marginTop: 20, background: "#1e3a5f22", border: "1px solid #1d4ed8", borderRadius: 12, padding: 16, fontSize: 12, color: "#93c5fd", lineHeight: 1.7 }}>
          <strong>🔒 About Security:</strong> This UPI link approach means there's no card data, login database, or server for anyone to hack — payments go directly through your bank's UPI app.
          For higher trust and automation (auto-verify payments, recurring billing), you'd later set up a payment gateway like Razorpay with a proper hosted website — happy to guide you on that when you're ready.
        </div>
      </div>
      )}
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </div>
  );
}

const lbl = { display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" };
const inp = { width: "100%", padding: "10px 12px", background: "#0f1117", border: "1px solid #1e2535", borderRadius: 8, color: "#e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" };

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: "#1a1f2e", border: "1px solid #1e2535", borderRadius: 12, padding: "14px 10px", textAlign: "center" }}>
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 11, color: "#64748b", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div style={{ background: "#0f1117", borderRadius: 8, padding: "8px 10px", border: "1px solid #1e2535" }}>
      <div style={{ fontSize: 10, color: "#64748b", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color }}>{value}</div>
    </div>
  );
}

function smallBtn(bg, color) {
  return {
    padding: "6px 12px", borderRadius: 8, border: "none", background: bg, color,
    cursor: "pointer", fontSize: 12, fontWeight: 700,
  };
}
