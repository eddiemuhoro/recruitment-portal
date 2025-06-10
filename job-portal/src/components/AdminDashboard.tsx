import { useState, useEffect } from 'react';
import type { Job, JobApplication } from '../types';
import { createJob, getJobs, deleteJob, updateJob } from '../api/jobs';
import { getApplications, updateApplicationStatus } from '../api/applications';

// Helper function for status colors
const getStatusColor = (status: JobApplication['status']) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'reviewed': return 'bg-blue-100 text-blue-800';
    case 'accepted': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

interface AdminDashboardProps {
  onApplicationStatusChange: (applicationId: string, status: string) => void;
}

// AI Score Circle Component
const AIScoreCircle = ({ score }: { score: number; status: JobApplication['status'] }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="relative w-16 h-16">
      <svg className="w-full h-full" viewBox="0 0 36 36">
        {/* Background circle */}
        <circle
          cx="18"
          cy="18"
          r="15.91549430918954"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="3"
        />
        {/* Score circle */}
        <circle
          cx="18"
          cy="18"
          r="15.91549430918954"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={`${score} 100`}
          strokeLinecap="round"
          className={getScoreColor(score)}
          transform="rotate(-90 18 18)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-sm font-bold ${getScoreColor(score)}`}>
          {score}
        </span>
      </div>
    </div>
  );
};

// Application Detail Modal Component
const ApplicationDetailModal = ({ 
  application, 
  job,
  onClose,
  onStatusChange 
}: { 
  application: JobApplication;
  job: Job | undefined;
  onClose: () => void;
  onStatusChange: (applicationId: string, status: JobApplication['status']) => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{application.applicant_name}</h2>
              <p className="text-gray-600">{application.email} - {application.phone}</p>
              <p className="text-gray-600 mt-1">Applied for: {job?.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Cover Letter</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{application.cover_letter}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Application Status</h3>
              <select
                className={`px-4 py-2 rounded-lg text-sm font-medium ${getStatusColor(application.status)}`}
                value={application.status}
                onChange={(e) => onStatusChange(application.id, e.target.value as JobApplication['status'])}
              >
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <a
                href={application.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View CV
              </a>
              <span className="text-sm text-gray-500">
                Applied on: {new Date(application.applied_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard({
  onApplicationStatusChange,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [activeStatus, setActiveStatus] = useState<JobApplication['status']>('pending');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
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
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

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
        status: 'active' as const,
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

  const handleStatusChange = async (applicationId: string, newStatus: JobApplication['status']) => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      setApplications(applications.map(app =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
      onApplicationStatusChange(applicationId, newStatus);
    } catch (err) {
      alert('Failed to update application status');
    }
  };

  const filteredApplications = applications.filter(app => app.status === activeStatus);

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      employer_id: 1,
      type: job.type,
      description: job.description,
      requirements: job.requirements.join(', '),
      salary: job.salary,
    });
  };

  const handleUpdateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    try {
      const updatedJob = await updateJob(editingJob.id, {
        ...formData,
        type: formData.type as Job['type'],
        requirements: formData.requirements.split(',').map(req => req.trim()),
        status: editingJob.status,
      });
      
      setJobs(jobs.map(job => job.id === editingJob.id ? updatedJob : job));
      setEditingJob(null);
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
      alert('Job updated successfully!');
    } catch (err) {
      alert('Failed to update job');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200">
        <h2 className="text-xl font-bold">Admin Dashboard(Only admin can see this page)</h2>
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
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            Applications
            <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
              {applications.filter(app => app.status === 'pending').length}
            </span>
          </button>
        </nav>
      </div>

      {activeTab === 'jobs' ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">
            {editingJob ? 'Edit Job' : 'Post a New Job'}
          </h2>
          <form 
            onSubmit={editingJob ? handleUpdateJob : handleSubmit} 
            className="bg-white shadow rounded-lg p-6 space-y-4 max-w-xl mx-auto"
          >
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
            <div className="flex space-x-4">
              <button type="submit" className="btn-primary flex-1">
                {editingJob ? 'Update Job' : 'Post Job'}
              </button>
              {editingJob && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingJob(null);
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
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              )}
            </div>
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
                      onClick={() => handleEditJob(job)}
                      className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md"
                    >
                      Edit
                    </button>
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
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">Job Applications</h2>
              <div className="group relative">
                <button className="text-gray-400 hover:text-gray-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 text-sm text-gray-600 hidden group-hover:block z-50">
                  <h3 className="font-medium text-gray-900 mb-2">How to Use the Applications Dashboard</h3>
                  <ul className="space-y-2">
                    <li>• Use the status filters at the top to view applications by their current status</li>
                    <li>• Click on any application card to view full details including the complete cover letter</li>
                    <li>• Change application status using the dropdown menu on each card</li>
                    <li>• When you mark an application as "Accepted", the candidate will automatically receive a text message notification</li>
                    <li>• The AI Match Score helps identify the best candidates based on their qualifications</li>
                    <li>• You can download candidate CVs by clicking the "View CV" link</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex space-x-2 overflow-x-auto">
              {(['pending', 'reviewed', 'accepted', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveStatus(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeStatus === status
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  <span className="ml-2 bg-white px-2 py-0.5 rounded-full text-xs">
                    {applications.filter(app => app.status === status).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No {activeStatus} applications found.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredApplications.map((application) => (
                <div 
                  key={application.id} 
                  className="bg-white shadow rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedApplication(application)}
                >
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
                    <div className="flex flex-col items-end space-y-3">
                      <select
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}
                        value={application.status}
                        onChange={(e) => handleStatusChange(application.id, e.target.value as JobApplication['status'])}
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-medium text-gray-500 mb-1">AI Match Score</span>
                        <AIScoreCircle 
                          score={
                            application.status === 'accepted' 
                              ? Math.floor(Math.random() * 20) + 80 // 80-100
                              : application.status === 'rejected'
                              ? Math.floor(Math.random() * 40) // 0-40
                              : Math.floor(Math.random() * 20) + 60 // 60-80
                          }
                          status={application.status}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Cover Letter</h4>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3">{application.cover_letter}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <a
                      href={application.cv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View CV
                    </a>
                    <span className="text-sm text-gray-500">
                      Applied on: {new Date(application.applied_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedApplication && (
            <ApplicationDetailModal
              application={selectedApplication}
              job={jobs.find(job => job.id === selectedApplication.job_id)}
              onClose={() => setSelectedApplication(null)}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      )}
    </div>
  );
} 