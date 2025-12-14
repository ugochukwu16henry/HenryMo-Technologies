// pages/blog/[slug].js - Individual blog post page

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/posts?slug=${slug}`);
      if (!response.ok) {
        throw new Error('Post not found');
      }
      const data = await response.json();
      setPost(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#007BFF]"></div>
            <p className="mt-4 text-gray-600">Loading post...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Blog post not found</p>
            <a
              href="/blog"
              className="text-[#007BFF] hover:underline font-medium"
            >
              ← Back to Blog
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NextSeo
        title={`${post.title} — HenryMo Technologies`}
        description={post.excerpt || 'Read our latest blog post'}
        openGraph={{
          title: post.title,
          description: post.excerpt || '',
          images: post.featuredImage ? [{ url: post.featuredImage }] : [],
        }}
      />
      <Header />

      <main className="min-h-screen bg-gray-50">
        <article className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {post.featuredImage && (
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            )}
            
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-4">
                {post.category && (
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {post.category}
                  </span>
                )}
                <span className="text-sm text-gray-500">
                  {formatDate(post.publishedAt || post.createdAt)}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-xl text-gray-600 mb-8 italic">
                  {post.excerpt}
                </p>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-[#007BFF] prose-strong:text-gray-900"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="mt-12 pt-8 border-t border-gray-200">
                <Link
                  href="/blog"
                  className="text-[#007BFF] hover:underline font-medium"
                >
                  ← Back to Blog
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}

