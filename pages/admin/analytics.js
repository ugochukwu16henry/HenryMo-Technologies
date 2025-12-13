// pages/admin/analytics.js

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('auth_token') ||
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      const response = await axios.get('/api/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (err) {
      setError('Failed to load analytics');
      toast.error('Failed to load analytics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color = 'blue' }) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      purple: 'bg-purple-100 text-purple-800',
      red: 'bg-red-100 text-red-800',
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {icon && (
            <div className={`p-3 rounded-full ${colors[color]}`}>
              {icon}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#007BFF]"></div>
            <p className="mt-4 text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !stats) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">{error || 'Failed to load analytics'}</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center gap-6">
                <Link href="/admin" className="text-xl font-semibold text-gray-900 hover:text-[#007BFF]">
                  HenryMo Admin
                </Link>
                <div className="flex gap-4">
                  <Link href="/admin/analytics" className="px-3 py-2 rounded-md text-sm font-medium text-[#007BFF] bg-blue-50">
                    Analytics
                  </Link>
                  <Link href="/admin/pages" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
                    Pages
                  </Link>
                  <Link href="/admin/blog" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
                    Blog
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <Link
                  href="/admin"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics Dashboard</h1>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Pages"
                value={stats.overview.totalPages}
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                color="blue"
              />
              <StatCard
                title="Blog Posts"
                value={stats.overview.publishedBlogPosts}
                subtitle={`${stats.overview.draftBlogPosts} drafts`}
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
                color="green"
              />
              <StatCard
                title="Portfolio Items"
                value={stats.overview.totalPortfolioItems}
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                color="purple"
              />
              <StatCard
                title="Testimonials"
                value={stats.overview.featuredTestimonials}
                subtitle={`${stats.overview.totalTestimonials} total`}
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
                color="yellow"
              />
            </div>

            {/* Inquiries Stats */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Inquiries</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{stats.inquiries.total}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{stats.inquiries.new}</p>
                  <p className="text-sm text-gray-600">New</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-600">{stats.inquiries.read}</p>
                  <p className="text-sm text-gray-600">Read</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{stats.inquiries.inProgress}</p>
                  <p className="text-sm text-gray-600">In Progress</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{stats.inquiries.resolved}</p>
                  <p className="text-sm text-gray-600">Resolved</p>
                </div>
              </div>
            </div>

            {/* Social Posts Stats */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Social Media Posts</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{stats.socialPosts.total}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{stats.socialPosts.scheduled}</p>
                  <p className="text-sm text-gray-600">Scheduled</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{stats.socialPosts.posted}</p>
                  <p className="text-sm text-gray-600">Posted</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-600">{stats.socialPosts.draft}</p>
                  <p className="text-sm text-gray-600">Draft</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{stats.socialPosts.failed}</p>
                  <p className="text-sm text-gray-600">Failed</p>
                </div>
              </div>
              {Object.keys(stats.socialPosts.byPlatform).length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">By Platform:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(stats.socialPosts.byPlatform).map(([platform, count]) => (
                      <span key={platform} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {platform}: {count}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Inquiries</h2>
                {stats.inquiries.recent.length === 0 ? (
                  <p className="text-gray-500 text-sm">No recent inquiries</p>
                ) : (
                  <ul className="space-y-3">
                    {stats.inquiries.recent.map((inquiry) => (
                      <li key={inquiry.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium text-gray-900">{inquiry.name}</p>
                          <p className="text-sm text-gray-500">{inquiry.email}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          inquiry.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                          inquiry.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {inquiry.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <Link href="/admin/inquiries" className="block mt-4 text-[#007BFF] hover:underline text-sm">
                  View all inquiries →
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Blog Posts</h2>
                {stats.content.recentBlogPosts.length === 0 ? (
                  <p className="text-gray-500 text-sm">No blog posts yet</p>
                ) : (
                  <ul className="space-y-3">
                    {stats.content.recentBlogPosts.map((post) => (
                      <li key={post.id} className="flex items-center justify-between border-b pb-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{post.title}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <Link href="/admin/blog" className="block mt-4 text-[#007BFF] hover:underline text-sm">
                  View all posts →
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

