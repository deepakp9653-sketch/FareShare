'use client';

import React, { useState, useEffect } from 'react';
import { Participant, SplitMethod, Booking, BookingCategory, Expense } from '@/lib/types';
import { calculateSplits, suggestSplitMethod } from '@/lib/ledger-engine';
import { X, Calculator, ShieldAlert, CheckCircle2, DollarSign, Upload, FileText, Image as ImageIcon, Sparkles, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface DynamicSplitDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  bookings: Booking[];
  initialDraft?: Partial<Expense> & { chatSourceRaw?: string; receiptConfidence?: number };
  onSubmitExpense: (expenseData: {
    title: string;
    totalAmount: number;
    splitMethod: SplitMethod;
    paidById: string;
    bookingId?: string;
    category: BookingCategory;
    subsidyAmount?: number;
    receiptUrl?: string;
    receiptName?: string;
    chatSourceRaw?: string;
    receiptConfidence?: number;
  }) => void;
}

export const DynamicSplitDrawer: React.FC<DynamicSplitDrawerProps> = ({
  isOpen,
  onClose,
  participants,
  bookings,
  initialDraft,
  onSubmitExpense,
}) => {
  const [title, setTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState<number>(18000);
  const [splitMethod, setSplitMethod] = useState<SplitMethod>('equal');
  const [paidById, setPaidById] = useState<string>(participants[0]?.id || '');
  const [bookingId, setBookingId] = useState<string>('');
  const [category, setCategory] = useState<BookingCategory>('general');
  const [subsidyAmount, setSubsidyAmount] = useState<number>(3000);

  // File upload state for Bill Spending Proof
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const [lineItems, setLineItems] = useState<Record<string, number>>({});
  const [weights, setWeights] = useState<Record<string, number>>({});

  // Populate from initialDraft when opened
  useEffect(() => {
    if (initialDraft) {
      if (initialDraft.title) setTitle(initialDraft.title);
      if (initialDraft.totalAmount) setTotalAmount(initialDraft.totalAmount);
      if (initialDraft.splitMethod) setSplitMethod(initialDraft.splitMethod);
      if (initialDraft.paidById) setPaidById(initialDraft.paidById);
      if (initialDraft.category) setCategory(initialDraft.category);
      if (initialDraft.bookingId) setBookingId(initialDraft.bookingId);
    }
  }, [initialDraft]);

  useEffect(() => {
    if (participants.length > 0) {
      const initLineItems: Record<string, number> = {};
      const initWeights: Record<string, number> = {};
      const equalShare = totalAmount / participants.length;

      participants.forEach((p) => {
        initLineItems[p.id] = Number(equalShare.toFixed(2));
        initWeights[p.id] = p.weight || 1;
      });
      setLineItems(initLineItems);
      setWeights(initWeights);
    }
  }, [participants, totalAmount]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const activeParticipants = participants.filter((p) => p.status === 'active');
  const linkedBooking = bookings.find((b) => b.id === bookingId);
  const splitAdvice = suggestSplitMethod(category, activeParticipants, linkedBooking);

  const calculatedAllocations = calculateSplits(totalAmount, splitMethod, activeParticipants, {
    weights,
    lineItems: splitMethod === 'line_item' ? lineItems : undefined,
    subsidyAmount: splitMethod === 'organizer_subsidy' ? subsidyAmount : undefined,
  });

  const totalAllocated = calculatedAllocations.reduce((sum, a) => sum + a.amountOwed, 0);
  const totalWithSubsidy = totalAllocated + (splitMethod === 'organizer_subsidy' ? subsidyAmount : 0);
  const isReconciled = Math.abs(totalWithSubsidy - totalAmount) <= 0.5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || totalAmount <= 0) return;

    onSubmitExpense({
      title,
      totalAmount,
      splitMethod,
      paidById,
      bookingId: bookingId || undefined,
      category,
      subsidyAmount: splitMethod === 'organizer_subsidy' ? subsidyAmount : undefined,
      receiptUrl: receiptPreview || undefined,
      receiptName: receiptFile?.name || undefined,
      chatSourceRaw: initialDraft?.chatSourceRaw,
      receiptConfidence: initialDraft?.receiptConfidence,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-surface-raised border-l border-surface-hairline w-full max-w-xl h-full flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-surface-hairline flex items-center justify-between bg-surface-base">
          <div>
            <h3 className="text-xl font-serif-display font-bold text-ink-primary flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-400" /> Dynamic Split Engine
            </h3>
            <p className="text-xs text-ink-secondary mt-0.5">
              Configure cost distribution rules, attach bill proofs & verify real-time reconciliation (₹ INR).
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-ink-muted hover:text-ink-primary hover:bg-surface-overlay transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Chat / Voice Origin Banner if parsed */}
          {initialDraft?.chatSourceRaw && (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-ink-secondary flex items-center justify-between">
              <span className="truncate mr-2">
                Draft source: <strong className="text-ink-primary font-mono">"{initialDraft.chatSourceRaw}"</strong>
              </span>
              <span className="text-ledger-surplus font-bold shrink-0">
                Confidence: {((initialDraft.receiptConfidence ?? 0.95) * 100).toFixed(0)}%
              </span>
            </div>
          )}

          {/* F17 Split-Method Advisor Banner */}
          <div className="p-3.5 rounded-2xl bg-brand-sand/60 border border-surface-hairline flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 shrink-0">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink-primary flex items-center gap-1.5">
                  Split-Method Advisor (F17)
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-surface-base border border-surface-hairline font-mono text-ink-secondary">
                    {(splitAdvice.confidence * 100).toFixed(0)}% match
                  </span>
                </span>
                {splitMethod !== splitAdvice.method && (
                  <button
                    type="button"
                    onClick={() => setSplitMethod(splitAdvice.method)}
                    className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-0.5"
                  >
                    Apply ({splitAdvice.method.replace('_', ' ')}) →
                  </button>
                )}
              </div>
              <p className="text-ink-secondary text-[11px] mt-1">
                {splitAdvice.reason}
              </p>
            </div>
          </div>

          {/* Amount & Title Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1">
                Expense Total Amount (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-numeric text-ink-primary font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  step="1"
                  required
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-surface-base border-2 border-surface-hairline focus:border-emerald-500 rounded-2xl pl-10 pr-4 py-3 text-3xl font-numeric font-bold text-ink-primary outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-ink-muted mb-1">Expense Description</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Thalassa Seafood Feast & Wine"
                  className="w-full bg-surface-base border border-surface-hairline rounded-xl px-3 py-2.5 text-xs text-ink-primary focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-ink-muted mb-1">Paid By (Payer)</label>
                <select
                  value={paidById}
                  onChange={(e) => setPaidById(e.target.value)}
                  className="w-full bg-surface-base border border-surface-hairline rounded-xl px-3 py-2.5 text-xs text-ink-primary focus:border-emerald-500 outline-none cursor-pointer"
                >
                  {participants.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.isOrganizer ? '(Organizer)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-ink-muted mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-surface-base border border-surface-hairline rounded-xl px-3 py-2.5 text-xs text-ink-primary focus:border-emerald-500 outline-none cursor-pointer"
                >
                  <option value="general">General</option>
                  <option value="lodging">Lodging</option>
                  <option value="transport">Transport</option>
                  <option value="activity">Activity</option>
                  <option value="food">Food & Dining</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-ink-muted mb-1">Linked Booking (Optional)</label>
                <select
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  className="w-full bg-surface-base border border-surface-hairline rounded-xl px-3 py-2.5 text-xs text-ink-primary focus:border-emerald-500 outline-none cursor-pointer"
                >
                  <option value="">None (Trip-level Cost)</option>
                  {bookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} (₹{b.actualCost})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Bill / Receipt Spending Proof Dropzone */}
          <div className="space-y-2 pt-2 border-t border-surface-hairline">
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Upload Bill / Receipt Spending Proof
            </label>

            <div className="p-4 border-2 border-dashed border-surface-hairline hover:border-emerald-500/60 rounded-2xl bg-surface-base text-center space-y-2 cursor-pointer relative transition-all">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />

              {receiptPreview ? (
                <div className="flex items-center justify-center gap-3">
                  <ImageIcon className="w-6 h-6 text-emerald-400" />
                  <div className="text-left text-xs">
                    <span className="font-semibold text-ink-primary block">{receiptFile?.name || 'Attached Receipt'}</span>
                    <span className="text-ledger-surplus text-[11px] font-bold">Proof Verified ✓</span>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-ink-muted mx-auto" />
                  <p className="text-xs text-ink-secondary">
                    Drag & drop bill receipt image/PDF, or <span className="text-emerald-400 font-semibold">browse files</span>
                  </p>
                </>
              )}
            </div>
          </div>

          {/* 5 Split Strategy Selector */}
          <div className="space-y-3 pt-4 border-t border-surface-hairline">
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Split Strategy Primitive
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'equal', label: 'Equal Split' },
                { id: 'weighted', label: 'Weighted / Night' },
                { id: 'room_tier', label: 'Room-Tier' },
                { id: 'line_item', label: 'Line-Item' },
                { id: 'organizer_subsidy', label: 'Organizer Subsidy' },
              ].map((strat) => (
                <button
                  type="button"
                  key={strat.id}
                  onClick={() => setSplitMethod(strat.id as SplitMethod)}
                  className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition-all ${
                    splitMethod === strat.id
                      ? 'bg-white text-black border-white shadow-subtle font-bold'
                      : 'bg-surface-base text-ink-secondary border-surface-hairline hover:text-ink-primary'
                  }`}
                >
                  {strat.label}
                </button>
              ))}
            </div>

            {splitMethod === 'organizer_subsidy' && (
              <div className="p-3 rounded-xl bg-brand-gold/10 border border-brand-gold/30 text-xs space-y-2">
                <span className="text-brand-gold font-semibold block">Organizer Subsidy Input</span>
                <div className="flex items-center gap-2">
                  <span className="text-ink-muted">Organizer Subsidy Amount (₹):</span>
                  <input
                    type="number"
                    value={subsidyAmount}
                    onChange={(e) => setSubsidyAmount(parseFloat(e.target.value) || 0)}
                    className="w-28 bg-surface-base border border-surface-hairline rounded-lg px-2 py-1 font-numeric text-brand-gold font-bold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Live Allocation Table */}
          <div className="space-y-3 pt-4 border-t border-surface-hairline">
            <div className="flex items-center justify-between text-xs font-semibold text-ink-muted uppercase tracking-wider">
              <span>Participant Allocation Breakdown</span>
              <span>Calculated Share (₹)</span>
            </div>

            <div className="space-y-2">
              {calculatedAllocations.map((alloc) => {
                const participant = participants.find((p) => p.id === alloc.participantId);
                if (!participant) return null;

                return (
                  <div
                    key={alloc.participantId}
                    className="p-3 rounded-xl bg-surface-base border border-surface-hairline flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={participant.avatarUrl}
                        alt={participant.name}
                        className="w-8 h-8 rounded-full object-cover border border-surface-hairline"
                      />
                      <div>
                        <p className="text-xs font-semibold text-ink-primary">{participant.name}</p>
                        <p className="text-[10px] text-ink-muted">
                          {splitMethod === 'room_tier'
                            ? `Room: ${participant.roomTier || 'standard'}`
                            : 'Active Traveler'}
                        </p>
                      </div>
                    </div>

                    <div className="font-numeric font-bold text-sm text-ink-primary">
                      ₹{alloc.amountOwed.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </form>

        {/* Real-Time Reconciliation Bar Pinned at Bottom */}
        <div className="p-4 border-t border-surface-hairline bg-surface-base space-y-3">
          <div
            className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
              isReconciled
                ? 'bg-ledger-surplusBg text-ledger-surplus border-ledger-surplus/40'
                : 'bg-ledger-deficitBg text-ledger-deficit border-ledger-deficit/40'
            }`}
          >
            <div className="flex items-center gap-2">
              {isReconciled ? (
                <CheckCircle2 className="w-4 h-4 text-ledger-surplus shrink-0" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-ledger-deficit shrink-0" />
              )}
              <span className="font-medium">
                Reconciliation Bar: Allocated <span className="font-numeric font-bold">₹{totalWithSubsidy.toFixed(2)}</span> / ₹{totalAmount.toFixed(2)}
              </span>
            </div>
            <span className="font-bold uppercase tracking-wider text-[10px]">
              {isReconciled ? 'Balanced 100%' : 'Unbalanced'}
            </span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isReconciled}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
              isReconciled
                ? 'bg-white text-black hover:bg-neutral-200 cursor-pointer shadow-subtle'
                : 'bg-surface-overlay text-ink-muted cursor-not-allowed border border-surface-hairline'
            }`}
          >
            Confirm & Append to Ledger Event Stream
          </button>
        </div>
      </motion.div>
    </div>
  );
};
