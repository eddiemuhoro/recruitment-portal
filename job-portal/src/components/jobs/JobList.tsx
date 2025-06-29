import { useState } from 'react';
import type { Job } from '../../types';
import { Link } from 'react-router-dom';
import { getJobs } from '../../api/jobs';
import JobDetailsModal from './JobDetailsModal';
import { useQuery } from '@tanstack/react-query';

const ITEMS_PER_PAGE = 10;

export default function JobList() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: getJobs,
    select: (data) => data.filter(job => job.status !== 'draft'),
  });

  // Calculate pagination
  const totalPages = Math.ceil(jobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedJobs = jobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getStatusBadge = (status: Job['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2.5 py-1 text-xs font-medium text-green-600 bg-green-50 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            Active
          </span>
        );
      case 'closed':
        return (
          <span className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-50 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">
      {error instanceof Error ? error.message : 'Failed to load jobs'}
    </div>
  );
  
  if (jobs.length === 0) return (
    <div className="text-center text-gray-600 p-8 bg-gray-50 rounded-lg">
      No jobs available at the moment.
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedJobs.map((job) => (
          <div
            key={job.id}
  className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 ${
              job.status === 'closed' ? 'opacity-75' : 'cursor-pointer'
            }`}         
          >
            <div className="p-5" >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                    {job.title}
                  </h2>
                  <p className="text-sm text-gray-600">{job.company}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                    {job.type}
                  </span>
                  {getStatusBadge(job.status)}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {job.location}
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Salary:</span> {job.salary}
                </div>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                {job.description}
              </p>

              <div className="mb-4"                onClick={() => setSelectedJob(job)}
              >
                <h3 className="text-xs font-medium text-gray-900 mb-2">Key Requirements:</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  {job.requirements.slice(0, 2).map((req: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-1">•</span>
                      <span className="line-clamp-1">{req}</span>
                    </li>
                  ))}
                  {job.requirements.length > 2 && (
                    <li className="text-blue-600 text-xs">+{job.requirements.length - 2} more</li>
                  )}
                </ul>
              </div>

              <div className="mt-4">
                {job.status === 'closed' ? (
                  <div className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-500 rounded-lg">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Applications Closed
                  </div>
                ) : (
                  <Link
                    to={`/jobs/${job.id}/apply`}
                    className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Apply Now
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
} 