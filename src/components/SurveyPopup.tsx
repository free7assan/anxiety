'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Star, ChevronLeft, ChevronRight, CheckCircle, Shield, Zap, Heart, Smartphone, Users, Briefcase } from 'lucide-react';

interface SurveyPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SurveyPopup({ isOpen, onClose }: SurveyPopupProps) {
  const [formData, setFormData] = useState({
    frequency: '',
    triggers: [] as string[],
    symptoms: '',
    preparation: '',
    goal: '',
    setting: '',
    scriptType: '',
    format: '',
    mustHave: '',
    email: '',
    name: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const options = {
    frequency: ['Daily', 'Weekly', 'Monthly', 'Rarely'],
    triggers: [
      'Job interviews',
      'Work meetings',
      'Dating/social events',
      'Phone calls',
      'Public speaking',
      'Small talk with strangers',
      'Group conversations',
      'Networking events'
    ],
    symptoms: ['Racing heart', 'Mental blanking', 'Sweating', 'Trembling', 'Nausea', 'Shortness of breath'],
    preparation: ['Hours', 'Minutes', 'A few seconds', 'Not at all'],
    goal: ['Build confidence', 'Graceful exits', 'Better networking', 'Dating success', 'Daily comfort'],
    setting: ['In-person', 'Online meetings', 'Texting', 'Phone calls'],
    scriptType: ['Professional/Work', 'Casual/Friends', 'Emergency/Panic', 'Deep/Vulnerable'],
    format: ['Short one-liners', 'Full conversation flows', 'Bullet points', 'AI-generated dynamic'],
    mustHave: ['AI Generation', 'Voice mode', 'Offline access', 'Practice mode', 'Real-time prompts']
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectOption = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (currentStep < 10 && field !== 'triggers') {
      setTimeout(() => nextStep(), 300);
    }
  };

  const handleCheckboxChange = (situation: string) => {
    setFormData(prev => ({
      ...prev,
      triggers: prev.triggers.includes(situation)
        ? prev.triggers.filter(s => s !== situation)
        : [...prev.triggers, situation]
    }));
  };

  const nextStep = () => {
    if (currentStep < 10) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          pageUrl: window.location.href
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          onClose();
          setSubmitStatus('idle');
          setFormData({
            frequency: '',
            triggers: [],
            symptoms: '',
            preparation: '',
            goal: '',
            setting: '',
            scriptType: '',
            format: '',
            mustHave: '',
            email: '',
            name: ''
          });
          setCurrentStep(1);
        }, 2000);
      } else {
        throw new Error('Failed to submit survey');
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Survey submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    const stepConfigs = [
      {
        id: 1,
        title: "How often do you feel 'frozen' or anxious in social situations?",
        field: 'frequency',
        type: 'select'
      },
      {
        id: 2,
        title: "Which situations do you find most challenging?",
        field: 'triggers',
        type: 'multi'
      },
      {
        id: 3,
        title: "What is your primary physical symptom during anxiety?",
        field: 'symptoms',
        type: 'select'
      },
      {
        id: 4,
        title: "How much time do you spend 'rehearsing' conversations?",
        field: 'preparation',
        type: 'select'
      },
      {
        id: 5,
        title: "What is your primary goal for using social scripts?",
        field: 'goal',
        type: 'select'
      },
      {
        id: 6,
        title: "Where would you use Promptly most often?",
        field: 'setting',
        type: 'select'
      },
      {
        id: 7,
        title: "Which script category interests you most?",
        field: 'scriptType',
        type: 'select'
      },
      {
        id: 8,
        title: "What is your preferred script format?",
        field: 'format',
        type: 'select'
      },
      {
        id: 9,
        title: "What single feature would make this app a must-have?",
        field: 'mustHave',
        type: 'select'
      },
      {
        id: 10,
        title: "Ready for early access? Enter your details.",
        field: 'contact',
        type: 'final'
      }
    ];

    const config = stepConfigs[currentStep - 1];

    if (config.type === 'select') {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-purple-900 mb-4">{config.title}</h3>
          <div className="grid grid-cols-1 gap-3">
            {(options as any)[config.field].map((option: string) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelectOption(config.field, option)}
                className={`p-4 rounded-xl text-left transition-all border-2 ${
                  (formData as any)[config.field] === option
                    ? 'border-purple-500 bg-purple-50 text-purple-900'
                    : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-purple-200 hover:bg-purple-50/30'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (config.type === 'multi') {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-purple-900 mb-4">{config.title}</h3>
          <div className="grid grid-cols-2 gap-3">
            {options.triggers.map((situation) => (
              <label key={situation} className={`flex items-center space-x-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                formData.triggers.includes(situation)
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-100 bg-gray-50 hover:border-purple-200'
              }`}>
                <input
                  type="checkbox"
                  checked={formData.triggers.includes(situation)}
                  onChange={() => handleCheckboxChange(situation)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
                />
                <span className="text-sm text-gray-700 font-medium">{situation}</span>
              </label>
            ))}
          </div>
        </div>
      );
    }

    if (config.type === 'final') {
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">{config.title}</h3>
          <p className="text-gray-600 text-sm mb-4">We'll notify you as soon as new scripts matching your profile are ready.</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (optional)</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                placeholder="you@example.com"
              />
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-[2.5rem] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-xl">
                    <MessageCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Personalize Your Safety Net</h2>
                    <p className="text-sm text-gray-500">Step {currentStep} of 10</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {submitStatus === 'success' ? (
                <div className="text-center py-12">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                  <p className="text-gray-600">Your profile has been created. We're customizing your scripts now.</p>
                </div>
              ) : submitStatus === 'error' ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <X className="h-10 w-10 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h3>
                  <p className="text-gray-600 mb-6">Something went wrong. Please try again.</p>
                  <button
                    onClick={() => setSubmitStatus('idle')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-bold"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  {/* Progress Bar */}
                  <div className="mb-10">
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStep / 10) * 100}%` }}
                        className="bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 h-full"
                      />
                    </div>
                  </div>

                  <form onSubmit={currentStep === 10 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="min-h-[300px]"
                      >
                        {renderStep()}
                      </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="flex items-center gap-2 px-6 py-3 text-gray-500 font-bold hover:text-purple-600 disabled:opacity-0 transition-all"
                      >
                        <ChevronLeft className="h-5 w-5" />
                        Back
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting || (currentStep === 2 && formData.triggers.length === 0)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-purple-200 hover:shadow-purple-300 transform transition-all active:scale-95 disabled:grayscale disabled:opacity-50"
                      >
                        {currentStep === 10 
                          ? (isSubmitting ? 'Personalizing...' : 'Complete Profile') 
                          : (currentStep === 2 ? 'Next Question' : 'Continue')}
                        {currentStep < 10 && <ChevronRight className="h-5 w-5 inline ml-2" />}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
