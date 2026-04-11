'use client';

import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import SurveyPopup from '@/components/SurveyPopup';

type Answer = 0 | 1 | 2 | 3 | 4;

type Question = {
  id: string;
  domain: 'Body' | 'Mind' | 'Sleep' | 'Avoidance' | 'Work' | 'Social';
  text: string;
};

const questions: Question[] = [
  { id: 'body_racing', domain: 'Body', text: 'My heart races or my chest feels tight in social or high-pressure moments.' },
  { id: 'body_nausea', domain: 'Body', text: 'I feel nauseous, shaky, sweaty, or short of breath when I have to interact.' },
  { id: 'mind_blank', domain: 'Mind', text: 'My mind goes blank when someone looks at me or expects me to respond.' },
  { id: 'mind_rumination', domain: 'Mind', text: 'I replay conversations for hours and judge everything I said.' },
  { id: 'sleep_pre', domain: 'Sleep', text: 'My sleep is worse the night before a social or work situation.' },
  { id: 'sleep_recover', domain: 'Sleep', text: 'After social situations, I need a long time to recover or decompress.' },
  { id: 'avoid_cancel', domain: 'Avoidance', text: 'I cancel plans or avoid opportunities because the anxiety feels too high.' },
  { id: 'avoid_safe', domain: 'Avoidance', text: 'I rely on “safe people” or escape routes to get through situations.' },
  { id: 'work_meetings', domain: 'Work', text: 'Meetings, interviews, or workplace small talk feel like a threat.' },
  { id: 'work_hold', domain: 'Work', text: 'I hold back at work/school even when I have something to say.' },
  { id: 'social_group', domain: 'Social', text: 'Group conversations make me feel invisible, awkward, or left out.' },
  { id: 'social_new', domain: 'Social', text: 'Starting conversations with strangers feels nearly impossible.' },
  { id: 'social_romance', domain: 'Social', text: 'Romantic or dating situations feel blocked by fear of being judged.' },
  { id: 'impact_life', domain: 'Mind', text: 'My anxiety has kept my life smaller than it should be.' },
];

const options: { label: string; value: Answer }[] = [
  { label: 'Never', value: 0 },
  { label: 'Rarely', value: 1 },
  { label: 'Sometimes', value: 2 },
  { label: 'Often', value: 3 },
  { label: 'Almost always', value: 4 },
];

const domainMeta: Record<Question['domain'], { label: string; color: string }> = {
  Body: { label: 'Body', color: 'bg-red-100 text-red-700' },
  Mind: { label: 'Mind', color: 'bg-purple-100 text-purple-700' },
  Sleep: { label: 'Sleep', color: 'bg-indigo-100 text-indigo-700' },
  Avoidance: { label: 'Avoidance', color: 'bg-yellow-100 text-yellow-800' },
  Work: { label: 'Work', color: 'bg-blue-100 text-blue-700' },
  Social: { label: 'Social', color: 'bg-pink-100 text-pink-700' },
};

function getLevel(score: number, maxScore: number) {
  const ratio = maxScore === 0 ? 0 : score / maxScore;
  if (ratio < 0.25) return { label: 'Low', color: 'bg-green-100 text-green-700', detail: 'Symptoms look lower overall on this profile.' };
  if (ratio < 0.5) return { label: 'Moderate', color: 'bg-yellow-100 text-yellow-800', detail: 'Symptoms look meaningful and may be affecting day-to-day life.' };
  if (ratio < 0.75) return { label: 'High', color: 'bg-orange-100 text-orange-800', detail: 'Symptoms look significant across multiple areas.' };
  return { label: 'Very High', color: 'bg-red-100 text-red-700', detail: 'Symptoms look intense and wide‑impact. Consider professional support.' };
}

