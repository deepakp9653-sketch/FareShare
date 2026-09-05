// Neon PostgreSQL DB Client for FareShare
import { neon } from '@neondatabase/serverless';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_Xhx1ykgHS0cT@ep-tiny-mouse-a52mp86j-pooler.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require';

export const sql = neon(connectionString);

export async function fetchEventLog(tripId: string) {
  try {
    const rows = await sql`
      SELECT id, trip_id as "tripId", event_type as "eventType", actor_id as "actorId",
             payload_json as payload, sequence_num as "sequenceNum", created_at as "timestamp"
      FROM events
      WHERE trip_id = ${tripId}
      ORDER BY sequence_num ASC;
    `;
    return rows;
  } catch (error) {
    console.warn('Neon DB query fallback to memory cache:', error);
    return null;
  }
}

export async function logEventToNeon(tripId: string, eventType: string, actorId: string, payload: any) {
  try {
    await sql`
      INSERT INTO events (id, trip_id, event_type, actor_id, payload_json)
      VALUES (${'evt-' + Date.now()}, ${tripId}, ${eventType}, ${actorId}, ${JSON.stringify(payload)});
    `;
    return true;
  } catch (error) {
    console.warn('Neon DB insert fallback to memory cache:', error);
    return false;
  }
}

export async function saveRefundToNeon(refund: any) {
  try {
    await sql`
      INSERT INTO refunds (id, trip_id, booking_id, expense_id, amount, currency, refunded_to_payer_id, policy, reason)
      VALUES (${refund.id}, ${refund.tripId}, ${refund.bookingId || null}, ${refund.expenseId || null}, ${refund.amount}, ${refund.currency || 'INR'}, ${refund.refundedToPayerId}, ${refund.policy}, ${refund.reason || null});
    `;
    return true;
  } catch (error) {
    console.warn('Neon DB save refund error:', error);
    return false;
  }
}

export async function updateBookingInNeon(bookingId: string, status: string, refundPolicy?: string, cancellationReason?: string, refundAmount?: number) {
  try {
    await sql`
      UPDATE bookings 
      SET status = ${status}
      WHERE id = ${bookingId};
    `;
    return true;
  } catch (error) {
    console.warn('Neon DB update booking error:', error);
    return false;
  }
}

