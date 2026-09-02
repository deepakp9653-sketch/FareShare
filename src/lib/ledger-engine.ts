// GroupTrip Ledger Core Math & State Engine

import {
  Participant,
  Expense,
  Payment,
  SplitMethod,
  ExpenseAllocation,
  ParticipantNetBalance,
  SimplifiedDebt,
  Booking,
  RefundEvent,
  ReconciliationAudit,
  RefundPolicy,
} from './types';

/**
 * Calculates allocation shares per participant according to the chosen SplitMethod
 */
export function calculateSplits(
  totalAmount: number,
  splitMethod: SplitMethod,
  participants: Participant[],
  customInputs?: {
    weights?: Record<string, number>;
    lineItems?: Record<string, number>;
    subsidyAmount?: number;
  }
): ExpenseAllocation[] {
  if (participants.length === 0 || totalAmount <= 0) {
    return [];
  }

  let allocatableAmount = totalAmount;

  // Handle Organizer Subsidy strategy first if applicable
  if (splitMethod === 'organizer_subsidy' && customInputs?.subsidyAmount) {
    allocatableAmount = Math.max(0, totalAmount - customInputs.subsidyAmount);
  }

  const result: ExpenseAllocation[] = [];

  switch (splitMethod) {
    case 'equal':
    case 'organizer_subsidy': {
      const share = Math.floor((allocatableAmount / participants.length) * 100) / 100;
      let remainder = Math.round((allocatableAmount - share * participants.length) * 100);

      participants.forEach((p, idx) => {
        // Distribute remainder cents deterministically to first N participants
        const extraCent = idx < remainder ? 0.01 : 0;
        result.push({
          participantId: p.id,
          amountOwed: Number((share + extraCent).toFixed(2)),
        });
      });
      break;
    }

    case 'weighted': {
      const weights = customInputs?.weights || {};
      let totalWeight = 0;
      participants.forEach((p) => {
        const w = weights[p.id] !== undefined ? weights[p.id] : (p.weight ?? 1);
        totalWeight += w;
      });

      if (totalWeight <= 0) totalWeight = participants.length;

      let sumAllocated = 0;
      participants.forEach((p, idx) => {
        const pWeight = weights[p.id] !== undefined ? weights[p.id] : (p.weight ?? 1);
        if (idx === participants.length - 1) {
          // Last participant absorbs rounding difference
          result.push({
            participantId: p.id,
            amountOwed: Number((totalAmount - sumAllocated).toFixed(2)),
          });
        } else {
          const share = Number(((totalAmount * pWeight) / totalWeight).toFixed(2));
          sumAllocated += share;
          result.push({ participantId: p.id, amountOwed: share });
        }
      });
      break;
    }

    case 'line_item': {
      const lineItems = customInputs?.lineItems || {};
      let sum = 0;
      participants.forEach((p) => {
        const itemShare = lineItems[p.id] || 0;
        sum += itemShare;
        result.push({ participantId: p.id, amountOwed: Number(itemShare.toFixed(2)) });
      });
      if (sum === 0) {
        // Fallback to equal split if no line items were specified
        return calculateSplits(totalAmount, 'equal', participants);
      }
      // If line items sum differs from total, scale proportionally
      if (Math.abs(sum - totalAmount) > 0.009) {
        const ratio = totalAmount / sum;
        let sumAllocated = 0;
        result.forEach((r, idx) => {
          if (idx === result.length - 1) {
            r.amountOwed = Number((totalAmount - sumAllocated).toFixed(2));
          } else {
            r.amountOwed = Number((r.amountOwed * ratio).toFixed(2));
            sumAllocated += r.amountOwed;
          }
        });
      }
      break;
    }

    case 'room_tier': {
      // Room multipliers: Suite = 1.4x, Standard = 1.0x, Economy = 0.8x
      const tierMultipliers: Record<string, number> = {
        suite: 1.4,
        standard: 1.0,
        economy: 0.8,
      };

      let totalWeight = 0;
      participants.forEach((p) => {
        const mult = tierMultipliers[p.roomTier || 'standard'] || 1.0;
        totalWeight += mult;
      });

      let sumAllocated = 0;
      participants.forEach((p, idx) => {
        const mult = tierMultipliers[p.roomTier || 'standard'] || 1.0;
        if (idx === participants.length - 1) {
          result.push({
            participantId: p.id,
            amountOwed: Number((totalAmount - sumAllocated).toFixed(2)),
          });
        } else {
          const share = Number(((totalAmount * mult) / totalWeight).toFixed(2));
          sumAllocated += share;
          result.push({ participantId: p.id, amountOwed: share });
        }
      });
      break;
    }
  }

  return result;
}

