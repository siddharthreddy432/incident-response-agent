"use client";

import { useState, useEffect } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Search,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";
import HindsightShell from "../../components/HindsightShell";

const incidents = [
  {
    id: "INC-8F21A4",
    title: "Production API 5xx spike after deployment",
    service: "api-gateway",
    severity: "CRITICAL",
    time: "4 min ago",
    status: "Investigating",
    active: true,
  },
  {
    id: "INC-91D3C2",
    title: "Database connection pool exhaustion",
    service: "postgres-primary",
    severity: "HIGH",
    time: "2h ago",
    status: "Resolved",
    active: false,
  },
  {
    id: "INC-72B9E1",
    title: "Authentication latency increase",
    service: "auth-service",
    severity: "MEDIUM",
    time: "5h ago",
    status: "Resolved",
    active: false,
  },
  {
    id: "INC-4AC821",
    title: "Payment webhook delivery failures",
    service: "payments",
    severity: "HIGH",
    time: "Yesterday",
    status: "Resolved",
    active: false,
  },
];

type InvestigationData = {
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
    confidence?: string;
    memory_used?: boolean;
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

export default function IncidentsPage() {
  const [query, setQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(false);
  const [investigation, setInvestigation] = useState<InvestigationData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("hindsight:last-investigation");
    if (saved) {
      try {
        setInvestigation(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const filtered = incidents.filter((incident) => {
    const matchesQuery = `${incident.id} ${incident.title} ${incident.service} ${incident.severity} ${incident.status}`
      .toLowerCase()
      .includes(query.toLowerCase());

    const matchesSeverity =
      severityFilter === "ALL" || incident.severity === severityFilter;

    return matchesQuery && matchesSeverity;
  });

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
      data.latency_ms = Math.round(performance.now() - t0);
      data.timestamp = new Date().toISOString();
      data.status = "analyzed";
      setInvestigation(data);
      localStorage.setItem(
        "hindsight:last-investigation",
        JSON.stringify(data)
      );
    } catch {
      setInvestigation({
        incident_id: "INC-8F21A4",
        status: "analyzed",
        analysis: {
          summary: "Backend service unreachable on port 8000.",
          probable_root_cause:
            "FastAPI investigation endpoint did not return a response.",
          recommended_action:
            "Ensure the FastAPI backend is running and re-trigger investigation.",
          confidence: "low",
          memory_used: false,
        },
      });
    } finally {
      setLoading(false);
    }
  }

  function approveMitigation() {
    if (!investigation) return;
    const updated: InvestigationData = {
      ...investigation,
      status: "mitigated",
      decision:
        "Mitigation approved by human operator. Rollback applied and pool limits expanded.",
      mitigated_at: new Date().toISOString(),
    };
    setInvestigation(updated);
    localStorage.setItem("hindsight:last-investigation", JSON.stringify(updated));
  }

  return (
    <HindsightShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.07] pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400">
                OPERATIONS REGISTRY
              </span>
              <span className="text-white/20">•</span>
              <span className="text-[10px] font-mono text-white/40">4 SIGNALS INDEXED</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Incident Registry
            </h1>
            <p className="mt-1 text-[13.5px] text-white/45 max-w-xl">
              Every production event becomes structured experience that the response agent can recall and reason over.
            </p>
          </div>

          <button
            onClick={investigate}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-blue-400/30 bg-blue-500/[0.12] px-4 py-2.5 text-[13px] font-medium text-blue-200 transition-all hover:border-blue-400/50 hover:bg-blue-500/[0.2] disabled:opacity-50 shrink-0 self-start sm:self-auto"
          >
            <Sparkles size={14} className="text-blue-300" />
            <span>{loading ? "Investigating..." : "Investigate Active Signal"}</span>
            <ArrowUpRight size={13} className="opacity-60" />
          </button>
        </div>

        {/* Unified Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Severity Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSeverityFilter(lvl)}
                className={`rounded-md px-3 py-1.5 text-[10.5px] font-mono tracking-wider transition-colors ${
                  severityFilter === lvl
                    ? "border border-blue-400/30 bg-blue-500/15 text-blue-200 font-medium"
                    : "border border-transparent text-white/40 hover:bg-white/[0.03] hover:text-white/70"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ID, title, service..."
              className="w-full rounded-lg border border-white/[0.08] bg-[#07090e] py-1.5 pl-8 pr-3 text-[12.5px] text-white/90 placeholder:text-white/25 outline-none transition-colors focus:border-blue-400/30"
            />
          </div>
        </div>

        {/* Incident Registry Table */}
        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#07090e]">
          {/* Table Header */}
          <div className="hidden grid-cols-[1.1fr_2.4fr_1.3fr_1fr_1fr_0.8fr] border-b border-white/[0.07] bg-white/[0.015] px-5 py-3 text-[9.5px] font-mono uppercase tracking-[0.16em] text-white/35 md:grid">
            <span>Incident ID</span>
            <span>Incident & Detected Time</span>
            <span>Service</span>
            <span>Severity</span>
            <span>Status</span>
            <span className="text-right">Action</span>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-white/[0.05]">
            {filtered.map((incident) => {
              const isCritical = incident.severity === "CRITICAL";
              const isHigh = incident.severity === "HIGH";

              // Dynamic state for active incident
              const currentStatus = incident.active && investigation
                ? investigation.status === "mitigated"
                  ? "Mitigated"
                  : "Action Ready"
                : incident.status;

              return (
                <div
                  key={incident.id}
                  className={`group relative grid gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.015] md:grid-cols-[1.1fr_2.4fr_1.3fr_1fr_1fr_0.8fr] md:items-center ${
                    incident.active ? "bg-blue-500/[0.015]" : ""
                  }`}
                >
                  {/* Active Indicator Pip */}
                  {incident.active && (
                    <span
                      className={`absolute bottom-2 left-0 top-2 w-[2px] rounded-r-full ${
                        investigation?.status === "mitigated"
                          ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                          : "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"
                      }`}
                    />
                  )}

                  {/* ID */}
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-mono font-medium text-white/70 group-hover:text-white/90">
                      {incident.active && investigation?.incident_id ? investigation.incident_id : incident.id}
                    </span>
                    {incident.active && (
                      <span
                        className={`rounded px-1 py-0.2 text-[8px] font-mono border ${
                          investigation?.status === "mitigated"
                            ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-300"
                            : "bg-blue-400/10 border-blue-400/20 text-blue-300"
                        }`}
                      >
                        {investigation?.status === "mitigated" ? "RESOLVED" : "ACTIVE"}
                      </span>
                    )}
                  </div>

                  {/* Title & Detected Time */}
                  <div>
                    <div className="text-[13px] font-medium text-white/85">
                      {incident.title}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-white/35 font-mono">
                      <Clock3 size={10} className="text-white/25" />
                      <span>{incident.active && investigation?.status === "mitigated" ? "Mitigated just now" : incident.time}</span>
                    </div>
                  </div>

                  {/* Service */}
                  <div>
                    <span className="inline-block rounded border border-white/[0.07] bg-white/[0.02] px-2 py-0.5 text-[10.5px] font-mono text-blue-300/80">
                      {incident.service}
                    </span>
                  </div>

                  {/* Severity */}
                  <div>
                    <div className="flex items-center gap-2 text-[11.5px] font-mono font-medium">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isCritical
                            ? "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]"
                            : isHigh
                            ? "bg-amber-400"
                            : "bg-yellow-400"
                        }`}
                      />
                      <span
                        className={
                          isCritical
                            ? "text-red-400"
                            : isHigh
                            ? "text-amber-300"
                            : "text-yellow-300"
                        }
                      >
                        {incident.severity}
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <div className="flex items-center gap-2 text-[11.5px] font-mono">
                      {currentStatus === "Investigating" ? (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                          <span className="text-blue-300">Investigating</span>
                        </>
                      ) : currentStatus === "Action Ready" ? (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                          <span className="text-amber-300 font-medium">Action Ready</span>
                        </>
                      ) : (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                          <span className="text-emerald-400/90 font-medium">Mitigated</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="md:text-right">
                    {incident.active ? (
                      <button
                        onClick={investigate}
                        disabled={loading}
                        className={`rounded border px-2.5 py-1 text-[10.5px] font-medium transition-colors inline-flex items-center gap-1 ${
                          investigation?.status === "mitigated"
                            ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20"
                            : investigation
                            ? "border-amber-400/30 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20"
                            : "border-blue-400/30 bg-blue-400/10 text-blue-200 hover:bg-blue-400/20"
                        }`}
                      >
                        <Zap size={10} />
                        <span>
                          {loading
                            ? "Running..."
                            : investigation?.status === "mitigated"
                            ? "Re-investigate"
                            : investigation
                            ? "Review Triage"
                            : "Triage"}
                        </span>
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono text-white/20">
                        Archived
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="px-5 py-12 text-center text-[13px] text-white/40">
              No incidents match your search query.
            </div>
          )}
        </div>

        {/* AI Investigation Debrief Panel */}
        {investigation && (
          <div className="rounded-xl border border-blue-400/25 bg-[#070b12] p-5 sm:p-6 hir-in space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} className="text-blue-400" />
                <h4 className="text-[16px] font-semibold text-white">
                  Active Investigation Report • {investigation.incident_id ?? "INC-8F21A4"}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-400/10 border border-blue-400/25 px-2 py-0.5 text-[9px] font-mono uppercase text-blue-300">
                  {investigation.analysis?.confidence ?? "high"} confidence
                </span>
                <span className="rounded bg-emerald-400/10 border border-emerald-400/25 px-2 py-0.5 text-[9px] font-mono uppercase text-emerald-300">
                  Memory Used: {investigation.analysis?.memory_used ? "YES" : "NO"}
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.015] p-3.5">
                <div className="text-[9px] font-mono uppercase tracking-wider text-white/35">
                  Assessment
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-white/75">
                  {investigation.analysis?.summary}
                </p>
              </div>

              <div className="rounded-lg border border-amber-400/20 bg-amber-400/[0.03] p-3.5">
                <div className="text-[9px] font-mono uppercase tracking-wider text-amber-300/80">
                  Probable Root Cause
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-amber-100/85">
                  {investigation.analysis?.probable_root_cause}
                </p>
              </div>

              <div className="rounded-lg border border-blue-400/20 bg-blue-400/[0.04] p-3.5">
                <div className="text-[9px] font-mono uppercase tracking-wider text-blue-300/80">
                  Recommended Action
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-blue-100 font-medium">
                  {investigation.analysis?.recommended_action}
                </p>
              </div>
            </div>

            {/* Human Decision Step */}
            {investigation.status !== "mitigated" ? (
              <div className="p-4 rounded-lg border border-blue-400/25 bg-blue-500/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-mono text-blue-300 uppercase tracking-wider font-semibold">
                    HUMAN DECISION REQUIRED
                  </div>
                  <div className="text-[13px] text-white/90 font-medium mt-0.5">
                    Authorize recommended mitigation for {investigation.incident_id ?? "INC-8F21A4"}?
                  </div>
                  <div className="text-[11px] text-white/40 mt-0.5">
                    Approving records operator decision, resolves active signal in registry, and commits outcome to Hindsight memory bank.
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
              <div className="p-3.5 rounded-lg border border-emerald-400/25 bg-emerald-500/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[12.5px] font-medium text-emerald-300">
                      Mitigation Approved & Retained in Hindsight
                    </div>
                    <div className="text-[11px] text-white/50 mt-0.5">
                      {investigation.decision ?? "Mitigation approved by human operator."} Verified outcome saved to bank &apos;incident-response-agent&apos; to inform future incident triage.
                    </div>
                  </div>
                </div>

                <span className="text-[9px] font-mono text-emerald-400 px-2.5 py-1 rounded bg-emerald-400/10 border border-emerald-400/20 shrink-0">
                  RESOLVED & INDEXED
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </HindsightShell>
  );
}
