import { useState } from 'react';
import type { Job } from '../../types';

interface JobListProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Job['status']) => void;
}

export default function JobList({ jobs, onEdit, onDelete, onStatusChange }: JobListProps) {
  const [updatingJobs, setUpdatingJobs] = useState<Set<string>>(new Set());

  const handleStatusChange = async (jobId: string, newStatus: Job['status']) => {
    setUpdatingJobs(prev => new Set([...prev, jobId]));
    try {
      await onStatusChange(jobId, newStatus);
    } finally {
      setUpdatingJobs(prev => {
        const next = new Set(prev);
        next.delete(jobId);
        return next;
      });
    }
  };

  if (jobs.length === 0) {
    return <p className="text-gray-500">No jobs posted yet.</p>;
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div 
          key={job.id} 
          className={`shadow rounded-lg p-6 transition-colors duration-200 ${
            job.status === 'active' 
              ? 'bg-green-50 border border-green-100' 
              : job.status === 'closed'
              ? 'bg-gray-50 border border-gray-200'
              : 'bg-yellow-50 border border-yellow-100'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
              <p className="text-sm text-gray-500">{job.company} - {job.location}</p>
              <div className="mt-2 flex items-center space-x-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {Number(Math.random().toFixed(2)) * 100} Applicants
                </span>
                <span className="text-sm text-gray-500">
                  Posted {new Date(job.posted_date).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  className={`input-field w-40 ${
                    updatingJobs.has(job.id) 
                      ? 'opacity-50 cursor-not-allowed' 
                      : job.status === 'active'
                      ? 'bg-white border-green-200'
                      : job.status === 'closed'
                      ? 'bg-white border-gray-200'
                      : 'bg-white border-yellow-200'
                  }`}
                  value={job.status}
                  onChange={(e) => handleStatusChange(job.id, e.target.value as Job['status'])}
                  disabled={updatingJobs.has(job.id)}
                >
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                  <option value="draft">Draft</option>
                </select>
                {updatingJobs.has(job.id) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <button
                onClick={() => onEdit(job)}
                className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(job.id)}
                className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">{job.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
} 