/**
 * Dynamically re-derives expense allocations for all expenses whenever participants join, leave, or change configuration
 */
export function recalculateExpenseAllocations(
  expenses: Expense[],
  participants: Participant[],
  bookings: Booking[] = []
): Expense[] {
  const activeParts = participants.filter((p) => p.status === 'active');
  if (activeParts.length === 0) return expenses;

  return expenses.map((e) => {
    // Determine target active participants for this expense
    let targetParticipants = activeParts;
    if (e.bookingId) {
      const linkedBooking = bookings.find((b) => b.id === e.bookingId);
      if (linkedBooking && linkedBooking.participantIds && linkedBooking.participantIds.length > 0) {
        targetParticipants = activeParts.filter((p) => linkedBooking.participantIds.includes(p.id));
      }
    }

    if (targetParticipants.length === 0) targetParticipants = activeParts;

    // Recalculate allocations based on current active roster & weights
    const newAllocations = calculateSplits(e.totalAmount, e.splitMethod, targetParticipants, {
      subsidyAmount: e.subsidyAmount,
    });

    return {
      ...e,
      allocations: newAllocations,
    };
  });
}

/**
 * Computes net financial balance for every participant from the event-sourced log of Expenses, Payments, & Refunds
 */
export function computeNetBalances(
  participants: Participant[],
  expenses: Expense[],
  payments: Payment[],
  refunds: RefundEvent[] = [],
  bookings: Booking[] = []
): ParticipantNetBalance[] {
  const dynamicExpenses = recalculateExpenseAllocations(expenses, participants, bookings);
  const map: Record<string, { totalPaid: number; totalOwed: number }> = {};

  participants.forEach((p) => {
    map[p.id] = { totalPaid: 0, totalOwed: 0 };
  });

  // Fold Expenses: Payer gets credit for claimable total amount (net of organizer subsidy), allocated participants get debit
  dynamicExpenses.forEach((e) => {
    if (!map[e.paidById]) {
      map[e.paidById] = { totalPaid: 0, totalOwed: 0 };
    }
    
    // If the organizer provided a subsidy, the claimable outlay for reimbursement is totalAmount - subsidyAmount
    const claimablePaid = e.subsidyAmount && e.subsidyAmount > 0
      ? Math.max(0, e.totalAmount - e.subsidyAmount)
      : e.totalAmount;

    map[e.paidById].totalPaid += claimablePaid;

    e.allocations.forEach((alloc) => {
      if (!map[alloc.participantId]) {
        map[alloc.participantId] = { totalPaid: 0, totalOwed: 0 };
      }
      map[alloc.participantId].totalOwed += alloc.amountOwed;
    });
  });

  // Fold Refunds: Payer gets vendor refund credit (totalPaid reduced), allocated participants get debt relief (totalOwed reduced)
  refunds.forEach((ref) => {
    const expense = dynamicExpenses.find((e) => e.id === ref.expenseId || (e.bookingId && e.bookingId === ref.bookingId));
    
    if (expense && expense.totalAmount > 0) {
      // Portion of expense that was claimable (excluding organizer subsidy)
      const claimablePaid = expense.subsidyAmount && expense.subsidyAmount > 0
        ? Math.max(0, expense.totalAmount - expense.subsidyAmount)
        : expense.totalAmount;
      
      const refundRatio = Math.min(1, ref.amount / expense.totalAmount);
      const claimableRefund = claimablePaid * refundRatio;

      if (map[ref.refundedToPayerId]) {
        map[ref.refundedToPayerId].totalPaid -= claimableRefund;
      }

      // Distribute debt relief across allocations proportionally with exact penny preservation
      let sumRelief = 0;
      expense.allocations.forEach((alloc, idx) => {
        if (map[alloc.participantId]) {
          let relief: number;
          if (idx === expense.allocations.length - 1) {
            relief = Number((claimableRefund - sumRelief).toFixed(2));
          } else {
            relief = Number((alloc.amountOwed * refundRatio).toFixed(2));
            sumRelief += relief;
          }
          map[alloc.participantId].totalOwed -= relief;
        }
      });
    } else {
      // General refund: divide debt relief evenly among participants
      if (map[ref.refundedToPayerId]) {
        map[ref.refundedToPayerId].totalPaid -= ref.amount;
      }
      const share = ref.amount / Math.max(1, participants.length);
      participants.forEach((p) => {
        if (map[p.id]) {
          map[p.id].totalOwed -= share;
        }
      });
    }
  });

  // Fold Peer-to-Peer Payments:
  // Payer gets credit (paid towards trip), Payee gets debit (reimbursement collected)
  payments.forEach((pay) => {
    if (!map[pay.payerId]) map[pay.payerId] = { totalPaid: 0, totalOwed: 0 };
    if (!map[pay.payeeId]) map[pay.payeeId] = { totalPaid: 0, totalOwed: 0 };

    map[pay.payerId].totalPaid += pay.amount;
    map[pay.payeeId].totalPaid -= pay.amount;
  });

  return participants.map((p) => {
    const stats = map[p.id] || { totalPaid: 0, totalOwed: 0 };
    const netBalance = Number((stats.totalPaid - stats.totalOwed).toFixed(2));
    let status: 'surplus' | 'deficit' | 'settled' = 'settled';
    if (netBalance > 0.01) status = 'surplus';
    else if (netBalance < -0.01) status = 'deficit';

    return {
      participant: p,
      totalPaid: Number(stats.totalPaid.toFixed(2)),
      totalOwed: Number(stats.totalOwed.toFixed(2)),
      netBalance,
      status,
    };
  });
}

