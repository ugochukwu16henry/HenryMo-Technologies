// pages/admin/social-accounts.js

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import ProtectedRoute from "../../components/ProtectedRoute";
import AdminLayout from "../../components/AdminLayout";
import ConfirmModal from "../../components/ConfirmModal";

const PLATFORMS = [
  {
    value: "linkedin",
    label: "LinkedIn",
    icon: "💼",
    color: "#0077B5",
    description: "Connect your LinkedIn account to share posts",
  },
  {
    value: "facebook",
    label: "Facebook",
    icon: "📘",
    color: "#1877F2",
    description: "Connect your Facebook page to share posts",
  },
  {
    value: "instagram",
    label: "Instagram",
    icon: "📷",
    color: "#E1306C",
    description: "Connect your Instagram account to share posts",
  },
  {
    value: "twitter",
    label: "Twitter",
    icon: "🐦",
    color: "#1DA1F2",
    description: "Connect your Twitter account to share posts",
  },
  {
    value: "tiktok",
    label: "TikTok",
    icon: "🎵",
    color: "#000000",
    description: "Connect your TikTok account (coming soon)",
  },
  {
    value: "youtube",
    label: "YouTube",
    icon: "📺",
    color: "#FF0000",
    description: "Connect your YouTube channel (coming soon)",
  },
];

export default function SocialAccounts() {
  const router = useRouter();
  const { social } = router.query; // Handle OAuth redirect success
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [disconnectModal, setDisconnectModal] = useState({
    isOpen: false,
    account: null,
  });

  useEffect(() => {
    fetchAccounts();

    // Handle OAuth success redirect
    if (social) {
      const platform = social.replace("-connected", "");
      toast.success(
        `${
          platform.charAt(0).toUpperCase() + platform.slice(1)
        } account connected successfully!`
      );
      // Clean up URL
      router.replace("/admin/social-accounts", undefined, { shallow: true });
    }
  }, [social]);

  const fetchAccounts = async () => {
    try {
      const token =
        localStorage.getItem("auth_token") ||
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

      const response = await axios.get("/api/social/accounts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(response.data);
    } catch (err) {
      setError("Failed to load connected accounts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (platform) => {
    // Redirect to OAuth endpoint
    window.location.href = `/api/social/connect/${platform}`;
  };

  const handleDisconnectClick = (account) => {
    setDisconnectModal({ isOpen: true, account });
  };

  const handleDisconnect = async () => {
    if (!disconnectModal.account) return;

    const { id, platform } = disconnectModal.account;
    const loadingToast = toast.loading("Disconnecting account...");

    try {
      const token =
        localStorage.getItem("auth_token") ||
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

      await axios.delete(`/api/social/accounts?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAccounts(accounts.filter((acc) => acc.id !== id));
      toast.success(`${platform} account disconnected successfully`, {
        id: loadingToast,
      });
      setDisconnectModal({ isOpen: false, account: null });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to disconnect account", {
        id: loadingToast,
      });
    }
  };

  const getConnectedPlatform = (platformName) => {
    return accounts.find((acc) => acc.platform === platformName);
  };

  const isExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getAccountInfo = (account) => {
    if (!account?.metadata) return null;
    try {
      return JSON.parse(account.metadata);
    } catch {
      return null;
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout currentPage="social-accounts">
        <div className="px-4 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Social Media Accounts
            </h1>
            <p className="mt-2 text-gray-600">
              Connect your social media accounts to automatically post scheduled
              content.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#007BFF]"></div>
              <p className="mt-4 text-gray-600">Loading accounts...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PLATFORMS.map((platform) => {
                const connectedAccount = getConnectedPlatform(platform.value);
                const accountInfo = getAccountInfo(connectedAccount);
                const expired = connectedAccount
                  ? isExpired(connectedAccount.expiresAt)
                  : false;
                const isAvailable = [
                  "linkedin",
                  "facebook",
                  "instagram",
                  "twitter",
                ].includes(platform.value);

                return (
                  <div
                    key={platform.value}
                    className="bg-white rounded-lg shadow overflow-hidden border border-gray-200"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{platform.icon}</span>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {platform.label}
                            </h3>
                            {accountInfo?.username && (
                              <p className="text-sm text-gray-500">
                                @{accountInfo.username}
                              </p>
                            )}
                            {accountInfo?.name && !accountInfo.username && (
                              <p className="text-sm text-gray-500">
                                {accountInfo.name}
                              </p>
                            )}
                          </div>
                        </div>
                        {connectedAccount && (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              expired
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {expired ? "Expired" : "Connected"}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-4">
                        {platform.description}
                      </p>

                      {connectedAccount && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">
                            Connected on
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatDate(connectedAccount.createdAt)}
                          </div>
                          {expired && (
                            <div className="mt-2 text-xs text-red-600">
                              Token expired on{" "}
                              {formatDate(connectedAccount.expiresAt)}
                            </div>
                          )}
                          {!expired && (
                            <div className="mt-2 text-xs text-gray-500">
                              Expires on{" "}
                              {formatDate(connectedAccount.expiresAt)}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2">
                        {connectedAccount ? (
                          <>
                            <button
                              onClick={() => handleConnect(platform.value)}
                              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 text-sm"
                            >
                              Reconnect
                            </button>
                            <button
                              onClick={() =>
                                handleDisconnectClick(connectedAccount)
                              }
                              className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 text-sm"
                            >
                              Disconnect
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleConnect(platform.value)}
                            disabled={!isAvailable}
                            className={`w-full px-4 py-2 rounded-lg font-medium text-sm ${
                              isAvailable
                                ? "bg-[#007BFF] text-white hover:bg-[#0069d9]"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            {isAvailable ? "Connect" : "Coming Soon"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && accounts.length === 0 && (
            <div className="mt-8 text-center py-8 bg-white rounded-lg shadow">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No connected accounts
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Connect your social media accounts to get started.
              </p>
            </div>
          )}
        </div>

        <ConfirmModal
          isOpen={disconnectModal.isOpen}
          onClose={() => setDisconnectModal({ isOpen: false, account: null })}
          onConfirm={handleDisconnect}
          title="Disconnect Account"
          message={
            disconnectModal.account
              ? `Are you sure you want to disconnect your ${disconnectModal.account.platform} account? You'll need to reconnect it to post to this platform.`
              : ""
          }
          confirmText="Disconnect"
          cancelText="Cancel"
          danger={true}
        />
      </AdminLayout>
    </ProtectedRoute>
  );
}
