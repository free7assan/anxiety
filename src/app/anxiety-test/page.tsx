'use client';

import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ShieldAlert } from 'lucide-react';
import Navigation from '@/components/Navigation';
import SurveyPopup from '@/components/SurveyPopup';

type GAD7Answer = 0 | 1 | 2 | 3;

type Question = {
  id: string;
  text: string;
};

const questions: Question[] = [
  { id: 'nervous', text: 'Feeling nervous, anxious, or on edge' },
  { id: 'controlWorry', text: 'Not being able to stop or control worrying' },
  { id: 'worryTooMuch', text: 'Worrying too much about different things' },
  { id: 'troubleRelaxing', text: 'Trouble relaxing' },
  { id: 'restless', text: 'Being so restless that it is hard to sit still' },
  { id: 'irritable', text: 'Becoming easily annoyed or irritable' },
  { id: 'afraid', text: 'Feeling afraid as if something awful might happen' },
];

const options: { label: string; value: GAD7Answer }[] = [
  { label: 'Not at all', value: 0 },
  { label: 'Several days', value: 1 },
  { label: 'More than half the days', value: 2 },
  { label: 'Nearly every day', value: 3 },
];

function getSeverity(score: number) {
  if (score <= 4) return { label: 'Minimal', color: 'bg-green-100 text-green-700' };
  if (score <= 9) return { label: 'Mild', color: 'bg-yellow-100 text-yellow-800' };
  if (score <= 14) return { label: 'Moderate', color: 'bg-orange-100 text-orange-800' };
  return { label: 'Severe', color: 'bg-red-100 text-red-700' };
}

function getLikelihood(score: number) {
  if (score <= 4) return { label: 'Low', detail: 'Your responses suggest low anxiety symptom burden.' };
  if (score <= 9) return { label: 'Possible', detail: 'Your responses suggest some anxiety symptoms that may be impacting you.' };
  if (score <= 14) return { label: 'Likely', detail: 'Your responses suggest clinically significant anxiety symptoms.' };
  return { label: 'High', detail: 'Your responses suggest high levels of anxiety symptoms.' };
}

