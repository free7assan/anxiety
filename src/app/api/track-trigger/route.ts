import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('quietbridge_surveys');
    const collection = db.collection('survey_triggers');

    const body = await request.json();
    const { sessionId, triggerSource } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0];
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('remote-addr') || 'unknown';

    // Log each trigger event
    await collection.insertOne({
      sessionId,
      triggerSource: triggerSource || 'unknown',
      date: today,
      timestamp: new Date(),
      userAgent: request.headers.get('user-agent'),
      ip
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Survey trigger tracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
