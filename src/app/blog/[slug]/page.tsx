import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import { getAiCoverImageUrl, getAllPosts, getPostBySlug, BlogBlock } from '@/lib/blog';

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);
  if (!post) return {};

  return {
    title: `${post.title} | QuietBridge Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: getAiCoverImageUrl(post.title, post.slug) }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [getAiCoverImageUrl(post.title, post.slug)],
    },
  };
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function Block({ block, headingId }: { block: BlogBlock; headingId?: string }) {
  if (block.type === 'h2') {
    return (
      <h2 id={headingId} className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mt-10 scroll-mt-24">
        {block.text}
      </h2>
    );
  }

  if (block.type === 'ul') {
    return (
      <ul className="mt-4 space-y-2 text-gray-700 leading-relaxed list-disc pl-6">
        {block.items.map((item, idx) => (
          <li key={`${item}-${idx}`}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <p className="mt-4 text-gray-700 leading-relaxed text-lg">
      {block.text}
    </p>
  );
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);
  if (!post) notFound();

  const headings = post.blocks
    .filter((b) => b.type === 'h2')
    .map((b) => (b as { type: 'h2'; text: string }).text);

  const headingIds = headings.map((t, idx) => `${slugify(t)}-${idx + 1}`);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: getAiCoverImageUrl(post.title, post.slug),
    datePublished: post.date,
    dateModified: post.date,
    publisher: {
      '@type': 'Organization',
      name: 'QuietBridge',
    },
  };

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-purple-700 font-black hover:text-purple-900"
          >
            ← Back to Blog
          </Link>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <article className="bg-white rounded-[2.5rem] overflow-hidden border border-purple-100 shadow-sm">
          <div className="relative h-72 md:h-96 bg-gray-100">
            <Image
              src={getAiCoverImageUrl(post.title, post.slug)}
              alt={post.coverImageAlt}
              fill
              sizes="(min-width: 1024px) 896px, 100vw"
              unoptimized
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={`${post.slug}-tag-${tag}`}
                    className="text-[10px] font-black tracking-widest uppercase bg-white/90 text-gray-900 px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white mt-4 tracking-tight">
                {post.title}
              </h1>
              <p className="text-white/90 mt-2 font-bold">
                {new Date(post.date).toLocaleDateString()} • {post.readingMinutes} min read
              </p>
            </div>
          </div>

          <div className="p-8 md:p-10">
            {headings.length > 0 && (
              <div className="mt-8 rounded-3xl border border-purple-100 bg-white p-6">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">In this article</p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {headings.map((h, idx) => (
                    <a
                      key={`${post.slug}-toc-${idx}`}
                      href={`#${headingIds[idx]}`}
                      className="text-sm font-bold text-purple-700 hover:text-purple-900 hover:underline underline-offset-4"
                    >
                      {h}
                    </a>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-8">
              {(() => {
                let h2Index = 0;
                return post.blocks.map((block, idx) => {
                  if (block.type === 'h2') {
                    const id = headingIds[h2Index];
                    h2Index += 1;
                    return <Block key={`${post.slug}-b-${idx}`} block={block} headingId={id} />;
                  }
                  return <Block key={`${post.slug}-b-${idx}`} block={block} />;
                });
              })()}
            </div>

            <div className="mt-12 rounded-3xl border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 p-8">
              <h3 className="text-xl font-black text-gray-900">Try the Anxiety Test</h3>
              <p className="text-gray-700 mt-2">
                Want a quick snapshot of your anxiety symptoms? Take the test and get a result instantly.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/anxiety-test"
                  className="px-6 py-3 rounded-2xl font-black text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all text-center shadow-lg shadow-purple-200"
                >
                  Start Anxiety Test
                </Link>
                <Link
                  href="/advanced-test"
                  className="px-6 py-3 rounded-2xl font-black text-gray-700 bg-white border border-purple-200 hover:bg-purple-50 transition-colors text-center"
                >
                  Advanced Test
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>
    </PageShell>
  );
}
