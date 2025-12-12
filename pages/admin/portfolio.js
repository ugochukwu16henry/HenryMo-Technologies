// pages/admin/portfolio.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function PortfolioList() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('/api/portfolio/items');
      setItems(response.data);
    } catch (err) {
      setError('Failed to load portfolio items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token') || 
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      await axios.delete('/api/portfolio/items', {
        headers: { Authorization: `Bearer ${token}` },
        data: { id }
      });

      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to delete item: ' + (err.response?.data?.error || err.message));
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
                  <Link href="/admin/portfolio" className="px-3 py-2 rounded-md text-sm font-medium text-[#007BFF] bg-blue-50">
                    Portfolio
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
              <h1 className="text-3xl font-bold text-gray-900">Portfolio Items</h1>
              <Link
                href="/admin/portfolio/new"
                className="bg-[#007BFF] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0069d9]"
              >
                + Add New Item
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
                <p className="mt-4 text-gray-600">Loading portfolio items...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No portfolio items</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding your first project.</p>
                <div className="mt-6">
                  <Link
                    href="/admin/portfolio/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#007BFF] hover:bg-[#0069d9]"
                  >
                    + Add New Item
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{item.description}</p>
                      
                      {item.techStack && item.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.techStack.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>Added {formatDate(item.createdAt)}</span>
                      </div>

                      <div className="flex gap-2">
                        {item.liveUrl && (
                          <a
                            href={item.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-center px-3 py-2 bg-green-50 text-green-700 rounded hover:bg-green-100 text-sm font-medium"
                          >
                            Live
                          </a>
                        )}
                        {item.githubUrl && (
                          <a
                            href={item.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-center px-3 py-2 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 text-sm font-medium"
                          >
                            GitHub
                          </a>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t flex gap-2">
                        <Link
                          href={`/admin/portfolio/edit?id=${item.id}`}
                          className="flex-1 text-center text-[#007BFF] hover:text-[#0069d9] font-medium text-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="flex-1 text-center text-red-600 hover:text-red-800 font-medium text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

