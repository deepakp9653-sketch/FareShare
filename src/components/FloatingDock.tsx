'use client';

import React from 'react';
import { Plus, Receipt, QrCode, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface FloatingDockProps {
  onOpenSplitDrawer: () => void;
  onOpenUpiSetup: () => void;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  onOpenSplitDrawer,
  onOpenUpiSetup,
}) => {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 p-2 rounded-2xl bg-surface-raised/90 backdrop-blur-md border border-surface-hairline shadow-2xl"
    >
      <button
        onClick={onOpenSplitDrawer}
        className="px-4 py-2.5 rounded-xl bg-brand-coral hover:bg-brand-coralDim text-surface-base text-xs font-bold shadow-coral flex items-center gap-2 transition-all"
        title="Log New Expense with Split Rules"
      >
        <Zap className="w-4 h-4" />
        <span className="hidden sm:inline">Quick Expense</span>
      </button>

      <button
        onClick={onOpenUpiSetup}
        className="p-2.5 rounded-xl bg-surface-base border border-surface-hairline text-ink-primary hover:bg-surface-overlay transition-all text-xs font-bold flex items-center gap-1.5"
        title="My UPI ID & QR Code"
      >
        <QrCode className="w-4 h-4 text-brand-gold" />
        <span className="hidden md:inline">My UPI QR</span>
      </button>
    </motion.div>
  );
};
