"use client";

import { useState } from "react";

type Analysis = {
  summary: string;
  probable_root_cause: string;
  recommended_action: string;
  memory_used: boolean;
  confidence: string;
};

type Result = {
  incident_id: string;
  analysis: Analysis;
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  async function investigate() {
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/incidents/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Production API 5xx spike after deployment",
          service: "api-gateway",
          severity: "CRITICAL",
          description:
            "HTTP 500 responses increased sharply immediately after deployment v2.4.",
        }),
      });

      if (!response.ok) {
        throw new Error("Backend request failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Could not connect to the incident-response backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#07090c] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#0a0d11] p-5 md:flex md:flex-col">
          <div className="mb-10">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
                ◈
              </div>
              <div>
                <div className="font-semibold">
                  Hindsight<span className="text-blue-400">IR</span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                  Incident Intelligence
                </div>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {["Overview", "Incidents", "Memory", "Analytics"].map((item) => (
              <div
                key={item}
                className={`rounded-lg px-3 py-2.5 text-sm ${
                  item === "Overview"
                    ? "bg-white/8 text-white"
                    : "text-white/45"
                }`}
              >
                {item}
              </div>
            ))}
          </nav>

          <div className="mt-auto rounded-xl border border-white/10 bg-white/[0.025] p-4">
            <div className="mb-2 text-xs text-white/40">AGENT STATUS</div>
            <div className="flex items-center gap-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Online
            </div>
            <div className="mt-3 text-xs text-white/30">
              Hindsight memory connected
            </div>
          </div>
        </aside>

        <section className="flex-1">
          <header className="flex h-16 items-center justify-between border-b border-white/10 px-5 md:px-8">
            <div>
              <div className="text-sm text-white/40">
                Operations / Overview
              </div>
              <h1 className="text-lg font-semibold">
                Incident Response Agent
              </h1>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/40">
              Hindsight Memory{" "}
              <span className="ml-2 text-emerald-400">● Connected</span>
            </div>
          </header>

          <div className="mx-auto max-w-7xl p-5 md:p-8">
            <div className="mb-8">
              <div className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-blue-400">
                Live Operations
              </div>

              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Incident intelligence that remembers.
              </h2>

              <p className="mt-2 max-w-2xl text-sm text-white/40">
                The agent learns from previous incidents using Hindsight and
                uses that experience to improve future investigations.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {[
                ["Active Incidents", "01", "Requires attention"],
                ["Resolved Today", "17", "Incidents resolved"],
                ["Memory Records", "1,284", "Experiences retained"],
                ["Avg. Response", "3m 42s", "Response time"],
              ].map(([label, value, note]) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/10 bg-white/[0.025] p-5"
                >
                  <div className="text-xs text-white/35">{label}</div>
                  <div className="mt-3 text-2xl font-semibold">{value}</div>
                  <div className="mt-1 text-xs text-blue-400">{note}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_.8fr]">
              <div className="rounded-xl border border-white/10 bg-white/[0.025]">
                <div className="border-b border-white/10 p-5">
                  <h3 className="font-medium">Active incidents</h3>
                  <p className="mt-1 text-xs text-white/35">
                    Real-time operational events
                  </p>
                </div>

                <div className="divide-y divide-white/5">
                  {[
                    ["INC-2048", "Production API 5xx spike", "CRITICAL"],
                    ["INC-2047", "Database latency increased", "HIGH"],
                    ["INC-2046", "Deployment health check failed", "MEDIUM"],
                  ].map(([id, title, severity]) => (
                    <div
                      key={id}
                      className="flex items-center justify-between p-5"
                    >
                      <div>
                        <div className="text-xs text-white/30">{id}</div>
                        <div className="mt-1 text-sm font-medium">{title}</div>
                        <div className="mt-1 text-xs text-white/30">
                          api-gateway · recent
                        </div>
                      </div>

                      <span className="rounded-full bg-red-400/10 px-2.5 py-1 text-[10px] text-red-300">
                        {severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-blue-400/20 bg-blue-400/[0.04] p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-300">
                  ✦ AI Investigation
                </div>

                <h3 className="mt-4 text-xl font-semibold">
                  Investigate an incident
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/40">
                  Recall similar historical incidents, identify the likely
                  root cause and recommend the next action.
                </p>

                <button
                  onClick={investigate}
                  disabled={loading}
                  className="mt-6 w-full rounded-lg bg-blue-500 px-4 py-3 text-sm font-medium transition hover:bg-blue-400 disabled:cursor-wait disabled:opacity-50"
                >
                  {loading ? "Investigating..." : "Start investigation →"}
                </button>

                {loading && (
                  <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3 text-xs text-white/45">
                    <div>● Recalling historical memory...</div>
                    <div className="mt-2">● Groq analyzing incident...</div>
                    <div className="mt-2">● Generating response...</div>
                  </div>
                )}

                {error && (
                  <div className="mt-4 rounded-lg border border-red-400/20 bg-red-400/5 p-3 text-xs text-red-300">
                    {error}
                  </div>
                )}
              </div>
            </div>

            {result && (
              <div className="mt-6 rounded-xl border border-blue-400/20 bg-blue-400/[0.03] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.16em] text-blue-400">
                      AI Investigation Result
                    </div>
                    <h3 className="mt-2 text-xl font-semibold">
                      {result.incident_id}
                    </h3>
                  </div>

                  <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                    Memory used ✓
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                    <div className="text-[10px] uppercase tracking-widest text-blue-400">
                      Assessment
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/65">
                      {result.analysis.summary}
                    </p>
                  </div>

                  <div className="rounded-lg border border-red-400/20 bg-red-400/5 p-4">
                    <div className="text-[10px] uppercase tracking-widest text-red-300">
                      Probable Root Cause
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/65">
                      {result.analysis.probable_root_cause}
                    </p>
                  </div>

                  <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-4">
                    <div className="text-[10px] uppercase tracking-widest text-emerald-300">
                      Recommended Action
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/65">
                      {result.analysis.recommended_action}
                    </p>
                  </div>
                </div>

                <div className="mt-4 text-xs text-white/35">
                  Confidence: {result.analysis.confidence} · Hindsight memory:
                  {result.analysis.memory_used ? " used" : " not used"}
                </div>
              </div>
            )}

            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.025] p-6">
              <div className="mb-5">
                <h3 className="font-medium">Agent learning loop</h3>
                <p className="mt-1 text-xs text-white/35">
                  Every investigation becomes future experience.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                {[
                  ["01", "New incident", "Signals enter the system"],
                  ["02", "Recall memory", "Find similar experiences"],
                  ["03", "Reason & act", "Generate response"],
                  ["04", "Retain outcome", "Learn from resolution"],
                ].map(([number, title, description]) => (
                  <div
                    key={number}
                    className="rounded-lg border border-white/8 bg-black/15 p-4"
                  >
                    <div className="text-xs text-blue-400">{number}</div>
                    <div className="mt-2 text-sm font-medium">{title}</div>
                    <div className="mt-1 text-xs leading-5 text-white/30">
                      {description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
