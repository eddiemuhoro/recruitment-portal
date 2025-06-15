import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import type { Job } from '../../types';
import { Link } from 'react-router-dom';

interface JobDetailsModalProps {
  job: Job;
  onClose: () => void;
  isOpen?: boolean;
}

export default function JobDetailsModal({ job, onClose }: JobDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Company</h3>
              <p className="text-gray-600">{job.company}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Location</h3>
              <p className="text-gray-600">{job.location}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Job Type</h3>
              <p className="text-gray-600">{job.type}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Salary</h3>
              <p className="text-gray-600">{job.salary}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Description</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{job.description}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Requirements</h3>
              <ul className="list-disc list-inside text-gray-600">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 