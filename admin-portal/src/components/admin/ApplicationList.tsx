import { useState, useEffect } from 'react';
import type { JobApplication } from '../../types';
import AIScoreCircle from './AIScoreCircle';

interface ApplicationListProps {
  applications: JobApplication[];
  onStatusChange: (id: string, status: JobApplication['status']) => void;
}

export default function ApplicationList({
  applications,
  onStatusChange,
}: ApplicationListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    console.log('ApplicationList received applications:', applications);
  }, [applications]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

 

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <div
          key={application.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm font-medium">
                      {application.applicant_name.charAt(0)}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {application.applicant_name}
                  </h3>
                  <p className="text-sm text-gray-500">{application.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">AI Score:</span>
                  <AIScoreCircle
                    score={application.ai_score || 0}
                    status={application.status}
                  />
                </div>
                <select
                  value={application.status}
                  onChange={(e) =>
                    onStatusChange(application.id, e.target.value as JobApplication['status'])
                  }
                  className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button
                  onClick={() =>
                    setExpandedId(expandedId === application.id ? null : application.id)
                  }
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className={`h-5 w-5 transform ${
                      expandedId === application.id ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {expandedId === application.id && (
            <div className="border-t border-gray-200 px-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Contact Information</h4>
                  <dl className="mt-2 space-y-1">
                    <div>
                      <dt className="text-sm text-gray-500">Phone</dt>
                      <dd className="text-sm text-gray-900">{application.phone}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Email</dt>
                      <dd className="text-sm text-gray-900">{application.email}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Skills</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {application.skills?.map((skill) => (
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
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900">Cover Letter</h4>
                <p className="mt-2 text-sm text-gray-500">{application.cover_letter}</p>
              </div>
              <div className="mt-4">
                <a
                  href={application.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5 text-gray-400"
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
                  Download CV
                </a>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 