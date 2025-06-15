import { useState, useEffect } from 'react';
import type { EmployerInquiry } from '../types';
import { getEmployerInquiries, updateInquiryStatus } from '../api/employerInquiries';
import EmployerInquiryList from '../components/admin/EmployerInquiryList';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<EmployerInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setIsLoading(true);
        const data = await getEmployerInquiries();
        setInquiries(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch inquiries. Please try again later.');
        console.error('Error fetching inquiries:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  const handleInquiryStatusChange = async (
    id: string,
    isUrgent: boolean
  ) => {
    try {
      const updatedInquiry = await updateInquiryStatus(id, isUrgent);
      setInquiries(
        inquiries.map((i) => (i.id === id ? updatedInquiry : i))
      );
      setError(null);
    } catch (error) {
      setError('Failed to update inquiry urgency. Please try again.');
      console.error('Error updating inquiry urgency:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading inquiries...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Manage Employer Inquiries
      </h2>
      <EmployerInquiryList
        inquiries={inquiries}
        onStatusChange={handleInquiryStatusChange}
      />
    </div>
  );
} 