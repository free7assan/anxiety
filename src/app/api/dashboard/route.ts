import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('quietbridge_surveys');
    const collection = db.collection('user_feedback');
    const testResultsCollection = db.collection('test_results');

    // Fetch all survey responses sorted by date
    const responses = await collection.find({}).sort({ createdAt: -1 }).toArray();
    const testResults = await testResultsCollection.find({}).sort({ createdAt: -1 }).toArray();
    
    // Visitor stats
    const visitorCollection = db.collection('site_visitors');
    const totalVisitors = await visitorCollection.countDocuments({});
    const uniqueSessionsToday = await visitorCollection.countDocuments({
      date: new Date().toISOString().split('T')[0]
    });

    // Trigger stats
    const triggerCollection = db.collection('survey_triggers');
    const totalTriggers = await triggerCollection.countDocuments({});
    const triggersToday = await triggerCollection.countDocuments({
      date: new Date().toISOString().split('T')[0]
    });

    // Test stats
    const totalTestResults = testResults.length;
    const testsToday = testResults.filter((t: any) => {
      const createdAt = t?.createdAt ? new Date(t.createdAt) : null;
      if (!createdAt || Number.isNaN(createdAt.getTime())) return false;
      const today = new Date();
      return createdAt.toDateString() === today.toDateString();
    }).length;
    const testTypeStats = testResults.reduce((acc: any, curr: any) => {
      const type = curr?.testType || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

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
        totalVisitors,
        uniqueSessionsToday,
        totalTriggers,
        triggersToday,
        totalTestResults,
        testsToday,
        testTypeStats,
        frequencyStats,
        goalStats,
        settingStats,
        triggerStats
      },
      responses,
      testResults
    });

  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
