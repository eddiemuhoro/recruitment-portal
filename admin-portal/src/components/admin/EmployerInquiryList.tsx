import { useState } from "react";
import type {
  EmployerInquiry,
  EmployerInquiryUpdate,
  InquiryStatus,
  Priority,
} from "../../types";

interface EmployerInquiryListProps {
  inquiries: EmployerInquiry[];
  selectedInquiries?: Set<string>;
  onToggleSelection?: (id: string) => void;
  onUpdate: (id: string, updateData: EmployerInquiryUpdate) => void;
  onDelete: (id: string) => void;
}

export default function EmployerInquiryList({
  inquiries,
  selectedInquiries = new Set(),
  onToggleSelection,
  onUpdate,
  onDelete,
}: EmployerInquiryListProps) {
  const [expandedInquiry, setExpandedInquiry] = useState<string | null>(null);
  const [editingInquiry, setEditingInquiry] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<string>("");
  const [adminResponse, setAdminResponse] = useState<string>("");

  const getStatusColor = (status: InquiryStatus) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = (inquiryId: string, status: InquiryStatus) => {
    onUpdate(inquiryId, { status });
  };

  const handlePriorityChange = (inquiryId: string, priority: Priority) => {
    onUpdate(inquiryId, { priority });
  };

  const handleSaveNotes = (inquiryId: string) => {
    onUpdate(inquiryId, {
      admin_notes: adminNotes,
      admin_response: adminResponse,
    });
    setEditingInquiry(null);
    setAdminNotes("");
    setAdminResponse("");
  };

  const startEditing = (inquiry: EmployerInquiry) => {
    setEditingInquiry(inquiry.id);
    setAdminNotes(inquiry.admin_notes || "");
    setAdminResponse(inquiry.admin_response || "");
  };

  if (inquiries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg">No inquiries found</div>
        <p className="text-gray-500 mt-2">New inquiries will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {inquiries.map((inquiry) => (
        <div
          key={inquiry.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {onToggleSelection && (
                  <input
                    type="checkbox"
                    checked={selectedInquiries.has(inquiry.id)}
                    onChange={() => onToggleSelection(inquiry.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {inquiry.employer_name}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        inquiry.status
                      )}`}
                    >
                      {inquiry.status.replace("_", " ").toUpperCase()}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                        inquiry.priority
                      )}`}
                    >
                      {inquiry.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {inquiry.contact_email}
                    {inquiry.phone_number && ` • ${inquiry.phone_number}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    Received:{" "}
                    {new Date(inquiry.created_at).toLocaleDateString()}
                    {inquiry.updated_at !== inquiry.created_at && (
                      <span>
                        {" "}
                        • Updated:{" "}
                        {new Date(inquiry.updated_at).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Quick Action Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      handleStatusChange(inquiry.id, "in_progress")
                    }
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      inquiry.status === "in_progress"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    disabled={inquiry.status === "in_progress"}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleStatusChange(inquiry.id, "resolved")}
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      inquiry.status === "resolved"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    disabled={inquiry.status === "resolved"}
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() =>
                      handlePriorityChange(
                        inquiry.id,
                        inquiry.priority === "urgent" ? "medium" : "urgent"
                      )
                    }
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      inquiry.priority === "urgent"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {inquiry.priority === "urgent"
                      ? "Remove Urgent"
                      : "Mark Urgent"}
                  </button>
                </div>

                <select
                  className="text-sm border border-gray-300 rounded-md px-3 py-1"
                  value={inquiry.status}
                  onChange={(e) =>
                    handleStatusChange(
                      inquiry.id,
                      e.target.value as InquiryStatus
                    )
                  }
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <select
                  className="text-sm border border-gray-300 rounded-md px-3 py-1"
                  value={inquiry.priority}
                  onChange={(e) =>
                    handlePriorityChange(inquiry.id, e.target.value as Priority)
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>

                <button
                  onClick={() =>
                    setExpandedInquiry(
                      expandedInquiry === inquiry.id ? null : inquiry.id
                    )
                  }
                  className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md"
                >
                  {expandedInquiry === inquiry.id ? "Collapse" : "Expand"}
                </button>

                <button
                  onClick={() => onDelete(inquiry.id)}
                  className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>

            {expandedInquiry === inquiry.id && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Original Message */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Original Message
                    </h4>
                    <div className="bg-gray-50 rounded-md p-4">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {inquiry.message}
                      </p>
                    </div>
                  </div>

                  {/* Admin Section */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Admin Management
                    </h4>

                    {editingInquiry === inquiry.id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Admin Notes
                          </label>
                          <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded-md px-3 py-2"
                            rows={3}
                            placeholder="Internal notes..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Response to Employer
                          </label>
                          <textarea
                            value={adminResponse}
                            onChange={(e) => setAdminResponse(e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded-md px-3 py-2"
                            rows={3}
                            placeholder="Response to send to employer..."
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveNotes(inquiry.id)}
                            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingInquiry(null)}
                            className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {inquiry.admin_notes && (
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Admin Notes
                            </label>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {inquiry.admin_notes}
                              </p>
                            </div>
                          </div>
                        )}

                        {inquiry.admin_response && (
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Response
                            </label>
                            <div className="bg-green-50 border border-green-200 rounded-md p-3">
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {inquiry.admin_response}
                              </p>
                              {inquiry.responded_at && (
                                <p className="text-xs text-gray-500 mt-2">
                                  Sent:{" "}
                                  {new Date(
                                    inquiry.responded_at
                                  ).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => startEditing(inquiry)}
                          className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md"
                        >
                          {inquiry.admin_notes || inquiry.admin_response
                            ? "Edit Notes/Response"
                            : "Add Notes/Response"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
