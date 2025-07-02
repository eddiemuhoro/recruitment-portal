import type { EmployerInquiry } from "../../types";

interface EmployerInquiryListProps {
  inquiries: EmployerInquiry[];
  onStatusChange: (id: string, isUrgent: boolean) => void;
}

export default function EmployerInquiryList({
  inquiries,
}: EmployerInquiryListProps) {
  const getUrgencyColor = (isUrgent: boolean) => {
    return isUrgent ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-4">
      {inquiries.map((inquiry) => (
        <div
          key={inquiry.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {inquiry.employer_name}
                </h3>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(
                    inquiry.is_urgent
                  )}`}
                >
                  {inquiry.is_urgent ? "Urgent" : "Normal"}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Contact Information
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  Employer: {inquiry.employer_name}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Email: {inquiry.contact_email}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Phone: {inquiry.phone_number || "Not provided"}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Received: {new Date(inquiry.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Message</h4>
                <p className="mt-1 text-sm text-gray-500 whitespace-pre-wrap">
                  {inquiry.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
