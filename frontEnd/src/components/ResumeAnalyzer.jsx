import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/ai/analyze-resume`;

/* ─── Circular Score Ring ─────────────────────────────────────────────────── */
const ScoreRing = ({ score }) => {
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const progress = (score / 100) * circ;
  const color =
    score >= 75 ? "#4ade80" : score >= 50 ? "#facc15" : "#f87171";

  return (
    <div style={{ position: "relative", width: 140, height: 140 }}>
      <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#1e1e2e" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={`${progress} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 32, fontWeight: 800, color, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontSize: 11, color: "#6b7280", letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
          Score
        </span>
      </div>
    </div>
  );
};

/* ─── Tag Chip ────────────────────────────────────────────────────────────── */
const Chip = ({ label, color }) => (
  <span style={{
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 0.5,
    background: color + "22",
    color,
    border: `1px solid ${color}44`,
    fontFamily: "'DM Sans', sans-serif",
  }}>{label}</span>
);

/* ─── Section Card ────────────────────────────────────────────────────────── */
const Card = ({ children, style = {} }) => (
  <div style={{
    background: "#0f0f1a",
    border: "1px solid #1e1e2e",
    borderRadius: 16,
    padding: "20px 24px",
    ...style,
  }}>{children}</div>
);

const SectionTitle = ({ children }) => (
  <p style={{
    fontFamily: "'Syne', sans-serif",
    fontSize: 11,
    fontWeight: 700,
    color: "#6b7280",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 14,
  }}>{children}</p>
);

/* ─── Upload Zone ─────────────────────────────────────────────────────────── */
const UploadZone = ({ onText, dragging, setDragging, loading }) => {
  const fileRef = useRef();
  const [fileError, setFileError] = useState(null);
  const [extracting, setExtracting] = useState(false);

  // Load PDF.js from CDN once
  useEffect(() => {
    if (window.pdfjsLib) return;
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    };
    document.head.appendChild(script);
  }, []);

  const extractPdfText = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedArray = new Uint8Array(e.target.result);
          const pdf = await window.pdfjsLib.getDocument(typedArray).promise;
          let fullText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map((item) => item.str).join(" ");
            fullText += pageText + "\n";
          }
          resolve(fullText.trim());
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFile = async (file) => {
    if (!file) return;
    setFileError(null);

    const isPDF = file.type === "application/pdf" || file.name.endsWith(".pdf");
    const isTxt = file.type === "text/plain" || file.name.endsWith(".txt");

    if (!isPDF && !isTxt) {
      setFileError("Only .pdf or .txt files are supported.");
      return;
    }

    if (isTxt) {
      // Plain text — read directly
      const reader = new FileReader();
      reader.onload = (e) => onText(e.target.result);
      reader.readAsText(file);
      return;
    }

    // PDF — extract text via PDF.js
    if (!window.pdfjsLib) {
      setFileError("PDF reader is still loading. Please try again in a moment.");
      return;
    }

    setExtracting(true);
    try {
      const text = await extractPdfText(file);
      if (!text || text.length < 50) {
        setFileError("Could not extract text from this PDF. Try a text-based PDF or paste manually.");
        return;
      }
      onText(text);
    } catch {
      setFileError("Failed to read PDF. Please paste your resume text manually.");
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div>
      <div
        onClick={() => fileRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
        style={{
          border: `2px dashed ${dragging ? "#818cf8" : "#2a2a3e"}`,
          borderRadius: 16, padding: "52px 24px", textAlign: "center",
          cursor: "pointer", transition: "border-color .2s, background .2s",
          background: dragging ? "#818cf811" : "transparent",
        }}
      >
        <input ref={fileRef} type="file" accept=".txt,.pdf"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])} />

        <svg width="44" height="44" viewBox="0 0 24 24" fill="none"
          stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ margin: "0 auto 16px" }}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>

        {extracting ? (
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, color: "#818cf8" }}>
            Extracting text from PDF…
          </p>
        ) : (
          <>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: "#e2e8f0", marginBottom: 6 }}>
              Drop your resume here
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#6b7280" }}>
              .pdf and .txt supported · or click to browse
            </p>
          </>
        )}
      </div>

      {/* File error message */}
      {fileError && (
        <div style={{
          marginTop: 10, background: "#f8717111", border: "1px solid #f8717133",
          borderRadius: 10, padding: "10px 14px", color: "#f87171", fontSize: 13,
        }}>
          ⚠ {fileError}
        </div>
      )}
    </div>
  );
};

