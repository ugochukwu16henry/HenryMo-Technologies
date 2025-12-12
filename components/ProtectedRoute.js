// components/ProtectedRoute.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

/**
 * ProtectedRoute - Wrapper component that protects routes requiring admin authentication
 * Prevents content flash by keeping loading state until auth check completes
 */
export default function ProtectedRoute({ children, requiredRoles = ['ADMIN', 'SUPERADMIN'] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Only run on client side to prevent SSR hydration issues
    if (typeof window !== 'undefined') {
      checkAuth();
    } else {
      // On server, keep loading state
      setLoading(true);
    }
  }, [router.pathname]); // Re-check if route changes

  const checkAuth = async () => {
    try {
      // Try to get token from localStorage or cookies
      const token = localStorage.getItem('auth_token') || 
                    document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      if (!token) {
        setError('Authentication required');
        setLoading(false);
        router.replace('/admin/login');
        return;
      }

      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Check if user has required role
      if (!requiredRoles.includes(response.data.role)) {
        setError('Insufficient permissions. Admin access required.');
        setLoading(false);
        setIsAuthenticated(false);
        return;
      }

      setUser(response.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Auth check failed:', err);
      setError('Authentication failed. Please log in again.');
      setLoading(false);
      setIsAuthenticated(false);
      
      // Clear invalid tokens
      localStorage.removeItem('auth_token');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.replace('/admin/login');
      }, 1500);
      return;
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#007BFF] mb-4"></div>
          <div className="text-lg text-gray-600">Verifying access...</div>
        </div>
      </div>
    );
  }

  // Show error message if authentication failed
  if (error && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-600 text-lg mb-2">⚠️ {error}</div>
          <div className="text-gray-500 text-sm">Redirecting to login page...</div>
        </div>
      </div>
    );
  }

  // Only render children if authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Redirecting to login...</div>
      </div>
    );
  }

  // Render protected content with user context
  // Clone children and pass user as prop if function
  if (typeof children === 'function') {
    return children(user);
  }
  return children;
}

