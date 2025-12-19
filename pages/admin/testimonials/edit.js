// pages/admin/testimonials/edit.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import ImageUpload from '../../../components/ImageUpload';
import ProtectedRoute from '../../../components/ProtectedRoute';
import AdminLayout from '../../../components/AdminLayout';

export default function TestimonialEdit() {
  const router = useRouter();
  const { id } = router.query;
  const isEditing = !!id;

  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [testimonial, setTestimonial] = useState('');
  const [rating, setRating] = useState(5);
  const [photo, setPhoto] = useState('');
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      fetchTestimonial();
    }
  }, [id]);

  const fetchTestimonial = async () => {
    try {
      const token = localStorage.getItem('auth_token') ||
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      const response = await axios.get('/api/testimonials', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const testimonialData = response.data.find(t => t.id === Number(id));
      if (testimonialData) {
        setClientName(testimonialData.clientName);
        setCompany(testimonialData.company || '');
        setPosition(testimonialData.position || '');
        setTestimonial(testimonialData.testimonial);
        setRating(testimonialData.rating || 5);
        setPhoto(testimonialData.photo || '');
        setFeatured(testimonialData.featured || false);
      } else {
        toast.error('Testimonial not found');
        router.push('/admin/testimonials');
      }
    } catch (err) {
      toast.error('Failed to load testimonial');
      console.error(err);
      router.push('/admin/testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clientName || !testimonial) {
      return toast.error('Client name and testimonial are required');
    }

    setSaving(true);
    const loadingToast = toast.loading(isEditing ? 'Updating testimonial...' : 'Adding testimonial...');

    try {
      const token = localStorage.getItem('auth_token') ||
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      const url = '/api/testimonials';
      const method = isEditing ? 'PUT' : 'POST';
      const body = {
        clientName,
        company: company || null,
        position: position || null,
        testimonial,
        rating: rating || null,
        photo: photo || null,
        featured,
      };

      if (isEditing) {
        body.id = id;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to ${isEditing ? 'update' : 'create'} testimonial`);
      }

      toast.success(`Testimonial ${isEditing ? 'updated' : 'created'} successfully!`, { id: loadingToast });
      router.push('/admin/testimonials');
    } catch (err) {
      toast.error(err.message || `Failed to ${isEditing ? 'update' : 'create'} testimonial`, { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout currentPage="testimonials">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#007BFF]"></div>
              <p className="mt-4 text-gray-600">Loading testimonial...</p>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout currentPage="testimonials">
        <div className="px-4 sm:px-0">
            <h1 className="text-3xl font-bold mb-6">{isEditing ? 'Edit Testimonial' : 'Add New Testimonial'}</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium">Client Name *</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Acme Inc."
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium">Position/Title</label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="CEO, Marketing Director, etc."
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Testimonial *</label>
                <textarea
                  value={testimonial}
                  onChange={(e) => setTestimonial(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="6"
                  placeholder="Write the testimonial here..."
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Rating (1-5 stars)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Photo</label>
                <ImageUpload imageUrl={photo} onImageChange={setPhoto} />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 text-[#007BFF] focus:ring-[#007BFF] border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                  Featured testimonial (show on homepage)
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#007BFF] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#0069d9] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : (isEditing ? 'Update Testimonial' : 'Add Testimonial')}
                </button>
                <Link
                  href="/admin/testimonials"
                  className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Link>
              </div>
            </form>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

