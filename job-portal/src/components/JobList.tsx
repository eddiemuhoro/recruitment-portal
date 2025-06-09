import { useEffect, useState } from 'react';
import type { Job } from '../types';
import { Link } from 'react-router-dom';
import { fetchJobs } from '../api/jobs';

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await fetchJobs();
        setJobs(data);
      } catch (err) {
        setError('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (jobs.length === 0) return <div>No jobs available at the moment.</div>;

  return (
    <div className="space-y-6">
      {jobs.map((job) => (
        <div key={job.id} className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
              <p className="text-gray-600">{job.company}</p>
            </div>
            <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
              {job.type}
            </span>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center text-gray-500">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {job.location}
            </div>
            <div className="mt-2 text-gray-500">
              <span className="font-medium">Salary:</span> {job.salary}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-gray-600 line-clamp-2">{job.description}</p>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900">Requirements:</h3>
            <ul className="mt-2 list-disc list-inside text-gray-600">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <Link
              to={`/jobs/${job.id}/apply`}
              className="btn-primary inline-block"
            >
              Apply Now
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
} 