/* ─── Main Component ──────────────────────────────────────────────────────── */
export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("strengths");

  const analyze = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Analysis failed");
      setAnalysis(data.analysis);
      setTab("strengths");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setAnalysis(null); setResumeText(""); setError(null); };

  const scoreLabel = analysis
    ? analysis.score >= 75 ? { text: "Strong", color: "#4ade80" }
      : analysis.score >= 50 ? { text: "Average", color: "#facc15" }
        : { text: "Needs Work", color: "#f87171" }
    : null;

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #07070f; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .fade-up { animation: fadeUp .5s ease both; }
        .fade-up-1 { animation: fadeUp .5s .08s ease both; }
        .fade-up-2 { animation: fadeUp .5s .16s ease both; }
        .fade-up-3 { animation: fadeUp .5s .24s ease both; }
        .fade-up-4 { animation: fadeUp .5s .32s ease both; }

        .tab-btn {
          background: none; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          padding: 8px 16px; border-radius: 8px; transition: all .2s;
          letter-spacing: .3px;
        }
        .tab-btn:hover { background: #1e1e2e; }
        .tab-btn.active { background: #818cf8; color: #fff !important; }

        .analyze-btn {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #818cf8, #6366f1);
          border: none; border-radius: 12px; cursor: pointer;
          font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
          color: #fff; letter-spacing: .5px;
          transition: opacity .2s, transform .15s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .analyze-btn:hover:not(:disabled) { opacity: .88; transform: translateY(-1px); }
        .analyze-btn:disabled { opacity: .45; cursor: not-allowed; }

        .step-row {
          display: flex; gap: 14px; align-items: flex-start;
          padding: 14px 0; border-bottom: 1px solid #1e1e2e;
        }
        .step-row:last-child { border-bottom: none; }

        textarea:focus { outline: none; border-color: #818cf8 !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #07070f; }
        ::-webkit-scrollbar-thumb { background: #1e1e2e; border-radius: 3px; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#07070f",
        padding: "40px 16px 80px",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

          {/* Header */}
          <div className="fade-up" style={{ marginBottom: 40, textAlign: "center" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#818cf811", border: "1px solid #818cf833",
              borderRadius: 999, padding: "5px 14px", marginBottom: 18,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#818cf8", display: "inline-block" }} />
              <span style={{ fontSize: 12, color: "#818cf8", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>
                ATS Resume Analyzer
              </span>
              <Link to="/app"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200 no-underline group">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  className="transition-transform duration-200 group-hover:-translate-x-1">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px, 5vw, 42px)",
              fontWeight: 800, color: "#f1f5f9", lineHeight: 1.15, marginBottom: 12,
            }}>
              Get your resume<br />
              <span style={{ color: "#818cf8" }}>scored instantly</span>
            </h1>
            <p style={{ color: "#6b7280", fontSize: 15, maxWidth: 420, margin: "0 auto" }}>
              Paste or upload your resume and receive an ATS score with actionable improvement tips.
            </p>
          </div>

          {!analysis ? (
            /* ── INPUT PANEL ── */
            <div className="fade-up-1" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <UploadZone onText={setResumeText} dragging={dragging} setDragging={setDragging} />

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1, height: 1, background: "#1e1e2e" }} />
                <span style={{ color: "#3d3d5c", fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>OR PASTE TEXT</span>
                <div style={{ flex: 1, height: 1, background: "#1e1e2e" }} />
              </div>

              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content here…"
                rows={9}
                style={{
                  width: "100%", background: "#0f0f1a",
                  border: "1px solid #1e1e2e", borderRadius: 14,
                  padding: "16px 18px", color: "#cbd5e1", fontSize: 14, lineHeight: 1.7,
                  resize: "vertical", transition: "border-color .2s",
                }}
              />

              {error && (
                <div style={{
                  background: "#f8717111", border: "1px solid #f8717133",
                  borderRadius: 10, padding: "12px 16px",
                  color: "#f87171", fontSize: 13,
                }}>⚠ {error}</div>
              )}

              <button className="analyze-btn" onClick={analyze}
                disabled={loading || !resumeText.trim()}>
                {loading ? (
                  <>
                    <span style={{
                      width: 18, height: 18, border: "2px solid #ffffff55",
                      borderTopColor: "#fff", borderRadius: "50%",
                      display: "inline-block", animation: "spin .7s linear infinite",
                    }} />
                    Analyzing…
                  </>
                ) : "Analyze My Resume →"}
              </button>
            </div>

          ) : (
            /* ── RESULTS PANEL ── */
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Score + Summary */}
              <Card className="fade-up" style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
                <ScoreRing score={analysis.score} />
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{
                      fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#f1f5f9",
                    }}>Your Resume Score</span>
                    {scoreLabel && <Chip label={scoreLabel.text} color={scoreLabel.color} />}
                  </div>
                  <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.65 }}>
                    {analysis.summary}
                  </p>
                </div>
              </Card>

              {/* Strengths / Weaknesses Tabs */}
              <Card className="fade-up-1">
                <div style={{ display: "flex", gap: 6, marginBottom: 20, background: "#07070f", padding: 4, borderRadius: 10, width: "fit-content" }}>
                  {["strengths", "weaknesses"].map((t) => (
                    <button key={t} className={`tab-btn ${tab === t ? "active" : ""}`}
                      style={{ color: tab === t ? "#fff" : "#6b7280", textTransform: "capitalize" }}
                      onClick={() => setTab(t)}>
                      {t === "strengths" ? "✦ Strengths" : "⚠ Weaknesses"}
                    </button>
                  ))}
                </div>

                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {(tab === "strengths" ? analysis.strengths : analysis.weaknesses).map((item, i) => (
                    <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{
                        marginTop: 2, flexShrink: 0,
                        width: 20, height: 20, borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700,
                        background: tab === "strengths" ? "#4ade8022" : "#f8717122",
                        color: tab === "strengths" ? "#4ade80" : "#f87171",
                        border: `1px solid ${tab === "strengths" ? "#4ade8044" : "#f8717144"}`,
                      }}>
                        {tab === "strengths" ? "✓" : "!"}
                      </span>
                      <span style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.6 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Improvement Steps */}
              <Card className="fade-up-2">
                <SectionTitle>Improvement Roadmap</SectionTitle>
                <div>
                  {analysis.improvement_steps.map((step, i) => (
                    <div key={i} className="step-row">
                      <div style={{
                        flexShrink: 0, width: 28, height: 28, borderRadius: 8,
                        background: "#818cf822", border: "1px solid #818cf833",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 800, color: "#818cf8",
                      }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>
                          {step.section}
                        </p>
                        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.65 }}>
                          {step.advice}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Analyze again */}
              <div className="fade-up-3" style={{ display: "flex", gap: 12 }}>
                <button onClick={reset} style={{
                  flex: 1, padding: "13px",
                  background: "transparent", border: "1px solid #1e1e2e",
                  borderRadius: 12, cursor: "pointer",
                  fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700,
                  color: "#6b7280", transition: "all .2s",
                }}
                  onMouseOver={e => { e.target.style.borderColor = "#818cf8"; e.target.style.color = "#818cf8"; }}
                  onMouseOut={e => { e.target.style.borderColor = "#1e1e2e"; e.target.style.color = "#6b7280"; }}
                >
                  ← Analyze Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}