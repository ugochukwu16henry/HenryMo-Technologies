// pages/admin/blog/edit.js

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import CmsEditor from '../../../components/CmsEditor';
import ImageUpload from '../../../components/ImageUpload';
import ProtectedRoute from '../../../components/ProtectedRoute';
import AdminLayout from '../../../components/AdminLayout';

export default function BlogEdit() {
  const router = useRouter();
  const { id } = router.query;
  const isEditing = !!id;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const editorRef = useRef();

  useEffect(() => {
    if (isEditing && id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const token = localStorage.getItem('auth_token') ||
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      const response = await axios.get('/api/blog/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const post = response.data.find(p => p.id === Number(id));
      if (post) {
        setTitle(post.title);
        setSlug(post.slug);
        setExcerpt(post.excerpt || '');
        setFeaturedImage(post.featuredImage || '');
        setCategory(post.category || '');
        setTags(post.tags || []);
        setPublished(post.published || false);
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.setContent(post.content);
          }
        }, 500);
      } else {
        toast.error('Blog post not found');
        router.push('/admin/blog');
      }
    } catch (err) {
      toast.error('Failed to load blog post');
      console.error(err);
      router.push('/admin/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = editorRef.current?.getContent();

    if (!title || !slug || !content) {
      return toast.error('Title, slug, and content are required');
    }

    setSaving(true);
    const loadingToast = toast.loading(isEditing ? 'Updating post...' : 'Creating post...');

    try {
      const token = localStorage.getItem('auth_token') ||
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      const url = '/api/blog/posts';
      const method = isEditing ? 'PUT' : 'POST';
      const body = {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        featuredImage: featuredImage || null,
        category: category || null,
        tags,
        published,
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
        throw new Error(error.error || `Failed to ${isEditing ? 'update' : 'create'} post`);
      }

      toast.success(`Post ${isEditing ? 'updated' : 'created'} successfully!`, { id: loadingToast });
      router.push('/admin/blog');
    } catch (err) {
      toast.error(err.message || `Failed to ${isEditing ? 'update' : 'create'} post`, { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout currentPage="blog">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#007BFF]"></div>
              <p className="mt-4 text-gray-600">Loading post...</p>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout currentPage="blog">
        <div className="px-4 sm:px-0">
            <h1 className="text-3xl font-bold mb-6">{isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
              <div>
                <label className="block mb-2 font-medium">Post Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="My Awesome Blog Post"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Slug (URL) *</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="my-awesome-blog-post"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">URL: /blog/{slug || 'your-slug'}</p>
              </div>

              <div>
                <label className="block mb-2 font-medium">Excerpt (Short Description)</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="3"
                  placeholder="A brief summary of your blog post..."
                />
                <p className="mt-1 text-sm text-gray-500">This will be shown in blog listings. Leave empty to auto-generate from content.</p>
              </div>

              <div>
                <label className="block mb-2 font-medium">Featured Image</label>
                <ImageUpload imageUrl={featuredImage} onImageChange={setFeaturedImage} />
              </div>

              <div>
                <label className="block mb-2 font-medium">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Technology, Business, Design, etc."
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-grow px-4 py-2 border rounded-lg"
                    placeholder="React, Next.js, Web Development"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 -mr-0.5 h-4 w-4 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium">Content *</label>
                <CmsEditor ref={editorRef} placeholder="Write your blog post content..." />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-4 w-4 text-[#007BFF] focus:ring-[#007BFF] border-gray-300 rounded"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                  Publish immediately
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#007BFF] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#0069d9] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
                </button>
                <Link
                  href="/admin/blog"
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

