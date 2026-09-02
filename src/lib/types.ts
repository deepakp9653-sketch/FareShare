// GroupTrip Ledger Core Domain Types

export type SplitMethod = 'equal' | 'weighted' | 'line_item' | 'room_tier' | 'organizer_subsidy';

export type BookingCategory = 'transport' | 'lodging' | 'activity' | 'food' | 'other' | 'general';

export type EventType =
  | 'TRIP_CREATED'
  | 'PARTICIPANT_ADDED'
  | 'PARTICIPANT_REMOVED'
  | 'BOOKING_CREATED'
  | 'BOOKING_MODIFIED'
  | 'BOOKING_CANCELLED'
  | 'EXPENSE_LOGGED'
  | 'EXPENSE_CORRECTED'
  | 'REFUND_CREDITED'
  | 'PAYMENT_RECORDED'
  | 'SETTLEMENT_SIMPLIFIED'
  | 'SETTLEMENT_CONFIRMED'
  | 'USER_LOGGED_IN'
  | 'UPI_SETUP_UPDATED'
  | 'TRIP_JOINED_VIA_CODE';

export interface Trip {
  id: string;
  title: string;
  destination: string;
  baseCurrency: string; // Default 'INR'
  startDate: string;
  endDate: string;
  budgetCeiling: number;
  inviteCode: string; // Unique 6-character code (e.g. "GOA2026")
  organizerId: string; // Participant ID of Creator
  createdAt: string;
}

export interface Participant {
  id: string;
  tripId: string;
  name: string;
  email: string;
  avatarUrl: string;
  isOrganizer: boolean;
  status: 'active' | 'removed';
  upiId?: string; // UPI VPA
  qrCodeUrl?: string; // Custom uploaded UPI QR code image URL or base64
  passwordHash?: string;
  isLoggedIn?: boolean;
  weight?: number;
  roomTier?: 'suite' | 'standard' | 'economy';
}

export interface Vendor {
  id: string;
  tripId: string;
  name: string;
  category: BookingCategory;
  contactPhone?: string;
  email?: string;
  website?: string;
  rating?: number;
  totalBookingsCount?: number;
  totalSpent?: number;
}

export type RefundPolicy = 'full' | 'partial' | 'per_head' | 'non_refundable';

export interface RefundEvent {
  id: string;
  tripId: string;
  bookingId?: string;
  expenseId?: string;
  amount: number;
  currency: string;
  refundedToPayerId: string; // Participant who originally paid or receives credit
  policy: RefundPolicy;
  reason?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  tripId: string;
  category: BookingCategory;
  title: string;
  vendor: string;
  vendorId?: string;
  startTime: string;
  endTime: string;
  estimatedCost: number;
  actualCost: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  participantIds: string[];
  refundPolicy?: RefundPolicy;
  cancellationReason?: string;
  refundAmount?: number;
}

export interface ExpenseAllocation {
  participantId: string;
  amountOwed: number;
  note?: string;
}

export interface Expense {
  id: string;
  tripId: string;
  bookingId?: string;
  title: string;
  totalAmount: number;
  currency: string;
  splitMethod: SplitMethod;
  paidById: string;
  category: BookingCategory;
  createdAt: string;
  allocations: ExpenseAllocation[];
  subsidyAmount?: number;
  receiptUrl?: string;
  receiptName?: string;
}

export interface Payment {
  id: string;
  tripId: string;
  payerId: string;
  payeeId: string;
  amount: number;
  note?: string;
  createdAt: string;
}

export interface LedgerEvent {
  id: string;
  tripId: string;
  eventType: EventType;
  actorId: string;
  actorName: string;
  timestamp: string;
  description: string;
  payload: Record<string, any>;
  sequenceNum: number;
}

export interface SimplifiedDebt {
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  amount: number;
  status: 'proposed' | 'settled';
  payeeUpiId?: string;
  payeeQrCodeUrl?: string;
}

export interface ParticipantNetBalance {
  participant: Participant;
  totalPaid: number;
  totalOwed: number;
  netBalance: number;
  status: 'surplus' | 'deficit' | 'settled';
}

export interface ReconciliationAudit {
  totalExpenses: number;
  totalRefunds: number;
  totalSubsidies: number;
  netIncurred: number;
  totalPaidByParticipants: number;
  totalAllocatedOwed: number;
  netBalanceSum: number;
  isReconciled: boolean;
  discrepancy: number;
}

