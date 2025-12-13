// pages/admin/index.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [unreadInquiriesCount, setUnreadInquiriesCount] = useState(0);

  useEffect(() => {
    // Fetch user info after ProtectedRoute verifies auth
    if (typeof window !== 'undefined') {
      fetchUser();
      fetchUnreadInquiriesCount();
    }
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('auth_token') ||
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      if (token) {
        const response = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  };

  const fetchUnreadInquiriesCount = async () => {
    try {
      const token = localStorage.getItem('auth_token') ||
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      if (token) {
        const response = await axios.get('/api/inquiries', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const unreadCount = response.data.filter(inquiry => inquiry.status === 'NEW').length;
        setUnreadInquiriesCount(unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch unread inquiries count:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/admin/login');
  };

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
                <Link href="/admin/pages" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
                  Pages
                </Link>
                <Link href="/admin/blog" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
                  Blog
                </Link>
                <Link href="/admin/testimonials" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
                  Testimonials
                </Link>
                <Link href="/admin/portfolio" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
                  Portfolio
                </Link>
                <Link href="/admin/analytics" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
                  Analytics
                </Link>
                <Link href="/admin/settings" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
                  Settings
                </Link>
                <Link href="/admin/social" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
                  Social Posts
                </Link>
                <Link href="/admin/social-accounts" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
                  Social Accounts
                </Link>
                <Link href="/admin/inquiries" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 relative">
                  Inquiries
                  {unreadInquiriesCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {unreadInquiriesCount}
                    </span>
                  )}
                </Link>
                <Link href="/admin/cms" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
                  Create Page
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email || 'Loading...'}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link href="/admin/pages" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">CMS Pages</dt>
                      <dd className="text-lg font-medium text-gray-900">Manage Content</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/admin/social" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Social Posts</dt>
                      <dd className="text-lg font-medium text-gray-900">Schedule Content</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/admin/portfolio" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Portfolio</dt>
                      <dd className="text-lg font-medium text-gray-900">Manage Projects</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/admin/inquiries" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Inquiries</dt>
                      <dd className="text-lg font-medium text-gray-900">Contact Forms</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Welcome, {user?.name || user?.email || 'Admin'}!</h2>
            <p className="text-gray-600">
              Use the navigation above to manage your content, schedule social media posts, and connect your social accounts.
            </p>
          </div>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}

