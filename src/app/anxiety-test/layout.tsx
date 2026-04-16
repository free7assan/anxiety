import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Anxiety Test (GAD-7)',
  description:
    'Take the GAD-7 anxiety screening in a step-by-step format and get an instant result with severity and guidance.',
  alternates: {
    canonical: '/anxiety-test',
  },
  openGraph: {
    type: 'website',
    title: 'Anxiety Test (GAD-7)',
    description:
      'Take the GAD-7 anxiety screening in a step-by-step format and get an instant result with severity and guidance.',
    url: '/anxiety-test',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anxiety Test (GAD-7)',
    description:
      'Take the GAD-7 anxiety screening in a step-by-step format and get an instant result with severity and guidance.',
  },
};

export default function AnxietyTestLayout({ children }: { children: React.ReactNode }) {
  return children;
}

