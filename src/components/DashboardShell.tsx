'use client';

import React, { useState } from 'react';
import {
  Trip,
  Participant,
  ParticipantNetBalance,
  SimplifiedDebt,
} from '@/lib/types';
import { TabType } from './Navigation';
import { LiquidLogo } from './LiquidLogo';
import { LiquidGlassButton } from './LiquidGlassButton';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Receipt,
  GitCommit,
  Activity,
  Plus,
  Share2,
  ShieldCheck,
  Wallet,
  ChevronDown,
  Sparkles,
  Zap,
  Key,
  Menu,
  X,
  Compass,
  Building2,
  CheckCircle2,
  ArrowRight,
  Wifi,
  WifiOff,
  Home,
  Calculator,
  FileCheck,
  Layers,
  MoreHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserAvatar } from './UserAvatar';

interface DashboardShellProps {
  children: React.ReactNode;
  trip: Trip;
  participants: Participant[];
  currentUserId: string;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  netBalances: ParticipantNetBalance[];
  simplifiedDebts: SimplifiedDebt[];
  eventCount: number;
  expensesCount: number;
  bookingsCount: number;
  isOffline: boolean;
  onToggleOffline: () => void;
  onOpenTripSwitcher: () => void;
  onOpenAccountSwitcher: () => void;
  onOpenShareTrip: () => void;
  onOpenAddExpense: () => void;
  onOpenAddBooking: () => void;
  onOpenChaosDemo?: () => void;
  onOpenWhatIf?: () => void;
  onOpenRoomOptimizer?: () => void;
  onOpenSettlementReport?: () => void;
  onOpenExplainBalance?: (participantId: string) => void;
  onGoToLanding?: () => void;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  children,
  trip,
  participants,
  currentUserId,
  activeTab,
  onTabChange,
  netBalances,
  simplifiedDebts,
  eventCount,
  expensesCount,
  bookingsCount,
  isOffline,
  onToggleOffline,
  onOpenTripSwitcher,
  onOpenAccountSwitcher,
  onOpenShareTrip,
  onOpenAddExpense,
  onOpenAddBooking,
  onOpenChaosDemo,
  onOpenWhatIf,
  onOpenRoomOptimizer,
  onOpenSettlementReport,
  onOpenExplainBalance,
  onGoToLanding,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentUser = participants.find((p) => p.id === currentUserId) || participants[0];
  const userBalance = netBalances.find((b) => b.participant.id === currentUserId);
  const netAmount = userBalance ? userBalance.netBalance : 0;

