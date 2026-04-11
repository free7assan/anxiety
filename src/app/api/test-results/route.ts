import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

type TestType = 'anxiety-test' | 'advanced-test';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const testType: TestType | undefined = body?.testType;
    const sessionId: string | undefined = body?.sessionId;
    const answers: unknown = body?.answers;

    if (!testType || (testType !== 'anxiety-test' && testType !== 'advanced-test')) {
      return NextResponse.json({ error: 'Invalid testType' }, { status: 400 });
    }

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    if (!Array.isArray(answers)) {
      return NextResponse.json({ error: 'Invalid answers' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('quietbridge_surveys');
    const collection = db.collection('test_results');

    const now = new Date();

    const doc = {
      testType,
      sessionId,
      answers,
      result: body?.result ?? null,
      difficulty: typeof body?.difficulty === 'string' ? body.difficulty : '',
      pageUrl: typeof body?.pageUrl === 'string' ? body.pageUrl : '',
      userAgent: request.headers.get('user-agent') || '',
      createdAt: now,
    };

    const inserted = await collection.insertOne(doc);

    return NextResponse.json({ success: true, id: inserted.insertedId }, { status: 200 });
  } catch (error) {
    console.error('Test results save error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

