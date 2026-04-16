import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import { getAiCoverImageUrl, getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'QuietBridge Blog',
  description: 'Real, practical writing about anxiety: what it feels like, what it costs, and what helps.',
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <PageShell>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            QuietBridge Blog
          </h1>
          <p className="text-lg text-gray-600 mt-4">
            Real, practical writing about anxiety: what it feels like, what it costs, and what helps.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-[2.5rem] overflow-hidden border border-purple-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <Image
                  src={getAiCoverImageUrl(post.title, post.slug)}
                  alt={post.coverImageAlt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={`${post.slug}-${tag}`}
                        className="text-[10px] font-black tracking-widest uppercase bg-white/90 text-gray-900 px-2.5 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-7">
                <p className="text-xs font-black text-purple-700 tracking-widest uppercase">
                  {new Date(post.date).toLocaleDateString()} • {post.readingMinutes} min read
                </p>
                <h2 className="text-xl font-black text-gray-900 mt-3 leading-snug">
                  {post.title}
                </h2>
                <p className="text-gray-600 mt-3 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-6 text-purple-700 font-black">
                  Read →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
