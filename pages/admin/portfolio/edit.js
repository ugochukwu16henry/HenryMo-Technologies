// pages/admin/portfolio/edit.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import ProtectedRoute from '../../../components/ProtectedRoute';
import ImageUpload from '../../../components/ImageUpload';

export default function PortfolioEdit() {
  const router = useRouter();
  const { id } = router.query;
  const isEditing = !!id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [techStack, setTechStack] = useState([]);
  const [techInput, setTechInput] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      fetchItem();
    }
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await axios.get('/api/portfolio/items');
      const item = response.data.find(i => i.id === Number(id));
      if (item) {
        setTitle(item.title);
        setDescription(item.description);
        setImage(item.image || '');
        setTechStack(item.techStack || []);
        setLiveUrl(item.liveUrl || '');
        setGithubUrl(item.githubUrl || '');
      } else {
        toast.error('Portfolio item not found');
        router.push('/admin/portfolio');
      }
    } catch (err) {
      toast.error('Failed to load portfolio item');
      console.error(err);
      router.push('/admin/portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTech = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      setTechStack([...techStack, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech) => {
    setTechStack(techStack.filter(t => t !== tech));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      return toast.error('Title and description are required');
    }

    setSaving(true);
    const loadingToast = toast.loading(isEditing ? 'Updating portfolio item...' : 'Adding portfolio item...');

    try {
      const token = localStorage.getItem('auth_token') || 
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      const url = '/api/portfolio/items';
      const method = isEditing ? 'PUT' : 'POST';
      const body = {
        title,
        description,
        image: image || null,
        techStack,
        liveUrl: liveUrl || null,
        githubUrl: githubUrl || null,
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
        throw new Error(error.error || `Failed to ${isEditing ? 'update' : 'create'} portfolio item`);
      }

      toast.success(`Portfolio item ${isEditing ? 'updated' : 'created'} successfully!`, { id: loadingToast });
      router.push('/admin/portfolio');
    } catch (err) {
      toast.error(err.message || `Failed to ${isEditing ? 'update' : 'create'} portfolio item`, { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#007BFF]"></div>
            <p className="mt-4 text-gray-600">Loading portfolio item...</p>
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
                  <Link href="/admin/pages" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
                    Pages
                  </Link>
                  <Link href="/admin/portfolio" className="px-3 py-2 rounded-md text-sm font-medium text-[#007BFF] bg-blue-50">
                    Portfolio
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <Link
                  href="/admin/portfolio"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  ← Back to Portfolio
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold mb-6">{isEditing ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
              <div>
                <label className="block mb-2 font-medium">Project Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="My Awesome Project"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="4"
                  placeholder="Describe your project..."
                  required
                />
              </div>

              <div>
                <ImageUpload
                  label="Project Image"
                  value={image}
                  onChange={setImage}
                  required={false}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Technology Stack</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                    className="flex-1 px-4 py-2 border rounded-lg"
                    placeholder="React, Node.js, etc."
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-2"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="text-blue-900 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">Live URL</label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">GitHub URL</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="https://github.com/user/repo"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#007BFF] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#0069d9] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : (isEditing ? 'Update Item' : 'Add Item')}
                </button>
                <Link
                  href="/admin/portfolio"
                  className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

