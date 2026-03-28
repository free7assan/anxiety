'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface SurveyPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SurveyPopup({ isOpen, onClose }: SurveyPopupProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    anxietyLevel: '',
    socialSituations: [] as string[],
    currentCoping: '',
    desiredFeatures: '',
    biggestChallenge: '',
    generalFeedback: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const socialSituationOptions = [
    'Job interviews',
    'Work meetings',
    'Dating/social events',
    'Phone calls',
    'Public speaking',
    'Small talk with strangers',
    'Group conversations',
    'Networking events'
  ];

  const anxietyLevelOptions = [
    'Mild - occasional discomfort',
    'Moderate - often avoid situations',
    'Severe - significant life impact',
    'Debilitating - prevents daily activities'
  ];

  const copingStrategyOptions = [
    'Avoidance - I just avoid social situations',
    'Preparation - I rehearse conversations beforehand',
    'Breathing exercises',
    'Therapy/counseling',
    'Medication',
    'No strategies - I struggle through it',
    'Other apps/tools'
  ];

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

  const handleCheckboxChange = (situation: string) => {
    setFormData(prev => ({
      ...prev,
      socialSituations: prev.socialSituations.includes(situation)
        ? prev.socialSituations.filter(s => s !== situation)
        : [...prev.socialSituations, situation]
    }));
  };



  const nextStep = () => {
    if (currentStep < 6) {
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
            name: '',
            email: '',
            anxietyLevel: '',
            socialSituations: [],
            currentCoping: '',
            desiredFeatures: '',
            biggestChallenge: '',
            generalFeedback: ''
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
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tell us about your social anxiety journey</h3>
              <p className="text-gray-600 text-sm mb-4">
                We want to understand your experience better to make Promptly more helpful for you.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's your biggest social challenge right now?*
              </label>
              <textarea
                name="biggestChallenge"
                value={formData.biggestChallenge}
                onChange={handleInputChange}
                rows={3}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., job interviews, making small talk, dating..."
              />
              <p className="text-xs text-gray-500 mt-1">Quick suggestions: job interviews, small talk, dating, phone calls, meetings</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Which social situations are most challenging?</h3>
              <div className="grid grid-cols-2 gap-3">
                {socialSituationOptions.map((situation) => (
                  <label key={situation} className="flex items-center space-x-2 p-2 bg-purple-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={formData.socialSituations.includes(situation)}
                      onChange={() => handleCheckboxChange(situation)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">{situation}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How would you describe your anxiety level?*
              </label>
              <select
                name="anxietyLevel"
                value={formData.anxietyLevel}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select your anxiety level</option>
                {anxietyLevelOptions.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What coping strategies do you currently use?*
              </label>
              <select
                name="currentCoping"
                value={formData.currentCoping}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select your strategies</option>
                {copingStrategyOptions.map((strategy) => (
                  <option key={strategy} value={strategy}>{strategy}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What features would be most helpful in Promptly?*
              </label>
              <textarea
                name="desiredFeatures"
                value={formData.desiredFeatures}
                onChange={handleInputChange}
                rows={3}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., specific scripts, panic button improvements, voice guidance..."
              />
              <p className="text-xs text-gray-500 mt-1">Suggestions: more scenario scripts, voice prompts, emergency exit phrases, practice mode</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Any other feedback or suggestions?
              </label>
              <textarea
                name="generalFeedback"
                value={formData.generalFeedback}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Your thoughts..."
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name (optional)
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address*
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="your.email@example.com"
              />
              <p className="text-xs text-gray-500 mt-1">We'll only use this to send you updates about Promptly</p>
            </div>
          </div>
        );

      default:
        return null;
    }
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
              className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-6 w-6 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Help Us Improve Promptly</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {submitStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Thank You!</h3>
                  <p className="text-gray-600">Your feedback helps us make Promptly better for people with social anxiety.</p>
                </div>
              ) : submitStatus === 'error' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops!</h3>
                  <p className="text-gray-600 mb-4">Something went wrong. Please try again.</p>
                  <button
                    onClick={() => setSubmitStatus('idle')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span>Question {currentStep} of 5</span>
                      <span>{Math.round((currentStep / 5) * 100)}% complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(currentStep / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <form onSubmit={currentStep === 5 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
                    {renderStep()}

                    <div className="flex justify-between mt-8">
                      <button
                        type="button"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="flex items-center space-x-1 px-4 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Back</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {currentStep === 5 
                          ? (isSubmitting ? 'Submitting...' : 'Submit Feedback') 
                          : 'Next'}
                        {currentStep < 5 && <ChevronRight className="h-4 w-4 ml-1" />}
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