'use client';

import { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Clock, 
  Target, 
  MessageSquare, 
  ChevronRight, 
  ChevronDown, 
  ArrowLeft,
  Search,
  Download,
  Filter,
  RefreshCw,
  Mail,
  Calendar,
  Zap,
  Shield,
  Briefcase,
  Heart
} from 'lucide-react';
import Link from 'next/link';

interface SurveyResponse {
  _id: string;
  name: string;
  email: string;
  frequency: string;
  triggers: string[];
  symptoms: string;
  preparation: string;
  goal: string;
  setting: string;
  scriptType: string;
  format: string;
  mustHave: string;
  createdAt: string;
}

interface Stats {
  totalResponses: number;
  totalVisitors: number;
  uniqueSessionsToday: number;
  totalTriggers: number;
  triggersToday: number;
  frequencyStats: Record<string, number>;
  goalStats: Record<string, number>;
  settingStats: Record<string, number>;
  triggerStats: Record<string, number>;
}

export default function Dashboard() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const downloadCSV = () => {
    if (responses.length === 0) return;

    // Define CSV headers
    const headers = [
      'Name',
      'Email',
      'Frequency',
      'Triggers',
      'Symptoms',
      'Preparation',
      'Goal',
      'Setting',
      'Script Type',
      'Format',
      'Must Have',
      'Date'
    ];

    // Map responses to CSV rows
    const rows = responses.map(r => [
      `"${r.name || 'Anonymous'}"`,
      `"${r.email}"`,
      `"${r.frequency}"`,
      `"${r.triggers.join(', ')}"`,
      `"${r.symptoms}"`,
      `"${r.preparation}"`,
      `"${r.goal}"`,
      `"${r.setting}"`,
      `"${r.scriptType}"`,
      `"${r.format}"`,
      `"${r.mustHave}"`,
      `"${new Date(r.createdAt).toLocaleString()}"`
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `quietbridge_survey_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      if (data.success) {
        setResponses(data.responses);
        setStats(data.stats);
      } else {
        throw new Error(data.error || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const filteredResponses = responses.filter(r => 
    r.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.goal?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatCard = ({ title, value, icon: Icon, colorClass }: { title: string, value: string | number, icon: any, colorClass: string }) => (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-purple-100 flex items-center gap-4">
      <div className={`${colorClass} p-3 rounded-2xl`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-10 w-10 text-purple-600 animate-spin" />
          <p className="text-purple-900 font-medium">Analyzing Survey Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFE] pb-20">
      {/* Top Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-purple-50 rounded-xl transition-colors text-purple-600">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Analytics Dashboard</h1>
                <div className="flex items-center gap-4 mt-0.5">
                  <p className="text-sm text-gray-500 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {stats?.totalVisitors || 0} Total Visitors
                  </p>
                  <div className="w-1 h-1 bg-gray-300 rounded-full" />
                  <p className="text-sm text-purple-600 font-medium flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {stats?.uniqueSessionsToday || 0} Today
                  </p>
                </div>
              </div>
            </div>
            <button 
              onClick={fetchDashboardData}
              className="bg-purple-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 active:scale-95"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <StatCard 
            title="Total Visitors" 
            value={stats?.totalVisitors || 0} 
            icon={Users} 
            colorClass="bg-blue-100 text-blue-600" 
          />
          <StatCard 
            title="Survey Triggers" 
            value={stats?.totalTriggers || 0} 
            icon={Zap} 
            colorClass="bg-yellow-100 text-yellow-600" 
          />
          <StatCard 
            title="Survey Answers" 
            value={stats?.totalResponses || 0} 
            icon={MessageSquare} 
            colorClass="bg-purple-100 text-purple-600" 
          />
          <StatCard 
            title="Top Goal" 
            value={stats ? Object.entries(stats.goalStats).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A' : 'N/A'} 
            icon={Target} 
            colorClass="bg-green-100 text-green-600" 
          />
          <StatCard 
            title="Avg. Frequency" 
            value={stats ? Object.entries(stats.frequencyStats).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A' : 'N/A'} 
            icon={Clock} 
            colorClass="bg-pink-100 text-pink-600" 
          />
        </div>

        {/* Charts and Lists Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          {/* Main List Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-purple-100 overflow-hidden">
              <div className="p-6 border-b border-purple-50 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Responses</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search responses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-purple-50 border-none rounded-xl focus:ring-2 focus:ring-purple-500 text-sm w-64"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-purple-50/30 text-left">
                      <th className="px-6 py-4 text-xs font-bold text-purple-900 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-xs font-bold text-purple-900 uppercase tracking-wider">Goal</th>
                      <th className="px-6 py-4 text-xs font-bold text-purple-900 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-purple-900 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-50">
                    {filteredResponses.length > 0 ? filteredResponses.map((response) => (
                      <Fragment key={response._id}>
                        <tr 
                          className={`hover:bg-purple-50/20 transition-colors cursor-pointer ${expandedRow === response._id ? 'bg-purple-50/40' : ''}`}
                          onClick={() => setExpandedRow(expandedRow === response._id ? null : response._id)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center text-purple-700 font-bold">
                                {response.name?.[0]?.toUpperCase() || 'A'}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900">{response.name || 'Anonymous'}</p>
                                <p className="text-xs text-gray-500">{response.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {response.goal}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(response.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-purple-600 hover:text-purple-900 transition-colors">
                              {expandedRow === response._id ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                            </button>
                          </td>
                        </tr>
                        <AnimatePresence>
                          {expandedRow === response._id && (
                            <tr>
                              <td colSpan={4} className="px-6 py-6 bg-purple-50/20">
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                  <div>
                                    <h4 className="text-xs font-bold text-purple-900 uppercase tracking-widest mb-2 flex items-center gap-1">
                                      <Zap className="h-3 w-3" /> Challenges
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {response.triggers.map((t, i) => (
                                        <span key={i} className="text-xs bg-white border border-purple-100 px-2 py-1 rounded-lg text-gray-700">
                                          {t}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-purple-900 uppercase tracking-widest mb-2 flex items-center gap-1">
                                      <Heart className="h-3 w-3" /> Symptoms
                                    </h4>
                                    <p className="text-sm text-gray-600">{response.symptoms}</p>
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-purple-900 uppercase tracking-widest mb-2 flex items-center gap-1">
                                      <Briefcase className="h-3 w-3" /> Format
                                    </h4>
                                    <p className="text-sm text-gray-600">{response.format}</p>
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-purple-900 uppercase tracking-widest mb-2 flex items-center gap-1">
                                      <Shield className="h-3 w-3" /> Privacy Needs
                                    </h4>
                                    <p className="text-sm text-gray-600">{response.mustHave}</p>
                                  </div>
                                  <div className="md:col-span-2">
                                    <h4 className="text-xs font-bold text-purple-900 uppercase tracking-widest mb-2 flex items-center gap-1">
                                      <Clock className="h-3 w-3" /> Rehearsal Time
                                    </h4>
                                    <p className="text-sm text-gray-600">{response.preparation}</p>
                                  </div>
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </Fragment>
                    )) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-20 text-center text-gray-500">
                          No responses found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Side Aggregates Section */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-purple-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Trigger Analysis
              </h3>
              <div className="space-y-4">
                {stats && Object.entries(stats.triggerStats).sort((a,b) => b[1] - a[1]).slice(0, 6).map(([trigger, count]) => (
                  <div key={trigger}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-700 font-medium">{trigger}</span>
                      <span className="text-purple-600 font-bold">{count}</span>
                    </div>
                    <div className="w-full bg-purple-50 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-purple-600 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${(count / stats.totalResponses) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-8 rounded-[2.5rem] shadow-xl text-white">
              <h3 className="text-lg font-bold mb-4">Export Data</h3>
              <p className="text-purple-100 text-sm mb-6">Download all survey results in CSV format for further analysis in Excel or Google Sheets.</p>
              <button 
                onClick={downloadCSV}
                className="w-full bg-white text-purple-600 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-purple-50 transition-colors shadow-lg active:scale-95 disabled:opacity-50"
                disabled={responses.length === 0}
              >
                <Download className="h-5 w-5" />
                Download CSV
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
