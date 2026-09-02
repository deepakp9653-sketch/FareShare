import React, { useState } from 'react';
import { ReconciliationAudit } from '@/lib/types';
import { ShieldCheck, ChevronDown, ChevronUp, CheckCircle2, AlertOctagon, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReconciliationAuditCardProps {
  audit: ReconciliationAudit;
}

export const ReconciliationAuditCard: React.FC<ReconciliationAuditCardProps> = ({ audit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`border rounded-2xl p-5 transition shadow-lg ${
        audit.isReconciled
          ? 'bg-gradient-to-br from-emerald-500/10 via-surface-card to-surface-card border-emerald-500/30'
          : 'bg-gradient-to-br from-red-500/10 via-surface-card to-surface-card border-red-500/30'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
              audit.isReconciled
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/15 border-red-500/30 text-red-400'
            }`}
          >
            {audit.isReconciled ? <ShieldCheck className="w-6 h-6" /> : <AlertOctagon className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-base text-ink-primary">Zero-Sum Reconciliation Invariant</h4>
              <span
                className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border flex items-center gap-1 uppercase tracking-wider ${
                  audit.isReconciled
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-red-500/20 text-red-300 border-red-500/30'
                }`}
              >
                {audit.isReconciled ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" /> PROVABLY RECONCILED
                  </>
                ) : (
                  <>
                    <AlertOctagon className="w-3 h-3" /> DISCREPANCY DETECTED
                  </>
                )}
              </span>
            </div>
            <p className="text-xs text-ink-muted mt-0.5">
              Net Expenses Net of Refunds (₹{audit.netIncurred.toLocaleString('en-IN')}) = Net Participant Debt Allocations
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs font-semibold text-accent-cyan hover:underline p-2 rounded-lg hover:bg-surface-elevated transition"
        >
          <span>{isExpanded ? 'Hide Ledger Audit' : 'Verify Ledger Math'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable Mathematical Proof Table */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-surface-border text-xs space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-surface-elevated p-3 rounded-xl border border-surface-border">
                  <div className="text-ink-muted text-[10px] uppercase tracking-wider">Gross Logged Expenses</div>
                  <div className="font-bold text-sm text-ink-primary mt-1">₹{audit.totalExpenses.toLocaleString('en-IN')}</div>
                </div>

                <div className="bg-surface-elevated p-3 rounded-xl border border-surface-border">
                  <div className="text-ink-muted text-[10px] uppercase tracking-wider">Total Vendor Refunds</div>
                  <div className="font-bold text-sm text-emerald-400 mt-1">- ₹{audit.totalRefunds.toLocaleString('en-IN')}</div>
                </div>

                <div className="bg-surface-elevated p-3 rounded-xl border border-surface-border">
                  <div className="text-ink-muted text-[10px] uppercase tracking-wider">Organizer Subsidies</div>
                  <div className="font-bold text-sm text-purple-400 mt-1">- ₹{audit.totalSubsidies.toLocaleString('en-IN')}</div>
                </div>

                <div className="bg-surface-elevated p-3 rounded-xl border border-surface-border">
                  <div className="text-ink-muted text-[10px] uppercase tracking-wider">Net Incurred Group Spend</div>
                  <div className="font-bold text-sm text-accent-cyan mt-1">₹{audit.netIncurred.toLocaleString('en-IN')}</div>
                </div>

                <div className="bg-surface-elevated p-3 rounded-xl border border-surface-border">
                  <div className="text-ink-muted text-[10px] uppercase tracking-wider">Net Ledger Balance Sum</div>
                  <div className={`font-bold text-sm mt-1 ${audit.isReconciled ? 'text-emerald-400' : 'text-red-400'}`}>
                    ₹{audit.netBalanceSum.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-surface-elevated rounded-xl border border-surface-border flex items-center justify-between text-ink-muted">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-accent-cyan" />
                  <span>Mathematical Invariant Rule: <code className="text-ink-primary font-mono">∑(Paid) - ∑(Owed) ≡ 0.00</code></span>
                </div>
                <span className="font-mono text-emerald-400 font-bold">Δ = ₹{audit.discrepancy.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
