'use client';

import React, { useState } from 'react';
import {
  Compass,
  Wallet,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Calculator,
  Receipt,
  Layers,
  Sparkles,
  Users,
  QrCode,
  FileCheck,
  Lock,
  ChevronRight,
  Plus,
  Key,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LiquidLogo } from './LiquidLogo';
import { LiquidShaderGradient } from './LiquidShaderGradient';
import { SpotlightCard } from './SpotlightCard';
import { LiquidGlassButton } from './LiquidGlassButton';
import Earth from './ui/globe';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenCreateTrip: () => void;
  onOpenJoinTrip: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onOpenCreateTrip, onOpenJoinTrip }) => {
  const [sandboxNet, setSandboxNet] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-surface-base text-ink-primary font-sans antialiased selection:bg-emerald-500/20">
      {/* Editorial Navigation Header */}
      <header className="sticky top-0 z-50 bg-surface-base/85 backdrop-blur-md border-b border-surface-hairline px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LiquidLogo size={36} />
            <div>
              <span className="font-sans font-bold text-lg tracking-tight text-ink-primary">
                FareShare
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-ink-muted block">
                Group Trip Ledger Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <LiquidGlassButton
              variant="subtle"
              size="sm"
              onClick={onOpenJoinTrip}
              icon={<Key className="w-3.5 h-3.5 text-ink-muted" />}
              className="hidden sm:inline-flex"
            >
              Join Trip
            </LiquidGlassButton>

            <LiquidGlassButton
              variant="primary"
              size="sm"
              onClick={onEnterApp}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Open Dashboard
            </LiquidGlassButton>
          </div>
        </div>
      </header>

      {/* Hero Section with Full-Width Liquid Glass Shader Canvas */}
      <section className="relative w-full overflow-hidden border-b border-surface-hairline/40">
        {/* Luminous Ambient Liquid Shader Gradient Layer - Full Bleed */}
        <div className="absolute inset-0 w-full h-full opacity-85 pointer-events-none">
          <LiquidShaderGradient />
        </div>

        <div className="relative z-10 px-6 pt-16 pb-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-surface-overlay/80 backdrop-blur-md border border-surface-hairline text-xs font-mono text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero-Sum Double-Entry Settlement</span>
              </div>

              <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-ink-primary leading-[1.12]">
                Group trip finances without the <span className="text-zinc-400">spreadsheets.</span>
              </h1>

              <p className="text-base sm:text-lg text-ink-secondary leading-relaxed max-w-2xl font-normal">
                Connect your itinerary with an immutable financial ledger. Invite squad members with a 6-character code (e.g. <code className="text-emerald-400 font-mono font-semibold bg-surface-overlay border border-surface-hairline px-2 py-0.5 rounded">GOA2026</code>), upload bill receipts, and compress group debts via greedy zero-sum graph netting.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <LiquidGlassButton
                  variant="primary"
                  size="md"
                  onClick={onOpenCreateTrip}
                  icon={<Plus className="w-4 h-4 stroke-[3]" />}
                >
                  Create Custom Trip
                </LiquidGlassButton>

                <LiquidGlassButton
                  variant="glass"
                  size="md"
                  onClick={onOpenJoinTrip}
                  icon={<Key className="w-4 h-4 text-ink-muted" />}
                >
                  Join with Invite Code
                </LiquidGlassButton>

                <LiquidGlassButton
                  variant="subtle"
                  size="md"
                  onClick={onEnterApp}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Open Dashboard
                </LiquidGlassButton>
              </div>

              {/* Quick Metrics Badge */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-surface-hairline/60 max-w-lg">
                <div>
                  <span className="font-numeric font-bold text-2xl text-ink-primary block">Net 0.00</span>
                  <span className="text-xs text-ink-muted font-mono">Zero-Sum Audit</span>
                </div>
                <div>
                  <span className="font-numeric font-bold text-2xl text-emerald-400 block">Minimal Paths</span>
                  <span className="text-xs text-ink-muted font-mono">Debt Compression</span>
                </div>
                <div>
                  <span className="font-numeric font-bold text-2xl text-ink-primary block">₹ INR UPI</span>
                  <span className="text-xs text-ink-muted font-mono">Instant QR Settle</span>
                </div>
              </div>
            </div>

            {/* 3D Earth Globe with Curated Background */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="w-full max-w-[480px] p-6 rounded-3xl border border-neutral-800/80 bg-[#06080e]/75 backdrop-blur-xl relative overflow-hidden shadow-2xl flex items-center justify-center">
                {/* Dot Grid Matrix Background */}
                <div className="absolute inset-0 z-0 w-full h-full bg-[radial-gradient(#10b98130_1px,transparent_1px)] [background-size:22px_22px] pointer-events-none opacity-80" />

                {/* Ambient Emerald Halo Glow */}
                <div className="absolute inset-0 m-auto w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

                {/* Concentric Subtle Orbit Ring */}
                <div className="absolute inset-0 m-auto w-80 h-80 rounded-full border border-emerald-500/15 pointer-events-none" />

                <div className="relative z-10 w-full flex items-center justify-center">
                  <Earth />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Debt Netting Sandbox */}
      <section id="sandbox" className="bg-surface-raised py-16 border-y border-surface-hairline">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-emerald-400">Algorithm Sandbox</span>
            <h2 className="font-sans font-bold text-2xl sm:text-3xl text-ink-primary tracking-tight">
              Minimal Zero-Sum Debt Simplification
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary max-w-xl mx-auto">
              Instead of everyone exchanging small amounts back and forth, greedy graph netting calculates the exact minimal UPI transfers needed.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-overlay/40 border border-surface-hairline space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-mono text-ink-muted">
                Current Topology: {sandboxNet ? 'Compressed (3 Net Transfers)' : 'Raw Tangled (6 Pairwise Debts)'}
              </span>

              <button
                onClick={() => setSandboxNet(!sandboxNet)}
                className="px-3.5 py-1.5 rounded-lg bg-surface-raised hover:bg-surface-overlay border border-surface-hairline text-xs font-medium text-ink-primary flex items-center gap-2 transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{sandboxNet ? 'Show Raw Pairwise Debts' : 'Execute Greedy Netting'}</span>
              </button>
            </div>

            {/* Visual Comparison Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(sandboxNet
                ? [
                    { from: 'Priya Patel', to: 'Rohan Sharma', amount: '₹4,850.00' },
                    { from: 'Vikram Mehta', to: 'Rohan Sharma', amount: '₹9,650.00' },
                    { from: 'Arjun Nair', to: 'Sneha Rao', amount: '₹3,200.00' },
                  ]
                : [
                    { from: 'Priya Patel', to: 'Rohan Sharma', amount: '₹3,200.00' },
                    { from: 'Vikram Mehta', to: 'Rohan Sharma', amount: '₹6,400.00' },
                    { from: 'Priya Patel', to: 'Arjun Nair', amount: '₹1,650.00' },
                    { from: 'Vikram Mehta', to: 'Arjun Nair', amount: '₹3,250.00' },
                    { from: 'Sneha Rao', to: 'Rohan Sharma', amount: '₹4,900.00' },
                    { from: 'Arjun Nair', to: 'Sneha Rao', amount: '₹8,100.00' },
                  ]
              ).map((debt, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-surface-raised border border-surface-hairline text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-rose-400">{debt.from}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-ink-muted" />
                    <span className="font-medium text-emerald-400">{debt.to}</span>
                  </div>
                  <span className="font-numeric font-bold text-sm text-ink-primary block pt-1">
                    {debt.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-mono tracking-widest text-ink-muted">Core Capabilities</span>
          <h2 className="font-sans font-bold text-2xl sm:text-3xl text-ink-primary tracking-tight">
            Engineered for Flawless Group Accountability
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Calculator,
              title: '5 Dynamic Split Primitives',
              desc: 'Choose from Equal, Weighted per night, Line-Item, Room-Tier (Suite vs Standard), or Organizer Subsidy.',
            },
            {
              icon: FileCheck,
              title: 'Bill & Receipt Spending Proofs',
              desc: 'Upload high-resolution bill receipts or PDFs directly to any expense. Verify spending before settling.',
            },
            {
              icon: QrCode,
              title: 'Instant UPI Settle QR Codes',
              desc: 'Generate instant Google Pay / PhonePe / Paytm QR codes directly on settlement cards in Indian Rupees (₹).',
            },
            {
              icon: Compass,
              title: 'Master Itinerary Swimlanes',
              desc: 'Day-by-day connected timeline with participant visual encoding—opt out of activities without getting charged.',
            },
            {
              icon: ShieldCheck,
              title: 'Event-Sourced Audit Log',
              desc: 'Immutable append-only event stream ensuring 100% deterministic math.',
            },
            {
              icon: Wallet,
              title: 'Persistent Balance Pill',
              desc: 'Always know your exact net position (Surplus green / Deficit red / Settled) from any view in the app.',
            },
          ].map((f, idx) => {
            const Icon = f.icon;
            return (
              <SpotlightCard
                key={idx}
                className="p-6 space-y-3 shadow-paper hover:border-zinc-500/50 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-surface-overlay flex items-center justify-center text-ink-primary border border-surface-hairline">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-sans font-bold text-base text-ink-primary">{f.title}</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">{f.desc}</p>
              </SpotlightCard>
            );
          })}
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="bg-surface-raised border-t border-surface-hairline py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="font-sans font-bold text-3xl text-ink-primary tracking-tight">
            Ready to plan your next squad trip?
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary">
            Initialize your custom trip or join an existing trip via 6-digit code.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <LiquidGlassButton
              variant="primary"
              size="lg"
              onClick={onOpenCreateTrip}
              icon={<Plus className="w-4 h-4 stroke-[3]" />}
            >
              Create Custom Trip
            </LiquidGlassButton>
            <LiquidGlassButton
              variant="glass"
              size="lg"
              onClick={onOpenJoinTrip}
              icon={<Key className="w-4 h-4 text-ink-muted" />}
            >
              Join with Invite Code
            </LiquidGlassButton>
          </div>
        </div>
      </section>

      {/* Brand Footer */}
      <footer className="border-t border-surface-hairline py-8 px-6 bg-surface-base">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LiquidLogo size={32} />
            <div>
              <span className="font-bold text-sm text-ink-primary block leading-tight">FareShare</span>
              <span className="text-[10px] text-ink-muted uppercase tracking-wider block font-mono">Group Trip Ledger Platform</span>
            </div>
          </div>
          <p className="text-xs text-ink-muted">
            © 2026 FareShare. Deterministic Double-Entry Group Ledger Engine.
          </p>
        </div>
      </footer>
    </div>
  );
};
