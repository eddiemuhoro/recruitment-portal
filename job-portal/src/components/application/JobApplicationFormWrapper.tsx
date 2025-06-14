import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Job } from '../../types';
import JobApplicationForm from './JobApplicationForm';
import { fetchJobById } from '../../api/jobs';

export default function JobApplicationFormWrapper() {
  const { job_id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        id: Date.now().toString(),
        job_id: job_id as string,
        applicant_name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        cv_url: formData.get('cv_url') as string,
        cover_letter: formData.get('cover_letter') as string,
        status: 'pending' as const,
        applied_date: new Date().toISOString(),
      };
      
      const response = await fetch('https://skyways-five.vercel.app/api/applications/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newApplication),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      alert('Application submitted successfully!');
      window.location.href = '/jobs'; // Redirect to jobs list
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!job) return <div>Job not found</div>;

  return <JobApplicationForm job={job} onSubmit={handleJobApplication} />;
} 