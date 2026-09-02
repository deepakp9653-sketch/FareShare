'use client';

import React from 'react';
import { ParticipantNetBalance } from '@/lib/types';
import { motion } from 'framer-motion';

interface ParticipantBarChartProps {
  netBalances: ParticipantNetBalance[];
}

export const ParticipantBarChart: React.FC<ParticipantBarChartProps> = ({ netBalances }) => {
  const maxVal = Math.max(...netBalances.flatMap((b) => [b.totalPaid, b.totalOwed]), 10000);

  return (
    <div className="space-y-3.5">
      {netBalances.map((nb) => {
        const paidPercent = Math.min(100, (nb.totalPaid / maxVal) * 100);
        const owedPercent = Math.min(100, (nb.totalOwed / maxVal) * 100);

        return (
          <div key={nb.participant.id} className="p-2.5 rounded-xl bg-surface-base border border-surface-hairline space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <img
                  src={nb.participant.avatarUrl}
                  alt={nb.participant.name}
                  className="w-5 h-5 rounded-full object-cover border border-surface-hairline"
                />
                <span className="font-bold text-ink-primary">{nb.participant.name}</span>
              </div>

              <span
                className={`font-numeric text-[11px] font-bold px-2 py-0.5 rounded ${
                  nb.netBalance > 0
                    ? 'bg-ledger-surplusBg text-ledger-surplus'
                    : nb.netBalance < 0
                    ? 'bg-ledger-deficitBg text-ledger-deficit'
                    : 'bg-surface-overlay text-ledger-neutral'
                }`}
              >
                {nb.netBalance > 0
                  ? `+₹${nb.netBalance.toLocaleString('en-IN')}`
                  : nb.netBalance < 0
                  ? `-₹${Math.abs(nb.netBalance).toLocaleString('en-IN')}`
                  : 'Settled'}
              </span>
            </div>

            {/* Dual Progress Bars: Paid (Green) vs Owed (Coral) */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px]">
                <span className="w-14 text-ink-muted shrink-0 font-medium">Fronted:</span>
                <div className="h-2 flex-1 bg-surface-overlay rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${paidPercent}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-ledger-surplus rounded-full"
                  />
                </div>
                <span className="font-numeric font-semibold text-ink-primary w-16 text-right">
                  ₹{nb.totalPaid.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px]">
                <span className="w-14 text-ink-muted shrink-0 font-medium">Share:</span>
                <div className="h-2 flex-1 bg-surface-overlay rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${owedPercent}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="h-full bg-brand-coral rounded-full"
                  />
                </div>
                <span className="font-numeric font-semibold text-ink-secondary w-16 text-right">
                  ₹{nb.totalOwed.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
