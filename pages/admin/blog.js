// pages/admin/blog.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import ProtectedRoute from '../../components/ProtectedRoute';
import ConfirmModal from '../../components/ConfirmModal';

export default function BlogList() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, post: null });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('auth_token') ||
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      const response = await axios.get('/api/blog/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
    } catch (err) {
      setError('Failed to load blog posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (post) => {
    setDeleteModal({ isOpen: true, post });
  };

  const handleDelete = async () => {
    if (!deleteModal.post) return;

    const { id, title } = deleteModal.post;
    const loadingToast = toast.loading('Deleting post...');

    try {
      const token = localStorage.getItem('auth_token') ||
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      await axios.delete('/api/blog/posts', {
        headers: { Authorization: `Bearer ${token}` },
        data: { id }
      });

      setPosts(posts.filter(post => post.id !== id));
      toast.success(`"${title}" deleted successfully`, { id: loadingToast });
      setDeleteModal({ isOpen: false, post: null });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete post', { id: loadingToast });
    }
  };

  const handleTogglePublish = async (post) => {
    const loadingToast = toast.loading(post.published ? 'Unpublishing...' : 'Publishing...');

    try {
      const token = localStorage.getItem('auth_token') ||
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      const response = await axios.put('/api/blog/posts', {
        ...post,
        published: !post.published,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts(posts.map(p => p.id === post.id ? response.data : p));
      toast.success(`Post ${post.published ? 'unpublished' : 'published'} successfully`, { id: loadingToast });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update post', { id: loadingToast });
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
                  <Link href="/admin/pages" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
                    Pages
                  </Link>
                  <Link href="/admin/blog" className="px-3 py-2 rounded-md text-sm font-medium text-[#007BFF] bg-blue-50">
                    Blog
                  </Link>
                  <Link href="/admin/portfolio" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
                    Portfolio
                  </Link>
                  <Link href="/admin/testimonials" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
                    Testimonials
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
              <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
              <Link
                href="/admin/blog/new"
                className="bg-[#007BFF] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0069d9]"
              >
                + Create New Post
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
                <p className="mt-4 text-gray-600">Loading blog posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No blog posts</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first blog post.</p>
                <div className="mt-6">
                  <Link
                    href="/admin/blog/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#007BFF] hover:bg-[#0069d9]"
                  >
                    + Create New Post
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {posts.map((post) => (
                    <li key={post.id}>
                      <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center flex-1">
                            {post.featuredImage && (
                              <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="h-16 w-16 object-cover rounded mr-4"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center">
                                <p className="text-lg font-medium text-gray-900">
                                  {post.title}
                                </p>
                                <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  post.published 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {post.published ? 'Published' : 'Draft'}
                                </span>
                                {post.category && (
                                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {post.category}
                                  </span>
                                )}
                              </div>
                              {post.excerpt && (
                                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                              )}
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                <p>
                                  Created {formatDate(post.createdAt)}
                                  {post.publishedAt && (
                                    <span className="ml-2">• Published {formatDate(post.publishedAt)}</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex items-center gap-2">
                            <button
                              onClick={() => handleTogglePublish(post)}
                              className={`px-3 py-1 text-sm rounded ${
                                post.published
                                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {post.published ? 'Unpublish' : 'Publish'}
                            </button>
                            <Link
                              href={`/admin/blog/edit?id=${post.id}`}
                              className="text-[#007BFF] hover:text-[#0069d9] font-medium text-sm"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(post)}
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
          onClose={() => setDeleteModal({ isOpen: false, post: null })}
          onConfirm={handleDelete}
          title="Delete Blog Post"
          message={deleteModal.post ? `Are you sure you want to delete "${deleteModal.post.title}"? This action cannot be undone.` : ''}
          confirmText="Delete"
          cancelText="Cancel"
          danger={true}
        />
      </div>
    </ProtectedRoute>
  );
}

