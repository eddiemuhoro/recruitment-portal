import { useState, useEffect } from 'react';
import type { Job, JobCreate } from '../types';
import { getJobs, createJob, updateJob, deleteJob } from '../api/jobs';
import JobList from '../components/admin/JobList';
import JobForm from '../components/admin/JobForm';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        console.log('Fetching jobs...');
        setIsLoading(true);
        setError(null);
        const jobsData = await getJobs();
        console.log('Jobs fetched:', jobsData);
        setJobs(jobsData);
      } catch (error) {
        console.error('Error loading jobs:', error);
        setError(error instanceof Error ? error.message : 'Failed to load jobs');
      } finally {
        setIsLoading(false);
      }
    };
    loadJobs();
  }, []);

  const handleJobStatusChange = async (id: string, status: Job['status']) => {
    try {
      const job = jobs.find((j) => j.id === id);
      if (job) {
        const { id: _, ...jobData } = job;
        await updateJob(id, { ...jobData, status });
        setJobs(jobs.map((j) => (j.id === id ? { ...j, status } : j)));
      }
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  const handleJobDelete = async (id: string) => {
    try {
      await deleteJob(id);
      setJobs(jobs.filter((j) => j.id !== id));
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleJobSubmit = async (jobData: JobCreate) => {
    try {
      if (editingJob) {
        await updateJob(editingJob.id, jobData);
        setJobs(jobs.map((j) => (j.id === editingJob.id ? { ...j, ...jobData } : j)));
        setEditingJob(null);
      } else {
        const newJob = await createJob(jobData);
        setJobs([...jobs, newJob]);
        setIsCreatingJob(false);
      }
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manage Jobs</h2>
            <p className="mt-1 text-sm text-gray-500">
              Create, edit, and manage job postings
            </p>
          </div>
          <button
            onClick={() => setIsCreatingJob(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add New Job
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading jobs...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading jobs</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {isCreatingJob && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Create New Job</h3>
                <button
                  onClick={() => setIsCreatingJob(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <JobForm
                onSubmit={handleJobSubmit}
                onCancel={() => setIsCreatingJob(false)}
              />
            </div>
          )}

          {editingJob && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Edit Job</h3>
                <button
                  onClick={() => setEditingJob(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <JobForm
                job={editingJob}
                onSubmit={handleJobSubmit}
                onCancel={() => setEditingJob(null)}
              />
            </div>
          )}

          {!isCreatingJob && !editingJob && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Job Listings</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} posted
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <JobList
                jobs={jobs}
                onEdit={setEditingJob}
                onDelete={handleJobDelete}
                onStatusChange={handleJobStatusChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
} 