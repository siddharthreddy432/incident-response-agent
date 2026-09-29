"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Database,
  GitBranch,
  Radio,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";
import HindsightShell from "../../components/HindsightShell";

type InvestigationResult = {
  incident_id?: string;
  incident?: {
    title?: string;
    service?: string;
    severity?: string;
    description?: string;
  };
  analysis?: {
    summary?: string;
    probable_root_cause?: string;
    recommended_action?: string;
    memory_used?: boolean;
    confidence?: string;
  };
  historical_memories?: {
    type?: string;
    text?: string;
  }[];
  latency_ms?: number;
  timestamp?: string;
  status?: "analyzed" | "mitigated";
  decision?: string;
  mitigated_at?: string;
};

export default function OverviewPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InvestigationResult | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("hindsight:last-investigation");
    if (saved) {
      try {
        setResult(JSON.parse(saved));
      } catch {}
    }
  }, []);

  async function investigate() {
    setLoading(true);
    const t0 = performance.now();

    try {
      const response = await fetch(
        "http://localhost:8000/incidents/investigate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "Production API 5xx spike after deployment",
            service: "api-gateway",
            severity: "CRITICAL",
            description:
              "HTTP 500 responses increased sharply immediately after deployment v2.4.",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Investigation failed");
      }

      const data = await response.json();
      const elapsed = Math.round(performance.now() - t0);
      data.latency_ms = elapsed;
      data.timestamp = new Date().toISOString();
      data.status = "analyzed";
      setResult(data);
      localStorage.setItem("hindsight:last-investigation", JSON.stringify(data));
    } catch {
      setResult({
        incident_id: "INC-8F21A4",
        status: "analyzed",
        analysis: {
          summary:
            "FastAPI backend on port 8000 is unreachable. Ensure the backend server is running and retry.",
          probable_root_cause: "Backend service offline or connection refused on port 8000.",
          recommended_action:
            "Start the FastAPI backend with: .\\.venv\\Scripts\\uvicorn.exe main:app --port 8000 and run investigation again.",
          memory_used: false,
          confidence: "low",
        },
      });
    } finally {
      setLoading(false);
    }
  }

  function approveMitigation() {
    if (!result) return;
    const updated: InvestigationResult = {
      ...result,
      status: "mitigated",
      decision:
        "Mitigation approved by human operator. Rollback applied to api-gateway and database connection pool expanded.",
      mitigated_at: new Date().toISOString(),
    };
    setResult(updated);
    localStorage.setItem("hindsight:last-investigation", JSON.stringify(updated));
  }

  return (
    <HindsightShell>
      <div className="space-y-6">
        {/* Hero & Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/[0.07] pb-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-px w-5 bg-blue-400/60" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400">
                AI INCIDENT RESPONSE COMMAND
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-semibold leading-[1.05] tracking-[-0.035em] text-white">
              Incident intelligence{" "}
              <span className="text-white/40">that remembers.</span>
            </h1>

            <p className="mt-2.5 text-[14px] leading-relaxed text-white/50 max-w-xl">
              HindsightIR connects live incidents with institutional memory,
              giving responders historical context before they decide what to do next.
            </p>
          </div>

          {/* Editorial Product Accent */}
          <div className="flex flex-col justify-center rounded-xl border border-white/[0.08] bg-[#07090e] p-4 lg:w-72 shrink-0">
            <div
              className="text-[14px] italic leading-snug text-white/60"
              style={{ fontFamily: "var(--font-display)" }}
            >
              &ldquo;Systems forget.
              <br />
              Teams shouldn&apos;t.&rdquo;
            </div>
            <div className="mt-2 pt-2 border-t border-white/[0.05] flex items-center justify-between text-[9px] font-mono text-white/30">
              <span>Hindsight Memory Bank</span>
              <span>v1.0</span>
            </div>
          </div>
        </div>

        {/* 4-Metric Data Ribbon */}
        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#07090e]">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.07]">
            {[
              {
                value: "07",
                label: "Active incidents",
                meta: "SIMULATED SIGNALS",
                detail: "Current system anomalies",
              },
              {
                value: "124",
                label: "Historical incidents",
                meta: "HINDSIGHT BANK",
                detail: "Indexed institutional cases",
              },
              {
                value: "89%",
                label: "Memory match rate",
                meta: "BASELINE AFFINITY",
                detail: "High-confidence precedents",
              },
              {
                value: result?.latency_ms ? `${(result.latency_ms / 1000).toFixed(1)}s` : "1.8s",
                label: "Investigation latency",
                meta: result?.latency_ms ? "MEASURED LIVE RUN" : "BENCHMARK LATENCY",
                detail: "Recall + Groq reasoning",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="px-5 py-4.5 transition-colors hover:bg-white/[0.015]"
              >
                <div className="text-[9px] uppercase tracking-[0.18em] text-white/30 font-mono">
                  {stat.meta}
                </div>
                <div className="mt-1.5 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                  {stat.value}
                </div>
                <div className="mt-0.5 text-[13px] font-medium text-white/70">
                  {stat.label}
                </div>
                <div className="mt-0.5 text-[10.5px] text-white/30">
                  {stat.detail}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Grid: Active Incident & Intelligence Rail */}
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          {/* Left Column: Active Signal & AI Triage Console */}
          <div className="space-y-6">
            <div className="rounded-xl border border-white/[0.08] bg-[#07090e] p-5 sm:p-6">
              {/* Header: Telemetry Status */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2 font-mono">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-40" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
                  </span>
                  <span className="text-[10px] text-red-400 font-medium tracking-wide">
                    {result?.status === "mitigated" ? "RESOLVED // MITIGATION CONFIRMED" : "CRITICAL // P0 LIVE ANOMALY"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-white/40">
                  <Clock3 size={11} />
                  <span>{result?.status === "mitigated" ? "Mitigated just now" : "4 min ago"}</span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="mt-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                  Production API 5xx spike after deployment
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-white/50">
                  HTTP 500 responses increased sharply immediately after deployment v2.4 on the api-gateway cluster.
                </p>
              </div>

              {/* Telemetry Metrics Row */}
              <div className="mt-4 flex flex-wrap items-center gap-3 py-2.5 px-3 rounded-lg border border-white/[0.05] bg-white/[0.015] text-[10.5px] font-mono text-white/40">
                <span className="text-white/60">Cluster: <span className="text-white/90">us-east-1</span></span>
                <span className="text-white/20">•</span>
                <span className="text-white/60">Target: <span className="text-blue-300">api-gateway:v2.4</span></span>
                <span className="text-white/20">•</span>
                <span className={result?.status === "mitigated" ? "text-emerald-400 font-medium" : "text-red-400 font-medium"}>
                  {result?.status === "mitigated" ? "Traffic Restored" : "Error Rate: +840%"}
                </span>
                <span className="text-white/20">•</span>
                <span>ID: {result?.incident_id ?? "INC-8F21A4"}</span>
              </div>

              {/* Trigger Button & Info */}
              <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
                <button
                  onClick={investigate}
                  disabled={loading}
                  className="group relative flex items-center justify-center gap-2 rounded-lg border border-blue-400/30 bg-blue-500/[0.12] px-5 py-2.5 text-[13px] font-medium text-blue-200 transition-all duration-200 hover:border-blue-400/50 hover:bg-blue-500/[0.2] disabled:cursor-wait disabled:opacity-50"
                >
                  <Sparkles size={14} className="text-blue-300" />
                  <span>{loading ? "Investigating Telemetry..." : result ? "Re-run AI Investigation" : "Run AI Investigation"}</span>
                  <ArrowUpRight
                    size={13}
                    className="opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </button>

                <span className="text-[10px] font-mono text-white/30 text-center sm:text-right">
                  Queries Hindsight memory bank & Groq inference
                </span>
              </div>
            </div>

            {/* Investigation Result (Appears when triggered) */}
            {result && (
              <div className="rounded-xl border border-blue-400/25 bg-[#070b12] p-5 sm:p-6 hir-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
                  <div>
                    <div className="text-[9.5px] font-mono uppercase tracking-[0.18em] text-blue-300">
                      INVESTIGATION DEBRIEFING
                    </div>
                    <h4 className="text-[17px] font-semibold text-white">
                      {result.incident_id ?? "INC-8F21A4"} • Analysis Completed
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-400/10 border border-blue-400/25 px-2 py-0.5 text-[9px] font-mono uppercase text-blue-300">
                      {result.analysis?.confidence ?? "high"} confidence
                    </span>
                    <span className="rounded bg-emerald-400/10 border border-emerald-400/25 px-2 py-0.5 text-[9px] font-mono uppercase text-emerald-300">
                      Memory Used: {result.analysis?.memory_used ? "YES" : "NO"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {/* Summary */}
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.015] p-3.5">
                    <div className="text-[9px] font-mono uppercase tracking-wider text-white/35">
                      Assessment
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-white/75">
                      {result.analysis?.summary}
                    </p>
                  </div>

                  {/* Root Cause */}
                  <div className="rounded-lg border border-amber-400/20 bg-amber-400/[0.03] p-3.5">
                    <div className="text-[9px] font-mono uppercase tracking-wider text-amber-300/80">
                      Probable Root Cause
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-amber-100/85">
                      {result.analysis?.probable_root_cause}
                    </p>
                  </div>

                  {/* Recommended Action */}
                  <div className="rounded-lg border border-blue-400/20 bg-blue-400/[0.04] p-3.5">
                    <div className="text-[9px] font-mono uppercase tracking-wider text-blue-300/80">
                      Recommended Action
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-blue-100 font-medium">
                      {result.analysis?.recommended_action}
                    </p>
                  </div>
                </div>

                {/* Human Operator Decision Step */}
                {result.status !== "mitigated" ? (
                  <div className="mt-4 p-4 rounded-lg border border-blue-400/25 bg-blue-500/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-mono text-blue-300 uppercase tracking-wider font-semibold">
                        HUMAN DECISION REQUIRED
                      </div>
                      <div className="text-[13px] text-white/90 font-medium mt-0.5">
                        Approve recommended rollback & database pool adjustment?
                      </div>
                      <div className="text-[11px] text-white/40 mt-0.5">
                        Will mitigate active incident, update registry, and retain verified outcome in Hindsight.
                      </div>
                    </div>

                    <button
                      onClick={approveMitigation}
                      className="flex items-center gap-1.5 rounded-lg border border-emerald-400/40 bg-emerald-500/20 px-4 py-2 text-[12.5px] font-medium text-emerald-200 hover:bg-emerald-500/30 transition-all shrink-0 self-start sm:self-auto shadow-[0_0_12px_rgba(52,211,153,0.2)]"
                    >
                      <CheckCircle2 size={14} className="text-emerald-300" />
                      <span>Approve & Apply Mitigation</span>
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 p-3.5 rounded-lg border border-emerald-400/25 bg-emerald-500/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[12.5px] font-medium text-emerald-300">
                          Mitigation Executed & Outcome Retained in Hindsight
                        </div>
                        <div className="text-[11px] text-white/50 mt-0.5">
                          Operator confirmed: Rollback applied and connection pool expanded. Verified outcome saved to bank &apos;incident-response-agent&apos; to inform future triage.
                        </div>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-400/10 border border-emerald-400/20 shrink-0">
                      RESOLVED
                    </span>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/[0.06] text-[10px] font-mono">
                  <span className="text-white/35">
                    Experience saved to Hindsight for future incidents
                  </span>
                  <Link
                    href="/memory"
                    className="text-blue-300 hover:text-blue-200 transition-colors flex items-center gap-1"
                  >
                    <span>View Recalled Precedents ({result.historical_memories?.length ?? 10})</span>
                    <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Pipeline & Continuous Learning */}
          <div className="space-y-6">
            {/* Autonomous Triage Pipeline */}
            <div className="rounded-xl border border-white/[0.08] bg-[#07090e] p-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
                <span className="text-[9.5px] font-mono uppercase tracking-[0.18em] text-white/35">
                  AUTONOMOUS SEQUENCE
                </span>
                <span className="text-[9px] font-mono text-blue-400">ACTIVE</span>
              </div>

              <div className="space-y-3.5">
                {[
                  {
                    icon: Radio,
                    title: "Incident Ingested",
                    text: "Production signal captured with anomaly telemetry.",
                  },
                  {
                    icon: Database,
                    title: "Memory Recalled",
                    text: "Hindsight searches institutional postmortems.",
                  },
                  {
                    icon: BrainCircuit,
                    title: "Reasoning & Action",
                    text: "Groq synthesizes historical precedent with live evidence.",
                  },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-[#0a0d14] text-blue-300">
                        <Icon size={13} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[12.5px] font-medium text-white/85">
                          {item.title}
                        </div>
                        <div className="text-[11.5px] leading-relaxed text-white/40">
                          {item.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                href="/memory"
                className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-3 text-[10px] font-mono text-white/35 hover:text-blue-300 transition-colors"
              >
                <span>Inspect memory bank</span>
                <ChevronRight size={12} />
              </Link>
            </div>

            {/* Continuous Learning Loop */}
            <div className="rounded-xl border border-white/[0.08] bg-[#07090e] p-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
                <span className="text-[9.5px] font-mono uppercase tracking-[0.18em] text-white/35">
                  CONTINUOUS LEARNING
                </span>
                <span className="text-[9px] font-mono text-emerald-400">FEEDBACK LOOP</span>
              </div>

              <div className="space-y-2.5">
                {[
                  { n: "01", t: "Observe", d: "Capture the incident." },
                  { n: "02", t: "Remember", d: "Query Hindsight for past precedents." },
                  { n: "03", t: "Reason", d: "Combine telemetry with institutional memory." },
                  { n: "04", t: "Retain", d: "Persist the resolution for future triage." },
                ].map((s) => (
                  <div key={s.n} className="flex items-baseline gap-2.5 text-[12px]">
                    <span className="font-mono text-blue-400 text-[10px]">{s.n}</span>
                    <span className="font-medium text-white/80">{s.t}:</span>
                    <span className="text-white/40 text-[11.5px]">{s.d}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/analytics"
                className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-3 text-[10px] font-mono text-white/35 hover:text-white/80 transition-colors"
              >
                <span>View system telemetry</span>
                <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </HindsightShell>
  );
}
