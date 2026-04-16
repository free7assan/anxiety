'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Heart, Users, Briefcase, MessageSquare, ArrowRight, CheckCircle, Smartphone, Zap, Shield, MessageCircle, ChevronDown } from 'lucide-react';
import Navigation from '@/components/Navigation';
import SurveyPopup from '@/components/SurveyPopup';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function HomeClient() {
  const router = useRouter();
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveySource, setSurveySource] = useState('unknown');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleShowSurvey = (source: string) => {
    setSurveySource(source);
    setShowSurvey(true);
  };

  useEffect(() => {
    if (showSurvey) {
      const trackTrigger = async () => {
        const sessionId = sessionStorage.getItem('qb_visitor_session');
        if (!sessionId) return;

        try {
          await fetch('/api/track-trigger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, triggerSource: surveySource })
          });
        } catch (err) {
          console.error('Failed to track survey trigger:', err);
        }
      };
      trackTrigger();
    }
  }, [showSurvey, surveySource]);

  useEffect(() => {
    // Track unique visits per session
    const trackVisit = async () => {
      let sessionId = sessionStorage.getItem('qb_visitor_session');
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
        sessionStorage.setItem('qb_visitor_session', sessionId);
      }
      
      try {
        await fetch('/api/track-visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        });
      } catch (err) {
        console.error('Failed to track visit:', err);
      }
    };
    
    trackVisit();
  }, []);

  const faqs = [
    {
      question: "Is my data private?",
      answer: "Absolutely. We use end-to-end encryption and never store your conversation data. Your scripts and usage patterns are completely private and secure.",
      icon: <Shield className="h-5 w-5 text-purple-600" />
    },
    {
      question: "How does the Panic Button work?",
      answer: "With one tap, you get immediate access to graceful exit scripts that help you leave any situation without awkwardness or explanation.",
      icon: <Zap className="h-5 w-5 text-yellow-600" />
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! Start with our free plan that includes basic scripts and one panic scenario. Upgrade anytime for full access.",
      icon: <CheckCircle className="h-5 w-5 text-pink-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <Navigation onStartFree={() => handleShowSurvey('navigation')} />
      <SurveyPopup isOpen={showSurvey} onClose={() => setShowSurvey(false)} />
      
      {/* Floating Survey Button */}
      <button
        onClick={() => handleShowSurvey('floating')}
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
                onClick={() => router.push('/anxiety-test')}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 hover:from-purple-700 hover:via-pink-700 hover:to-yellow-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-200"
              >
                Start Anxiety Test
              </button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative min-h-[500px] flex items-center justify-center"
            >
              {/* Main Background Card with Image */}
               <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-purple-200/50">
                 <Image 
                   src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1200" 
                   alt="Social atmosphere" 
                   fill
                   className="object-cover scale-105"
                   priority
                 />
                 <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/60 via-purple-900/20 to-transparent" />
               </div>

              {/* Floating Script Cards Container */}
              <div className="relative w-full max-w-md p-6 space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 transform -rotate-2 hover:rotate-0 transition-transform duration-300"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-purple-100 p-1.5 rounded-lg">
                      <Zap className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">Panic Script</span>
                  </div>
                  <p className="text-gray-800 font-medium italic">"That's an interesting point. I'd love to think more about that..."</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 transform rotate-1 hover:rotate-0 transition-transform duration-300 translate-x-4"
                >
                  <p className="text-gray-800 font-medium italic">"Speaking of which, I should probably check in with Nick over there."</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 transform -rotate-1 hover:rotate-0 transition-transform duration-300 -translate-x-2"
                >
                  <p className="text-gray-800 font-medium italic">"It was great chatting with you!"</p>
                </motion.div>

                {/* Emergency Exit Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="pt-4 flex justify-end"
                >
                  <button className="group bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-red-200 transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-1 active:scale-95">
                    <Shield className="h-5 w-5 animate-pulse" />
                    <span>EMERGENCY EXIT</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              </div>

              {/* Decorative floating badges */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-10 bg-yellow-400 text-yellow-900 text-[10px] font-black px-3 py-1 rounded-full shadow-lg transform rotate-12"
              >
                REAL-TIME SAFETY
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 left-10 bg-purple-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg transform -rotate-12"
              >
                SOCIAL TELEPROMPTER
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Struggle: Real Experiences */}
      <section id="struggle" className="py-24 bg-[#FDFCFE] px-4 sm:px-6 lg:px-8 border-t border-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
              The Invisible Consequences
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Social anxiety isn't just "shyness." It's a series of silent walls that keep your life smaller than it should be.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Terrified of Job Interviews",
                image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800",
                thoughts: ["I can't do this!", "What if I mess up?"],
                tags: ["Panic", "Self-Doubt"],
                color: "bg-red-500"
              },
              {
                title: "Invisible at Work",
                image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
                thoughts: ["I'm so alone...", "They never notice me.."],
                tags: ["Ignored", "Left Out"],
                color: "bg-purple-500"
              },
              {
                title: "Watching Friendships Fade",
                image: "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=800",
                thoughts: ["They don't need me...", "I'm all alone."],
                tags: ["Isolation", "Loneliness"],
                color: "bg-pink-500"
              },
              {
                title: "Brain Goes Blank",
                image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&q=80&w=800",
                thoughts: ["I can't think...", "What if I say..."],
                tags: ["Mind Maze", "Anxiety Fog"],
                color: "bg-blue-500"
              },
              {
                title: "Throwing Away Chances",
                image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
                thoughts: ["Avoidance", "Regret"],
                tags: ["Fear", "Missed"],
                color: "bg-yellow-500"
              },
              {
                title: "Socially Exhausted",
                image: "https://images.unsplash.com/photo-1520975958225-7d6b4a2b0aa5?auto=format&fit=crop&q=80&w=800",
                thoughts: ["I'm so drained..", "I can't face it."],
                tags: ["Burnout", "Exhaustion"],
                color: "bg-gray-800"
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-purple-50 hover:shadow-xl transition-all duration-500"
              >
                {/* Illustration Panel */}
                <div className="h-64 relative overflow-hidden bg-gray-50">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Thought Bubbles inspired by the image */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    <div className="flex flex-col gap-2 items-start">
                      {item.thoughts.map((thought, i) => (
                        <motion.div 
                          key={i}
                          initial={{ scale: 0, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.5 + (i * 0.2) }}
                          className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-2xl rounded-tl-none shadow-sm border border-white/50"
                        >
                          <p className="text-[10px] font-bold text-gray-800 tracking-tight">{thought}</p>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Emotion Tags */}
                    <div className="flex gap-2">
                      {item.tags.map((tag, i) => (
                        <div key={i} className={`${item.color} text-white text-[9px] font-black px-2 py-1 rounded-md transform -rotate-2 group-hover:rotate-0 transition-transform`}>
                          {tag.toUpperCase()}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Label */}
                <div className="p-4 bg-white border-t border-purple-50">
                  <h3 className="font-bold text-gray-900 text-sm text-center uppercase tracking-widest">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 bg-gradient-to-r from-purple-50 to-pink-50 rounded-[2.5rem] p-10 text-center border border-purple-100 shadow-inner"
          >
            <p className="text-xl text-purple-900 font-medium leading-relaxed max-w-3xl mx-auto">
              "I know what it's like to feel like a 'social failure.' We built QuietBridge because socially anxious people are actually the nicest—you just need a bridge to help the world see that."
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600" />
              <div className="text-left">
                <p className="font-bold text-gray-900 text-sm">Founder</p>
                <p className="text-xs text-gray-500">QuietBridge ⚡</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Transformation */}
      <section id="transformation" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Imagine walking into any room with a 'Social Teleprompter' in your pocket.
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="h-48 relative overflow-hidden bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800" 
                  alt="A professional job interview setting" 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-4 left-4 bg-green-50/90 backdrop-blur-sm p-2 rounded-xl">
                  <Briefcase className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-gray-900 mb-3">Professional Confidence</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Handle job interviews and office small talk with 'Safe Exit' scripts that protect your energy.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="h-48 relative overflow-hidden bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800" 
                  alt="A person practicing yoga or meditation for peace" 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-4 left-4 bg-blue-50/90 backdrop-blur-sm p-2 rounded-xl">
                  <Heart className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-gray-900 mb-3">Physiological Peace</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Lower your social heart rate knowing you have a giant 'Panic Button' that gives you the exact words to say if you freeze.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="h-48 relative overflow-hidden bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800" 
                  alt="A group of friends laughing together" 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-4 left-4 bg-purple-50/90 backdrop-blur-sm p-2 rounded-xl">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-gray-900 mb-3">Real Connection</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Move past the 'handshake barrier' and finally form the connections you've been missing for years.
                </p>
              </div>
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
              QuietBridge: Your Real-Time Social Safety Net
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
                  "I know what it's like to feel like a 'social failure.' We built QuietBridge because 'Socially anxious people are the nicest'—you just need a tool to help the world see that."
                </p>
                <p className="text-gray-600 text-sm mt-2">— Founder, QuietBridge</p>
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
      <section id="faq" className="py-20 bg-gray-50/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12 tracking-tight">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                initial={false}
                className="bg-white rounded-2xl overflow-hidden border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-50 p-2 rounded-xl group-hover:bg-purple-100 transition-colors">
                      {faq.icon}
                    </div>
                    <span className="font-bold text-gray-900 text-lg">{faq.question}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: activeFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="text-purple-400 group-hover:text-purple-600"
                  >
                    <ChevronDown className="h-6 w-6" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed border-t border-purple-50 ml-12 mr-6">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
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
              <Zap className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-semibold">QuietBridge</span>
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

