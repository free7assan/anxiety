import { NextResponse } from 'next/server';

export const revalidate = 86400;

function hashToPositiveInt(value: string) {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) + hash) ^ value.charCodeAt(i);
  }
  return Math.abs(hash);
}

const fallbackGradients = [
  ['#7C3AED', '#EC4899', '#F59E0B'],
  ['#2563EB', '#7C3AED', '#EC4899'],
  ['#0EA5E9', '#14B8A6', '#84CC16'],
  ['#F97316', '#EC4899', '#A855F7'],
  ['#111827', '#7C3AED', '#EC4899'],
];

function escapeXml(text: string) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function makePlaceholderSvg(title: string, seed: number) {
  const idx = Math.abs(seed) % fallbackGradients.length;
  const [c1, c2, c3] = fallbackGradients[idx];
  const safeTitle = escapeXml(title);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900" viewBox="0 0 1400 900">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="50%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="${c3}"/>
    </linearGradient>
    <filter id="noise" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix type="matrix" values="
        1 0 0 0 0
        0 1 0 0 0
        0 0 1 0 0
        0 0 0 0.08 0" />
    </filter>
  </defs>
  <rect width="1400" height="900" fill="url(#g)"/>
  <rect width="1400" height="900" filter="url(#noise)"/>
  <rect x="80" y="640" width="1240" height="180" rx="36" fill="rgba(0,0,0,0.35)"/>
  <text x="120" y="705" fill="white" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="44" font-weight="800">
    ${safeTitle}
  </text>
  <text x="120" y="765" fill="rgba(255,255,255,0.85)" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="26" font-weight="700">
    QuietBridge Blog
  </text>
</svg>`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const title = (url.searchParams.get('title') ?? '').trim();
  const seedParam = url.searchParams.get('seed') ?? '';
  const seedParsed = Number.parseInt(seedParam, 10);
  const seed = seedParam !== '' && Number.isFinite(seedParsed) ? seedParsed : hashToPositiveInt(title);

  if (!title) {
    return new NextResponse('Missing title', { status: 400 });
  }

  const prompt = `High quality cinematic photo, editorial, soft natural light, calm mood, minimal composition, social anxiety theme, ${title}`;
  const upstreamUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1400&height=900&seed=${seed}&nologo=true`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl, {
      headers: {
        accept: 'image/*',
        'user-agent': 'QuietBridge/1.0',
      },
      next: { revalidate: 86400 },
      signal: controller.signal,
    });
  } catch {
    const svg = makePlaceholderSvg(title, seed);
    return new NextResponse(svg, {
      status: 200,
      headers: {
        'content-type': 'image/svg+xml; charset=utf-8',
        'cache-control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!upstream.ok) {
    const svg = makePlaceholderSvg(title, seed);
    return new NextResponse(svg, {
      status: 200,
      headers: {
        'content-type': 'image/svg+xml; charset=utf-8',
        'cache-control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  }

  const contentType = upstream.headers.get('content-type') ?? 'image/jpeg';
  if (!contentType.startsWith('image/')) {
    const svg = makePlaceholderSvg(title, seed);
    return new NextResponse(svg, {
      status: 200,
      headers: {
        'content-type': 'image/svg+xml; charset=utf-8',
        'cache-control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  }
  const body = await upstream.arrayBuffer();

  return new NextResponse(body, {
    status: 200,
    headers: {
      'content-type': contentType,
      'cache-control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}
