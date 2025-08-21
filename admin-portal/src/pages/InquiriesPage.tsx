import { useState, useEffect } from 'react';
import type { EmployerInquiry, EmployerInquiryUpdate, InquiryStats } from '../types';
import { 
  getEmployerInquiries, 
  updateEmployerInquiry, 
  deleteEmployerInquiry,
  getInquiryStats,
  bulkUpdateInquiries,
  type InquiryFilters
} from '../api/employerInquiries';
import EmployerInquiryList from '../components/admin/EmployerInquiryList';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<EmployerInquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<EmployerInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<InquiryStats | null>(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedInquiries, setSelectedInquiries] = useState<Set<string>>(new Set());

  const fetchInquiries = async () => {
    try {
      setIsLoading(true);
      
      // Fetch inquiries first to debug the response
      console.log('Fetching inquiries...');
      const inquiriesData = await getEmployerInquiries();
      console.log('Raw inquiries data:', inquiriesData);
      
      // Transform data to ensure all required fields exist
      const transformedInquiries = inquiriesData.map(inquiry => ({
        ...inquiry,
        id: inquiry.id?.toString() || '',
        status: inquiry.status || 'new',
        priority: inquiry.priority || 'medium',
        updated_at: inquiry.updated_at || inquiry.created_at,
        admin_notes: inquiry.admin_notes || '',
        admin_response: inquiry.admin_response || '',
        assigned_to: inquiry.assigned_to || ''
      }));
      
      console.log('Transformed inquiries:', transformedInquiries);
      
      setInquiries(transformedInquiries);
      setFilteredInquiries(transformedInquiries);
      
      // Try to fetch stats, but don't fail if it doesn't work
      try {
        console.log('Fetching stats...');
        const statsData = await getInquiryStats();
        console.log('Stats data:', statsData);
        setStats(statsData);
      } catch (statsError) {
        console.error('Failed to fetch stats, but continuing with inquiries:', statsError);
        // Set default stats
        setStats({
          total: transformedInquiries.length,
          new: transformedInquiries.filter(i => i.status === 'new').length,
          in_progress: transformedInquiries.filter(i => i.status === 'in_progress').length,
          resolved: transformedInquiries.filter(i => i.status === 'resolved').length,
          urgent: transformedInquiries.filter(i => i.is_urgent).length
        });
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch inquiries. Please try again later.');
      console.error('Error fetching inquiries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Filter inquiries based on filters
  useEffect(() => {
    let filtered = inquiries;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(inquiry => inquiry.status === statusFilter);
    }

    if (priorityFilter === 'urgent') {
      filtered = filtered.filter(inquiry => inquiry.priority === 'urgent');
    } else if (priorityFilter === 'high') {
      filtered = filtered.filter(inquiry => inquiry.priority === 'high');
    } else if (priorityFilter === 'normal') {
      filtered = filtered.filter(inquiry => ['medium', 'low'].includes(inquiry.priority));
    }

    if (searchQuery) {
      filtered = filtered.filter(inquiry => 
        inquiry.employer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inquiry.contact_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inquiry.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inquiry.phone_number && inquiry.phone_number.includes(searchQuery))
      );
    }

    setFilteredInquiries(filtered);
  }, [inquiries, statusFilter, priorityFilter, searchQuery]);

  const handleInquiryUpdate = async (
    id: string,
    updateData: EmployerInquiryUpdate
  ) => {
    try {
      const updatedInquiry = await updateEmployerInquiry(id, updateData);
      setInquiries(
        inquiries.map((i) => (i.id === id ? updatedInquiry : i))
      );
      setError(null);
    } catch (error) {
      setError('Failed to update inquiry. Please try again.');
      console.error('Error updating inquiry:', error);
    }
  };

  const handleInquiryDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) {
      return;
    }
    
    try {
      await deleteEmployerInquiry(id);
      setInquiries(inquiries.filter((i) => i.id !== id));
      setSelectedInquiries(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setError(null);
    } catch (error) {
      setError('Failed to delete inquiry. Please try again.');
      console.error('Error deleting inquiry:', error);
    }
  };

  const handleBulkUpdate = async (updateData: EmployerInquiryUpdate) => {
    if (selectedInquiries.size === 0) return;
    
    try {
      await bulkUpdateInquiries(Array.from(selectedInquiries), updateData);
      await fetchInquiries(); // Refresh data
      setSelectedInquiries(new Set()); // Clear selection
    } catch (error) {
      setError('Failed to update inquiries. Please try again.');
      console.error('Error bulk updating inquiries:', error);
    }
  };

  const toggleInquirySelection = (id: string) => {
    setSelectedInquiries(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAllInquiries = () => {
    setSelectedInquiries(new Set(filteredInquiries.map(i => i.id)));
  };

  const clearSelection = () => {
    setSelectedInquiries(new Set());
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-sm text-gray-500">Loading inquiries...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Employer Inquiries</h2>
            <p className="text-sm text-gray-500">Manage and respond to employer inquiries</p>
          </div>
          <button
            onClick={() => fetchInquiries()}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-blue-800">Total</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.new}</div>
              <div className="text-sm text-yellow-800">New</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.in_progress}</div>
              <div className="text-sm text-purple-800">In Progress</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              <div className="text-sm text-green-800">Resolved</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
              <div className="text-sm text-red-800">Urgent</div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by company, email, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedInquiries.size > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                {selectedInquiries.size} inquiries selected
              </span>
              <div className="flex items-center gap-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkUpdate({ status: e.target.value as EmployerInquiry['status'] });
                      e.target.value = '';
                    }
                  }}
                  className="px-3 py-1 text-sm border border-blue-300 rounded-md"
                  defaultValue=""
                >
                  <option value="">Update Status</option>
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkUpdate({ priority: e.target.value as EmployerInquiry['priority'] });
                      e.target.value = '';
                    }
                  }}
                  className="px-3 py-1 text-sm border border-blue-300 rounded-md"
                  defaultValue=""
                >
                  <option value="">Update Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <button
                  onClick={clearSelection}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      {/* Selection Controls */}
      {filteredInquiries.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={selectAllInquiries}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Select All ({filteredInquiries.length})
            </button>
            {selectedInquiries.size > 0 && (
              <button
                onClick={clearSelection}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear Selection
              </button>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Showing {filteredInquiries.length} of {inquiries.length} inquiries
          </div>
        </div>
      )}

      {/* Enhanced Inquiries List */}
      <EmployerInquiryList
        inquiries={filteredInquiries}
        selectedInquiries={selectedInquiries}
        onToggleSelection={toggleInquirySelection}
        onUpdate={handleInquiryUpdate}
        onDelete={handleInquiryDelete}
      />
    </div>
  );
} 