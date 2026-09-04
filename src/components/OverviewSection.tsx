import React from 'react';
import { Trip, Booking, Expense, Payment, ParticipantNetBalance, SimplifiedDebt, RefundEvent, Vendor, Anomaly } from '@/lib/types';
import { calculateVariance, computeReconciliationAudit } from '@/lib/ledger-engine';
import { TrendingUp, TrendingDown, DollarSign, PieChart, ShieldCheck, ArrowRight, Plus, Sparkles, Flame, Sun, Trophy, Compass, QrCode, Copy, Key, Crown, Building2, Zap, FileSpreadsheet, Users, BedDouble, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { SpendDonutChart } from './SpendDonutChart';
import { ParticipantBarChart } from './ParticipantBarChart';
import { TripVibeGauge } from './TripVibeGauge';
import { ReconciliationAuditCard } from './ReconciliationAuditCard';
import { AnomalyFeedBanner } from './AnomalyFeedBanner';

interface OverviewSectionProps {
  trip: Trip;
  bookings: Booking[];
  expenses: Expense[];
  payments?: Payment[];
  netBalances: ParticipantNetBalance[];
  simplifiedDebts: SimplifiedDebt[];
  refunds?: RefundEvent[];
  vendors?: Vendor[];
  anomalies?: Anomaly[];
  currentUserId: string;
  onOpenAddExpense: () => void;
  onOpenAddBooking: () => void;
  onOpenUpiSetup: () => void;
  onOpenVendors?: () => void;
  onNavigateTab: (tab: any) => void;
  onDismissAnomaly?: (id: string) => void;
  onOpenExplainBalance?: (participantId: string) => void;
  onOpenWhatIf?: () => void;
  onOpenChaosDemo?: () => void;
  onOpenRoomOptimizer?: () => void;
  onOpenSettlementReport?: () => void;
  onOpenSquadManager?: () => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  trip,
  bookings,
  expenses,
  payments = [],
  netBalances,
  simplifiedDebts,
  refunds = [],
  vendors = [],
  anomalies = [],
  currentUserId,
  onOpenAddExpense,
  onOpenAddBooking,
  onOpenUpiSetup,
  onOpenVendors,
  onNavigateTab,
  onDismissAnomaly,
  onOpenExplainBalance,
  onOpenWhatIf,
  onOpenChaosDemo,
  onOpenRoomOptimizer,
  onOpenSettlementReport,
  onOpenSquadManager,
}) => {
  const variance = calculateVariance(bookings, expenses);
  const totalSpend = variance.totalActual;
  const budget = trip.budgetCeiling;
  const budgetPercentage = Math.min(100, Math.round((totalSpend / budget) * 100));

  const currentUser = netBalances.find((b) => b.participant.id === currentUserId)?.participant;
  const organizer = netBalances.find((b) => b.participant.isOrganizer || b.participant.id === trip.organizerId)?.participant;

  const participants = netBalances.map((b) => b.participant);
  const audit = computeReconciliationAudit(participants, expenses, payments, refunds);

  const settlementPercent = 85;
  const cushionPercent = 18;

  // Time aware greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(trip.inviteCode || 'GOA2026');
    alert(`Copied Trip Invite Code: ${trip.inviteCode || 'GOA2026'}`);
  };

  return (
    <div className="space-y-6">
      {/* Ambient Scenic Glassmorphism Hero Header */}
      <div className="relative rounded-3xl overflow-hidden shadow-paper border border-surface-hairline">
        {/* Background Scenic Wallpaper Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 filter brightness-95"
          style={{ backgroundImage: "url('/images/goa_bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-base/90 via-surface-base/80 to-surface-base/60 backdrop-blur-sm" />

        {/* Glassmorphism Foreground Banner Content */}
        <div className="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
          <div className="space-y-2.5 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-gold bg-brand-gold/20 px-3 py-1 rounded-full border border-brand-gold/40 flex items-center gap-1 backdrop-blur-md">
                <Sun className="w-3.5 h-3.5 inline text-brand-gold" /> {trip.destination}
              </span>

              <button
                onClick={handleCopyInviteCode}
                className="text-xs font-bold px-3 py-1 rounded-full bg-brand-indigo/20 text-brand-indigo border border-brand-indigo/40 hover:bg-brand-indigo hover:text-surface-base transition-all flex items-center gap-1.5 backdrop-blur-md"
                title="Share 6-Character Trip Invite Code"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Invite Code: <strong className="font-numeric">{trip.inviteCode || 'GOA2026'}</strong></span>
                <Copy className="w-3 h-3" />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-ink-primary">
              {greeting}, {currentUser?.name.split(' ')[0] || 'Traveler'}! 🌅
            </h1>

            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-medium">
              Welcome to <strong className="text-ink-primary">{trip.title}</strong>. Created by{' '}
              <span className="font-bold text-ink-primary inline-flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-brand-gold inline" /> {organizer?.name || 'Organizer'}
              </span>
              . Share code <code className="text-brand-coral font-bold font-numeric px-1 py-0.5 rounded bg-brand-coral/10">{trip.inviteCode || 'GOA2026'}</code> with travelers to join!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenChaosDemo && (
              <button
                onClick={onOpenChaosDemo}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-coral to-amber-500 hover:brightness-110 text-surface-base text-xs font-bold transition shadow-coral flex items-center gap-2 animate-pulse"
                title="Run live chaos dynamic recalculation demo"
              >
                <Zap className="w-4 h-4 fill-current stroke-[2]" />
                <span>Chaos Demo Mode</span>
              </button>
            )}

            {onOpenWhatIf && (
              <button
                onClick={onOpenWhatIf}
                className="px-4 py-2.5 rounded-xl bg-brand-gold/15 hover:bg-brand-gold/25 border border-brand-gold/30 text-brand-gold text-xs font-bold transition backdrop-blur-md flex items-center gap-1.5"
                title="Speculative Dry-Run Simulator"
              >
                <Compass className="w-4 h-4" />
                <span>What-If Simulator</span>
              </button>
            )}

            {onOpenRoomOptimizer && (
              <button
                onClick={onOpenRoomOptimizer}
                className="px-3.5 py-2.5 rounded-xl bg-surface-raised/90 hover:bg-surface-raised border border-surface-hairline text-ink-primary text-xs font-bold transition backdrop-blur-md flex items-center gap-1.5"
                title="Optimize lodging room allocation"
              >
                <BedDouble className="w-4 h-4 text-brand-gold" />
                <span>Rooms</span>
              </button>
            )}

            {onOpenSettlementReport && (
              <button
                onClick={onOpenSettlementReport}
                className="px-3.5 py-2.5 rounded-xl bg-surface-raised/90 hover:bg-surface-raised border border-surface-hairline text-ink-primary text-xs font-bold transition backdrop-blur-md flex items-center gap-1.5"
                title="Printable Read-Only Settlement Report"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Report</span>
              </button>
            )}

            {onOpenVendors && (
              <button
                onClick={onOpenVendors}
                className="px-3.5 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold transition backdrop-blur-md flex items-center gap-1.5"
              >
                <Building2 className="w-4 h-4 text-purple-400" />
                <span>Vendors ({vendors.length})</span>
              </button>
            )}

            <button
              onClick={onOpenUpiSetup}
              className="px-3.5 py-2.5 rounded-xl bg-surface-raised/90 hover:bg-surface-raised border border-surface-hairline text-ink-primary text-xs font-bold transition backdrop-blur-md flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4 text-brand-coral" />
              <span>My UPI</span>
            </button>

            <button
              onClick={onOpenAddBooking}
              className="px-3.5 py-2.5 rounded-xl bg-surface-raised/90 hover:bg-surface-raised border border-surface-hairline text-ink-primary text-xs font-bold transition backdrop-blur-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-brand-gold" />
              <span>Booking</span>
            </button>

            <button
              onClick={onOpenAddExpense}
              className="px-4 py-2.5 rounded-xl bg-brand-coral hover:bg-brand-coralDim text-surface-base text-xs font-bold transition shadow-coral flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Log Expense</span>
            </button>
          </div>
        </div>
      </div>

      {/* Deterministic Anomaly Conflict Feed Banner (F6) */}
      {anomalies.length > 0 && onDismissAnomaly && (
        <AnomalyFeedBanner anomalies={anomalies} onDismissAnomaly={onDismissAnomaly} />
      )}

      {/* Live Financial Reconciliation Audit Card (F1) */}
      <ReconciliationAuditCard audit={audit} />

      {/* Bento Grid Visual Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Bento Card 1: Interactive Spend Donut Chart (7 cols) */}
        <motion.div
          whileHover={{ y: -3, scale: 1.005 }}
          className="md:col-span-7 bg-surface-raised p-6 rounded-3xl border border-surface-hairline shadow-paper space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-display font-bold text-lg text-ink-primary flex items-center gap-2">
                <PieChart className="w-5 h-5 text-brand-coral" /> Category Spend Breakdown
              </h3>
              <p className="text-xs text-ink-secondary">
                Proportional actual spend across Lodging, Transport, Activities & Dining (₹ INR).
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('expenses')}
              className="text-xs font-bold text-brand-coral hover:underline flex items-center gap-1"
            >
              View Feed <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <SpendDonutChart categoryStats={variance.byCategory} totalActual={totalSpend} />
        </motion.div>

        {/* Bento Card 2: Trip Vibe & Health Dial Gauge (5 cols) */}
        <motion.div
          whileHover={{ y: -3, scale: 1.005 }}
          className="md:col-span-5 bg-surface-raised p-6 rounded-3xl border border-surface-hairline shadow-paper flex flex-col justify-between"
        >
          <div className="flex items-center justify-between border-b border-surface-hairline/60 pb-3">
            <h3 className="font-serif-display font-bold text-base text-ink-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-gold" /> Trip Vibe & Health Meter
            </h3>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-ledger-surplusBg text-ledger-surplus">
              Live
            </span>
          </div>

          <TripVibeGauge
            settlementPercent={settlementPercent}
            budgetCushionPercent={cushionPercent}
            confirmedEventsCount={bookings.length}
          />
        </motion.div>

        {/* Bento Card 3: Participant Contribution Dual Bar Chart (7 cols) */}
        <motion.div
          whileHover={{ y: -3, scale: 1.005 }}
          className="md:col-span-7 bg-surface-raised p-6 rounded-3xl border border-surface-hairline shadow-paper space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-display font-bold text-lg text-ink-primary flex items-center gap-2">
                <Trophy className="w-5 h-5 text-brand-gold" /> Traveler Contribution Visualizer
              </h3>
              <p className="text-xs text-ink-secondary">
                Fronted funds (Green) vs. Fair share owed (Coral) for all travelers (₹ INR).
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('participants')}
              className="text-xs font-bold text-brand-coral hover:underline"
            >
              Manage Roster
            </button>
          </div>

          <ParticipantBarChart netBalances={netBalances} />
        </motion.div>

        {/* Bento Card 4: Debt Netting Engine Summary (5 cols) */}
        <motion.div
          whileHover={{ y: -3, scale: 1.005 }}
          className="md:col-span-5 bg-surface-raised p-6 rounded-3xl border border-surface-hairline shadow-paper space-y-4 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink-muted uppercase tracking-wider">Debt Compression</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-brand-gold/15 text-brand-gold">
                Greedy Netting
              </span>
            </div>

            <div>
              <div className="text-3xl font-numeric font-bold text-brand-coral">
                {simplifiedDebts.length} Transactions
              </div>
              <p className="text-xs text-ink-secondary mt-1">
                Compressed from raw debts down to {simplifiedDebts.length} instant UPI paths.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-surface-base border border-surface-hairline space-y-2 text-xs">
              <div className="flex items-center justify-between text-ink-muted">
                <span>Budget Ceiling:</span>
                <span className="font-numeric font-bold text-ink-primary">₹{budget.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-ink-muted">
                <span>Total Spent:</span>
                <span className="font-numeric font-bold text-brand-coral">₹{totalSpend.toLocaleString('en-IN')}</span>
              </div>
              <div className="h-1.5 w-full bg-surface-overlay rounded-full overflow-hidden">
                <div className="h-full bg-brand-coral" style={{ width: `${budgetPercentage}%` }} />
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('settlement')}
            className="w-full py-3 rounded-xl bg-brand-coral hover:bg-brand-coralDim text-surface-base text-xs font-bold shadow-coral flex items-center justify-center gap-2 transition-all"
          >
            <span>Open Settlement Graph</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* Target-Budget Guardrails & Category Variance Watcher (F9) */}
      <div className="bg-surface-raised p-6 rounded-3xl border border-surface-hairline shadow-paper space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-hairline/60 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-display font-bold text-base text-ink-primary flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-brand-gold" /> Reverse Budget Guardrails & Target Ratios
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold font-bold uppercase">
                Advisory Ceilings
              </span>
            </div>
            <p className="text-xs text-ink-secondary mt-0.5">
              Target spending heuristic (40% Lodging · 25% Transport · 20% Activities · 15% Food). Pulses warning when variance crosses ±15%.
            </p>
          </div>

          {onOpenExplainBalance && (
            <button
              onClick={() => onOpenExplainBalance(currentUserId)}
              className="px-4 py-2 rounded-xl bg-surface-base hover:bg-surface-overlay border border-brand-coral/40 text-brand-coral text-xs font-bold transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explain My Balance</span>
            </button>
          )}
        </div>

        {/* Category Budget Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { cat: 'lodging', label: 'Lodging & Stays', ratio: 0.4, color: 'text-purple-400' },
            { cat: 'transport', label: 'Transit & Flights', ratio: 0.25, color: 'text-blue-400' },
            { cat: 'activity', label: 'Activities & Tours', ratio: 0.2, color: 'text-brand-coral' },
            { cat: 'food', label: 'Dining & Provisions', ratio: 0.15, color: 'text-emerald-400' },
          ].map((item) => {
            const targetBudget = budget * item.ratio;
            const actualSpend = variance.byCategory[item.cat]?.actual || 0;
            const pctUsed = targetBudget > 0 ? Math.round((actualSpend / targetBudget) * 100) : 0;
            const isBreached = actualSpend > targetBudget * 1.15;

            return (
              <div
                key={item.cat}
                className={`p-4 rounded-2xl border transition-all ${
                  isBreached
                    ? 'bg-red-500/10 border-red-500/40 ring-1 ring-red-500/30'
                    : 'bg-surface-base border-surface-hairline'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={`font-bold capitalize ${item.color}`}>{item.label}</span>
                  <span className="font-numeric font-bold text-ink-muted">{Math.round(item.ratio * 100)}% Target</span>
                </div>

                <div className="flex items-baseline justify-between mt-2">
                  <span className="font-numeric font-bold text-base text-ink-primary">
                    ₹{actualSpend.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-ink-muted">
                    of ₹{targetBudget.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </div>

                <div className="h-1.5 w-full bg-surface-overlay rounded-full overflow-hidden mt-3">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isBreached ? 'bg-red-400' : 'bg-brand-coral'
                    }`}
                    style={{ width: `${Math.min(100, pctUsed)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-ink-muted mt-2">
                  <span>{pctUsed}% allocated</span>
                  {isBreached && (
                    <span className="font-bold text-red-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> +15% Threshold Exceeded
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
