import { useState } from "react";
import type { ContactInquiry } from "../../types";
import {
  getWhatsAppUrl,
  getSmsUrl,
  formatPhoneForDisplay,
} from "../../utils/phoneUtils";

interface ContactInquiryListProps {
  inquiries: ContactInquiry[];
  onMarkAsRead: (id: number, isRead: boolean) => void;
  onAddResponse: (id: number, response: string) => void;
  onDelete: (id: number) => void;
}

export default function ContactInquiryList({
  inquiries,
  onMarkAsRead,
  onAddResponse,
  onDelete,
}: ContactInquiryListProps) {
  const [respondingTo, setRespondingTo] = useState<number | null>(null);
  const [response, setResponse] = useState("");

  const getStatusColor = (isRead: boolean) => {
    return isRead ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800";
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case "general":
        return "📋";
      case "support":
        return "🔧";
      case "billing":
        return "💰";
      case "partnership":
        return "🤝";
      default:
        return "📧";
    }
  };

  const handleEmailReply = (inquiry: ContactInquiry) => {
    const subject = `Re: ${inquiry.subject.replace("_", " ")} Inquiry - ${
      inquiry.name
    }`;
    const body = `Hello ${inquiry.name},

Thank you for contacting us regarding your ${inquiry.subject.replace(
      "_",
      " "
    )} inquiry.

Original message:
"${inquiry.message}"

---
Best regards,
Skyways Global Recruitment Team`;

    const mailtoLink = `mailto:${inquiry.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, "_blank");
  };

  const handleWhatsAppReply = (inquiry: ContactInquiry) => {
    if (!inquiry.phone) return;

    const message = `Hello ${inquiry.name},

Thank you for contacting us regarding your ${inquiry.subject.replace(
      "_",
      " "
    )} inquiry.

We have received your message: "${inquiry.message}"

We will get back to you shortly with more information.

Best regards,
Skyways Global Recruitment Team`;

    const whatsappUrl = getWhatsAppUrl(inquiry.phone, message);
    if (whatsappUrl) {
      window.open(whatsappUrl, "_blank");
    }
  };

  const handleSMSReply = (inquiry: ContactInquiry) => {
    if (!inquiry.phone) return;

    const message = `Hello ${
      inquiry.name
    }, thank you for contacting Skyways Global Recruitment. We received your ${inquiry.subject.replace(
      "_",
      " "
    )} inquiry and will respond soon. Best regards, Skyways Team`;

    const smsUrl = getSmsUrl(inquiry.phone, message);
    if (smsUrl) {
      window.open(smsUrl, "_blank");
    }
  };

  const handleSubmitResponse = (inquiryId: number) => {
    if (response.trim()) {
      onAddResponse(inquiryId, response.trim());
      setResponse("");
      setRespondingTo(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      {inquiries.length === 0 ? (
        <div className="text-center py-12">
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
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2a2 2 0 00-2 2v3a2 2 0 01-2 2H8a2 2 0 01-2-2v-3a2 2 0 00-2-2H4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No contact inquiries
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No contact form submissions have been received yet.
          </p>
        </div>
      ) : (
        inquiries.map((inquiry) => (
          <div
            key={inquiry.id}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200 ${
              !inquiry.is_read ? "border-l-4 border-l-blue-500" : ""
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {getSubjectIcon(inquiry.subject)}
                  </span>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {inquiry.name}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {inquiry.subject.replace("_", " ")} Inquiry
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      inquiry.is_read
                    )}`}
                  >
                    {inquiry.is_read ? "Read" : "New"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(inquiry.created_at)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Contact Information
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {inquiry.email}
                    </p>
                    {inquiry.phone && (
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {formatPhoneForDisplay(inquiry.phone)}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Subject:</span>{" "}
                      <span className="capitalize">
                        {inquiry.subject.replace("_", " ")}
                      </span>
                    </p>
                  </div>

                  <h4 className="text-sm font-medium text-gray-900 mb-2 mt-4">
                    Message
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {inquiry.message}
                    </p>
                  </div>
                </div>

                <div>
                  {inquiry.response ? (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Internal Note
                      </h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {inquiry.response}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Added:{" "}
                          {inquiry.responded_at &&
                            formatDate(inquiry.responded_at)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Add Internal Note
                      </h4>
                      {respondingTo === inquiry.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            placeholder="Add internal notes, action items, or follow-up reminders..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSubmitResponse(inquiry.id)}
                              disabled={!response.trim()}
                              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Save Note
                            </button>
                            <button
                              onClick={() => {
                                setRespondingTo(null);
                                setResponse("");
                              }}
                              className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setRespondingTo(inquiry.id)}
                          className="w-full px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
                        >
                          + Add Internal Note
                        </button>
                      )}
                    </div>
                  )}

                  {/* Reply Buttons */}
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => handleEmailReply(inquiry)}
                      className="w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      📧 Reply via Email
                    </button>

                    {inquiry.phone && (
                      <>
                        <button
                          onClick={() => handleWhatsAppReply(inquiry)}
                          className="w-full px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
                        >
                          📱 Reply via WhatsApp
                        </button>

                        <button
                          onClick={() => handleSMSReply(inquiry)}
                          className="w-full px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          💬 Reply via SMS
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-6 border-t border-gray-200">
                <div className="flex space-x-2">
                  {!inquiry.is_read && (
                    <button
                      onClick={() => onMarkAsRead(inquiry.id, true)}
                      className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full hover:bg-green-200"
                    >
                      Mark as Read
                    </button>
                  )}
                  {inquiry.is_read && (
                    <button
                      onClick={() => onMarkAsRead(inquiry.id, false)}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full hover:bg-blue-200"
                    >
                      Mark as Unread
                    </button>
                  )}
                </div>
                <button
                  onClick={() => onDelete(inquiry.id)}
                  className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
