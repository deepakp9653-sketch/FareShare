'use client';

import React from 'react';
import { Participant, ParticipantNetBalance, Trip } from '@/lib/types';
import { Compass, Wallet, UserCheck, Database, CheckCircle2, Home, Plus, Lock, QrCode, Copy, Layers, Key, Sparkles, MessageSquareText, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  trip: Trip;
  participants: Participant[];
  currentUserId: string;
  onSelectUser: (userId: string) => void;
  netBalances: ParticipantNetBalance[];
  isSettled: boolean;
  onGoToLanding: () => void;
  onOpenCreateTrip: () => void;
  onOpenJoinTrip: () => void;
  onOpenTripSwitcher: () => void;
  onOpenAuth: () => void;
  onOpenUpiSetup: () => void;
  onOpenExplainBalance?: () => void;
  onOpenChatExpense?: () => void;
  onOpenNudges?: () => void;
  offlineIndicatorNode?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  trip,
  participants,
  currentUserId,
  onSelectUser,
  netBalances,
  isSettled,
  onGoToLanding,
  onOpenCreateTrip,
  onOpenJoinTrip,
  onOpenTripSwitcher,
  onOpenAuth,
  onOpenUpiSetup,
  onOpenExplainBalance,
  onOpenChatExpense,
  onOpenNudges,
  offlineIndicatorNode,
}) => {
  const userBalance = netBalances.find((b) => b.participant.id === currentUserId);
  const currentUser = participants.find((p) => p.id === currentUserId);
  const netAmount = userBalance ? userBalance.netBalance : 0;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(trip.inviteCode || 'GOA2026');
    alert(`Copied Trip Invite Code: ${trip.inviteCode || 'GOA2026'}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-surface-base/90 backdrop-blur-md border-b border-surface-hairline px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Trip Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={onGoToLanding}
            className="w-10 h-10 rounded-xl bg-brand-coral text-surface-base flex items-center justify-center shadow-coral hover:bg-brand-coralDim transition-all"
            title="Return to Landing Page"
          >
            <Compass className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenTripSwitcher}
                className="font-serif-display font-bold text-lg tracking-tight text-ink-primary hover:text-brand-coral transition-colors flex items-center gap-1.5"
                title="Switch Active Trip"
              >
                <span>{trip.title}</span>
                <Layers className="w-4 h-4 text-brand-gold" />
              </button>

              <button
                onClick={handleCopyCode}
                className="text-[11px] px-2.5 py-0.5 rounded-full bg-brand-indigo/15 text-brand-indigo font-numeric font-bold border border-brand-indigo/30 hover:bg-brand-indigo hover:text-surface-base transition-all flex items-center gap-1"
                title="Click to Copy Trip Invite Code"
              >
                <span>Code: {trip.inviteCode || 'GOA2026'}</span>
                <Copy className="w-3 h-3" />
              </button>
            </div>

            <p className="text-xs text-ink-secondary flex items-center gap-2 mt-0.5">
              <span>{trip.destination}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-ledger-surplus font-numeric text-[11px]">
                <Database className="w-3 h-3 inline" /> Neon DB Live (₹ INR)
              </span>
            </p>
          </div>
        </div>

        {/* Controls, My Trips & Persona Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenTripSwitcher}
            className="px-3 py-1.5 rounded-xl bg-surface-raised border border-surface-hairline text-ink-primary hover:bg-surface-overlay transition-all text-xs font-bold flex items-center gap-1.5"
            title="View All My Trips"
          >
            <Layers className="w-4 h-4 text-brand-gold" />
            <span className="hidden sm:inline">My Trips</span>
          </button>

          <button
            onClick={onOpenJoinTrip}
            className="px-3 py-1.5 rounded-xl bg-surface-raised border border-surface-hairline text-ink-primary hover:bg-surface-overlay transition-all text-xs font-bold hidden md:flex items-center gap-1.5"
            title="Join Trip via Invite Code"
          >
            <Key className="w-4 h-4 text-brand-indigo" />
            <span>Join Code</span>
          </button>

          <button
            onClick={onOpenCreateTrip}
            className="px-3 py-1.5 rounded-xl bg-brand-coral text-surface-base hover:bg-brand-coralDim transition-all text-xs font-bold shadow-sm hidden sm:flex items-center gap-1"
            title="Create New Custom Trip"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>New Trip</span>
          </button>

          {/* Global Balance Pill (Clickable for Explain My Balance) */}
          <button
            onClick={onOpenExplainBalance}
            className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isSettled
                ? 'bg-ledger-surplusBg text-ledger-surplus border-ledger-surplus/40'
                : netAmount > 0
                ? 'bg-ledger-surplusBg text-ledger-surplus border-ledger-surplus/40'
                : netAmount < 0
                ? 'bg-ledger-deficitBg text-ledger-deficit border-ledger-deficit/40'
                : 'bg-surface-raised text-ledger-neutral border-surface-hairline'
            }`}
            title="Click to see full mathematical explanation of your balance"
          >
            <Wallet className="w-4 h-4 shrink-0" />
            {isSettled ? (
              <span>Trip Settled ✓</span>
            ) : netAmount > 0 ? (
              <span>
                Owed <span className="font-numeric font-bold text-xs">+₹{netAmount.toFixed(0)}</span>
              </span>
            ) : netAmount < 0 ? (
              <span>
                Owe <span className="font-numeric font-bold text-xs">-₹{Math.abs(netAmount).toFixed(0)}</span>
              </span>
            ) : (
              <span>Settled</span>
            )}
            <Sparkles className="w-3 h-3 text-brand-gold ml-0.5" />
          </button>

          {/* F19 Offline Queue Indicator */}
          {offlineIndicatorNode}

          {/* F14 & F15 Chat & Voice Expense Button */}
          {onOpenChatExpense && (
            <button
              onClick={onOpenChatExpense}
              className="px-3 py-1.5 rounded-xl bg-brand-coral/10 hover:bg-brand-coral hover:text-white border border-brand-coral/30 text-brand-coral transition-all text-xs font-bold flex items-center gap-1.5 shadow-sm"
              title="Capture Expense via Natural Chat, Voice Note or Bill Receipt (F14 & F15)"
            >
              <MessageSquareText className="w-4 h-4" />
              <span className="hidden md:inline">Chat / Voice</span>
            </button>
          )}

          {/* F20 Nudge & Reminders Button */}
          {onOpenNudges && (
            <button
              onClick={onOpenNudges}
              className="px-3 py-1.5 rounded-xl bg-surface-raised border border-surface-hairline text-ink-secondary hover:text-ink-primary hover:border-brand-coral/40 transition-all text-xs font-bold flex items-center gap-1.5"
              title="Open Nudge & Reminder Engine / WhatsApp Settlement Digest (F20)"
            >
              <Bell className="w-4 h-4 text-brand-gold" />
              <span className="hidden lg:inline">Nudges</span>
            </button>
          )}

          {/* User Profile Button */}
          <button
            onClick={onOpenUpiSetup}
            className="p-2 rounded-xl bg-surface-raised border border-surface-hairline text-ink-primary hover:bg-surface-overlay transition-all text-xs font-semibold flex items-center gap-1.5"
            title="Configure My UPI ID & QR Code"
          >
            <QrCode className="w-4 h-4 text-brand-coral" />
            <span className="hidden xl:inline">{currentUser?.name.split(' ')[0]}</span>
          </button>

          <button
            onClick={onGoToLanding}
            className="p-2 rounded-xl bg-surface-raised border border-surface-hairline text-ink-secondary hover:text-ink-primary transition-all text-xs font-semibold flex items-center gap-1"
            title="Landing Page"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
