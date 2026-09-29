"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BrainCircuit,
  Database,
  History,
  Link2,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import HindsightShell from "../../components/HindsightShell";

type Memory = {
  type?: string;
  text?: string;
};

type Investigation = {
  incident_id?: string;
  historical_memories?: Memory[];
  analysis?: {
    summary?: string;
    probable_root_cause?: string;
    recommended_action?: string;
    confidence?: string;
    memory_used?: boolean;
  };
  latency_ms?: number;
  timestamp?: string;
  status?: "analyzed" | "mitigated";
  decision?: string;
  mitigated_at?: string;
};

export default function MemoryPage() {
  const [investigation, setInvestigation] = useState<Investigation | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("hindsight:last-investigation");
    if (saved) {
      try {
        setInvestigation(JSON.parse(saved));
      } catch {
        setInvestigation(null);
      }
    }
  }, []);

  const memories = investigation?.historical_memories ?? [];
  const memoryUsed = investigation?.analysis?.memory_used ?? false;

  return (
    <HindsightShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.07] pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400">
                INSTITUTIONAL MEMORY SYSTEM
              </span>
              <span className="text-white/20">•</span>
              <span className="text-[10px] font-mono text-white/40">HINDSIGHT ENGINE</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Memory Bank & Experience Recall
            </h1>
            <p className="mt-1 text-[13.5px] text-white/45 max-w-2xl">
              Hindsight gives the agent a persistent, searchable memory of previous incidents, root causes, decisions, and successful resolutions.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.04] px-3.5 py-2 shrink-0 self-start sm:self-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            <div className="text-[10.5px] font-mono text-emerald-300">
              BANK: <span className="text-white">incident-response-agent</span>
            </div>
          </div>
        </div>

        {/* 3-Cell Metric Strip */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Database,
              label: "Memory Bank",
              value: "incident-response-agent",
              meta: "TARGET REPOSITORY",
            },
            {
              icon: History,
              label: "Memories Recalled",
              value: investigation ? `${memories.length} precedents` : "Standby",
              meta: "ACTIVE INVESTIGATION",
            },
            {
              icon: Link2,
              label: "Memory ↔ Reasoning",
              value: memoryUsed
                ? "SYNTHESIZED"
                : investigation
                ? "ZERO PRECEDENT"
                : "STANDBY",
              meta: "DECISION STATUS",
              highlight: memoryUsed,
            },
          ].map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="rounded-xl border border-white/[0.08] bg-[#07090e] p-4.5"
              >
                <div className="flex items-center justify-between">
                  <div className="text-[9px] uppercase tracking-[0.18em] text-white/30 font-mono">
                    {card.meta}
                  </div>
                  <Icon
                    size={15}
                    className={card.highlight ? "text-emerald-400" : "text-blue-300/60"}
                  />
                </div>

                <div className="mt-2 truncate text-[16px] font-semibold text-white/90 font-mono">
                  {card.value}
                </div>

                <div className="mt-0.5 text-[11.5px] text-white/40">
                  {card.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Operational Intelligence Flow - Visual Pipeline */}
        <div className="rounded-xl border border-white/[0.08] bg-[#07090e] p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-5">
            <div>
              <span className="text-[9.5px] font-mono uppercase tracking-[0.18em] text-blue-300/70">
                PIPELINE ARCHITECTURE
              </span>
              <h3 className="text-[16px] font-semibold text-white">
                How Memory Powers Incident Response
              </h3>
            </div>

            <span className="rounded border border-white/[0.08] bg-white/[0.02] px-2 py-0.5 text-[8.5px] font-mono text-white/40">
              5-STAGE PIPELINE
            </span>
          </div>

          {/* Connected Flow Elements */}
          <div className="grid gap-3 lg:grid-cols-5">
            {[
              {
                step: "01",
                title: "CURRENT INCIDENT",
                role: "Signal Ingest",
                desc: "Live production anomaly with service and severity telemetry.",
                active: true,
              },
              {
                step: "02",
                title: "HINDSIGHT RECALL",
                role: "Vector Search",
                desc: "Semantic lookup across postmortems and past outages.",
                active: Boolean(investigation),
              },
              {
                step: "03",
                title: "HISTORICAL EXPERIENCE",
                role: "Precedent Ranking",
                desc: memories.length > 0
                  ? `${memories.length} ranked matching precedents retrieved.`
                  : "Ranked matching cases, proven fixes, and failure modes.",
                active: memories.length > 0,
              },
              {
                step: "04",
                title: "GROQ REASONING",
                role: "Inference Engine",
                desc: "LLM synthesizes live telemetry against historical memory.",
                active: Boolean(investigation?.analysis),
              },
              {
                step: "05",
                title: "RECOMMENDATION",
                role: "Actionable Triage",
                desc: investigation?.status === "mitigated"
                  ? "Mitigation approved & committed to institutional memory."
                  : "Operator runbook directive and automated retention.",
                active: Boolean(investigation?.analysis?.recommended_action),
              },
            ].map((node, index, arr) => (
              <div key={node.step} className="relative flex flex-col justify-between">
                <div
                  className={`rounded-lg border p-3.5 transition-all ${
                    node.active
                      ? "border-blue-400/25 bg-blue-500/[0.03]"
                      : "border-white/[0.05] bg-white/[0.01]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-medium text-blue-400">
                      {node.step}
                    </span>
                    <span className="text-[8.5px] uppercase tracking-wider text-white/30 font-mono">
                      {node.role}
                    </span>
                  </div>

                  <div className="mt-2 text-[12.5px] font-semibold text-white/90">
                    {node.title}
                  </div>

                  <p className="mt-1 text-[11px] leading-relaxed text-white/40">
                    {node.desc}
                  </p>
                </div>

                {index < arr.length - 1 && (
                  <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center text-white/20">
                    <ArrowRight size={13} />
                  </div>
                )}
                {index < arr.length - 1 && (
                  <div className="flex lg:hidden justify-center py-1 text-white/20">
                    <ArrowDown size={13} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Closed Loop Outcome Retention Banner (When Mitigated) */}
        {investigation?.status === "mitigated" && (
          <div className="rounded-xl border border-emerald-400/25 bg-emerald-500/[0.03] p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-7 w-7 rounded-lg border border-emerald-400/30 bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <Zap size={14} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-emerald-400 font-semibold">
                    CLOSED LOOP COMPLETED • EXPERIENCE COMMITTED
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="text-[10px] font-mono text-white/40">
                    ID: {investigation.incident_id}
                  </span>
                </div>
                <div className="text-[13px] font-medium text-white/90 mt-0.5">
                  Human Decision Retained in Hindsight Bank
                </div>
                <p className="text-[11.5px] text-white/50 mt-0.5 leading-relaxed">
                  Operator mitigation approved. Resolution timeline and root cause synthesis have been stored in bank &apos;incident-response-agent&apos; to inform future incident investigations.
                </p>
              </div>
            </div>

            <div className="shrink-0 self-start sm:self-auto">
              <span className="rounded border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[9.5px] font-mono text-emerald-300">
                FUTURE RECALL READY
              </span>
            </div>
          </div>
        )}

        {/* Recalled Historical Experiences */}
        <div className="rounded-xl border border-white/[0.08] bg-[#07090e] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-4 mb-4">
            <div>
              <div className="flex items-center gap-1.5 text-[9.5px] font-mono uppercase tracking-[0.18em] text-white/35">
                <Search size={11} className="text-blue-400" />
                <span>HINDSIGHT QUERY RESULTS</span>
              </div>
              <h3 className="mt-1 text-[17px] font-semibold text-white">
                Historical Incident Memories
              </h3>
              <p className="mt-0.5 text-[12.5px] text-white/45">
                Precedents retrieved from institutional memory matching the current failure symptoms.
              </p>
            </div>

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-blue-400">
              <BrainCircuit size={16} />
            </div>
          </div>

          {memories.length > 0 ? (
            <div className="space-y-3">
              {memories.map((memory, index) => (
                <div
                  key={`${memory.text}-${index}`}
                  className="group relative rounded-lg border border-white/[0.06] bg-white/[0.015] p-4 transition-colors hover:border-blue-400/25 hover:bg-white/[0.02]"
                >
                  <span className="absolute left-0 top-2.5 bottom-2.5 w-[2px] rounded-r-full bg-blue-400/60 group-hover:bg-blue-400 transition-colors" />

                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.04] pb-2.5 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-medium text-blue-300">
                        MEMORY {String(index + 1).padStart(2, "0")}
                      </span>

                      {memory.type && (
                        <span className="rounded border border-white/[0.07] bg-white/[0.02] px-1.5 py-0.2 text-[8.5px] font-mono uppercase text-white/45">
                          {memory.type}
                        </span>
                      )}
                    </div>

                    <span className="text-[9px] font-mono text-emerald-400/80">
                      CONFIRMED MATCH
                    </span>
                  </div>

                  <p className="text-[13px] leading-relaxed text-white/75 font-sans">
                    {memory.text || "No memory text content recorded."}
                  </p>
                </div>
              ))}
            </div>
          ) : investigation ? (
            <div className="rounded-lg border border-dashed border-amber-400/20 bg-amber-400/[0.02] px-6 py-8 text-center">
              <BrainCircuit size={28} className="mx-auto text-amber-300/40" />
              <div className="mt-2 text-[14px] font-medium text-amber-200">
                0 Precedents Recalled for this Signature
              </div>
              <p className="mx-auto mt-1 max-w-md text-[12.5px] leading-relaxed text-white/45">
                Hindsight memory search returned zero prior matches for this specific failure pattern. Groq AI reasoned directly from live incident telemetry without historical precedent.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-white/[0.08] bg-white/[0.005] px-6 py-10 text-center">
              <BrainCircuit size={28} className="mx-auto text-white/20" />
              <div className="mt-2 text-[14px] font-medium text-white/60">
                No investigation memory loaded yet
              </div>
              <p className="mx-auto mt-1 max-w-md text-[12.5px] leading-relaxed text-white/35">
                Trigger an investigation from the Overview or Incidents page to populate Hindsight&apos;s recalled experiences.
              </p>
              <div className="mt-4">
                <Link
                  href="/overview"
                  className="inline-flex items-center gap-2 rounded-lg border border-blue-400/30 bg-blue-500/10 px-3.5 py-2 text-[11.5px] font-medium text-blue-200 hover:bg-blue-500/20 transition-colors"
                >
                  <Sparkles size={12} />
                  <span>Go to Overview & Investigate</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Memory-Informed Reasoning Bridge */}
        {investigation?.analysis && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Memory Evidence */}
            <div className="rounded-xl border border-white/[0.08] bg-[#07090e] p-5">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5 mb-3">
                <span className="text-[9.5px] font-mono uppercase tracking-[0.18em] text-white/35">
                  MEMORY SYNTHESIS
                </span>
                <span className="text-[9px] font-mono text-blue-300">EVIDENCE</span>
              </div>

              <div className="flex gap-3">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                <div>
                  <div className="text-[11px] font-mono text-white/40 uppercase">
                    Incident Assessment
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-white/80">
                    {investigation.analysis.summary}
                  </p>
                </div>
              </div>

              {investigation.analysis.probable_root_cause && (
                <div className="mt-3 border-t border-white/[0.05] pt-3">
                  <div className="text-[10px] font-mono text-amber-300/80 uppercase">
                    Identified Root Cause
                  </div>
                  <p className="mt-0.5 text-[12.5px] leading-relaxed text-amber-100/85">
                    {investigation.analysis.probable_root_cause}
                  </p>
                </div>
              )}
            </div>

            {/* Operator Recommendation */}
            <div className="rounded-xl border border-blue-400/20 bg-blue-500/[0.02] p-5">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5 mb-3">
                <span className="text-[9.5px] font-mono uppercase tracking-[0.18em] text-blue-300/80">
                  AGENT DIRECTIVE
                </span>
                <span className="text-[9px] font-mono text-emerald-400">ACTIONABLE</span>
              </div>

              <div>
                <div className="text-[11px] font-mono text-white/40 uppercase">
                  Recommended Immediate Action
                </div>
                <p className="mt-1.5 text-[13.5px] font-medium leading-relaxed text-blue-100">
                  {investigation.analysis.recommended_action}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-2.5 text-[9.5px] font-mono text-white/35">
                <span>Confidence: {investigation.analysis.confidence ?? "high"}</span>
                <span>Outcome retained for future recall</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </HindsightShell>
  );
}