/**
 * Computes real-time zero-sum financial reconciliation audit metrics
 */
export function computeReconciliationAudit(
  participants: Participant[],
  expenses: Expense[],
  payments: Payment[],
  refunds: RefundEvent[] = [],
  bookings: Booking[] = []
): ReconciliationAudit {
  const totalExpenses = Number(expenses.reduce((sum, e) => sum + e.totalAmount, 0).toFixed(2));
  const totalRefunds = Number(refunds.reduce((sum, r) => sum + r.amount, 0).toFixed(2));
  const totalSubsidies = Number(expenses.reduce((sum, e) => sum + (e.subsidyAmount || 0), 0).toFixed(2));

  const netBalances = computeNetBalances(participants, expenses, payments, refunds, bookings);
  const totalPaidByParticipants = Number(netBalances.reduce((sum, b) => sum + b.totalPaid, 0).toFixed(2));
  const totalAllocatedOwed = Number(netBalances.reduce((sum, b) => sum + b.totalOwed, 0).toFixed(2));
  const netBalanceSum = Number(netBalances.reduce((sum, b) => sum + b.netBalance, 0).toFixed(2));

  const netIncurred = totalPaidByParticipants;
  const discrepancy = Math.abs(netBalanceSum);
  const isReconciled = discrepancy <= 0.02; // Small floating point tolerance

  return {
    totalExpenses,
    totalRefunds,
    totalSubsidies,
    netIncurred,
    totalPaidByParticipants,
    totalAllocatedOwed,
    netBalanceSum,
    isReconciled,
    discrepancy,
  };
}

/**
 * Processes a booking cancellation and generates appropriate refund events based on selected policy
 */
