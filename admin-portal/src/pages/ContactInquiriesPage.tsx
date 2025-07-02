import { useState, useEffect } from "react";
import type { ContactInquiry } from "../types";
import {
  getContactInquiries,
  updateContactInquiry,
  deleteContactInquiry,
} from "../api/contactInquiries";
import ContactInquiryList from "../components/admin/ContactInquiryList";

export default function ContactInquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  useEffect(() => {
    fetchInquiries();
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const isReadFilter = filter === "all" ? undefined : filter === "read";
      const data = await getContactInquiries(0, 100, isReadFilter);
      setInquiries(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching contact inquiries:", err);
      setError("Failed to load contact inquiries");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number, isRead: boolean) => {
    try {
      const updatedInquiry = await updateContactInquiry(id, {
        is_read: isRead,
      });
      setInquiries((prev) =>
        prev.map((inquiry) => (inquiry.id === id ? updatedInquiry : inquiry))
      );
    } catch (err) {
      console.error("Error updating inquiry status:", err);
      setError("Failed to update inquiry status");
    }
  };

  const handleAddResponse = async (id: number, response: string) => {
    try {
      const updatedInquiry = await updateContactInquiry(id, {
        response,
        is_read: true,
      });
      setInquiries((prev) =>
        prev.map((inquiry) => (inquiry.id === id ? updatedInquiry : inquiry))
      );
    } catch (err) {
      console.error("Error adding response:", err);
      setError("Failed to add response");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this contact inquiry?")) {
      return;
    }

    try {
      await deleteContactInquiry(id);
      setInquiries((prev) => prev.filter((inquiry) => inquiry.id !== id));
    } catch (err) {
      console.error("Error deleting inquiry:", err);
      setError("Failed to delete inquiry");
    }
  };

  const stats = {
    total: inquiries.length,
    unread: inquiries.filter((i) => !i.is_read).length,
    responded: inquiries.filter((i) => i.response).length,
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Contact Inquiries</h1>
        <p className="text-gray-600 mt-1">
          Manage and respond to contact form submissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2a2 2 0 00-2 2v3a2 2 0 01-2 2H8a2 2 0 01-2-2v-3a2 2 0 00-2-2H4"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Inquiries
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM16 3c1.1 0 2 .9 2 2v4h-6V5c0-1.1.9-2 2-2h2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Responded</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.responded}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: "all", label: "All Inquiries", count: stats.total },
              { key: "unread", label: "Unread", count: stats.unread },
              { key: "read", label: "Read", count: stats.total - stats.unread },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as "all" | "unread" | "read")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    filter === tab.key
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Inquiries List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading inquiries...</span>
            </div>
          ) : (
            <ContactInquiryList
              inquiries={inquiries}
              onMarkAsRead={handleMarkAsRead}
              onAddResponse={handleAddResponse}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
