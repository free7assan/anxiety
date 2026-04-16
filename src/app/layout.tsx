import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "QuietBridge",
    template: "%s | QuietBridge",
  },
  description:
    "QuietBridge is a real-time safety net for social anxiety: instant scripts, practical tools, and evidence-based guidance so you never lose your words again.",
  applicationName: "QuietBridge",
  openGraph: {
    type: "website",
    siteName: "QuietBridge",
    title: "QuietBridge",
    description:
      "A real-time safety net for social anxiety: instant scripts, practical tools, and evidence-based guidance.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuietBridge",
    description:
      "A real-time safety net for social anxiety: instant scripts, practical tools, and evidence-based guidance.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'QuietBridge',
      url: siteUrl,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'QuietBridge',
      url: siteUrl,
    },
  ];

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
