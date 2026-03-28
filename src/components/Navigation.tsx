'use client';

import { Brain } from 'lucide-react';

interface NavigationProps {
  onStartFree: () => void;
}

export default function Navigation({ onStartFree }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-semibold text-purple-900">Promptly</span>
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