// pages/admin/social/new.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ProtectedRoute from '../../../components/ProtectedRoute';

const PLATFORMS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
];

export default function SchedulePost() {
  const router = useRouter();
  const [platform, setPlatform] = useState('linkedin');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [saving, setSaving] = useState(false);

  // Set default scheduled time to 1 hour from now
  useEffect(() => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    const defaultTime = now.toISOString().slice(0, 16);
    setScheduledAt(defaultTime);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content || !scheduledAt) {
      return toast.error('Content and scheduled time are required');
    }

    setSaving(true);
    const loadingToast = toast.loading('Scheduling post...');

    try {
      const token = localStorage.getItem('auth_token') || 
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      const response = await fetch('/api/social/schedule', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          platform,
          content,
          mediaUrl: mediaUrl || null,
          scheduledAt: new Date(scheduledAt).toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to schedule post');
      }

      toast.success('Post scheduled successfully!', { id: loadingToast });
      router.push('/admin/social');
    } catch (err) {
      toast.error(err.message || 'Failed to schedule post', { id: loadingToast });
    } finally {
      setSaving(false);
    }
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
                  <Link href="/admin/social" className="px-3 py-2 rounded-md text-sm font-medium text-[#007BFF] bg-blue-50">
                    Social Posts
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <Link
                  href="/admin/social"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  ← Back to Posts
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold mb-6">Schedule Social Media Post</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
              <div>
                <label className="block mb-2 font-medium">Platform *</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  {PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Content *</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="6"
                  placeholder="Write your post content here..."
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  {content.length} characters
                </p>
              </div>

              <div>
                <label className="block mb-2 font-medium">Media URL (Optional)</label>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Link to an image, video, or other media
                </p>
              </div>

              <div>
                <label className="block mb-2 font-medium">Schedule Date & Time *</label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                  min={new Date().toISOString().slice(0, 16)}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Select when this post should be published
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Posts are scheduled automatically via cron job. Make sure your social accounts are connected for posts to be published.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#007BFF] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#0069d9] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Scheduling...' : 'Schedule Post'}
                </button>
                <Link
                  href="/admin/social"
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