export default function AnxietyTestPage() {
  const [showSurvey, setShowSurvey] = useState(false);
  const [answers, setAnswers] = useState<(GAD7Answer | null)[]>(Array(questions.length).fill(null));
  const [difficulty, setDifficulty] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(0);
  const saveOnceRef = useRef(false);

  const score = useMemo(() => {
    return answers.reduce<number>((sum, a) => sum + (a ?? 0), 0);
  }, [answers]);

  const completedCount = useMemo(() => answers.filter((a) => a !== null).length, [answers]);
  const allAnswered = completedCount === questions.length;

  const severity = useMemo(() => getSeverity(score), [score]);
  const likelihood = useMemo(() => getLikelihood(score), [score]);

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
          testType: 'anxiety-test',
          sessionId,
          answers,
          difficulty,
          result: {
            score,
            severity: getSeverity(score).label,
            likelihood: getLikelihood(score).label,
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
    setDifficulty('');
    setSubmitted(false);
    setStep(0);
    saveOnceRef.current = false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <Navigation onStartFree={() => setShowSurvey(true)} />
      <SurveyPopup isOpen={showSurvey} onClose={() => setShowSurvey(false)} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-purple-200/40 border border-purple-100 overflow-hidden">
          <div className="p-8 md:p-10">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Over the last 2 weeks…
            </h1>
            <p className="text-gray-600 mt-3 max-w-3xl">
              Answer these 7 questions to get a quick snapshot of generalized anxiety symptoms.
            </p>

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
                  {step < questions.length ? (
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
                          <h2 className="text-2xl font-black text-gray-900 mt-3 tracking-tight">
                            {questions[step].text}
                          </h2>
                        </div>
                        {answers[step] !== null && (
                          <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-2xl text-xs font-black flex items-center gap-1.5 shrink-0">
                            <CheckCircle className="h-4 w-4" />
                            Selected
                          </div>
                        )}
                      </div>

                      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {options.map((o) => {
                          const selected = answers[step] === o.value;
                          return (
                            <button
                              key={`${questions[step].id}-${o.value}`}
                              type="button"
                              onClick={() => {
                                const next = [...answers];
                                next[step] = o.value;
                                setAnswers(next);
                              }}
                              className={[
                                'px-5 py-4 rounded-2xl text-left border-2 transition-all font-black',
                                selected
                                  ? 'border-purple-600 bg-white text-purple-900 shadow-sm'
                                  : 'border-transparent bg-white text-gray-700 hover:border-purple-200 hover:bg-purple-50/30',
                              ].join(' ')}
                            >
                              {o.label}
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
                          <button
                            type="button"
                            disabled={answers[step] === null}
                            onClick={() => setStep((s) => Math.min(questions.length, s + 1))}
                            className="px-8 py-3 rounded-2xl font-black text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-200 active:scale-95 disabled:opacity-50 disabled:grayscale"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="difficulty"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-[2.5rem] border border-purple-100 p-8"
                    >
                      <p className="text-xs font-black text-purple-700 tracking-widest uppercase">
                        Final Step
                      </p>
                      <h2 className="text-2xl font-black text-gray-900 mt-3 tracking-tight">
                        Optional: How difficult has this been?
                      </h2>
                      <p className="text-gray-600 mt-2">
                        This doesn’t change your score, but it helps you reflect on impact.
                      </p>
                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                          'Not difficult at all',
                          'Somewhat difficult',
                          'Very difficult',
                          'Extremely difficult',
                        ].map((label) => {
                          const selected = difficulty === label;
                          return (
                            <button
                              key={label}
                              type="button"
                              onClick={() => setDifficulty(label)}
                              className={[
                                'px-4 py-3 rounded-2xl text-left border-2 transition-all font-black text-sm',
                                selected
                                  ? 'border-purple-600 bg-purple-50 text-purple-900'
                                  : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-purple-200 hover:bg-purple-50/30',
                              ].join(' ')}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={() => setStep(questions.length - 1)}
                          className="px-6 py-3 rounded-2xl font-black text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
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
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              ) : null}
            </div>

            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.25 }}
                  className="mt-10 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 border border-purple-100 rounded-[2.5rem] p-8"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                      <p className="text-xs font-black text-purple-700 tracking-widest uppercase">
                        Your Result
                      </p>
                      <h3 className="text-2xl font-black text-gray-900 mt-2">
                        Score: {score} / 21
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className={`px-3 py-1.5 rounded-2xl text-xs font-black ${severity.color}`}>
                          {severity.label} severity
                        </span>
                        <span className="px-3 py-1.5 rounded-2xl text-xs font-black bg-purple-100 text-purple-700">
                          Likelihood: {likelihood.label}
                        </span>
                        {difficulty && (
                          <span className="px-3 py-1.5 rounded-2xl text-xs font-black bg-white text-gray-700 border border-purple-100">
                            Impact: {difficulty}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mt-4 leading-relaxed">
                        {likelihood.detail}
                      </p>
                    </div>
                    <div className="bg-white rounded-3xl border border-purple-100 p-6 md:w-[340px]">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700">
                          <ShieldAlert className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-black text-gray-900">Important</p>
                          <p className="text-sm text-gray-600 mt-1">
                            This is a screening tool, not a diagnosis. If your score is 10 or higher, many clinicians consider it a positive screen for anxiety symptoms—consider talking to a professional.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/advanced-test"
                      className="px-6 py-3 rounded-2xl font-black text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all text-center shadow-lg shadow-purple-200"
                    >
                      Take Advanced Test
                    </Link>
                    <Link
                      href="/"
                      className="px-6 py-3 rounded-2xl font-black text-purple-700 bg-white border border-purple-200 hover:bg-purple-50 transition-colors text-center"
                    >
                      Back to QuietBridge
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
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
