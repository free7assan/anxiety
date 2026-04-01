import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.email || !body.frequency || !body.goal) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('promptly_surveys');
    const collection = db.collection('user_feedback');

    // Insert the survey data
    const result = await collection.insertOne({
      name: body.name || 'Anonymous',
      email: body.email,
      frequency: body.frequency,
      triggers: body.triggers || [],
      symptoms: body.symptoms,
      preparation: body.preparation,
      goal: body.goal,
      setting: body.setting,
      scriptType: body.scriptType,
      format: body.format,
      mustHave: body.mustHave,
      timestamp: body.timestamp || new Date().toISOString(),
      userAgent: body.userAgent || request.headers.get('user-agent'),
      pageUrl: body.pageUrl || '',
      createdAt: new Date(),
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('remote-addr'),
    });

    console.log('Survey submitted to MongoDB:', result.insertedId);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Survey submitted successfully',
        id: result.insertedId 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('CRITICAL Survey submission error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
