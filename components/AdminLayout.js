// components/AdminLayout.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';

export default function AdminLayout({ children, currentPage = '' }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [unreadInquiriesCount, setUnreadInquiriesCount] = useState(0);

  useEffect(() => {
    fetchUser();
    fetchUnreadInquiriesCount();
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

  const isActive = (page) => currentPage === page;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Link 
                href="/admin" 
                className="text-xl font-semibold text-gray-900 hover:text-[#007BFF] whitespace-nowrap flex-shrink-0"
              >
                HenryMo Admin
              </Link>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
                <Link 
                  href="/admin/pages" 
                  className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                    isActive('pages') 
                      ? 'text-[#007BFF] bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Pages
                </Link>
                <Link 
                  href="/admin/homepage" 
                  className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                    isActive('homepage') 
                      ? 'text-[#007BFF] bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Homepage
                </Link>
                <Link 
                  href="/admin/about" 
                  className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                    isActive('about') 
                      ? 'text-[#007BFF] bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  About
                </Link>
                <Link 
                  href="/admin/blog" 
                  className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                    isActive('blog') 
                      ? 'text-[#007BFF] bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Blog
                </Link>
                <Link 
                  href="/admin/testimonials" 
                  className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                    isActive('testimonials') 
                      ? 'text-[#007BFF] bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Testimonials
                </Link>
                <Link 
                  href="/admin/portfolio" 
                  className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                    isActive('portfolio') 
                      ? 'text-[#007BFF] bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Portfolio
                </Link>
                <Link 
                  href="/admin/analytics" 
                  className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                    isActive('analytics') 
                      ? 'text-[#007BFF] bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Analytics
                </Link>
                <Link 
                  href="/admin/settings" 
                  className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                    isActive('settings') 
                      ? 'text-[#007BFF] bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Settings
                </Link>
                <Link 
                  href="/admin/social" 
                  className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                    isActive('social') 
                      ? 'text-[#007BFF] bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Social
                </Link>
                <Link 
                  href="/admin/social-accounts" 
                  className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                    isActive('social-accounts') 
                      ? 'text-[#007BFF] bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Accounts
                </Link>
                <Link 
                  href="/admin/inquiries" 
                  className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap flex-shrink-0 relative ${
                    isActive('inquiries') 
                      ? 'text-[#007BFF] bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Inquiries
                  {unreadInquiriesCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {unreadInquiriesCount}
                    </span>
                  )}
                </Link>
                <Link 
                  href="/admin/cms" 
                  className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                    isActive('cms') 
                      ? 'text-[#007BFF] bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Create
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0 ml-4">
              <span className="text-sm text-gray-600 hidden sm:inline whitespace-nowrap">
                {user?.email || 'Loading...'}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - with proper padding to prevent overlap */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

