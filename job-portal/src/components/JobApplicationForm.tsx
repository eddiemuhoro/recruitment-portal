import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Job } from '../types';
import { createApplication } from '../api/applications';

interface JobApplicationFormProps {
  job: Job;
}

export default function JobApplicationForm({ job }: JobApplicationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createApplication({
        jobId: job.id,
        applicantName: formData.name,
        email: formData.email,
        phone: formData.phone,
        coverLetter: formData.coverLetter,
        cvUrl: 'placeholder-url', // Replace with actual CV upload logic
        status: 'pending',
        appliedDate: new Date().toISOString(),
      });
      alert('Application submitted successfully!');
    } catch (err) {
      setError('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Apply for {job.title}</h2>
        <p className="mt-1 text-gray-600">{job.company}</p>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          required
          className="input-field mt-1"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          required
          className="input-field mt-1"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          required
          className="input-field mt-1"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="cv" className="block text-sm font-medium text-gray-700">
          CV/Resume
        </label>
        <input
          type="file"
          id="cv"
          accept=".pdf,.doc,.docx"
          required
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          onChange={(e) => setCvFile(e.target.files?.[0] || null)}
        />
      </div>

      <div>
        <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
          Cover Letter
        </label>
        <textarea
          id="coverLetter"
          rows={6}
          required
          className="input-field mt-1"
          value={formData.coverLetter}
          onChange={handleChange}
        />
      </div>

      <div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </form>
  );
} 