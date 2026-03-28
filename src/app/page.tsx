'use client';

import { motion } from 'framer-motion';
import { Brain, Heart, Users, Briefcase, MessageSquare, ArrowRight, CheckCircle, Smartphone, Zap, Shield, MessageCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import SurveyPopup from '@/components/SurveyPopup';
import { useState, useEffect } from 'react';

export default function Home() {
  const [showSurvey, setShowSurvey] = useState(false);

  useEffect(() => {
    // Show survey after 5 seconds on every page load or refresh
    const timer = setTimeout(() => {
      setShowSurvey(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <Navigation onStartFree={() => setShowSurvey(true)} />
      <SurveyPopup isOpen={showSurvey} onClose={() => setShowSurvey(false)} />
      
      {/* Floating Survey Button */}
      <button
        onClick={() => setShowSurvey(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
        aria-label="Provide feedback"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
      
      {/* Above the Fold */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Never 'Lose Your Words' Again.
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                The first real-time safety net for social anxiety. Get instant, proven social scripts for when your mind goes blank, your heart races, and you just need to know what to say.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Stop the 'Mental Blanking' during high-stakes moments.</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Overcome the 'Fear of Scrutiny' with pre-validated responses.</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Navigate 'Work Culture' and 'Job Hunting' without the paralysis.</span>
                </div>
              </div>
              
              <button 
                onClick={() => setShowSurvey(true)}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 hover:from-purple-700 hover:via-pink-700 hover:to-yellow-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-200"
              >
                Get My Safety Net — Start Free
              </button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 rounded-3xl p-8 shadow-xl shadow-purple-200/50">
                <div className="bg-white rounded-2xl p-6 shadow-md border border-purple-100">
                  <div className="flex items-center mb-4">
                    <Zap className="h-6 w-6 text-yellow-500 mr-2" />
                    <span className="font-semibold text-purple-800">Panic Script: Awkward Silence</span>
                  </div>
                  <div className="space-y-3 text-sm text-purple-600">
                    <p>"That's an interesting point. I'd love to think more about that..."</p>
                    <p>"Speaking of which, I should probably check in with [friend's name] over there."</p>
                    <p>"It was great chatting with you!"</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-purple-100">
                    <button className="w-full bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 hover:text-pink-800 py-2 rounded-lg font-medium text-sm transition-all duration-200">
                      Emergency Exit
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Struggle */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            Does it feel like your brain freezes the moment someone looks at you?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-6 rounded-2xl shadow-sm"
            >
              <Heart className="h-8 w-8 text-red-500 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-3">The Physiological Wall</h3>
              <p className="text-gray-600 text-sm">
                Your heart rate spikes, your tongue feels like it expands, and suddenly, you can't muster a word out. You're not boring; you're just paralyzed.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm"
            >
              <Briefcase className="h-8 w-8 text-blue-500 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-3">The Career Bottleneck</h3>
              <p className="text-gray-600 text-sm">
                Work culture feels nearly impossible. You've lost jobs or missed opportunities because the 'unstructured social' parts of the day feel like a nightmare.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-6 rounded-2xl shadow-sm"
            >
              <Users className="h-8 w-8 text-green-500 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-3">The Isolation Cycle</h3>
              <p className="text-gray-600 text-sm">
                Years of isolation because talking to 'threatening strangers' feels like a high-stakes test you're destined to fail.
              </p>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 bg-blue-50 rounded-2xl p-6"
          >
            <p className="text-blue-800 font-medium">
              Most people tell you to 'just be yourself' or 'practice in the mirror.' But when your nervous system is in a tailspin, you don't need advice—you need a script.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Transformation */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Imagine walking into any room with a 'Social Teleprompter' in your pocket.
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-3">Professional Confidence</h3>
              <p className="text-gray-600 text-sm">
                Handle job interviews and office small talk with 'Safe Exit' scripts that protect your energy.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-3">Physiological Peace</h3>
              <p className="text-gray-600 text-sm">
                Lower your social heart rate knowing you have a giant 'Panic Button' that gives you the exact words to say if you freeze.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-3">Real Connection</h3>
              <p className="text-gray-600 text-sm">
                Move past the 'handshake barrier' and finally form the connections you've been missing for years.
              </p>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-700 font-medium">
              We don't just 'track' your anxiety; we give you the actual mechanics to bypass it in real-time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Promptly: Your Real-Time Social Safety Net
            </h2>
            <p className="text-gray-600">
              The first tool that gives you words when your mind goes blank
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-6 rounded-2xl shadow-sm text-center"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-3">Pick Your Scenario</h3>
              <p className="text-gray-600 text-sm">
                Choose from 'Work,' 'Dating,' 'Returns,' or 'Small Talk.'
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm text-center"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-3">Get Your Script</h3>
              <p className="text-gray-600 text-sm">
                Access AI-generated prompts tailored to your specific situation.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-6 rounded-2xl shadow-sm text-center"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-3">Press for Panic</h3>
              <p className="text-gray-600 text-sm">
                If your mind goes blank, hit the Panic Button for an instant 'Exit Script' to leave the situation gracefully.
              </p>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-gray-700 italic">
                  "I know what it's like to feel like a 'social failure.' We built Promptly because 'Socially anxious people are the nicest'—you just need a tool to help the world see that."
                </p>
                <p className="text-gray-600 text-sm mt-2">— Founder, Promptly</p>
              </div>
            </div>
          </motion.div>
          
          <div className="text-center mt-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
              Join 5,000+ People Finding Their Voice
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                Is my data private?
              </h3>
              <p className="text-gray-600">
                Absolutely. We use end-to-end encryption and never store your conversation data. Your scripts and usage patterns are completely private and secure.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">How does the Panic Button work?</h3>
              <p className="text-gray-600">
                With one tap, you get immediate access to graceful exit scripts that help you leave any situation without awkwardness or explanation.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Is there a free trial?</h3>
              <p className="text-gray-600">
                Yes! Start with our free plan that includes basic scripts and one panic scenario. Upgrade anytime for full access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Email Capture */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-6">Get Your Free Social Survival Guide</h3>
          <p className="text-gray-300 mb-8">
            7 proven scripts to handle your most anxious moments, delivered immediately.
          </p>
          
          <form className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Get Guide
              </button>
            </div>
          </form>
          
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex items-center justify-center space-x-2">
              <Brain className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-semibold">Promptly</span>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Helping socially anxious people find their voice since 2024
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}