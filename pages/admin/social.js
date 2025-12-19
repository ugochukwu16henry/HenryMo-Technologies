// pages/admin/social.js

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import ProtectedRoute from "../../components/ProtectedRoute";
import AdminLayout from "../../components/AdminLayout";
import ConfirmModal from "../../components/ConfirmModal";

const PLATFORMS = [
  { value: "facebook", label: "Facebook", color: "#1877F2" },
  { value: "instagram", label: "Instagram", color: "#E1306C" },
  { value: "linkedin", label: "LinkedIn", color: "#0077B5" },
  { value: "twitter", label: "Twitter", color: "#1DA1F2" },
  { value: "tiktok", label: "TikTok", color: "#000000" },
  { value: "youtube", label: "YouTube", color: "#FF0000" },
];

const STATUS_COLORS = {
  DRAFT: "bg-gray-100 text-gray-800",
  SCHEDULED: "bg-blue-100 text-blue-800",
  POSTED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
};

export default function SocialPosts() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, post: null });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token =
        localStorage.getItem("auth_token") ||
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

      const response = await axios.get("/api/social/schedule", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
    } catch (err) {
      setError("Failed to load scheduled posts");
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

    const { id, content } = deleteModal.post;
    const preview =
      content.substring(0, 50) + (content.length > 50 ? "..." : "");
    const loadingToast = toast.loading("Deleting post...");

    try {
      const token =
        localStorage.getItem("auth_token") ||
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

      await axios.delete("/api/social/schedule", {
        headers: { Authorization: `Bearer ${token}` },
        data: { id },
      });

      setPosts(posts.filter((post) => post.id !== id));
      toast.success("Post deleted successfully", { id: loadingToast });
      setDeleteModal({ isOpen: false, post: null });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete post", {
        id: loadingToast,
      });
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
  };

  const getPlatformInfo = (platform) => {
    return (
      PLATFORMS.find((p) => p.value === platform) || {
        label: platform,
        color: "#666",
      }
    );
  };

  return (
    <ProtectedRoute>
      <AdminLayout currentPage="social">
        <div className="px-4 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Social Media Posts
            </h1>
            <Link
              href="/admin/social/new"
              className="bg-[#007BFF] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0069d9]"
            >
              + Schedule New Post
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
              <p className="mt-4 text-gray-600">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No scheduled posts
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by scheduling your first post.
              </p>
              <div className="mt-6">
                <Link
                  href="/admin/social/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#007BFF] hover:bg-[#0069d9]"
                >
                  + Schedule New Post
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {posts.map((post) => {
                  const platformInfo = getPlatformInfo(post.platform);
                  const dateTime = formatDateTime(post.scheduledAt);
                  return (
                    <li key={post.id}>
                      <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-start flex-1">
                            <div
                              className="flex-shrink-0 w-3 h-3 rounded-full mr-3 mt-2"
                              style={{ backgroundColor: platformInfo.color }}
                            ></div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {platformInfo.label}
                                </span>
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    STATUS_COLORS[post.status] ||
                                    STATUS_COLORS.DRAFT
                                  }`}
                                >
                                  {post.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-900 mb-2 line-clamp-2">
                                {post.content}
                              </p>
                              <div className="flex items-center text-sm text-gray-500 gap-4">
                                <span>
                                  📅 {dateTime.date} at {dateTime.time}
                                </span>
                                {post.mediaUrl && (
                                  <span className="text-blue-600">
                                    📎 Has media
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex items-center gap-2">
                            {post.status === "SCHEDULED" && (
                              <button
                                onClick={() => handleDeleteClick(post)}
                                className="text-red-600 hover:text-red-800 font-medium text-sm"
                              >
                                Delete
                              </button>
                            )}
                            {post.status === "POSTED" && (
                              <span className="text-green-600 text-sm">
                                ✓ Posted
                              </span>
                            )}
                            {post.status === "FAILED" && (
                              <span className="text-red-600 text-sm">
                                ✗ Failed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, post: null })}
          onConfirm={handleDelete}
          title="Delete Scheduled Post"
          message={
            deleteModal.post
              ? `Are you sure you want to delete this post?\n\n"${deleteModal.post.content.substring(
                  0,
                  50
                )}${
                  deleteModal.post.content.length > 50 ? "..." : ""
                }"\n\nThis action cannot be undone.`
              : ""
          }
          confirmText="Delete"
          cancelText="Cancel"
          danger={true}
        />
      </AdminLayout>
    </ProtectedRoute>
  );
}
