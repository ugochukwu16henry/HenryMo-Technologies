// pages/admin/cms.js

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import CmsEditor from '../../components/CmsEditor';
import ProtectedRoute from '../../components/ProtectedRoute';
import AdminLayout from '../../components/AdminLayout';

export default function CmsPage() {
  const router = useRouter();
  const { id } = router.query;
  const isEditing = !!id;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const editorRef = useRef();

  useEffect(() => {
    if (isEditing && id) {
      fetchPage();
    }
  }, [id]);

  const fetchPage = async () => {
    try {
      const response = await axios.get('/api/cms/pages');
      const page = response.data.find(p => p.id === Number(id));
      if (page) {
        setTitle(page.title);
        setSlug(page.slug);
        // Editor content will be set after editor loads
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.setContent(page.content);
          }
        }, 500);
      } else {
        toast.error('Page not found');
        router.push('/admin/pages');
      }
    } catch (err) {
      toast.error('Failed to load page');
      console.error(err);
      router.push('/admin/pages');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = editorRef.current?.getContent();

    if (!title || !slug || !content) {
      return toast.error('All fields are required');
    }

    setSaving(true);
    const loadingToast = toast.loading(isEditing ? 'Updating page...' : 'Creating page...');

    try {
      const token = localStorage.getItem('auth_token') || 
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      const url = '/api/cms/pages';
      const method = isEditing ? 'PUT' : 'POST';
      const body = isEditing 
        ? { id, title, slug, content }
        : { title, slug, content };

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
        throw new Error(error.error || `Failed to ${isEditing ? 'update' : 'create'} page`);
      }

      toast.success(`Page ${isEditing ? 'updated' : 'created'} successfully!`, { id: loadingToast });
      router.push('/admin/pages');
    } catch (err) {
      toast.error(err.message || `Failed to ${isEditing ? 'update' : 'create'} page`, { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout currentPage="cms">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#007BFF]"></div>
              <p className="mt-4 text-gray-600">Loading page...</p>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout currentPage="cms">
        <div className="px-4 sm:px-0">
            <h1 className="text-3xl font-bold mb-6">{isEditing ? 'Edit Page' : 'Create New Page'}</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
              <div>
                <label className="block mb-2 font-medium">Page Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="About Us"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Slug (URL)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="about"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">URL: /{slug || 'your-slug'}</p>
              </div>

              <div>
                <label className="block mb-2 font-medium">Content</label>
                <CmsEditor ref={editorRef} placeholder="Write your page content..." />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#007BFF] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#0069d9] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : (isEditing ? 'Update Page' : 'Publish Page')}
                </button>
                <Link
                  href="/admin/pages"
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
