// components/ProtectedRoute.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token') || 
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!['ADMIN', 'SUPERADMIN'].includes(response.data.role)) {
        setError('Admin access required');
        return;
      }

      setUser(response.data);
    } catch (err) {
      console.error('Auth check failed:', err);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
}

