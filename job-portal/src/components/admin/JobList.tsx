import { useState } from 'react';
import type { Job } from '../../types';

interface JobListProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
  onStatusChange: (jobId: string, status: Job['status']) => void;
}

export const JobList = ({ jobs, onEdit, onDelete, onStatusChange }: JobListProps) => {
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
        <div key={job.id} className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
              <p className="text-sm text-gray-500">{job.company} - {job.location}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  className={`input-field w-40 ${updatingJobs.has(job.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
}; 