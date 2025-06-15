import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Job } from '../../types';
import JobApplicationForm from './JobApplicationForm';
import { fetchJobById } from '../../api/jobs';
import { createApplication } from '../../api/applications';
import { FaShare, FaBuilding, FaMapMarkerAlt, FaClock, FaMoneyBillWave } from 'react-icons/fa';

export default function JobApplicationFormWrapper() {
  const { job_id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      try {
        if (job_id) {
          const data = await fetchJobById(job_id);
          setJob(data);
        }
      } catch (err) {
        setError('Failed to load job');
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [job_id]);

  const handleJobApplication = async (formData: FormData) => {
    try {
      const newApplication = {
        job_id: job_id as string,
        applicant_name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        cv_url: formData.get('cv_url') as string,
        cover_letter: formData.get('cover_letter') as string,
        status: 'pending' as const,
        applied_date: new Date().toISOString(),
      };
      
      await createApplication(newApplication);
      alert('Application submitted successfully!');
      window.location.href = '/jobs';
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-red-500 text-xl">{error}</div>
    </div>
  );
  
  if (!job) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-gray-500 text-xl">Job not found</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Job Details Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <FaBuilding className="mr-2" />
                  <span>{job.company}</span>
                </div>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors relative"
              >
                <FaShare className="mr-2" />
                Share
                {showShareTooltip && (
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2">
                    Link copied!
                  </span>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-2" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaClock className="mr-2" />
                <span>{job.type}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaMoneyBillWave className="mr-2" />
                <span>{job.salary}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="text-sm text-gray-500">Posted: {new Date(job.posted_date).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <div className="text-gray-700 whitespace-pre-wrap">{job.description}</div>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">Requirements</h2>
              <ul className="list-disc list-inside text-gray-700">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Application Form Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <JobApplicationForm job={job} onSubmit={handleJobApplication} />
          </div>
        </div>
      </div>
    </div>
  );
} 