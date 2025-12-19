// pages/admin/settings.js

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import ProtectedRoute from '../../components/ProtectedRoute';
import AdminLayout from '../../components/AdminLayout';

const DEFAULT_SETTINGS = {
  siteName: { value: 'HenryMo Technologies', category: 'general' },
  siteTagline: { value: 'Where Ideas Become Powerful Digital Solutions', category: 'general' },
  contactEmail: { value: 'ugochukwuhenry16@gmail.com', category: 'general' },
  contactPhone: { value: '+234 901 571 8484', category: 'general' },
  whatsappNumber: { value: '+2349015718484', category: 'general' },
  facebookUrl: { value: '', category: 'social' },
  twitterUrl: { value: '', category: 'social' },
  linkedinUrl: { value: '', category: 'social' },
  instagramUrl: { value: '', category: 'social' },
  youtubeUrl: { value: '', category: 'social' },
  githubUrl: { value: '', category: 'social' },
  metaDescription: { value: 'We build powerful digital experiences for the modern world', category: 'seo' },
  metaKeywords: { value: 'web development, mobile apps, custom software', category: 'seo' },
  googleAnalyticsId: { value: '', category: 'seo' },
};

export default function Settings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('auth_token') ||
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      const response = await axios.get('/api/settings', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Merge with defaults
      const mergedSettings = { ...DEFAULT_SETTINGS };
      for (const [key, data] of Object.entries(response.data)) {
        if (mergedSettings[key]) {
          mergedSettings[key].value = data.value;
        }
      }
      setSettings(mergedSettings);
    } catch (err) {
      console.error('Failed to load settings:', err);
      // Continue with defaults if fetch fails
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const loadingToast = toast.loading('Saving settings...');

    try {
      const token = localStorage.getItem('auth_token') ||
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      await axios.post('/api/settings', settings, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      toast.success('Settings saved successfully!', { id: loadingToast });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save settings', { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  const renderSection = (title, category) => {
    const sectionSettings = Object.entries(settings).filter(
      ([, data]) => data.category === category
    );

    if (sectionSettings.length === 0) return null;

    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
        <div className="space-y-4">
          {sectionSettings.map(([key, data]) => (
            <div key={key}>
              <label className="block mb-2 font-medium text-gray-700">
                {key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase())
                  .replace(/Url/g, ' URL')
                  .replace(/Id/g, ' ID')}
              </label>
              <input
                type="text"
                value={data.value}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-[#007BFF] focus:border-[#007BFF]"
                placeholder={`Enter ${key}`}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout currentPage="settings">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#007BFF]"></div>
              <p className="mt-4 text-gray-600">Loading settings...</p>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout currentPage="settings">
        <div className="px-4 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#007BFF] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#0069d9] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {renderSection('General Settings', 'general')}
            {renderSection('Social Media Links', 'social')}
            {renderSection('SEO Settings', 'seo')}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Changes to settings will take effect immediately. Some settings may require a page refresh to see changes.
              </p>
            </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

