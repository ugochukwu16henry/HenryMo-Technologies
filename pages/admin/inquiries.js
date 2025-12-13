// pages/admin/inquiries.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import ProtectedRoute from '../../components/ProtectedRoute';
import ConfirmModal from '../../components/ConfirmModal';

const STATUS_COLORS = {
  NEW: 'bg-blue-100 text-blue-800',
  READ: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  RESOLVED: 'bg-green-100 text-green-800',
};

const STATUS_OPTIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'READ', label: 'Read' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
];

export default function InquiriesList() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, inquiry: null });
  const [statusModal, setStatusModal] = useState({ isOpen: false, inquiry: null });

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const token = localStorage.getItem('auth_token') || 
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      const response = await axios.get('/api/inquiries', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInquiries(response.data);
    } catch (err) {
      setError('Failed to load inquiries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (inquiry, newStatus) => {
    const loadingToast = toast.loading('Updating status...');

    try {
      const token = localStorage.getItem('auth_token') || 
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      await axios.put('/api/inquiries', {
        id: inquiry.id,
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setInquiries(inquiries.map(i => 
        i.id === inquiry.id ? { ...i, status: newStatus } : i
      ));
      toast.success('Status updated successfully', { id: loadingToast });
      setStatusModal({ isOpen: false, inquiry: null });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update status', { id: loadingToast });
    }
  };

  const handleDeleteClick = (inquiry) => {
    setDeleteModal({ isOpen: true, inquiry });
  };

  const handleDelete = async () => {
    if (!deleteModal.inquiry) return;

    const { id, name } = deleteModal.inquiry;
    const loadingToast = toast.loading('Deleting inquiry...');

    try {
      const token = localStorage.getItem('auth_token') || 
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      await axios.delete('/api/inquiries', {
        headers: { Authorization: `Bearer ${token}` },
        data: { id }
      });

      setInquiries(inquiries.filter(inquiry => inquiry.id !== id));
      toast.success(`Inquiry from "${name}" deleted successfully`, { id: loadingToast });
      setDeleteModal({ isOpen: false, inquiry: null });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete inquiry', { id: loadingToast });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getUnreadCount = () => {
    return inquiries.filter(i => i.status === 'NEW').length;
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
                  <Link href="/admin/portfolio" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
                    Portfolio
                  </Link>
                  <Link href="/admin/social" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
                    Social Posts
                  </Link>
                  <Link href="/admin/inquiries" className="px-3 py-2 rounded-md text-sm font-medium text-[#007BFF] bg-blue-50">
                    Inquiries
                    {getUnreadCount() > 0 && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {getUnreadCount()} new
                      </span>
                    )}
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
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Contact Inquiries</h1>
                {getUnreadCount() > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    {getUnreadCount()} new inquiry{getUnreadCount() !== 1 ? 'ies' : ''}
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#007BFF]"></div>
                <p className="mt-4 text-gray-600">Loading inquiries...</p>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No inquiries</h3>
                <p className="mt-1 text-sm text-gray-500">All contact form submissions will appear here.</p>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {inquiries.map((inquiry) => (
                    <li key={inquiry.id}>
                      <div className={`px-4 py-4 sm:px-6 hover:bg-gray-50 ${inquiry.status === 'NEW' ? 'bg-blue-50' : ''}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="text-lg font-medium text-gray-900">
                                {inquiry.name}
                              </p>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[inquiry.status] || STATUS_COLORS.NEW}`}>
                                {inquiry.status}
                              </span>
                              {inquiry.status === 'NEW' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              <a href={`mailto:${inquiry.email}`} className="text-[#007BFF] hover:underline">
                                {inquiry.email}
                              </a>
                            </p>
                            <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">
                              {inquiry.message}
                            </p>
                            <div className="flex items-center text-xs text-gray-500">
                              <span>📅 {formatDate(inquiry.createdAt)}</span>
                              {inquiry.updatedAt !== inquiry.createdAt && (
                                <span className="ml-3">• Updated {formatDate(inquiry.updatedAt)}</span>
                              )}
                            </div>
                          </div>
                          <div className="ml-4 flex items-center gap-2">
                            <select
                              value={inquiry.status}
                              onChange={(e) => handleStatusChange(inquiry, e.target.value)}
                              className={`text-xs px-2 py-1 border rounded ${STATUS_COLORS[inquiry.status] || STATUS_COLORS.NEW}`}
                            >
                              {STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleDeleteClick(inquiry)}
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
          onClose={() => setDeleteModal({ isOpen: false, inquiry: null })}
          onConfirm={handleDelete}
          title="Delete Inquiry"
          message={deleteModal.inquiry ? `Are you sure you want to delete the inquiry from "${deleteModal.inquiry.name}"? This action cannot be undone.` : ''}
          confirmText="Delete"
          cancelText="Cancel"
          danger={true}
        />
      </div>
    </ProtectedRoute>
  );
}