export function processBookingCancellation(
  booking: Booking,
  bookingExpenses: Expense[],
  policy: RefundPolicy,
  refundPercent: number = 100,
  customAmount?: number,
  reason?: string
): RefundEvent[] {
  if (policy === 'non_refundable' || bookingExpenses.length === 0) {
    return [];
  }

  const refundEvents: RefundEvent[] = [];

  bookingExpenses.forEach((exp) => {
    let refundAmount = 0;
    if (policy === 'full') {
      refundAmount = exp.totalAmount;
    } else if (policy === 'partial' || policy === 'per_head') {
      refundAmount = Number(((exp.totalAmount * refundPercent) / 100).toFixed(2));
    } else if (customAmount !== undefined) {
      refundAmount = Math.min(exp.totalAmount, customAmount);
    }

    if (refundAmount > 0) {
      refundEvents.push({
        id: 'ref-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        tripId: booking.tripId,
        bookingId: booking.id,
        expenseId: exp.id,
        amount: Number(refundAmount.toFixed(2)),
        currency: 'INR',
        refundedToPayerId: exp.paidById,
        policy,
        reason: reason || `Cancelled booking "${booking.title}" under ${policy} refund policy (${refundPercent}%).`,
        createdAt: new Date().toISOString(),
      });
    }
  });

  return refundEvents;
}


/**
 * Greedy O(N log N) Graph-Based Debt Simplification Algorithm
 * Compresses complex pairwise debt networks into at most (N - 1) transactions
 */
export function simplifyDebts(netBalances: ParticipantNetBalance[]): SimplifiedDebt[] {
  // Step 1: Filter out zero-balance participants
  const nonZero = netBalances.filter((b) => Math.abs(b.netBalance) >= 0.01);

  // Step 2: Separate into Creditors (+) and Debtors (-)
  const creditors = nonZero
    .filter((b) => b.netBalance > 0)
    .map((b) => ({ ...b, balance: b.netBalance }))
    .sort((a, b) => b.balance - a.balance);

  const debtors = nonZero
    .filter((b) => b.netBalance < 0)
    .map((b) => ({ ...b, balance: Math.abs(b.netBalance) }))
    .sort((a, b) => b.balance - a.balance);

  const settlements: SimplifiedDebt[] = [];
  let i = 0;
  let j = 0;

  // Step 3: Greedily match largest debtor with largest creditor
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const transferAmount = Math.min(debtor.balance, creditor.balance);
    if (transferAmount >= 0.009) {
      settlements.push({
        fromId: debtor.participant.id,
        fromName: debtor.participant.name,
        toId: creditor.participant.id,
        toName: creditor.participant.name,
        amount: Number(transferAmount.toFixed(2)),
        status: 'proposed',
        payeeUpiId: creditor.participant.upiId,
        payeeQrCodeUrl: creditor.participant.qrCodeUrl,
      });
    }

    debtor.balance -= transferAmount;
    creditor.balance -= transferAmount;

    if (debtor.balance <= 0.009) i++;
    if (creditor.balance <= 0.009) j++;
  }

  return settlements;
}

/**
 * Calculates budget vs actual expense variance per category and in total
 */
export function calculateVariance(bookings: Booking[], expenses: Expense[]) {
  let totalEstimated = 0;
  let totalActual = 0;

  const categoryMap: Record<string, { estimated: number; actual: number }> = {};

  bookings.forEach((b) => {
    totalEstimated += b.estimatedCost;
    if (!categoryMap[b.category]) categoryMap[b.category] = { estimated: 0, actual: 0 };
    categoryMap[b.category].estimated += b.estimatedCost;
  });

  expenses.forEach((e) => {
    totalActual += e.totalAmount;
    if (!categoryMap[e.category]) categoryMap[e.category] = { estimated: 0, actual: 0 };
    categoryMap[e.category].actual += e.totalAmount;
  });

  const delta = Number((totalActual - totalEstimated).toFixed(2));
  const isOverBudget = delta > 0;

  return {
    totalEstimated: Number(totalEstimated.toFixed(2)),
    totalActual: Number(totalActual.toFixed(2)),
    delta,
    isOverBudget,
    percentVariance: totalEstimated > 0 ? Number(((delta / totalEstimated) * 100).toFixed(1)) : 0,
    byCategory: categoryMap,
  };
}
