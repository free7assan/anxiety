'use client';

import { Zap } from 'lucide-react';
import Link from 'next/link';

interface NavigationProps {
  onStartFree: () => void;
}

export default function Navigation({ onStartFree }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold text-purple-900 tracking-tight">QuietBridge</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#struggle" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">The Struggle</Link>
            <Link href="#transformation" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">The Solution</Link>
            <Link href="#faq" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">FAQ</Link>
          </div>

          <button 
            onClick={onStartFree}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105"
          >
            Start Free
          </button>
        </div>
      </div>
    </nav>
  );
}