export default function AdvancedTestPage() {
  const [showSurvey, setShowSurvey] = useState(false);
  const [answers, setAnswers] = useState<(Answer | null)[]>(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(0);
  const saveOnceRef = useRef(false);

  const completedCount = useMemo(() => answers.filter((a) => a !== null).length, [answers]);
  const allAnswered = completedCount === questions.length;

  const score = useMemo(() => {
    return answers.reduce<number>((sum, a) => sum + (a ?? 0), 0);
  }, [answers]);

  const maxScore = questions.length * 4;
  const level = useMemo(() => getLevel(score, maxScore), [score, maxScore]);

  const domainScores = useMemo(() => {
    const init: Record<Question['domain'], { score: number; max: number }> = {
      Body: { score: 0, max: 0 },
      Mind: { score: 0, max: 0 },
      Sleep: { score: 0, max: 0 },
      Avoidance: { score: 0, max: 0 },
      Work: { score: 0, max: 0 },
      Social: { score: 0, max: 0 },
    };

    questions.forEach((q, idx) => {
      init[q.domain].max += 4;
      init[q.domain].score += answers[idx] ?? 0;
    });

    return init;
  }, [answers]);

  const getSessionId = () => {
    try {
      let sessionId = sessionStorage.getItem('qb_visitor_session');
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
        sessionStorage.setItem('qb_visitor_session', sessionId);
      }
      return sessionId;
    } catch {
      return null;
    }
  };

  const saveResult = async () => {
    if (saveOnceRef.current) return;
    saveOnceRef.current = true;
    const sessionId = getSessionId();
    if (!sessionId) return;

    try {
      await fetch('/api/test-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testType: 'advanced-test',
          sessionId,
          answers,
          result: {
            score,
            maxScore,
            level: getLevel(score, maxScore).label,
            domainScores,
          },
          pageUrl: window.location.href,
        }),
      });
    } catch (error) {
      console.error('Failed to save test result:', error);
    }
  };

  const reset = () => {
    setAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
    setStep(0);
    saveOnceRef.current = false;
  };

  const current = questions[Math.min(step, questions.length - 1)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <Navigation onStartFree={() => setShowSurvey(true)} />
      <SurveyPopup isOpen={showSurvey} onClose={() => setShowSurvey(false)} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-purple-200/40 border border-purple-100 overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                      Advanced Anxiety Profile
                    </h1>
                    <p className="text-gray-600 mt-1">
                      A deeper look across mind, body, avoidance, work, and social impact.
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 font-medium shrink-0">
                {completedCount}/{questions.length}
              </div>
            </div>

            <div className="mt-8">
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedCount / questions.length) * 100}%` }}
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 h-full"
                />
              </div>
            </div>

            <div className="mt-10">
              {!submitted ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`q-${step}`}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gray-50 rounded-[2.5rem] p-8 border border-purple-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-black text-purple-700 tracking-widest uppercase">
                          Question {step + 1} of {questions.length}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className={`px-3 py-1.5 rounded-2xl text-xs font-black ${domainMeta[current.domain].color}`}>
                            {domainMeta[current.domain].label}
                          </span>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mt-4 tracking-tight">
                          {current.text}
                        </h2>
                      </div>
                      {answers[step] !== null && (
                        <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-2xl text-xs font-black flex items-center gap-1.5 shrink-0">
                          <CheckCircle className="h-4 w-4" />
                          Selected
                        </div>
                      )}
                    </div>

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                      {options.map((o) => {
                        const selected = answers[step] === o.value;
                        return (
                          <button
                            key={`${current.id}-${o.value}`}
                            type="button"
                            onClick={() => {
                              const next = [...answers];
                              next[step] = o.value;
                              setAnswers(next);
                            }}
                            className={[
                              'px-4 py-4 rounded-2xl text-left border-2 transition-all font-black',
                              selected
                                ? 'border-purple-600 bg-white text-purple-900 shadow-sm'
                                : 'border-transparent bg-white text-gray-700 hover:border-purple-200 hover:bg-purple-50/30',
                            ].join(' ')}
                          >
                            <div className="text-sm">{o.label}</div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => setStep((s) => Math.max(0, s - 1))}
                        disabled={step === 0}
                        className="px-6 py-3 rounded-2xl font-black text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        Back
                      </button>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={reset}
                          className="px-6 py-3 rounded-2xl font-black text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          Reset
                        </button>
                        {step < questions.length - 1 ? (
                          <button
                            type="button"
                            disabled={answers[step] === null}
                            onClick={() => setStep((s) => Math.min(questions.length - 1, s + 1))}
                            className="px-8 py-3 rounded-2xl font-black text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-200 active:scale-95 disabled:opacity-50 disabled:grayscale"
                          >
                            Next
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={!allAnswered}
                            onClick={async () => {
                              await saveResult();
                              setSubmitted(true);
                            }}
                            className="px-8 py-3 rounded-2xl font-black text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-200 active:scale-95 disabled:opacity-50 disabled:grayscale"
                          >
                            See Results
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 border border-purple-100 rounded-[2.5rem] p-8"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div>
                      <p className="text-xs font-black text-purple-700 tracking-widest uppercase">
                        Your Result
                      </p>
                      <h3 className="text-2xl font-black text-gray-900 mt-2">
                        Score: {score} / {maxScore}
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className={`px-3 py-1.5 rounded-2xl text-xs font-black ${level.color}`}>
                          Overall: {level.label}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-4 leading-relaxed">
                        {level.detail}
                      </p>
                    </div>

                    <div className="bg-white rounded-3xl border border-purple-100 p-6 md:w-[360px]">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700">
                          <ShieldAlert className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-black text-gray-900">Important</p>
                          <p className="text-sm text-gray-600 mt-1">
                            This is not a diagnosis. It’s a self‑reflection tool to help you notice patterns. If anxiety is affecting work, relationships, sleep, or health, consider professional support.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 bg-white rounded-3xl border border-purple-100 p-6">
                    <p className="text-sm font-black text-gray-900 tracking-wider uppercase">
                      Breakdown
                    </p>
                    <div className="mt-5 space-y-4">
                      {(Object.keys(domainScores) as Question['domain'][]).map((domain) => {
                        const data = domainScores[domain];
                        const pct = data.max === 0 ? 0 : Math.round((data.score / data.max) * 100);
                        return (
                          <div key={domain}>
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-black text-gray-900">{domainMeta[domain].label}</span>
                              <span className="font-black text-purple-700">{data.score}/{data.max}</span>
                            </div>
                            <div className="mt-2 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/"
                      className="px-6 py-3 rounded-2xl font-black text-purple-700 bg-white border border-purple-200 hover:bg-purple-50 transition-colors text-center"
                    >
                      Back to QuietBridge
                    </Link>
                    <Link
                      href="/anxiety-test"
                      className="px-6 py-3 rounded-2xl font-black text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors text-center"
                    >
                      Back to Anxiety Test
                    </Link>
                    <button
                      type="button"
                      onClick={reset}
                      className="px-6 py-3 rounded-2xl font-black text-white bg-gray-900 hover:bg-black transition-colors"
                    >
                      Take Again
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
