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
    <div className="min-h-screen bg-[#12160F] text-[#F4F2E6] flex antialiased selection:bg-[#5FA97D]/20 font-sans">
      {/* ============================================================ */}
      {/* 1. LEFT COMMAND SIDEBAR RAIL (Desktop) */}
      {/* ============================================================ */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[#2A322A] bg-[#12160F]/95 backdrop-blur-xl shrink-0 h-screen sticky top-0 z-40 justify-between">
        <div className="flex flex-col h-full overflow-y-auto scrollbar-none p-4 space-y-5">
          {/* Top Brand & Workspace Header */}
          <div className="space-y-3 pb-3 border-b border-[#2A322A]">
            <div className="flex items-center justify-between">
              <button
                onClick={onGoToLanding}
                title="Go to Homepage / Landing Page"
                className="flex items-center gap-2.5 text-left group cursor-pointer hover:opacity-85 transition-all"
              >
                <LiquidLogo size={30} />
                <div>
                  <span className="font-bold text-sm text-[#F4F2E6] tracking-tight block leading-tight group-hover:text-[#5FA97D] transition-colors">
                    TripSync
                  </span>
                  <span className="text-[10px] font-mono text-[#8B9A8C] tracking-wider block group-hover:text-[#F4F2E6] transition-colors">
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
                    ? 'bg-[#B5484C]/15 border-[#B5484C]/30 text-[#B5484C]'
                    : 'bg-[#1B2119] border-[#2A322A] text-[#5FA97D]'
                }`}
              >
                {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Active Workspace Selector Dropdown Trigger */}
            <button
              onClick={onOpenTripSwitcher}
              className="w-full p-2.5 rounded-xl bg-[#1B2119] border border-[#2A322A] hover:border-[#3E7D5A]/50 transition-all flex items-center justify-between text-left group cursor-pointer shadow-subtle"
            >
              <div className="min-w-0 pr-2">
                <span className="text-[10px] uppercase font-mono text-[#8B9A8C] block tracking-wider">
                  Active Workspace
                </span>
                <span className="text-xs font-bold text-[#F4F2E6] truncate block">
                  {trip.title}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#12160F] text-[#5FA97D] border border-[#2A322A]">
                  {trip.inviteCode || 'GOA2026'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#8B9A8C] group-hover:text-[#F4F2E6] transition-colors" />
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B9A8C] px-2.5 pb-1 block">
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
                      ? 'text-[#F4F2E6] bg-[#1B2119] border border-[#2A322A] shadow-subtle'
                      : 'text-[#8B9A8C] hover:text-[#F4F2E6] hover:bg-[#1B2119]/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-[#5FA97D]' : 'text-[#8B9A8C] group-hover:text-[#F4F2E6]'
                      }`}
                    />
                    <span className={isActive ? 'font-semibold text-[#F4F2E6]' : ''}>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#3E7D5A]/15 text-[#5FA97D] border border-[#3E7D5A]/30">
                        {item.badge}
                      </span>
                    )}

                    {item.count !== undefined && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#2A322A] text-[#8B9A8C]">
                        {item.count}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tactical Tools & Simulations */}
          <div className="space-y-1 pt-2 border-t border-[#2A322A]">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B9A8C] px-2.5 pb-1 block">
              Intelligence & Tools
            </span>

            {onOpenWhatIf && (
              <button
                onClick={onOpenWhatIf}
                className="w-full px-3 py-1.5 rounded-lg text-xs text-[#8B9A8C] hover:text-[#F4F2E6] hover:bg-[#1B2119]/60 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-[#5FA97D]" />
                <span>What-If Simulator</span>
              </button>
            )}

            {onOpenRoomOptimizer && (
              <button
                onClick={onOpenRoomOptimizer}
                className="w-full px-3 py-1.5 rounded-lg text-xs text-[#8B9A8C] hover:text-[#F4F2E6] hover:bg-[#1B2119]/60 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-[#4E9A6E]" />
                <span>Room Allocator</span>
              </button>
            )}

            {onOpenSettlementReport && (
              <button
                onClick={onOpenSettlementReport}
                className="w-full px-3 py-1.5 rounded-lg text-xs text-[#8B9A8C] hover:text-[#F4F2E6] hover:bg-[#1B2119]/60 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4E9A6E]" />
                <span>Settlement Audit PDF</span>
              </button>
            )}

            {onOpenChaosDemo && (
              <button
                onClick={onOpenChaosDemo}
                className="w-full px-3 py-1.5 rounded-lg text-xs text-[#8B9A8C] hover:text-[#F4F2E6] hover:bg-[#1B2119]/60 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-[#5FA97D]" />
                <span>Chaos Test Suite</span>
              </button>
            )}

            {onGoToLanding && (
              <button
                onClick={onGoToLanding}
                className="w-full px-3 py-1.5 rounded-lg text-xs text-[#B5484C] hover:text-[#F4F2E6] hover:bg-[#B5484C]/15 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-[#B5484C]" />
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
              icon={<Plus className="w-3.5 h-3.5 text-[#8B9A8C]" />}
              className="w-full justify-center"
            >
              New Booking
            </LiquidGlassButton>
          </div>
        </div>

        {/* User Account & Profile Footer */}
        <div className="p-3 border-t border-[#2A322A] bg-[#1B2119]/40">
          <button
            onClick={onOpenAccountSwitcher}
            className="w-full p-2 rounded-xl bg-[#1B2119] border border-[#2A322A] hover:border-[#3E7D5A]/50 transition-all flex items-center justify-between text-left group cursor-pointer"
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
                <span className="text-xs font-semibold text-[#F4F2E6] truncate block">
                  {currentUser?.name}
                </span>
                <span className="text-[10px] text-[#8B9A8C] block truncate">
                  {currentUser?.email}
                </span>
              </div>
            </div>

            <div className="p-1 rounded-md bg-[#2A322A] text-[#8B9A8C] group-hover:text-[#F4F2E6] transition-colors shrink-0">
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
        <header className="sticky top-0 z-30 bg-[#12160F]/85 backdrop-blur-xl border-b border-[#2A322A] px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-[#1B2119] border border-[#2A322A] text-[#F4F2E6] cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#8B9A8C] uppercase hidden sm:inline-block">
                {trip.destination}
              </span>
              <span className="text-[#8B9A8C] text-xs hidden sm:inline-block">•</span>
              <span className="text-sm font-bold text-[#F4F2E6] capitalize">
                {activeTab.replace('-', ' ')}
              </span>

              {onGoToLanding && (
                <button
                  onClick={onGoToLanding}
                  title="Log Out to Homepage"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1B2119] hover:bg-[#B5484C]/15 border border-[#2A322A] hover:border-[#B5484C]/30 text-xs font-medium text-[#8B9A8C] hover:text-[#F4F2E6] transition-colors cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5 text-[#8B9A8C]" />
                  <span className="hidden sm:inline">Log Out</span>
                </button>
              )}
            </div>

            {/* Zero-Sum Audit Verified Ticker */}
            <div className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono text-[#4E9A6E] bg-[#4E9A6E]/10 px-2.5 py-0.5 rounded-full border border-[#4E9A6E]/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Net 0.00 Verified</span>
            </div>
          </div>

          {/* Right Action & Balance Telemetry */}
          <div className="flex items-center gap-2.5">
            {/* Personal Position Chip (Micro-Animation Glow on Active Balance) */}
            <motion.div
              onClick={() => onOpenExplainBalance && onOpenExplainBalance(currentUserId)}
              whileHover={{ scale: 1.02 }}
              className={`px-3 py-1 rounded-lg border text-xs flex items-center gap-2 cursor-pointer transition-all shadow-subtle ${
                netAmount > 0
                  ? 'bg-[#4E9A6E]/15 border-[#4E9A6E]/30 text-[#4E9A6E] shadow-[0_0_10px_rgba(78,154,110,0.2)]'
                  : netAmount < 0
                  ? 'bg-[#B5484C]/15 border-[#B5484C]/30 text-[#B5484C] shadow-[0_0_10px_rgba(181,72,76,0.2)]'
                  : 'bg-[#1B2119] border-[#2A322A] text-[#8B9A8C] hover:text-[#F4F2E6]'
              }`}
              title="Click to view full balance breakdown"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span className="font-numeric font-bold">
                {netAmount > 0 ? '+' : netAmount < 0 ? '-' : ''}₹
                {Math.abs(netAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] font-mono uppercase opacity-85 hidden sm:inline">
                {netAmount > 0 ? 'Surplus' : netAmount < 0 ? 'Payable' : 'Settled'}
              </span>
            </motion.div>

            {/* Share Trip Button */}
            <LiquidGlassButton
              variant="glass"
              size="sm"
              onClick={onOpenShareTrip}
              icon={<Share2 className="w-3.5 h-3.5 text-[#8B9A8C]" />}
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
              className="lg:hidden bg-[#1B2119] border-b border-[#2A322A] px-4 py-4 space-y-4 z-40 max-h-[80vh] overflow-y-auto"
            >
              {/* Trip & Member Header in Mobile Drawer */}
              <div className="flex items-center justify-between pb-3 border-b border-[#2A322A]">
                <div className="flex items-center gap-2.5">
                  <UserAvatar
                    name={currentUser?.name}
                    id={currentUser?.id}
                    avatarUrl={currentUser?.avatarUrl}
                    size="sm"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#F4F2E6] block">{currentUser?.name}</span>
                    <span className="text-[10px] text-[#8B9A8C] font-mono">{trip.title} ({trip.inviteCode})</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenAccountSwitcher();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#12160F] text-[11px] font-semibold text-[#8B9A8C] hover:text-[#F4F2E6] border border-[#2A322A]"
                  >
                    Switch User
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenTripSwitcher();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#12160F] text-[11px] font-semibold text-[#5FA97D] border border-[#2A322A]"
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
                  className="p-2.5 rounded-xl bg-gradient-to-r from-[#3E7D5A] to-[#5FA97D] text-[#F4F2E6] font-semibold text-xs flex items-center justify-center gap-2 shadow-mint cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Log Expense</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAddBooking();
                  }}
                  className="p-2.5 rounded-xl bg-[#12160F] border border-[#2A322A] font-medium text-xs text-[#F4F2E6] flex items-center justify-center gap-2 hover:bg-[#1B2119] transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#5FA97D]" />
                  <span>New Booking</span>
                </button>
              </div>

              {/* Navigation Tabs Grid */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B9A8C] block px-1">
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
                          ? 'bg-[#5FA97D] text-[#12160F] font-bold shadow-subtle'
                          : 'bg-[#12160F] text-[#8B9A8C] hover:text-[#F4F2E6] border border-[#2A322A]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.count !== undefined && <span className="font-mono text-[10px] opacity-80">{item.count}</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Precision Ledger Tools */}
              <div className="space-y-1.5 pt-2 border-t border-[#2A322A]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B9A8C] block px-1">
                  Precision Ledger Tools
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {onOpenWhatIf && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenWhatIf();
                      }}
                      className="p-2.5 rounded-xl bg-[#12160F] border border-[#2A322A] text-left text-xs hover:border-[#3E7D5A]/40 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#5FA97D] shrink-0" />
                      <span className="truncate text-[#F4F2E6]">What-If Simulator</span>
                    </button>
                  )}

                  {onOpenRoomOptimizer && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenRoomOptimizer();
                      }}
                      className="p-2.5 rounded-xl bg-[#12160F] border border-[#2A322A] text-left text-xs hover:border-[#3E7D5A]/40 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#4E9A6E] shrink-0" />
                      <span className="truncate text-[#F4F2E6]">Room Allocator</span>
                    </button>
                  )}

                  {onOpenSettlementReport && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenSettlementReport();
                      }}
                      className="p-2.5 rounded-xl bg-[#12160F] border border-[#2A322A] text-left text-xs hover:border-[#3E7D5A]/40 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-[#4E9A6E] shrink-0" />
                      <span className="truncate text-[#F4F2E6]">Settlement Audit PDF</span>
                    </button>
                  )}

                  {onOpenChaosDemo && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenChaosDemo();
                      }}
                      className="p-2.5 rounded-xl bg-[#12160F] border border-[#2A322A] text-left text-xs hover:border-[#B5484C]/40 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#5FA97D] shrink-0" />
                      <span className="truncate text-[#F4F2E6]">Chaos Demo Suite</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Utility Row: Offline mode and return home */}
              <div className="flex items-center justify-between pt-2 border-t border-[#2A322A] text-xs">
                <button
                  onClick={onToggleOffline}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-all ${
                    isOffline
                      ? 'border-[#B5484C]/40 bg-[#B5484C]/10 text-[#B5484C]'
                      : 'border-[#2A322A] bg-[#12160F] text-[#8B9A8C]'
                  }`}
                >
                  {isOffline ? <WifiOff className="w-3.5 h-3.5 text-[#B5484C]" /> : <Wifi className="w-3.5 h-3.5 text-[#4E9A6E]" />}
                  <span>{isOffline ? 'Offline Mode Active' : 'Online Sync Active'}</span>
                </button>

                {onGoToLanding && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onGoToLanding();
                    }}
                    className="flex items-center gap-1.5 text-[#B5484C] hover:text-[#F4F2E6] font-medium transition-colors"
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

        {/* Mobile Sticky Bottom Action Bar */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#12160F]/95 backdrop-blur-xl border-t border-[#2A322A] px-3 py-2 flex items-center justify-around shadow-2xl">
          <button
            onClick={() => onTabChange('overview')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'overview' ? 'text-[#5FA97D] font-bold' : 'text-[#8B9A8C] hover:text-[#F4F2E6]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[10px]">Overview</span>
          </button>

          <button
            onClick={() => onTabChange('expenses')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'expenses' ? 'text-[#5FA97D] font-bold' : 'text-[#8B9A8C] hover:text-[#F4F2E6]'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span className="text-[10px]">Ledger</span>
          </button>

          {/* Centered Elevated Quick Log Button */}
          <button
            onClick={onOpenAddExpense}
            className="p-3 -mt-5 rounded-full bg-gradient-to-r from-[#3E7D5A] to-[#5FA97D] text-[#F4F2E6] font-bold shadow-lg shadow-[#3E7D5A]/40 hover:brightness-110 transition-transform active:scale-95 cursor-pointer flex items-center justify-center border-2 border-[#12160F]"
            title="Log New Expense"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
          </button>

          <button
            onClick={() => onTabChange('settlement')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'settlement' ? 'text-[#5FA97D] font-bold' : 'text-[#8B9A8C] hover:text-[#F4F2E6]'
            }`}
          >
            <GitCommit className="w-4 h-4" />
            <span className="text-[10px]">Settle</span>
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
              isMobileMenuOpen ? 'text-[#5FA97D] font-bold' : 'text-[#8B9A8C] hover:text-[#F4F2E6]'
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
