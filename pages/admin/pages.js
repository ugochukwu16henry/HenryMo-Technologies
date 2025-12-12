// pages/admin/pages.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import ProtectedRoute from '../../components/ProtectedRoute';
import ConfirmModal from '../../components/ConfirmModal';

export default function PagesList() {
  const router = useRouter();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, page: null });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await axios.get('/api/cms/pages');
      setPages(response.data);
    } catch (err) {
      setError('Failed to load pages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (page) => {
    setDeleteModal({ isOpen: true, page });
  };

  const handleDelete = async () => {
    if (!deleteModal.page) return;

    const { id, title } = deleteModal.page;
    const loadingToast = toast.loading('Deleting page...');

    try {
      const token = localStorage.getItem('auth_token') || 
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      await axios.delete('/api/cms/pages', {
        headers: { Authorization: `Bearer ${token}` },
        data: { id }
      });

      setPages(pages.filter(page => page.id !== id));
      toast.success(`"${title}" deleted successfully`, { id: loadingToast });
      setDeleteModal({ isOpen: false, page: null });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete page', { id: loadingToast });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
                  <Link href="/admin/pages" className="px-3 py-2 rounded-md text-sm font-medium text-[#007BFF] bg-blue-50">
                    Pages
                  </Link>
                  <Link href="/admin/cms" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
                    Create Page
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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">CMS Pages</h1>
              <Link
                href="/admin/cms"
                className="bg-[#007BFF] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0069d9]"
              >
                + Create New Page
              </Link>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#007BFF]"></div>
                <p className="mt-4 text-gray-600">Loading pages...</p>
              </div>
            ) : pages.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No pages</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new page.</p>
                <div className="mt-6">
                  <Link
                    href="/admin/cms"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#007BFF] hover:bg-[#0069d9]"
                  >
                    + Create New Page
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {pages.map((page) => (
                    <li key={page.id}>
                      <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center flex-1">
                            <div className="flex-1">
                              <div className="flex items-center">
                                <p className="text-lg font-medium text-gray-900">
                                  {page.title}
                                </p>
                                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  /{page.slug}
                                </span>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                <p>
                                  Created {formatDate(page.createdAt)}
                                  {page.updatedAt !== page.createdAt && (
                                    <span className="ml-2">• Updated {formatDate(page.updatedAt)}</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex items-center gap-2">
                            <Link
                              href={`/admin/cms?id=${page.id}`}
                              className="text-[#007BFF] hover:text-[#0069d9] font-medium text-sm"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(page)}
                              className="text-red-600 hover:text-red-800 font-medium text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </main>

        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, page: null })}
          onConfirm={handleDelete}
          title="Delete Page"
          message={deleteModal.page ? `Are you sure you want to delete "${deleteModal.page.title}"? This action cannot be undone.` : ''}
          confirmText="Delete"
          cancelText="Cancel"
          danger={true}
        />
      </div>
    </ProtectedRoute>
  );
}

