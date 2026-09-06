import { NextResponse } from 'next/server';
import { sql, saveTripToNeon } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tripId = searchParams.get('tripId');

    if (tripId) {
      const trips = await sql`SELECT * FROM trips WHERE id = ${tripId} LIMIT 1;`;
      const participants = await sql`SELECT * FROM participants WHERE trip_id = ${tripId};`;
      const bookings = await sql`SELECT * FROM bookings WHERE trip_id = ${tripId};`;
      return NextResponse.json({ success: true, trip: trips[0], participants, bookings });
    }

    const allTrips = await sql`SELECT * FROM trips ORDER BY created_at DESC LIMIT 50;`;
    return NextResponse.json({ success: true, trips: allTrips });
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
