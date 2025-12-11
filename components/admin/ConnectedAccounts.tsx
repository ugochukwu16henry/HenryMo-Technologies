// components/admin/ConnectedAccounts.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';

interface SocialAccount {
  id: number;
  platform: string;
  accessToken: string;
  expiresAt: string;
  metadata?: string;
  createdAt: string;
}

interface ConnectedAccountsProps {
  authToken: string;
  baseUrl?: string;
}

export default function ConnectedAccounts({ authToken, baseUrl = '/api' }: ConnectedAccountsProps) {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      // Note: You'll need to create this API endpoint
      const response = await axios.get(`${baseUrl}/social/accounts`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setAccounts(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load connected accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (platform: string) => {
    window.location.href = `${baseUrl}/social/connect/${platform}`;
  };

  const handleDisconnect = async (accountId: number) => {
    if (!confirm('Are you sure you want to disconnect this account?')) {
      return;
    }

    try {
      await axios.delete(`${baseUrl}/social/accounts/${accountId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      fetchAccounts();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to disconnect account');
    }
  };

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      linkedin: '💼',
      facebook: '📘',
      instagram: '📷',
      twitter: '🐦',
      tiktok: '🎵',
      youtube: '📺',
    };
    return icons[platform.toLowerCase()] || '🔗';
  };

  const getPlatformName = (platform: string) => {
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const connectedPlatforms = accounts.map((acc) => acc.platform);
  const availablePlatforms = ['linkedin', 'facebook', 'instagram', 'twitter', 'tiktok', 'youtube'];

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Connected Social Accounts</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Connected Social Accounts</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Connected Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {accounts.map((account) => {
          const metadata = account.metadata ? JSON.parse(account.metadata) : {};
          const expired = isExpired(account.expiresAt);

          return (
            <div
              key={account.id}
              className={`border rounded-lg p-4 ${
                expired ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getPlatformIcon(account.platform)}</span>
                  <span className="font-semibold">{getPlatformName(account.platform)}</span>
                </div>
                {expired && (
                  <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">
                    Expired
                  </span>
                )}
              </div>

              {metadata.username && (
                <p className="text-sm text-gray-600 mb-2">@{metadata.username}</p>
              )}

              <p className="text-xs text-gray-500 mb-3">
                Expires: {new Date(account.expiresAt).toLocaleDateString()}
              </p>

              <button
                onClick={() => handleDisconnect(account.id)}
                className="w-full bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-4 rounded"
              >
                Disconnect
              </button>
            </div>
          );
        })}
      </div>

      {/* Available Platforms to Connect */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Connect New Account</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {availablePlatforms
            .filter((platform) => !connectedPlatforms.includes(platform))
            .map((platform) => (
              <button
                key={platform}
                onClick={() => handleConnect(platform)}
                className="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="text-3xl mb-2">{getPlatformIcon(platform)}</div>
                <div className="text-sm font-medium">{getPlatformName(platform)}</div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

