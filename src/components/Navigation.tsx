'use client';

import { useEffect, useState } from 'react';
import { Menu, X, Zap } from 'lucide-react';
import Link from 'next/link';

interface NavigationProps {
  onStartFree: () => void;
}

export default function Navigation({ onStartFree }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" onClick={closeMenu} className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <Zap className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold text-purple-900 tracking-tight">QuietBridge</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {mounted && (
              <>
                <Link href="/#struggle" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">The Struggle</Link>
                <Link href="/#transformation" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">The Solution</Link>
                <Link href="/anxiety-test" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">Anxiety Test</Link>
                <Link href="/blog" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">Blog</Link>
                <Link href="/#faq" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">FAQ</Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onStartFree}
              className="hidden sm:inline-flex bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105"
            >
              Start Free
            </button>

            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={isOpen}
              aria-controls="qb-mobile-menu"
              onClick={() => setIsOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div id="qb-mobile-menu" className="md:hidden pb-4">
            <div className="mt-2 rounded-2xl border border-purple-100 bg-white shadow-sm overflow-hidden">
              {mounted && (
                <div className="flex flex-col">
                  <Link onClick={closeMenu} href="/#struggle" className="px-5 py-4 text-gray-800 font-bold hover:bg-purple-50 transition-colors">
                    The Struggle
                  </Link>
                  <Link onClick={closeMenu} href="/#transformation" className="px-5 py-4 text-gray-800 font-bold hover:bg-purple-50 transition-colors">
                    The Solution
                  </Link>
                  <Link onClick={closeMenu} href="/anxiety-test" className="px-5 py-4 text-gray-800 font-bold hover:bg-purple-50 transition-colors">
                    Anxiety Test
                  </Link>
                  <Link onClick={closeMenu} href="/blog" className="px-5 py-4 text-gray-800 font-bold hover:bg-purple-50 transition-colors">
                    Blog
                  </Link>
                  <Link onClick={closeMenu} href="/#faq" className="px-5 py-4 text-gray-800 font-bold hover:bg-purple-50 transition-colors">
                    FAQ
                  </Link>
                </div>
              )}

              <div className="p-4 border-t border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    onStartFree();
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-2xl font-black transition-all active:scale-95"
                >
                  Start Free
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
