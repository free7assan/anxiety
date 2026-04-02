import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('quietbridge_surveys');
    const collection = db.collection('user_feedback');

    // Fetch all survey responses sorted by date
    const responses = await collection.find({}).sort({ createdAt: -1 }).toArray();

    // Aggregations for analysis
    const totalResponses = responses.length;
    
    // Aggregate by Frequency
    const frequencyStats = responses.reduce((acc: any, curr: any) => {
      acc[curr.frequency] = (acc[curr.frequency] || 0) + 1;
      return acc;
    }, {});

    // Aggregate by Goal
    const goalStats = responses.reduce((acc: any, curr: any) => {
      acc[curr.goal] = (acc[curr.goal] || 0) + 1;
      return acc;
    }, {});

    // Aggregate by Setting
    const settingStats = responses.reduce((acc: any, curr: any) => {
      acc[curr.setting] = (acc[curr.setting] || 0) + 1;
      return acc;
    }, {});

    // Aggregate Triggers (multiple values)
    const triggerStats = responses.reduce((acc: any, curr: any) => {
      if (Array.isArray(curr.triggers)) {
        curr.triggers.forEach((trigger: string) => {
          acc[trigger] = (acc[trigger] || 0) + 1;
        });
      }
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      stats: {
        totalResponses,
        frequencyStats,
        goalStats,
        settingStats,
        triggerStats
      },
      responses
    });

  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