  const navItems = [
    { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
    { id: 'expenses' as TabType, label: 'Live Ledger', icon: Receipt, count: expensesCount },
    { id: 'itinerary' as TabType, label: 'Itinerary', icon: Calendar, count: bookingsCount },
    { id: 'participants' as TabType, label: 'Squad Roster', icon: Users, count: participants.length },
    { id: 'settlement' as TabType, label: 'Settlement Graph', icon: GitCommit, badge: `${simplifiedDebts.length} Paths` },
    { id: 'activity' as TabType, label: 'Audit Trail', icon: Activity, count: eventCount },
  ];

  return (
    <div className="min-h-screen bg-surface-base text-ink-primary flex antialiased selection:bg-emerald-500/20 font-sans">
      {/* ============================================================ */}
      {/* 1. LEFT COMMAND SIDEBAR RAIL (Desktop) */}
      {/* ============================================================ */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-surface-hairline bg-surface-base/95 backdrop-blur-xl shrink-0 h-screen sticky top-0 z-40 justify-between">
        <div className="flex flex-col h-full overflow-y-auto scrollbar-none p-4 space-y-5">
          {/* Top Brand & Workspace Header */}
          <div className="space-y-3 pb-3 border-b border-surface-hairline">
            <div className="flex items-center justify-between">
              <button
                onClick={onGoToLanding}
                title="Go to Homepage / Landing Page"
                className="flex items-center gap-2.5 text-left group cursor-pointer hover:opacity-85 transition-all"
              >
                <LiquidLogo size={30} />
                <div>
                  <span className="font-bold text-sm text-ink-primary tracking-tight block leading-tight group-hover:text-emerald-400 transition-colors">
                    TripSync
                  </span>
                  <span className="text-[10px] font-mono text-ink-muted tracking-wider block group-hover:text-ink-secondary transition-colors">
                    ← Log Out to Home
                  </span>
                </div>
              </button>

              {/* Offline mode toggle */}
              <button
                onClick={onToggleOffline}
                title={isOffline ? 'Offline Outbox Active' : 'Connected to Live Cloud'}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isOffline
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                    : 'bg-surface-overlay border-surface-hairline text-emerald-400'
                }`}
              >
                {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Active Workspace Selector Dropdown Trigger */}
            <button
              onClick={onOpenTripSwitcher}
              className="w-full p-2.5 rounded-xl bg-surface-raised border border-surface-hairline hover:border-zinc-500/50 transition-all flex items-center justify-between text-left group cursor-pointer shadow-subtle"
            >
              <div className="min-w-0 pr-2">
                <span className="text-[10px] uppercase font-mono text-ink-muted block tracking-wider">
                  Active Workspace
                </span>
                <span className="text-xs font-bold text-ink-primary truncate block">
                  {trip.title}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-surface-overlay text-emerald-400 border border-surface-hairline">
                  {trip.inviteCode || 'GOA2026'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-ink-muted group-hover:text-ink-primary transition-colors" />
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-ink-muted px-2.5 pb-1 block">
              Workspace Views
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full relative px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer select-none group ${
                    isActive
                      ? 'text-ink-primary bg-surface-overlay border border-surface-hairline shadow-subtle'
                      : 'text-ink-secondary hover:text-ink-primary hover:bg-surface-overlay/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-ink-primary' : 'text-ink-muted group-hover:text-ink-primary'
                      }`}
                    />
                    <span className={isActive ? 'font-semibold' : ''}>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {item.badge}
                      </span>
                    )}

                    {item.count !== undefined && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-hairline text-ink-muted">
                        {item.count}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tactical Tools & Simulations */}
          <div className="space-y-1 pt-2 border-t border-surface-hairline/60">
            <span className="text-[10px] font-mono uppercase tracking-widest text-ink-muted px-2.5 pb-1 block">
              Intelligence & Tools
            </span>

            {onOpenWhatIf && (
              <button
                onClick={onOpenWhatIf}
                className="w-full px-3 py-1.5 rounded-lg text-xs text-ink-secondary hover:text-ink-primary hover:bg-surface-overlay/50 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                <span>What-If Simulator</span>
              </button>
            )}

            {onOpenRoomOptimizer && (
              <button
                onClick={onOpenRoomOptimizer}
                className="w-full px-3 py-1.5 rounded-lg text-xs text-ink-secondary hover:text-ink-primary hover:bg-surface-overlay/50 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Room Allocator</span>
              </button>
            )}

            {onOpenSettlementReport && (
              <button
                onClick={onOpenSettlementReport}
                className="w-full px-3 py-1.5 rounded-lg text-xs text-ink-secondary hover:text-ink-primary hover:bg-surface-overlay/50 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>Settlement Audit PDF</span>
              </button>
            )}

            {onOpenChaosDemo && (
              <button
                onClick={onOpenChaosDemo}
                className="w-full px-3 py-1.5 rounded-lg text-xs text-ink-secondary hover:text-ink-primary hover:bg-surface-overlay/50 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Chaos Test Suite</span>
              </button>
            )}

            {onGoToLanding && (
              <button
                onClick={onGoToLanding}
                className="w-full px-3 py-1.5 rounded-lg text-xs text-rose-400/90 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-rose-400" />
                <span>Log Out to Homepage</span>
              </button>
            )}
          </div>

          {/* Quick Action Trigger Buttons */}
          <div className="pt-2 space-y-2">
            <LiquidGlassButton
              variant="primary"
              size="sm"
              onClick={onOpenAddExpense}
              icon={<Plus className="w-3.5 h-3.5 stroke-[3]" />}
              className="w-full justify-center"
            >
              Log Expense
            </LiquidGlassButton>

            <LiquidGlassButton
              variant="glass"
              size="sm"
              onClick={onOpenAddBooking}
              icon={<Plus className="w-3.5 h-3.5 text-ink-muted" />}
              className="w-full justify-center"
            >
              New Booking
            </LiquidGlassButton>
          </div>
        </div>

        {/* User Account & Profile Footer */}
        <div className="p-3 border-t border-surface-hairline bg-surface-raised/40">
          <button
            onClick={onOpenAccountSwitcher}
            className="w-full p-2 rounded-xl bg-surface-overlay border border-surface-hairline hover:border-zinc-500/50 transition-all flex items-center justify-between text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <UserAvatar
                name={currentUser?.name}
                id={currentUser?.id}
                avatarUrl={currentUser?.avatarUrl}
                size="sm"
                className="shrink-0"
              />
              <div className="min-w-0">
                <span className="text-xs font-semibold text-ink-primary truncate block">
                  {currentUser?.name}
                </span>
                <span className="text-[10px] text-ink-muted block truncate">
                  {currentUser?.email}
                </span>
              </div>
            </div>

            <div className="p-1 rounded-md bg-surface-hairline text-ink-muted group-hover:text-ink-primary transition-colors shrink-0">
              <Key className="w-3 h-3" />
            </div>
          </button>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 2. MAIN APPLICATION WORKSPACE */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Command & Telemetry Bar */}
        <header className="sticky top-0 z-30 bg-surface-base/85 backdrop-blur-xl border-b border-surface-hairline px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-surface-overlay border border-surface-hairline text-ink-primary cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-ink-muted uppercase hidden sm:inline-block">
                {trip.destination}
              </span>
              <span className="text-ink-muted text-xs hidden sm:inline-block">•</span>
              <span className="text-sm font-bold text-ink-primary capitalize">
                {activeTab.replace('-', ' ')}
              </span>

              {onGoToLanding && (
                <button
                  onClick={onGoToLanding}
                  title="Log Out to Homepage"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-overlay hover:bg-rose-500/15 border border-surface-hairline hover:border-rose-500/30 text-xs font-medium text-ink-secondary hover:text-rose-300 transition-colors cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5 text-ink-muted group-hover:text-rose-300" />
                  <span className="hidden sm:inline">Log Out</span>
                </button>
              )}
            </div>

            {/* Zero-Sum Audit Verified Ticker */}
            <div className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Net 0.00 Verified</span>
            </div>
          </div>

          {/* Right Action & Balance Telemetry */}
          <div className="flex items-center gap-2.5">
            {/* Personal Position Chip */}
            <div
              onClick={() => onOpenExplainBalance && onOpenExplainBalance(currentUserId)}
              className={`px-3 py-1 rounded-lg border text-xs flex items-center gap-2 cursor-pointer transition-colors ${
                netAmount > 0
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'
                  : netAmount < 0
                  ? 'bg-rose-500/10 border-rose-500/25 text-rose-400 hover:bg-rose-500/20'
                  : 'bg-surface-overlay border-surface-hairline text-ink-secondary hover:text-ink-primary'
              }`}
              title="Click to view full AI balance breakdown"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span className="font-numeric font-bold">
                {netAmount > 0 ? '+' : netAmount < 0 ? '-' : ''}₹
                {Math.abs(netAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] font-mono uppercase opacity-75 hidden sm:inline">
                {netAmount > 0 ? 'Surplus' : netAmount < 0 ? 'Payable' : 'Settled'}
              </span>
            </div>

            {/* Share Trip Button */}
            <LiquidGlassButton
              variant="glass"
              size="sm"
              onClick={onOpenShareTrip}
              icon={<Share2 className="w-3.5 h-3.5 text-ink-muted" />}
            >
              <span className="hidden sm:inline">Share Trip</span>
            </LiquidGlassButton>

            {/* Mobile Profile Avatar */}
            <button
              onClick={onOpenAccountSwitcher}
              className="lg:hidden p-0.5 rounded-full cursor-pointer"
            >
              <UserAvatar
                name={currentUser?.name}
                id={currentUser?.id}
                avatarUrl={currentUser?.avatarUrl}
                size="xs"
              />
            </button>
          </div>
        </header>

        {/* Mobile Navigation & Tool Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-surface-raised border-b border-surface-hairline px-4 py-4 space-y-4 z-40 max-h-[80vh] overflow-y-auto"
            >
              {/* Trip & Member Header in Mobile Drawer */}
              <div className="flex items-center justify-between pb-3 border-b border-surface-hairline">
                <div className="flex items-center gap-2.5">
                  <UserAvatar
                    name={currentUser?.name}
                    id={currentUser?.id}
                    avatarUrl={currentUser?.avatarUrl}
                    size="sm"
                  />
                  <div>
                    <span className="text-xs font-bold text-ink-primary block">{currentUser?.name}</span>
                    <span className="text-[10px] text-ink-muted font-mono">{trip.title} ({trip.inviteCode})</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenAccountSwitcher();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-surface-overlay text-[11px] font-semibold text-ink-secondary hover:text-ink-primary border border-surface-hairline"
                  >
                    Switch User
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenTripSwitcher();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-surface-overlay text-[11px] font-semibold text-emerald-400 border border-surface-hairline"
                  >
                    Trips
                  </button>
                </div>
              </div>

              {/* Fast Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAddExpense();
                  }}
                  className="p-2.5 rounded-xl bg-white text-black font-bold text-xs flex items-center justify-center gap-2 shadow-subtle cursor-pointer hover:bg-neutral-200 transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Log Expense</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAddBooking();
                  }}
                  className="p-2.5 rounded-xl bg-surface-overlay border border-surface-hairline font-semibold text-xs text-ink-primary flex items-center justify-center gap-2 hover:bg-surface-hairline transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-accent-cyan" />
                  <span>New Booking</span>
                </button>
              </div>

              {/* Navigation Tabs Grid */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-ink-muted block px-1">
                  Workspace Sections
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`p-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                        activeTab === item.id
                          ? 'bg-ink-primary text-surface-base font-bold shadow-subtle'
                          : 'bg-surface-overlay text-ink-secondary hover:text-ink-primary border border-surface-hairline/60'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.count !== undefined && <span className="font-mono text-[10px] opacity-80">{item.count}</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Precision Ledger Tools (100% Mobile Access) */}
              <div className="space-y-1.5 pt-2 border-t border-surface-hairline">
                <span className="text-[10px] font-mono uppercase tracking-widest text-ink-muted block px-1">
                  Precision Ledger Tools
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {onOpenWhatIf && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenWhatIf();
                      }}
                      className="p-2.5 rounded-xl bg-surface-overlay border border-surface-hairline text-left text-xs hover:border-emerald-500/40 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span className="truncate">What-If Simulator</span>
                    </button>
                  )}

                  {onOpenRoomOptimizer && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenRoomOptimizer();
                      }}
                      className="p-2.5 rounded-xl bg-surface-overlay border border-surface-hairline text-left text-xs hover:border-accent-cyan/40 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5 text-accent-cyan shrink-0" />
                      <span className="truncate">Room Allocator</span>
                    </button>
                  )}

                  {onOpenSettlementReport && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenSettlementReport();
                      }}
                      className="p-2.5 rounded-xl bg-surface-overlay border border-surface-hairline text-left text-xs hover:border-emerald-500/40 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">Settlement Audit PDF</span>
                    </button>
                  )}

                  {onOpenChaosDemo && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenChaosDemo();
                      }}
                      className="p-2.5 rounded-xl bg-surface-overlay border border-surface-hairline text-left text-xs hover:border-rose-500/40 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">Chaos Demo Suite</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Utility Row: Offline mode and return home */}
              <div className="flex items-center justify-between pt-2 border-t border-surface-hairline text-xs">
                <button
                  onClick={onToggleOffline}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-all ${
                    isOffline
                      ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                      : 'border-surface-hairline bg-surface-overlay text-ink-muted'
                  }`}
                >
                  {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{isOffline ? 'Offline Mode Active' : 'Online Sync Active'}</span>
                </button>

                {onGoToLanding && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onGoToLanding();
                    }}
                    className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-medium transition-colors"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Canvas Scroll Area */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6 pb-24 lg:pb-8">
          {children}
        </main>

        {/* Mobile Sticky Bottom Action Bar (100% Mobile Reachability) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-base/95 backdrop-blur-xl border-t border-surface-hairline px-3 py-2 flex items-center justify-around shadow-2xl">
          <button
            onClick={() => onTabChange('overview')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'overview' ? 'text-emerald-400 font-bold' : 'text-ink-muted hover:text-ink-primary'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[10px]">Overview</span>
          </button>

          <button
            onClick={() => onTabChange('expenses')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'expenses' ? 'text-emerald-400 font-bold' : 'text-ink-muted hover:text-ink-primary'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span className="text-[10px]">Ledger</span>
          </button>

          {/* Centered Elevated Quick Log Button */}
          <button
            onClick={onOpenAddExpense}
            className="p-3 -mt-5 rounded-full bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition-transform active:scale-95 cursor-pointer flex items-center justify-center border-2 border-surface-base"
            title="Log New Expense"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
          </button>

          <button
            onClick={() => onTabChange('settlement')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'settlement' ? 'text-emerald-400 font-bold' : 'text-ink-muted hover:text-ink-primary'
            }`}
          >
            <GitCommit className="w-4 h-4" />
            <span className="text-[10px]">Settle</span>
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
              isMobileMenuOpen ? 'text-emerald-400 font-bold' : 'text-ink-muted hover:text-ink-primary'
            }`}
          >
            <MoreHorizontal className="w-4 h-4" />
            <span className="text-[10px]">More</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
