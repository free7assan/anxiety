import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advanced Anxiety Test',
  description:
    'Take an advanced anxiety assessment with domain breakdowns (mind, body, sleep, avoidance, work, social) and get actionable next steps.',
  alternates: {
    canonical: '/advanced-test',
  },
  openGraph: {
    type: 'website',
    title: 'Advanced Anxiety Test',
    description:
      'Take an advanced anxiety assessment with domain breakdowns (mind, body, sleep, avoidance, work, social) and get actionable next steps.',
    url: '/advanced-test',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advanced Anxiety Test',
    description:
      'Take an advanced anxiety assessment with domain breakdowns and get actionable next steps.',
  },
};

export default function AdvancedTestLayout({ children }: { children: React.ReactNode }) {
  return children;
}

