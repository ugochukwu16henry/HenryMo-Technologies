// pages/admin/testimonials.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import ProtectedRoute from '../../components/ProtectedRoute';
import AdminLayout from '../../components/AdminLayout';
import ConfirmModal from '../../components/ConfirmModal';

export default function TestimonialsList() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, testimonial: null });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const token = localStorage.getItem('auth_token') ||
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      const response = await axios.get('/api/testimonials', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTestimonials(response.data);
    } catch (err) {
      setError('Failed to load testimonials');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (testimonial) => {
    setDeleteModal({ isOpen: true, testimonial });
  };

  const handleDelete = async () => {
    if (!deleteModal.testimonial) return;

    const { id, clientName } = deleteModal.testimonial;
    const loadingToast = toast.loading('Deleting testimonial...');

    try {
      const token = localStorage.getItem('auth_token') ||
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      await axios.delete('/api/testimonials', {
        headers: { Authorization: `Bearer ${token}` },
        data: { id }
      });

      setTestimonials(testimonials.filter(t => t.id !== id));
      toast.success(`Testimonial from ${clientName} deleted successfully`, { id: loadingToast });
      setDeleteModal({ isOpen: false, testimonial: null });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete testimonial', { id: loadingToast });
    }
  };

  const handleToggleFeatured = async (testimonial) => {
    const loadingToast = toast.loading(testimonial.featured ? 'Unfeaturing...' : 'Featuring...');

    try {
      const token = localStorage.getItem('auth_token') ||
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      const response = await axios.put('/api/testimonials', {
        ...testimonial,
        featured: !testimonial.featured,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTestimonials(testimonials.map(t => t.id === testimonial.id ? response.data : t));
      toast.success(`Testimonial ${testimonial.featured ? 'unfeatured' : 'featured'} successfully`, { id: loadingToast });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update testimonial', { id: loadingToast });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? 'fill-current' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <AdminLayout currentPage="testimonials">
        <div className="px-4 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
              <Link
                href="/admin/testimonials/new"
                className="bg-[#007BFF] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0069d9]"
              >
                + Add New Testimonial
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
                <p className="mt-4 text-gray-600">Loading testimonials...</p>
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No testimonials</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding your first testimonial.</p>
                <div className="mt-6">
                  <Link
                    href="/admin/testimonials/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#007BFF] hover:bg-[#0069d9]"
                  >
                    + Add New Testimonial
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                    <div className="flex items-start mb-4">
                      {testimonial.photo ? (
                        <img
                          src={testimonial.photo}
                          alt={testimonial.clientName}
                          className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold mr-4">
                          {testimonial.clientName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{testimonial.clientName}</h3>
                        {testimonial.position && (
                          <p className="text-sm text-gray-600">{testimonial.position}</p>
                        )}
                        {testimonial.company && (
                          <p className="text-sm text-gray-500">{testimonial.company}</p>
                        )}
                      </div>
                      {testimonial.featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                    
                    {renderStars(testimonial.rating)}
                    
                    <p className="mt-4 text-gray-700 flex-grow line-clamp-4">
                      "{testimonial.testimonial}"
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                      <button
                        onClick={() => handleToggleFeatured(testimonial)}
                        className={`flex-1 text-center px-3 py-2 text-sm rounded ${
                          testimonial.featured
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {testimonial.featured ? 'Unfeature' : 'Feature'}
                      </button>
                      <Link
                        href={`/admin/testimonials/edit?id=${testimonial.id}`}
                        className="flex-1 text-center text-[#007BFF] hover:text-[#0069d9] font-medium text-sm px-3 py-2"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(testimonial)}
                        className="flex-1 text-center text-red-600 hover:text-red-800 font-medium text-sm px-3 py-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, testimonial: null })}
          onConfirm={handleDelete}
          title="Delete Testimonial"
          message={deleteModal.testimonial ? `Are you sure you want to delete the testimonial from "${deleteModal.testimonial.clientName}"? This action cannot be undone.` : ''}
          confirmText="Delete"
          cancelText="Cancel"
          danger={true}
        />
      </AdminLayout>
    </ProtectedRoute>
  );
}

