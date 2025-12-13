// pages/[slug].js
// Dynamic route for CMS pages

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Routes that should not be handled by CMS (existing static pages)
const RESERVED_ROUTES = ['admin', 'api', 'portfolio', 'contact', 'services', 'about'];

export default function CmsPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    // Don't fetch for reserved routes (handled by Next.js)
    if (RESERVED_ROUTES.includes(slug)) {
      router.replace('/404');
      return;
    }

    fetchPage();
  }, [slug]);

  const fetchPage = async () => {
    try {
      setLoading(true);
      // Fetch single page by slug (more efficient)
      const response = await fetch(`/api/cms/pages?slug=${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Page not found');
          setLoading(false);
          return;
        }
        throw new Error('Failed to fetch page');
      }

      const foundPage = await response.json();

      if (!foundPage) {
        setError('Page not found');
        setLoading(false);
        return;
      }

      setPage(foundPage);
      setError(null);
    } catch (err) {
      console.error('Error fetching page:', err);
      setError('Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  // Show 404 for reserved routes or missing pages
  if (error || (page === null && !loading && slug && !RESERVED_ROUTES.includes(slug))) {
    return (
      <>
        <Head>
          <title>Page Not Found — HenryMo Technologies</title>
        </Head>
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            The page you're looking for doesn't exist.
          </p>
          <a
            href="/"
            className="inline-block bg-[#007BFF] text-white px-6 py-3 rounded-lg hover:bg-[#0069d9] transition-colors"
          >
            Go Home
          </a>
        </main>
        <Footer />
      </>
    );
  }

  // Loading state
  if (loading || !page) {
    return (
      <>
        <Head>
          <title>Loading... — HenryMo Technologies</title>
        </Head>
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#007BFF]"></div>
            <p className="mt-4 text-gray-600">Loading page...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Render CMS page
  return (
    <>
      <NextSeo
        title={`${page.title} — HenryMo Technologies`}
        description={`${page.title} - ${page.content.substring(0, 160).replace(/<[^>]*>/g, '')}...`}
        openGraph={{
          title: `${page.title} — HenryMo Technologies`,
          description: page.content.substring(0, 160).replace(/<[^>]*>/g, ''),
          url: `https://henrymo.tech/${page.slug}`,
          type: 'website',
        }}
      />
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <article className="max-w-4xl mx-auto">
          {/* Page Title */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {page.title}
            </h1>
            <div className="text-sm text-gray-500">
              {page.updatedAt !== page.createdAt && (
                <span>Last updated: {new Date(page.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              )}
            </div>
          </header>

          {/* Page Content */}
          <div 
            className="prose prose-lg max-w-none 
              prose-headings:text-gray-900 
              prose-h1:text-3xl prose-h1:font-bold prose-h1:mt-8 prose-h1:mb-4
              prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-3
              prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-4 prose-h3:mb-2
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-[#007BFF] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4
              prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4
              prose-li:text-gray-700 prose-li:mb-2
              prose-img:rounded-lg prose-img:shadow-md prose-img:my-6
              prose-blockquote:border-l-4 prose-blockquote:border-[#007BFF] prose-blockquote:pl-4 prose-blockquote:italic
              prose-code:text-sm prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </article>
      </main>
      <Footer />
    </>
  );
}

