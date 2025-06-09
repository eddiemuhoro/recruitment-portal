import { useState } from 'react';
import type { Job, JobApplication } from '../types';
import { createJob } from '../api/jobs';

interface AdminDashboardProps {
  jobs: Job[];
  applications: JobApplication[];
  onJobStatusChange: (jobId: string, status: string) => void;
  onApplicationStatusChange: (applicationId: string, status: string) => void;
}

export default function AdminDashboard({
  jobs,
  applications,
  onJobStatusChange,
  onApplicationStatusChange,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: '',
    salary: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createJob({
        ...formData,
        type: formData.type as Job['type'],
        requirements: formData.requirements.split(',').map(req => req.trim()),
        status: 'active',
        postedDate: new Date().toISOString(),
      });
      alert('Job posted successfully!');
      setFormData({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        description: '',
        requirements: '',
        salary: '',
      });
    } catch (err) {
      alert('Failed to post job');
    }
  };

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

          <h2>Manage Jobs</h2>
          {jobs.map((job) => (
            <div key={job.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.company} - {job.location}</p>
                </div>
                <select
                  className="input-field w-40"
                  value={job.status || 'active'}
                  onChange={(e) => onJobStatusChange(job.id, e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">{job.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <h2>Manage Applications</h2>
          {applications.map((application) => (
            <div key={application.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {application.applicantName}
                  </h3>
                  <p className="text-sm text-gray-500">{application.email} - {application.phone}</p>
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
                <p className="mt-2 text-sm text-gray-600">{application.coverLetter}</p>
              </div>
              <div className="mt-4">
                <a
                  href={application.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View CV
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 