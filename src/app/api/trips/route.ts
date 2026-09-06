import { NextResponse } from 'next/server';
import { sql, saveTripToNeon, findTripByInviteCodeInNeon } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const inviteCode = searchParams.get('inviteCode');
    const tripId = searchParams.get('tripId');

    // 1. Lookup by Invite Code
    if (inviteCode) {
      const data = await findTripByInviteCodeInNeon(inviteCode);
      if (!data) {
        return NextResponse.json({ success: false, error: 'Trip not found with this invite code' }, { status: 404 });
      }

      const formattedTrip = {
        id: data.trip.id,
        title: data.trip.title,
        destination: data.trip.destination,
        baseCurrency: data.trip.base_currency || 'INR',
        startDate: data.trip.start_date,
        endDate: data.trip.end_date,
        budgetCeiling: Number(data.trip.budget_ceiling || 0),
        inviteCode: data.trip.invite_code,
        organizerId: data.trip.organizer_id,
        createdAt: data.trip.created_at,
      };

      const formattedParticipants = data.participants.map((p: any) => ({
        id: p.id,
        tripId: p.trip_id,
        name: p.name,
        email: p.email,
        avatarUrl: p.avatar_url || '',
        isOrganizer: Boolean(p.is_organizer),
        status: p.status || 'active',
        upiId: p.upi_id || `${p.name.toLowerCase().replace(/\s+/g, '')}@upi`,
        weight: Number(p.weight || 1),
        roomTier: p.room_tier || 'standard',
      }));

      const formattedBookings = data.bookings.map((b: any) => ({
        id: b.id,
        tripId: b.trip_id,
        category: b.category,
        title: b.title,
        vendor: b.vendor || '',
        startTime: b.start_time,
        endTime: b.end_time,
        estimatedCost: Number(b.estimated_cost || 0),
        actualCost: Number(b.actual_cost || 0),
        status: b.status || 'confirmed',
        participantIds: formattedParticipants.map((p: any) => p.id),
      }));

      return NextResponse.json({
        success: true,
        trip: formattedTrip,
        participants: formattedParticipants,
        bookings: formattedBookings,
        expenses: data.expenses || [],
        events: data.events || [],
      });
    }

    // 2. Lookup by Trip ID
    if (tripId) {
      const trips = await sql`SELECT * FROM trips WHERE id = ${tripId} LIMIT 1;`;
      if (trips.length === 0) {
        return NextResponse.json({ success: false, error: 'Trip not found' }, { status: 404 });
      }
      const participants = await sql`SELECT * FROM participants WHERE trip_id = ${tripId};`;
      const bookings = await sql`SELECT * FROM bookings WHERE trip_id = ${tripId};`;
      const expenses = await sql`SELECT * FROM expenses WHERE trip_id = ${tripId};`;

      return NextResponse.json({
        success: true,
        trip: trips[0],
        participants,
        bookings,
        expenses,
      });
    }

    // 3. Return all Trips
    const allTrips = await sql`SELECT * FROM trips ORDER BY created_at DESC LIMIT 50;`;
    const formattedAllTrips = allTrips.map((t: any) => ({
      id: t.id,
      title: t.title,
      destination: t.destination,
      baseCurrency: t.base_currency || 'INR',
      startDate: t.start_date,
      endDate: t.end_date,
      budgetCeiling: Number(t.budget_ceiling || 0),
      inviteCode: t.invite_code,
      organizerId: t.organizer_id,
      createdAt: t.created_at,
    }));

    return NextResponse.json({ success: true, trips: formattedAllTrips });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { trip, participants } = body;

    if (!trip || !trip.id || !trip.title) {
      return NextResponse.json({ success: false, error: 'Missing trip details' }, { status: 400 });
    }

    const saved = await saveTripToNeon(trip, participants || []);
    if (!saved) {
      return NextResponse.json({ success: false, error: 'Failed to write to database' }, { status: 500 });
    }

    return NextResponse.json({ success: true, tripId: trip.id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
