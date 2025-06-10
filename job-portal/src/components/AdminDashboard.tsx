import { useState, useEffect } from 'react';
import type { Job, JobApplication } from '../types';
import { createJob, getJobs, deleteJob } from '../api/jobs';
import { getApplications } from '../api/applications';

interface AdminDashboardProps {
  onApplicationStatusChange: (applicationId: string, status: string) => void;
}

export default function AdminDashboard({
  onApplicationStatusChange,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    employer_id: 1,
    type: 'Full-time',
    description: '',
    requirements: '',
    salary: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [jobsData, applicationsData] = await Promise.all([
          getJobs(),
          getApplications()
        ]);
        setJobs(jobsData);
        setApplications(applicationsData);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newJob = await createJob({
        ...formData,
        type: formData.type as Job['type'],
        requirements: formData.requirements.split(',').map(req => req.trim()),
      });
      setJobs([...jobs, newJob]);
      alert('Job posted successfully!');
      setFormData({
        title: '',
        company: '',
        location: '',
        employer_id: 1,
        type: 'Full-time',
        description: '',
        requirements: '',
        salary: '',
      });
    } catch (err) {
      alert('Failed to post job');
    }
  };

  const handleDeleteJob = async (job_id: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(job_id);
        setJobs(jobs.filter(job => job.id !== job_id));
      } catch (err) {
        alert('Failed to delete job');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`${
              activeTab === 'jobs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Posted Jobs
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`${
              activeTab === 'applications'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Applications
          </button>
        </nav>
      </div>

      {activeTab === 'jobs' ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Post a New Job</h2>
          <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4 max-w-xl mx-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company:</label>
              <input type="text" name="company" value={formData.company} onChange={handleChange} required className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location:</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type:</label>
              <select name="type" value={formData.type} onChange={handleChange} required className="input-field w-full">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (comma-separated):</label>
              <textarea name="requirements" value={formData.requirements} onChange={handleChange} required className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary:</label>
              <input type="text" name="salary" value={formData.salary} onChange={handleChange} required className="input-field w-full" />
            </div>
            <button type="submit" className="btn-primary w-full">Post Job</button>
          </form>

          <h2 className="text-xl font-semibold mt-8 mb-4">Manage Jobs</h2>
          {jobs.length === 0 ? (
            <p className="text-gray-500">No jobs posted yet.</p>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.company} - {job.location}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <select
                      className="input-field w-40"
                      value={job.status}
                      onChange={(e) => {
                        const updatedJobs = jobs.map(j => 
                          j.id === job.id ? { ...j, status: e.target.value as Job['status'] } : j
                        );
                        setJobs(updatedJobs);
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                      <option value="draft">Draft</option>
                    </select>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
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
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Job Applications</h2>
          {applications.length === 0 ? (
            <p className="text-gray-500">No applications received yet.</p>
          ) : (
            applications.map((application) => (
              <div key={application.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {application.applicant_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {application.email} - {application.phone}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Applied for: {jobs.find(job => job.id === application.job_id)?.title}
                    </p>
                  </div>
                  <select
                    className="input-field w-40"
                    value={application.status}
                    onChange={(e) => onApplicationStatusChange(application.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900">Cover Letter</h4>
                  <p className="mt-2 text-sm text-gray-600">{application.cover_letter}</p>
                </div>
                <div className="mt-4">
                  <a
                    href={application.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View CV
                  </a>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Applied on: {new Date(application.appliedDate).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 