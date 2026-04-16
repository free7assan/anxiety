import type { Metadata } from 'next';
import HomeClient from './home-client';

export const metadata: Metadata = {
  title: 'QuietBridge',
  description:
    'A real-time safety net for social anxiety: instant scripts, practical tools, and evidence-based guidance so you never lose your words again.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    title: 'QuietBridge',
    description:
      'A real-time safety net for social anxiety: instant scripts, practical tools, and evidence-based guidance so you never lose your words again.',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuietBridge',
    description:
      'A real-time safety net for social anxiety: instant scripts, practical tools, and evidence-based guidance so you never lose your words again.',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
