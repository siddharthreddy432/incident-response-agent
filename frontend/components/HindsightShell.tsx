"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertCircle,
  BarChart3,
  BrainCircuit,
  Database,
  Menu,
  Radio,
  Server,
  Sparkles,
  X,
} from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";

const navigation = [
  {
    href: "/overview",
    label: "Overview",
    description: "System view & signals",
    icon: Activity,
  },
  {
    href: "/incidents",
    label: "Incidents",
    description: "Live event registry",
    icon: AlertCircle,
  },
  {
    href: "/memory",
    label: "Memory",
    description: "Past experience & recall",
    icon: BrainCircuit,
  },
  {
    href: "/analytics",
    label: "Analytics",
    description: "Resolution telemetry",
    icon: BarChart3,
  },
];

export default function HindsightShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendHealth, setBackendHealth] = useState<{
    online: boolean;
    hindsight: boolean;
    groq: boolean;
  }>({
    online: true,
    hindsight: true,
    groq: true,
  });

  useEffect(() => {
    fetch("http://localhost:8000/health")
      .then((res) => {
        if (!res.ok) throw new Error("Health check failed");
        return res.json();
      })
      .then((data) => {
        setBackendHealth({
          online: data.status === "healthy",
          hindsight: data.hindsight === "connected",
          groq: data.groq === "connected",
        });
      })
      .catch(() => {
        setBackendHealth({
          online: false,
          hindsight: false,
          groq: false,
        });
      });
  }, []);

  const activeItem = navigation.find((item) => item.href === pathname);

  return (
    <div className="min-h-screen bg-[#06080d] text-[#f1f5f9] antialiased selection:bg-blue-500/25 selection:text-white">
      {/* Background Atmosphere - Technical, Restrained, Dark */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Subtle upper ambient intelligence glow */}
        <div className="absolute left-[12%] top-[-8%] h-[500px] w-[500px] rounded-full bg-blue-600/[0.025] blur-[150px]" />
        
        {/* Subtle lower depth glow */}
        <div className="absolute -bottom-20 right-[-4%] h-[420px] w-[420px] rounded-full bg-indigo-600/[0.018] blur-[140px]" />

        {/* Technical Coordinate Grid */}
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Slow Scan Line */}
        <div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"
          style={{
            animation: "hir-scan 10s ease-in-out infinite",
          }}
        />
      </div>

      {/* Desktop Sidebar (Fixed 272px) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] min-w-[272px] border-r border-white/[0.07] bg-[#07090e] md:flex md:flex-col">
        {/* Brand Area */}
        <div className="border-b border-white/[0.07] px-5 py-5">
          <Link href="/overview" className="group block focus:outline-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[21px] font-bold tracking-tight text-white transition-colors">
                  Hindsight<span className="text-blue-400">IR</span>
                </span>
                <span className="rounded border border-blue-400/20 bg-blue-400/10 px-1.5 py-0.5 text-[8.5px] font-mono uppercase tracking-wider text-blue-300">
                  AI
                </span>
              </div>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>

            <div className="mt-1.5 flex items-center gap-2">
              <span className="h-px w-4 bg-blue-400/50" />
              <span
                className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/35 font-mono"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Incident Intelligence
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation & Context Section */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          {/* Section: Main Workspace Navigation */}
          <div>
            <div className="mb-2 flex items-center justify-between px-2.5">
              <span
                className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30 font-mono"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Operations Workspace
              </span>
              <span
                className="text-[8.5px] font-mono text-white/20"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                v1.0
              </span>
            </div>

            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex h-[48px] w-full items-center gap-3 rounded-lg px-3 transition-all duration-150 ${
                      active
                        ? "border border-white/[0.08] bg-white/[0.05] text-white shadow-[0_2px_16px_rgba(0,0,0,0.3)]"
                        : "border border-transparent text-white/45 hover:bg-white/[0.025] hover:text-white/80"
                    }`}
                  >
                    {/* Active Accent Left Stripe */}
                    {active && (
                      <span className="absolute bottom-2 left-0 top-2 w-[2.5px] rounded-r-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.9)]" />
                    )}

                    {/* Icon */}
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors ${
                        active
                          ? "bg-blue-400/15 text-blue-300 border border-blue-400/25"
                          : "bg-white/[0.02] text-white/35 group-hover:text-white/60"
                      }`}
                    >
                      <Icon size={15} strokeWidth={1.75} />
                    </span>

                    {/* Label & Description */}
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium leading-none tracking-[-0.01em]">
                        {item.label}
                      </div>
                      <div
                        className={`mt-1 text-[8.5px] uppercase tracking-[0.14em] truncate ${
                          active ? "text-white/40" : "text-white/20 group-hover:text-white/30"
                        }`}
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {item.description}
                      </div>
                    </div>

                    {/* Active Dot */}
                    {active && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.9)]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Section: Live Agent Context (fills empty space with purposeful telemetry) */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
              <span
                className="text-[8.5px] font-semibold uppercase tracking-[0.2em] text-white/30 font-mono"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Runtime Context
              </span>
              <span className="text-[8px] font-mono text-emerald-400/80">ONLINE</span>
            </div>

            <div className="mt-2 space-y-2 text-[10px] font-mono">
              <div className="flex items-center justify-between">
                <span className="text-white/30">Memory Bank:</span>
                <span className="text-blue-300/80 font-medium truncate max-w-[130px]">
                  incident-response-agent
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/30">Reasoning LLM:</span>
                <span className="text-white/65">Groq / GPT-OSS 120B</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/30">Telemetry Stream:</span>
                <span className="text-white/65">api-gateway:v2.4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/30">Avg Resolution:</span>
                <span className="text-white/65">1.8s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Infrastructure Matrix */}
        <div className="mt-auto border-t border-white/[0.06] p-3.5">
          <div className="rounded-lg border border-white/[0.05] bg-white/[0.01] p-2.5">
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-[8.5px] font-medium uppercase tracking-[0.16em] text-white/30 font-mono"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Services Health
              </span>
              <span className={`text-[8px] font-mono ${backendHealth.online ? "text-emerald-400/80" : "text-amber-400"}`}>
                {backendHealth.online ? "3 / 3 CONNECTED" : "OFFLINE (PORT 8000)"}
              </span>
            </div>

            <div className="space-y-1.5">
              {[
                { name: "Hindsight", role: "Memory", ok: backendHealth.hindsight },
                { name: "Groq", role: "Reasoning", ok: backendHealth.groq },
                { name: "FastAPI", role: "Runtime", ok: backendHealth.online },
              ].map((svc) => (
                <div key={svc.name} className="flex items-center justify-between text-[9px] font-mono">
                  <span className="text-white/60">{svc.name}</span>
                  <div className="flex items-center gap-1.5 text-white/30">
                    <span>{svc.role}</span>
                    <span
                      className={`h-1 w-1 rounded-full ${
                        svc.ok ? "bg-emerald-400" : "bg-red-400"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between px-1 text-[8px] font-mono text-white/25">
            <span>AI Ops Console</span>
            <span>2026</span>
          </div>
        </div>
      </aside>

      {/* Mobile Top Navbar (md:hidden) */}
      <div className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-white/[0.08] bg-[#07090e]/90 px-4 backdrop-blur-xl md:hidden">
        <Link href="/overview" className="flex items-center gap-1.5">
          <span className="text-[19px] font-bold text-white tracking-tight">
            Hindsight<span className="text-blue-400">IR</span>
          </span>
          <span className="rounded border border-blue-400/20 bg-blue-400/10 px-1 py-0.2 text-[8px] font-mono uppercase text-blue-300">
            AI
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-2 py-0.5 text-[9px] font-mono text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ONLINE
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-white/70 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#07090e]/95 backdrop-blur-2xl md:hidden">
          <div className="flex h-14 items-center justify-between border-b border-white/[0.08] px-4">
            <div className="flex items-center gap-2">
              <span className="text-[20px] font-bold text-white tracking-tight">
                Hindsight<span className="text-blue-400">IR</span>
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-white/70"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3.5 rounded-xl border p-3.5 ${
                    active
                      ? "border-blue-400/30 bg-blue-500/[0.08] text-white"
                      : "border-transparent text-white/50 hover:bg-white/[0.03]"
                  }`}
                >
                  <Icon size={18} className={active ? "text-blue-400" : "text-white/40"} />
                  <div>
                    <div className="text-[14px] font-medium">{item.label}</div>
                    <div className="text-[9px] uppercase tracking-wider text-white/30 font-mono">
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <section className="relative z-10 min-h-screen md:ml-[272px]">
        {/* Top Header Utility Bar */}
        <header className="sticky top-0 z-30 flex h-[54px] items-center justify-between border-b border-white/[0.07] bg-[#06080d]/85 px-6 backdrop-blur-xl lg:px-8">
          {/* Breadcrumb Context */}
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider text-white/40">
            <span>HINDSIGHT // OPS</span>
            <span className="text-white/20">/</span>
            <span className="text-white/70 uppercase">{activeItem?.label ?? "OVERVIEW"}</span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="hidden sm:inline text-white/30">PROD-CLUSTER-01</span>
          </div>

          {/* Right Status Badges */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 rounded-md border border-white/[0.07] bg-white/[0.02] px-2.5 py-1 text-[9.5px] font-mono text-white/50">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>LIVE INGESTION</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 rounded-md border border-blue-400/20 bg-blue-400/[0.04] px-2.5 py-1 text-[9.5px] font-mono text-blue-300">
              <Database size={11} />
              <span>MEMORY SYNCED</span>
            </div>
          </div>
        </header>

        {/* Page Content Container with Consistent Proportional Spacing */}
        <div className="mx-auto max-w-[1440px] px-6 py-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </section>
    </div>
  );
}
