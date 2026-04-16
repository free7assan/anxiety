'use client';

import { ReactNode, useState } from 'react';
import Navigation from '@/components/Navigation';
import SurveyPopup from '@/components/SurveyPopup';

export default function PageShell({ children }: { children: ReactNode }) {
  const [showSurvey, setShowSurvey] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <Navigation onStartFree={() => setShowSurvey(true)} />
      <SurveyPopup isOpen={showSurvey} onClose={() => setShowSurvey(false)} />
      {children}
    </div>
  );
}

