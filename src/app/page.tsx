'use client';

import React, { useState } from 'react';
import {
  INITIAL_TRIP,
  INITIAL_PARTICIPANTS,
  INITIAL_BOOKINGS,
  INITIAL_EXPENSES,
  INITIAL_PAYMENTS,
  INITIAL_EVENTS,
  INITIAL_VENDORS,
  INITIAL_REFUNDS,
} from '@/lib/mock-data';
import {
  Trip,
  Participant,
  Booking,
  Expense,
  Payment,
  LedgerEvent,
  SplitMethod,
  BookingCategory,
  Vendor,
  RefundEvent,
  RefundPolicy,
} from '@/lib/types';
import { computeNetBalances, simplifyDebts, calculateSplits, processBookingCancellation } from '@/lib/ledger-engine';
import { Header } from '@/components/Header';
import { Navigation, TabType } from '@/components/Navigation';
import { OverviewSection } from '@/components/OverviewSection';
import { ItineraryGraph } from '@/components/ItineraryGraph';
import { ParticipantsSection } from '@/components/ParticipantsSection';
import { ExpensesSection } from '@/components/ExpensesSection';
import { DynamicSplitDrawer } from '@/components/DynamicSplitDrawer';
import { SettlementVisualizer } from '@/components/SettlementVisualizer';
import { ActivityLogSection } from '@/components/ActivityLogSection';
import { AddBookingModal } from '@/components/AddBookingModal';
import { CancelBookingModal } from '@/components/CancelBookingModal';
import { EditBookingModal } from '@/components/EditBookingModal';
import { VendorSummaryModal } from '@/components/VendorSummaryModal';
import { LandingPage } from '@/components/LandingPage';
import { CreateTripModal } from '@/components/CreateTripModal';
import { JoinTripModal } from '@/components/JoinTripModal';
import { TripSwitcherModal } from '@/components/TripSwitcherModal';
import { AuthModal } from '@/components/AuthModal';
import { UpiSetupModal } from '@/components/UpiSetupModal';
import { FloatingDock } from '@/components/FloatingDock';
import { logEventToNeon, saveRefundToNeon, updateBookingInNeon } from '@/lib/db';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');

  // Multi-Trip State Management
  const [trips, setTrips] = useState<Trip[]>([INITIAL_TRIP]);
  const [activeTripId, setActiveTripId] = useState<string>(INITIAL_TRIP.id);

  const [participantsMap, setParticipantsMap] = useState<Record<string, Participant[]>>({
    [INITIAL_TRIP.id]: INITIAL_PARTICIPANTS,
  });
  const [bookingsMap, setBookingsMap] = useState<Record<string, Booking[]>>({
    [INITIAL_TRIP.id]: INITIAL_BOOKINGS,
  });
  const [expensesMap, setExpensesMap] = useState<Record<string, Expense[]>>({
    [INITIAL_TRIP.id]: INITIAL_EXPENSES,
  });
  const [paymentsMap, setPaymentsMap] = useState<Record<string, Payment[]>>({
    [INITIAL_TRIP.id]: INITIAL_PAYMENTS,
  });
  const [eventsMap, setEventsMap] = useState<Record<string, LedgerEvent[]>>({
    [INITIAL_TRIP.id]: INITIAL_EVENTS,
  });
  const [vendorsMap, setVendorsMap] = useState<Record<string, Vendor[]>>({
    [INITIAL_TRIP.id]: INITIAL_VENDORS,
  });
  const [refundsMap, setRefundsMap] = useState<Record<string, RefundEvent[]>>({
    [INITIAL_TRIP.id]: INITIAL_REFUNDS,
  });

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [currentUserId, setCurrentUserId] = useState<string>('p1');

  // Modals
  const [isSplitDrawerOpen, setIsSplitDrawerOpen] = useState<boolean>(false);
  const [isAddBookingOpen, setIsAddBookingOpen] = useState<boolean>(false);
  const [isCreateTripOpen, setIsCreateTripOpen] = useState<boolean>(false);
  const [isJoinTripOpen, setIsJoinTripOpen] = useState<boolean>(false);
  const [isTripSwitcherOpen, setIsTripSwitcherOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isUpiSetupOpen, setIsUpiSetupOpen] = useState<boolean>(false);

  // Phase 1 New Modals State
  const [isVendorsOpen, setIsVendorsOpen] = useState<boolean>(false);
  const [isCancelBookingOpen, setIsCancelBookingOpen] = useState<boolean>(false);
  const [isEditBookingOpen, setIsEditBookingOpen] = useState<boolean>(false);
  const [activeBookingToCancel, setActiveBookingToCancel] = useState<Booking | null>(null);
  const [activeBookingToEdit, setActiveBookingToEdit] = useState<Booking | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Current active trip entities
  const trip = trips.find((t) => t.id === activeTripId) || trips[0];
  const participants = participantsMap[trip.id] || [];
  const bookings = bookingsMap[trip.id] || [];
  const expenses = expensesMap[trip.id] || [];
  const payments = paymentsMap[trip.id] || [];
  const events = eventsMap[trip.id] || [];
  const vendors = vendorsMap[trip.id] || [];
  const refunds = refundsMap[trip.id] || [];

  const activeParticipants = participants.filter((p) => p.status === 'active');
  const netBalances = computeNetBalances(activeParticipants, expenses, payments, refunds, bookings);
  const currentUser = participants.find((p) => p.id === currentUserId) || participants[0];

  const simplifiedDebts = simplifyDebts(netBalances).map((d) => {
    const payee = participants.find((p) => p.id === d.toId);
    return {
      ...d,
      payeeQrCodeUrl: payee?.qrCodeUrl,
    };
  });

  const isSettled = simplifiedDebts.length === 0 && expenses.length > 0;

  const recordEvent = (eventType: any, description: string, payload: any) => {
    const actor = participants.find((p) => p.id === currentUserId);
    const newEvt: LedgerEvent = {
      id: 'evt-' + Date.now(),
      tripId: trip.id,
      eventType,
      actorId: currentUserId,
      actorName: actor?.name || 'User',
      timestamp: new Date().toISOString(),
      description,
      payload,
      sequenceNum: events.length + 1,
    };

    setEventsMap((prev) => ({
      ...prev,
      [trip.id]: [newEvt, ...(prev[trip.id] || [])],
    }));

    logEventToNeon(trip.id, eventType, currentUserId, payload);
  };

  // Creator-First Trip Creation
  const handleCreateTrip = (
    creator: {
      name: string;
      email: string;
      upiId: string;
    },
    tripData: {
      title: string;
      destination: string;
      startDate: string;
      endDate: string;
      budgetCeiling: number;
    },
    initialParticipants: Array<{
      name: string;
      email: string;
      upiId: string;
      roomTier: 'suite' | 'standard' | 'economy';
    }>
  ) => {
    const newTripId = 'trip-' + Date.now();
    const creatorId = 'p-creator-' + Date.now();

    // Generate unique 6-character Invite Code (e.g. MANALI88)
    const codePrefix = tripData.destination.replace(/[^A-Z]/gi, '').slice(0, 3).toUpperCase() || 'TRIP';
    const inviteCode = `${codePrefix}${Math.floor(100 + Math.random() * 900)}`;

    const newTrip: Trip = {
      id: newTripId,
      title: tripData.title,
      destination: tripData.destination,
      baseCurrency: 'INR',
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      budgetCeiling: tripData.budgetCeiling,
      inviteCode,
      organizerId: creatorId,
      createdAt: new Date().toISOString(),
    };

    const creatorParticipant: Participant = {
      id: creatorId,
      tripId: newTripId,
      name: creator.name,
      email: creator.email,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      isOrganizer: true,
      status: 'active',
      upiId: creator.upiId,
      weight: 1,
      roomTier: 'suite',
    };

    const memberParticipants: Participant[] = initialParticipants.map((p, idx) => ({
      id: `p-member-${idx + 1}-${Date.now()}`,
      tripId: newTripId,
      name: p.name,
      email: p.email,
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + idx * 10000}?w=150&auto=format&fit=crop&q=80`,
      isOrganizer: false,
      status: 'active',
      upiId: p.upiId,
      weight: 1,
      roomTier: p.roomTier,
    }));

    const allParts = [creatorParticipant, ...memberParticipants];

    setTrips((prev) => [newTrip, ...prev]);
    setActiveTripId(newTripId);
    setParticipantsMap((prev) => ({ ...prev, [newTripId]: allParts }));
    setBookingsMap((prev) => ({ ...prev, [newTripId]: [] }));
    setExpensesMap((prev) => ({ ...prev, [newTripId]: [] }));
    setPaymentsMap((prev) => ({ ...prev, [newTripId]: [] }));

    const initEvt: LedgerEvent = {
      id: 'evt-1',
      tripId: newTripId,
      eventType: 'TRIP_CREATED',
      actorId: creatorId,
      actorName: creator.name,
      timestamp: new Date().toISOString(),
      description: `Initialized new trip "${newTrip.title}" by organizer ${creator.name}. Invite Code: ${inviteCode}.`,
      payload: { budget: newTrip.budgetCeiling, inviteCode },
      sequenceNum: 1,
    };
    setEventsMap((prev) => ({ ...prev, [newTripId]: [initEvt] }));

    setCurrentUserId(creatorId);
    setViewMode('app');
    setActiveTab('overview');
    triggerToast(`Created trip "${newTrip.title}"! Share code: ${inviteCode}`);
  };

  // Join Trip via Invite Code
  const handleJoinTrip = (
    inviteCode: string,
    travelerName: string,
    travelerEmail: string,
    upiId: string
  ): boolean => {
    const targetTrip = trips.find((t) => t.inviteCode.toUpperCase() === inviteCode.toUpperCase());
    if (!targetTrip) return false;

    const newPartId = 'p-joined-' + Date.now();
    const newPart: Participant = {
      id: newPartId,
      tripId: targetTrip.id,
      name: travelerName,
      email: travelerEmail,
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?w=150&auto=format&fit=crop&q=80`,
      isOrganizer: false,
      status: 'active',
      upiId,
      weight: 1,
      roomTier: 'standard',
    };

    const updatedParts = [...(participantsMap[targetTrip.id] || []), newPart];

    setParticipantsMap((prev) => ({
      ...prev,
      [targetTrip.id]: updatedParts,
    }));

    // Auto-add new participant to general group bookings
    setBookingsMap((prev) => ({
      ...prev,
      [targetTrip.id]: (prev[targetTrip.id] || []).map((b) => ({
        ...b,
        participantIds: Array.from(new Set([...b.participantIds, newPartId])),
      })),
    }));

    setActiveTripId(targetTrip.id);
    setCurrentUserId(newPartId);
    setViewMode('app');
    setActiveTab('overview');

    recordEvent('TRIP_JOINED_VIA_CODE', `${travelerName} joined trip via Invite Code "${inviteCode}".`, {
      participantId: newPartId,
      inviteCode,
    });

    triggerToast(`Welcome to ${targetTrip.title}, ${travelerName}! Shares updated.`);
    return true;
  };

  const handleLogin = (participantId: string, email: string) => {
    setCurrentUserId(participantId);
    const user = participants.find((p) => p.id === participantId);
    recordEvent('USER_LOGGED_IN', `Member ${user?.name} logged into session.`, { participantId });
    triggerToast(`Welcome back, ${user?.name}!`);

    setTimeout(() => {
      setIsUpiSetupOpen(true);
    }, 400);
  };

  const handleRegister = (name: string, email: string, password: string) => {
    const newP: Participant = {
      id: 'p-' + Date.now(),
      tripId: trip.id,
      name,
      email,
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?w=150&auto=format&fit=crop&q=80`,
      isOrganizer: false,
      status: 'active',
      upiId: `${name.toLowerCase().replace(/\s+/g, '')}@upi`,
      passwordHash: password,
      weight: 1,
      roomTier: 'standard',
    };

    const updatedParts = [...(participantsMap[trip.id] || []), newP];

    setParticipantsMap((prev) => ({
      ...prev,
      [trip.id]: updatedParts,
    }));

    setBookingsMap((prev) => ({
      ...prev,
      [trip.id]: (prev[trip.id] || []).map((b) => ({
        ...b,
        participantIds: Array.from(new Set([...b.participantIds, newP.id])),
      })),
    }));

    setCurrentUserId(newP.id);
    recordEvent('PARTICIPANT_ADDED', `Registered member account for ${name}.`, { participantId: newP.id });
    triggerToast(`Account created for ${name}! Please configure your UPI ID.`);

    setTimeout(() => {
      setIsUpiSetupOpen(true);
    }, 400);
  };

  const handleSaveUpiDetails = (participantId: string, upiId: string, qrCodeUrl?: string) => {
    setParticipantsMap((prev) => ({
      ...prev,
      [trip.id]: (prev[trip.id] || []).map((p) => (p.id === participantId ? { ...p, upiId, qrCodeUrl } : p)),
    }));
    recordEvent('UPI_SETUP_UPDATED', `Updated UPI payment VPA & QR code for traveler.`, { participantId, upiId });
    triggerToast(`Updated UPI VPA to "${upiId}". Custom QR ready!`);
  };

  const handleAddParticipant = (name: string, email: string, isOrganizer: boolean) => {
    const newP: Participant = {
      id: 'p-' + Date.now(),
      tripId: trip.id,
      name,
      email,
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?w=150&auto=format&fit=crop&q=80`,
      isOrganizer,
      status: 'active',
      upiId: `${name.toLowerCase().replace(/\s+/g, '')}@upi`,
      weight: 1,
      roomTier: 'standard',
    };

    const updatedParts = [...(participantsMap[trip.id] || []), newP];

    setParticipantsMap((prev) => ({
      ...prev,
      [trip.id]: updatedParts,
    }));

    setBookingsMap((prev) => ({
      ...prev,
      [trip.id]: (prev[trip.id] || []).map((b) => ({
        ...b,
        participantIds: Array.from(new Set([...b.participantIds, newP.id])),
      })),
    }));

    recordEvent('PARTICIPANT_ADDED', `Added new participant ${name} to trip roster.`, { participantId: newP.id });
    triggerToast(`Added ${name} to roster. Balances & allocations recalculated!`);
  };

  const handleToggleParticipantStatus = (participantId: string) => {
    setParticipantsMap((prev) => ({
      ...prev,
      [trip.id]: (prev[trip.id] || []).map((p) =>
        p.id === participantId ? { ...p, status: p.status === 'active' ? 'removed' : 'active' } : p
      ),
    }));
    const target = participants.find((p) => p.id === participantId);
    recordEvent('PARTICIPANT_REMOVED', `Participant ${target?.name} status updated.`, { participantId });
    triggerToast(`Updated ${target?.name} status. Shares recalculated.`);
  };

  const handleUpdateParticipantWeight = (
    participantId: string,
    weight: number,
    roomTier: 'suite' | 'standard' | 'economy'
  ) => {
    setParticipantsMap((prev) => ({
      ...prev,
      [trip.id]: (prev[trip.id] || []).map((p) =>
        p.id === participantId ? { ...p, weight, roomTier } : p
      ),
    }));
    triggerToast(`Updated share configuration for traveler. Balances updated.`);
  };

  const handleSubmitExpense = (data: {
    title: string;
    totalAmount: number;
    splitMethod: SplitMethod;
    paidById: string;
    bookingId?: string;
    category: BookingCategory;
    subsidyAmount?: number;
    receiptUrl?: string;
    receiptName?: string;
  }) => {
    const activeParts = participants.filter((p) => p.status === 'active');
    const allocations = calculateSplits(data.totalAmount, data.splitMethod, activeParts, {
      subsidyAmount: data.subsidyAmount,
    });

    const newExpense: Expense = {
      id: 'e-' + Date.now(),
      tripId: trip.id,
      bookingId: data.bookingId,
      title: data.title,
      totalAmount: data.totalAmount,
      currency: 'INR',
      splitMethod: data.splitMethod,
      paidById: data.paidById,
      category: data.category,
      createdAt: new Date().toISOString(),
      allocations,
      subsidyAmount: data.subsidyAmount,
      receiptUrl: data.receiptUrl,
      receiptName: data.receiptName,
    };

    setExpensesMap((prev) => ({
      ...prev,
      [trip.id]: [newExpense, ...(prev[trip.id] || [])],
    }));

    if (data.bookingId) {
      setBookingsMap((prev) => ({
        ...prev,
        [trip.id]: (prev[trip.id] || []).map((b) =>
          b.id === data.bookingId ? { ...b, actualCost: b.actualCost + data.totalAmount } : b
        ),
      }));
    }

    recordEvent(
      'EXPENSE_LOGGED',
      `Logged expense "${data.title}" (₹${data.totalAmount.toFixed(2)}) via ${data.splitMethod} split rule with receipt proof.`,
      { expenseId: newExpense.id, amount: data.totalAmount }
    );

    triggerToast(`Logged "${data.title}". Balances recalculated across ${allocations.length} participants.`);
  };

  const handleAddBooking = (data: {
    category: BookingCategory;
    title: string;
    vendor: string;
    estimatedCost: number;
    actualCost: number;
    participantIds: string[];
  }) => {
    const newBooking: Booking = {
      id: 'b-' + Date.now(),
      tripId: trip.id,
      category: data.category,
      title: data.title,
      vendor: data.vendor,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      estimatedCost: data.estimatedCost,
      actualCost: data.actualCost,
      status: 'confirmed',
      participantIds: data.participantIds,
    };

    setBookingsMap((prev) => ({
      ...prev,
      [trip.id]: [...(prev[trip.id] || []), newBooking],
    }));
    recordEvent('BOOKING_CREATED', `Added booking "${data.title}" to itinerary.`, { bookingId: newBooking.id });
    triggerToast(`Added booking "${data.title}" to itinerary graph.`);
  };

  const handleSettleDebt = (fromId: string, toId: string, amount: number) => {
    const newPayment: Payment = {
      id: 'pay-' + Date.now(),
      tripId: trip.id,
      payerId: fromId,
      payeeId: toId,
      amount,
      note: 'UPI Payment confirmed via Debt Engine',
      createdAt: new Date().toISOString(),
    };

    setPaymentsMap((prev) => ({
      ...prev,
      [trip.id]: [...(prev[trip.id] || []), newPayment],
    }));

    const payer = participants.find((p) => p.id === fromId);
    const payee = participants.find((p) => p.id === toId);

    recordEvent(
      'SETTLEMENT_CONFIRMED',
      `Recorded payment of ₹${amount.toFixed(2)} from ${payer?.name} to ${payee?.name} via UPI.`,
      { payerId: fromId, payeeId: toId, amount }
    );

    triggerToast(`UPI Settlement payment of ₹${amount.toFixed(2)} recorded!`);
  };

  const handleConfirmCancelBooking = (
    bookingId: string,
    policy: RefundPolicy,
    refundPercent: number,
    reason: string
  ) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (!targetBooking) return;

    const bookingExpenses = expenses.filter((e) => e.bookingId === bookingId);
    const generatedRefunds = processBookingCancellation(
      targetBooking,
      bookingExpenses,
      policy,
      refundPercent,
      undefined,
      reason
    );

    const totalRefundAmt = generatedRefunds.reduce((sum, r) => sum + r.amount, 0);

    setBookingsMap((prev) => ({
      ...prev,
      [trip.id]: (prev[trip.id] || []).map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'cancelled',
              refundPolicy: policy,
              cancellationReason: reason,
              refundAmount: totalRefundAmt,
            }
          : b
      ),
    }));

    if (generatedRefunds.length > 0) {
      setRefundsMap((prev) => ({
        ...prev,
        [trip.id]: [...(prev[trip.id] || []), ...generatedRefunds],
      }));

      generatedRefunds.forEach((ref) => saveRefundToNeon(ref));

      recordEvent(
        'REFUND_CREDITED',
        `Credited ₹${totalRefundAmt.toFixed(2)} vendor refund for cancelled booking "${targetBooking.title}".`,
        { bookingId, refundCount: generatedRefunds.length, totalRefundAmt }
      );
    }

    updateBookingInNeon(bookingId, 'cancelled', policy, reason, totalRefundAmt);

    recordEvent(
      'BOOKING_CANCELLED',
      `Cancelled booking "${targetBooking.title}" under ${policy} refund policy (${refundPercent}%).`,
      { bookingId, policy, reason }
    );

    triggerToast(`Cancelled "${targetBooking.title}". Ledger re-derived with ₹${totalRefundAmt.toFixed(2)} refund!`);
  };

  const handleSaveBooking = (updatedFields: Partial<Booking> & { id: string }) => {
    setBookingsMap((prev) => ({
      ...prev,
      [trip.id]: (prev[trip.id] || []).map((b) =>
        b.id === updatedFields.id ? { ...b, ...updatedFields } : b
      ),
    }));

    if (updatedFields.status) {
      updateBookingInNeon(updatedFields.id, updatedFields.status);
    }

    const bTitle = updatedFields.title || bookings.find((b) => b.id === updatedFields.id)?.title;
    recordEvent('BOOKING_MODIFIED', `Revised rates & traveler roster for booking "${bTitle}".`, {
      bookingId: updatedFields.id,
      actualCost: updatedFields.actualCost,
    });

    triggerToast(`Revised booking "${bTitle}". Participant shares recalculated!`);
  };

  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage
          onEnterApp={() => setViewMode('app')}
          onOpenCreateTrip={() => setIsCreateTripOpen(true)}
          onOpenJoinTrip={() => setIsJoinTripOpen(true)}
        />

        <CreateTripModal
          isOpen={isCreateTripOpen}
          onClose={() => setIsCreateTripOpen(false)}
          onCreateTrip={handleCreateTrip}
        />

        <JoinTripModal
          isOpen={isJoinTripOpen}
          onClose={() => setIsJoinTripOpen(false)}
          onJoinTrip={handleJoinTrip}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-surface-base text-ink-primary font-sans">
      {/* Header with Balance Pill, Trip Switcher & User Switcher */}
      <Header
        trip={trip}
        participants={participants}
        currentUserId={currentUserId}
        onSelectUser={setCurrentUserId}
        netBalances={netBalances}
        isSettled={isSettled}
        onGoToLanding={() => setViewMode('landing')}
        onOpenCreateTrip={() => setIsCreateTripOpen(true)}
        onOpenJoinTrip={() => setIsJoinTripOpen(true)}
        onOpenTripSwitcher={() => setIsTripSwitcherOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenUpiSetup={() => setIsUpiSetupOpen(true)}
      />

      {/* Responsive Section Navigation Bar */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} eventCount={events.length} />

      {/* Main Animated Tab View Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + trip.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 'overview' && (
              <OverviewSection
                trip={trip}
                bookings={bookings}
                expenses={expenses}
                payments={payments}
                netBalances={netBalances}
                simplifiedDebts={simplifiedDebts}
                refunds={refunds}
                vendors={vendors}
                currentUserId={currentUserId}
                onOpenAddExpense={() => setIsSplitDrawerOpen(true)}
                onOpenAddBooking={() => setIsAddBookingOpen(true)}
                onOpenUpiSetup={() => setIsUpiSetupOpen(true)}
                onOpenVendors={() => setIsVendorsOpen(true)}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'itinerary' && (
              <ItineraryGraph
                bookings={bookings}
                participants={participants}
                expenses={expenses}
                onOpenAddBooking={() => setIsAddBookingOpen(true)}
                onOpenEditBooking={(b) => {
                  setActiveBookingToEdit(b);
                  setIsEditBookingOpen(true);
                }}
                onOpenCancelBooking={(b) => {
                  setActiveBookingToCancel(b);
                  setIsCancelBookingOpen(true);
                }}
                onOpenVendors={() => setIsVendorsOpen(true)}
              />
            )}

            {activeTab === 'participants' && (
              <ParticipantsSection
                participants={participants}
                netBalances={netBalances}
                onAddParticipant={handleAddParticipant}
                onToggleStatus={handleToggleParticipantStatus}
                onUpdateParticipantWeight={handleUpdateParticipantWeight}
              />
            )}

            {activeTab === 'expenses' && (
              <ExpensesSection
                expenses={expenses}
                participants={participants}
                bookings={bookings}
                refunds={refunds}
                onOpenAddExpense={() => setIsSplitDrawerOpen(true)}
              />
            )}

            {activeTab === 'settlement' && (
              <SettlementVisualizer
                participants={participants}
                netBalances={netBalances}
                simplifiedDebts={simplifiedDebts}
                currentUserId={currentUserId}
                onSettleDebt={handleSettleDebt}
                isSettled={isSettled}
              />
            )}

            {activeTab === 'activity' && <ActivityLogSection events={events} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Dynamic Split Engine Drawer */}
      <DynamicSplitDrawer
        isOpen={isSplitDrawerOpen}
        onClose={() => setIsSplitDrawerOpen(false)}
        participants={participants}
        bookings={bookings}
        onSubmitExpense={handleSubmitExpense}
      />

      {/* Add Booking Modal */}
      <AddBookingModal
        isOpen={isAddBookingOpen}
        onClose={() => setIsAddBookingOpen(false)}
        participants={participants}
        onAddBooking={handleAddBooking}
      />

      {/* Cancel Booking Modal */}
      <CancelBookingModal
        isOpen={isCancelBookingOpen}
        onClose={() => {
          setIsCancelBookingOpen(false);
          setActiveBookingToCancel(null);
        }}
        booking={activeBookingToCancel}
        expenses={expenses}
        participants={participants}
        onConfirmCancel={handleConfirmCancelBooking}
      />

      {/* Edit Booking Revision Modal */}
      <EditBookingModal
        isOpen={isEditBookingOpen}
        onClose={() => {
          setIsEditBookingOpen(false);
          setActiveBookingToEdit(null);
        }}
        booking={activeBookingToEdit}
        participants={participants}
        onSaveBooking={handleSaveBooking}
      />

      {/* Multi-Vendor Management Modal */}
      <VendorSummaryModal
        isOpen={isVendorsOpen}
        onClose={() => setIsVendorsOpen(false)}
        vendors={vendors}
        bookings={bookings}
      />

      {/* Create New Trip Wizard Modal */}
      <CreateTripModal
        isOpen={isCreateTripOpen}
        onClose={() => setIsCreateTripOpen(false)}
        onCreateTrip={handleCreateTrip}
      />

      {/* Join Trip via Code Modal */}
      <JoinTripModal
        isOpen={isJoinTripOpen}
        onClose={() => setIsJoinTripOpen(false)}
        onJoinTrip={handleJoinTrip}
      />

      {/* My Trips Switcher Drawer */}
      <TripSwitcherModal
        isOpen={isTripSwitcherOpen}
        onClose={() => setIsTripSwitcherOpen(false)}
        trips={trips}
        activeTripId={activeTripId}
        participantsMap={participantsMap}
        onSelectTrip={(id) => {
          setActiveTripId(id);
          const firstUser = participantsMap[id]?.[0]?.id;
          if (firstUser) setCurrentUserId(firstUser);
          triggerToast(`Switched active workspace to "${trips.find((t) => t.id === id)?.title}".`);
        }}
        onOpenCreateTrip={() => setIsCreateTripOpen(true)}
        onOpenJoinTrip={() => setIsJoinTripOpen(true)}
      />

      {/* Auth & Password Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        participants={participants}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      {/* Post-Login UPI VPA & QR Code Setup Modal */}
      <UpiSetupModal
        isOpen={isUpiSetupOpen}
        onClose={() => setIsUpiSetupOpen(false)}
        currentUser={currentUser}
        onSaveUpiDetails={handleSaveUpiDetails}
      />

      {/* Floating Quick Action Pill Dock */}
      <FloatingDock
        onOpenSplitDrawer={() => setIsSplitDrawerOpen(true)}
        onOpenUpiSetup={() => setIsUpiSetupOpen(true)}
      />

      {/* Global Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-surface-raised text-ink-primary border border-brand-coral px-5 py-3 rounded-2xl shadow-coral flex items-center gap-3 text-xs sm:text-sm font-bold"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-brand-coral animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
