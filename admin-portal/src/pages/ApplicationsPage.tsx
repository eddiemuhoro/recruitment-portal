import { useState, useEffect } from 'react';
import type { Job, JobApplication } from '../types';
import { getApplications, updateApplicationStatus } from '../api/applications';
import { getJobs } from '../api/jobs';
import ApplicationFilters from '../components/admin/ApplicationFilters';
import Modal from '../components/common/Modal';

type ApplicationStatus = JobApplication['status'];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingApplications, setUpdatingApplications] = useState<Set<string>>(new Set());
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | 'all'>('pending');
  const [filters, setFilters] = useState({
    aiScoreRange: { min: 0, max: 100 },
    dateRange: { start: '', end: '' },
    selectedJob: '',
    skills: '',
    passportStatus: 'all' as 'all' | 'has' | 'missing'
  });

  const getDocumentTypeLabel = (docType: string): string => {
    const labels: Record<string, string> = {
      cv: 'CV/Resume',
      passport: 'Passport',
      birth_certificate: 'Birth Certificate',
      kcse_certificate: 'KCSE Certificate',
      kcpe_certificate: 'KCPE Certificate',
      certificate_of_good_conduct: 'Certificate of Good Conduct',
      academic_transcripts: 'Academic Transcripts',
      professional_certificate: 'Professional Certificate',
      work_permit: 'Work Permit',
      police_clearance: 'Police Clearance',
      medical_certificate: 'Medical Certificate',
      other: 'Other Documents'
    };
    return labels[docType] || docType;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Fetching applications and jobs...');
        setIsLoading(true);
        setError(null);
        const [applicationsData, jobsData] = await Promise.all([
          getApplications(),
          getJobs(),
        ]);
        // Add random AI scores to applications
        const applicationsWithScores = applicationsData.map(app => ({
          ...app,
          ai_score: Number(Math.random().toFixed(2)) * 100
        }));
        console.log('Applications fetched:', applicationsWithScores);
        console.log('Jobs fetched:', jobsData);
        setApplications(applicationsWithScores);
        setJobs(jobsData);
      } catch (error) {
        console.error('Error loading data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleApplicationStatusChange = async (
    id: string,
    status: ApplicationStatus
  ) => {
    setUpdatingApplications(prev => new Set([...prev, id]));
    try {
      await updateApplicationStatus(id, status);
      setApplications(
        applications.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } catch (error) {
      console.error('Error updating application status:', error);
      setError('Failed to update application status. Please try again.');
    } finally {
      setUpdatingApplications(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const filteredApplications = applications.filter((application) => {
    const matchesStatus = selectedStatus === 'all' || application.status === selectedStatus;
    const matchesJob =
      !filters.selectedJob || application.job_id === filters.selectedJob;
    const matchesScore =
      (application.ai_score ?? 0) >= filters.aiScoreRange.min &&
      (application.ai_score ?? 0) <= filters.aiScoreRange.max;
    const matchesSkills =
      !filters.skills ||
      application.skills?.some((skill) =>
        skill.toLowerCase().includes(filters.skills.toLowerCase())
      );
    const matchesDate =
      (!filters.dateRange.start ||
        new Date(application.applied_date) >= new Date(filters.dateRange.start)) &&
      (!filters.dateRange.end ||
        new Date(application.applied_date) <= new Date(filters.dateRange.end));
    const matchesPassport = 
      filters.passportStatus === 'all' || 
      (filters.passportStatus === 'has' && application.passport_number) ||
      (filters.passportStatus === 'missing' && !application.passport_number);

    return matchesStatus && matchesJob && matchesScore && matchesSkills && matchesDate && matchesPassport;
  });

  const getStatusCount = (status: ApplicationStatus | 'all') => {
    if (status === 'all') {
      return applications.length;
    }
    return applications.filter(app => app.status === status).length;
  };

  const statusTabs: { value: ApplicationStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Manage Applications</h2>
      
      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading applications...</p>
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
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {statusTabs.map((tab) => {
                const isSelected = selectedStatus === tab.value;
                const count = getStatusCount(tab.value);
                const getStatusColor = (status: ApplicationStatus | 'all') => {
                  switch (status) {
                    case 'pending':
                      return 'yellow';
                    case 'reviewed':
                      return 'blue';
                    case 'accepted':
                      return 'green';
                    case 'rejected':
                      return 'red';
                    default:
                      return 'gray';
                  }
                };
                const color = getStatusColor(tab.value);

                return (
                  <button
                    key={tab.value}
                    onClick={() => setSelectedStatus(tab.value)}
                    className={`
                      group relative min-w-[100px] py-4 px-3 text-center
                      transition-all duration-200 ease-in-out
                      ${isSelected 
                        ? `text-${color}-600 border-b-2 border-${color}-500 font-semibold` 
                        : `text-gray-500 hover:text-${color}-600 border-b-2 border-transparent hover:border-${color}-300`
                      }
                    `}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-sm font-medium">{tab.label}</span>
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        transition-colors duration-200
                        ${isSelected 
                          ? `bg-${color}-100 text-${color}-800` 
                          : `bg-gray-100 text-gray-600 group-hover:bg-${color}-50 group-hover:text-${color}-700`
                        }
                      `}>
                        {count}
                      </span>
                    </div>
                    {isSelected && (
                      <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-${color}-500`} />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <ApplicationFilters
            jobs={jobs}
            filters={filters}
            onFilterChange={setFilters}
            onReset={() =>
              setFilters({
                aiScoreRange: { min: 0, max: 100 },
                dateRange: { start: '', end: '' },
                selectedJob: '',
                skills: '',
                passportStatus: 'all'
              })
            }
          />

          {filteredApplications.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">No applications found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredApplications.map((application) => (
                <div
                  key={application.id}
                  className={`shadow rounded-lg p-6 transition-colors duration-200 ${
                    application.status === 'accepted'
                      ? 'bg-green-50 border border-green-100'
                      : application.status === 'rejected'
                      ? 'bg-gray-50 border border-gray-200'
                      : application.status === 'reviewed'
                      ? 'bg-blue-50 border border-blue-100'
                      : 'bg-yellow-50 border border-yellow-100'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {application.applicant_name}
                      </h3>
                      <p className="text-sm text-gray-500">{application.email}</p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          AI Score: {application.ai_score?.toFixed(0)}%
                        </span>
                        <span className="text-sm text-gray-500">
                          Applied {new Date(application.applied_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {jobs.find(job => job.id === application.job_id)?.title || 'Job not found'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <select
                          className={`input-field w-40 ${
                            updatingApplications.has(application.id)
                              ? 'opacity-50 cursor-not-allowed'
                              : application.status === 'accepted'
                              ? 'bg-white border-green-200'
                              : application.status === 'rejected'
                              ? 'bg-white border-gray-200'
                              : application.status === 'reviewed'
                              ? 'bg-white border-blue-200'
                              : 'bg-white border-yellow-200'
                          }`}
                          value={application.status}
                          onChange={(e) => handleApplicationStatusChange(application.id, e.target.value as ApplicationStatus)}
                          disabled={updatingApplications.has(application.id)}
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        {updatingApplications.has(application.id) && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {application.cover_letter}
                    </p>
                    <button
                      onClick={() => setSelectedApplication(application)}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={!!selectedApplication}
        onClose={() => setSelectedApplication(null)}
        title={selectedApplication ? `${selectedApplication.applicant_name}'s Application` : ''}
      >
        {selectedApplication && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Contact Information</h4>
                <dl className="mt-2 space-y-1">
                  <div>
                    <dt className="text-sm text-gray-500">Phone</dt>
                    <dd className="text-sm text-gray-900">{selectedApplication.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900">{selectedApplication.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Passport Number</dt>
                    <dd className="text-sm text-gray-900">
                      {selectedApplication.passport_number ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {selectedApplication.passport_number}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Not provided
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Skills</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedApplication.skills?.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Cover Letter</h4>
              <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">{selectedApplication.cover_letter}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Documents ({selectedApplication.documents?.length || 0})
              </h4>
              {selectedApplication.documents && selectedApplication.documents.length > 0 ? (
                <div className="mt-2 space-y-2">
                  {selectedApplication.documents.map((document) => (
                    <div 
                      key={document.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {document.document_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {getDocumentTypeLabel(document.document_type)} • Uploaded {new Date(document.uploaded_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <a
                        href={document.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg
                          className="-ml-1 mr-2 h-4 w-4 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-500">No documents uploaded</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
} 