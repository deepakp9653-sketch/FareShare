'use client';

import React, { useState } from 'react';
import { Participant, ParticipantNetBalance, Trip } from '@/lib/types';
import {
  Compass,
  Wallet,
  Database,
  CheckCircle2,
  Home,
  Plus,
  QrCode,
  Copy,
  Check,
  ChevronDown,
  Layers,
  Key,
  Sparkles,
  MessageSquareText,
  Bell,
  Share2,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidLogo } from './LiquidLogo';
import { UserAvatar } from './UserAvatar';

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
  onOpenAccountSwitcher?: () => void;
  onOpenShareTrip?: () => void;
  onOpenExplainBalance?: () => void;
  onOpenChatExpense?: () => void;
  onOpenNudges?: () => void;
  offlineIndicatorNode?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  trip,
  participants,
  currentUserId,
  netBalances,
  isSettled,
  onGoToLanding,
  onOpenCreateTrip,
  onOpenJoinTrip,
  onOpenTripSwitcher,
  onOpenAuth,
  onOpenUpiSetup,
  onOpenAccountSwitcher,
  onOpenShareTrip,
  onOpenExplainBalance,
  onOpenChatExpense,
  onOpenNudges,
  offlineIndicatorNode,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const userBalance = netBalances.find((b) => b.participant.id === currentUserId);
  const currentUser = participants.find((p) => p.id === currentUserId);
  const netAmount = userBalance ? userBalance.netBalance : 0;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(trip.inviteCode || 'GOA2026');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-surface-base/95 backdrop-blur-md border-b border-surface-hairline px-4 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Midday-Style Trip Switcher & Verified Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={onGoToLanding}
            className="cursor-pointer hover:opacity-90 transition-opacity"
            title="Home / Landing Overview"
          >
            <LiquidLogo size={36} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenTripSwitcher}
                className="font-sans font-semibold text-sm sm:text-base text-ink-primary hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Switch Active Trip"
              >
                <span>{trip.title}</span>
                <ChevronDown className="w-3.5 h-3.5 text-ink-muted" />
              </button>

              {/* Dub-style tactile copy invite code */}
              <button
                onClick={handleCopyCode}
                className="text-[11px] px-2 py-0.5 rounded-md bg-surface-overlay text-ink-secondary border border-surface-hairline hover:text-ink-primary hover:border-ink-muted transition-all flex items-center gap-1 font-mono cursor-pointer"
                title="Copy trip invite code"
              >
                <span>{trip.inviteCode || 'GOA2026'}</span>
                {copiedCode ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-ink-muted" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-ink-muted mt-0.5">
              <span>{trip.destination}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400/90 font-mono text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                Zero-Sum Engine
              </span>
            </div>
          </div>
        </div>

        {/* Right: Balance Indicator, Tools, and Account Switcher */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Midday-style high-precision balance pill */}
          <button
            onClick={onOpenExplainBalance}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              isSettled
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : netAmount > 0
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15'
                : netAmount < 0
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/15'
                : 'bg-surface-overlay text-ink-secondary border-surface-hairline'
            }`}
            title="Click to view mathematical balance breakdown"
          >
            <Wallet className="w-3.5 h-3.5 shrink-0" />
            {isSettled ? (
              <span>Trip Settled ✓</span>
            ) : netAmount > 0 ? (
              <span>
                Owed <strong className="font-numeric">+₹{netAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
              </span>
            ) : netAmount < 0 ? (
              <span>
                Owe <strong className="font-numeric">-₹{Math.abs(netAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
              </span>
            ) : (
              <span>Even Balance</span>
            )}
            <Sparkles className="w-3 h-3 text-ink-muted ml-0.5" />
          </button>

          {/* F19 Offline Queue Indicator */}
          {offlineIndicatorNode}

          {/* Chat & Voice AI Button */}
          {onOpenChatExpense && (
            <button
              onClick={onOpenChatExpense}
              className="px-2.5 py-1.5 rounded-lg bg-surface-overlay border border-surface-hairline text-ink-primary hover:bg-surface-hairline transition-colors text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              title="Capture Expense via Natural Voice or Receipt"
            >
              <MessageSquareText className="w-3.5 h-3.5 text-ink-muted" />
              <span className="hidden md:inline">Voice / Chat</span>
            </button>
          )}

          {/* Share Trip Button */}
          {onOpenShareTrip && (
            <button
              onClick={onOpenShareTrip}
              className="px-2.5 py-1.5 rounded-lg bg-surface-overlay border border-surface-hairline text-ink-primary hover:bg-surface-hairline transition-colors text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              title="Share Trip & Manage Member Access"
            >
              <Share2 className="w-3.5 h-3.5 text-ink-muted" />
              <span className="hidden sm:inline">Share</span>
            </button>
          )}

          {/* Nudges Button */}
          {onOpenNudges && (
            <button
              onClick={onOpenNudges}
              className="p-2 rounded-lg bg-surface-overlay border border-surface-hairline text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
              title="Settlement Reminders & Nudges"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>
          )}

          {/* User Account Switcher (Password Protected) */}
          <button
            onClick={onOpenAccountSwitcher || onOpenAuth}
            className="p-1 sm:px-2.5 sm:py-1 rounded-lg bg-surface-overlay border border-surface-hairline hover:border-zinc-500 text-ink-primary transition-all text-xs font-medium flex items-center gap-2 cursor-pointer"
            title="Switch User Account (Protected by Password)"
          >
            <UserAvatar
              name={currentUser?.name}
              id={currentUser?.id}
              avatarUrl={currentUser?.avatarUrl}
              size="xs"
              className="shrink-0"
            />
            <span className="hidden md:inline font-medium text-xs">
              {currentUser?.name.split(' ')[0]}
            </span>
            <span className="hidden lg:inline text-[9px] px-1.5 py-0.2 rounded bg-surface-hairline text-ink-muted uppercase font-mono">
              Switch
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
