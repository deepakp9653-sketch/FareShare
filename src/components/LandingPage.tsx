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

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenCreateTrip: () => void;
  onOpenJoinTrip: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onOpenCreateTrip, onOpenJoinTrip }) => {
  const [sandboxNet, setSandboxNet] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-surface-base text-ink-primary font-sans antialiased selection:bg-brand-coral/20">
      {/* Editorial Navigation Header */}
      <header className="sticky top-0 z-50 bg-surface-base/90 backdrop-blur-md border-b border-surface-hairline px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-coral text-surface-base flex items-center justify-center shadow-coral">
              <Compass className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-serif-display font-bold text-xl tracking-tight text-ink-primary">
                GroupTrip Ledger
              </span>
              <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold block">
                Fintech Precision × Travel Warmth
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenJoinTrip}
              className="px-4 py-2 rounded-xl bg-surface-raised border border-surface-hairline text-ink-primary text-xs font-bold hover:bg-surface-overlay transition-all hidden sm:flex items-center gap-1.5"
            >
              <Key className="w-4 h-4 text-brand-indigo" />
              <span>Join Trip via Code</span>
            </button>

            <button
              onClick={onOpenCreateTrip}
              className="px-5 py-2.5 rounded-xl bg-brand-coral hover:bg-brand-coralDim text-surface-base text-xs font-bold transition-all shadow-coral flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Custom Trip</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-xs font-semibold text-brand-gold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Creator-First Trip Ledgers & 6-Character Invite Codes</span>
            </div>

            <h1 className="font-serif-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-ink-primary leading-[1.15]">
              Group Trip Finances Without the <span className="text-brand-coral italic">Spreadsheets.</span>
            </h1>

            <p className="text-base sm:text-lg text-ink-secondary leading-relaxed max-w-2xl font-normal">
              Connect your trip itinerary with an immutable financial ledger. You set up your own trip, invite travelers with a 6-character code (e.g., <code className="text-brand-coral font-bold font-numeric font-mono bg-brand-coral/10 px-1.5 py-0.5 rounded">GOA2026</code>), upload receipt proofs, and settle up via instant UPI.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onOpenCreateTrip}
                className="px-7 py-3.5 rounded-2xl bg-brand-coral hover:bg-brand-coralDim text-surface-base font-bold text-sm transition-all shadow-coral flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Create New Custom Trip</span>
              </button>

              <button
                onClick={onOpenJoinTrip}
                className="px-6 py-3.5 rounded-2xl bg-surface-raised border border-surface-hairline text-ink-primary font-semibold text-sm hover:bg-surface-overlay transition-all flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4 text-brand-indigo" />
                <span>Join Trip via Invite Code</span>
              </button>
            </div>

            {/* Quick Metrics Badge */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-surface-hairline/80 max-w-lg">
              <div>
                <span className="font-numeric font-bold text-2xl text-ink-primary block">100%</span>
                <span className="text-xs text-ink-secondary">Audit Synchronized</span>
              </div>
              <div>
                <span className="font-numeric font-bold text-2xl text-brand-coral block">O(N log N)</span>
                <span className="text-xs text-ink-secondary">Greedy Debt Netting</span>
              </div>
              <div>
                <span className="font-numeric font-bold text-2xl text-ledger-surplus block">₹ INR</span>
                <span className="text-xs text-ink-secondary">UPI Instant Settle</span>
              </div>
            </div>
          </div>

          {/* Interactive Hero Preview Card */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-surface-raised p-6 rounded-3xl border border-surface-hairline shadow-paper space-y-5"
            >
              <div className="flex items-center justify-between border-b border-surface-hairline pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-ledger-surplus animate-pulse" />
                  <span className="font-serif-display font-semibold text-sm text-ink-primary">
                    Goa Sunsets Demo (Code: GOA2026)
                  </span>
                </div>
                <span className="text-xs font-numeric px-2.5 py-1 rounded-full bg-ledger-surplusBg text-ledger-surplus font-bold">
                  Surplus +₹24,500.00
                </span>
              </div>

              {/* Sample Participant Net Balances */}
              <div className="space-y-2.5">
                {[
                  { name: 'Deepak V (Organizer)', amount: '+₹24,500.00', status: 'surplus' },
                  { name: 'Ananya Iyer', amount: '-₹8,771.67', status: 'deficit' },
                  { name: 'Priya Patel', amount: '-₹14,938.33', status: 'deficit' },
                ].map((row, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-surface-base border border-surface-hairline flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-ink-primary">{row.name}</span>
                    <span
                      className={`font-numeric font-bold px-2 py-0.5 rounded ${
                        row.status === 'surplus'
                          ? 'bg-ledger-surplusBg text-ledger-surplus'
                          : 'bg-ledger-deficitBg text-ledger-deficit'
                      }`}
                    >
                      {row.amount}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-brand-coral/10 border border-brand-coral/30 flex items-center justify-between text-xs">
                <span className="text-brand-coral font-semibold">Ready to start your own trip?</span>
                <button
                  onClick={onEnterApp}
                  className="px-3 py-1.5 rounded-xl bg-brand-coral text-surface-base font-bold shadow-sm flex items-center gap-1"
                >
                  <span>Enter App</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Debt Netting Sandbox (§4.3 UI/UX Spec) */}
      <section id="sandbox" className="bg-surface-raised py-16 border-y border-surface-hairline">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-brand-coral">Interactive Demo</span>
            <h2 className="font-serif-display font-bold text-3xl text-ink-primary">
              See How Debt Simplification Works
            </h2>
            <p className="text-sm text-ink-secondary max-w-xl mx-auto">
              Instead of everyone transferring small amounts back and forth, GroupTrip Ledger calculates the exact minimal transactions needed in Rupees (`₹`).
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-surface-base border border-surface-hairline space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                Current Debt Mode: {sandboxNet ? 'Compressed (3 Net Payments)' : 'Tangled Raw (12 Pairwise Debts)'}
              </span>

              <button
                onClick={() => setSandboxNet(!sandboxNet)}
                className="px-4 py-2 rounded-xl bg-brand-coral text-surface-base text-xs font-bold shadow-coral flex items-center gap-2 transition-all"
              >
                <Zap className="w-4 h-4" />
                <span>{sandboxNet ? 'Show Raw Tangled Debts' : 'Execute Debt Netting Algorithm'}</span>
              </button>
            </div>

            {/* Visual Comparison Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(sandboxNet
                ? [
                    { from: 'Priya Patel', to: 'Deepak V', amount: '₹14,938.33' },
                    { from: 'Ananya Iyer', to: 'Deepak V', amount: '₹8,771.67' },
                    { from: 'Diya Verma', to: 'Kabir Roy', amount: '₹11,416.65' },
                  ]
                : [
                    { from: 'Priya Patel', to: 'Deepak V', amount: '₹8,730.00' },
                    { from: 'Ananya Iyer', to: 'Deepak V', amount: '₹10,920.00' },
                    { from: 'Priya Patel', to: 'Kabir Roy', amount: '₹3,583.33' },
                    { from: 'Diya Verma', to: 'Deepak V', amount: '₹6,870.00' },
                    { from: 'Ananya Iyer', to: 'Kabir Roy', amount: '₹3,583.33' },
                    { from: 'Diya Verma', to: 'Kabir Roy', amount: '₹3,583.33' },
                  ]
              ).map((debt, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-surface-raised border border-surface-hairline text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ledger-deficit">{debt.from}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-brand-gold" />
                    <span className="font-semibold text-ledger-surplus">{debt.to}</span>
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
          <span className="text-xs uppercase font-bold tracking-widest text-brand-gold">Built For Travelers</span>
          <h2 className="font-serif-display font-bold text-3xl sm:text-4xl text-ink-primary">
            Everything You Need for Effortless Group Settlement
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              desc: 'Immutable append-only event stream stored on Neon PostgreSQL database ensuring 100% deterministic math.',
            },
            {
              icon: Wallet,
              title: 'Persistent Balance Pill',
              desc: 'Always know your exact net position (Surplus green / Deficit red / Settled) from any view in the app.',
            },
          ].map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-surface-raised border border-surface-hairline space-y-3 shadow-paper hover:border-brand-coral/40 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-surface-overlay flex items-center justify-center text-brand-coral">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif-display font-bold text-lg text-ink-primary">{f.title}</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="bg-surface-raised border-t border-surface-hairline py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="font-serif-display font-bold text-3xl sm:text-4xl text-ink-primary">
            Ready to Plan Your Next Group Trip?
          </h2>
          <p className="text-sm text-ink-secondary">
            Initialize your custom trip or join an existing trip via invite code.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenCreateTrip}
              className="px-8 py-4 rounded-2xl bg-brand-coral hover:bg-brand-coralDim text-surface-base font-bold text-base shadow-coral inline-flex items-center gap-3 transition-all"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>Create New Custom Trip</span>
            </button>
            <button
              onClick={onOpenJoinTrip}
              className="px-6 py-4 rounded-2xl bg-surface-base border border-surface-hairline text-ink-primary font-semibold text-base hover:bg-surface-overlay transition-all inline-flex items-center gap-2"
            >
              <Key className="w-4 h-4 text-brand-indigo" />
              <span>Join Trip via Code</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
