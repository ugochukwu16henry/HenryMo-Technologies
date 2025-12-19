// pages/admin/analytics.js

import { useState, useEffect } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import AdminLayout from "../../components/AdminLayout";

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState(30); // days

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?days=${dateRange}`);
      if (!response.ok) throw new Error("Failed to fetch analytics");
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout currentPage="analytics">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#007BFF]"></div>
              <p className="mt-4 text-gray-600">Loading analytics...</p>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout currentPage="analytics">
        <div className="px-4 sm:px-0">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              Error: {error}
            </div>
          )}

          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <div className="flex gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
                <option value={365}>Last year</option>
              </select>
              <button
                onClick={fetchAnalytics}
                className="px-4 py-2 bg-[#007BFF] text-white rounded-lg hover:bg-[#0069d9]"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium mb-2">
                Total Page Views
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.totalViews || 0}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Last {dateRange} days
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium mb-2">
                Unique Visitors
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.uniqueVisitors || 0}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Estimated based on visitor IDs
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium mb-2">
                Pages Tracked
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.pagesTracked || 0}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Different pages visited
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium mb-2">
                Avg. Views/Day
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.averageViewsPerDay
                  ? Math.round(stats.averageViewsPerDay)
                  : 0}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Over last {dateRange} days
              </p>
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Most Visited Pages</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Page
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % of Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats?.topPages?.map((page, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {page.page || "/"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {page.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stats.totalViews > 0
                          ? ((page.count / stats.totalViews) * 100).toFixed(1)
                          : 0}
                        %
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Recent Page Views</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Page
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referrer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Device
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats?.recentViews?.map((view, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(view.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {view.page || "/"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {view.referrer ? (
                          <a
                            href={view.referrer}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#007BFF] hover:underline truncate max-w-xs block"
                          >
                            {view.referrer}
                          </a>
                        ) : (
                          <span className="text-gray-400">Direct</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {view.userAgent
                          ? view.userAgent.includes("Mobile")
                            ? "Mobile"
                            : "Desktop"
                          : "Unknown"}
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No recent views
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Google Analytics Note */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              💡 Google Analytics Integration
            </h3>
            <p className="text-blue-800 text-sm mb-2">
              For more detailed analytics (geographic data, demographics, user
              flow, etc.), configure Google Analytics:
            </p>
            <ol className="list-decimal list-inside text-blue-800 text-sm space-y-1">
              <li>
                Get your Measurement ID from{" "}
                <a
                  href="https://analytics.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Google Analytics
                </a>
              </li>
              <li>
                Add it as{" "}
                <code className="bg-blue-100 px-1 rounded">
                  NEXT_PUBLIC_GA_ID
                </code>{" "}
                in Railway environment variables
              </li>
              <li>
                View detailed analytics at{" "}
                <a
                  href="https://analytics.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  analytics.google.com
                </a>
              </li>
            </ol>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
