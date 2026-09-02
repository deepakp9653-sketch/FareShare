'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Participant, ParticipantNetBalance, SimplifiedDebt } from '@/lib/types';
import { GitCommit, Sparkles, ArrowRight, CheckCircle2, QrCode, User, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { animate, stagger } from 'animejs';
import { UpiQrModal } from './UpiQrModal';

interface SettlementVisualizerProps {
  participants: Participant[];
  netBalances: ParticipantNetBalance[];
  simplifiedDebts: SimplifiedDebt[];
  currentUserId: string;
  onSettleDebt: (fromId: string, toId: string, amount: number) => void;
  isSettled: boolean;
}

export const SettlementVisualizer: React.FC<SettlementVisualizerProps> = ({
  participants,
  netBalances,
  simplifiedDebts,
  currentUserId,
  onSettleDebt,
  isSettled,
}) => {
  const [isSimplified, setIsSimplified] = useState<boolean>(true);
  const [filterPersonal, setFilterPersonal] = useState<boolean>(false);
  const [selectedUpiDebt, setSelectedUpiDebt] = useState<SimplifiedDebt | null>(null);

  const particlesRef = useRef<HTMLDivElement>(null);
  const graphContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSettled && particlesRef.current) {
      // Anime.js v4 timeline celebration animation
      animate(particlesRef.current.children, {
        translateY: [0, -140],
        translateX: () => (Math.random() - 0.5) * 160,
        opacity: [1, 0],
        scale: [1, 2.2],
        rotate: () => Math.random() * 360,
        delay: stagger(60),
        duration: 2000,
        ease: 'easeOutExpo',
      });
    }
  }, [isSettled]);

  const handleTriggerSimplify = () => {
    setIsSimplified((prev) => !prev);
    if (graphContainerRef.current) {
      const nodes = graphContainerRef.current.querySelectorAll('.debt-node');
      animate(nodes, {
        scale: [1, 1.15, 1],
        rotate: [0, 6, -6, 0],
        duration: 700,
        ease: 'easeInOutElastic(1, .5)',
        delay: stagger(70),
      });
    }
  };

  const displayedDebts = filterPersonal
    ? simplifiedDebts.filter((d) => d.fromId === currentUserId || d.toId === currentUserId)
    : simplifiedDebts;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-raised p-5 rounded-2xl border border-surface-hairline shadow-paper">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-serif-display font-bold text-ink-primary flex items-center gap-2">
              <GitCommit className="w-5 h-5 text-brand-coral" /> Ledger Settlement Visualizer
            </h2>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold font-bold uppercase tracking-wider">
              Anime.js & Motion Powered
            </span>
          </div>
          <p className="text-xs text-ink-secondary mt-0.5">
            Greedy $O(N \log N)$ Debt Simplification engine with dynamic UPI QR Code instant settlement.
          </p>
        </div>

        {/* Control Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterPersonal(!filterPersonal)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              filterPersonal
                ? 'bg-brand-gold text-surface-base border-brand-gold font-bold shadow-sm'
                : 'bg-surface-base text-ink-secondary border-surface-hairline hover:text-ink-primary'
            }`}
          >
            <User className="w-4 h-4" />
            {filterPersonal ? 'Showing My Debts' : 'Personal View Filter'}
          </button>

          <button
            onClick={handleTriggerSimplify}
            className="px-4 py-2.5 rounded-xl bg-brand-coral hover:bg-brand-coralDim text-surface-base text-xs sm:text-sm font-bold transition-all shadow-coral flex items-center gap-2"
          >
            <Zap className="w-4 h-4 stroke-[3]" />
            {isSimplified ? 'View Raw Debts' : 'Simplify Debts (Min N-1)'}
          </button>
        </div>
      </div>

      {/* Main Interactive Debt Graph Container */}
      <div
        ref={graphContainerRef}
        className="relative bg-surface-raised border border-surface-hairline p-6 rounded-3xl space-y-6 shadow-paper overflow-hidden min-h-[420px] flex flex-col justify-between"
      >
        {/* Celebration Particles Overlay */}
        {isSettled && (
          <div
            ref={particlesRef}
            className="absolute inset-0 pointer-events-none flex items-center justify-center gap-6 overflow-hidden z-20"
          >
            {[...Array(16)].map((_, idx) => (
              <div
                key={idx}
                className="w-3.5 h-3.5 rounded-full bg-gradient-to-t from-brand-coral via-brand-gold to-ledger-surplus shadow-coral"
              />
            ))}
          </div>
        )}

        {/* Top Status Indicator */}
        <div className="flex items-center justify-between text-xs border-b border-surface-hairline/60 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-ledger-surplus animate-pulse" />
            <span className="font-semibold text-ink-primary">
              {isSimplified ? 'Compressed Graph (Greedy Netting Active)' : 'Raw Pairwise Debts Network'}
            </span>
          </div>

          <span className="font-numeric text-ink-muted text-xs">
            {simplifiedDebts.length} Optimal Transactions Remaining (₹ INR)
          </span>
        </div>

        {/* Circular Interactive Node Layout */}
        <div className="relative my-8 py-4 flex items-center justify-center">
          {/* Central Pulsing Anchor */}
          <div className="w-28 h-28 rounded-full bg-surface-base border border-surface-hairline flex flex-col items-center justify-center text-center p-2 shadow-inner z-10">
            <Sparkles className="w-5 h-5 text-brand-gold mb-1" />
            <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider">Settlement Hub</span>
            <span className="font-numeric font-bold text-xs text-brand-coral">
              ₹{netBalances.reduce((acc, n) => acc + (n.netBalance > 0 ? n.netBalance : 0), 0).toFixed(0)} Total
            </span>
          </div>

          {/* Participant Nodes Positioned in Ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            {netBalances.map((nb, idx) => {
              const totalNodes = netBalances.length;
              const angle = (idx / totalNodes) * 2 * Math.PI - Math.PI / 2;
              const radius = 140;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              const isUser = nb.participant.id === currentUserId;

              return (
                <motion.div
                  key={nb.participant.id}
                  layout
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                  className={`debt-node absolute p-3 rounded-2xl bg-surface-raised border flex items-center gap-2.5 shadow-paper transition-all ${
                    isUser
                      ? 'border-brand-coral ring-2 ring-brand-coral/30 z-20 scale-105'
                      : 'border-surface-hairline z-10'
                  }`}
                >
                  <img
                    src={nb.participant.avatarUrl}
                    alt={nb.participant.name}
                    className="w-9 h-9 rounded-full object-cover border border-surface-hairline"
                  />
                  <div>
                    <p className="text-xs font-bold text-ink-primary">{nb.participant.name}</p>
                    <span
                      className={`font-numeric text-[11px] font-bold ${
                        nb.netBalance > 0
                          ? 'text-ledger-surplus'
                          : nb.netBalance < 0
                          ? 'text-ledger-deficit'
                          : 'text-ledger-neutral'
                      }`}
                    >
                      {nb.netBalance > 0 ? `+₹${nb.netBalance.toFixed(2)}` : nb.netBalance < 0 ? `-₹${Math.abs(nb.netBalance).toFixed(2)}` : '₹0.00'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Action Cards: Minimal Settlement Execution Paths */}
        <div className="pt-4 border-t border-surface-hairline space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted flex items-center justify-between">
            <span>Simplified Settlement Execution Paths (₹ INR)</span>
            <span className="text-brand-gold font-numeric">Click "UPI Settle" for instant QR Code</span>
          </h4>

          {displayedDebts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {displayedDebts.map((debt, idx) => {
                const payee = participants.find((p) => p.id === debt.toId);
                const upiId = payee?.upiId || `${payee?.name.toLowerCase().replace(/\s+/g, '')}@upi`;

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-surface-base border border-surface-hairline flex items-center justify-between transition-all hover:border-brand-coral/50"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-ledger-deficit">{debt.fromName}</span>
                      <ArrowRight className="w-4 h-4 text-brand-gold" />
                      <span className="font-semibold text-ledger-surplus">{debt.toName}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-numeric font-bold text-sm text-ink-primary">
                        ₹{debt.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <button
                        onClick={() => setSelectedUpiDebt({ ...debt, payeeUpiId: upiId })}
                        className="px-3 py-1.5 rounded-xl bg-brand-coral text-surface-base hover:bg-brand-coralDim text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5" /> UPI Settle
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center bg-ledger-surplusBg/60 rounded-2xl border border-ledger-surplus/40 space-y-1">
              <CheckCircle2 className="w-8 h-8 text-ledger-surplus mx-auto" />
              <p className="font-serif-display font-bold text-base text-ledger-surplus">
                All Debts Fully Settled!
              </p>
              <p className="text-xs text-ink-secondary">
                The group ledger has reached zero net balance. No pending transactions.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* UPI QR Code Settlement Modal */}
      {selectedUpiDebt && (
        <UpiQrModal
          isOpen={!!selectedUpiDebt}
          onClose={() => setSelectedUpiDebt(null)}
          fromName={selectedUpiDebt.fromName}
          toName={selectedUpiDebt.toName}
          amount={selectedUpiDebt.amount}
          payeeUpiId={selectedUpiDebt.payeeUpiId || 'payee@upi'}
          onConfirmPayment={() => onSettleDebt(selectedUpiDebt.fromId, selectedUpiDebt.toId, selectedUpiDebt.amount)}
        />
      )}
    </div>
  );
};
