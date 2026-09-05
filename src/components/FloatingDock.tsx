'use client';

import React from 'react';
import { Plus, Receipt, QrCode, Zap, Sparkles, MessageSquareText } from 'lucide-react';
import { motion } from 'framer-motion';

interface FloatingDockProps {
  onOpenSplitDrawer: () => void;
  onOpenUpiSetup: () => void;
  onOpenChaosDemo?: () => void;
  onOpenChatExpense?: () => void;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  onOpenSplitDrawer,
  onOpenUpiSetup,
  onOpenChaosDemo,
  onOpenChatExpense,
}) => {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 p-2 rounded-2xl bg-surface-raised/90 backdrop-blur-md border border-surface-hairline shadow-2xl"
    >
      {onOpenChaosDemo && (
        <button
          onClick={onOpenChaosDemo}
          className="px-3.5 py-2 rounded-xl bg-surface-base border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 text-xs font-semibold shadow-subtle flex items-center gap-1.5 transition-all"
          title="Run 7-Step Chaos Sequence"
        >
          <Zap className="w-3.5 h-3.5 text-emerald-400 stroke-[2]" />
          <span className="hidden sm:inline">Chaos Demo</span>
        </button>
      )}

      {onOpenChatExpense && (
        <button
          onClick={onOpenChatExpense}
          className="px-3 py-2 rounded-xl bg-surface-base border border-surface-hairline hover:border-emerald-500/40 text-ink-primary hover:bg-surface-overlay text-xs font-semibold shadow-subtle flex items-center gap-1.5 transition-all"
          title="Capture Expense via Natural Chat or Receipt (F14 & F15)"
        >
          <MessageSquareText className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">AI Voice / Chat</span>
        </button>
      )}

      <button
        onClick={onOpenSplitDrawer}
        className="px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-semibold shadow-subtle flex items-center gap-1.5 transition-all"
        title="Log New Expense with Split Rules"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>+ Quick Expense</span>
      </button>

      <button
        onClick={onOpenUpiSetup}
        className="px-3 py-2 rounded-xl bg-surface-base border border-surface-hairline text-ink-primary hover:bg-surface-overlay transition-all text-xs font-medium flex items-center gap-1.5"
        title="My UPI ID & QR Code"
      >
        <QrCode className="w-3.5 h-3.5 text-ink-muted" />
        <span className="hidden md:inline">My UPI</span>
      </button>
    </motion.div>
  );
};
