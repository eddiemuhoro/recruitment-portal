import React, { useState, useEffect } from 'react';
import { FaSort, FaSortUp, FaSortDown, FaSearch, FaEnvelope, FaPhone } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getEmployerInquiries } from '../../api/employerInquiries';
import type { EmployerInquiry } from '../../types';

const EmployerInquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<EmployerInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof EmployerInquiry>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'recent' | 'old'>('all');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const data = await getEmployerInquiries();
      setInquiries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: keyof EmployerInquiry) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedAndFilteredInquiries = () => {
    let filtered = [...inquiries];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(inquiry => 
        inquiry.employer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.contact_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date filter
    const now = new Date();
    if (filterStatus === 'recent') {
      filtered = filtered.filter(inquiry => {
        const inquiryDate = new Date(inquiry.created_at);
        return (now.getTime() - inquiryDate.getTime()) < 7 * 24 * 60 * 60 * 1000; // Last 7 days
      });
    } else if (filterStatus === 'old') {
      filtered = filtered.filter(inquiry => {
        const inquiryDate = new Date(inquiry.created_at);
        return (now.getTime() - inquiryDate.getTime()) >= 7 * 24 * 60 * 60 * 1000;
      });
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (sortField === 'created_at') {
        const dateA = new Date(aValue as string).getTime();
        const dateB = new Date(bValue as string).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      return 0;
    });
  };

  const getSortIcon = (field: keyof EmployerInquiry) => {
    if (field !== sortField) return <FaSort className="text-gray-400" />;
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 text-red-700 p-4 rounded-lg">
      Error: {error}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Employer Inquiries</h2>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'recent' | 'old')}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Inquiries</option>
              <option value="recent">Recent (Last 7 days)</option>
              <option value="old">Older</option>
            </select>
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('employer_name')}
                >
                  <div className="flex items-center gap-2">
                    Employer Name {getSortIcon('employer_name')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('contact_email')}
                >
                  <div className="flex items-center gap-2">
                    Contact {getSortIcon('contact_email')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center gap-2">
                    Date {getSortIcon('created_at')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getSortedAndFilteredInquiries().map((inquiry) => (
                <motion.tr
                  key={inquiry.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`hover:bg-gray-50 ${inquiry.is_urgent ? 'bg-red-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {inquiry.employer_name}
                      {inquiry.is_urgent && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Urgent
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inquiry.contact_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {inquiry.phone_number ? (
                        <a href={`tel:${inquiry.phone_number}`} className="text-blue-600 hover:text-blue-900">
                          <FaPhone className="inline mr-1" />
                          {inquiry.phone_number}
                        </a>
                      ) : (
                        <span className="text-gray-400">Not provided</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 line-clamp-2">{inquiry.message}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <a
                        href={`mailto:${inquiry.contact_email}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Send Email"
                      >
                        <FaEnvelope />
                      </a>
                      {inquiry.phone_number && (
                        <a
                          href={`tel:${inquiry.phone_number}`}
                          className="text-green-600 hover:text-green-900"
                          title="Call"
                        >
                          <FaPhone />
                        </a>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {getSortedAndFilteredInquiries().length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No inquiries found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerInquiries; 