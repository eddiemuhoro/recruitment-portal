import { useEffect, useState } from 'react';
import type { Job } from '../types';
import { Link } from 'react-router-dom';
import { getJobs } from '../api/jobs';
import JobDetailsModal from './JobDetailsModal';

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await getJobs();
        setJobs(data);
      } catch (err) {
        setError('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">
      {error}
    </div>
  );
  
  if (jobs.length === 0) return (
    <div className="text-center text-gray-600 p-8 bg-gray-50 rounded-lg">
      No jobs available at the moment.
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {jobs.map((job) => (
          <div 
            key={job.id} 
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer"
            onClick={() => setSelectedJob(job)}
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                    {job.title}
                  </h2>
                  <p className="text-sm text-gray-600">{job.company}</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                  {job.type}
                </span>
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

              <div className="mb-4">
                <h3 className="text-xs font-medium text-gray-900 mb-2">Key Requirements:</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  {job.requirements.slice(0, 2).map((req, index) => (
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
              <Link
                      to={`/jobs/${job.id}/apply`}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Apply Now
                    </Link>
            </div>
          </div>
        ))}
      </div>

      <JobDetailsModal
        job={selectedJob}
        isOpen={selectedJob !== null}
        onClose={() => setSelectedJob(null)}
      />
    </>
  );
} 