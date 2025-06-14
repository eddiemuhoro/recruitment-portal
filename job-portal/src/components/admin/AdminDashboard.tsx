import { useState, useEffect } from 'react';
import type { Job, JobApplication } from '../../types';
import { createJob, getJobs, deleteJob, updateJob } from '../../api/jobs';
import { getApplications, updateApplicationStatus } from '../../api/applications';
import { AIScoreCircle, ApplicationDetailModal, JobForm, JobList, ApplicationFilters } from '.';

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
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    aiScoreRange: { min: 0, max: 100 },
    dateRange: { start: '', end: '' },
    selectedJob: '',
    skills: '',
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

  const handleSubmit = async (jobData: Omit<Job, 'id' | 'status'>) => {
    try {
      if (editingJob) {
        const updatedJob = await updateJob(editingJob.id, {
          ...jobData,
          status: editingJob.status,
        });
        setJobs(jobs.map(job => job.id === editingJob.id ? updatedJob : job));
        setEditingJob(null);
      } else {
        const newJob = await createJob({
          ...jobData,
          status: 'active' as const,
        });
        setJobs([...jobs, newJob]);
      }
    } catch (err) {
      alert(editingJob ? 'Failed to update job' : 'Failed to post job');
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

  const handleJobStatusChange = async (jobId: string, newStatus: Job['status']) => {
    try {
      const updatedJob = await updateJob(jobId, {
        ...jobs.find(job => job.id === jobId)!,
        status: newStatus,
      });
      setJobs(jobs.map(job => job.id === jobId ? updatedJob : job));
    } catch (err) {
      alert('Failed to update job status');
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = app.status === activeStatus;
    const matchesJob = !filters.selectedJob || app.job_id === filters.selectedJob;
    const matchesDateRange = (!filters.dateRange.start || new Date(app.applied_date) >= new Date(filters.dateRange.start)) &&
                            (!filters.dateRange.end || new Date(app.applied_date) <= new Date(filters.dateRange.end));
    const matchesSkills = !filters.skills || 
                         app.cover_letter.toLowerCase().includes(filters.skills.toLowerCase());
    
    // Calculate AI score (using the same logic as in the AIScoreCircle component)
    const aiScore = app.status === 'accepted' 
      ? Math.floor(Math.random() * 20) + 80
      : app.status === 'rejected'
      ? Math.floor(Math.random() * 40)
      : Math.floor(Math.random() * 20) + 60;
    
    const matchesAiScore = aiScore >= filters.aiScoreRange.min && aiScore <= filters.aiScoreRange.max;

    return matchesStatus && matchesJob && matchesDateRange && matchesSkills && matchesAiScore;
  });

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
          <JobForm
            initialData={editingJob || undefined}
            onSubmit={handleSubmit}
            onCancel={editingJob ? () => setEditingJob(null) : undefined}
          />

          <h2 className="text-xl font-semibold mt-8 mb-4">Manage Jobs</h2>
          <JobList
            jobs={jobs}
            onEdit={setEditingJob}
            onDelete={handleDeleteJob}
            onStatusChange={handleJobStatusChange}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">Job Applications</h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
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

          {showFilters && (
            <ApplicationFilters
              jobs={jobs}
              filters={filters}
              onFilterChange={setFilters}
              onReset={() => setFilters({
                aiScoreRange: { min: 0, max: 100 },
                dateRange: { start: '', end: '' },
                selectedJob: '',
                skills: '',
              })}
            />
          )}

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
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                          application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}
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
                              ? Math.floor(Math.random() * 20) + 80
                              : application.status === 'rejected'
                              ? Math.floor(Math.random() * 40)
                              : Math.floor(Math.random() * 20) + 60
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