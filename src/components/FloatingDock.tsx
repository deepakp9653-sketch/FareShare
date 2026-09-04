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
          className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-brand-coral to-amber-500 hover:brightness-110 text-surface-base text-xs font-bold shadow-coral flex items-center gap-1.5 transition-all animate-pulse"
          title="Run 7-Step Chaos Sequence"
        >
          <Zap className="w-4 h-4 fill-current stroke-[2]" />
          <span className="hidden sm:inline">Chaos Demo</span>
        </button>
      )}

      {onOpenChatExpense && (
        <button
          onClick={onOpenChatExpense}
          className="px-3 py-2.5 rounded-xl bg-surface-base border border-brand-coral/40 text-brand-coral hover:bg-brand-coral hover:text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
          title="Capture Expense via Natural Chat or Receipt (F14 & F15)"
        >
          <MessageSquareText className="w-4 h-4" />
          <span className="hidden sm:inline">Chat / Voice</span>
        </button>
      )}

      <button
        onClick={onOpenSplitDrawer}
        className="px-3.5 py-2.5 rounded-xl bg-brand-coral hover:bg-brand-coralDim text-surface-base text-xs font-bold shadow-coral flex items-center gap-1.5 transition-all"
        title="Log New Expense with Split Rules"
      >
        <Plus className="w-4 h-4 stroke-[3]" />
        <span className="hidden sm:inline">Quick Expense</span>
      </button>

      <button
        onClick={onOpenUpiSetup}
        className="p-2.5 rounded-xl bg-surface-base border border-surface-hairline text-ink-primary hover:bg-surface-overlay transition-all text-xs font-bold flex items-center gap-1.5"
        title="My UPI ID & QR Code"
      >
        <QrCode className="w-4 h-4 text-brand-gold" />
        <span className="hidden md:inline">My UPI</span>
      </button>
    </motion.div>
  );
};
