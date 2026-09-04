'use client';

import React, { useState, useEffect } from 'react';
import { Participant, ParsedChatExpense, BookingCategory } from '@/lib/types';
import { parseNaturalChatExpense } from '@/lib/ledger-engine';
import { MessageSquareText, Mic, Upload, Sparkles, Check, ArrowRight, X, Volume2, Receipt, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  onApplyDraft: (draft: ParsedChatExpense) => void;
}

const SAMPLE_CHATS = [
  "Dinner at Fisherman's Wharf for 3500 paid by Priya for Rahul and Vikram",
  "Uber cab to Calangute beach 850 paid by Rohan",
  "Scooter rental 1200 paid by Rahul for everyone",
  "Watersports jet ski 4800 paid by Vikram for Priya, Arjun and Rohan",
];

const MOCK_RECEIPTS = [
  {
    name: "Goa Beach Shack Seafood Dinner",
    text: "Fisherman's Wharf Goa - Total INR 4,200. Paid by Rohan. Attendees: Rahul, Priya, Vikram.",
    amount: 4200,
    category: "food" as BookingCategory,
  },
  {
    name: "Calangute Scuba & Watersports Club",
    text: "Scuba diving package bill 6,500 INR paid by Vikram for Rahul, Priya, Arjun.",
    amount: 6500,
    category: "activity" as BookingCategory,
  },
];

