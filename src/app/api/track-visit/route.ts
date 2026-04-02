import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('quietbridge_surveys');
    const collection = db.collection('site_visitors');

    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    // Upsert a visitor record for today to track daily unique visits per session
    const today = new Date().toISOString().split('T')[0];
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('remote-addr') || 'unknown';

    await collection.updateOne(
      { sessionId, date: today },
      { 
        $set: { 
          lastVisit: new Date(),
          userAgent: request.headers.get('user-agent'),
          ip
        },
        $setOnInsert: { firstVisit: new Date() }
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Visitor tracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