export const ChatExpenseModal: React.FC<ChatExpenseModalProps> = ({
  isOpen,
  onClose,
  participants,
  onApplyDraft,
}) => {
  const [inputText, setInputText] = useState('');
  const [parsed, setParsed] = useState<ParsedChatExpense | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Live parse whenever input text changes
  useEffect(() => {
    if (inputText.trim().length > 3) {
      const result = parseNaturalChatExpense(inputText, participants);
      setParsed(result);
    } else {
      setParsed(null);
    }
  }, [inputText, participants]);

  // Voice recording simulation timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  if (!isOpen) return null;

  const handleSimulateVoiceNote = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingSeconds(0);
      setTimeout(() => {
        setIsRecording(false);
        const voiceTranscription = "Hey squad, I just paid 2,800 rupees for watersports at Baga for Vikram and Priya.";
        setInputText(voiceTranscription);
      }, 3200);
    } else {
      setIsRecording(false);
    }
  };

  const handleApplyReceipt = (receipt: typeof MOCK_RECEIPTS[0]) => {
    setInputText(receipt.text);
  };

  const handleConfirmAndProceed = () => {
    if (!parsed) return;
    onApplyDraft(parsed);
    onClose();
  };

  const detectedPayerName = participants.find((p) => p.id === parsed?.payerId)?.name || 'Auto-select (Organizer)';
  const detectedBeneficiaryNames = parsed?.detectedParticipantIds && parsed.detectedParticipantIds.length > 0
    ? parsed.detectedParticipantIds.map((id) => participants.find((p) => p.id === id)?.name || id).join(', ')
    : 'All Active Squad Members';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-surface-raised border border-surface-hairline rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-surface-hairline bg-surface-base flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-coral/10 text-brand-coral border border-brand-coral/20">
              <MessageSquareText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-serif-display font-bold text-ink-primary flex items-center gap-2">
                Chat & Voice Expense Capture
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-sand text-ink-primary border border-surface-hairline">
                  NLP / OCR
                </span>
              </h3>
              <p className="text-xs text-ink-secondary">
                Natural-language parser extracts amounts, participants, and categories into a validated draft.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-ink-muted hover:text-ink-primary hover:bg-surface-overlay transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Input Bar with Voice Note button */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                Type Natural Chat Message or Note
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSimulateVoiceNote}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    isRecording
                      ? 'bg-ledger-deficit/20 border-ledger-deficit text-ledger-deficit animate-pulse'
                      : 'bg-surface-base border-surface-hairline text-ink-secondary hover:text-brand-coral hover:border-brand-coral/40'
                  }`}
                >
                  <Mic className={`w-3.5 h-3.5 ${isRecording ? 'text-ledger-deficit' : ''}`} />
                  {isRecording ? `Recording Voice (${recordingSeconds}s)...` : 'Simulate Voice Note'}
                </button>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g. Paid 3500 for seafood dinner for Priya and Rahul..."
                rows={3}
                className="w-full bg-surface-base border-2 border-surface-hairline focus:border-brand-coral rounded-2xl p-4 text-sm text-ink-primary outline-none transition-all resize-none shadow-inner"
              />
              {inputText && (
                <button
                  onClick={() => setInputText('')}
                  className="absolute right-3 top-3 text-ink-muted hover:text-ink-primary text-xs bg-surface-overlay px-2 py-1 rounded-lg"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Preset Prompts */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">
              Quick Suggestions (Tap to fill)
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_CHATS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInputText(sample)}
                  className="text-xs text-left px-3 py-1.5 rounded-xl bg-surface-base border border-surface-hairline hover:border-brand-coral/50 hover:bg-surface-overlay text-ink-secondary transition-all"
                >
                  💬 {sample}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Receipt Ingestion Mock */}
          <div className="space-y-2 pt-2 border-t border-surface-hairline">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-brand-coral" /> Photo Receipt Ingestion (OCR Simulation)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MOCK_RECEIPTS.map((rec, i) => (
                <div
                  key={i}
                  onClick={() => handleApplyReceipt(rec)}
                  className="p-3 rounded-2xl border border-surface-hairline bg-surface-base hover:border-brand-coral/50 hover:bg-surface-overlay transition-all cursor-pointer flex items-start gap-3"
                >
                  <div className="p-2 rounded-xl bg-brand-sand/50 text-ink-primary mt-0.5">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-ink-primary">{rec.name}</p>
                    <p className="text-[11px] text-brand-coral font-numeric font-bold">₹{rec.amount.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-ink-muted line-clamp-1 mt-0.5">{rec.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Parsed Preview Card */}
          <AnimatePresence>
            {parsed && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="p-4 rounded-2xl border-2 border-brand-coral/30 bg-brand-coral/5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-coral flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Structured Draft Detected
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-ledger-surplus/20 text-ledger-surplus border border-ledger-surplus/30">
                    Confidence: {(parsed.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl bg-surface-base border border-surface-hairline">
                    <span className="text-[10px] text-ink-muted block uppercase">Amount</span>
                    <span className="text-base font-numeric font-bold text-ink-primary">
                      ₹{parsed.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-surface-base border border-surface-hairline">
                    <span className="text-[10px] text-ink-muted block uppercase">Payer</span>
                    <span className="font-semibold text-ink-primary truncate block">
                      {detectedPayerName}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-surface-base border border-surface-hairline">
                    <span className="text-[10px] text-ink-muted block uppercase">Category</span>
                    <span className="font-semibold text-ink-primary capitalize block">
                      {parsed.category}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-surface-base border border-surface-hairline">
                    <span className="text-[10px] text-ink-muted block uppercase">Split Rule</span>
                    <span className="font-semibold text-brand-coral capitalize block">
                      {parsed.suggestedSplitMethod.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="text-xs p-2.5 rounded-xl bg-surface-base border border-surface-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="text-ink-muted mr-1">Description:</span>
                    <span className="font-medium text-ink-primary">{parsed.title}</span>
                  </div>
                  <div>
                    <span className="text-ink-muted mr-1">Split With:</span>
                    <span className="font-medium text-brand-coral">{detectedBeneficiaryNames}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-surface-hairline bg-surface-base flex items-center justify-between">
          <p className="text-xs text-ink-muted">
            {parsed ? 'Click below to review & finalize allocation in Split Drawer.' : 'Type or speak an expense above to parse.'}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-ink-secondary hover:text-ink-primary transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!parsed}
              onClick={handleConfirmAndProceed}
              className="px-5 py-2.5 rounded-xl bg-brand-coral text-surface-base font-semibold text-xs flex items-center gap-2 shadow-coral hover:brightness-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span>Open in Split Engine</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
